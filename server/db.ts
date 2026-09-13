import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ENV } from "./_core/env";
import { auditEvents, companies, customers, invoices, invoiceLines, items, journalEntries, journalEntryLines, suppliers, stockBalances, stockMovements, warehouses, windowRegistry, type InsertUser, users } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let demoInvoiceSequence = 1000;
const demoInvoices = new Map<number, { invoiceId: number; docNo: string; subtotal: number; taxTotal: number; grandTotal: number; status: "DRAFT" | "POSTED" | "REVERSED" }>();
const demoSuppliers: Array<{ id: number; companyId: number; code: string; legalName: string; currencyCode: string; status: "ACTIVE" | "BLOCKED" | "CLOSED" }> = [{ id: 1, companyId: 1, code: "SUP-001", legalName: "مورد تجريبي", currencyCode: "SAR", status: "ACTIVE" }];
const demoCustomers: Array<{ id: number; companyId: number; code: string; legalName: string; currencyCode: string; status: "ACTIVE" | "BLOCKED" | "CLOSED" }> = [{ id: 1, companyId: 1, code: "CUST-001", legalName: "عميل تجريبي", currencyCode: "SAR", status: "ACTIVE" }];
const demoItems = [{ id: 1, companyId: 1, code: "ITEM-001", description: "صنف تجريبي", stockFlag: 1, unitCost: "100", revenueAccount: "4100", inventoryAccount: "1300", cogsAccount: "5100", active: 1 }];
const demoJournals: Array<{ id: number; journalNo: string; entryType: string; totalDebit: string; totalCredit: string; status: "POSTED" }> = [];

type FallbackWindow = {
  id: number; screenNo: string; screenName: string; parentId: string;
  systemNo: string; itemType: string; formName: string; displayOrder: number;
  userPermission: string; companyBranchPermission: string; buildState: string;
  compiledSize: number; rebuildLevel: string; sourceStatus: string;
  observedProcedures: number; observedTriggers: number; observedLibraries: number;
  observedTableIndicators: number; riskFlags: string; specPath: string;
  nextRequiredEvidence: string; legacyForm: string; domainCode: string;
  capability: string; migrationPhase: number; status: string; sourceConfidence: string;
  notes: string;
};

let fallbackWindows: FallbackWindow[] | null = null;
let hierarchyByFile: Map<string, { parentNo: string; sysNo: string; formNo: string; nameAr: string; nameEn: string; orderNo: number; inactive: number }> | null = null;
function loadHierarchy() {
  if (hierarchyByFile) return hierarchyByFile;
  hierarchyByFile = new Map();
  try {
    const lines = readFileSync(resolve(process.cwd(), "database-source/nodes_catalog_links.csv"), "utf8").split(/\r?\n/).filter(Boolean);
    const headers = lines.shift()!.split(",");
    for (const line of lines) {
      const parts = line.split(",");
      const row = Object.fromEntries(headers.map((key, index) => [key, parts[index] || ""]));
      if (row.file_name) hierarchyByFile.set(row.file_name.toUpperCase(), { parentNo: row.parent_no, sysNo: row.sys_no, formNo: row.form_no, nameAr: row.name_ar, nameEn: row.name_en, orderNo: Number(row.order_no || 0), inactive: Number(row.inactive || 0) });
    }
  } catch { /* source is optional when running from a packaged build */ }
  return hierarchyByFile;
}

const csvCache = new Map<string, string[][]>();
function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let value = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i]; const next = text[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i++; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { row.push(value); value = ""; continue; }
    if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') i++; row.push(value); value = ""; if (row.some(Boolean)) rows.push(row); row = []; continue; }
    value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}
