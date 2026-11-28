/* Okla mobile shell (max-width 767 px only). Compact header with a search icon, a sticky header on scroll up,
   a full-screen search (suggestions from the catalog, submit to the native Shoptet search) and a buy bar on product pages.
   Desktop is not touched: every piece checks the mobile media query. */
(function () {
 'use strict';
 if (window.__oklaMobileShell) return;
 window.__oklaMobileShell = true;

 var narrow = window.matchMedia('(max-width:767px)');
 var isDetail = !!((document.body && document.body.classList.contains('ok89-detail')) || document.querySelector('#content .p-detail'));
 var NS = 'http://www.w3.org/2000/svg';
 var SEARCH_ACTION = '/action/ProductSearch/prepareString/';
 var SEARCH_PATHS = ['M10.8 17.5a6.7 6.7 0 1 0 0-13.4 6.7 6.7 0 0 0 0 13.4Z', 'm15.9 15.9 4.7 4.7'];
 var CART_PATHS = ['M2.8 4.5H5l2.1 9.6a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6l1.2-6.3H6', 'M10 20h.01', 'M18 20h.01'];
 var SHARE_PATHS = ['M12 3v12', 'M7.5 7.5 12 3l4.5 4.5', 'M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'];

 function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
 }
 function icon(paths, cls) {
  var s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  if (cls) s.setAttribute('class', cls);
  paths.forEach(function (d) {
   var p = document.createElementNS(NS, 'path');
   p.setAttribute('d', d);
   s.appendChild(p);
  });
  return s;
 }
 function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
 }
 function products() {
  var c = window.OKLA_V86_CATALOG;
  return c ? Object.keys(c).sort().map(function (k) { return c[k]; }) : [];
 }
 function price(p) {
  return Number(p.price).toLocaleString('cs-CZ') + ',-';
 }
 function nativeSearch(q) {
  q = (q || '').trim();
  if (!q) return;
  var f = el('form');
  f.method = 'post';
  f.action = SEARCH_ACTION;
  [['language', 'cs'], ['string', q]].forEach(function (pair) {
   var i = el('input');
   i.type = 'hidden';
   i.name = pair[0];
   i.value = pair[1];
   f.appendChild(i);
  });
  document.body.appendChild(f);
  f.submit();
 }

 /* ---------- Search button in the header and the full-screen search ---------- */
 var overlay, input, results;

 function render(q) {
  results.textContent = '';
  var nq = norm(q);
  var list = products();
  var items = nq
   ? list.filter(function (p) { return norm(p.name + ' ' + (p.brand || '') + ' ' + p.code).indexOf(nq) !== -1; }).slice(0, 8)
   : list.slice(0, 8);
  /* quick picks, as on the PC */
  if (!nq) {
   var chips = el('div', 'okla-m-search__chips');
   ['Flipper Zero', 'ESP32', 'Chytré brýle', 'Endoskop', 'Multimetr'].forEach(function (t) {
    var c = el('button', 'okla-m-search__chip', t);
    c.type = 'button';
    c.addEventListener('click', function () { input.value = t; render(t); try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } });
    chips.appendChild(c);
   });
   results.appendChild(chips);
  }
  results.appendChild(el('div', 'okla-m-search__head', !nq ? 'Doporučujeme' : (items.length ? 'Produkty' : 'Nic jsme nenašli')));
  items.forEach(function (p) {
   var a = el('a', 'okla-m-search__item');
   a.href = p.url;
   var img = el('img', 'okla-m-search__thumb');
   img.src = p.image;
   img.alt = '';
   img.loading = 'lazy';
   img.decoding = 'async';
   var body = el('span', 'okla-m-search__body');
   body.appendChild(el('span', 'okla-m-search__name', p.name));
   body.appendChild(el('span', 'okla-m-search__price', price(p)));
   a.appendChild(img);
   a.appendChild(body);
   results.appendChild(a);
  });
  if (nq) {
   var all = el('button', 'okla-m-search__all', 'Hledat „' + q.trim() + '“');
   all.type = 'button';
   all.addEventListener('click', function () { nativeSearch(q); });
   results.appendChild(all);
  }
 }

 function buildOverlay() {
  overlay = el('div', 'okla-m-search');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Hledání');
  var bar = el('div', 'okla-m-search__bar');
  var field = el('label', 'okla-m-search__field');
  field.appendChild(icon(SEARCH_PATHS, 'okla-m-search__icon'));
  input = el('input', 'okla-m-search__input');
  input.type = 'search';
  input.placeholder = 'Napište, co hledáte';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocapitalize', 'none');
  input.setAttribute('enterkeyhint', 'search');
  input.setAttribute('aria-label', 'Hledat');
  field.appendChild(input);
  var cancel = el('button', 'okla-m-search__cancel', '');
  cancel.type = 'button';
  cancel.setAttribute('aria-label', 'Zavřít');
  cancel.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  bar.appendChild(field);
  bar.appendChild(cancel);
  results = el('div', 'okla-m-search__results');
  /* as on the PC: a white sheet at the top (the field and the suggestions, as tall as they are) over the dimmed page;
     a tap on the page beside it closes it */
  var sheet = el('div', 'okla-m-search__sheet');
  sheet.appendChild(bar);
  sheet.appendChild(results);
  overlay.appendChild(sheet);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  document.body.appendChild(overlay);
  input.addEventListener('input', function () { render(input.value); });
  input.addEventListener('keydown', function (e) {
   if (e.key === 'Enter') {
    e.preventDefault();
    nativeSearch(input.value);
   }
  });
  cancel.addEventListener('click', closeSearch);
 }
 function openSearch() {
  if (!overlay) buildOverlay();
  render('');
  void overlay.offsetWidth; /* commit the hidden state first so the open transition runs */
  overlay.classList.add('is-open');
  document.documentElement.classList.add('okla-m-lock');
  /* focused right away, still inside the tap: only then does the phone open its keyboard (a later focus does not);
     the field's 16 px text keeps the phone from zooming in */
  try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
  setTimeout(function () { if (document.activeElement !== input) input.focus(); }, 80);
 }
 function closeSearch() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  input.blur();
  document.documentElement.classList.remove('okla-m-lock');
 }
 document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSearch();
 });

 /* the logo row's button: the current language's flag; a tap opens a small sheet with the four languages */
 var langSheet = null;
 function langOpen(on) {
  if (!langSheet) return;
  langSheet.classList.toggle('is-open', on);
  var b = document.querySelector('#okla-v61-header .okla-m-lang');
  if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
 }
 function addHeaderButton() {
  var top = document.querySelector('#okla-v61-header .okm61-top'), api = window.oklaLang;
  if (!top || !api) return;
  var b = top.querySelector('.okla-m-lang');
  if (!b) {
   b = el('button', 'okla-m-search-open okla-m-lang');
   b.type = 'button';
   b.setAttribute('aria-haspopup', 'true');
   b.setAttribute('aria-expanded', 'false');
   b.setAttribute('data-okla-i18n-skip', '');
   b.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!langSheet) {
     langSheet = el('div', 'okla-m-lang-sheet');
     langSheet.setAttribute('role', 'menu');
     langSheet.setAttribute('data-okla-i18n-skip', '');
     api.langs.forEach(function (code) {
      var o = el('button', 'okla-m-lang-sheet__opt' + (code === api.current ? ' is-current' : ''));
      o.type = 'button';
      o.setAttribute('role', 'menuitemradio');
      o.setAttribute('aria-checked', code === api.current ? 'true' : 'false');
      o.appendChild(api.flag(code));
      o.appendChild(el('span', '', api.label[code]));
      o.addEventListener('click', function () { langOpen(false); if (code !== api.current) api.choose(code); });
      langSheet.appendChild(o);
     });
     document.body.appendChild(langSheet);
     document.addEventListener('click', function (ev) { if (langSheet.classList.contains('is-open') && !langSheet.contains(ev.target)) langOpen(false); });
     window.addEventListener('scroll', function () { if (langSheet.classList.contains('is-open')) langOpen(false); }, { passive: true });
    }
    var h = document.getElementById('okla-v61-header');
    if (h) langSheet.style.top = Math.max(0, Math.round(h.querySelector('.okm61-top').getBoundingClientRect().bottom) + 6) + 'px';
    langOpen(!langSheet.classList.contains('is-open'));
   });
   top.appendChild(b);
  }
  if (b.getAttribute('data-lang') !== api.current) {
   b.setAttribute('data-lang', api.current);
   b.setAttribute('aria-label', 'Jazyk / Language: ' + api.label[api.current]);
   b.replaceChildren(api.flag(api.current));
  }
 }

 /* the search bar under the floating header: the first move up brings the header, the third one (counted as separate
    swipes) the search bar; both go on the way down; a tap opens the search, ready to type */
 var upSince = 0, BAR_AFTER = 200, downTicks = 0, newSwipe = false, holdHeader = 0, anchorJump = 0, dir = 0, upAcc = 0, downAcc = 0, upSwipes = 0, lastT = 0, MOVE = 60;
 /* the band is a real search field (as the homepage's top search): a tap puts the cursor in it right there (16 px
    text, so the phone does not zoom in), and the suggestions drop down under it as on the PC - quick picks first,
    then products from the catalogue as you type; "Hledat" or Enter run the shop's search. The page under the
    suggestions is dimmed; a tap on it closes them. */
 var drop = null, dim = null, sInput = null;
 function dropRender(q) {
  drop.textContent = '';
  var nq = norm(q), list = products();
  var items = nq
   ? list.filter(function (p) { return norm(p.name + ' ' + (p.brand || '') + ' ' + p.code).indexOf(nq) !== -1; }).slice(0, 8)
   : list.slice(0, 6);
  if (!nq) {
   var chips = el('div', 'okla-m-sdrop__chips');
   ['Flipper Zero', 'ESP32', 'Chytré brýle', 'Endoskop', 'Multimetr'].forEach(function (t) {
    var c = el('button', 'okla-m-sdrop__chip', t);
    c.type = 'button';
    c.addEventListener('mousedown', function (e) { e.preventDefault(); });
    c.addEventListener('click', function () { sInput.value = t; dropRender(t); });
    chips.appendChild(c);
   });
   drop.appendChild(chips);
  }
  drop.appendChild(el('div', 'okla-m-sdrop__head', !nq ? 'Doporučujeme' : (items.length ? 'Produkty' : 'Nic jsme nenašli')));
  items.forEach(function (p) {
   var a = el('a', 'okla-m-sdrop__item');
   a.href = p.url;
   var img = el('img', 'okla-m-sdrop__thumb');
   img.src = p.image; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
   var body = el('span', 'okla-m-sdrop__body');
   body.appendChild(el('span', 'okla-m-sdrop__name', p.name));
   body.appendChild(el('span', 'okla-m-sdrop__price', price(p)));
   a.append(img, body);
   drop.appendChild(a);
  });
  if (nq) {
   var all = el('a', 'okla-m-sdrop__all', 'Zobrazit všechny výsledky');
   all.href = '/vyhledavani/?string=' + encodeURIComponent(q.trim());
   drop.appendChild(all);
  }
 }
 function dropOpen(on) {
  var root = document.documentElement;
  if (on === root.classList.contains('okla-m-sdrop-on')) return;
  if (on) {
   /* right under the white band (no strip of the page between them) */
   var band = document.querySelector('#okla-v61-header .okla-m-sbar-band');
   var top = band ? Math.round(band.getBoundingClientRect().bottom) : 120;
   drop.style.top = top + 'px';
   dim.style.top = top + 'px';
   dropRender(sInput.value);
  }
  root.classList.toggle('okla-m-sdrop-on', on);
 }
 function addSearchBar() {
  var h = document.getElementById('okla-v61-header');
  if (!h || h.querySelector('.okla-m-sbar')) return;
  var wrap = el('div', 'okla-m-sbar-wrap'), band = el('div', 'okla-m-sbar-band');
  var f = el('form', 'okla-m-sbar');
  f.setAttribute('role', 'search');
  f.action = '/vyhledavani/';
  f.method = 'get';
  f.appendChild(icon(SEARCH_PATHS, 'okla-m-sbar__icon'));
  sInput = el('input', 'okla-m-sbar__input');
  sInput.type = 'search';
  sInput.name = 'string';
  sInput.placeholder = 'Napište, co hledáte';
  sInput.setAttribute('autocomplete', 'off');
  sInput.setAttribute('autocapitalize', 'none');
  sInput.setAttribute('enterkeyhint', 'search');
  sInput.setAttribute('aria-label', 'Hledat produkty');
  var go = el('button', 'okla-m-sbar__go', 'Hledat');
  go.type = 'submit';
  /* a cross to leave the search: in the logo row, in the flag's place, while the suggestions are open */
  var x = el('button', 'okla-m-sbar__close');
  x.type = 'button';
  x.setAttribute('aria-label', 'Zavřít hledání');
  x.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  x.addEventListener('mousedown', function (e) { e.preventDefault(); });
  x.addEventListener('click', function () { sInput.value = ''; sInput.blur(); dropOpen(false); });
  f.append(sInput, go);
  var topRow = h.querySelector('.okm61-top');
  if (topRow) topRow.appendChild(x); else f.appendChild(x);
  f.addEventListener('submit', function (e) {
   e.preventDefault();
   var q = sInput.value.trim();
   if (q) location.href = '/vyhledavani/?string=' + encodeURIComponent(q); else sInput.focus();
  });
  band.appendChild(f);
  wrap.appendChild(band);
  h.appendChild(wrap);
  drop = el('div', 'okla-m-sdrop');
  drop.setAttribute('role', 'listbox');
  dim = el('div', 'okla-m-sdim');
  dim.addEventListener('click', function () { sInput.blur(); dropOpen(false); });
  document.body.append(dim, drop);
  sInput.addEventListener('focus', function () { holdHeader = Date.now(); dropOpen(true); });
  sInput.addEventListener('input', function () { dropRender(sInput.value); });
  sInput.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sInput.blur(); dropOpen(false); } });
 }
 function searchBar(on) {
  var root = document.documentElement;
  if (on === root.classList.contains('okla-m-sbar-on')) return;
  root.classList.toggle('okla-m-sbar-on', on);
 }
 var spacer = null, stuck = false, lastY = 0, ticking = false, stickyAfter = 80;

 /* where the sticky header starts is read only when it is needed - on the first scroll (and again after a resize) -
    not while the page is being built: reading a position then forced a full layout of the unfinished page (about half
    a second on a slow phone) */
 var measured = false;
 function measureStickyAfter() {
  if (stuck) return;
  measured = true;
  var pageHeader = document.getElementById('header');
  if (!pageHeader) return;
  var rect = pageHeader.getBoundingClientRect();
  stickyAfter = Math.max(80, Math.round((window.pageYOffset || document.documentElement.scrollTop || 0) + rect.bottom + 8));
 }

 function setSticky(on, hidden) {
  var h = document.getElementById('okla-v61-header');
  if (!h) return;
  /* A product detail keeps only its ordinary in-page header. The floating
     mobile header must never cover the gallery, breadcrumb or page gradient. */
  if (!spacer) {
   spacer = el('div', 'okla-m-header-spacer');
   h.parentNode.insertBefore(spacer, h.nextSibling);
  }
  var root = document.documentElement, changed = on !== stuck;
  if (on && !stuck) { spacer.style.height = h.offsetHeight + 'px'; anchorJump = h.offsetHeight; }
  if (!on && stuck) anchorJump = -h.offsetHeight;
  if (!on && stuck) spacer.style.height = '0px';
  if (!on || hidden) { searchBar(false); upSwipes = 0; upSince = 0; }
  stuck = on;
  /* Switching between the header in the page and the fixed one happens without
     animation: otherwise the fixed white bar would flash over the page-top
     gradient and slide away (scrolling down), which looked like a broken gradient. */
  if (changed) root.classList.add('okla-m-instant');
  root.classList.toggle('okla-m-stuck', on);
  root.classList.toggle('okla-m-hidden', on && hidden);
  if (changed) {
   void h.offsetWidth;
   requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('okla-m-instant'); }); });
  }
 }
 function inCheckout() { return !!(document.body && document.body.classList.contains('ordering-process')); }
 function onScroll() {
  if (!measured) measureStickyAfter();
  ticking = false;
  var y = window.pageYOffset || document.documentElement.scrollTop || 0;
  var dy = y - lastY;
  lastY = y;
  /* the browser keeps the content in place when the spacer comes or goes (it moves the page by the header's height):
     that move is not the visitor's scrolling */
  if (anchorJump && Math.abs(dy - anchorJump) <= 6) { anchorJump = 0; return; }
  anchorJump = 0;
  if (!narrow.matches || document.documentElement.classList.contains('okla-m-lock') || document.documentElement.classList.contains('okla-m-sdrop-on')) return;
  /* the cart / checkout steps never get the floating header */
  if (inCheckout()) {
   if (stuck) setSticky(false, false);
   return;
  }
  /* the header row is always pinned at the top and goes with the visitor (never hidden); the search bar under it comes
     only when the visitor moves up (60 px of steady movement) and goes when they move down again */
  var root = document.documentElement;
  root.classList.toggle('okla-m-attop', y <= 2);
  if (!stuck && y > 0) setSticky(true, false);
  else if (stuck && y <= 0) setSticky(false, false);
  if (y <= stickyAfter) {
   searchBar(false);
   dir = 0; upAcc = downAcc = 0; upSince = 0; upSwipes = 0;
   return;
  }
  if (dy < 0) {
   if (dir !== -1) upAcc = 0;
   dir = -1; upAcc += -dy; downAcc = 0; downTicks = 0;
   if (upAcc >= MOVE) searchBar(true);
  } else if (dy > 0) {
   if (dir !== 1) { downAcc = 0; downTicks = 0; }
   dir = 1; downAcc += dy; upAcc = 0; downTicks++;
   if (downAcc >= MOVE && downTicks >= 2 && Date.now() - holdHeader > 600) searchBar(false);
  }
 }

 /* ---------- Buy bar on product pages (shown after the buy button scrolls away) ---------- */
 var bar = null, nativeBtn = null;

 function buildBuyBar() {
  if (bar) return;
  nativeBtn = document.querySelector('.p-detail .add-to-cart button.add-to-cart-button');
  if (!nativeBtn) return;
  // The product's own price sits in the buy box; .p-detail also holds related products' prices, which come first in the DOM.
  var priceEl = document.querySelector('#product-detail-form .p-final-price-wrapper .price-final') || document.querySelector('.p-info-wrapper .price-final');
  bar = el('div', 'okla-m-buybar');
  bar.setAttribute('aria-label', 'Rychlý nákup');
  var price = el('span', 'okla-m-buybar__price', priceEl ? priceEl.textContent.trim() : '');
  if (priceEl) new MutationObserver(function () { price.textContent = priceEl.textContent.trim(); })
   .observe(priceEl, { childList: true, characterData: true, subtree: true });
  var go = el('button', 'okla-m-buybar__btn');
  go.type = 'button';
  go.appendChild(icon(CART_PATHS, 'okla-m-buybar__icon'));
  go.appendChild(el('span', null, 'Přidat do košíku'));
  go.disabled = nativeBtn.disabled;
  go.addEventListener('click', function () { if (!nativeBtn.disabled) nativeBtn.click(); });
  bar.appendChild(price);
  bar.appendChild(go);
  document.body.appendChild(bar);
  placeBar();
  new MutationObserver(function () { go.disabled = nativeBtn.disabled; })
   .observe(nativeBtn, { attributes: true, attributeFilter: ['disabled'] });
  // The bar slides down from the top once the page's own buy button has scrolled up out of view, and goes again
  // when the button comes back.
  var ticking = false;
  function syncBar() {
   ticking = false;
   var r = nativeBtn.getBoundingClientRect();
   bar.classList.toggle('is-visible', narrow.matches && r.width > 0 && r.bottom < 0);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(syncBar); } }, { passive: true });
  window.addEventListener('resize', syncBar);
  syncBar();
 }

 /* the bar sits at the top of the window (CSS) */
 function placeBar() {
  if (bar) bar.style.removeProperty('bottom');
 }

 /* ---------- Share button beside the product title ---------- */
 var toastEl = null, toastTimer = null;
 function toast(text) {
  if (!toastEl) {
   toastEl = el('div', 'okla-m-toast');
   toastEl.setAttribute('role', 'status');
   document.body.appendChild(toastEl);
  }
  toastEl.textContent = text;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 1600);
 }
 function share() {
  if (navigator.share) {
   navigator.share({ title: document.title, url: location.href }).catch(function () {});
   return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
   navigator.clipboard.writeText(location.href).then(function () { toast('Odkaz je zkopírovaný'); }, function () {});
  }
 }
 function addShare() {
  var title = document.querySelector('.p-detail-inner-header h1');
  if (!title || title.parentNode.querySelector('.okla-m-share')) return;
  var b = el('button', 'okla-m-share');
  b.type = 'button';
  b.setAttribute('aria-label', 'Sdílet produkt');
  b.appendChild(icon(SHARE_PATHS, 'okla-m-share__icon'));
  b.addEventListener('click', share);
  title.insertAdjacentElement('afterend', b);
 }

 function init() {
  addHeaderButton();
  addSearchBar();
  buildBuyBar();
  addShare();
  /* the scroll position is first read on the first scroll (lastY starts at 0): reading it here, while the page was
     still being built, forced a whole-page layout */
  window.addEventListener('resize', function () { placeBar(); measured = false; });
  narrow.addEventListener('change', function (e) {
   if (e.matches) return;
   closeSearch();
   if (stuck) setSticky(false, false);
  });
  window.addEventListener('touchstart', function () { newSwipe = true; }, { passive: true });
  window.addEventListener('scroll', function () {
   if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
   }
  }, { passive: true });
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
 else init();
 window.addEventListener('load', function () {
  addHeaderButton();
  addSearchBar();
  buildBuyBar();
  addShare();
 });
})();
