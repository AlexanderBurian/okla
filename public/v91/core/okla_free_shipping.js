/* Okla – free delivery progress in the cart: "Do dopravy zdarma zbývá 1 411 Kč" with a bar that fills up as the cart
   grows and "Doprava zdarma od 2 000 Kč" under it, and "Dopravu máte zdarma" with a full bar once the limit is reached.

   Where: in the cart only, right above the discount-code field (the PC aside card; on phones above the folded
   discount-code box). Not in the "Zboží přidáno do košíku" popup.

   The limit: free delivery from 2 000 Kč. When the shop sets its own limit in Shoptet ("Doprava zdarma od", dataLayer
   cartInfo.freeShippingFrom), that one is used and the remaining amount is Shoptet's own (its delivery note "Nakupte
   ještě za … a dopravu máte zdarma"); without it, the remaining amount is worked out from the goods in the cart. */
(function () {
  'use strict';
  if (window.__oklaFreeShippingV1) return;
  window.__oklaFreeShippingV1 = true;

  /* free delivery from (Kč), used while no limit is set in Shoptet */
  var LIMIT = 2000;

  var TEXT = {
    cs: {left: 'Do dopravy zdarma zbývá', done: 'Dopravu máte zdarma', from: 'Doprava zdarma od'},
    sk: {left: 'Do dopravy zadarmo zostáva', done: 'Dopravu máte zadarmo', from: 'Doprava zadarmo od'},
    en: {left: 'Left to free delivery:', done: 'Your delivery is free', from: 'Free delivery from'},
    hu: {left: 'Az ingyenes szállításig még', done: 'A szállítás ingyenes', from: 'Ingyenes szállítás ettől:'}
  };
  /* a delivery truck: rounded outline, a light fill of the same blue in the box and the window, white wheels */
  var TRUCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="f" d="M4.5 5h8A1.5 1.5 0 0 1 14 6.5V16H4.5A1.5 1.5 0 0 1 3 14.5v-8A1.5 1.5 0 0 1 4.5 5z"/><path d="M4.5 5h8A1.5 1.5 0 0 1 14 6.5V16H4.5A1.5 1.5 0 0 1 3 14.5v-8A1.5 1.5 0 0 1 4.5 5z"/><path d="M14 9h3.4c.47 0 .91.22 1.2.6l2.1 2.8c.19.26.3.58.3.9V15a1 1 0 0 1-1 1h-.4M14 16h1"/><path class="f" d="M15.6 10.6h1.7l1.3 1.8h-3z"/><circle class="w" cx="7.5" cy="17" r="2"/><circle class="w" cx="17.2" cy="17" r="2"/></svg>';
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
    var txt = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return currency && currency.symbolLeft ? sym + ' ' + txt : txt + ' ' + sym;
  }
  function amount(text) {
    var m = String(text || '').replace(/\s+/g, ' ').match(/(\d[\d\s .]*(?:,\d+)?)/);
    return m ? parseFloat(m[1].replace(/[\s .]/g, '').replace(',', '.')) : NaN;
  }

  /* Shoptet's delivery note: a number = still to go, "zdarma!" without one = reached */
  function leftFromNote(node) {
    if (!node) return null;
    var text = (node.textContent || '').replace(/\s+/g, ' ');
    var m = text.match(/(\d[\d\s .]*(?:,\d+)?)\s*(Kč|CZK|€|EUR|Ft|HUF)/i);
    if (m) return parseFloat(m[1].replace(/[\s .]/g, '').replace(',', '.'));
    return /zdarma|zadarmo|free|ingyenes/i.test(text) ? 0 : null;
  }

  /* the goods in the cart: the total the cart shows (it follows every change of amount at once), or Shoptet's total
     without delivery and payment */
  function goodsTotal(ci) {
    var shown = document.querySelector('.okla-cart-summary__row--goods .okla-cart-summary__val, .okla-goods-total-price [data-testid="recapItemTotalPrice"]');
    var n = shown ? amount(shown.textContent) : NaN;
    if (isFinite(n)) return n;
    var g = ci && ci.info && ci.info.getNoBillingShippingPrice;
    return g && isFinite(+g.withVat) ? +g.withVat : null;
  }

  var state = {limit: LIMIT, left: null, currency: {}};

  function readPage() {
    var ci = cartInfo();
    state.currency = ci ? ci.currency : {};
    var own = ci ? +(ci.info.freeShippingFrom || 0) : 0;
    if (own > 0) {
      /* the shop's own limit: Shoptet's remaining amount */
      state.limit = own;
      var left = leftFromNote(document.querySelector('.extras-wrapper .extra.delivery'));
      if (left === null && ci.info.leftToFreeShipping) left = Math.max(0, +ci.info.leftToFreeShipping.priceLeft || 0);
      state.left = left;
    } else {
      state.limit = LIMIT;
      var goods = goodsTotal(ci);
      state.left = goods === null ? null : Math.max(0, LIMIT - goods);
    }
  }

  function build() {
    var box = document.createElement('div');
    box.className = 'okla-fship okla-fship--cart';
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
    var ic = done ? TICK : TRUCK, icon = box.querySelector('.okla-fship__ic');
    if (icon.innerHTML !== ic) icon.innerHTML = ic;
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
    var from = done ? '' : t.from + ' ' + money(state.limit, state.currency), fromEl = box.querySelector('.okla-fship__from');
    if (fromEl.textContent !== from) fromEl.textContent = from;
  }

  /* the cart: right above the discount-code field (the PC aside card or the phone's coupon box) */
  function placeInCart() {
    var coupon = document.querySelector('.okla-coupon');
    var existing = document.querySelector('.okla-fship--cart');
    if (state.left === null || !coupon) { if (existing) existing.remove(); return; }
    var box = existing || build();
    /* on phones the code field sits in a folded "Využít slevový / dárkový poukaz" box: the bar goes above that box, so it
       is always seen */
    var anchor = coupon.closest('.okla-cart-summary__coupon') || coupon;
    if (box.nextElementSibling !== anchor) anchor.parentElement.insertBefore(box, anchor);
    paint(box);
  }

  var queued = false;
  function update() {
    queued = false;
    readPage();
    placeInCart();
  }
  function soon() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  function start() {
    if (!document.body || !/(^|\s)in-kosik(\s|$)/.test(document.body.className)) return;
    update();
    if (window.MutationObserver) {
      /* Shoptet rewrites the cart after every change (and the aside is rebuilt): read it again and re-place the bar */
      new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var t = records[i].target;
          if (t.nodeType === 1 && t.closest && t.closest('.okla-fship')) continue;
          soon(); return;
        }
      }).observe(document.body, {childList: true, subtree: true});
    }
    document.addEventListener('ShoptetCartUpdated', function () { setTimeout(soon, 150); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
