/* OKLA – "Doporučujeme přidat k nákupu": one unified cross-sell panel on chosen
   product pages (Flipper Zero, LILYGO T-Embed CC1101). Each row has a "přidat"
   checkbox (like Alza): ticking it adds the companion product to the cart,
   unticking removes it again — both through Shoptet's own cart actions. A live
   footer sums what is selected. Products are real items the shop sells. */
(function(){
 'use strict';
 if(window.__oklaCrossSellV2)return;window.__oklaCrossSellV2=true;

 var IMG='https://cdn.myshoptet.com/usr/www.okla.cz/user/shop/related/';
 function P(f,ts){return IMG+f+'?ff=1&x=100&y=100&q=85&ts='+ts+'&sg=8dda0505'}

 var WAVESHARE={pid:'274',prc:'277',name:'Waveshare ESP32-C3 s displejem',note:'Malá Wi-Fi/BLE deska navíc',price:789,href:'/waveshare-esp32-c3-s-0-71-kulatym-displejem/',img:P('274-6_waveshare-esp32-c3-s-0-71--kulatym-displejem---pohled-1.jpg','6af04775')};
 var LAFVIN={pid:'268',prc:'271',name:'LAFVIN ESP32-S3 Super Starter Kit',note:'Nepájivé pole a součástky pro vlastní projekty',price:1489,href:'/lafvin-esp32-s3-wroom-super-starter-kit/',img:P('268-5_lafvin-esp32-s3-wroom-super-starter-kit---pohled-1.jpg','6af04775')};
 var CARDPUTER={pid:'52',prc:'55',name:'M5Stack Cardputer ADV',note:'Programovatelný mini počítač do kapsy',price:990,href:'/m5stack-cardputer-adv-programovatelny-mini-pocitac/',img:P('52-1_m5stack-cardputer-adv---mini-pocitac-s-klavesnici---pohled-1.jpg','6af04774')};
 var TDISPLAY={pid:'271',prc:'274',name:'LILYGO T-Display S3 AMOLED',note:'Barevný AMOLED displej pro projekty',price:2389,href:'/lilygo-t-display-s3-amoled/',img:P('271-5_lilygo-t-display-s3-amoled---pohled-1.jpg','6af04775')};

 var MAP={
  '/flipper-zero-kapesni-multitool-pro-elektroniku/':[WAVESHARE,LAFVIN,CARDPUTER],
  '/lilygo-t-embed-cc1101-multifunkcni-esp32-s3/':[LAFVIN,WAVESHARE,TDISPLAY]
 };
 function items(){var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';return MAP[p]||null}

 function csrf(){try{return (window.shoptet&&shoptet.csrf&&shoptet.csrf.token)||''}catch(e){return ''}}
 function fmt(n){try{return n.toLocaleString('cs-CZ')+' Kč'}catch(e){return n+' Kč'}}
 function refreshCart(){try{if(window.shoptet&&shoptet.cart&&shoptet.cart.getCartContent)shoptet.cart.getCartContent()}catch(e){}}

 function addToCart(it){
  var b=new URLSearchParams();
  b.set('productId',it.pid);b.set('priceId',it.prc);b.set('amount','1');b.set('language','cs');
  var t=csrf();if(t)b.set('__csrf__',t);
  /* Tell the cart drawer to stay closed for this add (silent); cleared shortly after. */
  window.__oklaXsellAdding=true;
  var release=function(){setTimeout(function(){window.__oklaXsellAdding=false},400)};
  return fetch('/action/Cart/addCartItem/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json'},body:b.toString(),credentials:'same-origin'})
   .then(function(r){return r.json()}).then(function(j){release();if(!j||j.code!==200)throw new Error('add failed');return j},function(e){release();throw e});
 }
 function itemIdFor(href){
  return fetch('/kosik/',{cache:'no-store'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');var found=null;
   doc.querySelectorAll('input[name="itemId"]').forEach(function(inp){
    if(found)return;var row=inp.closest('tr')||inp.parentElement;
    if(row&&row.querySelector('a[href*="'+href+'"]'))found=inp.value;
   });
   return found;
  });
 }
 function removeFromCart(it){
  return itemIdFor(it.href).then(function(id){
   if(!id)return null;
   var b=new URLSearchParams();b.set('itemId',id);var t=csrf();if(t)b.set('__csrf__',t);
   return fetch('/action/Cart/deleteCartItem/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json'},body:b.toString(),credentials:'same-origin'}).then(function(r){return r.json()});
  });
 }

 var CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
 var INFO='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/></svg>';

 function rowHtml(it,i){
  return '<div class="okla-xsell__item" data-i="'+i+'" role="button" tabindex="0" aria-pressed="false">'+
   '<span class="okla-xsell__check" aria-hidden="true">'+CHECK+'</span>'+
   '<a class="okla-xsell__thumb" href="'+it.href+'" tabindex="-1"><img src="'+it.img+'" alt="" loading="lazy" onerror="this.parentNode.style.visibility=\'hidden\'"></a>'+
   '<span class="okla-xsell__info">'+
     '<span class="okla-xsell__name">'+it.name+'</span>'+
     '<span class="okla-xsell__note">'+it.note+'</span>'+
     '<span class="okla-xsell__state">Přidáno do košíku</span>'+
   '</span>'+
   '<a class="okla-xsell__detail" href="'+it.href+'" aria-label="Zobrazit produkt '+it.name+'" tabindex="-1">'+INFO+'</a>'+
   '<span class="okla-xsell__price">'+fmt(it.price)+'</span>'+
  '</div>';
 }

 function build(list){
  var sec=document.createElement('section');
  sec.className='okla-xsell';
  sec.setAttribute('aria-label','Doporučujeme přidat k nákupu');
  sec.innerHTML=
   '<div class="okla-xsell__head"><h2 class="okla-xsell__title">Doporučujeme přidat k nákupu</h2>'+
   '<p class="okla-xsell__sub">Zaškrtněte, co chcete přidat do košíku spolu s tímto produktem.</p></div>'+
   '<div class="okla-xsell__list">'+list.map(rowHtml).join('')+'</div>';
  return sec;
 }

 function wire(sec,list){
  /* The cart drawer uses only successfully added rows. The actual cart remains
     authoritative (every checkbox still calls Shoptet's add/remove endpoint),
     while this small read-only bridge lets the popup display the same items. */
  window.__oklaXsellSelected=function(){
   return list.map(function(it,i){
    var row=sec.querySelector('.okla-xsell__item[data-i="'+i+'"]');
    if(!row||!row.classList.contains('is-added'))return null;
    return {name:it.name,image:it.img,price:it.price,href:it.href,amount:1};
   }).filter(Boolean);
  };
  function toggle(row){
   if(row.classList.contains('is-busy'))return;
   var it=list[+row.getAttribute('data-i')];
   var adding=!row.classList.contains('is-added');
   row.classList.add('is-busy');
   var done=function(ok){
    row.classList.remove('is-busy');
    if(ok){row.classList.toggle('is-added',adding);row.setAttribute('aria-pressed',String(adding));refreshCart();}
   };
   (adding?addToCart(it):removeFromCart(it)).then(function(){done(true)}).catch(function(){done(false);});
  }
  Array.prototype.forEach.call(sec.querySelectorAll('.okla-xsell__item'),function(row){
   row.addEventListener('click',function(e){if(e.target.closest('a'))return;toggle(row);});
   row.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle(row);}});
  });
 }

 function mount(){
  var list=items();
  if(!list){window.__oklaXsellSelected=null;return true;}
  if(document.querySelector('.okla-xsell'))return true;
  var host=document.querySelector('#content .p-detail .p-info-wrapper');
  if(!host)return false;
  var sec=build(list);
  var anchor=host.querySelector('.social-buttons-wrapper');
  if(anchor)host.insertBefore(sec,anchor);else host.appendChild(sec);
  wire(sec,list);
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
