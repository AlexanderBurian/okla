/* OKLA V91 – "O nás" page, rebuilt PPL-style: full-width, clean white, one brand
   blue, no gradients / eyebrows / decorative graphics, real committed stock
   photos. Includes a flat SVG map (our three states in one blue, neighbours
   grey) built from committed GeoJSON with real borders. Shown on /o-nas/
   (takes over the CMS page). Company facts are editorial placeholders for OKLA
   to adjust here — no fabricated registry IDs, awards or certifications. */
(function(){
 'use strict';
 if(window.__oklaAboutV1)return;
 window.__oklaAboutV1=true;

 var BASE=window.__oklaAssetBase||'';
 function IMG(f){return BASE+'v91/img/about/'+f}
 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
 function ic(paths){var p='';for(var i=0;i<paths.length;i++)p+='<path d="'+paths[i]+'"/>';return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'}

 function stat(paths,num,label){return '<div class="oka-stat"><div class="oka-stat__ic">'+ic(paths)+'</div><div class="oka-stat__n">'+num+'</div><div class="oka-stat__l">'+label+'</div></div>'}
 function feat(rev,img,alt,h,p,href,linkText){
  return '<div class="oka-feat'+(rev?' oka-feat--rev':'')+'"><div class="oka-wrap">'+
   '<img class="oka-feat__img" src="'+IMG(img)+'" alt="'+alt+'" loading="lazy">'+
   '<div class="oka-feat__body"><h2>'+h+'</h2><p>'+p+'</p>'+
   '<a class="oka-link" href="'+href+'">'+linkText+ARROW+'</a></div>'+
  '</div></div>'
 }
 function bizli(t){return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>'+t+'</span></li>'}
 function art(img,alt,h,p){return '<a class="oka-art" href="/newsroom/"><img class="oka-art__img" src="'+IMG(img)+'" alt="'+alt+'" loading="lazy"><h3>'+h+'</h3><p>'+p+'</p><span class="oka-art__more">'+ARROW+'</span></a>'}

 var HTML=''+
 '<section class="okla-about" aria-label="O nás">'+

 /* HERO */
 '<div class="oka-sec oka-hero"><div class="oka-wrap">'+
   '<div class="oka-hero__text">'+
     '<h1>Gadgety a chytrá elektronika, kterým rozumíme</h1>'+
     '<p>OKLA je český e-shop s pečlivě vybranou technikou — od Flipper Zero přes Wi-Fi endoskopy a USB-C testery po měřicí přístroje. Vybíráme, testujeme a posíláme z Ostravy do tří zemí.</p>'+
     '<div class="oka-hero__cta">'+
       '<a class="oka-btn" href="/">Prohlédnout sortiment'+ARROW+'</a>'+
       '<a class="oka-link" href="/kontakty/">Napište nám'+ARROW+'</a>'+
     '</div>'+
   '</div>'+
   '<img class="oka-hero__img" src="'+IMG('hero.jpg')+'" alt="Elektronika a gadgety">'+
 '</div></div>'+

 /* STATS */
 '<div class="oka-stats"><div class="oka-wrap">'+
   stat(['M12 3 3 8v8l9 5 9-5V8z','M3 8l9 5 9-5','M12 13v8'],'2019','Rok založení')+
   stat(['M4 6h16v13H4z','M4 10h16','M9 15h6'],'33','Produktů v nabídce')+
   stat(['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z','M12 12a2 2 0 1 0 0-.01'],'3','Země doručení')+
   stat(['M12 7v5l3 2','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],'24 h','Expedice ze skladu')+
 '</div></div>'+

 /* INTRO */
 '<div class="oka-sec oka-intro"><div class="oka-wrap">'+
   '<h2 class="oka-h2">Malý tým, který techniku opravdu baví</h2>'+
   '<p>Začali jsme v roce 2019 v Ostravě z jednoduché frustrace: zajímavé gadgety se v Česku buď nedaly sehnat, nebo k nim nikdo neuměl poradit. Dnes je OKLA kurátorský obchod — raději méně produktů, ale takových, za kterými si stojíme a které sami používáme.</p>'+
 '</div></div>'+

 /* FEATURE ROWS */
 feat(false,'vyber.jpg','Výběr produktů','Pečlivě vybíráme, co prodáváme',
   'Neprodáváme všechno. Do nabídky se dostane jen to, co bychom si koupili i my — sledujeme novinky, crowdfunding i vaše tipy a vybíráme, co má reálný smysl.',
   '/','Jak vybíráme')+
 feat(true,'test.jpg','Testování','Každý produkt vyzkoušíme',
   'Než se produkt objeví v nabídce, projde rukama technika. Zapojíme ho, vyzkoušíme reálné použití a napíšeme srozumitelný popis — ne jen opsaný datasheet.',
   '/kontakty/','Zeptejte se nás')+
 feat(false,'sklad.jpg','Sklad a expedice','Expedujeme z Ostravy do 24 hodin',
   'Sklad a zázemí máme v Ostravě. Objednávky balíme a odesíláme zpravidla do 24 hodin v pracovní dny a doručujeme přes zavedené dopravce a výdejní místa.',
   '/doprava-a-platba/','Doprava a platba')+

 /* BLUE B2B BAND */
 '<div class="oka-biz">'+
   '<div class="oka-biz__body">'+
     '<h2>Provozujete e-shop nebo prodejnu? Odebírejte velkoobchodně</h2>'+
     '<ul class="oka-biz__list">'+
       bizli('Zvýhodněné ceny při pravidelném odběru')+
       bizli('Skladová dostupnost a expedice z Ostravy do 24 hodin')+
       bizli('Osobní kontakt a poradenství — žádné call centrum')+
     '</ul>'+
     '<a class="oka-btn oka-btn--white" href="mailto:podpora@okla.cz?subject=Velkoobchodn%C3%AD%20spolupr%C3%A1ce">Chci spolupracovat'+ARROW+'</a>'+
   '</div>'+
   '<img class="oka-biz__img" src="'+IMG('firmy.jpg')+'" alt="Prodejna a velkoobchod" loading="lazy">'+
 '</div>'+

 /* MAP */
 '<div class="oka-sec oka-map"><div class="oka-wrap">'+
   '<div class="oka-map__head">'+
     '<h2 class="oka-h2">Doručujeme do Česka, Slovenska a Maďarska</h2>'+
     '<p>Z Ostravy posíláme do všech tří zemí — s podporou v místním jazyce. Na Slovensko od roku 2022, do Maďarska od roku 2024.</p>'+
   '</div>'+
   '<div id="okla-about-map" role="img" aria-label="Mapa: Česko, Slovensko a Maďarsko"></div>'+
 '</div></div>'+

 /* NEWS */
 '<div class="oka-sec oka-news"><div class="oka-wrap">'+
   '<div class="oka-news__top">'+
     '<h2 class="oka-h2">Z našeho newsroomu</h2>'+
     '<a class="oka-link" href="/newsroom/">Všechny články'+ARROW+'</a>'+
   '</div>'+
   '<div class="oka-news__grid">'+
     art('news-3.jpg','Flipper Zero','Flipper Zero: k čemu slouží a co svede','Vysvětlujeme, co multifunkční nástroj umí — a kde se hodí při běžném testování.')+
     art('news-2.jpg','Chytrá domácnost','Chytrá domácnost: kde začít','Chytré zámky, senzory a zásuvky. Poradíme, jak sestavit první funkční sadu.')+
     art('news-1.jpg','Měřicí technika','Měřicí technika v praxi','USB-C testery, multimetry a endoskopy — na co se dívat při výběru.')+
   '</div>'+
 '</div></div>'+

 /* CLOSING */
 '<div class="oka-sec oka-sec--tight oka-close"><div class="oka-wrap">'+
   '<h2 class="oka-h2">Nevíte si rady s výběrem?</h2>'+
   '<p>Napište nám a poradíme podle toho, k čemu přístroj budete používat. Odpoví vám někdo z našeho týmu — česky i slovensky.</p>'+
   '<div class="oka-close__cta">'+
     '<a class="oka-btn" href="/kontakty/">Kontaktujte nás'+ARROW+'</a>'+
     '<a class="oka-btn oka-btn--ghost" href="mailto:podpora@okla.cz">Napsat e-mail</a>'+
   '</div>'+
   '<div class="oka-close__meta">Sklad a zázemí: Ostrava · <a href="mailto:podpora@okla.cz">podpora@okla.cz</a> · Po–Pá 9:00–17:00</div>'+
 '</div></div>'+

 '</section>';

 /* ---------- flat graphic map (styled SVG choropleth; real borders, one colour) ---------- */
 function mapFallback(box){
  box.classList.add('is-fallback');
  box.innerHTML='<div style="text-align:center;color:#5c6676;font-size:14px;line-height:1.6">'+
   '<b style="display:block;color:#141c28;font-size:15px;margin-bottom:6px">Doručujeme do 3 zemí</b>'+
   'Česko · Slovensko · Maďarsko</div>';
 }
 function mercY(lat){return Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*(180/Math.PI)}
 function ringsOf(geom){var rs=[];if(geom.type==='Polygon')geom.coordinates.forEach(function(r){rs.push(r)});else if(geom.type==='MultiPolygon')geom.coordinates.forEach(function(p){p.forEach(function(r){rs.push(r)})});return rs}
 function buildMap(box,gj){
  var W=1000,feats=gj.features;
  var minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  feats.forEach(function(f){if(f.properties.role!=='home')return;ringsOf(f.geometry).forEach(function(r){r.forEach(function(p){var x=p[0],y=mercY(p[1]);if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y})})});
  if(minx>maxx){mapFallback(box);return}
  var padx=(maxx-minx)*0.40,pady=(maxy-miny)*0.30;
  var bx0=minx-padx,bx1=maxx+padx,by0=miny-pady,by1=maxy+pady;
  var H=Math.round(W*((by1-by0)/(bx1-bx0)));
  function px(lon){return (lon-bx0)/(bx1-bx0)*W}
  function py(lat){return (by1-mercY(lat))/(by1-by0)*H}
  function dOf(geom){var d='';ringsOf(geom).forEach(function(r){for(var i=0;i<r.length;i++){d+=(i?'L':'M')+px(r[i][0]).toFixed(1)+' '+py(r[i][1]).toFixed(1)}d+='Z'});return d}
  function centroidPx(geom){var best=null,bestA=-1;ringsOf(geom).forEach(function(r){var x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;r.forEach(function(p){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]});var a=(x1-x0)*(y1-y0);if(a>bestA){bestA=a;best=[(x0+x1)/2,(y0+y1)/2]}});return best?[px(best[0]),py(best[1])]:null}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  var ctx='',home='',labels='';
  feats.forEach(function(f){if(f.properties.role==='context')ctx+='<path class="oka-cc" d="'+dOf(f.geometry)+'"/>'});
  feats.forEach(function(f){
   if(f.properties.role!=='home')return;
   home+='<path class="oka-hc" data-name="'+esc(f.properties.name)+'" d="'+dOf(f.geometry)+'"/>';
   var c=centroidPx(f.geometry);
   if(c){var name=f.properties.name,w=name.length*11+28;
    labels+='<g class="oka-lab" transform="translate('+c[0].toFixed(1)+' '+c[1].toFixed(1)+')">'+
     '<rect x="'+(-w/2).toFixed(1)+'" y="-17" width="'+w+'" height="32" rx="9"/>'+
     '<text x="0" y="5" text-anchor="middle">'+esc(name)+'</text></g>';
   }
  });
  box.innerHTML='<svg class="oka-cemap" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa: Česko, Slovensko a Maďarsko">'+
   '<g class="oka-cemap__ctx">'+ctx+'</g><g class="oka-cemap__home">'+home+'</g><g class="oka-cemap__labels">'+labels+'</g></svg>';
 }
 function initMap(){
  var box=document.getElementById('okla-about-map');
  if(!box||box.__inited)return;
  box.__inited=true;
  fetch(BASE+'v91/data/okla-map-central-europe.geojson')
   .then(function(r){return r.json()})
   .then(function(gj){buildMap(box,gj)})
   .catch(function(){mapFallback(box)});
 }

 /* ---------- mount ---------- */
 function mount(){
  if(document.querySelector('.okla-about'))return true;
  if(!/^\/o-nas(\/|$)/.test(location.pathname))return false;
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
