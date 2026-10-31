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