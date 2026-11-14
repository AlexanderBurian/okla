/* OKLA – cart page on PC (≥992px): "Doporučujeme k nákupu" under the cart (DATART style) - five products from the
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
  var grid=el('div','ocr-grid');
  items.forEach(function(it){
   var card=el('div','ocr-card');
   var img=el('a','ocr-img');img.href=it.href;img.tabIndex=-1;img.setAttribute('aria-hidden','true');
   var im=el('img');im.src=it.img;im.alt='';im.loading='lazy';img.appendChild(im);
   var name=el('a','ocr-name',it.name);name.href=it.href;
   var price=el('div','ocr-price',it.price);
   card.append(img,name,price);
   if(it.form){var f=it.form;f.classList.add('ocr-form');var btn=f.querySelector('button');if(btn){btn.className='ocr-btn';btn.innerHTML='';btn.textContent='Do košíku'}card.appendChild(f)}
   grid.appendChild(card);
  });
  sec.appendChild(grid);return sec;
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
     if(out.length>=5)return;
     var a=p.querySelector('a.name'),im=p.querySelector('a.image img'),pr=p.querySelector('.price-final strong, .price-final'),f=p.querySelector('form.pr-action');
     if(!a)return;var href=a.getAttribute('href');if(seen[href]||have[href])return;seen[href]=1;
     var src=im&&(im.getAttribute('data-src')||im.getAttribute('src'))||'';if(/^data:/.test(src))src='';
     out.push({href:href,name:(a.textContent||'').replace(/\s+/g,' ').trim(),img:src,price:pr?(pr.textContent||'').replace(/\s+/g,' ').trim():'',form:f?document.importNode(f,true):null});
    });
   });
   if(out.length<3)return;
   cw.after(build(out));
  }).catch(function(){});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
