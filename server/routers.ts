import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { createInvoice, getCatalogSources, getDashboard, getMasterData, getSystemTree, getWindowCatalog, getWindowDomains, postInvoice, reverseInvoice } from "./db";

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
    tree: publicProcedure.query(() => getSystemTree()),
    sources: publicProcedure.query(() => getCatalogSources()),
  }),
  ai: router({
    assist: publicProcedure.input(z.object({
      question: z.string().min(1).max(4000),
      window: z.string().optional(),
      context: z.string().optional(),
    })).mutation(async ({ input }) => {
      const system = `أنت المساعد العصبي لنظام ONEX ERP المتوافق مع Onyx القديم. أجب بالعربية باختصار وبدقة. لا تخترع بيانات محاسبية أو صلاحيات أو ترحيلات مؤكدة؛ ميّز بين المؤكد من الكتالوج والمستنتج. النافذة الحالية: ${input.window || "غير محددة"}. سياق الشاشة: ${input.context || "لا يوجد"}.`;
      try {
        const result = await invokeLLM({ model: "gpt-5-mini", maxTokens: 700, messages: [{ role: "system", content: system }, { role: "user", content: input.question }] });
        const content = result.choices[0]?.message?.content;
        return { answer: typeof content === "string" ? content : "لم أتمكن من توليد إجابة نصية." };
      } catch {
        return { answer: "المساعد يعمل في وضع محلي. راجع عقد النافذة والحقول والأدلة المطلوبة قبل تنفيذ أي ترحيل." };
      }
    }),
  }),
  invoices: router({
    create: publicProcedure.input(z.object({ docNo: z.string().min(1), customerId: z.number().int().positive(), warehouseId: z.number().int().positive(), lines: z.array(invoiceLine).min(1), actor: z.string().default("demo.user") })).mutation(({ input }) => createInvoice(input)),
    post: publicProcedure.input(z.object({ invoiceId: z.number().int().positive(), actor: z.string().default("demo.user") })).mutation(({ input }) => postInvoice(input.invoiceId, input.actor)),
    reverse: publicProcedure.input(z.object({ invoiceId: z.number().int().positive(), actor: z.string().default("demo.user") })).mutation(({ input }) => reverseInvoice(input.invoiceId, input.actor)),
  }),
});

export type AppRouter = typeof appRouter;
