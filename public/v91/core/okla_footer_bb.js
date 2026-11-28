/* Okla – the footer in the Best Buy manner (okla_footer_bb.css), built over the footer okla_footer.js makes:
   - the four icons on top become links (blue labels), a line under them;
   - beside the four link columns a light grey panel: sign in / create an account, the site's language, and our
     partners - the payment methods (okla_payment_logos.js) with the carriers DPD and Zásilkovna;
   - the blue newsroom / QR block stays as it is, under the columns.
   Re-applied whenever the footer is rebuilt (its script rebuilds it, e.g. on a language change).
   The "Vytvořil Shoptet" line is left alone: Shoptet keeps it shown (its own inline !important) - removing it is
   Shoptet's own paid option, not something to hide. */
(function(){
 'use strict';
 if(window.__oklaFooterBB)return;window.__oklaFooterBB=1;
 var LINKS={'benefit-sortiment':'/','benefit-objednavky':'/stav-objednavky/','benefit-podpora':'/kontakt/','benefit-platba':'/doprava-a-platba/'};
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function carriers(){
  var f=document.createDocumentFragment();
  [['dpd','DPD'],['zasilkovna','Zásilkovna']].forEach(function(c){
   var s=el('span','okla-pay__item okla-pay__item--carrier okla-pay__item--'+c[0]);s.setAttribute('role','listitem');s.title=c[1];
   s.appendChild(el('span','okla-carrier okla-carrier--'+c[0],c[1]));f.appendChild(s);
  });
  return f;
 }
 function apply(){
  var shell=document.getElementById('okla-footer-shell');if(!shell)return false;
  if(shell.getAttribute('data-okla-bb')==='1')return true;
  var content=document.getElementById('okla-footer-content'),links=document.getElementById('okla-footer-links');
  if(!content||!links)return false;
  /* the icons: links with blue labels */
  shell.querySelectorAll('#okla-footer-benefits .okla-benefit').forEach(function(b){
   if(b.tagName==='A')return;var img=b.querySelector('img[data-icon]'),key=img?(img.getAttribute('data-icon').split('/').pop().replace(/\.\w+$/,'')):'';
   var a=el('a',b.className+' okla-benefit--link');a.href=LINKS[key]||'/';while(b.firstChild)a.appendChild(b.firstChild);b.replaceWith(a);
  });
  /* the panel beside the columns */
  var side=el('aside','okla-footer-side');side.id='okla-footer-side';side.setAttribute('aria-label','Účet, jazyk a partneři');
  var acc=el('a','okla-footer-side__account','Přihlásit se nebo vytvořit účet');acc.href='/login/';
  side.appendChild(acc);
  var langHead=links.querySelector('.okla-lang-head'),lang=links.querySelector('.okla-lang');
  if(langHead&&lang){var box=el('div','okla-footer-side__block');box.append(langHead,lang);side.appendChild(box)}
  var pay=shell.querySelector('.okla-pay'),pbox=el('div','okla-footer-side__block okla-footer-side__partners');
  pbox.appendChild(el('h3','okla-footer-side__head','Partneři'));
  var list=el('div','okla-pay okla-footer-partners');list.setAttribute('role','list');list.setAttribute('aria-label','Platby a doprava');
  if(pay){[].slice.call(pay.children).forEach(function(c){list.appendChild(c)});pay.remove()}
  list.appendChild(carriers());
  pbox.appendChild(list);side.appendChild(pbox);
  links.appendChild(side);
  shell.setAttribute('data-okla-bb','1');
  return true;
 }
 /* the payment logos arrive a little later than the footer: wait for them, then build */
 function tryApply(){var shell=document.getElementById('okla-footer-shell');if(!shell)return false;if(!shell.querySelector('.okla-pay')&&tries<40)return false;return apply()}
 var tries=0;(function tick(){if(tryApply())return;if(++tries<80)setTimeout(tick,250)})();
 if(window.MutationObserver){
  var t=0;new MutationObserver(function(){clearTimeout(t);t=setTimeout(function(){var s=document.getElementById('okla-footer-shell');if(s&&s.getAttribute('data-okla-bb')!=='1'){tries=0;(function tick(){if(tryApply())return;if(++tries<60)setTimeout(tick,250)})()}},150)}).observe(document.body,{childList:true,subtree:false});
  var f=document.getElementById('footer');if(f)new MutationObserver(function(){var s=document.getElementById('okla-footer-shell');if(s&&s.getAttribute('data-okla-bb')!=='1'){tries=0;(function tick(){if(tryApply())return;if(++tries<60)setTimeout(tick,250)})()}}).observe(f,{childList:true});
 }
})();
