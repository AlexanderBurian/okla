# OKLA V88 – audit a oprava kolizí šablony

Zdroj: katalog všech 33 produktů z uživatelského CSV; Shoptet zachovává košík, ceny, dostupnost i diskuzi.

## Hlavní opravený problém

Starší kód při opakovaném či překrývajícím se přesouvání hodnocení mohl dát třídu `ok86-empty` přímo pravému `.p-info-wrapper`. Původní CSS potom skrylo celý nákupní panel. V88 nejprve odstraní tento chybný stav, kontroluje skutečného rodiče původního hodnocení a přiřadí `ok86-empty` výlučně původnímu prázdnému bloku. Úpravy jsou idempotentní díky `data-ok88-complete`.

## Homepage

Nový poslední kontrolovaný styling namísto vrstvených V78, V80, V81 a V87 skriptů. Hvězdy jsou pouze viditelný dekorativní prvek s explicitním `Bez hodnocení` (ne fiktivní recenze). Desktopové tlačítko má vždy modrý text, plný modrý košík a modrý outline; hover mění výplň na světle modrou, text a border zůstávají shodného odstínu. Hover rámeček začíná o 15 px níže a končí o 16 px za obsahem. Nedostupné produkty zůstávají nekoupitelné.

## Ověření

Lokální Chromium/Playwright se strukturou Shoptetu – 375, 768, 1280 px. Každá šířka: nákupní box viditelný, cena červeně, košík deaktivován pro `OutOfStock`, bez horizontálního scrollu, bez runtime chyb. Samostatně simulovaný chybný stav `ok86-empty` na nákupním panelu – opraven. Pět dekorativních hvězd, barvy CTA a hover CSS vypočtené přímo prohlížečem. Nejde o koncové vizuální testování živé Shoptet stránky.

## Nasazení

GitHub: `AlexanderBurian/okla`, produkční větev `main`. Shoptet musí načítat **právě jeden** loader – pro okamžitou verzi použijte odkaz s přesným commitem; `@main` může být kvůli cache starší.

Cloudflare Pages dosud není ověřeně připojené, proto případné nasazení GitHubu samo o sobě neaktualizuje aktuální loader v Shoptetu.