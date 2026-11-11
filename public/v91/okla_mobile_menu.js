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
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  orders:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="m9 13 2 2 4-4"/>',
  truck:'<path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  claim:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 16.7 7.3 20l5.3-5.3a4 4 0 0 0 5.1-5.4l-2.4 2.4-2.4-.6-.6-2.4z"/>',
  back:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
  card:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  account:'<circle cx="12" cy="9" r="3.5"/><path d="M5.5 19c1.2-3 3.7-4.5 6.5-4.5s5.3 1.5 6.5 4.5"/><circle cx="12" cy="12" r="9"/>',
  logout:'<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>'
 };
 function svg(name){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.innerHTML=ICONS[name];return s}
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
