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
   grossLabel.textContent='Cena k úhradě s DPH';
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


 function money(n){return new Intl.NumberFormat('cs-CZ',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' Kč'}
 function amountOf(text){var v=parseFloat(String(text||'').replace(/[^\d,.-]/g,'').replace(/\./g,'').replace(',','.'));return isFinite(v)?v:NaN}

 /* Cart (Alza): under the items, "Využít slevový / dárkový poukaz" on the left
    (opens the existing coupon card) and the totals on the right; the button
    row below sticks to the bottom of the screen while the totals are out of
    view and then settles under them. */
 function buildCartSummary(){
  if(!document.body.classList.contains('in-kosik'))return;
  var inner=document.querySelector('.cart-inner');
  var nav=inner&&inner.querySelector(':scope>.okla-step-nav');
  var price=document.querySelector('.okla-goods-total-price');
  if(!inner||!nav||!price)return;
  var box=inner.querySelector(':scope>.okla-cart-summary');
  if(!box){
   box=document.createElement('div');
   box.className='okla-cart-summary';
   box.innerHTML='<div class="okla-cart-summary__coupon"><button type="button" class="okla-cart-summary__toggle" aria-expanded="false">Využít slevový / dárkový poukaz</button><div class="okla-cart-summary__coupon-body" hidden></div></div>'+
    '<div class="okla-cart-summary__totals"><div class="okla-cart-summary__row"><span>Celkem bez DPH</span><span class="okla-cart-summary__net"></span></div>'+
    '<div class="okla-cart-summary__row okla-cart-summary__row--gross"><span>K úhradě s DPH</span><strong class="okla-cart-summary__gross"></strong></div></div>';
   inner.insertBefore(box,nav);
   var toggle=box.querySelector('.okla-cart-summary__toggle'),body=box.querySelector('.okla-cart-summary__coupon-body');
   toggle.addEventListener('click',function(){
    var open=body.hasAttribute('hidden');
    if(open)body.removeAttribute('hidden');else body.setAttribute('hidden','');
    toggle.setAttribute('aria-expanded',String(open));
    box.classList.toggle('is-coupon-open',open);
    if(open){var i=body.querySelector('input');if(i)i.focus()}
   });
   var sentinel=document.createElement('div');
   sentinel.className='okla-cart-summary__sentinel';
   nav.parentNode.insertBefore(sentinel,nav.nextSibling);
   if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
     entries.forEach(function(e){nav.classList.toggle('is-stuck',!e.isIntersecting)});
    }).observe(sentinel);
   }
  }
  /* move the coupon card in; keep a placeholder so it is not created twice */
  var card=document.querySelector('.okla-coupon');
  var body2=box.querySelector('.okla-cart-summary__coupon-body');
  if(card&&!body2.contains(card)){
   var col=card.parentNode;
   body2.innerHTML='';body2.appendChild(card);
   if(col&&!col.children.length){var ph=document.createElement('span');ph.className='okla-coupon-moved';ph.hidden=true;col.appendChild(ph)}
  }
  var gross=amountOf(price.textContent);
  var g=box.querySelector('.okla-cart-summary__gross'),n=box.querySelector('.okla-cart-summary__net');
  var gText=(price.textContent||'').replace(/\s+/g,' ').trim();
  if(g.textContent!==gText)g.textContent=gText;
  if(isFinite(gross)){var nText=money(gross/1.21);if(n.textContent!==nText)n.textContent=nText}
 }

 /* Steps 2 and 3 (Alza recap): "2x name" lines, and the total split into
    "K úhradě bez DPH" and "K úhradě s DPH". */
 function polishRecapAlza(){
  if(document.body.classList.contains('in-kosik'))return;
  document.querySelectorAll('.order-summary .cart-item').forEach(function(item){
   var name=item.querySelector('.cart-item-name'),amount=item.querySelector('.cart-item-amount');
   if(!name||!amount)return;
   var q=parseFloat((amount.textContent||'').replace(',','.'));
   var qty=isFinite(q)?String(q):'1';
   if(name.getAttribute('data-qty')!==qty)name.setAttribute('data-qty',qty);
  });
  /* shipping / payment prices: "0 Kč" reads as "zdarma" like the options */
  document.querySelectorAll('.order-summary .recapitulation-shipping-billing-info span').forEach(function(sp){
   if(/^\s*0\s*Kč\s*$/i.test(sp.textContent))sp.textContent='zdarma';
  });
  var wrap=document.querySelector('.order-summary .order-summary-item.price');
  var total=wrap&&wrap.querySelector('.price-wrapper strong.price');
  if(!wrap||!total)return;
  var net=wrap.querySelector('.okla-recap-net');
  if(!net){
   net=document.createElement('div');
   net.className='okla-recap-net';
   net.innerHTML='<span>K úhradě bez DPH</span><span class="okla-recap-net__value"></span>';
   wrap.insertBefore(net,wrap.firstChild);
  }
  var label=wrap.querySelector('.price-wrapper .price-label');
  if(label&&label.textContent!=='K úhradě s DPH')label.textContent='K úhradě s DPH';
  var v=amountOf(total.textContent);
  if(isFinite(v)){var t=money(v/1.21),node=net.querySelector('.okla-recap-net__value');if(node.textContent!==t)node.textContent=t}
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
 function run(){removeDecorations();simplifyCopy();syncCartTotal();buildCartSummary();polishRecap();polishRecapAlza()}
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
