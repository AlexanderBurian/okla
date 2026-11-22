import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { cleanPageText, crawlShop, crawlStoreIndex, formatPrice, liveShopNotes, type IndexItem } from "./liveCatalog.js";
import type { KnowledgeItem } from "./types.js";

const STOP_WORDS = new Set([
  "a", "aby", "ale", "co", "do", "je", "jak", "jako", "jsem", "k", "ke", "který", "má", "mi",
  "na", "nebo", "od", "po", "pro", "se", "si", "s", "to", "u", "v", "ve", "z", "za", "že",
  "mate", "mas", "mam", "chci", "chtel", "chtela", "potrebuji", "hledam", "nejaky", "nejakou", "nejake", "neco",
  "jaky", "jaka", "jake", "jakou", "ktery", "ktera", "ktere", "kterou", "muzu", "muzete", "byste", "bych", "prosim",
  "dobry", "den", "ahoj", "me", "mne", "vas", "vam", "nam", "jsou", "bude", "byt", "tak", "taky", "take",
  "uz", "jen", "ten", "ta", "tu", "tyto", "tento", "tenhle", "tahle", "toto", "tohle", "ma", "kc", "korun",
  "the", "and", "for", "with", "you", "have", "is", "what", "which"
]);

/* a few everyday words customers use for what the catalogue calls differently */
const SYNONYMS: Record<string, string[]> = {
  kamera: ["endoskop", "inspekcni"], endoskop: ["inspekcni", "kamera"], teplomer: ["teplota", "ir"],
  meric: ["multimetr", "merici"], multimetr: ["merici", "napeti"], napeti: ["multimetr"], projektor: ["projektory", "obraz"],
  bryle: ["chytre"], darek: ["gadget", "designove"], hracka: ["gadget"], konzole: ["herni", "retro"],
  hry: ["herni", "retro"], vlhkost: ["vlhkomer"], hluk: ["hlukomer"], svetlo: ["luxmetr"], esp: ["esp32"], arduino: ["esp32", "vyvojova"],
  naradi: ["merici", "sroubovak"], kutil: ["sroubovak", "merici", "multitool", "naradi"], kutila: ["sroubovak", "merici", "multitool"], dilna: ["sroubovak", "merici"], hacking: ["flipper", "rfid", "nfc"], nfc: ["rfid", "flipper"]
};

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function safeHttpUrl(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function productSlug(value: string): string {
  return normalize(value).replace(/\s+/g, "-");
}

export function parseDelimitedCsv(input: string, delimiter = ";"): string[][] {
  const source = input.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.length > 0)) rows.push(row);
  }
  return rows;
}

