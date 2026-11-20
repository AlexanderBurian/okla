/* Okla – free delivery progress: "Do dopravy zdarma zbývá 599 Kč" with a bar that fills up as the cart grows, and
   "Dopravu máte zdarma" with a full bar once the limit is reached.

   Where: in the cart right above the discount-code field (PC aside card and phone alike), and in the "Zboží přidáno do
   košíku" popup under the added item.

   The numbers are Shoptet's own: the limit is the shop's "Doprava zdarma od" setting (dataLayer cartInfo.freeShippingFrom),
   the remaining amount is what Shoptet writes into its delivery note ("Nakupte ještě za 599 Kč a dopravu máte zdarma"), read
   from the page or, in the popup, from the cart content Shoptet sends back. With no limit set in Shoptet (0 Kč) nothing
   is shown - the shop then has no free delivery to promise. */
(function () {
  'use strict';
  if (window.__oklaFreeShippingV1) return;
  window.__oklaFreeShippingV1 = true;

  var TEXT = {
    cs: {left: 'Do dopravy zdarma zbývá', done: 'Dopravu máte zdarma', from: 'Doprava zdarma od'},
    sk: {left: 'Do dopravy zadarmo zostáva', done: 'Dopravu máte zadarmo', from: 'Doprava zadarmo od'},
    en: {left: 'Left to free delivery:', done: 'Your delivery is free', from: 'Free delivery from'},
    hu: {left: 'Az ingyenes szállításig még', done: 'A szállítás ingyenes', from: 'Ingyenes szállítás ettől:'}
  };
  var TRUCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  function lang() {
    var l = (window.oklaLang && window.oklaLang.current) || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    return TEXT[l] ? l : 'cs';
  }

  /* Shoptet's cart data from the page (the newest entry that has it) */
  function cartInfo() {
    var dl = window.dataLayer || [];
    for (var i = dl.length - 1; i >= 0; i--) {
      var s = dl[i] && dl[i].shoptet;
      if (s && s.cartInfo) return {info: s.cartInfo, currency: s.currencyInfo || {}};
    }
    return null;
  }

  function money(n, currency) {
    var sym = (currency && currency.symbol) || 'Kč';
    var txt = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return currency && currency.symbolLeft ? sym + ' ' + txt : txt + ' ' + sym;
  }

  /* the remaining amount from Shoptet's delivery note: a number = still to go, "zdarma!" without one = reached */
  function leftFromNote(node) {
    if (!node) return null;
    var text = (node.textContent || '').replace(/\s+/g, ' ');
    var m = text.match(/(\d[\d\s .]*(?:,\d+)?)\s*(Kč|CZK|€|EUR|Ft|HUF)/i);
    if (m) return parseFloat(m[1].replace(/[\s .]/g, '').replace(',', '.'));
    return /zdarma|zadarmo|free|ingyenes/i.test(text) ? 0 : null;
  }

  var state = {limit: 0, left: null, currency: {}};

  function readPage() {
    var ci = cartInfo();
    if (ci) {
      state.limit = +(ci.info.freeShippingFrom || 0);
      state.currency = ci.currency;
      if (state.left === null && ci.info.leftToFreeShipping) state.left = Math.max(0, +ci.info.leftToFreeShipping.priceLeft || 0);
    }
    var note = document.querySelector('.extras-wrapper .extra.delivery');
    var left = leftFromNote(note);
    if (left !== null) state.left = left;
  }

  function build() {
    var box = document.createElement('div');
    box.className = 'okla-fship';
    box.setAttribute('data-okla-i18n-skip', '');
    box.setAttribute('role', 'status');
    box.innerHTML = '<div class="okla-fship__line"><span class="okla-fship__ic"></span><span class="okla-fship__text"></span></div>' +
      '<div class="okla-fship__track" aria-hidden="true"><span class="okla-fship__fill"></span></div>' +
      '<div class="okla-fship__from"></div>';
    return box;
  }

  function paint(box) {
    var t = TEXT[lang()];
    var left = Math.max(0, state.left || 0);
    var done = left <= 0;
    var share = done ? 1 : Math.min(1, Math.max(0, (state.limit - left) / state.limit));
    box.classList.toggle('is-done', done);
    box.querySelector('.okla-fship__ic').innerHTML = done ? TICK : TRUCK;
    var text = box.querySelector('.okla-fship__text');
    text.textContent = '';
    if (done) text.textContent = t.done;
    else {
      text.appendChild(document.createTextNode(t.left + ' '));
      var b = document.createElement('strong');
      b.textContent = money(left, state.currency);
      text.appendChild(b);
    }
    box.querySelector('.okla-fship__fill').style.width = (share * 100).toFixed(1) + '%';
    box.querySelector('.okla-fship__from').textContent = done ? '' : t.from + ' ' + money(state.limit, state.currency);
  }

  /* the cart: right above the discount-code field (the PC aside card or the phone's coupon box) */
  function placeInCart() {
    var coupon = document.querySelector('.okla-coupon');
    var existing = document.querySelector('.okla-fship--cart');
    if (!(state.limit > 0) || state.left === null || !coupon) { if (existing) existing.remove(); return; }
    var box = existing || build();
    box.classList.add('okla-fship--cart');
    if (box.nextElementSibling !== coupon) coupon.parentElement.insertBefore(box, coupon);
    paint(box);
  }

  /* the "added to cart" popup: under the added item, with the numbers Shoptet sends back for the new cart */
  var fetching = 0;
  function refreshPopup() {
    var modal = document.getElementById('okla-cart-modal');
    if (!modal || !modal.classList.contains('is-open')) return;
    var ci = cartInfo();
    if (ci) { state.limit = +(ci.info.freeShippingFrom || 0); state.currency = ci.currency; }
    if (!(state.limit > 0)) return;
    var id = ++fetching;
    fetch('/action/Cart/GetCartContent/', {headers: {'X-Requested-With': 'XMLHttpRequest'}, credentials: 'same-origin'})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (id !== fetching || !j || !j.payload || !j.payload.content) return;
        var doc = new DOMParser().parseFromString(j.payload.content, 'text/html');
        var left = leftFromNote(doc.querySelector('.extra.delivery'));
        if (left === null) return;
        state.left = left;
        var items = modal.querySelector('.okla-cm__items');
        if (!items) return;
        var box = modal.querySelector('.okla-fship--popup');
        if (!box) { box = build(); box.classList.add('okla-fship--popup'); items.parentElement.insertBefore(box, items.nextSibling); }
        paint(box);
      })
      .catch(function () { /* no numbers: the popup simply stays without the bar */ });
  }

  /* the popup opening (its class) is watched on the popup itself, once it exists */
  var watchedModal = null;
  function watchModal() {
    var modal = document.getElementById('okla-cart-modal');
    if (!modal || modal === watchedModal || !window.MutationObserver) return;
    watchedModal = modal;
    var wasOpen = modal.classList.contains('is-open');
    new MutationObserver(function () {
      var open = modal.classList.contains('is-open');
      if (open && !wasOpen) refreshPopup();
      wasOpen = open;
    }).observe(modal, {attributes: true, attributeFilter: ['class']});
    if (wasOpen) refreshPopup();
  }

  var queued = false;
  function update() {
    queued = false;
    readPage();
    placeInCart();
    watchModal();
  }
  function soon() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  function start() {
    update();
    if (window.MutationObserver && document.body) {
      /* Shoptet rewrites the cart after every change (and the aside is rebuilt): read the note again and re-place the bar */
      new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var t = records[i].target;
          if (t.nodeType === 1 && t.closest && t.closest('.okla-fship')) continue;
          soon(); return;
        }
      }).observe(document.body, {childList: true, subtree: true});
    }
    /* a change of amount inside the popup */
    document.addEventListener('ShoptetCartUpdated', function () { setTimeout(refreshPopup, 150); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
