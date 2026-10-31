/* OKLA homepage banners: the hero (four slides, the first is the Flipper Zero) in the main Shoptet carousel slot,
   and the two lower tiles. Every banner has the same darkening, text and blue CTA. The hero has dots and autoplay;
   autoplay pauses on hover and focus. The dots show only on mobile, under the picture. */
(function(){
 'use strict';
 if(window.__oklaHomeBannersV1)return;
 window.__oklaHomeBannersV1=true;

 var SLIDES=[
  {n:1,title:'Flipper Zero',lead:'Kapesní multitool pro kutily, elektroniku i experimenty.',alt:'Flipper Zero'},
  {n:2,title:'Kino ve vašem obýváku',lead:'Velký obraz kdekoli doma, bez velké televize.',alt:'Projektor'},
  {n:3,title:'Chytré brýle s AI',lead:'Kamera, asistent a poslech v běžných brýlích.',alt:'Chytré brýle'},
  {n:4,title:'Laserový dálkoměr',lead:'Přesné měření vzdáleností jedním stisknutím.',alt:'Laserový dálkoměr'}
 ];
 var TILES=[
  {n:1,title:'Chytré brýle',lead:'Kamera a AI asistent přímo v brýlích.',alt:'Chytré brýle'},
  {n:2,title:'Projektor pro domácí kino',lead:'Velký obraz doma bez velké televize.',alt:'Projektor'}
 ];
 var CTA_HREF='/goal';
 var CTA_TEXT='Kup teď';
 var INTERVAL=6000;

 function slideHtml(s,i){
  return '<article class="okla-hero__slide okla-hero__slide--'+s.n+(i===0?' is-active':'')+'" aria-hidden="'+(i===0?'false':'true')+'">'+
   '<div class="okla-hero__media" role="img" aria-label="'+s.alt+'"></div>'+
   '<div class="okla-hero__text">'+
    '<h2 class="okla-hero__title">'+s.title+'</h2>'+
    '<p class="okla-hero__lead">'+s.lead+'</p>'+
    '<a class="okla-hero__cta" href="'+CTA_HREF+'">'+CTA_TEXT+'</a>'+
   '</div>'+
  '</article>';
 }

 function tileHtml(t){
  return '<article class="okla-tile okla-tile--'+t.n+'">'+
   '<div class="okla-tile__media" role="img" aria-label="'+t.alt+'"></div>'+
   '<div class="okla-tile__text">'+
    '<h3 class="okla-tile__title">'+t.title+'</h3>'+
    '<p class="okla-tile__lead">'+t.lead+'</p>'+
    '<a class="okla-tile__cta" href="'+CTA_HREF+'">'+CTA_TEXT+'</a>'+
   '</div>'+
  '</article>';
 }

 function dotHtml(i){
  return '<button type="button" aria-label="Zobrazit banner '+(i+1)+'"'+(i===0?' aria-current="true"':' aria-current="false"')+'></button>';
 }

 function wire(wrap){
  var hero=wrap.querySelector('.okla-hero');
  var slides=Array.prototype.slice.call(hero.querySelectorAll('.okla-hero__slide'));
  var dots=Array.prototype.slice.call(wrap.querySelectorAll('.okla-hero__dots button'));
  var cur=0, timer=0, paused=false;

  function show(i){
   cur=(i+slides.length)%slides.length;
   slides.forEach(function(s,k){
    s.classList.toggle('is-active',k===cur);
    s.setAttribute('aria-hidden',k===cur?'false':'true');
   });
   dots.forEach(function(d,k){d.setAttribute('aria-current',k===cur?'true':'false')});
  }
  function restart(){
   clearInterval(timer);
   timer=setInterval(function(){ if(!paused) show(cur+1); },INTERVAL);
  }

  dots.forEach(function(d,k){
   d.addEventListener('click',function(){ show(k); restart(); });
  });
  hero.addEventListener('mouseenter',function(){ paused=true; });
  hero.addEventListener('mouseleave',function(){ paused=false; });
  hero.addEventListener('focusin',function(){ paused=true; });
  hero.addEventListener('focusout',function(){ paused=false; });

  show(0);
  restart();
 }

 function buildHero(){
  var carousel=document.querySelector('.banners-row #carousel');
  if(!carousel||carousel.querySelector('.okla-hero'))return;
  var inner=carousel.querySelector('.carousel-inner');
  if(!inner)return;
  inner.innerHTML=
   '<div class="okla-hero-wrap">'+
    '<div class="okla-hero" aria-roledescription="carousel" aria-label="Hlavní banner">'+
     '<div class="okla-hero__track">'+SLIDES.map(slideHtml).join('')+'</div>'+
    '</div>'+
    '<div class="okla-hero__dots">'+SLIDES.map(function(s,i){return dotHtml(i)}).join('')+'</div>'+
   '</div>';
  wire(inner.querySelector('.okla-hero-wrap'));
 }

 function buildTiles(){
  var wrappers=document.querySelectorAll('.next-to-carousel-banners .banner-wrapper');
  TILES.forEach(function(t,i){
   var w=wrappers[i];
   if(!w||w.querySelector('.okla-tile'))return;
   w.innerHTML=tileHtml(t);
  });
 }

 function build(){
  if(!document.body||!document.body.classList.contains('type-index'))return;
  buildHero();
  buildTiles();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});
 else build();
 window.addEventListener('load',build);
})();
