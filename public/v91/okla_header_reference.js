/* OKLA V94: align native Shoptet header behavior with the reference visual.
   Search is still the real /action/ProductSearch/ form; cart price stays native. */
(function(){
 'use strict';
 if(window.__oklaReferenceHeaderV94)return;
 window.__oklaReferenceHeaderV94=true;
 var desktop=window.matchMedia('(min-width:992px)');
 var ns='http://www.w3.org/2000/svg';
 function accountIcon(){
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 24 30');
  svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  var parts=[
   'M12 2.5c-4 0-6.2 2.9-6.2 7s2.2 7 6.2 7 6.2-2.9 6.2-7-2.2-7-6.2-7Z',
   'M3.1 27.5v-1.8c0-5.1 3.6-7.5 8.9-7.5s8.9 2.4 8.9 7.5v1.8'
  ];
  parts.forEach(function(d){
   var p=document.createElementNS(ns,'path');
   p.setAttribute('d',d);p.setAttribute('fill','none');
   p.setAttribute('stroke','currentColor');p.setAttribute('stroke-width','1.4');
   p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');
   svg.appendChild(p);
  });
  return svg;
 }
 function solidCartIcon(cart){
  var slot=cart.querySelector(':scope > .okla-cart-symbol');
  if(!slot || slot.dataset.oklaSolidCart==='1')return;
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  var body=document.createElementNS(ns,'path');
  body.setAttribute('d','M2 2.6h2.3c.72 0 1.34.49 1.5 1.19L6.35 6h14.3c.75 0 1.29.69 1.13 1.42l-1.6 7.14a3.15 3.15 0 0 1-3.08 2.46H9.82a3.15 3.15 0 0 1-3.08-2.45L4.45 4.9H2V2.6Z');
  body.setAttribute('fill','#171717');svg.appendChild(body);
  [10,18].forEach(function(x){
   var dot=document.createElementNS(ns,'circle');
   dot.setAttribute('cx',x);dot.setAttribute('cy','20.2');
   dot.setAttribute('r','1.6');dot.setAttribute('fill','#171717');svg.appendChild(dot);
  });
  slot.replaceChildren(svg);
  slot.dataset.oklaSolidCart='1';
 }
 function liveQuantity(cart){
  /* Official Shoptet data layer: cart[] contains product quantities and is
     refreshed after every basket mutation. Sum quantities, not SKU types. */
  var list;
  try{if(typeof window.getShoptetDataLayer==='function')list=window.getShoptetDataLayer('cart')}catch(e){}
  if(!Array.isArray(list)&&Array.isArray(window.dataLayer)){
   for(var d=0;d<window.dataLayer.length;d++){
    var s=window.dataLayer[d]&&window.dataLayer[d].shoptet;
    if(s&&Array.isArray(s.cart)){list=s.cart;break}
   }
  }
  if(Array.isArray(list)){
   return list.reduce(function(sum,item){
    var q=Number(item&&item.quantity);return sum+(isFinite(q)&&q>0?q:0)
   },0);
  }
  /* Fallback to the existing Shoptet DOM count attributes. */
  var names=['data-cart-count','data-quantity','data-count','data-items-count'];
  for(var i=0;i<names.length;i++){
   var n=cart.getAttribute(names[i]);
   if(n&&/^\d+$/.test(n)&&Number(n)>0)return Number(n);
  }
  var descendants=cart.querySelectorAll('.cart-quantity,.cart-count-number,.cart-item-count,.cart-items-count,[data-cart-quantity]');
  for(var j=0;j<descendants.length;j++){
   var el=descendants[j],v=el.getAttribute('data-cart-quantity')||el.textContent.trim();
   if(/^\d+$/.test(v)&&Number(v)>0)return Number(v);
  }
  return null;
 }
 function positionCartBadge(cart){
  if(!desktop.matches||!cart)return;
  var b=cart.querySelector(':scope > .okla-reference-cart-badge');
  var icon=cart.querySelector(':scope > .okla-cart-symbol');
  if(!b||!icon||b.hidden)return;
  var c=cart.getBoundingClientRect(),i=icon.getBoundingClientRect();
  if(!c.width||!i.width)return;
  var left=Math.round(i.right-c.left-8);
  var top=Math.round(i.top-c.top-7);
  b.style.setProperty('--okla-cart-badge-left',left+'px');
  b.style.setProperty('--okla-cart-badge-top',top+'px');
 }
 window.__oklaPositionCartBadge=function(){
  var cart=document.querySelector('#header .header-top .okla-exact-header > a.cart-count');
  if(cart)requestAnimationFrame(function(){positionCartBadge(cart)});
 };
 function sync(){
  if(!desktop.matches){
   document.documentElement.classList.remove('okla-header-reference');
   return;
  }
  var nav=document.querySelector('#header .header-top>.navigation-buttons');
  var row=nav&&nav.querySelector(':scope > .okla-exact-header');
  if(!row&&typeof window.oklaHeaderRefresh==='function'){
   window.oklaHeaderRefresh();
   row=nav&&nav.querySelector(':scope > .okla-exact-header');
  }
  if(!row)return;
  var account=row.querySelector(':scope > .okla-header-account');
  var cart=row.querySelector(':scope > a.cart-count');
  var locale=row.querySelector(':scope > .okla-header-locale');
  if(!account||!cart||!locale)return;
  var icon=account.querySelector('.okla-header-icon');
  if(icon&&icon.dataset.oklaReferenceIcon!=='1'){
   icon.replaceChildren(accountIcon());
   icon.dataset.oklaReferenceIcon='1';
  }
  var name=account.querySelector('.okla-header-copy strong');
  var loginVisible=!!document.querySelector('#navigation a[data-testid="signin"],.top-navigation-bar .top-nav-button-login');
  if(name){
   var lang=window.OKLA_LANG||document.documentElement.getAttribute('data-okla-lang')||'cs';
   var labels={
    cs:['PŘIHLÁŠENÍ','MŮJ ÚČET'],
    en:['SIGN IN','MY ACCOUNT'],
    sk:['PRIHLÁSENIE','MÔJ ÚČET'],
    hu:['BEJELENTKEZÉS','FIÓKOM']
   };
   var pair=labels[lang]||labels.cs;
   var label=pair[loginVisible?0:1];
   if(name.textContent!==label)name.textContent=label;
  }
  var small=account.querySelector('.okla-header-copy small');
  if(small)small.setAttribute('aria-hidden','true');
  var chevron=account.querySelector('.okla-header-chevron');
  if(!chevron){
   chevron=document.createElement('span');chevron.className='okla-header-chevron';
   chevron.setAttribute('aria-hidden','true');account.appendChild(chevron);
  }
  solidCartIcon(cart);
  var cartPrice=cart.querySelector(':scope > .cart-price');
  if(cartPrice)cartPrice.removeAttribute('aria-hidden');
  if(!cart.querySelector(':scope > .okla-reference-cart-chevron')){
   var arrow=document.createElement('span');arrow.className='okla-reference-cart-chevron';
   arrow.setAttribute('aria-hidden','true');cart.appendChild(arrow);
  }
  var badge=cart.querySelector(':scope > .okla-reference-cart-badge');
  var count=liveQuantity(cart);
  /* Fresh cart response can correct an as-yet stale Shoptet data layer. */
  var verified=window.__oklaVerifiedCartCount;
  if(verified && Date.now()-verified.at<12000)count=verified.value;
  if(count!==null&&count>0){
   if(!badge){
    badge=document.createElement('span');
    badge.className='okla-reference-cart-badge';badge.setAttribute('aria-hidden','true');
    cart.appendChild(badge);
   }
   badge.hidden=false;badge.textContent=count>99?'99+':String(count);
   requestAnimationFrame(function(){positionCartBadge(cart)});
  }else if(badge)badge.hidden=true;
  row.setAttribute('aria-label','Přihlášení, jazyk a nákupní košík');
  document.documentElement.classList.add('okla-header-reference');
 }
 var scheduled=false;
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(function(){scheduled=false;sync()});
 }
 function start(){
  schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
  ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated'].forEach(function(ev){document.documentElement.addEventListener(ev,schedule)});
  window.addEventListener('resize',schedule,{passive:true});
  if(desktop.addEventListener)desktop.addEventListener('change',schedule);
  [200,900,2000].forEach(function(ms){setTimeout(schedule,ms)});
  var header=document.querySelector('#header');
  if(header&&window.MutationObserver){
   var observer=new MutationObserver(function(changes){
    for(var i=0;i<changes.length;i++){
     if(changes[i].type!=='childList')continue;
     for(var j=0;j<changes[i].addedNodes.length;j++){
      var node=changes[i].addedNodes[j];
      if(node.nodeType!==1)continue;
      if(node.matches&&node.matches('.header-top,.navigation-buttons,.okla-exact-header,.cart-price')){
       schedule();return;
      }
     }
    }
   });
   observer.observe(header,{subtree:true,childList:true});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
