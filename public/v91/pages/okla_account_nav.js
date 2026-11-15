/* OKLA – account navigation: on mobile the sidebar becomes a menu button that
   opens a right-side drawer (same behaviour as the category menu). The existing
   V125 nav (icons, active item, logout confirmation) is moved into the drawer,
   so nothing is duplicated and all styling is reused. Desktop is untouched here
   (CSS handles the larger, centered layout). */
(function(){
 'use strict';
 if(window.__oklaAccountNavV1)return;
 window.__oklaAccountNavV1=true;

 var BURGER='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
 var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
 var CLOSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

 var overlay,panel,body,trigger,placeholder;

 function buildOverlay(){
  overlay=document.createElement('div');
  overlay.id='okla-acc-pop';
  overlay.innerHTML='<div class="okla-acc-pop__panel" role="dialog" aria-modal="true" aria-label="Zákaznické centrum">'+
    '<div class="okla-acc-pop__head"><span>Zákaznické centrum</span>'+
    '<button type="button" class="okla-acc-pop__close" aria-label="Zavřít">'+CLOSE+'</button></div>'+
    '<div class="okla-acc-pop__body"></div></div>';
  (document.body||document.documentElement).appendChild(overlay);
  panel=overlay.querySelector('.okla-acc-pop__panel');
  body=overlay.querySelector('.okla-acc-pop__body');
  overlay.addEventListener('click',function(e){if(e.target===overlay)close()});
  overlay.querySelector('.okla-acc-pop__close').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen())close()});
  /* A plain navigation link closes the drawer; logout opens its own dialog. */
  overlay.addEventListener('click',function(e){
   var a=e.target.closest&&e.target.closest('.okla-acc-nav__link');
   if(a&&!a.classList.contains('is-logout'))close();
  });
 }

 function isOpen(){return overlay&&overlay.classList.contains('is-open')}

 function open(){
  var nav=document.querySelector('.okla-acc-nav');
  if(!nav||!overlay)return;
  if(!placeholder){placeholder=document.createComment('okla-acc-nav-home')}
  if(!placeholder.parentNode&&nav.parentNode)nav.parentNode.insertBefore(placeholder,nav);
  body.appendChild(nav);
  nav.classList.remove('is-mobile-open');
  overlay.classList.add('is-open');
  document.body.classList.add('okla-acc-pop-open');
  if(trigger)trigger.setAttribute('aria-expanded','true');
 }
 function close(){
  if(!overlay)return;
  overlay.classList.remove('is-open');
  document.body.classList.remove('okla-acc-pop-open');
  if(trigger)trigger.setAttribute('aria-expanded','false');
  /* Return the nav to its home so desktop keeps working. */
  var nav=body&&body.querySelector('.okla-acc-nav');
  if(nav&&placeholder&&placeholder.parentNode)placeholder.parentNode.insertBefore(nav,placeholder);
 }

 function buildTrigger(){
  var nav=document.querySelector('.okla-acc-nav');
  var main=document.querySelector('.okla-acc-shell__main')||document.getElementById('content');
  if(!nav||!main)return false;
  if(document.getElementById('okla-acc-trigger'))return true;
  trigger=document.createElement('button');
  trigger.type='button';trigger.id='okla-acc-trigger';trigger.className='okla-acc-trigger';
  trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML='<span class="okla-acc-trigger__ic">'+BURGER+'</span>'+
    '<span class="okla-acc-trigger__label">Zákaznické centrum</span>'+
    '<span class="okla-acc-trigger__chev">'+CHEV+'</span>';
  main.insertBefore(trigger,main.firstChild);
  trigger.addEventListener('click',function(){isOpen()?close():open()});
  return true;
 }

 var mq=window.matchMedia('(max-width:767px)');
 function onBreakpoint(){ if(!mq.matches&&isOpen())close(); }

 function run(){
  if(!document.querySelector('.okla-acc-nav'))return false;
  if(!overlay)buildOverlay();
  buildTrigger();
  return true;
 }
 function start(){
  if(run())return;
  if(!window.MutationObserver)return;
  var tries=0;
  var mo=new MutationObserver(function(){if(run()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){mo.disconnect()},10000);
 }
 if(mq.addEventListener)mq.addEventListener('change',onBreakpoint);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
