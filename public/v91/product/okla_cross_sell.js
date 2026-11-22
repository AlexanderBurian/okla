/* Okla – "Doporučujeme přidat k nákupu": one unified cross-sell panel on chosen
   product pages (see MAP). Each row has a "přidat"
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
 var SROUBOVAK={pid:'407',prc:'410',name:'QST EXPRESS posuvné měřítko 150 mm',note:'Přesné změření součástek, šroubů a dílů',price:189,href:'/qst-express-digitalni-posuvne-meritko-150-mm-z-kompozitu-s-uhlikovymi-vlakny/',img:''};
 var MIKROSKOP={pid:'208',prc:'211',name:'USB digitální mikroskop 50–1000×',note:'Kontrola pájení a drobných detailů',price:589,href:'/usb-digitalni-mikroskop-50-1000/',img:P('208_usb-digitalni-mikroskop-50-1000---pohled-1.jpg','6af04772')};
 var KOMPRESE={pid:'392',prc:'395',name:'Kingbolen Ediag OBD2 diagnostika',note:'Chybové kódy a diagnostika auta v telefonu',price:3789,href:'/kingbolen-ediag-bluetooth-obd2-diagnostika-pro-android-a-ios/',img:''};
 var ENDOSKOP={pid:'181',prc:'184',name:'B313 inspekční kamera 5 m',note:'Pohled do válců a míst bez přístupu',price:1289,href:'/b313-inspekcni-kamera-se-dvema-objektivy-5-m/',img:P('181_b313-inspekcni-kamera-se-dvema-objektivy-5-m---pohled-1.jpg','6af04772')};
 var TLOUSTKOMER={pid:'244',prc:'247',name:'Benetech GM200A tloušťkoměr laku',note:'Odhalí přelakované díly karoserie',price:489,href:'/benetech-gm200a-tloustkomer-laku/',img:P('244_benetech-gm200a-tloustkomer-laku---pohled-1.jpg','6af04774')};
 var VLHKOMER={pid:'256',prc:'259',name:'Benetech GM605 vlhkoměr',note:'Vlhkost dřeva a stavebních materiálů',price:389,href:'/benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu/',img:P('256-4_benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu---pohled-1.jpg','6af04771')};
 var TERMOKAMERA={pid:'389',prc:'392',name:'ANENG TH104 IR teploměr',note:'Teplota povrchů s barevným displejem',price:489,href:'/aneng-th104-bezkontaktni-infracerveny-teplomer-s-barevnym-displejem-50-az-550-c/',img:''};
 var DALKOMER={pid:'166',prc:'169',name:'ANENG B60 laserový dálkoměr',note:'Rychlé zaměření místností do 60 m',price:889,href:'/aneng-b60-laserovy-dalkomer-60-m/',img:P('166-3_aneng-b60-laserovy-dalkomer-60-m---pohled-1.jpg','6af04771')};
 var HLUKOMER={pid:'247',prc:'250',name:'Benetech GM1351 hlukoměr',note:'Hladina hluku v dB',price:389,href:'/benetech-gm1351-digitalni-hlukomer/',img:P('247-6_benetech-gm1351-digitalni-hlukomer---pohled-1.jpg','6af04774')};
 var LUXMETR={pid:'250',prc:'253',name:'Benetech GM1010 luxmetr',note:'Intenzita osvětlení pracoviště',price:389,href:'/benetech-gm1010-digitalni-luxmetr/',img:P('250-5_benetech-gm1010-digitalni-luxmetr---pohled-1.jpg','6af04771')};
 var TESTERVODY={pid:'193',prc:'196',name:'MF-X41 tester kvality vody 4v1',note:'TDS, EC, salinita a teplota vody',price:589,href:'/mf-x41-tester-kvality-vody-4v1/',img:P('193_mf-x41-tester-kvality-vody-4v1---pohled-1.jpg','6af04771')};
 var PHMETR={pid:'202',prc:'205',name:'PH-04L digitální pH metr',note:'Kyselost vody, bazénu i akvária',price:290,href:'/ph-04l-digitalni-ph-metr/',img:P('202_ph-04l-digitalni-ph-metr---pohled-1.jpg','6af04771')};
 var SLUCHATKA={pid:'226',prc:'229',name:'A2 chytré brýle s kamerou a AI překladem',note:'Překlad a kamera přímo v brýlích',price:2089,href:'/a2-chytre-bryle-s-kamerou-a-ai-prekladem/',img:''};
 var DIKTAFON={pid:'205',prc:'208',name:'X18 kapesní termotiskárna',note:'Tisk poznámek a štítků z telefonu',price:389,href:'/x18-kapesni-termotiskarna-bila/',img:''};
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
  '/b313-inspekcni-kamera-se-dvema-objektivy-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/p80-prumyslovy-endoskop-4-3-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/f220-wi-fi-endoskop-5-5-mm-5-m/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/nk-5001-pro-3v1-endoskop-5-5-mm/':[KOMPRESE,TLOUSTKOMER,IRTEPLOMER],
  '/benetech-gm200a-tloustkomer-laku/':[ENDOSKOP,KOMPRESE,MULTIMETR],
  '/benetech-gm620-vlhkomer-s-externi-sondou/':[TERMOKAMERA,IRTEPLOMER,DALKOMER],
  '/benetech-gm1351-digitalni-hlukomer/':[LUXMETR,IRTEPLOMER],
  '/tasi-ta8151-digitalni-hlukomer/':[LUXMETR,IRTEPLOMER],
  '/benetech-gm1010-digitalni-luxmetr/':[HLUKOMER,IRTEPLOMER],
  '/mf-x41-tester-kvality-vody-4v1/':[PHMETR,IRTEPLOMER],
  '/ph-04l-digitalni-ph-metr/':[TESTERVODY,IRTEPLOMER],
  '/a2-chytre-bryle-s-kamerou-a-ai-prekladem/':[BRYLE,DIKTAFON],
  '/f62-prekladove-chytre-bryle-cerne/':[SLUCHATKA,DIKTAFON]
 };
 function here(){var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';return p}
 function items(){return MAP[here()]||null}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return ''}}
 /* The companions are checked against the shop's current products (okla_live_catalog.js): a product the shop no longer
    has is left out, the others take the current price, picture and cart ids, and the panel is filled up to three with
    products in stock from the same category. Only products that can be added straight away (no variants) are offered. */
 function current(list){
  var live=window.oklaLiveCatalog;
  if(!live||!live.ready)return Promise.resolve(null);
  return live.ready.then(function(){
   var cat=window.OKLA_V86_CATALOG||{},byPath={},me=null;
   Object.keys(cat).forEach(function(k){var p=cat[k];if(!p||!p.url)return;var u=pathOf(p.url);byPath[u]=p;if(u===here())me=p});
   var usable=function(p){return p&&p.live&&p.pid&&p.prc&&p.price&&p.available!==false};
   var out=[],seen={};seen[here()]=1;
   (list||[]).forEach(function(it){
    var p=byPath[it.href];if(!usable(p)||seen[it.href])return;seen[it.href]=1;
    out.push({pid:p.pid,prc:p.prc,name:it.name,note:it.note,price:p.price,href:it.href,img:p.image||it.img});
   });
   if(out.length<3&&me&&me.defaultCategory){
    Object.keys(byPath).forEach(function(u){
     var p=byPath[u];if(out.length>=3||seen[u]||!usable(p)||p.defaultCategory!==me.defaultCategory)return;seen[u]=1;
     var note=String(p.shortDescription||'').replace(/\s+/g,' ').trim();if(note.length>60)note=note.slice(0,57).replace(/\s+\S*$/,'')+'…';
     out.push({pid:p.pid,prc:p.prc,name:p.name,note:note||p.defaultCategory,price:p.price,href:u,img:p.image});
    });
   }
   return out.length?out:null;
  },function(){return null});
 }

 function csrf(){try{return (window.shoptet&&shoptet.csrf&&shoptet.csrf.token)||''}catch(e){return ''}}
 function fmt(n){n=Math.round(n);try{return n.toLocaleString('cs-CZ')+' Kč'}catch(e){return n+' Kč'}}
 function refreshCart(){try{if(window.shoptet&&shoptet.cart&&shoptet.cart.getCartContent)shoptet.cart.getCartContent()}catch(e){}}

 /* The large product price, desktop sticky price and mobile buy-bar price all
    represent the total purchase triggered by the main CTA. Keep that total in
    step with the successfully selected companion products. */
 var mainPrice=null;
 /* "2 460,50 Kč" -> 2461: the whole amount with its haléře (reading digits only made 369,55 Kč into 36955), rounded
    to whole crowns, as Shoptet rounds them (CZK: 0 decimal places) */
 function numberFromPrice(text){
  var m=String(text||'').replace(/[\s  ]/g,'').match(/(\d+)(?:[.,](\d{1,2}))?/);
  return m?Math.round(Number(m[1]+'.'+(m[2]||'0'))):0;
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
   if(row&&row.classList.contains('is-added')){extra+=Math.round(it.price);selected++;}
  });
  var total=view.base+extra,formatted=mainFmt(view,total);
  /* the product's own price stays its price; only the buy bars (sticky / phone) show the total of the purchase, and
     the product price gets a small "(+N)" telling how many companion products are added */
  var baseText=mainFmt(view,view.base);
  if((view.target.textContent||'').trim()!==baseText)view.target.textContent=baseText;
  var plus=view.root.querySelector('.okla-xsell-plus');
  /* the count of companions is shown only in the added-to-cart panel, never at the product's price */
  if(plus)plus.remove();
  /* the buy bars keep the product's own price */
  document.querySelectorAll('.okla-m-buybar__price,.okla-dbb__price').forEach(function(el){
   var bp=el.querySelector('.okla-xsell-plus');if(bp)bp.remove();
   if(el.textContent!==baseText)el.textContent=baseText;
  });
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

 var checked=null;
 function mount(){
  var base=items();
  if(!base){window.__oklaXsellSelected=null;return true;}
  if(document.querySelector('.okla-xsell'))return true;
  var host=document.querySelector('#content .p-detail .p-info-wrapper');
  if(!host)return false;
  if(!checked){checked=current(base).then(function(list){checked.list=list;mount()});return true}
  if(checked.list===undefined)return true;
  var list=checked.list;
  if(!list){window.__oklaXsellSelected=null;return true;}
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
