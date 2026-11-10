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
window.__oklaAssetBase=base;
window.__oklaApiUrl=(aiApiUrl||'').replace(/\/$/,'');
/* Wake the Render service while the storefront modules are still loading, so
   the first customer message does not pay the cold-start delay. */
if(window.__oklaApiUrl){try{fetch(window.__oklaApiUrl+'/health',{mode:'cors',cache:'no-store'}).catch(function(){})}catch(e){}}
/* Desktop (>=992 px): the whole page scales with the window, proportionally to
   the 1920 px design - a 1366 px laptop shows the same page at 71 %, a 2560 px
   monitor at 133 % - so content and margins keep the same ratio everywhere.
   The page itself (.overall-wrapper: header, content, footer) gets CSS zoom;
   overlays outside it (cart drawer, search, cookies, chat) keep their size.
   Scripts that measure the page divide by element.currentCSSZoom. */
(function(){
 var REF=1920,MIN=0.66,MAX=1.5,root=document.documentElement;
 var st=document.createElement('style');st.id='okla-desktop-scale';
 st.textContent='@media(min-width:992px){html.okla-dz-on .overall-wrapper{zoom:var(--okla-dz)}}';
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
var isHome=document.body&&document.body.classList.contains('type-index');
var isDetail=!!document.querySelector('#content .p-detail');
var isOrdering=document.body&&document.body.classList.contains('ordering-process');
var modules=[
 'v91/okla_i18n.css',
 'v91/okla_i18n.js',
 'legacy/v53/zapati_firsthalf.js',
 'legacy/v55/okla_news_v55.js',
 'v91/okla_mobile_unified.css',
 'v91/okla_behavior.js'
];
if(isHome) modules.push('v91/okla_news_native_images.js');
if(isHome) modules.push('v91/okla_home.css','v91/okla_home.js','v91/okla_home_banners.css','v91/okla_home_banners.js','v91/okla_home_search.js');
modules.push('v91/okla_home_side.css','v91/okla_home_side.js');
modules.push('okla_v86_catalog.js','v91/okla_live_catalog.js');
if(isDetail) modules.push('content-v91/layout.css','content-v91/catalog.js');
if(isDetail) modules.push('v91/okla_detail.css','v91/okla_detail.js');
if(isDetail) modules.push('v91/okla_cross_sell.css','v91/okla_cross_sell.js');
modules.push('v91/okla_navigation.css','v91/okla_navigation.js','v91/okla_mobile_shell.css','v91/okla_mobile_shell.js','v91/okla_product_cards.css','v91/okla_native_pages.css','v91/okla_cards_everywhere.css','v91/okla_native_pages.js','v91/okla_sidebar.css','v91/okla_sidebar.js');
modules.push('v91/okla_search.css','v91/okla_search.js','v91/okla_login_popup.css','v91/okla_login_popup.js');
if(isDetail) modules.push('v91/okla_detail_mobile.css');
modules.push('v91/okla_cart_drawer.css','v91/okla_cart_drawer.js'); if(document.body&&document.body.classList.contains('ordering-process')) modules.push('v91/okla_checkout.css','v91/okla_cart.css','v91/okla_checkout_ui.css','v91/okla_parcel.css','v91/okla_cart_refine.css','v91/okla_checkout_layout.css','v91/okla_checkout_ui.js');modules.push('okla_footer.js');
if(/^\/newsroom(\/|\.html)?$/.test(location.pathname)) modules.push('newsroom/okla_newsroom.js');
if(/^\/nase-novinky\/[^/]+\/?$/.test(location.pathname)) modules.push('v91/okla_article_hero.js');
if(/^\/stav-objednavky(\/|$)/.test(location.pathname)||(document.body&&/(^|\s)in-login(\s|$)/.test(document.body.className))||document.querySelector('[data-okla-order-status]')) modules.push('v91/okla_order_status.css','v91/okla_order_status.js');
if(/^\/reklamace(\/|$)/.test(location.pathname)||document.querySelector('[data-okla-reklamace]')) modules.push('v91/okla_reklamace.css','v91/okla_reklamace.js');
if(/^\/objednavky(\/|$)/.test(location.pathname)||(document.body&&/(^|\s)in-(klient|objednavky)/.test(document.body.className))) modules.push('v91/okla_orders.css','v91/okla_orders.js');
if(/^\/o-nas(\/|$)/.test(location.pathname)) modules.push('v91/okla_about.css','v91/okla_about.js');
/* "Jak nakupovat": the page content and the homepage Novinky slider. */
if(/^\/jak-nakupovat(\/|$)/.test(location.pathname)) modules.push('v91/okla_how_to_buy.css','v91/okla_how_to_buy.js');
 if((document.body&&document.body.classList.contains('in-kontakt'))||/^\/kontakt(y)?(\/|$)/.test(location.pathname)) modules.push('v91/okla_contact.css','v91/okla_contact.js');
if((document.body&&/(^|\s)in-(login|registrace|zapomenute-heslo|klient|objednavky|platby|osobni-udaje|danove-doklady|zalohove-faktury|dobropisy|dodaci-listy|slevy|hodnoceni|diskuze|doklady|muj-ucet|zakaznik)/.test(document.body.className))||(function(){try{var a=document.querySelectorAll('#content-wrapper a,#content a,.sidebar a');for(var i=0;i<a.length;i++){if(/^\s*odhl[aá]sit/i.test(a[i].textContent))return true}}catch(e){}return false})()) modules.push('v91/okla_account.css','v91/okla_account.js','v91/okla_account_polish.css','v91/okla_account_polish.js','v91/okla_account_nav.css','v91/okla_account_nav.js');
/* Login page: Google + Facebook + Seznam social sign-in row. */
if(document.body&&/(^|\s)in-(login|registrace)(\s|$)/.test(document.body.className)) modules.push('v91/okla_login_social.css','v91/okla_login_social.js');
/* Login + registration: isolated Alza-style page (logo + card), simpler sign-up. */
if(document.body&&/(^|\s)in-(login|registrace)(\s|$)/.test(document.body.className)) modules.push('v91/okla_auth_pages.css','v91/okla_auth_pages.js');
if(document.body&&document.body.classList.contains('in-404')) modules.push('v91/okla_404.css');
/* Empty states (404 wording, search without results, empty cart) and small layout fixes for them. */
modules.push('v91/okla_empty_states.css','v91/okla_empty_states.js');
/* Payment method logos (Apple Pay, Google Pay, Mastercard, Visa) at the bottom of the footer. */
modules.push('v91/okla_payment_logos.css','v91/okla_payment_logos.js');
/* Shared OKLA header visual system + compatibility on all Shoptet page types. */
modules.push('v91/okla_header_consistency.css','v91/okla_header_consistency.js');
/* Reference look: soft gray search with right magnifier, sign-in, language and native-priced cart. */
modules.push('v91/okla_header_reference.css','v91/okla_header_reference.js');
/* Desktop hover cart: loaded last to preserve Shoptet checkout and native pricing. */
modules.push('v91/okla_cart_preview.css','v91/okla_cart_preview.js');
/* Every native legal/information article uses the full content card width. */
if(/^\/(?:obchodni-podminky|podminky-ochrany-osobnich-udaju|reklamacni-rad|vraceni-zbozi-a-odstoupeni|podminky-reklamnich-akci|prohlaseni-o-pristupnosti|doprava-a-platba)(?:\/|$)/.test(location.pathname)){
 document.documentElement.classList.add('okla-legal-wide');
 modules.push('v91/okla_legal_fullwidth.css');
}
/* Final pass for crisp language flags and a correctly positioned mobile language menu. */
modules.push('v91/okla_language_polish.css');
/* Final non-mobile desktop header normalization, after all prior CSS patches. */
modules.push('v91/okla_header_final.css','v91/okla_header_final.js');
/* Exact header_1to1.html dimensions for the functioning native Shoptet sign-in and cart. */
modules.push('v91/okla_header_template103.css','v91/okla_header_template103.js');
/* Desktop-only persistent navbar: reuse live header, white edge-to-edge background. */
modules.push('v91/okla_desktop_sticky.css','v91/okla_desktop_sticky.js');
/* Mobile-only footer/menu/order-history presentation and iOS chrome color. */
modules.push('v91/okla_mobile_policies.css','v91/okla_mobile_policies.js');
/* Alza-inspired vertically composed mobile footer banner; desktop untouched. */
modules.push('v91/okla_footer_mobile_promo.css','v91/okla_footer_mobile_promo.js');
/* Keep footer promotion flexible in CS, SK, EN and HU across all screen sizes. */
modules.push('v91/okla_footer_i18n_safe.css');
/* Final sitewide button geometry and calm outline-only hover treatment. */
modules.push('v91/okla_button_consistency.css','v91/okla_button_consistency.js');
/* One solid login-blue hover/focus treatment for every real form field. */
modules.push('v91/okla_field_consistency.css','v91/okla_password_toggle.js');
/* Mobile: bottom-bar Menu = customer centre; one fixed page-top gradient everywhere (loaded last). */
modules.push('v91/okla_mobile_menu.css','v91/okla_mobile_menu.js','v91/okla_mobile_gradient.css','v91/okla_mobile_gradient.js');
/* Product detail: description / reviews / parameters switcher (tabs on desktop, accordion on phones). */
if(isDetail) modules.push('v91/okla_detail_tabs.css','v91/okla_detail_tabs.js');
/* Product page tools (Tisk, Zeptat se, Hlídat, Sdílet), their dialogs and our share panel. */
if(isDetail) modules.push('v91/okla_product_tools.css','v91/okla_product_tools.js');
/* Desktop product buy bar instead of the sticky header once the buy button scrolls away. */
if(isDetail) modules.push('v91/okla_desktop_buybar.css','v91/okla_desktop_buybar.js');
/* Absolute final CSS pass: every textual UI element uses the same Exo 2 family.
   Icon-font classes are excluded inside the stylesheet so pictograms remain intact. */
modules.push('v91/okla_global_typography.css');
/* Repaint the scattered washed-out grey texts to black / a softer black. */
modules.push('v91/okla_text_contrast.js');
/* Neutralise dead internal links (404 products in articles, /stav-objednavky/). */
modules.push('v91/okla_deadlink_guard.js');
/* Final product-commerce palette: red prices and rounded green add-to-cart CTAs. */
modules.push('v91/okla_product_commerce.css');
/* Checkout corrections must follow the global field/button passes: stable
   parcel, aligned total, clean coupon field and green-only purchase hover. */
if(isOrdering) modules.push('v91/okla_checkout_final.css');
/* Final brand palette: every former green CTA uses the same OKLA blue as the
   warranty action. This follows all product and checkout overrides. */
modules.push('v91/okla_green_buttons.js','v91/okla_all_cta_blue.css','v91/okla_cta_shape.js');
/* Mobile text controls stay at 16 px or larger, preventing Safari/Chrome from
   zooming the page when the visitor starts typing. */
modules.push('v91/okla_mobile_no_zoom.css');
/* The live AI widget keeps its multilingual runtime; this small bridge swaps
   only its branding and assistant avatar after the shadow UI is mounted. */
modules.push('v91/okla_ai_brand.js');
/* Homepage editorial block: asymmetric retail-magazine composition. */
if(isHome) modules.push('v91/okla_news_home_datart.css');
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
function isCss(f){return f.endsWith('.css')}
/* Every module starts downloading at once (preload), so each one is taken from
   the browser cache the moment it is added to the page. */
function preload(href,as){
 var hint=document.createElement('link');
 hint.rel='preload';hint.as=as;hint.href=href;
 head.appendChild(hint);
 return hint;
}
/* Non-critical behaviour modules (search, login popup, cart drawer, footer) are
   not needed for the first paint, so they load AFTER the page is revealed. */
var deferNames=['v91/okla_search.css','v91/okla_search.js','v91/okla_login_popup.css','v91/okla_login_popup.js','v91/okla_cart_drawer.css','v91/okla_cart_drawer.js','okla_footer.js'];
var deferred=modules.filter(function(f){return deferNames.indexOf(f)>=0});
modules=modules.filter(function(f){return deferNames.indexOf(f)<0});
var hints=modules.concat(deferred).map(function(file){return preload(url(file,0),isCss(file)?'style':'script')});
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

/* ---- Instant look from the device (localStorage) ------------------------
   The look of the shop is its CSS. We keep every stylesheet's text on the
   visitor's own device, under a key that carries THIS release (the commit hash
   is part of `base`). On the next visit the whole look is injected in ONE
   <style> straight from the device — no network, no flash, byte-for-byte the
   same rules in the same order. A new release has a new key, so the stored look
   refreshes itself once after each change and is instant again afterwards.
   The scripts still load over the network/browser cache (so their behaviour is
   unchanged), only now ALL AT ONCE in their fixed order instead of one by one,
   so the page is ready far sooner. The finished page is identical: same files,
   same order. It is all-or-nothing per release, so the cascade order can never
   be partly inlined and partly linked. If storage is full or disabled,
   everything simply loads from the network exactly as before. */
var CSS_CACHE_KEY='okla.css.cache2';
var cssHave={};         /* file -> text already on the device (this release) */
var cssCachedOk=false;  /* the device holds CSS for this exact release */
try{
 var raw=localStorage.getItem(CSS_CACHE_KEY);
 if(raw){var parsed=JSON.parse(raw);if(parsed&&parsed.fp===base&&parsed.css){cssHave=parsed.css;cssCachedOk=true}}
}catch(e){cssCachedOk=false;cssHave={}}
var cssFresh={};        /* CSS text read during this visit, to store for next time */

function allCssCached(list){
 if(!cssCachedOk)return false;
 for(var i=0;i<list.length;i++){var f=list[i];if(isCss(f)&&cssHave[f]==null)return false}
 return true;
}
function injectCachedCss(list,id){
 var covered=[],buf='';
 for(var i=0;i<list.length;i++){var f=list[i];if(isCss(f)&&cssHave[f]!=null){buf+='\n/* '+f+' */\n'+cssHave[f];covered.push(f)}}
 if(buf){var st=document.createElement('style');st.id=id;st.setAttribute('data-okla-css-cache','1');st.textContent=buf;head.appendChild(st)}
 return covered;
}
/* A stylesheet's url(...) references are RELATIVE to the stylesheet's own
   address. As a <link> they resolve against the CDN; injected inline from the
   device they would resolve against the shop's own URL and 404. So before the
   text is stored, every relative url() (and @import) is rewritten to its
   absolute CDN address — leaving data:, http(s):, protocol-relative and #fragment
   references untouched. This keeps the cached look byte-equivalent to the linked
   one (images, fonts and masks all load). */
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
/* Best-effort: read a stylesheet we just loaded (from cache) so it can be stored
   for an instant next visit. */
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

/* Deferred modules load after reveal, same as before, using the cached look when
   the device holds all of it. */
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
/* Load the rest — every script, plus any stylesheet not served from the device —
   ALL AT ONCE in order. Scripts keep their exact order via async=false; a
   transient CDN error is retried twice. The page is revealed once everything has
   settled. */
var toLoad=modules.filter(function(f){return cachedNow.indexOf(f)<0});
var pending=toLoad.length;
function settle(){if(--pending<=0)finalize()}
function loadOne(file,attempt){
 var src=url(file,attempt);
 function failed(){
  if(attempt<2){setTimeout(function(){loadOne(file,attempt+1)},400);return}
  console.error('[OKLA] module missing:',file);settle();
 }
 if(isCss(file)){
  var link=document.createElement('link');link.rel='stylesheet';link.href=src;
  link.onload=function(){grabCss(file);settle()};link.onerror=failed;
  head.appendChild(link);
 }else{
  var script=document.createElement('script');script.src=src;script.async=false;
  script.onload=settle;script.onerror=failed;
  head.appendChild(script);
 }
}
window.__oklaAssetLoaderStatus='v91-loading';
if(pending===0)finalize();
else toLoad.forEach(function(file){loadOne(file,0)});
})();
