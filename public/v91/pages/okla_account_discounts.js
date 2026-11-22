/* Okla – "Moje slevy" in the customer account. Shoptet lists the customer group, the loyalty discount, the additional
   discount and "Aktuální zákaznická sleva" - the discount that is actually applied. That last row is the result, so
   it reads as one: a clearer name ("Vaše celková sleva") and a thicker, darker line above it (okla_account_discounts.css).
   The row is found by its text (Czech and the other web languages), so it works whatever markup Shoptet uses. */
(function(){
 'use strict';
 if(window.__oklaAccountDiscounts)return;window.__oklaAccountDiscounts=true;
 var LABEL=/^(aktuální zákaznická sleva|aktuálna zákaznícka zľava|current customer discount|aktuális vásárlói kedvezmény)\s*:?$/i;
 var NAME={cs:'Vaše celková sleva',sk:'Vaša celková zľava',en:'Your total discount',hu:'Teljes kedvezménye'};
 function lang(){return window.OKLA_LANG||document.documentElement.getAttribute('data-okla-lang')||'cs'}
 function run(){
  var root=document.querySelector('#content')||document.body;if(!root)return false;
  var found=false;
  [].forEach.call(root.querySelectorAll('td,th,dt,span,div,p,strong,b,label'),function(el){
   if(el.__oklaDiscTotal||el.children.length)return;
   if(!LABEL.test((el.textContent||'').replace(/\s+/g,' ').trim()))return;
   el.__oklaDiscTotal=true;found=true;
   el.textContent=NAME[lang()]||NAME.cs;
   el.setAttribute('data-okla-i18n-skip','');
   el.classList.add('okla-disc-total__label');
   var row=el.closest('tr')||el.closest('li,dl>div,.row')||el.parentElement;
   if(row)row.classList.add('okla-disc-total');
  });
  return found;
 }
 var tries=0;
 (function again(){if(run()||++tries>20)return;setTimeout(again,150)})();
})();
