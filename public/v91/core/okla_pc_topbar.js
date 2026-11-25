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
  ['Kontakt','/kontakty/']
 ];
 var ICON={
  phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.8h2.6l1.4 3.9-1.9 1.3a11 11 0 0 0 6.3 6.3l1.3-1.9 3.9 1.4v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 6a2 2 0 0 1 2-2.2Z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg>'
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
  inner.append(nav,tab);bar.appendChild(inner);
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