function cleanHtml(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCsvPrice(value: string): string | undefined {
  const normalizedPrice = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedPrice)) return undefined;
  const amount = Number(normalizedPrice);
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function parseShoptetCsv(csv: string, shopBaseUrl?: string): KnowledgeItem[] {
  const rows = parseDelimitedCsv(csv);
  const header = rows.shift()?.map((column) => column.trim()) ?? [];
  const baseUrl = shopBaseUrl ? safeHttpUrl(shopBaseUrl) : undefined;
  if (header.length === 0 || !header.includes("name")) return [];

  return rows.flatMap((values, index) => {
    const record = Object.fromEntries(header.map((column, columnIndex) => [column, values[columnIndex]?.trim() ?? ""]));
    const name = record.name;
    if (!name || (record.itemType && record.itemType !== "product") || record.productVisibility === "hidden") return [];

    const code = record.code || String(index + 1);
    const category = record.defaultCategory;
    const manufacturer = record.manufacturer;
    const description = cleanHtml(record.shortDescription || record.description || "");
    const price = formatCsvPrice(record.price || "");
    const explicitUrl = safeHttpUrl(record.url || record.productUrl || record.detailUrl || "");
    const generatedUrl = baseUrl ? new URL(`${productSlug(name)}/`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString() : undefined;
    const url = explicitUrl ?? generatedUrl;
    const facts = [
      description,
      category && `Kategorie: ${category}.`,
      manufacturer && `Výrobce: ${manufacturer}.`,
      code && `Kód produktu: ${code}.`,
      price && `Cena v produktovém CSV: ${price}. Cena se může od posledního importu změnit; ověřte ji na detailu produktu.`
    ].filter(Boolean);

    return [{
      id: `csv-${code}`,
      type: "product" as const,
      title: name,
      content: facts.join(" ").slice(0, 2200),
      url,
      keywords: [code, category, manufacturer, record.seoTitle, record.metaDescription]
        .filter((value): value is string => Boolean(value))
    }];
  });
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/* Czech words change their endings (multimetr, multimetru, multimetry): a longer word also matches by its stem */
function stem(token: string): string {
  return token.length >= 6 ? token.slice(0, token.length - 2) : token.length === 5 ? token.slice(0, 4) : token;
}

function hits(text: string, token: string): boolean {
  if (text.includes(token)) return true;
  const st = stem(token);
  return st !== token && new RegExp(`(^|\\s)${st}`).test(text);
}

/* "do 1000 Kč", "pod 2000", "max 1500" -> 1000 / 2000 / 1500 */
export function budgetOf(query: string): number | undefined {
  const m = normalize(query).match(/(?:do|pod|max|maximalne|nejvys|levnejsi nez|up to|under)\s+(\d[\d ]{1,6})/);
  return m?.[1] ? Number(m[1].replace(/\s/g, "")) : undefined;
}

export function searchKnowledge(items: KnowledgeItem[], query: string, limit = 5): KnowledgeItem[] {
  const base = [...new Set(tokens(query))];
  const queryTokens = [...new Set([...base, ...base.flatMap((t) => SYNONYMS[t] ?? SYNONYMS[stem(t)] ?? [])])];
  const budget = budgetOf(query);
  if (queryTokens.length === 0) return items.filter((item) => item.type === "faq").slice(0, limit);

  return items
    .map((item) => {
      const title = normalize(item.title);
      const keywords = (item.keywords ?? []).map(normalize);
      const haystack = normalize(`${item.title} ${item.content} ${(item.keywords ?? []).join(" ")}`);
      let score = queryTokens.reduce((total, token) => {
        const weight = base.includes(token) ? 1 : 0.5;
        if (hits(title, token)) return total + 5 * weight;
        if (keywords.some((keyword) => hits(keyword, token))) return total + 3 * weight;
        return hits(haystack, token) ? total + 1 * weight : total;
      }, 0);
      if (score > 0 && item.type === "product") {
        if (budget !== undefined && item.price !== undefined) score += item.price <= budget ? 2 : -4;
        if (item.inStock === false) score -= 0.5;
      }
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "cs"))
    .slice(0, limit)
    .map((result) => result.item);
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value && "#text" in value) return String((value as { "#text": unknown })["#text"]);
  return String(value);
}

export function parseShoptetFeed(xml: string): KnowledgeItem[] {
  const parsed = new XMLParser({ ignoreAttributes: false, trimValues: true }).parse(xml) as Record<string, unknown>;
  const shop = (parsed.SHOP ?? parsed.shop ?? parsed) as Record<string, unknown>;
  const rawItems = asArray((shop.SHOPITEM ?? shop.shopitem) as Record<string, unknown> | Record<string, unknown>[] | undefined);

  return rawItems.flatMap((raw, index) => {
    const title = text(raw.PRODUCTNAME ?? raw.PRODUCT ?? raw.NAME);
    const url = safeHttpUrl(text(raw.URL ?? raw.DEEPLINK));
    if (!title || !url) return [];
    const description = cleanHtml(text(raw.DESCRIPTION ?? raw.SHORT_DESCRIPTION));
    const category = text(raw.CATEGORYTEXT ?? raw.CATEGORY);
    const manufacturer = text(raw.MANUFACTURER ?? raw.BRAND);
    return [{
      id: `feed-${text(raw.ITEM_ID ?? raw.CODE) || index}`,
      type: "product" as const,
      title,
      content: [description, category && `Kategorie: ${category}.`, manufacturer && `Výrobce: ${manufacturer}.`]
        .filter(Boolean)
        .join(" ")
        .slice(0, 1800),
      url,
      keywords: [category, manufacturer].filter(Boolean)
    }];
  });
}

/* one overview per top category of the live catalogue ("what do you have in measuring tools?"): the products with
   price and stock, so a question about a whole category finds them all at once */
/* the shop's address of a category: its name without diacritics, every other character a dash ("Vzdálenost, světlo
   a zvuk" -> vzdalenost--svetlo-a-zvuk) */
export function categorySlug(name: string): string {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "");
}

