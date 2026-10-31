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