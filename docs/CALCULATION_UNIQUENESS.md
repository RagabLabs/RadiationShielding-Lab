# Calculation usefulness and non-duplication review

This release provides **ten scientific calculation workflows**, not ten
independent physical models. Several are descriptors or inverses of the same
exponential survival law. Their dependence is deliberate and explicit.

Comparison to Projects 01–05 is against the scope descriptions supplied in the
brief; their repositories were not accessed or modified and no code-level audit
of those projects is claimed.

| ID | Scientific question | Main output and equation | Inputs | Practical use | Distinction within this app |
|---|---|---|---|---|---|
| 01 | How does photon interaction strength depend on material and energy? | kappa(E)=mu/rho, cm²/g | Material, energy, source, edge side | Traceable data lookup and edge-aware material selection | Returns a source material property, not a sample path result. It introduces the reference dataset used downstream. |
| 02 | What coefficient applies to this actual bulk sample density? | mu=kappa*rho, cm⁻¹ | Mass coefficient and explicit density | Density correction, voided/porous sample comparison, path-unit preparation | Converts a mass property to a path property. A direct user-coefficient converter is also available and is not falsely attributed to NIST. |
| 03 | How much primary radiation survives a specified path? | T=exp(-mu*x), I=I0*T | Material/energy or coefficient, density, path, optional incident photon intensity | Forward attenuation and uncollided output estimation | The path is specified; transmission is the unknown. Retains removal/factor/log outputs without equating them to dose. |
| 04 | Which path achieves an arbitrary survival target? | x=-ln(Ttarget)/mu | Material, energy, density, 0<Ttarget<=1 | Inverse model exploration for a user-selected target | Target is specified; path is unknown. Checks feasibility at zero density. It is not an engineering-safe design. |
| 05 | Which thickness gives 50% survival? | HVL=ln(2)/mu | Material, energy, density | Conventional half-value descriptor for comparing barriers | A fixed standard quantile rather than an arbitrary target. A named quantity used independently in material specifications. |
| 06 | Which thickness gives 10% survival? | TVL=ln(10)/mu | Material, energy, density | Conventional decimal-reduction descriptor | Fixed decade-reduction descriptor. TVL/HVL=ln(10)/ln(2); it is mathematically related to 05, not a new transport law. |
| 07 | How does a heterogeneous stack attenuate primary photons at each boundary? | T=exp(-sum(mu_i*x_i)) | Several materials, densities and paths; common photon energy | Layer-specific optical-depth budgets and cumulative profiles | Composes distinct material coefficients and retains each layer's effect. Does not assume one coefficient for every layer. |
| 08 | What is the first-interaction distance distribution? | lambda=1/mu; P(X<=x)=1-exp(-mu*x) | Material, energy, density, optional path | Mean interaction spacing and event-distance probability | A statistical distance mean/CDF, not an arbitrary barrier target or continuous charged-particle range. Depends on the same survival law as 03. |
| 09 | Which microscopic channels cause attenuation? | kappa_total approximately equals sum of five partial kappa values | Material, energy and compatible XCOM channel data | Mechanism dominance, channel thresholds, partial-sum/source consistency | Adds microscopic composition of the coefficient; cannot be obtained from scalar exponential attenuation or total coefficient alone. |
| 10 | How does a full discrete photon spectrum change through layers? | T_phi=sum(w*T)/sum(w); T_psi=sum(E*w*T)/sum(E*w) | Per-line energies and photon weights, all layer materials/densities/paths | Spectral hardening and separate photon/energy-fluence transport | Applies energy-dependent coefficients to every line and compares different weighted quantities. It does not replace the spectrum by one mean energy. |

## Relation of the scalar family

02 prepares mu. 03 evaluates survival at a supplied x. 04 inverts that law for
any target. 05 and 06 expose the standard targets 1/2 and 1/10, which are useful
named descriptors but add no new transport physics. 08 evaluates the mean and
CDF of the corresponding interaction-distance distribution. The dedicated
interfaces state different questions, unknowns, dimensions and assumptions.
The brief explicitly retains HVL and TVL as conventional independent utilities;
they are not used to claim ten independent theories or novel algorithms.

The energy-absorption coefficient from SRD126 is additionally exposed as a
separate property, without being counted as an eleventh core workflow or being
misused to infer dose. It is not used to inflate the calculation count.

## Boundary with earlier projects

| Earlier project | Excluded subject | Boundary respected by all ten workflows |
|---|---|---|
| 01 NuclearDecay Lab | Decay chains, half-life and source activity versus time | Initial photon intensity is an input; no decay/source-production calculation is counted. HVL is spatial attenuation, not a nuclear half-life. |
| 02 Nuclear Structure Lab | Masses, binding and nuclear structure | No nuclear mass, binding-energy or structure calculator is included. |
| 03 Nuclear Reaction Lab | Reaction/collision kinematics | No reaction Q-value or kinematic solver is included. XCOM channels are material interaction coefficients. |
| 04 Radiation & Spectroscopy Lab | Emission energies and source spectra | A supplied spectrum is transported through matter; its emission production and spectral identification are not new functions. |
| 05 Detection & Measurement Lab | Detector response, count statistics and calibration | No efficiency correction, calibration, counting uncertainty or detector response is calculated. Transmission is a transport ratio, not measured detector counts. |

No previous-project file was opened or edited during this implementation.
