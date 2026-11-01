# OKLA storefront assets

Latest frontend version: **V89**. Git-integrated static assets for Shoptet storefront.

## Installation

Install one script in Shoptet **HTML code > footer**, not multiple historical loaders. For immediate reliable delivery use the immutable commit-specific jsDelivr URL after each approved release. GitHub CDN @main can be stale. For Cloudflare Pages set branch main, no build command, output directory public, then use the actual validated Pages hostname instead of a placeholder.

The bootstrap in public/zapati_firsthalf.js sequentially loads working original mobile and storefront scripts, the 33-product catalog, then only latest V89 homepage, product-detail and breadcrumb modules. Older V79 and V88 desktop style/DOM scripts remain archived but are **not loaded**. V89 styles are injected once by their JS modules, not also fetched as duplicate CSS links.

## Scope

- public/okla_home_v89.js: PC five-card grid, tablet three-card layout, full blue cart on PC, five decorative stars; original mobile card styling unchanged.
- public/okla_detail_v89.js: native purchase form and inventory, real product description/parameters/discussion, related products and trust bar.
- public/okla_navigation_v89.js: one home icon, 13px chevrons, schema.org breadcrumb preserved.
- data/qa_v89_results.json and data/RELEASE_V89.md: local QA proof and caveats.

Import of product data into the native Shoptet admin is a separate step. Inventory always comes from native Shoptet.

## OKLA AI poradce

The isolated AI widget and its Node.js backend live in `ai/chatbot`. Static widget assets are published from `public/ai/v1`. The canonical `public/zapati_firsthalf.js` storefront loader starts the AI widget only when its Shoptet script tag contains `data-api-url`; without that attribute the existing storefront remains unchanged.

Deploy `ai/chatbot` to an HTTPS Node.js host, keep `GROQ_API_KEY` only in the host's secret environment, set `MOCK_MODE=false`, `PUBLIC_BASE_URL` to the backend URL and include the exact Shoptet origins in `ALLOWED_ORIGINS`. Then use one canonical footer tag:

```html
<script
  src="https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@COMMIT_SHA/public/zapati_firsthalf.js?v=ai-1"
  data-api-url="https://YOUR-AI-BACKEND.example"
  defer></script>
```

Replace both placeholders after the static release and backend deployment. Never put the Groq API key in GitHub, Shoptet or browser JavaScript.

## Product content V92

The 33-product editorial content lives in public/content-v91. The detail loader loads its scoped layout and catalog override before constructing the product detail. Import data/content-v91/okla_shoptet_import_33_content_v92.csv to store the same descriptions, SEO fields and text parameters natively in Shoptet. Product stock and prices remain native. Photographs and generated usage illustrations are pinned to asset commit 32753e1217ef69f24ed8aa78062ea4a054285a45. Generic products retain only supported characteristics; unidentified specifications are listed in content-qa.json.
