import { randomUUID } from "node:crypto";

export type OracleBridgeRequest = {
  legacyForm: string;
  action: string;
  payload?: Record<string, unknown>;
  coreApi?: string;
  procedures?: string[];
  actor?: string;
};

export type OracleBridgeResult = {
  ok: boolean;
  mode: "SAFE_SIMULATION" | "ORACLE_BRIDGE";
  requestId: string;
  legacyForm: string;
  action: string;
  message: string;
  result?: unknown;
};

const mode = () => process.env.ONEX_ORACLE_EXECUTION_MODE === "bridge" ? "bridge" : "simulation";
const bridgeUrl = () => process.env.ORACLE_BRIDGE_URL?.replace(/\/$/, "");

export function getOracleBridgeStatus() {
  return { executionMode: mode(), configured: Boolean(bridgeUrl()), url: bridgeUrl() ? "configured" : "not-configured", timeoutMs: Number(process.env.ORACLE_BRIDGE_TIMEOUT_MS || 8000) };
}

export async function executeOracleAction(request: OracleBridgeRequest): Promise<OracleBridgeResult> {
  const requestId = randomUUID();
  const url = bridgeUrl();
  if (mode() !== "bridge") {
    return { ok: true, mode: "SAFE_SIMULATION", requestId, legacyForm: request.legacyForm, action: request.action, message: `تم تسجيل طلب ${request.action} في سجل التشغيل التجريبي. يتطلب التنفيذ الفعلي تفعيل ONEX_ORACLE_EXECUTION_MODE=bridge.` };
  }
  if (!url) throw new Error("ORACLE_BRIDGE_NOT_CONFIGURED");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.ORACLE_BRIDGE_TIMEOUT_MS || 8000));
  try {
    const response = await fetch(`${url}/v1/forms/action`, { method: "POST", headers: { "content-type": "application/json", ...(process.env.ORACLE_BRIDGE_TOKEN ? { authorization: `Bearer ${process.env.ORACLE_BRIDGE_TOKEN}` } : {}) }, body: JSON.stringify({ ...request, requestId }), signal: controller.signal });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`ORACLE_BRIDGE_HTTP_${response.status}`);
    return { ok: true, mode: "ORACLE_BRIDGE", requestId, legacyForm: request.legacyForm, action: request.action, message: "تم تنفيذ الإجراء عبر Oracle Bridge.", result: body };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new Error("ORACLE_BRIDGE_TIMEOUT");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
