/* PC header, right side: account, orders, language and cart (okla_header_pro.css lays the row out).
   The account and the cart keep Shoptet's own button and link (the login popup, the hover cart, the cart count); their
   look is drawn inside them (a shadow root, so no legacy style can reach it):
   - account: a round avatar, "Můj účet" and under it "Přihlásit se" (a guest) or "Můj přehled" (signed in), a chevron;
   - cart: a solid blue button with the cart, its count on a white badge and the total ("Košík" while it is empty).
   The flag opens the language menu (the same choice as the footer's "Jazyk webu"). */
(function () {
  'use strict';
  var desktop = matchMedia('(min-width:992px)');
  var FONT = '"Open Sans",Arial,Helvetica,sans-serif';
  var TEXT = {
    cs: {title: 'Můj účet', guest: 'Přihlásit se', member: 'Můj přehled', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu'},
    en: {title: 'My account', guest: 'Sign in', member: 'Overview', cart: 'Cart', orders: 'My orders', track: 'Order status', lang: 'Language'},
    sk: {title: 'Môj účet', guest: 'Prihlásiť sa', member: 'Môj prehľad', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu'},
    hu: {title: 'Fiókom', guest: 'Bejelentkezés', member: 'Áttekintés', cart: 'Kosár', orders: 'Rendeléseim', track: 'Rendelés állapota', lang: 'Nyelv'}
  };
  function t() {
    var lang = window.OKLA_LANG || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    return TEXT[lang] || TEXT.cs;
  }
  var chevron = '<svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.75 6 6.25l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var person = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.2" r="3.9"/><path d="M4.6 20.2c.6-3.9 3.6-6.1 7.4-6.1s6.8 2.2 7.4 6.1"/></svg>';
  var basket = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.9 3.1h1.9c.8 0 1.5.55 1.66 1.33L5.8 6h14.5c.86 0 1.5.8 1.3 1.64l-1.45 6.27A3 3 0 0 1 17.23 16.3H9.6a3 3 0 0 1-2.92-2.33L4.62 4.95H1.9z" fill="currentColor"/><circle cx="9.6" cy="20" r="1.75" fill="currentColor"/><circle cx="17.2" cy="20" r="1.75" fill="currentColor"/></svg>';
  var STYLE = {
    account: '<style>:host{display:block}' +
      '.face{display:flex;align-items:center;gap:11px;height:52px;padding:0 12px 0 6px;border-radius:14px;background:var(--okla-face-bg,transparent);transition:background-color .16s ease;color:#0b2540;white-space:nowrap;font-family:' + FONT + ';-webkit-font-smoothing:antialiased}' +
      '.avatar{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--okla-avatar-bg,#eaf1fd);color:#0859d8;transition:background-color .16s ease,color .16s ease}' +
      '.avatar svg{display:block;width:22px;height:22px}' +
      '.copy{display:flex;flex-direction:column;align-items:flex-start;gap:1px}' +
      '.title{font:700 15px/19px ' + FONT + ';letter-spacing:-.005em;color:#0b2540}' +
      '.sub{font:600 13px/17px ' + FONT + ';color:#0859d8}' +
      '.sub.member{color:#5b6b80}' +
      '.chev{display:block;flex:none;width:12px;height:8px;margin-left:3px;color:#8593a6;transition:transform .2s ease}' +
      '</style>',
    cart: '<style>:host{display:block}' +
      '.face{display:flex;align-items:center;gap:12px;height:48px;padding:0 18px 0 15px;border-radius:12px;background:var(--okla-face-bg,#0859d8);transition:background-color .16s ease;color:#fff;white-space:nowrap;font-family:' + FONT + ';-webkit-font-smoothing:antialiased;box-shadow:0 6px 16px -8px rgba(8,89,216,.75)}' +
      '.icon{position:relative;flex:none;width:24px;height:24px}' +
      '.icon svg{display:block;width:24px;height:24px}' +
      '.count{position:absolute;top:-9px;right:-11px;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;background:#fff;color:#0859d8;box-shadow:0 0 0 2px var(--okla-face-bg,#0859d8);font:800 11.5px/20px ' + FONT + ';text-align:center;transition:box-shadow .16s ease}' +
      '.count[hidden]{display:none}' +
      '.price{font:700 15px/1 ' + FONT + ';letter-spacing:-.005em;font-variant-numeric:tabular-nums}' +
      '</style>'
  };

  function face(link, isCart) {
    var host = link.querySelector(':scope > okla-action-face');
    if (host && host.shadowRoot && host.shadowRoot.querySelector('.face[data-v="2"]')) return host.shadowRoot;
    if (!host) {
      host = document.createElement('okla-action-face');
      host.attachShadow({mode: 'open'});
      link.appendChild(host);
    }
    host.shadowRoot.innerHTML = isCart
      ? STYLE.cart + '<span class="face" data-v="2"><span class="icon">' + basket + '<span class="count" hidden></span></span><span class="price"></span></span>'
      : STYLE.account + '<span class="face" data-v="2"><span class="avatar">' + person + '</span><span class="copy"><span class="title"></span><span class="sub"></span></span>' + chevron + '</span>';
    link.setAttribute('data-action-face', '');
    return host.shadowRoot;
  }
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }
  function setAttr(node, name, value) {
    if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
  }

  /* The flag: the current language, and the menu of all four. */
  function locale(row, words) {
    var box = row.querySelector(':scope > .okla-header-locale');
    var api = window.oklaLang;
    if (!box || !api || box.getAttribute('data-okla-lang-menu') === api.current) return;
    box.setAttribute('data-okla-lang-menu', api.current);
    box.setAttribute('data-okla-i18n-skip', '');
    box.setAttribute('role', 'button');
    box.setAttribute('tabindex', '0');
    box.setAttribute('aria-haspopup', 'true');
    box.setAttribute('aria-expanded', 'false');
    box.setAttribute('aria-label', words.lang + ': ' + api.label[api.current]);
    box.title = words.lang;
    box.replaceChildren(api.flag(api.current));
    var menu = document.createElement('span');
    menu.className = 'okla-lang-menu';
    menu.setAttribute('role', 'menu');
    api.langs.forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'okla-lang-option' + (code === api.current ? ' is-current' : '');
      b.setAttribute('role', 'menuitem');
      b.setAttribute('lang', code);
      b.appendChild(api.flag(code));
      var s = document.createElement('span');
      s.textContent = api.label[code];
      b.appendChild(s);
      b.addEventListener('click', function (e) { e.stopPropagation(); close(); api.choose(code); });
      menu.appendChild(b);
    });
    box.appendChild(menu);
    function open(state) {
      box.classList.toggle('is-open', state);
      box.setAttribute('aria-expanded', state ? 'true' : 'false');
    }
    function close() { open(false); }
    box.addEventListener('click', function (e) {
      if (menu.contains(e.target)) return;
      open(!box.classList.contains('is-open'));
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(!box.classList.contains('is-open')); }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function draw() {
    if (!desktop.matches) return;
    var row = document.querySelector('#header .header-top .navigation-buttons > .okla-exact-header');
    if (!row) return;
    var login = row.querySelector(':scope > .okla-header-account');
    var cart = row.querySelector(':scope > a.cart-count');
    if (!login || !cart) return;
    var words = t();
    var guest = !!document.querySelector('#navigation a[data-testid="signin"],.top-navigation-bar .top-nav-button-login');
    var a = face(login, false), c = face(cart, true);
    setText(a.querySelector('.title'), words.title);
    var sub = a.querySelector('.sub');
    setText(sub, guest ? words.guest : words.member);
    sub.classList.toggle('member', !guest);
    setAttr(login, 'aria-label', words.title + ' – ' + (guest ? words.guest : words.member));

    var price = cart.querySelector('.cart-price');
    var badge = cart.querySelector(':scope > .okla-reference-cart-badge');
    var quantity = badge && !badge.hidden ? badge.textContent.trim() : '';
    if (quantity === '0') quantity = '';
    var total = price ? price.textContent.replace(/\s+/g, ' ').trim() : '';
    var empty = !quantity || /^0(\s|$)/.test(total);
    setText(c.querySelector('.price'), empty || !total ? words.cart : total);
    var count = c.querySelector('.count');
    setText(count, quantity);
    count.toggleAttribute('hidden', !quantity);
    setAttr(cart, 'aria-label', words.cart + (empty ? '' : ' – ' + quantity + ' ks, ' + total));

    /* orders: a guest finds an order by its number, a customer gets the list */
    var orders = row.querySelector(':scope > .okla-header-orders');
    if (orders) {
      setAttr(orders, 'href', guest ? '/stav-objednavky/' : '/klient/objednavky/');
      setAttr(orders, 'title', guest ? words.track : words.orders);
      setAttr(orders, 'aria-label', guest ? words.track : words.orders);
    }
    locale(row, words);
    document.documentElement.classList.add('okla-header-template103');
  }
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; draw(); });
  }
  function start() {
    var header = document.querySelector('#header');
    if (!header) return;
    new MutationObserver(schedule).observe(header, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'href']});
    desktop.addEventListener('change', schedule);
    window.addEventListener('pageshow', schedule);
    draw();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
