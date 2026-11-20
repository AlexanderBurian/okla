/* Okla product page, Alza-like order of the buying column (PC and phones), in Okla's own look:
   brand link, title with a share button beside it, short description and "show full description",
   "Doporučujeme přidat k nákupu" box, a stock card (stock, delivery, returns), the price, then the buying row and the benefits. Only moves the existing native elements (the purchase form
   and its listeners stay the same) and adds two small pieces of text. */
(function(){
 'use strict';
 if(window.__oklaDetailAlzaV1)return;window.__oklaDetailAlzaV1=true;
 function q(s,r){return (r||document).querySelector(s)}
 function el(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n}
 var TRUCK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h11v9H3zM14 9.5h3.6l3.4 3.4v2.6h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>';
 var RETURN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 5 11l4 4"/><path d="M5 11h9.5a4.5 4.5 0 0 1 0 9H11"/></svg>';
 var SHARE='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/></svg>';

 function money(n){n=Math.round(n);return n>0?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-':''}
 function num(t){var n=Number(String(t||'').replace(/[^\d,]/g,'').replace(',','.'));return isFinite(n)?n:0}

 function arrange(){
  var w=q('.p-detail .p-info-wrapper');if(!w)return false;
  /* the title: in the buying column on PC; a phone's layout puts it above the pictures (then it is looked up in the whole
     product, and the buying column is arranged all the same - it was skipped on phones, which kept the old look) */
  var h=q('.p-detail-inner-header',w)||q('.p-detail .p-detail-inner-header'),link=q('.ok86-description-link',w),avail=q('.availability-value',w),price=q('.p-final-price-wrapper',w),cart=q('.add-to-cart',w),xsell=q('.okla-xsell',w);
  if(!avail||!price||!cart)return false;
  if(w.dataset.oklaAlza==='1')return true;
  /* arranged at once (the stock panel never waits); the companion box, which may come later, is slotted above it */
  w.dataset.oklaAlza='1';w.classList.add('okla-dalza');

  /* share button beside the title (Shoptet's own share trigger) */
  var share=q('.link-icon.share',w);
  if(share&&h&&!q('.okla-dalza__share',h)){
   var b=el('button','okla-dalza__share',SHARE);b.type='button';b.setAttribute('aria-label','Sdílet');
   b.addEventListener('click',function(e){e.preventDefault();share.click()});h.classList.add('okla-dalza__head');h.appendChild(b);
  }

  var after=link||q('.p-short-description',w)||(h&&w.contains(h)?h:null);
  if(!after){after=el('span','okla-dalza__anchor');w.insertBefore(after,w.firstChild)}
  /* the stock panel: the stock in green, and one line with the delivery and returns links */
  var box=el('div','okla-dalza__stock');
  after.after(box);
  var tries=0;(function slot(){var s=xsell||q('.okla-xsell',w);if(s){if(s.nextElementSibling!==box)box.before(s);return}if(++tries<40)setTimeout(slot,150)})();
  var r1=el('div','okla-dalza__stockline');r1.appendChild(avail);box.appendChild(r1);
  var links=el('div','okla-dalza__links');
  links.appendChild(el('a','okla-dalza__link',TRUCK+'<span>Doprava a platba</span>'));links.lastChild.href='/doprava-a-platba/';
  links.appendChild(el('a','okla-dalza__link',RETURN+'<span>14 dní na vrácení</span>'));links.lastChild.href='/vraceni-zbozi-a-odstoupeni/';
  box.appendChild(links);
  /* "(>5 ks)" reads as "> 5 ks" */
  var amt=q('.availability-amount',avail);
  function tidy(){if(!amt)return;var t=amt.textContent,n=t.replace(/^\s*\((.*)\)\s*$/,'$1').replace(/>\s*(\d)/,'> $1');if(n!==t)amt.textContent=n}
  tidy();if(amt&&window.MutationObserver)new MutationObserver(tidy).observe(amt,{childList:true,characterData:true,subtree:true});

  /* price block */
  var pb=el('div','okla-dalza__price');box.after(pb);pb.appendChild(price);

  pb.after(cart);
  var benefits=q('.ok86-benefits',w);if(benefits)cart.after(benefits);
  return true;
 }
 var n=0;(function tick(){if(arrange()||++n>80)return;setTimeout(tick,150)})();
})();
