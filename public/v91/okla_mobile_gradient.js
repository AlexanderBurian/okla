/* OKLA – mobile page-top gradient, product detail: end the gradient exactly
   where the white product block (.p-detail) starts, like the big shops do.
   Writes the document offset of that edge into --okla-mg-h (see
   okla_mobile_gradient.css) and keeps it right when the header, breadcrumbs,
   fonts or translations change the layout above it. */
(function(){
 'use strict';
 if(window.__oklaMobileGradientV1)return;window.__oklaMobileGradientV1=true;
 var PHONE=window.matchMedia('(max-width:767px)');
 var root=document.documentElement,last=-1,queued=false;
 function edge(){
  var b=document.body;if(!b||!b.classList.contains('type-detail'))return null;
  var white=document.querySelector('#content .p-detail');if(!white)return null;
  return Math.max(0,Math.round(white.getBoundingClientRect().top+window.scrollY));
 }
 function apply(){
  queued=false;
  if(!PHONE.matches){if(last!==-1){root.style.removeProperty('--okla-mg-h');last=-1}return}
  var y=edge();if(y==null||y===last)return;
  last=y;root.style.setProperty('--okla-mg-h',y+'px');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply)}}
 function start(){
  apply();
  [300,1000,2500].forEach(function(t){setTimeout(schedule,t)});
  window.addEventListener('load',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  if(PHONE.addEventListener)PHONE.addEventListener('change',schedule);
  if(window.ResizeObserver){
   var ro=new ResizeObserver(schedule);
   ['#header','.breadcrumbs','.breadcrumbs-wrapper','#content'].forEach(function(s){var n=document.querySelector(s);if(n)ro.observe(n)});
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
