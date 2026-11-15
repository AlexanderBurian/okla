/* OKLA - homepage promo island: a two-card feature block (Flipper Zero + LILYGO T-Embed) built from the supplied
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
  sec.setAttribute('aria-label','Flipper Zero a LILYGO T-Embed');
  var grid=el('div','okla-campaign__grid');

  /* Flipper Zero */
  var cf=el('article','okla-campaign__card okla-campaign__card--flipper');
  var cfCopy=el('div','okla-campaign__flipper-copy');
  var cfBrand=el('h2','okla-campaign__brand');cfBrand.textContent='Flipper Zero';
  var cfKick=el('p','okla-campaign__kicker');
  cfKick.innerHTML='<span class="okla-campaign__kicker-hot">Sub‑GHz</span> · <span class="okla-campaign__kicker-cool">NFC · RFID · IR</span>';
  var cfText=el('p','okla-campaign__text');cfText.innerHTML='Multitool pro elektroniku,<br>experimenty a svět signálů.';
  var cfCta=el('a','okla-campaign__cta');cfCta.href='/flipper-zero-kapesni-multitool-pro-elektroniku/';cfCta.textContent='Prozkoumat';
  cfCopy.append(cfBrand,cfKick,cfText,cfCta);
  var cfImg=el('img','okla-campaign__flipper');cfImg.src=base+'v91/img/promo/flipper-zero.png';cfImg.alt='Flipper Zero';cfImg.loading='lazy';cfImg.decoding='async';
  var cfFine=el('p','okla-campaign__fineprint');cfFine.innerHTML='Určeno pro vývoj, testování a vlastní zařízení.<br>Používejte v souladu s platnými předpisy.';
  cf.append(cfCopy,cfImg,cfFine);

  /* LILYGO T-Embed */
  var cl=el('article','okla-campaign__card okla-campaign__card--lilygo');
  var clCopy=el('div','okla-campaign__lilygo-copy');
  var clBrand=el('p','okla-campaign__lilygo-brand');clBrand.innerHTML='LILYGO <em>T‑Embed</em>';
  var clTitle=el('h2','okla-campaign__lilygo-title');clTitle.innerHTML='Malý formát.<br>Velký prostor pro nápady.';
  var clText=el('p','okla-campaign__lilygo-text');clText.textContent='ESP32‑S3, CC1101, barevný displej a otočný enkodér v jedné otevřené platformě.';
  var clCta=el('a','okla-campaign__cta');clCta.href='/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/';clCta.textContent='Zjistit více';
  clCopy.append(clBrand,clTitle,clText,clCta);
  var clImg=el('img','okla-campaign__lilygo-hand');clImg.src=base+'v91/img/promo/lilygo-hand.png';clImg.alt='Ruka držící LILYGO T-Embed CC1101';clImg.loading='lazy';clImg.decoding='async';
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
   var rr=ref(main);if(rr&&rr!==promo&&promo.nextElementSibling!==rr)main.insertBefore(promo,rr);
  }
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 (function tick(){if(mount())return;if(++tries<100)setTimeout(tick,120)})();
})();
