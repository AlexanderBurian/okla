/* OKLA V91: identify genuinely green action buttons, including controls
   inserted after page load. The marker remains stable after the final palette
   changes their computed colour from green to OKLA blue. */
(function(){
'use strict';
if(window.__oklaGreenCtaV91)return;
window.__oklaGreenCtaV91=true;
var selector='button,a.btn,a[class*="button"],input[type="submit"],input[type="button"],[role="button"]';
function isGreen(bg){
 var nums=(bg||'').match(/[0-9.]+/g);
 if(!nums||nums.length<3)return false;
 var r=+nums[0],g=+nums[1],b=+nums[2];
 // Visible bright or medium green buttons, not turquoise, grey or blue.
 return g>=110&&g>r*1.23&&g>b*1.36&&r<180&&b<125;
}
function mark(el){
 if(!el||el.nodeType!==1||!el.matches||!el.matches(selector))return;
 var bg=getComputedStyle(el).backgroundColor;
 var green=isGreen(bg);
 if(green&&!el.classList.contains('okla-green-cta'))
  el.classList.add('okla-green-cta');
}
/* Marks many controls at once: their colours are read for a whole round, then the markers are written, so the page's
   styles are recomputed once per round instead of once per control. A marker can only affect controls nested inside
   the marked one, so a nested control is read in a later round - the same values the one-by-one pass read. */
function markAll(list){
 /* a control that already carries the marker keeps it (it is never removed): nothing to read */
 list=list.filter(function(b){return !b.classList.contains('okla-green-cta')});
 var waiting=new Set(list);
 while(list.length){
  var round=[],rest=[];
  for(var i=0;i<list.length;i++){
   var b=list[i],p=b.parentElement,blocked=false;
   while(p){if(waiting.has(p)){blocked=true;break;}p=p.parentElement;}
   (blocked?rest:round).push(b);
  }
  var bgs=round.map(function(b){return getComputedStyle(b).backgroundColor});
  for(var k=0;k<round.length;k++){
   waiting.delete(round[k]);
   if(isGreen(bgs[k])&&!round[k].classList.contains('okla-green-cta'))round[k].classList.add('okla-green-cta');
  }
  list=rest;
 }
}
function collect(node,out,seen){
 if(!node||node.nodeType!==1)return;
 if(!seen.has(node)&&node.matches&&node.matches(selector)){seen.add(node);out.push(node)}
 if(node.querySelectorAll)node.querySelectorAll(selector).forEach(function(b){if(!seen.has(b)){seen.add(b);out.push(b)}});
}
function scan(node){var out=[];collect(node,out,new Set());markAll(out)}
function start(){
 scan(document.body);
 window.addEventListener('load',function(){scan(document.body)},{once:true});
 document.addEventListener('pointerover',function(e){
  var el=e.target&&e.target.closest&&e.target.closest(selector);
  if(el)mark(el);
 },{passive:true});
 if(!window.MutationObserver)return;
 var observer=new MutationObserver(function(mutations){
  var out=[],seen=new Set();
  for(var i=0;i<mutations.length;i++){
   var m=mutations[i];
   if(m.type==='attributes'){var t=m.target;if(t&&t.nodeType===1&&!seen.has(t)&&t.matches&&t.matches(selector)){seen.add(t);out.push(t)}continue;}
   for(var j=0;j<m.addedNodes.length;j++)collect(m.addedNodes[j],out,seen);
  }
  if(out.length)markAll(out);
 });
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();
