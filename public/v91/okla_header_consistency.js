/* OKLA V91 – non-destructive header synchronizer for all native pages.
   Keep Shoptet's native search and checkout logic; restore OKLA actions only if
   Shoptet builds a reduced header (notably on checkout/account/info pages). */
(function(){
 'use strict';
 if(window.__oklaConsistentHeaderV91)return;
 window.__oklaConsistentHeaderV91=true;
 var q=window.matchMedia('(min-width:768px)');
 function enhance(){
  if(!q.matches)return;
  var row=document.querySelector('#header .header-top');
  if(!row)return;
  var nav=row.querySelector(':scope > .navigation-buttons');
  if(!nav){
   nav=document.createElement('div');
   nav.className='navigation-buttons okla-header-ready';
   row.appendChild(nav);
  }
  var cart=nav.querySelector('a.cart-count');
  if(!cart){
   var nativeCart=document.querySelector('#header a.cart-count, #header a[href="/kosik/"], #header a[href*="/cart/"]');
   if(nativeCart&&nativeCart.closest('#header .header-top')===row){
    nativeCart.classList.add('cart-count');
    if(nativeCart.parentElement!==nav)nav.appendChild(nativeCart);
   }else{
    cart=document.createElement('a');
    cart.href='/kosik/';
    cart.className='cart-count okla-header-cart-fallback';
    cart.title='Košík';
    cart.setAttribute('aria-label','Otevřít košík');
    nav.appendChild(cart);
   }
  }
  if(typeof window.oklaHeaderRefresh==='function'){
    window.oklaHeaderRefresh();
  }
 }
 function schedule(){
  if(!q.matches)return;
  requestAnimationFrame(enhance);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
 window.addEventListener('load',schedule,{once:true});
 [250,1100,2400].forEach(function(t){setTimeout(schedule,t);});
 if(q.addEventListener)q.addEventListener('change',schedule);
 window.addEventListener('pageshow',schedule);
 /* No MutationObserver: legacy header refresh rebuilds separators and observing
    its own mutations would create a loop. */
})();
