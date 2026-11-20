/* Okla – the homepage articles ("Co je u nás nového") always show the picture set for each article in Shoptet.

   The source is Shoptet's own article list (/nase-novinky/): every article there carries the picture chosen in the
   administration ("Obrázek článku") and its publication date. One request gives all of them; the picture of each card
   is matched by the article's address, so the order of the cards does not matter.
   - What was read last time is kept on the device and shown at once; the list is read again on every visit to the
     homepage (at most once in 5 minutes), so a picture changed in Shoptet shows on the next visit.
   - No picture is built in: on a first visit a card waits for Shoptet's picture (a calm empty surface), never an old
     one; only an article missing from Shoptet's list keeps the picture it came with.
   - The list is read as text (no whole document is built - that was a long freeze on phones). */
(function () {
  'use strict';
  if (window.__oklaNewsNativeImages) return;
  if (location.pathname !== '/' && location.pathname !== '') return;
  window.__oklaNewsNativeImages = true;

  var LIST = '/nase-novinky/';
  var CACHE_KEY = 'okla-news-covers-v2', FRESH = 5 * 60 * 1000;
  var known = {}, readAt = 0;
  try {
    var saved = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {};
    known = saved.items || {};
    readAt = saved.t || 0;
    localStorage.removeItem('okla-news-covers-v1');
  } catch (e) { known = {}; }

  function pathOf(href) { try { return new URL(href, location.origin).pathname; } catch (e) { return String(href || ''); } }
  function allowed(src) {
    try {
      var url = new URL(src, location.origin);
      return (url.protocol === 'https:' || url.protocol === 'http:') &&
        (url.hostname === location.hostname || /(^|\.)myshoptet\.com$/.test(url.hostname)) &&
        !/preforma-logo|favicon/.test(url.pathname) && url.pathname.indexOf('/user/logos/') === -1;
    } catch (e) { return false; }
  }

  /* the cards: the picture known for the card's article, or an empty surface until it is known */
  var listRead = false;
  function paint() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return;
    var cards = section.querySelectorAll('.okn-card');
    for (var i = 0; i < cards.length; i++) {
      var link = cards[i].querySelector('.okn-title') || cards[i].querySelector('.okn-image');
      var img = cards[i].querySelector('.okn-image img');
      if (!link || !img) continue;
      var entry = known[pathOf(link.getAttribute('href'))];
      if (entry && entry.img) {
        if (img.getAttribute('src') !== entry.img) {
          img.onerror = null;
          img.removeAttribute('srcset');
          img.removeAttribute('sizes');
          img.setAttribute('src', entry.img);
        }
        img.style.removeProperty('visibility');
      } else if (listRead || Object.keys(known).length) {
        /* an article that is not in Shoptet's list keeps the picture it came with */
        img.style.removeProperty('visibility');
      } else {
        /* nothing known yet: a picture built into the page may be out of date, hidden until Shoptet's own is known */
        img.style.setProperty('visibility', 'hidden');
      }
      var date = cards[i].querySelector('.okn-date');
      if (date && entry && entry.date && date.textContent !== entry.date) date.textContent = entry.date;
      if (!img.alt) img.alt = (cards[i].querySelector('.okn-title') || link).textContent.trim();
    }
  }

  /* Shoptet's article list as text: address, picture and date of every article */
  function parse(html) {
    var out = {}, found = 0;
    /* one piece per article: its picture link, the picture and the date are the first of their kind in the piece */
    var pieces = html.split(/class="news-item"/).slice(1);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      var a = /class="image"[\s\S]*?<a\b[^>]*\bhref="([^"]+)"[\s\S]*?<img\b([^>]*)>/.exec(p);
      if (!a) continue;
      var src = /\bdata-src="([^"]+)"/.exec(a[2]) || /\bsrc="([^"]+)"/.exec(a[2]);
      if (!src) continue;
      var img = src[1].replace(/&amp;/g, '&');
      if (!allowed(img)) continue;
      var key = pathOf(a[1]);
      if (out[key]) continue;
      var t = /<time\b[^>]*>\s*([^<]*?)\s*<\/time>/.exec(p);
      out[key] = {img: new URL(img, location.origin).href, date: t && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(t[1]) ? t[1] : ''};
      found++;
    }
    return found ? out : null;
  }

  function refresh() {
    fetch(LIST, {credentials: 'same-origin'})
      .then(function (r) { if (!r.ok) throw new Error('list ' + r.status); return r.text(); })
      .then(function (html) {
        var items = parse(html);
        listRead = true;
        if (!items) { paint(); return; }
        known = items;
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({t: Date.now(), items: items})); } catch (e) {}
        paint();
      })
      .catch(function () {
        /* the list could not be read: the pictures known so far stay; cards without one show their own */
        listRead = true;
        paint();
      });
  }

  var watchedSection = null, imageObserver = null;
  function bindNews() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return false;
    if (section === watchedSection) return true;
    if (imageObserver) imageObserver.disconnect();
    watchedSection = section;
    /* an older script may set its own picture again later: Shoptet's picture wins */
    imageObserver = new MutationObserver(function (changes) {
      for (var i = 0; i < changes.length; i++) {
        if (changes[i].type === 'attributes' || changes[i].addedNodes.length) { paint(); break; }
      }
    });
    imageObserver.observe(section, {attributes: true, attributeFilter: ['src', 'srcset'], childList: true, subtree: true});
    paint();
    return true;
  }

  function start() {
    if (!bindNews()) {
      var root = document.querySelector('main#content') || document.getElementById('content') || document.body;
      if (root) {
        var mountObserver = new MutationObserver(function () { if (bindNews()) mountObserver.disconnect(); });
        mountObserver.observe(root, {childList: true, subtree: true});
      }
    }
    if (Date.now() - readAt > FRESH) {
      var later = window.requestIdleCallback || function (f) { setTimeout(f, 800); };
      /* without anything known yet the list is read at once (the cards wait for it), otherwise when the page is idle */
      if (Object.keys(known).length) later(refresh, {timeout: 3000}); else refresh();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
