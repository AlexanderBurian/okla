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
  globe:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
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
  /* the right end of the band: two drop-downs, as on the reference shop - the language (moved here from the header, so it
     is not there twice) and "Pro firmy" (wholesale and advice, straight into the contact form with that subject) */
  var tools=el('div','okla-topbar__tools');
  var CHEV='<svg class="okla-topbar__chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.75 6 6.25l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var open=null;
  function dropdown(icon,label,aria,fill){
   var wrap=el('div','okla-topbar__dd');
   var btn=el('button','okla-topbar__tool',icon+'<span></span>'+CHEV);btn.type='button';btn.querySelector('span').textContent=label;
   btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label',aria);
   var menu=el('div','okla-topbar__menu');menu.setAttribute('role','menu');menu.hidden=true;fill(menu);
   function set(on){menu.hidden=!on;btn.setAttribute('aria-expanded',on?'true':'false');wrap.classList.toggle('is-open',on);if(on){if(open&&open!==set)open(false);open=set}else if(open===set)open=null}
   btn.addEventListener('click',function(e){e.stopPropagation();set(menu.hidden)});
   wrap.append(btn,menu);return wrap;
  }
  document.addEventListener('click',function(e){if(open&&!bar.contains(e.target))open(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)open(false)});
  var L=window.oklaLang;
  if(L){
   tools.appendChild(dropdown(ICON.globe,({cs:'CZ',en:'EN',sk:'SK',hu:'HU'})[L.current]||L.current.toUpperCase(),'Jazyk webu: '+L.label[L.current],function(menu){
    L.langs.forEach(function(code){
     var o=el('button','okla-topbar__opt'+(code===L.current?' is-current':''));o.type='button';o.setAttribute('role','menuitem');o.setAttribute('lang',code);
     o.appendChild(L.flag(code));var s=el('span');s.textContent=L.label[code];o.appendChild(s);
     o.addEventListener('click',function(){L.choose(code)});menu.appendChild(o);
    });
   }));
   document.documentElement.classList.add('okla-topbar-lang');
  }
  tools.appendChild(dropdown(ICON.case,'Pro firmy','Pro firmy',function(menu){
   [['Velkoobchod a spolupráce','velkoobchod'],['Poradenství s výběrem','poradenstvi']].forEach(function(x){
    var o=el('a','okla-topbar__opt');o.setAttribute('role','menuitem');o.href='/kontakt/?tema='+x[1]+'#okla-contact-form';o.textContent=x[0];menu.appendChild(o);
   });
  }));
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
