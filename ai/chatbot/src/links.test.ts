import { describe, expect, it } from "vitest";
import { quickAnswer } from "./engine.js";
import { buildLinkTable, linkStream, resolveLinks } from "./links.js";
import { brandsOf, brief, buildKnowledgeContext, catalogBlock, productText, toGroqMessages } from "./prompt.js";
import type { KnowledgeItem } from "./types.js";

const filler = "Před měřením připravte čisté pracovní místo a zvolte rozsah odpovídající očekávané hodnotě.";
const catalog: KnowledgeItem[] = [
  { id: "a", type: "product", title: "Flipper Zero – kapesní multitool", url: "https://www.okla.cz/flipper-zero/", price: 5690, inStock: true, category: "Elektronické multitooly", content: "Kapesní otevřená platforma pro práci s NFC, RFID a Sub-GHz signály. Cena: 5 690 Kč (aktuálně na e-shopu). Dostupnost: skladem." },
  { id: "b", type: "product", title: "ANENG 616 digitální multimetr", url: "https://www.okla.cz/aneng-616/", price: 589, inStock: true, category: "Měřicí technika a nářadí", content: `Kompaktní True RMS multimetr s automatickou volbou rozsahu. ${filler}` },
  { id: "c", type: "product", title: "Benetech GM605 vlhkoměr", url: "https://www.okla.cz/gm605/", price: 389, inStock: false, category: "Měřicí technika a nářadí", content: `Univerzální hrotový vlhkoměr pro dřevo a omítku. ${filler}` },
  { id: "d", type: "product", title: "Benetech GM1010 luxmetr", url: "https://www.okla.cz/gm1010/", price: 389, inStock: true, category: "Měřicí technika a nářadí", content: `Měřič osvětlení. ${filler}` },
  { id: "e", type: "product", title: "TASI TA8151 hlukoměr", url: "https://www.okla.cz/ta8151/", price: 589, inStock: true, category: "Měřicí technika a nářadí", content: `Měřič hluku. ${filler}` },
  { id: "f", type: "product", title: "Samolepicí termální papír", url: "https://www.okla.cz/papir/", price: 129, inStock: true, category: "PŘÍSLUŠENSTVÍ > Spotřební materiál", content: `Pět rolí papíru. ${filler}` }
];
const pages: KnowledgeItem[] = [
  { id: "faq-return", type: "faq", title: "Vrácení zboží", url: "https://www.okla.cz/vraceni-zbozi-a-odstoupeni/", content: "Zboží lze vrátit do 14 dnů." },
  { id: "page-terms", type: "faq", title: "Obchodní podmínky", url: "https://www.okla.cz/obchodni-podminky/", content: "Tyto obchodní podmínky upravují vztahy mezi prodávajícím a kupujícím." }
];

async function collect(stream: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const t of stream) out += t;
  return out;
}
async function* from(parts: string[]): AsyncIterable<string> { for (const p of parts) yield p; }

describe("odkazy v odpovědi", () => {
  const table = buildLinkTable(catalog, pages);

  it("klíč produktu přepíše na jeho adresu", () => {
    expect(resolveLinks("Doporučuji [Flipper Zero](#p1).", table)).toBe("Doporučuji [Flipper Zero](https://www.okla.cz/flipper-zero/).");
    expect(resolveLinks("[multimetr](p2)", table)).toBe("[multimetr](https://www.okla.cz/aneng-616/)");
  });
  it("vymyšlený produkt nebo cizí web zůstane jen textem", () => {
    expect(resolveLinks("Máme [Projektor X-1000](#p99).", table)).toBe("Máme Projektor X-1000.");
    expect(resolveLinks("Viz [projektor](https://www.okla.cz/projektor-x1000/).", table)).toBe("Viz projektor.");
    expect(resolveLinks("Viz [Alza](https://www.alza.cz/).", table)).toBe("Viz Alza.");
  });
  it("známé stránky, úvod a e-mail podpory nechá", () => {
    expect(resolveLinks("[Vrácení zboží](https://www.okla.cz/vraceni-zbozi-a-odstoupeni/)", table)).toBe("[Vrácení zboží](https://www.okla.cz/vraceni-zbozi-a-odstoupeni/)");
    expect(resolveLinks("[OKLA](https://www.okla.cz/)", table)).toBe("[OKLA](https://www.okla.cz/)");
    expect(resolveLinks("[podpora@okla.cz](mailto:podpora@okla.cz)", table)).toBe("[podpora@okla.cz](mailto:podpora@okla.cz)");
  });
  it("přesný název produktu jen tučně udělá odkazem, i když přijde po kouscích", async () => {
    expect(resolveLinks("Zkuste **Flipper Zero** nebo **něco jiného**.", table)).toBe("Zkuste [Flipper Zero](https://www.okla.cz/flipper-zero/) nebo **něco jiného**.");
    expect(await collect(linkStream(from(["Zkuste *", "*Flip", "per Zero*", "* dnes."]), table))).toBe("Zkuste [Flipper Zero](https://www.okla.cz/flipper-zero/) dnes.");
  });
  it("název zopakovaný vedle odkazu a odkaz s klíčem místo textu sloučí", () => {
    expect(resolveLinks("Rozdíl: Flipper Zero ([Flipper Zero](#p1)) je hotový nástroj.", table)).toBe("Rozdíl: [Flipper Zero](https://www.okla.cz/flipper-zero/) je hotový nástroj.");
    expect(resolveLinks("Hodí se **Flipper Zero** ([p1](#p1)).", table)).toBe("Hodí se [Flipper Zero](https://www.okla.cz/flipper-zero/).");
  });
  it("klíč mimo odkaz vynechá", () => {
    expect(resolveLinks("Flipper Zero (#p1) je skvělý.", table)).toBe("Flipper Zero je skvělý.");
  });
  it("ve streamu počká na dopsání odkazu rozděleného do více kusů", async () => {
    expect(await collect(linkStream(from(["Zkuste [Flip", "per Zero](#", "p", "1) nebo ", "[ANENG](#p2", ")."]), table)))
      .toBe("Zkuste [Flipper Zero](https://www.okla.cz/flipper-zero/) nebo [ANENG](https://www.okla.cz/aneng-616/).");
    expect(await collect(linkStream(from(["Cena je 5 690 Kč", " [poznámka] a dál."]), table))).toBe("Cena je 5 690 Kč [poznámka] a dál.");
  });
});

