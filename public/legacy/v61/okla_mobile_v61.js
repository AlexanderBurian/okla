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