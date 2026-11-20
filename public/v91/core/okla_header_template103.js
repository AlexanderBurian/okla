/* PC header, right side: account, support, orders, language and cart (okla_header_pro.css lays the row out as
   separate soft tiles). The account and the cart keep Shoptet's own button and link (the login popup, the hover cart,
   the cart count); their look is drawn inside them (a shadow root, so no legacy style can reach it):
   - account: a small round avatar, "Můj účet" and under it "Přihlásit se" (a guest) or "Můj přehled" (signed in), a chevron;
   - cart: the cart on the OKLA blue tile, its count on a small yellow price tag (the total is in its tooltip and label).
   The headset opens the support panel (e-mail, contact form, delivery, returns, complaints, how to buy); the flag opens
   the language menu (the same choice as the footer's "Jazyk webu"). */
(function () {
  'use strict';
  var desktop = matchMedia('(min-width:992px)');
  var FONT = '"Open Sans",Arial,Helvetica,sans-serif';
  var TEXT = {
    cs: {title: 'Můj účet', guest: 'Přihlásit se', member: 'Můj přehled', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu',
      support: 'Podpora', supportTitle: 'Jsme tu pro vás', supportLead: 'Napište nám, rádi poradíme s výběrem i s objednávkou.', form: 'Kontaktní formulář', shipping: 'Doprava a platba', returns: 'Vrácení zboží', complaint: 'Reklamace', howto: 'Jak nakupovat'},
    en: {title: 'My account', guest: 'Sign in', member: 'Overview', cart: 'Cart', orders: 'My orders', track: 'Order status', lang: 'Language',
      support: 'Support', supportTitle: 'We are here for you', supportLead: 'Write to us, we are glad to help with choosing and with your order.', form: 'Contact form', shipping: 'Delivery and payment', returns: 'Returns', complaint: 'Complaints', howto: 'How to buy'},
    sk: {title: 'Môj účet', guest: 'Prihlásiť sa', member: 'Môj prehľad', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu',
      support: 'Podpora', supportTitle: 'Sme tu pre vás', supportLead: 'Napíšte nám, radi poradíme s výberom aj s objednávkou.', form: 'Kontaktný formulár', shipping: 'Doprava a platba', returns: 'Vrátenie tovaru', complaint: 'Reklamácia', howto: 'Ako nakupovať'},
    hu: {title: 'Fiókom', guest: 'Bejelentkezés', member: 'Áttekintés', cart: 'Kosár', orders: 'Rendeléseim', track: 'Rendelés állapota', lang: 'Nyelv',
      support: 'Ügyfélszolgálat', supportTitle: 'Itt vagyunk önnek', supportLead: 'Írjon nekünk, szívesen segítünk a választásban és a rendelésben.', form: 'Kapcsolatfelvételi űrlap', shipping: 'Szállítás és fizetés', returns: 'Visszaküldés', complaint: 'Reklamáció', howto: 'Hogyan vásároljon'}
  };
  function t() {
    var lang = window.OKLA_LANG || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    return TEXT[lang] || TEXT.cs;
  }
  /* in a span: the sticky header's compact style resizes any svg sitting directly in the face */
  var chevron = '<span class="chev"><svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.75 6 6.25l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  /* solid figures, like the orders icon and the cart beside them */
  var person = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12.2a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2Zm0 1.9c-4.6 0-8.2 2.4-8.2 5.6v.5c0 .66.54 1.2 1.2 1.2h14c.66 0 1.2-.54 1.2-1.2v-.5c0-3.2-3.6-5.6-8.2-5.6Z"/></svg>';
  var basket = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.9 3.1h1.9c.8 0 1.5.55 1.66 1.33L5.8 6h14.5c.86 0 1.5.8 1.3 1.64l-1.45 6.27A3 3 0 0 1 17.23 16.3H9.6a3 3 0 0 1-2.92-2.33L4.62 4.95H1.9z" fill="currentColor"/><circle cx="9.6" cy="20" r="1.75" fill="currentColor"/><circle cx="17.2" cy="20" r="1.75" fill="currentColor"/></svg>';
  /* --okla-ink (set by okla_header_pro.css on hover) colours the figure and the title; nothing gets a background */
  var STYLE = {
    account: '<style>:host{display:block}' +
      '.face{display:flex;align-items:center;height:40px;color:#0b2540;white-space:nowrap;font-family:' + FONT + ';-webkit-font-smoothing:antialiased}' +
      '.avatar{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(11,37,64,.12);color:var(--okla-ink,#0b2540);transition:color .15s ease}' +
      '.avatar svg{display:block;width:20px;height:20px}' +
      '.copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px}' +
      '.title{font:600 15px/19px ' + FONT + ';color:var(--okla-ink,#0b2540);transition:color .15s ease}' +
      '.sub{font:400 13px/17px ' + FONT + ';color:#0859d8}' +
      '.sub.member{color:#5b6b80}' +
      '.chev{display:block;flex:none;width:12px;height:8px;margin-left:14px;color:#7d8899}' +
      '.chev svg{display:block;width:12px;height:8px}' +
      '</style>',
    cart: '<style>:host{display:block}' +
      '.face{display:flex;align-items:center;justify-content:center;width:44px;height:44px;color:#fff}' +
      '.icon{position:relative;flex:none;width:24px;height:24px}' +
      '.icon svg{display:block;width:24px;height:24px}' +
      /* the count on a small yellow price tag with its punched hole (the shop's tag motif), slightly tilted */
      '.count{position:absolute;top:-17px;left:12px;min-width:16px;height:19px;padding:0 6px 0 11px;box-sizing:content-box;background:#ffd800;color:#0b2540;font:800 11px/19px ' + FONT + ';text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;clip-path:polygon(7px 0,100% 0,100% 100%,7px 100%,0 50%);border-radius:0 4px 4px 0;transform:rotate(-8deg);transform-origin:0 50%;filter:drop-shadow(0 1px 1px rgba(11,37,64,.25))}' +
      '.count::before{content:"";position:absolute;left:6px;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:50%;background:#0859d8}' +
      '.count[hidden]{display:none}' +
      '</style>'
  };

  function face(link, isCart) {
    var host = link.querySelector(':scope > okla-action-face');
    if (host && host.shadowRoot && host.shadowRoot.querySelector('.face[data-v="5"]')) return host.shadowRoot;
    if (!host) {
      host = document.createElement('okla-action-face');
      host.attachShadow({mode: 'open'});
      link.appendChild(host);
    }
    host.shadowRoot.innerHTML = isCart
      ? STYLE.cart + '<span class="face" data-v="5"><span class="icon">' + basket + '<span class="count" hidden></span></span></span>'
      : STYLE.account + '<span class="face" data-v="5"><span class="avatar">' + person + '</span><span class="copy"><span class="title"></span><span class="sub"></span></span>' + chevron + '</span>';
    link.setAttribute('data-action-face', '');
    return host.shadowRoot;
  }
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }
  function setAttr(node, name, value) {
    if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
  }

  /* The headset: the support panel - the e-mail first, then the shop's help pages. Sits between the orders and the flag. */
  var headset = '<svg class="okla-support-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5a8.5 8.5 0 0 0-8.5 8.5v5.6a2.9 2.9 0 0 0 2.9 2.9h1.4c.66 0 1.2-.54 1.2-1.2v-5.6c0-.66-.54-1.2-1.2-1.2H5.9V11a6.1 6.1 0 0 1 12.2 0v.5h-1.9c-.66 0-1.2.54-1.2 1.2v5.6c0 .66.54 1.2 1.2 1.2h1.9a1.4 1.4 0 0 1-1.4 1.3h-2.9a1.1 1.1 0 1 0 0 2.2h2.9a3.6 3.6 0 0 0 3.6-3.6V11A8.5 8.5 0 0 0 12 2.5Z"/></svg>';
  var mailIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5.1 8-5.1V7Zm16 2.8-7.5 4.8a1 1 0 0 1-1 0L4 9.8V17h16Z"/></svg>';
  var arrow = '<svg class="okla-support-arrow" viewBox="0 0 8 12" aria-hidden="true"><path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function support(row, words) {
    var lang = (window.oklaLang && window.oklaLang.current) || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    var box = row.querySelector(':scope > .okla-header-support');
    if (box && box.getAttribute('data-lang') === lang) return;
    if (!box) {
      box = document.createElement('span');
      box.className = 'okla-header-support';
      box.setAttribute('role', 'button');
      box.setAttribute('tabindex', '0');
      box.setAttribute('aria-haspopup', 'true');
      box.setAttribute('aria-expanded', 'false');
      box.setAttribute('data-okla-i18n-skip', '');
      var before = row.querySelector(':scope > .okla-header-locale') || row.querySelector(':scope > a.cart-count');
      row.insertBefore(box, before);
      var open = function (state) {
        box.classList.toggle('is-open', state);
        box.setAttribute('aria-expanded', state ? 'true' : 'false');
      };
      box.addEventListener('click', function (e) {
        var menu = box.querySelector('.okla-support-menu');
        if (menu && menu.contains(e.target)) return;
        open(!box.classList.contains('is-open'));
      });
      box.addEventListener('keydown', function (e) {
        if (e.target !== box) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(!box.classList.contains('is-open')); }
      });
      document.addEventListener('click', function (e) { if (!box.contains(e.target)) open(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    }
    box.setAttribute('data-lang', lang);
    box.setAttribute('aria-label', words.support);
    box.title = words.support;
    var links = [['/kontakt/', words.form], ['/doprava-a-platba/', words.shipping], ['/vraceni-zbozi-a-odstoupeni/', words.returns], ['/reklamacni-rad/', words.complaint], ['/jak-nakupovat/', words.howto]];
    box.innerHTML = headset +
      '<span class="okla-support-menu" role="menu">' +
        '<span class="okla-support-head"></span><span class="okla-support-lead"></span>' +
        '<a class="okla-support-mail" role="menuitem" href="mailto:podpora@okla.cz">' + mailIcon + '<span class="okla-support-label">podpora@okla.cz</span></a>' +
        '<span class="okla-support-links">' + links.map(function (l) { return '<a class="okla-support-link" role="menuitem" href="' + l[0] + '"><span class="okla-support-label"></span>' + arrow + '</a>'; }).join('') + '</span>' +
      '</span>';
    box.querySelector('.okla-support-head').textContent = words.supportTitle;
    box.querySelector('.okla-support-lead').textContent = words.supportLead;
    var spans = box.querySelectorAll('.okla-support-link > .okla-support-label');
    for (var i = 0; i < spans.length; i++) spans[i].textContent = links[i][1];
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
    var count = c.querySelector('.count');
    setText(count, quantity);
    count.toggleAttribute('hidden', !quantity);
    setAttr(cart, 'aria-label', words.cart + (empty ? '' : ' – ' + quantity + ' ks, ' + total));
    setAttr(cart, 'title', empty ? words.cart : words.cart + ': ' + total);

    /* orders: a guest finds an order by its number, a customer gets the list */
    var orders = row.querySelector(':scope > .okla-header-orders');
    if (orders) {
      setAttr(orders, 'href', guest ? '/stav-objednavky/' : '/klient/objednavky/');
      setAttr(orders, 'title', guest ? words.track : words.orders);
      setAttr(orders, 'aria-label', guest ? words.track : words.orders);
    }
    support(row, words);
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
