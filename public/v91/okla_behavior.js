/* OKLA V91: 11 compatibility behavior modules in original bootstrap order. No CSS injection. */
/* === public/v91/behavior_v57.js / behavior only === */
/* OKLA V57 — stable homepage cleanup + neon technology art + cart visual fix */
(function(){
'use strict';if(window.__okla57)return;window.__okla57=true;

var images=["https://images.pexels.com/photos/8108726/pexels-photo-8108726.jpeg?auto=compress&w=1260&h=750&dpr=1","https://images.pexels.com/photos/28374509/pexels-photo-28374509.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200","https://images.pexels.com/photos/8022861/pexels-photo-8022861.jpeg?auto=compress&w=1260&h=750&dpr=1","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1300&q=90","https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1300&q=90"], fallback=["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1300&q=85"];
function svgCart(){
var ns='http://www.w3.org/2000/svg';
var svg=document.createElementNS(ns,'svg');
svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('okla-header-lineicon');
var p=document.createElementNS(ns,'path');p.setAttribute('d','M2.8 4.2h2.4l2.2 10.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 8H6');svg.appendChild(p);
[10,18].forEach(function(x){var c=document.createElementNS(ns,'circle');c.setAttribute('cx',x);c.setAttribute('cy','20');c.setAttribute('r','1.2');svg.appendChild(c)});return svg;
}
function fixCart(){
var row=document.querySelector('#header .header-top .navigation-buttons .okla-exact-header');
if(!row)return;
var cart=row.querySelector('a.cart-count');if(!cart)return;
var symbol=cart.querySelector('.okla-cart-symbol');
if(!symbol){symbol=document.createElement('span');symbol.className='okla-cart-symbol';symbol.setAttribute('aria-hidden','true');cart.prepend(symbol)}
if(symbol.dataset.oklaIconVersion!=='57'){symbol.replaceChildren(svgCart());symbol.dataset.oklaIconVersion='57'}
cart.setAttribute('aria-label','Nákupní košík');cart.setAttribute('title','Nákupní košík');
}
function cleanWelcome(){
if(location.pathname!=='/'&&location.pathname!=='')return;
var main=document.querySelector('main#content')||document.querySelector('#content');if(!main)return;
main.querySelectorAll('.homepage-box.welcome-wrapper,.welcome-wrapper,.welcome-text,.homepage-welcome-wrapper,.homepage-box').forEach(function(node){
if(node.closest('#okla-news-v55'))return;
if(node.classList.contains('welcome-wrapper')||/Vítejte v našem obchodě|Vítáme Vás ve zkušební verzi služby Shoptet/i.test(node.textContent||''))node.remove()
});
}
function fixImages(){
var cards=document.querySelectorAll('#okla-news-v55 .okn-card');if(cards.length<5)return;
Array.from(cards).slice(0,5).forEach(function(card,i){
var img=card.querySelector('.okn-image img');if(!img||img.dataset.oklaImg==='57')return;
img.dataset.oklaImg='57';img.onerror=function(){this.onerror=null;this.src=fallback[i]};img.src=images[i];
})
}
function apply(){cleanWelcome();fixImages();fixCart()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('load',apply,{once:true});window.addEventListener('resize',fixCart,{passive:true});
setTimeout(apply,200);setTimeout(apply,750);setTimeout(apply,1700);
})();

/* === public/legacy/v61/okla_mobile_v61.js / behavior only === */
/* OKLA V61 — native Shoptet mobile, independent of legacy V58 */
(function(){
'use strict';
if(window.__oklaV61)return;window.__oklaV61=1;
var mq=window.matchMedia('(max-width:767px)'),NS='http://www.w3.org/2000/svg';
var paths={
home:['M12 2.8 2.9 10.5h2.3V21h5.1v-6.4h3.4V21h5.1V10.5h2.3Z'],
catalog:['M4 6h13','M4 12h9','M4 18h9','M17.5 15.5a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z','m20.2 22.2 2.1 1.6'],
cart:['M2.5 4h2.8l2.1 10.5a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21.1 8H6','M10 20h.01','M18 20h.01'],
orders:['M7.5 4h9v3h-9z','M5.3 7h13.4v14H5.3z','m9 14 2.4 2.5 4.5-5'],
menu:['M7.5 11a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z','M2.8 18c.4-3.3 2.1-5 4.7-5s4.3 1.7 4.7 5','M16 12h6','M16 16h6','M16 20h6'],
search:['M10.8 17.2a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z','m15.6 15.6 5.4 5.4'],
arrow:['m9 5 7 7-7 7'],
chevron:['m6 9 6 6 6-6'],
close:['M5 5 19 19','M19 5 5 19'],
chip:['M5 5h14v14H5z','M9 10h6','M9 14h4'],
devices:['M4 5h13v11H4z','M7 20h8','M11 16v4','M19 9h3v11h-3z'],
measure:['M4 4v16h16L4 4Z','M8 14h4','M8 11h2'],
cam:['M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z','M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z','m17 10 5-3v10l-5-3'],
spark:['m12 2 2.3 7.8L22 12l-7.7 2.2L12 22l-2.3-7.8L2 12l7.7-2.2Z'],
bulb:['M9 17a7 7 0 1 1 6 0l-.7 3h-4.6Z','M10 22h4'],
screen:['M4 5h16v13H4z','M8 21h8','M12 18v3']
};
function svg(key){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');(paths[key]||paths.chip).forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});return s}
function n(tag,cls,value){var e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e}
function isHome(){return location.pathname==='/'||location.pathname===''}
var searchState=null,categories=[];
function header(){
var outer=document.querySelector('#header');if(!outer)return;
var shell=document.getElementById('okla-v61-header');if(!shell){shell=n('div');shell.id='okla-v61-header';
var row=n('div','okm61-top'),logo=n('a','okm61-logo');logo.href='/';logo.setAttribute('aria-label','OKLA.cz – úvodní stránka');
var source=outer.querySelector('.site-name-wrapper img,.site-name img');if(source){var im=n('img');im.alt='OKLA.cz';im.src=source.currentSrc||source.src;logo.appendChild(im)}else logo.textContent='OKLA.cz';
row.appendChild(logo);shell.append(row,n('div','okm61-search'));outer.prepend(shell)}
var slot=shell.querySelector('.okm61-search');
var original=outer.querySelector('.header-top>.search')||outer.querySelector('.header-top .search');
if(!searchState&&original){searchState={element:original,parent:original.parentNode,next:original.nextSibling}}
if(mq.matches){
if(searchState&&searchState.element.parentNode!==slot)slot.appendChild(searchState.element);
if(!searchState&&!slot.querySelector('form')){var form=n('form');form.method='get';form.action='/vyhledavani/';var field=n('fieldset'),b=n('button');b.type='submit';b.setAttribute('aria-label','Hledat');var inp=n('input');inp.type='search';inp.name='string';inp.placeholder='Napište, co hledáte';field.append(b,inp);form.appendChild(field);slot.appendChild(form)}
var searchBtn=slot.querySelector('button[type=submit]');if(searchBtn&&!searchBtn.querySelector('.okm61-search-icon')){var ico=svg('search');ico.classList.add('okm61-search-icon');searchBtn.prepend(ico)}
var input=slot.querySelector('input.query-input,input[type=search],input[type=text]');if(input)input.placeholder='Napište, co hledáte';
}else if(searchState&&searchState.parent&&searchState.element.parentNode!==searchState.parent){
if(searchState.next&&searchState.next.parentNode===searchState.parent)searchState.parent.insertBefore(searchState.element,searchState.next);else searchState.parent.appendChild(searchState.element)
}
}
function getCats(){
var q=document.querySelectorAll('#content-wrapper aside.sidebar #categories .topic>a[href],#content-wrapper aside.sidebar .box-categories .topic>a[href],#navigation .menu-level-1 a[href],.box-categories #categories a[href]');
var seen={},result=[];Array.from(q).forEach(function(a){var label=(a.textContent||'').replace(/\s+/g,' ').trim(),href=a.getAttribute('href');if(!label||!href||href==='#'||/javascript:/i.test(href)||label.length>70||seen[href])return;seen[href]=1;result.push({label:label,href:href,original:a})});return result.slice(0,16)
}
function catIcon(item,i){var iconSpan=n('span','okm61-category-icon'),source=item.original.querySelector('.okla-cat-svg svg');if(source)iconSpan.appendChild(source.cloneNode(true));else iconSpan.appendChild(svg(['chip','devices','measure','cam','bulb','spark','screen'][i%7]));return iconSpan}
function catTile(item,i){var a=n('a','okm61-category');a.href=item.href;a.append(catIcon(item,i),n('span','okm61-category-label',item.label));return a}
function categorySection(){
if(!mq.matches||!isHome())return;
var main=document.querySelector('main#content'),banner=main&&main.querySelector('.banners-row');if(!main||!banner)return;
categories=getCats();if(!categories.length)return;
var sec=document.getElementById('okla-v61-categories');if(!sec){sec=n('section');sec.id='okla-v61-categories';sec.setAttribute('aria-label','Kategorie produktů');
var grid=n('div','okm61-category-grid');categories.forEach(function(item,i){grid.appendChild(catTile(item,i))});sec.appendChild(grid);
if(categories.length>8){var more=n('button','okm61-category-more','Všechny kategorie');more.type='button';more.setAttribute('aria-expanded','false');more.addEventListener('click',function(){var on=sec.classList.toggle('is-expanded');more.textContent=on?'Zobrazit méně':'Všechny kategorie';more.setAttribute('aria-expanded',String(on))});sec.appendChild(more)}
}
var anchor=document.getElementById('okla-v61-dots')||banner;
if(anchor.nextElementSibling!==sec)anchor.after(sec);
}
function dots(){
if(!mq.matches||!isHome())return;
var main=document.querySelector('main#content'),banner=main&&main.querySelector('.banners-row'),carousel=banner&&banner.querySelector('#carousel');if(!banner||!carousel)return;
var slides=Array.from(carousel.querySelectorAll('.carousel-inner>.item'));if(!slides.length)return;
var count=Math.min(4,slides.length),wrap=document.getElementById('okla-v61-dots');
if(!wrap){wrap=n('div');wrap.id='okla-v61-dots';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','Posun hlavního banneru');banner.after(wrap)}
if(wrap.dataset.count!==String(count)){wrap.replaceChildren();for(var i=0;i<count;i++){(function(idx){var button=n('button');button.type='button';button.setAttribute('aria-label','Zobrazit banner '+(idx+1));button.addEventListener('click',function(){var jq=window.jQuery;if(jq&&jq.fn&&jq.fn.carousel)jq(carousel).carousel(idx);else{slides.forEach(function(x,j){x.classList.toggle('active',idx===j)})}update()});wrap.appendChild(button)})(i)}wrap.dataset.count=String(count)}
function update(){var current=Math.max(0,slides.findIndex(function(el){return el.classList.contains('active')}));Array.from(wrap.children).forEach(function(el,i){el.setAttribute('aria-current',String(current===i))})}
update();if(!carousel.dataset.okm61Observed){carousel.dataset.okm61Observed='1';var obs=new MutationObserver(update);slides.forEach(function(slide){obs.observe(slide,{attributes:true,attributeFilter:['class']})});carousel.addEventListener('slid.bs.carousel',update)}
}
function pauseSliders(){
if(!mq.matches||!isHome())return;
document.querySelectorAll('main#content .okla-slider-shell').forEach(function(shell){
var track=shell.querySelector('.okla-slider-track'),viewport=shell.querySelector('.okla-slider-viewport');if(!track||!viewport)return;
if(!viewport.dataset.okm61Paused){viewport.dataset.okm61Paused='1';viewport.dispatchEvent(new Event('mouseenter'))}
if(!shell.dataset.okm61Processed){shell.dataset.okm61Processed='1';var cards=Array.from(track.children).filter(function(el){return el.classList.contains('product')});
if(cards.length>4){var btn=n('button','okm61-product-more','Zobrazit další produkty');btn.type='button';btn.setAttribute('aria-expanded','false');btn.appendChild(svg('chevron'));btn.addEventListener('click',function(){var expanded=shell.classList.toggle('okm61-expanded');btn.firstChild.textContent=expanded?'Zobrazit méně':'Zobrazit další produkty';btn.setAttribute('aria-expanded',String(expanded))});shell.after(btn)}
}
});
}
function nav(){
if(!mq.matches)return;
var bar=document.getElementById('okla-v61-bottom');if(bar)return;
bar=n('nav');bar.id='okla-v61-bottom';bar.setAttribute('aria-label','Hlavní mobilní navigace');
var raw=document.querySelector('#header a.cart-count'),cart=raw&&raw.getAttribute('href');
var menuItems=[['home','Domů','/'],['catalog','Katalog',null],['cart','Košík',cart&&cart!=='#'?cart:'/kosik/'],['orders','Objednávky','/klient/'],['menu','Menu',null]];
menuItems.forEach(function(it){var a=n(it[2]?'a':'button','okm61-bottom-action'+(it[0]==='home'&&isHome()?' is-active':''));if(it[2])a.href=it[2];else{a.type='button';a.addEventListener('click',function(){drawer(it[0])})}a.setAttribute('aria-label',it[1]);a.append(svg(it[0]),n('span','',it[1]));bar.appendChild(a)});
document.body.appendChild(bar);
}
function drawer(kind){
var overlay=document.getElementById('okla-v61-drawer');if(!overlay){overlay=n('div');overlay.id='okla-v61-drawer';overlay.hidden=true;
var panel=n('div','okm61-drawer-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Navigace OKLA');
var head=n('div','okm61-drawer-head'),name=n('strong','','Katalog'),close=n('button','okm61-drawer-close');close.type='button';close.setAttribute('aria-label','Zavřít');close.appendChild(svg('close'));close.addEventListener('click',closeDrawer);head.append(name,close);
var body=n('div','okm61-drawer-body');panel.append(head,body);overlay.append(panel);overlay.addEventListener('click',function(e){if(e.target===overlay)closeDrawer()});document.body.append(overlay);overlay.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer()})}
var area=overlay.querySelector('.okm61-drawer-body');area.replaceChildren();overlay.querySelector('.okm61-drawer-head strong').textContent=kind==='menu'?'Menu':'Kategorie';
var grid=n('div','okm61-drawer-grid'),items=getCats();items.forEach(function(item,i){grid.appendChild(catTile(item,i))});area.appendChild(grid);
if(kind==='menu'){var links=[['Úvodní stránka','/'],['Košík',(document.querySelector('#header a.cart-count')||{}).getAttribute?.('href')||'/kosik/'],['Moje objednávky','/klient/']];links.forEach(function(l){var a=n('a','okm61-menu-item',l[0]);a.href=l[1];area.appendChild(a)})}
overlay.hidden=false;document.body.classList.add('okla-v61-locked');overlay.querySelector('.okm61-drawer-close').focus()
}
function closeDrawer(){var overlay=document.getElementById('okla-v61-drawer');if(overlay)overlay.hidden=true;document.body.classList.remove('okla-v61-locked')}
function correct(){header();if(!mq.matches){closeDrawer();return}nav();dots();categorySection();pauseSliders();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',correct,{once:true});else correct();
window.addEventListener('load',correct,{once:true});window.addEventListener('resize',correct,{passive:true});
setTimeout(correct,320);setTimeout(correct,1000);setTimeout(correct,2200);
})();

/* === public/legacy/v62/okla_recovery_v62.js / behavior only === */
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

/* === public/v91/behavior_v65.js / behavior only === */
/* OKLA V65 – all JS, mobile refinements and evidence hooks, native Shoptet actions preserved */
(function(){
'use strict';if(window.__oklaV65)return;window.__oklaV65=true;
const narrow=window.matchMedia('(max-width:767px)');

const NS='http://www.w3.org/2000/svg';
function svg(paths,cls){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');if(cls)s.classList.add(cls);paths.forEach(d=>{let p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});return s}
function fixSearch(){if(!narrow.matches)return;let form=document.querySelector('#okla-v61-header .okm61-search'),b=form&&form.querySelector('button[type=submit]');if(!b)return;
let old=b.querySelectorAll('svg');old.forEach(x=>{if(!x.classList.contains('okm65-search-svg'))x.remove()});
if(!b.querySelector('.okm65-search-svg'))b.prepend(svg(['M10.8 17.5a6.7 6.7 0 1 0 0-13.4 6.7 6.7 0 0 0 0 13.4Z','m15.9 15.9 4.7 4.7'],'okm65-search-svg'));
b.setAttribute('aria-label','Hledat');
}
function fixCart(){if(!narrow.matches)return;
document.querySelectorAll('main#content .okla-slider-shell .product .p-tools .btn-cart').forEach(btn=>{
if(!btn.querySelector('.okm65-cart-svg'))btn.prepend(svg(['M2.8 4.5H5l2.1 9.6a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6l1.2-6.3H6','M10 20h.01','M18 20h.01'],'okm65-cart-svg'));
});
}
function fixCategories(){if(!narrow.matches)return;document.querySelectorAll('#okla-v61-categories .okm61-category').forEach(el=>{
let name=(el.textContent||'').trim().toLocaleLowerCase('cs-CZ');if(/^(obchodní podmínky|ochrana osobních údajů|reklamace|doprava a platba|kontakt|o nás)$/.test(name)){el.remove()}
});}
let lastY=0,raf=0;
function updateScroll(){if(!narrow.matches){document.body.classList.remove('okla-v65-white-header');return}
let y=Math.max(0,window.scrollY||window.pageYOffset||0);
document.body.classList.toggle('okla-v65-white-header',y>40);
lastY=y;
}
function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;updateScroll()})}
function resetLegacy(){if(!narrow.matches)return;const old=document.getElementById('okla-m-header');if(old)old.style.setProperty('display','none','important');
document.querySelectorAll('#content .okla-slider-shell .okla-slider-viewport').forEach(v=>{
if(!v.dataset.okm65Paused){v.dataset.okm65Paused='1';v.dispatchEvent(new Event('mouseenter'))}
});
}
function init(){resetLegacy();fixSearch();fixCategories();fixCart();updateScroll()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('load',init,{once:true});
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',init,{passive:true});
setTimeout(init,250);setTimeout(init,800);setTimeout(init,1600);
window.oklaMobileV65Inspect=function(){
const h=document.querySelector('#okla-v61-header'),logo=h?.querySelector('.okm61-logo img'),search=h?.querySelector('button[type=submit]'),svgEl=h?.querySelector('svg.okm65-search-svg');
const track=document.querySelector('main#content .okla-slider-shell .okla-slider-track'),cards=track?Array.from(track.children).filter(x=>x.classList.contains('product')):[];
const rect=x=>x?.getBoundingClientRect();const tr=rect(track),c0=rect(cards[0]),c1=rect(cards[1]),p0=rect(cards[0]?.querySelector('.p')),p1=rect(cards[1]?.querySelector('.p'));
const top=rect(h),l=rect(logo),sb=rect(search),si=rect(svgEl);
const result={viewport:innerWidth,headerTop:top?.top??null,logoHeight:l?.height??null,searchIconOffset:sb&&si?Math.round((si.top+si.height/2-sb.top-sb.height/2)*10)/10:null,trackWidth:tr?.width??null,cardWidths:[c0?.width??null,c1?.width??null],innerCardWidths:[p0?.width??null,p1?.width??null],gapBetweenCards:c0&&c1?Math.round(c1.left-c0.right):null,whiteHeader:document.body.classList.contains('okla-v65-white-header'),noOverflow:document.documentElement.scrollWidth<=innerWidth+2,cartButtons:document.querySelectorAll('#content .okla-slider-shell .btn-cart').length};
return result;
};
})();

/* === public/v91/behavior_v66.js / behavior only === */
/* OKLA V66 — directional sticky header + fixed Shoptet product cards.
  Does NOT replace product forms or cart buttons. */
(function(){
'use strict';if(window.__oklaV66)return;window.__oklaV66=true;
const mobile=window.matchMedia('(max-width:767px)');

const body=document.body;
let y0=Math.max(0,window.scrollY||0),raf=0,visible=true;
function update(force){
 if(!mobile.matches){body.classList.remove('okla-v66-hide-header','okla-v66-show-header');return;}
 const y=Math.max(0,window.scrollY||window.pageYOffset||0),d=y-y0;
 const focus=document.activeElement,searching=focus&&focus.closest&&focus.closest('#okla-v61-header');
 if(y<24){visible=true;body.classList.remove('okla-v66-hide-header','okla-v66-show-header');}
 else {
  if(searching){visible=true}
  else if(d>5&&y>115){visible=false}
  else if(d< -4){visible=true}
  body.classList.toggle('okla-v66-hide-header',!visible);
  body.classList.toggle('okla-v66-show-header',visible);
 }
 y0=y;
}
function scrolling(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;update()})}
function constrainCards(){
 if(!mobile.matches)return;
 document.querySelectorAll('main#content .okla-slider-shell .product').forEach(function(product){
   const b=product.querySelector('.p-tools .btn-cart');
   if(b){
     b.style.setProperty('position','static','important');
     b.style.setProperty('float','none','important');
     b.style.setProperty('transform','none','important');
     b.style.setProperty('width','100%','important');
     b.style.setProperty('max-width','100%','important');
     b.style.setProperty('display','inline-flex','important');
     b.style.setProperty('visibility','visible','important');
     b.style.setProperty('opacity','1','important');
     if(b.dataset.okm66Accessible!=='1'){
      if(!b.getAttribute('aria-label'))b.setAttribute('aria-label','Do košíku');
      b.dataset.okm66Accessible='1';
     }
   }
 });
}
function init(){constrainCards();update(true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('scroll',scrolling,{passive:true});
window.addEventListener('resize',init,{passive:true});
window.addEventListener('load',init,{once:true});
window.addEventListener('focusin',update);
setTimeout(init,240);setTimeout(init,850);setTimeout(init,1700);
window.oklaMobileV66Inspect=function(){
 const rect=e=>e?e.getBoundingClientRect():null;
 const header=document.querySelector('#header'),track=document.querySelector('main#content .okla-slider-shell .okla-slider-track');
 const cards=track?Array.from(track.children).filter(e=>e.classList.contains('product')):[];
 const selectors=['.p','.prices','.price-final','.p-tools','.btn-cart'];
 const items=cards.slice(0,2).map(c=>{
 const card=rect(c),p=rect(c.querySelector('.p'));
 const descendants={};selectors.forEach(sel=>{let r=rect(c.querySelector(sel));descendants[sel]=r?{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right}:null});
 const button=descendants['.btn-cart'];
 return {card:{x:card?.x,width:card?.width,height:card?.height,right:card?.right},inner:p?{x:p.x,width:p.width,height:p.height,right:p.right}:null,descendants,
  cartContained:!!(card&&button&&button.x>=card.x-1&&button.right<=card.right+1)};
 });
 return {viewport:window.innerWidth,y:window.scrollY,headerHidden:body.classList.contains('okla-v66-hide-header'),headerWhite:body.classList.contains('okla-v66-show-header'),
  headerPosition:header?getComputedStyle(header).position:null,headerRect:rect(header)?{top:rect(header).top,bottom:rect(header).bottom,height:rect(header).height}:null,
  gridColumns:track?getComputedStyle(track).gridTemplateColumns:null,
  cardGap:items.length===2?Math.round((items[1].card.x)-(items[0].card.right)):null,
  horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+2,
  products:items};
};
})();

/* === public/legacy/v67/okla_native_cart_v67.js / behavior only === */
/* OKLA V67 – recover native Shoptet cart controls from inside constrained price panel.
   Nodes are moved, not cloned: Shoptet form listeners and native product actions remain intact. */
(function(){
'use strict';
if(window.__oklaV67)return;window.__oklaV67=true;
const mobile=window.matchMedia('(max-width:767px)');
let observer=null,scheduled=false;
function restoreNativeCart(){
 if(!mobile.matches)return;
 let fixed=0;
 document.querySelectorAll('main#content .okla-slider-shell .product .p-bottom').forEach(bottom=>{
  const prices=bottom.querySelector('.prices');
  if(!prices)return;
  const nested=prices.querySelector(':scope > .p-tools');
  if(nested){
    prices.after(nested); /* move the original DOM subtree with existing Shoptet form and listeners */
    fixed++;
  }
  const tools=bottom.querySelector(':scope > .p-tools');
  if(tools){
    tools.style.setProperty('position','static','important');
    tools.style.setProperty('float','none','important');
    tools.style.setProperty('width','100%','important');
    tools.style.setProperty('max-width','100%','important');
    tools.style.setProperty('transform','none','important');
    tools.style.setProperty('display','flex','important');
    tools.style.setProperty('visibility','visible','important');
    tools.style.setProperty('opacity','1','important');
  }
 });
 window.__oklaV67Moved=(window.__oklaV67Moved||0)+fixed;
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;restoreNativeCart()})}
function ready(){
 restoreNativeCart();
 if(!observer){const root=document.querySelector('main#content');if(root){observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true})}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
window.addEventListener('load',ready,{once:true});
window.addEventListener('resize',schedule,{passive:true});
setTimeout(ready,350);setTimeout(ready,1100);
window.oklaMobileV67Inspect=function(){
const d=window.oklaMobileV66Inspect?.()||{};
d.nativeCartMoved=window.__oklaV67Moved||0;
d.cartInPrices=document.querySelectorAll('main#content .okla-slider-shell .prices > .p-tools').length;
d.nativeCartInBottom=document.querySelectorAll('main#content .okla-slider-shell .p-bottom > .p-tools').length;
return d;
};
})();

