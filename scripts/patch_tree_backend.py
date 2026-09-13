from pathlib import Path

db = Path('/home/ubuntu/onex-windows-rebuild/server/db.ts')
text = db.read_text()
needle = 'export async function getWindowDomains() {\n'
insert = '''export async function getSystemTree() {\n  const db = await getDb();\n  if (!db) return [];\n  const rows = await db.select().from(windowRegistry).orderBy(windowRegistry.domainCode, windowRegistry.legacyForm);\n  const categoryLabels: Record<string, string> = {\n    'AR/ACCOUNTS-RECEIVABLE': 'الذمم المدينة والمبيعات', 'AP/PURCHASING': 'المشتريات والدائنون', 'GL/FINANCE': 'الحسابات العامة والمالية',\n    'INVENTORY/STOCK': 'المخزون والمستودعات', 'MRP/TREASURY': 'التخطيط والخزينة', 'POS': 'نقاط البيع', 'HR': 'الموارد البشرية',\n    'ADMIN/SYSTEM': 'الإدارة وإعدادات النظام', 'ASSETS/MAINTENANCE': 'الأصول والصيانة', 'OTHER-FINANCE/OPERATIONS': 'العمليات المالية', 'REPORTS': 'التقارير', 'OTHER': 'نوافذ أخرى'\n  };\n  const groups = new Map<string, { id: string; label: string; domain: string; windows: typeof rows }>();\n  for (const row of rows) {\n    const domain = row.domainCode;\n    const base = row.legacyForm.replace(/\\.fmx$/i, '');\n    const prefix = base.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || 'MISC';\n    const key = `${domain}::${prefix}`;\n    if (!groups.has(key)) groups.set(key, { id: key, label: prefix, domain, windows: [] });\n    groups.get(key)!.windows.push(row);\n  }\n  const tree = new Map<string, { id: string; label: string; domain: string; groups: { id: string; label: string; windows: typeof rows }[] }>();\n  for (const group of groups.values()) {\n    if (!tree.has(group.domain)) tree.set(group.domain, { id: group.domain, label: categoryLabels[group.domain] || group.domain, domain: group.domain, groups: [] });\n    tree.get(group.domain)!.groups.push(group);\n  }\n  return [...tree.values()].map((branch) => ({ ...branch, windows: branch.groups.reduce((sum, group) => sum + group.windows.length, 0), groups: branch.groups.sort((a, b) => a.label.localeCompare(b.label)).map((group) => ({ ...group, count: group.windows.length, windows: group.windows.map((win) => ({ ...win, buildState: win.status === 'in_progress' ? 'قيد البناء' : win.status === 'verified' ? 'متحقق' : win.status === 'spec_only' ? 'مواصفة' : 'مفهرس' })) })) }));\n}\n\n'''
if 'export async function getSystemTree()' not in text:
    text = text.replace(needle, insert + needle)
db.write_text(text)

routers = Path('/home/ubuntu/onex-windows-rebuild/server/routers.ts')
rtext = routers.read_text()
rtext = rtext.replace('createInvoice, getDashboard, getMasterData, getWindowCatalog, getWindowDomains, postInvoice, reverseInvoice', 'createInvoice, getDashboard, getMasterData, getSystemTree, getWindowCatalog, getWindowDomains, postInvoice, reverseInvoice')
rtext = rtext.replace('domains: publicProcedure.query(() => getWindowDomains()),', 'domains: publicProcedure.query(() => getWindowDomains()),\n    tree: publicProcedure.query(() => getSystemTree()),')
routers.write_text(rtext)
print('patched backend tree routes')
