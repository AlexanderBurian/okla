/* OKLA V91 – one canonical Shoptet bootstrap. Desktop/mobile presentation and product detail are isolated. */
(function(){
'use strict';
if(window.__oklaBootstrapV91)return;
if(window.__oklaCompleteV71){console.warn('[OKLA V91] A previous OKLA bootstrap is already running; remove duplicate Shoptet tags.');return}
window.__oklaBootstrapV91=true;
window.__oklaCompleteV71=true;
var current=document.currentScript;
var base=current&&current.src?current.src.split(/[?#]/)[0].replace(/[^/]*$/,''):'';
var aiApiUrl=current&&current.getAttribute('data-api-url');
if(!base){console.error('[OKLA V91] External loader URL required');return}
var isHome=document.body&&document.body.classList.contains('type-index');
var isDetail=!!document.querySelector('#content .p-detail');
var modules=[
 'v91/okla_i18n.css',
 'v91/okla_i18n.js',
 'legacy/v53/zapati_firsthalf.js',
 'legacy/v55/okla_news_v55.js',
 'v91/okla_mobile_unified.css',
 'v91/okla_behavior.js'
];
if(isHome) modules.push('v91/okla_home.css','v91/okla_home.js','v91/okla_home_banners.css','v91/okla_home_banners.js');
modules.push('v91/okla_home_side.css','v91/okla_home_side.js');
modules.push('okla_v86_catalog.js');
if(isDetail) modules.push('content-v91/layout.css','content-v91/catalog.js');
if(isDetail) modules.push('v91/okla_detail.css','v91/okla_detail.js');
modules.push('v91/okla_navigation.css','v91/okla_navigation.js','v91/okla_mobile_shell.css','v91/okla_mobile_shell.js','v91/okla_product_cards.css','v91/okla_sidebar.css','v91/okla_sidebar.js');
modules.push('v91/okla_search.css','v91/okla_search.js','v91/okla_login_popup.css','v91/okla_login_popup.js');
if(isDetail) modules.push('v91/okla_detail_mobile.css');
modules.push('v91/okla_cart_drawer.css','v91/okla_cart_drawer.js'); if(document.body&&document.body.classList.contains('ordering-process')) modules.push('v91/okla_checkout.css','v91/okla_cart.css','v91/okla_checkout_ui.css','v91/okla_parcel.css','v91/okla_cart_refine.css','v91/okla_checkout_layout.css','v91/okla_checkout_ui.js');modules.push('okla_footer.js');
if(/^\/newsroom(\/|\.html)?$/.test(location.pathname)) modules.push('newsroom/okla_newsroom.js');
 if(document.body&&document.body.classList.contains('in-kontakty')) modules.push('v91/okla_contact.css');
if(document.body&&/(^|\s)in-(login|registrace|zapomenute-heslo|klient)/.test(document.body.className)) modules.push('v91/okla_account.css');
if(document.body&&document.body.classList.contains('in-404')) modules.push('v91/okla_404.css');
/* Until the modules are in place a white curtain (the colour of the top of the finished page) covers the page, so a
   half-styled page never shows; the curtain covers it at once and then slowly fades away from the finished page. The page
   under it is left alone, so its backgrounds draw as always. A small spinner appears only when loading takes over 1.2 s,
   and the curtain goes after 4 s whatever happens. Once it is gone, nothing of the loader stays on the page. */
var root=document.documentElement;
var head=document.head||root;
var bootStyle=document.createElement('style');
bootStyle.textContent='html.okla-curtain::before{content:"";position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483646;background:#fff;pointer-events:auto}'+
 'html.okla-curtain.okla-shown::before{opacity:0;pointer-events:none;transition:opacity .45s cubic-bezier(.25,.1,.25,1)}'+
 'html.okla-curtain:not(.okla-shown)::after{content:"";position:fixed;left:50%;top:50%;z-index:2147483647;width:26px;height:26px;margin:-13px 0 0 -13px;border:2px solid #e9f1fb;border-top-color:#7aa7e0;border-radius:50%;opacity:0;animation:okla-boot-in .4s ease 1.2s forwards,okla-boot-spin .9s linear infinite}'+
 '@keyframes okla-boot-in{to{opacity:1}}'+
 '@keyframes okla-boot-spin{to{transform:rotate(360deg)}}'+
 '@media (prefers-reduced-motion:reduce){html.okla-curtain:not(.okla-shown)::after{animation:okla-boot-in .4s ease 1.2s forwards}}';
head.appendChild(bootStyle);
root.classList.add('okla-curtain');
var revealTimer=setTimeout(reveal,4000);
function reveal(){
 if(!revealTimer)return;
 clearTimeout(revealTimer);revealTimer=null;
 root.classList.add('okla-shown');
 setTimeout(function(){root.classList.remove('okla-curtain','okla-shown');bootStyle.remove()},600);
 window.__oklaRevealed=true;
}
/* The page fades in only after the translation layer has shown it, so a translated page appears in one step. */
function revealWhenTranslated(){
 if(!root.classList.contains('okla-i18n-pending')){reveal();return}
 new MutationObserver(function(list,observer){
  if(root.classList.contains('okla-i18n-pending'))return;
  observer.disconnect();
  reveal();
 }).observe(root,{attributes:true,attributeFilter:['class']});
}
function loadAi(){
 if(window.__oklaAiWidgetLoader||document.querySelector('okla-ai-chat'))return;
 if(!aiApiUrl){console.warn('[OKLA AI] Chybí data-api-url s adresou nasazeného AI backendu.');return}
 window.__oklaAiWidgetLoader=true;
 var aiBase=base+'ai/v1/';
 var script=document.createElement('script');
 script.src=aiBase+'widget.js?v=1';
 script.async=true;
 script.setAttribute('data-api-url',aiApiUrl.replace(/\/$/,''));
 script.setAttribute('data-asset-base-url',aiBase);
 script.onerror=function(){console.error('[OKLA AI] Widget se nepodařilo načíst.');};
 (document.head||document.documentElement).appendChild(script);
}
function url(file,attempt){return base+file+(base.includes('?')?'&':'?')+'v=91'+(attempt?'&retry='+attempt:'')}
/* Every module starts downloading at once (preload). They are still put into the page one after another in the same
   order as before, so the styles and scripts end up exactly as they always did; each step now takes the file from the
   browser's cache instead of waiting for the network. */
function preload(href,as){
 var hint=document.createElement('link');
 hint.rel='preload';hint.as=as;hint.href=href;
 head.appendChild(hint);
 return hint;
}
var hints=modules.map(function(file){return preload(url(file,0),file.endsWith('.css')?'style':'script')});
/* The language packs are requested by okla_i18n.js only after it runs; for a visitor with another language they start
   downloading now with everything else. The address matches the one okla_i18n.js asks for. */
(function(){
 var lang=null;
 try{lang=localStorage.getItem('okla-lang')}catch(e){}
 if(!lang){var m=document.cookie.match(/(?:^|;\s*)okla-lang=(\w+)/);lang=m&&m[1]}
 if(['en','sk','hu'].indexOf(lang)===-1)return;
 preload(base+'v91/okla_i18n_'+lang+'.js?v=1','script');
 preload(base+'v91/okla_i18n_products_'+lang+'.js?v=1','script');
})();
var index=0;
function next(){
 if(index>=modules.length){
  window.__oklaAssetLoaderStatus='v91-loaded';
  loadAi();
  hints.forEach(function(hint){hint.remove()});
  /* One more turn so the last scripts can draw before the page is shown. */
  setTimeout(revealWhenTranslated,30);
  return;
 }
 load(modules[index++],0);
}
/* A module that fails to load (a transient CDN error) is requested again twice before the loader moves on, so one failed
   request does not leave the page with half of its styles. */
function load(file,attempt){
 var src=url(file,attempt);
 function failed(){
  if(attempt<2){setTimeout(function(){load(file,attempt+1)},400);return}
  console.error('[OKLA] module missing:',file);
  next();
 }
 if(file.endsWith('.css')){
  var link=document.createElement('link');link.rel='stylesheet';link.href=src;
  link.onload=next;link.onerror=failed;
  head.appendChild(link);
 }else{
  var script=document.createElement('script');script.src=src;script.async=false;
  script.onload=next;script.onerror=failed;
  head.appendChild(script);
 }
}
window.__oklaAssetLoaderStatus='v91-loading';
next();
})();
