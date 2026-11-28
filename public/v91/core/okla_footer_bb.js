/* Okla – the footer in the Best Buy manner (okla_footer_bb.css), built over the footer okla_footer.js makes; white,
   no grey grounds, no outlines:
   - the four icons on top become links (blue labels), a line under them;
   - beside the four link columns Zásilkovna's pickup points: a map of the Czech Republic with its regions, a pin in
     each region (no counts - we have no real numbers to show), the whole block one link to their own finder;
   - the footer's blue block goes; under the columns the newsletter - the shop's own Shoptet form when it is switched
     on in the administration (nothing is shown without it: no form that would send nowhere);
   - the language stays where it always was (the last column), as plain flags and names;
   - the partners stay on the copyright line (okla_payment_logos.js), plain logos, DPD and Zásilkovna added.
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
  /* the map: the country's outline and its regions' borders (drawn from longitudes / latitudes, x scaled by cos 50°,
    Praha the small ring inside), one pin per region */
 var MAP={vb:'0 0 290 196',land:'M14.0,80.0 22.1,71.0 29.9,71.0 37.6,69.8 47.3,66.2 57.0,62.0 68.6,56.0 82.1,51.2 95.7,44.0 100.3,32.0 119.7,42.8 127.8,33.8 138.2,41.0 147.9,48.2 165.3,57.2 176.9,51.8 182.7,62.0 173.1,69.2 188.5,83.0 198.2,83.0 204.0,71.0 219.5,78.8 231.1,77.0 242.7,92.0 258.2,101.0 276.0,122.0 264.0,129.8 250.5,137.0 242.7,155.0 227.2,164.0 211.8,162.8 202.1,177.8 188.5,168.2 176.9,171.2 165.3,170.0 153.7,164.0 138.2,156.2 126.6,155.0 124.7,168.2 115.0,179.0 100.7,182.0 87.9,179.0 80.2,168.8 68.6,158.0 57.0,147.8 45.3,135.2 33.7,125.0 27.9,113.0 31.8,99.8 20.2,89.0Z',lines:'M30.6,99.2 41.5,95.0 51.2,92.0 60.8,87.8 M60.8,87.8 60.1,77.0 51.2,65.0 M60.8,87.8 68.6,84.2 M68.6,84.2 82.1,78.8 99.5,73.4 109.2,66.2 M109.2,66.2 111.1,53.0 114.2,39.2 M109.2,66.2 126.6,68.6 138.2,65.0 M138.2,65.0 142.1,54.2 145.2,47.0 M138.2,65.0 142.1,78.8 144.0,89.0 M144.0,89.0 161.4,92.0 176.9,90.2 188.5,83.0 M144.0,89.0 142.9,104.0 M142.9,104.0 157.6,111.8 173.1,117.8 181.6,113.0 M181.6,113.0 189.3,114.2 M189.3,114.2 196.3,98.0 198.2,83.0 M219.5,78.8 221.4,95.0 228.0,107.0 235.8,119.0 238.1,125.0 M238.1,125.0 248.5,129.2 258.2,132.8 M238.1,125.0 223.4,133.4 211.8,137.0 M211.8,137.0 200.1,128.0 194.3,120.2 189.3,114.2 M211.8,137.0 209.0,149.0 212.5,162.8 M181.6,113.0 173.1,128.0 163.4,143.0 150.6,156.8 152.2,163.4 M142.9,104.0 132.4,113.0 127.4,122.0 M127.4,122.0 129.7,137.0 136.3,149.0 138.2,156.2 M127.4,122.0 111.1,128.0 95.7,125.0 84.0,131.0 M84.0,131.0 77.1,143.0 70.5,156.8 M84.0,131.0 79.4,111.8 73.2,96.2 68.6,84.2 M97.2,89.0 99.5,86.0 105.3,84.8 111.1,87.2 113.5,91.4 110.4,96.2 103.4,98.0 98.4,95.0Z',pins:[[39.5,83.0],[84.0,63.8],[127.4,51.8],[159.5,69.8],[169.2,102.2],[211.0,108.2],[244.7,105.8],[231.9,144.2],[188.5,152.0],[149.8,131.0],[103.4,152.0],[57.0,117.8],[124.7,105.8],[105.3,88.4]]};
 var FINDER='https://www.zasilkovna.cz/pobocky';
 var ARROW='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 function mapBlock(){
  var a=el('a','okla-footer-map');a.id='okla-footer-map';a.href=FINDER;a.target='_blank';a.rel='noopener';
  a.setAttribute('aria-label','Výdejní místa Zásilkovny – vyhledat na zasilkovna.cz');
  var pins=MAP.pins.map(function(p){return '<g transform="translate('+p[0]+' '+(p[1]+11)+')"><path d="M0 0C-3-5-9.5-9.2-9.5-14.5a9.5 9.5 0 0 1 19 0C9.5-9.2 3-5 0 0Z"/><circle cy="-14.5" r="3"/></g>'}).join('');
  a.innerHTML='<span class="okla-footer-map__head">Výdejní místa Zásilkovny</span>'+
   '<svg class="okla-footer-map__svg" viewBox="'+MAP.vb+'" aria-hidden="true" focusable="false"><path class="okla-footer-map__land" d="'+MAP.land+'"/><path class="okla-footer-map__lines" d="'+MAP.lines+'"/><g class="okla-footer-map__pins">'+pins+'</g></svg>'+
   '<span class="okla-footer-map__cta">Najít výdejní místo'+ARROW+'</span>';
  return a;
 }
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
  /* the pickup points' map beside the columns */
  links.appendChild(mapBlock());
  /* the footer's blue block goes */
  var promo=document.getElementById('okla-footer-promo');if(promo)promo.setAttribute('data-okla-bb-moved','1');
  /* the newsletter under the columns - only the shop's own Shoptet form (switched on in the shop's administration),
     moved here as it is, so what it sends and the consent it asks for stay Shoptet's; without it nothing is shown */
  var nf=document.querySelector('form[action*="ubscribeToNewsletter"],form[id*="ewsletter"]');
  if(nf){
   var row=el('div','okla-footer-news');row.id='okla-footer-news';
   var nt=el('div','okla-footer-news__txt');nt.append(el('h3','okla-footer-news__head','Novinky a akce e-mailem'),el('p','okla-footer-news__text','Nové produkty, návody a slevy jako první. Odhlásit se můžete kdykoli.'));
   var em=nf.querySelector('input[type=email],input[name=email]');if(em&&!em.getAttribute('placeholder'))em.setAttribute('placeholder','Váš e-mail');
   row.append(nt,nf);links.appendChild(row);
  }
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
