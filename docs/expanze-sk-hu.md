# OKLA — rozšíření do SK a HU

**Zvolený režim:** přeshraniční prodej z ČR (prodávající zůstává **Kratas Pro s.r.o.**, IČO 23695340, DIČ CZ23695340), DPH přes **OSS** (One‑Stop‑Shop). **Měny:** EUR pro Slovensko, HUF pro Maďarsko.

> **⚠️ Důležité:** Texty níže jsou odborně připravené **návrhy k vložení do Shoptetu**, vycházející z vašich stávajících českých podmínek a z harmonizovaného spotřebitelského práva EU. Části označené **⚠️** (čísla zákonů, názvy a adresy ADR orgánů, DPH/fakturace) **nechte před spuštěním potvrdit účetním/právníkem** — tyto se liší podle země a v čase se mění. Nejsem právník; nejde o právní poradenství.

Dokument má dvě části:
- **Část 1 – Checklist** (co technicky a administrativně zařídit).
- **Část 2 – Právní texty** (SK a HU verze stránek + úprava CZ + chybějící stránky).

---

## ČÁST 1 — Checklist rozšíření

### 1. DPH a OSS ⚠️ (účetní)
- Zaregistrovat se do **režimu OSS** v ČR (přes portál Finanční správy). Umožní odvádět DPH z prodejů koncovým spotřebitelům v SK/HU jednou čtvrtletní přiznávkou v ČR.
- Hlídat, že u B2C prodeje do EU platí **sazba DPH země zákazníka** (SK základní 23 %, HU 27 % — ⚠️ ověřit aktuální sazby a případné snížené sazby pro konkrétní zboží).
- Na fakturách uvádět správnou sazbu dle země doručení. Shoptet umí sazby podle země nastavit — viz bod 2.

### 2. Měny a ceny v Shoptetu
- Zapnout **vícejazyčné mutace** a **více měn**: EUR (SK), HUF (HU), CZK (CZ).
- Nastavit **kurz / zaokrouhlování** a ceníky pro EUR a HUF (Shoptet: *Nastavení → Ceníky a měny*). Rozhodnout, zda ceny přepočítávat kurzem automaticky, nebo zadat „hezké" koncové ceny ručně (doporučeno u HUF kvůli velkým číslům).
- Zkontrolovat, že se u SK/HU zobrazuje cena v místní měně včetně místní DPH.

### 3. Jazykové mutace a domény
- V Shoptetu vytvořit jazykové verze **SK** a **HU** (obsah stránek, kategorie, e‑maily, patička).
- Náš bundle (`zapati_firsthalf.js`) už překládá UI, produkty a AI chatbota do CZ/EN/SK/HU; **právní stránky jsou ale samostatný obsah Shoptetu** — vložte texty z Části 2 do příslušných jazykových mutací.
- ⚠️ Zvážit domény/subdomény (okla.sk, okla.hu) nebo podadresáře — SEO a důvěryhodnost. Obchodní rozhodnutí.

### 4. Doprava ⚠️
- Nastavit dopravce do SK a HU a jejich ceny. Obvyklé volby:
  - **SK:** Packeta (Zásilkovna) výdejní místa a Z‑Point, GLS, DPD, Slovenská pošta.
  - **HU:** Packeta HU, GLS HU, Foxpost (automaty), MPL (Magyar Posta).
- Nastavit dodací lhůty a případné dobírky v místní měně (pokud nabízíte).

### 5. Platby ⚠️
- Platební brána musí umět **EUR i HUF** (např. Comgate, GoPay, Stripe — ⚠️ ověřit podporu HUF u vaší brány).
- Zapnout relevantní metody (karta, Apple/Google Pay, bankovní převod v místní měně, dobírka dle dopravce).

