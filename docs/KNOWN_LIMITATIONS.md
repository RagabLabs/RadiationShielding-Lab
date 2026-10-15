# Known limitations — v1.0.0

1. Uncollided photons only. No broad-beam buildup, multiple scattering,
   source geometry, fluorescence, secondary-electron transport or dose/safety
   determination. Photonuclear interactions are omitted by the source models.
2. Source subset: 11 materials, 1 keV–20 MeV. XCOM online supports a larger
   domain, but this release does not extrapolate into that unbundled domain.
3. Reference densities are not measurements of an actual sample. Ordinary
   concrete and dry air have the explicit NIST reference compositions.
   No stainless-steel alloy grade was supplied, so none is assumed.
4. Local segmented interpolation does not reproduce NIST's full internal
   algorithms. Near-edge chemical/fine-structure effects are not modeled;
   XCOM and SRD126 source grids/rounding can differ.
5. Per-value coefficient and interpolation uncertainties are unquantified.
   Optional uncertainty applies only to a primary monoenergetic layer and
   assumes independent density/thickness errors.
6. Discrete photon weights are accepted, not arbitrary spectral-density
   bins or dose weights. Spectral hardening can occur; displayed reference
   HVL/TVL/lambda must not be treated as effective spectral values.
7. Actual browser-engine/visual/responsive checks and browser-triggered
   PDF/CSV/PNG downloads were not executed in this managed environment.
   Thirty Playwright desktop/mobile cases are prepared and enumerated,
   not marked passed. The 13 DOM integration cases and built-bundle smoke
   test use jsdom and do not prove browser rendering or canvas downloads.
8. PDF serialization is generated and rendered separately; it uses English
   scientific text in either interface language. Source metadata and raw
   diagnostic errors may also remain English within the Arabic interface.
9. The build includes data and report libraries and can emit a large-chunk
   advisory plus lucide's client-directive advisory. The standalone bundle
   favors offline completeness over code splitting. No server-side rendering
   is involved. These are build advisories, not test failures.
10. NIST SRD rights are distinct from MIT source code rights. Separate public
    redistribution permission has not been obtained. See DATA_LICENSE.md.
11. CI workflows are prepared but have not been run on a remote repository.
    No repository, hosted URL, Pages deployment, or public release is claimed.

No professional radiation shielding design, regulatory assessment or
radiological site-safety claim is made by this software.
