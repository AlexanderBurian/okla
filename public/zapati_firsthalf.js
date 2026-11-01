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
/* Until the modules are in place the page is hidden behind a small loader, so Shoptet's raw layout never shows. The
   class may already be set by the header snippet (okla_head.html); the page is shown after 4 s whatever happens. */
var root=document.documentElement;
var REVEAL_AFTER=4000;
function bootStyle(){
 if(document.getElementById('okla-boot-style'))return;
 var s=document.createElement('style');
 s.id='okla-boot-style';
 s.textContent='html.okla-loading body{opacity:0!important;pointer-events:none!important}'+
  'html body{transition:opacity .18s ease}'+
  'html.okla-loading::after{content:"";position:fixed;left:50%;top:50%;z-index:2147483647;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #e6eefb;border-top-color:#1f6fd8;border-radius:50%;animation:okla-boot-spin .8s linear infinite}'+
  '@keyframes okla-boot-spin{to{transform:rotate(360deg)}}'+
  '@media (prefers-reduced-motion:reduce){html.okla-loading::after{animation:none}}';
 (document.head||root).appendChild(s);
}
var revealTimer=null;
function reveal(){
 clearTimeout(revealTimer);
 root.classList.remove('okla-loading');
 root.classList.add('okla-ready');
}
bootStyle();
root.classList.add('okla-loading');
revealTimer=setTimeout(reveal,REVEAL_AFTER);
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
/* Everything is downloaded at once instead of one file after another. The stylesheets go in first, in their order; the
   scripts are fetched at the same time (preload) and run in their order once every stylesheet is in place, so a script
   always measures the finished layout. A file that fails (a transient CDN error) is requested again twice. */
var head=document.head||root;
function url(file,attempt){return base+file+(base.includes('?')?'&':'?')+'v=91'+(attempt?'&retry='+attempt:'')}
var styles=modules.filter(function(f){return /\.css$/.test(f)});
var scripts=modules.filter(function(f){return !/\.css$/.test(f)});

scripts.forEach(function(file){
 var hint=document.createElement('link');
 hint.rel='preload';hint.as='script';hint.href=url(file,0);
 head.appendChild(hint);
});

function loadStyle(file,attempt,after,done){
 var link=document.createElement('link');
 link.rel='stylesheet';link.href=url(file,attempt);
 link.onload=function(){done(link)};
 link.onerror=function(){
  if(attempt<2){setTimeout(function(){loadStyle(file,attempt+1,link,function(n){link.remove();done(n)})},400);return}
  console.error('[OKLA] module missing:',file);
  done(link);
 };
 /* A retry takes the place of the failed file, so the order of the styles stays the same. */
 if(after&&after.parentNode)after.parentNode.insertBefore(link,after.nextSibling);
 else head.appendChild(link);
 return link;
}

function loadScript(file,attempt,done){
 var script=document.createElement('script');
 script.src=url(file,attempt);script.async=false;
 script.onload=done;
 script.onerror=function(){
  if(attempt<2){setTimeout(function(){loadScript(file,attempt+1,done)},400);return}
  console.error('[OKLA] module missing:',file);
  done();
 };
 head.appendChild(script);
}

function runScripts(){
 var left=scripts.length;
 function finished(){
  window.__oklaAssetLoaderStatus='v91-loaded';
  loadAi();
  /* One more turn so the last scripts can draw before the page is shown. */
  setTimeout(reveal,30);
 }
 if(!left){finished();return}
 scripts.forEach(function(file){loadScript(file,0,function(){if(--left===0)finished()})});
}

window.__oklaAssetLoaderStatus='v91-loading';
(function(){
 var left=styles.length;
 if(!left){runScripts();return}
 styles.forEach(function(file){loadStyle(file,0,null,function(){if(--left===0)runScripts()})});
})();
})();
