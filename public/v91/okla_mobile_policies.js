/* OKLA V113 – mobile-only footer visibility and iOS header theme color.
   Existing navigation, drawer and order-status modules remain authoritative. */
(function(){
 'use strict';
 if(window.__oklaMobilePolishV113)return;
 window.__oklaMobilePolishV113=true;
 var mobile=window.matchMedia('(max-width:767px)');
 var root=document.documentElement;
 var THEME='#e5f5ff'; // current OKLA mobile header gradient begins here

 function isCartOrCheckout(){
  var path=location.pathname.replace(/\/+/g,'/');
  var body=document.body;
  return /^\/(?:kosik|objednavka)(?:\/|$)/i.test(path)
    || !!(body&&(body.classList.contains('in-kosik')||
       body.classList.contains('ordering-process')));
 }
 function markPage(){
  root.classList.toggle('okla-mobile-no-footer',mobile.matches&&isCartOrCheckout());
 }
 function iPhoneTheme(){
  var head=document.head;
  if(!head)return;
  var meta=head.querySelector('meta[data-okla-mobile-theme="1"]');
  if(!meta){
   meta=document.createElement('meta');
   meta.setAttribute('name','theme-color');
   meta.setAttribute('media','(max-width: 767px)');
   meta.setAttribute('data-okla-mobile-theme','1');
   meta.setAttribute('content',THEME);
   head.appendChild(meta);
  }
  // Applies to standalone home-screen apps, if the browser supports it.
  // Do not overwrite an existing explicit choice made by the shop.
  if(!head.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')){
   var status=document.createElement('meta');
   status.setAttribute('name','apple-mobile-web-app-status-bar-style');
   status.setAttribute('content','default');
   status.setAttribute('data-okla-mobile-status-bar','1');
   head.appendChild(status);
  }
 }
 function sync(){
  markPage();
  iPhoneTheme();
 }
 function start(){
  sync();
  window.addEventListener('pageshow',sync);
  if(mobile.addEventListener)mobile.addEventListener('change',sync);
  else if(mobile.addListener)mobile.addListener(sync);
  window.addEventListener('load',sync,{once:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();