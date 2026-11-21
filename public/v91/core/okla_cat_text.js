/* Okla – one short line about every category and subcategory (cs / sk / en / hu), shown in the header's category panel
   (okla_catbar.js): under each subcategory's name and beside the category's name. (Not on the category page's tiles.)
   window.oklaCatText(href) gives the line for the current language, or '' for a category without one (a new category
   simply shows its name until a line is added here). */
(function () {
  'use strict';
  if (window.oklaCatText) return;
  var T = {
    /* top categories */
    '/elektronicke-multitooly/': ['Flipper Zero, LILYGO a kapesní zařízení pro kutily', 'Flipper Zero, LILYGO a vreckové zariadenia pre kutilov', 'Flipper Zero, LILYGO and pocket gear for makers', 'Flipper Zero, LILYGO és zsebeszközök barkácsolóknak'],
    '/chytra-elektronika/': ['Chytré brýle s hovory, hudbou a překladem', 'Inteligentné okuliare s hovormi, hudbou a prekladom', 'Smart glasses with calls, music and translation', 'Okosszemüveg hívással, zenével és fordítással'],
    '/merici-technika-a-naradi/': ['Multimetry, vlhkoměry, teploměry a další měřidla', 'Multimetre, vlhkomery, teplomery a ďalšie meradlá', 'Multimeters, moisture meters, thermometers and more', 'Multiméterek, nedvességmérők, hőmérők és más mérők'],
    '/endoskopy-a-inspekcni-kamery/': ['Kamery do potrubí, motoru i dutin ve zdi', 'Kamery do potrubia, motora aj dutín v stene', 'Cameras for pipes, engines and wall cavities', 'Kamerák csövekbe, motorba és falüregekbe'],
    '/prakticke-vychytavky/': ['Termotiskárny, USB huby a autodiagnostika', 'Termotlačiarne, USB huby a autodiagnostika', 'Thermal printers, USB hubs and car diagnostics', 'Hőnyomtatók, USB hubok és autódiagnosztika'],
    '/designove-gadgety/': ['Pixelové displeje a hodiny na stůl', 'Pixelové displeje a hodiny na stôl', 'Pixel displays and desk clocks', 'Pixelkijelzők és asztali órák'],
    '/projektory-a-obraz/': ['Bezdrátový obraz z mobilu na televizi', 'Bezdrôtový obraz z mobilu na televízor', 'Wireless picture from your phone to the TV', 'Vezeték nélküli kép a telefonról a tévére'],
    '/prislusenstvi/': ['Termopapíry, moduly a napájení k zařízením', 'Termopapiere, moduly a napájanie k zariadeniam', 'Thermal paper, modules and power for your gear', 'Hőpapír, modulok és tápellátás az eszközökhöz'],
    /* Elektronické multitooly */
    '/kapesni-platformy/': ['Kapesní multitooly na rádio, NFC a RFID', 'Vreckové multitooly na rádio, NFC a RFID', 'Pocket multitools for radio, NFC and RFID', 'Zseb-multitoolok rádióhoz, NFC-hez és RFID-hez'],
    '/esp32-a-vyvojove-desky/': ['Desky s displejem, startovací sady a dongly', 'Dosky s displejom, štartovacie sady a dongly', 'Boards with displays, starter kits and dongles', 'Kijelzős lapok, kezdőkészletek és donglek'],
    '/radiove-a-iot-moduly/': ['LoRa, Wi-Fi a Zigbee pro vlastní projekty', 'LoRa, Wi-Fi a Zigbee pre vlastné projekty', 'LoRa, Wi-Fi and Zigbee for your own projects', 'LoRa, Wi-Fi és Zigbee saját projektekhez'],
    /* Chytrá elektronika */
    '/chytre-bryle/': ['Hovory, hudba a překlad přímo v brýlích', 'Hovory, hudba a preklad priamo v okuliaroch', 'Calls, music and translation right in your glasses', 'Hívás, zene és fordítás a szemüvegben'],
    /* Měřicí technika */
    '/elektricka-mereni/': ['Testery součástek, USB a elektrických veličin', 'Testery súčiastok, USB a elektrických veličín', 'Testers for components, USB and electrical values', 'Alkatrész-, USB- és villamosérték-mérők'],
    '/vzdalenost--svetlo-a-zvuk/': ['Laserové dálkoměry, luxmetry a hlukoměry', 'Laserové diaľkomery, luxmetre a hlukomery', 'Laser distance meters, lux and sound meters', 'Lézeres távolságmérők, luxmérők és zajmérők'],
    '/teplota-a-termokamery/': ['Bezkontaktní teploměry a termokamery', 'Bezkontaktné teplomery a termokamery', 'Non-contact thermometers and thermal cameras', 'Érintés nélküli hőmérők és hőkamerák'],
    '/dilenske-naradi/': ['Tloušťkoměry laku, posuvná měřítka a další', 'Hrúbkomery laku, posuvné meradlá a ďalšie', 'Paint thickness gauges, calipers and more', 'Lakkvastagság-mérők, tolómérők és mások'],
    '/vlhkost-a-kvalita-vody/': ['Vlhkoměry dřeva a zdiva, testery pH a TDS', 'Vlhkomery dreva a muriva, testery pH a TDS', 'Wood and wall moisture meters, pH and TDS testers', 'Fa- és falnedvességmérők, pH- és TDS-mérők'],
    '/proudeni-vzduchu/': ['Anemometry pro rychlost a průtok vzduchu', 'Anemometre pre rýchlosť a prietok vzduchu', 'Anemometers for air speed and flow', 'Anemométerek légsebességhez és légáramláshoz'],
    '/mikroskopy/': ['Digitální mikroskopy s displejem i k počítači', 'Digitálne mikroskopy s displejom aj k počítaču', 'Digital microscopes with a screen or for a PC', 'Digitális mikroszkópok kijelzővel vagy géphez'],
    /* Endoskopy */
    '/endoskopy-s-displejem/': ['Samostatné kamery s vlastní obrazovkou', 'Samostatné kamery s vlastnou obrazovkou', 'Standalone cameras with their own screen', 'Önálló kamerák saját kijelzővel'],
    '/wi-fi-a-usb-endoskopy/': ['Kamery k telefonu, tabletu nebo počítači', 'Kamery k telefónu, tabletu alebo počítaču', 'Cameras for your phone, tablet or computer', 'Kamerák telefonhoz, táblagéphez vagy géphez'],
    /* Praktické vychytávky */
    '/tisk-a-stitky/': ['Kapesní termotiskárny na štítky a poznámky', 'Vreckové termotlačiarne na štítky a poznámky', 'Pocket thermal printers for labels and notes', 'Zseb-hőnyomtatók címkékhez és jegyzetekhez'],
    '/usb-rozbocovace-a-adaptery/': ['USB huby, čtečky karet a bezdrátové CarPlay', 'USB huby, čítačky kariet a bezdrôtové CarPlay', 'USB hubs, card readers and wireless CarPlay', 'USB hubok, kártyaolvasók és vezeték nélküli CarPlay'],
    '/auto-diagnostika/': ['OBD2 diagnostika auta přímo v telefonu', 'OBD2 diagnostika auta priamo v telefóne', 'OBD2 car diagnostics right on your phone', 'OBD2 autódiagnosztika a telefonon'],
    /* Designové gadgety */
    '/pixelove-displeje-a-hodiny/': ['Pixelové hodiny a animace na pracovní stůl', 'Pixelové hodiny a animácie na pracovný stôl', 'Pixel clocks and animations for your desk', 'Pixelórák és animációk az asztalra'],
    /* Projektory a obraz */
    '/bezdratovy-prenos-obrazu/': ['Zrcadlení z mobilu a počítače na televizi', 'Zrkadlenie z mobilu a počítača na televízor', 'Mirroring from phone and computer to the TV', 'Tükrözés telefonról és gépről a tévére'],
    /* Příslušenství */
    '/spotrebni-material/': ['Termopapíry do tiskáren a fotoaparátů', 'Termopapiere do tlačiarní a fotoaparátov', 'Thermal paper for printers and instant cameras', 'Hőpapír nyomtatókhoz és fényképezőgépekhez'],
    '/moduly-a-adaptery/': ['Rozšiřující desky a adaptéry k zařízením', 'Rozširujúce dosky a adaptéry k zariadeniam', 'Add-on boards and adapters for your gear', 'Bővítőlapok és adapterek az eszközökhöz'],
    '/baterie-a-napajeni/': ['Baterie a napájení pro vaše zařízení', 'Batérie a napájanie pre vaše zariadenia', 'Batteries and power for your devices', 'Akkuk és tápellátás az eszközeihez']
  };
  var LANGS = ['cs', 'sk', 'en', 'hu'];
  function path(href) { try { return new URL(href, location.origin).pathname.replace(/\/?$/, '/'); } catch (e) { return String(href || ''); } }
  /* a category name saved in capitals in Shoptet ("PŘÍSLUŠENSTVÍ") shows as "Příslušenství" wherever category names
     stand: the left column, the breadcrumbs, the phone menus, the subcategory tiles */
  var NAMES = 'aside.sidebar .box-categories a, .breadcrumbs a, .breadcrumbs [itemprop="name"], #okla-v61-drawer a, ul.subcategories a, #navigation a, .okla-tb-panel a';
  function nice(t) { return t.charAt(0) + t.slice(1).toLocaleLowerCase('cs'); }
  function fixCaps() {
    document.querySelectorAll(NAMES).forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        var t = n.nodeValue.trim();
        if (t.length >= 5 && /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{4}/.test(t) && t === t.toLocaleUpperCase('cs') && t !== t.toLocaleLowerCase('cs')) n.nodeValue = n.nodeValue.replace(t, nice(t));
      }
    });
  }
  var queued = false;
  function soon() { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; fixCaps(); }); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', soon, {once: true}); else soon();
  window.addEventListener('load', soon);
  if (window.MutationObserver) new MutationObserver(function (r) { for (var i = 0; i < r.length; i++) if (r[i].addedNodes.length) { soon(); return; } }).observe(document.documentElement, {childList: true, subtree: true});

  window.oklaCatText = function (href) {
    var row = T[path(href)];
    if (!row) return '';
    var l = (window.oklaLang && window.oklaLang.current) || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    var i = LANGS.indexOf(l);
    return row[i < 0 ? 0 : i] || row[0];
  };
})();
