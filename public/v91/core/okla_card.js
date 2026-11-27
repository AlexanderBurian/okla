/* Okla – the product card (okla_card.css), one look everywhere: the photo, the rating, the name, the price (red; or,
   for a product the shop has really reduced, the dark sale box with its former price and the saving), the stock and
   the "Do košíku" button.
   - The shop's own Shoptet cards (rows, grids) get what their markup lacks: the rating row (only the shop's real
     reviews - "Bez hodnocení" otherwise, never made-up stars), the sale box and the yellow saving circle (only when the
     card shows a real former price higher than the price; the saving computed from the two), and a "Do košíku"
     button where the listing has none (adds by the product's code through the shop's own cart).
   - window.oklaCardBuild(d) makes the same card for our own blocks (the homepage bands, the "added to cart" dialog,
     the cart's suggestions); window.oklaCardUpdate(card,d) changes its price / stock / rating when real ones arrive.
   - A row standing on a grey ground gets .okc-on-grey (white photo boxes). */
(function(){
 'use strict';
 if(window.__oklaCardV2)return;window.__oklaCardV2=1;
 /* the sale box's line: the occasion, then the saving */
 var SALE_LABEL='BLACK FRIDAY';
 var CART='M7 7h14l-2.2 9H9L7 7Z|M2 3.8h3.6L8 16.2h11|c10 20.5 1.7|c18 20.5 1.7';

 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function kc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 /* the sale tag's prices the Alza way: '2 590,-' */
 function kd(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-'}
 function num(v){var s=String(v==null?'':v).replace(/\s| /g,'').replace(/[^\d,.-]/g,'').replace(',','.');var n=parseFloat(s);return isFinite(n)?n:0}
 function cartIcon(){
  var ns='http://www.w3.org/2000/svg',s=document.createElementNS(ns,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('class','okc-cart-ic');
  CART.split('|').forEach(function(d){var e;if(d[0]==='c'){var p=d.slice(1).split(' ');e=document.createElementNS(ns,'circle');e.setAttribute('cx',p[0]);e.setAttribute('cy',p[1]);e.setAttribute('r',p[2])}else{e=document.createElementNS(ns,'path');e.setAttribute('d',d);if(d.indexOf('M2')===0){e.setAttribute('fill','none');e.setAttribute('stroke','currentColor');e.setAttribute('stroke-width','1.8')}}s.appendChild(e)});
  return s;
 }
 /* the rating row: real reviews only */
 function rating(value,count){
  var r=el('div','okc-rating'+(count>0?'':' okc-rating--none'));
  var st=el('span','okc-stars');st.style.setProperty('--okc-r',(count>0?Math.max(0,Math.min(5,value))/5*100:0)+'%');st.setAttribute('aria-hidden','true');r.appendChild(st);
  if(count>0){r.appendChild(el('b','okc-rating__val',(Math.round(value*10)/10).toFixed(1).replace('.',',')));r.appendChild(el('span','okc-rating__count','('+count+')'));r.setAttribute('aria-label','Hodnocení '+String(value).replace('.',',')+' z 5, '+count+' recenzí')}
  else r.appendChild(el('span','okc-rating__count','Bez hodnocení'));
  return r;
 }
 function pct(now,was){return was>now&&now>0?Math.round((was-now)/was*100):0}
 /* the sale box: the price big, the former price struck through, the occasion and the saving */
 function saleBox(now,was){
  var p=pct(now,was),box=el('div','okc-sale');
  var top=el('div','okc-sale__prices');top.append(el('span','okc-sale__now',kd(now)),el('span','okc-sale__was',kd(was)));
  box.append(top,el('div','okc-sale__bar',SALE_LABEL+' -'+p+' %'));
  return box;
 }
 /* the shop's "Akční zboží" without a real former price: the same box, the price and the occasion only (no struck
    price, no saving - none is claimed) */
 function plainBox(now){var box=el('div','okc-sale okc-sale--plain'),top=el('div','okc-sale__prices');top.appendChild(el('span','okc-sale__now',kd(now)));box.append(top,el('div','okc-sale__bar',SALE_LABEL));return box}
 function isAction(prod){
  if(prod.querySelector('.flag-action'))return true;
  var shell=prod.closest('.okla-slider-shell'),h=shell&&shell.previousElementSibling;
  return !!(h&&h.classList.contains('homepage-group-title')&&/akční/i.test(h.textContent||''));
 }
 function disc(now,was){return el('span','okc-disc','-'+pct(now,was)+' %')}
 function addButton(code,href){
  var b=el('button','btn btn-cart okc-add');b.type='button';b.append(cartIcon(),el('span','','Do košíku'));
  b.addEventListener('click',function(e){
   e.preventDefault();e.stopPropagation();
   var cart=window.shoptet&&window.shoptet.cartShared;
   if(!code||!cart||typeof cart.addToCart!=='function'){if(href)location.href=href;return}
   b.disabled=true;b.classList.add('is-busy');
   var r;try{r=cart.addToCart({productCode:code,amount:1})}catch(err){}
   setTimeout(function(){b.disabled=false;b.classList.remove('is-busy')},1500);
  });
  return b;
 }
 function codeFor(url){
  var c=window.OKLA_V86_CATALOG||{},p='';try{p=new URL(url,location.origin).pathname}catch(e){}
  for(var k in c){var x=c[k];if(x&&x.url){try{if(new URL(x.url,location.origin).pathname===p)return x.code||k}catch(e){}}}
  return '';
 }

 /* ---------- our own cards ---------- */
 window.oklaCardBuild=function(d){
  var card=el('div','okc-card');
  var pic=el('a','okc-pic');pic.href=d.url;var im=el('img');im.src=d.image||'';im.alt=d.name||'';im.loading='lazy';im.decoding='async';im.draggable=false;if(d.w){im.width=d.w;im.height=d.h||d.w}pic.appendChild(im);
  var name=el('a','okc-name',d.name);name.href=d.url;
  var foot=el('div','okc-foot');
  if(d.form){var fb=d.form.querySelector('button');if(fb){fb.classList.add('okc-add');if(!fb.querySelector('svg'))fb.prepend(cartIcon());if(!fb.querySelector('span'))fb.appendChild(el('span','','Do košíku'))}foot.appendChild(d.form)}
  else{var b=addButton(d.code||codeFor(d.url),d.url);if(d.onAdd){b=b.cloneNode(true);b.addEventListener('click',function(e){e.preventDefault();d.onAdd(b)})}foot.appendChild(b)}
  card.append(pic,rating(d.rating||0,d.count||0),name,el('div','okc-pricebox'),el('div','okc-stock'),foot);
  window.oklaCardUpdate(card,d);
  return card;
 };
 window.oklaCardUpdate=function(card,d){
  if(!card)return;
  var pb=card.querySelector('.okc-pricebox'),pic=card.querySelector('.okc-pic');
  if(d.price>0){
   pb.textContent='';var old=card.querySelector('.okc-disc');if(old)old.remove();
   if(d.old>d.price){card.classList.add('okc-is-sale');pb.appendChild(saleBox(d.price,d.old));pic.appendChild(disc(d.price,d.old))}
   else if(d.action){card.classList.add('okc-is-sale');pb.appendChild(plainBox(d.price))}
   else{card.classList.remove('okc-is-sale');pb.appendChild(el('div','okc-price',kc(d.price)))}
  }
  if(d.count!=null&&d.count>0){var r=card.querySelector('.okc-rating');if(r)r.replaceWith(rating(d.rating,d.count))}
  if(d.stock!=null){var s=card.querySelector('.okc-stock');s.textContent=d.stock||'';s.className='okc-stock'+(d.stockClass?' '+d.stockClass:'')}
 };

 /* ---------- the shop's Shoptet cards ---------- */
 var CARDS='#content :is(.products-block,.products-page,.okla-cards,.okla-art-products)>.product';
 function enhance(prod){
  if(prod.__okc)return;var p=prod.querySelector(':scope>.p');if(!p)return;
  var name=p.querySelector('a.name');if(!name)return;
  prod.__okc=1;
  /* a clone (endless rows) already carries everything */
  if(p.querySelector('.okc-rating')){prod.setAttribute('data-okc','1');return}
  var sw=p.querySelector('[data-micro-rating-value]'),val=sw?num(sw.getAttribute('data-micro-rating-value')):0,cnt=sw?num(sw.getAttribute('data-micro-rating-count')):0;
  name.parentNode.insertBefore(rating(val,cnt),name);
  var offer=p.querySelector('[data-micro-price]'),now=offer?num(offer.getAttribute('data-micro-price')):0;
  if(!now){var pf=p.querySelector('.price-final');now=pf?num(pf.textContent):0}
  var std=p.querySelector('.price-standard:not(.price-standard-wrapper-placeholder)'),was=std?num(std.textContent):0;
  var prices=p.querySelector('.prices');
  if(now&&was>now&&prices){prod.classList.add('okc-is-sale');prices.parentNode.insertBefore(saleBox(now,was),prices.nextSibling);var img=p.querySelector('a.image');if(img)img.appendChild(disc(now,was))}
  else if(now&&prices&&isAction(prod)){prod.classList.add('okc-is-sale');prices.parentNode.insertBefore(plainBox(now),prices.nextSibling)}
  /* a "Do košíku" button where the listing has none */
  if(!p.querySelector('.p-tools button, .p-tools .btn')){
   var sku=p.querySelector('[data-micro="sku"]'),code=sku?sku.textContent.trim():'';
   var bottom=p.querySelector('.p-bottom')||p,tools=el('div','p-tools okc-tools');tools.appendChild(addButton(code,name.getAttribute('href')));
   (bottom.querySelector(':scope>[data-micro="offer"]')||bottom).appendChild(tools);
  }else{
   var btn=p.querySelector('.p-tools button, .p-tools .btn');
   if(btn&&!btn.querySelector('span')){btn.appendChild(el('span','','Do košíku'))}
  }
  prod.setAttribute('data-okc','1');
 }
 function enhanceAll(){document.querySelectorAll(CARDS+':not([data-okc])').forEach(function(c){try{enhance(c)}catch(e){}})}

 /* ---------- rows on a grey ground ---------- */
 var ROWS='#content :is(.products-block,.products-page,.okla-cards,.okla-art-products),#okla-cart-recs .ocr-grid';
 function ground(e){
  for(;e&&e!==document.documentElement;e=e.parentElement){
   var c=getComputedStyle(e).backgroundColor,m=c&&c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
   if(!m||(m[4]!==undefined&&+m[4]<0.5))continue;
   return [+m[1],+m[2],+m[3]];
  }
  return [255,255,255];
 }
 function mark(){
  document.querySelectorAll(ROWS).forEach(function(row){
   var g=ground(row.parentElement),grey=(g[0]+g[1]+g[2])/3<246;
   if(row.classList.contains('okc-on-grey')!==grey)row.classList.toggle('okc-on-grey',grey);
  });
 }
 function run(){enhanceAll();mark()}
 var t=0;function later(){clearTimeout(t);t=setTimeout(run,200)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 addEventListener('load',run,{once:true});[800,2000,4000,7000].forEach(function(ms){setTimeout(run,ms)});
 if(window.MutationObserver)new MutationObserver(function(rs){
  for(var i=0;i<rs.length;i++){var a=rs[i].addedNodes;for(var j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1&&(n.classList.contains('product')||n.matches(ROWS)||(n.querySelector&&n.querySelector('.product,.ocr-card')))){later();return}}}
 }).observe(document.documentElement,{childList:true,subtree:true});
})();
