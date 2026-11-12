/* OKLA – the one storefront loader (Shoptet: HTML kód > zápatí). Everything OKLA adds to the Shoptet shop starts here.

   1. Start-up       asset address, AI wake-up, tablet viewport, desktop scaling, logo
   2. Page           which kind of page this is (home, product, checkout, ...)
   3. Bundles        what loads where: the code in categories, in its fixed order (the table below)
   4. Curtain        a white cover until the page is finished, so a half-styled page never shows
   5. Loading        bundles (and the stored look from the device), then the AI chat

   The sources live in v91/, legacy/, content-v91/ and newsroom/. tools/build.js joins and minifies them per category
   into public/dist/<bundle>.css|.js; this loader loads only those. Opening the shop with ?okla-src=1 (once, it is
   remembered; ?okla-src=0 turns it off) loads the original source files one by one instead, for debugging. */
(function(){
'use strict';

/* ---- 1. Start-up ---------------------------------------------------------------------------------------------- */
if(window.__oklaBootstrapV91)return;
if(window.__oklaCompleteV71){console.warn('[OKLA V91] A previous OKLA bootstrap is already running; remove duplicate Shoptet tags.');return}
window.__oklaBootstrapV91=true;
window.__oklaCompleteV71=true;
var current=document.currentScript;
var base=current&&current.src?current.src.split(/[?#]/)[0].replace(/[^/]*$/,''):'';
var aiApiUrl=current&&current.getAttribute('data-api-url');
if(!base){console.error('[OKLA V91] External loader URL required');return}
window.__oklaAssetBase=base;
window.__oklaApiUrl=(aiApiUrl||'').replace(/\/$/,'');
/* Wake the Render service while the storefront modules are still loading, so
   the first customer message does not pay the cold-start delay. */
if(window.__oklaApiUrl){try{fetch(window.__oklaApiUrl+'/health',{mode:'cors',cache:'no-store'}).catch(function(){})}catch(e){}}
/* Touch tablets held upright (768-991 px wide) fall between the phone layout
   (<=767 px) and the desktop one (>=992 px) and get a mix of both. They get the
   polished phone layout instead: the viewport is laid out 767 px wide (about
   1:1 on such a tablet). Re-evaluated when the tablet is turned. */
(function(){
 try{
  var meta=document.querySelector('meta[name="viewport"]');
  if(!meta||!window.matchMedia||!matchMedia('(pointer:coarse)').matches)return;
  var orig=meta.getAttribute('content')||'width=device-width,initial-scale=1';
  var land=matchMedia('(orientation: landscape)');
  function deviceWidth(){var a=screen.width||0,b=screen.height||0;return land.matches?Math.max(a,b):Math.min(a,b)}
  function fit(){var w=deviceWidth(),want=(w>=768&&w<=991)?'width=767':orig;if(meta.getAttribute('content')!==want)meta.setAttribute('content',want)}
  fit();
  if(land.addEventListener)land.addEventListener('change',fit);
  window.addEventListener('orientationchange',function(){setTimeout(fit,60)});
 }catch(e){}
})();
/* Desktop (>=992 px): the whole page scales with the window, proportionally to
   the 1920 px design - a 1366 px laptop shows the same page at 71 % - so content
   and margins keep the same ratio. It only ever scales DOWN: windows of 1920 px
   and wider show the page at its natural 100 % size.
   The page itself (.overall-wrapper: header, content, footer) gets CSS zoom;
   overlays outside it (cart drawer, search, cookies, chat) keep their size.
   Scripts that measure the page divide by element.currentCSSZoom. */
(function(){
 var REF=1920,MIN=0.66,MAX=1,root=document.documentElement;
 var st=document.createElement('style');st.id='okla-desktop-scale';
 st.textContent='@media(min-width:992px){html.okla-dz-on .overall-wrapper,html.okla-dz-on body>#footer{zoom:var(--okla-dz)}}';
 (document.head||root).appendChild(st);
 function apply(){
  var w=window.innerWidth||root.clientWidth;
  var z=w>=992?Math.max(MIN,Math.min(MAX,w/REF)):1;
  z=Math.round(z*10000)/10000;
  root.style.setProperty('--okla-dz',String(z));
  root.classList.toggle('okla-dz-on',z!==1);
  window.__oklaDZ=z;
 }
 apply();window.addEventListener('resize',apply);
 /* jQuery UI sliders (price filter) mix screen px (mouse, offset) with the
    zoomed element's own px (width); convert the mouse position so the handle
    follows the cursor exactly. */
 function patchSlider(){
  var $=window.jQuery;if(!$||!$.ui||!$.ui.slider)return false;
  var P=$.ui.slider.prototype;if(P.__oklaDZ)return true;
  var orig=P._normValueFromMouse;
  P._normValueFromMouse=function(pos){
   var el=this.element&&this.element[0],z=(el&&el.currentCSSZoom)||1,o=this.elementOffset;
   if(z!==1&&o)pos={x:o.left+(pos.x-o.left)/z,y:o.top+(pos.y-o.top)/z};
   return orig.call(this,pos);
  };
  P.__oklaDZ=true;return true;
 }
 if(!patchSlider()){var sTries=0,sTimer=setInterval(function(){if(patchSlider()||++sTries>60)clearInterval(sTimer)},250);}
})();
/* The shop's uploaded logo (user/logos/…) is missing on the live site, so the header shows a broken image. We serve the
   OKLA logo from the bundle instead and repoint every logo image to it — the desktop header, the mobile header and any
   copy it makes. Runs now and on later DOM changes (the mobile header is built after load). */
(function(){
 var logoUrl=base+'v91/img/okla-logo.png';
 function fixLogo(){
  var imgs=document.querySelectorAll('img[src*="/user/logos/"],img[src*="preforma-logo"],#okla-v61-header .okm61-logo img,#header .okm61-logo img');
  for(var i=0;i<imgs.length;i++){var im=imgs[i];if(im.getAttribute('src')!==logoUrl){im.removeAttribute('srcset');im.src=logoUrl;im.alt=im.alt||'OKLA.cz'}}
 }
 function start(){
  fixLogo();
  if(!window.MutationObserver||!document.body)return;
  var pending=false;
  new MutationObserver(function(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;fixLogo()})}).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 window.addEventListener('load',fixLogo);
})();

/* ---- 2. Page -------------------------------------------------------------------------------------------------- */
var body=document.body,path=location.pathname;
function bodyIs(re){return !!(body&&re.test(body.className))}
var PAGE={
 all:true,
 home:!!(body&&body.classList.contains('type-index')),
 product:!!document.querySelector('#content .p-detail'),
 checkout:!!(body&&body.classList.contains('ordering-process')),
 /* /newsroom and the Shoptet article list /nase-novinky/ */
 newsroom:/^\/(newsroom|nase-novinky)(\/|\.html)?$/.test(path),
 article:/^\/nase-novinky\/[^/]+\/?$/.test(path),
 orderStatus:/^\/stav-objednavky(\/|$)/.test(path)||bodyIs(/(^|\s)in-login(\s|$)/)||!!document.querySelector('[data-okla-order-status]'),
 complaint:/^\/reklamace(\/|$)/.test(path)||!!document.querySelector('[data-okla-reklamace]'),
 orders:/^\/objednavky(\/|$)/.test(path)||bodyIs(/(^|\s)in-(klient|objednavky)/),
 about:/^\/o-nas(\/|$)/.test(path),
 howToBuy:/^\/jak-nakupovat(\/|$)/.test(path),
 contact:bodyIs(/(^|\s)in-kontakt(\s|$)/)||/^\/kontakt(y)?(\/|$)/.test(path),
 account:bodyIs(/(^|\s)in-(login|registrace|zapomenute-heslo|klient|objednavky|platby|osobni-udaje|danove-doklady|zalohove-faktury|dobropisy|dodaci-listy|slevy|hodnoceni|diskuze|doklady|muj-ucet|zakaznik)/)||(function(){try{var a=document.querySelectorAll('#content-wrapper a,#content a,.sidebar a');for(var i=0;i<a.length;i++){if(/^\s*odhl[aá]sit/i.test(a[i].textContent))return true}}catch(e){}return false})(),
 signIn:bodyIs(/(^|\s)in-(login|registrace)(\s|$)/),
 notFound:!!(body&&body.classList.contains('in-404')),
 /* every native legal / information article uses the full content card width */
 legal:/^\/(?:obchodni-podminky|podminky-ochrany-osobnich-udaju|reklamacni-rad|vraceni-zbozi-a-odstoupeni|podminky-reklamnich-akci|prohlaseni-o-pristupnosti|doprava-a-platba)(?:\/|$)/.test(path),
 /* "Objednávka odeslána" (/objednavka/dekujeme/, after an order is sent) */
 thankYou:/^\/objednavka\/dekujeme\/?$/.test(path)||bodyIs(/(^|\s)in-dekujeme(\s|$)/)||/objedn\S* (byla )?odesl/i.test((document.querySelector('#content h1')||{}).textContent||'')
};
if(PAGE.legal)document.documentElement.classList.add('okla-legal-wide');

/* ---- 3. Bundles ----------------------------------------------------------------------------------------------- */
/* What loads where. [bundle, page, files]: each bundle is loaded on the pages named (see PAGE above) and contains
   these files in this order. The order of the whole table is the order of the page's styles and scripts and must stay
   as it is: later styles override earlier ones. The last bundle ("later") loads only after the page is shown.
   After editing this table run: node tools/build.js */
/*@bundles*/
var BUNDLES=[
 /* Core: translations, the original storefront core, the base phone look, shared behaviour */
 ['01-core','all',['v91/okla_i18n.css','v91/okla_i18n.js','legacy/v53/zapati_firsthalf.js','legacy/v55/okla_news_v55.js','v91/okla_mobile_unified.css','v91/okla_behavior.js']],
 /* Homepage: news images, layout, banners, search */
 ['02-home','home',['v91/okla_news_native_images.js','v91/okla_home.css','v91/okla_home.js','v91/okla_home_banners.css','v91/okla_home_banners.js','v91/okla_home_search.js']],
 /* Side banners and the product catalogue (prices, stock, names) */
 ['03-catalog','all',['v91/okla_home_side.css','v91/okla_home_side.js','okla_v86_catalog.js','v91/okla_live_catalog.js']],
 /* Product page: content, layout, cross-sell */
 ['04-product','product',['content-v91/layout.css','content-v91/catalog.js','v91/okla_detail.css','v91/okla_detail.js','v91/okla_cross_sell.css','v91/okla_cross_sell.js']],
 /* Navigation, phone shell, product cards, native pages, sidebar */
 ['05-layout','all',['v91/okla_navigation.css','v91/okla_navigation.js','v91/okla_mobile_shell.css','v91/okla_mobile_shell.js','v91/okla_product_cards.css','v91/okla_native_pages.css','v91/okla_cards_everywhere.css','v91/okla_native_pages.js','v91/okla_sidebar.css','v91/okla_sidebar.js']],
 /* Product page on phones */
 ['06-product-phone','product',['v91/okla_detail_mobile.css']],
 /* Cart and checkout */
 ['07-checkout','checkout',['v91/okla_checkout.css','v91/okla_cart.css','v91/okla_checkout_ui.css','v91/okla_parcel.css','v91/okla_cart_refine.css','v91/okla_checkout_layout.css','v91/okla_checkout_ui.js']],
 /* Pages of their own */
 ['08-newsroom','newsroom',['newsroom/okla_newsroom.js']],
 ['09-article','article',['v91/okla_article_hero.js','v91/okla_article_products.css','v91/okla_article_products.js']],
 ['10-order-status','orderStatus',['v91/okla_order_status.css','v91/okla_order_status.js']],
 ['11-complaint','complaint',['v91/okla_reklamace.css','v91/okla_reklamace.js']],
 ['12-orders','orders',['v91/okla_orders.css','v91/okla_orders.js']],
 ['13-about','about',['v91/okla_about.css','v91/okla_about.js']],
 ['14-how-to-buy','howToBuy',['v91/okla_how_to_buy.css','v91/okla_how_to_buy.js']],
 ['15-contact','contact',['v91/okla_contact.css','v91/okla_contact.js']],
 ['16-account','account',['v91/okla_account.css','v91/okla_account.js','v91/okla_account_polish.css','v91/okla_account_polish.js','v91/okla_account_nav.css','v91/okla_account_nav.js']],
 /* Login and registration: social sign-in row, isolated page (logo + card) */
 ['17-sign-in','signIn',['v91/okla_login_social.css','v91/okla_login_social.js','v91/okla_auth_pages.css','v91/okla_auth_pages.js']],
 ['18-not-found','notFound',['v91/okla_404.css']],
 /* Empty states, payment logos, the shared header, the desktop hover cart */
 ['19-shared','all',['v91/okla_empty_states.css','v91/okla_empty_states.js','v91/okla_payment_logos.css','v91/okla_payment_logos.js','v91/okla_header_consistency.css','v91/okla_header_consistency.js','v91/okla_header_reference.css','v91/okla_header_reference.js','v91/okla_cart_preview.css','v91/okla_cart_preview.js']],
 ['20-legal','legal',['v91/okla_legal_fullwidth.css']],
 /* Final header, sticky navbar, phone footer and menu, buttons and fields, phone content rail, phone bottom bar and panels */
 ['21-polish','all',['v91/okla_language_polish.css','v91/okla_header_final.css','v91/okla_header_final.js','v91/okla_header_template103.css','v91/okla_header_template103.js','v91/okla_desktop_sticky.css','v91/okla_desktop_sticky.js','v91/okla_mobile_policies.css','v91/okla_mobile_policies.js','v91/okla_footer_mobile_promo.css','v91/okla_footer_mobile_promo.js','v91/okla_footer_i18n_safe.css','v91/okla_button_consistency.css','v91/okla_button_consistency.js','v91/okla_field_consistency.css','v91/okla_password_toggle.js','v91/okla_mobile_menu.css','v91/okla_mobile_menu.js','v91/okla_mobile_gradient.css','v91/okla_mobile_gradient.js','v91/okla_mobile_content_width.css','v91/okla_mobile_tabbar.css','v91/okla_mobile_tabbar.js']],
 /* Product page: tabs, tools (print, ask, watch, share), buy bar */
 ['22-product-extras','product',['v91/okla_detail_tabs.css','v91/okla_detail_tabs.js','v91/okla_product_tools.css','v91/okla_product_tools.js','v91/okla_desktop_buybar.css','v91/okla_desktop_buybar.js']],
 /* Typeface, text contrast, dead links, product prices and buttons */
 ['23-finish','all',['v91/okla_global_typography.css','v91/okla_text_contrast.js','v91/okla_deadlink_guard.js','v91/okla_product_commerce.css']],
 ['24-checkout-fix','checkout',['v91/okla_checkout_final.css']],
 /* Call-to-action buttons: colour and shape */
 ['25-buttons','all',['v91/okla_green_buttons.js','v91/okla_all_cta_blue.css','v91/okla_cta_shape.js']],
 /* Checkout skin */
 ['26-checkout-skin','checkout',['v91/okla_cart_simple.css','v91/okla_checkout_alza.js']],
 ['27-thank-you','thankYou',['v91/okla_thank_you.css','v91/okla_thank_you.js']],
 /* No zoom on phone fields, AI chat branding */
 ['28-last','all',['v91/okla_mobile_no_zoom.css','v91/okla_ai_brand.js']],
 /* Homepage editorial blocks */
 ['29-home-magazine','home',['v91/okla_news_home_datart.css','v91/okla_home_retail_refresh.css','v91/okla_home_retail_refresh.js']],
 /* Not needed for the first view: search, login popup, cart drawer, footer (loaded after the page is shown) */
 ['99-later','all',['v91/okla_search.css','v91/okla_search.js','v91/okla_login_popup.css','v91/okla_login_popup.js','v91/okla_cart_drawer.css','v91/okla_cart_drawer.js','okla_footer.js']]
];
/*@end*/

/* ---- 4. Curtain ----------------------------------------------------------------------------------------------- */
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

/* ---- 5. Loading ----------------------------------------------------------------------------------------------- */
function loadAi(){
 if(window.__oklaAiWidgetLoader||document.querySelector('okla-ai-chat'))return;
 /* No AI assistant in the cart and the whole order process (cart, shipping and payment, customer details, the
    thank-you page), on PC or phones. */
 if((document.body&&document.body.classList.contains('ordering-process'))||/^\/(kosik|objednavka)(\/|$)/i.test(location.pathname))return;
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
function isCss(f){return f.endsWith('.css')}
/* Files to load, in order: the bundles of this page (dist/<bundle>.css and .js), or - in source mode - the original
   files one by one. The "later" bundle is kept apart. */
var sourceMode=false;
try{
 var sm=/[?&]okla-src=([01])/.exec(location.search);
 if(sm)localStorage.setItem('okla-src',sm[1]);
 sourceMode=localStorage.getItem('okla-src')==='1';
}catch(e){}
var modules=[],deferred=[];
BUNDLES.forEach(function(b){
 if(!PAGE[b[1]])return;
 var list=b[0]==='99-later'?deferred:modules,files=b[2];
 if(sourceMode){files.forEach(function(f){list.push(f)});return}
 if(files.some(isCss))list.push('dist/'+b[0]+'.css');
 if(files.some(function(f){return !isCss(f)}))list.push('dist/'+b[0]+'.js');
});
function preload(href,as,priority){
 var hint=document.createElement('link');
 hint.rel='preload';hint.as=as;hint.href=href;
 if(priority)hint.fetchPriority=priority;
 head.appendChild(hint);
 return hint;
}
/* The "later" files start downloading now, so they are ready in the browser cache when they are added - at low
   priority, so on a slow connection they do not hold up the files the page waits for. */
var hints=deferred.map(function(file){return preload(url(file,0),isCss(file)?'style':'script','low')});
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

/* Instant look from the device (localStorage). The look of the shop is its CSS. We keep every stylesheet's text on the
   visitor's own device, under a key that carries THIS release (the commit hash is part of `base`). On the next visit
   the whole look is injected in ONE <style> straight from the device — no network, no flash, the same rules in the
   same order. A new release has a new key, so the stored look refreshes itself once after each change and is instant
   again afterwards. It is all-or-nothing per release, so the cascade order can never be partly inlined and partly
   linked. If storage is full or disabled, everything simply loads from the network. */
var CSS_CACHE_KEY='okla.css.cache3';
var cssHave={};         /* file -> text already on the device (this release) */
var cssCachedOk=false;  /* the device holds CSS for this exact release */
try{
 var raw=localStorage.getItem(CSS_CACHE_KEY);
 if(raw){var parsed=JSON.parse(raw);if(parsed&&parsed.fp===base&&parsed.css){cssHave=parsed.css;cssCachedOk=true}}
 /* the store of the previous loader version is not read any more */
 localStorage.removeItem('okla.css.cache2');
}catch(e){cssCachedOk=false;cssHave={}}
var cssFresh={};        /* CSS text read during this visit, to store for next time */

function allCssCached(list){
 if(!cssCachedOk)return false;
 for(var i=0;i<list.length;i++){var f=list[i];if(isCss(f)&&cssHave[f]==null)return false}
 return true;
}
/* An @import (the web font) counts only at the very top of a stylesheet, so in the one joined <style> it goes first. */
function injectCachedCss(list,id){
 var covered=[],imports='',buf='';
 for(var i=0;i<list.length;i++){var f=list[i];if(isCss(f)&&cssHave[f]!=null){
  var css=cssHave[f].replace(/@import\s+(?:url\([^)]*\)|(['"])[^'"]*\1)[^;]*;/g,function(m){imports+=m+'\n';return ''});
  buf+='\n/* '+f+' */\n'+css;covered.push(f)}}
 if(buf){var st=document.createElement('style');st.id=id;st.setAttribute('data-okla-css-cache','1');st.textContent=imports+buf;head.appendChild(st)}
 return covered;
}
/* A stylesheet's url(...) references are RELATIVE to the stylesheet's own address. As a <link> they resolve against the
   CDN; injected inline from the device they would resolve against the shop's own URL and 404. So before the text is
   stored, every relative url() (and @import) is rewritten to its absolute CDN address — leaving data:, http(s):,
   protocol-relative and #fragment references untouched. */
function absolutizeCss(css,cssUrl){
 css=css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,function(m,q,ref){
  var r=ref.trim();
  if(!r||/^(data:|https?:|\/\/|#)/i.test(r))return m;
  try{return 'url("'+new URL(r,cssUrl).href+'")'}catch(e){return m}
 });
 css=css.replace(/@import\s+(['"])([^'"]+)\1/g,function(m,q,ref){
  var r=ref.trim();
  if(!r||/^(data:|https?:|\/\/)/i.test(r))return m;
  try{return '@import "'+new URL(r,cssUrl).href+'"'}catch(e){return m}
 });
 return css;
}
/* Best-effort: read a stylesheet we just loaded (from cache) so it can be stored for an instant next visit. */
function grabCss(file){
 if(cssHave[file]!=null||cssFresh[file]!=null)return;
 var abs=url(file,0);
 try{fetch(abs,{cache:'force-cache'}).then(function(r){return r.ok?r.text():null}).then(function(t){if(t!=null)cssFresh[file]=absolutizeCss(t,abs)}).catch(function(){})}catch(e){}
}
function saveCssCache(){
 setTimeout(function(){
  try{
   var css={},any=false,k;
   if(cssCachedOk){for(k in cssHave)css[k]=cssHave[k]}
   for(k in cssFresh){css[k]=cssFresh[k];any=true}
   if(!any)return;
   localStorage.setItem(CSS_CACHE_KEY,JSON.stringify({fp:base,css:css}));
  }catch(e){try{localStorage.removeItem(CSS_CACHE_KEY)}catch(e2){}}
 },1500);
}

/* If the device already has this release's full look, paint it at once. */
var mainCssHit=allCssCached(modules);
var cachedNow=mainCssHit?injectCachedCss(modules,'okla-css-cache-main'):[];

/* The "later" files load after the page is shown, using the stored look when the device holds all of it. */
function loadDeferred(){
 var coveredDef=allCssCached(deferred)?injectCachedCss(deferred,'okla-css-cache-deferred'):[];
 deferred.forEach(function(file){
  if(coveredDef.indexOf(file)>=0)return;
  var src=url(file,0);
  if(isCss(file)){var link=document.createElement('link');link.rel='stylesheet';link.href=src;link.onload=function(){grabCss(file)};head.appendChild(link);}
  else{var s=document.createElement('script');s.src=src;s.async=false;head.appendChild(s);}
 });
}
function finalize(){
 window.__oklaAssetLoaderStatus='v91-loaded';
 loadAi();
 hints.forEach(function(hint){hint.remove()});
 /* One more turn so the last scripts can draw before the page is shown. */
 setTimeout(revealWhenTranslated,30);
 loadDeferred();
 saveCssCache();
}
/* Load the rest — every script, plus any stylesheet not served from the device — ALL AT ONCE in order. Scripts keep
   their exact order via async=false; a transient CDN error is retried twice. The page is revealed once everything has
   settled. */
var toLoad=modules.filter(function(f){return cachedNow.indexOf(f)<0});
var pending=toLoad.length;
function settle(){if(--pending<=0)finalize()}
/* The page waits for these files (under the curtain): they are fetched before images and other page content. */
function loadOne(file,attempt){
 var src=url(file,attempt);
 function failed(){
  if(attempt<2){setTimeout(function(){loadOne(file,attempt+1)},400);return}
  console.error('[OKLA] module missing:',file);settle();
 }
 if(isCss(file)){
  var link=document.createElement('link');link.rel='stylesheet';link.href=src;link.fetchPriority='high';
  link.onload=function(){grabCss(file);settle()};link.onerror=failed;
  head.appendChild(link);
 }else{
  var script=document.createElement('script');script.src=src;script.async=false;script.fetchPriority='high';
  script.onload=settle;script.onerror=failed;
  head.appendChild(script);
 }
}
window.__oklaAssetLoaderStatus='v91-loading';
if(pending===0)finalize();
else toLoad.forEach(function(file){loadOne(file,0)});
})();
