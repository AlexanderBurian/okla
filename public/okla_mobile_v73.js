/* OKLA V73: gradient continuation, honest 5-star placeholders, remove warranty and exact duplicates. */
(function(){'use strict';if(window.__oklaV73)return;window.__oklaV73=true;
const MOBILE=window.matchMedia('(max-width:767px)');
const style=document.createElement('style');style.id='okla-v73-styles';style.textContent="\n/* V73 — keep warranty hidden on all breakpoints, all other content intact */\n#content #okla-warranty-strip,#content .okla-warranty-strip,\n#content .okla-warranty-carousel,#content .okla-warranty-intro,\n#content .okla-warranty-cards{display:none!important}\n@media(max-width:767px){\n/* wide, very soft background that gently reaches the first rows of categories */\nhtml body #header #okla-v61-header,\nhtml body.okla-v65-white-header #header #okla-v61-header,\nhtml body.okla-v66-show-header #header #okla-v61-header{\nbackground:radial-gradient(ellipse 125% 480px at -13% -30%,rgba(202,231,247,.52) 0%,rgba(232,246,250,.34) 47%,rgba(255,255,255,0) 95%),#fff!important;\nbox-shadow:none!important\n}\nhtml body.type-index #content-wrapper main#content{\nbackground:radial-gradient(ellipse 145% 660px at -11% 0%,rgba(207,234,247,.35) 0%,rgba(234,247,252,.20) 46%,rgba(255,255,255,0) 92%) top left/100% 900px no-repeat,#fff!important\n}\n#content #okla-v61-dots,#content #okla-v61-categories{background:transparent!important}\n/* Ratings sit consistently above product title, without inventing genuine reviews */\nbody.type-index #content .okla-slider-shell .product .ratings-wrapper{\ndisplay:flex!important;align-items:center!important;justify-content:center!important;\nflex:0 0 22px!important;width:100%!important;min-width:0!important;min-height:22px!important;height:22px!important;\nmax-height:22px!important;gap:3px!important;padding:0!important;margin:0 0 6px!important;overflow:hidden!important\n}\nbody.type-index #content .product .okv73-rating-placeholder{\ndisplay:inline-flex!important;align-items:center!important;justify-content:center!important;\ngap:5px!important;width:100%!important;max-width:100%!important;min-width:0!important;\ncolor:#8a95a3!important;font:400 9px/15px Roboto,Arial,sans-serif!important;\nwhite-space:nowrap!important;overflow:hidden!important\n}\nbody.type-index #content .product .okv73-rating-stars{\ndisplay:inline-flex!important;align-items:center!important;justify-content:center!important;\ngap:1px!important;flex:0 0 auto!important\n}\nbody.type-index #content .product .okv73-rating-stars svg{\ndisplay:block!important;width:13px!important;height:13px!important;flex:0 0 13px!important;\nstroke:#ecad12!important;fill:none!important;stroke-width:1.55!important\n}\nbody.type-index #content .product .okv73-rating-caption{font-size:9px!important;white-space:nowrap!important}\n#content .homepage-blog-wrapper,#content .homepage-blog,#content .homepage-news,#content .homepage-articles,#content .homepage-blog-posts{\ndisplay:none!important\n}\n}\n";(document.head||document.documentElement).appendChild(style);
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