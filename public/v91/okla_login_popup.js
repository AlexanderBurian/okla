/* OKLA login popup: Shoptet opens its login widget in the top right corner, over the header. On desktop it is placed
   right under the "Můj účet" button, with its arrow pointing at the button; a click outside or Escape closes it. */
(function(){
 'use strict';
 if(window.__oklaLoginPopupV1)return;
 window.__oklaLoginPopupV1=true;

 var GAP=12;
 var EDGE=12;
 var desktop=window.matchMedia('(min-width: 992px)');

 function reset(pop){
  ['position','top','left','right','bottom'].forEach(function(p){pop.style.removeProperty(p)});
  pop.style.removeProperty('--okla-arrow-x');
 }

 function place(){
  var pop=document.getElementById('login');
  if(!pop)return;
  var btn=document.querySelector('#header .okla-header-account');
  if(!document.body.classList.contains('login-window-visible')||!desktop.matches||!btn||!btn.offsetParent){reset(pop);return}
  var b=btn.getBoundingClientRect();
  var width=pop.offsetWidth;
  var holder=pop.offsetParent||document.body;
  var h=holder.getBoundingClientRect();
  var centre=b.left+b.width/2;
  var left=Math.max(EDGE,Math.min(centre-width/2,document.documentElement.clientWidth-width-EDGE));
  pop.style.setProperty('position','absolute','important');
  pop.style.setProperty('top',(b.bottom-h.top+GAP)+'px','important');
  pop.style.setProperty('left',(left-h.left)+'px','important');
  pop.style.setProperty('right','auto','important');
  pop.style.setProperty('bottom','auto','important');
  pop.style.setProperty('--okla-arrow-x',(centre-left)+'px');
 }

 function isOpen(){return document.body.classList.contains('login-window-visible')}

 /* Closes the widget through Shoptet's own popup code. */
 function hide(){
  var popups=window.shoptet&&window.shoptet.popups;
  if(popups&&typeof popups.hideContentWindows==='function')popups.hideContentWindows();
  else document.body.classList.remove('login-window-visible','user-action-visible');
  var toggle=document.querySelector('.top-nav-button-login');
  if(toggle)toggle.setAttribute('aria-expanded','false');
 }

 function start(){
  if(!document.body)return;
  new MutationObserver(place).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',place);
  /* A click outside the widget or Escape closes it. */
  document.addEventListener('mousedown',function(e){
   if(!isOpen()||(e.target.closest&&e.target.closest('#login,.okla-header-account,.top-nav-button-login')))return;
   hide();
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen())hide()});
  place();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
