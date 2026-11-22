import { gunzipSync } from "node:zlib";
import type { KnowledgeItem } from "./types.js";

/* Live knowledge straight from the shop: the sitemap lists every product and information page; each product page
   carries schema.org microdata (name, price, availability, SKU, brand) and its full description. Refreshed on a
   timer, so prices, stock and new products are known without any export or API key. */

/* words a visitor uses for each information page, so the search finds it */
const INFO_KEYWORDS: Record<string, string[]> = {
  "doprava-a-platba": ["doprava", "doručení", "dopravce", "zásilkovna", "výdejní místo", "platba", "dobírka", "převod", "kartou", "poštovné", "cena dopravy"],
  "vraceni-zbozi-a-odstoupeni": ["vrácení", "vrátit", "odstoupení", "14 dnů", "peníze zpět", "výměna"],
  "reklamacni-rad": ["reklamace", "reklamovat", "vada", "nefunguje", "záruka", "oprava", "rozbité"],
  "obchodni-podminky": ["obchodní podmínky", "smlouva", "prodávající", "cena", "objednávka", "kupní smlouva"],
  "jak-nakupovat": ["jak nakupovat", "objednat", "objednávka", "registrace", "košík", "postup"],
  "kontakt": ["kontakt", "telefon", "e-mail", "email", "adresa", "podpora", "napsat"],
  "o-nas": ["o nás", "kdo jste", "firma", "obchod", "ostrava", "historie"],
  "podminky-ochrany-osobnich-udaju": ["osobní údaje", "gdpr", "soukromí", "cookies", "ochrana údajů"],
  "podminky-reklamnich-akci": ["akce", "sleva", "slevový kód", "kupón", "soutěž", "dárek"]
};

const INFO_PAGES: Record<string, string> = {
  "doprava-a-platba": "Doprava a platba",
  "vraceni-zbozi-a-odstoupeni": "Vrácení zboží a odstoupení od smlouvy",
  "reklamacni-rad": "Reklamační řád",
  "obchodni-podminky": "Obchodní podmínky",
  "jak-nakupovat": "Jak nakupovat",
  "kontakt": "Kontakt",
  "o-nas": "O nás",
  "podminky-ochrany-osobnich-udaju": "Ochrana osobních údajů",
  "podminky-reklamnich-akci": "Podmínky reklamních akcí"
};

export function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&plus;/gi, "+")
    .replace(/&minus;/gi, "−")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, code) => String.fromCodePoint(parseInt(code, 16)));
}

export function htmlToText(html: string): string {
  return decodeEntities(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:br|\/p|\/li|\/h[1-6]|\/tr|\/div)\b[^>]*>/gi, ". ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s*\.\s*(\.\s*)+/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/^[.\s]+/, "")
    .trim();
}

