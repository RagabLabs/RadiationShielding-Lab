import { writeFileSync } from 'node:fs';
import { referenceResults } from './reference-results';
import { analyze } from '../src/physics/analysis';
import { buildSnapshot,snapshotCSV } from '../src/reports/snapshot';
import { createPDF } from '../src/reports/export';
const results=referenceResults();
writeFileSync('reports/scientific-validation.json',JSON.stringify({generatedAt:new Date().toISOString(),referenceMethod:'Python Decimal at 60 digits, independently coded; original NIST rounded coefficients',results},null,2)+'\n');
const limits=[
 'Source range only; edge side is explicit.', 'Homogeneous sample; reference density editable.',
 'Monoenergetic, uncollided photons; no dose.', 'Target in (0,1]; no buildup or geometry.',
 'Reference monoenergetic beam; not spectral HVL.', 'Same exponential model as HVL; not independent transport physics.',
 'Fixed energy-specific coefficients; excludes secondary/scattered photons.', 'Distance to first photon interaction, not charged-particle range.',
 'One XCOM channel family; normalized partial sum; rounded totals may differ.',
 'Discrete photon weights; no redistribution, fluorescence or dose.'
];
let md='# Scientific validation — v1.0.0\n\nEach reference is calculated independently with Python Decimal (60 digits), starting from published, rounded NIST values. This tests numerical implementation, not experimental accuracy. All differences below are signed application minus reference.\n\n';
md+='| ID / calculation | Equation | Source | Test / input | Reference | Application | Difference | Status | Limit |\n|---|---|---|---|---:|---:|---:|---|---|\n';
results.forEach((r,i)=>{md+=`| ${r.id} ${r.name} | ${r.formula} | [NIST](${r.source.split(' ; ')[0]}) | physics.test.ts: reference ${r.id}; ${r.inputs} | ${r.expected.toPrecision(12)} ${r.unit} | ${r.actual.toPrecision(12)} | ${r.difference.toExponential(3)} | ${r.passed?'PASS':'FAIL'} | ${limits[i]} |\n`;});
md+='\nFull 60-digit references are in `tests/fixtures/reference.json`; generation code is `scripts/independent_reference.py`. Fixture tolerances (1e-12 absolute) test arithmetic only and are not a data uncertainty.\n\n## Reference inputs\n\nPb at 1 MeV: SRD126 μ/ρ = 0.07102 cm²/g; NIST reference density 11.35 g/cm³. Water at 1 MeV: 0.07072 cm²/g; at 0.1 MeV: 0.1707 cm²/g; density 1 g/cm³. XCOM Pb at 1 MeV: coherent 0.002991, incoherent 0.04993, photoelectric 0.01810 cm²/g; both pair channels zero.\n\n## Interpretation\n\nExact source rows, edge partitioning, all material checksums, partial sums, input domains, independent layer order, unit conversions, zero limits and extreme attenuation are additionally checked by Vitest. NIST source precision is around four significant coefficient digits; the long decimals in this validation table are numerical regression references, not claims of physical certainty. The PDF/CSV sample is generated from the same analysis object used by the interface. No broad-beam dose, buildup, geometry or neutron model has been validated or claimed.\n';
writeFileSync('docs/SCIENTIFIC_VALIDATION.md',md);
writeFileSync('reports/SCIENTIFIC_VALIDATION.md',md);
const sample=analyze({source:'srd126',side:'above',energyMeV:1,layers:[{materialId:'lead',density:11.35,thicknessCm:1},{materialId:'water',density:1,thicknessCm:10}],intensity:1000,target:.01,spectrum:[{energyMeV:.1,weight:1},{energyMeV:1,weight:1}],densitySigma:.02,thicknessSigmaCm:.005});
const snapshot=buildSnapshot(sample);
writeFileSync('reports/sample-analysis.json',JSON.stringify(snapshot,null,2)+'\n');
writeFileSync('reports/sample-analysis.csv',snapshotCSV(snapshot));
writeFileSync('reports/sample-analysis.pdf',new Uint8Array(createPDF(snapshot).output('arraybuffer')));
console.log(JSON.stringify({referenceCases:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,maxAbsoluteDifference:Math.max(...results.map(r=>Math.abs(r.difference)))},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
