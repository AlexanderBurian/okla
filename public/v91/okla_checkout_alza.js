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

 function syncCartTotal(){
  if(!document.body.classList.contains('in-kosik'))return;
  var actions=document.querySelector('.okla-step-nav .next-step');
  var price=document.querySelector('.okla-goods-total-price');
  if(!actions||!price)return;
  var holder=actions.querySelector('.okla-alza-total');
  if(!holder){
   holder=document.createElement('div');
   holder.className='okla-alza-total';
   var label=document.createElement('span');
   label.className='okla-alza-total__net-label';
   label.textContent='Celkem bez DPH';
   holder.appendChild(label);
   var net=document.createElement('span');
   net.className='okla-alza-total__net-value';
   holder.appendChild(net);
   var grossLabel=document.createElement('span');
   grossLabel.className='okla-alza-total__label';
   grossLabel.textContent='K úhradě s DPH';
   holder.appendChild(grossLabel);
   var value=document.createElement('strong');
   value.className='okla-alza-total__value';
   holder.appendChild(value);
   var forward=actions.querySelector('.next-step-forward,.next-step-finish');
   actions.insertBefore(holder,forward||null);
  }
  var valueNode=holder.querySelector('.okla-alza-total__value');
  var nextValue=(price.textContent||'').replace(/\s+/g,' ').trim();
  if(valueNode&&valueNode.textContent!==nextValue)valueNode.textContent=nextValue;
  var amount=parseFloat(nextValue.replace(/[^\d,.-]/g,'').replace(/\./g,'').replace(',','.'));
  var netNode=holder.querySelector('.okla-alza-total__net-value');
  if(netNode&&isFinite(amount)){
   var netValue=new Intl.NumberFormat('cs-CZ',{minimumFractionDigits:2,maximumFractionDigits:2}).format(amount/1.21)+' Kč';
   if(netNode.textContent!==netValue)netNode.textContent=netValue;
  }
  document.body.classList.add('okla-alza-ready');
 }

 function polishRecap(){
  if(document.body.classList.contains('in-kosik'))return;
  var box=document.querySelector('.order-summary .checkout-box');
  if(!box)return;
  var heading=box.querySelector(':scope>h2');
  if(heading)heading.textContent='Rekapitulace objednávky';
  box.classList.add('okla-recap-ready');
 }

 var redrawTimer=0;
 function run(){removeDecorations();simplifyCopy();syncCartTotal();polishRecap()}
 function schedule(){
  clearTimeout(redrawTimer);
  redrawTimer=setTimeout(run,80);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
 else run();
 var bootTries=0,bootTimer=setInterval(function(){
  run();
  if(document.querySelector('.okla-step-nav')||++bootTries>=8)clearInterval(bootTimer);
 },250);
 var media=window.matchMedia('(max-width:767px)');
 if(media.addEventListener)media.addEventListener('change',simplifyCopy);
 else if(media.addListener)media.addListener(simplifyCopy);
 ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated'].forEach(function(eventName){
  document.documentElement.addEventListener(eventName,schedule);
 });
})();
