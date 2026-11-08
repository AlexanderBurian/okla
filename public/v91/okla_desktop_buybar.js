/* OKLA – desktop product page: once the product's own buy button scrolls out of view, the sticky header gives way to
   a buy bar (as on the big shops): picture, name, stars, stock, price and the green "Do košíku" (it clicks Shoptet's
   own button, so the cart, quantity and drawer work as usual). Sold-out products get "Hlídat dostupnost", which opens
   Shoptet's watchdog. The bar's content has the width of the header's content. Desktop (>=992px) only. */
(function(){
 'use strict';
 if(window.__oklaDesktopBuyBarV1)return;window.__oklaDesktopBuyBarV1=true;
 var DESKTOP=matchMedia('(min-width:992px)');
 var NS='http://www.w3.org/2000/svg',root=document.documentElement;
 function q(s,r){return (r||document).querySelector(s)}
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function icon(d){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);return s}
 var CART='M2.5 3.8h2.8l2.1 10.7a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1l1.9-7.3H6.1 M10 20.3h.01 M18 20.3h.01';
 var BELL='M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z M10 21a2.2 2.2 0 0 0 4 0';
 var bar,inner,btn,priceEl,stockEl,native,shown=false;
 function text(n){return n?(n.textContent||'').replace(/\s+/g,' ').trim():''}
 function rating(){
  var avg=text(q('#ratingTab .rate-average'));
  var cnt=text(q('#ratingTab .stars-label span'));
  var v=parseFloat(avg.replace(',','.'));
  return v>0?{v:v,label:avg,count:cnt}:null;
 }
 function starsNode(v){
  var w=el('span','okla-dbb__stars');w.setAttribute('aria-hidden','true');
  for(var i=1;i<=5;i++){var s=el('span','okla-dbb__star'+(v>=i-.25?' is-on':''));w.appendChild(s)}
  return w;
 }
 function build(){
  native=q('#product-detail-form .add-to-cart button.add-to-cart-button')||q('.p-detail .add-to-cart button.add-to-cart-button');
  var h1=q('#content .p-detail h1')||q('#content h1');
  if(!native||!h1)return false;
  bar=el('div','okla-dbb');bar.setAttribute('role','region');bar.setAttribute('aria-label','Rychlý nákup');bar.hidden=true;
  inner=el('div','okla-dbb__inner');
  var img=q('.p-detail .p-main-image img')||q('.p-detail .p-image img');
  var pic=el('a','okla-dbb__pic');pic.href='#';pic.setAttribute('aria-label','Zpět nahoru');
  pic.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
  if(img){var im=el('img');im.src=img.currentSrc||img.src;im.alt='';pic.appendChild(im)}
  var info=el('div','okla-dbb__info');
  info.appendChild(el('strong','okla-dbb__name',text(h1)));
  var meta=el('div','okla-dbb__meta');
  var r=rating();
  if(r){meta.appendChild(starsNode(r.v));meta.appendChild(el('span','okla-dbb__rating',r.label+(r.count?' · '+r.count:'')))}
  stockEl=el('span','okla-dbb__stock');meta.appendChild(stockEl);
  info.appendChild(meta);
  priceEl=el('div','okla-dbb__price');
  btn=el('button','okla-dbb__btn');btn.type='button';
  btn.addEventListener('click',function(){
   if(btn.classList.contains('is-watch')){var w=q('.p-info-wrapper a.link-icon.watchdog');if(w)w.click();return}
   if(!native.disabled)native.click();
  });
  inner.append(pic,info,priceEl,btn);bar.appendChild(inner);document.body.appendChild(bar);
  sync();
  var src=q('#product-detail-form .p-final-price-wrapper .price-final')||q('.p-info-wrapper .price-final');
  if(src)new MutationObserver(sync).observe(src,{childList:true,characterData:true,subtree:true});
  new MutationObserver(sync).observe(native,{attributes:true,attributeFilter:['disabled','class']});
  return true;
 }
 function sync(){
  var src=q('#product-detail-form .p-final-price-wrapper .price-final')||q('.p-info-wrapper .price-final');
  priceEl.textContent=text(src);
  var avail=q('#product-detail-form .availability-value')||q('.p-info-wrapper .availability-value');
  var label=text(avail&&(q('.availability-label',avail)||avail));
  var out=native.disabled||/nedostupn|vyprodán|není skladem/i.test(label);
  stockEl.textContent=label;stockEl.classList.toggle('is-out',out);stockEl.classList.toggle('is-in',!out&&/skladem/i.test(label));
  btn.replaceChildren();btn.classList.toggle('is-watch',out);
  if(out){btn.append(icon(BELL),el('span',null,'Hlídat dostupnost'))}else{btn.append(icon(CART),el('span',null,'Do košíku'))}
 }
 function place(){
  var c=q('#header .header-top .container')||q('#header .container')||q('#content-wrapper');
  if(!c)return;var rc=c.getBoundingClientRect();
  inner.style.width=Math.round(rc.width)+'px';inner.style.marginLeft=Math.round(rc.left)+'px';
 }
 function show(on){
  on=on&&DESKTOP.matches;
  if(on===shown)return;shown=on;
  if(on){place();bar.hidden=false;void bar.offsetWidth;bar.classList.add('is-on');root.classList.add('okla-dbb-on')}
  else{bar.classList.remove('is-on');root.classList.remove('okla-dbb-on');setTimeout(function(){if(!shown)bar.hidden=true},220)}
 }
 function start(){
  if(!document.body||!document.body.classList.contains('type-detail'))return;
  var tries=0;
  (function wait(){
   if(build()){
    var io=new IntersectionObserver(function(es){var e=es[0];show(!e.isIntersecting&&e.boundingClientRect.top<0)},{threshold:0});
    io.observe(native);
    addEventListener('resize',function(){if(shown)place()});
    if(DESKTOP.addEventListener)DESKTOP.addEventListener('change',function(){if(!DESKTOP.matches)show(false)});
   }else if(++tries<40)setTimeout(wait,250);
  })();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
