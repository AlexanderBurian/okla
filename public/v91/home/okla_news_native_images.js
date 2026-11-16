/* OKLA / Shoptet-native news covers.
   This module sets the pictures (and the publication dates) of the custom homepage news grid.
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
  var dates = articles.map(function () { return ''; });
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
      var date = cards[i].querySelector('.okn-date');
      if (date && dates[i] && date.textContent !== dates[i]) date.textContent = dates[i];
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

  /* Each article's cover and date are read from its page (two meta tags in its head) and kept for 12 hours, so the
     homepage does not download and parse five whole articles on every visit. The tags are read from the page text -
     building a whole document of every article was a long freeze on phones. */
  var CACHE_KEY = 'okla-news-covers-v1', CACHE_TTL = 12 * 3600 * 1000, cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {}; } catch (e) { cache = {}; }
  function metaContent(html, prop) {
    var tags = html.match(/<meta\b[^>]*>/gi) || [];
    for (var i = 0; i < tags.length; i++) {
      var attr = /\b(?:property|name)\s*=\s*["']([^"']*)["']/i.exec(tags[i]);
      if (!attr || attr[1].toLowerCase() !== prop) continue;
      var m = tags[i].match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i);
      if (m) return (m[1] != null ? m[1] : m[2] || '').replace(/&amp;/g, '&').trim();
    }
    return '';
  }
  function use(index, entry) {
    if (entry.date) dates[index] = entry.date;
    if (entry.img) covers[index] = entry.img;
  }
  function read(article, index) {
    return fetch(article[0], { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Article request failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        var entry = { t: Date.now(), img: '', date: '' };
        /* the publication date shown under the title (Shoptet: "31.10.2026") */
        var when = metaContent(html, 'article:published_time');
        if (when && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(when)) entry.date = when;
        var image = metaContent(html, 'og:image');
        if (image) {
          var url = new URL(image, location.origin + article[0]);
          var allowed = (url.protocol === 'https:' || url.protocol === 'http:') &&
            (url.hostname === location.hostname || url.hostname === 'cdn.myshoptet.com') &&
            !/preforma-logo|favicon/.test(url.pathname) && url.pathname.indexOf('/user/logos/') === -1;
          if (allowed) entry.img = url.href;
        }
        cache[article[0]] = entry;
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
        use(index, entry);
        paint();
      })
      .catch(function () {
        // Keep the latest verified native thumbnail above, never a stock image.
      });
  }
  var stale = [];
  articles.forEach(function (article, index) {
    var entry = cache[article[0]];
    if (entry) use(index, entry);
    if (!entry || !(entry.t > Date.now() - CACHE_TTL)) stale.push([article, index]);
  });
  paint();
  if (stale.length) {
    var later = window.requestIdleCallback || function (f) { setTimeout(f, 1200); };
    later(function () { stale.forEach(function (s) { read(s[0], s[1]); }); }, { timeout: 4000 });
  }
})();