# OKLA V89 — sjednocení aktivních úprav

## Změny

- Nový samostatný modul `okla_navigation_v89.js` spravuje navigaci všech stránek. Zachovává Shoptet BreadcrumbList, původní odkazy, skryté `itemprop=name` a pozici, ale odstraňuje duplicitní SVG domu, skryje původní pseudo-ikonu a nahradí staré velké grafické oddělovače krátkým `›` (13 px).
- `okla_detail_v89.js` odstranil vlastní úpravy breadcrumb a staré CSS breadcrumb. Již nepřidává žádné další ikony. Zachoval nákupní box, skutečnou dostupnost, Shoptet formulář, SEO, parametry, diskuzi, související produkty a důvěryhodné informace. Detailové CSS se vkládá pouze jednou jako součást svého JS.
- `okla_home_v89.js` a jeho jediný stylesheet jsou autoritou pro desktopový hover, pět dekorativních hvězd a plnou modrou ikonu košíku. Žádná desktopová ikona se na mobilu nepřidává. Mobilní design základní V77 zůstává; tabletové 3 karty a desktopových 5 karet řeší aktuální stylesheet.
- Bootstrap nově vůbec nespouští prezentační skript V79 ani starší V88/V87. Základní starší moduly nutné pro původní funkcionality Shoptetu ponechává.

## Kontroly

Místní Chromium testy s domovským Shoptet markup a původními pseudo-ikonami: 375, 768, 1280 px; běžný detail, detail s dříve skrytým nákupním sloupcem, homepage. Celkem 9 scénářů: bez JS výjimek, bez horizontálního scrollu. Jeden domovský SVG, dvě malé šipky 13px, zachovaná semantika původní navigace a funkční nákupní panel. Na homepage přesně 5 dekorativních hvězd, desktopová ikona jen na šířce nejméně 992 px.

To jsou **lokální** kontroly, nikoli automatizované potvrzení nového skriptu ve skutečně přihlášeném prohlížeči na e-shopu. Do Shoptetu je nutno vložit jedinou aktualizovanou verzi loaderu a odstranit starou. Protože jsDelivr `@main` může vracet starší verzi, předává se přímý odkaz na commit SHA.

Žádný serverový import do administrace produktů nebyl proveden, katalog 33 produktů se nemění.