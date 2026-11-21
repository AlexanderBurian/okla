/* Okla – dead-link guard. Some article bodies link to products that no longer
   exist, and the footer links to /stav-objednavky/, which 404s. Rather than let
   visitors land on a 404, this quietly HEAD-checks the internal links inside the
   article content and the footer; any that return 404/410 are neutralised —
   a dead article link becomes plain (unclickable) text, a dead footer entry is
   hidden. Results are cached per session, checks are bounded and only run on
   confirmed dead pages (network errors never remove anything). This is a safety
   net; the real fix is to repair the content / create the page in Shoptet. */
(function(){
 'use strict';
 if(window.__oklaDeadlinkGuard)return;window.__oklaDeadlinkGuard=true;

 /* results kept for a day (not per browser session), so a returning visitor does not check the footer links again */
 var CACHE_KEY='okla.deadlinks.v2',CACHE_TTL=24*3600*1000;
 var MAX_CHECKS=60;          /* hard cap on HEAD requests per page            */
 var CONCURRENCY=3;
 var cache={};
 var stored=null;try{stored=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch(e){}
 if(stored&&stored.t>Date.now()-CACHE_TTL&&stored.map)cache=stored.map;else stored=null;
 var savedAt=stored?stored.t:Date.now();
 var saveTimer=null;
 function saveCache(){if(saveTimer)return;saveTimer=setTimeout(function(){saveTimer=null;try{localStorage.setItem(CACHE_KEY,JSON.stringify({t:savedAt,map:cache}));}catch(e){}},300);}

 function sameOrigin(u){try{return new URL(u,location.href).origin===location.origin;}catch(e){return false;}}
 function isArticle(){return /^\/nase-novinky\/[^/]+\/?$/.test(location.pathname);}

 /* Collect the links worth checking: footer entries (everywhere) and, on an
    article page, the links inside the article body. */
 function candidates(){
  var scopes=[];
  var footer=document.querySelector('footer,#footer,.footer');if(footer)scopes.push(footer);
  if(isArticle()){
   var body=document.querySelector('.okla-clanek__layout')||document.querySelector('.entry,.article-content,#content .content-inner,main#content');
   if(body)scopes.push(body);
  }
  var seen={},out=[];
  scopes.forEach(function(scope){
   scope.querySelectorAll('a[href]').forEach(function(a){
    var h=a.getAttribute('href');
    if(!h||h.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(h))return;
    if(!sameOrigin(h))return;
    var u;try{u=new URL(h,location.href);}catch(e){return;}
    if(/\/action\//.test(u.pathname))return;                 /* Shoptet actions   */
    /* never the customer's own links: requesting the footer's "Odhlásit se" (/logout/) signed a signed-in customer
       out on every page; sign-in, account, cart and checkout addresses are not content either */
    if(/logout|odhlas/i.test(h)||/^\/(login|prihlaseni|registrace|klient|zapomenute-heslo|kosik|objednavka)(\/|$)/i.test(u.pathname))return;
    if(u.pathname===location.pathname)return;                /* link to self      */
    if(u.pathname==='/'||u.pathname==='')return;             /* homepage ≠ dead    */
    var key=u.origin+u.pathname;
    out.push({a:a,url:key});
    if(!seen[key])seen[key]=[];seen[key].push(a);
   });
  });
  return out;
 }

 function neutralize(a){
  if(!a||a.__oklaDead)return;a.__oklaDead=true;
  /* Footer: hide the whole menu entry. */
  if(a.closest('footer,#footer,.footer')){
   var li=a.closest('li');(li||a).style.setProperty('display','none','important');
   return;
  }
  /* Article product-recommendation card (image/name/price): hide the card. */
  var card=a.closest('.okla-clanek__card');
  if(card){card.style.setProperty('display','none','important');return;}
  /* Any other link that wraps an image / has no text: hide it rather than leave
     an empty span. */
  if(a.querySelector('img')||!a.textContent.trim()){
   (a.closest('li,figure')||a).style.setProperty('display','none','important');return;
  }
  /* Inline text link: drop the link, keep the words readable. */
  var span=document.createElement('span');
  span.className='okla-deadlink';
  span.textContent=a.textContent;
  span.setAttribute('title','Tato stránka už není k dispozici');
  span.style.cssText='color:inherit;text-decoration:none;cursor:default';
  if(a.parentNode)a.parentNode.replaceChild(span,a);
 }

 /* If an article aside loses all its cards, hide it and let the body go full
    width, so we never leave an empty sidebar column behind. */
 function cleanupAsides(){
  document.querySelectorAll('.okla-clanek__aside').forEach(function(aside){
   if(aside.querySelector('.okla-art-products'))return;   /* rebuilt from live homepage cards (okla_article_products.js) */
   var alive=[].slice.call(aside.querySelectorAll('.okla-clanek__card')).some(function(c){return getComputedStyle(c).display!=='none';});
   if(!alive){
    aside.style.setProperty('display','none','important');
    var lay=aside.closest('.okla-clanek__layout');
    if(lay){lay.style.setProperty('display','block','important');lay.style.setProperty('grid-template-columns','none','important');}
   }
  });
 }

 function headStatus(url){
  return fetch(url,{method:'HEAD',redirect:'follow',credentials:'same-origin'})
   .then(function(r){return r.status;})
   .catch(function(){return 0;});   /* network/abort -> unknown, do nothing */
 }

 /* Products of the old range that articles still link to: the link goes to the current product of the same kind;
    the ones without a successor are known to be gone (made plain text without asking the server). */
 var MOVED={
  '/laserovy-dalkomer-rychle-digitalni-mereni/':'/aneng-b60-laserovy-dalkomer-60-m/',
  '/digitalni-tloustkomer-presne-mereni-materialu/':'/hw-300-digitalni-tloustkomer-laku-a-povlaku-0-2000-m-fe-nfe/',
  '/ai-chytre-bryle-wai4-bezdratova-elektronika/':'/a2-chytre-bryle-s-kamerou-a-ai-prekladem/',
  '/usb-c-tester-digitalni-meric-napajeni/':'/fnirsi-fnb58-usb-tester-rychleho-nabijeni/',
  '/kapesni-digitalni-osciloskop-mereni-signalu/':'/fnirsi-2c23t-osciloskop-multimetr-a-generator-3v1/',
  '/wi-fi-endoskopicka-kamera-bezdratova-inspekce/':'/f220-wi-fi-endoskop-5-5-mm-5-m/',
  '/usb-c-endoskopicka-kamera-inspekce-tezko-dostupnych-mist/':'/nk-5001-pro-3v1-endoskop-5-5-mm/',
  '/usb-digitalni-mikroskop-detaily-na-displeji/':'/hm020-digitalni-mikroskop-s-2-displejem/'
 };
 var GONE={'/digitalni-kapesni-vaha-presnost-zobrazeni-0-01-g/':1,'/nfc-karta-pro-google-recenze-priloz-a-ohodnot/':1,'/r99-chytry-prsten/':1,'/usb-c-pajecka-kompaktni-pajeci-nastroj/':1};
 function remap(){
  document.querySelectorAll('a[href]').forEach(function(a){
   var u;try{u=new URL(a.getAttribute('href'),location.href);}catch(e){return;}
   if(u.origin!==location.origin)return;
   if(MOVED[u.pathname]){a.setAttribute('href',MOVED[u.pathname]);return;}
   if(GONE[u.pathname]){cache[u.origin+u.pathname]=404;}
  });
 }

 function run(){
  remap();
  var list=candidates().slice(0,MAX_CHECKS);
  var i=0;
  function worker(){
   if(i>=list.length)return Promise.resolve();
   var item=list[i++];
   var cached=cache[item.url];
   if(cached!==undefined){
    if(cached===404||cached===410)neutralize(item.a);
    return worker();
   }
   return headStatus(item.url).then(function(st){
    if(st){cache[item.url]=st;saveCache();if(st===404||st===410)neutralize(item.a);}
    return worker();
   });
  }
  var pool=[];for(var k=0;k<CONCURRENCY;k++)pool.push(worker());
  return Promise.all(pool).then(cleanupAsides);
 }

 function start(){ (window.requestIdleCallback||function(f){setTimeout(f,400);})(run); }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.addEventListener('load',function(){setTimeout(run,1200);},{once:true});
})();
