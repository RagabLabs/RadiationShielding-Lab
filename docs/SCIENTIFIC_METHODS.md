# Scientific methods

## Transport model and dimensions

Let kappa(E) be the total mass attenuation coefficient in cm²/g and rho the
sample density in g/cm³. mu(E)=kappa(E)rho has units cm⁻¹. Let x be the
physical path length in cm; rho*x is the distinct areal density in g/cm².
The independent-collision survival equation is dI/dx=-mu I, whose solution
for constant mu is T=I/I0=exp(-mu*x). The model follows primary photons with
**zero interactions**. Scattering removes a photon from this component even
if it later reaches another location or its energy remains unchanged.

The inverse x=-ln(T)/mu requires 0<T<=1. With mu=0 only T=1 has a finite
solution (x=0). HVL=ln(2)/mu and TVL=ln(10)/mu are fixed survival quantiles;
lambda=1/mu is the mean of the first-interaction distance distribution.
Its cumulative distribution is P(X<=x)=1-exp(-mu*x). None is a charged-particle
continuous slowing-down range.

## Layers

For a fixed energy and homogeneous layers, optical depths add:
tau=sum_i(kappa_i rho_i x_i), T=exp(-tau). Each layer retains its own
coefficient, density and physical thickness. The profile is a survival value
at every layer boundary. Multiplication commutes for this uncollided model;
reordering need not preserve a real scattered/secondary field, fluorescence,
buildup, energy deposition or dose. Charts label layer boundaries explicitly.

## Spectrum

For discrete photon weights w_j>=0, at least one positive, compute T_j using
the coefficient at E_j through all layers. Photon-fluence transmission is
sum(w_j T_j)/sum(w_j). Energy-fluence transmission is
sum(E_j w_j T_j)/sum(E_j w_j). Output mean photon energy is
sum(E_j w_j T_j)/sum(w_j T_j). Mean-energy substitution is not used.
A spectral density per energy interval must be integrated into photon
weights first. Equal-energy entries merge; zero-weight entries are checked
for valid energy, then excluded from means. No scattered-photon energy
redistribution, fluorescence, secondary production or detector response is
computed. The reported HVL/TVL/lambda remain reference monoenergetic values.

## Microscopic interaction channels

Only XCOM supplies the five channels used: coherent, incoherent,
photoelectric, nuclear-field pair production and electron-field pair
production. All are cm²/g. Channel fractions are normalized to their sum;
that sum is compared with XCOM's separately rounded/interpolated total.
The total includes coherent scattering. SRD126 totals are not substituted
into this consistency comparison. XCOM's documented threshold conventions
are 1.022 MeV and 2.044 MeV respectively; these are not new CODATA estimates.

## Sources

- NIST SRD126 attenuation definition and mixture rule:
  https://physics.nist.gov/PhysRefData/XrayMassCoef/chap2.html
- XCOM channel definitions and omissions:
  https://physics.nist.gov/PhysRefData/Xcom/Text/intro.html
- XCOM native interpolation and thresholds:
  https://physics.nist.gov/PhysRefData/Xcom/Text/chap3.html

The application interpolator is documented separately and is not claimed to
reimplement XCOM's internal shell-resolved interpolation.
