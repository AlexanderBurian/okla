/* OKLA – a category with many products (15 and more) opens with a dark band of its best sellers, as on the big shops:
   on the left a tile "Nejprodávanější – <category>" with "Zobrazit vše" (down to the listing), on the right a row of the
   category's ten best-selling products (the shop's own cards from the category sorted by "Nejprodávanější", so
   "Do košíku" works as everywhere), moved by arrows on PC and by the finger on phones. First page of the category only. */
(function(){
 'use strict';
 if(window.__oklaCatFeature)return;window.__oklaCatFeature=true;
 var b=document.body;
 if(!b||!/(^|\s)type-category(\s|$)/.test(b.className))return;
 if(/\/strana-\d+\/?$/.test(location.pathname))return;
 var MIN=15,COUNT=10;
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function total(){var t=document.querySelector('#content .listItemsTotal');var m=t&&t.textContent.replace(/\s+/g,'').match(/\d+/);return m?Number(m[0]):0}
 var CHEV_L='<svg viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2 2 8l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var CHEV_R='<svg viewBox="0 0 10 16" aria-hidden="true"><path d="m2 2 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

 /* the band goes in at once (its place held while the best sellers load), the cards come in when they are there */
 function build(title,top,wrap){
  var sec=el('section','okla-catfeat is-loading');sec.id='okla-cat-feature';sec.setAttribute('aria-label','Nejprodávanější: '+title);
  var promo=el('div','okla-catfeat__promo');
  promo.appendChild(el('span','okla-catfeat__kicker','Nejprodávanější'));
  promo.appendChild(el('h2','okla-catfeat__title',title));
  promo.appendChild(el('p','okla-catfeat__text','Co si zákazníci v této kategorii kupují nejčastěji.'));
  var go=el('a','okla-catfeat__btn','Zobrazit vše');go.href='#category-header';
  go.addEventListener('click',function(e){var t=document.getElementById('category-header')||wrap;if(!t)return;e.preventDefault();var y=t.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})});
  promo.appendChild(go);
  var rail=el('div','okla-catfeat__rail');
  var track=el('div','products products-block okla-catfeat__track');
  function fill(cards){cards.forEach(function(c){
   var n=document.importNode(c,true);
   n.querySelectorAll('[id]').forEach(function(x){x.removeAttribute('id')});n.removeAttribute('id');
   /* lazily loaded pictures of the fetched page: their real address */
   n.querySelectorAll('img').forEach(function(im){var d=im.getAttribute('data-src')||im.getAttribute('data-lazy-src');if(d&&(!im.getAttribute('src')||/^data:/.test(im.getAttribute('src'))))im.setAttribute('src',d)});
   track.appendChild(n);
  });sec.classList.remove('is-loading');requestAnimationFrame(ends)}
  var prev=el('button','okla-catfeat__arrow okla-catfeat__arrow--prev');prev.type='button';prev.setAttribute('aria-label','Předchozí produkty');prev.innerHTML=CHEV_L;
  var next=el('button','okla-catfeat__arrow okla-catfeat__arrow--next');next.type='button';next.setAttribute('aria-label','Další produkty');next.innerHTML=CHEV_R;
  function step(){var f=track.querySelector('.product');return f?(f.offsetWidth+12)*2:track.clientWidth*0.8}
  prev.addEventListener('click',function(){track.scrollBy({left:-step(),behavior:'smooth'})});
  next.addEventListener('click',function(){track.scrollBy({left:step(),behavior:'smooth'})});
  function ends(){var x=track.scrollLeft,max=track.scrollWidth-track.clientWidth-2;prev.disabled=x<=2;next.disabled=x>=max}
  track.addEventListener('scroll',ends,{passive:true});
  rail.append(track,prev,next);
  sec.append(promo,rail);
  top.parentNode.insertBefore(sec,top.nextSibling);
  /* the shop now and then writes the whole content anew (jQuery .html() on #content, e.g. after the filters wake up):
     the band then goes back under the new category head - the same band, its cards already there. Not on the
     listing's further pages (the shop's own paging changes the address). */
  var dropped=false,mo=new MutationObserver(function(){
   if(dropped||sec.isConnected)return;
   if(/\/strana-\d+\/?$/.test(location.pathname)){mo.disconnect();return}
   var t=document.querySelector('#content .category-top');if(t)t.parentNode.insertBefore(sec,t.nextSibling);
  });
  var content=document.getElementById('content');
  if(content){mo.observe(content,{childList:true});if(content.parentNode)mo.observe(content.parentNode,{childList:true})}
  return {fill:fill,drop:function(){dropped=true;mo.disconnect();if(sec.parentNode)sec.parentNode.removeChild(sec)}};
 }

 function run(){
  var top=document.querySelector('#content .category-top'),wrap=document.querySelector('#content .category-content-wrapper');
  if(!top||!wrap)return false;
  if(document.getElementById('okla-cat-feature'))return true;
  if(!document.querySelector('#content .listItemsTotal'))return false;
  if(total()<MIN)return true;
  var title=((top.querySelector('.category-title')||{}).textContent||'').replace(/\s+/g,' ').trim();
  var band=build(title,top,wrap);
  var url=location.pathname+'?order=bestseller';
  fetch(url,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=html&&new DOMParser().parseFromString(html,'text/html');
   var cards=doc?[].slice.call(doc.querySelectorAll('#products > .product')).slice(0,COUNT):[];
   if(cards.length<4)return band.drop();
   band.fill(cards);
  }).catch(function(){band.drop()});
  return true;
 }
 var n=0;(function tick(){if(run())return;if(++n<40)setTimeout(tick,150)})();
})();
