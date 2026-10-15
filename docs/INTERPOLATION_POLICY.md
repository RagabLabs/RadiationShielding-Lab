# Interpolation policy

1. All stored energies are MeV and all mass coefficients cm²/g.
2. Return published values at exact grid points, with at most a four-ULP-scale
   energy comparison to accommodate conversion roundoff. This is not a broad
   physical tolerance and does not smear edge jumps.
3. An absorption edge has two adjacent equal-energy rows, annotated below
   and above. At equality the default is explicitly **above**; the user can
   select below. Neither row is discarded or averaged.
4. For an energy between rows, choose the last source point below it and the
   first source point above it. Immediately below an edge the right endpoint
   is its lower limit; immediately above it the left endpoint is its upper
   limit. No smooth interpolant crosses the discontinuity. Plots break the
   curve at the jump instead of smoothing it.
5. Positive coefficients are interpolated using
   ln(y)=ln(y0)+ln(E/E0)/ln(E1/E0)*ln(y1/y0).
6. Pair channels are exactly zero at/below their own XCOM threshold. In a
   zero-to-positive bracket above threshold, use a linear onset from the
   greater of the threshold and lower tabulated energy. Positive-to-positive
   brackets use log-log interpolation. No sub-threshold positive value is
   displayed. This onset is a local approximation, not XCOM's threshold fit.
7. Extrapolation outside [0.001,20] MeV is rejected, including zero-weight
   spectral entries. No arbitrary fallback coefficient is supplied.

## Source conventions

SRD126 Pb K: 0.0880045 MeV, with total coefficients 1.910 and 7.683 cm²/g.
The online XCOM output rounds this edge energy to 0.08800 MeV and reports
1.910 and 7.684 cm²/g. They are distinct source snapshots; do not splice
one source's high-resolution edge energy into another source's partial table.

NIST XCOM internally uses channel- and shell-dependent fits, including
splines and special pair-threshold fits. This application deliberately uses
a smaller, auditable **local segmented log-log approximation** on downloaded
tables, and labels it accordingly. Results between grid points need not
reproduce a live XCOM query to its displayed precision. Fine structure and
chemical/solid-state modifications close to edges are outside the model.

No numeric interpolation uncertainty is invented. The sum of independently
interpolated partial coefficients may differ from a separately interpolated
total; diagnostic thresholds are 0.2% for exact rounded rows, 2% for local
interpolation. These are review thresholds, not estimates of data uncertainty.
