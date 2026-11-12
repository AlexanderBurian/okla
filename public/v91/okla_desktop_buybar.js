/* OKLA – desktop product page (>=992px):
   - buy bar at the bottom of the window (as on the big shops) once the page's own buy button has scrolled away: picture, name, stars, stock, price and the green "Do košíku" (it clicks Shoptet's own button, so the cart,
     quantity and drawer work as usual). Sold-out products get "Hlídat dostupnost", which opens Shoptet's watchdog.
     The bar's content has the width of the header's content. While it is shown, the AI chat button (which sits under
     it) is hidden; an open chat stays open.
   - the product gallery stays in view while the right-hand column is scrolled (CSS), when it fits the window. */
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
  aiLauncher(on);
 }
 /* the AI chat button sits where the bar is: hide it (not an open chat) while the bar is shown */
 var AI_CSS=':host(.okla-ai-under-bar) .panel:not(.open)+.launcher{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .16s ease,visibility 0s linear .16s!important}';
 function aiLauncher(hide){
  var host=q('okla-ai-chat'),sr=host&&host.shadowRoot;
  if(!host)return;
  if(sr&&!sr.querySelector('style[data-okla-dbb]')){var st=document.createElement('style');st.setAttribute('data-okla-dbb','');st.textContent=AI_CSS;sr.appendChild(st)}
  host.classList.toggle('okla-ai-under-bar',!!hide);
 }
 /* the widget is added after the page modules: apply the current state once it appears */
 function watchAi(){
  if(q('okla-ai-chat')){aiLauncher(shown);return}
  var mo=new MutationObserver(function(){var h=q('okla-ai-chat');if(h&&h.shadowRoot){mo.disconnect();aiLauncher(shown)}});
  mo.observe(document.body,{childList:true});
  setTimeout(function(){mo.disconnect();aiLauncher(shown)},15000);
 }
 /* the gallery sticks only when it fits the window under the sticky header (84px of page space) */
 function galleryFit(){
  var g=q('#content .p-detail .product-top>.p-image-wrapper');
  if(!g){root.classList.remove('okla-pd-sticky');return}
  var z=g.currentCSSZoom||1,h=g.offsetHeight;
  root.classList.toggle('okla-pd-sticky',DESKTOP.matches&&(h+84+16)*z<=innerHeight);
 }
 function start(){
  if(!document.body||!document.body.classList.contains('type-detail'))return;
  var tries=0;
  (function wait(){
   if(build()){
    /* the bar slides up once the page's own "Přidat do košíku" has scrolled away under the sticky header, and goes
       again when it comes back */
    root.classList.add('okla-dbb-ready');
    var ticking=false;
    var sync=function(){ticking=false;var r=native.getBoundingClientRect();show(r.width>0&&r.bottom<70*(window.__oklaDZ||1))};
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(sync)}},{passive:true});
    sync();
    addEventListener('resize',function(){if(shown)place();galleryFit()});
    galleryFit();addEventListener('load',galleryFit);setTimeout(galleryFit,1500);
    watchAi();
    if(DESKTOP.addEventListener)DESKTOP.addEventListener('change',function(){if(!DESKTOP.matches)show(false)});
   }else if(++tries<40)setTimeout(wait,250);
  })();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
