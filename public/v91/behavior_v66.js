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