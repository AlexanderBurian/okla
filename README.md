# OKLA storefront

Everything OKLA adds to the Shoptet shop okla.cz: look, behaviour, translations and the AI adviser. Served from this
repository through jsDelivr, pinned to a commit.

## How it is put together

```
public/
  zapati_firsthalf.js   the one loader (Shoptet: HTML kód > zápatí) - start-up, page detection, the bundle table,
                        loading curtain, loading
  dist/                 built bundles: one .css and/or .js per category (generated, do not edit)
  v91/                  sources: one file per feature (okla_<feature>.css / .js), images in img/ and assets/,
                        language packs okla_i18n_<lang>.js (loaded on demand)
  legacy/v53, v55       the original storefront core and homepage news, still part of the core bundle
  content-v91/          product page content (33 products) and its layout
  newsroom/             the article hub (/newsroom and /nase-novinky/)
  okla_footer.js        footer (+ its images in okla_footer/)
  okla_v86_catalog.js   product catalogue data
  ai/v1/                the AI chat widget
tools/
  build.js              builds public/dist from the bundle table
  check_order.js        checks that a loader loads the same files in the same order as another one
```

The bundle table in `public/zapati_firsthalf.js` lists, in their fixed order, which files make up each bundle and on
which pages it loads:

| Bundle | Pages | What |
|---|---|---|
| 01-core | all | translations, storefront core, base phone look, shared behaviour |
| 02-home | homepage | news images, layout, banners, search |
| 03-catalog | all | side banners, product catalogue |
| 04-product | product page | content, layout, cross-sell |
| 05-layout | all | navigation, phone shell, product cards, native pages, sidebar |
| 06-product-phone | product page | product page on phones |
| 07-checkout | cart and checkout | cart and checkout |
| 08–18 | one page each | newsroom, article, order status, complaint form, orders, about, how to buy, contact, account, sign-in, 404 |
| 19-shared | all | empty states, payment logos, header, desktop hover cart |
| 20-legal | legal pages | full-width legal articles |
| 21-polish | all | final header, sticky navbar, phone footer and menu, buttons and fields |
| 22-product-extras | product page | tabs, product tools, buy bar |
| 23-finish | all | typeface, text contrast, dead links, product prices |
| 24-checkout-fix, 26-checkout-skin | cart and checkout | checkout corrections and skin |
| 25-buttons | all | call-to-action colour and shape |
| 27-thank-you | after an order | the thank-you page with QR payment |
| 28-last | all | no zoom on phone fields, AI chat branding |
| 29-home-magazine | homepage | editorial blocks |
| 99-later | all | search, login popup, cart drawer, footer - loaded after the page is shown |

The order matters: later styles override earlier ones, so a file is added at the place in the table where it belongs.

## Making a change

1. Edit the source file (`public/v91/...`) or the table in `public/zapati_firsthalf.js`.
2. Build: `cd tools && npm install` (once), then `node tools/build.js` from the repository root.
3. Commit the sources and `public/dist` together, push.
4. Put the new commit into the footer tag in Shoptet (below).

To debug with the original files instead of the bundles, open the shop with `?okla-src=1` (remembered in the browser;
`?okla-src=0` switches back).

## Footer tag

```html
<script
  src="https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@COMMIT_SHA/public/zapati_firsthalf.js?v=ai-SHORT_SHA"
  data-api-url="https://okla-ai-chatbot-cz.onrender.com"
  defer>
</script>
```

Always use the full commit hash; a branch name can be served stale by jsDelivr. Install the loader once only.

## OKLA AI poradce

The isolated AI widget and its Node.js backend live in `ai/chatbot`. Static widget assets are published from
`public/ai/v1`. The loader starts the AI widget only when its Shoptet script tag contains `data-api-url`.

Deploy `ai/chatbot` to an HTTPS Node.js host, keep `GROQ_API_KEY` only in the host's secret environment, set
`MOCK_MODE=false`, `PUBLIC_BASE_URL` to the backend URL and include the exact Shoptet origins in `ALLOWED_ORIGINS`.
Never put the Groq API key in GitHub, Shoptet or browser JavaScript.

## Product content

The 33-product editorial content lives in `public/content-v91`. Import
`data/content-v91/okla_shoptet_import_33_content_v92.csv` to store the same descriptions, SEO fields and text parameters
natively in Shoptet. Product stock and prices always come from Shoptet. Photographs and generated usage illustrations
are pinned to asset commit 32753e1217ef69f24ed8aa78062ea4a054285a45.
