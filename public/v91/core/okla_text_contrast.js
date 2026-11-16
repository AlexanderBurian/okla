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
   +'okla-ai-chat,#okla-cart-modal,#okla-cart-preview,.slider-wrapper h4,[class*="placeholder"]')!=null;
 }

 /* Same pass as before, element by element in page order, but without forcing the browser to recompute the page's
    styles after every single repaint: the colours are read for a whole round at once, then written. A repaint can only
    change the colour of the element's own descendants (inherited colour), so an element whose ancestor is still
    waiting in this pass is read in a later round, after that ancestor - exactly what the one-by-one pass saw. */
 /* recheck: also the elements that were not grey when last read (a stylesheet that arrived later can make them grey) */
 var recheck=false;
 function paint(root){
  var els=(root||document.body).querySelectorAll('*');
  var todo=[];
  for(var i=0;i<els.length;i++){
   var e=els[i];
   if((e.__oktc&&!(recheck&&e.__oktcPainted))||(e.__oktcSeen&&!recheck))continue;
   var tag=e.tagName;
   if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT'||tag==='SVG'||tag==='PATH')continue;
   /* needs its own visible text, not just child elements */
   var has=false,n;for(n=e.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&n.textContent.trim().length>1){has=true;break;}}
   if(!has){continue;}
   if(skip(e)){e.__oktc=1;continue;}
   todo.push(e);
  }
  var waiting=new Set(todo);
  while(todo.length){
   /* this round: elements with no ancestor still waiting */
   var round=[],rest=[];
   for(var r=0;r<todo.length;r++){
    var x=todo[r],p=x.parentElement,blocked=false;
    while(p){if(waiting.has(p)){blocked=true;break;}p=p.parentElement;}
    (blocked?rest:round).push(x);
   }
   /* on a recheck, a text painted before is read without its paint (its own colour may have changed since) */
   round.forEach(function(x){if(recheck&&x.__oktcPainted)x.style.removeProperty('color')});
   var colours=round.map(function(x){return getComputedStyle(x).color});
   for(var k=0;k<round.length;k++){
    var el=round[k];waiting.delete(el);el.__oktc=1;
    var m=colours[k].match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if(!m)continue;
    var a=m[4]===undefined?1:+m[4];
    if(a<0.4)continue;
    var lum=grey(+m[1],+m[2],+m[3]);
    if(lum<0){el.__oktc=0;el.__oktcSeen=1;continue;}
    el.style.setProperty('color', lum<140?BLACK:SOFT, 'important');el.__oktcPainted=1;
   }
   todo=rest;
  }
 }

 var queued=false;
 /* while the page is still hidden under the loader's curtain, the pass waits and runs once just before it is shown */
 function oklaUntilShown(fn){var q=window.__oklaBeforeReveal;if(!q)return false;if(q.indexOf(fn)<0)q.push(fn);return true}
 function run(){if(!oklaUntilShown(run))paint(document);}
 function frame(){queued=false;paint(document);recheck=false;}
 function schedule(){if(queued)return;queued=true;if(!oklaUntilShown(frame))requestAnimationFrame(frame);}

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run,{once:true});
 /* one late pass for content that appeared without a node being added (the observer below catches the rest) */
 setTimeout(schedule,2000);

 /* Repaint freshly injected content (AJAX filter results, lazy sections). We
    observe node additions only — never attributes — so our own colour writes
    do not retrigger the pass. */
 /* a stylesheet loaded after the page was shown (the footer's, the "later" files) can turn texts grey: read again */
 document.addEventListener('load',function(e){var t=e.target;if(t&&t.tagName==='LINK'&&/stylesheet/i.test(t.rel||'')){recheck=true;schedule();}},true);
 try{
  new MutationObserver(function(recs){
   for(var i=0;i<recs.length;i++){if(recs[i].addedNodes&&recs[i].addedNodes.length){schedule();return;}}
  }).observe(document.documentElement,{childList:true,subtree:true});
 }catch(e){}
})();
