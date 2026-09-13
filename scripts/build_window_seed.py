from pathlib import Path
import csv

source = Path('/tmp/onex-src/rebuild/docs/window_catalog.csv')
out = Path('/tmp/onex-window-catalog.sql')
def esc(value: str) -> str:
    return value.replace("'", "''")
rows = []
with source.open(encoding='utf-8', newline='') as handle:
    for row in csv.DictReader(handle):
        form = row['file']
        category = row['category'].upper() or 'OTHER'
        capability = {'AR': 'AR_DOCUMENTS', 'AP': 'AP_DOCUMENTS', 'GL': 'GL_JOURNALS', 'INVENTORY': 'INVENTORY_STOCK', 'POS': 'POS_OPERATIONS'}.get(category, category + '_WINDOW')
        status = 'in_progress' if form.upper().startswith('ARST004') else 'cataloged'
        phase = 1 if status == 'in_progress' else (2 if category in {'AR', 'AP', 'GL'} else 3)
        notes = f"Imported from Onyx catalog; evidence: FMX_STRING_EVIDENCE; SQL-like refs: {row.get('sql_like','0')}; triggers: {row.get('triggers','0')}"
        rows.append(f"('{esc(form)}','{esc(category)}','{esc(capability)}',{phase},'{status}','FMX_STRING_EVIDENCE','{esc(notes)}')")
chunks = [rows[i:i+150] for i in range(0, len(rows), 150)]
with out.open('w', encoding='utf-8') as handle:
    for chunk in chunks:
        handle.write('INSERT INTO `window_registry` (`legacyForm`,`domainCode`,`capability`,`migrationPhase`,`status`,`sourceConfidence`,`notes`) VALUES\n')
        handle.write(',\n'.join(chunk))
        handle.write(';\n')
print(out)
print(len(rows))
