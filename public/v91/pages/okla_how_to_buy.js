/* OKLA – "Jak nakupovat" (/jak-nakupovat/): the CMS page is empty, so it is built here from the shop's own terms
   (obchodní podmínky, Doprava a platba, Vrácení zboží): a white intro, the six steps of an order on grey, a white
   checklist before sending, "after the purchase" on grey, help, and at the bottom the homepage "Novinky" slider
   (the same cards and slider as on the homepage, read live from the homepage). No invented carriers or prices:
   shipping and payment always point to the cart and the Doprava a platba page. */
(function(){
 'use strict';
 if(window.__oklaHowToBuyV1)return;window.__oklaHowToBuyV1=true;
 /* Pictograms drawn for this page on a 32px grid (shown at 32px: 2px lines on whole pixels). Navy line work, one blue
    detail per pictogram (class "a"), solid wheels/dots (class "f"). */
 function ic(body,vb){return '<svg viewBox="0 0 '+(vb||32)+' '+(vb||32)+'" aria-hidden="true" focusable="false">'+body+'</svg>'}
 function P(d,c){return '<path'+(c?' class="'+c+'"':'')+' d="'+d+'"/>'}
 function C(x,y,r,c){return '<circle'+(c?' class="'+c+'"':'')+' cx="'+x+'" cy="'+y+'" r="'+r+'"/>'}
 var I={
  /* magnifier with a glint */
  search:C(14,14,9)+P('M20.5 20.5 28 28')+P('M9.5 13A4.5 4.5 0 0 1 13 9.5','a'),
  /* trolley with a "+" in the basket */
  cart:P('M3 5h3.2a1 1 0 0 1 1 .8L10 21a2 2 0 0 0 2 1.6h12.2')+P('M7.9 9H28l-2.2 8.8a2 2 0 0 1-1.9 1.5H11.3')+C(12.5,26.5,2,'f')+C(23,26.5,2,'f')+P('M18 11v6M15 14h6','a'),
  /* lorry moving right: cargo box, cab, two wheels, blue motion lines */
  truck:'<g transform="translate(0 2)">'+P('M10.5 22h-1A1.5 1.5 0 0 1 8 20.5v-12A1.5 1.5 0 0 1 9.5 7h9A1.5 1.5 0 0 1 20 8.5V22')+P('M15.5 22h5')+P('M20 12h4.6a1.5 1.5 0 0 1 1.2.6l3.9 5.2a1.5 1.5 0 0 1 .3.9v1.8a1.5 1.5 0 0 1-1.5 1.5h-3')+P('M2 11h3.5M3 15.5h2.5','a')+C(13,22,2.5)+C(23,22,2.5)+'</g>',
  /* contact card: portrait and blue text lines */
  user:P('M5.5 7h21A2.5 2.5 0 0 1 29 9.5v13a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 22.5v-13A2.5 2.5 0 0 1 5.5 7z')+C(11,14,2.5)+P('M7 21c.6-2.1 2.1-3.2 4-3.2s3.4 1.1 4 3.2')+P('M19 13h6M19 17h4.5','a'),
  /* document with a blue tick */
  check:P('M9 4h10l7 7v15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z')+P('M19 4v5a2 2 0 0 0 2 2h5')+P('M11.5 19l3.2 3.2L21 16','a'),
  /* envelope, blue flap */
  mail:P('M5.5 7h21A2.5 2.5 0 0 1 29 9.5v13a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 22.5v-13A2.5 2.5 0 0 1 5.5 7z')+P('M4 9l12 8.5L28 9','a'),
  /* parcel with blue tape */
  box:P('M16 3.5 27 9v14l-11 5.5L5 23V9z')+P('M5 9l11 5.5L27 9M16 14.5v14')+P('M10.5 6.2l11 5.5','a'),
  /* parcel going back: return arrow */
  back:P('M7 11h14a7 7 0 0 1 0 14h-7')+P('M12 6 7 11l5 5','a'),
  /* shield with a blue tick */
  shield:P('M16 3.5l10.5 4v7.7c0 6.3-4.4 11-10.5 13.3C9.9 26.2 5.5 21.5 5.5 15.2V7.5z')+P('M11.5 16l3.2 3.2 6-6.4','a'),
  /* speech bubble with blue dots */
  chat:P('M6.5 5h19A2.5 2.5 0 0 1 28 7.5v12a2.5 2.5 0 0 1-2.5 2.5H14l-6 5v-5H6.5A2.5 2.5 0 0 1 4 19.5v-12A2.5 2.5 0 0 1 6.5 5z')+C(11,13.5,1.6,'f a')+C(16,13.5,1.6,'f a')+C(21,13.5,1.6,'f a'),
  tick:P('M9 16.5l4.5 4.5L23 11.5'),
  arrow:P('M6 16h20M19 9l7 7-7 7')
 };
 function step(n,icon,title,text,link){
  return '<li class="ohb-step"><span class="ohb-step__num">'+n+'</span><span class="ohb-step__ic">'+ic(I[icon])+'</span>'+
   '<h3>'+title+'</h3><p>'+text+'</p>'+(link?'<a class="ohb-link" href="'+link[0]+'">'+link[1]+ic(I.arrow)+'</a>':'')+'</li>';
 }
 function card(icon,title,text,href,linkText){
  return '<a class="ohb-card" href="'+href+'"><span class="ohb-card__ic">'+ic(I[icon])+'</span><h3>'+title+'</h3><p>'+text+'</p><span class="ohb-link">'+linkText+ic(I.arrow)+'</span></a>';
 }
 var HTML=''+
 '<section class="okla-htb" aria-label="Jak nakupovat">'+
  '<div class="ohb-sec ohb-sec--white ohb-hero"><div class="ohb-wrap">'+
   '<h1>Jak nakupovat na OKLA</h1>'+
   '<p class="ohb-lead">Objednávka zabere pár minut. Vyberete zboží, v košíku zvolíte dopravu a platbu, vyplníte údaje a odešlete. O každém kroku vás informujeme e-mailem.</p>'+
   '<ul class="ohb-facts">'+
    '<li>'+ic(I.user)+'<span>Bez nutnosti registrace</span></li>'+
    '<li>'+ic(I.back)+'<span>Vrácení do 14 dnů</span></li>'+
    '<li>'+ic(I.shield)+'<span>Záruka 24 měsíců</span></li>'+
   '</ul>'+
  '</div></div>'+
  '<div class="ohb-sec ohb-sec--grey"><div class="ohb-wrap">'+
   '<h2>Objednávka v šesti krocích</h2>'+
   '<ol class="ohb-steps">'+
    step(1,'search','Vyberte zboží','Procházejte kategorie nebo použijte vyhledávání. U každého produktu najdete cenu, dostupnost, popis, parametry a hodnocení zákazníků.',['/','Do obchodu'])+
    step(2,'cart','Vložte do košíku','Tlačítkem „Do košíku“ produkt přidáte. V košíku můžete měnit počet kusů nebo položku odebrat.',null)+
    step(3,'truck','Zvolte dopravu a platbu','V košíku vyberete z nabízených způsobů doručení a platby. Jejich ceny vidíte ještě před odesláním objednávky.',['/doprava-a-platba/','Doprava a platba'])+
    step(4,'user','Vyplňte údaje','Zadejte kontaktní a doručovací údaje. Účet zakládat nemusíte, s registrací ale uvidíte historii objednávek.',null)+
    step(5,'check','Zkontrolujte a odešlete','Před odesláním zkontrolujte položky, cenu i adresu. Objednávku potvrdíte tlačítkem „Objednat s povinností platby“.',null)+
    step(6,'mail','Potvrzení e-mailem','Po odeslání vám přijde potvrzení. Jakmile objednávku přijmeme, pošleme e-mail s jejím shrnutím a dalším postupem.',['/stav-objednavky/','Stav objednávky'])+
   '</ol>'+
  '</div></div>'+
  '<div class="ohb-sec ohb-sec--white"><div class="ohb-wrap ohb-split">'+
   '<div class="ohb-split__text"><h2>Než objednávku odešlete</h2><p>Krátká kontrola ušetří čas vám i nám. Rozhodující je cena zobrazená před odesláním, včetně dopravy a případného příplatku za platbu.</p></div>'+
   '<ul class="ohb-checklist">'+
    '<li>'+ic(I.tick)+'<span><strong>Kompatibilita</strong> U elektroniky si v popisu ověřte podporované verze a zařízení.</span></li>'+
    '<li>'+ic(I.tick)+'<span><strong>Obsah balení</strong> V parametrech najdete, co je v balení a co se dokupuje.</span></li>'+
    '<li>'+ic(I.tick)+'<span><strong>Adresa a kontakt</strong> Správný e-mail a telefon jsou důležité pro doručení.</span></li>'+
    '<li>'+ic(I.tick)+'<span><strong>Doprava a platba</strong> Vybraný způsob a jeho cenu vidíte v souhrnu košíku.</span></li>'+
   '</ul>'+
  '</div></div>'+
  '<div class="ohb-sec ohb-sec--grey"><div class="ohb-wrap">'+
   '<h2>Po nákupu</h2>'+
   '<div class="ohb-cards">'+
    card('box','Stav objednávky','Kde je vaše objednávka a kdy dorazí, zjistíte na jednom místě.','/stav-objednavky/','Zjistit stav')+
    card('back','Vrácení do 14 dnů','Zboží koupené na dálku můžete zpravidla do 14 dnů vrátit bez udání důvodu.','/vraceni-zbozi-a-odstoupeni/','Jak vrátit zboží')+
    card('shield','Reklamace','Na zboží platí zákonná odpovědnost za vady 24 měsíců. Reklamaci vyřídíme rychle.','/reklamace/','Podat reklamaci')+
   '</div>'+
  '</div></div>'+
  '<div class="ohb-sec ohb-sec--white"><div class="ohb-wrap"><div class="ohb-help">'+
   '<span class="ohb-help__ic">'+ic(I.chat)+'</span>'+
   '<div class="ohb-help__text"><h2>Nevíte si rady?</h2><p>Napište nám a poradíme s výběrem i s objednávkou.</p></div>'+
   '<a class="ohb-btn" href="mailto:podpora@okla.cz">'+ic(I.mail)+'<span>podpora@okla.cz</span></a>'+
  '</div></div></div>'+
  '<div class="ohb-sec ohb-sec--white ohb-news"><div class="ohb-wrap" id="ohb-news"></div></div>'+
 '</section>';

 /* the homepage "Novinky" section: heading + its product group, made a slider by the shared slider code */
 function news(){
  var host=document.getElementById('ohb-news');if(!host||!window.fetch)return;
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   var h=[].slice.call(doc.querySelectorAll('.homepage-group-title')).find(function(x){return /novinky/i.test(x.textContent||'')});
   var group=h&&h.nextElementSibling;
   while(group&&!(group.classList&&group.classList.contains('products')))group=group.nextElementSibling;
   if(!h||!group)return;
   var heading=document.createElement('div');heading.className='homepage-group-title h4 okla-slider-heading';heading.textContent=(h.textContent||'Novinky').replace(/\s+/g,' ').trim();
   var g=document.createElement('div');g.className='products products-block';
   [].slice.call(group.querySelectorAll(':scope > .product')).forEach(function(p){
    var c=p.cloneNode(true);c.querySelectorAll('img[data-src]').forEach(function(i){i.src=i.getAttribute('data-src');i.removeAttribute('data-src')});g.appendChild(c);
   });
   if(!g.children.length)return;
   host.append(heading,g);
   /* desktop with five or fewer products: all of them in one static row (a slider would keep one hidden and rotate);
      otherwise, and on phones/tablets, the homepage slider */
   if(window.innerWidth>=992&&g.children.length<=5){host.classList.add('ohb-news--all');g.classList.add('ohb-news__row')}
   else if(window.__oklaSliderFor)window.__oklaSliderFor(g,heading);
  }).catch(function(){});
 }
 function start(){
  var main=document.querySelector('main#content');if(!main||main.querySelector('.okla-htb'))return;
  var art=main.querySelector('.pageArticleDetail')||main.querySelector('.content-inner');
  var box=document.createElement('div');box.innerHTML=HTML;
  if(art){art.classList.add('okla-htb-replaced');art.parentNode.insertBefore(box.firstChild,art)}else main.prepend(box.firstChild);
  document.documentElement.classList.add('okla-htb-page');
  news();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
