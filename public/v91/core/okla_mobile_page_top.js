/* Okla – product page on phones: the product title moves above the main image (as on big shops), aligned with the
   breadcrumbs; on wider screens it goes back to its own place in the info column. Styles in okla_mobile_page_top.css. */
(function(){
 'use strict';
 if(window.__oklaMobilePageTop)return;window.__oklaMobilePageTop=true;
 var PHONE=window.matchMedia('(max-width:767px)');
 var home=null,shiftAt=-1,queued=false;
 function placeTitle(){
  queued=false;
  var head=document.querySelector('#content .p-detail .p-detail-inner-header');
  var top=document.querySelector('#content .p-detail .product-top');
  var imgs=top&&top.querySelector(':scope > .p-image-wrapper');
  if(!head||!top||!imgs)return;
  if(!home&&!head.classList.contains('okla-m-title-top'))home={parent:head.parentElement,next:head.nextElementSibling};
  if(PHONE.matches){
   if(head.parentElement!==top||head.nextElementSibling!==imgs){top.insertBefore(head,imgs);head.classList.add('okla-m-title-top')}
   /* the breadcrumbs start further left than the product column; measured once per width */
   var bc=document.querySelector('.breadcrumbs');
   if(bc&&shiftAt!==innerWidth){var shift=Math.round(bc.getBoundingClientRect().left-top.getBoundingClientRect().left);head.style.setProperty('--okla-m-title-shift',Math.min(0,shift)+'px');shiftAt=innerWidth}
  }else if(home&&head.classList.contains('okla-m-title-top')){
   home.parent.insertBefore(head,home.next&&home.next.parentElement===home.parent?home.next:home.parent.firstChild);
   head.classList.remove('okla-m-title-top');head.style.removeProperty('--okla-m-title-shift');
  }
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(placeTitle)}}
 function start(){
  var b=document.body;if(!b||!b.classList.contains('type-detail'))return;
  placeTitle();
  window.addEventListener('load',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  if(PHONE.addEventListener)PHONE.addEventListener('change',schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
