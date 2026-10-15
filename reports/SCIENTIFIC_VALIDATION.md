# Scientific validation — v1.0.0

Each reference is calculated independently with Python Decimal (60 digits), starting from published, rounded NIST values. This tests numerical implementation, not experimental accuracy. All differences below are signed application minus reference.

| ID / calculation | Equation | Source | Test / input | Reference | Application | Difference | Status | Limit |
|---|---|---|---|---:|---:|---:|---|---|
| 01 Mass coefficient | kappa(E) | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 01; Pb, 1 MeV; exact SRD126 row | 0.0710200000000 cm2/g | 0.0710200000000 | 0.000e+0 | PASS | Source range only; edge side is explicit. |
| 02 Linear coefficient | mu=kappa*rho | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 02; Pb, 1 MeV; rho=11.35 g/cm3 | 0.806077000000 1/cm | 0.806077000000 | -1.110e-16 | PASS | Homogeneous sample; reference density editable. |
| 03 Narrow-beam transmission | exp(-mu*x) | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 03; Pb, 1 MeV; x=1 cm | 0.446606672065 fraction | 0.446606672065 | 0.000e+0 | PASS | Monoenergetic, uncollided photons; no dose. |
| 04 Required thickness | -ln(T)/mu | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 04; Pb, 1 MeV; target T=0.01 | 5.71306486352 cm | 5.71306486352 | 0.000e+0 | PASS | Target in (0,1]; no buildup or geometry. |
| 05 Half-value layer | ln(2)/mu | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 05; Pb, 1 MeV | 0.859901945546 cm | 0.859901945546 | 0.000e+0 | PASS | Reference monoenergetic beam; not spectral HVL. |
| 06 Tenth-value layer | ln(10)/mu | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 06; Pb, 1 MeV | 2.85653243176 cm | 2.85653243176 | 4.441e-16 | PASS | Same exponential model as HVL; not independent transport physics. |
| 07 Multilayer transmission | exp(-sum(mu_i*x_i)) | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 07; Pb 1 cm + water 10 cm, 1 MeV | 0.220187240813 fraction | 0.220187240813 | 0.000e+0 | PASS | Fixed energy-specific coefficients; excludes secondary/scattered photons. |
| 08 Mean free path | 1/mu | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | physics.test.ts: reference 08; Pb, 1 MeV | 1.24057627249 cm | 1.24057627249 | 2.220e-16 | PASS | Distance to first photon interaction, not charged-particle range. |
| 09 Partial coefficient sum | coherent+incoherent+photoelectric+pair | [NIST](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | physics.test.ts: reference 09; Pb, 1 MeV; XCOM coherent=.002991, incoherent=.04993, PE=.01810; pair=0 | 0.0710210000000 cm2/g | 0.0710210000000 | 0.000e+0 | PASS | One XCOM channel family; normalized partial sum; rounded totals may differ. |
| 10 Spectrum photon ratio | sum(w*T)/sum(w) | [NIST](https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/water.html) | physics.test.ts: reference 10; Water 10 cm; 0.1 and 1 MeV; equal photon weights | 0.337215967482 fraction | 0.337215967482 | 0.000e+0 | PASS | Discrete photon weights; no redistribution, fluorescence or dose. |

Full 60-digit references are in `tests/fixtures/reference.json`; generation code is `scripts/independent_reference.py`. Fixture tolerances (1e-12 absolute) test arithmetic only and are not a data uncertainty.

## Reference inputs

Pb at 1 MeV: SRD126 μ/ρ = 0.07102 cm²/g; NIST reference density 11.35 g/cm³. Water at 1 MeV: 0.07072 cm²/g; at 0.1 MeV: 0.1707 cm²/g; density 1 g/cm³. XCOM Pb at 1 MeV: coherent 0.002991, incoherent 0.04993, photoelectric 0.01810 cm²/g; both pair channels zero.

## Interpretation

Exact source rows, edge partitioning, all material checksums, partial sums, input domains, independent layer order, unit conversions, zero limits and extreme attenuation are additionally checked by Vitest. NIST source precision is around four significant coefficient digits; the long decimals in this validation table are numerical regression references, not claims of physical certainty. The PDF/CSV sample is generated from the same analysis object used by the interface. No broad-beam dose, buildup, geometry or neutron model has been validated or claimed.
