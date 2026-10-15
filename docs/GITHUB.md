# GitHub and Pages instructions

No remote repository is assumed or published. Suggested repository name:
**RadiationShielding-Lab**. The Vite base is `/RadiationShielding-Lab/`.
The self-contained START-HERE.html needs no publication.

1. Review scientific/browser limits and NIST data rights in DATA_LICENSE.md.
2. Create your own repository with the desired audience. Extract the project
   and push the source using your own account; no credentials are embedded.
3. Keep `package-lock.json` and source snapshots so `npm ci` and data validation
   are reproducible. The original source needs Node 24 and Python 3 for data
   import; the final browser build needs neither.
4. Push/PR runs `.github/workflows/ci.yml`: npm ci, data integrity, Vitest,
   type checking, production build, standalone smoke, scientific references,
   then Chromium installation and desktop/mobile Playwright checks.
5. To publish after approving it, set Settings > Pages > Source to GitHub
   Actions. Run **Publish approved GitHub Pages build** manually and select
   `publish_approved`. The workflow builds/tests and deploys only when that
   explicit boolean is true. A push alone does not deploy.
6. With the proposed name the URL has the form
   `https://YOUR_USERNAME.github.io/RadiationShielding-Lab/`.
   This is an instructional pattern, not a verified deployment URL.
7. If repository name/path differs, update Vite's base or supply
   `VITE_BASE_PATH` and update the Playwright base URL/webServer URL accordingly.
   For a user-site root or custom domain, use `/`.

Official documentation checked during preparation:

- https://vite.dev/guide/static-deploy.html
- https://playwright.dev/docs/ci-intro
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

No workflow execution on GitHub is claimed in the delivery test counts.
