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
   label.textContent='';
   holder.appendChild(label);
   var net=document.createElement('span');
   net.className='okla-alza-total__net-value';
   holder.appendChild(net);
   var grossLabel=document.createElement('span');
   grossLabel.className='okla-alza-total__label';
   grossLabel.textContent='Cena k úhradě';
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
    '<div class="okla-cart-summary__totals"><div class="okla-cart-summary__row" hidden><span></span><span class="okla-cart-summary__net"></span></div>'+
    '<div class="okla-cart-summary__row okla-cart-summary__row--gross"><span>K úhradě</span><strong class="okla-cart-summary__gross"></strong></div></div>';
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
  var body2=box.querySelector('.okla-cart-summary__coupon-body');
  /* the coupon card: moved in from the extras column, or built here when the page has none */
  var card=document.querySelector('.okla-coupon')||(!body2.children.length&&typeof window.__oklaBuildCoupon==='function'?window.__oklaBuildCoupon():null);
  /* PC: the coupon has its own open box in the right column (buildCartAside); phones: behind the toggle */
  var slot=(DESK.matches&&inner.querySelector('.okla-cart-aside__coupon-slot'))||body2;
  if(card&&!slot.contains(card)){
   var col=card.parentNode;
   if(slot===body2)body2.innerHTML='';
   slot.appendChild(card);
   if(col&&col!==body2&&!col.children.length){var ph=document.createElement('span');ph.className='okla-coupon-moved';ph.hidden=true;col.appendChild(ph)}
  }
  var gross=amountOf(price.textContent);
  var g=box.querySelector('.okla-cart-summary__gross'),n=box.querySelector('.okla-cart-summary__net');
  var gText=(price.textContent||'').replace(/\s+/g,' ').trim();
  if(g.textContent!==gText)g.textContent=gText;
  if(isFinite(gross)){var nText=money(gross/1.21);if(n.textContent!==nText)n.textContent=nText}
 }

 /* Cart, right column (after B&H's cart, in OKLA's look): the summary box gets a title and its lines (the goods with the
    number of pieces, delivery chosen in the next step, the total), and under it boxes of their own - the discount code
    (open) and help. PC only: phones keep the cart as it was. */
 var DESK=window.matchMedia('(min-width:992px)');
 function ico(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>'}
 var ICON={
  chat:'M4 5h16v11H9l-5 4zM8 10h8M8 13h5',
  mail:'M4 6h16v12H4zM4 7l8 6 8-6'
 };
 function pieces(){
  /* one quantity per item row (a row can hold more than one amount field) */
  var n=0,rows=new Set();
  document.querySelectorAll('#content .cart-row input[name="amount"]').forEach(function(i){
   var row=i.closest('tr,.cart-item,li')||i.parentNode;if(rows.has(row))return;rows.add(row);
   var v=parseFloat(String(i.value).replace(',','.'));if(isFinite(v)&&v>0)n+=v;
  });
  return n;
 }
 function line(cls,label,value){
  var r=document.createElement('div');r.className='okla-cart-summary__row okla-cart-summary__row--'+cls;
  var a=document.createElement('span');a.textContent=label;var b=document.createElement('span');b.className='okla-cart-summary__val';b.textContent=value;
  r.append(a,b);return r;
 }
 function buildCartAside(){
  if(!document.body.classList.contains('in-kosik'))return;
  var inner=document.querySelector('.cart-inner');
  var box=inner&&inner.querySelector(':scope>.okla-cart-summary');
  var price=document.querySelector('.okla-goods-total-price');
  var nav=inner&&inner.querySelector(':scope>.okla-step-nav');
  if(!box||!price||!nav)return;
  if(!box.querySelector('.okla-cart-summary__title')){
   var h=document.createElement('h2');h.className='okla-cart-summary__title';h.textContent='Souhrn objednávky';box.insertBefore(h,box.firstChild);
  }
  var totals=box.querySelector('.okla-cart-summary__totals'),gross=totals&&totals.querySelector('.okla-cart-summary__row--gross');
  if(totals&&gross&&!totals.querySelector('.okla-cart-summary__row--goods')){
   totals.insertBefore(line('goods','Zboží',''),gross);
   totals.insertBefore(line('ship','Doprava','v dalším kroku'),gross);
   var hr=document.createElement('div');hr.className='okla-cart-summary__divider';hr.setAttribute('aria-hidden','true');
   totals.insertBefore(hr,gross);
  }
  var goods=totals&&totals.querySelector('.okla-cart-summary__row--goods');
  if(goods){
   var n=pieces(),label=n?'Zboží ('+n+' ks)':'Zboží',value=(price.textContent||'').replace(/\s+/g,' ').trim();
   var spans=goods.children;
   if(spans[0].textContent!==label)spans[0].textContent=label;
   if(spans[1].textContent!==value)spans[1].textContent=value;
  }
  if(inner.querySelector(':scope>.okla-cart-aside'))return;
  var aside=document.createElement('div');aside.className='okla-cart-aside';
  aside.innerHTML=
   '<section class="okla-cart-aside__card okla-cart-aside__card--coupon"><h2 class="okla-cart-aside__title">Slevový nebo dárkový kód</h2><div class="okla-cart-aside__coupon-slot"></div></section>'+
   '<section class="okla-cart-aside__card"><h2 class="okla-cart-aside__title">Potřebujete poradit?</h2><p class="okla-cart-aside__text">Pomůžeme s výběrem i s objednávkou.</p>'+
    '<div class="okla-cart-aside__help"><a class="okla-cart-aside__chat" href="/kontakt/">'+ico(ICON.chat)+'<span>Napsat podpoře</span></a>'+
    '<a class="okla-cart-aside__mail" href="mailto:podpora@okla.cz">'+ico(ICON.mail)+'<span>podpora@okla.cz</span></a></div></section>';
  /* (no AI adviser in the order process: help is the contact form and the support e-mail) */
  inner.insertBefore(aside,nav.nextSibling);
 }
 if(DESK.addEventListener)DESK.addEventListener('change',function(){run()});

 /* Steps 2 and 3 (Alza recap): "2x name" lines, and the total split into
    one "K úhradě" total (no VAT wording anywhere on the site). */
 function polishRecapAlza(){
  if(document.body.classList.contains('in-kosik'))return;
  document.querySelectorAll('.order-summary .cart-item').forEach(function(item){
   var name=item.querySelector('.cart-item-name'),amount=item.querySelector('.cart-item-amount');
   if(!name||!amount)return;
   var q=parseFloat((amount.textContent||'').replace(',','.'));
   var qty=isFinite(q)?String(q):'1';
   if(name.getAttribute('data-qty')!==qty)name.setAttribute('data-qty',qty);
   /* more than one piece: the price per piece under the line total (like Alza) */
   var price=item.querySelector('.cart-item-price'),unit='';
   if(price&&q>1){
    var sum=amountOf(price.textContent);
    if(isFinite(sum)){var u=sum/q;unit=new Intl.NumberFormat('cs-CZ',{minimumFractionDigits:u%1?2:0,maximumFractionDigits:2}).format(u)+' Kč / ks'}
   }
   if(price&&(price.getAttribute('data-unit')||'')!==unit){if(unit)price.setAttribute('data-unit',unit);else price.removeAttribute('data-unit')}
  });
  /* shipping / payment prices: "0 Kč" reads as "zdarma" like the options */
  document.querySelectorAll('.order-summary .recapitulation-single strong span').forEach(function(sp){
   if(/^\s*0\s*Kč\s*$/i.test(sp.textContent))sp.textContent='zdarma';
  });
  var wrap=document.querySelector('.order-summary .order-summary-item.price');
  var total=wrap&&wrap.querySelector('.price-wrapper strong.price');
  if(!wrap||!total)return;
  var net=wrap.querySelector('.okla-recap-net');
  if(!net){
   net=document.createElement('div');
   net.className='okla-recap-net';
   net.innerHTML='<span></span><span class="okla-recap-net__value"></span>';net.hidden=true;
   wrap.insertBefore(net,wrap.firstChild);
  }
  var label=wrap.querySelector('.price-wrapper .price-label');
  if(label&&label.textContent!=='K úhradě')label.textContent='K úhradě';
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
 /* Cart: price per piece under the line total when there is more than one piece
    (Shoptet keeps it in the hidden "Cena za m. j." column) */
 function cartUnitPrices(){
  if(!document.body.classList.contains('in-kosik'))return;
  document.querySelectorAll('table.cart-table tr.removeable').forEach(function(tr){
   var unitEl=tr.querySelector('td.p-price .price-final'),totalEl=tr.querySelector('td.p-total .price-final');
   if(!totalEl)return;
   var u=unitEl?(unitEl.textContent||'').replace(/\s+/g,' ').trim():'',t=(totalEl.textContent||'').replace(/\s+/g,' ').trim();
   var want=(u&&t&&amountOf(u)!==amountOf(t))?u+' / ks':'';
   if((totalEl.getAttribute('data-unit')||'')!==want){if(want)totalEl.setAttribute('data-unit',want);else totalEl.removeAttribute('data-unit')}
  });
 }

 /* Step 3: the "Objednat" bar rides along at the bottom (CSS sticky); a marker right after it tells when it has reached
    its own place, so its shadow shows only while it floats over the form. */
 function stickyOrderBar(){
  if(!document.body.classList.contains('in-krok-2'))return;
  var nav=document.querySelector('.okla-step-nav');
  if(!nav||nav.__oklaStickyBar)return;
  nav.__oklaStickyBar=true;
  var mark=document.createElement('div');
  mark.className='okla-step-nav__sentinel';
  mark.setAttribute('aria-hidden','true');
  mark.style.cssText='height:1px;margin-top:-1px;pointer-events:none';
  nav.parentNode.insertBefore(mark,nav.nextSibling);
  if('IntersectionObserver' in window){
   new IntersectionObserver(function(entries){
    entries.forEach(function(e){nav.classList.toggle('is-stuck',!e.isIntersecting)});
   }).observe(mark);
  }
 }

 function run(){removeDecorations();simplifyCopy();syncCartTotal();buildCartSummary();buildCartAside();buildCartSummary();cartUnitPrices();polishRecap();polishRecapAlza();stickyOrderBar()}
 function schedule(){
  clearTimeout(redrawTimer);
  redrawTimer=setTimeout(run,260);
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
 ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated','ShoptetDOMCartContentLoaded'].forEach(function(eventName){
  document.addEventListener(eventName,schedule);
 });
})();
