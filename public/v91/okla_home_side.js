/* OKLA homepage side art: a phone on the left; on the right one of four products, picked at random on every page
   load (Flipper Zero with its Wi-Fi module, AI glasses, thermal camera, USB-C endoscope), each with its price on a
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

 function build(){
  if(document.getElementById('okla-side-left'))return;
  block('okla-side-left','left',
   '<a class="okla-side-art__link" href="/obchodni-podminky/">'+
   '<div class="okla-side-art__img okla-side-art__img--phone" role="img" aria-label="Ruka s telefonem OKLA"></div>'+
   '</a>'+
   '<p class="okla-side-art__text">Záruka 24 měsíců na veškeré zboží. Reklamace vyřídíme rychle.</p>');
  var v=RIGHT[Math.floor(Math.random()*RIGHT.length)];
  var right=block('okla-side-right','right',
   '<a class="okla-side-art__link" href="'+v.href+'" aria-label="'+v.alt+'">'+
   '<div class="okla-side-art__stage okla-side-art__stage--'+v.key+'">'+v.pictures+
   '<span class="okla-side-price" aria-hidden="true"><span class="okla-side-price__label">jen za</span><span class="okla-side-price__value">'+price(v.price)+'</span></span>'+
   '</div>'+
   '</a>'+
   '<p class="okla-side-art__text">'+v.text+'</p>');
  right.setAttribute('data-product',v.key);
  refreshPrice(right,v);
 }

 /* Right-side products. Prices are the shop's current ones; refreshPrice() replaces them with the live price. */
 var RIGHT=[
  {key:'flipper',href:'/flipper-zero-kapesni-multitool-pro-elektroniku/',alt:'Flipper Zero',price:5690,
   pictures:'<div class="okla-side-art__img okla-side-art__img--wifi" role="img" aria-label="Wi-Fi modul pro Flipper Zero"></div>'+
            '<div class="okla-side-art__img okla-side-art__img--flipper" role="img" aria-label="Flipper Zero"></div>',
   text:'Flipper Zero: kapesní multitool pro kutily, elektroniku i experimenty.'},
  {key:'glasses',href:'/ai-chytre-bryle-wai4-bezdratova-elektronika/',alt:'Chytré brýle WAI4 s AI',price:1490,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="Chytré brýle WAI4 s AI"></div>',
   text:'Chytré brýle s AI: kamera, asistent a poslech v běžných brýlích.'},
  {key:'thermal',href:'/mini-termokamera-kompaktni-termalni-zobrazeni/',alt:'Mini termokamera',price:3990,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="Mini termokamera"></div>',
   text:'Mini termokamera: rychlá orientační kontrola teplot.'},
  {key:'endoscope',href:'/usb-c-endoskopicka-kamera-inspekce-tezko-dostupnych-mist/',alt:'Endoskopická kamera USB-C',price:899,
   pictures:'<div class="okla-side-art__img okla-side-art__product" role="img" aria-label="Endoskopická kamera USB-C"></div>',
   text:'Endoskopická kamera USB-C: pohled do dutin a těžko dostupných míst.'}
 ];
 /* 1490 -> "1 490,-" (the shop's own price format) */
 function price(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-'}
 function refreshPrice(el,v){
  var key='okla-side-price:'+v.href,cached=null;
  try{cached=JSON.parse(sessionStorage.getItem(key)||'null')}catch(e){}
  function show(n){var t=el.querySelector('.okla-side-price__value');if(t&&n>0)t.textContent=price(n)}
  if(cached&&cached.t>Date.now()-3600000){show(cached.p);return}
  if(!window.fetch)return;
  fetch(v.href,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var m=html.match(/itemprop="price"\s+content="([0-9.]+)"/);if(!m)return;
   var n=parseFloat(m[1]);show(n);
   try{sessionStorage.setItem(key,JSON.stringify({p:n,t:Date.now()}))}catch(e){}
  }).catch(function(){});
 }

 /* Search, contacts, the cart and checkout pages, the account pages (login, registration, forgotten password,
    the customer account) and the "page not found" page have no side art. */
 var OFF_PAGE_CLASSES=['in-vyhledavani','in-kontakty','ordering-process','in-login','in-registrace','in-zapomenute-heslo','in-404'];
 function offPage(){
  for(var i=0;i<OFF_PAGE_CLASSES.length;i++){if(document.body.classList.contains(OFF_PAGE_CLASSES[i]))return true}
  return /(^|\s)in-klient/.test(document.body.className);
 }

 function layout(){
  var left=document.getElementById('okla-side-left');
  var right=document.getElementById('okla-side-right');
  var card=document.querySelector('#content-wrapper');
  if(!left||!right)return;
  var viewport=document.documentElement.clientWidth;
  if(!card||!window.matchMedia('(min-width:768px)').matches||offPage()){
   left.classList.remove('is-on');right.classList.remove('is-on');
   if(card)card.style.minHeight='';
   return;
  }
  var c=card.getBoundingClientRect();
  var leftSpace=c.left;
  var rightSpace=viewport-c.right;
  var space=Math.min(leftSpace,rightSpace);
  if(space<MIN_MARGIN){
   left.classList.remove('is-on');right.classList.remove('is-on');
   if(card)card.style.minHeight='';
   return;
  }
  var width=Math.min(MAX_WIDTH,Math.floor((space-SIDE_GUTTER)*0.9));
  var top=c.top+window.pageYOffset+ART_TOP_OFFSET;
  left.style.width=width+'px';
  left.style.left=(c.left+window.pageXOffset-width)+'px';
  left.style.top=top+'px';
  right.style.width=width+'px';
  right.style.left=(c.right+window.pageXOffset+RIGHT_GAP)+'px';
  right.style.top=top+'px';
  left.classList.add('is-on');
  right.classList.add('is-on');
  card.style.minHeight=Math.ceil(ART_TOP_OFFSET+HAND_BOTTOM*width)+'px';
 }

 var frame=0;
 function schedule(){
  if(frame)return;
  frame=requestAnimationFrame(function(){frame=0;layout()});
 }

 function start(){
  if(!document.body)return;
  build();
  layout();
  window.addEventListener('resize',schedule);
  window.addEventListener('load',layout);
  setTimeout(layout,800);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
