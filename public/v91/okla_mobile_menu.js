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
 var ICONS={
  user:'<circle cx="12" cy="7.25" r="4.25"/><path d="M3.5 21c.35-5.15 3.42-7.8 8.5-7.8s8.15 2.65 8.5 7.8z"/>',
  orders:'<path d="M6 4h2.25A3.8 3.8 0 0 1 12 1a3.8 3.8 0 0 1 3.75 3H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path class="okla-mm-cut" d="m8.2 13 2.35 2.35 5.2-5.2"/>',
  truck:'<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H14v12H8.7a3.2 3.2 0 0 0-6.2 0H2zM15.5 8H19l3 4v4h-1.3a3.2 3.2 0 0 0-6.2 0h-1V10a2 2 0 0 1 2-2z"/><circle cx="5.6" cy="17.5" r="2.4"/><circle cx="17.6" cy="17.5" r="2.4"/>',
  claim:'<path d="M14.5 2.25a6.1 6.1 0 0 0-6.2 7.9L2.9 15.5a2.05 2.05 0 0 0 0 2.9l2.7 2.7a2.05 2.05 0 0 0 2.9 0l5.35-5.4a6.1 6.1 0 0 0 7.9-6.2l-3.9 3.9-3.35-.9-.9-3.35z"/>',
  back:'<path class="okla-mm-line" d="M9.25 4.25 4 9.5l5.25 5.25M4.4 9.5h9.4a6.2 6.2 0 1 1 0 12.4h-2.1"/>',
  chat:'<path d="M3 3h18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 4.25V18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><circle class="okla-mm-dot" cx="7.5" cy="10.5" r="1.3"/><circle class="okla-mm-dot" cx="12" cy="10.5" r="1.3"/><circle class="okla-mm-dot" cx="16.5" cy="10.5" r="1.3"/>',
  card:'<rect x="2" y="4" width="20" height="16" rx="2.5"/><rect class="okla-mm-dot" x="4.5" y="8" width="15" height="2" rx="1"/><rect class="okla-mm-dot" x="5" y="14" width="5" height="1.8" rx=".9"/>',
  info:'<circle cx="12" cy="12" r="10"/><path class="okla-mm-cut" d="M12 10.5v6M12 7.2v.15"/>',
  account:'<circle cx="12" cy="7.8" r="4.1"/><path d="M4.2 21c.5-4.8 3.35-7.25 7.8-7.25S19.3 16.2 19.8 21z"/>',
  logout:'<path class="okla-mm-line" d="M13.5 3.5h4A2.5 2.5 0 0 1 20 6v12a2.5 2.5 0 0 1-2.5 2.5h-4M10 16l-4-4 4-4M6 12h10"/>',
  chevron:'<path class="okla-mm-line" d="m9 6 6 6-6 6"/>'
 };
 function svg(name){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');s.classList.add('okla-mm-svg','okla-mm-svg--'+name);s.innerHTML=ICONS[name];return s}
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
