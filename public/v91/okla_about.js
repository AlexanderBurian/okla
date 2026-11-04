/* OKLA V91 – "O nás" page. Builds a long editorial About page in OKLA's own
   brand language and renders a REAL map (Leaflet + OpenStreetMap tiles) of the
   markets we serve — Česko, Slovensko, Maďarsko — with accurate country borders
   loaded from committed GeoJSON (public/v91/data/okla-map-cz-sk-hu.geojson), not
   a hand-drawn shape. Shown on /o-nas/ (takes over the CMS page).

   The company facts below (founding year, cities, counts, team first names,
   address) are editorial placeholders for OKLA to adjust in this file — kept
   plausible and free of fabricated registry identifiers (no invented IČO/DIČ,
   awards or certifications). */
(function(){
 'use strict';
 if(window.__oklaAboutV1)return;
 window.__oklaAboutV1=true;

 var BASE=window.__oklaAssetBase||'';

 var HTML=''+
 '<section class="okla-about" aria-label="O nás">'+

 /* ---------------- HERO ---------------- */
 '<div class="oka-hero">'+
  '<div class="oka-hero__inner">'+
   '<div class="oka-hero__text">'+
    '<span class="oka-hero__eyebrow">O společnosti OKLA</span>'+
    '<h1>Gadgety, které <em>dávají smysl</em>.</h1>'+
    '<p class="oka-hero__lead">OKLA je český e-shop pro chytrou elektroniku, měřicí techniku a praktické vychytávky. Neprodáváme všechno — vybíráme kousky, které sami používáme, a ke každému umíme poradit.</p>'+
    '<div class="oka-hero__cta">'+
     '<a class="oka-btn oka-btn--light" href="/">Prohlédnout sortiment<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></a>'+
     '<a class="oka-btn oka-btn--ghost" href="/kontakty/">Napište nám</a>'+
    '</div>'+
   '</div>'+
   '<div class="oka-hero__art" aria-hidden="true">'+ART()+'</div>'+
  '</div>'+
  '<div class="oka-hero__features">'+
   feat(['M4 5h12v14l-6-3-6 3z'],'Pečlivě vybraný sortiment')+
   feat(['M12 7v5l3 2','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],'Expedice do 24 hodin')+
   feat(['M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z'],'Česká i slovenská podpora')+
   feat(['M12 3l7 3v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6z','M9 12l2 2 4-4'],'Každý produkt testujeme')+
   feat(['M6 10V8a6 6 0 0 1 12 0v2','M5 10h14v10H5z','M12 14v3'],'Bezpečné platby')+
  '</div>'+
 '</div>'+

 /* ---------------- INTRO + STATS ---------------- */
 '<div class="oka-section"><div class="oka-intro">'+
  '<div class="oka-intro__text">'+
   '<span class="oka-eyebrow">Kdo jsme</span>'+
   '<h2 style="font-size:28px;color:#0b2540;font-weight:800;margin-bottom:16px">Malý tým, který techniku opravdu baví</h2>'+
   '<p>OKLA vznikla v roce <b>2019</b> v Ostravě z jednoduché frustrace: zajímavé gadgety se v Česku buď nedaly sehnat, nebo k nim nikdo neuměl poradit. Začali jsme dovážet kousky, které jsme chtěli mít sami doma — a kolem nich postavili obchod.</p>'+
   '<p>Dnes je OKLA <b>kurátorský e-shop</b>: raději méně produktů, ale takových, za kterými si stojíme. Každý nový kus projde rukama technika, než ho dáme do prodeje, a popisy píšeme tak, abyste podle nich opravdu vybrali.</p>'+
   '<p>Doručujeme po celém <b>Česku, Slovensku i Maďarsku</b> — a pořád nás baví hledat další věci, které stojí za to.</p>'+
  '</div>'+
  '<div class="oka-stats">'+
   stat('2019','','Od roku založení')+
   stat('12 000','+','Vyřízených objednávek')+
   stat('33','','Produktů v nabídce')+
   stat('3','','Země, kam doručujeme')+
  '</div>'+
 '</div></div>'+

 /* ---------------- TIMELINE ---------------- */
 '<div class="oka-section"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Náš příběh</span>'+
   '<h2>Od prvních beden po tři trhy</h2>'+
   '<p class="oka-section__lead">Rosteme pomalu a po svém. Tady je zkráceně, jak šel čas.</p>'+
 '</div>'+
 '<div class="oka-timeline">'+
   tl('2019','Vznik OKLA','Dva nadšenci do techniky začínají dovážet gadgety, které v Česku nešly běžně sehnat. Z garáže a nadšení.')+
   tl('2020','Vlastní sklad a e-shop','Spouštíme okla.cz a stěhujeme se do prvního skladu v Ostravě. První stovky objednávek.')+
   tl('2022','Expandujeme na Slovensko','Spouštíme doručování do celé Slovenské republiky a slovenskou zákaznickou podporu.')+
   tl('2023','Zavádíme testovací protokol','Každý produkt napříště projde rukama technika — ověříme, že funguje tak, jak slibujeme.')+
   tl('2024','Vstup na maďarský trh','Rozšiřujeme doručování do Maďarska. Posíláme do tří zemí střední Evropy.')+
   tl('2026','Kurátorský sortiment','Držíme pečlivě vybraných 33 produktů v 7 kategoriích — a dál hledáme, co přidat.')+
 '</div></div>'+

 /* ---------------- VALUES ---------------- */
 '<div class="oka-section oka-section--center"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Čemu věříme</span>'+
   '<h2>Tři věci, na kterých nám záleží</h2>'+
 '</div>'+
 '<div class="oka-grid-3">'+
   val(['M4 5h12v14l-6-3-6 3z','M19 4v9'],'Kurátorský výběr','Neprodáváme všechno. Do nabídky se dostane jen to, co bychom si koupili i my — a co obstojí v běžném používání.')+
   val(['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z','M9.5 10a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1 .9-1 1.7','M12 16.5h.01'],'Rozumíme tomu, co prodáváme','Poradíme s parametry i použitím, ne jen odkážeme na datasheet. Napište nám klidně ještě před nákupem.')+
   val(['M5 12l4 4 10-10','M3 17l4 4'],'Čestně a bez balastu','Reálné popisy, poctivé fotky, žádné vymyšlené recenze. Když se něco pro vás nehodí, řekneme to.')+
 '</div></div>'+

 /* ---------------- PROCESS ---------------- */
 '<div class="oka-section"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Jak vybíráme</span>'+
   '<h2>Než se produkt objeví v nabídce</h2>'+
   '<p class="oka-section__lead">Každý kus projde stejnou cestou. Žádné naskladnění naslepo.</p>'+
 '</div>'+
 '<div class="oka-steps">'+
   step('Najdeme','Sledujeme novinky, crowdfunding i vaše tipy a vybíráme, co má smysl dovézt.')+
   step('Otestujeme','Technik produkt rozbalí, zapojí a vyzkouší reálné použití — ne jen že se rozsvítí.')+
   step('Popíšeme','Napíšeme srozumitelný popis, parametry a k čemu se hodí (a k čemu ne).')+
   step('Expedujeme','Skladem v Ostravě, balíme a odesíláme zpravidla do 24 hodin v pracovní dny.')+
 '</div></div>'+

 /* ---------------- CATEGORIES ---------------- */
 '<div class="oka-section"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Co u nás najdete</span>'+
   '<h2>Sedm kategorií, jedna společná řeč</h2>'+
 '</div>'+
 '<div class="oka-cats">'+
   cat(['M14 3l7 7-4 4','M3 21l5-1 9-9-4-4-9 9z'],'Multitooly')+
   cat(['M9 3h6v4H9z','M7 7h10v14H7z','M10 11h4','M10 15h4'],'Chytrá elektronika')+
   cat(['M4 19V5','M4 15l5-4 4 3 7-7','M20 7v5h-5'],'Měřicí technika')+
   cat(['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z','M12 8v4l3 2'],'Endoskopy')+
   cat(['M5 4h14v6H5z','M5 14h14v6H5z'],'Praktické vychytávky')+
   cat(['M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z'],'Designové gadgety')+
   cat(['M3 6h18v10H3z','M8 20h8','M12 16v4'],'Projektory')+
 '</div></div>'+

 /* ---------------- MAP ---------------- */
 '<div class="oka-section"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Kam doručujeme</span>'+
   '<h2>Působíme ve třech zemích střední Evropy</h2>'+
   '<p class="oka-section__lead">Z Ostravy posíláme do celého Česka, Slovenska i Maďarska — s podporou v místním jazyce.</p>'+
 '</div>'+
 '<div class="oka-mapwrap">'+
   '<div class="oka-mapwrap__text">'+
     '<p>Sklad a zázemí máme v <b>Ostravě</b>, odkud expedujeme objednávky do všech tří zemí. Zásilky doručujeme přes zavedené dopravce a výdejní místa.</p>'+
     '<div class="oka-mapleg">'+
       legi('#1f3fb0','Česko','sídlo a sklad · Ostrava')+
       legi('#1f6fd6','Slovensko','doručujeme od 2022 · Bratislava')+
       legi('#6c3bc5','Maďarsko','doručujeme od 2024 · Budapešť')+
     '</div>'+
   '</div>'+
   '<div id="okla-about-map" role="img" aria-label="Mapa: Česko, Slovensko a Maďarsko"></div>'+
 '</div></div>'+

 /* ---------------- TEAM ---------------- */
 '<div class="oka-section oka-section--center"><div class="oka-section__head">'+
   '<span class="oka-eyebrow">Lidé za OKLA</span>'+
   '<h2>Malý tým, žádná call centra</h2>'+
   '<p class="oka-section__lead">Když nám napíšete, odpoví vám někdo z těchto lidí.</p>'+
 '</div>'+
 '<div class="oka-team">'+
   member('JN','#1f3fb0','#5b34bd','Jakub N.','Zakladatel &amp; výběr produktů','Hledá a vybírá, co se u nás objeví. Nejradši má měřicí techniku.')+
   member('TK','#1f6fd6','#2bb3c7','Tereza K.','Zákaznická podpora','Odpovídá na dotazy před i po nákupu — česky i slovensky.')+
   member('MD','#6c3bc5','#9b4ddb','Martin D.','Testování a technika','Každý produkt zapojí a vyzkouší, než ho pustíme do prodeje.')+
   member('LP','#0b7bbd','#1f3fb0','Lucie P.','Expedice a logistika','Balí a odesílá objednávky tak, aby dorazily rychle a v pořádku.')+
 '</div></div>'+

 /* ---------------- CONTACT ---------------- */
 '<div class="oka-section"><div class="oka-contact">'+
   '<div>'+
     '<span class="oka-eyebrow">Ozvěte se</span>'+
     '<h2>Rádi pomůžeme s výběrem</h2>'+
     '<div class="oka-contact__rows">'+
       crow(['M4 5h16v14H4z','M4 7l8 6 8-6'],'E-mail','<a href="mailto:podpora@okla.cz">podpora@okla.cz</a>')+
       crow(['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z','M12 10a2 2 0 1 0 0-.01'],'Sklad a zázemí','Ostrava, Moravskoslezský kraj')+
       crow(['M12 7v5l3 2','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],'Zákaznická podpora','Po–Pá 9:00–17:00')+
     '</div>'+
   '</div>'+
   '<div class="oka-contact__cta">'+
     '<a class="oka-btn oka-btn--light" href="/kontakty/">Kontaktujte nás<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></a>'+
     '<a class="oka-btn oka-btn--ghost" href="mailto:podpora@okla.cz">Napsat e-mail</a>'+
   '</div>'+
 '</div></div>'+

 /* ---------------- CLOSING CTA ---------------- */
 '<div class="oka-closing">'+
   '<h2>Mrkněte, co pro vás máme</h2>'+
   '<p>Pečlivě vybraná elektronika a gadgety skladem v Ostravě, s doručením po celém Česku, Slovensku i Maďarsku.</p>'+
   '<div class="oka-hero__cta">'+
     '<a class="oka-btn oka-btn--light" href="/">Prohlédnout nabídku<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></a>'+
     '<a class="oka-btn oka-btn--ghost" href="mailto:podpora@okla.cz">Zákaznická podpora</a>'+
   '</div>'+
 '</div>'+

 '</section>';

 /* ---------- small HTML builders ---------- */
 function ic(paths){var p='';for(var i=0;i<paths.length;i++)p+='<path d="'+paths[i]+'"/>';return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'}
 function feat(paths,label){return '<div class="oka-feat"><span class="oka-feat__ic">'+ic(paths)+'</span><strong>'+label+'</strong></div>'}
 function stat(num,sup,label){return '<div class="oka-stat"><div class="oka-stat__num">'+num+(sup?'<i>'+sup+'</i>':'')+'</div><div class="oka-stat__label">'+label+'</div></div>'}
 function tl(year,h,p){return '<div class="oka-tl"><div class="oka-tl__year">'+year+'</div><div class="oka-tl__body"><div class="oka-tl__h">'+h+'</div><div class="oka-tl__p">'+p+'</div></div></div>'}
 function val(paths,h,p){return '<div class="oka-value"><div class="oka-value__ic">'+ic(paths)+'</div><h3>'+h+'</h3><p>'+p+'</p></div>'}
 function step(h,p){return '<div class="oka-step"><h3>'+h+'</h3><p>'+p+'</p></div>'}
 function cat(paths,label){return '<a class="oka-cat" href="/"><span class="oka-cat__ic">'+ic(paths)+'</span><span>'+label+'</span></a>'}
 function legi(color,name,note){return '<div class="oka-mapleg__i"><span class="oka-mapleg__dot" style="background:'+color+'"></span><b>'+name+'</b><span>— '+note+'</span></div>'}
 function member(ini,c1,c2,name,role,p){return '<div class="oka-member"><div class="oka-member__av" style="background:linear-gradient(145deg,'+c1+','+c2+')">'+ini+'</div><h3>'+name+'</h3><div class="oka-member__role">'+role+'</div><p>'+p+'</p></div>'}
 function crow(paths,label,val){return '<div class="oka-crow"><span class="oka-crow__ic">'+ic(paths)+'</span><div class="oka-crow__t"><b>'+label+'</b>'+val+'</div></div>'}

 /* hero decorative artwork — our own line-art (the geographic map below is the real one) */
 function ART(){return ''+
  '<svg viewBox="0 0 440 340" fill="none">'+
  '<g stroke="rgba(255,255,255,.28)" stroke-width="1.4">'+
   '<circle cx="220" cy="170" r="150"/>'+
   '<circle cx="220" cy="170" r="104" stroke-dasharray="3 7"/>'+
  '</g>'+
  /* parcel */
  '<g transform="translate(220 178)">'+
   '<path d="M0 -72 78 -30 0 12 -78 -30Z" fill="rgba(255,255,255,.14)" stroke="#dbe6ff" stroke-width="1.6" stroke-linejoin="round"/>'+
   '<path d="M-78 -30 0 12V96L-78 54Z" fill="rgba(10,22,70,.30)" stroke="#dbe6ff" stroke-width="1.6" stroke-linejoin="round"/>'+
   '<path d="M78 -30 0 12V96L78 54Z" fill="rgba(90,52,189,.35)" stroke="#dbe6ff" stroke-width="1.6" stroke-linejoin="round"/>'+
   '<path d="M0 12V96" stroke="#dbe6ff" stroke-width="1.2"/>'+
   '<text x="0" y="-26" text-anchor="middle" font-family="Roboto,Arial" font-size="30" font-weight="800" fill="#ffd27a">OKLA</text>'+
  '</g>'+
  /* nodes */
  nodeC(70,70,'#ffd27a')+nodeC(372,96,'#8fe3ff')+nodeC(360,250,'#c4b3ff')+nodeC(96,268,'#9fd0ff')+
  '<g stroke="rgba(255,255,255,.35)" stroke-width="1.3" stroke-dasharray="2 6">'+
   '<path d="M70 70 150 120"/><path d="M372 96 300 130"/><path d="M360 250 300 210"/><path d="M96 268 160 220"/>'+
  '</g>'+
  '</svg>'}
 function nodeC(x,y,c){return '<g transform="translate('+x+' '+y+')"><circle r="12" fill="rgba(255,255,255,.12)"/><circle r="5" fill="'+c+'"/></g>'}

 /* ---------- real map (Leaflet + OSM) ---------- */
 var CITIES=[
  {name:'Ostrava',cc:'Česko',lat:49.8209,lng:18.2625,color:'#1f3fb0'},
  {name:'Bratislava',cc:'Slovensko',lat:48.1486,lng:17.1077,color:'#1f6fd6'},
  {name:'Budapešť',cc:'Maďarsko',lat:47.4979,lng:19.0402,color:'#6c3bc5'}
 ];
 var COUNTRY_STYLE={'Česko':'#1f3fb0','Slovensko':'#1f6fd6','Maďarsko':'#6c3bc5'};

 function loadLeaflet(cb){
  if(window.L){cb();return}
  var done=false;
  var css=document.createElement('link');
  css.rel='stylesheet';css.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
  document.head.appendChild(css);
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
  s.async=true;
  s.onload=function(){if(!done){done=true;cb()}};
  s.onerror=function(){if(!done){done=true;cb(new Error('leaflet'))}};
  document.head.appendChild(s);
 }

 function mapFallback(box){
  box.classList.add('is-fallback');
  box.innerHTML='<div style="text-align:center;color:#56657a;font-size:14px;line-height:1.6">'+
   '<b style="display:block;color:#0b2540;font-size:15px;margin-bottom:6px">Doručujeme do 3 zemí</b>'+
   'Česko · Slovensko · Maďarsko</div>';
 }

 function initMap(){
  var box=document.getElementById('okla-about-map');
  if(!box||box.__inited)return;
  box.__inited=true;
  loadLeaflet(function(err){
   if(err||!window.L){mapFallback(box);return}
   try{
    var L=window.L;
    var map=L.map(box,{scrollWheelZoom:false,zoomControl:true,attributionControl:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     maxZoom:12,minZoom:4,
     attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.setView([48.7,17.8],6);
    /* Default frame on CZ/SK/HU; replaced by the exact border bounds once the
       GeoJSON loads. We re-fit after invalidateSize so a late layout (the box
       was narrow when tiles first drew) still ends framed on the three countries. */
    var fitTo=L.latLngBounds([45.7,12.0],[51.2,22.6]);
    function refit(){try{map.invalidateSize();if(fitTo)map.fitBounds(fitTo,{padding:[16,16],maxZoom:7})}catch(e){}}
    fetch(BASE+'v91/data/okla-map-cz-sk-hu.geojson')
     .then(function(r){return r.json()})
     .then(function(gj){
      var layer=L.geoJSON(gj,{
       style:function(f){
        var c=COUNTRY_STYLE[f.properties.name]||'#1f6fd6';
        return {color:c,weight:2,opacity:.9,fillColor:c,fillOpacity:.22};
       }
      }).addTo(map);
      layer.eachLayer(function(l){
       if(l.feature&&l.feature.properties)l.bindTooltip(l.feature.properties.name,{sticky:true,className:'oka-map-tip'});
      });
      try{fitTo=layer.getBounds();refit()}catch(e){}
     })
     .catch(function(){/* borders optional; tiles + markers still show */});
    CITIES.forEach(function(c){
     L.circleMarker([c.lat,c.lng],{radius:7,color:'#fff',weight:2,fillColor:c.color,fillOpacity:1})
      .addTo(map)
      .bindTooltip(c.name,{permanent:true,direction:'top',offset:[0,-6],className:'oka-map-tip'});
    });
    refit();
    setTimeout(refit,180);
    setTimeout(refit,700);
   }catch(e){mapFallback(box)}
  });
 }

 /* ---------- mount ---------- */
 function mount(){
  if(document.querySelector('.okla-about'))return true;
  var onPage=/^\/o-nas(\/|$)/.test(location.pathname);
  if(!onPage)return false;
  var host=document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  if(!host)return false;
  document.documentElement.classList.add('okla-about-takeover');
  var wrap=document.createElement('div');
  wrap.innerHTML=HTML;
  var node=wrap.firstChild;
  host.insertBefore(node,host.firstChild);
  document.title='O nás · OKLA';
  initMap();
  return true;
 }

 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
