export function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite.`);
  return value;
}
export function nonnegative(value: number, name: string): number {
  finite(value, name); if (value < 0) throw new Error(`${name} must be nonnegative.`); return value;
}
export function positive(value: number, name: string): number {
  finite(value, name); if (value <= 0) throw new Error(`${name} must be greater than zero.`); return value;
}
export function transmissionTarget(value: number): number {
  positive(value, 'Target transmission'); if (value > 1) throw new Error('Target transmission must be in (0, 1].'); return value;
}
export function numeric(text: string, name: string): number {
  if (!text.trim()) throw new Error(`${name} is required.`);
  return finite(Number(text), name);
}
export function safeProduct(...values: number[]): number {
  const result = values.reduce((a, b) => a * b, 1); return finite(result, 'Product (input magnitude exceeded floating-point range)');
}
