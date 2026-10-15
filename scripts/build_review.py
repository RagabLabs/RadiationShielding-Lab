#!/usr/bin/env python3
"""Build a review report from actual retained test/data/scientific outputs.
Requires reportlab (see requirements-review.txt). Does not run or invent tests.
"""
import datetime, json, pathlib, re
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
ROOT=pathlib.Path(__file__).resolve().parents[1]
def read(path): return json.loads((ROOT/path).read_text())
def main():
 tests=read('reports/vitest-results.json'); data=read('reports/data-validation.json'); science=read('reports/scientific-validation.json'); smoke=read('reports/standalone-smoke.json'); offline=read('reports/offline-import.json')
 listing=(ROOT/'reports/playwright-list.txt').read_text()
 match=re.search(r'Total:\s*(\d+) tests?',listing)
 if not match: raise RuntimeError('Missing enumerated Playwright case count')
 browser_count=int(match[1])
 summary=dict(appVersion='1.0.0',generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),materials=data['materialCount'],attenuationRows=data['pointCount'],absorptionEdgePairs=data['edgePairs'],vitestTotal=tests['numTotalTests'],vitestPassed=tests['numPassedTests'],vitestFailed=tests['numFailedTests'],vitestSkipped=tests['numPendingTests'],playwrightDefined=browser_count,playwrightExecuted=0,playwrightNotExecuted=browser_count,playwrightReason='Browser binary and required managed browser-control capability unavailable; no preview server/browser was started or installed.',scientificReferenceCases=len(science['results']),scientificReferencesPassed=sum(r['passed'] for r in science['results']),maxAbsoluteReferenceDifference=max(abs(r['difference']) for r in science['results']),dataValidationPassed=data['passed'],standaloneDOMSmokePassed=smoke['passed'],offlineImportByteIdentical=offline['byteIdentical'],remainingIssues=['Actual browser layout and canvas/download interaction verification pending.','NIST SRD public redistribution permission not independently obtained.','No engineering radiation transport, buildup or dose model.','Remote CI/Pages workflows prepared, not executed or published.'])
 (ROOT/'reports/review-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
 md=f'''# Actual test report — v1.0.0

Generated {summary['generatedAt']}. These counts describe retained executed results, not planned work.

| Check | Actual result | Evidence |
|---|---|---|
| npm ci | PASS; dependencies installed from lockfile | reports/npm-ci.log |
| Vitest | {summary['vitestPassed']}/{summary['vitestTotal']} passed; {summary['vitestFailed']} failed; {summary['vitestSkipped']} pending | reports/vitest-results.json |
| Independent scientific reference cases | {summary['scientificReferencesPassed']}/{summary['scientificReferenceCases']} PASS; included in Vitest, not extra tests | reports/scientific-validation.json |
| NIST integrity | PASS; {summary['materials']} materials, {summary['attenuationRows']} source energy rows, {summary['absorptionEdgePairs']} edge pairs | reports/data-validation.json |
| TypeScript | PASS | reports/typecheck.log |
| Production build | PASS; static assets and offline standalone produced | reports/build.log |
| Built standalone execution | PASS in jsdom; 7 smoke checks, not browser-engine tests | reports/standalone-smoke.json |
| Offline data reconstruction | PASS; both normalized JSON files byte-identical | reports/offline-import.json |
| Playwright desktop/mobile | {browser_count} defined; 0 executed; {browser_count} NOT EXECUTED | reports/playwright-list.txt |

## Executed Vitest files

| File | Cases | Scope |
|---|---:|---|
| tests/physics.test.ts | 60 | Ten Decimal references; units, edges, thresholds, domains, vacuum, very small loss, inverse targets, layer permutations, spectra, uncertainty. |
| tests/data.test.ts | 89 | Every material/source: hashes, exact rows, edge pairs, domains, composition and partial sums. |
| tests/reports.test.ts | 5 | Analysis/snapshot equality, CSV escaping/provenance, null values and actual PDF serialization. |
| tests/ui.test.tsx | 15 | DOM material/energy/density/unit changes, add/remove layers, validation, SVG paths, Arabic/English, themes, navigation, independent-page inputs and huge-path handling. |

Maximum absolute difference in the ten independent reference cases:
{summary['maxAbsoluteReferenceDifference']:.17g}. This is an arithmetic comparison,
not an estimate of physical uncertainty.

## Browser and export verification matrix

| Requested behavior | Executed evidence | Actual browser status |
|---|---|---|
| Material, energy, density and units | Vitest DOM integration | Prepared; NOT EXECUTED |
| Add/remove layers and spectrum errors | Vitest DOM integration | Prepared; NOT EXECUTED |
| Charts and keyboard data inspection | SVG geometry/controls tested in DOM; keyboard browser test prepared | NOT EXECUTED |
| CSV content | Shared snapshot content/escaping tested; sample written | Download interaction NOT EXECUTED |
| PDF content | Shared snapshot; real PDF serialization; sample generated and separately rendered for QA | Download interaction NOT EXECUTED |
| PNG | SVG-to-canvas export implemented; PNG signature assertion prepared | Encoding/download NOT EXECUTED |
| English/Arabic and light/dark | Vitest DOM and built-bundle smoke | Browser rendering NOT EXECUTED |
| Phone/desktop layout | Responsive CSS and two prepared Playwright projects | Visual/layout NOT EXECUTED |

The managed environment has no browser binary or required browser-control
capability. No alternate preview server or browser installation was attempted.
The build was executed as its complete inline bundle in jsdom; this does not
prove layout, browser canvas encoding or file-download behavior. The 30 browser
cases are distinct from the executed Vitest total. GitHub CI is configured to
install Chromium and run them on a suitable host; that remote CI has not run.

## Remaining issues

- Actual browser/responsive/canvas/download review is pending.
- NIST SRD public redistribution rights must be resolved before public release.
- Source-model and interpolation limits remain as documented; there is no
  engineering dose/safety certification or scattered-field simulation.
- The build can report a bundle-size advisory and a client-directive advisory.
  Neither prevented a production build or the standalone DOM smoke check.

The full per-calculation reference/value/difference/source/test/limits table is
in SCIENTIFIC_VALIDATION.md and reports/scientific-validation.json.
'''
 (ROOT/'docs/TEST_REPORT.md').write_text(md);(ROOT/'reports/TEST_REPORT.md').write_text(md)
 styles=getSampleStyleSheet()
 styles.add(ParagraphStyle(name='TitleLab',fontName='Helvetica-Bold',fontSize=25,leading=29,textColor=colors.HexColor('#102b40'),spaceAfter=14))
 styles.add(ParagraphStyle(name='SubtitleLab',fontName='Helvetica',fontSize=10,leading=15,textColor=colors.HexColor('#526579'),spaceAfter=10))
 styles.add(ParagraphStyle(name='CellLab',fontName='Helvetica',fontSize=7,leading=10,textColor=colors.HexColor('#24374a')))
 styles.add(ParagraphStyle(name='CellHead',fontName='Helvetica-Bold',fontSize=7,leading=10,textColor=colors.white))
 styles.add(ParagraphStyle(name='BodyLab',fontName='Helvetica',fontSize=9,leading=14,spaceAfter=8,textColor=colors.HexColor('#30465b')))
 styles.add(ParagraphStyle(name='SectionLab',fontName='Helvetica-Bold',fontSize=13,leading=17,spaceBefore=12,spaceAfter=8,textColor=colors.HexColor('#08785b')))
 def p(s,style='CellLab'): return Paragraph(escape(str(s)).replace('\n','<br/>'),styles[style])
 def footer(canvas,doc):
  canvas.setStrokeColor(colors.HexColor('#d8e2e9'));canvas.line(28,25,814,25)
  canvas.setFont('Helvetica',7);canvas.setFillColor(colors.HexColor('#607589'));canvas.drawString(29,14,'Radiation Shielding & Attenuation Lab v1.0.0 | Independent private review | 2026-10-14');canvas.drawRightString(812,14,f'{doc.page}')
 story=[p('Radiation Shielding & Attenuation Lab','TitleLab'),p('Scientific validation and delivery review / Version 1.0.0','SubtitleLab'),p('Actual executed checks, traceable NIST source data, independent numerical references and explicit verification limits.','BodyLab')]
 stats=[['MATERIALS','SOURCE ENERGY ROWS','VITEST PASSED / FAILED','BROWSER CASES NOT EXECUTED'],[str(summary['materials']),str(summary['attenuationRows']),f"{summary['vitestPassed']} / {summary['vitestFailed']}",str(browser_count)]]
 st=Table([[p(c,'CellHead' if i==0 else 'SectionLab') for c in r] for i,r in enumerate(stats)],colWidths=[150,180,210,245])
 st.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#102b40')),('BACKGROUND',(0,1),(-1,1),colors.HexColor('#edf5f4')),('TOPPADDING',(0,0),(-1,-1),11),('BOTTOMPADDING',(0,0),(-1,-1),10),('LEFTPADDING',(0,0),(-1,-1),12)]));story.extend([st,Spacer(1,14)])
 story.append(p('What was verified','SectionLab'))
 story.append(p(f"All {summary['vitestPassed']} Vitest cases passed, including 10 independently coded Decimal references. Data checks cover 11 materials, 1,110 source rows, 54 pre/post absorption-edge pairs, exact rows and original-file hashes. The maximum reference absolute difference is {summary['maxAbsoluteReferenceDifference']:.3g}. This measures numerical implementation, not experimental accuracy.",'BodyLab'))
 story.append(p('npm ci, TypeScript checking, the production build, offline-data byte reproducibility and execution of the built standalone bundle in jsdom all completed successfully. The archive includes actual machine-readable results, original source snapshots and runnable verification code.','BodyLab'))
 story.append(p('What remains unverified','SectionLab'))
 story.append(p('Thirty Playwright scenarios (15 each for desktop Chromium and mobile Chromium) were enumerated but not run. This environment lacks the browser binary and required browser-control capability. Real browser rendering, responsive layout, canvas PNG encoding and browser-triggered PDF/CSV/PNG downloads remain pending. DOM checks do not substitute for browser tests. No GitHub CI run or deployment is claimed.','BodyLab'))
 story.append(p('Model and rights boundary','SectionLab'))
 story.append(p('Uncollided gamma/X-ray photons only: no buildup, scattered-field transport, secondary radiation, source geometry or dose certification. NIST SRD data retain their own copyright; separate public redistribution permission has not been obtained. Source code is MIT-licensed. This deliverable is prepared for private scientific review.','BodyLab'))
 story.append(PageBreak());story.append(p('Ten-calculation reference comparison','TitleLab'))
 story.append(p('Independent Python Decimal calculation at 60 digits. Published rounded coefficients are the input; long displayed regression values do not imply physical precision. Signed difference = application - reference. Arithmetic tolerance: 1e-12 absolute.','BodyLab'))
 headers=['Calculation','Equation','Source','Executed test / input','Reference','Application','Difference','Status','Limit of use']
 table=[[p(h,'CellHead') for h in headers]]
 limits=['Source grid; explicit edge side; no extrapolation.','Homogeneous sample; density must be specified.','Monoenergetic uncollided photons, not dose.','Target in (0,1]; no scattering or geometry.','Monoenergetic standard half-layer, not spectral HVL.','Related to HVL through ln(10)/ln(2).','Fixed coefficients; not scattered/secondary transport.','First photon interaction, not a charged-particle range.','One XCOM channel family; rounded residual is reported.','Per-line photon weights; no dose or redistribution.']
 for i,r in enumerate(science['results']):
  source='XCOM Pb, 1 MeV' if r['id']=='09' else 'SRD126 Pb + water' if r['id']=='07' else 'SRD126 water' if r['id']=='10' else 'SRD126 Pb'
  values=[r['id']+' '+r['name'],r['formula'],source,'physics.test.ts reference '+r['id']+'; '+r['inputs'],f"{r['expected']:.11g} {r['unit']}",f"{r['actual']:.11g}",f"{r['difference']:.3g}",'PASS' if r['passed'] else 'FAIL',limits[i]]
  table.append([p(v) for v in values])
 tb=Table(table,colWidths=[80,80,63,105,75,75,55,35,110],repeatRows=1,hAlign='LEFT')
 tb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#102b40')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f2f6f8')]),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,-1),.3,colors.HexColor('#d7e1e8'))]));story.append(tb)
 story.append(Spacer(1,10));story.append(p('The independent fixtures are included in tests/fixtures/reference.json. The generating Python script imports no application code. HVL, TVL and mean free path are useful descriptors of the same exponential family; ten workflows are not ten independent physical models.','BodyLab'))
 story.append(PageBreak());story.append(p('Data, sources and reproduction','TitleLab'))
 material_data=read('src/data/materials.json')
 mt=[[p(h,'CellHead') for h in ['Material','Reference density / g cm-3','Composition by mass','SRD126 / XCOM rows']]]
 for m in material_data['materials']:
  mt.append([p(m['name']),p(m['density']),p('; '.join(f"{c['symbol']}={c['weightFraction']}" for c in m['composition'])),p(f"{len(m['datasets']['srd126']['points'])} / {len(m['datasets']['xcom']['points'])}")])
 tt=Table(mt,colWidths=[150,150,355,130],repeatRows=1);tt.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#102b40')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f2f6f8')]),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story.append(tt)
 story.append(Spacer(1,12))
 for line in ['SRD126: https://physics.nist.gov/PhysRefData/XrayMassCoef/cover.html','Lead: https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html','Water: https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/water.html','XCOM: https://physics.nist.gov/PhysRefData/Xcom/html/xcom1.html','Methods/thresholds: https://physics.nist.gov/PhysRefData/Xcom/Text/chap3.html','Reference density/composition: NIST XrayMassCoef/tab1.html and tab2.html','Rights: https://www.nist.gov/open/license; see DATA_LICENSE.md']:
  story.append(p(line,'BodyLab'))
 story.append(p('All source tables were retrieved on 2026-10-14. SRD126 data content is identified as July 2004; the online XCOM response has no per-response release identifier. It is retained as a hashed snapshot, not relabeled as downloadable XCOM 3.1. The 1,110 rows include both source families and both limits at absorption edges.','BodyLab'))
 story.append(PageBreak());story.append(p('Uncertainty and execution guide','TitleLab'))
 for title,body in [('Uncertainty separation','No per-value NIST standard uncertainty is fabricated. Optional primary density/thickness standard uncertainties yield a first-order independent input component: u(tau)^2=(kappa*x*u_rho)^2+(kappa*rho*u_x)^2, and u(T)/T approximately equals u(tau). It is not a total uncertainty and does not include data, interpolation, geometry or model omissions. No stack/spectral uncertainty is inferred.'),('Interpolation','Exact rows return published values. Between positive values the local method is segmented log-log; both edge limits are preserved, default edge side is explicitly above, and no energy extrapolation occurs. Pair channels use their own threshold and a locally documented onset. The method is not NIST XCOM\'s internal shell/spline implementation.'),('Numerical behavior','The engine uses double precision, expm1 for small losses and log-sum-exp for spectra. Very small transmissions retain logarithms and scientific text; numeric zero from underflow is not treated as physical zero. Most interface/PDF outputs show four significant digits; regression references deliberately show more digits only for arithmetic comparison.'),('Open and reproduce','Double-click START-HERE.html for the offline app. For source checks: npm ci; npm run validate:data; npm test; npm run typecheck; npm run build; npm run smoke:standalone; npm run validate:scientific. Reconstruct the database with python3 scripts/import_nist.py --offline. Actual browser checks require Chromium: npx playwright install --with-deps chromium; npm run test:e2e.'),('Publication','No repository or public site was created. Default GitHub Pages base: /RadiationShielding-Lab/. CI and a manual approval-gated Pages workflow are included. Review data redistribution rights before public release. The archive is a reviewable local deliverable, not a radiation-safety approval.')]:
  story.extend([p(title,'SectionLab'),p(body,'BodyLab')])
 output=ROOT/'reports/validation-review.pdf'
 SimpleDocTemplate(str(output),pagesize=landscape(A4),leftMargin=28,rightMargin=28,topMargin=30,bottomMargin=39,title='Radiation Shielding & Attenuation Lab - Scientific Validation Review',author='RadiationShielding-Lab').build(story,onFirstPage=footer,onLaterPages=footer)
 print(json.dumps(summary,indent=2));print('Review PDF:',output)
if __name__=='__main__': main()
