import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import { parse as parseCookie } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import type { User } from "../../drizzle/schema";

const LOCAL_COOKIE = "onex_local_session";
const sessions = new Map<string, User>();

const localAuthEnabled = () => process.env.ENABLE_LOCAL_AUTH === "true";

const configuredUsername = () => process.env.LOCAL_AUTH_USERNAME || "administrator";
const configuredPassword = () => process.env.LOCAL_AUTH_PASSWORD || "onex-local";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getUser(): User {
  const now = new Date();
  return {
    id: 1,
    openId: `local:${configuredUsername()}`,
    email: `${configuredUsername()}@local.onex`,
    name: "مدير النظام",
    loginMethod: "local",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export function getLocalUser(req: Request): User | null {
  if (!localAuthEnabled()) return null;
  const token = parseCookie(req.headers.cookie ?? "")[LOCAL_COOKIE];
  return token ? sessions.get(token) ?? null : null;
}

export function registerLocalAuthRoutes(app: Express) {
  app.get("/api/local-auth/config", (_req, res) => {
    res.json({ enabled: localAuthEnabled(), username: localAuthEnabled() ? configuredUsername() : null });
  });

  app.post("/api/local-auth/login", (req: Request, res: Response) => {
    if (!localAuthEnabled()) {
      res.status(404).json({ error: "LOCAL_AUTH_DISABLED" });
      return;
    }
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string" || !safeEqual(username, configuredUsername()) || !safeEqual(password, configuredPassword())) {
      res.status(401).json({ error: "INVALID_CREDENTIALS" });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, getUser());
    res.cookie(LOCAL_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 1000 * 60 * 60 * 8 });
    res.json({ success: true, user: getUser() });
  });

  app.post("/api/local-auth/logout", (req: Request, res: Response) => {
    const token = parseCookie(req.headers.cookie ?? "")[LOCAL_COOKIE];
    if (token) sessions.delete(token);
    res.clearCookie(LOCAL_COOKIE, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    res.json({ success: true });
  });

  app.get("/api/local-auth/me", (req, res) => {
    const user = getLocalUser(req);
    res.status(user ? 200 : 401).json(user ?? { error: "UNAUTHENTICATED" });
  });
}

export { LOCAL_COOKIE };
