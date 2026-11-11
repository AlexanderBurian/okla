/* OKLA – "Doporučujeme přidat k nákupu": one unified cross-sell panel on chosen
   product pages (29 of 45, see MAP). Each row has a "přidat"
   checkbox (like Alza): ticking it adds the companion product to the cart,
   unticking removes it again — both through Shoptet's own cart actions. A live
   footer sums what is selected. Products are real items the shop sells. */
(function(){
 'use strict';
 if(window.__oklaCrossSellV2)return;window.__oklaCrossSellV2=true;

 var IMG='https://cdn.myshoptet.com/usr/www.okla.cz/user/shop/related/';
 function P(f,ts){return IMG+f+'?ff=1&x=100&y=100&q=85&ts='+ts+'&sg=8dda0505'}

 /* Companion products (pid/priceId/price/image from the live product pages). */
 var WAVESHARE={pid:'274',prc:'277',name:'Waveshare ESP32-C3 s displejem',note:'Malá Wi-Fi/BLE deska navíc',price:789,href:'/waveshare-esp32-c3-s-0-71-kulatym-displejem/',img:P('274-6_waveshare-esp32-c3-s-0-71--kulatym-displejem---pohled-1.jpg','6af04775')};
 var LAFVIN={pid:'268',prc:'271',name:'LAFVIN ESP32-S3 Super Starter Kit',note:'Nepájivé pole a součástky pro vlastní projekty',price:1489,href:'/lafvin-esp32-s3-wroom-super-starter-kit/',img:P('268-5_lafvin-esp32-s3-wroom-super-starter-kit---pohled-1.jpg','6af04775')};
 var CARDPUTER={pid:'52',prc:'55',name:'M5Stack Cardputer ADV',note:'Programovatelný mini počítač do kapsy',price:990,href:'/m5stack-cardputer-adv-programovatelny-mini-pocitac/',img:P('52-1_m5stack-cardputer-adv---mini-pocitac-s-klavesnici---pohled-1.jpg','6af04774')};
 var TDISPLAY={pid:'271',prc:'274',name:'LILYGO T-Display S3 AMOLED',note:'Barevný AMOLED displej pro projekty',price:2389,href:'/lilygo-t-display-s3-amoled/',img:P('271-5_lilygo-t-display-s3-amoled---pohled-1.jpg','6af04775')};
 var MULTIMETR={pid:'175',prc:'178',name:'ANENG 616 digitální multimetr',note:'Napětí, proud a odpor při stavbě i opravách',price:589,href:'/aneng-616-digitalni-multimetr-6000-counts/',img:P('175-3_aneng-616-digitalni-multimetr-6000-counts---pohled-1.jpg','6af04772')};
 var PINZETA={pid:'169',prc:'172',name:'ANENG GN702 LCR pinzeta',note:'Rychlé měření SMD součástek',price:1089,href:'/aneng-gn702-lcr-merici-pinzeta/',img:P('169_aneng-gn702-lcr-merici-pinzeta---pohled-1.jpg','6af04771')};
 var IRTEPLOMER={pid:'172',prc:'175',name:'ANENG TH06 IR teploměr',note:'Bezkontaktní měření teploty povrchu',price:589,href:'/aneng-th06-bezkontaktni-ir-teplomer/',img:P('172-2_aneng-th06-bezkontaktni-ir-teplomer---pohled-1.jpg','6af04772')};
 var SROUBOVAK={pid:'235',prc:'238',name:'Elektrický přesný šroubovák 32v1',note:'Rozebrání elektroniky bez námahy',price:489,href:'/elektricky-presny-sroubovak-32v1-sedy/',img:P('235_elektricky-presny-sroubovak-32v1---sedy---pohled-1.jpg','6af04772')};
 var MIKROSKOP={pid:'208',prc:'211',name:'USB digitální mikroskop 50–1000×',note:'Kontrola pájení a drobných detailů',price:589,href:'/usb-digitalni-mikroskop-50-1000/',img:P('208_usb-digitalni-mikroskop-50-1000---pohled-1.jpg','6af04772')};
 var KOMPRESE={pid:'163',prc:'166',name:'Tester komprese motoru',note:'Stav válců u auta a motocyklu',price:389,href:'/tester-komprese-motoru-pro-auto-a-motocykl/',img:P('163_tester-komprese-motoru-pro-auto-a-motocykl---pohled-1.jpg','6af04771')};
 var ENDOSKOP={pid:'181',prc:'184',name:'B313 inspekční kamera 5 m',note:'Pohled do válců a míst bez přístupu',price:1289,href:'/b313-inspekcni-kamera-se-dvema-objektivy-5-m/',img:P('181_b313-inspekcni-kamera-se-dvema-objektivy-5-m---pohled-1.jpg','6af04772')};
 var TLOUSTKOMER={pid:'244',prc:'247',name:'Benetech GM200A tloušťkoměr laku',note:'Odhalí přelakované díly karoserie',price:489,href:'/benetech-gm200a-tloustkomer-laku/',img:P('244_benetech-gm200a-tloustkomer-laku---pohled-1.jpg','6af04774')};
 var VLHKOMER={pid:'256',prc:'259',name:'Benetech GM605 vlhkoměr',note:'Vlhkost dřeva a stavebních materiálů',price:389,href:'/benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu/',img:P('256-4_benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu---pohled-1.jpg','6af04771')};
 var TERMOKAMERA={pid:'220',prc:'223',name:'RX-350 termokamera',note:'Tepelné mosty a úniky tepla na první pohled',price:3989,href:'/rx-350-termokamera-320-240-px/',img:P('220_rx-350-termokamera-320--240-px---pohled-1.jpg','6af04771')};
 var DALKOMER={pid:'166',prc:'169',name:'ANENG B60 laserový dálkoměr',note:'Rychlé zaměření místností do 60 m',price:889,href:'/aneng-b60-laserovy-dalkomer-60-m/',img:P('166-3_aneng-b60-laserovy-dalkomer-60-m---pohled-1.jpg','6af04771')};
 var HLUKOMER={pid:'247',prc:'250',name:'Benetech GM1351 hlukoměr',note:'Hladina hluku v dB',price:389,href:'/benetech-gm1351-digitalni-hlukomer/',img:P('247-6_benetech-gm1351-digitalni-hlukomer---pohled-1.jpg','6af04774')};
 var LUXMETR={pid:'250',prc:'253',name:'Benetech GM1010 luxmetr',note:'Intenzita osvětlení pracoviště',price:389,href:'/benetech-gm1010-digitalni-luxmetr/',img:P('250-5_benetech-gm1010-digitalni-luxmetr---pohled-1.jpg','6af04771')};
 var TESTERVODY={pid:'193',prc:'196',name:'MF-X41 tester kvality vody 4v1',note:'TDS, EC, salinita a teplota vody',price:589,href:'/mf-x41-tester-kvality-vody-4v1/',img:P('193_mf-x41-tester-kvality-vody-4v1---pohled-1.jpg','6af04771')};
 var PHMETR={pid:'202',prc:'205',name:'PH-04L digitální pH metr',note:'Kyselost vody, bazénu i akvária',price:290,href:'/ph-04l-digitalni-ph-metr/',img:P('202_ph-04l-digitalni-ph-metr---pohled-1.jpg','6af04771')};
 var SLUCHATKA={pid:'232',prc:'235',name:'A18 překladová sluchátka',note:'Překlad rozhovoru přímo do uší',price:589,href:'/a18-prekladova-bluetooth-sluchatka/',img:P('232_a18-prekladova-bluetooth-sluchatka---pohled-1.jpg','6af04772')};
 var DIKTAFON={pid:'229',prc:'232',name:'Q61A AI diktafon s přepisem',note:'Nahrávání a přepis schůzek',price:1189,href:'/q61a-ai-diktafon-s-prepisem-8-gb/',img:P('229-3_q61a-ai-diktafon-s-prepisem---8-gb---pohled-1.jpg','6af04771')};
 var BRYLE={pid:'238',prc:'241',name:'F62 překladové chytré brýle',note:'Hudba, hovory a překlad v brýlích',price:589,href:'/f62-prekladove-chytre-bryle-cerne/',img:P('238_f62-prekladove-chytre-bryle---cerne---pohled-1.jpg','6af04772')};

 /* Only pairings that make sense together: electronics bench, car check-up,
    building diagnostics, workplace measurement, water quality, travel/AI. */
 var MAP={
  '/flipper-zero-kapesni-multitool-pro-elektroniku/':[WAVESHARE,LAFVIN,CARDPUTER],
  '/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/':[LAFVIN,WAVESHARE,TDISPLAY],
  '/lilygo-t-deck-plus-kapesni-esp32-komunikator/':[CARDPUTER,TDISPLAY,WAVESHARE],
  '/m5stack-cardputer-adv-programovatelny-mini-pocitac/':[LAFVIN,WAVESHARE,TDISPLAY],
  '/lafvin-esp32-s3-wroom-super-starter-kit/':[MULTIMETR,TDISPLAY,WAVESHARE],
  '/lilygo-t-display-s3-amoled/':[LAFVIN,MULTIMETR,WAVESHARE],
  '/waveshare-esp32-c3-s-0-71-kulatym-displejem/':[LAFVIN,TDISPLAY,MULTIMETR],
  '/aneng-616-digitalni-multimetr-6000-counts/':[PINZETA,IRTEPLOMER,SROUBOVAK],
  '/aneng-gn702-lcr-merici-pinzeta/':[MULTIMETR,MIKROSKOP,SROUBOVAK],
  '/aneng-aos03-osciloskopicky-multimetr/':[PINZETA,MIKROSKOP,SROUBOVAK],
  '/usb-digitalni-mikroskop-50-1000/':[PINZETA,SROUBOVAK,MULTIMETR],
  '/elektricky-presny-sroubovak-32v1-sedy/':[MIKROSKOP,MULTIMETR,PINZETA],
  '/tester-komprese-motoru-pro-auto-a-motocykl/':[ENDOSKOP,IRTEPLOMER,MULTIMETR],
  '/b313-inspekcni-kamera-se-dvema-objektivy-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/p80-prumyslovy-endoskop-4-3-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/f220-wi-fi-endoskop-5-5-mm-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/nk-5001-pro-3v1-endoskop-5-5-mm/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/benetech-gm200a-tloustkomer-laku/':[ENDOSKOP,KOMPRESE,MULTIMETR],
  '/rx-350-termokamera-320-240-px/':[VLHKOMER,IRTEPLOMER,DALKOMER],
  '/benetech-gm620-vlhkomer-s-externi-sondou/':[TERMOKAMERA,IRTEPLOMER,DALKOMER],
  '/benetech-gm1351-digitalni-hlukomer/':[LUXMETR,IRTEPLOMER],
  '/tasi-ta8151-digitalni-hlukomer/':[LUXMETR,IRTEPLOMER],
  '/benetech-gm1010-digitalni-luxmetr/':[HLUKOMER,IRTEPLOMER],
  '/mf-x41-tester-kvality-vody-4v1/':[PHMETR,IRTEPLOMER],
  '/ph-04l-digitalni-ph-metr/':[TESTERVODY,IRTEPLOMER],
  '/a2-chytre-bryle-s-kamerou-a-ai-prekladem/':[SLUCHATKA,DIKTAFON],
  '/f62-prekladove-chytre-bryle-cerne/':[SLUCHATKA,DIKTAFON],
  '/a18-prekladova-bluetooth-sluchatka/':[DIKTAFON,BRYLE],
  '/q61a-ai-diktafon-s-prepisem-8-gb/':[SLUCHATKA,BRYLE]
 };
 function items(){var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';return MAP[p]||null}

 function csrf(){try{return (window.shoptet&&shoptet.csrf&&shoptet.csrf.token)||''}catch(e){return ''}}
 function fmt(n){try{return n.toLocaleString('cs-CZ')+' Kč'}catch(e){return n+' Kč'}}
 function refreshCart(){try{if(window.shoptet&&shoptet.cart&&shoptet.cart.getCartContent)shoptet.cart.getCartContent()}catch(e){}}

 /* The large product price, desktop sticky price and mobile buy-bar price all
    represent the total purchase triggered by the main CTA. Keep that total in
    step with the successfully selected companion products. */
 var mainPrice=null;
 function numberFromPrice(text){
  var digits=String(text||'').replace(/[^0-9]/g,'');
  return digits?parseInt(digits,10):0;
 }
 function priceView(){
  if(mainPrice&&mainPrice.target&&document.documentElement.contains(mainPrice.target))return mainPrice;
  var root=document.querySelector('#product-detail-form .p-final-price-wrapper .price-final')||document.querySelector('.p-info-wrapper .p-final-price-wrapper .price-final')||document.querySelector('.p-info-wrapper .price-final');
  if(!root)return null;
  var target=root.querySelector('.price-final-holder')||root.querySelector('strong')||root;
  var original=(target.textContent||'').replace(/\s+/g,' ').trim();
  var base=numberFromPrice(original);
  if(!base)return null;
  mainPrice={root:root,target:target,base:base,usesCrown:/Kč/i.test(original)};
  return mainPrice;
 }
 function mainFmt(view,n){
  var amount;try{amount=n.toLocaleString('cs-CZ')}catch(e){amount=String(n)}
  return amount+(view.usesCrown?' Kč':',-');
 }
 function updateTotal(sec,list){
  var view=priceView();if(!view)return;
  var extra=0,selected=0;
  list.forEach(function(it,i){
   var row=sec.querySelector('.okla-xsell__item[data-i="'+i+'"]');
   if(row&&row.classList.contains('is-added')){extra+=it.price;selected++;}
  });
  var total=view.base+extra,formatted=mainFmt(view,total);
  if((view.target.textContent||'').trim()!==formatted)view.target.textContent=formatted;
  document.querySelectorAll('.okla-m-buybar__price,.okla-dbb__price').forEach(function(el){el.textContent=formatted});
  try{window.dispatchEvent(new CustomEvent('okla:xsell-total',{detail:{base:view.base,extra:extra,total:total,selected:selected,formatted:formatted}}))}catch(e){}
 }

 function addToCart(it){
  var b=new URLSearchParams();
  b.set('productId',it.pid);b.set('priceId',it.prc);b.set('amount','1');b.set('language','cs');
  var t=csrf();if(t)b.set('__csrf__',t);
  /* Tell the cart drawer to stay closed for this add (silent); cleared shortly after. */
  window.__oklaXsellAdding=true;
  var release=function(){setTimeout(function(){window.__oklaXsellAdding=false},400)};
  return fetch('/action/Cart/addCartItem/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json'},body:b.toString(),credentials:'same-origin'})
   .then(function(r){return r.json()}).then(function(j){release();if(!j||j.code!==200)throw new Error('add failed');return j},function(e){release();throw e});
 }
 function itemIdFor(href){
  return fetch('/kosik/',{cache:'no-store'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');var found=null;
   doc.querySelectorAll('input[name="itemId"]').forEach(function(inp){
    if(found)return;var row=inp.closest('tr')||inp.parentElement;
    if(row&&row.querySelector('a[href*="'+href+'"]'))found=inp.value;
   });
   return found;
  });
 }
 function removeFromCart(it){
  return itemIdFor(it.href).then(function(id){
   if(!id)return null;
   var b=new URLSearchParams();b.set('itemId',id);var t=csrf();if(t)b.set('__csrf__',t);
   return fetch('/action/Cart/deleteCartItem/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json'},body:b.toString(),credentials:'same-origin'}).then(function(r){return r.json()});
  });
 }

 var CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
 var INFO='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/></svg>';

 function rowHtml(it,i){
  return '<div class="okla-xsell__item" data-i="'+i+'" role="button" tabindex="0" aria-pressed="false">'+
   '<span class="okla-xsell__check" aria-hidden="true">'+CHECK+'</span>'+
   '<a class="okla-xsell__thumb" href="'+it.href+'" tabindex="-1"><img src="'+it.img+'" alt="" loading="lazy" onerror="this.parentNode.style.visibility=\'hidden\'"></a>'+
   '<span class="okla-xsell__info">'+
     '<span class="okla-xsell__name">'+it.name+'</span>'+
     '<span class="okla-xsell__note">'+it.note+'</span>'+
     '<span class="okla-xsell__state">Přidáno do košíku</span>'+
   '</span>'+
   '<a class="okla-xsell__detail" href="'+it.href+'" aria-label="Zobrazit produkt '+it.name+'" tabindex="-1">'+INFO+'</a>'+
   '<span class="okla-xsell__price">'+fmt(it.price)+'</span>'+
  '</div>';
 }

 function build(list){
  var sec=document.createElement('section');
  sec.className='okla-xsell';
  sec.setAttribute('aria-label','Doporučujeme přidat k nákupu');
  sec.innerHTML=
   '<div class="okla-xsell__head"><h2 class="okla-xsell__title">Doporučujeme přidat k nákupu</h2>'+
   '<p class="okla-xsell__sub">Zaškrtněte, co chcete přidat do košíku spolu s tímto produktem.</p></div>'+
   '<div class="okla-xsell__list">'+list.map(rowHtml).join('')+'</div>';
  return sec;
 }

 function wire(sec,list){
  /* The cart drawer uses only successfully added rows. The actual cart remains
     authoritative (every checkbox still calls Shoptet's add/remove endpoint),
     while this small read-only bridge lets the popup display the same items. */
  window.__oklaXsellSelected=function(){
   return list.map(function(it,i){
    var row=sec.querySelector('.okla-xsell__item[data-i="'+i+'"]');
    if(!row||!row.classList.contains('is-added'))return null;
    return {name:it.name,image:it.img,price:it.price,href:it.href,amount:1};
   }).filter(Boolean);
  };
  function toggle(row){
   if(row.classList.contains('is-busy'))return;
   var it=list[+row.getAttribute('data-i')];
   var adding=!row.classList.contains('is-added');
   row.classList.add('is-busy');
   var done=function(ok){
    row.classList.remove('is-busy');
    if(ok){row.classList.toggle('is-added',adding);row.setAttribute('aria-pressed',String(adding));updateTotal(sec,list);refreshCart();}
   };
   (adding?addToCart(it):removeFromCart(it)).then(function(){done(true)}).catch(function(){done(false);});
  }
  Array.prototype.forEach.call(sec.querySelectorAll('.okla-xsell__item'),function(row){
   row.addEventListener('click',function(e){if(e.target.closest('a'))return;toggle(row);});
   row.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle(row);}});
  });
  updateTotal(sec,list);
 }

 function mount(){
  var list=items();
  if(!list){window.__oklaXsellSelected=null;return true;}
  if(document.querySelector('.okla-xsell'))return true;
  var host=document.querySelector('#content .p-detail .p-info-wrapper');
  if(!host)return false;
  var sec=build(list);
  var anchor=host.querySelector('.social-buttons-wrapper');
  if(anchor)host.insertBefore(sec,anchor);else host.appendChild(sec);
  wire(sec,list);
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
