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