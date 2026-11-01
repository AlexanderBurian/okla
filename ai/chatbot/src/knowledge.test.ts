import { describe, expect, it } from "vitest";
import { parseShoptetCsv, parseShoptetFeed, safeHttpUrl, searchKnowledge } from "./knowledge.js";
import type { KnowledgeItem } from "./types.js";

const items: KnowledgeItem[] = [
  { id: "1", type: "faq", title: "Vrácení zboží", content: "Vrácení je možné do 14 dnů.", keywords: ["odstoupení"] },
  { id: "2", type: "product", title: "USB-C nabíječka", content: "Nabíječka pro kompatibilní zařízení.", url: "https://www.okla.cz/nabijecka/" }
];

describe("knowledge search", () => {
  it("najde relevantní položku i bez diakritiky", () => {
    expect(searchKnowledge(items, "Jak funguje vraceni?")[0]?.id).toBe("1");
  });

  it("upřednostní shodu v názvu produktu", () => {
    expect(searchKnowledge(items, "Potřebuji USB C nabíječku")[0]?.id).toBe("2");
  });
});

describe("Shoptet feed", () => {
  it("načte produkt a odkaz z XML", () => {
    const xml = `<SHOP><SHOPITEM><ITEM_ID>42</ITEM_ID><PRODUCTNAME>Testovací kabel</PRODUCTNAME><DESCRIPTION><![CDATA[USB kabel]]></DESCRIPTION><URL>https://www.okla.cz/kabel/</URL><MANUFACTURER>OKLA</MANUFACTURER></SHOPITEM></SHOP>`;
    expect(parseShoptetFeed(xml)).toEqual([
      expect.objectContaining({ id: "feed-42", title: "Testovací kabel", url: "https://www.okla.cz/kabel/" })
    ]);
  });
});

describe("Shoptet CSV", () => {
  it("načte středníky v uvozovkách, cenu a bezpečný produktový odkaz", () => {
    const csv = "\uFEFFcode;name;price;productVisibility;defaultCategory;shortDescription;manufacturer;itemType\r\n" +
      "OKL-900;USB-C měřič – přesný tester;1290;visible;Měřicí technika;\"Měří napětí; proud a výkon.\";OKLA;product\r\n";
    const products = parseShoptetCsv(csv, "https://825108.myshoptet.com/");
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(expect.objectContaining({
      id: "csv-OKL-900",
      title: "USB-C měřič – přesný tester",
      url: "https://825108.myshoptet.com/usb-c-meric-presny-tester/"
    }));
    expect(products[0]?.content).toContain("Měří napětí; proud a výkon.");
    expect(products[0]?.content).toContain("1 290 Kč");
  });

  it("načte všech 33 reálných produktů a najde konkrétní model", async () => {
    const { readFile } = await import("node:fs/promises");
    const csv = await readFile("./data/shoptet-products.csv", "utf8");
    const products = parseShoptetCsv(csv, "https://825108.myshoptet.com/");
    expect(products).toHaveLength(33);
    expect(searchKnowledge(products, "potřebuji kapesní osciloskop", 3)[0]).toEqual(expect.objectContaining({
      id: "csv-OKL-018",
      url: "https://825108.myshoptet.com/kapesni-digitalni-osciloskop-mereni-signalu/"
    }));
  });

  it("odmítne javascript a jiné nebezpečné URL", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeHttpUrl("data:text/html,test")).toBeUndefined();
    expect(safeHttpUrl("https://www.okla.cz/produkt/")).toBe("https://www.okla.cz/produkt/");
  });
});
