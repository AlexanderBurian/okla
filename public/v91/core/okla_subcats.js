/* OKLA – subcategories with a picture. Shoptet shows a folder icon for a subcategory; here each one gets the photo of
   the product of its page that stands for it best (see image()), kept for 12 hours on the device. Used by:
   - the category page: Shoptet's subcategory tiles (ul.subcategories) get the photo (styled in okla_subcats.css);
   - the header's category panel (okla_catbar.js): window.oklaSubcats.list(categoryHref) gives the subcategories from
     Shoptet's own menu, window.oklaSubcats.image(href) the photo (a promise). */
(function(){
 'use strict';
 if(window.__oklaSubcatsV1)return;window.__oklaSubcatsV1=true;
 var KEY='okla-subcat-img-v2',TTL=12*3600*1000,store={};
 try{store=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){store={}}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return String(u||'')}}
 var pending={};
 function norm(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
 /* a subcategory without products: the photo of its parent category (the one OKLA's category menu shows) */
 function parentPhoto(href){
  var p=pathOf(href),parent=null;
  [].forEach.call(document.querySelectorAll('#navigation .menu-level-1>li'),function(li){
   if(parent)return;[].forEach.call(li.querySelectorAll(':scope>ul.menu-level-2 a[href]'),function(a){if(pathOf(a.getAttribute('href'))===p){var t=li.querySelector(':scope>a[href]');parent=t&&pathOf(t.getAttribute('href'))}});
  });
  if(!parent)return '';
  var img=null;[].forEach.call(document.querySelectorAll('a[href] img.okla-cat-photo'),function(i){if(!img&&pathOf(i.closest('a').getAttribute('href'))===parent)img=i});
  if(img)return img.currentSrc||img.src;
  /* no category menu on the page (phones): the same photos by the category's address */
  var CAT={'/elektronicke-multitooly/':'multitooly','/chytra-elektronika/':'chytra','/merici-technika-a-naradi/':'merici','/endoskopy-a-inspekcni-kamery/':'endoskopy','/prakticke-vychytavky/':'vychytavky','/designove-gadgety/':'gadgety','/projektory-a-obraz/':'projektory','/prislusenstvi/':'prislusenstvi'};
  return CAT[parent]&&window.__oklaAssetBase?window.__oklaAssetBase+'v91/img/catc/'+CAT[parent]+'.webp':'';
 }
 function image(href,label){
  var p=pathOf(href),hit=store[p];
  if(hit&&hit.t>Date.now()-TTL)return Promise.resolve(hit.img||parentPhoto(p));
  if(pending[p])return pending[p];
  pending[p]=fetch(p,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   /* the product that stands for the subcategory: the one whose name shares the most words with the subcategory's
      name ("Kapesní platformy" -> a "kapesní" device), then the dearer one (usually the flagship); without a match,
      the dearest product of the subcategory */
   var words=norm(label||'').split(' ').filter(function(w){return w.length>=4}).map(function(w){return w.slice(0,5)});
   var best=null;
   [].forEach.call(doc.querySelectorAll('#products .product, .products-block .product, .products .product'),function(c){
    var im=c.querySelector('a.image img');var src=im?(im.getAttribute('data-src')||im.getAttribute('src')||''):'';
    if(!src||/^data:|folder\.svg/i.test(src))return;
    var name=norm((c.querySelector('a.name')||c).textContent||'');
    var priceEl=c.querySelector('[data-micro-price]');var price=priceEl?Number(priceEl.getAttribute('data-micro-price'))||0:0;
    var score=words.filter(function(w){return name.indexOf(w)>=0}).length;
    if(!best||score>best.score||(score===best.score&&price>best.price))best={src:src,score:score,price:price};
   });
   var src=best?best.src:'';
   store[p]={img:src,t:Date.now()};save();
   return src||parentPhoto(p);
  }).catch(function(){return ''});
  return pending[p];
 }
 /* the subcategories of a top category, from Shoptet's own header menu (second level) */
 function list(catHref){
  var p=pathOf(catHref),out=[],seen={};
  [].forEach.call(document.querySelectorAll('#navigation .menu-level-1>li'),function(li){
   var a=li.querySelector(':scope>a[href]');if(!a||pathOf(a.getAttribute('href'))!==p)return;
   [].forEach.call(li.querySelectorAll(':scope>ul.menu-level-2>li'),function(s){
    var l=s.querySelector(':scope>div>a[href]')||s.querySelector('a[href]:not(.menu-image)')||s.querySelector('a[href]');
    if(!l)return;var h=pathOf(l.getAttribute('href'));if(seen[h])return;seen[h]=1;
    out.push({href:h,label:(l.textContent||'').replace(/\s+/g,' ').trim()});
   });
  });
  return out;
 }
 window.oklaSubcats={list:list,image:image};

 /* the category page's tiles */
 function tiles(){
  var ul=document.querySelector('#content ul.subcategories');if(!ul)return false;
  ul.classList.add('okla-subcats');
  [].forEach.call(ul.querySelectorAll('li>a[href]'),function(a){
   if(a.dataset.oklaSub)return;a.dataset.oklaSub='1';
   var holder=a.querySelector('.image'),img=holder&&holder.querySelector('img');
   if(!holder){holder=document.createElement('span');holder.className='image';a.insertBefore(holder,a.firstChild)}
   if(!img){img=document.createElement('img');img.alt='';holder.appendChild(img)}
   holder.classList.add('okla-subcats__img');
   var name=a.querySelector('.text');
   image(a.getAttribute('href'),name?name.textContent:a.textContent).then(function(src){
    if(!src){holder.classList.add('is-empty');return}
    img.removeAttribute('srcset');img.setAttribute('data-src',src);img.src=src;img.loading='eager';img.classList.add('is-photo');
   });
  });
  return true;
 }
 var tries=0;(function tick(){if(tiles()||++tries>20)return;setTimeout(tick,200)})();
})();
