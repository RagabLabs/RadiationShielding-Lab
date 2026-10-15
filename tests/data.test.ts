import { describe,it,expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { materials,databaseMetadata } from '../src/physics/materials';
import { lookup } from '../src/physics/interpolation';
import { interactionContributions } from '../src/physics/interactions';
describe('NIST data integrity',()=>{
 it('reports actual material and row counts',()=>{expect(databaseMetadata.materialCount).toBe(materials.length);expect(databaseMetadata.pointCount).toBe(materials.reduce((s,m)=>s+Object.values(m.datasets).reduce((a,d)=>a+d.points.length,0),0));});
 for(const m of materials)describe(m.id,()=>{
  it('provides documented reference density and composition',()=>{expect(m.density).toBeGreaterThan(0);expect(m.densitySource).toContain('physics.nist.gov');expect(m.compositionSource).toContain('physics.nist.gov');expect(m.composition.reduce((s,c)=>s+c.weightFraction,0)).toBeCloseTo(1,5);});
  for(const d of Object.values(m.datasets)){
   it(`${d.source}: raw SHA256 is unchanged`,()=>expect(createHash('sha256').update(readFileSync(d.rawFile)).digest('hex')).toBe(d.sha256));
   it(`${d.source}: exact rows, ordered energies and no negative coefficients`,()=>{expect(d.points[0].energyMeV).toBe(.001);expect(d.points.at(-1)!.energyMeV).toBe(20);for(let i=0;i<d.points.length;i++){const p=d.points[i];expect(p.total).toBeGreaterThan(0);if(i)expect(p.energyMeV).toBeGreaterThanOrEqual(d.points[i-1].energyMeV);expect(lookup(m.id,p.energyMeV,d.source,p.side||'above').value).toBe(p.total);}});
   it(`${d.source}: preserves pre/post edge pairs`,()=>{for(let i=0;i<d.points.length;i++){const p=d.points[i];if(p.side==='above'){expect(d.points[i-1].side).toBe('below');expect(d.points[i-1].energyMeV).toBe(p.energyMeV);expect(p.total).toBeGreaterThan(d.points[i-1].total);}}});
  }
  it('XCOM process sums agree with separately rounded totals',()=>{for(const p of m.datasets.xcom.points){const r=interactionContributions(m.id,p.energyMeV,p.side||'above');expect(r.consistent).toBe(true);expect(r.parts.every(v=>v.value>=0)).toBe(true);expect(r.parts.reduce((s,v)=>s+v.fraction,0)).toBeCloseTo(1,12);}});
 });
});
