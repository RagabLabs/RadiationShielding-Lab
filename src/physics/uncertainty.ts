import { nonnegative, safeProduct, finite } from './validation';
export function inputUncertainty(kappa: number, density: number, thicknessCm: number, densitySigma?: number, thicknessSigmaCm?: number) {
  [kappa, density, thicknessCm].forEach(v => nonnegative(v, 'Uncertainty model input'));
  if (densitySigma !== undefined) nonnegative(densitySigma, 'Density standard uncertainty');
  if (thicknessSigmaCm !== undefined) nonnegative(thicknessSigmaCm, 'Thickness standard uncertainty');
  const supplied = densitySigma !== undefined || thicknessSigmaCm !== undefined;
  const opticalDepthSigma = supplied ? finite(Math.hypot(safeProduct(kappa, thicknessCm, densitySigma || 0), safeProduct(kappa, density, thicknessSigmaCm || 0)), 'Optical-depth standard uncertainty') : null;
  return { opticalDepthSigma, relativeTransmissionSigma: opticalDepthSigma,
    linearSigma: densitySigma === undefined ? null : safeProduct(kappa, densitySigma),
    data: 'NIST tables do not supply per-value standard uncertainties.',
    interpolation: 'Unquantified. No invented percentage is assigned.',
    model: 'Scattering buildup, secondary photons, geometry and dose conversion are not included.',
    assumption: 'Independent density/thickness standard uncertainties; first-order propagation. This is a partial budget, not total uncertainty.',
    largeUncertainty: opticalDepthSigma !== null && opticalDepthSigma > 0.2 };
}
