(function(){
 'use strict';
 if(window.__oklaCheckoutAlza)return;
 window.__oklaCheckoutAlza=true;

 function removeDecorations(){
  document.querySelectorAll('.okla-parcel,.order-icon .okla-h-icon,#order-form h2 .okla-h-icon,#okla-footer-benefits,#okla-footer-promo').forEach(function(node){node.remove()});
 }

 function simplifyCopy(){
  var labels=window.matchMedia('(max-width:767px)').matches
   ?['Košík','Doprava','Údaje']
   :['Košík','Doprava a platba','Dodací údaje'];
  document.querySelectorAll('.cart-header .step').forEach(function(step,index){
   var span=step.querySelector('span');
   if(span&&labels[index]&&span.textContent!==labels[index])span.textContent=labels[index];
  });
  var delivery=document.querySelector('h2.order-delivery');
  if(delivery)delivery.textContent='Zvolte způsob doručení';
 }

 function moveCartTotal(){
  if(!document.body.classList.contains('in-kosik'))return;
  var actions=document.querySelector('.okla-step-nav .next-step');
  var price=document.querySelector('.okla-goods-total-price');
  if(!actions||!price)return;
  var holder=actions.querySelector('.okla-alza-total');
  if(!holder){
   holder=document.createElement('div');
   holder.className='okla-alza-total';
   var label=document.createElement('span');
   label.className='okla-alza-total__label';
   label.textContent='Cena k úhradě s DPH';
   holder.appendChild(label);
   var forward=actions.querySelector('.next-step-forward,.next-step-finish');
   actions.insertBefore(holder,forward||null);
  }
  if(!holder.contains(price))holder.appendChild(price);
  document.body.classList.add('okla-alza-ready');
 }

 var redrawTimer;
 function observeChanges(){
  removeDecorations();
  simplifyCopy();
  if(document.body.classList.contains('in-kosik')&&!document.querySelector('.okla-alza-total')&&document.querySelector('.okla-goods-total-price')){
   clearTimeout(redrawTimer);
   redrawTimer=setTimeout(moveCartTotal,0);
  }
 }

 function run(){removeDecorations();simplifyCopy();moveCartTotal()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
 else run();
 setTimeout(run,100);
 setTimeout(run,600);
 window.addEventListener('resize',simplifyCopy);
 ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated'].forEach(function(eventName){
  document.documentElement.addEventListener(eventName,function(){setTimeout(run,0);setTimeout(run,150)});
 });
 new MutationObserver(observeChanges).observe(document.documentElement,{childList:true,subtree:true});
})();
