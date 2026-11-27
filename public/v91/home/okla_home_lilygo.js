/* Okla – homepage LilyGO band (Best Buy "Laptops, reimagined" layout): one dark rounded band, on the left a lifestyle
   photo with a heading, a line under it, a "Nakupovat" link and the brand's name at the bottom; on the right a row of
   white product cards (picture, name, price). Only LilyGO devices that look alike in a row (finished devices in their
   cases, not bare boards). The shop's own product photos, cut to one frame (v91/img/lilygo). The price written here is
   only the first paint: once the band comes near the screen the real price and stock are read from each product page,
   and a product that no longer exists drops out. No discounts are claimed.
   PC: five cards at a time, arrows on the row. Phones: the photo above as a wide picture with the text on it, the
   cards below as a sideways row (endless, okla_mobile_loop.js).
   Placement: after the first product row (before the second product heading). */
(function(){
 'use strict';
 if(window.__oklaHomeLilygo)return;window.__oklaHomeLilygo=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';
 var PHOTO='v91/img/promo/okla-lilygo-band.webp';
 var ITEMS=[
  ['/lilygo-t-deck-plus-kapesni-esp32-komunikator/','tdeck','LILYGO T-Deck Plus – kapesní komunikátor ESP32',2890],
  ['/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/','tembed','LILYGO T-Embed CC1101 – ESP32-S3 multitool',2590],
  ['/lilygo-t-dongle-s3-plus/','tdongle','LILYGO T-Dongle S3 Plus',1089],
  ['/lilygo-t-display-s3-amoled/','tdisplay','LILYGO T-Display S3 AMOLED',2389],
  ['/lilygo-t-deck-plus-868-mhz-gps-u-blox-s-externi-antenou/','tdeck868','LILYGO T-Deck Plus 868 MHz, GPS u-blox, s externí anténou',3189],
  ['/lilygo-t-embed-cc1101-plus-s-externimi-antenami-pruhledny/','tembedplus','LILYGO T-Embed CC1101 Plus s externími anténami, průhledný',3289],
  ['/lilygo-t-encoder-pro-amoled/','tencoder','LILYGO T-Encoder Pro AMOLED',1989]
 ];
 function kc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function build(){
  var sec=el('section');sec.id='okla-lilygo';sec.setAttribute('aria-label','Zařízení LilyGO');
  /* the photo panel */
  var hero=el('a','olg-hero');hero.href='/vyhledavani/?string=lilygo';
  var img=el('img','olg-photo');img.src=base+PHOTO;img.alt='';img.loading='lazy';img.decoding='async';img.draggable=false;
  /* if the photo cannot be loaded the band stays, the panel then plain dark (it used to hide the whole band) */
  img.addEventListener('error',function(){img.remove()});
  var copy=el('div','olg-copy');
  copy.append(el('h2','olg-title','Elektronika do kapsy'),el('p','olg-sub','Zařízení LilyGO s ESP32 pro tvůrce a vývojáře'),el('span','olg-cta','Nakupovat'));
  var mark=el('span','olg-mark','LilyGO');mark.setAttribute('aria-hidden','true');
  hero.append(img,copy,mark);
  /* the cards */
  var wrap=el('div','olg-row');
  var track=el('div','olg-track');
  ITEMS.forEach(function(it){
   var a=el('a','olg-card');a.href=it[0];a.setAttribute('data-url',it[0]);
   var pic=el('span','olg-pic');var im=el('img');im.src=base+'v91/img/lilygo/'+it[1]+'.webp';im.alt=it[2];im.width=480;im.height=360;im.loading='lazy';im.decoding='async';im.draggable=false;pic.appendChild(im);
   var body=el('span','olg-body');
   body.append(el('span','olg-name',it[2]),el('span','olg-stock'),el('span','olg-price',kc(it[3])));
   a.append(pic,body);track.appendChild(a);
  });
  var prev=el('button','olg-arrow olg-arrow--prev');prev.type='button';prev.setAttribute('aria-label','Předchozí produkty');
  var next=el('button','olg-arrow olg-arrow--next');next.type='button';next.setAttribute('aria-label','Další produkty');
  [prev,next].forEach(function(b){b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'});
  function step(){var c=track.querySelector('.olg-card');return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||0):track.clientWidth}
  function go(d){var n=Math.max(1,Math.floor(track.clientWidth/step()));track.scrollBy({left:d*n*step(),behavior:'smooth'})}
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
    }).catch(function(){});
   });
  }
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();run()}},{rootMargin:'400px'});io.observe(sec)}
  else setTimeout(run,1500);
 }
 /* where it goes: before the second product heading */
 function ref(main){var h=main.querySelectorAll(':scope>.homepage-group-title');return h.length>1?h[1]:null}
 function before(node,r){var n=node.nextElementSibling;while(n&&n!==r&&/^(okla-deals|okla-signin-strip|okla-promo-deals)$/.test(n.id))n=n.nextElementSibling;return n===r}
 function mount(){
  if(document.getElementById('okla-lilygo'))return true;
  var circles=document.getElementById('okla-cat-circles');if(!circles||!circles.parentNode)return false;
  var main=circles.parentNode,r=ref(main);if(!r)return false;
  var sec=build();main.insertBefore(sec,r);live(sec);requestAnimationFrame(sec.__ends);
  function fix(){if(sec.parentNode!==main)return;var rr=ref(main);if(rr&&!before(sec,rr))main.insertBefore(sec,rr)}
  if(window.MutationObserver)new MutationObserver(fix).observe(main,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
  return true;
 }
 var tries=0;
 (function tick(){if(mount())return;if(++tries<100)setTimeout(tick,120)})();
})();
