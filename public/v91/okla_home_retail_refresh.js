/* Presentation hook for the isolated homepage retail refresh. */
(function(){
 'use strict';
 if(window.__oklaHomeRetailRefresh)return;window.__oklaHomeRetailRefresh=true;
 function language(){
  var cookie=(document.cookie.match(/(?:^|;\s*)okla-lang=(\w+)/)||[])[1];
  return window.OKLA_LANG||cookie||(document.documentElement.lang||'cs').slice(0,2);
 }
 function apply(){
  var section=document.getElementById('okla-v61-categories');
  if(!section||section.querySelector('.okla-retail-category-title'))return !!section;
  var labels={cs:'Kategorie',sk:'Kategórie',en:'Categories',hu:'Kategóriák'};
  var heading=document.createElement('h2');heading.className='okla-retail-category-title';heading.textContent=labels[language()]||labels.cs;
  section.insertBefore(heading,section.firstChild);return true;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 window.addEventListener('load',apply,{once:true});
 var tries=0,timer=setInterval(function(){if(apply()||++tries>20)clearInterval(timer)},120);
})();
