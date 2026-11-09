/* OKLA – add Google + Facebook next to Seznam on the login page, as one clean
   row of brand buttons (Shoptet renders only Seznam). Each button links to
   Shoptet's own social-login endpoint; the native e-mail/password form, its
   CSRF token and the honeypot are left exactly as they are.

   Note: Google and Facebook only actually sign a visitor in once those providers
   are enabled in the Shoptet admin (Nastavení → Přihlášení přes sociální sítě)
   with their OAuth credentials; until then their endpoint just returns to the
   shop. The buttons are ready for that moment. */
(function(){
 'use strict';
 if(window.__oklaLoginSocialV1)return;window.__oklaLoginSocialV1=true;

 function onLogin(){return !!(document.body&&/(^|\s)in-login(\s|$)/.test(document.body.className));}

 /* Brand marks (official colours). */
 var ICONS={
  Google:'<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>',
  Facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.95H16.9c-1.49 0-1.95.93-1.95 1.87v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg>',
  Seznam:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#CC0000"/><text x="12" y="17.5" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">s</text></svg>'
 };
 var PROVIDERS=['Google','Facebook','Seznam'];

 function visible(e){return !!(e&&(e.offsetParent!==null||e.getBoundingClientRect().height>0));}

 function makeRow(){
  var wrap=document.createElement('div');
  wrap.className='okla-login-social-wrap';
  var label=document.createElement('div');
  label.className='okla-login-social__label';
  label.textContent='Přihlásit přes';
  var row=document.createElement('div');
  row.className='okla-login-social';
  PROVIDERS.forEach(function(p){
   var a=document.createElement('a');
   a.className='okla-social-btn okla-social-'+p.toLowerCase();
   a.href='/action/Social/login/?provider='+encodeURIComponent(p);
   a.setAttribute('rel','nofollow');
   a.setAttribute('aria-label','Přihlásit se přes '+p);
   a.innerHTML=ICONS[p];
   row.appendChild(a);
  });
  wrap.appendChild(label);wrap.appendChild(row);
  return wrap;
 }

 function build(){
  if(!onLogin())return true;
  /* The page carries two login widgets (a visible form and a hidden included
     one). Only enhance the VISIBLE social-login section(s). */
  var conts=[].slice.call(document.querySelectorAll('.social-login-buttons')).filter(visible);
  if(!conts.length){
   var f=[].slice.call(document.querySelectorAll('#formLogin,form.login-form')).filter(visible)[0];
   if(f)conts=[f];
  }
  if(!conts.length)return false;
  conts.forEach(function(cont){
   if(cont.querySelector('.okla-login-social'))return;
   /* Hide the shop's own "nebo" divider and single Seznam button. Inline
      display:none beats the theme's own !important rules on .form-group. */
   [].slice.call(cont.children).forEach(function(ch){
    if(ch.classList.contains('okla-login-social-wrap'))return;
    ch.classList.add('okla-login-native-hidden');
    ch.style.setProperty('display','none','important');
   });
   cont.appendChild(makeRow());
  });
  return true;
 }

 function run(){try{build();}catch(e){}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run,{once:true});
 [300,900,1800].forEach(function(t){setTimeout(run,t);});
 if(window.MutationObserver&&!document.querySelector('.okla-login-social-wrap')){
  var tries=0;
  var mo=new MutationObserver(function(){if(build()||++tries>40)mo.disconnect();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
