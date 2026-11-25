/* OKLA – under a category's listing, as on the big shops (from the top down):
   1. other categories picked at random - the same tiles with a product photo as the category's own subcategories
      (okla_subcats: names from the shop's menu, photos from their products);
   2. three of the shop's articles (window.oklaArticles reads Shoptet's own article list): a large one on the left,
      two small ones on the right, "Více článků" to the magazine; the ones that fit the category come first;
   3. a row of products picked at random from other categories - the shop's own cards in the homepage's endless slider
      (window.__oklaSliderFor).
   Built once the visitor comes near the end of the listing; kept in place when the shop draws the content anew. */
(function(){
 'use strict';
 if(window.__oklaCatBottom)return;window.__oklaCatBottom=true;
 var b=document.body;
 if(!b||!/(^|\s)type-category(\s|$)/.test(b.className))return;
 var TILES=8,PRODUCTS=12;
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function pathOf(h){try{return new URL(h,location.origin).pathname}catch(e){return String(h||'')}}
 function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
 function words(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').split(/[^a-z0-9]+/).filter(function(w){return w.length>3})}
 var here=location.pathname.replace(/strana-\d+\/?$/,'');
 /* the shop's top categories (its menu), this one and the one it belongs to left out */
 function tops(){
  var out=[];
  [].forEach.call(document.querySelectorAll('#navigation .menu-level-1>li>a[href]'),function(a){
   var h=pathOf(a.getAttribute('href'));if(!/^\/[^/]+\/$/.test(h)||/obchodni-podminky|kontakt|blog|clanky|newsroom|novinky/i.test(h))return;
   var li=a.parentNode,mine=h===here||[].some.call(li.querySelectorAll('ul a[href]'),function(x){return pathOf(x.getAttribute('href'))===here});
   if(!mine)out.push(h);
  });
  return out;
 }

 /* 1. the category tiles */
 function tiles(sec){
  var S=window.oklaSubcats;if(!S)return;
  var pool=[];
  tops().forEach(function(p){S.list(p).forEach(function(s){pool.push({parent:p,href:s.href,label:s.label})})});
  var pick=shuffle(pool).slice(0,TILES);if(pick.length<4)return;
  var ul=el('ul','subcategories with-image okla-subcats okla-catmore__tiles');ul.dataset.oklaSub='1';
  var holders={};
  pick.forEach(function(s){
   var li=el('li','col-xs-6 col-sm-6 col-lg-3 col-xl-3'),a=el('a');a.href=s.href;
   var im=el('span','image okla-subcats__img'),img=el('img');img.alt='';img.width=140;img.height=100;im.appendChild(img);
   a.append(im,el('span','text',s.label));li.appendChild(a);ul.appendChild(li);holders[s.href]=im;
  });
  sec.querySelector('.okla-catmore__tiles-slot').appendChild(ul);
  /* the photos, per category they belong to */
  var by={};pick.forEach(function(s){(by[s.parent]=by[s.parent]||[]).push({href:s.href,label:s.label})});
  Object.keys(by).forEach(function(p){
   S.images(p,by[p]).then(function(map){
    by[p].forEach(function(s){var h=holders[s.href],src=map&&map[s.href],img=h.querySelector('img');
     if(!src){h.classList.add('is-empty');return}
     img.src=src;img.classList.add('is-photo');});
   }).catch(function(){});
  });
 }

 /* 2. three articles */
 function articles(sec){
  var A=window.oklaArticles;if(!A)return;
  var title=((document.querySelector('#content .category-title')||{}).textContent||'');
  var key=words(title+' '+((document.querySelector('#content .okla-cat-intro')||{}).textContent||''));
  function draw(list){
   if(!list||list.length<3||sec.querySelector('.okla-catmore__news'))return;
   var scored=shuffle(list).map(function(a){var w=words(a.title+' '+(a.label||'')+' '+(a.desc||''));return {a:a,s:key.filter(function(k){return w.indexOf(k)>-1}).length}});
   scored.sort(function(x,y){return y.s-x.s});
   var three=scored.slice(0,3).map(function(x){return x.a});
   var box=el('div','okla-catmore__news');
   var head=el('div','okla-catmore__head');
   head.append(el('h2','okla-catmore__title','Články a návody'));
   var more=el('a','okla-catmore__more','Více článků');more.href='/nase-novinky/';head.appendChild(more);
   var grid=el('div','okla-catmore__grid');
   three.forEach(function(a,i){
    var card=el('article','okla-catmore__art'+(i===0?' is-big':''));
    var pic=el('a','okla-catmore__pic');pic.href=a.href;pic.tabIndex=-1;pic.setAttribute('aria-hidden','true');
    if(a.img){var img=el('img');img.src=a.img;img.alt='';img.loading='lazy';img.decoding='async';pic.appendChild(img)}
    var body=el('div','okla-catmore__body');
    if(a.label)body.appendChild(el('span','okla-catmore__label',a.label));
    var t=el('a','okla-catmore__name',a.title);t.href=a.href;body.appendChild(t);
    if(i===0&&a.desc)body.appendChild(el('p','okla-catmore__desc',a.desc));
    card.append(pic,body);grid.appendChild(card);
   });
   box.append(head,grid);
   sec.querySelector('.okla-catmore__news-slot').appendChild(box);
  }
  var c=A.cached&&A.cached();if(c)draw(c);
  if(A.load)A.load(function(list){draw(list)});
 }

 /* 3. products from other categories */
 function products(sec){
  if(typeof window.__oklaSliderFor!=='function'||typeof window.oklaCatCards!=='function')return;
  var from=shuffle(tops()).slice(0,3);if(!from.length)return;
  Promise.all(from.map(function(h){return window.oklaCatCards(h)})).then(function(lists){
   var seen={},all=[];
   [].concat.apply([],lists).forEach(function(c){var a=c.querySelector('a.name,a.image,a[href]'),h=a&&pathOf(a.getAttribute('href'));if(!h||seen[h])return;seen[h]=1;all.push(c)});
   var pick=shuffle(all).slice(0,PRODUCTS);if(pick.length<4)return;
   var slot=sec.querySelector('.okla-catmore__products-slot');
   var heading=el('div','homepage-group-title h4 okla-catmore__title','Mohlo by vás zajímat');
   var group=el('div','products products-block');pick.forEach(function(c){group.appendChild(c)});
   slot.append(heading,group);
   window.__oklaSliderFor(group,heading);
  });
 }

 function place(sec){
  var lc=document.querySelector('#content .listingControls');
  var anchor=lc||document.querySelector('#content #products');
  if(!anchor)return false;
  if(sec.previousElementSibling!==anchor||!sec.isConnected)anchor.parentNode.insertBefore(sec,anchor.nextSibling);
  return true;
 }
 function run(){
  if(!document.querySelector('#content .category-content-wrapper')||!document.querySelector('#content #products'))return false;
  if(!document.querySelector('#navigation .menu-level-1'))return false;
  var sec=el('section','okla-catmore');sec.id='okla-cat-more';sec.setAttribute('aria-label','Další z obchodu');
  sec.append(el('div','okla-catmore__tiles-slot'),el('div','okla-catmore__news-slot'),el('div','okla-catmore__products-slot'));
  if(!place(sec))return false;
  var started=false;
  function start(){if(started)return;started=true;tiles(sec);articles(sec);products(sec)}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();start()}},{rootMargin:'900px 0px'});io.observe(sec)}
  else setTimeout(start,2000);
  var content=document.getElementById('content');
  var mo=new MutationObserver(function(){if(!sec.isConnected)place(sec)});
  if(content){mo.observe(content,{childList:true,subtree:true});if(content.parentNode)mo.observe(content.parentNode,{childList:true})}
  return true;
 }
 var n=0;(function tick(){if(run())return;if(++n<60)setTimeout(tick,200)})();
})();
