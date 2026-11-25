/* Okla – phones inside Safari/Chrome, private mode and in-app WebViews (Instagram, Facebook, etc.).
   Their browser chrome changes the visual viewport without always changing CSS 100vh. Publish the actually visible
   height as a CSS variable, keep safe-area support enabled and mark the software-keyboard state. Layout only: native
   scrolling, forms and browser history remain untouched. */
(function(){
 'use strict';
 if(window.__oklaMobileViewport)return;window.__oklaMobileViewport=true;
 var root=document.documentElement,vv=window.visualViewport,raf=0,maxHeight=0;
 function editable(el){return !!(el&&el.matches&&el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select,[contenteditable="true"]'))}
 function viewportMeta(){
  var m=document.querySelector('meta[name="viewport"]');if(!m)return;
  var c=m.getAttribute('content')||'';if(!/viewport-fit\s*=/.test(c))m.setAttribute('content',(c?c+', ':'')+'viewport-fit=cover');
 }
 function measure(){
  raf=0;
  if(!matchMedia('(max-width:767px)').matches){root.classList.remove('okla-vv-ready','okla-vv-keyboard');return}
  var h=Math.max(1,Math.round(vv&&vv.height||window.innerHeight||root.clientHeight));
  var w=Math.max(1,Math.round(vv&&vv.width||window.innerWidth||root.clientWidth));
  if(!editable(document.activeElement)&&h>maxHeight)maxHeight=h;
  var keyboard=editable(document.activeElement)&&maxHeight>0&&h<maxHeight-120;
  root.style.setProperty('--okla-vv-height',h+'px');
  root.style.setProperty('--okla-vv-width',w+'px');
  root.classList.toggle('okla-vv-keyboard',keyboard);
  root.classList.add('okla-vv-ready');
 }
 function schedule(){if(raf)return;raf=requestAnimationFrame(measure)}
 viewportMeta();measure();
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',function(){maxHeight=0;setTimeout(schedule,80)},{passive:true});
 document.addEventListener('focusin',function(){setTimeout(schedule,60)},true);
 document.addEventListener('focusout',function(){setTimeout(schedule,180)},true);
 document.addEventListener('visibilitychange',schedule,{passive:true});
 if(vv){vv.addEventListener('resize',schedule,{passive:true});vv.addEventListener('scroll',schedule,{passive:true})}
})();
