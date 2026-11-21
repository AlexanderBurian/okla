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
    '<div class="okla-cart-summary__totals">'+
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
  var g=box.querySelector('.okla-cart-summary__gross');
  var gText=(price.textContent||'').replace(/\s+/g,' ').trim();
  if(g.textContent!==gText)g.textContent=gText;
 }

 /* Cart, right column (after B&H's cart, in Okla's look): the summary box gets a title and its lines (the goods with the
    number of pieces, delivery chosen in the next step, the total), and under it boxes of their own - the discount code
    (open) and help. PC only: phones keep the cart as it was. */
 var DESK=window.matchMedia('(min-width:992px)');
 function ico(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>'}
 var ICON={
  chat:'M20 11.5c0 4.1-3.6 7.5-8 7.5a8.6 8.6 0 0 1-3.4-.7L4 19.5l1.3-3.7A7.2 7.2 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5zM8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01',
  mail:'M5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5zM4 7l8 6 8-6',
  help:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9.7 9.3a2.4 2.4 0 0 1 4.6 1c0 1.6-2.3 2.1-2.3 3.6M12 16.7h.01',
  next:'m9.5 6 6 6-6 6'
 };
 function HELP_HTML(){
  /* Alza style: the title with a short line and the Okla manul beside it, then one row per way to reach us - an icon
     on a light blue disc, what it is, one grey line and a chevron */
  var row=function(href,icon,title,sub){return '<li><a class="okla-help__row" href="'+href+'"><span class="okla-help__ic">'+ico(icon)+'</span>'+
   '<span class="okla-help__txt"><strong>'+title+'</strong><small>'+sub+'</small></span><span class="okla-help__go">'+ico(ICON.next)+'</span></a></li>'};
  return '<section class="okla-cart-aside__card okla-help">'+
   '<div class="okla-help__head"><div class="okla-help__intro"><h2 class="okla-cart-aside__title">Potřebujete poradit?</h2><p class="okla-help__lead">Pomůžeme s výběrem i s objednávkou.</p></div>'+
   '<span class="okla-help__avatar" aria-hidden="true"><img src="'+(window.__oklaAssetBase||'')+'v91/img/okla-manul-avatar.webp" alt="" loading="lazy" decoding="async"></span></div>'+
   '<ul class="okla-help__list">'+
    row('/kontakt/',ICON.chat,'Napsat podpoře','Kontaktní formulář na webu')+
    row('mailto:podpora@okla.cz',ICON.mail,'podpora@okla.cz','Napište nám e-mail')+
    row('/jak-nakupovat/',ICON.help,'Jak nakupovat','Doprava, platba a vrácení zboží')+
   '</ul></section>';
 }
 /* Steps 2 and 3 (PC): the right column as three islands too - the recap (title, items, delivery, payment), the total
    with the button, and help. The recap's pieces are gathered into one box (.okla-recap-card; display:contents on
    phones, where nothing changes); Shoptet redraws the recap after a change, so this runs again then. */
 function stepIslands(){
  var b=document.body;if(!b.classList.contains('ordering-process')||b.classList.contains('in-kosik'))return;
  if(!b.classList.contains('in-krok-1')&&!b.classList.contains('in-krok-2'))return;
  var sb=document.querySelector('#checkoutSidebar #summary-box');
  if(sb&&!sb.querySelector(':scope>.okla-recap-card')){
   var parts=[].filter.call(sb.children,function(c){return c.matches('h2,.cart-items,.order-recapitulation')});
   if(parts.length){var card=document.createElement('div');card.className='okla-recap-card';sb.insertBefore(card,parts[0]);parts.forEach(function(p){card.appendChild(p)})}
  }
  if(document.querySelector('.okla-step-help'))return;
  var help=document.createElement('div');help.className='okla-cart-aside okla-step-help';help.innerHTML=HELP_HTML();
  if(b.classList.contains('in-krok-1')){
   var inner=document.querySelector('.cart-inner'),nav=inner&&inner.querySelector(':scope>.okla-step-nav');
   if(nav)inner.insertBefore(help,nav.nextSibling);
  }else{
   var side=document.querySelector('#checkoutSidebar');if(side)side.appendChild(help);
  }
 }
 /* Step 3 (PC): in the right column, in the help card's place, an ordering card - the "Objednat" button, the note on the
    terms and "Zpět"; the bar at the bottom is not shown on PC (okla_cart_aside.css). The button presses Shoptet's own
    order button, so the form is checked and sent exactly as before; the note and "Zpět" are copies of the bar's own.
    Phones keep the help card and the bar. */
 function orderCard(){
  var b=document.body;if(!b.classList.contains('in-krok-2'))return;
  var side=document.querySelector('#checkoutSidebar');
  var nav=document.querySelector('.okla-step-nav');
  var real=nav&&nav.querySelector('#orderFormButton,button.next-step-finish,.next-step-finish button,button[type="submit"]');
  if(!side||!nav||!real)return;
  var card=side.querySelector(':scope>.okla-step-order');
  if(!card){
   card=document.createElement('div');card.className='okla-cart-aside okla-step-order';
   card.innerHTML='<section class="okla-cart-aside__card"><button type="button" class="okla-step-order__btn"><span>Objednat</span>'+ico('m9 5 7 7-7 7')+'</button>'+
    '<p class="okla-step-order__terms"></p><a class="okla-step-order__back" href="/objednavka/krok-1/">'+ico('m15 5-7 7 7 7')+'<span>Zpět</span></a></section>';
   card.querySelector('.okla-step-order__btn').addEventListener('click',function(){
    var btn=document.querySelector('.okla-step-nav #orderFormButton,.okla-step-nav button.next-step-finish,.okla-step-nav .next-step-finish button,.okla-step-nav button[type="submit"]');
    if(btn&&!btn.disabled)btn.click();
   });
   var help=side.querySelector(':scope>.okla-step-help');
   if(help)side.insertBefore(card,help);else side.appendChild(card);
  }
  /* the note on the terms (with its links) and the address of "Zpět", as the bar has them */
  var terms=[].slice.call(nav.querySelectorAll('p,div,span')).filter(function(e){var x=e.textContent||'';return /Odesláním objednávky/i.test(x)&&/podmínk/i.test(x)&&!e.querySelector('button')}).pop();
  var t=card.querySelector('.okla-step-order__terms');
  if(terms&&t.innerHTML!==terms.innerHTML)t.innerHTML=terms.innerHTML;
  t.hidden=!terms;
  var back=nav.querySelector('.next-step-back[href],.next-step-back a[href]');
  if(back)card.querySelector('.okla-step-order__back').setAttribute('href',back.getAttribute('href'));
  card.querySelector('.okla-step-order__btn').disabled=!!real.disabled;
 }
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
   '<section class="okla-cart-aside__card okla-cart-aside__card--coupon"><h2 class="okla-cart-aside__title">Slevový nebo dárkový kód</h2><div class="okla-cart-aside__coupon-slot"></div></section>'+HELP_HTML();
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
  /* only the total: no amount without VAT anywhere (an earlier version added one; it is removed if still there) */
  wrap.querySelectorAll('.okla-recap-net').forEach(function(n){n.remove()});
  var label=wrap.querySelector('.price-wrapper .price-label');
  if(label&&label.textContent!=='K úhradě')label.textContent='K úhradě';
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

 function run(){removeDecorations();simplifyCopy();syncCartTotal();buildCartSummary();buildCartAside();buildCartSummary();stepIslands();cartUnitPrices();polishRecap();polishRecapAlza();stickyOrderBar();orderCard()}
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
