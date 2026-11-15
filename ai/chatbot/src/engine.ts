import Groq from "groq-sdk";
import { budgetOf, normalize } from "./knowledge.js";
import { formatPrice } from "./liveCatalog.js";
import { toGroqMessages } from "./prompt.js";
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

export class GroqEngine implements ChatEngine {
  private readonly client: Groq;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new Groq({ apiKey });
  }

  async *stream(context: ChatContext): AsyncIterable<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: toGroqMessages(context.message, context.history, context.knowledge, context.pageItem, context.catalog, context.lang),
      /* a little more variety in wording, still factual */
      temperature: 0.55,
      top_p: 0.9,
      max_completion_tokens: 1200,
      /* gpt-oss "thinks" before it answers: a short think keeps the first words quick */
      ...(/gpt-oss/i.test(this.model) ? { reasoning_effort: "low" as const, include_reasoning: false } : {}),
      stream: true
    }, { signal: context.signal });

    for await (const chunk of completion) {
      if (context.signal.aborted) return;
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content.replace(/--/g, "–");
    }
  }
}
