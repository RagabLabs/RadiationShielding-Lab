# Radiation Shielding & Attenuation Lab v1.0.0

Independent photon-attenuation scientific application: React, TypeScript, Vite,
Vitest, and prepared Playwright desktop/mobile checks. English and Arabic, RTL,
dark/light modes, traceable NIST data, interactive SVG plots, English PDF,
CSV, and PNG chart exports. No runtime network connection is needed.

## Open immediately

Download/extract the project and double-click **START-HERE.html**. It is a
self-contained production bundle with embedded code, styling, and data. Do
not open `dist/index.html` through `file://`; that version expects an HTTP
host and the configured repository base path. `dist/START-HERE.html` also
works as an offline copy. A current browser with JavaScript and canvas is
needed for interactive calculations and PNG exports. PDF reports use English
scientific text in both language modes; interface controls support Arabic.

## Develop and verify

Tested runtime: Node 24.19.0, npm 11.9.0, Python 3.12. Node >=22.12 is declared.
The exact dependency graph is in `package-lock.json`.

```bash
npm ci
npm run validate:data
npm test
npm run typecheck
npm run build
npm run smoke:standalone
npm run validate:scientific
npm run dev
```

The dev server prints its address; the default application path is
`/RadiationShielding-Lab/`. For a different host path set `VITE_BASE_PATH`
before building. Vite preview is a development check, not a production server.

For actual browser-engine checks on a machine with browser support:

```bash
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

The included delivery report distinguishes executed Vitest/DOM tests from
unexecuted Playwright tests. Do not read a prepared test as a passed test.

## Scientific scope

1. Mass attenuation lookup, with source, bracket and explicit edge side.
2. Mass-to-linear conversion using visible sample density.
3. Monoenergetic narrow-beam uncollided transmission.
4. Inverse thickness for a user-selected target.
5. Monoenergetic half-value layer.
6. Monoenergetic tenth-value layer.
7. Material-specific multilayer optical-depth composition.
8. Mean free path and first-interaction probability.
9. Five XCOM interaction channels and a partial-sum consistency diagnostic.
10. Line-by-line polyenergetic transport; photon and energy fluence separated.

These are ten useful calculations within related physical models, not ten
independent transport theories. See `docs/CALCULATION_UNIQUENESS.md`.

The primary material controls the single-material outputs and direct
mass-to-linear converter. Extra layers enter stack and spectral outputs.
HVL/TVL/mean free path always describe the selected **reference energy** and
primary material, including when spectrum mode is selected. Spectrum weights
are per-line photon weights; energies in the spectrum editor are always MeV,
independent of the reference-energy selector unit. Supplied uncertainties
apply to the primary monoenergetic result only.

## Bundled data

11 materials; 1,110 energy rows across two source families: NIST SRD 8 XCOM
and NIST SRD 126. Domain 0.001–20 MeV. Edge limits are separate rows; data
families are counted separately. Reference densities and compositions come
from NIST Tables 1 and 2. Stainless steel is omitted because no grade/assay
was supplied. Complete provenance is included in `src/data/materials.json`,
`data/materials.json`, `data/raw/`, and `docs/DATA_SOURCES.md`.

```bash
# Reconstruct normalized JSON from included raw snapshots, without network:
python3 scripts/import_nist.py --offline
# Fetch fresh original responses (will change provenance and can change data):
python3 scripts/import_nist.py
# Reuse successful snapshots and retrieve only missing/error responses:
python3 scripts/import_nist.py --reuse
# Recompute independent test references without importing application code:
python3 scripts/independent_reference.py
```

A fresh import is a data change: rerun data validation, tests, reference
review and builds. Do not silently relabel the online XCOM snapshot as the
separate downloadable XCOM 3.1 release. See `DATA_LICENSE.md`: NIST SRD rights
are retained and public redistribution permission has not been independently
obtained. The MIT source-code license does not relicense reference data.

## Repository structure

```text
src/physics/       Pure TypeScript physics, units, validation and uncertainty
src/data/          Traceable browser-bundled material JSON
src/components/    Input fields, scientific charts and reference views
src/reports/       Shared report snapshot and PDF/CSV/PNG serialization
scripts/           Original-data import, independent references, validation
                  and production standalone-bundle preparation
 tests/            Independent, data-integrity, report and DOM tests
 tests/e2e/        Desktop/mobile Playwright scenarios
 data/raw/         Original NIST HTML responses (not served as app pages)
 docs/             Methods, provenance, precision and review documents
 reports/          Actual machine-readable results and sample exports
 dist/             Production static assets + offline standalone application
.github/workflows/ CI and manually approved GitHub Pages publication
```

## Deliverables and GitHub

The source archive includes the production build, datasets, raw-source
snapshots, import scripts, independent fixtures, tests and review reports.
`docs/GITHUB.md` explains repository creation and manual publication.
No remote repository is assumed, created or published by this delivery.
The Pages workflow publishes only after a manual approval input is selected;
push/PR CI does not publish. Default base: `/RadiationShielding-Lab/`.

## Required limitation

The calculations primarily describe uncollided photon attenuation under
stated model assumptions. They are not a substitute for validated radiation
transport simulations, professional shielding design, or regulatory radiation
protection assessments. No site-safety determination or actual dose is inferred
from transmission alone. No neutron, alpha or beta shielding is calculated.