/* === public/v91/behavior_v69.js / behavior only === */
/* OKLA mobile v69: original static, external header only on upward scroll */
(function(){'use strict';if(window.__oklaV69)return;window.__oklaV69=true;
var mq=matchMedia('(max-width:767px)');
var floating=null,lastY=Math.max(0,window.scrollY||0),direction='none';
function original(){return document.querySelector('#header #okla-v61-header')}
function create(){
if(!mq.matches||floating||!original()||!document.body)return;
var source=original().querySelector('.okm61-logo');if(!source)return;
floating=document.createElement('div');floating.id='okla-v69-floating';floating.setAttribute('aria-hidden','true');floating.inert=true;
var shell=document.createElement('div');shell.className='okm69-shell';
var row=document.createElement('div');row.className='okm69-logo-row';
var logo=document.createElement('a');logo.className='okm69-logo';logo.href=source.getAttribute('href')||'/';logo.setAttribute('aria-label','OKLA – úvodní stránka');
var originImg=source.querySelector('img');if(originImg){var img=document.createElement('img');img.src=originImg.currentSrc||originImg.src;img.alt=originImg.alt||'OKLA';logo.appendChild(img)}else logo.textContent=source.textContent||'OKLA';
row.appendChild(logo);
var originalForm=original().querySelector('.okm61-search form'),originalInput=originalForm&&originalForm.querySelector('input[name]');
var form=document.createElement('form');form.className='okm69-search';form.method='get';form.action=originalForm&&originalForm.getAttribute('action')||'/vyhledavani/';form.setAttribute('role','search');
var btn=document.createElement('button');btn.type='submit';btn.setAttribute('aria-label','Hledat');btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m15.9 15.9 4.7 4.7"/></svg>';
var input=document.createElement('input');input.type='search';input.name=originalInput&&originalInput.name||'string';input.placeholder=originalInput&&originalInput.placeholder||'Napište, co hledáte';input.setAttribute('aria-label','Vyhledat produkt');
form.append(btn,input);shell.append(row,form);floating.appendChild(shell);document.body.appendChild(floating)
}
function visible(show){if(!floating)return;floating.classList.toggle('okla-v69-visible',show);floating.setAttribute('aria-hidden',show?'false':'true');floating.inert=!show}
function update(){var y=Math.max(0,window.scrollY||window.pageYOffset||0),dy=y-lastY;lastY=y;
if(!mq.matches){visible(false);return}
if(!floating)create();var originalHeader=document.getElementById('header');
if(y<=2||(originalHeader&&originalHeader.getBoundingClientRect().bottom>0)){direction='top';visible(false);return}
if(dy>0){direction='down';visible(false)}else if(dy<0){direction='up';visible(true)}
}
function ready(){create();update()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
addEventListener('scroll',update,{passive:true});addEventListener('resize',ready,{passive:true});addEventListener('load',ready,{once:true});setTimeout(ready,300);setTimeout(ready,900);setTimeout(ready,2000);
window.oklaMobileV69Inspect=function(){var o=document.getElementById('header');return {mobile:mq.matches,scrollY:Math.round(scrollY),direction:direction,originalPosition:o?getComputedStyle(o).position:null,originalBottom:o?Math.round(o.getBoundingClientRect().bottom):null,floatingExists:!!floating,floatingVisible:!!(floating&&floating.classList.contains('okla-v69-visible')),horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2}}
})();

/* === public/v91/behavior_v71.js / behavior only === */
/* OKLA V71 mobile finishing layer, keeps full V68 page and native Shoptet product controls. */
(function(){'use strict';if(window.__oklaV71)return;window.__oklaV71=true;
const narrow=window.matchMedia('(max-width:767px)');
const NS='http://www.w3.org/2000/svg';
function svg(paths,cls){let s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.classList.add(cls);for(const d of paths){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)}return s}
function improveFloating(){if(!narrow.matches)return;
const root=document.querySelector('#okla-v69-floating');if(!root)return;
const button=root.querySelector('.okm69-search button');if(button&&!button.querySelector('svg'))button.appendChild(svg(['M10.8 17.5a6.7 6.7 0 1 0 0-13.4 6.7 6.7 0 0 0 0 13.4Z','m15.8 15.8 4.9 4.9'],'okv71-search-icon'));
const form=root.querySelector('form.okm69-search');if(form){form.method='get';form.action='/vyhledavani/'}
}
function fixProducts(){if(!narrow.matches)return;
document.querySelectorAll('#content .okla-slider-shell .product').forEach(product=>{
const bottom=product.querySelector('.p-bottom');if(!bottom)return;
const price=bottom.querySelector('.prices');if(!price)return;
const nested=price.querySelector(':scope > .p-tools');if(nested)price.after(nested);
const tools=bottom.querySelector(':scope > .p-tools');if(!tools)return;
const button=tools.querySelector('.btn-cart');if(!button)return;
if(!button.querySelector('.okv71-cart'))button.prepend(svg(['M3 4h2.3l2.1 11h10.2l2-7H6','M10 20h.01','M18 20h.01'],'okv71-cart'));
});}
function init(){improveFloating();fixProducts()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('load',init,{once:true});window.addEventListener('resize',init,{passive:true});
setTimeout(init,250);setTimeout(init,900);setTimeout(init,1700);
window.oklaV71Verify=function(){
const a=document.querySelector('#header'),float=document.querySelector('#okla-v69-floating'),logo=document.querySelector('#okla-v61-header .okm61-logo img'),track=document.querySelector('#content .okla-slider-shell .okla-slider-track');
const cards=Array.from(track?.children||[]).filter(x=>x.classList.contains('product')).slice(0,2).map(c=>{const x=c.getBoundingClientRect(),price=c.querySelector('.prices')?.getBoundingClientRect(),cart=c.querySelector('.btn-cart')?.getBoundingClientRect();return{width:x.width,cartContained:!!(cart&&cart.left>=x.left-1&&cart.right<=x.right+1),cartBelowPrice:!!(price&&cart&&cart.top>=price.bottom-1)}});
return{width:innerWidth,y:scrollY,originalHeaderPosition:a?getComputedStyle(a).position:null,floatingVisible:!!float?.classList.contains('okla-v69-visible'),logoHeight:logo?.getBoundingClientRect().height,cardWidths:cards.map(c=>c.width),cartContained:cards.every(c=>c.cartContained),cartBelowPrice:cards.every(c=>c.cartBelowPrice),noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+2,newsPresent:!!document.querySelector('#okla-news-v55'),catsPresent:!!document.querySelector('#okla-v61-categories')};
};
})();

/* === public/v91/behavior_v72.js / behavior only === */
/* OKLA V72 – incremental, mobile-only products and subtle Alza-like header gradient; all native cart handlers preserved. */
(function(){'use strict';if(window.__oklaV72)return;window.__oklaV72=true;var m=window.matchMedia('(max-width:767px)');
var NS='http://www.w3.org/2000/svg';
function cartIcon(){var s=document.createElementNS(NS,'svg');s.classList.add('okv72-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');['M3 4h2.5l2 11h10.2l2.2-7H6','M10 20h.01','M18 20h.01'].forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});return s}
function apply(){if(!m.matches)return;document.querySelectorAll('main#content .okla-slider-shell .product').forEach(function(product){var bottom=product.querySelector('.p-bottom');if(!bottom)return;var prices=bottom.querySelector('.prices');if(!prices)return;var nested=prices.querySelector(':scope > .p-tools');if(nested)prices.after(nested);var tools=bottom.querySelector(':scope > .p-tools');if(!tools)return;var button=tools.querySelector('.btn-cart');if(!button)return;if(!button.querySelector('.okv72-cart'))button.prepend(cartIcon());if(!button.getAttribute('aria-label'))button.setAttribute('aria-label','Do košíku')})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('load',apply,{once:true});window.addEventListener('resize',apply,{passive:true});setTimeout(apply,200);setTimeout(apply,700);setTimeout(apply,1500);
window.oklaV72Check=function(){var track=document.querySelector('#content .okla-slider-shell .okla-slider-track'),products=[...track?.children||[]].filter(x=>x.classList.contains('product')).slice(0,2);var cards=products.map(function(p){var r=p.getBoundingClientRect(),pr=p.querySelector('.prices')?.getBoundingClientRect(),btn=p.querySelector('.btn-cart')?.getBoundingClientRect();return{width:r.width,priceHeight:pr?.height||0,buttonHeight:btn?.height||0,buttonInside:!!(btn&&btn.left>=r.left-1&&btn.right<=r.right+1),belowPrice:!!(pr&&btn&&btn.top>=pr.bottom-1)}});return{viewport:innerWidth,logoHeight:document.querySelector('#okla-v61-header .okm61-logo img')?.getBoundingClientRect().height??null,cards,gridColumns:track?getComputedStyle(track).gridTemplateColumns:null,noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+2,newsExists:!!document.querySelector('#okla-news-v55'),categoriesExist:!!document.querySelector('#okla-v61-categories')}}})();

