import { describe, expect, it } from "vitest";
import { liveShopNotes, menuCategories, parseHomepageGroups, parseListingCards, parseShipping } from "./liveCatalog.js";
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

  it("reads the menu's top categories and a listing's product cards for the storefront index", () => {
    const menu = `<ul class="menu-level-1"><li class="menu-item-721 ext" role="none"><a href="/multitooly/" data-testid="headerMenuItem" role="menuitem"><b>Multitooly</b></a><ul class="menu-level-2"><li class="menu-item-773" role="none"><a href="/kapesni/" class="menu-image" tabindex="-1"></a><div><a href="/kapesni/" role="menuitem">Kapesní</a></div></li></ul></li><li class="menu-item-722" role="none"><a href="/mereni/" role="menuitem">Měření</a></li></ul>`;
    expect(menuCategories(menu)).toEqual(["/multitooly/", "/mereni/"]);
    const card = `<div class="p" data-micro="product" data-micro-product-id="178"><a href="/g50/" class="image"><img src="data:image/svg+xml,x" data-src="https://cdn.example/detail/178.jpg"></a><a href="/g50/" class="name" data-micro="url"><span data-micro="name">ANENG G50</span></a><span data-micro="sku">TVC-1</span><div class="p-desc">Zelený paprsek.</div><div class="offers" data-micro="offer" data-micro-price="789.00" data-micro-availability="https://schema.org/InStock"></div><input type="hidden" name="productId" value="178" /><input type="hidden" name="priceId" value="181" /></div>`;
    expect(parseListingCards(card, "https://www.okla.cz", "Měření")).toEqual([{ pid: "178", prc: "181", code: "TVC-1", name: "ANENG G50", url: "https://www.okla.cz/g50/", image: "https://cdn.example/detail/178.jpg", price: 789, available: true, shortDescription: "Zelený paprsek.", defaultCategory: "Měření", brand: "", live: true }]);
  });

  it("keeps a product's key properties", () => {
    const text = "Popis. Doplňkové parametry. Kategorie : Měřicí technika . Výrobce : ANENG . Model : C0014109B . Klíčová vlastnost 1 : Dosah 60 m . Klíčová vlastnost 2 : Paměť měření.";
    expect(keyProperties(text)).toBe("Hlavní vlastnosti: Dosah 60 m; Paměť měření; Model C0014109B.");
  });
});
