/* Okla – phones: the bottom bar's pictograms as on the big shops' apps - solid, clear shapes (a solid house, the
   catalogue as lines with a magnifier, a solid cart, a clipboard with a tick, a solid person with lines) instead
   of thin outlines; drawn into the items okla_behavior.js builds (okla_mobile_bottombar.css sizes them). */
(function(){
 'use strict';
 if(window.__oklaDownbar)return;window.__oklaDownbar=true;
 var S='stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"';
 var ICON={
  home:'<path d="M11.25 2.95a1.2 1.2 0 0 1 1.5 0l8.35 6.8c.3.24.47.6.47.98v9.6c0 1.03-.84 1.87-1.87 1.87H4.3c-1.03 0-1.87-.84-1.87-1.87v-9.6c0-.38.17-.74.47-.98Z"/>',
  catalog:'<path d="M3 6h9M3 12h5.5M3 18h9" '+S+' stroke-width="2.3"/><circle cx="16.2" cy="11.7" r="4.35" '+S+' stroke-width="2.3"/><path d="m19.4 14.9 2.6 2.6" '+S+' stroke-width="2.3"/>',
  cart:'<path d="M1.75 3.6c0-.55.45-1 1-1h1.9c.78 0 1.45.54 1.62 1.3l.28 1.3h14.08c.98 0 1.7.93 1.45 1.88l-1.66 6.35a2.3 2.3 0 0 1-2.22 1.72H8.38l.27 1.25h9.6a1 1 0 1 1 0 2H7.85c-.47 0-.88-.33-.98-.79L4.4 4.6H2.75c-.55 0-1-.45-1-1Z"/><circle cx="9.1" cy="20.2" r="1.75"/><circle cx="17.4" cy="20.2" r="1.75"/>',
  orders:'<path d="M9 4.3H6.6c-.92 0-1.65.74-1.65 1.65v13.6c0 .91.73 1.65 1.65 1.65h10.8c.92 0 1.65-.74 1.65-1.65V5.95c0-.91-.73-1.65-1.65-1.65H15" '+S+' stroke-width="2"/><rect x="9" y="2.6" width="6" height="3.4" rx="1" '+S+' stroke-width="2"/><path d="m8.6 13.1 2.4 2.4 4.5-4.7" '+S+' stroke-width="2.1"/>',
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
