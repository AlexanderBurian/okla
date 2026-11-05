/* OKLA — article hero image.
   On a single article page (/nase-novinky/<slug>/) the main (hero) image should match the image used for the same
   article on the homepage and in the newsroom, i.e. the article's og:image. The article template keeps its own markup;
   this only swaps the hero image source so all three places show one consistent picture per article. */
(function () {
  'use strict';
  if (window.__oklaArticleHeroV1) return;
  if (!/^\/nase-novinky\/[^/]+\/?$/.test(location.pathname)) return; // single article, not the listing
  window.__oklaArticleHeroV1 = true;

  function ogImage() {
    var m = document.querySelector('meta[property="og:image"]');
    var src = m && m.getAttribute('content');
    if (!src) return '';
    // Never use the logo/favicon as a hero.
    if (/preforma-logo|favicon/i.test(src) || src.indexOf('/user/logos/') !== -1) return '';
    return src;
  }

  function apply() {
    var src = ogImage();
    if (!src) return false;
    var scope = document.querySelector('.okla-clanek') || document.querySelector('#content article') || document.querySelector('#content');
    if (!scope) return false;
    var imgs = scope.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.closest('.okla-clanek__aside')) continue;          // skip the product sidebar cards
      if (im.classList.contains('okla-clanek__card-img')) continue;
      // First content image = the hero. Point it at the shared article image.
      if (im.getAttribute('src') !== src) { im.removeAttribute('srcset'); im.setAttribute('src', src); }
      return true;
    }
    return false;
  }

  function start() {
    if (apply()) return;
    var tries = 0;
    var iv = setInterval(function () { if (apply() || ++tries > 20) clearInterval(iv); }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
