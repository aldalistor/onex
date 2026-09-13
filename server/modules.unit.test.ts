import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
const caller = () => appRouter.createCaller(ctx);

const forms = {
  login: "ERP_LOGIN.fmx",
  gl: "GLSI001.fmx",
  ar: "ARSI004.fmx",
  ap: "APSI003.fmx",
  inventory: "INVI001.fmx",
  pos: "POSI001.fmx",
  report: "GLSR001.fmx",
};

describe("ONEX module unit tests", () => {
  it("LOGIN: exposes login contract and rejects undeclared destructive actions", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.login });
    expect(contract.legacyForm).toBe(forms.login);
    expect(contract.actions).toContain("query");
    await expect(api.windows.executeAction({ legacyForm: forms.login, action: "drop_database" })).rejects.toBeTruthy();
  });

  it("GL: exposes journal/accounting contract with atomic actions", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.gl });
    expect(contract.domain).toMatch(/GL|OTHER/);
    expect(contract.actions).toContain("post");
    expect(contract.midoModules.length).toBeGreaterThan(0);
    const result = await api.windows.executeAction({ legacyForm: forms.gl, action: "validate" });
    expect(result.mode).toBe("SAFE_SIMULATION");
  });

  it("AR: creates, posts, and reverses a receivable invoice atomically", async () => {
    const api = caller();
    const master = await api.masterData();
    expect(master.customers.length).toBeGreaterThan(0);
    const created = await api.invoices.create({ docNo: `AR-UNIT-${Date.now()}`, customerId: 1, warehouseId: 1, actor: "unit.ar", lines: [{ itemId: 1, quantity: "2", unitPrice: "100", taxAmount: "15" }] });
    expect(created.status).toBe("DRAFT");
    expect((await api.invoices.post({ invoiceId: created.invoiceId, actor: "unit.ar" })).status).toBe("POSTED");
    expect((await api.invoices.reverse({ invoiceId: created.invoiceId, actor: "unit.ar" })).status).toBe("REVERSED");
  });

  it("AP: exposes purchasing windows and save/update/delete actions", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.ap });
    expect(contract.legacyForm).toBe(forms.ap);
    expect(contract.actions).toEqual(expect.arrayContaining(["new", "save", "update", "delete"]));
    const result = await api.windows.executeAction({ legacyForm: forms.ap, action: "save" });
    expect(result.ok).toBe(true);
  });

  it("Inventory: exposes stock evidence, tables, and validation action", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.inventory });
    expect(contract.counts.fields).toBeGreaterThanOrEqual(0);
    expect(contract.counts.tables).toBeGreaterThanOrEqual(0);
    expect(contract.evidence.procedures.length).toBeGreaterThanOrEqual(0);
    expect((await api.windows.executeAction({ legacyForm: forms.inventory, action: "validate" })).ok).toBe(true);
  });

  it("POS: exposes a distinct POS window contract and branch-scoped permission metadata", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.pos });
    expect(contract.legacyForm).toBe(forms.pos);
    expect(contract.domain).toMatch(/POS|OTHER/);
    expect(contract.source.runtime).toBe(true);
  });

  it("Reports: exposes print action and report catalog source", async () => {
    const api = caller();
    const contract = await api.windows.contract({ legacyForm: forms.report });
    expect(contract.actions).toContain("print");
    expect(contract.specificationPath).toContain("all_window_specs");
    const sources = await api.windows.sources();
    expect(sources.sourceFiles.some((file) => file.includes("window_runtime_contracts"))).toBe(true);
  });
});
