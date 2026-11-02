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
