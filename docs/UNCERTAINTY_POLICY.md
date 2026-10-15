# Uncertainty policy

## Separate categories

| Category | Treatment |
|---|---|
| Tabulated attenuation data | Per-value standard uncertainties are not supplied by these snapshots; none are invented. |
| Density | A visible reference value may be overridden. Optional user standard uncertainty enters a partial budget. |
| Thickness | Physical path length; optional independent user standard uncertainty enters the same partial budget. |
| Interpolation | Unquantified local approximation; method/bracket/edge side reported. |
| Model | Narrow-beam uncollided assumptions; omitted buildup, geometry, secondaries, photonuclear channels and dose response are systematic model limitations, not numerical error bars. |
| Numerical | IEEE-754 double precision, with stable small-loss and log-space algorithms; tested by independent references. |

## Implemented first-order primary-layer component

For tau=kappa*rho*x and independent standard uncertainties u_rho and u_x:

u_tau²=(kappa*x*u_rho)²+(kappa*rho*u_x)²;
u_mu=kappa*u_rho; u_T/T≈u_tau.

This budget holds the tabulated kappa fixed. Missing terms are not assumed
known zero: an entirely blank budget is reported as not supplied; a supplied
zero is a user choice. The result is labeled a **partial input contribution**,
not a total uncertainty. The coefficients themselves, source physics,
interpolation and geometry have no fabricated assigned percentage.

The calculation applies to the primary monoenergetic layer; no total stack
or spectrum uncertainty is inferred from it. Correlated inputs, uncertain
photon energy near an absorption edge, nonlinear effects and uncertainty in
mixture composition need a different treatment. A warning is emitted when
u_tau>0.2 because first-order transmission uncertainty can be inadequate.
This threshold is advisory, not an empirical uncertainty evaluation.
