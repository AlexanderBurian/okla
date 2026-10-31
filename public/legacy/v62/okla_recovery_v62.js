/* OKLA V62 – independent recovery for hero dots, categories and product reveal */
(function(){
'use strict';
if(window.__oklaRecovery62)return;window.__oklaRecovery62=1;
var active=window.matchMedia('(max-width:767px)');
function make(t,c,txt){var el=document.createElement(t);if(c)el.className=c;if(txt!=null)el.textContent=txt;return el}
function readCategories(){var selectors='#content-wrapper aside.sidebar #categories .topic>a[href],#content-wrapper aside.sidebar .box-categories a[href],#navigation .menu-level-1 a[href]';var seen=new Set;return Array.from(document.querySelectorAll(selectors)).map(function(a){var label=(a.textContent||'').replace(/\s+/g,' ').trim(),href=a.getAttribute('href');if(!label||!href||href==='#'||seen.has(href))return null;seen.add(href);return {label:label,href:href,original:a}}).filter(Boolean).slice(0,14)}
var icoPaths=['M5 5h14v14H5z M9 10h6 M9 14h4','M3 6h14v11H3z M7 20h9 M10 17v3','M4 4v16h16L4 4Z','M4 7h14v10H4z M9 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z','M12 2 14 9 22 12l-8 3-2 7-2-7-8-3 8-3z'];
function icon(i){var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');var p=document.createElementNS(ns,'path');p.setAttribute('d',icoPaths[i%icoPaths.length]);svg.appendChild(p);return svg}
function fixDots(){
var banner=document.querySelector('main#content .banners-row'),carousel=banner&&banner.querySelector('#carousel');if(!banner||!carousel)return;
var slides=Array.from(carousel.querySelectorAll('.carousel-inner .item'));if(!slides.length)return;
var dots=document.getElementById('okla-v61-dots');if(!dots){dots=make('div');dots.id='okla-v61-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Posun hero banneru')}
if(dots.previousElementSibling!==banner)banner.after(dots);
if(dots.children.length!==Math.min(4,slides.length)){
dots.replaceChildren();for(var i=0;i<Math.min(4,slides.length);i++){(function(index){var b=make('button');b.type='button';b.setAttribute('aria-label','Banner '+(index+1));b.addEventListener('click',function(){var jq=window.jQuery;if(jq&&jq.fn&&jq.fn.carousel){jq(carousel).carousel(index)}else{slides.forEach(function(s,j){s.classList.toggle('active',index===j)})}mark()});dots.appendChild(b)})(i)}
}
function mark(){var index=slides.findIndex(function(s){return s.classList.contains('active')});Array.from(dots.children).forEach(function(button,i){button.setAttribute('aria-current',String(index===i))})}
mark();if(!carousel.dataset.okla62Observed){carousel.dataset.okla62Observed='1';try{var mo=new MutationObserver(mark);slides.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:['class']})})}catch(e){}}
}
function fixCategories(){
var banner=document.querySelector('main#content .banners-row');if(!banner)return;
var items=readCategories();if(!items.length)return;
var sec=document.getElementById('okla-v61-categories');if(!sec){sec=make('section');sec.id='okla-v61-categories';sec.setAttribute('aria-label','Kategorie');
var grid=make('div','okm61-category-grid');
items.forEach(function(item,i){var a=make('a','okm61-category');a.href=item.href;var holder=make('span','okm61-category-icon'),from=item.original.querySelector('.okla-cat-svg svg');holder.appendChild(from?from.cloneNode(true):icon(i));a.append(holder,make('span','okm61-category-label',item.label));grid.appendChild(a)});sec.appendChild(grid);
if(items.length>8){var more=make('button','okm61-category-more','Všechny kategorie');more.type='button';more.addEventListener('click',function(){var on=sec.classList.toggle('is-expanded');more.textContent=on?'Zobrazit méně':'Všechny kategorie'});sec.append(more)}
}
var dots=document.getElementById('okla-v61-dots'),target=dots||banner;if(target.nextElementSibling!==sec)target.after(sec);
}
function fixProductButtons(){
document.querySelectorAll('main#content .okla-slider-shell').forEach(function(shell){
var group=shell.querySelector('.okla-slider-track'),viewport=shell.querySelector('.okla-slider-viewport');if(!group)return;
if(viewport&&!viewport.dataset.okla62Paused){viewport.dispatchEvent(new Event('mouseenter'));viewport.dataset.okla62Paused='1'}
var cards=Array.from(group.children).filter(function(e){return e.classList.contains('product')});if(cards.length<=4)return;
var button=shell.nextElementSibling;if(!button||!button.classList.contains('okm61-product-more')){
button=make('button','okm61-product-more','Zobrazit další produkty');button.type='button';
button.addEventListener('click',function(){var on=shell.classList.toggle('okm61-expanded');button.textContent=on?'Zobrazit méně':'Zobrazit další produkty';button.setAttribute('aria-expanded',String(on))});
button.setAttribute('aria-expanded','false');shell.after(button)
}
})
}
function repair(){if(!active.matches||(location.pathname!=='/'&&location.pathname!==''))return;
try{fixDots()}catch(e){console.warn('OKLA hero dots:',e)}
try{fixCategories()}catch(e){console.warn('OKLA mobile categories:',e)}
try{fixProductButtons()}catch(e){console.warn('OKLA mobile products:',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair,{once:true});else repair();
window.addEventListener('load',repair,{once:true});setTimeout(repair,250);setTimeout(repair,1000);setTimeout(repair,2300);
window.oklaMobileRecover=repair;
})();