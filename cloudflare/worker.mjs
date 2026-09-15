const ORIGIN = "https://onexdash-oyedvqsk.manus.space";
const json = (data, status = 200) => Response.json(data, { status, headers: { "cache-control": "no-store", "x-onex-deployment": "cloudflare-worker", "access-control-allow-origin": "*" } });
const body = async (request) => { try { return await request.json(); } catch { return {}; } };

async function d1Api(request, env, url) {
  if (url.pathname === "/api/cloud/health") {
    const result = await env.ONEX_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
    return json({ ok: true, service: "onex-d1-api", database: "onex-production", tables: result.results?.map((row) => row.name) ?? [] });
  }
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type,authorization" } });
  if (url.pathname === "/api/cloud/master-data") {
    const [companies, branches, warehouses, roles, periods] = await Promise.all([
      env.ONEX_DB.prepare("SELECT * FROM companies ORDER BY id").all(),
      env.ONEX_DB.prepare("SELECT * FROM branches WHERE active=1 ORDER BY code").all(),
      env.ONEX_DB.prepare("SELECT * FROM warehouses WHERE active=1 ORDER BY code").all(),
      env.ONEX_DB.prepare("SELECT * FROM roles WHERE active=1 ORDER BY code").all(),
      env.ONEX_DB.prepare("SELECT * FROM fiscal_periods ORDER BY startsOn DESC").all(),
    ]);
    return json({ companies: companies.results, branches: branches.results, warehouses: warehouses.results, roles: roles.results, fiscalPeriods: periods.results });
  }
  if (url.pathname === "/api/cloud/accounts" && request.method === "GET") {
    const q = (url.searchParams.get("search") || "").trim();
    const result = q ? await env.ONEX_DB.prepare("SELECT * FROM accounts WHERE code LIKE ? OR name LIKE ? ORDER BY code LIMIT 100").bind(`%${q}%`, `%${q}%`).all() : await env.ONEX_DB.prepare("SELECT * FROM accounts ORDER BY code LIMIT 100").all();
    return json(result.results);
  }
  if (url.pathname === "/api/cloud/accounts" && request.method === "POST") {
    const input = await body(request);
    if (!input.code || !input.name || !input.accountType) return json({ error: "code, name, and accountType are required" }, 400);
    const result = await env.ONEX_DB.prepare("INSERT INTO accounts(companyId,code,name,accountType,parentCode,currencyCode,active) VALUES(?,?,?,?,?,?,?) ON CONFLICT(companyId,code) DO UPDATE SET name=excluded.name, accountType=excluded.accountType, parentCode=excluded.parentCode, currencyCode=excluded.currencyCode, active=excluded.active").bind(input.companyId || 1, input.code, input.name, input.accountType, input.parentCode || null, input.currencyCode || "SAR", input.active ?? 1).run();
    return json({ ok: true, result });
  }
  if (url.pathname === "/api/cloud/items" && request.method === "GET") {
    const q = (url.searchParams.get("search") || "").trim();
    const result = q ? await env.ONEX_DB.prepare("SELECT * FROM items WHERE code LIKE ? OR name LIKE ? ORDER BY code LIMIT 100").bind(`%${q}%`, `%${q}%`).all() : await env.ONEX_DB.prepare("SELECT * FROM items ORDER BY code LIMIT 100").all();
    return json(result.results);
  }
  if (url.pathname === "/api/cloud/customers" && request.method === "GET") {
    const q = (url.searchParams.get("search") || "").trim();
    const result = q ? await env.ONEX_DB.prepare("SELECT * FROM customers WHERE code LIKE ? OR legalName LIKE ? ORDER BY code LIMIT 100").bind(`%${q}%`, `%${q}%`).all() : await env.ONEX_DB.prepare("SELECT * FROM customers ORDER BY code LIMIT 100").all();
    return json(result.results);
  }
  if (url.pathname === "/api/cloud/reports/inventory") {
    const result = await env.ONEX_DB.prepare("SELECT itemId,warehouseId,quantity,unitCost,totalCost FROM stock_balances ORDER BY itemId LIMIT 100").all();
    return json({ reportCode: "MRPREP001", title: "Inventory valuation", columns: ["itemId", "warehouseId", "quantity", "unitCost", "totalCost"], rows: result.results });
  }
  if (url.pathname === "/api/cloud/reports/accounts") {
    const result = await env.ONEX_DB.prepare("SELECT code,name,accountType,currencyCode,active FROM accounts ORDER BY code").all();
    return json({ reportCode: "GLST001", title: "Chart of accounts", columns: ["code", "name", "accountType", "currencyCode", "active"], rows: result.results });
  }
  return json({ error: "Cloud D1 route not found" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/cloud/")) return d1Api(request, env, url);
    if (url.pathname === "/__health") return d1Api(request, env, new URL(url.origin + "/api/cloud/health"));
    const origin = new URL(ORIGIN);
    origin.pathname = url.pathname;
    origin.search = url.search;
    const headers = new Headers(request.headers);
    headers.set("x-onex-cloudflare-preview", "onex-workbench");
    const proxied = new Request(origin, { method: request.method, headers, body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body, redirect: "follow" });
    const response = await fetch(proxied);
    const output = new Response(response.body, response);
    output.headers.set("x-onex-deployment", "cloudflare-worker");
    output.headers.set("x-onex-d1-binding", "ONEX_DB");
    output.headers.set("x-content-type-options", "nosniff");
    output.headers.set("x-frame-options", "DENY");
    output.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    return output;
  },
};
