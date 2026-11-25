/* OKLA – a category with many products (15 and more) opens with a dark band of its ten best sellers, as on the big shops:
   the tile "Nejprodávanější" first, then the cards. The cards are the shop's own (the category sorted by "Nejprodávanější",
   so "Do košíku" works as everywhere) and the row is the homepage's own endless slider (window.__oklaSliderFor from the
   loader: the same cards, arrows at the band's edges on PC, the finger on phones). First page of the category only.
   window.oklaCatCards(url) is shared with okla_category_bottom.js: a page's product cards, ready to be put in a row. */
(function(){
 'use strict';
 if(window.__oklaCatFeature)return;window.__oklaCatFeature=true;
 var b=document.body;
 if(!b||!/(^|\s)type-category(\s|$)/.test(b.className))return;
 var MIN=15,COUNT=10;
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function total(){var t=document.querySelector('#content .listItemsTotal');var m=t&&t.textContent.replace(/\s+/g,'').match(/\d+/);return m?Number(m[0]):0}

 /* a page's product cards (parsed from its HTML, ids dropped, lazily loaded pictures given their real address) */
 window.oklaCatCards=function(url){
  return fetch(url,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   if(!html)return [];
   var doc=new DOMParser().parseFromString(html,'text/html');
   return [].slice.call(doc.querySelectorAll('#products > .product')).map(function(c){
    var n=document.importNode(c,true);
    n.querySelectorAll('[id]').forEach(function(x){x.removeAttribute('id')});n.removeAttribute('id');
    n.querySelectorAll('img').forEach(function(im){var d=im.getAttribute('data-src')||im.getAttribute('data-lazy-src');if(d&&(!im.getAttribute('src')||/^data:/.test(im.getAttribute('src'))))im.setAttribute('src',d)});
    return n;
   });
  }).catch(function(){return []});
 };

 function run(){
  var top=document.querySelector('#content .category-top'),wrap=document.querySelector('#content .category-content-wrapper');
  if(!top||!wrap||typeof window.__oklaSliderFor!=='function')return false;
  if(/\/strana-\d+\/?$/.test(location.pathname))return true;
  if(document.getElementById('okla-cat-feature'))return true;
  if(!document.querySelector('#content .listItemsTotal'))return false;
  if(total()<MIN)return true;
  var title=((top.querySelector('.category-title')||{}).textContent||'').replace(/\s+/g,' ').trim();
  /* the band holds its place while the cards load (the listing under it does not jump) */
  var sec=el('section','okla-catfeat is-loading');sec.id='okla-cat-feature';sec.setAttribute('aria-label','Nejprodávanější: '+title);
  var heading=el('div','homepage-group-title h4 okla-catfeat__heading','Nejprodávanější');
  sec.appendChild(heading);
  top.parentNode.insertBefore(sec,top.nextSibling);
  /* the shop now and then writes the whole content anew (jQuery .html() on #content): the band then goes back under
     the new category head - the same band, its slider already built */
  var mo=new MutationObserver(function(){
   if(sec.isConnected)return;
   if(/\/strana-\d+\/?$/.test(location.pathname)){mo.disconnect();return}
   var t=document.querySelector('#content .category-top');if(t)t.parentNode.insertBefore(sec,t.nextSibling);
  });
  var content=document.getElementById('content');
  if(content){mo.observe(content,{childList:true});if(content.parentNode)mo.observe(content.parentNode,{childList:true})}
  /* the tile "Nejprodávanější": on PC the first place of the row (it leaves with the first move to the right and does
     not come back), on phones above the row; a flat blue, no gradient */
  var tile=el('div','okla-catfeat__promo');
  tile.appendChild(el('span','okla-catfeat__kicker','Nejprodávanější'));
  tile.appendChild(el('h2','okla-catfeat__title',title));
  tile.appendChild(el('p','okla-catfeat__text','Co si zákazníci v této kategorii kupují nejčastěji.'));
  var go=el('a','okla-catfeat__btn','Zobrazit vše');go.href='#category-header';
  go.addEventListener('click',function(e){var t=document.getElementById('category-header');if(!t)return;e.preventDefault();window.scrollTo({top:Math.max(0,t.getBoundingClientRect().top+window.scrollY-120),behavior:'smooth'})});
  tile.appendChild(go);
  window.oklaCatCards(location.pathname+'?order=bestseller').then(function(cards){
   cards=cards.slice(0,COUNT);
   if(cards.length<4){mo.disconnect();sec.remove();return}
   var group=el('div','products products-block');
   cards.forEach(function(c){group.appendChild(c)});
   sec.appendChild(group);
   window.__oklaSliderFor(group,heading);
   sec.classList.remove('is-loading');
   var shell=sec.querySelector('.okla-slider-shell'),viewport=sec.querySelector('.okla-slider-viewport'),next=sec.querySelector('.okla-slider-next');
   var pc=window.matchMedia('(min-width:768px)'),gone=false;
   function placeTile(){
    if(gone)return;
    if(pc.matches){if(tile.parentNode!==group)group.insertBefore(tile,group.firstChild);sec.classList.add('has-tile')}
    else{if(tile.parentNode!==sec||tile.nextSibling!==shell)sec.insertBefore(tile,shell);sec.classList.remove('has-tile')}
   }
   placeTile();
   if(pc.addEventListener)pc.addEventListener('change',placeTile);
   /* the first move to the right takes the tile away for good (the slider puts the first item last; once it is
      out of sight it is removed and the row goes on with the products only) */
   if(next)next.addEventListener('click',function(){
    if(gone||tile.parentNode!==group)return;
    setTimeout(function(){if(group.firstElementChild!==tile&&tile.parentNode===group){tile.remove();gone=true;sec.classList.remove('has-tile')}},760);
   });
   /* no automatic moving here (as on the big shops' bands - and the tile must not slide away by itself): the
      slider's own pause (pointer over the row) is switched on and kept on */
   if(viewport){
    viewport.dispatchEvent(new Event('mouseenter'));
    ['mouseleave','focusout'].forEach(function(t){window.addEventListener(t,function(e){if(e.target===viewport)e.stopPropagation()},true)});
   }
  });
  return true;
 }
 var n=0;(function tick(){if(run())return;if(++n<60)setTimeout(tick,150)})();
})();
