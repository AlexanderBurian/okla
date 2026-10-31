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
if(isDetail) modules.push('v91/okla_detail.css','v91/okla_detail.js');
modules.push('v91/okla_navigation.css','v91/okla_navigation.js','v91/okla_mobile_shell.css','v91/okla_mobile_shell.js');
var index=0;
function next(){
 if(index>=modules.length){window.__oklaAssetLoaderStatus='v91-loaded';return}
 var file=modules[index++],url=base+file+(base.includes('?')?'&':'?')+'v=91';
 if(file.endsWith('.css')){
  var link=document.createElement('link');link.rel='stylesheet';link.href=url;
  link.onload=next;link.onerror=function(){console.error('[OKLA] CSS missing:',file);next()};
  (document.head||document.documentElement).appendChild(link);
 }else{
  var script=document.createElement('script');script.src=url;script.async=false;
  script.onload=next;script.onerror=function(){console.error('[OKLA] JS missing:',file);next()};
  (document.head||document.documentElement).appendChild(script);
 }
}
window.__oklaAssetLoaderStatus='v91-loading';
next();
})();