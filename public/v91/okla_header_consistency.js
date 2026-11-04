/* OKLA V92: universal header bootstrap, independent of native Shoptet header mode. */
(function(){
 'use strict';
 if(window.__oklaUniversalHeaderV92)return;
 window.__oklaUniversalHeaderV92=true;
 var tablet=window.matchMedia('(min-width:768px)');
 var svgNS='http://www.w3.org/2000/svg';
 function svg(paths){
  var el=document.createElementNS(svgNS,'svg');
  el.setAttribute('viewBox','0 0 24 24');el.setAttribute('aria-hidden','true');
  el.setAttribute('focusable','false');
  for(var i=0;i<paths.length;i++){
   var p=document.createElementNS(svgNS,'path');p.setAttribute('d',paths[i]);el.appendChild(p);
  }
  return el;
 }
 function elem(tag,cls){
  var el=document.createElement(tag);if(cls)el.className=cls;return el;
 }
 function fallbackAccount(nav,cart){
  var a=elem('a','okla-header-account okla-universal-account');
  a.href='/login/?backTo='+encodeURIComponent(location.pathname+location.search);
  a.rel='nofollow';a.setAttribute('aria-label','Můj účet – přihlásit se');
  var icon=elem('span','okla-header-icon');
  icon.appendChild(svg(['M12 11.4a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
   'M5 20v-.7a7 7 0 0 1 14 0v.7H5Z']));
  var copy=elem('span','okla-header-copy');
  var strong=elem('strong');strong.textContent='Můj účet';copy.appendChild(strong);
  var small=elem('small');small.textContent='Přihlásit se';copy.appendChild(small);
  a.appendChild(icon);a.appendChild(copy);
  nav.insertBefore(a,cart);
 }
 function ensureCart(nav){
  var cart=nav.querySelector('a.cart-count');
  if(cart)return cart;
  var old=document.querySelector('#header a[data-testid="headerCart"],#header a[href="/kosik/"]');
  if(old&&old!==nav&&!old.closest('#okla-v61-header')){
   old.classList.add('cart-count');
   nav.appendChild(old);
   return old;
  }
  cart=elem('a','cart-count okla-universal-cart');
  cart.href='/kosik/';cart.rel='nofollow';cart.title='Košík';
  cart.setAttribute('aria-label','Otevřít nákupní košík');
  var ic=elem('span','okla-cart-symbol');
  ic.appendChild(svg(['M3 4h2.4l1.9 10a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 7H6','M9.7 20h.01','M18 20h.01']));
  cart.appendChild(ic);
  nav.appendChild(cart);
  return cart;
 }
 function ensureSupport(nav,cart){
  if(nav.querySelector('.okla-header-orders'))return;
  var a=elem('a','okla-header-orders');a.href='/klient/';a.rel='nofollow';
  a.setAttribute('aria-label','Moje objednávky');a.title='Moje objednávky';
  a.appendChild(svg(['M5 8h14v13H5z','M9 9V6a3 3 0 0 1 6 0v3','m8 14 2.5 2.5 5-5']));
  nav.insertBefore(a,cart);
 }
 function ensureFavorites(nav,cart){
  if(nav.querySelector('.okla-header-favorites'))return;
  var a=elem('button','okla-header-favorites');a.type='button';
  a.title='Oblíbené';a.setAttribute('aria-label','Oblíbené produkty');
  a.appendChild(svg(['M20.5 8.7c0 4.3-8.5 10.2-8.5 10.2S3.5 13 3.5 8.7a4.5 4.5 0 0 1 8.5-2.1 4.5 4.5 0 0 1 8.5 2.1Z']));
  a.addEventListener('click',function(){
   if(typeof window.oklaOpenFavorites==='function')window.oklaOpenFavorites();
   else{
    var native=document.querySelector('#header [data-target="favorite"]');
    if(native)native.click();
    else location.href='/klient/';
   }
  });
  nav.insertBefore(a,cart);
 }
 function ensureLocale(nav,cart){
  if(nav.querySelector('.okla-header-locale'))return;
  var a=elem('span','okla-header-locale');
  a.setAttribute('aria-label','Česká verze obchodu');a.title='Čeština';
  var flag=document.createElementNS(svgNS,'svg');flag.setAttribute('viewBox','0 0 32 32');
  flag.setAttribute('aria-hidden','true');flag.classList.add('okla-header-flagicon');
  var circle=document.createElementNS(svgNS,'circle');circle.setAttribute('cx','16');
  circle.setAttribute('cy','16');circle.setAttribute('r','15');circle.setAttribute('fill','#fff');flag.appendChild(circle);
  var red=document.createElementNS(svgNS,'path');red.setAttribute('d','M1 16h30a15 15 0 0 1-30 0Z');red.setAttribute('fill','#db2439');flag.appendChild(red);
  var blue=document.createElementNS(svgNS,'path');blue.setAttribute('d','M3 8a15 15 0 0 0 0 16L18 16Z');blue.setAttribute('fill','#124c94');flag.appendChild(blue);
  a.appendChild(flag);nav.insertBefore(a,cart);
 }
 function enhance(){
  var header=document.querySelector('#header .header-top');
  if(!header)return;
  var nav=header.querySelector(':scope > .navigation-buttons');
  if(!nav){nav=elem('div','navigation-buttons');header.appendChild(nav);}
  nav.classList.add('okla-header-ready');
  if(!tablet.matches)return; // Mobile shell owns all mobile controls.
  var cart=ensureCart(nav);
  if(typeof window.oklaHeaderRefresh==='function'){
   try{window.oklaHeaderRefresh()}catch(err){console.warn('[OKLA header] legacy refresh:',err)}
  }
  // The legacy function may run on some Shoptet page types only; fill missing controls.
  cart=nav.querySelector('a.cart-count')||cart;
  if(!nav.querySelector('.okla-header-account'))fallbackAccount(nav,cart);
  ensureSupport(nav,cart);ensureFavorites(nav,cart);ensureLocale(nav,cart);
  if(typeof window.oklaHeaderRefresh==='function'){
   try{window.oklaHeaderRefresh()}catch(err){console.warn('[OKLA header] normalization:',err)}
  }
  if(window.innerWidth>=992){
   var row=nav.querySelector('.okla-exact-header');
   if(!row){
    row=elem('div','okla-exact-header');row.setAttribute('role','group');
    row.setAttribute('aria-label','Účet, objednávky, oblíbené a košík');
    nav.appendChild(row);
   }
   ['.okla-header-account','.okla-header-orders','.okla-header-favorites','.okla-header-locale','a.cart-count'].forEach(function(sel){
    var el=nav.querySelector(sel);
    if(el&&el.parentNode!==row)row.appendChild(el);
   });
  } else {
   var old=nav.querySelector('.okla-exact-header');
   if(old){
    Array.from(old.children).forEach(function(el){if(!el.classList.contains('okla-exact-separator'))nav.insertBefore(el,old)});
    old.remove();
   }
  }
  document.documentElement.classList.add('okla-header-v92');
 }
 var raf=0;
 function schedule(){
  if(raf)return;
  raf=requestAnimationFrame(function(){raf=0;enhance()});
 }
 function init(){
  schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('resize',schedule,{passive:true});
  if(tablet.addEventListener)tablet.addEventListener('change',schedule);
  [150,600,1300,3000].forEach(function(t){setTimeout(schedule,t)});
  var head=document.querySelector('#header');
  if(!head||!window.MutationObserver)return;
  var obs=new MutationObserver(function(changes){
   // Ignore our own icons and separators; only retry when whole native
   // header controls are re-inserted by Shoptet or another app.
   for(var i=0;i<changes.length;i++){
    var n=changes[i].addedNodes;
    for(var j=0;j<n.length;j++){
     var el=n[j];
     if(el.nodeType!==1)continue;
     if(el.matches&&el.matches('.header-top,.navigation-buttons,.search,.cart-count')){schedule();return;}
     if(el.querySelector&&el.querySelector('.header-top,.navigation-buttons,.search')){schedule();return;}
    }
   }
  });
  obs.observe(head,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
