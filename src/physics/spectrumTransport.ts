import type { SpectrumLine, Layer, DataSource, EdgeSide } from './types';
import { positive, nonnegative, finite } from './validation';
import { multilayer } from './multilayer';
import { scientificFromLog } from './transmission';
export function logSumExp(values: number[]): number {
  const max = Math.max(...values); return max + Math.log(values.reduce((s, v) => s + Math.exp(v - max), 0));
}
export function parseSpectrum(text: string, energyScale = 1): SpectrumLine[] {
  const rows = text.trim().split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  if (rows.length > 500) throw new Error('A spectrum may contain at most 500 lines.');
  return rows.map((line, i) => {
    const cells = line.trim().split(/[,;\s]+/);
    if (cells.length !== 2) throw new Error(`Spectrum line ${i + 1}: enter energy, photon weight.`);
    return { energyMeV: positive(Number(cells[0]) * energyScale, 'Spectrum energy'), weight: nonnegative(Number(cells[1]), 'Spectrum weight') };
  });
}
export function spectrumTransport(spectrum: SpectrumLine[], layers: Layer[], source: DataSource = 'xcom', side: EdgeSide = 'above') {
  if (!spectrum.length || spectrum.length > 500) throw new Error('Provide 1–500 spectrum lines.');
  const merged = new Map<number, number>();
  for (const l of spectrum) {
    positive(l.energyMeV, 'Spectrum energy'); nonnegative(l.weight, 'Spectrum weight');
    // Validate the energy even for a zero-weight line; do not silently accept an invalid domain.
    multilayer(layers, l.energyMeV, source, side);
    merged.set(l.energyMeV, finite((merged.get(l.energyMeV) || 0) + l.weight, 'Merged spectral weight'));
  }
  const active = [...merged].filter(([, w]) => w > 0).sort(([a], [b]) => a - b);
  if (!active.length) throw new Error('The spectrum must have positive total photon weight.');
  const logInput = logSumExp(active.map(([, w]) => Math.log(w)));
  const lines = active.map(([energyMeV, weight]) => {
    const result = multilayer(layers, energyMeV, source, side);
    const logOutput = Math.log(weight) + result.total.logTransmission;
    return { energyMeV, weight, inputFraction: Math.exp(Math.log(weight) - logInput), transmission: result.total,
      outputWeight: Math.exp(logOutput), outputWeightText: scientificFromLog(logOutput), logOutput, warnings: result.warnings };
  });
  const logOutput = logSumExp(lines.map(l => l.logOutput));
  const logInputEnergy = logSumExp(active.map(([e, w]) => Math.log(w) + Math.log(e)));
  const logOutputEnergy = logSumExp(lines.map(l => l.logOutput + Math.log(l.energyMeV)));
  const logPhotonRatio = Math.min(0, logOutput - logInput);
  const logEnergyRatio = Math.min(0, logOutputEnergy - logInputEnergy);
  return { lines, photonRatio: Math.exp(logPhotonRatio), photonRatioText: scientificFromLog(logPhotonRatio), logPhotonRatio,
    energyRatio: Math.exp(logEnergyRatio), energyRatioText: scientificFromLog(logEnergyRatio), logEnergyRatio,
    meanInputMeV: Math.exp(logInputEnergy - logInput), meanOutputMeV: Math.exp(logOutputEnergy - logOutput),
    warnings: [...new Set([...lines.flatMap(l => l.warnings), ...(lines.some(l => l.transmission.underflow) ? ['Some spectral line transmissions underflow IEEE-754; retained line logs and scientific text remain available. A plotted numerical zero is not a physical zero.'] : [])])], duplicatesMerged: spectrum.length - merged.size };
}
