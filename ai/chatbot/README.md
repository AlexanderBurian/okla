# OKLA AI chatbot

Samostatný chatbot pro e-shop OKLA: izolovaný widget bez frameworku (Shadow DOM) a Node.js/TypeScript backend se streamováním odpovědí přes SSE. Výchozí mock režim funguje bezpečně bez API klíče.

## Co řešení obsahuje

- responzivní plovoucí widget s přístupností, plynulou animací, návrhy dotazů, resetem a průběžným zobrazováním odpovědi;
- Fastify API s validací, CORS allowlistem, rate limitingem, timeoutem a bezpečnými chybami;
- oficiální `groq-sdk`, přičemž klíč se načítá výhradně z proměnné prostředí;
- lokální auditovatelnou znalostní bázi, import 33 produktů ze Shoptet CSV a volitelnou synchronizaci XML feedu;
- mock režim, automatické testy a ukázkovou stránku.

Chatbot nemá přístup k objednávkám ani zákaznickým účtům a nemá se používat pro osobní nebo platební údaje.

## Požadavky

- Node.js 20 nebo novější
- npm

## Lokální spuštění bez API klíče

V PowerShellu:

```powershell
cd C:\Users\OMEN\Desktop\OKLA.CZ\chatbot
Copy-Item .env.example .env
npm install
npm run build
npm start
```

