from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/client/src/pages/Home.tsx')
s = p.read_text().replace('</div>})}</div></div><div className="window-detail">', '</div>})}</div><div className="window-detail">')
p.write_text(s)
print('fixed tree JSX nesting')
