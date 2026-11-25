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

/* Listings: the paging as on the big shops - "‹ 1 2 3 … 9 ›": every page number (the shop shows only the neighbours),
   the current one a blue square with a white number, the arrows plain chevrons. Built from the shop's own paging (its
   "strana X z Y" and its links' address), again whenever the shop draws the listing anew. */
(function(){
 'use strict';
 if(window.__oklaPaging)return;window.__oklaPaging=true;
 var CH_L='<svg viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2 2 8l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var CH_R='<svg viewBox="0 0 10 16" aria-hidden="true"><path d="m2 2 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 function pageUrl(base,n,q){return base+(n>1?'strana-'+n+'/':'')+q}
 function build(){
  var nav=document.querySelector('#content .pagination');if(!nav)return;
  var ul=nav.querySelector('.pagination__list');if(!ul||ul.dataset.oklaPg)return;
  var st=(nav.querySelector('[id*="paginationStatus"]')||{}).textContent||'';
  var m=st.match(/(\d+)\D+(\d+)/);if(!m)return;
  var cur=+m[1],all=+m[2];if(!(all>1))return;
  var link=ul.querySelector('a[href]');if(!link)return;
  var u=new URL(link.getAttribute('href'),location.origin);
  var base=u.pathname.replace(/strana-\d+\/?$/,'');if(!/\/$/.test(base))base+='/';
  var q=u.search||'';
  var nums=[];
  if(all<=7){for(var i=1;i<=all;i++)nums.push(i)}
  else{nums=[1];var a=Math.max(2,cur-1),z=Math.min(all-1,cur+1);if(cur<=3){a=2;z=4}if(cur>=all-2){a=all-3;z=all-1}if(a>2)nums.push(0);for(var k=a;k<=z;k++)nums.push(k);if(z<all-1)nums.push(0);nums.push(all)}
  var out=document.createDocumentFragment();
  function li(node){var l=document.createElement('li');l.appendChild(node);out.appendChild(l)}
  function arrow(n,prev){var x=document.createElement('a');x.className='okla-pg__arrow';x.href=pageUrl(base,n,q);x.setAttribute('aria-label',(prev?'Předchozí':'Následující')+', strana '+n);x.innerHTML=prev?CH_L:CH_R;li(x)}
  if(cur>1)arrow(cur-1,true);
  nums.forEach(function(n){
   var x;
   if(!n){x=document.createElement('span');x.className='okla-pg__gap';x.textContent='…'}
   else if(n===cur){x=document.createElement('strong');x.className='okla-pg__num is-current';x.setAttribute('aria-current','page');x.textContent=n}
   else{x=document.createElement('a');x.className='okla-pg__num';x.href=pageUrl(base,n,q);x.setAttribute('aria-label','Strana '+n);x.textContent=n}
   li(x);
  });
  if(cur<all)arrow(cur+1,false);
  ul.textContent='';ul.appendChild(out);ul.dataset.oklaPg='1';ul.classList.add('okla-pg');
 }
 var n=0;(function tick(){build();if(++n<30)setTimeout(tick,200)})();
 var queued=false;
 function watch(){var c=document.getElementById('content');if(!c)return;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;build()})}).observe(c,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
