from pathlib import Path
import csv
root=Path(__file__).resolve().parents[1]
assert (root/'README_AR.md').stat().st_size>1000
with (root/'docs/window_catalog.csv').open(encoding='utf-8') as f: rows=list(csv.DictReader(f))
assert len(rows)>1000
with (root/'docs/function_traceability.csv').open(encoding='utf-8') as f: traces=list(csv.DictReader(f))
assert len(traces)>100
assert len(list((root/'oracle_forms/modules').glob('*.spec.md')))>=10
assert len(list((root/'rebuild_source/forms/all_window_specs').glob('*.rebuild.md')))==len(rows)
assert (root/'rebuild_source/manifests/all_windows_rebuild_status.csv').stat().st_size>1000
assert len(list((root/'rebuild_source/generated_code/plsql_specs').glob('*.pks.sql')))==len(rows)
assert len(list((root/'rebuild_source/generated_code/plsql_bodies').glob('*.pkb.sql')))==len(rows)
assert len(list((root/'rebuild_source/generated_code/forms_triggers').glob('*.triggers.sql')))==len(rows)
assert (root/'rebuild_source/generated_code/metadata/generated_code_manifest.csv').stat().st_size>1000
print({'windows':len(rows),'trace_records':len(traces),'module_specs':len(list((root/'oracle_forms/modules').glob('*.spec.md')))})
