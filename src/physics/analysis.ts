import type { Layer, DataSource, EdgeSide, SpectrumLine } from './types';
import { lookup } from './interpolation';
import { getMaterial } from './materials';
import { linearAttenuation } from './linearAttenuation';
import { transmission, transmissionFromDepth } from './transmission';
import { requiredThickness } from './shieldThickness';
import { halfValueLayer } from './hvl';
import { tenthValueLayer } from './tvl';
import { meanFreePath } from './meanFreePath';
import { multilayer } from './multilayer';
import { interactionContributions } from './interactions';
import { spectrumTransport } from './spectrumTransport';
import { inputUncertainty } from './uncertainty';
import { transmissionTarget } from './validation';
import { MODEL_WARNING } from './constants';
export interface AnalysisInput {
  energyMeV: number; source: DataSource; side: EdgeSide; layers: Layer[];
  intensity: number; target: number; spectrum?: SpectrumLine[];
  densitySigma?: number; thicknessSigmaCm?: number;
}
export function analyze(input: AnalysisInput) {
  transmissionTarget(input.target);
  if (!input.layers.length) throw new Error('At least one layer is required.');
  const primary = input.layers[0]; const material = getMaterial(primary.materialId);
  const coefficient = lookup(primary.materialId, input.energyMeV, input.source, input.side);
  const mu = linearAttenuation(coefficient.value, primary.density);
  const result = transmission(mu, primary.thicknessCm, input.intensity);
  const thickness = mu === 0 && input.target < 1 ? null : requiredThickness(mu, input.target);
  const stack = multilayer(input.layers, input.energyMeV, input.source, input.side);
  const interactions = interactionContributions(primary.materialId, input.energyMeV, input.side);
  const spectrum = input.spectrum ? spectrumTransport(input.spectrum, input.layers, input.source, input.side) : null;
  const uncertainty = inputUncertainty(coefficient.value, primary.density, primary.thicknessCm, input.densitySigma, input.thicknessSigmaCm);
  const warnings = [...coefficient.warnings, ...stack.warnings, ...(spectrum?.warnings || []), MODEL_WARNING];
  if (input.source !== 'xcom') warnings.push('Interaction contributions use a separate XCOM dataset. They are checked against its own total, not against SRD 126. Small source differences are expected.');
  if (!interactions.consistent) warnings.push('XCOM partial-sum consistency diagnostic exceeds its stated local tolerance; review the source grid and interpolation.');
  if (mu === 0) warnings.push('Zero-density/coefficient limit: transmission is one. No finite interaction length, HVL, TVL or attenuating thickness is available.');
  if (result.underflow || stack.total.underflow) warnings.push('Transmission underflows IEEE-754; use the retained log transmission and scientific text, not the numeric zero.');
  if (uncertainty.largeUncertainty) warnings.push('The supplied input uncertainties are large for first-order propagation. A distribution-based calculation may be needed.');
  if (spectrum) warnings.push('HVL, TVL and mean free path shown are reference monoenergetic properties at the selected reference energy, not effective polyenergetic values.');
  return { input, material, coefficient, mu, transmission: result, requiredThicknessCm: thickness,
    hvlCm: halfValueLayer(mu), tvlCm: tenthValueLayer(mu), meanFreePath: meanFreePath(mu, primary.thicknessCm), stack,
    stackOutput: transmissionFromDepth(stack.total.opticalDepth,input.intensity), interactions, spectrum, uncertainty,
    warnings: [...new Set(warnings)] };
}
export type Analysis = ReturnType<typeof analyze>;
