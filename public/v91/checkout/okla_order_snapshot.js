/* Okla – what the customer is ordering, kept for the thank-you page (okla_thank_you.js). While the cart and the order
   steps are open, the items (photo, name, link, quantity, price), the chosen delivery with its pickup point, the payment
   method, their prices and the totals are read from Shoptet's own cart table and order summary and kept in this
   browser tab (sessionStorage) - Shoptet's thank-you page itself lists the order only as plain tables. The delivery
   address typed in the last step is kept too, for deliveries to an address. Nothing leaves the browser. */
(function(){
 'use strict';
 if(window.__oklaOrderSnapshot)return;window.__oklaOrderSnapshot=true;
 var KEY='okla-order-snapshot';
 function txt(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
 function load(){try{return JSON.parse(sessionStorage.getItem(KEY)||'null')||{}}catch(e){return {}}}
 function save(s){s.t=Date.now();try{sessionStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
 function path(a){try{return new URL(a.getAttribute('href'),location.origin).pathname}catch(e){return ''}}
 function imgOf(el){var i=el&&el.querySelector('img');if(!i)return '';var s=i.getAttribute('data-src')||i.getAttribute('src')||'';return /^data:/.test(s)?'':s}

 /* step 1: the cart table */
 function fromCart(s){
  var rows=[].slice.call(document.querySelectorAll('table.cart-table tr.removeable'));
  if(!rows.length)return false;
  s.items=rows.map(function(r){
   var a=r.querySelector('td.p-name a.main-link')||r.querySelector('td.p-name a');
   var q=r.querySelector('input[name="amount"]');
   var price=r.querySelector('td.p-total .price-final')||r.querySelector('td.p-total');
   var variant=txt(r.querySelector('td.p-name .p-variant, td.p-name .variant-name, td.p-name .p-variant-name'));
   return {href:a?path(a):'',name:txt(a),variant:variant,img:imgOf(r.querySelector('td.cart-p-image')),qty:q?String(q.value||'1'):'1',price:txt(price)};
  }).filter(function(i){return i.name});
  return true;
 }

 /* steps 2 and 3: the order summary beside the form */
 function fromSummary(s){
  var box=document.querySelector('#summary-box');if(!box)return false;
  var known={};(s.items||[]).forEach(function(i){known[i.href]=i});
  var items=[].slice.call(box.querySelectorAll('.cart-item')).map(function(it){
   var a=it.querySelector('.cart-item-name a');var href=a?path(a):'';
   var name=txt(a)||txt(it.querySelector('.cart-item-name'));
   var qty=(txt(it.querySelector('.cart-item-amount')).match(/\d+/)||['1'])[0];
   var before=known[href]||{};
   return {href:href,name:name,variant:before.variant||'',img:imgOf(it)||before.img||'',qty:qty,price:txt(it.querySelector('.cart-item-price'))};
  }).filter(function(i){return i.name});
  if(items.length)s.items=items;
  [].slice.call(box.querySelectorAll('.recapitulation-single')).forEach(function(r){
   var label=txt(r.querySelector('.recapitulation-shipping-billing-label')).toLowerCase();
   var info=r.querySelector('.recapitulation-shipping-billing-info');if(!info)return;
   var price=txt(info.querySelector('[data-testid="recapItemPrice"]'));
   var name=txt(info).replace(price,'').trim();
   var row={name:name,price:price};
   if(/doprav/.test(label))s.shipping=row;else if(/platb/.test(label))s.payment=row;
  });
  var goods=box.querySelector('[data-testid="recapItemTotalPrice"]');if(goods)s.goods=txt(goods);
  var total=box.querySelector('[data-testid="recapFullPrice"]');if(total)s.total=txt(total);
  return true;
 }

 /* step 2: the pickup point picked for the chosen delivery */
 function point(s){
  var w=document.querySelector('[data-testid="shippingMethod"].active, [data-testid="shippingMethod"] input:checked');
  if(w&&w.tagName==='INPUT')w=w.closest('[data-testid="shippingMethod"]');
  if(!w)return;
  var p=txt(w.querySelector('[data-testid="deliveryPoint"]'));
  if(p&&!/^zvolte/i.test(p))s.point=p.replace(/\s*(změnit|zmenit)\s*$/i,'');
  else if(p)delete s.point;
 }

 /* step 3: the address (the delivery address when one is filled in, otherwise the billing one) */
 function address(s){
  var f=document.getElementById('order-form');if(!f)return;
  function v(n){var i=f.querySelector('[name="'+n+'"]');return i&&i.value?String(i.value).trim():''}
  function pick(p){var street=v(p+'Street'),house=v(p+'HouseNumber'),zip=v(p+'Zip'),city=v(p+'City');
   if(!street&&!city)return null;return [(street+(house?' '+house:'')).trim(),(zip+' '+city).trim()].filter(Boolean)}
  var useDelivery=(f.querySelector('[name="another-shipping"]:checked, #another-shipping:checked'));
  var a=(useDelivery&&pick('delivery'))||pick('bill');
  if(a)s.address=a;
 }

 var queued=false;
 function run(){
  queued=false;
  var s=load();
  if(document.body&&/(^|\s)in-kosik(\s|$)/.test(document.body.className)){s={};}
  fromCart(s);fromSummary(s);point(s);address(s);
  if(s.items&&s.items.length)save(s);
 }
 function schedule(){if(!queued){queued=true;setTimeout(run,150)}}
 function start(){
  run();
  var root=document.getElementById('content')||document.body;
  if(window.MutationObserver)new MutationObserver(schedule).observe(root,{childList:true,subtree:true,characterData:true});
  document.addEventListener('change',schedule,true);
  document.addEventListener('input',schedule,true);
  var f=document.getElementById('order-form');if(f)f.addEventListener('submit',run,true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
