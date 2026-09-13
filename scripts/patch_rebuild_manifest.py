from pathlib import Path
schema = Path('/home/ubuntu/onex-windows-rebuild/drizzle/schema.ts')
s = schema.read_text()
marker = '  buildState: varchar("buildState", { length: 40 }).notNull().default("INDEXED"),\n'
addition = '''  compiledSize: int("compiledSize").notNull().default(0),\n  rebuildLevel: varchar("rebuildLevel", { length: 60 }).notNull().default("catalog_specification"),\n  sourceStatus: varchar("sourceStatus", { length: 80 }).notNull().default("FMB_PLL_not_found"),\n  observedProcedures: int("observedProcedures").notNull().default(0),\n  observedTriggers: int("observedTriggers").notNull().default(0),\n  observedLibraries: int("observedLibraries").notNull().default(0),\n  observedTableIndicators: int("observedTableIndicators").notNull().default(0),\n  riskFlags: text("riskFlags"),\n  specPath: varchar("specPath", { length: 240 }),\n  nextRequiredEvidence: varchar("nextRequiredEvidence", { length: 240 }),\n'''
if 'compiledSize: int("compiledSize")' not in s:
    if marker not in s: raise SystemExit('schema marker missing')
    s = s.replace(marker, marker + addition)
schema.write_text(s)

imp = Path('/home/ubuntu/onex-windows-rebuild/scripts/import_rebuild_manifest.mjs')
imp.write_text(r'''import fs from "node:fs/promises";
import mysql from "mysql2/promise";

function parseCsvLine(line) {
  const out = []; let value = ""; let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (quoted && line[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (ch === ',' && !quoted) { out.push(value); value = ""; }
    else value += ch;
  }
  out.push(value); return out;
}
const csv = await fs.readFile("/tmp/all_windows_rebuild_status.csv", "utf8");
const lines = csv.trim().split(/\r?\n/);
const headers = parseCsvLine(lines.shift());
const rows = lines.map(line => Object.fromEntries(parseCsvLine(line).map((v, i) => [headers[i], v])));
const db = await mysql.createConnection(process.env.DATABASE_URL);
for (const row of rows) {
  await db.execute(`UPDATE window_registry SET compiledSize=?, rebuildLevel=?, sourceStatus=?, observedProcedures=?, observedTriggers=?, observedLibraries=?, observedTableIndicators=?, riskFlags=?, specPath=?, nextRequiredEvidence=? WHERE legacyForm=?`, [
    Number(row.compiled_size || 0), row.rebuild_level, row.source_status, Number(row.observed_procedures || 0), Number(row.observed_triggers || 0), Number(row.observed_libraries || 0), Number(row.observed_table_indicators || 0), row.risk_flags || null, row.spec_path || null, row.next_required_evidence || null, row.window
  ]);
}
const [result] = await db.query("SELECT COUNT(*) AS count, SUM(observedProcedures) AS procedures, SUM(observedTriggers) AS triggers FROM window_registry");
console.log(JSON.stringify(result[0]));
await db.end();
''')
print('patched rebuild manifest schema/importer')
