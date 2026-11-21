/* Okla – PC left column: "Top 10 produktů" only when there is room for it. The box shows only if the content on the
   right reaches at least as far down as the whole left column with the box in it; on a short page (a category with a
   few products) it is left out, so the left column never runs on below the content. Checked again whenever the content
   or the column changes size (pictures arriving, a filter, the window). Phones are left as they are. */
(function () {
  'use strict';
  if (window.__oklaSidebarTop10) return;
  window.__oklaSidebarTop10 = true;
  var PC = window.matchMedia('(min-width:992px)');
  var boxH = 0, queued = false;

  function check() {
    queued = false;
    var side = document.querySelector('aside.sidebar');
    var box = side && side.querySelector('.box-topProducts');
    var main = document.querySelector('main#content') || document.getElementById('content');
    if (!side || !box || !main) return;
    var shown = box.style.getPropertyValue('display') !== 'none';
    if (!PC.matches) { if (!shown) box.style.removeProperty('display'); return; }
    /* the box's height with its gap, measured while it is shown - on screen, like the positions below (the PC page is
       zoomed, so the CSS margins are scaled by the same factor) */
    if (shown && box.offsetHeight) {
      var cs = getComputedStyle(box), h = box.getBoundingClientRect().height, k = h / box.offsetHeight;
      boxH = h + ((parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0)) * k;
    }
    /* the column's own content (the aside itself stretches to the island's height) */
    var inner = side.querySelector('.sidebar-inner') || side;
    var sideBottom = inner.getBoundingClientRect().bottom + (shown ? 0 : boxH);
    var contentBottom = main.getBoundingClientRect().bottom;
    var fits = sideBottom <= contentBottom + 1;
    if (fits && !shown) box.style.removeProperty('display');
    else if (!fits && shown) box.style.setProperty('display', 'none', 'important');
  }
  function soon() { if (!queued) { queued = true; requestAnimationFrame(check); } }

  function start() {
    check();
    var side = document.querySelector('aside.sidebar'), main = document.querySelector('main#content') || document.getElementById('content');
    if (!side || !main) return;
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(soon);
      ro.observe(main);
      var inner = side.querySelector('.sidebar-inner') || side;
      [].forEach.call(inner.children, function (c) { if (!c.classList.contains('box-topProducts')) ro.observe(c); });
    }
    window.addEventListener('resize', soon);
    window.addEventListener('load', soon);
    if (PC.addEventListener) PC.addEventListener('change', soon);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
