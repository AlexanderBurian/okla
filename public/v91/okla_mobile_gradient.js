/* OKLA – mobile page top on the homepage, product detail and category pages (as on big shops):
   1. The product title (with its share button) moves above the main image,
      so the page top has room for the gradient. On wider screens it goes
      back to its original place in the info column.
   2. The page-top gradient fades out gradually and reaches pure white
      exactly where the page's own UI starts: the category tiles under the
      homepage banner, the stats under the About hero, the white main image (.p-image) on a product, the sorting tabs on a category (or the empty-category
      card / product grid when there is no sorting). This script measures
      that edge into --okla-mg-h, anchors the layer to the document with
      html.okla-mg-anchored (see okla_mobile_gradient.css)
      and keeps it right when fonts, translations or the header change the
      layout above it. */
(function(){
 'use strict';
 if(window.__oklaMobileGradientV3)return;window.__oklaMobileGradientV3=true;
 var PHONE=window.matchMedia('(max-width:767px)');
 var root=document.documentElement,last=-1,queued=false,home=null;
 function isDetail(){var b=document.body;return !!b&&b.classList.contains('type-detail')}
 function isAbout(){var b=document.body;return !!b&&(b.classList.contains('in-o-nas')||!!document.querySelector('.okla-about .oka-stats'))}
 function isHome(){var b=document.body;return !!b&&b.classList.contains('type-index')}
 function isCategory(){var b=document.body;return !!b&&b.classList.contains('type-category')}
 function visible(n){if(!n)return false;var r=n.getBoundingClientRect();return r.width>0&&r.height>0}
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
 /* 2 – gradient end = where the page's own UI starts */
 function edgeNode(){
  if(isDetail())return document.querySelector('#content .p-detail .p-image-wrapper .p-image')||document.querySelector('#content .p-detail .p-image-wrapper');
  if(isAbout()){var stats=document.querySelector('.okla-about .oka-stats');if(visible(stats))return stats}
  if(isHome()){var tiles=document.querySelector('#okla-v61-categories');if(visible(tiles))return tiles}
  if(isCategory()){
   var list=['#content .listSorting','#content .empty-content-category','#content #products','#content .category-content-wrapper'];
   for(var i=0;i<list.length;i++){var n=document.querySelector(list[i]);if(visible(n))return n}
  }
  return null;
 }
 function edge(){var n=edgeNode();return n?Math.max(0,Math.round(n.getBoundingClientRect().top+window.scrollY)):null}
 function reset(){if(last!==-1){root.style.removeProperty('--okla-mg-h');last=-1}root.classList.remove('okla-mg-anchored')}
 function apply(){
  queued=false;
  if(isDetail())placeTitle();
  if(!PHONE.matches){reset();return}
  var y=edge();if(y==null){reset();return}
  root.classList.add('okla-mg-anchored');
  if(y===last)return;
  last=y;root.style.setProperty('--okla-mg-h',y+'px');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply)}}
 function start(){
  if(!isDetail()&&!isCategory()&&!isHome()&&!isAbout())return;
  apply();
  [300,1000,2500].forEach(function(t){setTimeout(schedule,t)});
  window.addEventListener('load',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  if(PHONE.addEventListener)PHONE.addEventListener('change',schedule);
  if(window.ResizeObserver){
   var ro=new ResizeObserver(schedule);
   ['#header','.breadcrumbs','#content .p-detail-inner-header','#content .p-detail','#content .category-top','#content .category-perex','#content .listSorting','.okla-hero-wrap','#okla-v61-categories','.okla-about .oka-hero'].forEach(function(s){var n=document.querySelector(s);if(n)ro.observe(n)});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
