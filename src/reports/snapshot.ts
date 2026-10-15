import type { Analysis } from '../physics/analysis';
import { APP_VERSION, MODEL_WARNING } from '../physics/constants';
import { getMaterial } from '../physics/materials';
import { scientificFromLog } from '../physics/transmission';
export interface ReportRow { section: string; name: string; value: string | number | null; unit: string }
export interface ReportSnapshot { title: string; version: string; createdAt: string; rows: ReportRow[]; warning: string }
export function buildSnapshot(a: Analysis, page = 'Complete shielding analysis'): ReportSnapshot {
  const rows: ReportRow[] = [];
  const row = (section: string, name: string, value: string | number | null, unit = '') => rows.push({ section, name, value, unit });
  row('Context', 'View', page); row('Context', 'App version', APP_VERSION);
  row('Context', 'Photon energy', a.input.energyMeV, 'MeV'); row('Context', 'Data source', a.input.source);
  row('Context', 'Coefficient version', a.coefficient.version); row('Context', 'Lookup method', a.coefficient.method);
  row('Context', 'Energy bracket', a.coefficient.bracketMeV.join(' to '), 'MeV'); row('Context', 'Edge side', a.input.side);
  row('Context', 'Initial primary intensity', a.input.intensity, 'user photon units'); row('Context', 'Target transmission', a.input.target, 'fraction');
  a.stack.layers.forEach((l, i) => {
    const m = getMaterial(l.materialId); const sec = `Layer ${i + 1}`;
    row(sec, 'Material', m.name); row(sec, 'Composition (mass fractions)', m.composition.map(c => `${c.symbol}:${c.weightFraction}`).join('; '));
    row(sec, 'Composition source', m.compositionSource); row(sec, 'Density used', l.density, 'g/cm3');
    row(sec, 'NIST reference density', m.density, 'g/cm3'); row(sec, 'Density source', m.densitySource); row(sec, 'Density note', m.densityNote);
    row(sec, 'Physical thickness', l.thicknessCm, 'cm');
    const areal=l.density*l.thicknessCm;
    row(sec, 'Areal density', Number.isFinite(areal)?areal:scientificFromLog(Math.log(l.density)+Math.log(l.thicknessCm)), 'g/cm2');
    row(sec, 'Mass attenuation coefficient', l.coefficient.value, 'cm2/g'); row(sec, 'Linear attenuation coefficient', l.mu, '1/cm');
    row(sec, 'Coefficient URL', l.coefficient.sourceUrl); row(sec, 'Version', l.coefficient.version);
    row(sec, 'Retrieval date', m.datasets[a.input.source].retrievalDate); row(sec, 'Raw source SHA256', m.datasets[a.input.source].sha256);
    row(sec, 'Interpolation', l.coefficient.method); row(sec, 'Energy bracket', l.coefficient.bracketMeV.join(' to '), 'MeV');
    row(sec, 'Layer transmission', l.layerTransmission.transmissionText); row(sec, 'Cumulative transmission', l.cumulativeTransmission.transmissionText);
    row(sec, 'Optical depth contribution', l.depth);
  });
  row('Primary material', 'Mass coefficient', a.coefficient.value, 'cm2/g');
  if (a.coefficient.energyAbsorption !== undefined) row('Primary material', 'Mass energy-absorption coefficient (not attenuation)', a.coefficient.energyAbsorption, 'cm2/g');
  row('Primary material', 'Linear coefficient', a.mu, '1/cm');
  row('Primary material', 'Transmission', a.transmission.transmissionText); row('Primary material', 'Log transmission', a.transmission.logTransmission);
  row('Primary material', 'Attenuation fraction', a.transmission.attenuationFraction); row('Primary material', 'Attenuation factor', a.transmission.factorText);
  row('Primary material', 'Uncollided output intensity', a.transmission.outputText, 'same photon units as input');
  row('Primary material', 'Required thickness', a.requiredThicknessCm, 'cm'); row('Primary material', 'HVL', a.hvlCm, 'cm'); row('Primary material', 'TVL', a.tvlCm, 'cm');
  row('Primary material', 'Mean free path', a.meanFreePath.lengthCm, 'cm'); row('Primary material', 'First interaction probability within thickness', a.meanFreePath.firstInteractionProbability);
  row('Stack', 'Total transmission', a.stack.total.transmissionText); row('Stack', 'Log transmission', a.stack.total.logTransmission); row('Stack', 'Total thickness', a.stack.totalThicknessCm, 'cm');
  row('Stack', 'Uncollided stack output intensity', a.stackOutput.outputText, 'same photon units as input');
  row('XCOM interactions', 'Independent XCOM source', a.interactions.sourceUrl); row('XCOM interactions', 'Version', a.interactions.version);
  a.interactions.parts.forEach(p => { row('XCOM interactions', p.key, p.value, 'cm2/g'); row('XCOM interactions', p.key + ' share of partial sum', p.fraction, 'fraction'); });
  row('XCOM interactions', 'Partial coefficient sum', a.interactions.sum, 'cm2/g'); row('XCOM interactions', 'XCOM reference total', a.interactions.tableTotal, 'cm2/g');
  row('XCOM interactions', 'Relative residual', a.interactions.relativeResidual); row('XCOM interactions', 'Diagnostic tolerance', a.interactions.tolerance); row('XCOM interactions', 'Interpretation', a.interactions.note);
  if (a.spectrum) {
    const s = a.spectrum;
    row('Spectrum', 'Photon fluence ratio', s.photonRatioText); row('Spectrum', 'Energy fluence ratio', s.energyRatioText);
    row('Spectrum', 'Input mean photon energy', s.meanInputMeV, 'MeV'); row('Spectrum', 'Output mean photon energy', s.meanOutputMeV, 'MeV');
    row('Spectrum', 'Duplicate entries merged', s.duplicatesMerged);
    s.lines.forEach((l, i) => { const sec = `Spectrum line ${i+1}`; row(sec, 'Energy', l.energyMeV, 'MeV'); row(sec, 'Input photon weight', l.weight); row(sec, 'Transmission', l.transmission.transmissionText); row(sec, 'Log transmission', l.transmission.logTransmission); row(sec, 'Output photon weight', l.outputWeightText); });
  }
  row('Uncertainty', 'Density standard uncertainty (primary)', a.input.densitySigma ?? null, 'g/cm3'); row('Uncertainty', 'Thickness standard uncertainty (primary)', a.input.thicknessSigmaCm ?? null, 'cm');
  row('Uncertainty', 'Partial standard uncertainty of optical depth', a.uncertainty.opticalDepthSigma); row('Uncertainty', 'Partial relative standard uncertainty of primary transmission', a.uncertainty.relativeTransmissionSigma);
  for (const key of ['data','interpolation','model','assumption'] as const) row('Uncertainty', key, a.uncertainty[key]);
  row('Equations', 'Linear coefficient', 'mu = (mu/rho) * rho'); row('Equations', 'Uncollided transmission', 'T = exp(-mu*x)'); row('Equations', 'Inverse thickness', 'x = -ln(T)/mu');
  row('Equations', 'Characteristic layers', 'HVL = ln(2)/mu; TVL = ln(10)/mu; lambda = 1/mu'); row('Equations', 'Layers', 'T = exp(-sum(mu_i*x_i))');
  row('Equations', 'Photon fluence ratio', 'sum(w_j*T_j)/sum(w_j)'); row('Equations', 'Energy fluence ratio', 'sum(E_j*w_j*T_j)/sum(E_j*w_j)');
  row('Assumptions', 'Model', 'Homogeneous layers, monoenergetic exponential attenuation per spectral line, fixed source coefficients, independent-atom mixture rule. No geometry correction, buildup, scattered/secondary photons or dose estimate.');
  a.warnings.forEach((w, i) => row('Warnings', `Warning ${i+1}`, w));
  return { title: 'Radiation Shielding & Attenuation Lab', version: APP_VERSION, createdAt: new Date().toISOString(), rows, warning: MODEL_WARNING };
}
export function snapshotCSV(report: ReportSnapshot): string {
  const q = (v: unknown) => `"${String(v ?? 'Not available / not supplied').replaceAll('"', '""')}"`;
  return '\uFEFF' + [['section','quantity','value','unit'], ...report.rows.map(r => [r.section,r.name,r.value,r.unit])].map(r => r.map(q).join(',')).join('\r\n');
}
