/* OKLA – cart page on PC (≥992px): "Doporučujeme k nákupu" under the cart (DATART style) - up to ten products (a slider) from the
   homepage's "To nejlepší od nás" (then "Akční zboží"), leaving out what is already in the cart. Each card has the
   shop's own add-to-cart form (Shoptet adds its security token on submit), so "Do košíku" adds it and the cart reloads. */
(function(){
 'use strict';
 if(window.__oklaCartRecsV1)return;window.__oklaCartRecsV1=true;
 var b=document.body;if(!b||!b.classList.contains('in-kosik'))return;
 if(!window.matchMedia||!window.matchMedia('(min-width:992px)').matches)return;
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function inCart(){var s={};document.querySelectorAll('.cart-table a[href], .cart-content a[href]').forEach(function(a){s[a.getAttribute('href')]=1});return s}
 function build(items){
  var sec=el('section','okla-cart-recs container');sec.id='okla-cart-recs';sec.setAttribute('aria-label','Doporučujeme k nákupu');
  sec.appendChild(el('h2','ocr-title','Doporučujeme k nákupu'));
  var wrap=el('div','ocr-wrap'),grid=el('div','ocr-grid');
  items.forEach(function(it){
   var card=el('div','ocr-card');
   var img=el('a','ocr-img');img.href=it.href;img.tabIndex=-1;img.setAttribute('aria-hidden','true');
   var im=el('img');im.src=it.img;im.alt='';im.loading='lazy';img.appendChild(im);
   var name=el('a','ocr-name',it.name);name.href=it.href;
   var price=el('div','ocr-price',it.price);
   card.append(img,name,price);
   /* the shop's own add-to-cart form with its button as on the homepage (same classes, same look) */
   if(it.form){var f=it.form;f.classList.add('ocr-form');var btn=f.querySelector('button');if(btn)btn.classList.add('okla-button--filled','okla-button--green','okla-green-cta');card.appendChild(f)}
   grid.appendChild(card);
  });
  /* a slider: the row scrolls sideways, the arrows move it by one view */
  function arrow(cls,label,d,path){var a=el('button','ocr-arrow '+cls);a.type='button';a.setAttribute('aria-label',label);a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>';a.addEventListener('click',function(){var card=grid.firstElementChild,step=card?card.getBoundingClientRect().width+parseFloat(getComputedStyle(grid).columnGap||0)*(card.getBoundingClientRect().width/card.offsetWidth||1):grid.clientWidth;var z=(card&&card.offsetWidth)?card.getBoundingClientRect().width/card.offsetWidth:1;grid.scrollTo({left:grid.scrollLeft+d*Math.round(grid.clientWidth/(z||1)*z),behavior:'smooth'})});return a}
  var prev=arrow('ocr-prev','Předchozí produkty',-1,'m15 18-6-6 6-6'),next=arrow('ocr-next','Další produkty',1,'m9 18 6-6-6-6');
  function state(){prev.hidden=grid.scrollLeft<4;next.hidden=grid.scrollLeft+grid.clientWidth>=grid.scrollWidth-4}
  grid.addEventListener('scroll',state,{passive:true});setTimeout(state,50);window.addEventListener('resize',state);
  wrap.append(grid,prev,next);sec.appendChild(wrap);return sec;
 }
 function run(){
  var cw=document.getElementById('content-wrapper');if(!cw||document.getElementById('okla-cart-recs'))return;
  if(!document.querySelector('.cart-table tr.removeable, .cart-content'))return;
  var have=inCart();
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   if(!html)return;
   var doc=new DOMParser().parseFromString(html,'text/html'),out=[],seen={};
   ['#products-4','#products-1','#products-2'].forEach(function(sel){
    doc.querySelectorAll(sel+' .product .p').forEach(function(p){
     if(out.length>=10)return;
     var a=p.querySelector('a.name'),im=p.querySelector('a.image img'),pr=p.querySelector('.price-final strong, .price-final'),f=p.querySelector('form.pr-action');
     if(!a)return;var href=a.getAttribute('href');if(seen[href]||have[href])return;seen[href]=1;
     var src=im&&(im.getAttribute('data-src')||im.getAttribute('src'))||'';if(/^data:/.test(src))src='';
     out.push({href:href,name:(a.textContent||'').replace(/\s+/g,' ').trim(),img:src,price:pr?(pr.textContent||'').replace(/\s+/g,' ').trim():'',form:f?document.importNode(f,true):null});
    });
   });
   if(out.length<3)return;
   var sec=build(out);cw.after(sec);
   /* the site's CTA script puts its own cart icon into every green button; these keep the homepage card icon only */
   function strip(){sec.querySelectorAll('.okla-cta-cart').forEach(function(n){n.remove()})}
   strip();if(window.MutationObserver)new MutationObserver(strip).observe(sec,{childList:true,subtree:true});
  }).catch(function(){});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
