/* Okla – phones, the Katalog panel: tapping a category's arrow on the right opens its subcategories right in the panel
   (as on the big shops' apps) - "‹ Všechny kategorie" back, the category's name, "Zobrazit vše" and its subcategories
   with a product photo each (names from the shop's own menu, photos from okla_subcats.js). Tapping the name still goes
   to the category; a category without subcategories goes there from its arrow too. */
(function(){
 'use strict';
 if(window.__oklaCatDrill)return;window.__oklaCatDrill=true;
 function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
 function pathOf(h){try{return new URL(h,location.origin).pathname}catch(e){return String(h||'')}}
 var SV='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
 function chev(){var c=el('span','okm61-cat-row-chevron');c.innerHTML=SV+'<path d="m9 6 6 6-6 6"/></svg>';return c}
 function close(area){var v=area&&area.querySelector('.okla-cd');if(v)v.remove();if(area)area.classList.remove('okla-cd-on')}
 function open(row,href,subs){
  var area=row.closest('.okm61-drawer-body');if(!area)return;
  close(area);
  var name=((row.querySelector('.okm61-cat-row-label')||row).textContent||'').replace(/\s+/g,' ').trim();
  var v=el('div','okla-cd');
  var back=el('button','okla-cd__back');back.type='button';back.innerHTML=SV+'<path d="m15 6-6 6 6 6"/></svg>';back.appendChild(el('span','','Všechny kategorie'));
  back.addEventListener('click',function(){close(area);var p=area.closest('.okm61-drawer-panel');if(p)p.scrollTop=0;area.scrollTop=0});
  var list=el('div','okm61-drawer-list okla-cd__list');
  var all=el('a','okm61-cat-row okla-cd__all');all.href=href;all.append(el('span','okm61-cat-row-label','Zobrazit vše'),chev());list.appendChild(all);
  var imgs={};
  subs.forEach(function(s){
   var a=el('a','okm61-cat-row okla-cd__row');a.href=s.href;
   var ic=el('span','okm61-category-icon okla-cd__icon'),img=el('img');img.alt='';img.decoding='async';ic.appendChild(img);imgs[s.href]=img;
   a.append(ic,el('span','okm61-cat-row-label',s.label),chev());list.appendChild(a);
  });
  v.append(back,el('h2','okla-tb-cats-title okla-cd__title',name),list);
  area.appendChild(v);area.classList.add('okla-cd-on');
  var p=area.closest('.okm61-drawer-panel');if(p)p.scrollTop=0;area.scrollTop=0;
  var S=window.oklaSubcats;
  if(S&&S.images)S.images(href,subs).then(function(map){
   Object.keys(imgs).forEach(function(h){var src=map&&map[h];if(src)imgs[h].src=src;else imgs[h].parentNode.classList.add('is-empty')});
  }).catch(function(){});
 }
 /* the arrow of a category row in the Katalog panel (not the Menu panel) */
 document.addEventListener('click',function(e){
  var ch=e.target.closest&&e.target.closest('#okla-v61-drawer:not(.okla-mm-open) .okm61-drawer-body>.okm61-drawer-list .okm61-cat-row-chevron');
  if(!ch)return;
  var row=ch.closest('.okm61-cat-row'),S=window.oklaSubcats;if(!row||!S||!S.list)return;
  var href=pathOf(row.getAttribute('href')),subs=S.list(href);
  if(!subs||!subs.length)return;
  e.preventDefault();e.stopPropagation();
  open(row,href,subs);
 },true);
})();
