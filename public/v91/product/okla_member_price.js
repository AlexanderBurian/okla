/* Okla – the registered customer's price on the product page. For a signed-in customer with a customer discount
   Shoptet shows the already lowered price and, beside it, the usual price and "−5 %" (its round badges on the
   pictures are hidden, okla_no_discount_flags.css). Under the price one quiet line says what it is: "Sleva 5 % pro vás
   jako registrovaného zákazníka · běžně 936 Kč" (okla_member_price.css).
   Nothing is calculated here: the percentage and the usual price are read from what Shoptet shows for this very
   product, so a product without the discount (or a visitor who is not signed in) gets no line at all. */
(function(){
 'use strict';
 if(window.__oklaMemberPrice)return;window.__oklaMemberPrice=true;
 var TEXT={
  cs:function(p){return 'Sleva '+p+' % pro vás jako registrovaného zákazníka'},
  sk:function(p){return 'Zľava '+p+' % pre vás ako registrovaného zákazníka'},
  en:function(p){return p+' % off for you as a registered customer'},
  hu:function(p){return p+' % kedvezmény Önnek, regisztrált vásárlóként'}
 };
 var USUAL={cs:'běžně',sk:'bežne',en:'usually',hu:'általában'};
 function lang(){var l=window.OKLA_LANG||document.documentElement.getAttribute('data-okla-lang')||'cs';return TEXT[l]?l:'cs'}
 function txt(el){return el?(el.textContent||'').replace(/\s+/g,' ').trim():''}
 var PCT=/[−–‐-]\s*(\d{1,2}(?:[.,]\d+)?)\s*%/;
 function run(){
  var detail=document.querySelector('#content .p-detail');if(!detail)return false;
  var wrap=detail.querySelector('.p-final-price-wrapper');if(!wrap)return false;
  if(wrap.parentNode.querySelector('.okla-member-price'))return true;
  /* the percentage Shoptet shows for this product (beside the price, or on its picture badge) */
  var pct=null;
  [].some.call(detail.querySelectorAll('.price-save,.flag-discount,.okla-no-discount-flag'),function(el){var m=txt(el).match(PCT);if(m){pct=m[1].replace('.',',');return true}return false});
  if(!pct||pct==='0')return false;
  /* the usual price, when Shoptet shows it */
  var usual='';
  [].some.call(detail.querySelectorAll('.p-final-price-wrapper .price-standard,.price-standard'),function(el){var t=txt(el);if(/\d/.test(t)){usual=t;return true}return false});
  var l=lang(),line=document.createElement('p');
  line.className='okla-member-price';line.setAttribute('data-okla-i18n-skip','');
  line.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.2a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Z"/><path d="M3.8 20.6c.6-3.6 4-6 8.2-6 1.3 0 2.5.2 3.6.7"/><path d="m15.4 18.6 2.2 2.2 4-4.3"/></svg>'+
   '<span></span>';
  var span=line.querySelector('span');span.textContent=TEXT[l](pct);
  if(usual){var u=document.createElement('span');u.className='okla-member-price__usual';u.textContent=USUAL[l]+' ';var s=document.createElement('s');s.textContent=usual;u.appendChild(s);span.after(u)}
  wrap.after(line);
  /* Shoptet's own usual price and percentage beside the price: the line says it, they would only repeat it */
  wrap.classList.add('okla-member-priced');
  return true;
 }
 var tries=0;
 (function again(){if(run()||++tries>30)return;setTimeout(again,200)})();
})();