### 6. Právní stránky — co doplnit
Stávající stav e‑shopu: existují **Obchodní podmínky, Doprava a platba, Reklamační řád**. **Chybí** (patička na ně odkazuje, ale vrací 404):
- **Ochrana osobních údajů (GDPR)** — `/ochrana-osobnich-udaju/` → **vytvořit** (text v Části 2, CZ/SK/HU).
- **Vrácení zboží** — `/vraceni-zbozi/` → **vytvořit** (lze použít sekci z „Doprava a platba").
- **Základní informace** — `/zakladni-informace/` → vytvořit nebo z patičky odkaz odebrat.
- Pro SK/HU vložit přeložené verze všech těchto stránek (Část 2).

### 7. Mimosoudní řešení sporů (ADR/ODR) ⚠️
- **ODR platforma EU** je od 20. 7. 2025 ukončována — ⚠️ ověřit aktuální stav a zda ještě na ni odkazovat.
- **SK:** Slovenská obchodná inšpekcia (SOI) jako orgán ADR. ⚠️ doplnit aktuální adresu/odkaz.
- **HU:** příslušný **békéltető testület** (smírčí sbor) podle sídla/▲bydliště; v textu odkázat na místně příslušný. ⚠️ doplnit.

### 8. Fakturace ⚠️ (účetní)
- Faktury v měně objednávky (EUR/HUF), s DPH země zákazníka (OSS).
- Náležitosti dokladu dle předpisů dané země.

### 9. Kontakt a podpora
- Uvést, v jakých jazycích poskytujete podporu (podpora@okla.cz). Pokud SK/HU zákazníci píší v místním jazyce, zajistit odpovídání (AI chatbot už odpovídá dle jazyka webu).

---

## ČÁST 2 — Právní texty k vložení

### 2A. Úprava stávajících ČESKÝCH obchodních podmínek (cross‑border)

Do české verze doplňte (ideálně do úvodu a do části „Stížnosti, spory a závěrečná ustanovení"):

> **Prodej do zahraničí (EU).** Okla.cz dodává zboží i spotřebitelům na Slovensku a v Maďarsku. DPH u těchto prodejů odvádíme v režimu jednoho správního místa (OSS). Konečná cena a sazba DPH se zobrazují podle země doručení a zvolené měny (EUR pro SK, HUF pro HU, CZK pro ČR).
>
> **Rozhodné právo a ochrana spotřebitele.** Smlouva se řídí českým právem. Je‑li kupujícím spotřebitel s obvyklým pobytem v jiném členském státě EU, zůstávají mu zachována práva podle **kogentních ustanovení práva státu jeho pobytu**, pokud jsou pro něj výhodnější.
>
> **Mimosoudní řešení sporů.** Spotřebitel se může obrátit na orgán ADR ve státě svého pobytu: v ČR Česká obchodní inspekce; na Slovensku Slovenská obchodná inšpekcia; v Maďarsku místně příslušný békéltető testület. ⚠️ *(doplnit aktuální adresy/odkazy)*

---

### 2B. SLOVENSKO 🇸🇰

#### 2B‑1. Obchodné podmienky

**Obchodné podmienky**
DIČ: CZ23695340 | IČO: 23695340 | Okla.cz – Kratas Pro s.r.o. | E‑mail: podpora@okla.cz

**Predaj a zmluvné strany**
Predávajúcim je spoločnosť Kratas Pro s.r.o., Petržílkova 2583/15, Stodůlky, 158 00 Praha 5, Česká republika, zapísaná na Mestskom súde v Prahe, sp. zn. C 431005, prevádzkujúca internetový obchod Okla.cz. Kupujúcim je osoba, ktorá si v e‑shope objedná tovar. Spotrebiteľom je fyzická osoba, ktorá nenakupuje v rámci podnikania alebo výkonu povolania.

Tovar dodávame aj spotrebiteľom na Slovensku. DPH pri predaji slovenským spotrebiteľom odvádzame v režime OSS; cena a sadzba DPH sa zobrazujú podľa krajiny doručenia. Ceny pre SK sú uvádzané v **eurách (EUR)** vrátane DPH. Zmluva sa uzatvára v slovenskom jazyku.

**Tovar, ceny a dostupnosť**
Pri každom produkte uvádzame cenu, základné vlastnosti a stav dostupnosti. Rozhodujúca je konečná cena zobrazená pred odoslaním objednávky vrátane zákonných poplatkov; doprava a prípadný príplatok za spôsob úhrady sú uvedené samostatne. Ponuka platí do vypredania zásob alebo do skončenia uvedenej akcie. Pri zjavnej chybe v cene postupujeme podľa občianskeho zákonníka; nejde o všeobecné právo rušiť objednávky.

**Objednávka a uzavretie zmluvy**
Vyberiete tovar, vložíte ho do košíka, zvolíte dopravu a platbu a vyplníte údaje na doručenie. Pred odoslaním je možné údaje skontrolovať a opraviť. Objednávka sa odosiela tlačidlom jednoznačne označujúcim povinnosť platby. Kúpna zmluva vzniká prijatím objednávky predávajúcim, ktoré oznámime e‑mailom; automatické potvrdenie o doručení objednávky nemusí byť prijatím.

**Platba a doklady**
Zaplatiť možno iba metódami zobrazenými v košíku (podrobnosti na stránke Doprava a platba). Kúpna cena je uhradená pripísaním na účet predávajúceho alebo potvrdením transakcie poskytovateľom platby. Zákazníkovi poskytneme doklad o nákupe. Vlastnícke právo prechádza na kupujúceho prevzatím a úplným zaplatením.

**Doručenie a prevzatie**
Spôsoby a ceny dopravy a predpokladaný termín sa zobrazujú pri objednávke. Ak nie je dohodnuté inak, dodáme tovar bez zbytočného odkladu, najneskôr do 30 dní od uzavretia zmluvy. Pri prevzatí odporúčame skontrolovať neporušenosť zásielky; neoznámenie poškodenia nezbavuje spotrebiteľa zákonných práv zo zodpovednosti za vady.

**Zodpovednosť za vady (reklamácie)**
Tovar musí zodpovedať dohodnutým vlastnostiam a zákonným požiadavkám. Spotrebiteľ môže vytknúť vadu, ktorá sa prejaví **do 24 mesiacov** od prevzatia. Spotrebiteľ môže spravidla požadovať opravu alebo výmenu, prípadne zľavu alebo odstúpenie za zákonných podmienok. Reklamáciu uplatníte na podpora@okla.cz; vybavíme ju vrátane informovania o výsledku najneskôr do 30 dní. Podrobnosti uvádza Reklamačný poriadok. ⚠️ *(SK úprava zodpovednosti za vady — zákon č. 108/2024 Z. z. o ochrane spotrebiteľa účinný od 1. 7. 2024 — overiť aktuálne znenie a lehoty u právnika.)*

**Odstúpenie od zmluvy do 14 dní**
Spotrebiteľ môže od zmluvy uzavretej na diaľku odstúpiť bez uvedenia dôvodu **do 14 dní** od prevzatia tovaru. Odstúpenie pošlite na podpora@okla.cz alebo písomne na sídlo predávajúceho; môžete použiť vzorový formulár (nie je povinný). Tovar vráťte najneskôr do 14 dní od odstúpenia. Peniaze vrátime vrátane najlacnejšieho ponúkaného spôsobu dopravy najneskôr do 14 dní od prijatia odstúpenia; môžeme ich zadržať do vrátenia tovaru alebo preukázania jeho odoslania. Priame náklady na vrátenie znáša spravidla spotrebiteľ. Výnimky z práva na odstúpenie ustanovuje zákon. ⚠️ *(SK: § výnimiek podľa zákona č. 108/2024 Z. z. — overiť.)*

**Ochrana osobných údajov**
Údaje potrebné na vybavenie objednávky spracúvame v súlade s GDPR. Podrobnosti uvádza stránka Ochrana osobných údajov.

**Sťažnosti a riešenie sporov**
V prípade nespokojnosti nám napíšte na podpora@okla.cz. Spotrebiteľský spor môže riešiť mimosúdne **Slovenská obchodná inšpekcia (SOI)** ⚠️ *(doplniť adresu/odkaz)*. Zmluva sa riadi českým právom; tým nie sú dotknuté práva spotrebiteľa podľa kogentných ustanovení slovenského práva, ak sú preňho výhodnejšie.

**Záverečné ustanovenia**
Podmienky možno aktualizovať pre budúce objednávky; zmeny sa nedotknú práv z už uzavretých zmlúv. Účinnosť: ⚠️ *(doplniť dátum)*.

**Vzor na odstúpenie od zmluvy**
Adresát: Okla.cz, Kratas Pro s.r.o., Petržílkova 2583/15, 158 00 Praha 5; e‑mail podpora@okla.cz.
Týmto oznamujem, že odstupujem od kúpnej zmluvy na tento tovar: [TOVAR]. Číslo objednávky [●], dátum objednania [●], dátum prevzatia [●], meno [●], adresa [●], e‑mail [●], dátum [●].

---

#### 2B‑2. Doprava a platba (SK)

**Doprava a platba**
Ceny a spôsoby dopravy do SK sa zobrazujú pri objednávke; ceny sú v EUR vrátane DPH. Dostupní dopravcovia: ⚠️ *(napr. Packeta/Z‑Point, GLS, DPD, Slovenská pošta — doplniť podľa nastavenia)*. Platobné metódy: ⚠️ *(karta, Apple/Google Pay, prevod v EUR, dobierka — doplniť)*.

**Vrátenie do 14 dní.** Spotrebiteľ môže do 14 dní od prevzatia odstúpiť bez uvedenia dôvodu (oznámenie na podpora@okla.cz). Tovar pošlite späť najneskôr do 14 dní od odstúpenia; priame náklady na vrátenie znáša spravidla spotrebiteľ. Tovar neposielajte na dobierku. Môžete ho primerane vyskúšať; za zníženie hodnoty nad nevyhnutný rozsah zodpovedáte.

**Vrátenie peňazí.** Najneskôr do 14 dní od prijatia odstúpenia vrátime peniaze vrátane najlacnejšieho ponúkaného spôsobu dopravy, rovnakým spôsobom ako pri platbe.

**Kedy odstúpiť nemožno.** Výnimky ustanovuje zákon (napr. tovar na mieru, zapečatený tovar nevhodný na vrátenie z hygienických dôvodov po porušení obalu). ⚠️ *(overiť SK znenie.)*

---

#### 2B‑3. Reklamačný poriadok (SK)

**Reklamačný poriadok**
Reklamáciu vybavuje predávajúci Okla.cz; dopĺňa obchodné podmienky. Spotrebiteľ môže vytknúť vadu, ktorá sa prejaví **do 24 mesiacov** od prevzatia. Reklamovať možno najmä nefunkčnosť, nesúlad s popisom, chýbajúcu funkciu či nekompletný obsah balenia.

**Ako uplatniť.** Napíšte na podpora@okla.cz — uveďte číslo objednávky, označenie výrobku, popis vady a požadované riešenie. Originálny obal sa nevyžaduje; nákup možno preukázať aj inak než originálom faktúry.

**Spôsob vybavenia.** Pri oprávnenej reklamácii možno spravidla požadovať opravu alebo výmenu; za zákonných podmienok zľavu alebo odstúpenie. Vydáme potvrdenie o uplatnení a o výsledku.

**Lehota.** Reklamáciu vybavíme vrátane informovania o výsledku najneskôr do 30 dní, ak sa nedohodneme na dlhšej lehote. Uznaná reklamácia je bezplatná vrátane náhrady účelne vynaložených nákladov.

**Nákup na IČO/DIČ.** Pre podnikateľov platia všeobecné ustanovenia; osobitné spotrebiteľské lehoty sa neuplatnia automaticky.

**Spor** môže spotrebiteľ riešiť cez Slovenskú obchodnú inšpekciu (ADR). ⚠️ *(doplniť.)*
⚠️ *(Celé znenie zosúladiť so zákonom č. 108/2024 Z. z. — právnik.)*

---

#### 2B‑4. Ochrana osobných údajov (SK) — NOVÁ STRÁNKA

**Ochrana osobných údajov**
Prevádzkovateľ: Kratas Pro s.r.o., Petržílkova 2583/15, 158 00 Praha 5, ČR, IČO 23695340, podpora@okla.cz.

**Aké údaje a prečo.** Spracúvame údaje, ktoré zadáte pri objednávke a komunikácii (meno, adresa, e‑mail, telefón, údaje o objednávke) na účely: vybavenie objednávky a plnenie zmluvy, účtovné a zákonné povinnosti, vybavenie reklamácií, prípadne marketing na základe súhlasu.

**Právny základ.** Plnenie zmluvy, zákonná povinnosť, oprávnený záujem a súhlas (marketing, cookies).

**Príjemcovia.** Dopravcovia, platobná brána, poskytovateľ e‑shopu (Shoptet) a účtovníctvo — v rozsahu nevyhnutnom na uvedené účely.

**Doba uchovávania.** Po dobu nevyhnutnú na daný účel a podľa zákonných lehôt (napr. účtovné doklady).

**Vaše práva.** Prístup, oprava, výmaz, obmedzenie, prenositeľnosť, námietka a odvolanie súhlasu; sťažnosť na dozornom úrade. ⚠️ *(SK dozorný úrad: Úrad na ochranu osobných údajov SR — doplniť odkaz; ⚠️ doplniť cookies lištu a zoznam cookies.)*

**Vzor na odstúpenie / Elállás:** pozri obchodné podmienky.

---

### 2C. MAĎARSKO 🇭🇺

#### 2C‑1. Általános Szerződési Feltételek (ÁSZF)

**Általános Szerződési Feltételek**
Adószám: CZ23695340 | Cégjegyzékszám (IČO): 23695340 | Okla.cz – Kratas Pro s.r.o. | E‑mail: podpora@okla.cz

**Eladó és szerződő felek.** Az eladó a Kratas Pro s.r.o. (Petržílkova 2583/15, Stodůlky, 158 00 Prága 5, Csehország; Prágai Városi Bíróság, C 431005), amely az Okla.cz webáruházat üzemelteti. A vevő az a személy, aki a webáruházban terméket rendel. Fogyasztó az a természetes személy, aki nem szakmája, önálló foglalkozása vagy üzleti tevékenysége körében jár el.

Magyarországi fogyasztóknak is szállítunk. Az áfát OSS rendszerben számoljuk el; az ár és az áfakulcs a szállítási ország szerint jelenik meg. A HU árak **forintban (HUF)**, áfával együtt szerepelnek. A szerződés nyelve magyar.

**Termék, ár, elérhetőség.** Minden terméknél feltüntetjük az árat, a fő tulajdonságokat és a készletet. A megrendelés elküldése előtt megjelenő **végső ár** az irányadó, a törvényes díjakkal együtt; a szállítás és a fizetési mód felára külön szerepel. Nyilvánvaló árhiba esetén a vonatkozó jog szerint járunk el.

**Megrendelés és a szerződés létrejötte.** A terméket kosárba teszi, kiválasztja a szállítást és fizetést, megadja a szállítási adatokat. Elküldés előtt az adatok ellenőrizhetők és javíthatók. A megrendelést fizetési kötelezettséget egyértelműen jelző gombbal küldi el. Az adásvételi szerződés az eladó visszaigazolásával jön létre, amelyet e‑mailben küldünk; az automatikus átvételi visszaigazolás nem feltétlenül jelenti az elfogadást.

**Fizetés és bizonylatok.** Csak a kosárban megjelenő módokkal lehet fizetni (részletek: Szállítás és fizetés). A vételár az eladó számláján való jóváírással, illetve a fizetési szolgáltató visszaigazolásával tekintendő megfizetettnek. A vásárlásról bizonylatot adunk. A tulajdonjog az átvétellel és a teljes vételár megfizetésével száll át.

**Szállítás és átvétel.** A szállítási módok, árak és a várható határidő a megrendeléskor jelennek meg. Eltérő megállapodás hiányában a terméket indokolatlan késedelem nélkül, legkésőbb a szerződéskötéstől számított 30 napon belül szállítjuk. Átvételkor javasoljuk a csomag épségének ellenőrzését; ennek elmulasztása nem fosztja meg a fogyasztót a kellékszavatossági jogaitól.

**Kellékszavatosság / jótállás (reklamáció).** A termék feleljen meg a megállapodott tulajdonságoknak és a jogszabályi követelményeknek. A fogyasztó a termék átvételétől számított **2 éven belül** érvényesíthet kellékszavatossági igényt. A fogyasztó rendszerint kijavítást vagy kicserélést, illetve a törvényi feltételek mellett árleszállítást vagy elállást kérhet. Reklamáció: podpora@okla.cz; a kezelésről és eredményről legkésőbb 30 napon belül tájékoztatjuk. ⚠️ *(HU: a 45/2014. (II. 26.) Korm. rendelet és a Ptk. szavatossági/jótállási szabályai, valamint a kötelező jótállásról szóló 151/2003. Korm. rendelet egyes elektronikai termékekre — ügyvéddel egyeztetni a pontos határidőket és a kötelező jótállás alá eső termékkört.)*

**Elállás 14 napon belül.** A fogyasztó a távollévők között kötött szerződéstől a termék átvételétől számított **14 napon belül** indokolás nélkül elállhat. Az elállást a podpora@okla.cz címre vagy írásban az eladó székhelyére küldje; használhatja az elállási nyilatkozatmintát (nem kötelező). A terméket az elállástól számított 14 napon belül küldje vissza. A pénzt — a legolcsóbb szokásos szállítási díjat is beleértve — az elállás kézhezvételétől számított 14 napon belül visszatérítjük; visszatarthatjuk a termék visszaérkezéséig vagy a feladás igazolásáig. A visszaküldés közvetlen költségét rendszerint a fogyasztó viseli. Az elállás alóli kivételeket jogszabály állapítja meg. ⚠️ *(HU kivételek — 45/2014. Korm. rendelet 29. § — ellenőrizni.)*

**Személyes adatok.** A megrendelés teljesítéséhez szükséges adatokat a GDPR szerint kezeljük. Részletek: Adatvédelmi tájékoztató.

**Panasz és jogviták.** Panasz: podpora@okla.cz. A fogyasztó a lakóhelye szerint illetékes **békéltető testülethez** fordulhat. ⚠️ *(a konkrét békéltető testület nevét/elérhetőségét megadni)*. A szerződésre a cseh jog irányadó; ez nem érinti a fogyasztót a magyar jog kógens rendelkezései alapján megillető, számára kedvezőbb jogokat.

**Záró rendelkezések.** A feltételek jövőbeli megrendelésekre módosíthatók; a már megkötött szerződésekből eredő jogokat nem érintik. Hatályos: ⚠️ *(dátum megadása)*.

**Elállási nyilatkozatminta**
Címzett: Okla.cz, Kratas Pro s.r.o., Petržílkova 2583/15, 158 00 Prága 5; e‑mail podpora@okla.cz.
Alulírott kijelentem, hogy elállok az alábbi termék adásvételétől: [TERMÉK]. Rendelésszám [●], rendelés dátuma [●], átvétel dátuma [●], név [●], cím [●], e‑mail [●], dátum [●].

---

#### 2C‑2. Szállítás és fizetés (HU)

**Szállítás és fizetés**
A HU szállítási módok és árak a megrendeléskor jelennek meg; az árak HUF‑ban, áfával. Elérhető szállítók: ⚠️ *(pl. Packeta HU, GLS, Foxpost, MPL — a beállítás szerint)*. Fizetési módok: ⚠️ *(kártya, Apple/Google Pay, HUF átutalás, utánvét — megadni)*.

**Elállás 14 napon belül.** A fogyasztó az átvételtől számított 14 napon belül indokolás nélkül elállhat (jelzés: podpora@okla.cz). A terméket az elállástól számított 14 napon belül küldje vissza; a visszaküldés közvetlen költségét rendszerint a fogyasztó viseli. Ne küldje utánvéttel. A terméket ésszerűen kipróbálhatja; a szükséges mértéket meghaladó értékcsökkenésért felel.

**Visszatérítés.** Az elállás kézhezvételétől számított 14 napon belül visszatérítjük a pénzt a legolcsóbb szokásos szállítási díjjal együtt, a fizetéssel egyező módon.

**Mikor nincs elállás.** A kivételeket jogszabály rögzíti (pl. egyedi igény szerinti termék; lezárt, higiéniai okból vissza nem adható termék a csomagolás felbontása után). ⚠️ *(HU szöveg ellenőrzése.)*

---

#### 2C‑3. Adatvédelmi tájékoztató (HU) — ÚJ OLDAL

**Adatvédelmi tájékoztató**
Adatkezelő: Kratas Pro s.r.o., Petržílkova 2583/15, 158 00 Prága 5, Csehország, IČO 23695340, podpora@okla.cz.

**Milyen adatok és miért.** A megrendeléskor és kapcsolattartáskor megadott adatokat (név, cím, e‑mail, telefon, rendelési adatok) kezeljük: a megrendelés teljesítése és a szerződés, számviteli és jogi kötelezettségek, reklamációk kezelése, valamint hozzájárulás alapján marketing céljából.

**Jogalap.** Szerződés teljesítése, jogi kötelezettség, jogos érdek és hozzájárulás (marketing, sütik).

**Címzettek.** Szállítók, fizetési szolgáltató, a webáruház szolgáltatója (Shoptet) és könyvelés — a szükséges mértékben.

**Megőrzés.** A cél eléréséhez szükséges ideig és a jogszabályi határidők szerint.

**Az Ön jogai.** Hozzáférés, helyesbítés, törlés, korlátozás, adathordozhatóság, tiltakozás és a hozzájárulás visszavonása; panasz a felügyeleti hatóságnál. ⚠️ *(HU felügyeleti hatóság: NAIH — elérhetőség megadása; ⚠️ süti‑sáv és süti‑lista hozzáadása.)*

---

## Poznámky k nasazení
- Náš JS bundle (jazyky webu, produkty, AI chatbot) je na expanzi připraven: UI, produkty i chatbot fungují v CZ/EN/SK/HU. Měny EUR/HUF a dopravu/platby/právní stránky je nutné nastavit v **administraci Shoptetu** (nemám do ní přístup).
- Po vložení SK/HU stránek zkontrolujte, že odkazy v patičce (vč. GDPR a Vrácení zboží) nevedou na 404.
- ⚠️ Před ostrým spuštěním nechte celý právní balík potvrdit účetním a právníkem se specializací na SK/HU spotřebitelské právo.
