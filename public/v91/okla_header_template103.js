/* OKLA V103 | Functional integration of the user's header_1to1.html.
   Retains Shoptet cart price, count, sign-in and hover widgets.
   It changes icons, geometry and accessible presentation only. */
(function(){
 'use strict';
 if(window.__oklaReferenceOneToOneV103)return;
 window.__oklaReferenceOneToOneV103=true;
 var desktop=window.matchMedia('(min-width:992px)');
 var ns='http://www.w3.org/2000/svg';
 function svg(cls,view,w,h){
  var s=document.createElementNS(ns,'svg');
  s.setAttribute('class',cls);
  s.setAttribute('viewBox',view);
  s.setAttribute('width',String(w));
  s.setAttribute('height',String(h));
  s.setAttribute('aria-hidden','true');
  s.setAttribute('focusable','false');
  return s;
 }
 function path(d,cls,attrs){
  var p=document.createElementNS(ns,'path');
  p.setAttribute('d',d);
  if(cls)p.setAttribute('class',cls);
  Object.keys(attrs||{}).forEach(function(k){p.setAttribute(k,attrs[k])});
  return p;
 }
 function userIcon(){
  var s=svg('okla-template-user','0 0 19 29',19,29);
  var c=document.createElementNS(ns,'circle');
  c.setAttribute('cx','9.5');
  c.setAttribute('cy','6.6');
  c.setAttribute('r','5.5');
  c.setAttribute('fill','none');
  c.setAttribute('stroke','#78859e');
  c.setAttribute('stroke-width','1.5');
  s.appendChild(c);
  s.appendChild(path('M1.1 28V20.1C1.1 15.4 4.8 13.3 9.5 13.3C14.2 13.3 17.9 15.4 17.9 20.1V28Z',
   null,{'fill':'none','stroke':'#78859e','stroke-width':'1.5','stroke-linejoin':'round'}));
  return s;
 }
 function cartIcon(){
  var s=svg('okla-template-cart','0 6 35 30',35,30);
  s.appendChild(path('M1.4 7.5H4C5.7 7.5 6.4 8.6 6.7 10.2L9.4 25.8','okla-cart-outline',
   {'fill':'none','stroke':'#78859e','stroke-width':'1.5','stroke-linecap':'round','stroke-linejoin':'round'}));
  s.appendChild(path('M7.5 13H32.5L30 27.1C29.8 28 28.9 28.6 27.6 28.6H12.6C11.5 28.6 10.4 27.9 10.2 26.8Z','okla-cart-fill',{'fill':'#78859e'}));
  ['13.9','27.7'].forEach(function(x){
   var c=document.createElementNS(ns,'circle');
   c.setAttribute('cx',x);
   c.setAttribute('cy','31.9');
   c.setAttribute('r','3.6');
   c.setAttribute('fill','#78859e');
   s.appendChild(c);
  });
  return s;
 }
 function downIcon(){
  var s=svg('okla-template-down','0 0 19 12',19,12);
  s.appendChild(path('M1 2L9.5 10L18 2',null,{
   'fill':'none','stroke':'#78859e','stroke-width':'1.8',
   'stroke-linecap':'round','stroke-linejoin':'round'
  }));
  return s;
 }
 function ensureArrow(holder,cls){
  var a=holder.querySelector(':scope > .'+cls);
  if(!a){
   a=document.createElement('span');
   a.className=cls;
   a.setAttribute('aria-hidden','true');
   holder.appendChild(a);
  }
  if(!a.querySelector(':scope > svg.okla-template-down'))a.replaceChildren(downIcon());
 }
 function apply(){
  if(!desktop.matches)return;
  var row=document.querySelector('#header .header-top .navigation-buttons>.okla-exact-header');
  if(!row)return;
  var login=row.querySelector(':scope > .okla-header-account');
  var cart=row.querySelector(':scope > a.cart-count');
  if(!login||!cart)return;
  var loginSlot=login.querySelector('.okla-header-icon');
  if(loginSlot&&!loginSlot.querySelector('svg.okla-template-user')){
   loginSlot.replaceChildren(userIcon());
   loginSlot.dataset.oklaReferenceIcon='1'; // prevent older icon module from overwriting
  }
  ensureArrow(login,'okla-header-chevron');
  var cartSlot=cart.querySelector(':scope > .okla-cart-symbol');
  if(cartSlot&&!cartSlot.querySelector('svg.okla-template-cart')){
   cartSlot.replaceChildren(cartIcon());
   cartSlot.dataset.oklaSolidCart='1'; // older module remains functional but not visual
  }
  ensureArrow(cart,'okla-reference-cart-chevron');
  var price=cart.querySelector(':scope > .cart-price');
  if(price)price.removeAttribute('aria-hidden');
  document.documentElement.classList.add('okla-header-reference');
  document.documentElement.classList.add('okla-header-template103');
 }
 var scheduled=false;
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(function(){scheduled=false;apply()});
 }
 function start(){
  schedule();
  [150,500,1250,2400].forEach(function(ms){setTimeout(schedule,ms)});
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('resize',schedule,{passive:true});
  if(desktop.addEventListener)desktop.addEventListener('change',schedule);
  ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated',
   'ShoptetCartAddCartItem','ShoptetCartDeleteCartItem'].forEach(function(ev){
    document.documentElement.addEventListener(ev,schedule);
  });
  var header=document.querySelector('#header .header-top');
  if(header&&window.MutationObserver){
   new MutationObserver(function(changes){
    for(var i=0;i<changes.length;i++){
     if(changes[i].type!=='childList')continue;
     for(var j=0;j<changes[i].addedNodes.length;j++){
      var n=changes[i].addedNodes[j];
      if(n.nodeType!==1)continue;
      if(n.matches&&n.matches('svg.okla-template-user,svg.okla-template-cart,svg.okla-template-down'))
       continue;
      if(n.matches&&n.matches('.okla-exact-header,.okla-header-account,.cart-count,.okla-cart-symbol,.okla-header-icon,.cart-price,.okla-reference-cart-badge'))
       {schedule();return}
      if(n.querySelector&&n.querySelector('.okla-exact-header,.cart-count,.okla-header-account'))
       {schedule();return}
     }
    }
   }).observe(header,{childList:true,subtree:true});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();