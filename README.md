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
