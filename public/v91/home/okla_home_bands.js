/* Okla – homepage bands (Best Buy "Laptops, reimagined" layout): one dark rounded band, on the left a lifestyle photo
   with a heading, a line under it, a link and a name at the bottom; on the right a row of product cards (the shared
   card look, okla_card.css). Two bands: pocket ESP32 devices (after the first product row) and measuring instruments
   with endoscopes - the big, good-looking ones (before the fourth product row).
   The products' photos are the shop's own, cut to one square frame (v91/img/lilygo). The price written here is only
   the first paint: once a band comes near the screen the real price and stock are read from each product page, and a
   product that no longer exists drops out. No discounts are claimed.
   PC: five cards at a time, round arrows move the row by a whole screen of cards. Phones: the photo above as a wide
   picture with the text on it, the cards below as a sideways row (endless, okla_mobile_loop.js). */
(function(){
 'use strict';
 if(window.__oklaHomeBands)return;window.__oklaHomeBands=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';
 var BANDS=[
  {id:'okla-lilygo',label:'Kapesní zařízení s ESP32',photo:'v91/img/promo/okla-lilygo-band.webp',pos:'32% 60%',
   title:'Elektronika do kapsy',sub:'Zařízení s ESP32 od LilyGO, M5Stack a Waveshare pro tvůrce a vývojáře',
   cta:'Nakupovat',href:'/elektronicke-multitooly/',mark:'ESP32',where:'row2',
   items:[
    ['/lilygo-t-deck-plus-kapesni-esp32-komunikator/','tdeck','LILYGO T-Deck Plus – kapesní komunikátor ESP32',2890],
    ['/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/','tembed','LILYGO T-Embed CC1101 – ESP32-S3 multitool',2590],
    ['/m5stack-cardputer-adv-programovatelny-mini-pocitac/','cardputer','M5Stack Cardputer ADV – mini počítač s klávesnicí',990],
    ['/lilygo-t-dongle-s3-plus/','tdongle','LILYGO T-Dongle S3 Plus',1089],
    ['/lilygo-t-display-s3-amoled/','tdisplay','LILYGO T-Display S3 AMOLED',2389],
    ['/waveshare-esp32-c3-s-0-71-kulatym-displejem/','wsc3','Waveshare ESP32-C3 s 0,71″ kulatým displejem',789],
    ['/lilygo-t-deck-plus-868-mhz-gps-u-blox-s-externi-antenou/','tdeck868','LILYGO T-Deck Plus 868 MHz s externí anténou',3189],
    ['/lilygo-t-embed-cc1101-plus-s-externimi-antenami-pruhledny/','tembedplus','LILYGO T-Embed CC1101 Plus s externí anténou',3289],
    ['/lilygo-t-encoder-pro-amoled/','tencoder','LILYGO T-Encoder Pro AMOLED',1989],
    ['/flipper-zero-wi-fi-devboard/','fzwifi','Flipper Zero Wi-Fi Devboard',1489],
    ['/lilygo-t-lora-c6-868-mhz/','tlora','LILYGO T-LoRa C6 868 MHz',1189],
    ['/lafvin-esp32-s3-wroom-super-starter-kit/','lafvin','LAFVIN ESP32-S3-WROOM Super Starter Kit',1489],
    ['/lilygo-fabgl-vga32-q127/','fabgl','LILYGO FabGL VGA32 Q127',789]
   ]},
  {id:'okla-tech',label:'Měřicí technika a endoskopy',photo:'v91/img/promo/okla-tech-band.webp',pos:'24% 50%',
   title:'Měřicí technika a endoskopy',sub:'Přesné přístroje pro dílnu, stavbu i domov',
   cta:'Nakupovat',href:'/merici-technika-a-naradi/',mark:'Měření a inspekce',where:'row4',
   items:[
    ['/p80-prumyslovy-endoskop-4-3-5-m/','p80','P80 průmyslový endoskop 4,3″ – 5 m',789],
    ['/fnirsi-wmt-10-bezkontaktni-vlhkomer-dreva-a-zdiva/','wmt10','FNIRSI WMT-10 bezkontaktní vlhkoměr',1189],
    ['/aneng-616-digitalni-multimetr-6000-counts/','a616','ANENG 616 digitální multimetr 6000 counts',589],
    ['/b313-inspekcni-kamera-se-dvema-objektivy-5-m/','b313','B313 inspekční kamera se dvěma objektivy 5 m',1289],
    ['/benetech-gm8902-anemometr-s-oddelenou-sondou/','gm8902','Benetech GM8902 anemometr s oddělenou sondou',1189],
    ['/aneng-th104-bezkontaktni-infracerveny-teplomer-s-barevnym-displejem-50-az-550-c/','th104','ANENG barevný infračervený teploměr',489],
    ['/fnirsi-lcr-p1-tester-soucastek/','lcrp1','FNIRSI LCR-P1 tester součástek',1289],
    ['/aneng-g50-zeleny-laserovy-dalkomer-50-m/','g50','ANENG G50 zelený laserový dálkoměr 50 m',789]
   ]}
 ];
 function kc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function build(B){
  var sec=el('section','olg-band');sec.id=B.id;sec.setAttribute('aria-label',B.label);
  /* the photo panel */
  var hero=el('a','olg-hero');hero.href=B.href;
  var img=el('img','olg-photo');img.src=base+B.photo;img.alt='';img.loading='lazy';img.decoding='async';img.draggable=false;sec.style.setProperty('--olg-pos',B.pos);
  /* if the photo cannot be loaded the band stays, the panel then plain dark */
  img.addEventListener('error',function(){img.remove()});
  var copy=el('div','olg-copy');
  copy.append(el('h2','olg-title',B.title),el('p','olg-sub',B.sub),el('span','olg-cta',B.cta));
  var mark=el('span','olg-mark',B.mark);mark.setAttribute('aria-hidden','true');
  hero.append(img,copy,mark);
  /* the cards */
  var wrap=el('div','olg-row');
  var track=el('div','olg-track');
  B.items.forEach(function(it){
   var a=el('a','olg-card');a.href=it[0];a.setAttribute('data-url',it[0]);
   var pic=el('span','olg-pic');var im=el('img');im.src=base+'v91/img/lilygo/'+it[1]+'.webp';im.alt=it[2];im.width=480;im.height=480;im.loading='lazy';im.decoding='async';im.draggable=false;pic.appendChild(im);
   var body=el('span','olg-body');
   body.append(el('span','olg-name',it[2]),el('span','olg-stock'),el('span','olg-price',kc(it[3])));
   a.append(pic,body);track.appendChild(a);
  });
  var prev=el('button','olg-arrow olg-arrow--prev');prev.type='button';prev.setAttribute('aria-label','Předchozí produkty');
  var next=el('button','olg-arrow olg-arrow--next');next.type='button';next.setAttribute('aria-label','Další produkty');
  [prev,next].forEach(function(b){b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'});
  /* an arrow moves the row by every card that is fully on screen (five on PC) */
  function step(){var c=track.querySelector('.olg-card');return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||0):track.clientWidth}
  function go(d){var s=step(),n=Math.max(1,Math.floor((track.clientWidth+2)/s));track.scrollBy({left:d*n*s,behavior:'smooth'})}
  prev.addEventListener('click',function(){go(-1)});next.addEventListener('click',function(){go(1)});
  function ends(){var x=track.scrollLeft,m=track.scrollWidth-track.clientWidth;sec.classList.toggle('olg-at-start',x<4);sec.classList.toggle('olg-at-end',x>m-4)}
  track.addEventListener('scroll',function(){requestAnimationFrame(ends)},{passive:true});
  wrap.append(track,prev,next);
  sec.append(hero,wrap);
  sec.__ends=ends;
  return sec;
 }
 /* the real price and stock from the product page (same shop), once, when the band comes near the screen */
 function live(sec){
  var done=false;
  function run(){
   if(done)return;done=true;
   [].forEach.call(sec.querySelectorAll('.olg-card:not([data-okla-loop])'),function(card){
    fetch(card.getAttribute('data-url'),{credentials:'same-origin'}).then(function(r){
     if(r.status===404||r.status===410){card.remove();return null}
     return r.ok?r.text():null;
    }).then(function(html){
     if(!html)return;
     var m=html.match(/itemprop="price"\s+content="([\d.]+)"/);
     if(m&&+m[1]>0)card.querySelector('.olg-price').textContent=kc(+m[1]);
     var s=html.match(/itemprop="availability"\s+href="https?:\/\/schema\.org\/(\w+)"/);
     var st=card.querySelector('.olg-stock');
     if(s&&/InStock/.test(s[1])){st.textContent='Skladem';st.className='olg-stock olg-stock--in'}
     else if(s&&/PreOrder|OutOfStock|SoldOut/.test(s[1])){st.textContent='Připravujeme';st.className='olg-stock olg-stock--soon'}
    }).catch(function(){});
   });
  }
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();run()}},{rootMargin:'400px'});io.observe(sec)}
  else setTimeout(run,1500);
 }
 /* where a band goes: 'rowN' before the N-th product heading, 'news' before the magazine */
 function ref(main,where){
  if(where==='news')return main.querySelector(':scope>#okla-news-v55');
  var n=+String(where).replace('row','')||2,h=main.querySelectorAll(':scope>.homepage-group-title');return h.length>=n?h[n-1]:null;
 }
 function before(node,r){var n=node.nextElementSibling;while(n&&n!==r&&/^(okla-deals|okla-signin-strip|okla-promo-deals)$/.test(n.id))n=n.nextElementSibling;return n===r}
 function mount(B){
  if(document.getElementById(B.id))return true;
  var circles=document.getElementById('okla-cat-circles');if(!circles||!circles.parentNode)return false;
  var main=circles.parentNode,r=ref(main,B.where);if(!r)return false;
  var sec=build(B);main.insertBefore(sec,r);live(sec);requestAnimationFrame(sec.__ends);
  function fix(){if(sec.parentNode!==main)return;var rr=ref(main,B.where);if(rr&&!before(sec,rr))main.insertBefore(sec,rr)}
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 BANDS.forEach(function(B){var tries=0;(function tick(){if(mount(B))return;if(++tries<100)setTimeout(tick,120)})()});
})();
