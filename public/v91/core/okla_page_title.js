/* Okla – the shop's name in the browser tab always reads "Okla.cz". The product titles saved in Shoptet end in
   "| OKLA.cz" (and the tab texts shown while the visitor is away say "OKLA.cz"): the tab title is corrected now and
   whenever it changes. The share title (og:title) is corrected the same way. */
(function () {
  'use strict';
  if (window.__oklaPageTitle) return;
  window.__oklaPageTitle = true;

  function fix(text) { return String(text || '').replace(/OKLA\.CZ/gi, 'Okla.cz').replace(/\bOKLA\b/g, 'Okla'); }
  function run() {
    var t = document.title, f = fix(t);
    if (f !== t) document.title = f;
    var og = document.querySelector('meta[property="og:title"]');
    if (og) { var c = og.getAttribute('content') || '', fc = fix(c); if (fc !== c) og.setAttribute('content', fc); }
  }
  run();
  var title = document.querySelector('head > title');
  if (title && window.MutationObserver) new MutationObserver(run).observe(title, {childList: true, characterData: true, subtree: true});
})();