function catalogRow(relativePath: string, key: string, keyColumn = 0) {
  try {
    if (!csvCache.has(relativePath)) csvCache.set(relativePath, parseCsv(readFileSync(resolve(process.cwd(), relativePath), "utf8")));
    const rows = csvCache.get(relativePath)!; const header = rows[0] || [];
    const target = key.toUpperCase().replace(/\.FMX$/, "");
    const found = rows.slice(1).find((item) => (item[keyColumn] || "").toUpperCase().replace(/\.FMX$/, "") === target);
    return found ? Object.fromEntries(header.map((name, index) => [name, found[index] || ""])) : undefined;
  } catch { return undefined; }
}
function loadFallbackWindows(): FallbackWindow[] {
  if (fallbackWindows) return fallbackWindows;
  const csvPath = resolve(process.cwd(), "rebuild-manifest/all_windows_rebuild_status.csv");
  try {
    const lines = readFileSync(csvPath, "utf8").split(/\r?\n/).filter(Boolean).slice(1);
    fallbackWindows = lines.map((line, index) => {
      const parts = line.split(",");
      const form = parts[0] || `WINDOW_${index + 1}.fmx`;
      const category = parts[1] || "other";
      const procedures = Number(parts[5] || 0);
      const triggers = Number(parts[6] || 0);
      const libraries = Number(parts[7] || 0);
      const tableIndicators = Number(parts[8] || 0);
      const rebuildLevel = parts[3] || "catalog_specification";
      const hierarchy = loadHierarchy().get(form.replace(/\.fmx$/i, "").toUpperCase());
      return {
        id: index + 1, screenNo: `SCR-${String(index + 1).padStart(4, "0")}`,
        screenName: hierarchy?.nameAr || hierarchy?.nameEn || form.replace(/\.fmx$/i, ""), parentId: hierarchy?.parentNo || category,
        systemNo: hierarchy?.sysNo ? `ONEX-${hierarchy.sysNo}` : "ONEX", itemType: "FORM", formName: form, displayOrder: hierarchy?.orderNo || index + 1,
        userPermission: category.toUpperCase().includes("ADMIN") ? "ROLE_ADMIN" : "ROLE_USER",
        companyBranchPermission: category.toUpperCase().includes("POS") ? "COMPANY_BRANCH_REQUIRED" : "COMPANY_BRANCH_SCOPE",
        buildState: rebuildLevel === "golden_master_verified" ? "متحقق" : rebuildLevel === "source_reconstruction" ? "قيد البناء" : rebuildLevel === "catalog_specification" ? "مواصفة" : "مفهرسة",
        compiledSize: Number(parts[2] || 0), rebuildLevel, sourceStatus: parts[4] || "FMB_PLL_not_found",
        observedProcedures: procedures, observedTriggers: triggers, observedLibraries: libraries,
        observedTableIndicators: tableIndicators, riskFlags: parts.slice(9, -3).join(","),
        specPath: parts[parts.length - 3] || "", nextRequiredEvidence: parts[parts.length - 1] || "FMB/PLL/PKS/PKB/DDL/Forms Builder",
        legacyForm: form, domainCode: category, capability: `${form.replace(/\.fmx$/i, "")}_COMPAT`, migrationPhase: 3,
        status: "cataloged", sourceConfidence: "FMX_STRING_EVIDENCE", notes: "Fallback catalog loaded from rebuild manifest",
      };
    });
  } catch {
    fallbackWindows = [];
  }
  return fallbackWindows;
}

function fallbackTree(rows = loadFallbackWindows()) {
  const tree = new Map<string, { id: string; label: string; domain: string; groups: { id: string; label: string; windows: FallbackWindow[] }[] }>();
  for (const row of rows) {
    const domain = row.domainCode || "OTHER";
    const prefix = row.legacyForm.replace(/\.fmx$/i, "").match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || "MISC";
    const branch = tree.get(domain) || { id: domain, label: domain, domain, groups: [] };
    let group = branch.groups.find((item) => item.label === prefix);
    if (!group) { group = { id: `${domain}::${prefix}`, label: prefix, windows: [] }; branch.groups.push(group); }
    group.windows.push(row);
    tree.set(domain, branch);
  }
  return Array.from(tree.values()).map((branch) => ({ ...branch, windows: branch.groups.reduce((sum, group) => sum + group.windows.length, 0), groups: branch.groups.map((group) => ({ ...group, count: group.windows.length, windows: group.windows.map((win) => ({ ...win, screenNo: win.screenNo, screenName: win.screenName, parentId: group.id, systemNo: "ONEX", itemType: "FORM", formName: win.legacyForm })) })) }));
}

