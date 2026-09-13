import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

describe("Oracle/FM X bridge", () => {
  it("reports safe simulation by default", async () => {
    const api = appRouter.createCaller(ctx);
    const status = await api.oracle.status();
    expect(status.executionMode).toBe("simulation");
    const result = await api.windows.executeAction({ legacyForm: "GLST001.fmx", action: "query" });
    expect(result.mode).toBe("SAFE_SIMULATION");
    expect(result.requestId).toBeTruthy();
  });
});
