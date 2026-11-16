/* OKLA category pages - a short definition of the category under its title and a longer "about" block under the
   products (SEO and orientation). Czech only (the other languages show none). A description written in Shoptet for
   the category (.category-perex) wins: then no intro is added here. The texts describe the kinds of products the
   category holds, never prices, stock or delivery. */
(function(){
 'use strict';
 if(window.__oklaCategorySeoV1)return;window.__oklaCategorySeoV1=true;
 var T={
  '/elektronicke-multitooly/':{
   intro:'Elektronické multitooly jsou kapesní zařízení a vývojové desky pro práci s digitálními protokoly, rádiovými signály a vlastními projekty – od Flipperu Zero po desky ESP32 s displejem.',
   title:'Co jsou elektronické multitooly',
   about:['Elektronický multitool spojuje v jednom zařízení několik nástrojů, které by jinak vyžadovaly samostatné přístroje: čtení a emulaci NFC a RFID, infračervený ovladač, práci se Sub-GHz rádiem nebo s piny GPIO. Typickým zástupcem je Flipper Zero, který je připravený k použití hned po vybalení.',
    'Druhou skupinu tvoří programovatelné desky a kapesní počítače s čipem ESP32 – LILYGO, M5Stack, Waveshare nebo výukové sady LAFVIN. Mají Wi-Fi a Bluetooth, často vlastní displej, klávesnici či otočný ovladač a hodí se pro vlastní firmware, IoT projekty a výuku programování v Arduino IDE nebo MicroPythonu.']
  },
  '/kapesni-platformy/':{
   intro:'Kapesní platformy jsou hotová přenosná zařízení s vlastním displejem a ovládáním, která zvládnou víc úloh najednou bez nutnosti programování.',
   title:'Kapesní platformy',
   about:['Do této skupiny patří zařízení, která nosíte v kapse a používáte rovnou: Flipper Zero pro práci s NFC, RFID, infračerveným přenosem a Sub-GHz signály, nebo osciloskopický multimetr, který spojuje měření napětí a proudu se zobrazením průběhu signálu.',
    'Oproti vývojovým deskám mají kapesní platformy vlastní baterii, obal a ovládání, takže jsou vhodné pro diagnostiku v terénu, servis i experimenty bez stavění vlastního hardwaru.']
  },
  '/esp32-a-vyvojove-desky/':{
   intro:'Vývojové desky s čipem ESP32 jsou základ pro vlastní elektroniku, IoT projekty a výuku programování – s Wi-Fi, Bluetooth a často i s displejem.',
   title:'ESP32 a vývojové desky',
   about:['ESP32 je oblíbený mikrokontrolér s Wi-Fi a Bluetooth, který programujete v Arduino IDE, ESP-IDF nebo MicroPythonu. Desky LILYGO, M5Stack a Waveshare k němu přidávají barevné AMOLED displeje, klávesnici, otočný ovladač nebo VGA výstup, takže z nich rychle postavíte ovladač, měřák, hodiny či kapesní počítač.',
    'Pro začátečníky jsou určené výukové sady jako LAFVIN ESP32-S3 Super Starter Kit s nepájivým polem, senzory a součástkami; zkušení vývojáři ocení hotové kapesní platformy typu T-Deck nebo Cardputer pro vlastní firmware.']
  },
  '/radiove-a-iot-moduly/':{
   intro:'Rádiové a IoT moduly propojují elektroniku bezdrátově – rozšiřují projekty o komunikaci na krátkou i dlouhou vzdálenost.',
   title:'Rádiové a IoT moduly',
   about:['IoT moduly slouží k bezdrátovému přenosu dat mezi zařízeními a k připojení senzorů, spínačů nebo vlastních desek do sítě. Podle použití se liší frekvencí, dosahem a spotřebou – od Wi-Fi a Bluetooth pro domácnost po Sub-GHz rádio pro větší vzdálenosti.',
    'Moduly se obvykle připojují k vývojovým deskám, jako je ESP32, přes piny GPIO, sběrnici SPI nebo UART a programují se ve stejném prostředí jako samotná deska.']
  },
  '/chytra-elektronika/':{
   intro:'Chytrá elektronika usnadňuje každodenní komunikaci, práci i zábavu – překladová sluchátka a brýle, AI diktafon nebo kapesní herní konzole.',
   title:'Chytrá elektronika do kapsy',
   about:['V kategorii najdete zařízení, která využívají umělou inteligenci a bezdrátové připojení k telefonu: překladová Bluetooth sluchátka a chytré brýle pomáhají na cestách v cizím jazyce, AI diktafon nahraje schůzku a převede ji na text.',
    'Pro volný čas je tu kapesní retro herní konzole. Společné mají kompaktní rozměry, vlastní baterii a jednoduché ovládání, takže je nosíte stále s sebou.']
  },
  '/chytre-bryle/':{
   intro:'Chytré brýle spojují brýlovou obrubu s reproduktory, mikrofonem a připojením k telefonu – pro hovory, hudbu a překlad bez sluchátek v uších.',
   title:'Chytré brýle',
   about:['Chytré brýle se k telefonu připojují přes Bluetooth. Zvuk vychází z malých reproduktorů v nožičkách, takže slyšíte hudbu i okolí zároveň, a vestavěný mikrofon slouží k hovorům a hlasovým pokynům.',
    'Některé modely umí s aplikací v telefonu překládat rozhovor nebo mají kameru pro fotografie z pohledu nositele. Při výběru sledujte výdrž baterie, typ skel a funkce, které skutečně využijete.']
  },
  '/merici-technika-a-naradi/':{
   intro:'Měřicí technika a nářadí pro dílnu, stavbu i domácnost – multimetry, vlhkoměry, hlukoměry, anemometry, teploměry, dálkoměry a další přístroje.',
   title:'Měřicí technika pro dílnu i domácnost',
   about:['Správně zvolený měřicí přístroj ušetří čas a odhalí problém dřív, než se zvětší. Multimetr a LCR pinzeta poslouží u elektroniky, vlhkoměr při kontrole dřeva a zdiva, IR teploměr a termokamera při hledání úniků tepla, laserový dálkoměr při zaměřování místností.',
    'Nabízíme přístroje značek ANENG, Benetech, HABOTEST, Wintact a TASI. Při výběru porovnejte rozsah a přesnost měření, typ sondy a způsob zobrazení – pro občasné domácí použití stačí jednodušší model, pro řemeslo se vyplatí přístroj s funkcí HOLD, podsvícením a vyšší přesností.']
  },
  '/elektricka-mereni/':{
   intro:'Přístroje pro elektrická měření – digitální multimetry a LCR pinzety pro kontrolu napětí, proudu, odporu i drobných součástek.',
   title:'Elektrická měření',
   about:['Digitální multimetr je základní nástroj každého elektrikáře i kutila: měří stejnosměrné i střídavé napětí, proud, odpor, spojitost obvodu a často i kapacitu nebo frekvenci. Modely s funkcí True RMS měří správně i nesinusové průběhy.',
    'LCR měřicí pinzeta usnadní práci s SMD součástkami – stačí se dotknout a přístroj sám rozpozná, zda jde o rezistor, kondenzátor nebo cívku, a zobrazí hodnotu.']
  },
  '/vzdalenost--svetlo-a-zvuk/':{
   intro:'Laserové dálkoměry, luxmetry a hlukoměry pro rychlé měření vzdálenosti, intenzity osvětlení a hladiny hluku.',
   title:'Měření vzdálenosti, světla a zvuku',
   about:['Laserový dálkoměr změří vzdálenost na desítky metrů jedním stisknutím a umí dopočítat plochu či objem místnosti. Luxmetr ukáže, zda je pracoviště nebo učebna dostatečně osvětlená, a hlukoměr změří hladinu hluku v decibelech.',
    'Tyto přístroje využijete při rekonstrukci, plánování interiéru i při kontrole pracovního prostředí. Pro venkovní použití se hodí dálkoměr se zeleným laserem, který je na světle lépe vidět.']
  },
  '/teplota-a-termokamery/':{
   intro:'Bezkontaktní teploměry a termokamery pro měření teploty povrchů na dálku – od kontroly topení po hledání úniků tepla.',
   title:'Teplota a termokamery',
   about:['Infračervený teploměr změří teplotu povrchu během okamžiku a bez dotyku – hodí se pro kontrolu radiátorů, motorů, elektroinstalace nebo potravin. Termokamera zobrazí rozložení teploty na celé ploše, takže snadno najdete tepelné mosty a vlhká místa.',
    'Při výběru sledujte rozsah teplot, rozlišení snímače a nastavitelnou emisivitu, která zpřesní měření na různých materiálech.']
  },
  '/dilenske-naradi/':{
   intro:'Dílenské nářadí a přístroje pro servis a kontrolu – například tloušťkoměr laku pro posouzení karoserie.',
   title:'Dílenské nářadí',
   about:['Tloušťkoměr laku změří vrstvu barvy na kovové karoserii a odhalí přelakované nebo tmelené díly. Je proto užitečný při koupi ojetého auta i v autoservisu.',
    'Do dílny se hodí přístroje, které jsou odolné, rychle ukáží výsledek a dají se nosit s sebou.']
  },
  '/vlhkost-a-kvalita-vody/':{
   intro:'Vlhkoměry dřeva a stavebních materiálů, testery kvality vody a pH metry pro stavbu, dílnu, zahradu i akvárium.',
   title:'Vlhkost a kvalita vody',
   about:['Vlhkoměr změří obsah vody ve dřevě, zdivu nebo omítce – poznáte, zda je palivové dřevo suché, zda lze stěnu malovat nebo kde se ve zdi drží vlhkost. Modely s externí sondou dosáhnou i do hloubky materiálu.',
    'Tester kvality vody ukáže hodnoty TDS, vodivost, salinitu a teplotu, pH metr kyselost vody v bazénu, akváriu nebo na zahradě. Pro přesné výsledky je dobré přístroj občas kalibrovat.']
  },
  '/proudeni-vzduchu/':{
   intro:'Digitální anemometry pro měření rychlosti a průtoku vzduchu – u větrání, klimatizace i venku.',
   title:'Proudění vzduchu',
   about:['Anemometr měří rychlost proudění vzduchu pomocí vrtulky, modely s výpočtem průtoku ukážou i množství vzduchu, které projde potrubím nebo vyústkou. Využijete jej při seřizování rekuperace, klimatizace a ventilátorů.',
    'Anemometr s oddělenou sondou dosáhne i do míst, kam se s celým přístrojem nevejdete; většina modelů měří současně teplotu vzduchu.']
  },
  '/mikroskopy/':{
   intro:'Digitální mikroskopy s displejem nebo připojením k počítači pro kontrolu pájení, drobných detailů a výuku.',
   title:'Digitální mikroskopy',
   about:['Digitální mikroskop zvětší drobné detaily a obraz zobrazí na vlastním displeji nebo v počítači, kde jej můžete vyfotit či nahrát. Hodí se pro kontrolu pájených spojů, opravy elektroniky, sběratelství i do školy.',
    'Při výběru sledujte rozsah zvětšení, osvětlení LED a způsob zobrazení – model s displejem je samostatný, USB mikroskop využije obrazovku počítače.']
  },
  '/endoskopy-a-inspekcni-kamery/':{
   intro:'Endoskopy a inspekční kamery pro pohled do míst bez přístupu – do potrubí, motoru, stěny nebo dutin.',
   title:'Endoskopy a inspekční kamery',
   about:['Inspekční kamera na ohebném kabelu ukáže, co se skrývá v odpadu, v motoru, za sádrokartonem nebo ve ventilaci, bez nutnosti cokoli rozebírat. Kamera má na konci LED přisvícení, takže vidí i ve tmě.',
    'Nabízíme endoskopy s vlastním displejem, které jsou ihned připravené k použití, i modely připojitelné k telefonu přes Wi-Fi nebo USB. Při výběru sledujte průměr sondy, délku kabelu a případně druhý boční objektiv pro pohled do stran.']
  },
  '/endoskopy-s-displejem/':{
   intro:'Endoskopy s vlastním displejem fungují samostatně, bez telefonu – zapnete a hned vidíte obraz.',
   title:'Endoskopy s displejem',
   about:['Endoskop s displejem má obrazovku přímo v rukojeti, takže nezávisí na telefonu ani aplikaci. Hodí se pro řemeslníky, autoservisy a všude tam, kde je potřeba rychle nahlédnout do potrubí, motoru nebo stěny.',
    'Některé modely mají dva objektivy – přední a boční – takže uvidíte i na stěny potrubí.']
  },
  '/wi-fi-a-usb-endoskopy/':{
   intro:'Wi-Fi a USB endoskopy přenášejí obraz do telefonu, tabletu nebo počítače – kompaktní a snadno přenosné.',
   title:'Wi-Fi a USB endoskopy',
   about:['Tyto endoskopy nemají vlastní displej, obraz zobrazí v aplikaci v telefonu nebo v počítači. Díky tomu jsou lehké a skladné a obraz můžete rovnou uložit nebo poslat.',
    'Wi-Fi model se k telefonu připojí bezdrátově přes aplikaci, USB model se zapojí kabelem. Tenká sonda se hodí do úzkých otvorů a odpadů.']
  },
  '/prakticke-vychytavky/':{
   intro:'Praktické vychytávky, které usnadní běžné úkoly doma, v kanceláři i na cestách – od kapesní tiskárny po bezdrátový přenos obrazu.',
   title:'Praktické vychytávky',
   about:['V této kategorii jsou drobnosti, které ušetří čas: kapesní termotiskárna vytiskne štítky, poznámky nebo seznamy přímo z telefonu bez inkoustu, bezdrátový HDMI adaptér přenese obraz z telefonu či notebooku na televizi nebo projektor.',
    'Vybíráme zařízení, která jsou malá, snadno se ovládají a skutečně se v praxi používají.']
  },
  '/tisk-a-stitky/':{
   intro:'Kapesní termotiskárny pro tisk štítků, poznámek a seznamů přímo z telefonu – bez inkoustu a tonerů.',
   title:'Tisk a štítky',
   about:['Termotiskárna tiskne teplem na speciální papír, takže nepotřebuje inkoust ani toner. Připojí se k telefonu přes Bluetooth a tiskne z aplikace štítky na krabice, poznámky, seznamy nebo jednoduché obrázky.',
    'Je malá a lehká, proto ji využijete doma, v kanceláři, ve škole i při organizaci skladu.']
  },
  '/usb-rozbocovace-a-adaptery/':{
   intro:'USB rozbočovače a adaptéry rozšíří počet portů a propojí zařízení s různými konektory.',
   title:'USB rozbočovače a adaptéry',
   about:['Rozbočovač přidá k notebooku nebo tabletu další porty USB, HDMI či čtečku karet, adaptér propojí zařízení s rozdílnými konektory, například USB-C a USB-A.',
    'Při výběru sledujte rychlost přenosu dat, podporu nabíjení a výstup obrazu.']
  },
  '/auto-diagnostika/':{
   intro:'Přístroje pro diagnostiku a kontrolu auta a motocyklu – pro kutily i servis.',
   title:'Auto diagnostika',
   about:['Diagnostické přístroje pomohou odhalit závadu dřív, než se z ní stane drahá oprava: tester komprese prověří stav válců, tloušťkoměr laku odhalí přelakované díly a inspekční kamera nahlédne do motoru.',
    'Hodí se při kontrole ojetého vozu před koupí i při běžné údržbě v garáži.']
  },
  '/designove-gadgety/':{
   intro:'Designové gadgety, které ozdobí stůl a zároveň něco umí – pixelové displeje, hodiny a další chytré doplňky.',
   title:'Designové gadgety',
   about:['Designový gadget je předmět, který zaujme vzhledem a přitom má praktickou funkci. Pixelový displej ukazuje čas, animace i oznámení z telefonu a slouží jako budík, stylové hodiny doplní pracovní stůl nebo herní koutek.',
    'Jsou to také oblíbené dárky pro technické nadšence.']
  },
  '/pixelove-displeje-a-hodiny/':{
   intro:'Pixelové displeje a stolní hodiny s retro vzhledem – čas, animace a vlastní obrázky na stole.',
   title:'Pixelové displeje a hodiny',
   about:['Pixelový displej skládá obraz z barevných bodů jako staré počítačové hry. Zobrazuje hodiny, budík, animace i vlastní obrázky a nastavuje se z aplikace v telefonu.',
    'Hodí se na pracovní stůl, do herního koutku i jako dárek.']
  },
  '/projektory-a-obraz/':{
   intro:'Projektory a příslušenství pro obraz – velký obraz doma i bezdrátový přenos z telefonu nebo notebooku na televizi.',
   title:'Projektory a přenos obrazu',
   about:['Projektor promítne film nebo prezentaci na stěnu, bezdrátový HDMI adaptér přenese obraz z telefonu, tabletu či notebooku na televizi nebo projektor bez kabelu přes celou místnost.',
    'Při výběru sledujte rozlišení, jas a způsob připojení zdroje.']
  },
  '/bezdratovy-prenos-obrazu/':{
   intro:'Bezdrátové HDMI adaptéry pro přenos obrazu z telefonu nebo notebooku na televizi či projektor.',
   title:'Bezdrátový přenos obrazu',
   about:['Bezdrátový HDMI adaptér zapojíte do televize nebo projektoru a obraz z telefonu, tabletu či notebooku na něj pošlete bez kabelu. Využijete ho pro prezentace, sdílení fotek nebo sledování videa na velké obrazovce.',
    'Při výběru zkontrolujte kompatibilitu s vaším telefonem a podporované rozlišení.']
  },
  '/prislusenstvi/':{
   intro:'Příslušenství k elektronice z naší nabídky – spotřební materiál, moduly, adaptéry, baterie a napájení.',
   title:'Příslušenství',
   about:['V příslušenství najdete věci, které k elektronice a měřicím přístrojům doplníte: spotřební materiál, rozšiřující moduly a adaptéry i baterie a zdroje napájení.',
    'Před nákupem si ověřte kompatibilitu s vaším zařízením – typ konektoru, napětí nebo rozměr.']
  },
  '/spotrebni-material/':{
   intro:'Spotřební materiál k elektronice a přístrojům – věci, které se při používání postupně spotřebovávají.',
   title:'Spotřební materiál',
   about:['Spotřební materiál zajistí, že vaše zařízení zůstane v provozu – například papír do termotiskáren, náhradní hroty nebo další drobnosti potřebné při běžném používání.',
    'Před nákupem si ověřte, že materiál odpovídá typu vašeho zařízení.']
  },
  '/moduly-a-adaptery/':{
   intro:'Rozšiřující moduly a adaptéry k vývojovým deskám a elektronice.',
   title:'Moduly a adaptéry',
   about:['Moduly rozšiřují vývojové desky a multitooly o další funkce, například bezdrátovou komunikaci nebo nové konektory, adaptéry propojí zařízení s rozdílnými rozhraními.',
    'U každého modulu zkontrolujte napájecí napětí a způsob připojení k vaší desce.']
  },
  '/baterie-a-napajeni/':{
   intro:'Baterie, akumulátory a zdroje napájení pro elektroniku a přístroje.',
   title:'Baterie a napájení',
   about:['Správné napájení prodlouží život zařízení. V této kategorii jsou baterie, akumulátory a zdroje pro přenosnou elektroniku a měřicí přístroje.',
    'Při výběru sledujte typ článku, napětí, kapacitu a konektor.']
  }
 };
 function lang(){var l=(document.documentElement.getAttribute('lang')||'cs').toLowerCase();try{var o=localStorage.getItem('okla-lang');if(o)l=o}catch(e){}return l}
 function run(){
  if(!document.body.classList.contains('type-category'))return true;
  var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';
  var t=T[p];if(!t||!/^cs/.test(lang()))return true;
  var h1=document.querySelector('#content h1');if(!h1)return false;
  var perex=document.querySelector('#content .category-perex');
  var hasOwn=perex&&(perex.textContent||'').replace(/\s+/g,'').length>20;
  if(!hasOwn&&!document.querySelector('.okla-cat-intro')){
   var intro=document.createElement('p');intro.className='okla-cat-intro';intro.textContent=t.intro;
   var top=h1.closest('.category-top')||h1.parentNode;top.insertBefore(intro,h1.nextSibling);
  }
  if(!document.querySelector('.okla-cat-about')){
   var anchor=document.querySelector('#content .listingControls')||document.querySelector('#content .pagination-wrapper')||document.querySelector('#content #products')||document.querySelector('#content .products-block');
   if(!anchor)return false;
   var sec=document.createElement('section');sec.className='okla-cat-about';
   var h=document.createElement('h2');h.textContent=t.title;sec.appendChild(h);
   t.about.forEach(function(par){var el=document.createElement('p');el.textContent=par;sec.appendChild(el)});
   anchor.parentNode.insertBefore(sec,anchor.nextSibling);
  }
  return true;
 }
 var tries=0;(function tick(){if(run()||++tries>30)return;setTimeout(tick,150)})();
})();
