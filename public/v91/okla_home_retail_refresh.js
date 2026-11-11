/* Presentation hook for the isolated homepage retail refresh. */
(function(){
 'use strict';
 if(window.__oklaHomeRetailRefresh)return;window.__oklaHomeRetailRefresh=true;
 function apply(){
  var section=document.getElementById('okla-v61-categories');
  if(!section)return false;
  section.querySelectorAll('.okla-retail-category-title').forEach(function(heading){heading.remove()});
  return true;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 window.addEventListener('load',apply,{once:true});
 var tries=0,timer=setInterval(function(){if(apply()||++tries>20)clearInterval(timer)},120);
})();
