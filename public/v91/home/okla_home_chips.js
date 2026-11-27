/* Okla – homepage: category chips above the lower product rows (the product page's "Nejčastěji zakoupeno společně"
   chips, same look: okla_card.css). The first chip is the row's own products ("Doporučené"); the others are the
   shop's categories (from the category bar), each loaded when picked - real product cards read from the category
   page, cached 10 minutes (the same cache as the product page's rows). A picked list becomes the row's slider
   (the loader's __oklaSliderFor, like everywhere else). The chips sit inside the row's heading, so the heading and
   its slider stay one island. Only the last two product rows get chips. */
(function(){
 'use strict';
 if(window.__oklaHomeChips)return;window.__oklaHomeChips=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var MAX=12,ROWS=2;
 var SHORT={'Měřicí technika a nářadí':'Měřicí technika','Elektronické multitooly':'Multitooly','Designové gadgety':'Gadgety','Endoskopy a inspekční kamery':'Endoskopy','Praktické vychytávky':'Vychytávky','Projektory a obraz':'Projektory'};
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return ''}}
 function cats(){
  var out=[],seen={};
  document.querySelectorAll('#okla-catbar a.okcb-link[href], #navigation .menu-level-1>li>a[href]').forEach(function(a){
   var p=pathOf(a.getAttribute('href')),t=(a.textContent||'').replace(/\s+/g,' ').trim();
   if(!p||p==='/'||!t||/^\/(kontakt|blog|nase-novinky|newsroom)/.test(p))return;
   if(seen[p]){if(t.length>(seen[p].full||'').length)seen[p].full=t;return}
   var c={label:SHORT[t]||t,href:p,full:t};seen[p]=c;out.push(c);
  });
  /* only categories with at least four products (a row of one or two would just repeat them): counted in the shop's
     catalogue (okla_v86_catalog.js), the category's full name taken from the shop's menu */
  var cat=window.OKLA_V86_CATALOG,count={};
  if(cat){Object.keys(cat).forEach(function(k){var p=cat[k];if(p&&p.defaultCategory){var n=norm(p.defaultCategory);count[n]=(count[n]||0)+1}});
   out=out.filter(function(c){var full=c.full||c.label;return (count[norm(full)]||0)>=4})}
  return out.slice(0,8);
 }
 function norm(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
 /* real product cards of a shop page, cached 10 minutes (same key and format as the product page's rows) */
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
 function cardFrom(html){
  var t=document.createElement('template');t.innerHTML=html.trim();var card=t.content.firstElementChild;
  if(card){delete card.dataset.oklaCardsDone;card.removeAttribute('data-okla-clone');card.removeAttribute('data-okla-loop');card.querySelectorAll('img[data-src]').forEach(function(i){i.src=i.getAttribute('data-src');i.removeAttribute('data-src')})}
  return card;
 }
 function setup(heading,shell,offset){
  var track=shell.querySelector('.okla-slider-track');if(!track)return;
  /* the row's own products, kept to come back to */
  var own=[].filter.call(track.children,function(c){return c.classList.contains('product')&&!c.hasAttribute('data-okla-clone')&&!c.hasAttribute('data-okla-loop')}).map(function(c){return c.outerHTML});
  var list=cats();if(!list.length)return;
  list=list.slice(offset%list.length).concat(list.slice(0,offset%list.length));
  var sources=[{label:'Doporučené',load:function(){return Promise.resolve(own)}}].concat(list.map(function(c){return {label:c.label,load:function(){return liveCards(c.href).then(function(l){return l.slice(0,MAX).map(function(x){return x.html})})}}}));
  var chips=el('div','okla-row-chips okla-bt__chips');chips.setAttribute('role','tablist');chips.setAttribute('aria-label','Výběr kategorie');
  heading.classList.add('okla-has-chips');heading.appendChild(chips);
  var current=0,token=0;
  function show(i){
   if(i===current)return;current=i;var my=++token;
   [].forEach.call(chips.children,function(ch,j){ch.classList.toggle('is-active',i===j);ch.setAttribute('aria-selected',String(i===j))});
   sources[i].load().then(function(htmls){
    if(my!==token||!htmls.length)return;
    var old=heading.nextElementSibling;if(!old||!old.classList.contains('okla-slider-shell'))return;
    old.querySelectorAll('.okla-slider-track').forEach(function(t){try{if(t.__oklaSlider&&t.__oklaSlider.destroy)t.__oklaSlider.destroy()}catch(e){}});
    var group=el('div','products products-block');htmls.forEach(function(h){var c=cardFrom(h);if(c)group.appendChild(c)});
    old.parentNode.insertBefore(group,old);old.remove();
    window.__oklaSliderFor(group,heading);
   });
  }
  sources.forEach(function(s,i){var ch=el('button','okla-bt__chip'+(i===0?' is-active':''),s.label);ch.type='button';ch.setAttribute('role','tab');ch.setAttribute('aria-selected',String(i===0));ch.addEventListener('click',function(){show(i)});chips.appendChild(ch)});
 }
 function mount(){
  if(typeof window.__oklaSliderFor!=='function')return false;
  var main=document.querySelector('main#content');if(!main)return false;
  var rows=[].filter.call(main.querySelectorAll(':scope>.homepage-group-title'),function(h){var n=h.nextElementSibling;return n&&n.classList.contains('okla-slider-shell')&&!n.classList.contains('okla-brands__shell')&&n.querySelector('.okla-slider-track .product')});
  if(rows.length<4||!document.querySelector('#okla-catbar a.okcb-link, #navigation .menu-level-1>li>a'))return false;
  rows.slice(-ROWS).forEach(function(h,i){if(!h.classList.contains('okla-has-chips'))setup(h,h.nextElementSibling,i*3)});
  return true;
 }
 /* after the page has loaded (the extra product rows are added late), so the last rows are really the last */
 function start(){var tries=0;(function tick(){if(mount())return;if(++tries<60)setTimeout(tick,250)})()}
 if(document.readyState==='complete')setTimeout(start,800);else addEventListener('load',function(){setTimeout(start,800)},{once:true});
})();
