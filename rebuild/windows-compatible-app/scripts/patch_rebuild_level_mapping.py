from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/server/db.ts')
s = p.read_text()
old = "buildState: win.status === 'in_progress' ? 'قيد البناء' : win.status === 'verified' ? 'متحقق' : win.status === 'spec_only' ? 'مواصفة' : 'مفهرس'"
new = "buildState: win.rebuildLevel === 'golden_master_verified' || win.rebuildLevel === 'production_ready' ? 'متحقق' : win.rebuildLevel === 'source_reconstruction' || win.rebuildLevel === 'forms_builder_build' ? 'قيد البناء' : win.rebuildLevel === 'catalog_specification' ? 'مواصفة' : (win.status === 'verified' ? 'متحقق' : 'مفهرس')"
if old not in s: raise SystemExit('mapping marker missing')
p.write_text(s.replace(old, new))
print('patched rebuild level mapping')
