import { nonnegative, finite } from './validation';
export function halfValueLayer(mu: number): number | null { nonnegative(mu, 'Linear coefficient'); return mu === 0 ? null : finite(Math.LN2 / mu, 'HVL'); }
