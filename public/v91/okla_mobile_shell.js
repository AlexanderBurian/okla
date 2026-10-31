/* OKLA mobile shell (max-width 767 px only). Compact header with a search icon, a sticky header on scroll up,
   a full-screen search (suggestions from the catalog, submit to the native Shoptet search) and a buy bar on product pages.
   Desktop is not touched: every piece checks the mobile media query. */
(function () {
 'use strict';
 if (window.__oklaMobileShell) return;
 window.__oklaMobileShell = true;

 var narrow = window.matchMedia('(max-width:767px)');
 var isDetail = !!(document.body && document.body.classList.contains('ok89-detail'));
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
   : list.slice(0, 6);
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
  var cancel = el('button', 'okla-m-search__cancel', 'Zrušit');
  cancel.type = 'button';
  bar.appendChild(field);
  bar.appendChild(cancel);
  results = el('div', 'okla-m-search__results');
  overlay.appendChild(bar);
  overlay.appendChild(results);
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
  setTimeout(function () { input.focus(); }, 80);
 }
 function closeSearch() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.documentElement.classList.remove('okla-m-lock');
  input.blur();
 }
 document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSearch();
 });

 function addHeaderButton() {
  var top = document.querySelector('#okla-v61-header .okm61-top');
  if (!top || top.querySelector('.okla-m-search-open')) return;
  var b = el('button', 'okla-m-search-open');
  b.type = 'button';
  b.setAttribute('aria-label', 'Hledat');
  b.appendChild(icon(SEARCH_PATHS, 'okla-m-search-open__icon'));
  b.addEventListener('click', openSearch);
  top.appendChild(b);
 }

 /* ---------- Sticky header: shown when scrolling up, hidden when scrolling down ---------- */
 var spacer = null, stuck = false, lastY = 0, ticking = false;

 function setSticky(on, hidden) {
  var h = document.getElementById('okla-v61-header');
  if (!h) return;
  if (!spacer) {
   spacer = el('div', 'okla-m-header-spacer');
   h.parentNode.insertBefore(spacer, h.nextSibling);
  }
  if (on && !stuck) spacer.style.height = h.offsetHeight + 'px';
  if (!on && stuck) spacer.style.height = '0px';
  stuck = on;
  document.documentElement.classList.toggle('okla-m-stuck', on);
  document.documentElement.classList.toggle('okla-m-hidden', on && hidden);
 }
 function onScroll() {
  ticking = false;
  var y = window.pageYOffset || document.documentElement.scrollTop || 0;
  var dy = y - lastY;
  lastY = y;
  if (!narrow.matches || document.documentElement.classList.contains('okla-m-lock')) return;
  if (isDetail) {
    // Product pages: the gradient header stays on screen the whole time.
    setSticky(y >= 80, false);
    return;
  }
  if (y < 80) {
   if (stuck) setSticky(false, false);
   return;
  }
  if (dy < -4) setSticky(true, false);
  else if (dy > 4) setSticky(true, true);
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
  if (isDetail) {
   // Product pages: the buy bar is there the whole time.
   bar.classList.add('is-visible');
  } else if ('IntersectionObserver' in window) {
   new IntersectionObserver(function (entries) {
    bar.classList.toggle('is-visible', narrow.matches && !entries[0].isIntersecting);
   }).observe(nativeBtn);
  }
 }

 /* the bar sits on top of the bottom navigation, whatever its real height is */
 function placeBar() {
  var nav = document.getElementById('okla-v61-bottom');
  if (bar) bar.style.bottom = (nav ? nav.offsetHeight : 0) + 'px';
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
  buildBuyBar();
  addShare();
  lastY = window.pageYOffset || 0;
  window.addEventListener('resize', placeBar);
  narrow.addEventListener('change', function (e) {
   if (e.matches) return;
   closeSearch();
   if (stuck) setSticky(false, false);
  });
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
  buildBuyBar();
  addShare();
 });
})();
