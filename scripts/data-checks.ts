import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { materials,databaseMetadata } from '../src/physics/materials';
import { lookup } from '../src/physics/interpolation';
import { interactionContributions } from '../src/physics/interactions';
export function validateData() {
 const errors:string[]=[];let points=0,edges=0,maxPartialResidual=0;
 for(const material of materials){
  const compositionSum=material.composition.reduce((s,c)=>s+c.weightFraction,0);
  if(Math.abs(compositionSum-1)>2e-6)errors.push(`${material.id}: composition sum ${compositionSum}`);
  if(!(material.density>0))errors.push(`${material.id}: missing positive reference density`);
  for(const [source,d] of Object.entries(material.datasets)){
   const raw=readFileSync(d.rawFile);const hash=createHash('sha256').update(raw).digest('hex');
   if(hash!==d.sha256)errors.push(`${material.id}/${source}: raw hash mismatch`);
   for(let i=0;i<d.points.length;i++){
    const p=d.points[i];points++;
    if(!Number.isFinite(p.total)||p.total<0)errors.push(`${material.id}/${source}: bad coefficient`);
    if(i&&p.energyMeV<d.points[i-1].energyMeV)errors.push(`${material.id}/${source}: unsorted energy`);
    if(p.side==='above')edges++;
    if(lookup(material.id,p.energyMeV,d.source,p.side||'above').value!==p.total)errors.push(`${material.id}/${source}: exact-row mismatch`);
    if(source==='xcom'){
     const c=interactionContributions(material.id,p.energyMeV,p.side||'above');maxPartialResidual=Math.max(maxPartialResidual,Math.abs(c.relativeResidual));
     if(!c.consistent)errors.push(`${material.id}/${source}/${p.energyMeV}: partial sum ${c.relativeResidual}`);
    }
   }
  }
 }
 if(points!==databaseMetadata.pointCount)errors.push('Metadata point count mismatch');
 return {materialCount:materials.length,pointCount:points,edgePairs:edges,maxPartialResidual,errors,passed:errors.length===0};
}