describe("katalog pro model", () => {
  it("má všechny produkty s klíčem, cenou a krátkým popisem, po kategoriích", () => {
    const block = catalogBlock(catalog);
    expect(block).toMatch(/p1 Flipper Zero – kapesní multitool \| 5\s690\sKč \| Kapesní otevřená platforma pro práci s NFC, RFID a Sub-GHz signály\n/);
    expect(block).toMatch(/p3 Benetech GM605 vlhkoměr \| 389\sKč \| není skladem \|/);
    expect(block).toContain("Příslušenství (1) – stránka kategorie https://www.okla.cz/prislusenstvi/");
    expect(block).not.toContain("https://www.okla.cz/flipper-zero/");
    expect(catalogBlock(catalog, false)).not.toContain("Kapesní otevřená");
  });
  it("krátký popis je první věta zkrácená na slovo", () => {
    expect(brief({ ...catalog[0] as KnowledgeItem, content: `${"slovo ".repeat(40)}. Druhá věta.` }, 40)).toMatch(/^(slovo ){5}slovo…$/);
  });
  it("značky bere z názvů", () => {
    expect(brandsOf(catalog)).toEqual(["Benetech", "Flipper", "ANENG", "TASI"]);
  });
  it("z textu produktu vynechá cenu a výplňové věty společné mnoha produktům", () => {
    const text = productText(catalog[1] as KnowledgeItem, catalog, 500);
    expect(text).toBe("Kompaktní True RMS multimetr s automatickou volbou rozsahu.");
    expect(productText(catalog[0] as KnowledgeItem, catalog, 500)).not.toContain("Cena");
  });
  it("produkt v podkladech má klíč, starší odpovědi dostanou klíče místo adres", () => {
    expect(buildKnowledgeContext([catalog[1] as KnowledgeItem], undefined, catalog)).toContain("ANENG 616 digitální multimetr (odkaz #p2)");
    const messages = toGroqMessages("a levnější?", [{ role: "user", content: "multimetr" }, { role: "assistant", content: "Zkuste [ANENG 616](https://www.okla.cz/aneng-616/)." }], [], undefined, catalog, "cs");
    expect(messages.find((m) => m.role === "assistant")?.content).toBe("Zkuste [ANENG 616](#p2).");
  });
});

describe("rychlá odpověď při přetížení", () => {
  it("dotaz na dárek nikdy nedostane obchodní podmínky", () => {
    const out = quickAnswer({ message: "Hledám dárek pro tátu, baví ho kutilství a elektronika.", knowledge: [pages[1] as KnowledgeItem, ...catalog], catalog, faqs: pages });
    expect(out ?? "").not.toContain("obchodní podmínky");
  });
  it("dotaz na vrácení dostane stránku o vrácení", () => {
    expect(quickAnswer({ message: "Jak vrátím zboží?", knowledge: [pages[1] as KnowledgeItem], catalog, faqs: pages })).toContain("14 dnů");
  });
});
