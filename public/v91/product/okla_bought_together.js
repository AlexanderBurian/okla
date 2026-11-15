/* OKLA product page - "Nejčastěji zakoupeno společně" above the description tabs (the idea of Alza's block, OKLA's
   own look): filter chips ("Doporučené" + the categories of the offered products), a row of product cards with the
   homepage slider's blue arrows (swipe on phones), each card with a picture, stars, name, price, the card "Do košíku"
   (adds through Shoptet's cart and opens the cart panel) and a link to its category. Data: OKLA_V86_CATALOG. */
(function(){
 'use strict';
 if(window.__oklaBoughtTogetherV1)return;window.__oklaBoughtTogetherV1=true;
 var NS='http://www.w3.org/2000/svg';
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function icon(d){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);return s}
 function pathOf(u){try{return new URL(u,location.origin).pathname}catch(e){return ''}}
 function money(v){var n=Math.round(Number(String(v).replace(/[^\d.,]/g,'').replace(',','.')));return n>0?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč':''}
 function norm(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
 function slug(t){return '/'+norm(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'/'}
 /* category address: the shop's own menu link of that name, else the address made from the name */
 function catHref(name){
  var want=norm(name),hit=null;
  document.querySelectorAll('#navigation .menu-level-1>li>a[href], #okla-catbar a.okcb-link').forEach(function(a){if(!hit&&norm(a.textContent)===want)hit=a.getAttribute('href')});
  return hit||slug(name);
 }
 function shortCat(name){return String(name||'').replace(/ a nářadí$/,'').replace(/ a inspekční kamery$/,'')}

 function products(){
  var cat=window.OKLA_V86_CATALOG||{},here=location.pathname,all=[],cur=null;
  Object.keys(cat).forEach(function(k){var p=cat[k];if(!p||!p.url||!p.price)return;if(pathOf(p.url)===here){cur=p;return}all.push(p)});
  return {cur:cur,all:all};
 }
 function recommended(cur,all){
  var out=[],seen={};function push(p){if(p&&!seen[p.code]){seen[p.code]=1;out.push(p)}}
  var by={};all.forEach(function(p){by[p.code]=p});
  ((cur&&cur.related)||[]).forEach(function(c){push(by[c])});
  if(cur)all.forEach(function(p){if(p.defaultCategory===cur.defaultCategory)push(p)});
  all.forEach(push);
  return out.slice(0,12);
 }

 function stars(){var s=el('span','okla-bt__stars');s.setAttribute('aria-hidden','true');for(var i=0;i<5;i++)s.appendChild(icon('M12 3.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.9l-5.25 2.8 1-5.85L3.5 9.7l5.9-.9z'));return s}
 function card(p){
  var c=el('div','okla-bt__card');
  var pic=el('a','okla-bt__pic');pic.href=pathOf(p.url);pic.tabIndex=-1;pic.setAttribute('aria-hidden','true');
  var im=el('img');im.src=p.image||'';im.alt='';im.loading='lazy';im.decoding='async';im.draggable=false;pic.appendChild(im);
  var name=el('a','okla-bt__name',p.name);name.href=pathOf(p.url);
  var price=el('div','okla-bt__price',money(p.price));
  var btn=el('button','okla-bt__btn');btn.type='button';btn.append(el('span','okla-bt__cart'),el('span','','Do košíku'));
  btn.addEventListener('click',function(){
   var cart=window.shoptet&&window.shoptet.cartShared;
   if(!cart||typeof cart.addToCart!=='function'){location.href=pathOf(p.url);return}
   btn.disabled=true;var r=cart.addToCart({productCode:p.code,amount:1});
   var done=function(){btn.disabled=false};if(r&&r.then)r.then(done,done);else setTimeout(done,1200);
  });
  var more=el('a','okla-bt__cat',shortCat(p.defaultCategory)+' »');more.href=catHref(p.defaultCategory);
  c.append(pic,stars(),name,price,btn,more);
  return c;
 }

 function build(){
  var tabs=document.querySelector('.p-detail ul.p-detail-tabs, ul.p-detail-tabs');
  if(!tabs)return false;
  if(document.getElementById('okla-bought-together'))return true;
  var anchor=tabs.closest('.shp-tabs-wrapper, .p-detail-tabs-wrapper')||tabs.parentElement;
  var data=products();if(!data.all.length)return true;
  var rec=recommended(data.cur,data.all);

  var sec=el('section','okla-bt');sec.id='okla-bought-together';sec.setAttribute('aria-labelledby','okla-bt-title');
  var h=el('h2','okla-bt__title','Nejčastěji zakoupeno společně');h.id='okla-bt-title';
  var chips=el('div','okla-bt__chips');chips.setAttribute('role','tablist');chips.setAttribute('aria-label','Filtr doporučených produktů');
  var shell=el('div','okla-bt__shell'),view=el('div','okla-bt__view'),track=el('div','okla-bt__track');
  var prev=el('button','okla-bt__arrow okla-bt__arrow--prev'),next=el('button','okla-bt__arrow okla-bt__arrow--next');
  prev.type=next.type='button';prev.setAttribute('aria-label','Předchozí produkty');next.setAttribute('aria-label','Další produkty');
  prev.appendChild(icon('m15 18-6-6 6-6'));next.appendChild(icon('m9 18 6-6-6-6'));
  view.appendChild(track);shell.append(prev,view,next);

  /* chips: recommended first, then the categories among the offered products (most products first) */
  var counts={};data.all.forEach(function(p){if(p.defaultCategory)counts[p.defaultCategory]=(counts[p.defaultCategory]||0)+1});
  var cats=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]});
  var lists=[{label:'Doporučené',items:rec}].concat(cats.map(function(c){return {label:shortCat(c),items:data.all.filter(function(p){return p.defaultCategory===c})}}));
  function show(i){
   track.textContent='';lists[i].items.forEach(function(p){track.appendChild(card(p))});
   view.scrollLeft=0;
   [].forEach.call(chips.children,function(ch,j){ch.classList.toggle('is-active',i===j);ch.setAttribute('aria-selected',String(i===j))});
   requestAnimationFrame(state);
  }
  lists.forEach(function(l,i){var ch=el('button','okla-bt__chip',l.label);ch.type='button';ch.setAttribute('role','tab');ch.addEventListener('click',function(){show(i)});chips.appendChild(ch)});

  /* arrows: one view at a time; past the end the row starts again (like the homepage sliders) */
  function step(){var c=track.firstElementChild;if(!c)return view.clientWidth;var gap=parseFloat(getComputedStyle(track).columnGap)||0;var per=Math.max(1,Math.floor((view.clientWidth+gap)/(c.offsetWidth+gap)));return per*(c.offsetWidth+gap)}
  function go(d){var max=view.scrollWidth-view.clientWidth;var to=view.scrollLeft+d*step();if(d>0&&view.scrollLeft>=max-4)to=0;else if(d<0&&view.scrollLeft<=4)to=max;view.scrollTo({left:to,behavior:'smooth'})}
  function state(){var scroll=view.scrollWidth>view.clientWidth+4;prev.hidden=next.hidden=!scroll}
  prev.addEventListener('click',function(){go(-1)});next.addEventListener('click',function(){go(1)});
  addEventListener('resize',state,{passive:true});

  sec.append(h,chips,shell);
  anchor.parentNode.insertBefore(sec,anchor);
  show(0);
  return true;
 }
 var tries=0;(function tick(){if(build()||++tries>60)return;setTimeout(tick,150)})();
})();
