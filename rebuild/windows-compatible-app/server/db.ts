import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { auditEvents, companies, customers, invoices, invoiceLines, items, journalEntries, stockBalances, stockMovements, warehouses, windowRegistry, type InsertUser, users } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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
  if (!db) return [];
  const filters = [];
  if (search) filters.push(or(like(windowRegistry.legacyForm, `%${search}%`), like(windowRegistry.capability, `%${search}%`)));
  if (domain && domain !== "ALL") filters.push(eq(windowRegistry.domainCode, domain));
  return db.select().from(windowRegistry).where(filters.length ? and(...filters) : undefined).orderBy(windowRegistry.domainCode, windowRegistry.legacyForm).limit(limit);
}

export async function getWindowDomains() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ domain: windowRegistry.domainCode }).from(windowRegistry).groupBy(windowRegistry.domainCode).orderBy(windowRegistry.domainCode);
  return rows.map((row) => row.domain);
}

export async function getDashboard() {
  const db = await getDb();
  if (!db) return { windows: 1490, domains: 12, invoices: 0, stockValue: "0.00", journals: 0, recentInvoices: [] };
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
  if (!db) return { companies: [], customers: [], items: [], warehouses: [], balances: [] };
  const [companyRows, customerRows, itemRows, warehouseRows, balanceRows] = await Promise.all([
    db.select().from(companies).limit(20), db.select().from(customers).limit(100), db.select().from(items).limit(100), db.select().from(warehouses).limit(50), db.select({ balance: stockBalances, item: items, warehouse: warehouses }).from(stockBalances).leftJoin(items, eq(stockBalances.itemId, items.id)).leftJoin(warehouses, eq(stockBalances.warehouseId, warehouses.id)).limit(100),
  ]);
  return { companies: companyRows, customers: customerRows, items: itemRows, warehouses: warehouseRows, balances: balanceRows };
}

export async function createInvoice(input: { docNo: string; customerId: number; warehouseId: number; lines: { itemId: number; quantity: string; unitPrice: string; taxAmount: string }[]; actor: string; }) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  const subtotal = input.lines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.unitPrice), 0);
  const taxTotal = input.lines.reduce((sum, line) => sum + Number(line.taxAmount), 0);
  const grandTotal = subtotal + taxTotal;
  const idempotencyKey = `ARST004:${input.docNo}`;
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
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
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
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
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
