/* OKLA checkout pages: Shoptet's ordering template has no cart link in the header, so the header icons
   cannot be built. The cart link is copied from the homepage markup and the header icon builder runs again. */
(function(){
 'use strict';
 if(window.__oklaCheckoutV1)return;
 window.__oklaCheckoutV1=true;

 function restoreCartLink(){
  var nav=document.querySelector('#header .header-top>.navigation-buttons');
  if(!nav||nav.querySelector('a.cart-count'))return;
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   var src=doc.querySelector('#header .header-top>.navigation-buttons a.cart-count');
   if(!src||nav.querySelector('a.cart-count'))return;
   nav.appendChild(document.importNode(src,true));
   window.dispatchEvent(new Event('resize'));
  }).catch(function(){});
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restoreCartLink);
 else restoreCartLink();
})();
