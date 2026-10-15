# Numerical precision

All engine calculations use JavaScript IEEE-754 binary64 numbers. Source
coefficients retain their published decimal values; this does not increase
source physical precision. Most interface and English PDF values show four
significant figures. CSV/JSON numerical fields can retain additional digits
for reproducibility, and transmission strings retain four significant digits.
Long regression-reference decimals assess arithmetic, not physical accuracy.

- Optical depths add before exponentiation, so underflow in individual layer
  fractions does not destroy cumulative log transmission.
- `-Math.expm1(-tau)` avoids cancellation in 1-exp(-tau) for tiny tau.
- `logTransmission`, log10 transmission, and a base-ten scientific string
  remain available when exp(-tau) rounds to zero.
- Attenuation factors exceeding the finite numeric range have a null numeric
  value and a retained logarithmic/scientific representation, not Infinity.
- Output intensity is formed from ln(I0)-tau, so a representable output may
  survive even if the isolated transmission fraction underflows.
- Spectral totals and weighted means use log-sum-exp; arithmetic ratios are
  not formed by dividing two underflowed sums.
- Empty/negative/nonfinite input, overflowing conversion/products/sums and
  out-of-domain energy cause explicit errors. No NaN or Infinity is rendered.
- At zero density, characteristic lengths and unachievable inverse
  thicknesses are null with a visible explanation, not finite invented values.

Extreme subnormal input conversions can fall below representable binary64
magnitudes. This is a numerical resolution limit, not a validated extrapolated
physical regime. Very large optical depths can also lose small differences
when subtracting logs; do not interpret excessive numerical digits as precise
spectral information. This application is not an arbitrary-precision solver.
