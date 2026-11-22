/* Okla – the shop's articles, read from Shoptet's own article list (/nase-novinky/), for the homepage block
   (v91/home/okla_news_native_images.js) and the magazine page (newsroom/okla_newsroom.js). Nothing about the articles
   is written here: a new article published in Shoptet appears on its own, a removed one disappears, and a changed
   title, picture or text shows on the next visit. Each article:
   - href, title (without the shop's " | Okla.cz" ending), img (the picture chosen in the administration), date;
   - desc: the article's first real paragraph;
   - label: the article's own kicker (e.g. "Návod"), or the label kept for the first articles;
   - minutes: the reading time worked out from the article's length.
   window.oklaArticles.cached() gives what was read last time on this device (or null), .load(done) reads the list
   again when the last reading is older than 2 hours and calls done(list or null), .parse(html) reads a list page. */
(function () {
  'use strict';
  if (window.oklaArticles) return;

  var LIST = '/nase-novinky/';
  /* articles change a few times a month: the list (177 kB of HTML) is read again after 2 hours, not after 5 minutes */
  var CACHE_KEY = 'okla-articles-v1', FRESH = 2 * 60 * 60 * 1000;
  /* labels of the first articles, which have no kicker of their own */
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
    /* what earlier versions kept */
    ['okla-news-covers-v1', 'okla-news-covers-v2', 'okla-news-list-v1', 'okla-news-list-v2', 'okla-news-list-v3', 'okla-news-list-v4'].forEach(function (k) { localStorage.removeItem(k); });
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
        (url.hostname === location.hostname || /(^|\.)myshoptet\.com$/.test(url.hostname)) &&
        !/preforma-logo|favicon/.test(url.pathname) && url.pathname.indexOf('/user/logos/') === -1;
    } catch (e) { return false; }
  }

  /* Shoptet's article list as text: one piece per article */
  function parse(html) {
    var out = [], seen = {};
    var pieces = String(html || '').split(/class="news-item"/).slice(1);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      var head = /class="image"[\s\S]*?<a\b[^>]*\bhref="([^"]+)"[\s\S]*?<img\b([^>]*)>/.exec(p);
      var titleM = /<a\b[^>]*class="title"[^>]*>([\s\S]*?)<\/a>/.exec(p);
      if (!head || !titleM) continue;
      var href = pathOf(decode(head[1]));
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
        desc: lead,
        label: LABEL[href] || kicker,
        minutes: Math.max(2, Math.round(words / 200))
      });
    }
    return out.length ? out : null;
  }

  function keep(items) {
    list = items; readAt = Date.now();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({t: readAt, items: items})); } catch (e) {}
  }

  var waiting = [], loading = false;
  function load(done) {
    if (list && Date.now() - readAt <= FRESH) { if (done) done(list); return; }
    if (done) waiting.push(done);
    if (loading) return;
    loading = true;
    fetch(LIST, {credentials: 'same-origin'})
      .then(function (r) { if (!r.ok) throw new Error('list ' + r.status); return r.text(); })
      .then(function (html) { var items = parse(html); if (items) keep(items); })
      .catch(function () { /* what was known stays */ })
      .then(function () {
        loading = false;
        var cbs = waiting; waiting = [];
        cbs.forEach(function (f) { try { f(list); } catch (e) {} });
      });
  }

  /* shortened at a sentence or a word */
  function shorten(text, max) {
    text = String(text || '');
    if (text.length <= max) return text;
    var cut = text.slice(0, max);
    var dot = cut.lastIndexOf('. ');
    if (dot > max * 0.6) return cut.slice(0, dot + 1);
    return cut.replace(/[\s,;:–-]+\S*$/, '') + '…';
  }

  window.oklaArticles = {
    cached: function () { return list; },
    fresh: function () { return !!list && Date.now() - readAt <= FRESH; },
    load: load,
    parse: parse,
    keep: keep,
    shorten: shorten
  };
})();
