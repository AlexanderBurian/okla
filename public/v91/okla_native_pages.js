/* OKLA V91 – expands Shoptet's short cookie-bar sentence to the fuller,
   two-column privacy text (Allegro-style length). The two columns come from the
   CSS (column-count) once the text is long enough. The wording is generic cookie
   boilerplate and the merchant should review it against their real processing;
   the privacy-policy link is taken from Shoptet's own existing link so it always
   points at the shop's real policy. */
(function(){
  'use strict';
  if(window.__oklaCookieTextV91) return;
  window.__oklaCookieTextV91 = true;

  function expand(){
    var bar = document.querySelector('.siteCookies.js-siteCookies');
    if(!bar) return false;
    var text = bar.querySelector('.siteCookies__text');
    if(!text) return false;
    if(text.getAttribute('data-okla-expanded') === '1') return true;

    /* Keep the merchant's existing privacy-policy link target. */
    var link = text.querySelector('a');
    var href = (link && link.getAttribute('href')) || '/';
    var a = document.createElement('a');
    a.setAttribute('href', href);

    var paras = [
      'Pomocí souborů cookie a souvisejících technologií (např. pixelů a SDK) a zpracováním vašich údajů (včetně jedinečných identifikátorů a údajů o vašem zařízení a prohlížeči) vám můžeme lépe přizpůsobit zobrazovaný obsah a reklamu.',
      'Pokud udělíte souhlas s ukládáním informací ve vašem zařízení a s jejich zpracováním, pomůže nám to zlepšovat obsah, měření, bezpečnost a vyhledávání na webu OKLA.cz. Správcem vašich osobních údajů je provozovatel obchodu OKLA.cz, případně naši partneři, se kterými údaje sdílíme jen v nezbytném rozsahu.',
      'My a naši partneři můžeme zpracovávat osobní údaje pro následující účely: ukládání a přístup k informacím v zařízení; personalizovaná reklama a obsah, měření reklamy a obsahu, průzkum publika a vývoj služeb; zajištění bezpečnosti, předcházení podvodům a odstraňování chyb; technické zajištění zobrazení reklamy a obsahu.',
      'Souhlas je dobrovolný a platí po dobu 12 měsíců. Můžete jej kdykoli odvolat nebo upravit v nastavení souborů cookie; odvoláním není dotčena zákonnost zpracování vycházejícího ze souhlasu uděleného před jeho odvoláním.'
    ];

    text.textContent = '';
    for(var i = 0; i < paras.length; i++){
      var p = document.createElement('p');
      p.textContent = paras[i];
      text.appendChild(p);
    }
    /* Last paragraph keeps a link to the shop's real privacy policy. */
    var pLink = document.createElement('p');
    pLink.appendChild(document.createTextNode('Více informací najdete v '));
    a.textContent = 'zásadách ochrany osobních údajů';
    pLink.appendChild(a);
    pLink.appendChild(document.createTextNode('.'));
    text.appendChild(pLink);

    text.setAttribute('data-okla-expanded', '1');
    return true;
  }

  if(!expand()){
    var tries = 0;
    var mo = new MutationObserver(function(){
      if(expand() || ++tries > 60){ mo.disconnect(); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();

/* Category & search product cards: give them the SAME decoration the homepage
   cards get (five decorative gold stars + the cart glyph in the CTA), so the
   OKLA card look in okla_native_pages.css renders identically to the homepage.
   The visual styling lives entirely in CSS; this only injects the two SVGs. */
(function(){
  'use strict';
  if(window.__oklaListCardsV1) return; window.__oklaListCardsV1 = true;
  var NS='http://www.w3.org/2000/svg';
  function cart(){var s=document.createElementNS(NS,'svg');s.classList.add('ok89-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
    var body=document.createElementNS(NS,'path');body.setAttribute('d','M7 7h14l-2.2 9H9L7 7Z');s.appendChild(body);
    var arm=document.createElementNS(NS,'path');arm.setAttribute('d','M2 3.8h3.6L8 16.2h11');arm.setAttribute('fill','none');arm.setAttribute('stroke','currentColor');arm.setAttribute('stroke-width','1.65');s.appendChild(arm);
    for(var i=0,xs=[10,18];i<xs.length;i++){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',xs[i]);c.setAttribute('cy',20.5);c.setAttribute('r',1.7);s.appendChild(c)}return s}
  function stars(){var g=document.createElement('span');g.className='ok89-decor-stars';g.setAttribute('aria-hidden','true');g.title='Dekorativní hvězdy, nejde o zákaznické hodnocení';
    for(var i=0;i<5;i++){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');var p=document.createElementNS(NS,'path');p.setAttribute('d','M12 2l3.09 6.26L22 9.27l-5 4.88 1.18 6.9L12 17.8l-6.18 3.25L7 14.15 2 9.27l6.91-1.01L12 2z');s.appendChild(p);g.appendChild(s)}return g}
  function isList(){var b=document.body;return b&&(b.classList.contains('type-category')||b.classList.contains('type-search'));}
  function decorate(root){
    if(!isList())return;
    (root||document).querySelectorAll('#products.products-block .product').forEach(function(card){
      var wrap=card.querySelector('.ratings-wrapper');
      var inner=card.querySelector('.p-in-in'),name=inner&&inner.querySelector('a.name'),availability=wrap&&wrap.querySelector('.availability');
      /* Homepage anatomy is ratings -> name -> availability. Availability is
         nested inside ratings in native listing markup, so move the original
         node instead of cloning it. */
      if(inner&&wrap&&name){inner.insertBefore(wrap,name);if(availability)name.after(availability)}
      if(wrap&&!wrap.querySelector('.ok89-decor-stars')){
        wrap.querySelectorAll('.okv80-stars,.okv73-rating-stars,.okla-empty-stars,.okv73-rating-placeholder,.stars-placeholder').forEach(function(e){e.remove()});
        wrap.prepend(stars());
      }
      var btn=card.querySelector('.p-tools button.btn-cart,.p-tools .btn-cart');
      if(btn&&!btn.querySelector('.ok89-cart')){
        btn.querySelectorAll('svg').forEach(function(n){if(!n.classList.contains('ok89-cart'))n.remove()});
        btn.prepend(cart());
      }
    });
  }
  function start(){
    if(!isList())return;
    decorate(document);
    var cont=document.querySelector('#products');
    if(cont&&!cont.dataset.oklaCardObs){cont.dataset.oklaCardObs='1';
      var mo=new MutationObserver(function(recs){if(recs.some(function(r){return Array.from(r.addedNodes).some(function(n){return n.nodeType===1&&((n.matches&&n.matches('.product'))||(n.querySelector&&n.querySelector('.product')))})}))decorate(document)});
      mo.observe(cont,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
