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
   var f;if(it.form){f=it.form;f.classList.add('ocr-form');var fb=f.querySelector('button');if(fb)fb.classList.add('ocr-btn');card.appendChild(f)}
   else if(it.code){var cf=el('div','ocr-form');var cb=el('button','btn btn-cart ocr-btn');cb.type='button';cb.appendChild(el('span','','Do košíku'));
    cb.addEventListener('click',function(){var cart=window.shoptet&&window.shoptet.cartShared;if(!cart||typeof cart.addToCart!=='function'){location.href=it.href;return}cb.disabled=true;var r=cart.addToCart({productCode:it.code,amount:1});(r&&r.then?r:Promise.resolve()).then(function(){setTimeout(function(){location.reload()},600)})});
    cf.appendChild(cb);card.appendChild(f=cf)}
   grid.appendChild(card);
  });
  /* a slider: the row scrolls sideways, the arrows move it by one view */
  /* arrows as on the homepage sliders: always there; past the end the row starts again */
  function arrow(cls,label,d,path){var a=el('button','ocr-arrow '+cls);a.type='button';a.setAttribute('aria-label',label);a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>';
   a.addEventListener('click',function(){var max=grid.scrollWidth-grid.clientWidth;var card=grid.firstElementChild;var step=card?card.getBoundingClientRect().width+20:grid.clientWidth;var z=(card&&card.offsetWidth)?card.getBoundingClientRect().width/card.offsetWidth:1;step=step/(z||1);
    var to=grid.scrollLeft+d*step;if(d>0&&grid.scrollLeft>=max-4)to=0;else if(d<0&&grid.scrollLeft<=4)to=max;grid.scrollTo({left:to,behavior:'smooth'})});return a}
  var prev=arrow('ocr-prev','Předchozí produkty',-1,'m15 18-6-6 6-6'),next=arrow('ocr-next','Další produkty',1,'m9 18 6-6-6-6');
  function state(){var scroll=grid.scrollWidth>grid.clientWidth+4;prev.hidden=next.hidden=!scroll}
  setTimeout(state,50);window.addEventListener('resize',state);
  wrap.append(grid,prev,next);sec.appendChild(wrap);return sec;
 }
 function run(){
  var cw=document.getElementById('content-wrapper');if(!cw||document.getElementById('okla-cart-recs'))return;
  if(!document.querySelector('.cart-table tr.removeable, .cart-content'))return;
  var have=inCart();
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   if(!html)return;
   var doc=new DOMParser().parseFromString(html,'text/html'),out=[],seen={};
   ['#products-4','#products-1','#products-2','.products'].forEach(function(sel){
    doc.querySelectorAll(sel+' .product .p').forEach(function(p){
     if(out.length>=10)return;
     var a=p.querySelector('a.name'),im=p.querySelector('a.image img'),pr=p.querySelector('.price-final strong, .price-final'),f=p.querySelector('form.pr-action');
     if(!a)return;var href=a.getAttribute('href');if(seen[href]||have[href])return;seen[href]=1;
     var src=im&&(im.getAttribute('data-src')||im.getAttribute('src'))||'';if(/^data:/.test(src))src='';
     out.push({href:href,name:(a.textContent||'').replace(/\s+/g,' ').trim(),img:src,price:pr?(pr.textContent||'').replace(/\s+/g,' ').trim():'',form:f?document.importNode(f,true):null});
    });
   });
   /* fill the row (up to ten) from the product catalogue */
   var cat=window.OKLA_V86_CATALOG||{};
   Object.keys(cat).forEach(function(k){
    if(out.length>=10)return;var p=cat[k];if(!p||!p.url||!p.price)return;
    var href;try{href=new URL(p.url).pathname}catch(e){return}
    if(seen[href]||have[href]||have[p.url])return;seen[href]=1;
    out.push({href:href,name:p.name,img:p.image||'',price:String(Math.round(+p.price)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč',form:null,code:p.code});
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
