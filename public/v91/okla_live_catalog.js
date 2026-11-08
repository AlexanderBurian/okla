/* OKLA – live product index. The original catalogue (OKLA_V86_CATALOG, okla_v86_catalog.js) only knows the products
   the shop started with. This module reads the shop's own category listings (every category, every page), keeps
   the result for 30 minutes in localStorage and updates the catalogue object in place:
   - products the shop no longer has are removed (so search, the cart drawer and suggestions never offer them);
   - new products are added (code, name, URL, image, price, category, short description, stock);
   - prices and stock of the remaining ones are refreshed;
   - rows of removed products in Shoptet's "Top 10 produktů" box are replaced by current products.
   Modules that read the catalogue (search, mobile search, cart drawer, detail) keep working unchanged.
   A 'okla:catalog-updated' event is fired after every update. */
(function(){
 'use strict';
 if(window.__oklaLiveCatalogV1)return;window.__oklaLiveCatalogV1=true;
 var KEY='okla-live-catalog-v1',TTL=30*60*1000;
 var FALLBACK_CATS=['/elektronicke-multitooly/','/chytra-elektronika/','/merici-technika-a-naradi/','/endoskopy-a-inspekcni-kamery/','/prakticke-vychytavky/','/designove-gadgety/','/projektory-a-obraz/','/prislusenstvi/'];
 var NOT_CATEGORY=/(podminky|kontakt|o-nas|doprava|reklama|vraceni|jak-nakupovat|newsroom|novinky|blog|stav-objednavky|klient|login|registrace)/i;
 function catalog(){if(!window.OKLA_V86_CATALOG)window.OKLA_V86_CATALOG={};return window.OKLA_V86_CATALOG}
 function path(u){try{return new URL(u,location.origin).pathname}catch(e){return null}}
 function text(n){return n?(n.textContent||'').replace(/\s+/g,' ').trim():''}
 function categories(){
  var seen={},out=[];
  [].slice.call(document.querySelectorAll('#navigation .menu-level-1 > li > a[href], #categories .topic > a[href]')).forEach(function(a){
   var h=path(a.getAttribute('href'));
   if(!h||h==='/'||!/^\/[^/]+\/$/.test(h)||NOT_CATEGORY.test(h)||seen[h])return;
   seen[h]=1;out.push(h);
  });
  return out.length>=3?out:FALLBACK_CATS;
 }
 function cardsOf(doc,catName){
  return [].slice.call(doc.querySelectorAll('#products .product, .products-block .product')).map(function(c){
   var a=c.querySelector('a.name')||c.querySelector('a.image');if(!a)return null;
   var sku=text(c.querySelector('[data-micro="sku"]'));
   var offer=c.querySelector('[data-micro-price]');
   var img=c.querySelector('a.image img');
   var src=img?(img.getAttribute('data-src')||img.getAttribute('src')||''):'';
   if(/^data:/.test(src))src='';
   var url=path(a.getAttribute('href'));if(!url)return null;
   return {
    code:sku||('URL:'+url),name:text(c.querySelector('[data-micro="name"]'))||text(a),url:location.origin+url,
    image:src,price:offer?Number(offer.getAttribute('data-micro-price')):null,
    available:offer?!/OutOfStock|SoldOut|Discontinued/i.test(offer.getAttribute('data-micro-availability')||''):null,
    shortDescription:text(c.querySelector('.p-desc')),defaultCategory:catName,brand:'',live:true
   };
  }).filter(Boolean);
 }
 function getDoc(u){
  return fetch(u,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.text()}).then(function(h){return new DOMParser().parseFromString(h,'text/html')});
 }
 function readCategory(href){
  return getDoc(href).then(function(doc){
   var name=text(doc.querySelector('h1'))||href;
   var items=cardsOf(doc,name);
   var pages={};
   [].slice.call(doc.querySelectorAll('.pagination a[href]')).forEach(function(a){var p=path(a.getAttribute('href'));if(p&&p!==href)pages[p]=1});
   return Promise.all(Object.keys(pages).map(function(p){return getDoc(p).then(function(d){return cardsOf(d,name)})})).then(function(more){
    more.forEach(function(m){items=items.concat(m)});return items;
   });
  });
 }
 function merge(items,complete){
  var cat=catalog(),byPath={},byCat={};
  items.forEach(function(it){var p=path(it.url);if(p&&!byPath[p])byPath[p]=it;(byCat[it.defaultCategory]=byCat[it.defaultCategory]||[]).push(it.code)});
  if(complete){
   Object.keys(cat).forEach(function(k){var p=cat[k]&&cat[k].url?path(cat[k].url):null;if(p&&!byPath[p])delete cat[k]});
  }
  Object.keys(byPath).forEach(function(p){
   var it=byPath[p],existing=null;
   Object.keys(cat).some(function(k){if(cat[k]&&cat[k].url&&path(cat[k].url)===p){existing=cat[k];return true}return false});
   if(existing){
    if(it.price!=null)existing.price=it.price;
    if(it.available!=null)existing.available=it.available;
    if(!existing.image&&it.image)existing.image=it.image;
   }else{
    it.related=(byCat[it.defaultCategory]||[]).filter(function(c){return c!==it.code}).slice(0,6);
    cat[it.code]=it;
   }
  });
  if(complete)prune(byPath);
  try{window.dispatchEvent(new CustomEvent('okla:catalog-updated'))}catch(e){}
 }
 /* Shoptet's own "Top 10 produktů" box is recalculated with a delay and can still list removed products (404):
    drop those rows; with fewer than three left the box is hidden. */
 /* Shoptet's own "Top 10 produktů" box is recalculated with a delay and can still list removed products (404):
    those rows are dropped and the box is topped up to ten with current products (in stock first), in the box's own
    markup, so it never shows dead links and never disappears. */
 function priceText(n){return n==null||isNaN(n)?'':String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 function topRow(it){
  var li=document.createElement('li');li.className='display-image okla-top-filled';
  var url=path(it.url);
  var img=document.createElement('a');img.href=url;img.className='top-products-image';img.setAttribute('aria-hidden','true');img.tabIndex=-1;
  if(it.image){var im=document.createElement('img');im.src=it.image;im.alt='';im.loading='lazy';im.width=100;im.height=100;img.appendChild(im)}
  var c=document.createElement('a');c.href=url;c.className='top-products-content';
  var nm=document.createElement('span');nm.className='top-products-name';nm.textContent=it.name;c.appendChild(nm);
  var pr=priceText(it.price);if(pr){var st=document.createElement('strong');st.textContent=pr;c.appendChild(st)}
  li.append(img,c);return li;
 }
 function prune(byPath){
  function run(){
   [].slice.call(document.querySelectorAll('.box-topProducts ol.top-products')).forEach(function(ol){
    var have={};
    [].slice.call(ol.children).forEach(function(li){
     var a=li.querySelector('a[href]');var p=a&&path(a.getAttribute('href'));
     if(p&&!byPath[p])li.remove();else if(p)have[p]=1;
    });
    var pool=Object.keys(byPath).map(function(p){return byPath[p]}).filter(function(it){return it.name&&!have[path(it.url)]});
    pool.sort(function(x,y){return (y.available===true)-(x.available===true)});
    /* take them in turns from every category, so the list is varied */
    var groups={},order=[];pool.forEach(function(it){var k=it.defaultCategory||'';if(!groups[k]){groups[k]=[];order.push(k)}groups[k].push(it)});
    var mixed=[];for(var more=true;more;){more=false;order.forEach(function(k){var it=groups[k].shift();if(it){mixed.push(it);more=true}})}
    pool=mixed;
    for(var i=0;ol.children.length<10&&i<pool.length;i++)ol.appendChild(topRow(pool[i]));
    var box=ol.closest('.box-topProducts');if(box)box.classList.toggle('okla-hidden-box',ol.children.length===0);
   });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 }
 function load(){
  try{var c=JSON.parse(localStorage.getItem(KEY)||'null');if(c&&c.items&&c.items.length)return c}catch(e){}
  return null;
 }
 function refresh(){
  if(!window.fetch||!window.DOMParser)return Promise.resolve(null);
  var cats=categories(),ok=true;
  return Promise.all(cats.map(function(h){return readCategory(h).catch(function(){ok=false;return []})})).then(function(lists){
   var items=[];lists.forEach(function(l){items=items.concat(l)});
   if(!items.length)return null;
   merge(items,ok);
   if(ok){try{localStorage.setItem(KEY,JSON.stringify({t:Date.now(),items:items}))}catch(e){}}
   return items;
  });
 }
 var cached=load();
 if(cached)merge(cached.items,true);
 var fresh=cached&&cached.t>Date.now()-TTL;
 window.oklaLiveCatalog={ready:fresh?Promise.resolve(cached.items):new Promise(function(res){
  var run=function(){refresh().then(res,function(){res(null)})};
  if(window.requestIdleCallback)requestIdleCallback(run,{timeout:3000});else setTimeout(run,1500);
 })};
})();
