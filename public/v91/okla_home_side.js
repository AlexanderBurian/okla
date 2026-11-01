/* OKLA homepage side art: a phone on the left, a Flipper Zero with its Wi-Fi module on the right.
   They sit in the page margins beside the white card and touch its edges. Shown only when both margins are wide enough. */
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
  block('okla-side-right','right',
   '<a class="okla-side-art__link" href="/flipper-zero-kapesni-multitool-pro-elektroniku/">'+
   '<div class="okla-side-art__img okla-side-art__img--wifi" role="img" aria-label="Wi-Fi modul pro Flipper Zero"></div>'+
   '<div class="okla-side-art__img okla-side-art__img--flipper" role="img" aria-label="Flipper Zero"></div>'+
   '</a>'+
   '<p class="okla-side-art__text">Flipper Zero: kapesní multitool pro kutily, elektroniku i experimenty.</p>');
 }

 /* Search, contacts, the cart and checkout pages and the account pages (login, registration, forgotten password,
    the customer account) have no side art. */
 var OFF_PAGE_CLASSES=['in-vyhledavani','in-kontakty','ordering-process','in-login','in-registrace','in-zapomenute-heslo'];
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
