from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/server/db.ts')
s = p.read_text()
s = s.replace('branch.groups.reduce((sum, group) =>', 'branch.groups.reduce((sum: number, group: any) =>')
s = s.replace('branch.groups.sort((a, b) =>', 'branch.groups.sort((a: any, b: any) =>')
s = s.replace('.map((group) => ({ ...group, count:', '.map((group: any) => ({ ...group, count:')
s = s.replace('group.windows.map((win) => ({ ...win, buildState:', 'group.windows.map((win: any) => ({ ...win, buildState:')
p.write_text(s)
print('fixed tree types')
