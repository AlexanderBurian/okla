/* OKLA V120 – unify Shoptet customer centre without replacing native forms
   or navigation links. All icons are flat transparent PNGs. */
(function(){
 'use strict';
 if(window.__oklaAccountPolishV120)return;
 window.__oklaAccountPolishV120=true;
 var ICONS={
  personal:0, orders:1, payments:2, tax:3, invoices:4, credits:5,
  delivery:6, receipt:7, discount:8, review:9, discussion:10,
  logout:11, tools:12, user:13
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
 function decorateNav(nav){
  if(!nav)return;
  nav.setAttribute('aria-label','Zákaznické centrum');
  var head=nav.querySelector('.okla-acc-nav__head');
  if(head&&!head.querySelector('.okla-acc-head-icon')){
   var person=document.createElement('span');
   person.className='okla-acc-head-icon';person.setAttribute('aria-hidden','true');
   head.insertBefore(person,head.firstChild);
  }
  var links=[].slice.call(nav.querySelectorAll('a.okla-acc-nav__link'));
  var i=0,logout=null;
  links.forEach(function(a){
   var type=a.classList.contains('is-logout')?'logout':getIcon(a.textContent,a.getAttribute('href'),i++);
   a.classList.add('okla-acc-nav-iconized');
   a.dataset.oklaIcon=type;
   var ic=a.querySelector(':scope > .okla-acc-menu-icon');
   if(!ic){ic=document.createElement('span');ic.className='okla-acc-menu-icon';ic.setAttribute('aria-hidden','true');a.insertBefore(ic,a.firstChild)}
   ic.style.backgroundPosition=(-32*(ICONS[type]||0))+'px 0px';
   if(type==='logout')logout=a;
  });
  // Keep logout last and pinned at the bottom of the SAME white navigation card.
  if(logout&&logout!==nav.lastElementChild)nav.appendChild(logout);
  nav.classList.add('okla-acc-nav-polished');
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
