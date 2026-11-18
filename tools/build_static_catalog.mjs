/* OKLA – rebuilds public/okla_v86_catalog.js (the product catalogue the storefront has before okla_live_catalog.js has
   read the shop) from data/product-reconciliation/live-catalog.json (node tools/catalog_snapshot.mjs writes it).

   Usage:  node tools/catalog_snapshot.mjs && node tools/build_static_catalog.mjs

   Every product the shop has, with its current name, address, photo (the shop's 423 px "detail" size), price, stock,
   short description, category and up to 4 related products from the same category. The four original products
   (OKL-001…004) keep their fuller data (parameters, SEO texts); their name, address, photo, price and stock are updated
   too. A product the shop no longer has is left out. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const live = JSON.parse(fs.readFileSync(path.join(root, "data", "product-reconciliation", "live-catalog.json"), "utf8"));
const file = path.join(root, "public", "okla_v86_catalog.js");
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(file, "utf8"), box);
const old = box.window.OKLA_V86_CATALOG || {};

/* the shop's 1024 px picture -> the same picture in the 423 px size (the signature belongs to the size, not the picture) */
const detail = (url) => String(url || "").replace("/big/", "/detail/").replace("x=1024&y=768", "x=423&y=318").replace("sg=161563f2", "sg=2175fb9d");
const short = (text) => {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  return t.length > 180 ? `${t.slice(0, 177).replace(/\s+\S*$/, "")}...` : t;
};

const products = live.products.filter((p) => p.sku && p.name && p.url);
const top = (p) => String(p.category || "").split("|")[0].trim();
const out = {};
for (const p of products) {
  const prev = old[p.sku] || {};
  const related = products.filter((q) => q !== p && top(q) === top(p)).slice(0, 4).map((q) => q.sku);
  out[p.sku] = {
    ...prev,
    code: p.sku,
    name: p.name,
    url: p.url,
    image: detail(p.image) || prev.image,
    price: p.price ?? prev.price,
    available: /InStock|LimitedAvailability/i.test(p.availability || ""),
    shortDescription: short(p.description) || prev.shortDescription || "",
    defaultCategory: top(p) || prev.defaultCategory || "",
    brand: p.manufacturer || prev.brand || "",
    related: related.length ? related : (prev.related || []).filter((code) => products.some((q) => q.sku === code))
  };
}

const header = `/* OKLA product catalogue: every product the shop has (snapshot of the shop, ${live.capturedAt.slice(0, 10)}; built by
   tools/build_static_catalog.mjs), so search, the cart drawer and suggestions never offer a product that no longer exists,
   even before okla_live_catalog.js has read the listings (it keeps refreshing prices and stock, adds new products and
   drops removed ones). The four original products keep their fuller data (parameters, SEO texts). */
`;
fs.writeFileSync(file, `${header}window.OKLA_V86_CATALOG=${JSON.stringify(out)};\n`);
console.log(`products ${Object.keys(out).length} (before ${Object.keys(old).length}); removed: ${Object.keys(old).filter((k) => !out[k]).join(", ") || "none"}`);
