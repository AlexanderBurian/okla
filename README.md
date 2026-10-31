# OKLA static assets

The complete JavaScript and CSS used by OKLA Shoptet, plus the 33-product catalog.

## Connect Cloudflare Pages

1. Cloudflare dashboard > Workers & Pages > Create application > Pages > Connect to Git.
2. Select GitHub `AlexanderBurian/okla`.
3. Production branch `main`; framework preset None; **build command empty**; **build output directory `public`**.
4. Click Deploy. Cloudflare gives a verified `https://<project>.pages.dev` URL.
5. Test `https://<project>.pages.dev/zapati_firsthalf.js`.
6. In Shoptet footer HTML **replace**, don't duplicate, previous OKLA loader with:
`<script src="https://<project>.pages.dev/zapati_firsthalf.js" defer></script>`
(replace the placeholder with the actual Pages hostname).

GitHub CDN fallback until Pages is connected:
`<script src="https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@main/public/zapati_firsthalf.js" defer></script>`

Do not add both tags. Cloudflare Pages automatically deploys on subsequent main-branch commits. This GitHub CDN fallback may cache new commits for some time.

## Structure

- `public/zapati_firsthalf.js`: single bootstrap, loads all JS/CSS from its own host.
- `public/legacy/`: archived dependencies from versions 53–69.
- `public/okla_mobile_*`, `public/okla_desktop_*`: earlier working redesign modules.
- `public/okla_v86_catalog.js`: 33 product records, fields from the approved CSV.
- `public/okla_detail_v86.js`, `public/okla_detail_v86.css`: current product detail enhancements.
- `data/`: source catalog CSV, structured product data and QA report.

Note: Deploying this repo does not perform the 33-product Shoptet admin CSV import or change native inventory levels. Configure only one loader.