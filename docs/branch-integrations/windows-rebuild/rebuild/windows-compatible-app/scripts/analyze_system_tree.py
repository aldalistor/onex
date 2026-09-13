from pathlib import Path
import csv, json
from collections import Counter, defaultdict
root = Path('/tmp/onex-src')
rows = list(csv.DictReader((root/'rebuild/docs/window_catalog.csv').open(encoding='utf-8')))
compat = {}
with (root/'rebuild/accounting_core/forms_compat/window_compatibility.csv').open(encoding='utf-8') as f:
    for row in csv.DictReader(f):
        compat[row.get('legacy_form') or row.get('form') or row.get('window') or row.get('LEGACY_FORM')] = row
categories = Counter((r['category'] or 'other').upper() for r in rows)
risks = Counter()
for row in rows:
    for risk in row.get('risks','').split(','):
        if risk.strip(): risks[risk.strip()] += 1
summary = {
    'total': len(rows),
    'categories': categories,
    'risks': risks.most_common(12),
    'sample_by_category': {cat: [r['file'] for r in rows if (r['category'] or 'other').upper() == cat][:12] for cat in categories},
    'compat_rows': len(compat),
}
Path('/tmp/onex-tree-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2, default=dict), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2, default=dict))
