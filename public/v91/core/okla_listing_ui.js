/* Listings: "Nahoru" under the products takes the visitor back to the top of the page, smoothly (its own anchor jump
   did nothing on our pages) */
(function(){
 'use strict';
 if(window.__oklaGoTop)return;window.__oklaGoTop=true;
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('.goToTop__button,.goToTop a');
  if(!a)return;
  e.preventDefault();e.stopImmediatePropagation();
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  a.blur();
 },true); /* before Shoptet's own handler, which stops the click */
})();
