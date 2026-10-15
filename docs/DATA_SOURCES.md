# Data sources and provenance

Retrieved 2026-10-14. Official sources were inspected; raw coefficient responses were fetched directly from NIST. Original unmodified response bytes and their SHA256 digests are retained.

## Primary sources

| Source | Role | Actual release/version information |
|---|---|---|
| [NIST SRD126](https://physics.nist.gov/PhysRefData/XrayMassCoef/cover.html) | Total mass attenuation and mass energy absorption | Cover states data content last updated July 2004; web page update date is not a coefficient release. |
| [NIST SRD8 XCOM](https://physics.nist.gov/PhysRefData/Xcom/html/xcom1.html) | Five photon interaction channels and total with coherent scattering | Online response snapshot; no per-response release identifier supplied. Not labeled as downloadable XCOM 3.1. |
| [NIST Table 1](https://physics.nist.gov/PhysRefData/XrayMassCoef/tab1.html) | Elemental density/composition | Source reference densities, some nominal. |
| [NIST Table 2](https://physics.nist.gov/PhysRefData/XrayMassCoef/tab2.html) | Compound/mixture density and mass fractions | Exact listed reference compositions sent to XCOM. |
| [NIST CODATA](https://physics.nist.gov/constants) | Checked for constants context | No new electron-mass value is required by this attenuation model; XCOM documented thresholds are retained. |
| [IAEA radiation protection](https://www.iaea.org/topics/radiation-protection) | Scope/limitations context | No IAEA dose data are imported. |
| [NIST ESTAR/PSTAR/ASTAR](https://physics.nist.gov/PhysRefData/Star/Text/contents.html) | Checked and excluded from photon engine | Charged-particle stopping powers/ranges, not gamma attenuation. |

## Data interpretation

All coefficients use cm²/g, source energies MeV. Both families in this bundle cover 0.001–20 MeV. SRD126 source tables expose total and energy-absorption coefficients; XCOM channels are never inferred from those two columns. XCOM totals include coherent scattering; total-without-coherent is retained in JSON for traceability but is not silently substituted. Source definition/rounding differences are documented, including near M edges.

For mixtures the importer sends explicit Table 2 elemental mass fractions rather than a guessed industrial composition. XCOM normalizes weights; these listed recipes sum to unity to source precision. The application does not claim an independent experimental validation of mixture additivity.

## Source ledger

| Material | Source | Rows | Raw snapshot | SHA256 |
|---|---|---:|---|---|
| Lead | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html) | 58 | `data/raw/srd126-lead.html` | `08e7faf3e41a0efd55cbd86a6d972c88725e04f67e7430142db37831d30272c2` |
| Lead | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 74 | `data/raw/xcom-lead.html` | `b3cf9ef6a9f1b00db65379ef899c2511f97a6845e18c73035c1c47052c6c9bd6` |
| Aluminum | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z13.html) | 38 | `data/raw/srd126-aluminum.html` | `5d48dbc4d2a570f6a4356a005add357d17de29a0078ecba0d7fc4420d0e39931` |
| Aluminum | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 54 | `data/raw/xcom-aluminum.html` | `d71a1bcc9fe9d45073640d3daf4ced1494d60e441f68d66a23decb5fff1ffa10` |
| Iron | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z26.html) | 38 | `data/raw/srd126-iron.html` | `978b5040435359a98bdc3d5a3a7bf3861dde43e8d3ef0f90436c600f50f15290` |
| Iron | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 54 | `data/raw/xcom-iron.html` | `e6d75c39cbbb911634ff0b1c3b827b688bc577eb1c9fa3f9858da06f038cbd87` |
| Copper | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z29.html) | 41 | `data/raw/srd126-copper.html` | `0a0fcba306b44d016cd09d5746aed875c306f2a627edc8ffefc04e21866d9303` |
| Copper | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 57 | `data/raw/xcom-copper.html` | `8a88c0a907333058930a88ecced3e44db82a053de05c6dc84e6ad077f8bae364` |
| Tungsten | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z74.html) | 59 | `data/raw/srd126-tungsten.html` | `5e2476a597a76813c43cebf01997a14d63b07a7383a0ef352e08e59a4d49a172` |
| Tungsten | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 75 | `data/raw/xcom-tungsten.html` | `f86bdcc8caa5eb424e0b534338c3b4b58fcf03030390115a56e1ef3ba461d57b` |
| Water, Liquid | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/water.html) | 36 | `data/raw/srd126-water.html` | `11cbc0a9d4d310a6236cf11254708a63c485e7ce606bd1e11ec175e5bbec3725` |
| Water, Liquid | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_3) | 52 | `data/raw/xcom-water.html` | `252d9527e7db9a693ee567ae99d196f57f07d8c86efe00ed241129acbc438145` |
| Concrete, Ordinary | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/concrete.html) | 46 | `data/raw/srd126-concrete.html` | `5e3fb967b0fc85d5bb3308cae12ee4ce13b72c5e281c504e94b78ecf7034d925` |
| Concrete, Ordinary | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_3) | 69 | `data/raw/xcom-concrete.html` | `1641ebd03e3c99eef97025398008000ca695e2e92149accf188b3b51667bf745` |
| Polyethylene | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/polyethylene.html) | 36 | `data/raw/srd126-polyethylene.html` | `480433cdbf526f874a84b198922dd630ddb25a04d12a9161ab4b1b1dc5124e43` |
| Polyethylene | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_3) | 52 | `data/raw/xcom-polyethylene.html` | `24bf83055280822d6270dc4d07d6df5d8e5eae2779af4cace69521b91ef71e24` |
| Air, Dry (near sea level) | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/air.html) | 37 | `data/raw/srd126-air.html` | `8ac00bbdd6c796b304af9b4094f5bd7bad74d630aa47a951a59a6a9e97874416` |
| Air, Dry (near sea level) | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_3) | 54 | `data/raw/xcom-air.html` | `0a2cee61411a636a9b629ba3153ecf4d6389783069aa671bade77973433acf47` |
| Carbon, Graphite | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z06.html) | 36 | `data/raw/srd126-graphite.html` | `de9edef1fec0211aece5b7a8fd4959c150881fc4440a222f935e23f340dee534` |
| Carbon, Graphite | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 52 | `data/raw/xcom-graphite.html` | `4b89d6347f4129e6d3c3236476c69bcd41bd187f1825fa43baead67d36f7dd51` |
| Silicon | [srd126](https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z14.html) | 38 | `data/raw/srd126-silicon.html` | `7998b00ce5914264fb43d094a4bd1705a6e686224675edb59ba294b6fdfd1f63` |
| Silicon | [xcom](https://physics.nist.gov/cgi-bin/Xcom/xcom3_1) | 54 | `data/raw/xcom-silicon.html` | `a8ac9ad71fbb14227eb289e319e67ea98b1e82961b4d6d942c7c27cc294286fb` |

Exact XCOM endpoint POST parameters are stored under each dataset `request`. The endpoint URL alone is not a full reproducibility recipe. A live query may be revised later; the included raw snapshots and hashes fix this review state. The bundled JSON is a normalized subset; no numeric coefficient is generated by fitting invented values. See INTERPOLATION_POLICY.md for all off-grid calculations and DATA_LICENSE.md for redistribution status.
