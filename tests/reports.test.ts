import { describe,it,expect } from 'vitest';
import { analyze } from '../src/physics/analysis';
import { buildSnapshot,snapshotCSV } from '../src/reports/snapshot';
import { createPDF } from '../src/reports/export';
const a=analyze({source:'srd126',side:'above',energyMeV:1,layers:[{materialId:'lead',density:11.35,thicknessCm:1}],intensity:10,target:.01,spectrum:[{energyMeV:.1,weight:1},{energyMeV:1,weight:1}]});
describe('Reports use the exact analysis object displayed by the UI',()=>{
 it('preserves engine coefficients and scalar results',()=>{const r=buildSnapshot(a);expect(r.rows.find(r=>r.name==='Linear coefficient')!.value).toBe(a.mu);expect(r.rows.find(r=>r.name==='HVL')!.value).toBe(a.hvlCm);expect(r.rows.find(r=>r.name==='Required thickness')!.value).toBe(a.requiredThicknessCm);expect(r.rows.find(r=>r.name==='Photon fluence ratio')!.value).toBe(a.spectrum!.photonRatioText);});
 it('includes sources, composition, versions, assumptions and uncertainty',()=>{const csv=snapshotCSV(buildSnapshot(a));for(const field of ['Composition (mass fractions)','Density source','Coefficient URL','Version','Data source','Equations','Warnings','Uncertainty','Raw source SHA256'])expect(csv).toContain(field);});
 it('CSV escapes quoted text and line endings',()=>{const r=buildSnapshot(a);r.rows.push({section:'test',name:'quoted "name"',value:'line1\nline2',unit:''});expect(snapshotCSV(r)).toContain('"quoted ""name"""');expect(snapshotCSV(r)).toContain('"line1\nline2"');});
 it('represents unavailable values explicitly rather than Infinity',()=>{const z=analyze({...a.input,layers:[{materialId:'lead',density:0,thicknessCm:1}]});const csv=snapshotCSV(buildSnapshot(z));expect(csv).toContain('Not available / not supplied');expect(csv).not.toMatch(/NaN|Infinity/);});
 it('serializes a real multi-page PDF from the snapshot',()=>{const pdf=createPDF(buildSnapshot(a));const buf=pdf.output('arraybuffer');expect(new TextDecoder().decode(buf.slice(0,5))).toBe('%PDF-');expect(pdf.getNumberOfPages()).toBeGreaterThan(1);expect(buf.byteLength).toBeGreaterThan(10000);});
});
