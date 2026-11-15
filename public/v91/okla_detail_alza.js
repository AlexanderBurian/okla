/* OKLA product page, Alza-like order of the buying column (PC and phones), in OKLA's own look:
   brand link, title with a share button beside it, short description and "show full description",
   "Doporučujeme přidat k nákupu" box, a grey stock box (stock, delivery, returns), the price with the price
   without VAT, then the buying row and the benefits. Only moves the existing native elements (the purchase form
   and its listeners stay the same) and adds two small pieces of text. */
(function(){
 'use strict';
 if(window.__oklaDetailAlzaV1)return;window.__oklaDetailAlzaV1=true;
 var VAT=1.21;
 function q(s,r){return (r||document).querySelector(s)}
 function el(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n}
 var TRUCK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h11v9H3zM14 9.5h3.6l3.4 3.4v2.6h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>';
 var RETURN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 5 11l4 4"/><path d="M5 11h9.5a4.5 4.5 0 0 1 0 9H11"/></svg>';
 var SHARE='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/></svg>';

 function money(n){n=Math.round(n);return n>0?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-':''}
 function num(t){var n=Number(String(t||'').replace(/[^\d,]/g,'').replace(',','.'));return isFinite(n)?n:0}

 function arrange(){
  var w=q('.p-detail .p-info-wrapper');if(!w)return false;
  var h=q('.p-detail-inner-header',w),link=q('.ok86-description-link',w),avail=q('.availability-value',w),price=q('.p-final-price-wrapper',w),cart=q('.add-to-cart',w),xsell=q('.okla-xsell',w);
  if(!h||!avail||!price||!cart)return false;
  if(w.dataset.oklaAlza==='1')return true;
  if(!xsell&&arrange.tries++<30)return false; /* give the companion box a moment to appear */
  w.dataset.oklaAlza='1';w.classList.add('okla-dalza');

  /* share button beside the title (Shoptet's own share trigger) */
  var share=q('.link-icon.share',w);
  if(share&&!q('.okla-dalza__share',h)){
   var b=el('button','okla-dalza__share',SHARE);b.type='button';b.setAttribute('aria-label','Sdílet');
   b.addEventListener('click',function(e){e.preventDefault();share.click()});h.classList.add('okla-dalza__head');h.appendChild(b);
  }

  var after=link||q('.p-short-description',w)||h;
  if(xsell){after.after(xsell);after=xsell}

  /* the grey stock box: stock, delivery and returns */
  var box=el('div','okla-dalza__stock');
  after.after(box);box.appendChild(avail);
  box.appendChild(el('a','okla-dalza__line',TRUCK+'<span>Doprava a platba – vyberete si v košíku</span>'));box.lastChild.href='/doprava-a-platba/';
  var strip=el('div','okla-dalza__strip',RETURN+'<span>Odstoupení od smlouvy do 14 dnů bez udání důvodu</span><a href="/vraceni-zbozi-a-odstoupeni/">Info</a>');
  box.appendChild(strip);

  /* price block: price and the price without VAT */
  var pb=el('div','okla-dalza__price');box.after(pb);pb.appendChild(price);
  var holder=q('.price-final-holder',price)||q('.price-final',price);
  var nv=el('div','okla-dalza__novat');pb.appendChild(nv);
  function paintNoVat(){var v=num(holder&&holder.textContent);nv.textContent=v?'bez DPH '+money(v/VAT):''}
  paintNoVat();
  if(holder&&window.MutationObserver)new MutationObserver(paintNoVat).observe(holder,{childList:true,characterData:true,subtree:true});

  pb.after(cart);
  var benefits=q('.ok86-benefits',w);if(benefits)cart.after(benefits);
  return true;
 }
 arrange.tries=0;
 var n=0;(function tick(){if(arrange()||++n>80)return;setTimeout(tick,150)})();
})();
