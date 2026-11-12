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

 var tries=0;
 (function start(){if(!decorate()&&++tries<40)setTimeout(start,250)})();
})();