V `.env.example` je `MOCK_MODE=true`, takže není potřeba žádný klíč. Otevřete [http://localhost:8787](http://localhost:8787) a otestujte widget.

Pro vývoj s automatickým restartem backendu spusťte `npm run dev`; při změně widgetu znovu spusťte `npm run build:widget`.

## Bezpečné zapnutí Groq

1. Zneplatněte jakýkoli klíč, který se někdy objevil v chatu, e-mailu nebo jiném nezabezpečeném místě.
2. Vytvořte **nový** klíč v účtu Groq.
3. V lokálním souboru `.env` nastavte hodnoty:

```dotenv
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
MOCK_MODE=false
```

Nový klíč vložte pouze za rovnítko na řádku `GROQ_API_KEY`. Soubor `.env` je v `.gitignore`. Klíč nevkládejte do `widget.js`, HTML, Git repozitáře, Shoptetu ani do `ALLOWED_ORIGINS`. Po změně backend restartujte. Model lze kdykoli přepsat přes `GROQ_MODEL` bez změny kódu.

## Build a testy

```powershell
npm run build
npm test
npm run check
```

Build vytvoří backend v `dist/` a jediný vložitelný frontend soubor `public/widget.js`.

## Produktová data a znalostní báze

Obecné FAQ jsou v `data/knowledge.json`. Produkty se při startu načítají z `data/shoptet-products.csv`, což je lokální kopie autoritativního exportu `LEGAL/okla_shoptet_import_33_fotografie.csv`. Parser podporuje UTF-8 BOM, středník jako oddělovač, uvozovky, středníky a nové řádky uvnitř polí i českou diakritiku.

Import aktuálně načítá 33 produktů a používá:

- kód, název, kategorii, krátký nebo plný popis a výrobce;
- cenu pouze jako údaj z importního CSV s výslovným upozorněním, že se může změnit;
- ověřené produktové URL odvozené ze Shoptet adresáře a `SHOP_BASE_URL`;
- `productVisibility` pouze k vynechání skrytých položek, nikdy jako informaci o skladové dostupnosti.

Po aktualizaci exportu nahraďte soubor `data/shoptet-products.csv`, spusťte `npm test` a restartujte backend. Chatbot nikdy neodvozuje sklad z viditelnosti produktu a nevymýšlí chybějící parametry.

Priorita zdrojů je: aktuální XML feed → lokální CSV → obecné FAQ. XML feed je volitelný a vhodný pro průběžnou synchronizaci:

Volitelný produktový feed zapnete v `.env`:

```dotenv
SHOPTET_FEED_URL=https://www.okla.cz/export/products.xml
SHOPTET_FEED_REFRESH_MINUTES=60
```

URL je pouze příklad; použijte skutečnou neveřejnou či veřejnou exportní URL z administrace Shoptetu podle jejího oprávnění. Backend feed stáhne při startu, pak jej obnovuje a provádí jednoduché bodované vyhledávání bez externí vektorové databáze. AI má výslovný zákaz domýšlet chybějící údaje.

Testovací web `https://825108.myshoptet.com/` byl ověřen pouze pro čtení. Obsahuje sedm kategorií a URL všech 33 produktů, ale stále používá obecný titul „Můj e-shop“. Skladová dostupnost na webu je dynamická a nepřebírá se do lokální znalostní báze.

## Přesný snippet pro Shoptet

Nejdříve backend nasaďte na HTTPS doménu, například `https://chat.okla.cz`, a ověřte `https://chat.okla.cz/health`. V Shoptetu otevřete **Vzhled a obsah → Editor → HTML kód → Zápatí** a vložte:

```html
<script
  src="https://chat.okla.cz/widget.js"
  data-api-url="https://chat.okla.cz"
  data-asset-base-url="https://chat.okla.cz"
  defer
></script>
```

`data-asset-base-url` určuje základní adresu pro obrázek robota. Když atribut vynecháte, widget ji bezpečně odvodí z `data-api-url` a následně z adresy souboru `widget.js`.

V produkčním `.env` musí být povolené přesné originy obchodu:

```dotenv
PUBLIC_BASE_URL=https://chat.okla.cz
ALLOWED_ORIGINS=https://www.okla.cz,https://okla.cz
```

Widget je izolovaný v Shadow DOM, takže se jeho styly nekříží se Shoptetem. Launcher a panel jsou dvě samostatné vrstvy; panel zůstává nad launcherem s bezpečným odstupem i na mobilu.

## Produkční nasazení

1. Nahrajte složku na server s Node.js 20+ a spusťte `npm ci && npm run build`.
2. Vytvořte produkční `.env` mimo Git, nastavte nový klíč, `MOCK_MODE=false`, HTTPS `PUBLIC_BASE_URL` a přesný CORS allowlist.
3. Spusťte `npm start` pod správcem procesů (systemd, Docker, PM2 nebo služba hostingu).
4. Před Node server umístěte HTTPS reverse proxy. Pro `/api/chat` vypněte proxy buffering a nastavte timeout delší než `CHAT_TIMEOUT_MS`, aby SSE proud nebyl zadržován.
5. Zpřístupněte pouze port reverse proxy; interní port 8787 nemusí být veřejný.
6. Ověřte `/health`, widget, mobilní zobrazení, CORS a limity. Produkční logy neposílejte do systému, který automaticky ukládá obsah request body; aplikace samotná obsah zpráv neloguje.

Příklad pro Nginx v lokaci `/api/chat`:

```nginx
proxy_pass http://127.0.0.1:8787;
proxy_http_version 1.1;
proxy_buffering off;
proxy_read_timeout 45s;
```

## Konfigurace

| Proměnná | Význam |
|---|---|
| `GROQ_API_KEY` | Nový tajný klíč, pouze na backendu |
| `GROQ_MODEL` | Použitý model Groq |
| `MOCK_MODE` | `true` pro bezpečný provoz bez API |
| `HOST`, `PORT` | Adresa backendu |
| `PUBLIC_BASE_URL` | Veřejná URL backendu bez koncového lomítka |
| `ALLOWED_ORIGINS` | Čárkou oddělené přesné originy pro CORS |
| `MAX_MESSAGE_LENGTH` | Maximální délka dotazu |
| `MAX_HISTORY_MESSAGES` | Maximální počet zpráv historie |
| `CHAT_TIMEOUT_MS` | Timeout AI požadavku |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW` | Omezení počtu požadavků |
| `KNOWLEDGE_FILE` | Cesta k lokálnímu JSON |
| `SHOPTET_CSV_FILE` | Cesta k lokálnímu Shoptet CSV |
| `SHOP_BASE_URL` | Základní URL obchodu pro produktové odkazy |
| `SHOPTET_FEED_URL` | Volitelná URL XML feedu |

## API

- `GET /health` – stav služby a počty načtených znalostí, bez citlivých údajů
- `POST /api/chat` – JSON `{ "message": "...", "history": [...] }`, odpověď `text/event-stream`
- `GET /widget.js` – samostatný produkční widget
- `GET /assets/okla-robot-launcher.png` – robot pro launcher a avatary
- `GET /assets/okla-mobile-assistant-glyph-v1.png` – transparentní piktogram mobilního bočního tabu

SSE používá události `token`, `done` a `error`. Při limitu poskytovatele vrací bezpečnou chybu `rate_limited` a případný `retryAfter`.