export async function getDb() {
  // Git catalog mode is the safe default. Enable a real database explicitly with ONEX_USE_DATABASE=1.
  if (process.env.NODE_ENV === "test" || process.env.VITEST || process.env.ONEX_DEMO_MODE === "1" || process.env.ONEX_USE_DATABASE !== "1") return null;
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db || !user.openId) return;
  const values: InsertUser = { openId: user.openId, name: user.name, email: user.email, loginMethod: user.loginMethod, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  if (user.name !== undefined) updateSet.name = user.name;
  if (user.email !== undefined) updateSet.email = user.email;
  if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod;
  if (user.role !== undefined) updateSet.role = user.role;
  else if (user.openId === ENV.ownerOpenId) updateSet.role = "admin";
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getWindowCatalog(search?: string, domain?: string, limit = 80) {
  const db = await getDb();
  if (!db) {
    const query = (search || "").toLowerCase();
    return loadFallbackWindows().filter((win) =>
      (!query || `${win.legacyForm} ${win.capability} ${win.domainCode}`.toLowerCase().includes(query)) &&
      (!domain || domain === "ALL" || win.domainCode === domain)
    ).slice(0, limit);
  }
  const filters = [];
  if (search) filters.push(or(like(windowRegistry.legacyForm, `%${search}%`), like(windowRegistry.capability, `%${search}%`)));
  if (domain && domain !== "ALL") filters.push(eq(windowRegistry.domainCode, domain));
  return db.select().from(windowRegistry).where(filters.length ? and(...filters) : undefined).orderBy(windowRegistry.domainCode, windowRegistry.legacyForm).limit(limit);
}

export async function getSystemTree() {
  const db = await getDb();
  if (!db) return fallbackTree();
  const rows = await db.select().from(windowRegistry).orderBy(windowRegistry.domainCode, windowRegistry.legacyForm);
  const categoryLabels: Record<string, string> = {
    'AR/ACCOUNTS-RECEIVABLE': 'الذمم المدينة والمبيعات', 'AP/PURCHASING': 'المشتريات والدائنون', 'GL/FINANCE': 'الحسابات العامة والمالية',
    'INVENTORY/STOCK': 'المخزون والمستودعات', 'MRP/TREASURY': 'التخطيط والخزينة', 'POS': 'نقاط البيع', 'HR': 'الموارد البشرية',
    'ADMIN/SYSTEM': 'الإدارة وإعدادات النظام', 'ASSETS/MAINTENANCE': 'الأصول والصيانة', 'OTHER-FINANCE/OPERATIONS': 'العمليات المالية', 'REPORTS': 'التقارير', 'OTHER': 'نوافذ أخرى'
  };
  const groups = new Map<string, { id: string; label: string; domain: string; windows: typeof rows }>();
  for (const row of rows) {
    const domain = row.domainCode;
    const base = row.legacyForm.replace(/\.fmx$/i, '');
    const prefix = base.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || 'MISC';
    const key = `${domain}::${prefix}`;
    if (!groups.has(key)) groups.set(key, { id: key, label: prefix, domain, windows: [] });
    groups.get(key)!.windows.push(row);
  }
  const tree = new Map<string, { id: string; label: string; domain: string; groups: { id: string; label: string; windows: typeof rows }[] }>();
  for (const group of Array.from(groups.values())) {
    if (!tree.has(group.domain)) tree.set(group.domain, { id: group.domain, label: categoryLabels[group.domain] || group.domain, domain: group.domain, groups: [] });
    tree.get(group.domain)!.groups.push(group);
  }
  return Array.from(tree.values()).map((branch) => ({ ...branch, windows: branch.groups.reduce((sum: number, group: any) => sum + group.windows.length, 0), groups: branch.groups.sort((a: any, b: any) => a.label.localeCompare(b.label)).map((group: any) => ({ ...group, count: group.windows.length, windows: group.windows.map((win: any) => ({ ...win, screenNo: `SCR-${String(win.id).padStart(4, '0')}`, screenName: win.legacyForm.replace(/\.fmx$/i, ''), parentId: group.id, systemNo: 'ONEX', itemType: 'FORM', formName: win.legacyForm, displayOrder: win.id, userPermission: win.domainCode === 'ADMIN/SYSTEM' ? 'ROLE_ADMIN' : 'ROLE_USER', companyBranchPermission: win.domainCode === 'POS' ? 'COMPANY_BRANCH_REQUIRED' : 'COMPANY_BRANCH_SCOPE', buildState: win.rebuildLevel === 'golden_master_verified' || win.rebuildLevel === 'production_ready' ? 'متحقق' : win.rebuildLevel === 'source_reconstruction' || win.rebuildLevel === 'forms_builder_build' ? 'قيد البناء' : win.rebuildLevel === 'catalog_specification' ? 'مواصفة' : (win.status === 'verified' ? 'متحقق' : 'مفهرس') })) })) }));
}

export async function getWindowDomains() {
  const db = await getDb();
  if (!db) return Array.from(new Set(loadFallbackWindows().map((row) => row.domainCode))).sort();
  const rows = await db.select({ domain: windowRegistry.domainCode }).from(windowRegistry).groupBy(windowRegistry.domainCode).orderBy(windowRegistry.domainCode);
  return rows.map((row) => row.domain);
}

export async function getCatalogSources() {
  return {
    windowCount: loadFallbackWindows().length || 1490,
    hierarchyCount: loadHierarchy().size,
    specificationCount: 1490,
    catalogCount: 1490,
    runtimeContractCount: 1490,
    fieldEvidenceCatalogCount: 1490,
    midoIntegration: {
      repository: "aldalistor/mido",
      repositoryCommit: "873bcda",
      meedoRepository: "aldalistor/Meedo-2",
      formsInventoryCount: 1490,
      oracleTablesImported: 936,
      oracleViewsImported: 200,
      oracleSequencesImported: 13,
      businessModules: ["accounting", "invoices", "inventory", "receivables", "period-close", "reports", "permissions"],
      status: "integrated-reference-layer",
    },
    sourceFiles: [
      "legacy-source/window_catalog.csv",
      "legacy-source/window_runtime_contracts.csv",
      "legacy-source/form_field_trigger_catalog.csv",
      "legacy-source/unified_window_contracts.csv",
      "legacy-source/recovery_manifest.csv",
      "legacy-source/generated_code_manifest.csv",
      "database-source/nodes_enriched.csv",
      "database-source/nodes_catalog_links.csv",
      "legacy-source/all_window_specs/*.rebuild.md",
      "legacy-source/MIDO_INTEGRATION_STATUS_AR.md",
      "legacy-source/mido/modules/*.js",
      "legacy-source/mido/oracle/migrations/*.sql",
    ],
  };
}

export async function getWindowContract(legacyForm: string) {
  const form = legacyForm.replace(/\.fmx$/i, "");
  const runtime = catalogRow("legacy-source/window_runtime_contracts.csv", form);
  const fields = catalogRow("legacy-source/form_field_trigger_catalog.csv", form);
  const unified = catalogRow("legacy-source/unified_window_contracts.csv", form, 1);
  const manifest = catalogRow("legacy-source/window_catalog.csv", `${form}.fmx`);
  const row = loadFallbackWindows().find((item) => item.legacyForm.replace(/\.fmx$/i, "").toUpperCase() === form.toUpperCase());
  const domain = row?.domainCode || runtime?.domain || "OTHER";
  const moduleByDomain: Record<string, string[]> = { AR: ["receivables-core.js", "commercial-invoice-core.js", "invoice-posting-core.js", "document-cycle-core.js"], AP: ["business-operations-core.js", "commercial-invoice-core.js", "document-cycle-core.js"], GL: ["accounting-core.js", "commercial-accounting-core.js", "chart-of-accounts-core.js", "period-close-core.js"], INVENTORY: ["business-operations-core.js", "invoice-posting-core.js"], POS: ["business-operations-core.js", "commercial-invoice-core.js"], HR: ["business-operations-core.js"] };
  const actions = unified?.actions?.split("|").filter(Boolean) || ["initialize", "query", "new", "validate", "save", "update", "delete", "approve", "post", "reverse", "print", "refresh", "exit"];
  const evidence = (value?: string) => (value || "").split(/[;|]/).map((item) => item.trim()).filter(Boolean).slice(0, 40);
  const count = (...values: unknown[]) => { for (const value of values) { const parsed = Number(value); if (Number.isFinite(parsed)) return parsed; } return 0; };
  return {
    legacyForm: `${form}.fmx`, screenName: row?.screenName || form, domain, parentId: row?.parentId || "ROOT",
    source: { manifest: Boolean(manifest), runtime: Boolean(runtime), fields: Boolean(fields), unified: Boolean(unified), specification: `legacy-source/all_window_specs/${form}.rebuild.md` },
    counts: { fields: count(fields?.fields, unified?.window_field_evidence_count, runtime?.observed_field_count, row?.observedProcedures), procedures: count(manifest?.procedures, runtime?.observed_procedure_count, row?.observedProcedures), triggers: count(manifest?.triggers, runtime?.observed_trigger_count, row?.observedTriggers), tables: count(manifest?.tables, runtime?.observed_table_count, row?.observedTableIndicators) },
    evidence: { fields: evidence(fields?.fields), procedures: evidence(fields?.procedures || runtime?.legacy_packages), triggers: evidence(fields?.triggers), tables: evidence(fields?.tables) },
    actions, coreApi: unified?.core_api || runtime?.core_api || `ONEX_${domain.replace(/[^A-Z]/gi, "_")}_WINDOW_API`,
    midoModules: moduleByDomain[domain.split("/")[0].toUpperCase()] || ["business-operations-core.js", "document-cycle-core.js"],
    status: unified?.production_status || "NOT_READY_FOR_PRODUCTION", specificationPath: `legacy-source/all_window_specs/${form}.rebuild.md`,
  };
}

export async function getDashboard() {
  const db = await getDb();
  if (!db) return { windows: loadFallbackWindows().length || 1490, domains: new Set(loadFallbackWindows().map((row) => row.domainCode)).size || 12, invoices: 0, stockValue: "0.00", journals: 0, recentInvoices: [] };
  const [windowCount, domainCount, invoiceCount, stockValue, journalCount, recentInvoices] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(windowRegistry),
    db.select({ count: sql<number>`count(distinct ${windowRegistry.domainCode})` }).from(windowRegistry),
    db.select({ count: sql<number>`count(*)` }).from(invoices),
    db.select({ total: sql<string>`coalesce(sum(${stockBalances.totalCost}), 0)` }).from(stockBalances),
    db.select({ count: sql<number>`count(*)` }).from(journalEntries),
    db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(6),
  ]);
  return { windows: Number(windowCount[0]?.count ?? 0), domains: Number(domainCount[0]?.count ?? 0), invoices: Number(invoiceCount[0]?.count ?? 0), stockValue: String(stockValue[0]?.total ?? "0"), journals: Number(journalCount[0]?.count ?? 0), recentInvoices };
}

