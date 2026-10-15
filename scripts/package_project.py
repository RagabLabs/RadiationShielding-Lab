#!/usr/bin/env python3
"""Package source/build without dependencies, Git internals or QA rasters.
Run after npm run build and verification. Output is outside the source tree.
"""
import hashlib,json,pathlib,shutil,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'output'
EXCLUDED={'node_modules','.git','.standalone','.vite','test-results','pdf-qa','playwright-html','__pycache__'}
def main():
 OUT.mkdir(exist_ok=True)
 source=OUT/'RadiationShielding-Lab-v1.0.0.zip'
 files=[]
 for path in sorted(ROOT.rglob('*')):
  if not path.is_file():continue
  rel=path.relative_to(ROOT)
  if any(part in EXCLUDED for part in rel.parts) or path.name.endswith(('.tsbuildinfo','.pyc')):continue
  files.append((path,rel))
 with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
  for path,rel in files:archive.write(path,str(pathlib.Path('RadiationShielding-Lab')/rel))
 build=OUT/'RadiationShielding-Lab-production-v1.0.0.zip'
 with zipfile.ZipFile(build,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
  for path in sorted((ROOT/'dist').rglob('*')):
   if path.is_file():archive.write(path,str(path.relative_to(ROOT)))
 shutil.copyfile(ROOT/'START-HERE.html',OUT/'START-HERE.html')
 shutil.copyfile(ROOT/'reports/validation-review.pdf',OUT/'validation-review.pdf')
 for path in [source,build]:
  with zipfile.ZipFile(path) as archive:
   assert archive.testzip() is None, 'Archive CRC failure'
   names=archive.namelist()
   assert not any('/node_modules/' in n or '/.git/' in n or '/pdf-qa/' in n for n in names)
 with zipfile.ZipFile(source) as archive:
  for path,rel in files:assert hashlib.sha256(archive.read(str(pathlib.Path('RadiationShielding-Lab')/rel))).digest()==hashlib.sha256(path.read_bytes()).digest()
 manifest=[dict(name=p.name,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for p in [source,build,OUT/'START-HERE.html',OUT/'validation-review.pdf']]
 (OUT/'checksums.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(json.dumps(dict(sourceFiles=len(files),deliverables=manifest),indent=2))
if __name__=='__main__':main()
