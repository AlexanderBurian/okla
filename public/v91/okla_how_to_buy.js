/* OKLA – "Jak nakupovat" (/jak-nakupovat/): the CMS page is empty, so it is built here from the shop's own terms
   (obchodní podmínky, Doprava a platba, Vrácení zboží): a white intro, the six steps of an order on grey, a white
   checklist before sending, "after the purchase" on grey, help, and at the bottom the homepage "Novinky" slider
   (the same cards and slider as on the homepage, read live from the homepage). No invented carriers or prices:
   shipping and payment always point to the cart and the Doprava a platba page. */
(function(){
 'use strict';
 if(window.__oklaHowToBuyV1)return;window.__oklaHowToBuyV1=true;
 function ic(d){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+d.split('|').map(function(p){return '<path d="'+p+'"/>'}).join('')+'</svg>'}
 var I={
  search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z|M15.5 15.5 20 20',
  cart:'M2.5 3.8h2.8l2.1 10.7a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1l1.9-7.3H6.1|M10 20.3h.01|M18 20.3h.01',
  truck:'M3 6h11v10H3z|M14 9h4l3 3.5V16h-7|M7 17.5h.01|M17 17.5h.01',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
  check:'M5 12.5l4.5 4.5L19 7',
  mail:'M3 6h18v12H3z|M3 7l9 6 9-6',
  box:'M12 3l8 4.5v9L12 21l-8-4.5v-9z|M4 7.5l8 4.5 8-4.5|M12 12v9',
  back:'M9 14 4 9l5-5|M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  shield:'M12 3 4 6.5v5.5c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6.5z|M8.8 12l2.3 2.3 4.3-4.6',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 7v5l3 2',
  chat:'M4 5h16v11H9l-5 4z|M8.5 10.5h.01|M12 10.5h.01|M15.5 10.5h.01',
  arrow:'M5 12h14|M13 6l6 6-6 6'
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
    '<li>'+ic(I.check)+'<span><strong>Kompatibilita</strong> U elektroniky si v popisu ověřte podporované verze a zařízení.</span></li>'+
    '<li>'+ic(I.check)+'<span><strong>Obsah balení</strong> V parametrech najdete, co je v balení a co se dokupuje.</span></li>'+
    '<li>'+ic(I.check)+'<span><strong>Adresa a kontakt</strong> Správný e-mail a telefon jsou důležité pro doručení.</span></li>'+
    '<li>'+ic(I.check)+'<span><strong>Doprava a platba</strong> Vybraný způsob a jeho cenu vidíte v souhrnu košíku.</span></li>'+
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
   if(window.__oklaSliderFor)window.__oklaSliderFor(g,heading);
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
