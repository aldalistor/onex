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
      });
    }
  });
});
