#!/usr/bin/env python3
import csv, hashlib, json, re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path('/tmp/fmx-review/core/YS_ERP/Forms')
OUT = Path('/tmp/fmx-review/analysis'); OUT.mkdir(parents=True, exist_ok=True)
CORE = {'ERP_LOGIN','ERP_DBA','POSLGN','GLST001','GLST002','ARST003','APST003','INVT003','MRPACS004','YSERP_MNU','IASMENU'}

def strings(path):
    raw = path.read_bytes(); out=[]; seen=set()
    patterns=[(rb'[ -~]{4,}', 'latin1'),(rb'(?:[\x20-\x7e]\x00){4,}', 'utf-16le')]
    for pat, enc in patterns:
        for m in re.findall(pat,raw):
            s=m.decode(enc,'ignore')
            s=re.sub(r'\s+',' ',s).strip()
            if s and s not in seen:
                seen.add(s); out.append(s)
    return out

def unique(pattern, text, flags=re.I):
    return sorted(set(x.strip() for x in re.findall(pattern,text,flags) if x.strip()), key=str.lower)

def classify(n):
    u=n.upper()
    rules=[('admin/system',r'^(ERP_|ADMI|ADMQ|ADMR|ADMT|ADMHR|ADMIN|ALRT)'),('GL/finance',r'^(GL|FNG|IAS_GL)'),('AR/accounts-receivable',r'^AR'),('AP/purchasing',r'^AP'),('inventory/stock',r'^(INV|INVT|INVI)'),('MRP/treasury',r'^(MRP|TR|TRE)'),('HR',r'^(HR)'),('POS',r'^(POS)'),('assets/maintenance',r'^(AM|AMS|AMST)'),('reports',r'^(REP|RPT)')]
    for c,p in rules:
        if re.search(p,u): return c
    return 'other'

def analyze(p):
    ss=strings(p); text='\n'.join(ss); u=text.upper()
    libraries=unique(r'/([A-Z][A-Z0-9_$#]*)',text)
    # Namespaces and program units encoded in FMX strings.
    programs=unique(r'/((?:NSPC|[A-Z_]*LIB)[A-Z0-9_$#_/]*)',text)
    triggers=unique(r'/(NSPC[^ ]+|[^ ]*(?:PRE_FORM|POST_FORMS|WHEN_NEW|EXIT_PROC)[^ ]*)',text)
    sql=unique(r'\b(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+(.{0,240}?)(?=(?:SELECT|INSERT|UPDATE|DELETE|CREATE|"|$))',text)
    table_names=unique(r'\b(?:FROM|JOIN|INTO|UPDATE)\s+([A-Z][A-Z0-9_$#]*)',u)
    referenced=unique(r'\b([A-Z][A-Z0-9_$#_]*(?:\.F?MX|\.RDF|\.PLX|\.PLL|\.MMX))\b',text)
    # Common form item/block names and UI labels.
    items=unique(r'\b(?:[A-Z][A-Z0-9_$#]*\.)?[A-Z][A-Z0-9_$#]{2,}\b',u)
    stop={'STANDARD','FORMS40','FORMS4C','FORMS4G','FORMS4W','SQLFORMS','PUBLIC','DATABASE','SELECT','FROM','WHERE','AND','ORDER','BY','CREATE','UPDATE','INSERT','INTO','DELETE','NULL','TRUE','FALSE','GEN_PKG','FUNC_PKG','PKG','INIT','LINE','SQL','STATEMENT','CURSOR'}
    items=[x for x in items if x not in stop and not re.match(r'^P\d+_',x) and len(x)<80][:500]
    return {'id':p.stem,'file':str(p.relative_to(ROOT)),'category':classify(p.stem),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'string_count':len(ss),'libraries':libraries[:100],'program_units':programs[:100],'triggers_and_handlers':triggers[:100],'table_references':table_names[:300],'sql_fragments':sql[:100],'artifact_references':referenced[:100],'candidate_items_and_blocks':items,'all_strings':ss[:800]}

files=sorted(ROOT.glob('*.fmx'),key=lambda p:p.name.lower())
rows=[]
for i,p in enumerate(files,1):
    rows.append(analyze(p))
    if i%100==0: print(f'processed {i}/{len(files)}')
(OUT/'fmx_windows.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
core=[x for x in rows if x['id'].upper() in CORE or x['id'].upper().startswith(('ERP_','POSLGN'))]
(OUT/'fmx_core_windows.json').write_text(json.dumps(core,ensure_ascii=False,indent=2),encoding='utf-8')
# Flat normalized outputs for downstream import.
with (OUT/'fmx_window_summary.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f); w.writerow(['id','file','category','bytes','string_count','libraries','program_units','triggers','table_references','sql_fragments','items'])
    for x in rows:
        w.writerow([x['id'],x['file'],x['category'],x['bytes'],x['string_count'],';'.join(x['libraries']),';'.join(x['program_units']),';'.join(x['triggers_and_handlers']),';'.join(x['table_references']),len(x['sql_fragments']),len(x['candidate_items_and_blocks'])])
# Build direct edges based on shared libraries/tables and explicit artifact names.
edges=set(); bylib=defaultdict(list); bytable=defaultdict(list)
for x in rows:
    for v in x['libraries']:
        bylib[v].append(x['id'])
    for v in x['table_references']:
        bytable[v].append(x['id'])
for group,rel in [(bylib,'shared_library'),(bytable,'shared_table_reference')]:
    for key,ids in group.items():
        ids=sorted(set(ids))
        if len(ids)>80: continue
        for a in ids:
            for b in ids:
                if a<b: edges.add((a,b,rel,key))
with (OUT/'fmx_navigation_edges.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f); w.writerow(['source','target','relation','evidence']); w.writerows(sorted(edges))
modules=defaultdict(lambda:{'windows':0,'bytes':0,'tables':Counter(),'libraries':Counter(),'triggers':Counter()})
for x in rows:
    m=modules[x['category']]; m['windows']+=1; m['bytes']+=x['bytes']
    m['tables'].update(x['table_references']); m['libraries'].update(x['libraries']); m['triggers'].update(x['triggers_and_handlers'])
module_rows=[]
for k,v in sorted(modules.items()): module_rows.append({'module':k,'windows':v['windows'],'bytes':v['bytes'],'top_tables':v['tables'].most_common(20),'top_libraries':v['libraries'].most_common(20),'top_triggers':v['triggers'].most_common(20)})
(OUT/'fmx_module_summary.json').write_text(json.dumps(module_rows,ensure_ascii=False,indent=2),encoding='utf-8')
summary={'forms':len(rows),'core_forms':len(core),'navigation_edges':len(edges),'modules':{k:v['windows'] for k,v in modules.items()},'core_ids':[x['id'] for x in core]}
(OUT/'fmx_summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
