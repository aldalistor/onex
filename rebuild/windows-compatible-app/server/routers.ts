import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createInvoice, getDashboard, getMasterData, getWindowCatalog, getWindowDomains, postInvoice, reverseInvoice } from "./db";

const invoiceLine = z.object({ itemId: z.number().int().positive(), quantity: z.string().min(1), unitPrice: z.string().min(1), taxAmount: z.string().default("0") });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  dashboard: publicProcedure.query(() => getDashboard()),
  masterData: publicProcedure.query(() => getMasterData()),
  windows: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), domain: z.string().optional(), limit: z.number().int().min(1).max(500).default(80) }).optional()).query(({ input }) => getWindowCatalog(input?.search, input?.domain, input?.limit ?? 80)),
    domains: publicProcedure.query(() => getWindowDomains()),
  }),
  invoices: router({
    create: publicProcedure.input(z.object({ docNo: z.string().min(1), customerId: z.number().int().positive(), warehouseId: z.number().int().positive(), lines: z.array(invoiceLine).min(1), actor: z.string().default("demo.user") })).mutation(({ input }) => createInvoice(input)),
    post: publicProcedure.input(z.object({ invoiceId: z.number().int().positive(), actor: z.string().default("demo.user") })).mutation(({ input }) => postInvoice(input.invoiceId, input.actor)),
    reverse: publicProcedure.input(z.object({ invoiceId: z.number().int().positive(), actor: z.string().default("demo.user") })).mutation(({ input }) => reverseInvoice(input.invoiceId, input.actor)),
  }),
});

export type AppRouter = typeof appRouter;
