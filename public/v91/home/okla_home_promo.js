/* OKLA - homepage promo island: a two-card feature block (Flipper ONE + LILYGO T-Embed) built from the supplied
   campaign and brought to the OKLA island style (okla_home_promo.css). Placed among the product sliders (before the
   fourth product heading, else the third, else before the magazine) and kept in place when other scripts re-order the
   homepage sections. Links go to the real product pages; nothing about price or stock is claimed here. */
(function(){
 'use strict';
 if(window.__oklaHomePromoV1)return;window.__oklaHomePromoV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';

 function el(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e}

 function build(){
  var sec=el('section');sec.id='okla-promo-deals';sec.className='okla-campaign';
  sec.setAttribute('aria-label','Flipper ONE a LILYGO T-Embed');
  var grid=el('div','okla-campaign__grid');

  /* Flipper ONE - teaser, not a sales link yet */
  var cf=el('article','okla-campaign__card okla-campaign__card--flipper');
  var cfCopy=el('div','okla-campaign__flipper-copy');
  var cfBrand=el('h2','okla-campaign__brand');cfBrand.textContent='Flipper ONE';
  var cfKick=el('p','okla-campaign__kicker');
  cfKick.innerHTML='<span class="okla-campaign__kicker-hot">OPEN LINUX</span> <span class="okla-campaign__kicker-cool">· WI‑FI 6E · M.2</span>';
  var cfText=el('p','okla-campaign__text');cfText.innerHTML='Otevřený síťový multitool<br>pro vývojáře a nadšence.';
  var cfCta=el('span','okla-campaign__cta okla-campaign__cta--soon');cfCta.textContent='PŘIPRAVUJEME';cfCta.setAttribute('aria-label','Flipper ONE připravujeme');
  cfCopy.append(cfBrand,cfKick,cfText,cfCta);
  var cfStage=el('div','okla-campaign__flipper-stage');
  var cfImg=el('img','okla-campaign__flipper');cfImg.src=base+'v91/img/promo/flipper-one-official-og.webp';cfImg.alt='Flipper ONE';cfImg.loading='lazy';cfImg.draggable=false;cfImg.decoding='async';
  var cfScreen=el('img','okla-campaign__flipper-screen');cfScreen.src=base+'v91/img/promo/flipper-one-screen.png';cfScreen.alt='';cfScreen.setAttribute('aria-hidden','true');cfScreen.loading='lazy';cfScreen.draggable=false;cfScreen.decoding='async';
  cfStage.append(cfImg,cfScreen);
  var cfFine=el('p','okla-campaign__fineprint');cfFine.innerHTML='Nová otevřená platforma je ve vývoji.<br>Dostupnost pro náš obchod připravujeme.';
  cf.append(cfCopy,cfStage,cfFine);

  /* LILYGO T-Embed */
  var cl=el('article','okla-campaign__card okla-campaign__card--lilygo');
  var clCopy=el('div','okla-campaign__lilygo-copy');
  var clBrand=el('p','okla-campaign__lilygo-brand');clBrand.innerHTML='LILYGO <em>T‑Embed</em>';
  var clTitle=el('h2','okla-campaign__lilygo-title');clTitle.innerHTML='Malý formát.<br>Velký prostor pro nápady.';
  var clText=el('p','okla-campaign__lilygo-text');clText.textContent='ESP32‑S3, CC1101, barevný displej a otočný enkodér v jedné otevřené platformě.';
  var clCta=el('a','okla-campaign__cta');clCta.href='/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/';clCta.textContent='Zjistit více';
  clCopy.append(clBrand,clTitle,clText,clCta);
  var clImg=el('img','okla-campaign__lilygo-hand');clImg.src=base+'v91/img/promo/lilygo-hand.webp';clImg.alt='Ruka držící LILYGO T-Embed CC1101';clImg.loading='lazy';clImg.decoding='async';
  var clTerms=el('p','okla-campaign__terms');clTerms.textContent='Vývojová platforma pro vlastní projekty. Funkce závisí na použitém firmwaru.';
  cl.append(clCopy,clImg,clTerms);

  grid.append(cf,cl);sec.appendChild(grid);
  return sec;
 }

 /* where the promo goes: before the fourth product heading, else the third, else before the magazine */
 function ref(main){
  var h=main.querySelectorAll(':scope>.homepage-group-title');
  if(h.length>3)return h[3];
  if(h.length>2)return h[2];
  return main.querySelector(':scope>#okla-news-v55');
 }

 /* in place = right before r, other OKLA homepage sections between them allowed (deals, sign-in strip, promo can want
    the same spot; requiring "directly before" made them move each other for ever) */
 function before(node,r){var n=node.nextElementSibling;while(n&&n!==r&&/^(okla-deals|okla-signin-strip|okla-promo-deals)$/.test(n.id))n=n.nextElementSibling;return n===r}
 var tries=0;
 function mount(){
  if(document.getElementById('okla-promo-deals'))return true;
  var circles=document.getElementById('okla-cat-circles');if(!circles||!circles.parentNode)return false;
  var main=circles.parentNode;
  /* wait until the product sliders have been built, so the promo lands among them */
  if(main.querySelectorAll(':scope>.okla-slider-shell').length<3&&tries<60)return false;
  var r=ref(main);if(!r)return false;
  var promo=build();main.insertBefore(promo,r);
  function fix(){
   if(promo.parentNode!==main)return;
   var rr=ref(main);if(rr&&rr!==promo&&!before(promo,rr))main.insertBefore(promo,rr);
  }
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 (function tick(){if(mount())return;if(++tries<100)setTimeout(tick,120)})();
})();
