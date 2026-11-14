/* OKLA – homepage deal cards (Best Buy style, one heading per card) and, for guests, a sign-in strip at the bottom.
   Cards: our measuring instruments - title, what it measures, a cut-out photo of the product (the shop's own photo),
   the price and a "Nakoupit" button. The price written here is only the first paint: once the row comes into view the
   real price is read from each product page, and a product that no longer exists drops out. No discounts are claimed.
   Placement: the cards lower on the page (after the first two product sliders, before the warranty strip); the
   sign-in strip at the very bottom of the page content (after the magazine). Both are kept in place when other scripts re-order the sections.
   The card headings use Barlow Condensed 700 (OFL, served with our files from v91/fonts). */
(function(){
 'use strict';
 if(window.__oklaHomeDealsV1)return;window.__oklaHomeDealsV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';
 var DEALS=[
  {url:'/wintact-wt87a-digitalni-anemometr/',img:'wt87a',title:'Měř vítr',claim:'Rychlost vzduchu',price:589,alt:'Wintact WT87A digitální anemometr',copy:'za kompaktní digitální anemometr pro rychlé měření proudění vzduchu.'},
  {url:'/benetech-gm8902-anemometr-s-oddelenou-sondou/',img:'gm8902',title:'Měř průtok',claim:'Průtok vzduchu',price:1189,alt:'Benetech GM8902 anemometr s oddělenou sondou',copy:'za anemometr s oddělenou sondou pro pohodlné měření průtoku.'},
  {url:'/benetech-gm610-vlhkomer-dreva/',img:'gm610',title:'Měř dřevo',claim:'Vlhkost dřeva',price:589,alt:'Benetech GM610 vlhkoměr dřeva',copy:'za hrotový vlhkoměr dřeva s rychlým odečtem na přehledném displeji.'},
  {url:'/benetech-gm605-vlhkomer-dreva-a-stavebnich-materialu/',img:'gm605',title:'Měř zdivo',claim:'Vlhkost materiálů',price:389,alt:'Benetech GM605 vlhkoměr dřeva a stavebních materiálů',copy:'za kompaktní vlhkoměr dřeva a vybraných stavebních materiálů.'}
 ];
 (function font(){
  if(document.getElementById('okla-deals-font'))return;
  var st=document.createElement('style');st.id='okla-deals-font';
  st.textContent="@font-face{font-family:'OKLA Condensed';font-style:normal;font-weight:700;font-display:swap;src:url("+base+"v91/fonts/barlow-condensed-700-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}"+
   "@font-face{font-family:'OKLA Condensed';font-style:normal;font-weight:700;font-display:swap;src:url("+base+"v91/fonts/barlow-condensed-700-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}";
  document.head.appendChild(st);
 })();
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
  var box=el('section');box.id='okla-signin-strip';box.setAttribute('aria-label','Zákaznický účet');
  var ic=document.createElementNS('http://www.w3.org/2000/svg','svg');ic.setAttribute('viewBox','0 0 24 24');ic.setAttribute('aria-hidden','true');ic.setAttribute('class','oks-icon');
  ic.innerHTML='<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3.2"/><path d="M6.2 18.4a6.6 6.6 0 0 1 11.6 0"/>';
  var txt=el('p','oks-text','Přihlaste se pro rychlejší nákup, přehled objednávek a snadnou reklamaci.');
  var act=el('div','oks-actions');
  var a1=el('a','oks-btn oks-btn--primary','Přihlásit se');a1.href='/login/?backTo=%2F';
  var a2=el('a','oks-btn oks-btn--ghost','Vytvořit účet');a2.href='/registrace/';
  act.append(a1,a2);box.append(ic,txt,act);return box;
 }
 /* where the cards go: before the warranty strip, else before the third product heading, else before the magazine */
 function dealsRef(main){
  var w=main.querySelector(':scope>#okla-warranty');if(w)return w;
  var h=main.querySelectorAll(':scope>.homepage-group-title');if(h.length>2)return h[2];
  return main.querySelector(':scope>#okla-news-v55');
 }
 function mount(){
  if(document.getElementById('okla-deals'))return true;
  var circles=document.getElementById('okla-cat-circles');if(!circles||!circles.parentNode)return false;
  var main=circles.parentNode;
  if(main.querySelectorAll(':scope>.okla-slider-shell').length<2&&tries<60)return false;
  var ref=dealsRef(main);if(!ref)return false;
  var deals=buildDeals();main.insertBefore(deals,ref);livePrices(deals);
  var strip=guest()?buildSignin():null;if(strip)main.appendChild(strip);
  function fix(){
   if(deals.parentNode!==main)return;
   var r=dealsRef(main);if(r&&r!==deals&&deals.nextElementSibling!==r)main.insertBefore(deals,r);
   if(strip&&strip.parentNode===main&&main.lastElementChild!==strip)main.appendChild(strip);
  }
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 var tries=0;
 (function tick(){if(mount())return;if(++tries<100)setTimeout(tick,120)})();
})();
