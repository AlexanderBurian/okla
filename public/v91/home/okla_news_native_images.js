/* Okla – the homepage articles ("Co je u nás nového") follow Shoptet by themselves.

   The source is Shoptet's own article list (/nase-novinky/), read as text in one request. The cards show its first
   articles in its order (a new article published in Shoptet appears on its own, a removed one disappears), each with:
   - the title (without the shop's " | Okla.cz" ending) and the link;
   - the picture chosen in the administration ("Obrázek článku");
   - the publication date;
   - a short lead: the article's first real paragraph, shortened at a word;
   - the label above the title (the article's own kicker, e.g. "Návod", or the label kept for the older articles) and
     the reading time worked out from the article's length.
   What was read last time is kept on the device and shown at once; the list is read again on every visit to the
   homepage (at most once in 5 minutes), so a change in Shoptet shows on the next visit. On a very first visit the
   cards wait for the list (up to 3 s) instead of showing anything out of date. */
(function () {
  'use strict';
  if (window.__oklaNewsNativeImages) return;
  if (location.pathname !== '/' && location.pathname !== '') return;
  window.__oklaNewsNativeImages = true;

  var LIST = '/nase-novinky/';
  var CACHE_KEY = 'okla-news-list-v3', FRESH = 5 * 60 * 1000, MAX = 5;
  /* labels of the first articles (the newsroom uses the same) */
  var LABEL = {
    '/nase-novinky/flipper-zero-co-vsechno-zvladne-kapesni-multitool/': 'Multitool a RF',
    '/nase-novinky/wifi/': 'Endoskopy',
    '/nase-novinky/usb-c/': 'Testery',
    '/nase-novinky/nfc/': 'NFC',
    '/nase-novinky/meridlo/': 'Měřicí přístroje'
  };

  var list = null, readAt = 0;
  try {
    var saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (saved && saved.items && saved.items.length) { list = saved.items; readAt = saved.t || 0; }
    localStorage.removeItem('okla-news-covers-v1');
    localStorage.removeItem('okla-news-covers-v2');
  } catch (e) { list = null; }

  function pathOf(href) { try { return new URL(href, location.origin).pathname; } catch (e) { return String(href || ''); } }
  function decode(s) {
    return String(s || '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(+n); });
  }
  function plain(html) { return decode(String(html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); }
  function allowed(src) {
    try {
      var url = new URL(src, location.origin);
      return (url.protocol === 'https:' || url.protocol === 'http:') &&
        (url.hostname === location.hostname || /(^|\.)myshoptet\.com$/.test(url.hostname) || url.hostname === 'cdn.jsdelivr.net') &&
        !/preforma-logo|favicon/.test(url.pathname) && url.pathname.indexOf('/user/logos/') === -1;
    } catch (e) { return false; }
  }
  function shorten(text, max) {
    if (text.length <= max) return text;
    var cut = text.slice(0, max);
    var dot = cut.lastIndexOf('. ');
    if (dot > max * 0.6) return cut.slice(0, dot + 1);
    return cut.replace(/[\s,;:–-]+\S*$/, '') + '…';
  }

  /* Shoptet's article list as text: one piece per article */
  function parse(html) {
    var out = [], seen = {};
    var pieces = html.split(/class="news-item"/).slice(1);
    for (var i = 0; i < pieces.length && out.length < MAX; i++) {
      var p = pieces[i];
      var head = /class="image"[\s\S]*?<a\b[^>]*\bhref="([^"]+)"[\s\S]*?<img\b([^>]*)>/.exec(p);
      var titleM = /<a\b[^>]*class="title"[^>]*>([\s\S]*?)<\/a>/.exec(p);
      if (!head || !titleM) continue;
      var href = pathOf(head[1]);
      if (seen[href]) continue;
      seen[href] = 1;
      var src = /\bdata-src="([^"]+)"/.exec(head[2]) || /\bsrc="([^"]+)"/.exec(head[2]);
      var img = src ? decode(src[1]) : '';
      var t = /<time\b[^>]*>\s*([^<]*?)\s*<\/time>/.exec(p);
      /* the article's text: without its styles, scripts and comments */
      var at = p.indexOf('class="description"');
      var body = at < 0 ? '' : p.slice(at).replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
      var lead = '', kicker = '';
      var paras = body.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
      for (var k = 0; k < paras.length; k++) {
        var txt = plain(paras[k]);
        if (!kicker && /Aktualizováno|Autor:/i.test(txt)) {
          var before = txt.split(/Aktualizováno|Autor:/i)[0].trim();
          if (before && before.length <= 24) kicker = before;
          continue;
        }
        if (txt.length >= 60) { lead = txt; break; }
      }
      var words = plain(body).split(' ').length;
      out.push({
        href: href,
        title: plain(titleM[1]).replace(/\s*\|\s*Okla\.cz\s*$/i, ''),
        img: img && allowed(img) ? new URL(img, location.origin).href : '',
        date: t && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(t[1]) ? t[1] : '',
        desc: shorten(lead, 150),
        label: LABEL[href] || kicker,
        minutes: Math.max(2, Math.round(words / 200))
      });
    }
    return out.length ? out : null;
  }

  /* one card from one article */
  function fill(card, a) {
    card.hidden = false;
    var pic = card.querySelector('.okn-image');
    var img = pic && pic.querySelector('img');
    var title = card.querySelector('.okn-title');
    var body = card.querySelector('.okn-body');
    if (pic) { pic.setAttribute('href', a.href); pic.setAttribute('aria-label', a.title); }
    if (img) {
      if (a.img && img.getAttribute('src') !== a.img) {
        img.onerror = null;
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('src', a.img);
      }
      img.alt = a.title;
      img.style.removeProperty('visibility');
    }
    if (title) { title.setAttribute('href', a.href); if (title.textContent !== a.title) title.textContent = a.title; }
    if (body) {
      var cat = body.querySelector('.okn-cat');
      if (a.label) {
        if (!cat) { cat = document.createElement('p'); cat.className = 'okn-cat'; body.insertBefore(cat, body.firstChild); }
        if (cat.textContent !== a.label) cat.textContent = a.label;
      } else if (cat) cat.remove();
    }
    var desc = card.querySelector('.okn-desc');
    if (desc && a.desc && desc.textContent !== a.desc) desc.textContent = a.desc;
    var date = card.querySelector('.okn-date');
    if (date && a.date && date.textContent !== a.date) date.textContent = a.date;
    var read = card.querySelector('.okn-read');
    if (read) {
      var last = read.lastChild, text = a.minutes + ' min čtení';
      if (last && last.nodeType === 3) { if (last.nodeValue !== text) last.nodeValue = text; } else read.appendChild(document.createTextNode(text));
    }
  }

  var waiting = false;
  function paint() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return;
    var grid = section.querySelector('.okn-grid');
    if (!list) {
      /* nothing known yet: the built-in cards may be out of date - wait for Shoptet's list */
      if (grid && waiting) grid.style.setProperty('visibility', 'hidden');
      return;
    }
    if (grid) grid.style.removeProperty('visibility');
    var cards = section.querySelectorAll('.okn-card');
    for (var i = 0; i < cards.length; i++) {
      if (list[i]) fill(cards[i], list[i]);
      else cards[i].hidden = true;
    }
  }

  function reveal() {
    waiting = false;
    var section = document.getElementById('okla-news-v55');
    var grid = section && section.querySelector('.okn-grid');
    if (grid) grid.style.removeProperty('visibility');
  }

  function refresh() {
    fetch(LIST, {credentials: 'same-origin'})
      .then(function (r) { if (!r.ok) throw new Error('list ' + r.status); return r.text(); })
      .then(function (html) {
        var items = parse(html);
        if (items) {
          list = items;
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({t: Date.now(), items: items})); } catch (e) {}
        }
        reveal();
        paint();
      })
      /* the list could not be read: what was known stays, otherwise the built-in cards show */
      .catch(function () { reveal(); paint(); });
  }

  var watchedSection = null, observer = null, painting = false;
  function bindNews() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return false;
    if (section === watchedSection) return true;
    if (observer) observer.disconnect();
    watchedSection = section;
    /* an older script may write its own picture or text again later: Shoptet's wins */
    observer = new MutationObserver(function () {
      if (painting) return;
      painting = true;
      requestAnimationFrame(function () { paint(); painting = false; });
    });
    observer.observe(section, {attributes: true, attributeFilter: ['src', 'srcset', 'href'], childList: true, subtree: true});
    paint();
    return true;
  }

  function start() {
    var stale = Date.now() - readAt > FRESH;
    if (!list && stale) {
      waiting = true;
      setTimeout(reveal, 3000);
    }
    if (!bindNews()) {
      var root = document.querySelector('main#content') || document.getElementById('content') || document.body;
      if (root) {
        var mountObserver = new MutationObserver(function () { if (bindNews()) mountObserver.disconnect(); });
        mountObserver.observe(root, {childList: true, subtree: true});
      }
    }
    if (stale) {
      var later = window.requestIdleCallback || function (f) { setTimeout(f, 800); };
      if (list) later(refresh, {timeout: 3000}); else refresh();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
