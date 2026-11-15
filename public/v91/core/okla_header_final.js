/* OKLA V101 – replace the legacy filled search icon with one crisp SVG.
   Keeps Shoptet's original submit button, so native search still works. */
(function(){
 'use strict';
 if(window.__oklaSearchVectorV101)return;
 window.__oklaSearchVectorV101=true;
 var media=window.matchMedia('(min-width:768px)');
 var ns='http://www.w3.org/2000/svg';
 function icon(){
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('class','okla-search-vector');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('width','22');
  svg.setAttribute('height','22');
  svg.setAttribute('focusable','false');
  svg.setAttribute('aria-hidden','true');
  var circle=document.createElementNS(ns,'circle');
  circle.setAttribute('cx','10.4');
  circle.setAttribute('cy','10.4');
  circle.setAttribute('r','6.8');
  var path=document.createElementNS(ns,'path');
  path.setAttribute('d','M15.5 15.5 20.9 20.9');
  svg.append(circle,path);
  return svg;
 }
 function install(){
  if(!media.matches)return; // Neither of the two mobile header modes is modified.
  var btn=document.querySelector('#header .header-top > .search form.search-form button[type="submit"]');
  if(!btn)return;
  btn.setAttribute('aria-label','Hledat');
  if(btn.querySelector(':scope > svg.okla-search-vector'))return;
  btn.appendChild(icon());
 }
 var queued=false;
 function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(function(){queued=false;install()});
 }
 function start(){
  schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('pageshow',schedule);
  if(media.addEventListener)media.addEventListener('change',schedule);
  [300,1000,2200].forEach(function(t){setTimeout(schedule,t)});
  var header=document.querySelector('#header .header-top');
  if(header&&window.MutationObserver){
   var observer=new MutationObserver(function(changes){
    for(var i=0;i<changes.length;i++){
     if(changes[i].type!=='childList')continue;
     for(var j=0;j<changes[i].addedNodes.length;j++){
      var node=changes[i].addedNodes[j];
      if(node.nodeType!==1)continue;
      if(node.classList&&node.classList.contains('okla-search-vector'))continue;
      if(node.matches&&node.matches('.search,.search-form,button[type="submit"]')){schedule();return}
      if(node.querySelector&&node.querySelector('.search-form,button[type="submit"]')){schedule();return}
     }
    }
   });
   observer.observe(header,{childList:true,subtree:true});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
