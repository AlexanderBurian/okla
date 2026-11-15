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
 function pinned(){
  var pop=document.getElementById('login');if(!pop)return false;
  if(pop.classList.contains('okla-login-busy')||pop.classList.contains('okla-login-has-error'))return true;
  return [].slice.call(pop.querySelectorAll('input[type="email"],input[type="password"]')).some(function(i){return !!i.value});
 }

 /* Signing in from the popup happens in the background: a wrong e-mail or
    password shows an error right in the popup and the popup stays open with the
    e-mail kept; a successful sign-in reloads the page signed in. Shoptet's own
    validation runs first (it stops invalid submits before they reach document). */
 var ERROR_TEXT='Nesprávný e-mail nebo heslo. Zkontrolujte je a zkuste to znovu.';
 function loginForm(){return document.querySelector('#login form[action*="Customer/Login"]')}
 function showError(form,text){
  var pop=document.getElementById('login');
  var box=form.querySelector('.okla-login-error');
  if(!box){
   box=document.createElement('div');box.className='okla-login-error';box.setAttribute('role','alert');
   var ic=document.createElement('span');ic.className='okla-login-error__icon';ic.setAttribute('aria-hidden','true');ic.textContent='!';
   var tx=document.createElement('span');tx.className='okla-login-error__text';
   box.append(ic,tx);form.insertBefore(box,form.firstChild);
  }
  box.querySelector('.okla-login-error__text').textContent=text||ERROR_TEXT;
  box.classList.remove('is-shown');void box.offsetWidth;box.classList.add('is-shown');
  if(pop)pop.classList.add('okla-login-has-error');
  var pw=form.querySelector('input[type="password"]');
  /* the password stays (emptying it would make Shoptet's validator complain at once); it is selected, so typing replaces it */
  if(pw){pw.classList.add('okla-login-invalid');pw.setAttribute('aria-invalid','true');pw.focus();try{pw.select()}catch(e){}}
 }
 function clearError(form){
  var pop=document.getElementById('login');
  var box=form.querySelector('.okla-login-error');if(box)box.remove();
  if(pop)pop.classList.remove('okla-login-has-error');
  [].slice.call(form.querySelectorAll('.okla-login-invalid')).forEach(function(i){i.classList.remove('okla-login-invalid');i.removeAttribute('aria-invalid')});
 }
 function serverMessage(doc){
  var n=doc.querySelector('.msg-error, .message-error, .alert-danger');
  var t=n&&(n.textContent||'').replace(/\s+/g,' ').trim();
  return t&&t.length<200?t:'';
 }
 function signedIn(doc){
  return !doc.querySelector('.top-navigation-bar .top-nav-button-login')&&[].slice.call(doc.querySelectorAll('a[href]')).some(function(a){return /logout|odhlas/i.test(a.getAttribute('href')||'')});
 }
 function onSubmit(e){
  var form=e.target;
  if(!form||form!==loginForm()||e.defaultPrevented||!window.fetch||!window.DOMParser)return;
  e.preventDefault();
  var pop=document.getElementById('login'),btn=form.querySelector('[type="submit"]');
  if(pop.classList.contains('okla-login-busy'))return;
  pop.classList.add('okla-login-busy');if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true')}
  var data=new URLSearchParams();
  new FormData(form).forEach(function(v,k){if(typeof v==='string')data.append(k,v)});
  var c=window.shoptet&&window.shoptet.csrf;
  if(c&&c.enabled&&c.token&&!data.has('__csrf__'))data.append('__csrf__',c.token);
  function done(){pop.classList.remove('okla-login-busy');if(btn){btn.disabled=false;btn.removeAttribute('aria-busy')}}
  fetch(form.action,{method:'POST',body:data,credentials:'same-origin',redirect:'follow',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}})
   .then(function(r){return r.text().then(function(html){return {url:r.url,html:html}})})
   .then(function(res){
    var doc=new DOMParser().parseFromString(res.html,'text/html');
    if(signedIn(doc)){location.reload();return}
    /* Shoptet asks for something more (e.g. a security check): continue on its page */
    if(doc.querySelector('.g-recaptcha, [data-sitekey], img[src*="captcha" i]')){location.href=res.url;return}
    done();showError(form,serverMessage(doc));
   })
   .catch(function(){done();HTMLFormElement.prototype.submit.call(form)});
 }

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
   // Moving the pointer away closes the popup, unless the visitor is using the form
   // (something typed in, signing in, or an error shown): then only a click outside or Escape closes it.
   if(isOpen()&&!pointerInside()&&!pinned())hide();
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
  /* The sign-in widget is no longer opened on hover: the account button leads
     straight to the /login/ page, so there is just one login UI (no popup that
     duplicates the page). */
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
  document.addEventListener('submit',onSubmit);
  document.addEventListener('input',function(e){var f=loginForm();if(f&&e.target&&f.contains(e.target)&&(e.target.type==='password'||e.target.type==='email'))clearError(f)});
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
  // Account button (desktop and mobile): a logged-out visitor is sent to the
  // /login/ page instead of the popup, so there is a single login experience.
  document.addEventListener('click',function(e){
   if(!e.target.closest)return;
   var a=e.target.closest('#header .okla-header-account');
   if(!a)return;
   var native=document.querySelector('.top-navigation-bar .top-nav-button-login');
   if(!native)return; // logged in: leave Shoptet's account navigation alone
   e.preventDefault();e.stopImmediatePropagation();
   cancelHoverClose();
   if(isOpen())hide();
   location.href='/login/';   // one login experience: the page, not a popup
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
