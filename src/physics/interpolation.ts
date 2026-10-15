import { getDataset } from './attenuationData';
import { positive } from './validation';
import type { AttenuationPoint, DataSource, EdgeSide, Lookup } from './types';
export interface Bracket { lower: AttenuationPoint; upper: AttenuationPoint; exact: boolean; side?: EdgeSide }
export function bracket(points: AttenuationPoint[], energy: number, side: EdgeSide = 'above'): Bracket {
  positive(energy, 'Photon energy');
  if (energy < points[0].energyMeV || energy > points[points.length - 1].energyMeV)
    throw new Error(`Energy outside dataset range: ${points[0].energyMeV}–${points[points.length - 1].energyMeV} MeV. Extrapolation is disabled.`);
  // Only round-off-sized equality, never a broad tolerance that smears an edge.
  const exact = points.filter(p => Math.abs(p.energyMeV - energy) <= 4 * Number.EPSILON * Math.max(p.energyMeV, energy));
  if (exact.length) {
    const p = side === 'below' ? exact[0] : exact[exact.length - 1];
    return { lower: p, upper: p, exact: true, side: exact.length > 1 ? side : undefined };
  }
  const i = points.findIndex(p => p.energyMeV > energy);
  // Last duplicate is post-edge on the left; first duplicate is pre-edge on the right.
  return { lower: points[i - 1], upper: points[i], exact: false };
}
export function logLog(x: number, x0: number, x1: number, y0: number, y1: number): number {
  positive(y0, 'Lower coefficient'); positive(y1, 'Upper coefficient');
  return Math.exp(Math.log(y0) + (Math.log(x / x0) / Math.log(x1 / x0)) * Math.log(y1 / y0));
}
export function lookup(id: string, energyMeV: number, source: DataSource = 'xcom', side: EdgeSide = 'above'): Lookup {
  const d = getDataset(id, source); const b = bracket(d.points, energyMeV, side);
  const value = b.exact ? b.lower.total : logLog(energyMeV, b.lower.energyMeV, b.upper.energyMeV, b.lower.total, b.upper.total);
  const en0 = b.lower.energyAbsorption, en1 = b.upper.energyAbsorption;
  const energyAbsorption = en0 !== undefined && en1 !== undefined ? (b.exact ? en0 : logLog(energyMeV, b.lower.energyMeV, b.upper.energyMeV, en0, en1)) : undefined;
  const warnings: string[] = [];
  if (b.side) warnings.push(`Absorption edge: ${side} side selected. The two tabulated limits are retained.`);
  const nearby = d.points.find(p => p.edge && Math.abs(Math.log(energyMeV / p.energyMeV)) < 0.01);
  if (nearby) warnings.push(`Near ${nearby.edge} edge. Chemical/solid-state fine structure is not modeled. Source edge energy precision applies.`);
  if (!b.exact) warnings.push('Local segmented log-log interpolation; this is not NIST XCOM\'s internal spline algorithm. Interpolation error is unquantified.');
  if (energyMeV >= 5) warnings.push('Photonuclear interactions are omitted by these datasets; the omission can matter in the giant-dipole-resonance region.');
  return { value, energyAbsorption, energyMeV, source, sourceUrl: d.sourceUrl, version: d.version, method: b.exact ? 'exact tabulated' : 'segmented log-log', bracketMeV: [b.lower.energyMeV, b.upper.energyMeV], side: b.side, warnings };
}
