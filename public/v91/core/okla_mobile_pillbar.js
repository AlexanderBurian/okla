/* Okla – phones: the pill bottom bar switches smoothly.
   - The pill's slide is only animated after the page has been painted, so a new page shows its current item at once
     (no growing/shrinking while it loads).
   - A tap on a link moves the pill to the tapped item right away, so the switch is visible before the next page
     arrives (no frozen moment, no double jump). */
(function(){
 'use strict';
 if(window.__oklaPillbarV1)return;window.__oklaPillbarV1=true;
 var root=document.documentElement;
 function ready(){requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('okla-pb-anim')})})}
 if(document.readyState==='complete')setTimeout(ready,0);else window.addEventListener('load',function(){setTimeout(ready,0)},{once:true});
 /* coming back with the back button (page cache): show the right item at once, then animate again */
 window.addEventListener('pageshow',function(e){if(e.persisted){root.classList.remove('okla-pb-anim');ready()}});
 document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest&&e.target.closest('#okla-v61-bottom a.okm61-bottom-action[href]');
  if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
  var bar=a.parentNode;
  [].forEach.call(bar.querySelectorAll('.okm61-bottom-action'),function(b){b.classList.remove('is-active','is-panel')});
  a.classList.add('is-active');
 },true);
})();
