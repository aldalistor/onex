import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

describe("ERP control and inventory flows", () => {
  it("exposes branches, accounts, and open fiscal periods", async () => {
    const data = await appRouter.createCaller(ctx).controlData();
    expect(data.branches.length).toBeGreaterThan(0);
    expect(data.accounts.some((account) => account.code === "4100")).toBe(true);
    expect(data.fiscalPeriods.some((period) => period.status === "OPEN")).toBe(true);
  });

  it("creates a balanced account and receives stock", async () => {
    const api = appRouter.createCaller(ctx);
    const account = await api.windows.saveAccount({ code: `TEST-${Date.now()}`, name: "حساب اختبار", accountType: "ASSET" });
    expect(account?.code).toContain("TEST-");
    const receipt = await api.inventory.receive({ itemId: 1, warehouseId: 1, quantity: "3", unitCost: "50", reference: `GRN-${Date.now()}` });
    expect(receipt.status).toBe("RECEIVED");
  });
});
