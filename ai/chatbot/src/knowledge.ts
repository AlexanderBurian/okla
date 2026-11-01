import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import type { KnowledgeItem } from "./types.js";

const STOP_WORDS = new Set([
  "a", "aby", "ale", "co", "do", "je", "jak", "jako", "jsem", "k", "ke", "který", "má", "mi",
  "na", "nebo", "od", "po", "pro", "se", "si", "s", "to", "u", "v", "ve", "z", "za", "že"
]);

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

export function searchKnowledge(items: KnowledgeItem[], query: string, limit = 5): KnowledgeItem[] {
  const queryTokens = [...new Set(tokens(query))];
  if (queryTokens.length === 0) return items.filter((item) => item.type === "faq").slice(0, limit);

  return items
    .map((item) => {
      const title = normalize(item.title);
      const haystack = normalize(`${item.title} ${item.content} ${(item.keywords ?? []).join(" ")}`);
      const score = queryTokens.reduce((total, token) => {
        if (title.includes(token)) return total + 5;
        if ((item.keywords ?? []).some((keyword) => normalize(keyword).includes(token))) return total + 3;
        return haystack.includes(token) ? total + 1 : total;
      }, 0);
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

export class KnowledgeStore {
  private localItems: KnowledgeItem[] = [];
  private csvItems: KnowledgeItem[] = [];
  private feedItems: KnowledgeItem[] = [];
  private refreshTimer?: NodeJS.Timeout;

  constructor(
    private readonly filePath: string,
    private readonly feedUrl?: string,
    private readonly csvFilePath?: string,
    private readonly shopBaseUrl?: string
  ) {}

  async initialize(refreshMinutes = 60): Promise<void> {
    const raw = await readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as { items?: KnowledgeItem[] } | KnowledgeItem[];
    this.localItems = Array.isArray(parsed) ? parsed : (parsed.items ?? []);
    if (this.csvFilePath) {
      const csv = await readFile(this.csvFilePath, "utf8");
      this.csvItems = parseShoptetCsv(csv, this.shopBaseUrl).slice(0, 20_000);
    }
    if (this.feedUrl) {
      await this.refreshFeed().catch(() => undefined);
      this.refreshTimer = setInterval(() => void this.refreshFeed(), refreshMinutes * 60_000);
      this.refreshTimer.unref();
    }
  }

  search(query: string, limit = 5): KnowledgeItem[] {
    return searchKnowledge([...this.feedItems, ...this.csvItems, ...this.localItems], query, limit);
  }

  counts(): { local: number; csv: number; feed: number } {
    return { local: this.localItems.length, csv: this.csvItems.length, feed: this.feedItems.length };
  }

  close(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
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
