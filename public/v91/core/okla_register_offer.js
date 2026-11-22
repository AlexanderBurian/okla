/* Okla – the registration offer: a visitor who is not signed in sees, shortly after the page is shown, one calm window
   in the middle of the screen (the page dimmed behind it) - the blue Okla gift on top, "Máme pro vás dárek!", that
   a registered customer has 5 % off all purchases, for good, "Chci slevu 5 %" (to the registration) and "Už mám účet"
   (to the sign-in). On phones and PC alike (okla_register_offer.css).
   - once, then again two days later at the earliest (kept on the device; a signed-in customer never sees it);
   - not in the cart, the order process, on the sign-in / registration / password pages or in the customer centre;
   - it waits until the shop's cookie bar is answered, so the two never sit on top of each other;
   - closed with the cross, a click outside, Escape or the phone's Back button. */
(function(){
 'use strict';
 if(window.__oklaRegisterOffer)return;window.__oklaRegisterOffer=true;
 var KEY='okla-register-offer',EVERY=2*24*3600*1000;
 var TEXT={
  cs:{title:'Máme pro vás <em>dárek</em>!',text:'Zaregistrujte se a jako registrovaný zákazník budete mít slevu <b>5&nbsp;% na všechny nákupy navždy</b>.',cta:'Chci slevu 5 %',login:'Už mám účet – přihlásit se',close:'Zavřít'},
  sk:{title:'Máme pre vás <em>darček</em>!',text:'Zaregistrujte sa a ako registrovaný zákazník budete mať zľavu <b>5&nbsp;% na všetky nákupy navždy</b>.',cta:'Chcem zľavu 5 %',login:'Už mám účet – prihlásiť sa',close:'Zavrieť'},
  en:{title:'We have a <em>gift</em> for you!',text:'Register and as a registered customer you get <b>5&nbsp;% off all your purchases, for good</b>.',cta:'I want 5 % off',login:'I already have an account – sign in',close:'Close'},
  hu:{title:'<em>Ajándékunk</em> van az Ön számára!',text:'Regisztráljon, és regisztrált vásárlóként <b>örökre 5&nbsp;% kedvezményt kap minden vásárlásából</b>.',cta:'Kérem az 5 % kedvezményt',login:'Már van fiókom – bejelentkezés',close:'Bezárás'}
 };
 function words(){var l=window.OKLA_LANG||document.documentElement.getAttribute('data-okla-lang')||'cs';return TEXT[l]||TEXT.cs}
 function signedIn(){return !document.querySelector('#navigation a[data-testid="signin"],.top-navigation-bar .top-nav-button-login')}
 function wrongPage(){
  var b=document.body;
  return /^\/(login|registrace|zapomenute-heslo|klient|kosik|objednavka|odhlasit|logout)(\/|$)/i.test(location.pathname)
   ||!!(b&&/(^|\s)(ordering-process|in-klient|in-login|in-registrace)/.test(b.className));
 }
 function due(){try{var t=+localStorage.getItem(KEY)||0;return Date.now()-t>=EVERY}catch(e){return false}}
 function remember(){try{localStorage.setItem(KEY,String(Date.now()))}catch(e){}}
 /* the bar is fixed to the screen (offsetParent is always null there): it counts as open while it has a size and is shown */
 function cookieBarOpen(){
  return [].some.call(document.querySelectorAll('.siteCookies,.js-siteCookies'),function(c){
   var cs=getComputedStyle(c),r=c.getBoundingClientRect();
   return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>0&&r.width>0&&r.height>0;
  });
 }

 var box,lastFocus,pushed=false;
 function show(){
  if(box||signedIn()||wrongPage()||!due())return;
  remember();
  var w=words(),base=window.__oklaAssetBase||'';
  box=document.createElement('div');box.className='okla-ro';
  box.innerHTML='<div class="okla-ro__dim"></div>'+
   '<div class="okla-ro__card" role="dialog" aria-modal="true" aria-labelledby="okla-ro-title" tabindex="-1">'+
    '<img class="okla-ro__gift" src="'+base+'v91/img/promo/okla-gift-register.webp" alt="" width="520" height="451" decoding="async">'+
    '<button type="button" class="okla-ro__close" aria-label="'+w.close+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'+
    '<h2 class="okla-ro__title" id="okla-ro-title">'+w.title+'</h2>'+
    '<p class="okla-ro__text">'+w.text+'</p>'+
    '<a class="okla-ro__cta" href="/registrace/">'+w.cta+'</a>'+
    '<a class="okla-ro__login" href="/login/">'+w.login+'</a>'+
   '</div>';
  box.setAttribute('data-okla-i18n-skip','');
  document.body.appendChild(box);
  lastFocus=document.activeElement;
  document.documentElement.classList.add('okla-ro-open');
  requestAnimationFrame(function(){requestAnimationFrame(function(){if(box)box.classList.add('is-in')})});
  var card=box.querySelector('.okla-ro__card');
  try{card.focus({preventScroll:true})}catch(e){}
  box.querySelector('.okla-ro__close').addEventListener('click',function(){hide(true)});
  box.querySelector('.okla-ro__dim').addEventListener('click',function(){hide(true)});
  box.addEventListener('keydown',function(e){
   if(e.key==='Escape'){e.preventDefault();hide(true);return}
   if(e.key!=='Tab')return;
   var f=[].slice.call(card.querySelectorAll('a,button')),first=f[0],last=f[f.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });
  /* the phone's Back button closes the window instead of leaving the page */
  try{history.pushState({oklaRegisterOffer:1},'');pushed=true}catch(e){pushed=false}
 }
 function hide(fromUser){
  if(!box)return;
  var b=box;box=null;
  b.classList.remove('is-in');
  document.documentElement.classList.remove('okla-ro-open');
  setTimeout(function(){b.remove()},220);
  if(pushed){pushed=false;if(fromUser&&history.state&&history.state.oklaRegisterOffer)history.back()}
  if(lastFocus&&lastFocus.focus)try{lastFocus.focus({preventScroll:true})}catch(e){}
 }
 window.addEventListener('popstate',function(){if(box){pushed=false;hide(false)}});
 window.oklaRegisterOffer={show:function(){try{localStorage.removeItem(KEY)}catch(e){}show()},hide:function(){hide(true)}};

 /* shortly after the page is shown; while the cookie bar waits for an answer, after it */
 function start(){
  if(signedIn()||wrongPage()||!due())return;
  var waited=0;
  (function tick(){
   if(box||!due())return;
   if(cookieBarOpen()){if((waited+=1000)<10*60*1000)setTimeout(tick,1000);return}
   setTimeout(show,1200);
  })();
 }
 (function whenShown(){if(window.__oklaRevealed||document.documentElement.classList.contains('okla-ready'))start();else setTimeout(whenShown,200)})();
})();
