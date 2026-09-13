import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, index, unique } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const windowRegistry = mysqlTable("window_registry", {
  id: int("id").autoincrement().primaryKey(),
  screenNo: varchar("screenNo", { length: 40 }).notNull().default("SYS-0000"),
  screenName: varchar("screenName", { length: 240 }).notNull().default("Legacy Window"),
  parentId: varchar("parentId", { length: 160 }),
  systemNo: varchar("systemNo", { length: 40 }).notNull().default("ONEX"),
  itemType: varchar("itemType", { length: 40 }).notNull().default("FORM"),
  formName: varchar("formName", { length: 160 }).notNull().default("LEGACY.fmx"),
  displayOrder: int("displayOrder").notNull().default(0),
  userPermission: varchar("userPermission", { length: 120 }).notNull().default("ROLE_USER"),
  companyBranchPermission: varchar("companyBranchPermission", { length: 160 }).notNull().default("COMPANY_BRANCH_SCOPE"),
  buildState: varchar("buildState", { length: 40 }).notNull().default("INDEXED"),
  compiledSize: int("compiledSize").notNull().default(0),
  rebuildLevel: varchar("rebuildLevel", { length: 60 }).notNull().default("catalog_specification"),
  sourceStatus: varchar("sourceStatus", { length: 80 }).notNull().default("FMB_PLL_not_found"),
  observedProcedures: int("observedProcedures").notNull().default(0),
  observedTriggers: int("observedTriggers").notNull().default(0),
  observedLibraries: int("observedLibraries").notNull().default(0),
  observedTableIndicators: int("observedTableIndicators").notNull().default(0),
  riskFlags: text("riskFlags"),
  specPath: varchar("specPath", { length: 240 }),
  nextRequiredEvidence: varchar("nextRequiredEvidence", { length: 240 }),
  legacyForm: varchar("legacyForm", { length: 160 }).notNull().unique(),
  domainCode: varchar("domainCode", { length: 40 }).notNull(),
  capability: varchar("capability", { length: 100 }).notNull(),
  migrationPhase: int("migrationPhase").notNull().default(3),
  status: mysqlEnum("status", ["cataloged", "spec_only", "in_progress", "verified"]).notNull().default("cataloged"),
  sourceConfidence: varchar("sourceConfidence", { length: 40 }).notNull().default("FMX_STRING_EVIDENCE"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ domainIdx: index("window_registry_domain_idx").on(table.domainCode) }));

export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  baseCurrency: varchar("baseCurrency", { length: 3 }).notNull().default("SAR"),
});

export const warehouses = mysqlTable("warehouses", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  code: varchar("code", { length: 30 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  active: int("active").notNull().default(1),
}, (table) => ({ companyCode: unique("warehouse_company_code").on(table.companyId, table.code) }));

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  legalName: varchar("legalName", { length: 250 }).notNull(),
  currencyCode: varchar("currencyCode", { length: 3 }).notNull().default("SAR"),
  status: mysqlEnum("status", ["ACTIVE", "BLOCKED", "CLOSED"]).notNull().default("ACTIVE"),
}, (table) => ({ companyCode: unique("customer_company_code").on(table.companyId, table.code) }));

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  legalName: varchar("legalName", { length: 250 }).notNull(),
  currencyCode: varchar("currencyCode", { length: 3 }).notNull().default("SAR"),
  status: mysqlEnum("status", ["ACTIVE", "BLOCKED", "CLOSED"]).notNull().default("ACTIVE"),
}, (table) => ({ companyCode: unique("supplier_company_code").on(table.companyId, table.code) }));