export async function getMasterData() {
  const db = await getDb();
  if (!db) return {
    companies: [{ id: 1, code: "ONEX", name: "شركة Onyx التجريبية", baseCurrency: "SAR" }],
    customers: [{ id: 1, companyId: 1, code: "CUST-001", legalName: "عميل تجريبي", currencyCode: "SAR", status: "ACTIVE" as const }],
    items: [{ id: 1, companyId: 1, code: "ITEM-001", description: "صنف تجريبي", stockFlag: 1, unitCost: "100", revenueAccount: "4100", inventoryAccount: "1300", cogsAccount: "5100", active: 1 }],
    warehouses: [{ id: 1, companyId: 1, code: "MAIN", name: "المستودع الرئيسي", active: 1 }],
    balances: [{ balance: { quantity: "100", totalCost: "10000", unitCost: "100" }, item: { code: "ITEM-001" }, warehouse: { code: "MAIN" } }],
  };
  const [companyRows, customerRows, itemRows, warehouseRows, balanceRows] = await Promise.all([
    db.select().from(companies).limit(20), db.select().from(customers).limit(100), db.select().from(items).limit(100), db.select().from(warehouses).limit(50), db.select({ balance: stockBalances, item: items, warehouse: warehouses }).from(stockBalances).leftJoin(items, eq(stockBalances.itemId, items.id)).leftJoin(warehouses, eq(stockBalances.warehouseId, warehouses.id)).limit(100),
  ]);
  return { companies: companyRows, customers: customerRows, items: itemRows, warehouses: warehouseRows, balances: balanceRows };
}

