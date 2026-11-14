/* Desktop artwork lives inside the native Shoptet login and basket links.
   Legacy styles cannot move individual paths, text or the cart count. */
(function () {
  'use strict';
  var desktop = matchMedia('(min-width:992px)');
  var arrow = '<svg class="arrow" viewBox="0 0 19 12"><path d="M1 2.5 9.5 10 18 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* Account figure measured 1:1 from the reference header: a 12px head ring, a
     1px gap, then a 19px-wide arch with straight sides and a flat base — all
     drawn with a light 1.4px line (the old one was 2.1px and the head fused
     into the body). */
  var person = '<svg width="21" height="28" viewBox="0 0 21 28" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10.5" cy="6" r="5.3"/><path d="M1.7 26.7V22.5a8.8 8.8 0 0 1 17.6 0v4.2Z"/></svg>';
  // Both wheel centers, the basket and the badge share the same coordinate system.
  var basket = '<svg class="figure" width="36" height="44" viewBox="0 0 36 44"><path d="M1 8.5h2.3c1.9 0 2.6 1.4 3 3.5l3 14.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6.6 13.5H30l-2.4 11.2c-.3 1.4-1.3 2.3-3 2.3H12c-1.4 0-2.4-.8-2.8-2.2Z" fill="currentColor"/><g fill="currentColor"><circle cx="10.6" cy="32.5" r="3.5"/><circle cx="24.5" cy="32.5" r="3.5"/></g><g class="count"><circle cx="25" cy="11" r="10" fill="#2093d9"/><text x="25" y="11.4" text-anchor="middle" dominant-baseline="central" fill="white"></text></g></svg>';
  /* Typography and colours matched pixel-for-pixel to the reference header:
     Roboto 400 for the login label, Roboto 700 for the cart total and badge,
     neutral grey #7c7e8f, badge blue #2093d9, and the reference spacing. */
  var FONT = '"Open Sans",Arial,Helvetica,sans-serif';
  var style = '<style>.face{display:flex;align-items:center;height:44px;color:#7c7e8f;white-space:nowrap;font:400 16px/20px ' + FONT + ';letter-spacing:normal;text-transform:none;-webkit-font-smoothing:antialiased}.face svg{display:block;flex:none}.label{margin-left:9px;font:400 16px/20px ' + FONT + '}.arrow{margin-left:10px;width:19px;height:12px}.label+.arrow{margin-left:11px}.price{margin-left:4px;font:700 16px/20px ' + FONT + '}.count text{font:700 12px ' + FONT + '}.count[hidden]{display:none}</style>';
  /* Open Sans comes from okla_global_typography.css (the document's @font-face also reaches this shadow root). */

  function face(link, isCart) {
    var host = link.querySelector(':scope > okla-action-face');
    if (host) return host.shadowRoot;
    host = document.createElement('okla-action-face');
    var root = host.attachShadow({mode:'open'});
    root.innerHTML = style + '<span class="face">' + (isCart ? basket + '<span class="price"></span>' : person + '<span class="label"></span>') + arrow + '</span>';
    link.appendChild(host);
    link.setAttribute('data-action-face','');
    return root;
  }
  function setText(node, value) {
    if (node.textContent !== value) node.textContent = value;
  }
  function draw() {
    if (!desktop.matches) return;
    var row = document.querySelector('#header .header-top .navigation-buttons > .okla-exact-header');
    if (!row) return;
    var login = row.querySelector(':scope > .okla-header-account');
    var cart = row.querySelector(':scope > a.cart-count');
    if (!login || !cart) return;
    var label = login.querySelector('.okla-header-copy strong');
    var price = cart.querySelector('.cart-price');
    var badge = cart.querySelector(':scope > .okla-reference-cart-badge');
    var loginFace = face(login,false), cartFace = face(cart,true);
    setText(loginFace.querySelector('.label'), label ? label.textContent : login.getAttribute('aria-label') || '');
    setText(cartFace.querySelector('.price'), price ? price.textContent.trim() : '');
    var quantity = badge && !badge.hidden ? badge.textContent.trim() : '';
    var number = cartFace.querySelector('text');
    setText(number,quantity);
    number.style.fontSize = quantity.length > 2 ? '10px' : '12px';
    cartFace.querySelector('.count').toggleAttribute('hidden', !quantity || quantity === '0');
    document.documentElement.classList.add('okla-header-template103');
  }
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function(){ pending = false; draw(); });
  }
  function start() {
    var header = document.querySelector('#header');
    if (!header) return;
    new MutationObserver(schedule).observe(header,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});
    desktop.addEventListener('change',schedule);
    window.addEventListener('pageshow',schedule);
    draw();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
