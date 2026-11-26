/* Okla – PC only (≥992px): a thin grey bar above the header with the help links on the left, and under its right end
   a grey tab with rounded bottom corners holding the phone and the e-mail. Not in the checkout. Phones never see it
   (okla_pc_topbar.css). The phone number is a placeholder for now: change PHONE when the real line is ready. */
(function(){
 'use strict';
 if(window.__oklaPcTopbarV1)return;window.__oklaPcTopbarV1=true;
 var b=document.body;if(!b||/(^|\s)(in-kosik|in-krok-\d|ordering-process|in-objednavka|in-dokonceni)/.test(b.className))return;

 var PHONE='+420 123 456 789';             /* placeholder */
 var MAIL='podpora@okla.cz';
 /* the currency and the prices with / without VAT are off for now (the band holds the pages only); true brings them back */
 var TOOLS=false;
 var LINKS=[
  ['Jak nakupovat','/jak-nakupovat/'],
  ['Doprava a platba','/doprava-a-platba/'],
  ['Vrácení zboží','/vraceni-zbozi-a-odstoupeni/'],
  ['Reklamace','/reklamace/'],
  ['O nás','/o-nas/'],
  ['Newsroom','/nase-novinky/'],
  ['Stav objednávky','/stav-objednavky/'],
  ['Obchodní podmínky','/obchodni-podminky/'],
  ['Kontakt','/kontakty/']
 ];
 var ICON={
  cash:'<svg viewBox="0 0 28 18" aria-hidden="true"><rect x="1" y="1.5" width="26" height="15" rx="2"/><path d="M5 5.5c1.4 0 2.2-.8 2.2-2M21 5.5c-1.4 0-2.2-.8-2.2-2M5 12.5c1.4 0 2.2.8 2.2 2M21 12.5c-1.4 0-2.2.8-2.2 2"/><ellipse cx="14" cy="9" rx="3.2" ry="3.6"/></svg>',
  receipt:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8.2 15.8 7.6-7.6"/><circle cx="8.9" cy="8.9" r="1.5"/><circle cx="15.1" cy="15.1" r="1.5"/></svg>',
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
  /* a dot of its own between the links, so the links spread across the band with each dot in the middle of its gap */
  LINKS.forEach(function(l,i){if(i){var d=el('span','okla-topbar__dot');d.setAttribute('aria-hidden','true');nav.appendChild(d)}var a=el('a','okla-topbar__link');a.href=l[1];a.textContent=l[0];nav.appendChild(a)});
  var tab=el('div','okla-topbar__tab');
  var tel=el('a','okla-topbar__contact',ICON.phone+'<span></span>');tel.href='tel:'+PHONE.replace(/\s+/g,'');tel.lastChild.textContent=PHONE;
  var mail=el('a','okla-topbar__contact',ICON.mail+'<span></span>');mail.href='mailto:'+MAIL;mail.lastChild.textContent=MAIL;
  tab.append(tel,mail);
  /* the right end of the band: two drop-downs, as on the reference shop - the currency and prices with / without VAT */
  var tools=el('div','okla-topbar__tools');
  var CHEV='<svg class="okla-topbar__chev" viewBox="0 0 14 8" aria-hidden="true"><path d="M1 1.2 7 6.8l6-5.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHECK='<svg class="okla-topbar__check" viewBox="0 0 12 9" aria-hidden="true"><path d="M1 4.6 4.3 7.8 11 1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var open=null;
  function dropdown(icon,label,aria,fill){
   var wrap=el('div','okla-topbar__dd');
   var btn=el('button','okla-topbar__tool',icon+'<span></span>'+CHEV);btn.type='button';btn.querySelector('span').textContent=label;
   btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label',aria);
   var menu=el('div','okla-topbar__menu');menu.setAttribute('role','menu');menu.hidden=true;
   function set(on){menu.hidden=!on;btn.setAttribute('aria-expanded',on?'true':'false');wrap.classList.toggle('is-open',on);if(on){if(open&&open!==set)open(false);open=set}else if(open===set)open=null}
   fill(menu,function(text){btn.querySelector('span').textContent=text},function(){set(false)});
   btn.addEventListener('click',function(e){e.stopPropagation();set(menu.hidden)});
   wrap.append(btn,menu);return wrap;
  }
  function option(text,current,extra,icon){var o=el('button','okla-topbar__opt'+(current?' is-current':''));o.type='button';o.setAttribute('role','menuitemradio');o.setAttribute('aria-checked',current?'true':'false');if(icon)o.insertAdjacentHTML('beforeend',icon);var s=el('span');s.textContent=text;o.appendChild(s);if(extra){var x=el('small');x.textContent=extra;o.appendChild(x)}o.insertAdjacentHTML('beforeend',CHECK);return o}
  document.addEventListener('click',function(e){if(open&&!bar.contains(e.target))open(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)open(false)});
  /* the currency: the shop sells in Czech crowns; the euro is announced, not yet selectable */
  tools.appendChild(dropdown(ICON.cash,'CZK','Měna: česká koruna',function(menu){
   menu.appendChild(option('CZK',true,'',ICON.cash));
   var eur=option('EUR',false,'připravujeme',ICON.cash);eur.disabled=true;eur.setAttribute('aria-disabled','true');menu.appendChild(eur);
  }));
  /* prices with or without VAT: for now only the choice itself - the prices stay as the shop counts them */
  tools.appendChild(dropdown(ICON.receipt,'s DPH','Ceny s DPH nebo bez DPH',function(menu,setLabel,close){
   var gross=option('s DPH',true,'',ICON.receipt),net=option('bez DPH',false,'',ICON.receipt);
   function pick(isNet){gross.classList.toggle('is-current',!isNet);net.classList.toggle('is-current',isNet);gross.setAttribute('aria-checked',String(!isNet));net.setAttribute('aria-checked',String(isNet));setLabel(isNet?'bez DPH':'s DPH');close()}
   gross.addEventListener('click',function(){pick(false)});net.addEventListener('click',function(){pick(true)});
   menu.append(gross,net);
  }));
  if(TOOLS)inner.append(nav,tools,tab);else{inner.append(nav,tab);bar.classList.add('okla-topbar--pages')}bar.appendChild(inner);
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
