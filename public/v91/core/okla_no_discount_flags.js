/* Okla – no "−5 %" badges on product pictures (okla_no_discount_flags.css hides Shoptet's known badge classes). This
   is the safety net for any other markup: a small element on a product card's or the product page's picture whose
   whole text is a percentage discount ("−5 %", "-10%") is hidden - on the cards present now and on those added later
   (sliders, "Mohlo by vás zajímat", search). Prices and the cart are not touched. */
(function(){
 'use strict';
 if(window.__oklaNoDiscountFlags)return;window.__oklaNoDiscountFlags=true;
 var PCT=/^[−–‐-]\s*\d{1,2}(?:[.,]\d+)?\s*%$/;
 var AREAS='.product .image,.product a.image,.product .extra-flags,.product .flags,.p .image,.p .extra-flags,.p-image,.p-image-wrapper,.p-detail .flags,.p-detail .extra-flags';
 function sweep(root){
  var areas=[].slice.call(root.querySelectorAll(AREAS));
  if(root.nodeType===1&&root.closest){var own=root.closest(AREAS);if(own)areas.push(own)}
  areas.forEach(function(area){
   area.querySelectorAll('span,div,strong,b,em,i,p').forEach(function(el){
    if(el.classList.contains('okla-no-discount-flag')||el.querySelector('img,svg,picture'))return;
    var t=(el.textContent||'').replace(/\s+/g,' ').trim();
    if(!PCT.test(t))return;
    /* the badge itself: the outermost element inside the picture area whose text is still only the percentage */
    var top=el;
    while(top.parentElement&&top.parentElement!==area&&PCT.test((top.parentElement.textContent||'').replace(/\s+/g,' ').trim()))top=top.parentElement;
    top.classList.add('okla-no-discount-flag');
   });
  });
 }
 function start(){
  sweep(document);
  if(!window.MutationObserver||!document.body)return;
  /* only what was added is looked at (the sliders move cards all the time; a card moved, not new, is skipped quickly) */
  var queue=[],pending=false;
  new MutationObserver(function(list){
   list.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&!n.__oklaNdfSeen){queue.push(n)}})});
   if(pending||!queue.length)return;pending=true;
   requestAnimationFrame(function(){pending=false;var q=queue;queue=[];q.forEach(function(n){if(n.isConnected){n.__oklaNdfSeen=true;sweep(n)}})});
  }).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
