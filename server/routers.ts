import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { createInvoice, getCatalogSources, getDashboard, getFinancialReportCatalog, getMasterData, getSystemTree, getWindowCatalog, getWindowContract, getWindowDomains, postInvoice, reverseInvoice, runFinancialReport, saveCustomer, saveItem, saveJournal, saveSupplier, searchCustomers, searchInvoices, searchItems, searchJournals, searchSuppliers, searchSystemUsers } from "./db";

const invoiceLine = z.object({ itemId: z.number().int().positive(), quantity: z.string().min(1), unitPrice: z.string().min(1), taxAmount: z.string().default("0") });
const partyInput = z.object({ id: z.number().int().positive().optional(), companyId: z.number().int().positive().default(1), code: z.string().min(1).max(50), legalName: z.string().min(1).max(250), currencyCode: z.string().length(3).default("SAR"), status: z.enum(["ACTIVE", "BLOCKED", "CLOSED"]).default("ACTIVE") });
const itemInput = z.object({ id: z.number().int().positive().optional(), companyId: z.number().int().positive().default(1), code: z.string().min(1).max(80), description: z.string().min(1).max(500), stockFlag: z.number().int().min(0).max(1).default(1), unitCost: z.string().default("0"), revenueAccount: z.string().default("4100"), inventoryAccount: z.string().default("1300"), cogsAccount: z.string().default("5100"), active: z.number().int().min(0).max(1).default(1) });
const journalLine = z.object({ accountCode: z.string().min(1).max(80), accountName: z.string().max(240).optional(), description: z.string().max(500).optional(), debit: z.string().default("0"), credit: z.string().default("0") });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  dashboard: publicProcedure.query(() => getDashboard()),
  masterData: publicProcedure.query(() => getMasterData()),
  reports: router({
    catalog: publicProcedure.query(() => getFinancialReportCatalog()),
    run: publicProcedure.input(z.object({ reportCode: z.enum(["GLSR001", "ARSR041", "MRPREP001"]), search: z.string().optional(), limit: z.number().int().min(1).max(500).default(100) })).query(({ input }) => runFinancialReport(input)),
  }),
  windows: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), domain: z.string().optional(), limit: z.number().int().min(1).max(500).default(80) }).optional()).query(({ input }) => getWindowCatalog(input?.search, input?.domain, input?.limit ?? 80)),
    domains: publicProcedure.query(() => getWindowDomains()),
    tree: publicProcedure.query(() => getSystemTree()),
    sources: publicProcedure.query(() => getCatalogSources()),
    contract: publicProcedure.input(z.object({ legacyForm: z.string().min(1).max(160) })).query(({ input }) => getWindowContract(input.legacyForm)),
    records: publicProcedure.input(z.object({ legacyForm: z.string().min(1).max(160), search: z.string().optional(), limit: z.number().int().min(1).max(100).default(20) })).query(({ input }): Promise<any[]> => {
      const form = input.legacyForm.replace(/\.fmx$/i, "").toUpperCase();
      if (["GLSR001", "ARSR041", "MRPREP001"].includes(form)) return runFinancialReport({ reportCode: form, search: input.search, limit: input.limit }).then((result) => result.rows);
      if (form === "ADMT027") return searchSystemUsers(input.search, input.limit);
      if (form.startsWith("ARST004")) return searchInvoices(input.search, input.limit);
      if (form.startsWith("ARST") || form.startsWith("ARSR")) return searchCustomers(input.search, input.limit);
      if (form.startsWith("APST") || form.startsWith("APSR")) return searchSuppliers(input.search, input.limit);
      if (form.startsWith("INVT") || form.startsWith("INVI")) return searchItems(input.search, input.limit);
      if (form.startsWith("POST")) return searchInvoices(input.search, input.limit);
      if (form.startsWith("GLST") || form.startsWith("GLSI") || form.startsWith("GLSR")) return searchJournals(input.search, input.limit);
      return Promise.resolve([]);
    }),
    saveCustomer: publicProcedure.input(partyInput).mutation(({ input }) => saveCustomer(input)),
    saveSupplier: publicProcedure.input(partyInput).mutation(({ input }) => saveSupplier(input)),
    saveItem: publicProcedure.input(itemInput).mutation(({ input }) => saveItem(input)),
    saveJournal: publicProcedure.input(z.object({ journalNo: z.string().min(1).max(80), entryType: z.string().min(1).max(40), actor: z.string().default("workbench.user"), lines: z.array(journalLine).min(2) })).mutation(({ input }) => saveJournal(input)),
    executeAction: publicProcedure.input(z.object({ legacyForm: z.string().min(1).max(160), action: z.string().min(1).max(80) })).mutation(async ({ input }) => {
      const contract = await getWindowContract(input.legacyForm);
      if (!contract.actions.includes(input.action)) throw new Error("ACTION_NOT_ALLOWED_FOR_WINDOW");
      return { ok: true, mode: "SAFE_SIMULATION", legacyForm: contract.legacyForm, action: input.action, message: `تم تسجيل طلب ${input.action} في سجل التشغيل التجريبي. يتطلب التنفيذ الفعلي اتصال Oracle وصلاحية معتمدة.` };
    }),
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
