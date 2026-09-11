from pathlib import Path
import csv
root=Path(__file__).resolve().parents[1]
assert (root/'README_AR.md').stat().st_size>1000
with (root/'docs/window_catalog.csv').open(encoding='utf-8') as f: rows=list(csv.DictReader(f))
assert len(rows)>1000
with (root/'docs/function_traceability.csv').open(encoding='utf-8') as f: traces=list(csv.DictReader(f))
assert len(traces)>100
assert len(list((root/'oracle_forms/modules').glob('*.spec.md')))>=10
print({'windows':len(rows),'trace_records':len(traces),'module_specs':len(list((root/'oracle_forms/modules').glob('*.spec.md')))})
