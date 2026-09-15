const ORIGIN = "https://onexdash-oyedvqsk.manus.space";
const json = (data, status = 200) => Response.json(data, { status, headers: { "cache-control": "no-store", "x-onex-deployment": "cloudflare-worker", "access-control-allow-origin": "*" } });
const readBody = async (request) => { try { return await request.json(); } catch { return {}; } };
const limitOf = (url) => Math.min(Number(url.searchParams.get("limit") || 100), 200);

async function api(request, env, url) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type,authorization" } });
  if (url.pathname === "/api/cloud/health") {
    const result = await env.ONEX_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
    return json({ ok: true, service: "onex-d1-api", database: "onex-production", tables: result.results?.map((row) => row.name) ?? [] });
  }
  if (url.pathname === "/api/cloud/master-data") {
    const [companies, branches, warehouses, roles, periods] = await Promise.all([
      env.ONEX_DB.prepare("SELECT * FROM companies ORDER BY id").all(), env.ONEX_DB.prepare("SELECT * FROM branches WHERE active=1 ORDER BY code").all(), env.ONEX_DB.prepare("SELECT * FROM warehouses WHERE active=1 ORDER BY code").all(), env.ONEX_DB.prepare("SELECT * FROM roles WHERE active=1 ORDER BY code").all(), env.ONEX_DB.prepare("SELECT * FROM fiscal_periods ORDER BY startsOn DESC").all(),
    ]);
    return json({ companies: companies.results, branches: branches.results, warehouses: warehouses.results, roles: roles.results, fiscalPeriods: periods.results });
  }
  if (url.pathname === "/api/cloud/accounts" && request.method === "GET") {
    const q = (url.searchParams.get("search") || "").trim(); const lim = limitOf(url);
    const r = q ? await env.ONEX_DB.prepare("SELECT * FROM accounts WHERE code LIKE ? OR name LIKE ? ORDER BY code LIMIT ?").bind(`%${q}%`, `%${q}%`, lim).all() : await env.ONEX_DB.prepare("SELECT * FROM accounts ORDER BY code LIMIT ?").bind(lim).all();
    return json(r.results);
  }
  if (url.pathname === "/api/cloud/accounts" && request.method === "POST") {
    const x = await readBody(request); if (!x.code || !x.name || !x.accountType) return json({ error: "code, name, and accountType are required" }, 400);
    const r = await env.ONEX_DB.prepare("INSERT INTO accounts(companyId,code,name,accountType,parentCode,currencyCode,active) VALUES(?,?,?,?,?,?,?) ON CONFLICT(companyId,code) DO UPDATE SET name=excluded.name,accountType=excluded.accountType,parentCode=excluded.parentCode,currencyCode=excluded.currencyCode,active=excluded.active").bind(x.companyId || 1, x.code, x.name, x.accountType, x.parentCode || null, x.currencyCode || "SAR", x.active ?? 1).run(); return json({ ok: true, result: r });
  }
  const collection = { items: ["items", "code", "name"], customers: ["customers", "code", "legalName"], suppliers: ["suppliers", "code", "legalName"] };
  for (const [route, [table, codeField, nameField]] of Object.entries(collection)) {
    if (url.pathname === `/api/cloud/${route}` && request.method === "GET") {
      const q = (url.searchParams.get("search") || "").trim(); const lim = limitOf(url); const sql = q ? `SELECT * FROM ${table} WHERE code LIKE ? OR ${nameField} LIKE ? ORDER BY code LIMIT ?` : `SELECT * FROM ${table} ORDER BY code LIMIT ?`;
      const r = q ? await env.ONEX_DB.prepare(sql).bind(`%${q}%`, `%${q}%`, lim).all() : await env.ONEX_DB.prepare(sql).bind(lim).all(); return json(r.results);
    }
    if (url.pathname === `/api/cloud/${route}` && request.method === "POST") {
      const x = await readBody(request); if (!x.code || !x[nameField]) return json({ error: `code and ${nameField} are required` }, 400);
      const sql = table === "items" ? "INSERT INTO items(companyId,code,name,itemType,unitCode,active) VALUES(?,?,?,?,?,?) ON CONFLICT(companyId,code) DO UPDATE SET name=excluded.name,itemType=excluded.itemType,unitCode=excluded.unitCode,active=excluded.active" : `INSERT INTO ${table}(companyId,code,legalName,currencyCode,status) VALUES(?,?,?,?,?) ON CONFLICT(companyId,code) DO UPDATE SET legalName=excluded.legalName,currencyCode=excluded.currencyCode,status=excluded.status`;
      const values = table === "items" ? [x.companyId || 1, x.code, x[nameField], x.itemType || "STOCK", x.unitCode || "EA", x.active ?? 1] : [x.companyId || 1, x.code, x[nameField], x.currencyCode || "SAR", x.status || "ACTIVE"];
      return json({ ok: true, result: await env.ONEX_DB.prepare(sql).bind(...values).run() });
    }
  }
  if (url.pathname === "/api/cloud/journals" && request.method === "GET") { const r = await env.ONEX_DB.prepare("SELECT * FROM journal_entries ORDER BY createdAt DESC LIMIT ?").bind(limitOf(url)).all(); return json(r.results); }
  if (url.pathname === "/api/cloud/journals" && request.method === "POST") {
    const x = await readBody(request); if (!x.journalNo || !Array.isArray(x.lines) || !x.lines.length) return json({ error: "journalNo and lines are required" }, 400);
    const debit = x.lines.reduce((n, l) => n + Number(l.debit || 0), 0).toFixed(6); const credit = x.lines.reduce((n, l) => n + Number(l.credit || 0), 0).toFixed(6); if (debit !== credit) return json({ error: "journal is not balanced", debit, credit }, 400);
    const batch = [{ sql: "INSERT INTO journal_entries(journalNo,entryType,totalDebit,totalCredit,status) VALUES(?,?,?,?,?)", params: [x.journalNo, x.entryType || "MANUAL", debit, credit, "POSTED"] }, ...x.lines.map((l) => ({ sql: "INSERT INTO journal_entry_lines(journalEntryId,accountCode,accountName,description,debit,credit) VALUES((SELECT id FROM journal_entries WHERE journalNo=?),?,?,?,?,?)", params: [x.journalNo, l.accountCode, l.accountName || null, l.description || null, l.debit || "0", l.credit || "0"] }))];
    return json({ ok: true, result: await env.ONEX_DB.batch(batch) });
  }
  if (url.pathname === "/api/cloud/stock/receive" && request.method === "POST") {
    const x = await readBody(request); const qty = Number(x.quantity); const cost = Number(x.unitCost); if (!x.itemId || !x.warehouseId || !(qty > 0) || !(cost >= 0)) return json({ error: "itemId, warehouseId, quantity and unitCost are required" }, 400);
    const current = await env.ONEX_DB.prepare("SELECT * FROM stock_balances WHERE itemId=? AND warehouseId=?").bind(x.itemId, x.warehouseId).first(); const before = Number(current?.quantity || 0); const totalBefore = Number(current?.totalCost || 0); const after = before + qty; const totalAfter = totalBefore + qty * cost; const unitAfter = after ? totalAfter / after : 0;
    const batch = [{ sql: "INSERT INTO stock_balances(itemId,warehouseId,quantity,unitCost,totalCost,versionNo) VALUES(?,?,?,?,?,1) ON CONFLICT(itemId,warehouseId) DO UPDATE SET quantity=excluded.quantity,unitCost=excluded.unitCost,totalCost=excluded.totalCost,versionNo=stock_balances.versionNo+1", params: [x.itemId, x.warehouseId, after.toFixed(6), unitAfter.toFixed(6), totalAfter.toFixed(6)] }, { sql: "INSERT INTO stock_movements(itemId,warehouseId,movementType,quantityIn,unitCost,totalCost,balanceAfter,createdBy) VALUES(?,?,?,?,?,?,?,?)", params: [x.itemId, x.warehouseId, "RECEIPT", qty.toFixed(6), cost.toFixed(6), (qty * cost).toFixed(6), after.toFixed(6), x.actor || "workbench.user"] }];
    return json({ ok: true, quantity: after.toFixed(6), totalCost: totalAfter.toFixed(6), result: await env.ONEX_DB.batch(batch) });
  }
  if (url.pathname === "/api/cloud/invoices" && request.method === "GET") { const r = await env.ONEX_DB.prepare("SELECT * FROM invoices ORDER BY createdAt DESC LIMIT ?").bind(limitOf(url)).all(); return json(r.results); }
  if (url.pathname === "/api/cloud/invoices" && request.method === "POST") {
    const x = await readBody(request); if (!x.docNo || !x.customerId || !x.warehouseId || !Array.isArray(x.lines) || !x.lines.length) return json({ error: "docNo, customerId, warehouseId and lines are required" }, 400);
    const subtotal = x.lines.reduce((n, l) => n + Number(l.quantity || 0) * Number(l.unitPrice || 0), 0); const tax = x.lines.reduce((n, l) => n + Number(l.taxAmount || 0), 0); const total = subtotal + tax; const key = x.idempotencyKey || `D1:${x.docNo}`;
    const batch = [{ sql: "INSERT INTO invoices(docNo,customerId,warehouseId,subtotal,taxTotal,grandTotal,status,idempotencyKey,sourceForm,createdBy) VALUES(?,?,?,?,?,?,?,?,?,?)", params: [x.docNo, x.customerId, x.warehouseId, subtotal.toFixed(6), tax.toFixed(6), total.toFixed(6), "DRAFT", key, x.sourceForm || "ARST004", x.actor || "workbench.user"] }, ...x.lines.map((l) => ({ sql: "INSERT INTO invoice_lines(invoiceId,itemId,quantity,unitPrice,taxAmount,lineTotal) VALUES((SELECT id FROM invoices WHERE docNo=?),?,?,?,?,?)", params: [x.docNo, l.itemId, l.quantity, l.unitPrice, l.taxAmount || "0", (Number(l.quantity) * Number(l.unitPrice) + Number(l.taxAmount || 0)).toFixed(6)] }))];
    return json({ ok: true, result: await env.ONEX_DB.batch(batch) }, 201);
  }
  if (url.pathname.startsWith("/api/cloud/invoices/") && request.method === "POST") {
    const id = Number(url.pathname.split("/").pop()); const action = url.searchParams.get("action"); if (!id || !["post", "reverse"].includes(action)) return json({ error: "use ?action=post or ?action=reverse" }, 400); const status = action === "post" ? "POSTED" : "REVERSED"; const r = await env.ONEX_DB.prepare("UPDATE invoices SET status=?,postedAt=CASE WHEN ?='POSTED' THEN CURRENT_TIMESTAMP ELSE postedAt END WHERE id=?").bind(status, status, id).run(); return json({ ok: true, invoiceId: id, status, result: r });
  }
  if (url.pathname === "/api/cloud/reports/inventory") { const r = await env.ONEX_DB.prepare("SELECT itemId,warehouseId,quantity,unitCost,totalCost FROM stock_balances ORDER BY itemId LIMIT ?").bind(limitOf(url)).all(); return json({ reportCode: "MRPREP001", title: "Inventory valuation", rows: r.results }); }
  if (url.pathname === "/api/cloud/reports/accounts") { const r = await env.ONEX_DB.prepare("SELECT code,name,accountType,currencyCode,active FROM accounts ORDER BY code LIMIT ?").bind(limitOf(url)).all(); return json({ reportCode: "GLST001", title: "Chart of accounts", rows: r.results }); }
  if (url.pathname === "/api/cloud/reports/invoices") { const r = await env.ONEX_DB.prepare("SELECT docNo,customerId,grandTotal,status,createdAt FROM invoices ORDER BY createdAt DESC LIMIT ?").bind(limitOf(url)).all(); return json({ reportCode: "ARSR041", title: "Sales invoices", rows: r.results }); }
  return json({ error: "Cloud D1 route not found" }, 404);
}

export default { async fetch(request, env) { const url = new URL(request.url); if (url.pathname.startsWith("/api/cloud/")) return api(request, env, url); const origin = new URL(ORIGIN); origin.pathname = url.pathname; origin.search = url.search; const headers = new Headers(request.headers); headers.set("x-onex-cloudflare-preview", "onex-workbench"); const proxied = new Request(origin, { method: request.method, headers, body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body, redirect: "follow" }); const response = await fetch(proxied); const output = new Response(response.body, response); output.headers.set("x-onex-deployment", "cloudflare-worker"); output.headers.set("x-onex-d1-binding", "ONEX_DB"); output.headers.set("x-content-type-options", "nosniff"); output.headers.set("x-frame-options", "DENY"); output.headers.set("referrer-policy", "strict-origin-when-cross-origin"); return output; } };
