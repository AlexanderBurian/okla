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
    parameters: parameters.length ? parameters : undefined
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

export function parseInfoPage(html: string, url: string, title: string): KnowledgeItem | undefined {
  const body = blockAfter(html, /<div[^>]*class="[^"]*content-inner[^"]*"[^>]*>/i)
    || blockAfter(html, /<main[^>]*>/i)
    || html;
  const text = htmlToText(body)
    .replace(/Přejít na obsah|Přihlášení|Košík je prázdný/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  const heading = h1 ? htmlToText(h1[1] ?? "").replace(/\s*\|\s*OKLA\.cz\s*$/i, "").replace(/\.$/, "") : "";
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
    return await fetch(url, { signal: controller.signal, headers: { "user-agent": "OKLA-poradce/1.0 (+katalog pro chat)", accept: "text/html,application/xml,*/*" } });
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

export interface CrawlResult { products: KnowledgeItem[]; pages: KnowledgeItem[] }

export async function crawlShop(base: string, maxPages = 400, concurrency = 4): Promise<CrawlResult> {
  const origin = new URL(base).origin;
  const urls = (await sitemapUrls(base)).filter((u) => u.startsWith(origin)).slice(0, maxPages);
  const products: KnowledgeItem[] = [];
  const pages: KnowledgeItem[] = [];
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
        if (product) { products.push(productToItem(product)); continue; }
        const title = INFO_PAGES[slug];
        if (title) { const page = parseInfoPage(html, url, title); if (page) pages.push(page); }
        else if (/^nase-novinky\/[^/]+$/.test(slug)) { const article = parseArticlePage(html, url); if (article) pages.push(article); }
      } catch {
        /* one failing page never stops the crawl */
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return { products, pages };
}
