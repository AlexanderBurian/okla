import { describe, expect, it } from "vitest";
import { liveShopNotes, parseHomepageGroups, parseShipping } from "./liveCatalog.js";
import { keyProperties } from "./prompt.js";
import type { KnowledgeItem } from "./types.js";

const SHIPPING = `<span itemprop="shippingDetails" itemscope itemtype="https://schema.org/OfferShippingDetails"><meta itemprop="shippingLabel" content="Z&aacute;silkovna v&yacute;dejn&iacute; m&iacute;sta" /><span itemprop="shippingRate" itemscope><meta itemprop="value" content="79.00" /><meta itemprop="currency" content="CZK" /></span><span itemprop="shippingDestination" itemscope><meta itemprop="addressCountry" content="CZ" /></span></span>`;

const HOME = `<div class="homepage-group-title homepage-products-heading-1 h4">Akční zboží</div>
<div class="products"><div class="p"><a href="/a/" class="image"></a><a href="/a/" class="name" data-micro="url">A</a></div></div>
<div class="homepage-group-title homepage-products-heading-2 h4">Novinky</div>
<div class="products"><a href="/b/" class="name">B</a><a href="/c/" class="name">C</a></div>`;

describe("live shop notes", () => {
  it("reads the delivery methods from the product microdata", () => {
    const options = parseShipping(SHIPPING);
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ price: 79, country: "CZ" });
  });

  it("reads the homepage product groups", () => {
    expect(parseHomepageGroups(HOME)).toEqual([{ name: "Akční zboží", paths: ["/a/"] }, { name: "Novinky", paths: ["/b/", "/c/"] }]);
  });

  it("writes the delivery and the groups as knowledge", () => {
    const products: KnowledgeItem[] = [{ id: "b", type: "product", title: "Produkt B", content: "", url: "https://www.okla.cz/b/", price: 589 }];
    const notes = liveShopNotes({ shipping: [{ label: "Zásilkovna", price: 0, country: "CZ" }], groups: [{ name: "Novinky", paths: ["/b/"] }] }, products);
    expect(notes.map((n) => n.id)).toEqual(["live-shipping", "live-homepage-groups"]);
    expect(notes[0]?.content).toContain("Zásilkovna (Česko): zdarma");
    expect(notes[1]?.content).toContain("Novinky: Produkt B");
  });

  it("keeps a product's key properties", () => {
    const text = "Popis. Doplňkové parametry. Kategorie : Měřicí technika . Výrobce : ANENG . Model : C0014109B . Klíčová vlastnost 1 : Dosah 60 m . Klíčová vlastnost 2 : Paměť měření.";
    expect(keyProperties(text)).toBe("Hlavní vlastnosti: Dosah 60 m; Paměť měření; Model C0014109B.");
  });
});
