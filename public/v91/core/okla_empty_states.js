/* OKLA – pages with nothing to show, in the same language as the empty
   category card (one centred white card, dark headline, grey help text):
   - 404: OKLA wording instead of Shoptet's "A safra! Něco se pokazilo.",
     plus a search field and the shop categories;
   - search without results: a card with the searched term, a search field
     (pre-filled) and the categories instead of a bare "Produkty nebyly nalezeny";
   - empty cart: the category links become rounded chips (okla_empty_states.css),
     names written in capitals get normal case. */
(function(){
 'use strict';
 if(window.__oklaEmptyStatesV1)return;window.__oklaEmptyStatesV1=true;
 var FALLBACK=[
  ['Elektronické multitooly','/elektronicke-multitooly/'],['Chytrá elektronika','/chytra-elektronika/'],
  ['Měřicí technika a nářadí','/merici-technika-a-naradi/'],['Endoskopy a inspekční kamery','/endoskopy-a-inspekcni-kamery/'],
  ['Praktické vychytávky','/prakticke-vychytavky/'],['Designové gadgety','/designove-gadgety/'],
  ['Projektory a obraz','/projektory-a-obraz/'],['Příslušenství','/prislusenstvi/']
 ];
 /* information pages that share the top menu with the categories */
 var NOT_CATEGORY=/(podminky|kontakt|o-nas|doprava|reklama|vraceni|jak-nakupovat|newsroom|novinky|blog|stav-objednavky|klient|login|registrace)/i;
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 /* "PŘÍSLUŠENSTVÍ" -> "Příslušenství" */
 function niceCase(t){t=(t||'').replace(/\s+/g,' ').trim();if(t.length>3&&t===t.toLocaleUpperCase('cs')&&t!==t.toLocaleLowerCase('cs'))t=t.charAt(0)+t.slice(1).toLocaleLowerCase('cs');return t}
 function categories(){
  var seen={},list=[];
  [].slice.call(document.querySelectorAll('#navigation .menu-level-1 > li > a[href], .empty-cart-boxes ul li a[href]')).forEach(function(a){
   var h=a.getAttribute('href')||'',t=niceCase(a.textContent);
   if(!t||!/^\/[^?#]+\/$/.test(h)||NOT_CATEGORY.test(h)||seen[h])return;seen[h]=1;list.push([t,h]);
  });
  return list.length>=3?list:FALLBACK;
 }
 function searchForm(value){
  var f=el('form','okla-empty-search');f.action='/vyhledavani/';f.method='get';f.setAttribute('role','search');
  var i=el('input');i.type='search';i.name='string';i.placeholder='Napište, co hledáte';i.setAttribute('aria-label','Vyhledávání');i.required=true;if(value)i.value=value;
  var b=el('button');b.type='submit';b.setAttribute('aria-label','Hledat');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
  f.append(i,b);return f;
 }
 function chips(){
  var w=el('nav','okla-empty-chips');w.setAttribute('aria-label','Kategorie');
  categories().forEach(function(c){var a=el('a','okla-empty-chip',c[0]);a.href=c[1];w.appendChild(a)});
  return w;
 }
 function page404(){
  var box=document.querySelector('body.in-404 #content .empty-content-404');
  if(!box||box.dataset.oklaEmpty)return;box.dataset.oklaEmpty='1';
  var h1=box.querySelector('h1'),h2=box.querySelector('h2'),ps=box.querySelectorAll('p');
  if(h1)h1.textContent='Tuhle stránku jsme nenašli';
  if(h2)h2.textContent='Odkaz je možná zastaralý, nebo stránka už neexistuje. Zkuste ji vyhledat, nebo vyberte kategorii.';
  var intro=ps[0];
  var extra=el('div','okla-empty-extra');extra.append(searchForm(''),chips());
  if(intro&&!intro.querySelector('a'))intro.replaceWith(extra);else box.insertBefore(extra,box.querySelector('p:last-child'));
 }
 function pageSearch(){
  var found=document.querySelector('body.in-vyhledavani #content #products-found');
  if(!found||found.dataset.oklaEmpty||found.querySelector('.product'))return;
  var head=found.querySelector('.search-products-heading');if(!head)return;
  found.dataset.oklaEmpty='1';
  var term='';try{term=new URLSearchParams(location.search).get('string')||''}catch(e){}
  if(!term){var hl=document.querySelector('#content h2 .highlight');term=hl?hl.textContent.replace(/^["„]|["“]$/g,''):''}
  var card=el('section','okla-empty-card okla-empty-card--search');
  card.appendChild(el('span','okla-empty-icon')).setAttribute('aria-hidden','true');
  card.appendChild(el('h2','okla-empty-title',term?'Pro „'+term+'“ jsme nic nenašli':'Nic jsme nenašli'));
  card.appendChild(el('p','okla-empty-text','Zkontrolujte, jestli v hledaném slově není překlep, nebo zkuste obecnější výraz. Můžete také projít kategorie.'));
  card.append(searchForm(term),chips());
  head.replaceWith(card);
  document.documentElement.classList.add('okla-search-empty');
 }
 function emptyCart(){
  [].slice.call(document.querySelectorAll('.cart-empty .empty-cart-boxes ul li a')).forEach(function(a){var t=niceCase(a.textContent);if(t!==a.textContent.trim())a.textContent=t});
 }
 function run(){page404();pageSearch();emptyCart()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run);
})();
