/* Okla – the footer in the Best Buy manner (okla_footer_bb.css), built over the footer okla_footer.js makes:
   - the four icons on top become links (blue labels), a line under them;
   - beside the four link columns a light grey panel: sign in / create an account, the guides (the newsroom, with its
     button), "Nevíte, který přístroj vybrat?" with "Napište nám", and the site's language - texts and links taken
     from the footer's own blue block (so every language keeps its words), which then goes;
   - under the columns Zásilkovna's pickup points: a map of the Czech Republic leading to their own finder (the pins
     only mark the regions' capitals - no counts, no claimed places; the real list is theirs);
   - the partners stay on the copyright line where they always were (okla_payment_logos.js), plain logos, the
     carriers DPD and Zásilkovna added to them.
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
 /* the Czech Republic's outline (drawn from its border's longitudes / latitudes, x scaled by cos 50°) and a pin at
    each region's capital */
 var CZ='M8.0,56.0 16.1,47.0 23.9,47.0 31.6,45.8 41.3,42.2 51.0,38.0 62.6,32.0 76.1,27.2 89.7,20.0 94.3,8.0 113.7,18.8 121.8,9.8 132.2,17.0 141.9,24.2 159.3,33.2 170.9,27.8 176.7,38.0 167.1,45.2 182.5,59.0 192.2,59.0 198.0,47.0 213.5,54.8 225.1,53.0 236.7,68.0 252.2,77.0 270.0,98.0 258.0,105.8 244.5,113.0 236.7,131.0 221.2,140.0 205.8,138.8 196.1,153.8 182.5,144.2 170.9,147.2 159.3,146.0 147.7,140.0 132.2,132.2 120.6,131.0 118.7,144.2 109.0,155.0 94.7,158.0 81.9,155.0 74.2,144.8 62.6,134.0 51.0,123.8 39.3,111.2 27.7,101.0 21.9,89.0 25.8,75.8 14.2,65.0Z';
 var PINS=[[98.2,66.2],[108.6,84.2],[83.1,31.4],[122.9,24.8],[38.2,57.2],[57.9,86.0],[100.1,132.8],[143.5,107.0],[152.7,58.4],[150.8,74.0],[182.9,119.0],[207.7,95.6],[223.9,117.2],[247.9,81.2]];
 var FINDER='https://www.zasilkovna.cz/pobocky';
 function mapBlock(){
  var a=el('a','okla-footer-pickup');a.href=FINDER;a.target='_blank';a.rel='noopener';
  a.setAttribute('aria-label','Výdejní místa Zásilkovny – vyhledat na zasilkovna.cz');
  var pins=PINS.map(function(p){return '<g transform="translate('+p[0]+' '+p[1]+')"><path d="M0 0C-3.4-4.4-6-7.4-6-10.6a6 6 0 0 1 12 0C6-7.4 3.4-4.4 0 0Z"/><circle cy="-10.6" r="2.3" fill="#fff"/></g>'}).join('');
  a.innerHTML='<span class="okla-footer-pickup__txt"><span class="okla-footer-pickup__head">Výdejní místa Zásilkovny</span>'+
   '<span class="okla-footer-pickup__text">Objednávku si vyzvednete na výdejním místě nebo v Z-BOXu, kde se vám to hodí – po celé České republice.</span>'+
   '<span class="okla-footer-pickup__cta">Najít výdejní místo'+ARROW+'</span></span>'+
   '<svg class="okla-footer-pickup__map" viewBox="0 0 278 166" aria-hidden="true" focusable="false"><path class="okla-footer-pickup__land" d="'+CZ+'"/><g class="okla-footer-pickup__pins">'+pins+'</g></svg>';
  return a;
 }
 var CHAT='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 6.5h20a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H14l-6 5v-5H6A2.5 2.5 0 0 1 3.5 20V9A2.5 2.5 0 0 1 6 6.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 13h12M10 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 var ARROW='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 function txt(root,sel){var e=root&&root.querySelector(sel);return e?e.textContent.trim():''}
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
  var side=el('aside','okla-footer-side');side.id='okla-footer-side';side.setAttribute('aria-label','Účet, návody a jazyk');
  var acc=el('a','okla-footer-side__account','Přihlásit se nebo vytvořit účet');acc.href='/login/';
  side.appendChild(acc);
  /* the guides and the advice: the blue block's own words and links */
  var promo=document.getElementById('okla-footer-promo');
  if(promo){
   var btn=promo.querySelector('.okla-promo-btn'),qr=promo.querySelector('.okla-promo-qr');
   var g=el('div','okla-footer-side__block okla-footer-side__guides');
   g.appendChild(el('h3','okla-footer-side__head',txt(promo,'.okla-promo-title')||'Průvodci a návody z Okla'));
   var gp=txt(promo,'.okla-promo-text p');if(gp)g.appendChild(el('p','okla-footer-side__text',gp));
   var go=el('a','okla-footer-side__btn',btn?btn.textContent.trim():'Otevřít newsroom');go.href=btn?btn.getAttribute('href'):'/newsroom/';
   g.appendChild(go);side.appendChild(g);
   var adv=el('a','okla-footer-side__block okla-footer-side__advice');adv.href=qr?qr.getAttribute('href'):'/kontakt/';
   var ic=el('span','okla-footer-side__advice-ic');ic.innerHTML=CHAT;
   var at=el('span','okla-footer-side__advice-txt');at.appendChild(el('span','okla-footer-side__advice-title',txt(promo,'.okla-promo-side-title')||'Nevíte, který přístroj vybrat?'));
   var more=el('span','okla-footer-side__advice-more','Napište nám');more.insertAdjacentHTML('beforeend',ARROW);at.appendChild(more);
   adv.append(ic,at);side.appendChild(adv);
   promo.setAttribute('data-okla-bb-moved','1');
  }
  /* the language */
  var langHead=links.querySelector('.okla-lang-head'),lang=links.querySelector('.okla-lang');
  if(langHead&&lang){var box=el('div','okla-footer-side__block okla-footer-side__lang');box.append(langHead,lang);side.appendChild(box)}
  links.appendChild(side);
  /* Zásilkovna's pickup points under the columns */
  links.appendChild(mapBlock());
  /* the carriers beside the payment logos on the copyright line */
  var pay=shell.querySelector('.okla-pay');
  if(pay&&!pay.querySelector('.okla-pay__item--carrier')){pay.appendChild(carriers());pay.setAttribute('aria-label','Platby a doprava')}
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
