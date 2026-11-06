/* OKLA V114 – mobile footer call-to-action enhancement.
   On phones the desktop QR-to-email becomes an actual tap-to-email link.
   Original QR, markup and desktop functionality stay in place. */
(function(){
 'use strict';
 if(window.__oklaFooterPromoMobileV114)return;
 window.__oklaFooterPromoMobileV114=true;
 var observer=null;

 function install(){
  var banner=document.getElementById('okla-footer-promo');
  if(!banner)return false;
  var qr=banner.querySelector('.okla-promo-qr');
  var column=banner.querySelector('.okla-promo-qrcol');
  if(!qr||!column)return false;
  if(!column.querySelector('.okla-promo-mobile-mail')){
   var a=document.createElement('a');
   a.className='okla-promo-mobile-mail';
   a.href=qr.getAttribute('href')||'mailto:podpora@okla.cz';
   a.rel='nofollow';
   a.setAttribute('aria-label','Napsat e-mail podpoře OKLA');
   a.textContent='Napsat podpoře';
   column.appendChild(a);
  }
  return true;
 }
 function start(){
  if(install())return;
  if(!window.MutationObserver)return;
  observer=new MutationObserver(function(){
   if(install()){observer.disconnect();observer=null}
  });
  observer.observe(document.body||document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',function(){if(observer&&install()){observer.disconnect();observer=null}},{once:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
