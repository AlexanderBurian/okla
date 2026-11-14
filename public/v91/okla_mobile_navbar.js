/* OKLA – phones (≤767px): a normal top navbar instead of the bottom bar.
   Row 1: the logo left; account, cart (with its count) and the menu button right.
   Row 2: the search field (it opens the full-screen phone search of okla_mobile_shell.js).
   The menu button unfolds the menu under the bar: categories, the customer's links and shop information.
   While the header rides along (scrolled, html.okla-m-stuck) only row 1 shows, with the search icon in it.
   The bottom bar (#okla-v61-bottom) is switched off by html.okla-mnb-on (okla_mobile_navbar.css). */
(function(){
 'use strict';
 if(window.__oklaMobileNavbarV1)return;window.__oklaMobileNavbarV1=true;
 var root=document.documentElement,mq=window.matchMedia('(max-width:767px)'),base=window.__oklaAssetBase||'';
 var NS='http://www.w3.org/2000/svg';
 var ICON={
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.9 4-5.8 7.5-5.8s6.3 1.9 7.5 5.8"/>',
  cart:'<path d="M2.5 3.5h2.6l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1l1.8-7.3H6"/><circle cx="9.5" cy="19.6" r="1.4"/><circle cx="17" cy="19.6" r="1.4"/>',
  menu:'<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.6 15.6 4.4 4.4"/>',
  chevron:'<path d="m9.5 6 6 6-6 6"/>',
  orders:'<path d="M8 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H16"/><rect x="8" y="3" width="8" height="3.4" rx="1"/><path d="m8.8 13.4 2.3 2.3 4.4-4.6"/>',
  claim:'<path d="M12 3 19.5 6v5.6c0 4.6-3.2 8-7.5 9.4-4.3-1.4-7.5-4.8-7.5-9.4V6z"/><path d="m8.8 12 2.3 2.3 4.3-4.6"/>',
  back:'<path d="M5.5 8.5H16a4.5 4.5 0 0 1 0 9h-5"/><path d="M9 5 5.5 8.5 9 12"/>',
  truck:'<path d="M3 6.5h10.5v10H3zM13.5 10h4l3 3.5v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  chat:'<path d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4.5 3.5v-3.5H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  book:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z"/>',
  news:'<path d="M4 5h12v14H6a2 2 0 0 1-2-2zM16 9h4v8a2 2 0 0 1-2 2h-2"/><path d="M7.5 9h5M7.5 12.5h5M7.5 16h3"/>'
 };
 /* the same category pictograms as the Katalog panel (okla_behavior.js) */
 var CAT_IMG={'elektronicke multitooly':'multitooly.png','chytra elektronika':'chytra-elektronika.png','merici technika a naradi':'merici-technika.png','endoskopy a inspekcni kamery':'endoskopy.png','endoskopy':'endoskopy.png','prakticke vychytavky':'prakticke-vychytavky.png','designove gadgety':'designove-gadgety.png','projektory a obraz':'projektory.png','chytra domacnost':'chytra-domacnost.png','prislusenstvi':'prislusenstvi.svg'};
 function norm(t){return (t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[,+]/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}
 function svg(name){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');s.innerHTML=ICON[name];return s}
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}

 function logoutLink(){
  return [].slice.call(document.querySelectorAll('a[href]')).find(function(a){
   return /logout|odhlas/i.test(a.getAttribute('href')||'')||/^\s*odhl[aá]sit/i.test(a.textContent||'');
  });
 }
 function isGuest(){return !!document.querySelector('.top-navigation-bar .top-nav-button-login')&&!logoutLink()}
 function backTo(){return encodeURIComponent(location.pathname+location.search)}
 function cartHref(){var a=document.querySelector('#header a.cart-count');var h=a&&a.getAttribute('href');return h&&h!=='#'?h:'/kosik/'}

 function categories(){
  var q=document.querySelectorAll('#navigation .menu-level-1 > li > a[href],#content-wrapper aside.sidebar #categories .topic>a[href],#content-wrapper aside.sidebar .box-categories .topic>a[href],.box-categories #categories a[href]');
  var seen={},out=[];
  [].forEach.call(q,function(a){
   var label=(a.textContent||'').replace(/\s+/g,' ').trim(),href=a.getAttribute('href');
   if(!label||!href||href==='#'||seen[href]||!CAT_IMG[norm(label)])return;
   seen[href]=1;out.push({label:/endoskop/i.test(label)?'Endoskopy':label,href:href,img:CAT_IMG[norm(label)]});
  });
  return out.slice(0,12);
 }

 /* ---------- the bar ---------- */
 var menu=null,burger=null;
 function build(){
  var shell=document.getElementById('okla-v61-header'),top=shell&&shell.querySelector('.okm61-top');
  if(!top)return false;
  if(top.querySelector('.okla-mnb-actions'))return true;
  var acts=el('div','okla-mnb-actions');
  var guest=isGuest();
  var acc=el('a','okla-mnb-btn okla-mnb-account');acc.href=guest?'/login/?backTo='+backTo():'/klient/';
  acc.setAttribute('aria-label',guest?'Přihlásit se':'Můj účet');acc.appendChild(svg('user'));
  var cart=el('a','okla-mnb-btn okla-mnb-cart');cart.href=cartHref();cart.setAttribute('aria-label','Košík');cart.appendChild(svg('cart'));
  var badge=el('b','okla-mnb-count');badge.hidden=true;badge.setAttribute('aria-hidden','true');badge.__oktc=1;cart.appendChild(badge);
  burger=el('button','okla-mnb-btn okla-mnb-burger');burger.type='button';
  burger.setAttribute('aria-label','Menu');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-controls','okla-mnb-menu');
  burger.append(svg('menu'),svg('close'));
  burger.addEventListener('click',function(){toggle()});
  acts.append(acc,cart,burger);
  top.appendChild(acts);
  if(/^\/(kosik|objednavka)(\/|$)/.test(location.pathname))cart.classList.add('is-active');

  /* row 2: the search field */
  var row=el('div','okla-mnb-search');
  var field=el('button','okla-mnb-search__field');field.type='button';field.setAttribute('aria-label','Hledat');
  var ph=el('span','okla-mnb-search__text','Napište, co hledáte');ph.__oktc=1;
  field.append(ph,svg('search'));
  field.addEventListener('click',function(){
   close(true);
   var open=document.querySelector('#okla-v61-header .okla-m-search-open');
   if(open)open.click();else location.href='/vyhledavani/';
  });
  row.appendChild(field);
  top.parentNode.insertBefore(row,top.nextSibling);

  cartCount(cart,badge);
  root.classList.add('okla-mnb-on');
  return true;
 }

 function cartCount(cart,badge){
  function read(){
   var i=document.querySelector('#header a.cart-count [data-testid="headerCartCount"]')||document.querySelector('#header a.cart-count i');
   var n=parseInt(((i&&i.textContent)||'').replace(/\D+/g,''),10)||0;
   badge.textContent=n>99?'99+':String(n);badge.hidden=!n;
   cart.setAttribute('aria-label',n?'Košík, '+n+' ks':'Košík');
  }
  read();
  var head=document.getElementById('header'),queued=false;
  if(head&&window.MutationObserver)new MutationObserver(function(m){
   if(queued)return;
   /* our own badge changes do not count */
   if(m.every(function(r){return badge.contains(r.target)||r.target===badge}))return;
   queued=true;requestAnimationFrame(function(){queued=false;read()});
  }).observe(head,{childList:true,subtree:true,characterData:true});
 }

 /* ---------- the menu ---------- */
 function row(href,label,icon,img){
  var a=el('a','okla-mnb-row');a.href=href;
  var ic=el('span','okla-mnb-row__ic');
  if(img){var im=el('img');im.src=base+'v91/img/cat/'+img;im.alt='';im.loading='lazy';ic.appendChild(im)}else ic.appendChild(svg(icon));
  var lab=el('span','okla-mnb-row__label',label);lab.__oktc=1;
  var ch=el('span','okla-mnb-row__chev');ch.appendChild(svg('chevron'));
  a.append(ic,lab,ch);return a;
 }
 function section(title,rows,cls){
  var s=el('section','okla-mnb-sec'+(cls?' '+cls:''));
  var h=el('h3','okla-mnb-sec__title',title);h.__oktc=1;s.appendChild(h);
  var list=el('div','okla-mnb-list');rows.forEach(function(r){list.appendChild(r)});s.appendChild(list);return s;
 }
 function fill(){
  var body=menu.querySelector('.okla-mnb-menu__body');body.replaceChildren();
  var guest=isGuest();
  /* account strip */
  var accSec=el('section','okla-mnb-acc');
  var ic=el('span','okla-mnb-acc__ic');ic.appendChild(svg('user'));
  var txt=el('div','okla-mnb-acc__txt');
  var t1=el('strong','',guest?'Můj účet':'Váš zákaznický účet');t1.__oktc=1;
  var t2=el('span','',guest?'Objednávky, doručení a reklamace na jednom místě':'Objednávky, doklady a osobní údaje');t2.__oktc=1;
  txt.append(t1,t2);
  var btns=el('div','okla-mnb-acc__btns');
  if(guest){
   var li=el('a','okla-mnb-acc__primary','Přihlásit se');li.href='/login/?backTo='+backTo();
   var rg=el('a','okla-mnb-acc__ghost','Registrace');rg.href='/registrace/';
   btns.append(li,rg);
  }else{
   var my=el('a','okla-mnb-acc__primary','Můj účet');my.href='/klient/';btns.appendChild(my);
   var out=logoutLink();if(out){var lo=el('a','okla-mnb-acc__ghost','Odhlásit se');lo.href=out.getAttribute('href');btns.appendChild(lo)}
  }
  accSec.append(ic,txt,btns);
  body.appendChild(accSec);
  var cats=categories();
  if(cats.length)body.appendChild(section('Kategorie',cats.map(function(c){return row(c.href,c.label,null,c.img)}),'okla-mnb-sec--cats'));
  body.appendChild(section('Moje nákupy',[
   row('/stav-objednavky/','Objednávky a stav doručení','orders'),
   row('/reklamace/','Reklamace','claim'),
   row('/vraceni-zbozi-a-odstoupeni/','Vrácení zboží','back')
  ]));
  body.appendChild(section('Informace',[
   row('/jak-nakupovat/','Jak nakupovat','book'),
   row('/doprava-a-platba/','Doprava a platba','truck'),
   row('/nase-novinky/','Novinky','news'),
   row('/kontakt/','Kontakt a podpora','chat'),
   row('/o-nas/','O nás','info')
  ]));
 }
 function ensureMenu(){
  if(menu)return menu;
  menu=el('div');menu.id='okla-mnb-menu';menu.hidden=true;
  menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Menu');
  var panel=el('div','okla-mnb-menu__panel'),body=el('nav','okla-mnb-menu__body');body.setAttribute('aria-label','Menu');
  panel.appendChild(body);menu.appendChild(panel);
  menu.addEventListener('click',function(e){
   if(e.target===menu){close();return}
   if(e.target.closest&&e.target.closest('a[href]'))close(true);
  });
  document.body.appendChild(menu);
  return menu;
 }
 var closeTimer=null;
 function isOpen(){return !!menu&&!menu.hidden&&menu.classList.contains('is-open')}
 function open(){
  ensureMenu();clearTimeout(closeTimer);
  fill();
  var h=document.getElementById('okla-v61-header');
  /* the header is shown in full while the menu is open */
  root.classList.remove('okla-m-hidden');
  var top=h?Math.max(0,Math.round(h.getBoundingClientRect().bottom)):56;
  menu.style.setProperty('--okla-mnb-top',top+'px');
  menu.hidden=false;
  menu.getBoundingClientRect();
  menu.classList.add('is-open');
  root.classList.add('okla-mnb-open','okla-m-lock');
  burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Zavřít menu');
 }
 function close(instant){
  if(!menu||menu.hidden)return;
  menu.classList.remove('is-open');
  root.classList.remove('okla-mnb-open');
  if(!document.querySelector('.okla-m-search.is-open'))root.classList.remove('okla-m-lock');
  if(burger){burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Menu')}
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(instant||reduce)menu.hidden=true;else closeTimer=setTimeout(function(){menu.hidden=true},260);
 }
 function toggle(){if(isOpen())close();else open()}
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen()){close();if(burger)burger.focus()}});
 if(mq.addEventListener)mq.addEventListener('change',function(){if(!mq.matches)close(true)});
 window.addEventListener('pageshow',function(){close(true)});

 /* the Shoptet header and our phone header are built by other scripts: wait for them */
 function start(){
  if(!mq.matches)return;
  var tries=0;
  (function tick(){if(build())return;if(++tries<60)setTimeout(tick,100)})();
 }
 if(mq.matches)start();
 else if(mq.addEventListener)mq.addEventListener('change',function h(){if(mq.matches){mq.removeEventListener('change',h);start()}});
})();
