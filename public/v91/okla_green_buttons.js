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
function scan(node){
 if(!node||node.nodeType!==1)return;
 mark(node);
 if(node.querySelectorAll)node.querySelectorAll(selector).forEach(mark);
}
function start(){
 scan(document.body);
 window.addEventListener('load',function(){scan(document.body)},{once:true});
 document.addEventListener('pointerover',function(e){
  var el=e.target&&e.target.closest&&e.target.closest(selector);
  if(el)mark(el);
 },{passive:true});
 if(!window.MutationObserver)return;
 var observer=new MutationObserver(function(mutations){
  for(var i=0;i<mutations.length;i++){
   var m=mutations[i];
   if(m.type==='attributes'){mark(m.target);continue;}
   for(var j=0;j<m.addedNodes.length;j++)scan(m.addedNodes[j]);
  }
 });
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();
