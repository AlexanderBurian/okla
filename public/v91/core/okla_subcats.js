/* Okla – subcategories with a picture. Shoptet shows a folder icon for a subcategory; here each one gets the photo of
   a product that stands for it, and no two subcategories of one category share a photo:
   - each subcategory's candidates are its own products, best first: the most words shared with the subcategory's
     name ("Kapesní platformy" -> a "kapesní" device), then the dearer one (usually the flagship);
   - the subcategories with the fewest candidates choose first, each takes its best product not taken yet;
   - a subcategory left without one (empty, or all its products taken) gets a not yet used product of the parent
     category, chosen the same way.
   The product lists of the pages are kept for 12 hours on the device. Used by:
   - the category page: Shoptet's subcategory tiles (ul.subcategories), styled in okla_subcats.css;
   - the header's category panel (okla_catbar.js): window.oklaSubcats.list(categoryHref) gives the subcategories from
     Shoptet's own menu, window.oklaSubcats.images(categoryHref, subs) the photos (a promise of {href: photo}),
     window.oklaSubcats.products(href) a page's products (a promise of [{u: address, t: name, ...}]). */
(function(){
 'use strict';
 if(window.__oklaSubcatsV1)return;window.__oklaSubcatsV1=true;
 var KEY='okla-subcat-pages-v2',TTL=12*3600*1000,store={};
 try{store=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){store={}}
 try{['okla-subcat-img-v1','okla-subcat-img-v2','okla-subcat-pages-v1'].forEach(function(k){localStorage.removeItem(k)})}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return String(u||'')}}
 function norm(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

 /* the products of a page: address, name, photo, price */
 var pending={};
 function products(href){
  var p=pathOf(href),hit=store[p];
  if(hit&&hit.t>Date.now()-TTL&&hit.items)return Promise.resolve(hit.items);
  if(pending[p])return pending[p];
  pending[p]=fetch(p,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html'),items=[],seen={};
   [].forEach.call(doc.querySelectorAll('#products .product, .products-block .product, .products .product'),function(c){
    var a=c.querySelector('a.name')||c.querySelector('a.image');var im=c.querySelector('a.image img');
    var src=im?(im.getAttribute('data-src')||im.getAttribute('src')||''):'';
    if(!a||!src||/^data:|folder\.svg/i.test(src))return;
    var u=pathOf(a.getAttribute('href'));if(seen[u])return;seen[u]=1;
    var priceEl=c.querySelector('[data-micro-price]');
    items.push({u:u,t:(a.textContent||'').replace(/\s+/g,' ').trim(),n:norm(a.textContent),s:src,p:priceEl?Number(priceEl.getAttribute('data-micro-price'))||0:0});
   });
   store[p]={t:Date.now(),items:items};save();
   return items;
  }).catch(function(){return []});
  return pending[p];
 }
 function ranked(items,label){
  var words=norm(label).split(' ').filter(function(w){return w.length>=4}).map(function(w){return w.slice(0,5)});
  return items.map(function(it){return {it:it,score:words.filter(function(w){return it.n.indexOf(w)>=0}).length}})
   .sort(function(a,b){return b.score-a.score||b.it.p-a.it.p}).map(function(x){return x.it});
 }

 /* photos for the subcategories of one category, never the same product twice */
 var sets={};
 function images(parentHref,subs){
  var key=pathOf(parentHref)+'|'+subs.map(function(s){return pathOf(s.href)}).join(',');
  if(sets[key])return sets[key];
  sets[key]=Promise.all(subs.map(function(s){return products(s.href)})).then(function(lists){
   var used={},out={},left=[];
   var order=subs.map(function(s,i){return {s:s,list:ranked(lists[i],s.label)}}).sort(function(a,b){return a.list.length-b.list.length});
   order.forEach(function(o){
    var pick=null;o.list.some(function(it){if(!used[it.u]){pick=it;return true}return false});
    if(pick){used[pick.u]=1;out[pathOf(o.s.href)]=pick.s}else left.push(o.s);
   });
   if(!left.length)return out;
   return products(parentHref).then(function(all){
    left.forEach(function(s){
     var pick=null;ranked(all,s.label).some(function(it){if(!used[it.u]){pick=it;return true}return false});
     if(pick){used[pick.u]=1;out[pathOf(s.href)]=pick.s}
    });
    return out;
   });
  });
  return sets[key];
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
 window.oklaSubcats={list:list,images:images,products:products};

 /* the category page's tiles */
 function tiles(){
  var ul=document.querySelector('#content ul.subcategories');if(!ul)return false;
  if(ul.dataset.oklaSub)return true;ul.dataset.oklaSub='1';
  ul.classList.add('okla-subcats');
  var subs=[],holders={};
  [].forEach.call(ul.querySelectorAll('li>a[href]'),function(a){
   var holder=a.querySelector('.image'),img=holder&&holder.querySelector('img');
   if(!holder){holder=document.createElement('span');holder.className='image';a.insertBefore(holder,a.firstChild)}
   if(!img){img=document.createElement('img');img.alt='';holder.appendChild(img)}
   holder.classList.add('okla-subcats__img');
   var name=a.querySelector('.text'),h=pathOf(a.getAttribute('href'));
   subs.push({href:h,label:(name||a).textContent.replace(/\s+/g,' ').trim()});holders[h]={holder:holder,img:img};
   /* the name and, under it, one short line about the subcategory (okla_cat_text.js) */
   var line=window.oklaCatText?window.oklaCatText(h):'';
   if(name&&line&&!a.querySelector('.okla-subcats__desc')){
    var body=document.createElement('span');body.className='okla-subcats__body';
    name.parentNode.insertBefore(body,name);body.appendChild(name);
    var desc=document.createElement('span');desc.className='okla-subcats__desc';desc.setAttribute('data-okla-i18n-skip','');desc.textContent=line;
    body.appendChild(desc);
   }
  });
  images(location.pathname,subs).then(function(map){
   Object.keys(holders).forEach(function(h){
    var x=holders[h],src=map[h];
    if(!src){x.holder.classList.add('is-empty');return}
    x.img.removeAttribute('srcset');x.img.setAttribute('data-src',src);x.img.src=src;x.img.loading='eager';x.img.classList.add('is-photo');
   });
  });
  return true;
 }
 var tries=0;(function tick(){if(tiles()||++tries>20)return;setTimeout(tick,200)})();
 /* Shoptet redraws the category's top (and its subcategories) when the sorting or a filter changes: the tiles again */
 var queued=false;
 try{new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;tiles()})}).observe(document.getElementById('content')||document.body,{childList:true,subtree:true})}catch(e){}
})();
