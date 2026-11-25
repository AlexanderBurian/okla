/* OKLA – PC only: pointing at a product card (picture, name, price - the whole card) brings its photo a little closer,
   inside its own frame (okla_photo2.css); moving away lets it go back. Every product the same way - no second photo. */
(function(){
 'use strict';
 if(window.__oklaPhoto2)return;window.__oklaPhoto2=true;
 var pc=window.matchMedia('(min-width:992px) and (hover:hover)');
 var current=null;
 function hide(){if(current)current.classList.remove('okla-photo-zoom');current=null}
 document.addEventListener('mouseover',function(e){
  if(!pc.matches)return;
  var card=e.target.closest&&e.target.closest('.product');
  if(card===current)return;
  hide();
  if(card){current=card;card.classList.add('okla-photo-zoom')}
 },{passive:true});
 document.addEventListener('mouseout',function(e){
  if(current&&(!e.relatedTarget||!current.contains(e.relatedTarget)))hide();
 },{passive:true});
})();
