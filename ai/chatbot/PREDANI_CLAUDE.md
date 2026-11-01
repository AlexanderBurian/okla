# Integrace OKLA poradce do Shoptetu

Balíček obsahuje aktuální pracovní verzi po úpravách z 1. listopadu 2026 včetně sestaveného public/widget.js. Pro integraci použij obsah tohoto archivu. Starší commit 41a0099 předchází úpravám rozhraní a katalogu.

## Lokální ověření

V kořeni rozbaleného projektu použij Node.js 22 a npm. Na čisté instalaci zkopíruj .env.example do .env. Výchozí MOCK_MODE=true umožní vyzkoušet aplikaci bez účtu Groq.

```powershell
npm ci
npm run check
$env:PORT="8788"
$env:PUBLIC_BASE_URL="http://localhost:8788"
$env:ALLOWED_ORIGINS="http://localhost:8788"
npm start
```

Otevři http://localhost:8788 a /health. Katalog obsahuje 33 produktů. Po výměně dat nebo serverového kódu restartuj proces.

## Připojení testovacího e-shopu

1. Nasaď aplikaci jako běžící Node.js službu za HTTPS. Build je `npm ci && npm run build`, start je `npm start`. Spouštěj z kořene s adresáři dist, public, data a provozními závislostmi. Proxy musí podporovat průběžné předávání odpovědi text/event-stream.
2. Nastav PUBLIC_BASE_URL na skutečnou veřejnou HTTPS adresu služby a PORT podle hostingu. V kontejneru nastav HOST=0.0.0.0. Do ALLOWED_ORIGINS přidej přesný origin https://825108.myshoptet.com a origin vlastního náhledu služby. Pro ostrý obchod přidej jeho skutečný origin. Při změně domény zkontroluj také explicitní produktové odkazy v CSV a odkazy FAQ.
3. Pro živé odpovědi nastav na serveru MOCK_MODE=false, GROQ_API_KEY v tajných proměnných hostingu a GROQ_MODEL na model dostupný v účtu. Restartuj a ověř odpověď přes celý chat. Předávací kontroly používaly mock režim.
4. V Shoptetu vlož tento blok jednou do globálního zápatí. V obou atributech nahraď chat.example.com skutečnou doménou nasazené služby.

```html
<script src="https://chat.example.com/widget.js"
        data-api-url="https://chat.example.com"
        defer></script>
```

## Přejímka

- Na mobilu ověř boční tlačítko s lupou směřující vlevo dolů, otevření, zvětšení přes celou obrazovku a zavření. Na PC tlačítko zvětšení rozšíří panel.
- Tlačítko ⓘ vloží představení poradce do otevřené konverzace.
- Vyzkoušej „Jaké rozlišení má WANBO X5 Pro?“, „Je Q18 skladem?“ a „Kde je můj balík?“. Očekávej Full HD 1920 × 1080, odkaz na aktuální dostupnost a nasměrování na podporu.
- Ověř skutečné doručování tokenů na produktu i na hlavní stránce a načtení obrázků z hostingu. Produktové podklady jsou snímek katalogu. Stránka /doprava-a-platba/ při kontrole obsahovala podmínky vrácení, cenu dopravy proto poradce směruje do košíku.
- Pro odebrání widgetu odstraň vložený script ze zápatí.
