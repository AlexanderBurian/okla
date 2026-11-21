/* Okla – the one storefront loader. Everything Okla adds to the Shoptet shop starts here. Best placed in the page's head
   (Shoptet: HTML kód > záhlaví, `async`, after the small inline curtain); it also works from the footer (`defer`).

   1. Start-up       asset address, AI wake-up, tablet viewport, desktop scaling, logo
   2. Page           which kind of page this is (home, product, checkout, ...)
   3. Bundles        what loads where: the code in categories, in its fixed order (the table below)
   4. Curtain        a white cover until the page is finished, so a half-styled page never shows
   5. Loading        bundles (and the stored look from the device), then the AI chat
   6. Start          from the head: curtain + downloads at once, code runs once the HTML is complete

   The sources live in v91/, legacy/, content-v91/ and newsroom/. tools/build.js joins and minifies them per category
   into public/dist/<bundle>.css|.js; this loader loads only those. Opening the shop with ?okla-src=1 (once, it is
   remembered; ?okla-src=0 turns it off) loads the original source files one by one instead, for debugging. */
(function(){
'use strict';

/* ---- 1. Start-up ---------------------------------------------------------------------------------------------- */
if(window.__oklaBootstrapV91)return;
if(window.__oklaCompleteV71){console.warn('[OKLA V91] A previous Okla bootstrap is already running; remove duplicate Shoptet tags.');return}
window.__oklaBootstrapV91=true;
window.__oklaCompleteV71=true;
/* passes to run once just before the page is shown (see reveal()); null once it is shown */
window.__oklaBeforeReveal=[];
var current=document.currentScript;
var base=current&&current.src?current.src.split(/[?#]/)[0].replace(/[^/]*$/,''):'';
var aiApiUrl=current&&current.getAttribute('data-api-url');
if(!base){console.error('[OKLA V91] External loader URL required');return}
window.__oklaAssetBase=base;
window.__oklaApiUrl=(aiApiUrl||'').replace(/\/$/,'');
/* Wake the Render service while the storefront modules are still loading, so
   the first customer message does not pay the cold-start delay. */
if(window.__oklaApiUrl){try{fetch(window.__oklaApiUrl+'/health',{mode:'cors',cache:'no-store'}).catch(function(){})}catch(e){}}
/* Phones fire "resize" whenever the address bar slides in or out during scrolling (only the height changes, by about
   50-120 px). The storefront's layout code depends on the width, so resize listeners (Okla's modules, the shop's own
   jQuery ones) are not called for such a small height-only change: scrolling on a phone no longer reruns every layout
   fix (each round was a ~0.3 s freeze). A width change, turning the phone or the keyboard (a big height change) still
   reaches them. The decision is made once per event, by whichever of the hooks below sees it first. */
(function(){
 try{
  var add=window.addEventListener,remove=window.removeEventListener,wrapped=new WeakMap();
  var lastW=window.innerWidth,lastH=window.innerHeight,seen=null,skip=false;
  function heightOnly(e){
   if(e&&e===seen)return skip;
   seen=e;
   var w=window.innerWidth,h=window.innerHeight;
   skip=w===lastW&&Math.abs(h-lastH)<=160;
   if(!skip){lastW=w;lastH=h}
   return skip;
  }
  /* listeners added before this loader: stopped here (those that run before it are the jQuery ones, handled below) */
  add.call(window,'resize',function(e){if(heightOnly(e))e.stopImmediatePropagation()},true);
  function wrap(fn){
   var w=wrapped.get(fn);
   if(!w){w=function(e){if(!heightOnly(e))return fn.apply(this,arguments)};wrapped.set(fn,w)}
   return w;
  }
  window.addEventListener=function(type,fn,opts){
   if(type==='resize'&&typeof fn==='function')return add.call(this||window,type,wrap(fn),opts);
   return add.apply(this||window,arguments);
  };
  window.removeEventListener=function(type,fn,opts){
   if(type==='resize'&&typeof fn==='function'&&wrapped.has(fn))return remove.call(this||window,type,wrapped.get(fn),opts);
   return remove.apply(this||window,arguments);
  };
  /* jQuery keeps one listener of its own on the window, added by the shop before this loader, and calls every
     $(window).on('resize') handler from it (on the product page one of them measured the gallery, ~0.25 s a time) */
  function patchJquery(){
   var $=window.jQuery;
   if(!$||!$.event||typeof $.event.dispatch!=='function'||$.event.dispatch.__oklaResize)return;
   var dispatch=$.event.dispatch;
   var patched=function(ev){
    var native=ev&&(ev.originalEvent||ev);
    if(this===window&&native&&native.type==='resize'&&heightOnly(native))return;
    return dispatch.apply(this,arguments);
   };
   patched.__oklaResize=true;
   $.event.dispatch=patched;
  }
  patchJquery();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchJquery,{once:true});
 }catch(e){}
})();
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
/* Desktop (>=992 px): the whole page scales DOWN with narrower windows,
   proportionally to the 1920 px design - a 1366 px laptop shows the same page at
   71 % - so the content keeps the same share of the window on smaller / lower
   resolution screens. It never scales UP: windows of 1920 px and wider show the
   page at its natural 100 % size, so wide and 4K monitors are not over-zoomed.
   The page itself (.overall-wrapper: header, content, footer) gets CSS zoom;
   overlays outside it (cart drawer, search, cookies, chat) keep their size.
   Scripts that measure the page divide by element.currentCSSZoom. */
(function(){
 var REF=1920,MIN=992/1920,MAX=1,root=document.documentElement;
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
   Okla logo from the bundle instead and repoint every logo image to it — the desktop header, the mobile header and any
   copy it makes. Runs now and on later DOM changes (the mobile header is built after load). */
(function(){
 var logoUrl=base+'v91/img/okla-logo.png';
 function fixLogo(){
  var imgs=document.querySelectorAll('img[src*="/user/logos/"],img[src*="preforma-logo"],#okla-v61-header .okm61-logo img,#header .okm61-logo img');
  for(var i=0;i<imgs.length;i++){var im=imgs[i];if(im.getAttribute('src')!==logoUrl){im.removeAttribute('srcset');im.src=logoUrl;im.alt=im.alt||'Okla.cz'}}
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
/* State classes on <html> for the stylesheets: the cookie bar is shown (okla-cookiebar-open), the phone menu drawer is
   open (okla-drawer-open), the cart panel is open (okla-cartmodal-open). These used to be body:has(...) rules - and a
   :has() that looks at style/hidden attributes anywhere in the page made EVERY inline-style change (the colour passes
   make hundreds) restyle the whole page: about 80 full restyles while a product page loads, 5-6 s on a phone. */
(function(){
 if(!window.MutationObserver)return;
 var root=document.documentElement,attrs=new MutationObserver(sync),queued=false;
 function watch(el){if(el&&!el.__oklaStateWatch){el.__oklaStateWatch=1;attrs.observe(el,{attributes:true,attributeFilter:['style','hidden','class']})}}
 function set(cls,on){if(root.classList.contains(cls)!==on)root.classList.toggle(cls,on)}
 function sync(){
  queued=false;
  var cb=document.querySelector('.siteCookies.js-siteCookies'),dr=document.getElementById('okla-v61-drawer'),cm=document.getElementById('okla-cart-modal');
  set('okla-cookiebar-open',!!cb&&!/display:\s*none/.test(cb.getAttribute('style')||''));
  set('okla-drawer-open',!!dr&&dr.parentNode===document.body&&!dr.hasAttribute('hidden'));
  set('okla-cartmodal-open',!!cm&&cm.classList.contains('is-open'));
  watch(cb);watch(dr);watch(cm);
 }
 function start(){
  sync();
  /* added or removed elements: checked once per batch (three look-ups) */
  new MutationObserver(function(){if(!queued){queued=true;Promise.resolve().then(sync)}}).observe(document.body,{childList:true,subtree:true});
 }
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();


/* ---- 4. Curtain ----------------------------------------------------------------------------------------------- */
/* Until the modules are in place a white curtain (the colour of the top of the finished page) covers the page, so a
   half-styled page never shows; the curtain covers it at once and is removed in one step from the finished page. The page
   under it is left alone, so its backgrounds draw as always. A small spinner appears only when loading takes over 1.2 s,
   and the curtain goes after 4 s if a file is still downloading (counted from when the page's HTML is in place; a slow
   phone still putting the page together is waited for), and after 10 s whatever happens. Once it is gone, nothing of the loader stays on the page. */
var root=document.documentElement;
var head=document.head||root;
var bootStyle=document.createElement('style');
/* While the curtain is up the page's own content is not drawn at all (hidden, transparent). A click from one shop page to
   the next therefore never shows a white in-between screen: the browser keeps showing the page the visitor is on
   ("paint holding") until the next one draws its first real content - which happens only when it is finished - and
   then switches at once. On a first visit (nothing to hold) the white curtain is what shows. */
bootStyle.textContent='html.okla-curtain::before{content:"";position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483646;background:#fff;pointer-events:auto}'+
 /* every element and its ::before/::after (a breadcrumb arrow drawn by ::before alone was enough to end it), strongly
    enough to beat the site's own visibility:visible!important rules (up to 7 ids) */
 'html.okla-curtain body,html.okla-curtain body *:not(#okc0#okc1#okc2#okc3#okc4#okc5#okc6#okc7#okc8#okc9),html.okla-curtain body *:not(#okc0#okc1#okc2#okc3#okc4#okc5#okc6#okc7#okc8#okc9)::before,html.okla-curtain body *:not(#okc0#okc1#okc2#okc3#okc4#okc5#okc6#okc7#okc8#okc9)::after{visibility:hidden!important}'+
 'html.okla-curtain:not(.okla-shown)::after{content:"";position:fixed;left:50%;top:50%;z-index:2147483647;width:26px;height:26px;margin:-13px 0 0 -13px;border:2px solid #e9f1fb;border-top-color:#4389f8;border-radius:50%;opacity:0;animation:okla-boot-in .4s ease 1.2s forwards,okla-boot-spin .9s linear infinite}'+
 '@keyframes okla-boot-in{to{opacity:1}}'+
 '@keyframes okla-boot-spin{to{transform:rotate(360deg)}}'+
 '@media (prefers-reduced-motion:reduce){html.okla-curtain:not(.okla-shown)::after{animation:okla-boot-in .4s ease 1.2s forwards}}';
head.appendChild(bootStyle);
root.classList.add('okla-curtain');
/* The curtain goes 4 s after the page's own HTML is in place (set in main) - and in any case 10 s after this point. */
var revealed=false,revealTimer=null;
setTimeout(reveal,10000);
/* The site font (Open Sans, okla_global_typography.css) starts downloading right now, together with the site files. */
var FONT_BASE='https://cdn.jsdelivr.net/npm/@fontsource-variable/open-sans@5.2.7/files/open-sans-';
['latin','latin-ext'].forEach(function(sub){
 var f=document.createElement('link');f.rel='preload';f.as='font';f.type='font/woff2';f.crossOrigin='anonymous';
 f.href=FONT_BASE+sub+'-wght-normal.woff2';f.fetchPriority='high';head.appendChild(f);
});
/* The page is shown only once the font is in place (at most 1.5 s of waiting): text - and every button sized by its text -
   swapping from the fallback font after the page is visible is what made buttons change size on their own. */
function whenFontsReady(done){
 var fired=false;function go(){if(!fired){fired=true;done()}}
 setTimeout(go,1500);
 try{Promise.all([document.fonts.load('400 16px "Open Sans"','Aa\u010d\u0159'),document.fonts.load('700 16px "Open Sans"','Aa\u010d\u0159')]).then(go,go)}catch(e){go()}
}
function reveal(){
 if(revealed)return;
 revealed=true;clearTimeout(revealTimer);revealTimer=null;
 /* The passes that read the page's colours (button colours, text contrast) wait for this moment instead of running
    after every file while the page is still being built under the curtain: they run once, here, just before it is
    shown. (The list is closed first, so a pass asked for while these run runs at once.) */
 var hooks=window.__oklaBeforeReveal||[];window.__oklaBeforeReveal=null;
 hooks.forEach(function(f){try{f()}catch(e){}});
 /* at once, no fade: the finished page replaces the previous one in one step */
 root.classList.remove('okla-curtain','okla-shown');bootStyle.remove();
 /* the footer tag's own curtain (html:not(.okla-ready) body{opacity:0}) lifts at the same moment, not after its 2.5 s timer */
 root.classList.add('okla-ready');
 window.__oklaRevealed=true;
 setTimeout(warmNext,1200);
}
/* The page fades in only after the translation layer has shown it, so a translated page appears in one step. */
function revealWhenTranslated(){whenFontsReady(revealAfterTranslation)}
function revealAfterTranslation(){
 if(!root.classList.contains('okla-i18n-pending')){reveal();return}
 new MutationObserver(function(list,observer){
  if(root.classList.contains('okla-i18n-pending'))return;
  observer.disconnect();
  reveal();
 }).observe(root,{attributes:true,attributeFilter:['class']});
}

/* ---- 2. Page -------------------------------------------------------------------------------------------------- */
/* Which kind of page this is. Asked twice: early (from the <body> classes and the address, while the page is still
   arriving - to start downloading its bundles) and once the page's HTML is complete (what is actually loaded). */
function detectPage(){
var body=document.body,path=location.pathname;
function bodyIs(re){return !!(body&&re.test(body.className))}
var PAGE={
 all:true,
 home:!!(body&&body.classList.contains('type-index')),
 product:!!document.querySelector('#content .p-detail')||bodyIs(/(^|\s)type-product(\s|$)/),
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
 category:bodyIs(/(^|\s)type-category(\s|$)/),
 /* every native legal / information article uses the full content card width */
 legal:/^\/(?:obchodni-podminky|podminky-ochrany-osobnich-udaju|reklamacni-rad|vraceni-zbozi-a-odstoupeni|podminky-reklamnich-akci|prohlaseni-o-pristupnosti|doprava-a-platba)(?:\/|$)/.test(path),
 /* "Objednávka odeslána" (/objednavka/dekujeme/, after an order is sent) */
 thankYou:/^\/objednavka\/dekujeme\/?$/.test(path)||bodyIs(/(^|\s)in-dekujeme(\s|$)/)||/objedn\S* (byla )?odesl/i.test((document.querySelector('#content h1')||{}).textContent||'')
};
return PAGE;
}

/* ---- 3. Bundles ----------------------------------------------------------------------------------------------- */
/* What loads where. [bundle, page, files]: each bundle is loaded on the pages named (see PAGE above) and contains
   these files in this order. The order of the whole table is the order of the page's styles and scripts and must stay
   as it is: later styles override earlier ones. The last bundle ("later") loads only after the page is shown.
   After editing this table run: node tools/build.js */
/*@bundles*/
var BUNDLES=[
 /* Core: the shop's name in the tab title, translations, the homepage gathered into one content (Shoptet's wide layout), the original storefront core, the base phone look, shared behaviour */
 ['01-core','all',['v91/core/okla_page_title.js','v91/core/okla_i18n.css','v91/core/okla_i18n.js','v91/core/okla_home_merge.js','legacy/v53/zapati_firsthalf.js','legacy/v55/okla_news_v55.js','v91/core/okla_mobile_unified.css','v91/core/okla_behavior.js']],
 /* Homepage: the articles from Shoptet's list, layout, banners, search, the category circles (and no left sidebar on PC) */
 ['02-home','home',['v91/core/okla_articles.js','v91/home/okla_news_native_images.js','v91/home/okla_home.css','v91/home/okla_home.js','v91/home/okla_home_banners.css','v91/home/okla_home_banners.js','v91/home/okla_home_search.js','v91/home/okla_home_categories.css','v91/home/okla_home_categories.js','v91/home/okla_home_deals.css','v91/home/okla_home_deals.js','v91/home/okla_home_promo.css','v91/home/okla_home_promo.js']],
 /* Side banners and the product catalogue (prices, stock, names) */
 ['03-catalog','all',['v91/core/okla_home_side.css','v91/core/okla_home_side.js','okla_v86_catalog.js','v91/core/okla_live_catalog.js']],
 /* Product page: the description's own styles (product texts imported into Shoptet), layout, cross-sell */
 ['04-product','product',['content-v91/layout.css','v91/product/okla_detail.css','v91/product/okla_detail.js','v91/product/okla_cross_sell.css','v91/product/okla_cross_sell.js']],
 /* Navigation, phone shell, product cards, native pages, sidebar */
 ['05-layout','all',['v91/core/okla_navigation.css','v91/core/okla_navigation.js','v91/core/okla_mobile_shell.css','v91/core/okla_mobile_shell.js','v91/core/okla_product_cards.css','v91/core/okla_native_pages.css','v91/core/okla_cards_everywhere.css','v91/core/okla_native_pages.js','v91/core/okla_sidebar.css','v91/core/okla_sidebar.js','v91/core/okla_sidebar_top10.js','v91/core/okla_cat_photos.css','v91/core/okla_cat_photos.js','v91/core/okla_subcats.css','v91/core/okla_cat_text.js','v91/core/okla_subcats.js']],
 /* Product page on phones */
 ['06-product-phone','product',['v91/product/okla_detail_mobile.css']],
 /* Cart and checkout (and what is ordered, kept for the thank-you page) */
 ['07-checkout','checkout',['v91/checkout/okla_order_snapshot.js','v91/checkout/okla_checkout.css','v91/checkout/okla_cart.css','v91/checkout/okla_checkout_ui.css','v91/checkout/okla_parcel.css','v91/checkout/okla_cart_refine.css','v91/checkout/okla_checkout_layout.css','v91/checkout/okla_checkout_ui.js']],
 /* Pages of their own */
 ['08-newsroom','newsroom',['v91/core/okla_articles.js','newsroom/okla_newsroom.js']],
 ['09-article','article',['v91/pages/okla_article_hero.js','v91/pages/okla_article_products.css','v91/pages/okla_article_products.js']],
 ['10-order-status','orderStatus',['v91/pages/okla_order_status.css','v91/pages/okla_order_status.js']],
 ['11-complaint','complaint',['v91/pages/okla_reklamace.css','v91/pages/okla_reklamace.js']],
 ['12-orders','orders',['v91/pages/okla_orders.css','v91/pages/okla_orders.js']],
 ['13-about','about',['v91/pages/okla_about.css','v91/pages/okla_about.js']],
 ['14-how-to-buy','howToBuy',['v91/pages/okla_how_to_buy.css','v91/pages/okla_how_to_buy.js']],
 ['15-contact','contact',['v91/pages/okla_contact.css','v91/pages/okla_contact.js']],
 ['16-account','account',['v91/pages/okla_account.css','v91/pages/okla_account.js','v91/pages/okla_account_polish.css','v91/pages/okla_account_polish.js','v91/pages/okla_account_nav.css','v91/pages/okla_account_nav.js']],
 /* Login and registration: social sign-in row, isolated page (logo + card) */
 ['17-sign-in','signIn',['v91/pages/okla_login_social.css','v91/pages/okla_login_social.js','v91/pages/okla_auth_pages.css','v91/pages/okla_auth_pages.js']],
 ['18-not-found','notFound',['v91/pages/okla_404.css']],
 /* Empty states, payment logos, the shared header, the desktop hover cart */
 ['19-shared','all',['v91/core/okla_empty_states.css','v91/core/okla_empty_states.js','v91/core/okla_payment_logos.css','v91/core/okla_payment_logos.js','v91/core/okla_header_consistency.css','v91/core/okla_header_consistency.js','v91/core/okla_header_reference.css','v91/core/okla_header_reference.js','v91/core/okla_cart_preview.css','v91/core/okla_cart_preview.js']],
 ['20-legal','legal',['v91/pages/okla_legal_fullwidth.css']],
 /* Final header, sticky navbar, phone footer and menu, buttons and fields, phone content rail, phone bottom bar and panels */
 ['21-polish','all',['v91/core/okla_language_polish.css','v91/core/okla_header_final.css','v91/core/okla_header_final.js','v91/core/okla_header_template103.css','v91/core/okla_header_template103.js','v91/core/okla_desktop_sticky.css','v91/core/okla_desktop_sticky.js','v91/core/okla_mobile_policies.css','v91/core/okla_mobile_policies.js','v91/core/okla_footer_mobile_promo.css','v91/core/okla_footer_mobile_promo.js','v91/core/okla_footer_i18n_safe.css','v91/core/okla_button_consistency.css','v91/core/okla_button_consistency.js','v91/core/okla_field_consistency.css','v91/core/okla_password_toggle.js','v91/core/okla_mobile_menu.css','v91/core/okla_mobile_menu.js','v91/core/okla_mobile_page_top.css','v91/core/okla_mobile_page_top.js','v91/core/okla_mobile_content_width.css','v91/core/okla_mobile_tabbar.css','v91/core/okla_mobile_tabbar.js','v91/core/okla_mobile_pillbar.css','v91/core/okla_mobile_pillbar.js']],
 /* Product page: tabs, tools (print, ask, watch, share), buy bar, the picture viewer */
 ['22-product-extras','product',['v91/product/okla_detail_tabs.css','v91/product/okla_detail_tabs.js','v91/product/okla_product_tools.css','v91/product/okla_product_tools.js','v91/product/okla_desktop_buybar.css','v91/product/okla_desktop_buybar.js','v91/product/okla_detail_alza.css','v91/product/okla_detail_alza.js','v91/product/okla_bought_together.css','v91/product/okla_bought_together.js','v91/product/okla_gallery.css','v91/product/okla_gallery.js']],
 /* Typeface, text contrast, dead links, product prices and buttons */
 ['23-finish','all',['v91/core/okla_global_typography.css','v91/core/okla_text_contrast.js','v91/core/okla_deadlink_guard.js','v91/core/okla_product_commerce.css']],
 ['24-checkout-fix','checkout',['v91/checkout/okla_checkout_final.css','v91/checkout/okla_cart_recs.css','v91/checkout/okla_cart_recs.js']],
 /* Call-to-action buttons: colour and shape */
 ['25-buttons','all',['v91/core/okla_green_buttons.js','v91/core/okla_all_cta_blue.css','v91/core/okla_cta_shape.js']],
 /* Checkout skin */
 ['26-checkout-skin','checkout',['v91/checkout/okla_cart_simple.css','v91/checkout/okla_checkout_layout_v2.css','v91/checkout/okla_checkout_home_sync.css','v91/checkout/okla_cart_aside.css','v91/checkout/okla_checkout_alza.js']],
 ['27-thank-you','thankYou',['v91/checkout/okla_thank_you.css','v91/checkout/okla_thank_you.js']],
 /* No zoom on phone fields, AI chat branding, the logo blue for Shoptet's own template colours */
 ['28-last','all',['v91/core/okla_mobile_no_zoom.css','v91/core/okla_ai_brand.js','v91/core/okla_brand_blue.css','v91/core/okla_catbar.css','v91/core/okla_catbar.js','v91/core/okla_islands.css','v91/core/okla_ui_categories.css','v91/core/okla_sidebar_clean.css','v91/core/okla_header_pro.css','v91/core/okla_mobile_sliders.css','v91/core/okla_mobile_bottombar.css','v91/core/okla_mobile_forms_clean.css','v91/core/okla_form_widths.css','v91/core/okla_no_caps.css','v91/core/okla_free_shipping.css','v91/core/okla_free_shipping.js']],
 /* Homepage editorial blocks, the search field typing example searches */
 ['29-home-magazine','home',['v91/home/okla_news_home_datart.css','v91/home/okla_news_home_alza.css','v91/home/okla_home_brands.css','v91/home/okla_home_brands.js','v91/home/okla_home_retail_refresh.css','v91/home/okla_home_retail_refresh.js','v91/home/okla_search_typing.js','v91/home/okla_home_mobile.css']],
 /* Category pages: sorting as round chips, the category's definition and its about text */
 ['30-category','category',['v91/pages/okla_category.css','v91/pages/okla_category_seo.js']],
 /* The original storefront's own stylesheet (legacy v53): after every page's own bundles, where its <style> used to be added */
 ['31-legacy-css','all',['legacy/v53/zapati_firsthalf.css']],
 /* Not needed for the first view: search, login popup, cart drawer, footer (loaded after the page is shown) */
 ['99-later','all',['v91/core/okla_search.css','v91/core/okla_search.js','v91/core/okla_login_popup.css','v91/core/okla_login_popup.js','v91/core/okla_cart_modal.css','v91/core/okla_cart_modal.js','okla_footer.js']]
];
/*@end*/

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
/* This page's bundles in order, the "later" one kept apart. */
function filesFor(PAGE){
 var modules=[],deferred=[];
 BUNDLES.forEach(function(b){
  if(!PAGE[b[1]])return;
  var list=b[0]==='99-later'?deferred:modules,files=b[2];
  if(sourceMode){files.forEach(function(f){list.push(f)});return}
  if(files.some(isCss))list.push('dist/'+b[0]+'.css');
  if(files.some(function(f){return !isCss(f)}))list.push('dist/'+b[0]+'.js');
 });
 return {modules:modules,deferred:deferred};
}
/* Stylesheets written into the page's <head> by the Shoptet header tag (<link data-okla-b="<bundle>">): every bundle's
   stylesheet, in the table's order, those of the other kinds of page switched off (media="not all"). The look is then
   part of the page like on any web site - the browser fetches it together with the HTML (from its own cache on later
   visits) - and this loader only switches on the bundles of this page, in place, so the cascade order is the table's.
   Without those links (an older header tag) the loader adds the stylesheets itself, as before. */
var headMode=!sourceMode&&!!document.querySelector('link[data-okla-b="01-core"]');
function headLink(file){if(!headMode||!isCss(file)||file.indexOf('dist/')!==0)return null;return document.querySelector('link[data-okla-b="'+file.slice(5,-4)+'"]')}
/* f runs once the page is shown */
function afterShown(f){(function w(){if(window.__oklaRevealed)setTimeout(f,0);else setTimeout(w,40)})()}
function preload(href,as,priority){
 var hint=document.createElement('link');
 /* the main scripts are fetched as text (see "one go" below): their preload must be a CORS fetch to be reused */
 if(as==='script'&&priority==='high'&&!sourceMode&&window.fetch){as='fetch';hint.crossOrigin='anonymous'}
 hint.rel='preload';hint.as=as;hint.href=href;
 /* stylesheets are requested in CORS mode everywhere (link, preload, the fetch() that stores them), so the browser
    cache serves all three from ONE download - a no-CORS <link> and a CORS fetch() do not share the cached copy */
 if(as==='style')hint.crossOrigin='anonymous';
 if(priority)hint.fetchPriority=priority;
 head.appendChild(hint);
 return hint;
}

/* After the page is shown, the NEXT page should open at once.
   1. The bundles of the other main kinds of page (homepage, product) go to the browser cache at the lowest priority -
      only on a fast (4G / broadband) connection without data saving.
   2. Chrome / Edge (Speculation Rules): resting on a shop link (or touching it on a phone) prepares that page in the
      background, so it appears at once on the click - its curtain has already lifted. Never for the cart, the order
      process, the account or any /action/ address. Other browsers ignore it. */
function warmNext(){
 if(document.body&&document.body.classList.contains('ordering-process'))return;
 try{
  var c=navigator.connection;
  /* only on a fast connection: on 3G the extra downloads compete with the page the visitor opens next */
  if(!(c&&(c.saveData||(c.effectiveType&&c.effectiveType!=='4g')))){
   var have={};
   [].forEach.call(document.querySelectorAll('link[href],script[src]'),function(e){have[e.href||e.src]=1});
   ['home','product'].forEach(function(kind){
    var pg={all:true};pg[kind]=true;
    filesFor(pg).modules.forEach(function(f){
     var u=url(f,0);if(have[u])return;have[u]=1;
     var l=document.createElement('link');l.rel='prefetch';l.href=u;if(isCss(f))l.crossOrigin='anonymous';head.appendChild(l);
    });
   });
  }
 }catch(e){}
 try{
  if(!window.HTMLScriptElement||!HTMLScriptElement.supports||!HTMLScriptElement.supports('speculationrules'))return;
  var rules=document.createElement('script');rules.type='speculationrules';
  rules.textContent=JSON.stringify({prerender:[{source:'document',where:{and:[{href_matches:'/*'},
   {not:{href_matches:['/action/*','/kosik*','/objednavka*','/login*','/registrace*','/klient*','/odhlasit*','/zapomenute-heslo*']}},
   {not:{selector_matches:'[rel~=nofollow],[target=_blank],[download]'}}]},eagerness:'moderate'}]});
  head.appendChild(rules);
 }catch(e){}
}

function main(){
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

var PAGE=detectPage();
if(PAGE.legal)document.documentElement.classList.add('okla-legal-wide');
var lists=filesFor(PAGE),modules=lists.modules,deferred=lists.deferred;
/* 4 s safety net for a download that hangs. When every file has arrived and the page is only still being put together
   (a slow phone), the curtain stays until it is finished (finalize shows it), so a half-built page is never shown. */
revealTimer=setTimeout(function(){if(!(pending<=0))reveal()},4000);
/* The "later" files start downloading now, so they are ready in the browser cache when they are added - at low
   priority, so on a slow connection they do not hold up the files the page waits for. */
var hints=deferred.filter(function(file){return !headLink(file)}).map(function(file){return preload(url(file,0),isCss(file)?'style':'script','low')});
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
 /* what earlier versions kept on the device and nothing reads any more (old style stores, the dropped favourites
    list, earlier dead-link and catalogue caches) is cleared */
 ['okla.css.cache','okla.css.cache2','okla-local-favorites-v1','okla.deadlinks.v1','okla-live-catalog-v1'].forEach(function(k){localStorage.removeItem(k)});
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
 try{fetch(abs,{cache:'force-cache',mode:'cors',credentials:'same-origin'}).then(function(r){return r.ok?r.text():null}).then(function(t){if(t!=null)cssFresh[file]=absolutizeCss(t,abs)}).catch(function(){})}catch(e){}
}
function saveCssCache(){
 if(headMode)return;
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
var mainCssHit=!headMode&&allCssCached(modules);
var cachedNow=mainCssHit?injectCachedCss(modules,'okla-css-cache-main'):[];

/* The "later" files load after the page is shown, using the stored look when the device holds all of it. */
var lateLinks=[];
function loadDeferred(){
 var coveredDef=!headMode&&allCssCached(deferred)?injectCachedCss(deferred,'okla-css-cache-deferred'):[];
 deferred.forEach(function(file){
  if(coveredDef.indexOf(file)>=0)return;
  var src=url(file,0),hl=headLink(file);
  if(hl){if(hl.media!=='all')hl.media='all';lateLinks.push(hl);try{hl.dispatchEvent(new Event('load'))}catch(e){}return}
  if(isCss(file)){var link=document.createElement('link');link.rel='stylesheet';link.crossOrigin='anonymous';link.href=src;link.onload=function(){grabCss(file)};head.appendChild(link);lateLinks.push(link);}
  /* the scripts (search, login popup, cart panel, footer) are not needed for the first view: they run once it is shown;
     the passes that re-read colours when a stylesheet arrives are told about the "later" stylesheets switched on in
     place - now (as when such a stylesheet was added) and again shortly after these scripts have run (the footer exists and its colour transitions have ended) */
  else afterShown(function(){var s=document.createElement('script');s.src=src;s.async=false;
   s.onload=s.onerror=function(){setTimeout(function(){lateLinks.forEach(function(l){try{l.dispatchEvent(new Event('load'))}catch(e){}})},600)};
   head.appendChild(s);});
 });
}
function finalize(){
 window.__oklaAssetLoaderStatus='v91-loaded';
 /* the AI chat only once the page is shown: its button drawing earlier would end the browser's "keep the previous
    page on screen" phase too soon */
 (function aiAfterReveal(){if(window.__oklaRevealed)loadAi();else setTimeout(aiAfterReveal,50)})();
 hints.concat(earlyHints).forEach(function(hint){hint.remove()});
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
/* The scripts are downloaded as text and run one after another in ONE go, once everything has arrived: the browser does
   not redraw the hidden page between two of them (each redraw restyled the whole page - most of the waiting on a phone),
   and every script finds all stylesheets in place. Each runs as before: in the page's global scope, every file of a
   bundle in its own try/catch (tools/build.js), under its own name in the console (sourceURL). Without fetch() - or in
   source mode - the scripts are added as <script> elements as before. */
var oneGo=!sourceMode&&!!window.fetch;
var jsText={};
function runScripts(){
 toLoad.forEach(function(file){
  var t=jsText[file];if(!t)return;
  try{(0,eval)(t+'\n//# sourceURL='+url(file,0))}catch(e){setTimeout(function(){throw e})}
 });
}
function settle(){if(--pending<=0){if(oneGo)runScripts();finalize()}}
/* The page waits for these files (under the curtain): they are fetched before images and other page content. */
function loadOne(file,attempt){
 var src=url(file,attempt);
 /* a stylesheet already in the page's head: switched on in place, done once it has arrived (a failed one is added again).
    The header tag writes the stylesheets this address cannot need as disabled (not downloaded): one of those that the
    page needs after all is enabled here, and the browser downloads it now. */
 var hl=!attempt&&headLink(file);
 if(hl){
  if(hl.disabled)hl.disabled=false;
  if(hl.media!=='all')hl.media='all';
  if(hl.getAttribute('data-okla-e')){loadOne(file,1);return}
  if(hl.sheet||hl.getAttribute('data-okla-l')){settle();return}
  hl.addEventListener('load',function(){settle()},{once:true});
  hl.addEventListener('error',function(){loadOne(file,1)},{once:true});
  return;
 }
 function failed(){
  if(attempt<2){setTimeout(function(){loadOne(file,attempt+1)},400);return}
  console.error('[OKLA] module missing:',file);settle();
 }
 if(isCss(file)){
  var link=document.createElement('link');link.rel='stylesheet';link.crossOrigin='anonymous';link.href=src;link.fetchPriority='high';
  link.onload=function(){grabCss(file);settle()};link.onerror=failed;
  head.appendChild(link);
 }else{
  if(oneGo){
   fetch(src,{mode:'cors',credentials:'same-origin',priority:'high'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.text()})
    .then(function(t){jsText[file]=t;settle()},failed);
   return;
  }
  var script=document.createElement('script');script.src=src;script.async=false;script.fetchPriority='high';
  script.onload=settle;script.onerror=failed;
  head.appendChild(script);
 }
}
window.__oklaAssetLoaderStatus='v91-loading';
if(pending===0)finalize();
else toLoad.forEach(function(file){loadOne(file,0)});
}

/* ---- 6. Start ------------------------------------------------------------------------------------------------- */
/* Placed in the page's <head> (Shoptet: HTML kód > záhlaví, with `async`), this loader runs while the page is still
   arriving: the curtain is already up, and as soon as <body> exists (its classes tell the kind of page) every bundle of
   the page starts downloading. The bundles RUN only once the page's HTML is complete, exactly as from the footer, so
   no code ever meets a half-built page. Placed in the footer (`defer`), it simply runs everything at once. */
var earlyHints=[];
function preloadEarly(){
 var l=filesFor(detectPage());
 l.modules.forEach(function(f){if(!headLink(f))earlyHints.push(preload(url(f,0),isCss(f)?'style':'script','high'))});
}
if(document.readyState==='loading'){
 if(document.body)preloadEarly();
 else{
  var bodyWatch=new MutationObserver(function(){if(document.body){bodyWatch.disconnect();preloadEarly()}});
  bodyWatch.observe(document.documentElement,{childList:true});
 }
 document.addEventListener('DOMContentLoaded',main,{once:true});
}else main();
})();