/* === public/v91/behavior_v73.js / behavior only === */
/* OKLA V73: gradient continuation, honest 5-star placeholders, remove warranty and exact duplicates. */
(function(){'use strict';if(window.__oklaV73)return;window.__oklaV73=true;
const MOBILE=window.matchMedia('(max-width:767px)');

const svgNS='http://www.w3.org/2000/svg';
function stars(){
const wrap=document.createElement('span');wrap.className='okv73-rating-stars';wrap.setAttribute('aria-hidden','true');
for(let i=0;i<5;i++){const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 24 24');const path=document.createElementNS(svgNS,'path');path.setAttribute('d','m12 2 3.1 6.3 6.9 1-5 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.9 6.9-1Z');svg.appendChild(path);wrap.appendChild(svg)}return wrap}
function fixRatings(){
if(!MOBILE.matches)return;
document.querySelectorAll('main#content .product').forEach(function(card){
let inner=card.querySelector('.p-in-in');if(!inner)return;
let name=inner.querySelector('a.name');if(!name)return;
let r=inner.querySelector('.ratings-wrapper');
if(!r){r=document.createElement('div');r.className='ratings-wrapper okla-ratings';name.before(r)}
if(r.querySelector('.okv73-rating-placeholder'))return;
/* Real Shoptet ratings take precedence; never replace a genuine rating. */
const real=r.querySelector('[itemprop="ratingValue"],[data-rating]:not(.stars-placeholder),.stars:not(.stars-placeholder),.stars-wrapper .star');
if(real)return;
const availability=r.querySelector('.availability');if(availability)name.after(availability);
r.replaceChildren();
const p=document.createElement('span');p.className='okv73-rating-placeholder';p.setAttribute('aria-label','Pět dekorativních hvězd; zatím bez zákaznických recenzí');
const c=document.createElement('span');c.className='okv73-rating-caption';c.textContent='Bez recenzí';p.append(stars(),c);r.append(p);
});
}
function removeWarranty(){
document.querySelectorAll('#okla-warranty-strip,.okla-warranty-strip').forEach(n=>n.remove());
}
function duplicate(id){let arr=Array.from(document.querySelectorAll('[id="'+id+'"]'));arr.slice(1).forEach(x=>x.remove())}
function deDupe(){
/* Only remove confirmed duplicates, never unique legal/footer blocks */
['okla-v61-bottom','okla-v61-categories','okla-v61-dots','okla-news-v55','okla-warranty-strip','okla-v69-floating'].forEach(duplicate);
if(document.querySelector('#okla-news-v55')){
document.querySelectorAll('main#content .homepage-blog-wrapper,main#content .homepage-blog,main#content .homepage-news,main#content .homepage-articles,main#content .homepage-blog-posts').forEach(x=>x.remove());
}
/* A second mobile fixed navigation with precisely identical five menu titles is a duplicate. */
if(MOBILE.matches){
const base=document.querySelector('#okla-v61-bottom');
if(base)document.querySelectorAll('body nav,body [role="navigation"]').forEach(el=>{
if(el===base||el.contains(base)||base.contains(el)||el.closest('#okla-v61-drawer')||el.id==='navigation')return;
const labels=(el.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();
if(!labels||!['domů katalog košík objednávky menu','domů katalog košík objednávky menu'].includes(labels))return;
if(getComputedStyle(el).position!=='fixed')return;
if(el.getBoundingClientRect().bottom>=innerHeight-85){el.remove()}
});
}
}
let pending=false;
function repair(){pending=false;removeWarranty();fixRatings();deDupe()}
function schedule(){if(!pending){pending=true;requestAnimationFrame(repair)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair,{once:true});else repair();
addEventListener('load',repair,{once:true});addEventListener('resize',schedule,{passive:true});
setTimeout(repair,300);setTimeout(repair,1050);setTimeout(repair,2400);
const root=document.querySelector('main#content')||document.body;
if(root){const obs=new MutationObserver(records=>{
for(const rec of records)if(rec.addedNodes.length){schedule();return}
});obs.observe(root,{childList:true,subtree:true})}
window.oklaV73Inspect=function(){
const rat=document.querySelectorAll('main#content .product .okv73-rating-placeholder').length;
return{mobile:MOBILE.matches,placeholderStars:rat,warrantyCount:document.querySelectorAll('#okla-warranty-strip,.okla-warranty-strip').length,news:document.querySelectorAll('#okla-news-v55').length,bottomNavs:document.querySelectorAll('#okla-v61-bottom').length,categories:document.querySelectorAll('#okla-v61-categories').length,duplicateIds:Array.from(document.querySelectorAll('[id]')).map(x=>x.id).filter((v,i,a)=>a.indexOf(v)!==i),noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+2}
};
})();

/* === public/v91/behavior_v74.js / behavior only === */
/* OKLA V74 — full stars, larger names, no unavailable notices, one global show-more, green cart glyphs, subtler right gradient. */
(function(){'use strict';if(window.__oklaV74)return;window.__oklaV74=true;
const mq=window.matchMedia('(max-width:767px)');
const NS='http://www.w3.org/2000/svg';
function svgIcon(){
const s=document.createElementNS(NS,'svg');s.classList.add('okv74-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
const path=document.createElementNS(NS,'path');path.setAttribute('d','M2.5 3.8h2.8l2.1 10.7a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1l1.9-7.3H6.1');s.appendChild(path);
for(let cx of [10,18]){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',String(cx));c.setAttribute('cy','20.3');c.setAttribute('r','1.7');s.appendChild(c)}return s}
function chevron(){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');const p=document.createElementNS(NS,'path');p.setAttribute('d','m6 9 6 6 6-6');s.appendChild(p);return s}
function allShells(){
return Array.from(document.querySelectorAll('main#content .okla-slider-shell'))
.filter(s=>s.querySelectorAll('.okla-slider-track > .product').length>4)}
function fixText(){
document.querySelectorAll('main#content .okla-slider-shell .product .availability,main#content .okla-slider-shell .product .stock,main#content .okla-slider-shell .product .availability-label').forEach(node=>{
const text=(node.textContent||'').replace(/\s+/g,' ').trim();
if(/momentálně\s+nedostupn|momentálně\s+není\s+skladem/i.test(text)){
node.classList.add('okv74-hide-unavailable');node.setAttribute('aria-hidden','true')
}});
}
function fixCart(){
document.querySelectorAll('main#content .okla-slider-shell .product').forEach(product=>{
const bottom=product.querySelector('.p-bottom'),prices=bottom?.querySelector('.prices');
if(!bottom||!prices)return;
const misplaced=prices.querySelector(':scope > .p-tools');if(misplaced)prices.after(misplaced);
const button=bottom.querySelector('.p-tools .btn-cart');if(!button)return;
if(!button.querySelector('svg.okv74-cart'))button.prepend(svgIcon());
});
}
function showMore(){
const shells=allShells(),main=document.querySelector('main#content');if(!main)return;
const old=document.getElementById('okla-v74-more');
if(!shells.length){if(old)old.remove();return}
let button=old;
if(!button){
button=document.createElement('button');button.type='button';button.id='okla-v74-more';
button.setAttribute('aria-expanded','false');
button.addEventListener('click',function(){
const next=button.getAttribute('aria-expanded')!=='true';
allShells().forEach(shell=>shell.classList.toggle('okm61-expanded',next));
button.setAttribute('aria-expanded',String(next));
const label=button.querySelector('.okv74-label');if(label)label.textContent=next?'Zobrazit méně':'Zobrazit další produkty';
});
const name=document.createElement('span');name.className='okv74-label';name.textContent='Zobrazit další produkty';
button.append(name,chevron())
}
const last=shells[shells.length-1];
if(last.nextElementSibling!==button)last.after(button);
}
function apply(){
if(!mq.matches)return;
fixText();fixCart();showMore()
}
let pending=false;
function schedule(){if(pending||!mq.matches)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('load',apply,{once:true});window.addEventListener('resize',apply,{passive:true});
setTimeout(apply,250);setTimeout(apply,900);setTimeout(apply,2000);
const root=document.querySelector('main#content')||document.body;
if(root){new MutationObserver(recs=>{if(recs.some(r=>r.addedNodes.length))schedule()}).observe(root,{childList:true,subtree:true})}
window.oklaV74Check=function(){
const shells=allShells(),cta=document.querySelectorAll('main#content .product .p-tools .btn-cart');
return{mobile:mq.matches,showMoreVisible:document.querySelectorAll('#okla-v74-more').length,legacyMoreVisible:[...document.querySelectorAll('.okm61-product-more')].filter(el=>getComputedStyle(el).display!=='none').length,
unavailableVisible:[...document.querySelectorAll('main#content .product .availability')].filter(x=>/momentálně nedostupn/i.test(x.textContent||'')&&getComputedStyle(x).display!=='none').length,
greenCartIcons:[...cta].filter(x=>!!x.querySelector('svg.okv74-cart')).length,cartButtons:cta.length,
ratingPlaceholders:document.querySelectorAll('main#content .product .okv73-rating-stars').length,
warranty:document.querySelectorAll('#okla-warranty-strip').length,
expanded:shells.filter(x=>x.classList.contains('okm61-expanded')).length,news:document.querySelectorAll('#okla-news-v55').length};
};
})();
