/* Okla – the product card (okla_card.css): a row or grid of cards that stands on a grey ground gets .okc-on-grey, so
   its photo boxes are white (light grey boxes on a grey ground would vanish). The ground is the first ancestor with
   its own background colour. Checked on load, a few times after (rows built later) and when new rows are added. */
(function(){
 'use strict';
 if(window.__oklaCardGround)return;window.__oklaCardGround=1;
 var ROWS='#content :is(.products-block,.products-page,.okla-cards,.okla-art-products),#okla-cart-recs .ocr-grid';
 function ground(el){
  for(var e=el;e&&e!==document.documentElement;e=e.parentElement){
   var c=getComputedStyle(e).backgroundColor,m=c&&c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
   if(!m||(m[4]!==undefined&&+m[4]<0.5))continue;
   return [+m[1],+m[2],+m[3]];
  }
  return [255,255,255];
 }
 function mark(){
  document.querySelectorAll(ROWS).forEach(function(row){
   var g=ground(row.parentElement),grey=(g[0]+g[1]+g[2])/3<246;
   if(row.classList.contains('okc-on-grey')!==grey)row.classList.toggle('okc-on-grey',grey);
  });
 }
 var t=0;function later(){clearTimeout(t);t=setTimeout(mark,250)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});else mark();
 addEventListener('load',mark,{once:true});[1200,3000,6000].forEach(function(ms){setTimeout(mark,ms)});
 if(window.MutationObserver)new MutationObserver(function(rs){
  for(var i=0;i<rs.length;i++){var a=rs[i].addedNodes;for(var j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1&&(n.matches(ROWS)||n.querySelector&&n.querySelector('.product,.ocr-card'))){later();return}}}
 }).observe(document.documentElement,{childList:true,subtree:true});
})();
