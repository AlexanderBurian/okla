/* OKLA V91 – homepage behavior only. CSS is loaded once by canonical bootstrap. */
(function(){'use strict';if(window.__oklaHomeV89)return;window.__oklaHomeV89=true;


var NS='http://www.w3.org/2000/svg';
function cart(){var s=document.createElementNS(NS,'svg');s.classList.add('ok89-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
var body=document.createElementNS(NS,'path');body.setAttribute('d','M7 7h14l-2.2 9H9L7 7Z');s.appendChild(body);
var arm=document.createElementNS(NS,'path');arm.setAttribute('d','M2 3.8h3.6L8 16.2h11');arm.setAttribute('fill','none');arm.setAttribute('stroke','currentColor');arm.setAttribute('stroke-width','1.65');s.appendChild(arm);
for(var x of [10,18]){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',20.5);c.setAttribute('r',1.7);s.appendChild(c)}return s}
function stars(){var group=document.createElement('span');group.className='ok89-decor-stars';group.title='Dekorativní hvězdy, nejde o zákaznické hodnocení';group.setAttribute('aria-hidden','true');
for(var i=0;i<5;i++){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');var p=document.createElementNS(NS,'path');p.setAttribute('d','M12 2l3.09 6.26L22 9.27l-5 4.88 1.18 6.9L12 17.8l-6.18 3.25L7 14.15 2 9.27l6.91-1.01L12 2z');s.appendChild(p);group.appendChild(s)}return group}
function process(root){var cards=(root||document).querySelectorAll('#content .okla-slider-shell .product');
cards.forEach(function(card){var wrap=card.querySelector('.ratings-wrapper');if(wrap&&!matchMedia('(max-width:767px)').matches){wrap.querySelectorAll('.okv80-stars,.okv73-rating-stars,.ok88-decor-stars,.okla-empty-stars').forEach(function(e){e.remove()});if(!wrap.querySelector('.ok89-decor-stars')){
 var grp=stars();wrap.prepend(grp);
 var empty=wrap.querySelector('.stars-placeholder');
 if(empty&&(!empty.textContent||/Bez hodnocení|Neohodnoceno/i.test(empty.textContent)))empty.textContent='Bez hodnocení';
 }}
 var btn=card.querySelector('.p-tools button.btn-cart');if(btn){
  if(matchMedia('(min-width:992px)').matches){btn.querySelectorAll('svg.okv80-cart,svg.okv79-cart,svg.okv78-cart').forEach(function(n){n.remove()});if(!btn.querySelector('.ok89-cart'))btn.prepend(cart());}
  var offer=card.querySelector('[data-micro-availability]');
  if(offer&&/OutOfStock|SoldOut|Discontinued/i.test(offer.getAttribute('data-micro-availability')||'')){
   if(!btn.disabled)btn.disabled=true;btn.setAttribute('aria-disabled','true');
  }
 }
 });}
/* The carousel has extra bottom padding and can resize. Anchor arrows to the actual card,
   not to the entire shell and not to a fixed offset from the section heading. */
var pendingAlign=0;
function alignArrows(){
 if(!window.matchMedia('(min-width:992px)').matches)return;
 document.querySelectorAll('#content .okla-slider-shell').forEach(function(shell){
  var controls=shell.querySelector(':scope > .okla-slider-controls');
  var card=shell.querySelector('.okla-slider-track > .product .p');
  if(!controls||!card)return;
  var cardBox=card.getBoundingClientRect(), shellBox=shell.getBoundingClientRect();
  if(!cardBox.height||!shellBox.height)return;
  var center=(cardBox.top-shellBox.top+cardBox.height/2).toFixed(1)+'px';
  if(shell.style.getPropertyValue('--okla-nav-center')!==center)
   shell.style.setProperty('--okla-nav-center',center);
 });
}
function scheduleArrowAlign(){
 if(pendingAlign)return;
 pendingAlign=window.requestAnimationFrame(function(){pendingAlign=0;alignArrows()});
}

function start(){if(!document.body?.classList.contains('type-index'))return;process(document);scheduleArrowAlign();
 if('ResizeObserver' in window){
  var observer=new ResizeObserver(scheduleArrowAlign);
  document.querySelectorAll('#content .okla-slider-shell').forEach(function(shell){
   var viewport=shell.querySelector('.okla-slider-viewport'),card=shell.querySelector('.okla-slider-track > .product .p');
   if(viewport)observer.observe(viewport);
   if(card)observer.observe(card);
  });
 }
 /* Observe only newly added native product cards in sliders; no global subtree/interval polling. */
 document.querySelectorAll('#content .okla-slider-shell .okla-slider-track').forEach(function(track){
 if(track.dataset.ok88Observed)return;track.dataset.ok88Observed='1';
 var mo=new MutationObserver(function(recs){if(!recs.some(function(rec){return Array.from(rec.addedNodes).some(function(n){return n.nodeType===1&&(n.matches?.('.product')||n.querySelector?.('.product'))})}))return;process(document);scheduleArrowAlign()});
 mo.observe(track,{childList:true});
 });}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('resize',scheduleArrowAlign,{passive:true});
window.addEventListener('load',scheduleArrowAlign,{once:true});
var mq=matchMedia('(min-width:992px)');if(mq.addEventListener)mq.addEventListener('change',function(){process(document);scheduleArrowAlign()});
})();