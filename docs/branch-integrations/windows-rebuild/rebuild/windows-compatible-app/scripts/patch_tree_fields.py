from pathlib import Path
schema = Path('/home/ubuntu/onex-windows-rebuild/drizzle/schema.ts')
s = schema.read_text()
old = '''  id: int("id").autoincrement().primaryKey(),\n  legacyForm: varchar("legacyForm", { length: 160 }).notNull().unique(),\n  domainCode: varchar("domainCode", { length: 40 }).notNull(),\n  capability: varchar("capability", { length: 100 }).notNull(),'''
new = '''  id: int("id").autoincrement().primaryKey(),\n  screenNo: varchar("screenNo", { length: 40 }).notNull().default("SYS-0000"),\n  screenName: varchar("screenName", { length: 240 }).notNull().default("Legacy Window"),\n  parentId: varchar("parentId", { length: 160 }),\n  systemNo: varchar("systemNo", { length: 40 }).notNull().default("ONEX"),\n  itemType: varchar("itemType", { length: 40 }).notNull().default("FORM"),\n  formName: varchar("formName", { length: 160 }).notNull().default("LEGACY.fmx"),\n  displayOrder: int("displayOrder").notNull().default(0),\n  userPermission: varchar("userPermission", { length: 120 }).notNull().default("ROLE_USER"),\n  companyBranchPermission: varchar("companyBranchPermission", { length: 160 }).notNull().default("COMPANY_BRANCH_SCOPE"),\n  buildState: varchar("buildState", { length: 40 }).notNull().default("INDEXED"),\n  legacyForm: varchar("legacyForm", { length: 160 }).notNull().unique(),\n  domainCode: varchar("domainCode", { length: 40 }).notNull(),\n  capability: varchar("capability", { length: 100 }).notNull(),'''
if old not in s: raise SystemExit('schema marker missing')
schema.write_text(s.replace(old, new))

db = Path('/home/ubuntu/onex-windows-rebuild/server/db.ts')
s = db.read_text()
s = s.replace("const prefix = base.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || 'MISC';", "const prefix = base.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || 'MISC';")
old_tree = "groups.get(key)!.windows.push(row);"
new_tree = "groups.get(key)!.windows.push(row);"
# Replace the final response mapper with explicit requested field aliases.
old_return = "return Array.from(tree.values()).map((branch) => ({ ...branch, windows: branch.groups.reduce((sum: number, group: any) => sum + group.windows.length, 0), groups: branch.groups.sort((a: any, b: any) => a.label.localeCompare(b.label)).map((group: any) => ({ ...group, count: group.windows.length, windows: group.windows.map((win: any) => ({ ...win, buildState: win.status === 'in_progress' ? 'قيد البناء' : win.status === 'verified' ? 'متحقق' : win.status === 'spec_only' ? 'مواصفة' : 'مفهرس' })) })) }));"
new_return = "return Array.from(tree.values()).map((branch) => ({ ...branch, windows: branch.groups.reduce((sum: number, group: any) => sum + group.windows.length, 0), groups: branch.groups.sort((a: any, b: any) => a.label.localeCompare(b.label)).map((group: any) => ({ ...group, count: group.windows.length, windows: group.windows.map((win: any) => ({ ...win, screenNo: `SCR-${String(win.id).padStart(4, '0')}`, screenName: win.legacyForm.replace(/\\.fmx$/i, ''), parentId: group.id, systemNo: 'ONEX', itemType: 'FORM', formName: win.legacyForm, displayOrder: win.id, userPermission: win.domainCode === 'ADMIN/SYSTEM' ? 'ROLE_ADMIN' : 'ROLE_USER', companyBranchPermission: win.domainCode === 'POS' ? 'COMPANY_BRANCH_REQUIRED' : 'COMPANY_BRANCH_SCOPE', buildState: win.status === 'in_progress' ? 'قيد البناء' : win.status === 'verified' ? 'متحقق' : win.status === 'spec_only' ? 'مواصفة' : 'مفهرس' })) })) }));"
if old_return not in s: raise SystemExit('return marker missing')
db.write_text(s.replace(old_return, new_return))
print('patched schema and tree fields')