export function categoryOverviews(products: KnowledgeItem[], base = "https://www.okla.cz"): KnowledgeItem[] {
  /* the top categories and their subcategories */
  const groups = new Map<string, KnowledgeItem[]>();
  for (const item of products) {
    const parts = (item.category ?? "").split(">").map((part) => part.trim()).filter(Boolean);
    for (const name of new Set([parts[0], parts[parts.length - 1]].filter((v): v is string => Boolean(v)))) groups.set(name, [...(groups.get(name) ?? []), item]);
  }
  return [...groups].map(([name, list]) => ({
    id: `category-${normalize(name).replace(/ /g, "-")}`,
    type: "faq" as const,
    title: `Kategorie ${name} – přehled produktů`,
    content: `V kategorii ${name} nabízí Okla.cz ${list.length} ${list.length === 1 ? "produkt" : list.length < 5 ? "produkty" : "produktů"}: ${list
      .map((item) => `${item.title} (${[formatPrice(item.price), item.inStock === undefined ? undefined : item.inStock ? "skladem" : "není skladem"].filter(Boolean).join(", ")})`)
      .join("; ")}.`,
    url: new URL(`/${categorySlug(name)}/`, base).toString(),
    keywords: [name, "kategorie", "co máte", "nabídka", "sortiment"]
  }));
}

export class KnowledgeStore {
  private localItems: KnowledgeItem[] = [];
  private csvItems: KnowledgeItem[] = [];
  private feedItems: KnowledgeItem[] = [];
  private liveItems: KnowledgeItem[] = [];
  /* the storefront's product index (GET /api/catalog), read with the same crawl */
  private storeIndex: { t: number; items: IndexItem[] } = { t: 0, items: [] };
  private refreshTimer?: NodeJS.Timeout;
  private crawlTimer?: NodeJS.Timeout;
  private indexTimer?: NodeJS.Timeout;

  constructor(
    private readonly filePath: string,
    private readonly feedUrl?: string,
    private readonly csvFilePath?: string,
    private readonly shopBaseUrl?: string,
    private readonly crawl = false,
    private readonly crawlMinutes = 360
  ) {}

  async initialize(refreshMinutes = 60): Promise<void> {
    const raw = await readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as { items?: KnowledgeItem[] } | KnowledgeItem[];
    this.localItems = Array.isArray(parsed) ? parsed : (parsed.items ?? []);
    if (this.csvFilePath) {
      const csv = await readFile(this.csvFilePath, "utf8");
      this.csvItems = parseShoptetCsv(csv, this.shopBaseUrl).slice(0, 20_000);
    }
    try {
      const snap = JSON.parse(await readFile(new URL("../data/catalog-snapshot.json", import.meta.url), "utf8")) as { products?: KnowledgeItem[]; pages?: KnowledgeItem[] };
      if (snap.products?.length) this.liveItems = [...snap.products, ...(snap.pages ?? []).map((page) => ({ ...page, content: cleanPageText(page.content) })), ...categoryOverviews(snap.products, this.shopBaseUrl)];
    } catch {
      /* no snapshot: the CSV until the first crawl */
    }
    if (this.crawl && this.shopBaseUrl) {
      /* first crawl in the background: the service answers from the snapshot (or the CSV) until the live catalogue is in */
      void this.refreshLive();
      this.crawlTimer = setInterval(() => void this.refreshLive(), this.crawlMinutes * 60_000);
      this.crawlTimer.unref();
      void this.refreshIndex();
      this.indexTimer = setInterval(() => void this.refreshIndex(), 30 * 60_000);
      this.indexTimer.unref();
    }
    if (this.feedUrl) {
      await this.refreshFeed().catch(() => undefined);
      this.refreshTimer = setInterval(() => void this.refreshFeed(), refreshMinutes * 60_000);
      this.refreshTimer.unref();
    }
  }

