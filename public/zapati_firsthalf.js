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
var index=0;
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
function next(){
 if(index>=modules.length){window.__oklaAssetLoaderStatus='v91-loaded';loadAi();return}
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
window.__oklaAssetLoaderStatus='v91-loading';
next();
})();
