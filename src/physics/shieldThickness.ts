import { nonnegative, transmissionTarget, finite } from './validation';
export function requiredThickness(mu: number, target: number): number {
  nonnegative(mu, 'Linear coefficient'); transmissionTarget(target);
  if (target === 1) return 0;
  if (mu === 0) throw new Error('No finite thickness can achieve this target at zero density/coefficient.');
  return finite(-Math.log(target) / mu, 'Required thickness (input magnitude too large)');
}
