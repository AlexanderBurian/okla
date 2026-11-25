/* Okla – the homepage articles ("Co je u nás nového") follow Shoptet by themselves.

   The articles come from Shoptet's own article list (v91/core/okla_articles.js). The cards show the Flipper Zero
   article first (top left), then the list's first articles in its order (a new article published in Shoptet appears on
   its own, a removed one disappears), each with its title and link, the picture chosen in the administration, the
   date, a short lead, the label and the reading time.
   What was read last time is kept on the device and shown at once; the list is read again on every visit to the
   homepage (at most once in 5 minutes), so a change in Shoptet shows on the next visit. The block itself
   (legacy/v55/okla_news_v55.js) has no articles of its own: until the list is known (a very first visit) or when it
   cannot be read, the whole block stays hidden. */
(function () {
  'use strict';
  if (window.__oklaNewsNativeImages) return;
  if (location.pathname !== '/' && location.pathname !== '') return;
  var A = window.oklaArticles;
  if (!A) return;
  window.__oklaNewsNativeImages = true;

  var MAX = 5;
  var PHONE = window.matchMedia('(max-width:767px)');
  var loopGrid = null, loopTimer = 0, loopJumping = false;
  /* always the first card (top left), wherever it is in Shoptet's list */
  var PINNED = '/nase-novinky/flipper-zero-co-vsechno-zvladne-kapesni-multitool/';

  function cards() {
    var all = A.cached();
    if (!all) return null;
    var out = all.slice();
    /* the pinned article first (top left, the big card), then the others in Shoptet's order */
    out.sort(function (a, b) { return (b.href === PINNED) - (a.href === PINNED); });
    return out.slice(0, MAX);
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
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('src', a.img);
      }
      img.alt = a.title;
    }
    if (title) { title.setAttribute('href', a.href); if (title.textContent !== a.title) title.textContent = a.title; }
    if (body) {
      var cat = body.querySelector('.okn-cat');
      if (a.label) {
        if (!cat) { cat = document.createElement('p'); cat.className = 'okn-cat'; body.insertBefore(cat, body.firstChild); }
        if (cat.textContent !== a.label) cat.textContent = a.label;
      } else if (cat) cat.remove();
    }
    var lead = A.shorten(a.desc, 150);
    var desc = card.querySelector('.okn-desc');
    if (desc && desc.textContent !== lead) desc.textContent = lead;
    var date = card.querySelector('.okn-date');
    if (date && date.textContent !== a.date) date.textContent = a.date;
    var read = card.querySelector('.okn-read');
    if (read) {
      var last = read.lastChild, text = a.minutes + ' min čtení';
      if (last && last.nodeType === 3) { if (last.nodeValue !== text) last.nodeValue = text; } else read.appendChild(document.createTextNode(text));
    }
  }

  function realNewsCards(grid) {
    return [].slice.call(grid.querySelectorAll(':scope > .okn-card:not([data-okla-news-clone])')).filter(function (card) { return !card.hidden; });
  }

  function removeNewsLoop() {
    clearTimeout(loopTimer);
    if (!loopGrid) return;
    loopGrid.removeEventListener('scroll', newsScrolled);
    if ('onscrollend' in window) loopGrid.removeEventListener('scrollend', normalizeNewsLoop);
    loopGrid.querySelectorAll('[data-okla-news-clone]').forEach(function (node) { node.remove(); });
    loopGrid.style.removeProperty('scroll-snap-type');
    loopGrid.style.removeProperty('scroll-behavior');
    loopGrid = null;
    loopJumping = false;
  }

  function newsJump(grid, left) {
    loopJumping = true;
    grid.style.setProperty('scroll-snap-type', 'none', 'important');
    grid.style.setProperty('scroll-behavior', 'auto', 'important');
    grid.scrollLeft = Math.max(0, left);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      grid.style.removeProperty('scroll-snap-type');
      grid.style.removeProperty('scroll-behavior');
      loopJumping = false;
    }); });
  }

  function normalizeNewsLoop() {
    var grid = loopGrid;
    if (!grid || loopJumping || !PHONE.matches) return;
    var real = realNewsCards(grid), before = grid.querySelector(':scope > [data-okla-news-clone="before"]'), after = grid.querySelector(':scope > [data-okla-news-clone="after"]');
    if (real.length < 2 || !before || !after) return;
    var x = grid.scrollLeft;
    if (x <= (before.offsetLeft + real[0].offsetLeft) / 2) newsJump(grid, real[real.length - 1].offsetLeft);
    else if (x >= (real[real.length - 1].offsetLeft + after.offsetLeft) / 2) newsJump(grid, real[0].offsetLeft);
  }

  function newsScrolled() {
    if (loopJumping || 'onscrollend' in window) return;
    clearTimeout(loopTimer);
    loopTimer = setTimeout(normalizeNewsLoop, 120);
  }

  function setupNewsLoop(section) {
    var grid = section && section.querySelector('.okn-grid');
    if (!PHONE.matches || !grid) { removeNewsLoop(); return; }
    if (loopGrid === grid && grid.querySelector('[data-okla-news-clone]')) return;
    removeNewsLoop();
    var real = realNewsCards(grid);
    if (real.length < 2) return;
    var before = real[real.length - 1].cloneNode(true), after = real[0].cloneNode(true);
    before.dataset.oklaNewsClone = 'before'; after.dataset.oklaNewsClone = 'after';
    [before, after].forEach(function (clone) {
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a,button,input,select,textarea').forEach(function (node) { node.setAttribute('tabindex', '-1'); });
    });
    grid.insertBefore(before, real[0]); grid.appendChild(after);
    loopGrid = grid;
    grid.addEventListener('scroll', newsScrolled, {passive:true});
    if ('onscrollend' in window) grid.addEventListener('scrollend', normalizeNewsLoop, {passive:true});
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (loopGrid === grid) newsJump(grid, real[0].offsetLeft); }); });
  }

  function paint() {
    var section = document.getElementById('okla-news-v55');
    if (!section) return;
    var list = cards();
    /* no articles known: the block is not shown at all */
    if (!list) { section.style.setProperty('display', 'none', 'important'); return; }
    section.style.removeProperty('display');
    var els = section.querySelectorAll('.okn-card:not([data-okla-news-clone])');
    for (var i = 0; i < els.length; i++) {
      if (list[i]) fill(els[i], list[i]);
      else els[i].hidden = true;
    }
    setupNewsLoop(section);
  }

  function start() {
    if (document.getElementById('okla-news-v55')) paint();
    else {
      /* the block is built a moment later (legacy/v55/okla_news_v55.js) */
      var root = document.querySelector('main#content') || document.getElementById('content') || document.body;
      if (root) {
        var mountObserver = new MutationObserver(function () {
          if (document.getElementById('okla-news-v55')) { mountObserver.disconnect(); paint(); }
        });
        mountObserver.observe(root, {childList: true, subtree: true});
      }
    }
    if (!A.fresh()) {
      var read = function () { A.load(paint); };
      if (A.cached()) (window.requestIdleCallback || function (f) { setTimeout(f, 800); })(read, {timeout: 3000});
      else read();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
  if (PHONE.addEventListener) PHONE.addEventListener('change', function () { var section=document.getElementById('okla-news-v55'); if(section)setupNewsLoop(section); });
  else if (PHONE.addListener) PHONE.addListener(function () { var section=document.getElementById('okla-news-v55'); if(section)setupNewsLoop(section); });
})();