  /* live products first; an older CSV/feed record of the same product (same URL or name) is left out */
  all(): KnowledgeItem[] {
    const seen = new Set<string>();
    const out: KnowledgeItem[] = [];
    const live = this.liveItems.some((item) => item.type === "product");
    for (const item of [...this.liveItems, ...this.feedItems, ...(live ? [] : this.csvItems), ...this.localItems]) {
      const keys = [item.url && normalizeUrl(item.url), item.type === "product" ? `n:${normalize(item.title)}` : undefined].filter(Boolean) as string[];
      if (item.type === "product" && keys.some((key) => seen.has(key))) continue;
      keys.forEach((key) => seen.add(key));
      out.push(item);
    }
    return out;
  }

  faqs(): KnowledgeItem[] {
    return this.all().filter((item) => item.type === "faq");
  }

  products(): KnowledgeItem[] {
    return this.all().filter((item) => item.type === "product");
  }

  search(query: string, limit = 5): KnowledgeItem[] {
    return searchKnowledge(this.all(), query, limit);
  }

  byUrl(url?: string): KnowledgeItem | undefined {
    if (!url) return undefined;
    const key = normalizeUrl(url);
    return key ? this.products().find((item) => item.url && normalizeUrl(item.url) === key) : undefined;
  }

  counts(): { local: number; csv: number; feed: number; live: number } {
    return { local: this.localItems.length, csv: this.csvItems.length, feed: this.feedItems.length, live: this.liveItems.length };
  }

  close(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    if (this.crawlTimer) clearInterval(this.crawlTimer);
    if (this.indexTimer) clearInterval(this.indexTimer);
  }

  /* the storefront's index, every 30 minutes (prices and stock in search and the cart drawer stay current); a
     complete index only - one failing listing keeps the last good one */
  async refreshIndex(): Promise<void> {
    if (!this.shopBaseUrl) return;
    try {
      const items = await crawlStoreIndex(this.shopBaseUrl);
      if (items.length >= 10) this.storeIndex = { t: Date.now(), items };
    } catch {
      /* the storefront falls back to reading the listings itself */
    }
  }

  index(): { t: number; items: IndexItem[] } {
    return this.storeIndex;
  }

  /* exposed for tests and for a manual refresh */
  async refreshLive(): Promise<void> {
    if (!this.shopBaseUrl) return;
    try {
      const result = await crawlShop(this.shopBaseUrl);
      const { products, pages } = result;
      if (!products.length) return;
      /* each product learns the homepage groups it is in (new, on offer, recommended) */
      for (const group of result.groups) {
        for (const item of products) {
          if (item.url && group.paths.includes(new URL(item.url).pathname)) item.tags = [...new Set([...(item.tags ?? []), group.name])];
        }
      }
      this.liveItems = [...products, ...pages, ...liveShopNotes(result, products, this.shopBaseUrl), ...categoryOverviews(products, this.shopBaseUrl)];

    } catch {
      /* keep the last good catalogue */
    }
  }

  private async refreshFeed(): Promise<void> {
    if (!this.feedUrl) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(this.feedUrl, { signal: controller.signal, headers: { accept: "application/xml,text/xml" } });
      if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
      const xml = await response.text();
      this.feedItems = parseShoptetFeed(xml).slice(0, 20_000);
    } finally {
      clearTimeout(timer);
    }
  }
}

/* the same page with or without "www.", query, hash or trailing slash */
export function normalizeUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return undefined;
  }
}
