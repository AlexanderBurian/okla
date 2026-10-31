/* OKLA V91 – one canonical Shoptet bootstrap. Desktop/mobile presentation and product detail are isolated. */
(function(){
'use strict';
if(window.__oklaBootstrapV91)return;
if(window.__oklaCompleteV71){console.warn('[OKLA V91] A previous OKLA bootstrap is already running; remove duplicate Shoptet tags.');return}
window.__oklaBootstrapV91=true;
window.__oklaCompleteV71=true;
var current=document.currentScript;
var base=current&&current.src?current.src.split(/[?#]/)[0].replace(/[^/]*$/,''):'';
if(!base){console.error('[OKLA V91] External loader URL required');return}
var isHome=document.body&&document.body.classList.contains('type-index');
var isDetail=!!document.querySelector('#content .p-detail');
var modules=[
 'legacy/v53/zapati_firsthalf.js',
 'legacy/v55/okla_news_v55.js',
 'v91/okla_mobile_unified.css',
 'v91/okla_behavior.js'
];
if(isHome) modules.push('v91/okla_home.css','v91/okla_home.js','v91/okla_home_side.css','v91/okla_home_side.js','v91/okla_home_banners.css','v91/okla_home_banners.js');
modules.push('okla_v86_catalog.js');
if(isDetail) modules.push('content-v91/layout.css','content-v91/catalog.js');
if(isDetail) modules.push('v91/okla_detail.css','v91/okla_detail.js');
modules.push('v91/okla_navigation.css','v91/okla_navigation.js','v91/okla_mobile_shell.css','v91/okla_mobile_shell.js');
var index=0;
function next(){
 if(index>=modules.length){window.__oklaAssetLoaderStatus='v91-loaded';fixFlipperPhoto();return}
 load(modules[index++],0);
}
/* A module that fails to load (a transient CDN error) is requested again twice before the loader moves on, so one failed
   request does not leave the page with half of its styles. */
function load(file,attempt){
 var url=base+file+(base.includes('?')?'&':'?')+'v=91'+(attempt?'&retry='+attempt:'');
 function failed(){
  if(attempt<2){setTimeout(function(){load(file,attempt+1)},400);return}
  console.error('[OKLA] module missing:',file);
  next();
 }
 if(file.endsWith('.css')){
  var link=document.createElement('link');link.rel='stylesheet';link.href=url;
  link.onload=next;link.onerror=failed;
  (document.head||document.documentElement).appendChild(link);
 }else{
  var script=document.createElement('script');script.src=url;script.async=false;
  script.onload=next;script.onerror=failed;
  (document.head||document.documentElement).appendChild(script);
 }
}

/* Correct complete Flipper Zero photograph for cards and the main product image. */
function fixFlipperPhoto(){
 var url='https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@32753e1217ef69f24ed8aa78062ea4a054285a45/public/content-v91/products/OKL-001-2.png';
 var images=Array.from(document.querySelectorAll('a[href*="/flipper-zero-kapesni-multitool-pro-elektroniku"] img'));
 var sku=document.querySelector('[itemprop="sku"]');
 if(sku&&sku.textContent.trim()==='OKL-001'){
  document.querySelectorAll('.p-main-image img').forEach(function(img){images.push(img);var a=img.closest('a');if(a)a.href=url});
 }
 images.forEach(function(img){
  if(img.getAttribute('src')===url&&!img.hasAttribute('srcset'))return;
  img.src=url;img.removeAttribute('srcset');img.alt='Flipper Zero – celý přístroj';
  if(img.hasAttribute('data-src'))img.setAttribute('data-src',url);
  if(img.hasAttribute('data-srcset'))img.setAttribute('data-srcset',url);
  var picture=img.closest('picture');if(picture)picture.querySelectorAll('source').forEach(function(source){source.srcset=url});
 });
 if(window.OKLA_V86_CATALOG&&window.OKLA_V86_CATALOG['OKL-001'])window.OKLA_V86_CATALOG['OKL-001'].image=url;
}
fixFlipperPhoto();
var flipperPhotoQueued=false;
new MutationObserver(function(){
 if(flipperPhotoQueued)return;flipperPhotoQueued=true;
 requestAnimationFrame(function(){flipperPhotoQueued=false;fixFlipperPhoto()});
}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});

window.__oklaAssetLoaderStatus='v91-loading';
next();
})();