/* OKLA – mobile bottom bar "Menu" = the customer centre (like the account menu
   of big shops): sign-in / registration on top, then the customer's shopping and
   service links. "Katalog" keeps opening the categories.
   The bottom bar and its drawer (#okla-v61-drawer) are built by okla_behavior.js;
   its own click handler opens the drawer first (same panel, animation, close and
   focus handling as Katalog), then this delegated listener swaps the content. */
(function(){
 'use strict';
 if(window.__oklaMobileMenuV1)return;window.__oklaMobileMenuV1=true;
 var NS='http://www.w3.org/2000/svg';
 /* Pictograms on a 32px grid (the same set as Jak nakupovat): navy line work, one blue detail (class "a"), solid dots
    (class "f"). */
 var ICONS={
  user:'<circle cx="16" cy="16" r="12.5"/><circle class="a" cx="16" cy="13" r="4"/><path d="M8.6 25.4c1.5-3.7 4.3-5.4 7.4-5.4s5.9 1.7 7.4 5.4"/>',
  account:'<circle cx="16" cy="16" r="12.5"/><circle class="a" cx="16" cy="13" r="4"/><path d="M8.6 25.4c1.5-3.7 4.3-5.4 7.4-5.4s5.9 1.7 7.4 5.4"/>',
  orders:'<path d="M10 6.5H8.5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-18a2 2 0 0 0-2-2H22"/><path d="M12 4h8a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 20 9h-8a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 12 4z"/><path class="a" d="M11 18.5l3.3 3.3L21 15"/>',
  claim:'<path d="M16 3.5l10.5 4v7.7c0 6.3-4.4 11-10.5 13.3C9.9 26.2 5.5 21.5 5.5 15.2V7.5z"/><path class="a" d="M11.5 16l3.2 3.2 6-6.4"/>',
  back:'<path d="M7 11h14a7 7 0 0 1 0 14h-7"/><path class="a" d="M12 6 7 11l5 5"/>',
  chat:'<path d="M6.5 5h19A2.5 2.5 0 0 1 28 7.5v12a2.5 2.5 0 0 1-2.5 2.5H14l-6 5v-5H6.5A2.5 2.5 0 0 1 4 19.5v-12A2.5 2.5 0 0 1 6.5 5z"/><circle class="f a" cx="11" cy="13.5" r="1.6"/><circle class="f a" cx="16" cy="13.5" r="1.6"/><circle class="f a" cx="21" cy="13.5" r="1.6"/>',
  truck:'<g transform="translate(0 2)"><path d="M10.5 22h-1A1.5 1.5 0 0 1 8 20.5v-12A1.5 1.5 0 0 1 9.5 7h9A1.5 1.5 0 0 1 20 8.5V22"/><path d="M15.5 22h5"/><path d="M20 12h4.6a1.5 1.5 0 0 1 1.2.6l3.9 5.2a1.5 1.5 0 0 1 .3.9v1.8a1.5 1.5 0 0 1-1.5 1.5h-3"/><path class="a" d="M2 11h3.5M3 15.5h2.5"/><circle cx="13" cy="22" r="2.5"/><circle cx="23" cy="22" r="2.5"/></g>',
  card:'<path d="M6.5 7h19A2.5 2.5 0 0 1 28 9.5v13a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 22.5v-13A2.5 2.5 0 0 1 6.5 7z"/><path class="a" d="M4 12.5h24M8.5 20h5"/>',
  info:'<circle cx="16" cy="16" r="12.5"/><path class="a" d="M16 14.5v8"/><circle class="f a" cx="16" cy="10.2" r="1.6"/>',
  logout:'<path d="M14 5.5H8.5a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2H14"/><path class="a" d="M19 11l5 5-5 5M24 16H12.5"/>',
  chevron:'<path class="okla-mm-line" d="m9 6 6 6-6 6"/>'
 };
 function svg(name){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox',name==='chevron'?'0 0 24 24':'0 0 32 32');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');s.classList.add('okla-mm-svg','okla-mm-svg--'+name);s.innerHTML=ICONS[name];return s}
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function row(icon,label,href){
  var a=el('a','okm61-cat-row okla-mm-row');a.href=href;
  a.setAttribute('data-mm-icon',icon);
  var ic=el('span','okm61-category-icon okla-mm-icon');ic.appendChild(svg(icon));
  var ch=el('span','okm61-cat-row-chevron');ch.appendChild(svg('chevron'));
  a.append(ic,el('span','okm61-cat-row-label',label),ch);return a;
 }
 function section(title,rows){var s=el('section','okla-mm-section');s.appendChild(el('h3','okla-mm-title',title));var list=el('div','okm61-drawer-list okla-mm-list');rows.forEach(function(r){list.appendChild(r)});s.appendChild(list);return s}
 /* Shoptet renders its native sign-in button only for guests (same test as okla_login_popup.js). */
 function logoutLink(){
  return [].slice.call(document.querySelectorAll('a[href]')).find(function(a){
   return /logout|odhlas/i.test(a.getAttribute('href')||'')||/^\s*odhl[aá]sit/i.test(a.textContent||'');
  });
 }
 function isGuest(){return !!document.querySelector('.top-navigation-bar .top-nav-button-login')&&!logoutLink()}
 function backTo(){return encodeURIComponent(location.pathname+location.search)}
 function build(body){
  var guest=isGuest();
  var hero=el('section','okla-mm-hero'+(guest?'':' is-logged'));
  var badge=el('span','okla-mm-hero__icon');badge.appendChild(svg('user'));hero.appendChild(badge);
  hero.appendChild(el('h2','okla-mm-hero__title',guest?'Přihlaste se a získáte spoustu výhod':'Váš zákaznický účet'));
  hero.appendChild(el('p','okla-mm-hero__text',guest?'Přehled objednávek, stav doručení, faktury a rychlejší reklamace na jednom místě.':'Objednávky, doklady a osobní údaje na jednom místě.'));
  var actions=el('div','okla-mm-hero__actions');
  if(guest){
   var login=el('a','okla-mm-btn okla-mm-btn--primary','Přihlásit se');login.href='/login/?backTo='+backTo();
   var reg=el('a','okla-mm-btn okla-mm-btn--ghost','Nová registrace');reg.href='/registrace/';
   actions.append(login,reg);
  }else{
   var acc=el('a','okla-mm-btn okla-mm-btn--primary','Můj účet');acc.href='/klient/';
   actions.appendChild(acc);
   var out=logoutLink();if(out){var lo=el('a','okla-mm-btn okla-mm-btn--ghost','Odhlásit se');lo.href=out.getAttribute('href');actions.appendChild(lo)}
  }
  hero.appendChild(actions);
  body.appendChild(hero);
  var accountCard=guest?row('account','Přihlásit se','/login/?backTo='+backTo()):row('account','Otevřít můj účet','/klient/');
  accountCard.classList.add('okla-mm-account-card');
  body.appendChild(accountCard);
  body.appendChild(section('Moje nákupy',[
   row('orders','Objednávky a stav doručení','/stav-objednavky/'),
   row('claim','Reklamace','/reklamace/'),
   row('back','Vrácení zboží','/vraceni-zbozi-a-odstoupeni/')
  ].concat(guest?[]:[row('account','Můj účet','/klient/')])));
  body.appendChild(section('Zákaznický servis',[
   row('chat','Kontakt a podpora','/kontakt/'),
   row('truck','Doprava a platba','/doprava-a-platba/'),
   row('info','O nás','/o-nas/')
  ]));
 }
 document.addEventListener('click',function(e){
  var btn=e.target&&e.target.closest&&e.target.closest('#okla-v61-bottom .okm61-bottom-action');
  if(!btn||btn.getAttribute('aria-label')!=='Menu')return;
  var overlay=document.getElementById('okla-v61-drawer');if(!overlay)return;
  var body=overlay.querySelector('.okm61-drawer-body'),head=overlay.querySelector('.okm61-drawer-head strong');
  if(!body)return;
  body.replaceChildren();build(body);
  if(head){
   head.replaceChildren();
   var logo=el('img','okla-mm-logo');logo.src=(window.__oklaAssetBase||'')+'v91/img/okla-logo.png';logo.alt='OKLA.cz';
   head.appendChild(logo);
  }
  overlay.classList.add('okla-mm-open');
 });
 /* Katalog reuses the same overlay: drop the menu marker when it opens. */
 document.addEventListener('click',function(e){
  var btn=e.target&&e.target.closest&&e.target.closest('#okla-v61-bottom .okm61-bottom-action');
  if(btn&&btn.getAttribute('aria-label')!=='Menu'){var o=document.getElementById('okla-v61-drawer');if(o)o.classList.remove('okla-mm-open')}
 },true);
})();
