from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/server/db.ts')
s = p.read_text().replace('for (const group of groups.values()) {', 'for (const group of Array.from(groups.values())) {').replace('return [...tree.values()].map((branch)', 'return Array.from(tree.values()).map((branch)')
p.write_text(s)
print('fixed map iteration')
