/* OKLA homepage side art: a phone on the left; on the right one of four products, picked at random on every page
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

 function build(){
  if(document.getElementById('okla-side-left'))return;
  block('okla-side-left','left',
   '<a class="okla-side-art__link" href="/obchodni-podminky/">'+
   '<div class="okla-side-art__img okla-side-art__img--phone" role="img" aria-label="Ruka s telefonem OKLA"></div>'+
   '</a>'+
   '<p class="okla-side-art__text">Záruka 24 měsíců na veškeré zboží. Reklamace vyřídíme rychle.</p>');
  renderRight(shuffled(RIGHT.slice()));
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
