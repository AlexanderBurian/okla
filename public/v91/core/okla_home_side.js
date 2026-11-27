/* Okla homepage side art: a phone on the left; on the right one of four products, picked at random on every page
   load (Flipper Zero with its Wi-Fi module, A2 glasses, ANENG AOS03 meter, P80 endoscope), each with its price on a
   price tag. They sit in the page margins beside the white card and touch its edges. Shown only when both margins are
   wide enough. The price comes from the product page (cached for the session), so it never goes stale. */
(function(){
 'use strict';
 if(window.__oklaHomeSideV1)return;
 window.__oklaHomeSideV1=true;

 var MIN_MARGIN=260;
 var MAX_WIDTH=420;
 var SIDE_GUTTER=24;
 var ART_TOP_OFFSET=60;
 var RIGHT_GAP=24;
 var HAND_BOTTOM=1.4544;
 /* Lowest visible point of the hand, in widths of the art (see okla_home_side.css). */

 function block(id,side,html){
  var d=document.createElement('div');
  d.id=id;
  d.className='okla-side-art okla-side-art--'+side;
  d.innerHTML=html;
  document.body.appendChild(d);
  return d;
 }

 /* Měřicí technika (the category and its subcategories): both margins are a blue stage with podiums (the right one
    mirrored), the best measuring instruments standing on them (pictures composed with their shadows and reflections),
    a short heading, a line and "Kup teď" on top, as on the big shops; the page under them a light blue-grey */
 var STAGE=null; /* the stage of this page (STAGES below), found by measurePage() */
 function stageFor(){
  if(!document.body||!/(^|\s)type-category(\s|$)/.test(document.body.className))return null;
  for(var i=0;i<STAGES.length;i++){var p=STAGES[i].path;
   if(location.pathname.indexOf(p)===0||document.querySelector('.breadcrumbs a[href*="'+p+'"],#navigation-breadcrumbs a[href*="'+p+'"]'))return STAGES[i]}
  return null;
 }
 function measurePage(){STAGE=stageFor();return !!STAGE}
 function podBlock(id,side,img,kicker,title,sub){
  var base=window.__oklaAssetBase||'',href=STAGE.path+'?order=bestseller';
  var d=block(id,side,
   '<div class="okla-side-pod">'+
   '<div class="okla-side-pod__text"><strong class="okla-side-pod__title">'+title+'</strong>'+
   '<span class="okla-side-pod__sub">'+sub+'</span>'+
   '<a class="okla-side-pod__btn" href="'+href+'">Kup teď</a></div>'+
   '<a class="okla-side-pod__pic" href="'+href+'" tabindex="-1" aria-hidden="true">'+
   '<img class="okla-side-pod__img" src="'+base+'v91/img/side/'+img+'" alt="" width="'+STAGE.w+'" height="'+STAGE.h+'" decoding="async"></a>'+
   '</div>');
  d.classList.add('okla-side-art--pod');return d;
 }
 /* the page's background is the picture's own backdrop: its colour at the picture's edge, row by row (941 x 1671 px),
    laid behind the page at the picture's place and scale - deep blue above, a light blue under it - so the stages are
    part of the background, with no edge anywhere */
 /* the stages: per category its pictures (941 x 1671 or 1024 x 1536 px, the right one mirrored), the picture's backdrop
    colour at its edge row by row, the row where the picture starts to show (its mask: 24 %), the page's colour under the
    stages (a light tint of the stage's own colour), dark text where white would not read, the texts */
 var STAGES=[
  {path:'/merici-technika-a-naradi/',img:['okla-measure-left.webp','okla-measure-right.webp'],w:941,h:1671,from:401,page:'#c8dcfd',
   bg:[[0,'#0055d1'],[84,'#015cd8'],[168,'#0160e2'],[252,'#0269e8'],[336,'#0770ec'],[420,'#0b77ef'],[504,'#117df3'],[588,'#1b88f8'],[672,'#2991f9'],[756,'#3c9efd'],[840,'#4ea9fc'],[924,'#62b3fe'],[1008,'#75bdfd'],[1092,'#88c5fc'],[1176,'#a3d3fe'],[1260,'#bddffd'],[1344,'#d5e9fe'],[1428,'#ebf2fd'],[1670,'#e6eefe']],
   text:[['Přesné měření pro dílnu i domov','Teploměry, vlhkoměry a testery'],['Změřte vzdálenost i vítr','Dálkoměry a anemometry']]},
  {path:'/elektronicke-multitooly/',img:['okla-multi-left.webp','okla-multi-right.webp'],w:1024,h:1536,from:369,page:'#f1d4ae',dark:true,
   bg:[[0,"#efa02b"],[64,"#f1a22f"],[128,"#f3a633"],[192,"#f2a836"],[256,"#f5ad3d"],[320,"#f7b142"],[384,"#f6b145"],[448,"#fab650"],[512,"#f9ba56"],[576,"#fbbf5f"],[640,"#fbc369"],[704,"#fbc772"],[768,"#fdcb7a"],[832,"#fdd086"],[896,"#fdd492"],[960,"#fdda9d"],[1024,"#fedca3"],[1088,"#fee1b0"],[1152,"#fce6bb"],[1216,"#fceacc"],[1280,"#fdf1dc"],[1344,"#fdefd9"],[1400,"#feefd9"],[1470,"#fff2df"],[1535,"#fdf1dc"]],
   text:[['Kapesní multitooly pro hackery i tvůrce','Flipper Zero, T-Deck a T-Embed'],['Celý počítač v jedné dlani','Flipper ONE, Cardputer a ESP32']]},
  {path:'/prakticke-vychytavky/',img:['okla-gadget-left.webp','okla-gadget-right.webp'],w:1024,h:1536,from:369,page:'#f6d0be',dark:true,
   bg:[[0,"#c87350"],[64,"#c97451"],[128,"#cc7653"],[192,"#cf7a57"],[256,"#d27f5b"],[320,"#d4845d"],[384,"#d6865f"],[448,"#d98c64"],[512,"#dc9067"],[576,"#df946a"],[640,"#e49d73"],[704,"#e9a57a"],[768,"#edad83"],[832,"#f1b58c"],[896,"#f5c099"],[960,"#facaa3"],[1024,"#fbd1ad"],[1088,"#fddab8"],[1152,"#fde1c6"],[1216,"#fce9d4"],[1280,"#fdefe6"],[1344,"#fdece2"],[1400,"#faebe3"],[1470,"#faefec"],[1535,"#f8ebe7"]],
   text:[['Chytré drobnosti pro každý den','Termotiskárna, USB hub a diagnostika'],['Do auta, k televizi i k notebooku','CarPlay, HDMI a USB-C hub']]}
 ];
 /* a long turn from one colour to another, mixed in OKLab (a perceptually even colour space: the lightness changes at
    the same pace all the way, so no step or band shows), many stops on a smootherstep curve: it leaves the first colour and arrives at the second with no slope at all, so where
    it meets the picture's own (lighter-going) colours there is no crease */
 function hex(c){return [1,3,5].map(function(i){return parseInt(c.substr(i,2),16)})}
 function toLin(v){v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)}
 function toSrgb(v){v=v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055;return Math.max(0,Math.min(255,Math.round(v*255)))}
 function oklab(c){var r=toLin(c[0]),g=toLin(c[1]),b=toLin(c[2]);
  var l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  return [0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s]}
 function rgb(L){var l=Math.pow(L[0]+0.3963377774*L[1]+0.2158037573*L[2],3),m=Math.pow(L[0]-0.1055613458*L[1]-0.0638541728*L[2],3),s=Math.pow(L[0]-0.0894841775*L[1]-1.2914855480*L[2],3);
  return [toSrgb(4.0767416621*l-3.3077115913*m+0.2309699292*s),toSrgb(-1.2684380046*l+2.6097574011*m-0.3413193965*s),toSrgb(-0.0041960863*l-0.7034186147*m+1.7076147010*s)]}
 function ease(stops,a,b,y0,y1,n){
  var A=oklab(hex(a)),B=oklab(hex(b));
  for(var i=0;i<=n;i++){var t=i/n,e=t*t*t*(t*(t*6-15)+10);
   var c=rgb(A.map(function(v,j){return v+(B[j]-v)*e}));
   stops.push('rgb('+c.join(',')+') '+(y0+(y1-y0)*t).toFixed(1)+'px')}
 }
 /* the backdrop is a layer of its own across the whole page width, placed in the same coordinates as the pictures
    (so its colours meet the picture's own backdrop exactly at any window size): white under the header, turning
    slowly into the stage's deep blue by the text, the picture's own colours row by row, then a long, slow turn into a
    light blue (#c8dcfd) that stays for the rest of the page */
 function podColour(row){
  var BG=STAGE.bg;
  for(var i=1;i<BG.length;i++){if(row<=BG[i][0]){var a=BG[i-1],b=BG[i],t=(row-a[0])/(b[0]-a[0]),A=hex(a[1]),B=hex(b[1]);
   return '#'+A.map(function(v,j){return ('0'+Math.round(v+(B[j]-v)*t).toString(16)).slice(-2)}).join('')}}
  return BG[BG.length-1][1];
 }
 function podBackground(el){
  var z=window.__oklaDZ||1,sy=window.pageYOffset;
  var img=el.querySelector('.okla-side-pod__img');if(!img)return;
  var ir=img.getBoundingClientRect(),ar=el.getBoundingClientRect();
  var hd=document.getElementById('header'),hb=hd?(hd.getBoundingClientRect().bottom+sy)/z:0;
  var top=(ir.top+sy)/z,h=ir.height/z,at=(ar.top+sy)/z,k=h/STAGE.h,BG=STAGE.bg;
  if(!(k>0))return;
  var end=top+h+1400,stops=[];
  /* the header's white turns, slowly and evenly, into exactly the picture's own colour at the row where the picture starts
     to show (its darker top rows stay transparent, okla_home_side.css), then the picture's own colours follow - no
     darker band anywhere */
  var R=STAGE.from,from=podColour(R);
  ease(stops,'#ffffff',from,0,Math.max(320,top-hb+R*k),48);
  BG.forEach(function(p){if(p[0]>R)stops.push(p[1]+' '+(top-hb+p[0]*k).toFixed(1)+'px')});
  ease(stops,BG[BG.length-1][1],STAGE.page,top-hb+h,end-hb,40);
  var bg=document.getElementById('okla-pod-backdrop');
  if(!bg){bg=document.createElement('div');bg.id='okla-pod-backdrop';bg.setAttribute('aria-hidden','true');document.body.insertBefore(bg,document.body.firstChild)}
  bg.style.top=hb+'px';bg.style.height=(end-hb)+'px';
  bg.style.backgroundImage='linear-gradient(180deg,'+stops.join(',')+')';
 }
 function buildPod(){
  var root=document.documentElement;
  root.classList.add('okla-measure-pod');root.style.setProperty('--okla-pod-page',STAGE.page);
  var l=podBlock('okla-side-left','left',STAGE.img[0],'',STAGE.text[0][0],STAGE.text[0][1]);
  var r=podBlock('okla-side-right','right',STAGE.img[1],'',STAGE.text[1][0],STAGE.text[1][1]);
  [l,r].forEach(function(d){if(STAGE.dark)d.classList.add('okla-side-art--pod-dark');if(STAGE.w/STAGE.h>0.6)d.classList.add('okla-side-art--pod-short')});
 }

 /* every other page in our grey (PC): under the header the page starts white and turns, slowly and evenly, into the grey -
    the same smootherstep in OKLab as on the stages above, so the header's white flows into the page with no edge. A layer
    of its own behind the page (okla-page-fade, okla_home_side.css), placed under the header in the page's coordinates. */
 var FADE=480,GREY='#eef0f3';
 function pageFade(){
  var root=document.documentElement,el=document.getElementById('okla-page-fade');
  var on=!root.classList.contains('okla-measure-pod')&&!!window.matchMedia&&matchMedia('(min-width:992px)').matches&&
   /^rgba?\(238, 240, 243(, 1)?\)$/.test(getComputedStyle(root).backgroundColor);
  var hd=document.getElementById('header');
  if(!on||!hd||!document.body){if(el)el.remove();root.classList.remove('okla-page-fade');return}
  var z=window.__oklaDZ||1,hb=(hd.getBoundingClientRect().bottom+window.pageYOffset)/z;
  if(!el){
   var stops=[];ease(stops,'#ffffff',GREY,0,FADE,32);
   el=document.createElement('div');el.id='okla-page-fade';el.setAttribute('aria-hidden','true');
   el.style.height=FADE+'px';el.style.backgroundImage='linear-gradient(180deg,'+stops.join(',')+')';
   document.body.insertBefore(el,document.body.firstChild);
  }
  if(el.style.top!==hb+'px')el.style.top=hb+'px';
  root.classList.add('okla-page-fade');
 }

 function build(){
  if(document.getElementById('okla-side-left'))return;
  if(measurePage()){buildPod();return}
  /* the homepage now and then (one load in five): both margins a promo panel instead of the hand and the product */
  var pick=shuffled(RIGHT.slice().concat(isHome()?[PROMO]:[]));
  if(pick[0]===PROMO||(isHome()&&location.hash==='#okla-promo')){buildPromo();return}
  block('okla-side-left','left',
   '<a class="okla-side-art__link" href="/obchodni-podminky/">'+
   '<div class="okla-side-art__img okla-side-art__img--phone" role="img" aria-label="Ruka s telefonem Okla"></div>'+
   '</a>'+
   '<p class="okla-side-art__text">Záruka 24 měsíců na veškeré zboží. Reklamace vyřídíme rychle.</p>');
  renderRight(pick.filter(function(x){return x!==PROMO}));
 }
 function isHome(){return location.pathname==='/'||location.pathname===''}
 /* The promo (homepage, both margins), laid out like the big shops' side banners: no panel of its own - three of a
    category's best-looking products picked at random, large and close together (alternately left and right, a little
    over each other), each with its price in a yellow bubble (the shop's current price, read live - no discounts are
    claimed), and a short "Kup teď" (the category's best sellers). Each margin a different category. */
 var PROMO={key:'promo'};
 var PROMO_THEMES=[
  {title:'Elektronické multitooly',path:'/elektronicke-multitooly/',items:[['flipperzero','/flipper-zero-kapesni-multitool-pro-elektroniku/','Flipper Zero',5690,2.36],['flipperone','/flipper-one-otevreny-linuxovy-sitovy-multitool/','Flipper ONE',13990,2.29],['tdeck','/lilygo-t-deck-plus-kapesni-esp32-komunikator/','LILYGO T-Deck Plus',2890,0.64],['cardputer','/m5stack-cardputer-adv-programovatelny-mini-pocitac/','M5Stack Cardputer ADV',990,1.36],['tembed','/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/','LILYGO T-Embed CC1101',2590,0.40],['waveshare','/waveshare-esp32-c3-s-0-71-kulatym-displejem/','Waveshare ESP32-C3 s kulatým displejem',789,0.86]]},
  {title:'Měřicí technika',path:'/merici-technika-a-naradi/',items:[['wmt10','/fnirsi-wmt-10-bezkontaktni-vlhkomer-dreva-a-zdiva/','FNIRSI WMT-10 bezkontaktní vlhkoměr dřeva a zdiva',1189,0.99],['lcrp1','/fnirsi-lcr-p1-tester-soucastek/','FNIRSI LCR-P1 tester součástek',1289,0.83],['th104','/aneng-th104-bezkontaktni-infracerveny-teplomer-s-barevnym-displejem-50-az-550-c/','ANENG TH104 bezkontaktní infračervený teploměr',489,0.50]]},
  {title:'Praktické vychytávky',path:'/prakticke-vychytavky/',items:[['x18','/x18-kapesni-termotiskarna-bila/','X18 kapesní termotiskárna',389,1.00],['yesido','/yesido-tv15-bezdratovy-hdmi-adapter/','YESIDO TV15 bezdrátový HDMI adaptér',1189,0.95],['obd','/kingbolen-ediag-bluetooth-obd2-diagnostika-pro-android-a-ios/','KINGBOLEN Ediag Bluetooth OBD2 diagnostika pro Android a iOS',3789,1.32],['onten','/onten-8108-usb-3-0-hub-se-7-porty/','ONTEN 8108 USB 3.0 hub se 7 porty',589,1.52]]}
 ];
 function buildPromo(){
  var t=shuffled(PROMO_THEMES.slice());
  promoBlock('okla-side-left','left',t[0]);promoBlock('okla-side-right','right',t[1]);
  if(typeof layout==='function')layout();
 }
 function promoBlock(id,side,t){
  /* two narrower products side by side at the top, a wide one across the whole width under them */
  var base=window.__oklaAssetBase||'',all=shuffled(t.items.slice());
  var wide=all.filter(function(x){return x[4]>=1.25}),narrow=all.filter(function(x){return x[4]<1.25});
  var items=wide.length&&narrow.length>=2?[narrow[0],narrow[1],wide[0]]:all.slice(0,3).sort(function(x,y){return x[4]-y[4]});
  var d=block(id,side,
   '<div class="okla-promo">'+
   '<div class="okla-promo__items">'+items.map(function(x,i){
    return '<a class="okla-promo__item okla-promo__item--'+(i+1)+'" href="'+x[1]+'" aria-label="'+x[2]+'">'+
     '<span class="okla-promo__pic"><img class="okla-promo__img" src="'+base+'v91/img/side/promo/'+x[0]+'.webp" alt="" decoding="async">'+
     '<span class="okla-promo__price" aria-hidden="true"><span class="okla-side-price__value">'+price(x[3])+'</span></span></span></a>';
   }).join('')+'</div>'+
   '<a class="okla-promo__btn" href="'+t.path+'?order=bestseller">Kup teď</a>'+
   '</div>');
  d.classList.add('okla-side-art--promo');
  [].forEach.call(d.querySelectorAll('.okla-promo__item'),function(a){refreshPrice(a,{href:a.getAttribute('href')},function(){a.remove()})});
  return d;
 }
 function shuffled(list){for(var i=list.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=list[i];list[i]=list[j];list[j]=t}return list}
 /* Shows the first product of the list that the shop still sells (known from this session); when its page is gone,
    the next one takes its place. The Flipper Zero is the last resort. */
 function renderRight(list){
  var known={};try{known=JSON.parse(sessionStorage.getItem('okla-side-gone')||'{}')}catch(e){}
  list=list.filter(function(x){return known[x.href]!==false});
  if(!list.length)list=RIGHT.filter(function(x){return x.key==='flipper'});
  var v=list[0],old=document.getElementById('okla-side-right');
  if(old)old.remove();
  var right=block('okla-side-right','right',
   '<a class="okla-side-art__link" href="'+v.href+'" aria-label="'+v.alt+'">'+
   '<div class="okla-side-art__stage okla-side-art__stage--'+v.key+'">'+v.pictures+
   '<span class="okla-side-price" aria-hidden="true"><span class="okla-side-price__label">jen za</span><span class="okla-side-price__value">'+price(v.price)+'</span></span>'+
   '</div>'+
   '</a>'+
   '<p class="okla-side-art__text">'+v.text+'</p>');
  right.setAttribute('data-product',v.key);
  if(typeof layout==='function')layout();
  refreshPrice(right,v,function(){
   try{known[v.href]=false;sessionStorage.setItem('okla-side-gone',JSON.stringify(known))}catch(e){}
   if(v.key!=='flipper')renderRight(list.slice(1));
  });
 }

 /* Right-side products. Prices are the shop's current ones; refreshPrice() replaces them with the live price. */
 var RIGHT=[
  {key:'flipper',href:'/flipper-zero-kapesni-multitool-pro-elektroniku/',alt:'Flipper Zero',price:5690,
   pictures:'<div class="okla-side-art__img okla-side-art__img--wifi" role="img" aria-label="Wi-Fi modul pro Flipper Zero"></div>'+
            '<div class="okla-side-art__img okla-side-art__img--flipper" role="img" aria-label="Flipper Zero"></div>',
   text:'Flipper Zero: kapesní multitool pro kutily, elektroniku i experimenty.'},
  {key:'glasses',href:'/a2-chytre-bryle-s-kamerou-a-ai-prekladem/',alt:'A2 chytré brýle s kamerou a AI překladem',price:2089,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="A2 chytré brýle s kamerou a AI překladem"></div>',
   text:'Chytré brýle A2: kamera a AI překlad v lehkých brýlích.'},
  {key:'meter',href:'/aneng-aos03-osciloskopicky-multimetr/',alt:'ANENG AOS03 osciloskopický multimetr',price:3789,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="ANENG AOS03 osciloskopický multimetr"></div>',
   text:'ANENG AOS03: osciloskop a multimetr v jednom přístroji.'},
  {key:'endoscope',href:'/p80-prumyslovy-endoskop-4-3-5-m/',alt:'P80 průmyslový endoskop',price:789,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="P80 průmyslový endoskop"></div>',
   text:'Průmyslový endoskop P80: 4,3" displej a 5m kabel.'}
 ];
 /* 1490 -> "1 490,-" (the shop's own price format) */
 function price(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-'}
 function refreshPrice(el,v,unavailable){
  var key='okla-side-price:'+v.href,cached=null;
  try{cached=JSON.parse(sessionStorage.getItem(key)||'null')}catch(e){}
  function show(n){var t=el.querySelector('.okla-side-price__value');if(t&&n>0)t.textContent=price(n)}
  if(cached&&cached.t>Date.now()-3600000){if(cached.gone){if(unavailable)unavailable()}else show(cached.p);return}
  if(!window.fetch)return;
  fetch(v.href,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   /* the product's own offer (not the other product cards on its page) */
   var doc=new DOMParser().parseFromString(html,'text/html');
   var form=doc.querySelector('#product-detail-form');
   var priceEl=form&&form.querySelector('[itemprop="price"]');
   var n=priceEl?parseFloat(priceEl.getAttribute('content')):NaN;
   /* only a product the shop no longer has is skipped (a sold-out one keeps its place and price) */
   var out=!form||!(n>0);
   try{sessionStorage.setItem(key,JSON.stringify(out?{gone:true,t:Date.now()}:{p:n,t:Date.now()}))}catch(e){}
   if(out){if(unavailable)unavailable();return}
   show(n);
  }).catch(function(){});
 }

 /* Search, contacts, the cart and checkout pages, the account pages (login, registration, forgotten password,
    the customer account) and the "page not found" page have no side art. */
 var OFF_PAGE_CLASSES=['in-vyhledavani','in-kontakty','ordering-process','in-login','in-registrace','in-zapomenute-heslo','in-404'];
 function offPage(){
  for(var i=0;i<OFF_PAGE_CLASSES.length;i++){if(document.body.classList.contains(OFF_PAGE_CLASSES[i]))return true}
  return /(^|\s)in-klient/.test(document.body.className);
 }

 /* the art (its pictures and the live price, which reads a whole product page) is made only where it can be shown: a
    wide enough window on a page that has it - never on phones */
 function wanted(){return window.matchMedia('(min-width:768px)').matches&&!offPage()}
 function layout(){layoutArt();pageFade()}
 function layoutArt(){
  var left=document.getElementById('okla-side-left');
  var right=document.getElementById('okla-side-right');
  var card=document.querySelector('#content-wrapper');
  if((!left||!right)&&wanted()){build();left=document.getElementById('okla-side-left');right=document.getElementById('okla-side-right')}
  if(!left||!right)return;
  /* Everything is computed in the units of the proportionally zoomed page
     (window.__oklaDZ); the art itself is zoomed the same way in CSS. */
  var z=window.__oklaDZ||1;
  /* phones and pages without the art first: nothing is measured there (measuring lays the whole page out), and the
     art is switched off only when it is on */
  if(!card||!window.matchMedia('(min-width:768px)').matches||offPage()){
   if(left.classList.contains('is-on'))left.classList.remove('is-on');
   if(right.classList.contains('is-on'))right.classList.remove('is-on');
   if(card&&card.style.minHeight)card.style.minHeight='';
   return;
  }
  var viewport=document.documentElement.clientWidth/z;
  var c0=card.getBoundingClientRect();
  var c={left:c0.left/z,right:c0.right/z,top:c0.top/z};
  var sx=window.pageXOffset/z,sy=window.pageYOffset/z;
  var leftSpace=c.left;
  var rightSpace=viewport-c.right;
  var space=Math.min(leftSpace,rightSpace);
  if(space<MIN_MARGIN){
   left.classList.remove('is-on');right.classList.remove('is-on');
   if(card)card.style.minHeight='';
   return;
  }
  var width=Math.min(MAX_WIDTH,Math.floor((space-SIDE_GUTTER)*0.9));
  var top=c.top+sy+ART_TOP_OFFSET;
  left.style.width=width+'px';
  left.style.left=(c.left+sx-width)+'px';
  left.style.top=top+'px';
  right.style.width=width+'px';
  right.style.left=(c.right+sx+RIGHT_GAP)+'px';
  right.style.top=top+'px';
  left.classList.add('is-on');
  right.classList.add('is-on');
  /* the promo: 32 px from the content, about a third as wide as it is high, as high as nine tenths of the homepage's first island (the banners and
     the category circles), level with its top */
  if(left.classList.contains('okla-side-art--promo')){
   var isl=document.querySelector('#content .banners-row'),circ=document.getElementById('okla-cat-circles');
   var ir=(isl||card).getBoundingClientRect(),ib=(circ||isl||card).getBoundingClientRect();
   var ph=Math.round(Math.max(420,(ib.bottom-ir.top)/z)*0.9),GAP=32,pw=Math.min(215,Math.round(ph*0.34),Math.floor(space-2*GAP));
   left.style.width=right.style.width=pw+'px';left.style.height=right.style.height='';left.style.maxHeight=right.style.maxHeight=ph+'px';
   left.style.top=right.style.top=(ir.top/z+sy)+'px';
   left.style.left=(c.left+sx-pw-GAP)+'px';right.style.left=(c.right+sx+GAP)+'px';
   card.style.minHeight='';
   return;
  }
  /* the podium stage: level with the content's top, its cut side under the content's edge, its own height */
  if(left.classList.contains('okla-side-art--pod')){
   /* the picture takes two thirds of the margin, by the content (its cut podium side 16 px under the content; the
      outer third is the page's backdrop, into which its outer edge fades); it starts 260 px under the content's top,
      so the page above it can turn from the header's white into the blue slowly */
   var UNDER=16,DROP=260,pw=Math.ceil(space*2/3+UNDER);
   left.style.width=pw+'px';right.style.width=pw+'px';
   left.style.top=right.style.top=(c.top+sy+DROP)+'px';
   left.style.left=(c.left+sx-pw+UNDER)+'px';
   right.style.left=(c.right+sx-UNDER)+'px';
   card.style.minHeight='';
   podBackground(left);
   return;
  }
  card.style.minHeight=Math.ceil(ART_TOP_OFFSET+HAND_BOTTOM*width)+'px';
  /* Category pages: the sidebar is a column of separate boxes, so the hand may run under the "Kategorie" box only.
     Both pictures start level with the boxes' top, and are made smaller (never larger than 0.9) until the hand's arm
     meets the box's edge at least 48px above the box's bottom (the arm crosses the edge between 33% and 77% of the
     picture's height = 1.458 art widths). The CSS clips the hand at that edge (okla_sidebar_clean.css). */
  var box=document.body.classList.contains('type-category')&&document.querySelector('#content-wrapper aside.sidebar-left .box-categories');
  if(box){
   var b=box.getBoundingClientRect(),boxH=b.height/z,boxTop=b.top/z+sy;
   var s=Math.max(.5,Math.min(.9,(boxH-48)/(1.458*width)));
   [left,right].forEach(function(el){el.style.top=boxTop+'px';el.style.setProperty('--okla-cat-art-s',s.toFixed(3))});
  }
 }

 var frame=0;
 function schedule(){
  if(frame)return;
  frame=requestAnimationFrame(function(){frame=0;layout()});
 }

 function start(){
  if(!document.body)return;
  layout();
  window.addEventListener('resize',schedule);
  /* The card moves when the header grows (the category bar is added after this script) or anything above it changes
     height. A ResizeObserver re-places the art in the same frame, before it is painted, so the art never shows at an
     old position first and then jumps. 'load' stays as a safety net (it changes nothing when the art is already in
     place, e.g. where the page is not being rendered and the observer has not run yet). */
  if(window.ResizeObserver){
   var ro=new ResizeObserver(function(){layout()});
   [document.getElementById('header'),document.getElementById('content-wrapper'),document.body].forEach(function(el){if(el)ro.observe(el)});
  }
  window.addEventListener('load',layout);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
