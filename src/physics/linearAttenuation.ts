import { nonnegative, safeProduct } from './validation';
export function linearAttenuation(massCoefficient: number, density: number): number {
  return safeProduct(nonnegative(massCoefficient, 'Mass coefficient'), nonnegative(density, 'Density'));
}
