# OKLA V86 | kontrolní protokol 33 produktů

Zdroj pravdy: `okla_shoptet_import_33_alza_seo.csv` (33 řádků, přesně 33 kódů),
právní informace z `01_obchodni_podminky.txt`, `03_reklamacni_rad.txt`,
`04_vraceni_zbozi.txt`, `05_doprava_a_platba.txt`. Produktové URL jsou
ověřené ze skutečné Shoptet sitemapy `sitemaps/sitemap0.xml.gz`.

| Kontrola | Stav | Důvod / výsledek |
|---|---|---|
| 33 řádků CSV, unikátní kódy | OK | OKL-001 až OKL-033; kontrola skriptem |
| Názvy z CSV beze změny | OK | Přeneseny bez zkrácení do JSON, importu a runtime H1 |
| Výrobce a brand link jen při přítomnosti | OK | Výrobce přítomen u 5 produktů, chybí u 28 |
| Krátký popis do 2 vět bez pomlček | OK | Validováno při generování |
| Popis, H2 a přesně tři vlastnosti z CSV | OK | Pro všechny kódy, bezpečně escapované HTML |
| Rozdíly původní versus nové názvy v úvodu | OK | Nové H2 i úvod ze sloupce name; bez starého názvu v generated descHtml |
| Parametry jen s doloženými údaji | OK | Neúplná data rozepsána po jednotlivých kódech v missingData |
| Kompatibilita, balení | NE | Neúplné kompatibilní verze, obsah balení u všech 33 nedoložen |
| Doporučení 3 až 4 ve stejné kategorii | NE | Pro OKL-019 / OKL-020 existuje 1 jiný produkt, pro OKL-030 žádný |
| 33 známých produktových URL | OK | Ověřeno z Shoptet XML sitemapy |
| Canonical, OG, meta description | NE | Runtime nastaveno; serverový SEO import do Shoptetu nutný |
| SEO title do 70 znaků | NE | OKL-002 má v původním CSV 72 znaků; dle požadavku zůstal nezměněn |
| Meta description do 160 znaků | OK | 33 ze 33 |
| Image ALT shodné s imageDesc | OK | Přeneseno do importu i runtime hlavní fotografie |
| 375 px bez horizontálního scrollu | NE | Media query hotová, automatický render neproběhl |
| 768 px bez horizontálního scrollu | NE | Media query hotová, automatický render neproběhl |
| 1280 px bez horizontálního scrollu | NE | Media query hotová, automatický render neproběhl |
| H1 OKL-002, brand/model bez dělení slova | NE | Desktop model v nowrap, mobil kvůli overflow zalamuje mezi slovy |
| Breadcrumb zůstává na původním místě | OK | DOM nav se nepřesouvá; styl barvy, domeček a oddělovače |
| Nedostupný produkt má šedé disabled CTA | OK | Stock z native schema.org OutOfStock, HTML disabled, aria-disabled |
| Bez pomlček v nově generovaných popisech | OK | Kontrola 33 popisů; původní názvy/SEO nedotčeny |
| Kontrast běžného textu >= 4,5:1 | NE | Požadované #5BA300 s bílým textem dává 3,14:1; #777 na bílé 4,48:1, není možné splnit všechny přesné barvy a tento limit současně |
| Jen povolená právní tvrzení v nových blocích | OK | 14 dnů, zákonná odpovědnost 24 měsíců, doprava/platba v košíku, e-mail |
| Nenarušení administrace a patičky | OK | Změny pouze v product detail; Shoptet footer se nepřesouvá |
| Server-side import produktu do Shoptetu | NE | Neproběhl; administrátorské změny vyžadují import přiloženého Shoptet CSV |
| Live UI review, doplnění skutečných parametrů | NE | Vyžaduje vizuální prohlídku a dodavatelské podklady |
| Nasazení V86 na produkční hosting | OK | 31. 10. 2026: aktivní doména okla-assets.shipstatic.com, deployment virtual-link-z76ydnn.shipstatic.com; loader, CSS, JS, katalog a magazín ověřeny |

**Nejdůležitější rozpor zadání:** bílé písmo na CTA #5BA300
má kontrast jen **3,14 : 1**, tedy pod 4,5 : 1. Výsledek respektuje
přesnou firemní barvu; kontrast je poctivě označen NE.

**Důležitá funkční hranice:** CSS + JS publikované mimo Shoptet
neukládají serverová data produktů, takže metadata z importu je nutné
nahrát v administraci Shoptetu. Uživatelsky viditelný frontend po
načtení JS je řízený daty z 33 položek. Trvalé serverové SEO, popisy a ALT se bez importu v administraci Shoptetu nezmění.
Vizuální kontrola live Shoptet rozložení zatím NE: prostředí neumožnilo přístup k webu přes lokální prohlížeč.
Před nasazením bylo upraveno umístění trust baru a správná URL pro vrácení zboží.