#!/usr/bin/env python3
"""Fetch and parse original NIST SRD 8 and 126 tables, retaining raw bytes.
Python standard library only. --offline rebuilds from the included snapshots.
Dataset units: energy MeV, all mass coefficients cm^2/g. No invented rows.
"""
import argparse, concurrent.futures, datetime, hashlib, html, json, pathlib, re, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/raw'
BASE = 'https://physics.nist.gov'
CACHE = False
TABLE1 = BASE + '/PhysRefData/XrayMassCoef/tab1.html'
TABLE2 = BASE + '/PhysRefData/XrayMassCoef/tab2.html'
MATERIALS = [
 ('lead', 'Lead', 'رصاص', 'Pb', 82, 'z82', 'element'),
 ('aluminum', 'Aluminum', 'ألومنيوم', 'Al', 13, 'z13', 'element'),
 ('iron', 'Iron', 'حديد', 'Fe', 26, 'z26', 'element'),
 ('copper', 'Copper', 'نحاس', 'Cu', 29, 'z29', 'element'),
 ('tungsten', 'Tungsten', 'تنغستن', 'W', 74, 'z74', 'element'),
 ('water', 'Water, Liquid', 'ماء سائل', 'H2O', None, 'water', 'compound'),
 ('concrete', 'Concrete, Ordinary', 'خرسانة عادية مرجعية', 'Mix', None, 'concrete', 'mixture'),
 ('polyethylene', 'Polyethylene', 'بولي إيثيلين', 'PE', None, 'polyethylene', 'compound'),
 ('air', 'Air, Dry (near sea level)', 'هواء جاف مرجعي', 'Air', None, 'air', 'mixture'),
 ('graphite', 'Carbon, Graphite', 'كربون جرافيت', 'C', 6, 'z06', 'element'),
 ('silicon', 'Silicon', 'سيليكون', 'Si', 14, 'z14', 'element'),
]

def clean(s):
 return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

