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

 var hoverCloseTimer=null,lastX=-1,lastY=-1;
 function pointerInside(){
  if(lastX<0||lastY<0)return false;
  var n=document.elementFromPoint(lastX,lastY);
  var a=document.querySelector('#header .okla-header-account'),p=document.getElementById('login');
  return !!(n&&((a&&a.contains(n))||(p&&p.contains(n))));
 }
 function cancelHoverClose(){
  if(hoverCloseTimer){clearTimeout(hoverCloseTimer);hoverCloseTimer=null}
 }
 function closeOnLeave(){
  if(hoverCloseTimer)return;
  hoverCloseTimer=setTimeout(function(){
   hoverCloseTimer=null;
   // Focus/click does NOT pin the popup after the cursor leaves both regions.
   if(isOpen()&&!pointerInside())hide();
  },180);
 }
 window.__oklaLoginHoverClose=function(){
  cancelHoverClose();
  if(isOpen())hide();
 };
 function hoverAccount(e){
  if(!desktop.matches||!e.target||!e.target.closest)return;
  if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  lastX=e.clientX;lastY=e.clientY;
  var pop=e.target.closest('#login');
  if(pop){cancelHoverClose();return}
  var a=e.target.closest('#header .okla-header-account');
  if(!a)return;
  if(e.relatedTarget&&a.contains(e.relatedTarget))return;
  cancelHoverClose();
  if(typeof window.__oklaCartPreviewClose==='function')window.__oklaCartPreviewClose();
  if(isOpen())return;
  var native=document.querySelector('.top-navigation-bar .top-nav-button-login');
  if(!native)return; // Do not show a sign-in form to logged-in customers.
  native.click(); // Preserves Shoptet's own login form, validation and actions.
  requestAnimationFrame(place);
 }
 function leaveAccount(e){
  if(!desktop.matches||!e.target||!e.target.closest)return;
  if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  lastX=e.clientX;lastY=e.clientY;
  var a=e.target.closest('#header .okla-header-account');
  if(a&&(!e.relatedTarget||!a.contains(e.relatedTarget))){closeOnLeave();return}
  var p=e.target.closest('#login');
  if(p&&(!e.relatedTarget||!p.contains(e.relatedTarget)))closeOnLeave();
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
  document.addEventListener('pointerover',hoverAccount,true);
  document.addEventListener('pointerout',leaveAccount,true);
  document.addEventListener('pointerdown',function(e){
   if(e.target.closest&&e.target.closest('#header .okla-header-account'))cancelHoverClose();
  },true);
  document.addEventListener('pointermove',function(e){
   if(!desktop.matches||!isOpen())return;
   if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
   lastX=e.clientX;lastY=e.clientY;
   if(pointerInside())cancelHoverClose();
   else closeOnLeave();
  },true);
  // Legacy header button already has a click listener; suppress its second
  // native toggle if the same login window was opened by hovering first.
  document.addEventListener('click',function(e){
   if(!desktop.matches||!e.target.closest)return;
   var a=e.target.closest('#header .okla-header-account');
   if(!a)return;
   var native=document.querySelector('.top-navigation-bar .top-nav-button-login');
   if(!native)return; // preserve login/account navigation fallback
   e.preventDefault();e.stopImmediatePropagation();
   cancelHoverClose();
   if(!isOpen())native.click();
   requestAnimationFrame(place);
  },true);
  window.addEventListener('scroll',function(){
   if(!desktop.matches||!isOpen())return;
   place();
   if(!pointerInside())closeOnLeave();
  },{passive:true});
  if(desktop.addEventListener)desktop.addEventListener('change',function(){
   if(!desktop.matches){cancelHoverClose();return}
   place();
  });
  place();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
