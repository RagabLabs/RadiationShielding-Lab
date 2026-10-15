import { getDataset } from './attenuationData';
import { bracket, logLog } from './interpolation';
import { PAIR_ELECTRON_THRESHOLD_MEV, PAIR_NUCLEAR_THRESHOLD_MEV } from './constants';
import type { EdgeSide } from './types';
export const processKeys = ['coherent', 'incoherent', 'photoelectric', 'pairNuclear', 'pairElectron'] as const;
export type ProcessKey = typeof processKeys[number];
export function interactionContributions(id: string, energy: number, side: EdgeSide = 'above') {
  const dataset = getDataset(id, 'xcom'); const b = bracket(dataset.points, energy, side);
  const parts = processKeys.map(key => {
    const a = b.lower[key], c = b.upper[key];
    if (a === undefined || c === undefined) throw new Error('Partial interaction data unavailable.');
    const threshold = key === 'pairNuclear' ? PAIR_NUCLEAR_THRESHOLD_MEV : key === 'pairElectron' ? PAIR_ELECTRON_THRESHOLD_MEV : 0;
    let value: number;
    if (threshold && energy <= threshold) value = 0;
    else if (b.exact) value = a;
    else if (a > 0 && c > 0) value = logLog(energy, b.lower.energyMeV, b.upper.energyMeV, a, c);
    else if (a === 0 && c === 0) value = 0;
    else {
      // Local linear onset above the documented threshold; never interpolate a positive channel below it.
      const low = Math.max(threshold, b.lower.energyMeV);
      value = c * (energy - low) / (b.upper.energyMeV - low);
    }
    return { key, value, fraction: 0, allowed: !threshold || energy > threshold };
  });
  const sum = parts.reduce((s, p) => s + p.value, 0);
  const tableTotal = b.exact ? b.lower.total : logLog(energy, b.lower.energyMeV, b.upper.energyMeV, b.lower.total, b.upper.total);
  for (const p of parts) p.fraction = sum === 0 ? 0 : p.value / sum;
  const relativeResidual = (sum - tableTotal) / tableTotal;
  return { parts, sum, tableTotal, relativeResidual, consistent: Math.abs(relativeResidual) <= (b.exact ? 0.002 : 0.02),
    tolerance: b.exact ? 0.002 : 0.02, method: b.exact ? 'exact tabulated' : 'segmented log-log; linear threshold onset',
    sourceUrl: dataset.sourceUrl, version: dataset.version,
    note: 'Fractions are normalized to the sum of partial coefficients. Residual compares that sum with the separately tabulated/interpolated XCOM total; rounding and interpolation need not commute. Tolerance is a diagnostic, not an uncertainty estimate.' };
}