def rows(s):
 return [[clean(t) for t in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>', tr, re.I | re.S)] for tr in re.findall(r'<tr\b[^>]*>(.*?)</tr>', s, re.I | re.S)]

def fetch(key, url, fields=None, offline=False):
 path = RAW / (key + '.html')
 cached = CACHE and path.exists() and 'XCOM: Error' not in path.read_text(errors='replace')
 if not offline and not cached:
  data = urllib.parse.urlencode(fields).encode() if fields else None
  request = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0 RadiationShieldingLab/1.0 scientific-data-import'})
  for attempt in range(3):
   try:
    with urllib.request.urlopen(request, timeout=35) as response: payload = response.read()
    if len(payload) < 500: raise RuntimeError('Incomplete source response')
    path.write_bytes(payload)
    break
   except Exception:
    if attempt == 2: raise
 payload = path.read_bytes()
 return payload.decode('utf-8', errors='replace'), hashlib.sha256(payload).hexdigest()

def edge_sides(points):
 for i in range(1, len(points)):
  if points[i]['energyMeV'] == points[i-1]['energyMeV']:
   edge = points[i].get('edge', 'absorption edge')
   points[i-1].update(side='below', edge=edge)
   points[i].update(side='above', edge=edge)
 return points

def parse_srd(s):
 pre = re.search(r'<pre\b[^>]*>(.*?)</pre>', s, re.I | re.S)
 if not pre: raise ValueError('Expected NIST ASCII PRE table')
 points = []
 # Keep numeric rows and their preceding shell designation, not the duplicate HTML table.
 for line in html.unescape(re.sub(r'<[^>]+>', '', pre.group(1))).splitlines():
  m = re.fullmatch(r'\s*(?:(K|L\d|M\d|N\d)\s+)?([\d.]+E[+-]\d+)\s+([\d.]+E[+-]\d+)\s+([\d.]+E[+-]\d+)\s*', line)
  if m:
   p = dict(energyMeV=float(m[2]), total=float(m[3]), energyAbsorption=float(m[4]))
   if m[1]: p['edge'] = m[1]
   points.append(p)
 if len(points) < 35: raise ValueError(f'Incomplete SRD126 table: {len(points)} rows')
 return edge_sides(points)

def parse_xcom(s):
 points = []
 for r in rows(s):
  if len(r) != 9: continue
  try: vals = [float(t) for t in r[1:]]
  except ValueError: continue
  if not 0.001 <= vals[0] <= 20: continue
  p = dict(zip(['energyMeV','coherent','incoherent','photoelectric','pairNuclear','pairElectron','total','totalWithoutCoherent'], vals))
  if r[0]: p['edge'] = r[0]
  points.append(p)
 if len(points) < 35: raise ValueError(f'Incomplete XCOM response: {len(points)} rows; check raw response')
 return edge_sides(points)

def main():
 global CACHE
 parser = argparse.ArgumentParser(); parser.add_argument('--offline', action='store_true'); parser.add_argument('--reuse', action='store_true', help='Reuse successful raw snapshots and fetch missing/error responses'); args = parser.parse_args()
 CACHE = args.reuse
 RAW.mkdir(parents=True, exist_ok=True)
 table1, _ = fetch('nist-table1', TABLE1, offline=args.offline)
 table2, _ = fetch('nist-table2', TABLE2, offline=args.offline)
 element_rows = [[t for t in r if t] for r in rows(table1)]
 compound_rows = [[t for t in r if t] for r in rows(table2)]
 elements = {int(r[0]):r for r in element_rows if len(r) == 6 and r[0].isdigit()}
 compounds = {r[0]:r for r in compound_rows if len(r) == 5}
 retrieval = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
 old = ROOT / 'src/data/materials.json'
 if args.offline and old.exists(): retrieval = json.loads(old.read_text())['metadata']['retrievalDate']
 def material(spec):
  id, name, ar, symbol, z, slug, category = spec
  if z:
   density = float(elements[z][5]); composition = [dict(z=z, symbol=symbol, weightFraction=1.0)]; constant_source = TABLE1
  else:
   r = compounds[name]; density = float(r[3]); constant_source = TABLE2
   composition = [dict(z=int(a), symbol=elements[int(a)][1], weightFraction=float(b)) for a,b in re.findall(r'(\d+):\s*([\d.]+)', r[4])]
  srd_url = BASE + '/PhysRefData/XrayMassCoef/' + ('ElemTab/' if z else 'ComTab/') + slug + '.html'
  srd, sh = fetch('srd126-' + id, srd_url, offline=args.offline)
  fields = dict(OutOpt='PIC', Graph0='on', NumAdd='1', Energies='0.05954\n0.122\n0.511\n0.662\n1.173\n1.333', Output='on', WindowXmin='0.001', WindowXmax='20', ResizeFlag='on')
  if z: fields['ZNum'] = str(z); endpoint = '/cgi-bin/Xcom/xcom3_1'
  else:
   fields['Name'] = id
   fields['Formulae'] = '\n'.join(f"{c['symbol']} {c['weightFraction']:.6f}" for c in composition)
   endpoint = '/cgi-bin/Xcom/xcom3_3'
  xcom, xh = fetch('xcom-' + id, BASE + endpoint, fields, args.offline)
  # Retain the original successful response title when --reuse/--offline is used.
  title = re.search(r'name="Name" value="([^"]*)"', xcom, re.I)
  if title and 'Name' in fields: fields['Name'] = html.unescape(title[1])
  datasets = {}
  for source, text, sha, url, version, parse in [
    ('srd126',srd,sh,srd_url,'SRD 126; data content July 2004',parse_srd),
    ('xcom',xcom,xh,BASE+endpoint,'SRD 8 online response snapshot; response provides no release identifier',parse_xcom)]:
   points = parse(text)
   datasets[source] = dict(source=source,sourceUrl=url,version=version,retrievalDate=retrieval,rangeMeV=[points[0]['energyMeV'], points[-1]['energyMeV']],units='cm²/g',points=points,rawFile=f'data/raw/{source}-{id}.html',sha256=sha,status='imported from original NIST response')
   if source == 'xcom': datasets[source]['request'] = fields
  print(id, 'SRD126',len(datasets['srd126']['points']),'XCOM',len(datasets['xcom']['points']),flush=True)
  return dict(id=id,name=name,nameAr=ar,symbol=symbol,category=category,density=density,densitySource=constant_source,densityNote='NIST reference density; some values are nominal. Not a measurement of the user sample. Change density to match sample conditions.',composition=composition,compositionSource=constant_source,datasets=datasets)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor: materials = list(executor.map(material, MATERIALS))
 metadata = dict(retrievalDate=retrieval,description='Traceable subset of NIST SRD 8 and SRD 126 photon data; no energy extrapolation.',materialCount=len(materials),pointCount=sum(len(d['points']) for m in materials for d in m['datasets'].values()),pointDefinition='One energy row in one material/source table; pre/post edge rows counted separately; both source families counted.',energyDomainMeV=[0.001,20],license='NIST SRD copyright retained; source code MIT does not relicense these data. See DATA_LICENSE.md.',excludedMaterials=[dict(name='Stainless steel',reason='No alloy grade/assay specified; no assumed industrial composition.')])
 output = dict(metadata=metadata, materials=materials)
 old.write_text(json.dumps(output,indent=2,ensure_ascii=False)+'\n')
 ROOT.joinpath('data/materials.json').write_text(json.dumps(output,indent=2,ensure_ascii=False)+'\n')
 print(json.dumps(metadata,ensure_ascii=False,indent=2))

if __name__ == '__main__': main()
