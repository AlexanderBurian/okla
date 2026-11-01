/* OKLA checkout pages. The header icons are the same as on the homepage; the order summary shows the product
   thumbnails; the payment methods get pictograms; the cart gets minus and plus buttons; the help box and the
   empty boxes are hidden. */
(function(){
 'use strict';
 if(window.__oklaCheckoutUiV1)return;
 window.__oklaCheckoutUiV1=true;

 var NS='http://www.w3.org/2000/svg';

 function el(name,cls){var e=document.createElement(name);if(cls)e.className=cls;return e}

 function svgPaths(paths,cls){
  var s=document.createElementNS(NS,'svg');
  s.setAttribute('viewBox','0 0 24 24');
  s.setAttribute('aria-hidden','true');
  s.setAttribute('focusable','false');
  if(cls)s.setAttribute('class',cls);
  paths.forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});
  return s;
 }

 /* The Czech flag, the same drawing as the homepage header. */
 function oklaCzechFlag(){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),ns='http://www.w3.org/2000/svg';svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');var defs=document.createElementNS(ns,'defs'),clip=document.createElementNS(ns,'clipPath');clip.setAttribute('id','okla-cz-flag-clip');var clipCircle=document.createElementNS(ns,'circle');clipCircle.setAttribute('cx','16');clipCircle.setAttribute('cy','16');clipCircle.setAttribute('r','15.4');clip.appendChild(clipCircle);defs.appendChild(clip);svg.appendChild(defs);var group=document.createElementNS(ns,'g');group.setAttribute('clip-path','url(#okla-cz-flag-clip)');var bg=document.createElementNS(ns,'rect');bg.setAttribute('width','32');bg.setAttribute('height','32');bg.setAttribute('fill','#fff');group.appendChild(bg);var red=document.createElementNS(ns,'rect');red.setAttribute('y','16');red.setAttribute('width','32');red.setAttribute('height','16');red.setAttribute('fill','#d7142d');group.appendChild(red);var blue=document.createElementNS(ns,'path');blue.setAttribute('d','M0 0 17 16 0 32Z');blue.setAttribute('fill','#0c3174');group.appendChild(blue);svg.appendChild(group);return svg;}

 function buildIcons(row,cart){
  if(!row.querySelector('.okla-header-account')){
   var account=el('button','okla-header-account');
   account.type='button';
   account.setAttribute('aria-label','Můj účet – přihlásit se');
   var icon=el('span','okla-header-icon');
   icon.appendChild(svgPaths(['M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM4.8 20.1c.1-4 3-6.5 7.2-6.5s7.1 2.5 7.2 6.5v.4H4.8v-.4Z']));
   var copy=el('span','okla-header-copy');
   var strong=el('strong');strong.textContent='Můj účet';
   var small=el('small');small.textContent='Přihlásit se';
   copy.appendChild(strong);
   copy.appendChild(small);
   account.appendChild(icon);
   account.appendChild(copy);
   account.appendChild(el('span','okla-header-chevron'));
   account.addEventListener('click',function(){window.location.href='/login/'});
   row.insertBefore(account,cart);
  }
  if(!row.querySelector('.okla-header-orders')){
   var orders=el('a','okla-header-orders');
   orders.href='/klient/';
   orders.rel='nofollow';
   orders.title='Moje objednávky';
   orders.setAttribute('aria-label','Moje objednávky');
   orders.appendChild(svgPaths(['M6 8h12l1.3 12H4.7L6 8Z','M9 9V6a3 3 0 0 1 6 0v3','m8.8 14 2.3 2.3 4.2-4.2'],'okla-header-lineicon'));
   row.insertBefore(orders,cart);
  }
  if(!row.querySelector('.okla-header-favorites')){
   var fav=el('button','okla-header-favorites');
   fav.type='button';
   fav.title='Oblíbené produkty';
   fav.setAttribute('aria-label','Oblíbené produkty');
   fav.appendChild(svgPaths(['M20.6 8.7c0 4.1-8.6 10.4-8.6 10.4S3.4 12.8 3.4 8.7a4.6 4.6 0 0 1 8.6-2.1 4.6 4.6 0 0 1 8.6 2.1Z'],'okla-header-lineicon'));
   row.insertBefore(fav,cart);
  }
  if(!row.querySelector('.okla-header-locale')){
   var locale=el('span','okla-header-locale');
   locale.title='Čeština · CZK';
   locale.setAttribute('aria-label','Čeština, česká koruna');
   var flag=oklaCzechFlag();
   flag.setAttribute('class','okla-header-flagicon');
   locale.appendChild(flag);
   row.insertBefore(locale,cart);
  }
  if(!cart.querySelector('.okla-cart-symbol')){
   var sym=el('span','okla-cart-symbol');
   sym.setAttribute('aria-hidden','true');
   sym.appendChild(svgPaths(['M3 3.5h2.3l2.1 10.7a2 2 0 0 0 1.9 1.6h8.3a2 2 0 0 0 1.9-1.6L21 7H6.2','M9.5 20.5h.02','M17.9 20.5h.02'],'okla-header-lineicon'));
   cart.insertBefore(sym,cart.firstChild);
  }
 }

 /* The cart link is copied from the homepage markup, because the ordering template has none. */
 function restoreHeader(){
  var nav=document.querySelector('#header .header-top>.navigation-buttons');
  if(!nav)return;
  var row=nav.querySelector('.okla-exact-header');
  if(!row)return;
  var cart=nav.querySelector('a.cart-count')||row.querySelector('a.cart-count');
  if(cart){
   if(!row.contains(cart))row.appendChild(cart);
   buildIcons(row,cart);
   return;
  }
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   var src=doc.querySelector('#header .header-top>.navigation-buttons a.cart-count');
   if(!src||row.querySelector('a.cart-count'))return;
   var c=document.importNode(src,true);
   row.appendChild(c);
   buildIcons(row,c);
  }).catch(function(){});
 }

 function norm(s){return String(s||'').replace(/\s+/g,' ').trim().toLowerCase()}

 /* Product thumbnails in the order summary, taken from the cart page by product name. */
 function addSummaryThumbs(){
  var items=document.querySelectorAll('.order-summary .cart-item');
  if(!items.length)return;
  fetch('/kosik/',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   var map={};
   doc.querySelectorAll('tr.removeable').forEach(function(tr){
    var a=tr.querySelector('.main-link'),img=tr.querySelector('.cart-p-image img');
    if(a&&img)map[norm(a.textContent)]=img.getAttribute('data-src')||img.getAttribute('src');
   });
   Array.prototype.forEach.call(items,function(item){
    var n=item.querySelector('.cart-item-name');
    var src=n?map[norm(n.textContent)]:null;
    if(!src||item.querySelector('.okla-sum-thumb'))return;
    var im=document.createElement('img');
    im.className='okla-sum-thumb';
    im.alt='';
    im.src=src;
    item.insertBefore(im,item.firstChild);
   });
  }).catch(function(){});
 }

 /* The help box with the photo is not wanted on the ordering pages. Only a box that holds no form, table or summary is hidden. */
 function hideHelpBox(){
  var keep='input,select,textarea,form,table,.order-summary,.next-step';
  var hide=function(b){if(b&&!b.querySelector(keep))b.style.display='none'};
  document.querySelectorAll('body *').forEach(function(h){
   if(h.children.length>3)return;
   var own=Array.prototype.filter.call(h.childNodes,function(n){return n.nodeType===3}).map(function(n){return n.textContent}).join('');
   if(!/Potřebujete pomoc/.test(own))return;
   var bx=h.closest('.box');
   if(bx)hide(bx);
   else if(!h.querySelector(keep))h.style.display='none';
  });
  document.querySelectorAll('img').forEach(function(i){
   if(/cimrman|jara/i.test((i.getAttribute('alt')||'')+' '+(i.getAttribute('src')||'')))hide(i.closest('.box'));
  });
 }

 /* Empty boxes left over in the right column are removed. */
 function hideEmptyShells(){
  document.querySelectorAll('.col-md-4 > *, .col-md-4 > * > *, .order-summary > *').forEach(function(b){
   if(b.innerText.trim()===''&&!b.querySelector('input,select,textarea,button,img,svg'))b.style.display='none';
  });
 }

 var PAY_ICONS=[
  {match:/hotov/i,paths:['M2.5 6.5h19v11h-19z','M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z']},
  {match:/převod/i,paths:['M3 9.5 12 4l9 5.5','M4.5 10v8.5M9.5 10v8.5M14.5 10v8.5M19.5 10v8.5','M3 20.5h18']},
  {match:/dobírk/i,paths:['M3.5 7.5 12 4.5l8.5 3v9L12 19.5l-8.5-3z','M3.5 7.5 12 10.5l8.5-3','M12 10.5v9']}
 ];

 function addPaymentIcons(){
  document.querySelectorAll('.co-payment-method .radio-wrapper').forEach(function(row){
   if(row.querySelector('.okla-pay-icon'))return;
   var txt=row.textContent||'';
   for(var i=0;i<PAY_ICONS.length;i++){
    if(!PAY_ICONS[i].match.test(txt))continue;
    var wrap=el('span','okla-pay-icon');
    wrap.setAttribute('aria-hidden','true');
    wrap.appendChild(svgPaths(PAY_ICONS[i].paths));
    var label=row.querySelector('label');
    if(label&&label.parentNode)label.parentNode.insertBefore(wrap,label);
    else row.insertBefore(wrap,row.firstChild);
    break;
   }
  });
 }

 /* Minus and plus buttons around the quantity in the cart; the change is sent the way the input sends it. */
 function addQuantityButtons(){
  document.querySelectorAll('tr.removeable form.quantity-form').forEach(function(form){
   if(form.querySelector('.okla-qty'))return;
   var input=form.querySelector('input.amount');
   if(!input||!input.parentNode)return;
   var minus=el('button','okla-qty okla-qty--minus');
   minus.type='button';
   minus.setAttribute('aria-label','Snížit množství');
   minus.textContent='−';
   var plus=el('button','okla-qty okla-qty--plus');
   plus.type='button';
   plus.setAttribute('aria-label','Zvýšit množství');
   plus.textContent='+';
   function step(d){
    var v=parseInt(input.value,10)||1;
    v=Math.max(1,Math.min(9999,v+d));
    input.value=v;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
   }
   minus.addEventListener('click',function(){step(-1)});
   plus.addEventListener('click',function(){step(1)});
   input.parentNode.insertBefore(minus,input);
   input.parentNode.insertBefore(plus,input.nextSibling);
  });
 }

 /* The parcel starts at the first step and walks slowly, one step at a time, to the current step.
    Each stop is the measured centre of its step, so the box sits centred on it. */
 function addParcel(){
  var ol=document.querySelector('.cart-header');
  if(!ol||ol.querySelector('.okla-parcel'))return;
  var steps=Array.prototype.filter.call(ol.children,function(li){return li.classList.contains('step')});
  if(steps.length<3)return;
  var idx=document.body.classList.contains('in-krok-2')?2:(document.body.classList.contains('in-krok-1')?1:0);
  var box=document.createElement('div');
  box.className='okla-parcel';
  box.setAttribute('aria-hidden','true');
  box.innerHTML='<svg viewBox="0 0 48 48"><path d="M24 4.5 43 14 24 23.5 5 14Z" fill="#e7bf8a"/><path d="M5 14 24 23.5V44L5 34.5Z" fill="#c28d55"/><path d="M43 14 24 23.5V44l19-9.5Z" fill="#a46e3c"/><path d="M20.8 8.6 27.2 11.8V23.4L20.8 20.2Z" fill="#f5ead3"/><path d="M33.4 25.8 37.6 27.9V40.4L33.4 38.3Z" fill="#f5ead3"/><path d="M24 23.5V44" stroke="#8a5a2c" stroke-width="1.2"/></svg>';
  var stops,segs;
  /* The stops are the measured centres of the steps; the track and the parcel read one position, so they always move together. */
  function layout(){
   stops=steps.map(function(li){return li.offsetLeft+li.offsetWidth/2});
   segs=[];
   for(var k=1;k<=idx;k++){segs.push({from:stops[k-1],to:stops[k],start:400+(k-1)*2600})}
   ol.style.setProperty('--x1',stops[0]+'px');
   ol.style.setProperty('--x3',stops[2]+'px');
  }
  var DUR=2400;
  function ease(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2}
  /* The position at time t (ms): each step is one eased move of DUR ms, one after another. */
  function place(t){
   var v=stops[0];
   for(var s=0;s<segs.length;s++){
    var g=segs[s];
    if(t<g.start){v=g.from;break}
    var p=Math.min(1,(t-g.start)/DUR);
    v=g.from+(g.to-g.from)*ease(p);
    if(p<1)break;
   }
   ol.style.setProperty('--pos',v+'px');
   return t>=(segs.length?segs[segs.length-1].start+DUR:0);
  }
  layout();
  /* Set before the box is inserted, so the box starts on its step and does not slide in from the default position. */
  ol.style.setProperty('--pos',stops[0]+'px');
  ol.appendChild(box);
  box.getBoundingClientRect();
  var arrive=idx?400+(idx-1)*2600+2400:0;
  box.style.animationDelay=((arrive+300)/1000)+'s';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)place(Infinity);
  else{
   var t0=Date.now();
   (function tick(){if(!place(Date.now()-t0))setTimeout(tick,16)})();
  }
  window.addEventListener('resize',function(){layout();place(Infinity)});
 }

 /* On the delivery step only Zásilkovna is offered; a hidden method that was selected moves the choice to Zásilkovna. */
 function keepOnlyZasilkovna(){
  var rows=document.querySelectorAll('.co-delivery-method .radio-wrapper');
  if(!rows.length)return;
  var keepRe=/z[aá]silkovna/i;
  var target=null;
  Array.prototype.forEach.call(rows,function(row){
   var keep=keepRe.test(row.textContent||'');
   if(keep)row.style.removeProperty('display');
   else row.style.setProperty('display','none','important');
   if(keep&&!target)target=row;
  });
  var checked=document.querySelector('.co-delivery-method .radio-wrapper input:checked');
  if(checked&&checked.closest('.radio-wrapper').style.display==='none'&&target){
   var inp=target.querySelector('input[type=radio]');
   if(inp)inp.click();
  }
 }

 /* The coupon card of the reference, in the empty left column of the cart extras. It is not connected to Shoptet coupons. */
 function addCoupon(){
  var col=document.querySelector('.extras-wrapper>.extras-col');
  if(!col||col.children.length)return;
  var card=el('div','okla-coupon');
  var title=el('p','okla-coupon__title');
  title.innerHTML='Mám <strong>slevový kupón:</strong>';
  var row=el('div','okla-coupon__row');
  var input=el('input','okla-coupon__input');
  input.type='text';
  input.placeholder='Zadejte kód kupónu';
  input.setAttribute('aria-label','Kód kupónu');
  var btn=el('button','okla-coupon__btn');
  btn.type='button';
  btn.textContent='Aplikovat';
  row.appendChild(input);
  row.appendChild(btn);
  card.appendChild(title);
  card.appendChild(row);
  col.appendChild(card);
 }

 /* The heading above the extras is replaced by the cards. */
 function hideExtrasHeading(){
  document.querySelectorAll('.cart-content *').forEach(function(e){
   if(e.children.length||e.closest('.okla-coupon'))return;
   if(/^\s*dárky a slevy\s*$/i.test(e.textContent||''))e.style.display='none';
  });
 }

 /* Section icons of the reference: truck, wallet, user and signpost. */
 var SECTION_ICONS={
  'co-delivery-method':'<path d="M2.5 6.5h11.5v10H2.5z"/><path d="M14 10h4.2l3.3 3.5V16.5H14"/><circle cx="6.5" cy="17.5" r="1.9"/><circle cx="17.5" cy="17.5" r="1.9"/>',
  'co-payment-method':'<path d="M3 7.5h16.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18.5z"/><path d="M3 7.5 5.5 4.5h11"/><circle cx="16.5" cy="13" r="1.3"/>',
  'co-contact-information':'<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c.9-4 4-6.3 7.5-6.3s6.6 2.3 7.5 6.3"/>',
  'co-billing-address':'<path d="M9 3v18"/><path d="M9 5h10l2.5 2.5L19 10H9"/><path d="M9 13H4l-2 2 2 2h5"/>'
 };

 function addSectionIcons(){
  Object.keys(SECTION_ICONS).forEach(function(cls){
   var box=document.querySelector('.'+cls);
   var h=box&&box.querySelector(':scope>h2');
   if(!h||h.querySelector('.okla-h-icon'))return;
   var span=el('span','okla-h-icon');
   span.setAttribute('aria-hidden','true');
   span.innerHTML='<svg viewBox="0 0 24 24">'+SECTION_ICONS[cls]+'</svg>';
   h.insertBefore(span,h.firstChild);
  });
 }

 /* The step buttons move into the summary card, as in the reference; only when the form association allows it. */
 function moveNextStep(){
  var next=document.querySelector('.next-step');
  var box=document.querySelector('.order-summary .checkout-box');
  if(!next||!box||box.contains(next))return;
  var btn=next.querySelector('button[type=submit]');
  var sameForm=next.closest('form')===box.closest('form');
  if(sameForm||(btn&&btn.hasAttribute('form')))box.appendChild(next);
 }

 function kcNumber(text){
  var m=String(text||'').match(/([\d\s\u00a0]+)\s*Kč/);
  if(!m)return null;
  var n=parseInt(m[1].replace(/[\s\u00a0]/g,''),10);
  return isFinite(n)?n:null;
 }

 function formatKc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0')+' Kč'}

 /* The goods total from the page, and the free delivery from 5 000 Kč. */
 function goodsTotal(){
  var leaf=Array.prototype.find.call(document.querySelectorAll('body *'),function(e){return e.children.length===0&&/Celkem za zboží/.test(e.textContent||'')});
  var node=leaf;
  for(var i=0;node&&i<4;i++){
   var v=kcNumber(node.textContent.replace(/Celkem za zboží/,''));
   if(v!==null)return v;
   node=node.parentElement;
  }
  return null;
 }

 function freeShippingText(total){
  var rest=5000-total;
  var parts=[];
  if(rest>0){parts.push('Nakupte ještě za '); parts.push({b:formatKc(rest)}); parts.push(' a dopravu máte '); parts.push({b:'zdarma'}); parts.push('!');}
  else{parts.push('Dopravu máte '); parts.push({b:'zdarma'}); parts.push('!');}
  return parts;
 }

 function fillParts(target,parts){
  target.textContent='';
  parts.forEach(function(p){
   if(typeof p==='string')target.appendChild(document.createTextNode(p));
   else{var b=document.createElement('strong');b.textContent=p.b;target.appendChild(b)}
  });
 }

 function freeShipping(){
  var total=goodsTotal();
  if(total===null)return;
  var parts=freeShippingText(total);
  document.querySelectorAll('.extra.delivery span').forEach(function(s){fillParts(s,parts)});
  var box=document.querySelector('.order-summary .checkout-box');
  if(box&&!box.querySelector('.okla-free-ship')){
   var note=el('p','okla-free-ship');
   fillParts(note,parts);
   box.insertBefore(note,box.firstChild);
  }
 }

 /* On the cart the coupon and delivery cards sit one under the other, under the summary box at the top right. */
 function moveCartExtras(){
  var ew=document.querySelector('.extras-wrapper');
  var side=document.querySelector('.cart-row>.col-md-4');
  if(!ew||!side||ew.parentElement===side)return;
  side.appendChild(ew);
 }

 function init(){
  restoreHeader();
  hideHelpBox();
  addSummaryThumbs();
  hideEmptyShells();
  addPaymentIcons();
  addQuantityButtons();
  addParcel();
  addCoupon();
  moveCartExtras();
  hideExtrasHeading();
  addSectionIcons();
  moveNextStep();
  freeShipping();
  keepOnlyZasilkovna();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
})();
