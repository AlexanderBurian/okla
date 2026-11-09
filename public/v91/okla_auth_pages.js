/* OKLA – isolated, Alza-style auth pages. Injects a single centred OKLA logo
   above the sign-in / sign-up card (the shop chrome is hidden in CSS), and
   simplifies the registration form: force an end-customer sign-up and drop the
   wholesale/customer-type choice and the optional company-billing section. The
   e-mail/password form, CSRF token and honeypot are left exactly as they are. */
(function(){
 'use strict';
 if(window.__oklaAuthPagesV1)return;window.__oklaAuthPagesV1=true;

 function isAuth(){return !!(document.body&&/(^|\s)in-(login|registrace)(\s|$)/.test(document.body.className));}
 function isReg(){return !!(document.body&&/(^|\s)in-registrace(\s|$)/.test(document.body.className));}

 /* Clone the shop logo into a clean bar above the card (the header itself is
    hidden by CSS; cloning keeps whatever logo the deployed version uses). */
 function logoBar(){
  if(document.querySelector('.okla-auth-top'))return true;
  var logo=document.querySelector('#header img[alt="OKLA.cz"],#header img[alt*="okla" i],#header [class*="logo"] img,a[href="/"] img');
  var src=logo?(logo.getAttribute('src')||logo.getAttribute('data-src')||''):'';
  if(!src)return false;                 /* wait until the header logo is in the DOM */
  var cw=document.querySelector('#content-wrapper')||document.querySelector('main#content')||document.body;
  var bar=document.createElement('div');bar.className='okla-auth-top';
  var a=document.createElement('a');a.href='/';a.setAttribute('aria-label','OKLA.cz');
  var img=document.createElement('img');img.src=src;img.alt='OKLA.cz';
  a.appendChild(img);bar.appendChild(a);
  (cw.parentNode||document.body).insertBefore(bar,cw);
  return true;
 }

 /* Plain end-customer registration: select "Koncový zákazník", drop the type
    choice and the optional "Fakturační adresa / Nakupuji na firmu" company box. */
 function simplifyRegistration(){
  if(!isReg())return;
  var retail=document.querySelector('#retail,input[name="customerGroupId"][value="1"]');
  if(retail&&!retail.checked){retail.checked=true;try{retail.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
  /* Inline display:none — the theme sets display:grid!important on these
     fieldsets, so a class alone loses the specificity war. */
  function hide(el){if(!el)return;el.classList.add('okla-auth-hide');el.style.setProperty('display','none','important');}
  hide(document.querySelector('fieldset.co-registration'));
  var fsets=document.querySelectorAll('#register-form fieldset,form.registration-form fieldset');
  [].slice.call(fsets).forEach(function(fs){
   var h=fs.querySelector('h2,h3,legend');
   if(h&&/fakturačn[íi] adresa/i.test(h.textContent)){
    hide(fs);
    var cb=fs.querySelector('input[type="checkbox"]');
    if(cb&&cb.checked){cb.checked=false;try{cb.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
   }
  });
 }

 var logoDone=false;
 function run(){
  if(!isAuth())return;
  if(!logoDone)logoDone=logoBar();
  simplifyRegistration();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run,{once:true});
 [200,600,1400].forEach(function(t){setTimeout(run,t);});
 if(window.MutationObserver){
  var tries=0;
  var mo=new MutationObserver(function(){run();if(++tries>60)mo.disconnect();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
