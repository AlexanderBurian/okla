/* Okla – phones: the bottom bar's pictograms as on the big shops' apps - solid, clear shapes (a solid house, the
   catalogue as lines with a magnifier, a solid cart, a clipboard with a tick, a solid person with lines) instead
   of thin outlines; drawn into the items okla_behavior.js builds (okla_mobile_bottombar.css sizes them). */
(function(){
 'use strict';
 if(window.__oklaDownbar)return;window.__oklaDownbar=true;
 var S='stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"';
 var ICON={
  home:'<path d="M10.9 2.75a1.75 1.75 0 0 1 2.2 0l6.95 5.6c.45.36.7.9.7 1.47V20a1.8 1.8 0 0 1-1.8 1.8H5.05a1.8 1.8 0 0 1-1.8-1.8V9.82c0-.57.25-1.11.7-1.47Z"/>',
  catalog:'<path d="M1.6 5.4h8.6M1.6 12h5.6M1.6 18.6h8.6" '+S+' stroke-width="2.2"/><circle cx="15.2" cy="11.3" r="4.6" '+S+' stroke-width="2.2"/><path d="m18.6 14.7 3.5 3.5" '+S+' stroke-width="2.2"/>',
  cart:'<path d="M1.75 3.6c0-.55.45-1 1-1h1.9c.78 0 1.45.54 1.62 1.3l.28 1.3h14.08c.98 0 1.7.93 1.45 1.88l-1.66 6.35a2.3 2.3 0 0 1-2.22 1.72H8.38l.27 1.25h9.6a1 1 0 1 1 0 2H7.85c-.47 0-.88-.33-.98-.79L4.4 4.6H2.75c-.55 0-1-.45-1-1Z"/><circle cx="9.1" cy="20.2" r="1.75"/><circle cx="17.4" cy="20.2" r="1.75"/>',
  orders:'<path d="M8.4 4.2H5.6c-1 0-1.85.82-1.85 1.85v14.1c0 1.02.83 1.85 1.85 1.85h12.8c1.02 0 1.85-.83 1.85-1.85V6.05c0-1.03-.83-1.85-1.85-1.85h-2.8" '+S+' stroke-width="1.9"/><rect x="8.4" y="2.2" width="7.2" height="3.9" rx="1.1" '+S+' stroke-width="1.9"/><path d="m8.2 13.4 2.6 2.6 5-5.1" '+S+' stroke-width="2"/>',
  menu:'<circle cx="8.6" cy="7.6" r="3.9"/><path d="M1.9 19.3c0-3.75 3-6.15 6.7-6.15s6.7 2.4 6.7 6.15c0 .75-.6 1.35-1.35 1.35H3.25c-.75 0-1.35-.6-1.35-1.35Z"/><path d="M17.3 8.6h4.2M17.3 13h4.2M18.6 17.4h2.9" '+S+' stroke-width="2.2"/>'
 };
 function draw(){
  var bar=document.getElementById('okla-v61-bottom');if(!bar)return false;
  [].forEach.call(bar.querySelectorAll('.okm61-bottom-action'),function(a){
   var k=a.getAttribute('data-okm61-kind'),svg=a.querySelector('svg');
   if(!svg||!ICON[k]||svg.getAttribute('data-okla-solid')===k)return;
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('data-okla-solid',k);svg.innerHTML=ICON[k];
  });
  return true;
 }
 var n=0;(function tick(){if(draw()&&n>3)return;if(++n<40)setTimeout(tick,250)})();
 try{new MutationObserver(function(){draw()}).observe(document.body,{childList:true})}catch(e){}
})();
