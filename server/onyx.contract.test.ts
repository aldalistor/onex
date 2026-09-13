import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

describe("Onyx rebuild contracts", () => {
  it("exposes the dashboard and legacy window explorer", async () => {
    const caller = appRouter.createCaller(ctx);
    const dashboard = await caller.dashboard();
    const windows = await caller.windows.list({ limit: 5 });
    expect(dashboard.windows).toBeGreaterThanOrEqual(0);
    expect(dashboard.domains).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(windows)).toBe(true);
  });

  it("accepts only complete ARST004 invoice lines", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.invoices.create({ docNo: "TEST", customerId: 1, warehouseId: 1, lines: [], actor: "test" })).rejects.toBeTruthy();
  });

  it("keeps the full-catalog UI contract bounded for responsive search", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.windows.list({ search: "ARST004", domain: "AR", limit: 80 });
    expect(result.length).toBeLessThanOrEqual(80);
  });

  it("exposes a hierarchical system tree with screen contract fields", async () => {
    const caller = appRouter.createCaller(ctx);
    const tree = await caller.windows.tree();
    expect(Array.isArray(tree)).toBe(true);
    if (tree.length > 0 && tree[0].groups.length > 0 && tree[0].groups[0].windows.length > 0) {
      expect(tree[0].groups[0].windows[0]).toMatchObject({
        screenNo: expect.any(String),
        screenName: expect.any(String),
        systemNo: "ONEX",
        itemType: "FORM",
        formName: expect.any(String),
        displayOrder: expect.any(Number),
        userPermission: expect.any(String),
        companyBranchPermission: expect.any(String),
        rebuildLevel: expect.any(String),
        sourceStatus: expect.any(String),
        observedProcedures: expect.any(Number),
        observedTriggers: expect.any(Number),
        specPath: expect.any(String),
      });
    }
  });

  it("keeps the full legacy catalog available without a configured database", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard();
    expect(result.windows).toBeGreaterThanOrEqual(1459);
    const all = await caller.windows.list({ limit: 500 });
    expect(all.length).toBe(500);
    const tree = await caller.windows.tree();
    expect(tree.reduce((total: number, branch: any) => total + branch.windows, 0)).toBeGreaterThanOrEqual(1459);
    const sources = await caller.windows.sources();
    expect(sources.catalogCount).toBe(1490);
    expect(sources.specificationCount).toBe(1490);
    expect(sources.sourceFiles).toContain("database-source/nodes_catalog_links.csv");
    expect(sources.midoIntegration.repository).toBe("aldalistor/mido");
    expect(sources.midoIntegration.formsInventoryCount).toBe(1490);
    expect(sources.midoIntegration.oracleTablesImported).toBe(936);
  });

  it("builds a runtime contract for every selected legacy form", async () => {
    const caller = appRouter.createCaller(ctx);
    const contract = await caller.windows.contract({ legacyForm: "ERP_LOGIN.fmx" });
    expect(contract.legacyForm).toBe("ERP_LOGIN.fmx");
    expect(contract.source.manifest).toBe(true);
    expect(contract.actions.length).toBeGreaterThan(5);
    expect(contract.midoModules.length).toBeGreaterThan(0);
    expect(contract.specificationPath).toContain("all_window_specs");
  });

  it("executes only declared window actions in safe simulation mode", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.windows.executeAction({ legacyForm: "ERP_LOGIN.fmx", action: "query" });
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("SAFE_SIMULATION");
    await expect(caller.windows.executeAction({ legacyForm: "ERP_LOGIN.fmx", action: "drop_database" })).rejects.toBeTruthy();
  });

  it("routes the next FMX batch to database-backed record queries", async () => {
    const caller = appRouter.createCaller(ctx);
    for (const legacyForm of ["GLST005", "GLST006", "ARST006", "APST005", "INVT004", "POST001"]) {
      const rows = await caller.windows.records({ legacyForm, limit: 10 });
      expect(Array.isArray(rows)).toBe(true);
    }
  });

  it("persists a balanced journal through the window contract mutation", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.windows.saveJournal({ journalNo: `FMX-BATCH-${Date.now()}`, entryType: "GLST005", actor: "contract.test", lines: [{ accountCode: "1100", debit: "25", credit: "0" }, { accountCode: "4100", debit: "0", credit: "25" }] });
    expect(result.status).toBe("POSTED");
    expect(result.totalDebit).toBe("25.000000");
    expect(result.totalCredit).toBe("25.000000");
  });

  it("routes reports and administration windows to database-backed readers", async () => {
    const caller = appRouter.createCaller(ctx);
    for (const legacyForm of ["GLSR001", "ARSR041", "MRPREP001", "ADMT027"]) {
      const rows = await caller.windows.records({ legacyForm, limit: 10 });
      expect(Array.isArray(rows)).toBe(true);
    }
    const report = await caller.reports.run({ reportCode: "MRPREP001", limit: 10 });
    expect(report.reportCode).toBe("MRPREP001");
    expect(report.columns).toContain("totalCost");
  });

  it("supports demo atomic create, post, and reversal lifecycle", async () => {
    const caller = appRouter.createCaller(ctx);
    const created = await caller.invoices.create({ docNo: `ATOMIC-${Date.now()}`, customerId: 1, warehouseId: 1, actor: "test", lines: [{ itemId: 1, quantity: "2", unitPrice: "100", taxAmount: "15" }] });
    expect(created.status).toBe("DRAFT");
    const posted = await caller.invoices.post({ invoiceId: created.invoiceId, actor: "test" });
    expect(posted.status).toBe("POSTED");
    const reversed = await caller.invoices.reverse({ invoiceId: created.invoiceId, actor: "test" });
    expect(reversed.status).toBe("REVERSED");
  });
});
