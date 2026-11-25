/* OKLA – rebuilds public/v91/core/okla_photo2_map.js: for every product of the shop, the file name of its main photo
   mapped to the file name of its second photo (both as Shoptet names them, e.g. "46_name---pohled-1.jpg" ->
   "46-1_name---pohled-2.jpg"). The PC product cards show the second photo while the mouse is over them
   (okla_photo2.js); they swap only the file name in their own picture address, so the size and signature stay right.

   Usage:  node tools/catalog_snapshot.mjs && node tools/build_second_photos.mjs
   (reads data/product-reconciliation/live-catalog.json; fetches each product page once) */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const live = JSON.parse(fs.readFileSync(path.join(root, "data", "product-reconciliation", "live-catalog.json"), "utf8"));
const products = live.products.filter((p) => p.sku && p.url);
const name = (u) => decodeURIComponent(String(u).split("?")[0].split("/").pop());

const map = {};
let done = 0, without = 0;
for (const p of products) {
  try {
    const html = await (await fetch(p.url, { headers: { "User-Agent": "okla-build" } })).text();
    /* the gallery: the big pictures in the page's order, each once */
    const files = [];
    for (const m of html.matchAll(/\/user\/shop\/big\/([^"'?\s)]+)\?/g)) { const f = decodeURIComponent(m[1]); if (!files.includes(f)) files.push(f); }
    const main = name(p.image) || files[0];
    /* the main photo first; the second one is the next picture of the same product (its id is the main's id + "-1") */
    const id = (main.match(/^(\d+)_/) || [])[1];
    const second = id ? files.find((f) => f.startsWith(id + "-1_")) || files.find((f) => f !== main && f.startsWith(id + "-")) : null;
    if (main && second) map[main] = second; else without++;
  } catch (e) { without++; }
  done++;
}

const out = `/* OKLA – each product's main photo -> its second photo (file names), for the PC card hover (okla_photo2.js).
   Built by tools/build_second_photos.mjs from the shop (${new Date().toISOString().slice(0, 10)}); a product missing here simply keeps its photo. */
window.OKLA_PHOTO2=${JSON.stringify(map)};
`;
fs.writeFileSync(path.join(root, "public", "v91", "core", "okla_photo2_map.js"), out);
console.log(`products ${done}, with a second photo ${Object.keys(map).length}, without ${without}`);
