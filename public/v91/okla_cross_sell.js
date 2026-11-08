/* OKLA – "Doporučujeme přidat k nákupu": a small cross-sell block of compatible
   companion products on chosen product pages (Flipper Zero, LILYGO T-Embed CC1101).
   Each row links to the companion product's own page (where it can be added to the
   cart with the correct options). Products are real items the shop sells. */
(function(){
 'use strict';
 if(window.__oklaCrossSellV1)return;window.__oklaCrossSellV1=true;

 var IMG='https://cdn.myshoptet.com/usr/www.okla.cz/user/shop/related/';
 function P(file,ts){return IMG+file+'?ff=1&x=100&y=100&q=85&ts='+ts+'&sg=8dda0505'}

 var WAVESHARE={name:'Waveshare ESP32-C3 s displejem',note:'Malá Wi-Fi/BLE deska navíc',price:'789 Kč',href:'/waveshare-esp32-c3-s-0-71-kulatym-displejem/',img:P('274-6_waveshare-esp32-c3-s-0-71--kulatym-displejem---pohled-1.jpg','6af04775')};
 var LAFVIN={name:'LAFVIN ESP32-S3 Super Starter Kit',note:'Nepájivé pole a součástky pro vlastní projekty',price:'1 489 Kč',href:'/lafvin-esp32-s3-wroom-super-starter-kit/',img:P('268-5_lafvin-esp32-s3-wroom-super-starter-kit---pohled-1.jpg','6af04775')};
 var CARDPUTER={name:'M5Stack Cardputer ADV',note:'Programovatelný mini počítač do kapsy',price:'990 Kč',href:'/m5stack-cardputer-adv-programovatelny-mini-pocitac/',img:P('52-1_m5stack-cardputer-adv---mini-pocitac-s-klavesnici---pohled-1.jpg','6af04774')};
 var TDISPLAY={name:'LILYGO T-Display S3 AMOLED',note:'Barevný AMOLED displej pro projekty',price:'2 389 Kč',href:'/lilygo-t-display-s3-amoled/',img:P('271-5_lilygo-t-display-s3-amoled---pohled-1.jpg','6af04775')};

 var MAP={
  '/flipper-zero-kapesni-multitool-pro-elektroniku/':[WAVESHARE,LAFVIN,CARDPUTER],
  '/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/':[LAFVIN,WAVESHARE,TDISPLAY]
 };

 function items(){var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';return MAP[p]||null}

 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
 function row(it){
  return '<a class="okla-xsell__item" href="'+it.href+'">'+
   '<span class="okla-xsell__thumb"><img src="'+it.img+'" alt="" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></span>'+
   '<span class="okla-xsell__info"><span class="okla-xsell__name">'+it.name+'</span><span class="okla-xsell__note">'+it.note+'</span></span>'+
   '<span class="okla-xsell__buy"><span class="okla-xsell__price">'+it.price+'</span><span class="okla-xsell__cta">Koupit'+ARROW+'</span></span>'+
  '</a>';
 }
 function build(list){
  var sec=document.createElement('section');
  sec.className='okla-xsell';
  sec.setAttribute('aria-label','Doporučujeme přidat k nákupu');
  sec.innerHTML='<h2 class="okla-xsell__title">Doporučujeme přidat k nákupu</h2><div class="okla-xsell__list">'+list.map(row).join('')+'</div>';
  return sec;
 }
 function mount(){
  var list=items();
  if(!list)return true;                         /* not one of the target pages */
  if(document.querySelector('.okla-xsell'))return true;
  var host=document.querySelector('#content .p-detail .p-info-wrapper');
  if(!host)return false;
  var sec=build(list);
  var anchor=host.querySelector('.social-buttons-wrapper'); /* above the Tisk/Zeptat se tools */
  if(anchor)host.insertBefore(sec,anchor);else host.appendChild(sec);
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
