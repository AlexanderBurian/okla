/* OKLA – phones: the bottom bar with the raised cart, and the Katalog / Menu panels with a fixed top
   (okla_mobile_tabbar.css). The bar and its panel (#okla-v61-drawer) are built by okla_behavior.js and the Menu content
   by okla_mobile_menu.js; this adds the bar's notched background, marks the cart, puts the OKLA logo into the top of the
   Katalog panel (its title moves into the content, as in Menu) and marks the item whose panel is open. */
(function(){
 'use strict';
 if(window.__oklaMobileTabbarV1)return;window.__oklaMobileTabbarV1=true;
 var root=document.documentElement;

 function decorate(){
  var bar=document.getElementById('okla-v61-bottom');
  if(!bar)return false;
  if(!bar.querySelector('.okla-tb-bg')){
   var bg=document.createElement('span');bg.className='okla-tb-bg';bg.setAttribute('aria-hidden','true');
   bg.appendChild(document.createElement('i'));
   bar.insertBefore(bg,bar.firstChild);
  }
  var cart=bar.querySelector('.okm61-bottom-action[aria-label="Košík"]');
  if(cart){
   cart.classList.add('okla-tb-cart');
   if(/^\/(kosik|objednavka)(\/|$)/.test(location.pathname)){
    cart.classList.add('is-active');
    /* the label is blue like the other active items (and is left alone by the text-contrast pass) */
    var lab=cart.querySelector('span');if(lab){lab.__oktc=1;lab.style.setProperty('color','#184e96','important')}
   }
  }
  /* "Objednávky" is the current item on the order-status page (/stav-objednavky/, served by
     /login/?zobrazit=stav-objednavky) and on the account's order list */
  var orders=bar.querySelector('.okm61-bottom-action[aria-label="Objednávky"]');
  if(orders&&!orders.classList.contains('is-active')&&(/^\/(stav-objednavky|objednavky)(\/|$)/.test(location.pathname)||/[?&]zobrazit=stav-objednavky(&|$)/.test(location.search))){
   orders.classList.add('is-active');
   var ol=orders.querySelector('span');if(ol){ol.__oktc=1;ol.style.setProperty('color','#184e96','important')}
  }
  root.classList.add('okla-tb-on');
  return true;
 }

 function logo(){
  var img=document.createElement('img');img.className='okla-mm-logo';
  img.src=(window.__oklaAssetBase||'')+'v91/img/okla-logo.png';img.alt='OKLA.cz';
  return img;
 }

 /* runs after okla_behavior.js has filled the panel (its handler is on the button itself) */
 document.addEventListener('click',function(e){
  var btn=e.target&&e.target.closest&&e.target.closest('#okla-v61-bottom .okm61-bottom-action');
  if(!btn)return;
  var label=btn.getAttribute('aria-label');
  if(label!=='Katalog'&&label!=='Menu')return;
  var overlay=document.getElementById('okla-v61-drawer');if(!overlay)return;
  var bar=document.getElementById('okla-v61-bottom');
  [].slice.call(bar.querySelectorAll('.is-panel')).forEach(function(b){b.classList.remove('is-panel')});
  btn.classList.add('is-panel');
  if(label==='Katalog'){
   var head=overlay.querySelector('.okm61-drawer-head strong'),body=overlay.querySelector('.okm61-drawer-body');
   if(head){head.replaceChildren(logo())}
   if(body&&!body.querySelector('.okla-tb-cats-title')){
    var t=document.createElement('h2');t.className='okla-tb-cats-title';t.textContent='Všechny kategorie';
    body.insertBefore(t,body.firstChild);
   }
  }
 });
 /* the item loses its mark when the panel closes */
 function watchPanel(){
  var overlay=document.getElementById('okla-v61-drawer');
  if(!overlay||overlay.__oklaTb)return;overlay.__oklaTb=true;
  new MutationObserver(function(){
   if(overlay.classList.contains('is-open'))return;
   var bar=document.getElementById('okla-v61-bottom');
   if(bar)[].slice.call(bar.querySelectorAll('.is-panel')).forEach(function(b){b.classList.remove('is-panel')});
  }).observe(overlay,{attributes:true,attributeFilter:['class']});
 }
 document.addEventListener('click',function(){setTimeout(watchPanel,0)},true);

 /* the number of items in the cart on the round cart button (the same number as the cart badge on PC); kept up to date
    when Shoptet refreshes its header cart after "Do košíku" */
 function cartCount(){
  var bar=document.getElementById('okla-v61-bottom'),cart=bar&&bar.querySelector('.okla-tb-cart');
  if(!cart)return false;
  var badge=cart.querySelector('.okla-tb-count');
  if(!badge){badge=document.createElement('b');badge.className='okla-tb-count';badge.setAttribute('aria-hidden','true');badge.__oktc=1;cart.appendChild(badge)}
  function read(){
   var i=document.querySelector('#header a.cart-count [data-testid="headerCartCount"]')||document.querySelector('#header a.cart-count i');
   var n=parseInt(((i&&i.textContent)||'').replace(/\D+/g,''),10)||0;
   badge.textContent=n>99?'99+':String(n);badge.hidden=!n;
   cart.setAttribute('aria-label',n?'Košík, '+n+' ks':'Košík');
  }
  read();
  var head=document.getElementById('header'),queued=false;
  if(head&&window.MutationObserver)new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;read()})}).observe(head,{childList:true,subtree:true,characterData:true});
  return true;
 }

 /* While the Katalog / Menu panel or the phone search is open, the page underneath is pinned where it is (iPhones
    ignore overflow:hidden on the page and would scroll it, or bounce it into view); on closing it is put back exactly
    where it was. The same while the AI chat is open full-screen on a phone (html.okla-ai-open, set by the widget). */
 var pinnedY=null;
 function pinned(){return document.body&&(document.body.classList.contains('okla-v61-locked')||root.classList.contains('okla-m-lock')||root.classList.contains('okla-ai-open'))}
 function pinUpdate(){
  var b=document.body;if(!b)return;
  if(pinned()&&pinnedY===null){
   pinnedY=window.scrollY||window.pageYOffset||0;
   b.style.setProperty('position','fixed','important');b.style.setProperty('top',(-pinnedY)+'px','important');
   b.style.setProperty('left','0','important');b.style.setProperty('right','0','important');b.style.setProperty('width','100%','important');
  }else if(!pinned()&&pinnedY!==null){
   var y=pinnedY;pinnedY=null;
   ['position','top','left','right','width'].forEach(function(p){b.style.removeProperty(p)});
   var se=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(0,y);root.style.scrollBehavior=se;
  }
 }
 if(window.MutationObserver){
  new MutationObserver(pinUpdate).observe(root,{attributes:true,attributeFilter:['class']});
  var watchBody=function(){if(document.body)new MutationObserver(pinUpdate).observe(document.body,{attributes:true,attributeFilter:['class']})};
  if(document.body)watchBody();else document.addEventListener('DOMContentLoaded',watchBody,{once:true});
 }

 var tries=0,countDone=false;
 (function start(){var a=decorate();if(a&&!countDone)countDone=cartCount();if((!a||!countDone)&&++tries<40)setTimeout(start,250)})();
})();
