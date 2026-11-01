/* OKLA Shoptet entry point. Storefront and AI releases are pinned independently. */
(function () {
  'use strict';
  if (window.__oklaAiShoptetLoader) return;
  window.__oklaAiShoptetLoader = true;

  var current = document.currentScript;
  var apiUrl = current && current.getAttribute('data-api-url');
  var storefrontUrl = 'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@4bbf6608f1a9bbd5c106a86e9623f0b5485b6033/public/zapati_firsthalf.js?v=100';
  var aiBase = 'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@53df90312e4850d56422b036efccbe029169615a/public/ai/v1/';

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
