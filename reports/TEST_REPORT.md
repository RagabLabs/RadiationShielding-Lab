# Actual test report — v1.0.0

Generated 2026-10-14T19:41:14.786762+00:00. These counts describe retained executed results, not planned work.

| Check | Actual result | Evidence |
|---|---|---|
| npm ci | PASS; dependencies installed from lockfile | reports/npm-ci.log |
| Vitest | 169/169 passed; 0 failed; 0 pending | reports/vitest-results.json |
| Independent scientific reference cases | 10/10 PASS; included in Vitest, not extra tests | reports/scientific-validation.json |
| NIST integrity | PASS; 11 materials, 1110 source energy rows, 54 edge pairs | reports/data-validation.json |
| TypeScript | PASS | reports/typecheck.log |
| PDF visual QA | PASS; 5 sample pages + 4 review pages rendered and visually inspected | reports/pdf-layout-check.json; reports/PDF_QA.md |
| Production build | PASS; static assets and offline standalone produced | reports/build.log |
| Built standalone execution | PASS in jsdom; 7 smoke checks, not browser-engine tests | reports/standalone-smoke.json |
| Offline data reconstruction | PASS; both normalized JSON files byte-identical | reports/offline-import.json |
| Playwright desktop/mobile | 30 defined; 0 executed; 30 NOT EXECUTED | reports/playwright-list.txt |

## Executed Vitest files

| File | Cases | Scope |
|---|---:|---|
| tests/physics.test.ts | 60 | Ten Decimal references; units, edges, thresholds, domains, vacuum, very small loss, inverse targets, layer permutations, spectra, uncertainty. |
| tests/data.test.ts | 89 | Every material/source: hashes, exact rows, edge pairs, domains, composition and partial sums. |
| tests/reports.test.ts | 5 | Analysis/snapshot equality, CSV escaping/provenance, null values and actual PDF serialization. |
| tests/ui.test.tsx | 15 | DOM material/energy/density/unit changes, add/remove layers, validation, SVG paths, Arabic/English, themes, navigation, independent-page inputs and huge-path handling. |

Maximum absolute difference in the ten independent reference cases:
4.4408920985006262e-16. This is an arithmetic comparison,
not an estimate of physical uncertainty.

## Browser and export verification matrix

| Requested behavior | Executed evidence | Actual browser status |
|---|---|---|
| Material, energy, density and units | Vitest DOM integration | Prepared; NOT EXECUTED |
| Add/remove layers and spectrum errors | Vitest DOM integration | Prepared; NOT EXECUTED |
| Charts and keyboard data inspection | SVG geometry/controls tested in DOM; keyboard browser test prepared | NOT EXECUTED |
| CSV content | Shared snapshot content/escaping tested; sample written | Download interaction NOT EXECUTED |
| PDF content | Shared snapshot; real PDF serialization; sample generated and separately rendered for QA | Download interaction NOT EXECUTED |
| PNG | SVG-to-canvas export implemented; PNG signature assertion prepared | Encoding/download NOT EXECUTED |
| English/Arabic and light/dark | Vitest DOM and built-bundle smoke | Browser rendering NOT EXECUTED |
| Phone/desktop layout | Responsive CSS and two prepared Playwright projects | Visual/layout NOT EXECUTED |

The managed environment has no browser binary or required browser-control
capability. No alternate preview server or browser installation was attempted.
The build was executed as its complete inline bundle in jsdom; this does not
prove layout, browser canvas encoding or file-download behavior. The 30 browser
cases are distinct from the executed Vitest total. GitHub CI is configured to
install Chromium and run them on a suitable host; that remote CI has not run.

## Remaining issues

- Actual browser/responsive/canvas/download review is pending.
- NIST SRD public redistribution rights must be resolved before public release.
- Source-model and interpolation limits remain as documented; there is no
  engineering dose/safety certification or scattered-field simulation.
- The build can report a bundle-size advisory and a client-directive advisory.
  Neither prevented a production build or the standalone DOM smoke check.

The full per-calculation reference/value/difference/source/test/limits table is
in SCIENTIFIC_VALIDATION.md and reports/scientific-validation.json.
