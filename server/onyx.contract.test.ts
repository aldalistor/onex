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
