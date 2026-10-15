import { nonnegative, safeProduct } from './validation';
export function scientificFromLog(logValue: number): string {
  if (!Number.isFinite(logValue)) throw new Error('Log value must be finite.');
  if (logValue === 0) return '1.000';
  const lg = logValue / Math.LN10, exponent = Math.floor(lg);
  const mantissa = Math.pow(10, lg - exponent);
  // Rounding to four significant digits must not emit 10.00eN.
  const m = Number(mantissa.toPrecision(4));
  return `${m >= 10 ? '1.000' : m.toFixed(3)}e${m >= 10 ? exponent + 1 : exponent}`;
}
export function transmissionFromDepth(opticalDepth: number, intensity = 1) {
  nonnegative(opticalDepth, 'Optical depth'); nonnegative(intensity, 'Initial intensity');
  const logTransmission = -opticalDepth;
  const fraction = Math.exp(logTransmission);
  const attenuationFraction = -Math.expm1(logTransmission);
  const logOutput = intensity === 0 ? null : Math.log(intensity) + logTransmission;
  const output = logOutput === null ? 0 : Math.exp(logOutput);
  const factor = opticalDepth <= Math.log(Number.MAX_VALUE) ? Math.exp(opticalDepth) : null;
  return { opticalDepth, fraction, attenuationFraction, logTransmission, log10Transmission: logTransmission / Math.LN10,
    transmissionText: scientificFromLog(logTransmission), attenuationFactor: factor, factorText: scientificFromLog(opticalDepth),
    output, outputText: logOutput === null ? '0' : scientificFromLog(logOutput), underflow: fraction === 0 && opticalDepth > 0 };
}
export function transmission(mu: number, thicknessCm: number, intensity = 1) {
  return transmissionFromDepth(safeProduct(nonnegative(mu, 'Linear coefficient'), nonnegative(thicknessCm, 'Thickness')), intensity);
}
