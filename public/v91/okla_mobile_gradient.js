/* OKLA – mobile product detail top (as on big shops):
   1. The product title (with its share button) moves above the main image,
      so the page top has room for the gradient. On wider screens it goes
      back to its original place in the info column.
   2. The page-top gradient fades out gradually and reaches pure white
      exactly at the upper edge of the white main image (.p-image). This
      script measures that edge into --okla-mg-h (see okla_mobile_gradient.css)
      and keeps it right when fonts, translations or the header change the
      layout above it. */
(function(){
 'use strict';
 if(window.__oklaMobileGradientV2)return;window.__oklaMobileGradientV2=true;
 var PHONE=window.matchMedia('(max-width:767px)');
 var root=document.documentElement,last=-1,queued=false,home=null;
 function isDetail(){var b=document.body;return !!b&&b.classList.contains('type-detail')}
 /* 1 – title above the image on phones */
 function placeTitle(){
  var head=document.querySelector('#content .p-detail .p-detail-inner-header');
  var top=document.querySelector('#content .p-detail .product-top');
  var imgs=top&&top.querySelector(':scope > .p-image-wrapper');
  if(!head||!top||!imgs)return;
  if(!home&&!head.classList.contains('okla-m-title-top'))home={parent:head.parentElement,next:head.nextElementSibling};
  if(PHONE.matches){
   if(head.parentElement!==top||head.nextElementSibling!==imgs){top.insertBefore(head,imgs);head.classList.add('okla-m-title-top')}
   /* align the title with the breadcrumbs (they start further left than the product column) */
   var bc=document.querySelector('.breadcrumbs');
   if(bc){var shift=Math.round(bc.getBoundingClientRect().left-top.getBoundingClientRect().left);head.style.setProperty('--okla-m-title-shift',Math.min(0,shift)+'px')}
  }else if(home&&head.classList.contains('okla-m-title-top')){
   home.parent.insertBefore(head,home.next&&home.next.parentElement===home.parent?home.next:home.parent.firstChild);
   head.classList.remove('okla-m-title-top');head.style.removeProperty('--okla-m-title-shift');
  }
 }
 /* 2 – gradient end = top of the white main image */
 function edge(){
  var white=document.querySelector('#content .p-detail .p-image-wrapper .p-image')||document.querySelector('#content .p-detail .p-image-wrapper');
  if(!white)return null;
  return Math.max(0,Math.round(white.getBoundingClientRect().top+window.scrollY));
 }
 function apply(){
  queued=false;
  if(!isDetail())return;
  placeTitle();
  if(!PHONE.matches){if(last!==-1){root.style.removeProperty('--okla-mg-h');last=-1}return}
  var y=edge();if(y==null||y===last)return;
  last=y;root.style.setProperty('--okla-mg-h',y+'px');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply)}}
 function start(){
  if(!isDetail())return;
  apply();
  [300,1000,2500].forEach(function(t){setTimeout(schedule,t)});
  window.addEventListener('load',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  if(PHONE.addEventListener)PHONE.addEventListener('change',schedule);
  if(window.ResizeObserver){
   var ro=new ResizeObserver(schedule);
   ['#header','.breadcrumbs','#content .p-detail-inner-header','#content .p-detail'].forEach(function(s){var n=document.querySelector(s);if(n)ro.observe(n)});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
