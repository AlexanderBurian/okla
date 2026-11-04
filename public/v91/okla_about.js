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
 /* load the page font (Exo 2 — the site's own font) with the weights we use */
 (function(){var id='okla-about-font';if(!document.getElementById(id)){var l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&display=swap';(document.head||document.documentElement).appendChild(l);}})();
 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
 function ic(paths){var p='';for(var i=0;i<paths.length;i++)p+='<path d="'+paths[i]+'"/>';return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'}

 function stat(img,num,label){return '<div class="oka-stat"><img class="oka-stat__ic" src="'+IMG(img)+'" alt="" loading="lazy"><div class="oka-stat__n">'+num+'</div><div class="oka-stat__l">'+label+'</div></div>'}
 function feat(rev,img,alt,h,p,href,linkText){
  return '<div class="oka-feat'+(rev?' oka-feat--rev':'')+'"><div class="oka-wrap">'+
   '<img class="oka-feat__img" src="'+IMG(img)+'" alt="'+alt+'" loading="lazy">'+
   '<div class="oka-feat__body"><h2>'+h+'</h2><p>'+p+'</p>'+
   '<a class="oka-link" href="'+href+'">'+linkText+ARROW+'</a></div>'+
  '</div></div>'
 }
 function bizli(t){return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>'+t+'</span></li>'}
 function art(img,alt,cat,h){return '<a class="oka-art" href="/newsroom/">'+
   '<img class="oka-art__img" src="'+IMG(img)+'" alt="'+alt+'" loading="lazy">'+
   '<span class="oka-art__cap"><span class="oka-art__cat">'+cat+'</span><h3>'+h+'</h3></span>'+
 '</a>'}

 var HTML=''+
 '<section class="okla-about" aria-label="O nás">'+

 /* HERO */
 '<div class="oka-hero">'+
   '<img class="oka-hero__img" src="'+IMG('hero-building.webp')+'" alt="Budova OKLA">'+
   '<div class="oka-wrap"><div class="oka-hero__text">'+
     '<h1>Gadgety a chytrá elektronika, kterým rozumíme</h1>'+
     '<p>OKLA je český e-shop s pečlivě vybranou technikou: od Flipper Zero přes Wi-Fi endoskopy a USB-C testery po měřicí přístroje. Vybíráme, testujeme a posíláme z Ostravy do tří zemí.</p>'+
     '<div class="oka-hero__cta">'+
       '<a class="oka-btn oka-btn--white" href="/">Prohlédnout sortiment'+ARROW+'</a>'+
       '<a class="oka-link" href="/kontakt/">Napište nám'+ARROW+'</a>'+
     '</div>'+
   '</div></div>'+
 '</div>'+

 /* STATS */
 '<div class="oka-stats"><div class="oka-wrap">'+
   stat('icon-founded.webp','2019','Rok založení')+
   stat('icon-products.webp','33','Produktů v nabídce')+
   stat('icon-countries.webp','3','Země doručení')+
   stat('icon-express.webp','24 h','Expedice ze skladu')+
 '</div></div>'+

 /* INTRO */
 '<div class="oka-sec oka-intro"><div class="oka-wrap">'+
   '<h2 class="oka-h2">Malý tým, který techniku opravdu baví</h2>'+
   '<p>Začali jsme v roce 2019 v Ostravě z jednoduché frustrace: zajímavé gadgety se v Česku buď nedaly sehnat, nebo k nim nikdo neuměl poradit. Dnes je OKLA kurátorský obchod. Raději méně produktů, ale takových, za kterými si stojíme a které sami používáme.</p>'+
 '</div></div>'+

 /* FEATURE ROWS */
 feat(false,'vyber.jpg','Výběr produktů','Pečlivě vybíráme, co prodáváme',
   'Neprodáváme všechno. Do nabídky se dostane jen to, co bychom si koupili i my. Sledujeme novinky, crowdfunding i vaše tipy a vybíráme, co má reálný smysl.',
   '/','Jak vybíráme')+
 feat(true,'test.jpg','Testování','Každý produkt vyzkoušíme',
   'Než se produkt objeví v nabídce, projde rukama technika. Zapojíme ho, vyzkoušíme reálné použití a napíšeme srozumitelný popis, ne jen opsaný datasheet.',
   '/kontakt/','Zeptejte se nás')+
 feat(false,'sklad.jpg','Sklad a expedice','Expedujeme z Ostravy do 24 hodin',
   'Sklad a zázemí máme v Ostravě. Objednávky balíme a odesíláme zpravidla do 24 hodin v pracovní dny a doručujeme přes zavedené dopravce a výdejní místa.',
   '/doprava-a-platba/','Doprava a platba')+

 /* BLUE B2B BAND */
 '<div class="oka-biz">'+
   '<img class="oka-biz__img" src="'+IMG('firmy.jpg')+'" alt="Prodejna a velkoobchod" loading="lazy">'+
   '<div class="oka-biz__body"><div class="oka-biz__inner">'+
     '<h2>Provozujete e-shop nebo prodejnu? Odebírejte velkoobchodně</h2>'+
     '<ul class="oka-biz__list">'+
       bizli('Zvýhodněné ceny při pravidelném odběru')+
       bizli('Skladová dostupnost a expedice z Ostravy do 24 hodin')+
       bizli('Osobní kontakt a poradenství, žádné call centrum')+
     '</ul>'+
     '<a class="oka-btn oka-btn--white" href="mailto:podpora@okla.cz?subject=Velkoobchodn%C3%AD%20spolupr%C3%A1ce">Chci spolupracovat'+ARROW+'</a>'+
   '</div></div>'+
 '</div>'+

 /* MAP */
 '<div class="oka-sec oka-map"><div class="oka-wrap">'+
   '<div class="oka-map__head">'+
     '<h2 class="oka-h2">Doručujeme do Česka, Slovenska a Maďarska</h2>'+
     '<p>Z Ostravy posíláme do všech tří zemí, s podporou v místním jazyce. Na Slovensko od roku 2022, do Maďarska od roku 2024.</p>'+
   '</div>'+
   '<div id="okla-about-map" role="img" aria-label="Mapa: Česko, Slovensko a Maďarsko"></div>'+
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
  var padx=(maxx-minx)*0.09,pady=(maxy-miny)*0.09;
  var bx0=minx-padx,bx1=maxx+padx,by0=miny-pady,by1=maxy+pady;
  var H=Math.round(W*((by1-by0)/(bx1-bx0)));
  function px(lon){return (lon-bx0)/(bx1-bx0)*W}
  function py(lat){return (by1-mercY(lat))/(by1-by0)*H}
  function dOf(geom){var d='';ringsOf(geom).forEach(function(r){for(var i=0;i<r.length;i++){d+=(i?'L':'M')+px(r[i][0]).toFixed(1)+' '+py(r[i][1]).toFixed(1)}d+='Z'});return d}
  function centroidPx(geom){var best=null,bestA=-1;ringsOf(geom).forEach(function(r){var x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;r.forEach(function(p){if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]});var a=(x1-x0)*(y1-y0);if(a>bestA){bestA=a;best=[(x0+x1)/2,(y0+y1)/2]}});return best?[px(best[0]),py(best[1])]:null}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  /* only our three states — no grey neighbours behind them */
  var home='',labels='';
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
   '<g class="oka-cemap__home">'+home+'</g><g class="oka-cemap__labels">'+labels+'</g></svg>';
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

 /* ---------- count-up stats (PPL-style, runs when scrolled into view) ---------- */
 function initCounters(){
  var nodes=document.querySelectorAll('.oka-stat__n');
  if(!nodes.length)return;
  nodes.forEach(function(el){
   var txt=el.textContent.trim();
   var m=txt.match(/\d[\d   \s]*\d|\d/); /* the number, keeping internal spaces */
   if(!m){return}
   el.__prefix=txt.slice(0,m.index);
   el.__suffix=txt.slice(m.index+m[0].length);
   el.__target=parseInt(m[0].replace(/[\s   ]/g,''),10)||0;
   el.textContent=el.__prefix+'0'+el.__suffix;
  });
  function fmt(el,n){var s=String(n);if(el.__target>=10000)s=s.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return el.__prefix+s+el.__suffix}
  function run(el){
   if(el.__ran||el.__target==null)return;el.__ran=true;
   var dur=1300,start=null;
   function step(ts){if(!start)start=ts;var p=Math.min(1,(ts-start)/dur);var e=1-Math.pow(1-p,3);el.textContent=fmt(el,Math.round(e*el.__target));if(p<1)requestAnimationFrame(step)}
   requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){nodes.forEach(run);return}
  var io=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){run(en.target);io.unobserve(en.target)}})},{threshold:.5});
  nodes.forEach(function(el){io.observe(el)});
 }

 /* ---------- news carousel (infinite loop) ---------- */
 function initCarousel(){
  var car=document.querySelector('.oka-carousel');
  if(!car||car.__inited)return;car.__inited=true;
  var track=car.querySelector('.oka-carousel__track');
  var originals=[].slice.call(track.children);
  var n=originals.length;if(!n)return;
  var dotsWrap=document.querySelector('.oka-car__dots');
  var loop=n>1;
  if(loop){track.innerHTML='';for(var c=0;c<3;c++){originals.forEach(function(s){track.appendChild(s.cloneNode(true))})}}
  var slides=[].slice.call(track.children);
  var idx=loop?n:0; /* first real article, centred; neighbours peek via the copies */
  var dots=originals.map(function(_,i){var b=document.createElement('button');b.type='button';b.className='oka-car__dot';b.setAttribute('aria-label','Článek '+(i+1));b.addEventListener('click',function(){goReal(i)});if(dotsWrap)dotsWrap.appendChild(b);return b});
  function apply(animate){
   var W=car.clientWidth||1,sw=slides[0].getBoundingClientRect().width,gap=parseFloat(getComputedStyle(track).gap)||0;
   track.style.transition=animate?'':'none';
   track.style.transform='translateX('+((W-sw)/2 - idx*(sw+gap)).toFixed(1)+'px)';
   if(!animate){void track.offsetWidth;}
   slides.forEach(function(s,i){s.classList.toggle('is-active',i===idx)});
   var real=((idx%n)+n)%n;dots.forEach(function(d,i){d.classList.toggle('is-active',i===real)});
  }
  function normalize(){if(!loop)return;if(idx<n){idx+=n;apply(false)}else if(idx>=2*n){idx-=n;apply(false)}}
  function move(dir){if(!loop){idx=Math.max(0,Math.min(n-1,idx+dir))}else{idx+=dir}apply(true)}
  function goReal(real){if(loop){var cur=((idx%n)+n)%n,d=real-cur;idx+=d}else{idx=real}apply(true)}
  car.querySelectorAll('.oka-car__btn').forEach(function(b){b.addEventListener('click',function(){move(parseInt(b.getAttribute('data-dir'),10))})});
  track.addEventListener('transitionend',function(e){if(e.propertyName==='transform')normalize()});
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){apply(false)},120)});
  apply(false);setTimeout(function(){apply(false)},300);setTimeout(function(){apply(false)},900);
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
  initCounters();
  initCarousel();
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