export const items = mysqlTable("items", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  code: varchar("code", { length: 80 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  stockFlag: int("stockFlag").notNull().default(1),
  unitCost: decimal("unitCost", { precision: 20, scale: 6 }).notNull().default("0"),
  revenueAccount: varchar("revenueAccount", { length: 80 }).notNull().default("4100"),
  inventoryAccount: varchar("inventoryAccount", { length: 80 }).notNull().default("1300"),
  cogsAccount: varchar("cogsAccount", { length: 80 }).notNull().default("5100"),
  active: int("active").notNull().default(1),
}, (table) => ({ companyCode: unique("item_company_code").on(table.companyId, table.code) }));

export const stockBalances = mysqlTable("stock_balances", {
  id: int("id").autoincrement().primaryKey(),
  itemId: int("itemId").notNull(),
  warehouseId: int("warehouseId").notNull(),
  quantity: decimal("quantity", { precision: 20, scale: 6 }).notNull().default("0"),
  reservedQuantity: decimal("reservedQuantity", { precision: 20, scale: 6 }).notNull().default("0"),
  unitCost: decimal("unitCost", { precision: 20, scale: 6 }).notNull().default("0"),
  totalCost: decimal("totalCost", { precision: 20, scale: 6 }).notNull().default("0"),
  versionNo: int("versionNo").notNull().default(1),
}, (table) => ({ itemWarehouse: unique("stock_item_warehouse").on(table.itemId, table.warehouseId) }));

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  docNo: varchar("docNo", { length: 80 }).notNull().unique(),
  customerId: int("customerId").notNull(),
  warehouseId: int("warehouseId").notNull(),
  currencyCode: varchar("currencyCode", { length: 3 }).notNull().default("SAR"),
  subtotal: decimal("subtotal", { precision: 20, scale: 6 }).notNull().default("0"),
  taxTotal: decimal("taxTotal", { precision: 20, scale: 6 }).notNull().default("0"),
  grandTotal: decimal("grandTotal", { precision: 20, scale: 6 }).notNull().default("0"),
  status: mysqlEnum("status", ["DRAFT", "POSTED", "REVERSED"]).notNull().default("DRAFT"),
  idempotencyKey: varchar("idempotencyKey", { length: 160 }).notNull().unique(),
  sourceForm: varchar("sourceForm", { length: 80 }).notNull().default("ARST004"),
  createdBy: varchar("createdBy", { length: 100 }).notNull().default("demo.user"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  postedAt: timestamp("postedAt"),
}, (table) => ({ statusIdx: index("invoice_status_idx").on(table.status) }));

export const invoiceLines = mysqlTable("invoice_lines", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  itemId: int("itemId").notNull(),
  quantity: decimal("quantity", { precision: 20, scale: 6 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 20, scale: 6 }).notNull(),
  taxAmount: decimal("taxAmount", { precision: 20, scale: 6 }).notNull().default("0"),
  lineTotal: decimal("lineTotal", { precision: 20, scale: 6 }).notNull(),
});

export const stockMovements = mysqlTable("stock_movements", {
  id: int("id").autoincrement().primaryKey(),
  itemId: int("itemId").notNull(),
  warehouseId: int("warehouseId").notNull(),
  sourceInvoiceId: int("sourceInvoiceId"),
  movementType: varchar("movementType", { length: 40 }).notNull(),
  quantityIn: decimal("quantityIn", { precision: 20, scale: 6 }).notNull().default("0"),
  quantityOut: decimal("quantityOut", { precision: 20, scale: 6 }).notNull().default("0"),
  unitCost: decimal("unitCost", { precision: 20, scale: 6 }).notNull().default("0"),
  totalCost: decimal("totalCost", { precision: 20, scale: 6 }).notNull().default("0"),
  balanceAfter: decimal("balanceAfter", { precision: 20, scale: 6 }).notNull().default("0"),
  createdBy: varchar("createdBy", { length: 100 }).notNull().default("demo.user"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  journalNo: varchar("journalNo", { length: 80 }).notNull().unique(),
  sourceInvoiceId: int("sourceInvoiceId"),
  entryType: varchar("entryType", { length: 40 }).notNull(),
  totalDebit: decimal("totalDebit", { precision: 20, scale: 6 }).notNull(),
  totalCredit: decimal("totalCredit", { precision: 20, scale: 6 }).notNull(),
  status: mysqlEnum("status", ["POSTED", "REVERSED"]).notNull().default("POSTED"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const journalEntryLines = mysqlTable("journal_entry_lines", {
  id: int("id").autoincrement().primaryKey(),
  journalEntryId: int("journalEntryId").notNull(),
  accountCode: varchar("accountCode", { length: 80 }).notNull(),
  accountName: varchar("accountName", { length: 240 }),
  description: varchar("description", { length: 500 }),
  debit: decimal("debit", { precision: 20, scale: 6 }).notNull().default("0"),
  credit: decimal("credit", { precision: 20, scale: 6 }).notNull().default("0"),
});

export const auditEvents = mysqlTable("audit_events", {
  id: int("id").autoincrement().primaryKey(),
  actor: varchar("actor", { length: 100 }).notNull(),
  actionCode: varchar("actionCode", { length: 80 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 120 }).notNull(),
  requestId: varchar("requestId", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WindowRegistry = typeof windowRegistry.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
