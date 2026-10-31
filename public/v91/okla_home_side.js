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

 function layout(){
  var left=document.getElementById('okla-side-left');
  var right=document.getElementById('okla-side-right');
  var card=document.querySelector('#content-wrapper');
  var slider=document.querySelector('#content .okla-slider-shell');
  if(!left||!right)return;
  var viewport=document.documentElement.clientWidth;
  if(!card||!slider||!window.matchMedia('(min-width:768px)').matches){
   left.classList.remove('is-on');right.classList.remove('is-on');
   return;
  }
  var c=card.getBoundingClientRect();
  var leftSpace=c.left;
  var rightSpace=viewport-c.right;
  var space=Math.min(leftSpace,rightSpace);
  if(space<MIN_MARGIN){
   left.classList.remove('is-on');right.classList.remove('is-on');
   return;
  }
  var width=Math.min(MAX_WIDTH,Math.floor(space-SIDE_GUTTER));
  var top=c.top+window.pageYOffset+ART_TOP_OFFSET;
  left.style.width=width+'px';
  left.style.left=(c.left+window.pageXOffset-width)+'px';
  left.style.top=top+'px';
  right.style.width=width+'px';
  right.style.left=(c.right+window.pageXOffset)+'px';
  right.style.top=top+'px';
  left.classList.add('is-on');
  right.classList.add('is-on');
 }

 var frame=0;
 function schedule(){
  if(frame)return;
  frame=requestAnimationFrame(function(){frame=0;layout()});
 }

 function start(){
  if(!document.body||!document.body.classList.contains('type-index'))return;
  build();
  layout();
  window.addEventListener('resize',schedule);
  window.addEventListener('load',layout);
  setTimeout(layout,800);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
