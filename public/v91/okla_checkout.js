/* OKLA checkout pages: Shoptet's ordering template has no cart link in the header, so the header icon row
   is completed here: the cart link is copied from the homepage markup, and the account, orders and favourites
   icons are added with the same classes the header styles already use. */
(function(){
 'use strict';
 if(window.__oklaCheckoutV1)return;
 window.__oklaCheckoutV1=true;

 var NS='http://www.w3.org/2000/svg';

 function svg(d,cls){
  var s=document.createElementNS(NS,'svg');
  s.setAttribute('viewBox','0 0 24 24');
  s.setAttribute('aria-hidden','true');
  s.setAttribute('focusable','false');
  s.setAttribute('class',cls||'okla-header-lineicon');
  var p=document.createElementNS(NS,'path');
  p.setAttribute('d',d);
  s.appendChild(p);
  return s;
 }

 function icons(row,cart){
  if(row.querySelector('.okla-header-account'))return;
  var account=document.createElement('button');
  account.type='button';
  account.className='okla-header-account';
  account.setAttribute('aria-label','Můj účet – přihlásit se');
  var icon=document.createElement('span');
  icon.className='okla-header-icon';
  icon.appendChild(svg('M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM4.8 20.1c.1-4 3-6.5 7.2-6.5s7.1 2.5 7.2 6.5v.4H4.8v-.4Z','okla-header-lineicon'));
  var copy=document.createElement('span');
  copy.className='okla-header-copy';
  var strong=document.createElement('strong');strong.textContent='Můj účet';
  var small=document.createElement('small');small.textContent='Přihlásit se';
  copy.append(strong,small);
  var chevron=document.createElement('span');chevron.className='okla-header-chevron';
  account.append(icon,copy,chevron);
  account.addEventListener('click',function(){window.location.href='/login/'});

  var orders=document.createElement('a');
  orders.className='okla-header-orders';
  orders.href='/klient/';
  orders.setAttribute('aria-label','Moje objednávky');
  orders.title='Moje objednávky';
  orders.appendChild(svg('M7.7 2.6h8.6v2.7h3.8v16H3.9v-16h3.8Zm1.8 2.7h5V4h-5Z','okla-header-lineicon'));

  var favourites=document.createElement('span');
  favourites.className='okla-header-favorites';
  favourites.appendChild(svg('M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5L12 7.4l.9-.9a4.6 4.6 0 0 1 6.5 6.5L12 20.3Z','okla-header-lineicon'));

  row.insertBefore(account,cart);
  row.insertBefore(orders,cart);
  row.insertBefore(favourites,cart);
 }

 function restoreHeader(){
  var nav=document.querySelector('#header .header-top>.navigation-buttons');
  if(!nav)return;
  var row=nav.querySelector('.okla-exact-header');
  if(!row)return;
  var cart=nav.querySelector('a.cart-count');
  if(cart&&!row.contains(cart)){
   row.appendChild(cart);
  }
  if(!cart){
   fetch('/',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(html){
    var doc=new DOMParser().parseFromString(html,'text/html');
    var src=doc.querySelector('#header .header-top>.navigation-buttons a.cart-count');
    if(!src||row.querySelector('a.cart-count'))return;
    row.appendChild(document.importNode(src,true));
    icons(row,row.querySelector('a.cart-count'));
   }).catch(function(){});
   return;
  }
  icons(row,cart);
 }

 function hideHelpBox(){
  document.querySelectorAll('body *').forEach(function(h){
   if(h.children.length>3||!/Potřebujete pomoc/.test(h.textContent||''))return;
   var box=h.closest('.box')||h.parentElement;
   if(box)box.style.display='none';
  });
 }

 function init(){restoreHeader();hideHelpBox();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
})();
