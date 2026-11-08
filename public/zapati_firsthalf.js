/* OKLA Shoptet entry point. Storefront and AI releases are pinned independently. */
(function () {
  'use strict';
  if (window.__oklaAiShoptetLoader) return;
  window.__oklaAiShoptetLoader = true;

  var current = document.currentScript;
  var apiUrl = current && current.getAttribute('data-api-url');
  var assetBase = current && current.src
    ? current.src.split(/[?#]/)[0].replace(/[^/]*$/, '')
    : '';

  /*
   * Native Shoptet article previews for the custom OKLA homepage news grid.
   * The pinned storefront still contains old stock-image assignments; native
   * og:image from each Shoptet article is authoritative, including later edits
   * made in the Shoptet article administration.
   */
  function syncNativeArticleImages() {
    if (location.pathname !== '/' && location.pathname !== '') return;

    var paths = [
      '/nase-novinky/flipper-zero-co-vsechno-zvladne-kapesni-multitool/',
      '/nase-novinky/wifi/',
      '/nase-novinky/usb-c/',
      '/nase-novinky/nfc/',
      '/nase-novinky/meridlo/'
    ];
    var covers = [];
    var activeSection = null;
    var imageObserver = null;

    function usableCover(value, pageUrl) {
      if (!value) return null;
      try {
        var u = new URL(value, pageUrl);
        if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
        // Shoptet may use the shop origin or its image CDN.
        if (u.hostname !== location.hostname && u.hostname !== 'cdn.myshoptet.com') return null;
        if (u.pathname.includes('/logos/') || /preforma-logo|favicon/i.test(u.pathname)) return null;
        return u.href;
      } catch (_) {
        return null;
      }
    }

    function paint() {
      var section = document.getElementById('okla-news-v55');
      if (!section) return;
      var cards = section.querySelectorAll('.okn-card');
      for (var i = 0; i < Math.min(cards.length, paths.length); i++) {
        if (!covers[i]) continue;
        var img = cards[i].querySelector('.okn-image img');
        if (!img) continue;
        if (img.getAttribute('src') !== covers[i] || img.hasAttribute('srcset')) {
          img.onerror = null; // Prevent the obsolete Unsplash/Pexels fallback.
          img.removeAttribute('srcset');
          img.removeAttribute('sizes');
          img.setAttribute('src', covers[i]);
        }
        img.setAttribute('alt', cards[i].querySelector('.okn-title')?.textContent?.trim() || 'Článek OKLA');
      }
    }

    function attach() {
      var section = document.getElementById('okla-news-v55');
      if (!section || section === activeSection) return !!section;
      if (imageObserver) imageObserver.disconnect();
      activeSection = section;
      imageObserver = new MutationObserver(function (changes) {
        if (changes.some(function (change) {
          return change.type === 'attributes' || change.addedNodes.length > 0;
        })) paint();
      });
      // Observe only the article grid, not product cards or the rest of Shoptet.
      imageObserver.observe(section, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['src', 'srcset']
      });
      paint();
      return true;
    }

    function observeNewsMount() {
      if (attach()) return;
      var root = document.querySelector('main#content') || document.getElementById('content') || document.body;
      if (!root) return;
      var mountObserver = new MutationObserver(function () {
        if (attach()) mountObserver.disconnect();
      });
      mountObserver.observe(root, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeNewsMount, { once: true });
    } else {
      observeNewsMount();
    }

    paths.forEach(function (path, index) {
      fetch(path, { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Article HTTP ' + response.status);
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var meta = doc.querySelector('meta[property="og:image"]');
          var url = usableCover(meta && meta.getAttribute('content'), location.origin + path);
          if (url) {
            covers[index] = url;
            paint();
          }
        })
        .catch(function () {
          // Never replace a Shoptet image with an unrelated stock picture.
        });
    });
  }
  syncNativeArticleImages();

  /*
   * Two compact trust badges below Shoptet's native Visa/Mastercard row.
   * Together they are exactly as wide as the native 148 px payment image.
   */
  function mountPaymentTrustBadges() {
    var paymentBox = document.querySelector('.box-onlinePayments');
    var paymentRow = paymentBox && paymentBox.querySelector('p.text-center');
    if (!paymentRow || document.getElementById('okla-payment-trust-badges')) return false;

    var style = document.getElementById('okla-payment-trust-badges-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'okla-payment-trust-badges-style';
      style.textContent =
        '#okla-payment-trust-badges{' +
          'display:grid!important;' +
          'grid-template-columns:repeat(2,minmax(0,1fr))!important;' +
          'align-items:center!important;' +
          'gap:8px!important;' +
          'width:148px!important;' +
          'max-width:100%!important;' +
          'margin:10px auto 0!important;' +
          'padding:0!important' +
        '}' +
        '#okla-payment-trust-badges .okla-payment-trust-badge{' +
          'display:flex!important;' +
          'align-items:center!important;' +
          'justify-content:center!important;' +
          'min-width:0!important;' +
          'height:28px!important;' +
          'margin:0!important;' +
          'padding:0!important' +
        '}' +
        '#okla-payment-trust-badges img{' +
          'display:block!important;' +
          'width:100%!important;' +
          'height:28px!important;' +
          'max-width:none!important;' +
          'margin:0!important;' +
          'object-fit:contain!important;' +
          'object-position:center!important' +
        '}';
      (document.head || document.documentElement).appendChild(style);
    }

    var badges = document.createElement('div');
    badges.id = 'okla-payment-trust-badges';
    badges.setAttribute('aria-label', 'Bezpečné připojení a Shoptet Pay');
    badges.innerHTML =
      '<span class="okla-payment-trust-badge">' +
        '<img src="' + assetBase + 'okla_sidebar/https-secure.png" alt="HTTPS zabezpečené připojení" width="70" height="28" loading="lazy">' +
      '</span>' +
      '<span class="okla-payment-trust-badge">' +
        '<img src="' + assetBase + 'okla_sidebar/shoptet-pay.png" alt="Shoptet Pay" width="70" height="28" loading="lazy">' +
      '</span>';
    paymentRow.insertAdjacentElement('afterend', badges);
    return true;
  }

  function initPaymentTrustBadges() {
    if (mountPaymentTrustBadges()) return;
    var root = document.getElementById('content-wrapper') || document.body;
    if (!root) return;
    var observer = new MutationObserver(function () {
      if (mountPaymentTrustBadges()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaymentTrustBadges, { once: true });
  } else {
    initPaymentTrustBadges();
  }

  var storefrontUrl = 'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@4bbf6608f1a9bbd5c106a86e9623f0b5485b6033/public/zapati_firsthalf.js?v=100';
  var aiBase = 'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@cf6fd489ea3a618a1bc2726a9ca5806b3705a93d/public/ai/v1/';

  if (!window.__oklaBootstrapV91 && !window.__oklaCompleteV71) {
    var storefront = document.createElement('script');
    storefront.src = storefrontUrl;
    storefront.onerror = function () { console.error('[OKLA] Storefront loader could not be loaded.'); };
    (document.head || document.documentElement).appendChild(storefront);
  }

  if (!document.querySelector('okla-ai-chat')) {
    var ai = document.createElement('script');
    ai.src = aiBase + 'widget.js';
    ai.setAttribute('data-asset-base-url', aiBase);
    if (apiUrl) ai.setAttribute('data-api-url', apiUrl);
    else console.warn('[OKLA AI] Set data-api-url to the deployed HTTPS backend to enable answers.');
    ai.onerror = function () { console.error('[OKLA AI] Widget could not be loaded.'); };
    (document.head || document.documentElement).appendChild(ai);
  }
})();
