import Groq from "groq-sdk";
import { budgetOf, normalize } from "./knowledge.js";
import { formatPrice } from "./liveCatalog.js";
import { LEAN_BUDGET, NORMAL_BUDGET, toGroqMessages, type ContextBudget } from "./prompt.js";
import type { ChatContext, ChatEngine, KnowledgeItem } from "./types.js";

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/* ---------- the answer without a language model (MOCK_MODE): retrieval with a little reasoning ---------- */

function link(item: KnowledgeItem): string {
  return item.url ? `[${item.title}](${item.url})` : `**${item.title}**`;
}

function priceOf(item: KnowledgeItem): string | undefined {
  return formatPrice(item.price) ?? item.content.match(/Cena v produktovém CSV: ([^.]+Kč)/)?.[1];
}

function sentences(text: string): string[] {
  return text
    .replace(/(Cena|Dostupnost|Kategorie|Značka|Výrobce|Kód produktu|Cena v produktovém CSV):[^.]*\./g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^Popis:\s*/i, "").trim())
    .filter((s) => s.length > 25 && s.length < 400);
}

function best(text: string, question: string, count = 2): string[] {
  const words = normalize(question).split(" ").filter((w) => w.length > 3);
  const stems = words.map((w) => (w.length >= 6 ? w.slice(0, -2) : w));
  const ranked = sentences(text)
    .map((sentence, index) => {
      const n = normalize(sentence);
      return { sentence, index, score: stems.filter((st) => n.includes(st)).length };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const top = ranked.filter((r) => r.score > 0).slice(0, count);
  return (top.length ? top : ranked.slice(0, 1)).sort((a, b) => a.index - b.index).map((r) => r.sentence);
}

function summary(item: KnowledgeItem): string {
  const first = sentences(item.content)[0] ?? "";
  return first.length > 170 ? `${first.slice(0, 167).replace(/\s+\S*$/, "")}…` : first;
}

function productBullet(item: KnowledgeItem): string {
  const facts = [priceOf(item), item.inStock === undefined ? undefined : item.inStock ? "skladem" : "momentálně není skladem"].filter(Boolean).join(", ");
  const about = summary(item);
  return `- ${link(item)}${facts ? ` (${facts})` : ""}${about ? `: ${about}` : ""}`;
}

const SHOP_INFO = /doprav|postovn|dorucen|dorucit|zasilkovn|vydejn|platb|zaplat|dobirk|kartou|prevod|vracen|vratit|odstoup|reklamac|reklamov|zaruk|kontakt|zavolat|telefonni cislo|telefonicky|email|e mail|podpor|obchodni podmink|osobni udaj|gdpr|faktur|jak nakup|jak objedn|registrac/;

/* which page answers which topic (the shop's own pages first, then the short local notes) */
const TOPICS: [RegExp, string[]][] = [
  [/vracen|vratit|odstoup|14 dn/, ["page-https://www.okla.cz/vraceni-zbozi-a-odstoupeni/", "faq-return"]],
  [/reklamac|reklamov|vada|nefunguj|porouch/, ["page-https://www.okla.cz/reklamacni-rad/", "faq-complaint"]],
  [/zaruk|garanc/, ["faq-warranty"]],
  [/doprav|postovn|dorucen|dorucit|zasilkovn|vydejn|platb|zaplat|dobirk|kartou|prevod/, ["faq-shipping-payment"]],
  [/kontakt|zavolat|telefonni cislo|telefonicky|email|e mail|podpor/, ["faq-support"]],
  [/jak nakup|jak objedn|registrac/, ["faq-how-to-buy"]],
  [/osobni udaj|gdpr/, ["page-https://www.okla.cz/podminky-ochrany-osobnich-udaju/"]],
  [/obchodni podmink|faktur/, ["page-https://www.okla.cz/obchodni-podminky/"]]
];

export function mockAnswer(context: Pick<ChatContext, "message" | "knowledge" | "history" | "pageItem" | "catalog" | "faqs">): string {
  const { message, knowledge: items, history, pageItem } = context;
  const catalog = context.catalog ?? [];
  const isFirst = history.length === 0;
  const q = normalize(message);

  if (/kokain|heroin|pervitin|marihuan|drogy|zbrane|pistol|samopal|vybusnin|munic|granat/.test(q)) return "OKLA se zaměřuje na elektroniku, s tímhle vám nepomohu. Rád ale poradím s multitooly, měřicí technikou nebo chytrou elektronikou.";
  if (/cizi|bez svoleni|bez opravneni|ukrast|obejit|prolomit/.test(q) && /kart|zamek|pristup|auto|alarm|wifi|heslo/.test(q)) return "S obcházením cizího zabezpečení nepomohu. U vlastních karet a zařízení vám rád vysvětlím, jak funguje NFC a RFID a co se dá legálně zkoušet.";
  if (/^(ahoj|dobry den|cau|zdravim|hello|hi|dobry vecer|nazdar)( .{0,12})?$/.test(q)) return "Dobrý den, jsem **OKLA poradce**. Pomůžu vám vybrat elektroniku, porovnat produkty nebo zodpovím dotazy k nákupu. Co hledáte?";
  if (/^(diky|dekuji|super|dik|ok|okay|jasne)\b/.test(q) && q.length < 30) return "Rádo se stalo. Kdybyste potřebovali ještě s něčím poradit, jsem tady.";
  if (/kde.*(balik|objednav|zasilk)|stav.*objednav|sledov.*zasil|objednav.*(stav|dorazi)/.test(q)) {
    return "K objednávkám nemám přístup. Stav zjistíte na stránce [Stav objednávky](https://www.okla.cz/stav-objednavky/), případně vám pomůže podpora na [podpora@okla.cz](mailto:podpora@okla.cz).";
  }
  if (/nafoukl|nafouknut|tece|zapach|kour|hori/.test(q) && /bateri|akumul|zarizen|nabij/.test(q)) {
    return "Zařízení prosím dál nepoužívejte ani nenabíjejte a nechte ho na bezpečném místě. Ozvěte se na [podpora@okla.cz](mailto:podpora@okla.cz), domluvíme bezpečné předání.";
  }

  /* questions about buying: answer from the shop's own pages */
  if (SHOP_INFO.test(q)) {
    const preferred = TOPICS.find(([re]) => re.test(q))?.[1] ?? [];
    const pool = [...items, ...(context.faqs ?? [])];
    const page = preferred.map((id) => pool.find((item) => item.id === id)).find(Boolean) ?? items.find((item) => item.type === "faq");
    if (page) {
      const lines = best(page.content, message, 3);
      const more = page.url && !page.url.startsWith("mailto:") ? `\n\nVíce na stránce [${page.title}](${page.url}).` : "";
      return `${lines.join(" ")}${more}`;
    }
  }

  const products = items.filter((item) => item.type === "product");
  const about = (item: KnowledgeItem) => {
    if (/skladem|dostupn|kolik kusu|je to k dispozici|in stock/.test(q)) {
      if (item.inStock === undefined) return `Aktuální dostupnost produktu ${link(item)} uvidíte přímo na jeho stránce.`;
      return item.inStock
        ? `Podle e-shopu je ${link(item)} skladem${priceOf(item) ? ` za ${priceOf(item)}` : ""}.`
        : `${link(item)} podle e-shopu momentálně není skladem. Na stránce produktu si můžete nechat hlídat naskladnění.`;
    }
    if (/kolik.{0,12}stoj|\bcen[auy]?\b|za kolik|price/.test(q)) {
      const price = priceOf(item);
      return price ? `${link(item)} stojí podle e-shopu ${price}${item.inStock ? " a je skladem" : ""}.` : `Aktuální cenu najdete na stránce ${link(item)}.`;
    }
    const asked = normalize(message).split(" ").filter((w) => w.length > 4 && !/^(tento|tenhle|tahle|tohle|toto|jaky|jaka|jake|ktery|muze|umi|dokaze|prosim)$/.test(w));
    const lines = best(item.content, message, 2);
    const covered = asked.length === 0 || lines.some((line) => asked.some((w) => normalize(line).includes(w.length >= 6 ? w.slice(0, -2) : w)));
    if (!covered) return `V popisu produktu ${link(item)} tuhle informaci nevidím, takže ji nechci odhadovat. Rád ji ověřím přes podporu na [podpora@okla.cz](mailto:podpora@okla.cz), nebo vám mezitím shrnu, co produkt umí.`;
    return `${lines.join(" ")}\n\n${link(item)}${priceOf(item) ? `, ${priceOf(item)}` : ""}`;
  };

  /* a direct price / stock question about a product named in the question */
  const named = products.find((item) => normalize(message).split(" ").filter((w) => w.length > 3).some((w) => normalize(item.title).includes(w)));
  if (named && /kolik.{0,12}stoj|\bcen[auy]?\b|za kolik|skladem|dostupn/.test(q) && !/doporuc|vyber|porovn|do \d/.test(q)) return about(named);

  /* "tenhle / tento / ten" on a product page = that product */
  const deictic = /\b(tento|tenhle|tahle|tato|toto|tohle|ten|to|umi|funguje|podporuje|vydrzi|baleni|obsahuje|rozmer|vaha|kompatib)\b/.test(q);
  if (pageItem && (deictic || !products.length || products[0]?.id === pageItem.id)) return about(pageItem);

  /* budget and price ordering over the whole catalogue */
  const budget = budgetOf(message);
  const cheapest = /nejlevn|levn|cheapest/.test(q);
  const priciest = /nejdraz|nejlepsi|premium/.test(q);
  const list = /doporuc|poradit|vyber|vybrat|nabizite|co mate|hledam|chci|potrebuj|darek|zacatecnik|pro deti|ktery|ktera|ktere|jaky|jakou|jake|srovn|porovn|rozdil|alternativ|neco na|neco pro/.test(q) || budget !== undefined || cheapest;
  const words = normalize(message).split(" ").filter((w) => w.length > 3 && !/^\d+$/.test(w) && !/^(doporuc|poradt|hledam|vyber|chtel|nejak|kteri|ktery|ktera)/.test(w)).map((w) => (w.length >= 6 ? w.slice(0, -2) : w));
  const strong = products.filter((item) => words.some((w) => normalize(`${item.title} ${item.category ?? ""}`).includes(w)));
  let pool = strong.length ? strong : products;
  if ((cheapest || priciest) && !products.length) pool = catalog;
  if (budget !== undefined) {
    const inBudget = pool.filter((item) => item.price !== undefined && item.price <= budget);
    const relevantCatalog = catalog.filter((item) => item.price !== undefined && item.price <= budget && words.some((w) => normalize(`${item.title} ${item.category ?? ""}`).includes(w)));
    pool = inBudget.length ? inBudget : relevantCatalog.length ? relevantCatalog : catalog.filter((item) => item.price !== undefined && item.price <= budget);
  }
  if (cheapest || priciest) pool = [...pool].sort((a, b) => ((a.price ?? 1e9) - (b.price ?? 1e9)) * (priciest ? -1 : 1));

  if (pool.length && (list || pool.length > 1 && !/\b(jak|proc|kolik|umi)\b/.test(q))) {
    const pick = pool.filter((item) => item.inStock !== false).slice(0, 3);
    const chosen = pick.length ? pick : pool.slice(0, 3);
    const intro = budget !== undefined
      ? `Do ${formatPrice(budget)} bych vybral:`
      : cheapest ? "Nejlevnější možnosti:" : chosen.length > 1 ? "Tohle by vám mohlo sednout:" : "Doporučuji:";
    const ask = chosen.length > 1 ? "\n\nNapište mi, k čemu to budete používat, a doporučím tu nejvhodnější." : "";
    return `${intro}\n${chosen.map(productBullet).join("\n")}${ask}`;
  }
  if (products[0]) return about(products[0]);
  if (budget !== undefined) return `Do ${formatPrice(budget)} teď v nabídce nic odpovídajícího nevidím. Řekněte mi, k čemu zařízení potřebujete, a zkusím najít nejbližší možnost.`;

  const faq = items.find((item) => item.type === "faq");
  if (faq && !/kategori|sortiment/.test(q)) return `${best(faq.content, message, 2).join(" ")}${faq.url && !faq.url.startsWith("mailto:") ? `\n\n[${faq.title}](${faq.url})` : ""}`;

  const cats = [...new Set(catalog.map((item) => item.category?.split(">").pop()?.trim()).filter(Boolean))].slice(0, 8);
  const greeting = isFirst ? "Dobrý den, jsem **OKLA poradce**. " : "";
  return `${greeting}Tohle v nabídce nemám, nebo jsem dotazu úplně neporozuměl.${cats.length ? ` Prodáváme: ${cats.join(", ")}.` : ""} Napište mi, co hledáte a k čemu to chcete používat, a doporučím konkrétní produkt.`;
}

/* ---------- the quick answer when every model is over its limit: only when it is surely right, else nothing ---------- */

const STOP = /^(jaky|jaka|jake|ktery|ktera|ktere|doporuc\w*|poradt\w*|muzete|mate|neco|hledam|chci|chtel\w*|potrebuj\w*|prosim|tenhle|tento|rozdil|mezi|jsou|bude|hodi|k cemu|cemu|dobry|pro|pomozte|vybrat|vyber|projekt\w*|elektronik\w*|technik\w*|zacatecnik\w*)$/;

function words(text: string): string[] {
  return normalize(text).split(" ").filter((w) => w.length > 3 && !/^\d+$/.test(w) && !STOP.test(w));
}

/* the shop's page as a short answer: its first sentence, the rest as a numbered list, and the link */
function pageAnswer(page: KnowledgeItem, question: string): string {
  const all = sentences(page.content);
  let chosen = all.slice(0, 5);
  if (all.length > 5) {
    const stems = words(question).map((w) => (w.length >= 6 ? w.slice(0, -2) : w));
    chosen = all.map((sentence, index) => ({ sentence, index, score: stems.filter((st) => normalize(sentence).includes(st)).length - index / 100 }))
      .sort((a, b) => b.score - a.score).slice(0, 4).sort((a, b) => a.index - b.index).map((r) => r.sentence);
  }
  const [lead, ...rest] = chosen;
  const list = rest.length ? `\n\n${rest.map((line, i) => `${i + 1}. ${line}`).join("\n")}` : "";
  const more = page.url && !page.url.startsWith("mailto:") ? `\n\nVíce najdete na stránce [${page.title}](${page.url}).` : "";
  return `${lead ?? page.title}${list}${more}`;
}

function productAnswer(item: KnowledgeItem): string {
  const lines = sentences(item.content).slice(0, 4);
  const facts = [priceOf(item), item.inStock === undefined ? undefined : item.inStock ? "skladem" : "momentálně není skladem"].filter(Boolean).join(", ");
  const [lead, ...rest] = lines;
  return `${lead ?? item.title}${rest.length ? `\n\n${rest.map((l, i) => `${i + 1}. ${l}`).join("\n")}` : ""}\n\nNajdete ho na ${link(item)}${facts ? ` (${facts})` : ""}.`;
}

export function quickAnswer(context: Pick<ChatContext, "message" | "knowledge" | "pageItem" | "catalog" | "faqs">): string | undefined {
  const q = normalize(context.message);
  const items = context.knowledge;
  const catalog = context.catalog?.length ? context.catalog : items.filter((i) => i.type === "product");
  const asked = words(context.message);

  /* a product named in the question: a word of its name that only a few products share ("flipper", "aneng") */
  const titleWords = (item: KnowledgeItem) => new Set(normalize(item.title).split(" "));
  const distinctive = asked.filter((w) => { const n = catalog.filter((p) => titleWords(p).has(w)).length; return n > 0 && n <= 2; });
  /* per named word the product whose name before " – " the question covers best ("Flipper Zero", not "Flipper Zero
     Wi-Fi Devboard") */
  const qWords = new Set(q.split(" "));
  const head = (p: KnowledgeItem) => normalize(p.title.split(/\s[–-]\s/)[0] ?? p.title).split(" ").filter((w) => w.length > 1);
  const extra = (p: KnowledgeItem) => head(p).filter((w) => !qWords.has(w)).length;
  const named = [...new Set(distinctive.map((w) => catalog.filter((p) => titleWords(p).has(w)).sort((a, b) => extra(a) - extra(b) || head(b).length - head(a).length)[0]).filter((p): p is KnowledgeItem => Boolean(p)))];
  const compare = /rozdil|porovn|srovn|\bvs\b|nebo/.test(q);

  if (compare && named.length >= 2) {
    const pair = named.slice(0, 2);
    return `Tady je stručné srovnání podle popisů v e-shopu:\n\n${pair.map((p, i) => `${i + 1}. **${link(p)}**${priceOf(p) ? ` – ${priceOf(p)}` : ""} – ${summary(p)}`).join("\n")}\n\nNapište mi, k čemu zařízení chcete používat, a doporučím jedno z nich.`;
  }
  const one = named.length === 1 ? named[0] : context.pageItem && /\b(tento|tenhle|tahle|toto|tohle)\b/.test(q) ? context.pageItem : undefined;
  if (one && !compare) return productAnswer(one);

  /* a question about buying, the shop or an article: the shop's page that the search put first */
  const page = items.slice(0, 3).find((i) => i.type === "faq");
  if (page && (SHOP_INFO.test(q) || items[0]?.type === "faq") && !named.length) return pageAnswer(page, context.message);

  /* a choice: only products whose name or category matches what is asked (multimetr = multimetr) */
  const budget = budgetOf(context.message);
  const stems = asked.map((w) => (w.length >= 6 ? w.slice(0, -2) : w));
  const scored = catalog
    .filter((p) => (budget === undefined || (p.price !== undefined && p.price <= budget)) && p.inStock !== false)
    .map((p) => ({ p, score: stems.filter((st) => normalize(`${p.title} ${p.category ?? ""}`).includes(st)).length }));
  /* only the products that match the most of the asked words ("měřicí technika" beats "projekt" -> projector) */
  const top = Math.max(0, ...scored.map((r) => r.score));
  const matching = top ? scored.filter((r) => r.score === top).map((r) => r.p) : [];
  if (matching.length && matching.length <= 8) {
    const pick = matching.slice(0, 3);
    const intro = budget !== undefined ? `Do ${formatPrice(budget)} z nabídky odpovídá:` : pick.length > 1 ? "Z nabídky odpovídá:" : "Z nabídky odpovídá tento produkt:";
    return `${intro}\n\n${pick.map((p, i) => `${i + 1}. **${link(p)}**${priceOf(p) ? ` – ${priceOf(p)}` : ""} – ${summary(p)}`).join("\n")}\n\nNapište mi, k čemu to budete používat, a pomohu vybrat.`;
  }
  return undefined;
}

export class MockEngine implements ChatEngine {
  constructor(private readonly initialDelayMs = 80, private readonly chunkDelayMs = 6) {}

  async *stream(context: ChatContext): AsyncIterable<string> {
    const answer = mockAnswer(context);
    const chunks = Array.from({ length: Math.ceil(answer.length / 22) }, (_, index) => answer.slice(index * 22, (index + 1) * 22));
    if (this.initialDelayMs > 0) await wait(this.initialDelayMs);
    for (const chunk of chunks) {
      if (context.signal.aborted) return;
      if (this.chunkDelayMs > 0) await wait(this.chunkDelayMs);
      yield chunk;
    }
  }
}

/* the last provider failures (model, HTTP status, time) for /health - no message contents, no keys */
export const providerErrors: Array<{ model: string; status?: number; at: string; message?: string }> = [];
function noteProviderError(model: string, error: unknown): void {
  const e = error as { status?: number; error?: { error?: { message?: string } }; message?: string };
  providerErrors.unshift({ model, status: e.status, at: new Date().toISOString(), message: String(e.error?.error?.message ?? e.message ?? "").slice(0, 160) });
  providerErrors.length = Math.min(providerErrors.length, 8);
}

/* models the account cannot use (404 / 400): skipped for an hour instead of being tried on every question */
const unavailableUntil = new Map<string, number>();

/* the models this API key can use (read from Groq once an hour), shown in /health */
export const availableModels: { ids: string[]; at?: string } = { ids: [] };

/* how long Groq asks to wait after a 429 ("Please try again in 7.5s" / "1m2s", or the retry-after header), in ms */
export function retryAfterMs(error: unknown): number | undefined {
  const e = error as { headers?: Record<string, string> | { get?: (name: string) => string | null }; error?: { error?: { message?: string } }; message?: string };
  const headers = e.headers as { get?: (name: string) => string | null } & Record<string, string> | undefined;
  const header = typeof headers?.get === "function" ? headers.get("retry-after") : headers?.["retry-after"];
  if (header && Number.isFinite(Number(header))) return Number(header) * 1000;
  const text = String(e.error?.error?.message ?? e.message ?? "");
  const m = text.match(/try again in (?:(\d+)m)?\s*([\d.]+)\s*(ms|s)\b/i);
  if (!m) return undefined;
  const minutes = Number(m[1] ?? 0);
  const value = Number(m[2]);
  return minutes * 60_000 + ((m[3] ?? "s").toLowerCase() === "ms" ? value : value * 1000);
}

/* a question written in Czech or Slovak (the answer without the language model is in Czech only) */
function czechQuestion(context: ChatContext): boolean {
  if (context.lang && !/^(cs|sk)/i.test(context.lang)) return false;
  /* ("do", "is" are Czech words too, so only words that are surely English or Hungarian) */
  return !/\b(the|you|your|what|how|does|which|ship|shipping|price|please|hello|szia|mennyi|hogyan|milyen)\b/i.test(context.message);
}

export class GroqEngine implements ChatEngine {
  private readonly client: Groq;
  private modelsCheckedAt = 0;

  constructor(apiKey: string, private readonly model: string, private readonly fallbackModels: string[] = [], private readonly maxWaitMs = 8_000) {
    this.client = new Groq({ apiKey });
  }

  /* fallbacks the account really has (when the list cannot be read, all of them are tried) */
  private async usableFallbacks(): Promise<string[]> {
    if (Date.now() - this.modelsCheckedAt > 3_600_000) {
      this.modelsCheckedAt = Date.now();
      try {
        const list = await this.client.models.list({ timeout: 3_000, maxRetries: 0 });
        availableModels.ids = list.data.map((m) => m.id).sort();
        availableModels.at = new Date().toISOString();
      } catch {
        /* keep the last list */
      }
    }
    const known = new Set(availableModels.ids);
    return known.size ? this.fallbackModels.filter((m) => known.has(m)) : this.fallbackModels;
  }

  private create(context: ChatContext, budget: ContextBudget, lean: boolean, model = this.model, plain = false) {
    return this.client.chat.completions.create({
      model,
      messages: toGroqMessages(context.message, lean ? context.history.slice(-4) : context.history, context.knowledge, context.pageItem, context.catalog, context.lang, budget),
      /* a little more variety in wording, still factual */
      temperature: 0.55,
      top_p: 0.9,
      max_completion_tokens: lean ? 600 : 800,
      /* gpt-oss "thinks" before it answers: a short think keeps the first words quick; Qwen 3 does not think at all */
      ...(!plain && /gpt-oss/i.test(model) ? { reasoning_effort: "low" as const, include_reasoning: false } : {}),
      ...(!plain && /qwen3/i.test(model) ? { reasoning_effort: "none" as const } : {}),
      ...(plain && /qwen/i.test(model) ? { reasoning_format: "hidden" as const } : {}),
      stream: true
    }, { signal: context.signal, maxRetries: 0 });
  }

  async *stream(context: ChatContext): AsyncIterable<string> {
    /* the main model, then the fallbacks (each has its own per-minute limit), then the main model with lean sources */
    const fallbacks = await this.usableFallbacks();
    const attempts: Array<[string, ContextBudget, boolean]> = [
      [this.model, NORMAL_BUDGET, false],
      ...fallbacks.map((m): [string, ContextBudget, boolean] => [m, NORMAL_BUDGET, false]),
      [this.model, LEAN_BUDGET, true]
    ];
    let completion;
    let lastError: unknown;
    const started = Date.now();
    /* when every model is over its per-minute limit and Groq asks for a short wait, wait once and go round again */
    for (let round = 0; round < 2 && !completion; round++) {
      let shortestWait = Infinity;
      let allLimited = true;
      for (const [model, budget, lean] of attempts) {
        if (context.signal.aborted) break;
        if ((unavailableUntil.get(model) ?? 0) > Date.now()) continue;
        try {
          try {
            completion = await this.create(context, budget, lean, model);
          } catch (error) {
            const status = (error as { status?: number }).status;
            if (status === 413 && !lean) {
              /* too big for this model's per-minute input limit: once more with lean sources */
              noteProviderError(model, error);
              completion = await this.create(context, LEAN_BUDGET, true, model);
            } else {
              /* a fallback model that does not take the thinking settings (400): once more without them */
              if (status !== 400 || model === this.model) throw error;
              noteProviderError(model, error);
              completion = await this.create(context, budget, lean, model, true);
            }
          }
          break;
        } catch (error) {
          lastError = error;
          noteProviderError(model, error);
          /* over the limit (429), too big (413), or a model that is not available (400/404): try the next one */
          const status = (error as { status?: number }).status;
          if ((status === 404 || status === 400) && model !== this.model) unavailableUntil.set(model, Date.now() + 3_600_000);
          if (status === 429) shortestWait = Math.min(shortestWait, retryAfterMs(error) ?? Infinity);
          else if (status !== 404 && status !== 400) allLimited = false;
          if (status !== 413 && status !== 429 && status !== 404 && status !== 400) throw error;
        }
      }
      if (completion || context.signal.aborted || round > 0) break;
      if (!allLimited || !(shortestWait <= this.maxWaitMs) || Date.now() - started > 4_000) break;
      await wait(shortestWait + 250);
    }
    if (!completion) {
      /* still nothing: rather than an error, a short answer straight from the shop's pages (Czech questions) */
      const quick = (lastError as { status?: number })?.status === 429 && !context.signal.aborted && czechQuestion(context) ? quickAnswer(context) : undefined;
      if (quick) {
        yield `${quick}\n\n(Rychlá odpověď složená přímo z podkladů webu – AI poradce je teď vytížený, za chvíli odpoví podrobněji.)`;
        return;
      }
      throw lastError;
    }

    for await (const chunk of completion) {
      if (context.signal.aborted) return;
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content.replace(/--/g, "–");
    }
  }
}
