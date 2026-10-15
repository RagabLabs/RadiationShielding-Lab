import { nonnegative, finite } from './validation';
export function tenthValueLayer(mu: number): number | null { nonnegative(mu, 'Linear coefficient'); return mu === 0 ? null : finite(Math.LN10 / mu, 'TVL'); }
