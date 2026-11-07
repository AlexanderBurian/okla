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

/* Product cards everywhere = the homepage card.
   Every product grid outside the homepage sliders (category, search, brand and
   other listings, also after Shoptet re-renders them via AJAX sorting/filtering)
   gets the class .okla-cards and the same DOM the homepage cards have: the
   .okla-ratings wrapper, five decorative gold stars (or the real ones), the
   ratings -> name -> availability order and the cart glyph in the CTA.
   The look itself is okla_cards_everywhere.css (generated from the homepage
   card rules). The observer sits on <body>, because Shoptet replaces the whole
   #products container when the sort order changes. */
(function(){
  'use strict';
  if(window.__oklaListCardsV2) return; window.__oklaListCardsV2 = true;
  var NS='http://www.w3.org/2000/svg';
  function cart(){var s=document.createElementNS(NS,'svg');s.classList.add('ok89-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
    var body=document.createElementNS(NS,'path');body.setAttribute('d','M7 7h14l-2.2 9H9L7 7Z');s.appendChild(body);
    var arm=document.createElementNS(NS,'path');arm.setAttribute('d','M2 3.8h3.6L8 16.2h11');arm.setAttribute('fill','none');arm.setAttribute('stroke','currentColor');arm.setAttribute('stroke-width','1.65');s.appendChild(arm);
    for(var i=0,xs=[10,18];i<xs.length;i++){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',xs[i]);c.setAttribute('cy',20.5);c.setAttribute('r',1.7);s.appendChild(c)}return s}
  function stars(){var g=document.createElement('span');g.className='ok89-decor-stars';g.setAttribute('aria-hidden','true');g.title='Dekorativní hvězdy, nejde o zákaznické hodnocení';
    for(var i=0;i<5;i++){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');var p=document.createElementNS(NS,'path');p.setAttribute('d','M12 2l3.09 6.26L22 9.27l-5 4.88 1.18 6.9L12 17.8l-6.18 3.25L7 14.15 2 9.27l6.91-1.01L12 2z');s.appendChild(p);g.appendChild(s)}return g}
  function isHome(){var b=document.body;return !!b&&b.classList.contains('type-index')}
  /* A grid = a .products container holding product cards outside the homepage:
     listing grids and the product-detail "Mohlo by vás zajímat" slider (that
     one keeps its slider layout; only the card look is unified). */
  function grids(){
    var out=[];
    document.querySelectorAll('#content .products').forEach(function(g){
      if(/(^|\s)homepage-products-\d/.test(g.className))return;
      /* Only real card grids: Shoptet's inline lists (e.g. the hidden
         #productsTop "top products" strip) keep their own layout/visibility. */
      if(!g.classList.contains('products-block')||g.classList.contains('products-inline')||g.id==='productsTop')return;
      if(!g.querySelector(':scope > .product'))return;
      out.push(g);
    });
    return out;
  }
  function decorateCard(card){
    /* Homepage anatomy of the bottom: .p-bottom > div > [.prices, .p-tools, .p-desc].
       Some templates (detail page related products) put .p-tools/.p-desc
       directly in .p-bottom – move the nodes (listeners stay attached). */
    var bottom=card.querySelector('.p-bottom'),prices=bottom&&bottom.querySelector('.prices');
    if(bottom&&prices){
      var box=prices.parentElement;
      if(box===bottom){box=document.createElement('div');bottom.insertBefore(box,prices);box.appendChild(prices)}
      [].slice.call(bottom.children).forEach(function(n){if(n!==box&&(n.classList.contains('p-tools')||n.classList.contains('p-desc')))box.appendChild(n)});
    }
    var inner=card.querySelector('.p-in-in'),wrap=card.querySelector('.ratings-wrapper');
    if(inner&&!wrap){wrap=document.createElement('div');wrap.className='ratings-wrapper';inner.insertBefore(wrap,inner.firstChild)}
    var name=inner&&inner.querySelector('a.name');
    if(wrap){
      wrap.classList.add('okla-ratings');
      var availability=wrap.querySelector('.availability');
      /* Homepage anatomy is ratings -> name -> availability. Availability is
         nested inside ratings in native listing markup: move the original node. */
      if(inner&&name){if(wrap.nextElementSibling!==name)inner.insertBefore(wrap,name);if(availability)name.after(availability)}
    }
    /* Sold-out products get the same disabled CTA as on the homepage. */
    var btn=card.querySelector('.p-tools button.btn-cart,.p-tools .btn-cart');
    var offer=card.querySelector('[data-micro-availability]');
    if(btn&&offer&&/OutOfStock|SoldOut|Discontinued/i.test(offer.getAttribute('data-micro-availability')||'')){
      if(!btn.disabled)btn.disabled=true;btn.setAttribute('aria-disabled','true');
    }
    syncCard(card);
    card.dataset.oklaCardsDone='1';
  }
  /* Breakpoint-dependent parts, exactly as the homepage scripts leave them
     (okla_home.js + behavior V73/V74): phone = native V73 rating row, V74 cart
     glyph and hidden "unavailable" note; tablet = decorative stars and only
     the CSS background glyph; desktop = decorative stars and the V89 glyph. */
  var PHONE=matchMedia('(max-width:767px)'),DESKTOP=matchMedia('(min-width:992px)');
  function phoneCart(){var s=document.createElementNS(NS,'svg');s.classList.add('okv74-cart');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
    var p=document.createElementNS(NS,'path');p.setAttribute('d','M2.5 3.8h2.8l2.1 10.7a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1l1.9-7.3H6.1');s.appendChild(p);
    for(var i=0,xs=[10,18];i<xs.length;i++){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',String(xs[i]));c.setAttribute('cy','20.3');c.setAttribute('r','1.7');s.appendChild(c)}return s}
  function syncCard(card){
    var wrap=card.querySelector('.ratings-wrapper');
    if(wrap&&!PHONE.matches){
      wrap.querySelectorAll('.okv80-stars,.okv73-rating-stars,.ok88-decor-stars,.okla-empty-stars').forEach(function(e){e.remove()});
      if(!wrap.querySelector('.ok89-decor-stars'))wrap.prepend(stars());
      if(!wrap.querySelector('.stars-wrapper')&&!wrap.querySelector('.stars-placeholder')){
        var ph=document.createElement('div');ph.className='stars-placeholder';wrap.appendChild(ph);
      }
      var empty=wrap.querySelector('.stars-placeholder');
      if(empty&&(!empty.textContent||/Bez hodnocení|Neohodnoceno/i.test(empty.textContent)))empty.textContent='Bez hodnocení';
    }
    var btn=card.querySelector('.p-tools button.btn-cart,.p-tools .btn-cart');
    if(btn){
      var want=PHONE.matches?'okv74-cart':DESKTOP.matches?'ok89-cart':'';
      btn.querySelectorAll('svg').forEach(function(n){if(!want||!n.classList.contains(want))n.remove()});
      if(want&&!btn.querySelector('svg.'+want))btn.prepend(want==='ok89-cart'?cart():phoneCart());
    }
    card.querySelectorAll('.availability').forEach(function(node){
      var gone=PHONE.matches&&/momentálně\s+nedostupn|momentálně\s+není\s+skladem/i.test((node.textContent||'').replace(/\s+/g,' '));
      node.classList.toggle('okv74-hide-unavailable',gone);
      if(gone)node.setAttribute('aria-hidden','true');else node.removeAttribute('aria-hidden');
    });
  }
  function resync(){document.querySelectorAll('#content .okla-cards > .product').forEach(syncCard)}
  [PHONE,DESKTOP].forEach(function(mq){if(mq.addEventListener)mq.addEventListener('change',resync);else if(mq.addListener)mq.addListener(resync)});
  function decorate(){
    if(isHome())return;
    grids().forEach(function(g){
      g.classList.add('okla-cards');
      g.querySelectorAll(':scope > .product').forEach(function(card){if(card.dataset.oklaCardsDone!=='1')decorateCard(card)});
    });
  }
  function hasCard(n){return n.nodeType===1&&((n.matches&&(n.matches('.product')||n.matches('.products')))||(n.querySelector&&n.querySelector('.product')))}
  function start(){
    decorate();
    if(isHome()||!window.MutationObserver||!document.body)return;
    var queued=false;
    new MutationObserver(function(recs){
      if(queued)return;
      for(var i=0;i<recs.length;i++){var added=recs[i].addedNodes;for(var j=0;j<added.length;j++){if(hasCard(added[j])){queued=true;requestAnimationFrame(function(){queued=false;decorate()});return}}}
    }).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