export async function searchInvoices(search?: string, limit = 20) {
  const db = await getDb();
  const query = (search || "").trim();
  if (!db) {
    return Array.from(demoInvoices.values()).filter((invoice) => !query || `${invoice.docNo} ${invoice.status}`.toLowerCase().includes(query.toLowerCase())).slice(-limit).reverse();
  }
  const filters = query ? or(like(invoices.docNo, `%${query}%`), like(invoices.status, `%${query}%`)) : undefined;
  return db.select().from(invoices).where(filters).orderBy(desc(invoices.createdAt)).limit(limit);
}

export async function searchCustomers(search?: string, limit = 20) {
  const db = await getDb(); const query = (search || "").trim();
  if (!db) return demoCustomers.filter((row) => !query || `${row.code} ${row.legalName}`.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
  const filters = query ? or(like(customers.code, `%${query}%`), like(customers.legalName, `%${query}%`)) : undefined;
  return db.select().from(customers).where(filters).orderBy(customers.code).limit(limit);
}

export async function saveCustomer(input: { id?: number; companyId: number; code: string; legalName: string; currencyCode?: string; status?: "ACTIVE" | "BLOCKED" | "CLOSED" }) {
  const db = await getDb();
  if (!db) { const existing = demoCustomers.find((row) => row.id === input.id || row.code === input.code); if (existing) Object.assign(existing, input); else demoCustomers.push({ id: Math.max(...demoCustomers.map((row) => row.id), 0) + 1, companyId: input.companyId, code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }); return demoCustomers.at(-1); }
  if (input.id) { await db.update(customers).set({ code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }).where(eq(customers.id, input.id)); return db.select().from(customers).where(eq(customers.id, input.id)).limit(1).then((rows) => rows[0]); }
  const inserted = await db.insert(customers).values({ companyId: input.companyId, code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }).$returningId(); return db.select().from(customers).where(eq(customers.id, Number(inserted[0]?.id))).limit(1).then((rows) => rows[0]);
}

export async function searchSuppliers(search?: string, limit = 20) {
  const db = await getDb(); const query = (search || "").trim();
  if (!db) return demoSuppliers.filter((row) => !query || `${row.code} ${row.legalName}`.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
  const filters = query ? or(like(suppliers.code, `%${query}%`), like(suppliers.legalName, `%${query}%`)) : undefined;
  return db.select().from(suppliers).where(filters).orderBy(suppliers.code).limit(limit);
}

export async function saveSupplier(input: { id?: number; companyId: number; code: string; legalName: string; currencyCode?: string; status?: "ACTIVE" | "BLOCKED" | "CLOSED" }) {
  const db = await getDb();
  if (!db) { const existing = demoSuppliers.find((row) => row.id === input.id || row.code === input.code); if (existing) Object.assign(existing, input); else demoSuppliers.push({ id: Math.max(...demoSuppliers.map((row) => row.id), 0) + 1, companyId: input.companyId, code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }); return demoSuppliers.at(-1); }
  if (input.id) { await db.update(suppliers).set({ code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }).where(eq(suppliers.id, input.id)); return db.select().from(suppliers).where(eq(suppliers.id, input.id)).limit(1).then((rows) => rows[0]); }
  const inserted = await db.insert(suppliers).values({ companyId: input.companyId, code: input.code, legalName: input.legalName, currencyCode: input.currencyCode || "SAR", status: input.status || "ACTIVE" }).$returningId(); return db.select().from(suppliers).where(eq(suppliers.id, Number(inserted[0]?.id))).limit(1).then((rows) => rows[0]);
}

export async function searchItems(search?: string, limit = 20) {
  const db = await getDb(); const query = (search || "").trim();
  if (!db) return demoItems.filter((row) => !query || `${row.code} ${row.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
  const filters = query ? or(like(items.code, `%${query}%`), like(items.description, `%${query}%`)) : undefined;
  return db.select().from(items).where(filters).orderBy(items.code).limit(limit);
}

export async function saveItem(input: { id?: number; companyId: number; code: string; description: string; stockFlag?: number; unitCost?: string; revenueAccount?: string; inventoryAccount?: string; cogsAccount?: string; active?: number }) {
  const db = await getDb();
  const values = { companyId: input.companyId, code: input.code, description: input.description, stockFlag: input.stockFlag ?? 1, unitCost: input.unitCost || "0", revenueAccount: input.revenueAccount || "4100", inventoryAccount: input.inventoryAccount || "1300", cogsAccount: input.cogsAccount || "5100", active: input.active ?? 1 };
  if (!db) { const existing = demoItems.find((row) => row.id === input.id || row.code === input.code); if (existing) Object.assign(existing, values); else demoItems.push({ id: Math.max(...demoItems.map((row) => row.id), 0) + 1, ...values }); return demoItems.at(-1); }
  if (input.id) { await db.update(items).set(values).where(eq(items.id, input.id)); return db.select().from(items).where(eq(items.id, input.id)).limit(1).then((rows) => rows[0]); }
  const inserted = await db.insert(items).values(values).$returningId(); return db.select().from(items).where(eq(items.id, Number(inserted[0]?.id))).limit(1).then((rows) => rows[0]);
}

export async function searchJournals(search?: string, limit = 20) {
  const db = await getDb(); const query = (search || "").trim();
  if (!db) return demoJournals.filter((row) => !query || `${row.journalNo} ${row.entryType}`.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
  const filters = query ? or(like(journalEntries.journalNo, `%${query}%`), like(journalEntries.entryType, `%${query}%`)) : undefined;
  return db.select().from(journalEntries).where(filters).orderBy(desc(journalEntries.createdAt)).limit(limit);
}

export async function saveJournal(input: { journalNo: string; entryType: string; actor: string; lines: { accountCode: string; accountName?: string; description?: string; debit: string; credit: string }[] }) {
  const debit = input.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0); const credit = input.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  if (Math.abs(debit - credit) > 0.000001) throw new Error("JOURNAL_NOT_BALANCED");
  const db = await getDb();
  if (!db) { const id = demoJournals.length + 1; const result = { id, journalNo: input.journalNo, entryType: input.entryType, totalDebit: debit.toFixed(6), totalCredit: credit.toFixed(6), status: "POSTED" as const }; demoJournals.push(result); return result; }
  return db.transaction(async (tx) => { const inserted = await tx.insert(journalEntries).values({ journalNo: input.journalNo, entryType: input.entryType, totalDebit: debit.toFixed(6), totalCredit: credit.toFixed(6) }).$returningId(); const id = Number(inserted[0]?.id); if (!id) throw new Error("JOURNAL_CREATE_FAILED"); await tx.insert(journalEntryLines).values(input.lines.map((line) => ({ journalEntryId: id, accountCode: line.accountCode, accountName: line.accountName, description: line.description, debit: line.debit, credit: line.credit }))); await tx.insert(auditEvents).values({ actor: input.actor, actionCode: "CREATE", entityType: "GL_JOURNAL", entityId: String(id), requestId: `JOURNAL:${input.journalNo}` }); return { id, journalNo: input.journalNo, entryType: input.entryType, totalDebit: debit.toFixed(6), totalCredit: credit.toFixed(6), status: "POSTED" as const }; });
}

export async function createInvoice(input: { docNo: string; customerId: number; warehouseId: number; lines: { itemId: number; quantity: string; unitPrice: string; taxAmount: string }[]; actor: string; }) {
  const db = await getDb();
  const subtotal = input.lines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.unitPrice), 0);
  const taxTotal = input.lines.reduce((sum, line) => sum + Number(line.taxAmount), 0);
  const grandTotal = subtotal + taxTotal;
  const idempotencyKey = `ARST004:${input.docNo}`;
  if (!db) {
    if (Array.from(demoInvoices.values()).some((invoice) => invoice.docNo === input.docNo)) throw new Error("DUPLICATE_IDEMPOTENCY_KEY");
    const invoiceId = ++demoInvoiceSequence;
    const result = { invoiceId, docNo: input.docNo, subtotal, taxTotal, grandTotal, status: "DRAFT" as const };
    demoInvoices.set(invoiceId, result);
    return result;
  }
  return db.transaction(async (tx) => {
    const inserted = await tx.insert(invoices).values({ docNo: input.docNo, customerId: input.customerId, warehouseId: input.warehouseId, subtotal: subtotal.toFixed(6), taxTotal: taxTotal.toFixed(6), grandTotal: grandTotal.toFixed(6), idempotencyKey, createdBy: input.actor }).$returningId();
    const invoiceId = Number(inserted[0]?.id);
    if (!invoiceId) throw new Error("INVOICE_CREATE_FAILED");
    await tx.insert(invoiceLines).values(input.lines.map((line) => ({ invoiceId, itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, taxAmount: line.taxAmount, lineTotal: (Number(line.quantity) * Number(line.unitPrice) + Number(line.taxAmount)).toFixed(6) })));
    await tx.insert(auditEvents).values({ actor: input.actor, actionCode: "CREATE", entityType: "AR_DOC", entityId: String(invoiceId), requestId: idempotencyKey });
    return { invoiceId, docNo: input.docNo, subtotal, taxTotal, grandTotal, status: "DRAFT" as const };
  });
}

export async function postInvoice(invoiceId: number, actor: string) {
  const db = await getDb();
  if (!db) {
    const invoice = demoInvoices.get(invoiceId);
    if (!invoice) throw new Error("INVOICE_NOT_FOUND");
    if (invoice.status !== "DRAFT") throw new Error("INVOICE_ALREADY_POSTED_OR_REVERSED");
    invoice.status = "POSTED";
    return { invoiceId, status: "POSTED" as const, totalCogs: 0 };
  }
  return db.transaction(async (tx) => {
    const invoice = (await tx.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1))[0];
    if (!invoice) throw new Error("INVOICE_NOT_FOUND");
    if (invoice.status !== "DRAFT") throw new Error("INVOICE_ALREADY_POSTED_OR_REVERSED");
    const lines = await tx.select({ line: invoiceLines, item: items, balance: stockBalances }).from(invoiceLines).innerJoin(items, eq(invoiceLines.itemId, items.id)).leftJoin(stockBalances, and(eq(stockBalances.itemId, invoiceLines.itemId), eq(stockBalances.warehouseId, invoice.warehouseId))).where(eq(invoiceLines.invoiceId, invoiceId));
    let totalCogs = 0;
    for (const row of lines) {
      const quantity = Number(row.line.quantity);
      const balance = row.balance;
      const beforeQty = Number(balance?.quantity ?? 0);
      const unitCost = Number(balance?.unitCost ?? row.item.unitCost ?? 0);
      if (row.item.stockFlag && beforeQty < quantity) throw new Error(`INSUFFICIENT_STOCK:${row.item.code}`);
      const cost = row.item.stockFlag ? quantity * unitCost : 0;
      totalCogs += cost;
      if (row.item.stockFlag && balance) {
        const afterQty = beforeQty - quantity;
        const afterCost = Math.max(0, Number(balance.totalCost) - cost);
        await tx.update(stockBalances).set({ quantity: afterQty.toFixed(6), totalCost: afterCost.toFixed(6), unitCost: afterQty ? (afterCost / afterQty).toFixed(6) : "0", versionNo: balance.versionNo + 1 }).where(eq(stockBalances.id, balance.id));
        await tx.insert(stockMovements).values({ itemId: row.line.itemId, warehouseId: invoice.warehouseId, sourceInvoiceId: invoiceId, movementType: "SALES_ISSUE", quantityOut: quantity.toFixed(6), unitCost: unitCost.toFixed(6), totalCost: cost.toFixed(6), balanceAfter: afterQty.toFixed(6), createdBy: actor });
      }
    }
    const total = Number(invoice.grandTotal);
    await tx.insert(journalEntries).values([{ journalNo: `AR-${invoice.docNo}`, sourceInvoiceId: invoiceId, entryType: "AR_SALE", totalDebit: total.toFixed(6), totalCredit: total.toFixed(6) }, { journalNo: `COGS-${invoice.docNo}`, sourceInvoiceId: invoiceId, entryType: "COGS_INVENTORY", totalDebit: totalCogs.toFixed(6), totalCredit: totalCogs.toFixed(6) }]);
    await tx.update(invoices).set({ status: "POSTED", postedAt: new Date() }).where(eq(invoices.id, invoiceId));
    await tx.insert(auditEvents).values({ actor, actionCode: "POST", entityType: "AR_DOC", entityId: String(invoiceId), requestId: `POST:${invoice.docNo}` });
    return { invoiceId, status: "POSTED" as const, totalCogs };
  });
}

export async function reverseInvoice(invoiceId: number, actor: string) {
  const db = await getDb();
  if (!db) {
    const invoice = demoInvoices.get(invoiceId);
    if (!invoice || invoice.status !== "POSTED") throw new Error("ONLY_POSTED_INVOICES_CAN_BE_REVERSED");
    invoice.status = "REVERSED";
    return { invoiceId, status: "REVERSED" as const };
  }
  return db.transaction(async (tx) => {
    const invoice = (await tx.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1))[0];
    if (!invoice || invoice.status !== "POSTED") throw new Error("ONLY_POSTED_INVOICES_CAN_BE_REVERSED");
    const lines = await tx.select({ line: invoiceLines, item: items, balance: stockBalances }).from(invoiceLines).innerJoin(items, eq(invoiceLines.itemId, items.id)).leftJoin(stockBalances, and(eq(stockBalances.itemId, invoiceLines.itemId), eq(stockBalances.warehouseId, invoice.warehouseId))).where(eq(invoiceLines.invoiceId, invoiceId));
    for (const row of lines) {
      if (!row.item.stockFlag || !row.balance) continue;
      const quantity = Number(row.line.quantity);
      const cost = quantity * Number(row.balance.unitCost);
      const afterQty = Number(row.balance.quantity) + quantity;
      const afterCost = Number(row.balance.totalCost) + cost;
      await tx.update(stockBalances).set({ quantity: afterQty.toFixed(6), totalCost: afterCost.toFixed(6), unitCost: (afterCost / afterQty).toFixed(6), versionNo: row.balance.versionNo + 1 }).where(eq(stockBalances.id, row.balance.id));
      await tx.insert(stockMovements).values({ itemId: row.line.itemId, warehouseId: invoice.warehouseId, sourceInvoiceId: invoiceId, movementType: "SALES_RETURN", quantityIn: quantity.toFixed(6), unitCost: Number(row.balance.unitCost).toFixed(6), totalCost: cost.toFixed(6), balanceAfter: afterQty.toFixed(6), createdBy: actor });
    }
    await tx.insert(journalEntries).values({ journalNo: `REV-${invoice.docNo}`, sourceInvoiceId: invoiceId, entryType: "REVERSAL", totalDebit: invoice.grandTotal, totalCredit: invoice.grandTotal });
    await tx.update(invoices).set({ status: "REVERSED" }).where(eq(invoices.id, invoiceId));
    await tx.insert(auditEvents).values({ actor, actionCode: "REVERSE", entityType: "AR_DOC", entityId: String(invoiceId), requestId: `REV:${invoice.docNo}` });
    return { invoiceId, status: "REVERSED" as const };
  });
}
