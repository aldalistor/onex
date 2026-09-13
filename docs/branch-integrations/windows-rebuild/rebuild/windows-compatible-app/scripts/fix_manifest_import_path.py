from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/scripts/import_rebuild_manifest.mjs')
s = p.read_text().replace('await fs.readFile("/tmp/all_windows_rebuild_status.csv", "utf8")', 'await fs.readFile(new URL("../rebuild-manifest/all_windows_rebuild_status.csv", import.meta.url), "utf8")')
p.write_text(s)
print('fixed manifest import path')
