/* OKLA / Shoptet-native news covers.
   This module changes only the five images in the custom homepage news grid.
   The current article thumbnail in Shoptet (og:image) is the source of truth. */
(function () {
  'use strict';
  if (window.__oklaNewsNativeImages) return;
  if (location.pathname !== '/' && location.pathname !== '') return;
  window.__oklaNewsNativeImages = true;

  var articles = [
    ['/nase-novinky/flipper-zero-co-vsechno-zvladne-kapesni-multitool/', '/user/articles/images/obr__zek_chatgpt_4._11._2026_21_02_09.png'],
    ['/nase-novinky/wifi/', '/user/articles/images/obr__zek_chatgpt_4._11._2026_21_01_27-2.png'],
    ['/nase-novinky/usb-c/', '/user/articles/images/obr__zek_chatgpt_4._11._2026_21_01_23-1.png'],
    ['/nase-novinky/nfc/', '/user/articles/images/obr__zek_chatgpt_4._11._2026_21_01_29-3.png'],
    ['/nase-novinky/meridlo/', '/user/articles/images/obr__zek_chatgpt_4._11._2026_21_01_32-4.png']
  ];
  var covers = articles.map(function (item) { return new URL(item[1], location.origin).href; });
  var watchedSection = null;
  var imageObserver = null;

  function paint() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return;
    var cards = section.querySelectorAll('.okn-card');
    for (var i = 0; i < Math.min(cards.length, covers.length); i++) {
      var img = cards[i].querySelector('.okn-image img');
      if (!img) continue;
      var wanted = covers[i];
      if (img.getAttribute('src') !== wanted) {
        // Legacy V57 still writes unrelated stock URLs; the Shoptet cover wins.
        img.onerror = null;
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('src', wanted);
      }
      if (!img.alt) {
        var title = cards[i].querySelector('.okn-title');
        if (title) img.alt = title.textContent.trim();
      }
    }
  }

  function bindNews() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return false;
    if (section === watchedSection) return true;
    if (imageObserver) imageObserver.disconnect();
    watchedSection = section;
    imageObserver = new MutationObserver(function (changes) {
      for (var i = 0; i < changes.length; i++) {
        if (changes[i].type === 'attributes' || changes[i].addedNodes.length) {
          paint();
          break;
        }
      }
    });
    imageObserver.observe(section, {
      attributes: true,
      attributeFilter: ['src', 'srcset'],
      childList: true,
      subtree: true
    });
    paint();
    return true;
  }

  function start() {
    if (bindNews()) return;
    var root = document.querySelector('main#content') || document.getElementById('content') || document.body;
    if (!root) return;
    var mountObserver = new MutationObserver(function () {
      if (bindNews()) mountObserver.disconnect();
    });
    mountObserver.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  articles.forEach(function (article, index) {
    fetch(article[0], { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Article request failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var meta = doc.querySelector('meta[property="og:image"]');
        if (!meta) return;
        var url = new URL(meta.getAttribute('content') || '', location.origin + article[0]);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
        if (url.hostname !== location.hostname && url.hostname !== 'cdn.myshoptet.com') return;
        if (/preforma-logo|favicon/.test(url.pathname) || url.pathname.indexOf('/user/logos/') !== -1) return;
        covers[index] = url.href;
        paint();
      })
      .catch(function () {
        // Keep the latest verified native thumbnail above, never a stock image.
      });
  });
})();