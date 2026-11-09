/* OKLA – kill the washed-out grey texts. Shoptet scatters many greyish text
   colours around (#4d4d4d body copy, #767676 links, #636b75 breadcrumbs, #888
   captions, #9ba5b0 …). This pass finds every element whose *own* text is a low
   -saturation grey and repaints it: the prominent greys to a strong near-black,
   the lighter ones to a softer black, so the page reads crisp but keeps a mild
   hierarchy. Brand colours (blue links, green stock, red prices) are untouched
   because they are not grey, and controls / widgets / the price-slider label are
   skipped on purpose. */
(function(){
 'use strict';
 if(window.__oklaTextContrast)return;window.__oklaTextContrast=true;

 var BLACK='#1a1a1a';   /* prominent grey -> near-black            */
 var SOFT ='#555555';   /* lighter grey   -> weaker ("slabší") black */

 /* A colour counts as grey when R,G,B are close together (low saturation) and
    the brightness is neither almost-black (already fine) nor near-white. */
 function grey(r,g,b){
  var mx=Math.max(r,g,b),mn=Math.min(r,g,b),lum=(r+g+b)/3;
  return (mx-mn)<=30 && lum>=70 && lum<=215 ? lum : -1;
 }

 /* Leave form controls, buttons, icons, the chatbot/cart widgets and the
    deliberate light "CENA" slider label exactly as they are. */
 function skip(e){
  return e.closest('input,textarea,select,option,button,.btn,.unveil-button,[contenteditable],svg,'
   +'okla-ai-chat,#okla-cart-drawer,#okla-cart-preview,.slider-wrapper h4,[class*="placeholder"]')!=null;
 }

 function paint(root){
  var els=(root||document.body).querySelectorAll('*');
  for(var i=0;i<els.length;i++){
   var e=els[i];
   if(e.__oktc)continue;
   var tag=e.tagName;
   if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT'||tag==='SVG'||tag==='PATH')continue;
   /* needs its own visible text, not just child elements */
   var has=false,n;for(n=e.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&n.textContent.trim().length>1){has=true;break;}}
   if(!has){continue;}
   if(skip(e)){e.__oktc=1;continue;}
   var m=getComputedStyle(e).color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
   if(!m){e.__oktc=1;continue;}
   var a=m[4]===undefined?1:+m[4];
   if(a<0.4){e.__oktc=1;continue;}
   var lum=grey(+m[1],+m[2],+m[3]);
   if(lum<0){e.__oktc=1;continue;}
   e.style.setProperty('color', lum<140?BLACK:SOFT, 'important');
   e.__oktc=1;
  }
 }

 var queued=false;
 function run(){paint(document);}
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;run();});}

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run,{once:true});
 [300,900,2000].forEach(function(t){setTimeout(run,t);});

 /* Repaint freshly injected content (AJAX filter results, lazy sections). We
    observe node additions only — never attributes — so our own colour writes
    do not retrigger the pass. */
 try{
  new MutationObserver(function(recs){
   for(var i=0;i<recs.length;i++){if(recs[i].addedNodes&&recs[i].addedNodes.length){schedule();return;}}
  }).observe(document.documentElement,{childList:true,subtree:true});
 }catch(e){}
})();
