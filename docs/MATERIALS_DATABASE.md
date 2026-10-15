# Materials database

Reference densities/compositions are taken from NIST Tables 1 and 2, not assumed sample measurements. Mass fractions are preserved.

| Identifier | Material | Density (g/cm³) | Mass fractions | SRD126 rows | XCOM rows |
|---|---|---:|---|---:|---:|
| lead | Lead | 11.35 | Pb=1.0 | 58 | 74 |
| aluminum | Aluminum | 2.699 | Al=1.0 | 38 | 54 |
| iron | Iron | 7.874 | Fe=1.0 | 38 | 54 |
| copper | Copper | 8.96 | Cu=1.0 | 41 | 57 |
| tungsten | Tungsten | 19.3 | W=1.0 | 59 | 75 |
| water | Water, Liquid | 1.0 | H=0.111898; O=0.888102 | 36 | 52 |
| concrete | Concrete, Ordinary | 2.3 | H=0.0221; C=0.002484; O=0.57493; Na=0.015208; Mg=0.001266; Al=0.019953; Si=0.304627; K=0.010045; Ca=0.042951; Fe=0.006435 | 46 | 69 |
| polyethylene | Polyethylene | 0.93 | H=0.143716; C=0.856284 | 36 | 52 |
| air | Air, Dry (near sea level) | 0.001205 | C=0.000124; N=0.755268; O=0.231781; Ar=0.012827 | 37 | 54 |
| graphite | Carbon, Graphite | 1.7 | C=1.0 | 36 | 52 |
| silicon | Silicon | 2.33 | Si=1.0 | 38 | 54 |

Every record additionally stores composition/density URLs, source-specific energy bounds, version description, retrieval date, raw response path, SHA256 and XCOM POST fields. Status means imported from an original response; it is not a certified uncertainty evaluation.

The NIST reference ordinary-concrete composition is used as listed; real concrete varies with aggregates and moisture. Dry-air density is a near-sea-level nominal reference; gases vary with temperature/pressure. Polyethylene uses NIST reference mass fractions and density 0.93 g/cm³. Stainless steel is unavailable without a specific alloy grade/assay; iron is not labeled as stainless steel.

`src/data/materials.json` is bundled by the browser; `data/materials.json` is an identical review copy. The original HTML responses remain in `data/raw/`. The import script is Python standard-library code and can reproduce normalized records offline.
