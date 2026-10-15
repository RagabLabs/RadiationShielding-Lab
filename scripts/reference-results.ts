import reference from '../tests/fixtures/reference.json';
import { lookup } from '../src/physics/interpolation';
import { linearAttenuation } from '../src/physics/linearAttenuation';
import { transmission } from '../src/physics/transmission';
import { requiredThickness } from '../src/physics/shieldThickness';
import { halfValueLayer } from '../src/physics/hvl';
import { tenthValueLayer } from '../src/physics/tvl';
import { multilayer } from '../src/physics/multilayer';
import { meanFreePath } from '../src/physics/meanFreePath';
import { interactionContributions } from '../src/physics/interactions';
import { spectrumTransport } from '../src/physics/spectrumTransport';
export function referenceResults() {
 const k=lookup('lead',1,'srd126').value, mu=linearAttenuation(k,11.35);
 const lead={materialId:'lead',density:11.35,thicknessCm:1},water={materialId:'water',density:1,thicknessCm:10};
 const values=[k,mu,transmission(mu,1).fraction,requiredThickness(mu,.01),halfValueLayer(mu)!,tenthValueLayer(mu)!,multilayer([lead,water],1,'srd126').total.fraction,meanFreePath(mu,1).lengthCm!,interactionContributions('lead',1).sum,spectrumTransport([{energyMeV:.1,weight:1},{energyMeV:1,weight:1}],[water],'srd126').photonRatio];
 return reference.map((r,i)=>({...r,actual:values[i],difference:values[i]-r.expected,passed:Math.abs(values[i]-r.expected)<=r.tolerance}));
}
