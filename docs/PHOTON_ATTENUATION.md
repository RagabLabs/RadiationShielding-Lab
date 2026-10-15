# Photon attenuation, energy absorption and dose

A narrow beam is an idealized arrangement that rejects scattered radiation.
Uncollided fluence is the number of primary photons per area that traverse
the modeled path without interaction. I0 may be a photon rate, photon fluence
or consistent relative photon intensity; the output retains its chosen
units. It is not an activity-to-dose conversion and does not include source
geometry or inverse-square spreading.

In broad-beam conditions, scattered photons can contribute to a measured
field behind the shield. A buildup correction depends on energy, material,
geometry and the response quantity. No buildup coefficient or multiply
scattered field is calculated by this application. The attenuation factor
1/T and removal fraction 1-T describe loss from the uncollided component;
removal includes scattering and does not mean all removed energy was absorbed.

SRD126 additionally tabulates mu_en/rho, a mass energy-absorption coefficient.
It is shown as a distinct source property when that family is selected. It
is not the total attenuation coefficient, is not substituted into exp(-mu*x),
and is not identical to a mass energy-transfer coefficient. A valid dose or
kerma estimate would require the relevant energy-dependent field, response
coefficients, material conditions and equilibrium assumptions. No actual
absorbed/equivalent/effective dose is inferred here.

Gamma rays and X-rays are photons and use this engine. ESTAR, PSTAR and ASTAR
are charged-particle stopping-power/range resources and are cited for scope
awareness only; their data are not imported or used. No neutron shielding
model is included. At higher photon energies the omitted photonuclear
contribution can matter, particularly around giant-dipole resonances; the
lookup warns from 5 MeV within the included 20 MeV ceiling.

The calculations primarily describe uncollided photon attenuation under
stated model assumptions. They are not a substitute for validated radiation
transport simulations, professional shielding design, or regulatory radiation
protection assessments.
