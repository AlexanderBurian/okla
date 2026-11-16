/* OKLA product page - "Nejčastěji zakoupeno společně" above the description tabs: the site's own product slider
   (real Shoptet product cards, the homepage slider built by the loader's __oklaSliderFor - the same as "Mohlo by vás
   zajímat" below, class ok86-related) with filter chips on one line: "Doporučené" (the product's related products and
   its category) and the shop's categories (loaded when picked). Cards are read from the live shop pages and cached
   for 10 minutes (the same cache as the related slider). */
(function(){
 'use strict';
 if(window.__oklaBoughtTogetherV2)return;window.__oklaBoughtTogetherV2=true;
 var MAX=12;
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return ''}}
 function norm(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
 function slug(t){return '/'+norm(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'/'}
 /* a category's address: the shop's own menu link of that name, else the address made from the name */
 function catHref(name){
  var want=norm(name),hit=null;
  document.querySelectorAll('#navigation .menu-level-1>li>a[href], #okla-catbar a.okcb-link').forEach(function(a){if(!hit&&norm(a.textContent)===want)hit=pathOf(a.getAttribute('href'))});
  return hit||slug(name);
 }
 /* short chip labels, so all chips fit on one line */
 var SHORT={'Měřicí technika a nářadí':'Měřicí technika','Elektronické multitooly':'Multitooly','Chytrá elektronika':'Chytrá elektronika','Designové gadgety':'Gadgety','Endoskopy a inspekční kamery':'Endoskopy','Praktické vychytávky':'Vychytávky','Projektory a obraz':'Projektory'};
 function label(c){return SHORT[c]||c}

 /* real product cards of a shop page, cached 10 minutes (same key and format as okla_detail.js) */
 function liveCards(path){
  var key='okla-related:'+path,cached=null;
  try{cached=JSON.parse(sessionStorage.getItem(key)||'null')}catch(e){}
  if(cached&&cached.t>Date.now()-600000)return Promise.resolve(cached.cards);
  return fetch(path,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   var cards=[].slice.call(doc.querySelectorAll('.products .product')).filter(function(c){return c.querySelector('a.name, a.image')&&!c.closest('.products-inline,#productsTop')}).map(function(c){
    var a=c.querySelector('a.name')||c.querySelector('a.image');return {url:pathOf(a.getAttribute('href')),html:c.outerHTML};
   });
   try{sessionStorage.setItem(key,JSON.stringify({t:Date.now(),cards:cards}))}catch(e){}
   return cards;
  }).catch(function(){return []});
 }
 function cardFrom(r){
  var t=document.createElement('template');t.innerHTML=r.html.trim();var card=t.content.firstElementChild;
  if(card){delete card.dataset.oklaCardsDone;card.querySelectorAll('img[data-src]').forEach(function(i){i.src=i.getAttribute('data-src');i.removeAttribute('data-src')})}
  return card;
 }
 function pick(lists,first){
  var here=location.pathname,seen={},out=[];seen[here]=1;
  var all=[].concat.apply([],lists),byUrl={};all.forEach(function(c){byUrl[c.url]=byUrl[c.url]||c});
  (first||[]).forEach(function(u){var c=byUrl[u];if(c&&!seen[u]&&out.length<MAX){seen[u]=1;out.push(c)}});
  all.forEach(function(c){if(!seen[c.url]&&out.length<MAX){seen[c.url]=1;out.push(c)}});
  return out;
 }

 function build(){
  var tabs=document.querySelector('.p-detail ul.p-detail-tabs, ul.p-detail-tabs');
  if(!tabs||typeof window.__oklaSliderFor!=='function')return false;
  if(document.getElementById('okla-bought-together'))return true;
  var anchor=tabs.closest('.shp-tabs-wrapper, .p-detail-tabs-wrapper')||tabs.parentElement;
  var cat=window.OKLA_V86_CATALOG||{},cur=null,cats={};
  Object.keys(cat).forEach(function(k){var p=cat[k];if(!p||!p.url)return;if(pathOf(p.url)===location.pathname)cur=p;if(p.defaultCategory)cats[p.defaultCategory]=(cats[p.defaultCategory]||0)+1});
  var related=((cur&&cur.related)||[]).map(function(c){return cat[c]&&pathOf(cat[c].url)}).filter(Boolean);
  var own=cur&&cur.defaultCategory?catHref(cur.defaultCategory):'';

  var sec=el('section','ok86-related okla-bt');sec.id='okla-bought-together';
  var heading=el('div','homepage-group-title h4 okla-slider-heading','Nejčastěji zakoupeno společně');
  var chips=el('div','okla-bt__chips');chips.setAttribute('role','tablist');chips.setAttribute('aria-label','Filtr doporučených produktů');
  sec.append(heading,chips);
  anchor.parentNode.insertBefore(sec,anchor);

  var sources=[{label:'Doporučené',load:function(){return Promise.all([own?liveCards(own):Promise.resolve([]),liveCards('/')]).then(function(l){return pick(l,related)})}}]
   .concat(Object.keys(cats).sort(function(a,b){return cats[b]-cats[a]}).map(function(c){var h=catHref(c);return {label:label(c),load:function(){return liveCards(h).then(function(l){return pick([l])})}}}));
  var current=-1,token=0;
  function show(i){
   if(i===current)return;current=i;var my=++token;
   [].forEach.call(chips.children,function(ch,j){ch.classList.toggle('is-active',i===j);ch.setAttribute('aria-selected',String(i===j))});
   sources[i].load().then(function(list){
    if(my!==token)return;
    /* a fresh slider for this list: the old shell goes, the loader's sliderFor builds the new one */
    sec.querySelectorAll('.okla-slider-track').forEach(function(t){if(t.__oklaSlider&&t.__oklaSlider.destroy)t.__oklaSlider.destroy()});
    sec.querySelectorAll('.okla-slider-shell, .products.products-block').forEach(function(n){n.remove()});
    if(!list.length){sec.classList.add('okla-bt--empty');return}
    sec.classList.remove('okla-bt--empty');
    var group=el('div','products products-block');list.forEach(function(r){var c=cardFrom(r);if(c)group.append(c)});
    sec.appendChild(group);
    window.__oklaSliderFor(group,heading);
   });
  }
  sources.forEach(function(s,i){var ch=el('button','okla-bt__chip',s.label);ch.type='button';ch.setAttribute('role','tab');ch.addEventListener('click',function(){show(i)});chips.appendChild(ch)});
  show(0);
  return true;
 }
 var tries=0;(function tick(){if(build()||++tries>80)return;setTimeout(tick,150)})();
})();
