/* Okla – PC only (≥992px): a thin grey bar above the header with the help links on the left, and under its right end
   a grey tab with rounded bottom corners holding the phone and the e-mail. Not in the checkout. Phones never see it
   (okla_pc_topbar.css). The phone number is a placeholder for now: change PHONE when the real line is ready. */
(function(){
 'use strict';
 if(window.__oklaPcTopbarV1)return;window.__oklaPcTopbarV1=true;
 var b=document.body;if(!b||/(^|\s)(in-kosik|in-krok-\d|ordering-process|in-objednavka|in-dokonceni)/.test(b.className))return;

 var PHONE='+420 123 456 789';             /* placeholder */
 var MAIL='podpora@okla.cz';
 var LINKS=[
  ['Jak nakupovat','/jak-nakupovat/'],
  ['Doprava a platba','/doprava-a-platba/'],
  ['Vrácení zboží','/vraceni-zbozi-a-odstoupeni/'],
  ['Reklamace','/reklamace/'],
  ['O nás','/o-nas/'],
  ['Newsroom','/nase-novinky/'],
  ['Kontakt','/kontakty/']
 ];
 var ICON={
  gift:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12M12 8v12.5M12 8c-1.2-2.8-4.6-4-5.8-2.4C5.1 7.1 7.7 8 12 8Zm0 0c1.2-2.8 4.6-4 5.8-2.4C18.9 7.1 16.3 8 12 8Z"/></svg>',
  case:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M11 12.5v1.5h2v-1.5"/></svg>',
  phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>'
 };
 function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

 function build(){
  var header=document.getElementById('header');if(!header)return false;
  if(document.getElementById('okla-topbar'))return true;
  var bar=el('div','okla-topbar');bar.id='okla-topbar';
  var inner=el('div','okla-topbar__in');
  var nav=el('nav','okla-topbar__links');nav.setAttribute('aria-label','Nákup a pomoc');
  LINKS.forEach(function(l){var a=el('a','okla-topbar__link');a.href=l[1];a.textContent=l[0];nav.appendChild(a)});
  var tab=el('div','okla-topbar__tab');
  var tel=el('a','okla-topbar__contact',ICON.phone+'<span></span>');tel.href='tel:'+PHONE.replace(/\s+/g,'');tel.lastChild.textContent=PHONE;
  var mail=el('a','okla-topbar__contact',ICON.mail+'<span></span>');mail.href='mailto:'+MAIL;mail.lastChild.textContent=MAIL;
  tab.append(tel,mail);
  var tools=el('div','okla-topbar__tools');
  var signedIn=!document.querySelector('#navigation a[data-testid="signin"],.top-navigation-bar .top-nav-button-login');
  if(!signedIn){
   var gift=el('a','okla-topbar__tool',ICON.gift+'<span>5 % sleva po registraci</span>');gift.href='/registrace/';
   gift.addEventListener('click',function(e){if(window.oklaRegisterOffer&&window.oklaRegisterOffer.show){e.preventDefault();window.oklaRegisterOffer.show()}});
   tools.appendChild(gift);
  }
  var b2b=el('a','okla-topbar__tool',ICON.case+'<span>Velkoobchod</span>');b2b.href='/kontakt/?tema=velkoobchod#okla-contact-form';
  tools.appendChild(b2b);
  inner.append(nav,tools,tab);bar.appendChild(inner);
  header.insertBefore(bar,header.firstChild);
  document.documentElement.classList.add('okla-topbar-on');

  /* the links start at the logo's left edge and the tab ends at the cart's right edge (the header's own row) */
  var pc=window.matchMedia('(min-width:992px)');
  function sync(){
   if(!pc.matches)return;
   var row=header.querySelector('.header-top');if(!row||!row.offsetWidth)return;
   var dz=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--okla-dz'))||1;
   var br=bar.getBoundingClientRect(),rr=row.getBoundingClientRect();
   inner.style.setProperty('padding-left',Math.max(0,(rr.left-br.left)/dz)+'px','important');
   var pr=Math.max(0,(br.right-rr.right)/dz);
   inner.style.setProperty('padding-right',pr+'px','important');
   inner.style.setProperty('--okla-topbar-r',pr+'px');
  }
  sync();window.addEventListener('resize',sync,{passive:true});setTimeout(sync,600);setTimeout(sync,2000);
  if(pc.addEventListener)pc.addEventListener('change',sync);
  return true;
 }
 var tries=0;(function tick(){if(build())return;if(++tries<60)setTimeout(tick,150)})();
})();
