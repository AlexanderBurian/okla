/* PC header, right side: account | orders, support, language | cart (okla_header_pro.css lays the row out as solid
   icons without backgrounds). The account and the cart keep Shoptet's own button and link (the login popup, the hover
   cart, the cart count); their look is drawn inside them (a shadow root, so no legacy style can reach it):
   - account: a grey round avatar, "Můj účet" and under it "Přihlásit se" (a guest) or "Můj přehled" (signed in), a chevron;
   - cart: the solid cart, its count on a red badge (the total is in its tooltip and label).
   The headset opens the support drop-down on hover or click (e-mail, contact form, delivery, returns, complaints, how
   to buy); the flag opens the language dialog (the same choice as the footer's "Jazyk webu"). */
(function () {
  'use strict';
  var desktop = matchMedia('(min-width:992px)');
  var FONT = '"Open Sans",Arial,Helvetica,sans-serif';
  var TEXT = {
    cs: {title: 'Můj účet', guest: 'Přihlásit se', member: 'Můj přehled', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu',
      support: 'Podpora', supportTitle: 'Jsme tu pro vás', supportLead: 'Napište nám, rádi poradíme s výběrem i s objednávkou.', form: 'Kontaktní formulář', shipping: 'Doprava a platba', returns: 'Vrácení zboží', complaint: 'Reklamace', howto: 'Jak nakupovat', copy: 'Zkopírovat e-mail', copied: 'Zkopírováno'},
    en: {title: 'My account', guest: 'Sign in', member: 'Overview', cart: 'Cart', orders: 'My orders', track: 'Order status', lang: 'Language',
      support: 'Support', supportTitle: 'We are here for you', supportLead: 'Write to us, we are glad to help with choosing and with your order.', form: 'Contact form', shipping: 'Delivery and payment', returns: 'Returns', complaint: 'Complaints', howto: 'How to buy', copy: 'Copy the e-mail address', copied: 'Copied'},
    sk: {title: 'Môj účet', guest: 'Prihlásiť sa', member: 'Môj prehľad', cart: 'Košík', orders: 'Moje objednávky', track: 'Stav objednávky', lang: 'Jazyk webu',
      support: 'Podpora', supportTitle: 'Sme tu pre vás', supportLead: 'Napíšte nám, radi poradíme s výberom aj s objednávkou.', form: 'Kontaktný formulár', shipping: 'Doprava a platba', returns: 'Vrátenie tovaru', complaint: 'Reklamácia', howto: 'Ako nakupovať', copy: 'Skopírovať e-mail', copied: 'Skopírované'},
    hu: {title: 'Fiókom', guest: 'Bejelentkezés', member: 'Áttekintés', cart: 'Kosár', orders: 'Rendeléseim', track: 'Rendelés állapota', lang: 'Nyelv',
      support: 'Ügyfélszolgálat', supportTitle: 'Itt vagyunk önnek', supportLead: 'Írjon nekünk, szívesen segítünk a választásban és a rendelésben.', form: 'Kapcsolatfelvételi űrlap', shipping: 'Szállítás és fizetés', returns: 'Visszaküldés', complaint: 'Reklamáció', howto: 'Hogyan vásároljon', copy: 'E-mail-cím másolása', copied: 'Másolva'}
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
      '.face{display:flex;align-items:center;height:44px;color:#0b2540;white-space:nowrap;font-family:' + FONT + ';-webkit-font-smoothing:antialiased}' +
      '.avatar{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#e6ebf2;color:var(--okla-ink,#0b2540);transition:color .15s ease}' +
      '.avatar svg{display:block;width:20px;height:20px}' +
      '.copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px}' +
      '.title{font:700 15px/19px ' + FONT + ';color:var(--okla-ink,#0b2540);transition:color .15s ease}' +
      '.sub{font:400 13px/18px ' + FONT + ';color:#0b2540}' +
      '.sub.member{color:#5b6b80}' +
      '.chev{display:block;flex:none;width:14px;height:9px;margin-left:16px;color:#8a95a5}' +
      '.chev svg{display:block;width:14px;height:9px}' +
      '</style>',
    cart: '<style>:host{display:block}' +
      '.face{display:flex;align-items:center;justify-content:center;width:40px;height:40px;color:var(--okla-ink,#0b2540);transition:color .15s ease}' +
      '.icon{position:relative;flex:none;width:28px;height:28px}' +
      '.icon svg{display:block;width:28px;height:28px}' +
      /* the count on a crisp red badge at the cart's top right corner */
      '.count{position:absolute;top:-5px;right:-7px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:#0859d8;color:#fff;box-shadow:0 0 0 2px #fff;font:700 10px/16px ' + FONT + ';text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums}' +
      '.count[hidden]{display:none}' +
      '</style>'
  };

  function face(link, isCart) {
    var host = link.querySelector(':scope > okla-action-face');
    if (host && host.shadowRoot && host.shadowRoot.querySelector('.face[data-v="6"]')) return host.shadowRoot;
    if (!host) {
      host = document.createElement('okla-action-face');
      host.attachShadow({mode: 'open'});
      link.appendChild(host);
    }
    host.shadowRoot.innerHTML = isCart
      ? STYLE.cart + '<span class="face" data-v="6"><span class="icon">' + basket + '<span class="count" hidden></span></span></span>'
      : STYLE.account + '<span class="face" data-v="6"><span class="avatar">' + person + '</span><span class="copy"><span class="title"></span><span class="sub"></span></span>' + chevron + '</span>';
    link.setAttribute('data-action-face', '');
    return host.shadowRoot;
  }
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }
  function setAttr(node, name, value) {
    if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
  }

  /* The headset: the support panel - the shop's help pages, then the e-mail. Sits between the orders and the flag. */
  /* a solid headset drawn on the same 24-unit grid and with the same weight as the orders clipboard beside it: a round
     headband, two full ear cups and a short microphone boom */
  var headset = '<svg class="okla-support-icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4.3 13v-1.5a7.7 7.7 0 0 1 15.4 0V13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>' +
    '<rect x="2" y="10.6" width="6.4" height="8.9" rx="2.6" fill="currentColor"/>' +
    '<rect x="15.6" y="10.6" width="6.4" height="8.9" rx="2.6" fill="currentColor"/>' +
    '<path d="M19.2 19.3a2.6 2.6 0 0 1-2.6 2.3h-2.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="9" y="20.1" width="5.4" height="3" rx="1.5" fill="currentColor"/></svg>';
  var arrow = '<svg class="okla-support-arrow" viewBox="0 0 8 12" aria-hidden="true"><path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* the e-mail row copies the address: a copy pictogram, and a tick while "Zkopírováno" shows */
  var copyIcon = '<svg class="okla-support-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>';
  var tickIcon = '<svg class="okla-support-copy" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var MAIL = 'podpora@okla.cz';
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
      document.body.appendChild(area);
      area.select();
      try { if (document.execCommand('copy')) resolve(); else reject(new Error('copy')); } catch (e) { reject(e); }
      area.remove();
    });
  }
  function copyMail(row, words) {
    if (!row || row.classList.contains('is-copied')) return;
    var label = row.querySelector('.okla-support-label');
    copyText(MAIL).then(function () {
      row.classList.add('is-copied');
      label.textContent = words.copied;
      row.querySelector('.okla-support-copy').outerHTML = tickIcon;
      setTimeout(function () {
        row.classList.remove('is-copied');
        label.textContent = MAIL;
        row.querySelector('.okla-support-copy').outerHTML = copyIcon;
      }, 1600);
    }).catch(function () { /* copying blocked: the address stays visible to select by hand */ });
  }
  function support(row, words) {
    var lang = (window.oklaLang && window.oklaLang.current) || document.documentElement.getAttribute('data-okla-lang') || 'cs';
    var box = row.querySelector(':scope > .okla-header-support');
    /* the phone layout empties the row into the header and a wider window builds a new row (okla_header_consistency.js)
       without the headset: the one left in the header comes back here instead of a second one being made */
    if (!box && row.parentNode) {
      box = row.parentNode.querySelector(':scope > .okla-header-support');
      if (box) row.insertBefore(box, row.querySelector(':scope > .okla-header-locale') || row.querySelector(':scope > a.cart-count'));
    }
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
      /* opens on hover (a short grace period lets the pointer travel into the panel) and on click / Enter */
      var timer = 0;
      var open = function (state) {
        clearTimeout(timer);
        box.classList.toggle('is-open', state);
        box.setAttribute('aria-expanded', state ? 'true' : 'false');
      };
      box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') open(true); });
      box.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(timer);
        timer = setTimeout(function () { open(false); }, 200);
      });
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
        '<span class="okla-support-links">' + links.map(function (l) { return '<a class="okla-support-link" role="menuitem" href="' + l[0] + '"><span class="okla-support-label"></span>' + arrow + '</a>'; }).join('') + '</span>' +
        /* the e-mail last: a click copies the address (no mail program opens) */
        '<span class="okla-support-mail" role="menuitem" tabindex="0"><span class="okla-support-label">' + MAIL + '</span>' + copyIcon + '</span>' +
      '</span>';
    box.querySelector('.okla-support-head').textContent = words.supportTitle;
    box.querySelector('.okla-support-lead').textContent = words.supportLead;
    var spans = box.querySelectorAll('.okla-support-link > .okla-support-label');
    for (var i = 0; i < spans.length; i++) spans[i].textContent = links[i][1];
    var mail = box.querySelector('.okla-support-mail');
    mail.setAttribute('title', words.copy);
    mail.setAttribute('aria-label', words.copy + ': ' + MAIL);
    mail.addEventListener('click', function () { copyMail(mail, words); });
    mail.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyMail(mail, words); }
    });
  }

  /* The flag: the current language. A click opens a small dialog in the middle of the page: the four languages as a
     list to pick from, and "Potvrdit / Confirm". */
  var dialog = null;
  function langDialog() {
    var api = window.oklaLang;
    if (!api) return;
    if (!dialog) {
      dialog = document.createElement('div');
      dialog.className = 'okla-langdlg';
      dialog.setAttribute('data-okla-i18n-skip', '');
      dialog.hidden = true;
      dialog.innerHTML = '<div class="okla-langdlg__shade"></div>' +
        '<div class="okla-langdlg__box" role="dialog" aria-modal="true" aria-labelledby="okla-langdlg-title">' +
          '<button type="button" class="okla-langdlg__close" aria-label="Zavřít / Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
          '<h2 class="okla-langdlg__title" id="okla-langdlg-title">Okla.cz – Jazyk / Language</h2>' +
          '<div class="okla-langdlg__list" role="radiogroup"></div>' +
          '<div class="okla-langdlg__foot"><button type="button" class="okla-langdlg__ok">Potvrdit / Confirm</button></div>' +
        '</div>';
      document.body.appendChild(dialog);
      var hide = function () { dialog.hidden = true; document.documentElement.classList.remove('okla-langdlg-open'); };
      dialog.querySelector('.okla-langdlg__shade').addEventListener('click', hide);
      dialog.querySelector('.okla-langdlg__close').addEventListener('click', hide);
      dialog.querySelector('.okla-langdlg__ok').addEventListener('click', function () {
        var picked = dialog.querySelector('input:checked');
        hide();
        if (picked && picked.value !== window.oklaLang.current) window.oklaLang.choose(picked.value);
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !dialog.hidden) hide(); });
    }
    var list = dialog.querySelector('.okla-langdlg__list');
    list.textContent = '';
    api.langs.forEach(function (code) {
      var row = document.createElement('label');
      row.className = 'okla-langdlg__opt';
      row.setAttribute('lang', code);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'okla-langdlg';
      input.value = code;
      input.checked = code === api.current;
      var name = document.createElement('span');
      name.textContent = api.label[code];
      row.append(input, api.flag(code), name);
      list.appendChild(row);
    });
    dialog.hidden = false;
    document.documentElement.classList.add('okla-langdlg-open');
    var current = list.querySelector('input:checked');
    if (current) current.focus({preventScroll: true});
  }
  function locale(row, words) {
    var box = row.querySelector(':scope > .okla-header-locale');
    var api = window.oklaLang;
    if (!box || !api || box.getAttribute('data-okla-lang-menu') === api.current) return;
    box.setAttribute('data-okla-lang-menu', api.current);
    box.setAttribute('data-okla-i18n-skip', '');
    box.setAttribute('role', 'button');
    box.setAttribute('tabindex', '0');
    box.setAttribute('aria-haspopup', 'dialog');
    box.setAttribute('aria-label', words.lang + ': ' + api.label[api.current]);
    box.title = words.lang;
    box.replaceChildren(api.flag(api.current));
    if (box.hasAttribute('data-okla-lang-bound')) return;
    box.setAttribute('data-okla-lang-bound', '');
    box.addEventListener('click', langDialog);
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); langDialog(); }
    });
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
