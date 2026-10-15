import { nonnegative, finite } from './validation';
import { transmission } from './transmission';
export function meanFreePath(mu: number, distanceCm: number) {
  nonnegative(mu, 'Linear coefficient');
  return { lengthCm: mu === 0 ? null : finite(1 / mu, 'Mean free path'), firstInteractionProbability: transmission(mu, distanceCm).attenuationFraction };
}
