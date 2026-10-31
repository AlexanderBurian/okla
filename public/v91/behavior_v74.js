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