/* Okla homepage banners: the hero in the main Shoptet carousel slot - the gift banner in four variants (the lower
   tiles are gone). Every banner has the
   same darkening, text and blue CTA. The hero has dots and autoplay; the dots show only on mobile, under the picture.
   Autoplay stays continuous on phones, pauses on desktop hover/focus and skips
   slides that are hidden on the current screen. */
(function(){
 'use strict';
 if(window.__oklaHomeBannersV1)return;
 window.__oklaHomeBannersV1=true;

 // On desktop the top slot stays on the projector: only the projector is shown there. The other slides are mobile only.
 // Desktop shows the first slide only (Flipper Zero); the glasses slide is mobile only. Only products the shop sells.
 var BASE=window.__oklaAssetBase||'';
 /* the hero: only the gift banner, in four variants (the same blue background and gift, other texts); the dots
    switch between them */
 var SLIDES=[
  {n:'storewide',storewide:true,title:'Velké dny plné objevů',strong:'Spousta inspirace na jednom místě',when:'Právě teď',cta:'Prozkoumat',fine:'Objevujte novinky a inspiraci napříč celým e-shopem.',alt:'Velké dny plné objevů',href:'/'},
  {n:'storewide',storewide:true,title:'Dárky, které potěší',strong:'Vychytávky pro kutily i hračičky',when:'Na každou příležitost',cta:'Vybrat dárek',fine:'Praktické vychytávky a gadgety pro každého, kdo rád objevuje.',alt:'Dárky, které potěší',href:'/prakticke-vychytavky/'},
  {n:'storewide',storewide:true,title:'Technologie do kapsy',strong:'Multitooly, ESP32 a chytrá elektronika',when:'Pro tvůrce a vývojáře',cta:'Prozkoumat',fine:'Flipper Zero, LilyGO, M5Stack a další kapesní zařízení.',alt:'Technologie do kapsy',href:'/elektronicke-multitooly/'},
  {n:'storewide',storewide:true,title:'Měřte s přehledem',strong:'Měřicí technika pro dílnu i domov',when:'Teploty, vlhkost i vzdálenosti',cta:'Nakupovat',fine:'Multimetry, teploměry, vlhkoměry, dálkoměry a další přístroje.',alt:'Měřte s přehledem',href:'/merici-technika-a-naradi/'}
 ];
 // each banner's CTA leads to its product
 var CTA_TEXT='Kup teď';
 var INTERVAL=6000;

 function slideHtml(s,i){
  var active=(i===0);
  var inner;
  if(s.storewide){
   inner='<div class="okla-hero__media" role="img" aria-label="'+s.alt+'"></div>'+
    '<img class="okla-hero__gift" src="'+BASE+'v91/img/promo/storewide-gift.webp" alt="" loading="'+(i===0?'eager':'lazy')+'" decoding="async">'+
    '<div class="okla-hero__text okla-hero__text--wide">'+
     '<h2 class="okla-hero__title">'+s.title+'</h2>'+
     '<p class="okla-hero__lead okla-hero__wideline"><strong>'+s.strong+'</strong><span>'+s.when+'</span></p>'+
     '<a class="okla-hero__cta" href="'+s.href+'">'+s.cta+'</a>'+
    '</div>'+
    '<p class="okla-hero__fineprint">'+s.fine+'</p>';
  }else{
   inner='<div class="okla-hero__media" role="img" aria-label="'+s.alt+'"></div>'+
    '<div class="okla-hero__text">'+
     '<h2 class="okla-hero__title">'+s.title+'</h2>'+
     '<p class="okla-hero__lead">'+s.lead+'</p>'+
     '<a class="okla-hero__cta" href="'+s.href+'">'+CTA_TEXT+'</a>'+
    '</div>';
  }
  return '<article id="okla-hero-slide-'+(i+1)+'" class="okla-hero__slide okla-hero__slide--'+s.n+(s.mobileOnly?' okla-hero__slide--mobile-only':'')+(active?' is-active':'')+'" aria-hidden="'+(active?'false':'true')+'">'+inner+'</article>';
 }

 function dotHtml(i){
  return '<button type="button" aria-label="Zobrazit banner '+(i+1)+'" aria-controls="okla-hero-slide-'+(i+1)+'"'+(i===0?' aria-current="true"':' aria-current="false"')+'></button>';
 }

 function wire(wrap){
  var hero=wrap.querySelector('.okla-hero');
  var slides=Array.prototype.slice.call(hero.querySelectorAll('.okla-hero__slide'));
  var dots=Array.prototype.slice.call(wrap.querySelectorAll('.okla-hero__dots button'));
  var cur=0, timer=0, paused=false;

  // Indexes of the slides that are displayed now (a slide hidden by CSS has no offsetParent).
  function shown(){
   return slides.map(function(s,k){return k}).filter(function(k){return slides[k].offsetParent!==null});
  }
  function set(i){
   cur=i;
   slides.forEach(function(s,k){
    s.classList.toggle('is-active',k===cur);
    s.setAttribute('aria-hidden',k===cur?'false':'true');
   });
   dots.forEach(function(d,k){d.setAttribute('aria-current',k===cur?'true':'false')});
  }
  function step(d){
   var list=shown();
   if(!list.length)return;
   var p=list.indexOf(cur);
   p=(p<0)?0:(p+d+list.length)%list.length;
   set(list[p]);
  }
  /* Autoplay is off: the banner only changes when the visitor uses the dots or swipes. */
  function restart(){
   clearInterval(timer);
  }

  dots.forEach(function(d,k){
   d.addEventListener('click',function(){ set(k); restart(); });
   d.addEventListener('keydown',function(event){
    var target=k;
    if(event.key==='ArrowLeft')target=(k-1+dots.length)%dots.length;
    else if(event.key==='ArrowRight')target=(k+1)%dots.length;
    else if(event.key==='Home')target=0;
    else if(event.key==='End')target=dots.length-1;
    else return;
    event.preventDefault();
    set(target);
    dots[target].focus();
    restart();
   });
  });
  function isPhone(){ return window.matchMedia&&window.matchMedia('(max-width:767px)').matches; }
  hero.addEventListener('mouseenter',function(){ if(!isPhone())paused=true; });
  hero.addEventListener('mouseleave',function(){ paused=false; });
  hero.addEventListener('focusin',function(){ if(!isPhone())paused=true; });
  hero.addEventListener('focusout',function(){ paused=false; });

  /* Phones: the banner follows the finger. A swipe of a fifth of its width (or a quick flick) brings the next or the
     previous banner, a shorter one springs back; a vertical move scrolls the page as usual and a tap still opens the
     banner's link. Autoplay waits while the finger is down and starts its count again afterwards. */
  (function swipe(){
   var x0=0,y0=0,t0=0,dx=0,w=1,lock='',dir=0,other=-1,moved=false,busy=false;
   var EASE='transform .3s cubic-bezier(.22,.61,.36,1)';
   function neighbour(d){var list=shown();if(list.length<2)return -1;var p=list.indexOf(cur);if(p<0)return -1;return list[(p+d+list.length)%list.length]}
   function put(k,x,anim){
    var s=slides[k];if(!s)return;
    s.style.setProperty('transition',anim?EASE:'none','important');
    s.style.setProperty('transform','translate3d('+x+'px,0,0)','important');
    s.style.setProperty('opacity','1','important');
    s.style.setProperty('visibility','visible','important');
   }
   function clear(k){var s=slides[k];if(!s)return;['transition','transform','opacity','visibility'].forEach(function(p){s.style.removeProperty(p)})}
   function end(){hero.classList.remove('is-swiping');busy=false;paused=false;restart()}
   hero.addEventListener('touchstart',function(e){
    if(busy||!isPhone()||e.touches.length!==1)return;
    x0=e.touches[0].clientX;y0=e.touches[0].clientY;t0=Date.now();dx=0;lock='';dir=0;other=-1;moved=false;
    w=hero.offsetWidth||1;paused=true;
   },{passive:true});
   hero.addEventListener('touchmove',function(e){
    if(busy||!isPhone()||e.touches.length!==1||lock==='y')return;
    var mx=e.touches[0].clientX-x0,my=e.touches[0].clientY-y0;
    if(!lock){
     if(Math.abs(mx)<8&&Math.abs(my)<8)return;
     lock=Math.abs(mx)>Math.abs(my)?'x':'y';
     if(lock==='y'){paused=false;return}
     hero.classList.add('is-swiping');
    }
    e.preventDefault();moved=true;
    var d=mx<0?1:-1;
    if(d!==dir){if(other>=0&&other!==cur)clear(other);dir=d;other=neighbour(d)}
    dx=other<0?mx/3:mx;
    put(cur,dx,false);
    if(other>=0&&other!==cur)put(other,dx+dir*w,false);
   },{passive:false});
   function release(){
    if(lock!=='x'){if(!busy)paused=false;return}
    lock='';busy=true;
    var fast=Math.abs(dx)>30&&Math.abs(dx)/Math.max(1,Date.now()-t0)>0.45;
    var go=other>=0&&other!==cur&&(Math.abs(dx)>w*0.2||fast);
    var from=cur,to=other;
    if(go){put(from,-dir*w,true);put(to,0,true)}
    else{put(from,0,true);if(to>=0&&to!==from)put(to,dir*w,true)}
    setTimeout(function(){
     if(go)set(to);
     clear(from);if(to>=0)clear(to);
     /* one frame without fading, so the slides do not cross-fade after the swipe */
     requestAnimationFrame(function(){requestAnimationFrame(end)});
    },310);
   }
   hero.addEventListener('touchend',release);
   hero.addEventListener('touchcancel',release);
   /* a swipe that ends on the "Kup teď" link is not a tap on it */
   hero.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  })();

  set(0);
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
  // Shoptet's Bootstrap carousel would keep cycling the old .item slides and throw; stop it so it cannot slide into the new markup.
  if(window.jQuery&&window.jQuery.fn&&window.jQuery.fn.carousel)window.jQuery(carousel).carousel('pause');
  carousel.removeAttribute('data-ride');
  carousel.classList.remove('carousel','slide');
  wire(inner.querySelector('.okla-hero-wrap'));
 }

 // Legacy mobile code places the categories block after its dots block, and the dots after the banner. Once the Shoptet
 // carousel items are gone that chain ends up after the product groups. Put the dots and then the categories back right
 // after the banner row, where they belong; the legacy code then finds them already in place.
 function placeCategories(){
  var row=document.querySelector('.banners-row');
  if(!row)return;
  var dots=document.getElementById('okla-v61-dots');
  if(dots&&row.nextElementSibling!==dots)row.parentNode.insertBefore(dots,row.nextElementSibling);
  var cats=document.getElementById('okla-v61-categories');
  var after=dots||row;
  if(cats&&after.nextElementSibling!==cats)after.parentNode.insertBefore(cats,after.nextElementSibling);
 }

 function build(){
  if(!document.body||!document.body.classList.contains('type-index'))return;
  buildHero();
  placeCategories();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});
 else build();
 window.addEventListener('load',build);
})();
