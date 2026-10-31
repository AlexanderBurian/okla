/* OKLA V74 — full stars, larger names, no unavailable notices, one global show-more, green cart glyphs, subtler right gradient. */
(function(){'use strict';if(window.__oklaV74)return;window.__oklaV74=true;
const mq=window.matchMedia('(max-width:767px)'),style=document.createElement('style');style.id='okla-v74-styles';style.textContent="\n@media(max-width:767px){\n/* Softer upper-right header gradient, with a gentle continuation by the categories. */\nhtml body #header #okla-v61-header,\nhtml body.okla-v65-white-header #header #okla-v61-header,\nhtml body.okla-v66-show-header #header #okla-v61-header,\nhtml body.okla-v66-hide-header #header #okla-v61-header{\nbackground:linear-gradient(103deg,rgba(210,234,247,.43) 0%,rgba(231,245,251,.23) 33%,rgba(247,252,254,.06) 66%,rgba(255,255,255,0) 82%),#fff!important;\nbox-shadow:none!important}\nhtml body.type-index #content-wrapper main#content{\nbackground:radial-gradient(ellipse 135% 660px at -16% -4%,rgba(211,234,248,.32) 0%,rgba(234,246,252,.14) 43%,rgba(255,255,255,0) 85%) top left/100% 900px no-repeat,#fff!important}\n/* The five stars are decorative placeholders, not product review ratings. */\nbody.type-index #content .product .okv73-rating-stars svg{\nfill:#f3b91d!important;stroke:#f3b91d!important;stroke-width:1.2!important;\nwidth:14px!important;height:14px!important;flex-basis:14px!important}\nbody.type-index #content .product .okv73-rating-stars{gap:1px!important}\nbody.type-index #content .product .okv73-rating-placeholder{gap:5px!important}\nbody.type-index #content .product .okv73-rating-caption{color:#7d8998!important;font-size:9px!important}\n/* Larger titles while keeping two line clamp and matched grid heights. */\nbody.type-index #content .okla-slider-shell .product a.name{\ndisplay:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;\nflex:0 0 48px!important;width:100%!important;min-height:48px!important;height:48px!important;\nmax-height:48px!important;line-height:23px!important;font-size:14.3px!important;\nfont-weight:550!important;overflow:hidden!important;margin:0 0 4px!important}\n/* Unavailable notices are removed without hiding stock information. */\nbody.type-index #content .product .okv74-hide-unavailable{display:none!important}\n/* Suppress duplicate older mobile show-more controls. One functional global action replaces them. */\nbody.type-index #content .okm61-product-more,\nbody.type-index #content .okm65-product-more,\nbody.type-index #content .okla-slider-show-more{display:none!important}\nbody.type-index #content #okla-v74-more{\ndisplay:flex!important;align-items:center!important;justify-content:center!important;\ngap:7px!important;width:100%!important;min-height:42px!important;margin:12px 0 25px!important;\npadding:9px 12px!important;border:0!important;border-radius:4px!important;\nbackground:transparent!important;color:#125e97!important;font:700 13px/1.35 Roboto,Arial,sans-serif!important;\ntext-align:center!important;cursor:pointer!important}\nbody.type-index #content #okla-v74-more svg{display:block!important;width:16px!important;height:16px!important;stroke:currentColor!important;stroke-width:2!important;fill:none!important}\nbody.type-index #content #okla-v74-more:hover{background:#f2f8ff!important}\n/* Explicit green SVG for every existing native Shoptet add-to-cart button. */\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart{\ndisplay:inline-flex!important;align-items:center!important;justify-content:center!important;\ngap:8px!important;min-height:48px!important;height:48px!important;\npadding:0 3px!important;color:#6a9900!important;background:#fff!important;\nbackground-image:none!important;white-space:nowrap!important}\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart svg.okv74-cart{\ndisplay:block!important;position:static!important;flex:0 0 21px!important;\nwidth:21px!important;min-width:21px!important;height:21px!important;\nmargin:0!important;padding:0!important;fill:none!important;stroke:currentColor!important;\nstroke-width:2.1!important;stroke-linecap:round!important;stroke-linejoin:round!important}\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart svg.okv74-cart circle{\nfill:currentColor!important;stroke:none!important}\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart svg.okv72-cart,\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart svg.okv71-cart,\nbody.type-index #content .okla-slider-shell .product .p-tools .btn-cart svg.okm65-cart-svg{display:none!important}\n}";(document.head||document.documentElement).appendChild(style);
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