function meta(html: string, prop: string): string | undefined {
  const re = new RegExp(`itemprop="${prop}"[^>]*?(?:content|href)="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? decodeEntities(m[1] ?? "").trim() : undefined;
}

/* the inner HTML of the first element whose opening tag matches `open`, balanced on <div> */
function blockAfter(html: string, open: RegExp): string | undefined {
  const m = open.exec(html);
  if (!m) return undefined;
  let depth = 1;
  const re = /<(\/?)div\b[^>]*>/gi;
  re.lastIndex = m.index + m[0].length;
  let t: RegExpExecArray | null;
  while ((t = re.exec(html))) {
    depth += t[1] ? -1 : 1;
    if (depth === 0) return html.slice(m.index + m[0].length, t.index);
  }
  return html.slice(m.index + m[0].length, m.index + m[0].length + 20000);
}

export interface LiveProduct {
  url: string;
  name: string;
  price?: number;
  availability?: string;
  sku?: string;
  brand?: string;
  category?: string;
  short?: string;
  description?: string;
  parameters?: string[];
  /* the shop's delivery methods for this product, from its microdata (name, price, country) */
  shipping?: ShippingOption[];
  /* the customers' rating (schema.org AggregateRating), when the product has one */
  rating?: { value: number; count: number };
}

export interface ShippingOption { label: string; price?: number; country?: string }

/* every schema.org OfferShippingDetails block of a product page: Shoptet lists there the delivery methods the product
   can be sent with, each with its price and country - the only machine-readable, always current delivery data */
export function parseShipping(html: string): ShippingOption[] {
  const out: ShippingOption[] = [];
  for (const m of html.matchAll(/itemprop="shippingDetails"[\s\S]*?itemprop="addressCountry"[^>]*content="([^"]*)"/gi)) {
    const block = m[0];
    const label = block.match(/itemprop="shippingLabel"[^>]*content="([^"]*)"/i)?.[1];
    const value = block.match(/itemprop="shippingRate"[\s\S]*?itemprop="value"[^>]*content="([^"]*)"/i)?.[1];
    if (!label) continue;
    const price = value === undefined ? undefined : Number(value.replace(",", "."));
    out.push({ label: decodeEntities(label).trim(), price: Number.isFinite(price) ? price : undefined, country: m[1] || undefined });
  }
  return out;
}

/* the homepage's product groups ("Akční zboží", "Novinky", "To nejlepší od nás", ...): group name -> product paths in
   the shop's order, so the adviser knows what is new, on offer or recommended right now */
export function parseHomepageGroups(html: string): Array<{ name: string; paths: string[] }> {
  const heads = [...html.matchAll(/<(?:div|h2|h3)[^>]*class="[^"]*homepage-group-title[^"]*"[^>]*>([\s\S]*?)<\/(?:div|h2|h3)>/gi)];
  const groups = new Map<string, string[]>();
  heads.forEach((head, index) => {
    const name = htmlToText(head[1] ?? "").replace(/\.$/, "").trim();
    if (!name) return;
    const section = html.slice((head.index ?? 0) + head[0].length, heads[index + 1]?.index ?? html.length);
    const paths = [...section.matchAll(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*\bname\b[^"]*"/gi)]
      .map((a) => { try { return new URL(decodeEntities(a[1] ?? ""), "https://www.okla.cz").pathname; } catch { return ""; } })
      .filter(Boolean);
    if (paths.length) groups.set(name, [...new Set([...(groups.get(name) ?? []), ...paths])]);
  });
  return [...groups].map(([name, paths]) => ({ name, paths }));
}

export function parseProductPage(html: string, url: string): LiveProduct | undefined {
  const at = html.search(/itemtype="https?:\/\/schema\.org\/Product"/i);
  if (at < 0) return undefined;
  const scope = html.slice(at);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const name = (meta(scope, "name") || (h1 ? htmlToText(h1[1] ?? "") : "")).trim();
  if (!name) return undefined;
  const priceRaw = meta(scope, "price");
  const price = priceRaw ? Number(priceRaw.replace(",", ".")) : undefined;
  const availability = meta(scope, "availability")?.replace(/^https?:\/\/schema\.org\//i, "");
  const brandBlock = scope.match(/itemprop="brand"[\s\S]{0,400}?itemprop="name"[^>]*content="([^"]*)"/i);
  const category = html.match(/itemprop="category"[^>]*content="([^"]*)"/i)?.[1];
  const shortBlock = blockAfter(html, /<div[^>]*class="[^"]*p-short-description[^"]*"[^>]*>/i);
  const descBlock = blockAfter(html, /<div[^>]*id="description"[^>]*>/i);
  const description = descBlock ? htmlToText(descBlock).replace(/^Detailní popis produktu\.?\s*/i, "") : undefined;
  /* the parameters table (name: value), so technical questions are answered from the shop's own data */
  const paramTable = html.match(/<table[^>]*class="[^"]*detail-parameters[^"]*"[^>]*>([\s\S]*?)<\/table>/i)?.[1] ?? "";
  const parameters = [...paramTable.matchAll(/<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi)]
    .map((row) => `${htmlToText(row[1] ?? "").replace(/[:.]+$/, "")}: ${htmlToText(row[2] ?? "").replace(/\.$/, "")}`)
    .filter((line) => line.length > 3 && line.length < 200)
    .slice(0, 30);
  return {
    url,
    name: decodeEntities(name),
    price: Number.isFinite(price) ? price : undefined,
    availability,
    sku: meta(scope, "sku"),
    brand: brandBlock?.[1] ? decodeEntities(brandBlock[1]) : undefined,
    category: category ? decodeEntities(category).split(">").map((part) => part.trim()).filter((part) => part && !/úvodní stránka/i.test(part)).slice(0, -1).join(" > ") || undefined : undefined,
    short: shortBlock ? htmlToText(shortBlock) : meta(html, "description"),
    description,
    parameters: parameters.length ? parameters : undefined,
    shipping: parseShipping(scope),
    rating: (() => {
      const value = Number((meta(scope, "ratingValue") ?? "").replace(",", "."));
      const count = Number(meta(scope, "reviewCount") ?? meta(scope, "ratingCount") ?? "");
      return Number.isFinite(value) && value > 0 && Number.isFinite(count) && count > 0 ? { value, count } : undefined;
    })()
  };
}

export function availabilityText(value?: string): string | undefined {
  if (!value) return undefined;
  if (/InStock/i.test(value)) return "skladem";
  if (/OutOfStock|SoldOut/i.test(value)) return "momentálně není skladem";
  if (/PreOrder|BackOrder/i.test(value)) return "na objednávku";
  if (/LimitedAvailability/i.test(value)) return "omezeně skladem";
  return undefined;
}

export function formatPrice(amount?: number): string | undefined {
  if (amount === undefined || !Number.isFinite(amount)) return undefined;
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount);
}

export function productToItem(p: LiveProduct): KnowledgeItem {
  const stock = availabilityText(p.availability);
  const price = formatPrice(p.price);
  const facts = [
    p.short,
    price && `Cena: ${price} (aktuálně na e-shopu).`,
    stock && `Dostupnost: ${stock}.`,
    p.category && `Kategorie: ${p.category}.`,
    p.brand && `Značka: ${p.brand}.`,
    p.rating && `Hodnocení zákazníků: ${String(p.rating.value).replace(".", ",")} z 5 (${p.rating.count}×).`,
    p.parameters?.length ? `Parametry: ${p.parameters.join("; ")}.` : undefined,
    p.description && p.description !== p.short ? `Popis: ${p.description}` : undefined
  ].filter(Boolean);
  return {
    id: `live-${p.sku || p.url}`,
    type: "product",
    title: p.name,
    content: facts.join(" ").slice(0, 5000),
    url: p.url,
    keywords: [p.sku, p.brand, p.category].filter((v): v is string => Boolean(v)),
    price: p.price,
    inStock: p.availability ? /InStock|LimitedAvailability/i.test(p.availability) : undefined,
    category: p.category
  };
}

/* the shop's company line that every information page repeats at its top ("DIČ: … | IČO: … | Okla.cz – Kratas Pro
   s.r.o. | E-mail: …") is page chrome, not content: an answer built from the page must never start with it */
export function cleanPageText(text: string): string {
  return text
    .replace(/DIČ:\s*CZ\d+\s*\|\s*IČO:\s*\d+\s*\|[^|]{0,80}\|\s*E-mail:\s*\S+\s*\.?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseInfoPage(html: string, url: string, title: string): KnowledgeItem | undefined {
  const body = blockAfter(html, /<div[^>]*class="[^"]*content-inner[^"]*"[^>]*>/i)
    || blockAfter(html, /<main[^>]*>/i)
    || html;
  const text = cleanPageText(htmlToText(body)
    .replace(/Přejít na obsah|Přihlášení|Košík je prázdný/gi, " "));
  if (text.length < 80) return undefined;
  return {
    id: `page-${url}`,
    type: "faq",
    title,
    content: text.slice(0, 6000),
    url,
    keywords: INFO_KEYWORDS[new URL(url).pathname.replace(/^\/|\/$/g, "")] ?? []
  };
}

/* a magazine article (/nase-novinky/<article>/): its heading and text, for "how do I choose / what is" questions */
export function parseArticlePage(html: string, url: string): KnowledgeItem | undefined {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const heading = h1 ? htmlToText(h1[1] ?? "").replace(/\s*\|\s*Okla\.cz\s*$/i, "").replace(/\.$/, "") : "";
  const body = blockAfter(html, /<div[^>]*class="[^"]*okla-clanek__body[^"]*"[^>]*>/i)
    || blockAfter(html, /<div[^>]*class="[^"]*news-item-detail[^"]*"[^>]*>/i)
    || blockAfter(html, /<div[^>]*class="[^"]*content-inner[^"]*"[^>]*>/i);
  if (!body) return undefined;
  const text = htmlToText(body).replace(/\s+/g, " ").trim();
  if (!heading || text.length < 200) return undefined;
  return {
    id: `article-${url}`,
    type: "faq",
    title: `Článek: ${heading}`,
    content: text.slice(0, 5000),
    url,
    keywords: ["článek", "návod", "rada", "jak vybrat", "magazín"]
  };
}

async function get(url: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, headers: { "user-agent": "Okla-poradce/1.0 (+katalog pro chat)", accept: "text/html,application/xml,*/*" } });
  } finally {
    clearTimeout(timer);
  }
}

async function sitemapUrls(base: string): Promise<string[]> {
  const index = await (await get(new URL("/sitemap.xml", base).toString())).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => (m[1] ?? "").trim()).filter(Boolean);
  const out: string[] = [];
  for (const map of maps) {
    if (!/sitemap/i.test(map) || !/\.xml(\.gz)?$/i.test(map)) { out.push(map); continue; }
    const res = await get(map);
    const buf = Buffer.from(await res.arrayBuffer());
    const xml = /\.gz$/i.test(map) || (buf[0] === 0x1f && buf[1] === 0x8b) ? gunzipSync(buf).toString("utf8") : buf.toString("utf8");
    out.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeEntities((m[1] ?? "").trim())).filter(Boolean));
  }
  return [...new Set(out)];
}

export interface CrawlResult {
  products: KnowledgeItem[];
  pages: KnowledgeItem[];
  /* the delivery methods found on the product pages (each once per country, with its lowest and highest price) */
  shipping: Array<ShippingOption & { maxPrice?: number }>;
  /* the homepage's product groups (name -> product paths) */
  groups: Array<{ name: string; paths: string[] }>;
}

/* an information page whose text is about something else than its title (e.g. "Doprava a platba" filled with the
   returns policy) would make the adviser answer the wrong thing: such a page is left out */
function pageMatchesTitle(slug: string, text: string): boolean {
  if (slug === "doprava-a-platba") return /zásilkovn|dopravc|poštovn|ppl|dpd|gls|balíkovn|osobní odběr|cena dopravy|doručení zdarma/i.test(text);
  return true;
}

export async function crawlShop(base: string, maxPages = 400, concurrency = 4): Promise<CrawlResult> {
  const origin = new URL(base).origin;
  const urls = (await sitemapUrls(base)).filter((u) => u.startsWith(origin)).slice(0, maxPages);
  const products: KnowledgeItem[] = [];
  const pages: KnowledgeItem[] = [];
  const shipping = new Map<string, ShippingOption & { maxPrice?: number }>();
  let groups: CrawlResult["groups"] = [];
  try {
    const home = await get(new URL("/", base).toString());
    if (home.ok) groups = parseHomepageGroups(await home.text());
  } catch {
    /* without the homepage the groups are simply unknown */
  }
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      if (!url) continue;
      const slug = new URL(url).pathname.replace(/^\/|\/$/g, "");
      try {
        const res = await get(url);
        if (!res.ok) continue;
        const html = await res.text();
        const product = parseProductPage(html, url);
        if (product) {
          products.push(productToItem(product));
          for (const option of product.shipping ?? []) {
            const key = `${option.label}|${option.country ?? ""}`;
            const known = shipping.get(key);
            if (!known) shipping.set(key, { ...option, maxPrice: option.price });
            else if (option.price !== undefined) {
              known.price = known.price === undefined ? option.price : Math.min(known.price, option.price);
              known.maxPrice = known.maxPrice === undefined ? option.price : Math.max(known.maxPrice, option.price);
            }
          }
          continue;
        }
        const title = INFO_PAGES[slug];
        if (title) { const page = parseInfoPage(html, url, title); if (page && pageMatchesTitle(slug, page.content)) pages.push(page); }
        else if (/^nase-novinky\/[^/]+$/.test(slug)) { const article = parseArticlePage(html, url); if (article) pages.push(article); }
      } catch {
        /* one failing page never stops the crawl */
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return { products, pages, shipping: [...shipping.values()], groups };
}

/* ---------- the storefront's product index (GET /api/catalog) ----------
   The shop's search, cart drawer and suggestions (okla_live_catalog.js) need every product with its listing picture,
   price, stock and add-to-cart ids. Each visitor's browser used to read all category listings for it (well over a
   megabyte of HTML on a phone's first visit); the service reads them here with its regular crawl and hands the
   result over as one small JSON, in exactly the shape the storefront builds itself. */
export interface IndexItem {
  pid: string; prc: string; code: string; name: string; url: string; image: string;
  price: number | null; available: boolean | null; shortDescription: string; defaultCategory: string; brand: string; live: true;
}

const attr = (html: string, re: RegExp): string => decodeEntities(html.match(re)?.[1] ?? "").trim();

export function parseListingCards(html: string, origin: string, categoryName: string): IndexItem[] {
  const out: IndexItem[] = [];
  const parts = html.split(/(?=<div class="p"[^>]*data-micro="product")/);
  for (const card of parts.filter((part) => /^<div class="p"[^>]*data-micro="product"/.test(part))) {
    const href = card.match(/<a[^>]*href="([^"]+)"[^>]*class="(?:image|name)"|<a\s+href="([^"]+)"\s+class="(?:image|name)"/);
    const raw = href?.[1] ?? href?.[2] ?? card.match(/href="([^"]+)"/)?.[1];
    if (!raw) continue;
    let path: string;
    try { path = new URL(decodeEntities(raw), origin).pathname; } catch { continue; }
    let image = attr(card, /<img[^>]*data-src="([^"]+)"/) || attr(card, /<img[^>]*src="(?!data:)([^"]+)"/);
    if (/^data:/.test(image)) image = "";
    const priceRaw = card.match(/data-micro-price="([^"]+)"/)?.[1];
    const availability = card.match(/data-micro-availability="([^"]*)"/)?.[1];
    const name = htmlToText(card.match(/data-micro="name"[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? "");
    const sku = attr(card, /data-micro="sku"[^>]*>([^<]*)</);
    const price = priceRaw ? Number(priceRaw) : NaN;
    out.push({
      pid: attr(card, /name="productId"\s+value="([^"]*)"/),
      prc: attr(card, /name="priceId"\s+value="([^"]*)"/),
      code: sku || `URL:${path}`,
      name,
      url: origin + path,
      image,
      price: Number.isFinite(price) ? price : null,
      available: priceRaw ? !/OutOfStock|SoldOut|Discontinued/i.test(availability ?? "") : null,
      shortDescription: htmlToText(card.match(/class="p-desc"[^>]*>([\s\S]*?)<\/(?:div|p)>/)?.[1] ?? ""),
      defaultCategory: categoryName,
      brand: "",
      live: true
    });
  }
  return out.filter((item) => item.name);
}

/* the top categories of the shop's main menu (the first link of every first-level item) */
export function menuCategories(homeHtml: string): string[] {
  const menu = homeHtml.slice(Math.max(0, homeHtml.indexOf('class="menu-level-1"')));
  const out = [...menu.matchAll(/<li class="menu-item-\d+[^"]*"[^>]*><a href="(\/[^"/]+\/)"[^>]*role="menuitem"/g)].map((m) => m[1] as string);
  return [...new Set(out)];
}

export async function crawlStoreIndex(base: string): Promise<IndexItem[]> {
  const origin = new URL(base).origin;
  const home = await (await get(new URL("/", base).toString())).text();
  const categories = menuCategories(home);
  if (categories.length < 3) return [];
  const items: IndexItem[] = [];
  for (const href of categories) {
    const first = await get(origin + href);
    if (!first.ok) throw new Error(`category ${href}: ${first.status}`);
    const html = await first.text();
    const name = htmlToText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") || href;
    items.push(...parseListingCards(html, origin, name));
    const pages = [...new Set([...html.matchAll(new RegExp(`href="(${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}strana-\\d+/)"`, "g"))].map((m) => m[1] as string))];
    for (const page of pages) {
      const res = await get(origin + page);
      if (!res.ok) throw new Error(`category page ${page}: ${res.status}`);
      items.push(...parseListingCards(await res.text(), origin, name));
    }
  }
  /* a product also appears in the pages' small sliders (no cart ids, a 100 px picture): one entry per product, the
     listing's card first */
  const score = (item: IndexItem) => (item.pid ? 2 : 0) + (/\/related\//.test(item.image) ? 0 : 1);
  const byUrl = new Map<string, IndexItem>();
  for (const item of items) {
    const known = byUrl.get(item.url);
    if (!known || score(item) > score(known)) byUrl.set(item.url, item);
  }
  return [...byUrl.values()];
}

const COUNTRY: Record<string, string> = { CZ: "Česko", SK: "Slovensko", HU: "Maďarsko" };

/* "Doprava a platba" written from the crawl: the delivery methods with their current prices, the homepage groups
   (what is new, on offer, recommended) - two small knowledge items the search finds for such questions */
export function liveShopNotes(result: Pick<CrawlResult, "shipping" | "groups">, products: KnowledgeItem[], base = "https://www.okla.cz"): KnowledgeItem[] {
  const notes: KnowledgeItem[] = [];
  if (result.shipping.length) {
    const lines = result.shipping.map((s) => {
      const price = s.price === undefined ? "cena v košíku"
        : s.price === 0 && !s.maxPrice ? "zdarma"
          : s.maxPrice && s.maxPrice !== s.price ? `${formatPrice(s.price)} až ${formatPrice(s.maxPrice)} podle zboží` : formatPrice(s.price);
      return `${s.label}${s.country ? ` (${COUNTRY[s.country] ?? s.country})` : ""}: ${price}`;
    });
    notes.push({
      id: "live-shipping",
      type: "faq",
      title: "Doprava – aktuální způsoby a ceny z e-shopu",
      content: `Způsoby dopravy, které e-shop u zboží právě nabízí, a jejich ceny: ${lines.join("; ")}. Výdejní místo nebo box si zákazník vybere v košíku na mapě. Způsob platby se volí v košíku podle zvolené dopravy (převodem na účet, nebo na dobírku); jiné způsoby platby nejsou v podkladech uvedené. Konečnou cenu dopravy i platby zákazník vidí v košíku před odesláním objednávky.`,
      url: new URL("/doprava-a-platba/", base).toString(),
      keywords: ["doprava", "doručení", "dopravce", "zásilkovna", "výdejní místo", "box", "z-box", "poštovné", "cena dopravy", "kolik stojí doprava", "doprava zdarma", "platba", "zaplatit", "dobírka", "převod", "kartou"]
    });
  }
  if (result.groups.length) {
    const byPath = new Map(products.filter((p) => p.url).map((p) => [new URL(p.url as string).pathname, p]));
    const parts = result.groups.map((group) => {
      const names = group.paths.map((path) => byPath.get(path)).filter((p): p is KnowledgeItem => Boolean(p))
        .slice(0, 8).map((p) => `${p.title}${p.price ? ` (${formatPrice(p.price)})` : ""}`);
      return names.length ? `${group.name}: ${names.join(", ")}` : "";
    }).filter(Boolean);
    if (parts.length) notes.push({
      id: "live-homepage-groups",
      type: "faq",
      title: "Novinky, akce a doporučené zboží – aktuálně na hlavní stránce",
      content: `Co e-shop právě ukazuje na hlavní stránce: ${parts.join(". ")}.`,
      url: new URL("/", base).toString(),
      keywords: ["novinky", "nové", "nového", "nejnovější", "akce", "akční", "sleva", "slevy", "výprodej", "doporučujete", "nejlepší", "nejoblíbenější", "nejprodávanější", "tip", "dárek"]
    });
  }
  return notes;
}
