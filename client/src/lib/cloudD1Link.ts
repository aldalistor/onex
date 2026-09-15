import { observable } from "@trpc/server/observable";
import type { Operation, TRPCLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

type CloudResponse = { data?: unknown; error?: { message?: string } };

const request = async (path: string, method: "GET" | "POST", input?: unknown) => {
  const url = new URL(`/api/cloud${path}`, window.location.origin);
  let body: BodyInit | undefined;
  if (method === "GET" && input && typeof input === "object") {
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  } else if (method === "POST") body = JSON.stringify(input ?? {});
  const response = await fetch(url, { method, body, credentials: "include", headers: { "content-type": "application/json" } });
  const payload = (await response.json().catch(() => ({}))) as CloudResponse;
  if (!response.ok) throw new Error(payload.error?.message || `Cloud API error (${response.status})`);
  return payload.data ?? payload;
};

const mapOperation = (op: Operation) => {
  const input = op.input as Record<string, unknown> | undefined;
  switch (op.path) {
    case "auth.me": return ["/auth/me", "GET"] as const;
    case "auth.logout": return ["/auth/logout", "POST"] as const;
    case "dashboard": return ["/dashboard", "GET"] as const;
    case "masterData": return ["/master-data", "GET"] as const;
    case "windows.list": return ["/windows", "GET"] as const;
    case "windows.tree": return ["/windows/tree", "GET"] as const;
    case "windows.contract": return [`/windows/contract/${encodeURIComponent(String(input?.legacyForm || ""))}`, "GET"] as const;
    case "windows.records": return ["/windows/records", "GET"] as const;
    case "windows.saveCustomer": return ["/customers", "POST"] as const;
    case "windows.saveSupplier": return ["/suppliers", "POST"] as const;
    case "windows.saveItem": return ["/items", "POST"] as const;
    case "windows.saveJournal": return ["/journals", "POST"] as const;
    case "windows.executeAction": return ["/windows/action", "POST"] as const;
    case "invoices.create": return ["/invoices", "POST"] as const;
    case "invoices.post": return [`/invoices/${encodeURIComponent(String(input?.invoiceId || ""))}?action=post`, "POST"] as const;
    case "invoices.reverse": return [`/invoices/${encodeURIComponent(String(input?.invoiceId || ""))}?action=reverse`, "POST"] as const;
    case "ai.assist": return ["/ai/assist", "POST"] as const;
    default: throw new Error(`Cloud D1 procedure is not mapped: ${op.path}`);
  }
};

const mapInput = (op: Operation) => {
  const input = (op.input ?? {}) as Record<string, unknown>;
  if (op.path === "windows.saveItem" && input.description && !input.name) return { ...input, name: input.description };
  return input;
};

const mapOutput = (op: Operation, data: unknown) => {
  if (op.path === "invoices.create" && data && typeof data === "object") {
    const result = (data as { result?: Array<{ meta?: { last_row_id?: number } }> }).result;
    return { docNo: (op.input as { docNo?: string })?.docNo, invoiceId: result?.[0]?.meta?.last_row_id ?? 0 };
  }
  return data;
};

export const cloudD1Link: TRPCLink<AppRouter> = () => ({ op }: { op: Operation }) => {
    return observable((observer) => {
      void (async () => {
        try {
          const [path, method] = mapOperation(op);
          const data = await request(path, method, mapInput(op));
          observer.next({ result: { data: mapOutput(op, data) } } as never);
          observer.complete();
        } catch (error) {
          observer.error(error as never);
        }
      })();
    });
  };
