/* Okla – pages with nothing to show, in the same language as the empty
   category card (one centred white card, dark headline, grey help text):
   - 404: Okla wording instead of Shoptet's "A safra! Něco se pokazilo.",
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
  /* one calm block about the cart itself - a picture, the message and one way on (okla_empty_states.css shows it instead
     of the heading, the category list, the search and the recommendations, on phones and PC) */
  var box=document.querySelector('.cart-inner.cart-empty');
  if(box)document.documentElement.classList.add('okla-cart-is-empty');
  if(!box||box.querySelector('.okla-cart-empty'))return;
  /* as on Alza: the order steps on top (the cart is the current one), the message in the middle, and at the bottom the
     discount code (it can be used once something is in the cart: a click says so) and "Zpět k nákupu" */
  var hero=el('section','okla-cart-empty');
  var SVG=function(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>'};
  var steps=el('ol','okla-ce-steps');steps.setAttribute('aria-label','Kroky objednávky');
  [['Košík','Košík','M3 4.5h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1M9.5 20h.01M17 20h.01'],
   ['Doprava a platba','Doprava','M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7M6.5 17a1.8 1.8 0 1 0 0 .01M17 17a1.8 1.8 0 1 0 0 .01'],
   ['Dodací údaje','Údaje','M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0']].forEach(function(st,i){
   var li=el('li','okla-ce-step'+(i===0?' is-current':''));if(i===0)li.setAttribute('aria-current','step');
   li.innerHTML='<span class="okla-ce-step__dot">'+SVG(st[2])+'</span><span class="okla-ce-step__name"><span class="okla-ce-long">'+st[0]+'</span><span class="okla-ce-short">'+st[1]+'</span></span>';
   steps.appendChild(li);
  });
  hero.appendChild(steps);
  var main=el('div','okla-cart-empty__main');
  var pic=el('div','okla-cart-empty__pic');pic.setAttribute('aria-hidden','true');
  pic.innerHTML='<img src="'+(window.__oklaAssetBase||'')+'v91/img/okla-manul-empty-cart.webp" alt="" width="512" height="512" loading="eager" decoding="async">';
  main.appendChild(pic);
  main.appendChild(el('h1','okla-cart-empty__title','Váš košík je prázdný'));
  main.appendChild(el('p','okla-cart-empty__text','Vyberte si z naší nabídky – měřicí techniku, multitooly i chytrou elektroniku.'));
  var go=el('a','okla-cart-empty__btn','Začít nakupovat');go.href='/';
  main.appendChild(go);
  hero.appendChild(main);
  var foot=el('div','okla-cart-empty__foot');
  var coupon=el('button','okla-ce-coupon');coupon.type='button';coupon.setAttribute('aria-expanded','false');
  coupon.innerHTML=SVG('M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM10.5 8.5 14 12l-3.5 3.5')+'<span>Využít slevový / dárkový poukaz</span>';
  var note=el('p','okla-ce-note','Slevový nebo dárkový kód zadáte v košíku, jakmile do něj vložíte zboží.');note.hidden=true;
  coupon.addEventListener('click',function(){var open=note.hidden;note.hidden=!open;coupon.setAttribute('aria-expanded',open?'true':'false');coupon.classList.toggle('is-open',open)});
  var back=el('a','okla-ce-back');back.href='/';
  back.innerHTML=SVG('m14.5 6-6 6 6 6')+'<span>Zpět k nákupu</span>';
  foot.append(coupon,note,back);
  hero.appendChild(foot);
  box.insertBefore(hero,box.firstChild);
 }
 function run(){page404();pageSearch();emptyCart()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run);
})();
