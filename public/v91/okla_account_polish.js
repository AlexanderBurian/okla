/* OKLA V121 – one semantic account navigation, crisp vector icons and a
   symmetrical customer-centre shell. Native forms and destinations stay live. */
(function(){
 'use strict';
 if(window.__oklaAccountPolishV121)return;
 window.__oklaAccountPolishV121=true;
 var ICONS={
  personal:'<circle cx="9" cy="7" r="3"/><path d="M3.5 18c.4-4 2.2-6 5.5-6s5.1 2 5.5 6"/><circle cx="17.5" cy="9" r="2.2"/><path d="M15.3 13.4c2.9-.5 5 .9 5.2 4.1"/>',
  orders:'<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 8V5.8a3 3 0 0 1 6 0V8"/><path d="m9.5 13 1.8 1.8 3.6-3.7"/>',
  payments:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 9h18M6 15h4"/><circle cx="17.5" cy="15" r="1"/>',
  tax:'<path d="M12 4v16M7 6h10M5 8l-3 5h6L5 8Zm14 0-3 5h6l-3-5Z"/><path d="M8 20h8"/>',
  invoices:'<path d="M5 3h11l3 3v15H5V3Z"/><path d="M15 3v4h4M8 11h8M8 14h8M8 17h5"/>',
  credits:'<path d="M4 7a8 8 0 0 1 13-2l2 2M20 17a8 8 0 0 1-13 2l-2-2"/><path d="M19 3v4h-4M5 21v-4h4"/>',
  delivery:'<path d="M2 7h12v10H2V7Zm12 3h4l3 3v4h-7v-7Z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  receipt:'<path d="M5 3h14v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L5 21V3Z"/><path d="M8 8h8M8 12h5M8 16h3"/><path d="m14 15 1.3 1.3 2.4-2.6"/>',
  discount:'<path d="m3 10 7-7h7l4 4v7l-7 7L3 10Z"/><circle cx="14.5" cy="8.5" r="1.5"/><path d="m9 15 6-6"/>',
  review:'<path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 21l1.1-6.2L3 9.4l6.2-.9L12 2.8Z"/>',
  discussion:'<path d="M3 5h18v12H9l-5 4 1.2-4H3V5Z"/><path d="M8 10h8M8 13h5"/>',
  logout:'<path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/>',
  user:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c.4-4.8 2.8-7.2 7-7.2s6.6 2.4 7 7.2"/>'
 };
 var DEFAULT_ORDER=[
  'personal','orders','payments','tax','invoices','credits',
  'delivery','receipt','discount','review','discussion'
 ];
 function getIcon(label,href,index){
  var s=String(label||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  var h=String(href||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  var t=s+' '+h;
  if(/odhlasit|logout|sign.?out|kijelentkez/.test(t))return 'logout';
  if(/diskuz|discussion|vita|hozzaszolas/.test(t))return 'discussion';
  if(/hodnocen|review|rating|ertekeles/.test(t))return 'review';
  if(/slev|discount|kedvezmen|zlav/.test(t))return 'discount';
  if(/prijate|prijatej|received|accepted|kapott/.test(t))return 'receipt';
  if(/dodaci|delivery.note|szallitolevel|szallitas/i.test(t))return 'delivery';
  if(/dobropis|credit.note|helyesbito|jóvair|jóváir/i.test(t))return 'credits';
  if(/zaloh|advance|proforma|eloleg/.test(t))return 'invoices';
  if(/danov|tax|ado|da[nn]ov/.test(t))return 'tax';
  if(/platb|payment|fizetes|fizet/.test(t))return 'payments';
  if(/objednav|order|rendeles|rendel/.test(t))return 'orders';
  if(/osob|personal|profile|profil|moje udaje|adat/.test(t))return 'personal';
  return DEFAULT_ORDER[Math.min(index,DEFAULT_ORDER.length-1)]||'personal';
 }
 function svgFor(type){
  var box=document.createElement('span');
  box.className='okla-acc-menu-icon okla-acc-menu-icon--'+type;
  box.setAttribute('aria-hidden','true');
  box.innerHTML='<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">'+(ICONS[type]||ICONS.personal)+'</svg>';
  return box;
 }
 function linkKey(a,type){
  if(type==='logout')return 'logout';
  var label=String(a.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  var known=/osob|objednav|platb|danov|zaloh|dobropis|dodaci|prijat|slev|hodnocen|diskuz|personal|order|payment|tax|advance|credit|delivery|received|discount|review|discussion/.test(label);
  if(known)return type;
  return String(a.getAttribute('href')||'').replace(/^https?:\/\/[^/]+/,'').replace(/[?#].*$/,'').replace(/\/+$/,'').toLowerCase()||label;
 }
 function removeDuplicateNativeMenus(nav){
  var sidebar=nav.parentElement;
  while(sidebar&&sidebar.parentElement&&!sidebar.matches('aside,.sidebar,.okla-acc-shell__nav'))sidebar=sidebar.parentElement;
  if(!sidebar)return;
  [].slice.call(sidebar.querySelectorAll('.okla-acc-nav')).forEach(function(other){
   if(other!==nav)other.classList.add('okla-acc-native-hide');
  });
  [].slice.call(sidebar.querySelectorAll('ul,ol,nav,.sidebar-inner,.box')).forEach(function(shell){
   if(shell===nav||shell.contains(nav)||nav.contains(shell))return;
   var anchors=[].slice.call(shell.querySelectorAll('a[href]'));
   if(!anchors.length)return;
   var account=anchors.filter(function(a){
    var t=(a.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    return /^moje\s/.test(t)||/^odhl[aá]sit/.test(t);
   });
   if(account.length>=3&&account.length/anchors.length>=.6)shell.classList.add('okla-acc-native-hide');
  });
  [].slice.call(sidebar.querySelectorAll('h1,h2,h3,h4,.box-heading,.sidebar-heading')).forEach(function(el){
   if(nav.contains(el))return;
   var text=(el.textContent||'').replace(/\s+/g,' ').trim();
   if(/^(z[aá]kaznick[eé]|klientsk[eé])\s+centrum$/i.test(text))el.classList.add('okla-acc-native-hide');
  });
 }
 function decorateNav(nav){
  if(!nav)return;
  nav.setAttribute('aria-label','Zákaznické centrum');
  var head=nav.querySelector('.okla-acc-nav__head');
  if(head&&!head.querySelector('.okla-acc-head-icon')){
   var person=svgFor('user');person.className='okla-acc-head-icon okla-acc-menu-icon okla-acc-menu-icon--user';
   head.insertBefore(person,head.firstChild);
  }
  var links=[].slice.call(nav.querySelectorAll('a.okla-acc-nav__link'));
  var i=0,logout=null,seen={};
  links.forEach(function(a){
   var type=a.classList.contains('is-logout')?'logout':getIcon(a.textContent,a.getAttribute('href'),i++);
   var key=linkKey(a,type);
   if(seen[key]){a.remove();return}
   seen[key]=true;
   a.classList.add('okla-acc-nav-iconized');
   a.dataset.oklaIcon=type;
   var ic=a.querySelector(':scope > .okla-acc-menu-icon');
   if(ic)ic.remove();
   a.insertBefore(svgFor(type),a.firstChild);
   if(type==='logout')logout=a;
  });
  // Keep logout last and pinned at the bottom of the SAME white navigation card.
  if(logout&&logout!==nav.lastElementChild)nav.appendChild(logout);
  nav.classList.add('okla-acc-nav-polished');
  removeDuplicateNativeMenus(nav);
 }
 function directBranch(el,ancestor){
  if(!ancestor||!ancestor.contains(el))return null;
  var n=el;
  while(n&&n.parentElement!==ancestor)n=n.parentElement;
  return n;
 }
 function layout(nav){
  var content=document.getElementById('content');
  if(!nav||!content)return;
  var common=nav.parentElement;
  while(common&&!common.contains(content))common=common.parentElement;
  var frame=document.getElementById('content-wrapper');
  if(!common||!frame||!frame.contains(common)||common===content)return;
  var sidebar=directBranch(nav,common),main=directBranch(content,common);
  if(!sidebar||!main||sidebar===main)return;
  common.classList.add('okla-acc-shell');
  sidebar.classList.add('okla-acc-shell__nav');
  main.classList.add('okla-acc-shell__main');
  // Any other children (e.g. breadcrumbs) span full row.
  Array.prototype.forEach.call(common.children,function(el){
   if(el===sidebar||el===main)return;
   el.classList.add('okla-acc-shell__other');
  });
  // Some Shoptet variants place the sidebar list inside a nested wrapper.
  var host=nav.parentElement;
  if(host)host.classList.add('okla-acc-nav-host');
  // Hide only duplicate native navigation remaining after okla_account.js
  // rebuilt it; preserve actual links and native account forms.
  var links=[].slice.call(sidebar.querySelectorAll('a[href]'));
  links.forEach(function(a){
   if(nav.contains(a))return;
   var label=(a.textContent||'').replace(/\s+/g,' ').trim();
   var href=(a.getAttribute('href')||'').toLowerCase();
   if(!/^z[aá]kaznick[eé]\s*centrum$/i.test(label)&&!/^klientsk[eé]\s*centrum$/i.test(label))return;
   if(!/(?:^|\/)klient(?:\/|$)|(?:^|\/)account(?:\/|$)/.test(href))return;
   var li=a.closest('li');
   if(li&&!nav.contains(li)){
    li.classList.add('okla-acc-native-hide');
    var ul=li.parentElement;
    if(ul&&ul.querySelectorAll('li').length===1)ul.classList.add('okla-acc-native-hide');
   }
  });
 }
 function run(){
  if(!document.documentElement.classList.contains('okla-acc-center'))return false;
  var nav=document.querySelector('.okla-acc-nav');
  if(!nav)return false;
  decorateNav(nav);layout(nav);
  document.documentElement.classList.add('okla-acc-polished');
  return true;
 }
 function start(){
  if(run())return;
  if(!window.MutationObserver)return;
  var tries=0;
  var mo=new MutationObserver(function(){if(run()||++tries>35)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){mo.disconnect()},10000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
