/* OKLA – homepage deal cards (Best Buy style, one heading per card) and, for guests, a sign-in strip among the product rows.
   Cards: our measuring instruments - title, what it measures, a cut-out photo of the product (the shop's own photo),
   the price and a "Nakoupit" button. The price written here is only the first paint: once the row comes into view the
   real price is read from each product page, and a product that no longer exists drops out. No discounts are claimed.
   Placement: the cards lower on the page (after the first two product sliders, before the warranty strip); the
   sign-in strip among the product rows (before the first extra row, after the shop's own rows). Both are kept in place when other scripts re-order the sections. */
(function(){
 'use strict';
 if(window.__oklaHomeDealsV1)return;window.__oklaHomeDealsV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';
 var DEALS=[
  {url:'/wintact-wt87a-digitalni-anemometr/',img:'wt87a',title:'Jak fouká?',claim:'Rychlost větru i vzduchu',price:589,alt:'Wintact WT87A digitální anemometr',copy:'za kompaktní digitální anemometr pro rychlé měření proudění vzduchu.'},
  {url:'/benetech-gm8902-anemometr-s-oddelenou-sondou/',img:'gm8902',title:'Větrání OK?',claim:'Průtok vzduchu z výdechů',price:1189,alt:'Benetech GM8902 anemometr s oddělenou sondou',copy:'za anemometr s oddělenou sondou pro pohodlné měření průtoku.'},
  {url:'/benetech-gm610-vlhkomer-dreva/',img:'gm610',title:'Suché dříví?',claim:'Vlhkost dřeva na topení',price:589,alt:'Benetech GM610 vlhkoměr dřeva',copy:'za hrotový vlhkoměr dřeva s rychlým odečtem na přehledném displeji.'},
  {url:'/benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu/',img:'gm605',title:'Suchá zeď?',claim:'Vlhkost dřeva i zdiva',price:389,alt:'Benetech GM605 vlhkoměr dřeva a stavebních materiálů',copy:'za kompaktní vlhkoměr dřeva a vybraných stavebních materiálů.'}
 ];
 function kc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function buildDeals(){
  var sec=el('section');sec.id='okla-deals';sec.setAttribute('aria-label','Měřicí přístroje OKLA');
  var track=el('div','okd-track');
  DEALS.forEach(function(d){
   var card=el('article','okd-card');card.setAttribute('data-url',d.url);
   var t=el('h2','okd-title',d.title),c=el('p','okd-claim',d.claim);
   var il=el('a','okd-image');il.href=d.url;il.tabIndex=-1;il.setAttribute('aria-hidden','true');
   var img=el('img');img.src=base+'v91/img/deals/'+d.img+'.webp';img.alt='';img.loading='lazy';img.decoding='async';il.appendChild(img);
   var p=el('p','okd-copy'),s=el('strong','okd-price',kc(d.price));p.append(s,' '+d.copy);
   var b=el('a','okd-button','Nakoupit');b.href=d.url;b.setAttribute('aria-label','Nakoupit – '+d.alt);
   card.append(t,c,il,p,b);track.appendChild(card);
  });
  sec.appendChild(track);return sec;
 }
 /* the real price from the product page (same shop), once, when the row comes near the screen */
 function livePrices(sec){
  var done=false;
  function run(){
   if(done)return;done=true;
   [].forEach.call(sec.querySelectorAll('.okd-card'),function(card){
    fetch(card.getAttribute('data-url'),{credentials:'same-origin'}).then(function(r){
     if(r.status===404||r.status===410){card.remove();return null}
     return r.ok?r.text():null;
    }).then(function(html){
     if(!html)return;
     var m=html.match(/itemprop="price"\s+content="([\d.]+)"/);
     if(m&&+m[1]>0)card.querySelector('.okd-price').textContent=kc(+m[1]);
    }).catch(function(){});
   });
  }
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();run()}},{rootMargin:'300px'});io.observe(sec)}
  else setTimeout(run,1500);
 }
 function guest(){
  var dl=window.dataLayer||[];
  for(var i=0;i<dl.length;i++){var c=dl[i]&&dl[i].shoptet&&dl[i].shoptet.customer;if(c)return c.registered===false}
  return !!document.querySelector('a[href^="/login/"]');
 }
 function buildSignin(){
  /* Best Buy style: a heading, four true benefits of an OKLA account with ticks, two buttons */
  var box=el('section');box.id='okla-signin-strip';box.setAttribute('aria-label','Zákaznický účet');
  /* account pictogram (PC): shown next to the sign-in text, Best Buy style */
  var av=document.createElementNS('http://www.w3.org/2000/svg','svg');av.setAttribute('viewBox','0 0 24 24');av.setAttribute('aria-hidden','true');av.setAttribute('class','oks-avatar');av.innerHTML='<circle cx="12" cy="8" r="3.4"/><path d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"/>';
  box.appendChild(av);
  var main=el('div','oks-main');
  main.appendChild(el('h2','oks-title','Přihlaste se pro více výhod'));
  /* PC: the benefits as one plain line (no ticks) */
  main.appendChild(el('p','oks-sub','Rychlejší nákup, přehled objednávek, sledování zásilky a snadná reklamace.'));
  /* Mobile: the same benefits as a ticked list */
  var ul=el('ul','oks-list');
  ['Rychlejší nákup','Přehled objednávek','Sledování zásilky','Snadná reklamace'].forEach(function(t){
   var li=el('li','oks-item');
   var ic=document.createElementNS('http://www.w3.org/2000/svg','svg');ic.setAttribute('viewBox','0 0 24 24');ic.setAttribute('aria-hidden','true');ic.setAttribute('class','oks-tick');ic.innerHTML='<path d="m5 12.5 4.2 4.2L19 7"/>';
   li.append(ic,document.createTextNode(t));ul.appendChild(li);
  });
  main.appendChild(ul);
  var act=el('div','oks-actions');
  var a1=el('a','oks-btn oks-btn--primary','Přihlásit se');a1.href='/login/?backTo=%2F';
  var a2=el('a','oks-btn oks-btn--ghost','Vytvořit účet');a2.href='/registrace/';
  act.append(a1,a2);box.append(main,act);return box;
 }
 /* where the cards go: before the warranty strip, else before the third product heading, else before the magazine */
 function dealsRef(main){
  var w=main.querySelector(':scope>#okla-warranty');if(w)return w;
  var h=main.querySelectorAll(':scope>.homepage-group-title');if(h.length>2)return h[2];
  return main.querySelector(':scope>#okla-news-v55');
 }
 /* where the sign-in strip goes: before the first extra product row (okla_home_merge.js), else before the magazine */
 function stripRef(main){
  return main.querySelector(':scope>.homepage-group-title[data-okla-row-copy]')||main.querySelector(':scope>#okla-news-v55');
 }
 /* in place = right before r, other OKLA homepage sections between them allowed (deals, sign-in strip, promo can want
    the same spot; requiring "directly before" made them move each other for ever) */
 function before(node,r){var n=node.nextElementSibling;while(n&&n!==r&&/^(okla-deals|okla-signin-strip|okla-promo-deals)$/.test(n.id))n=n.nextElementSibling;return n===r}
 function place(strip){var main=document.getElementById('okla-cat-circles').parentNode,r=stripRef(main);if(r)main.insertBefore(strip,r);else main.appendChild(strip)}
 function mount(){
  if(document.getElementById('okla-deals'))return true;
  var circles=document.getElementById('okla-cat-circles');if(!circles||!circles.parentNode)return false;
  var main=circles.parentNode;
  if(main.querySelectorAll(':scope>.okla-slider-shell').length<2&&tries<60)return false;
  var ref=dealsRef(main);if(!ref)return false;
  var deals=buildDeals();main.insertBefore(deals,ref);livePrices(deals);
  var strip=guest()?buildSignin():null;if(strip)place(strip);
  function fix(){
   if(deals.parentNode!==main)return;
   var r=dealsRef(main);if(r&&r!==deals&&!before(deals,r))main.insertBefore(deals,r);
   if(strip&&strip.parentNode===main){var sr=stripRef(main);if(sr?!before(strip,sr):main.lastElementChild!==strip)place(strip)}
  }
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 var tries=0;
 (function tick(){if(mount())return;if(++tries<100)setTimeout(tick,120)})();
})();
