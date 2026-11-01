import {
  appendChatTime,
  DeliveryReceiptController,
  installImageFallback,
  resolveRobotAssetUrl,
  TypingIndicatorController
} from "./chat-ui.js";

(() => {
  const tagName = "okla-ai-chat";
  if (document.querySelector(tagName)) return;
  const preview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const shoppingPage = document.body.matches(".type-index, .type-category, .type-detail, .type-search, .type-manufacturer")
    || !!document.querySelector("#content .p-detail");
  const excludedPage = document.body.matches(".ordering-process, .in-kontakty, .type-cart")
    || /^\/(?:kosik|objednavka|objednavky|kontakt|kontakty|cart|checkout)(?:\/|$)/i.test(window.location.pathname);
  if (excludedPage || (!preview && !shoppingPage)) return;

  const ownScript = document.currentScript as HTMLScriptElement | null;
  const apiBase = (ownScript?.dataset.apiUrl || (ownScript?.src ? new URL(ownScript.src).origin : "")).replace(/\/$/, "");
  const assetOptions = {
    scriptSrc: ownScript?.src,
    apiUrl: ownScript?.dataset.apiUrl || apiBase,
    assetBaseUrl: ownScript?.dataset.assetBaseUrl,
    locationOrigin: window.location.origin
  };
  const assetUrl = resolveRobotAssetUrl(assetOptions);
  let teardown = () => undefined;

  if (!customElements.get(tagName)) {
    customElements.define(tagName, class extends HTMLElement {
      disconnectedCallback() { teardown(); }
    });
  }

  const host = document.createElement(tagName);
  const shadow = host.attachShadow({ mode: "open" });
  document.body.append(host);

  const infoIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6M12 7.5v.5"/></svg>`;
  const expandIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>`;
  const collapseIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6.5 9 5.5 5.5L17.5 9"/></svg>`;
  const sendIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>`;
  const chatIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.5 6A2.5 2.5 0 0 1 5 3.5h7A2.5 2.5 0 0 1 14.5 6v3A2.5 2.5 0 0 1 12 11.5H7.2L4 14.2A.55.55 0 0 1 3 13.8V11.4A2.5 2.5 0 0 1 2.5 9V6z"/><path d="M16 8.5h3A2.5 2.5 0 0 1 21.5 11v3a2.5 2.5 0 0 1-2 2.45V19a.55.55 0 0 1-.9.43L15.3 17H13a2.5 2.5 0 0 1-2.45-2H12A4 4 0 0 0 16 11v-2.5z"/></svg>`;

  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        --okla-navy: #0d315f;
        --okla-blue: #255b9b;
        --okla-purple: #6456d9;
        --okla-purple-strong: #5748c7;
        --okla-purple-soft: #ece9fb;
        --okla-logo: linear-gradient(145deg, #2742ad 0%, #5137b4 55%, #7e2fa0 100%);
        --okla-text: #102f55;
        --okla-line: #d2deec;
        --okla-soft: #f3f6fa;
        font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
        font-synthesis: none;
      }
      *, *::before, *::after { box-sizing: border-box; }
      button, textarea { font: inherit; }
      button { -webkit-tap-highlight-color: transparent; }
      .panel {
        position: fixed;
        z-index: 2147483000;
        right: max(22px, env(safe-area-inset-right));
        bottom: max(14px, env(safe-area-inset-bottom));
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        width: min(422px, calc(100vw - 20px));
        height: min(698px, calc(100dvh - 104px));
        min-height: 360px;
        overflow: hidden;
        color: var(--okla-text);
        background: #fff;
        border: 1px solid #c9d7e8;
        border-radius: 15px;
        box-shadow: 0 22px 56px rgba(24, 53, 91, .2), 0 4px 14px rgba(24, 53, 91, .08);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateY(16px) scale(.975);
        transform-origin: bottom right;
        transition: opacity .22s ease, transform .32s cubic-bezier(.16, 1, .3, 1), visibility 0s linear .32s;
      }
      .panel.open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0) scale(1);
        transition: opacity .2s ease, transform .32s cubic-bezier(.16, 1, .3, 1), visibility 0s;
      }
      .panel.expanded { width: min(520px, calc(100vw - 20px)); }
      .topbar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 0;
        padding: 10px 12px;
        color: var(--okla-navy);
        background: #fff;
        border-bottom: 1px solid var(--okla-line);
      }
      .topbar-group { display: flex; align-items: center; gap: 2px; }
      .brand-mini {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 34px;
        height: 34px;
        background: transparent;
        transform: translate(-50%, -50%);
        display: none;
      }
      .panel.chatting .brand-mini { display: block; }
      .brand-mini img, .launcher img, .assistant-avatar img { width: 100%; height: 100%; object-fit: contain; display: block; }
      .launcher .launcher-search-icon { display: none; width: 28px; height: 28px; margin: auto; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
      .launcher .launcher-desktop-icon { display: block; }
      .top-action {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        color: #55647d;
        border: 0;
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
      }
      .top-action:hover { background: rgba(13, 49, 95, .07); }
      .top-action svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.85; stroke-linecap: round; stroke-linejoin: round; }
      .messages {
        min-height: 0;
        overflow: auto;
        overscroll-behavior: contain;
        padding: 0 20px;
        background: #fff;
        scrollbar-width: thin;
        scrollbar-color: #bdcada transparent;
      }
      .welcome { display: flex; min-height: 100%; flex-direction: column; padding: 52px 0 8px; }
      .welcome-brand { display: flex; align-items: center; justify-content: center; gap: 10px; }
      .welcome-logo {
        position: relative;
        width: 74px;
        height: 74px;
        flex: none;
        background: transparent;
      }
      .welcome-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
      .welcome-logo.robot-fallback::after { content: "OK"; position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 15px; font-weight: 800; }
      .welcome-title { margin: 18px 0 0; text-align: center; color: #15181d; font-size: 25px; line-height: 1.05; font-weight: 820; letter-spacing: -.025em; }
      .welcome-input { margin-top: 24px; }
      .welcome-input .composer { border-color: #e4e9f1; box-shadow: 0 1px 3px rgba(16, 40, 80, .05); }
      .welcome-input .composer:focus-within { border-color: var(--okla-blue); box-shadow: 0 1px 3px rgba(16, 40, 80, .05); }
      .suggestions { margin-top: 12px; }
      .suggestions-list { display: flex; flex-direction: column; }
      .suggested {
        display: flex;
        align-items: center;
        gap: 13px;
        width: 100%;
        padding: 16px 4px;
        color: #1b2740;
        text-align: left;
        border: 0;
        border-top: 1px solid #edf1f6;
        background: transparent;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.3;
        border-radius: 10px;
        transition: color .14s ease, background-color .14s ease;
      }
      .suggested:first-child { border-top: 0; }
      .suggested svg { width: 22px; height: 22px; flex: none; color: #1b2740; fill: currentColor; stroke: none; transition: color .14s ease; }
      .suggested:hover { color: var(--okla-purple); }
      .suggested:hover svg { color: var(--okla-purple); }
      .conversation { padding-top: 20px; padding-bottom: 18px; }
      .message-row { display: flex; align-items: flex-start; gap: 9px; margin: 0 0 11px; animation: message-in .22s ease both; }
      .message-row.user { justify-content: flex-end; }
      .message-row.assistant { align-items: flex-end; margin-left: -16px; }
      .message-stack { display: flex; max-width: 84%; flex-direction: column; align-items: flex-end; }
      .assistant-stack { align-items: flex-start; }
      .assistant-avatar { position: relative; width: 30px; height: 30px; flex: 0 0 30px; background: transparent; }
      .bubble {
        min-height: 46px;
        max-width: 84%;
        padding: 12px 14px;
        color: #183758;
        border: 1px solid #e0e7f0;
        border-radius: 13px 13px 13px 4px;
        background: var(--okla-soft);
        font-size: 14px;
        line-height: 1.5;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
      }
      .user .bubble { max-width: 100%; min-height: 0; color: #fff; border-color: var(--okla-purple-strong); border-radius: 13px 4px 13px 13px; background: linear-gradient(135deg, var(--okla-blue), var(--okla-purple)); }
      .assistant-stack .bubble { max-width: 100%; }
      .bubble a { color: #15599f; font-weight: 700; text-decoration: underline; text-underline-offset: 2px; }
      .bubble strong { font-weight: 720; color: #0f2d52; }
      .bubble .md-par { white-space: pre-wrap; }
      .bubble .md-par + .md-list, .bubble .md-list + .md-par { margin-top: 7px; }
      .bubble .md-list { margin: 4px 0 0; padding-left: 20px; }
      .bubble .md-list li { margin: 3px 0; white-space: normal; }
      .delivery-slot { display: flex; width: 100%; height: 20px; align-items: flex-start; justify-content: flex-end; gap: 4px; padding: 4px 3px 0 0; color: #7b838e; font-size: 10.5px; line-height: 14px; white-space: nowrap; opacity: 0; transition: opacity .15s ease; }
      .delivery-slot.visible { opacity: 1; }
      .receipt-check { color: #687482; font-size: 12px; line-height: 13px; }
      .delivery-slot time, .assistant-time { font-variant-numeric: tabular-nums; }
      .assistant-time-slot { width: 100%; height: 18px; padding-top: 4px; color: #7b838e; font-size: 10.5px; line-height: 14px; text-align: left; }
      .assistant-time { display: block; }
      .typing-row { display: flex; height: 25px; align-items: center; gap: 8px; margin: -2px 0 11px; padding-left: 39px; color: #747b86; font-size: 11.5px; line-height: 16px; animation: message-in .18s ease both; }
      .typing-dots { display: inline-flex; width: 31px; flex: 0 0 31px; align-items: center; gap: 5px; }
      .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--okla-purple); animation: typing-pulse 1.05s infinite ease-in-out; }
      .typing-dot:nth-child(2) { animation-delay: .14s; }
      .typing-dot:nth-child(3) { animation-delay: .28s; }
      .typing-label { white-space: nowrap; }
      .composer-area { height: 139px; padding: 0 20px; background: #fff; border: 0; }
      .composer {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 36px;
        align-items: end;
        gap: 9px;
        width: 100%;
        height: 95px;
        padding: 10px 11px 12px 20px;
        border: 1px solid #6f91bd;
        border-radius: 8px;
        background: #fff;
        box-shadow: none;
        transition: border-color .16s ease;
      }
      .composer:focus-within { border-color: var(--okla-blue); box-shadow: none; }
      textarea {
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        height: 72px;
        min-height: 72px;
        max-height: 72px;
        resize: none;
        overflow: auto;
        padding: 5px 0;
        color: var(--okla-text);
        border: 0 !important;
        outline: 0 !important;
        box-shadow: none !important;
        background: transparent;
        font-size: 14px;
        line-height: 1.45;
      }
      textarea:focus, textarea:focus-visible { border: 0 !important; outline: 0 !important; box-shadow: none !important; }
      textarea::placeholder { color: #7a899d; opacity: 1; }
      .send {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        color: #fff;
        border: 0;
        border-radius: 50%;
        background: var(--okla-blue);
        cursor: pointer;
        transition: background-color .16s ease, opacity .16s ease;
      }
      .composer:focus-within .send:not(:disabled), .send:hover:not(:disabled) { background: #174b88; }
      .send:disabled { color: #fff; background: var(--okla-blue); opacity: .38; cursor: default; }
      .send svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
      .disclaimer { height: 14px; margin: 12px 0 0; color: #75869a; text-align: center; font-size: 10.5px; line-height: 14px; white-space: nowrap; }
      .launcher {
        position: fixed;
        z-index: 2147483001;
        right: max(22px, env(safe-area-inset-right));
        bottom: max(14px, env(safe-area-inset-bottom));
        width: 58px;
        height: 58px;
        padding: 10px;
        overflow: hidden;
        border: 1px solid #eceff4;
        border-radius: 50%;
        background: linear-gradient(145deg, #2742ad 0%, #5137b4 55%, #7e2fa0 100%);
        color: #fff;
        box-shadow: 0 10px 28px rgba(40, 33, 120, .22), 0 2px 8px rgba(40, 33, 120, .12);
        cursor: pointer;
        transition: box-shadow .2s ease;
      }
      .launcher:hover { box-shadow: 0 13px 32px rgba(25, 54, 99, .28), 0 3px 9px rgba(25, 54, 99, .16); }
      .launcher:active { box-shadow: 0 6px 18px rgba(25, 54, 99, .22); }
      .panel.open + .launcher { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .16s ease, visibility 0s linear .16s; }
      .launcher img { border-radius: 50%; }
      .robot-fallback::after { content: "OK"; position: absolute; inset: 0; display: grid; place-items: center; color: var(--okla-purple); font-size: 11px; font-weight: 800; letter-spacing: .04em; }
      .mobile-glyph-fallback::after { content: "OK"; position: absolute; inset: 0; display: none; place-items: center; color: #fff; font-size: 15px; font-weight: 800; letter-spacing: .04em; }
      .brand-avatar.robot-fallback::after { font-size: 12px; }
      .launcher:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid #8bb4e2; outline-offset: 3px; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      @keyframes typing-pulse { 0%, 60%, 100% { opacity: .32; transform: scale(.82); } 30% { opacity: 1; transform: scale(1); } }
      @keyframes message-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      @media (max-width: 466px) {
        .launcher {
          left: -17.1px;
          right: auto;
          top: clamp(110px, 73dvh, calc(100dvh - 110px));
          bottom: auto;
          width: 39.6px;
          height: 70.2px;
          border: 1.8px solid #fff;
          border-radius: 0 20.7px 20.7px 0;
          padding: 5px;
          background: linear-gradient(160deg, #254daa 4%, #38369c 50%, #6d2d96 100%);
          color: #fff;
          box-shadow: 3.5px 5px 12px rgba(22, 25, 72, .3);
          transform: translateY(-50%);
          transform-origin: center;
          transition: opacity .18s ease, transform .18s ease, visibility 0s, box-shadow .18s ease;
        }
        .launcher:hover {
          border-color: #fff;
          box-shadow: 3px 5.5px 12px rgba(10, 25, 58, .32);
          transform: translateY(-50%);
        }
        .launcher:focus-visible {
          border-color: #fff;
          outline: 3px solid #9b8df1;
          outline-offset: 3px;
          transform: translateY(-50%);
        }
        .launcher:active {
          border-color: #fff;
          transform: translateY(-50%);
        }
        .launcher .launcher-desktop-icon { display: none; }
        .launcher .launcher-search-icon {
          position: absolute;
          top: 50%;
          right: 2.7px;
          display: block;
          width: 14.4px;
          height: 14.4px;
          border-radius: 0;
          transform: translateY(-50%);
        }
        .launcher.mobile-glyph-fallback::after { display: grid; }
        .panel.open + .launcher {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(-50%) translateX(-8px);
          transition: opacity .14s ease, transform .18s ease, visibility 0s linear .18s;
        }
        .panel {
          right: max(10px, env(safe-area-inset-right));
          bottom: calc(max(14px, env(safe-area-inset-bottom)) + 74px);
          width: calc(100vw - 20px - env(safe-area-inset-left) - env(safe-area-inset-right));
          height: min(698px, calc(100dvh - 104px - env(safe-area-inset-top)));
          min-height: 360px;
          border-radius: 15px;
        }
        .messages { padding-inline: 20px; }
        .composer-area { padding-inline: 20px; }
        .disclaimer { font-size: 9.5px; letter-spacing: -.01em; }
      }
      @media (max-width: 767px) {
        .panel.expanded {
          inset: 0;
          width: 100%;
          height: 100dvh;
          min-height: 0;
          max-height: none;
          border: 0;
          border-radius: 0;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; transition-delay: 0s !important; }
      }
    </style>
    <template id="welcome-template">
      <section class="welcome" aria-labelledby="okla-welcome-title">
        <div class="welcome-brand">
          <span class="welcome-logo" aria-hidden="true"><img data-robot-image src="${assetUrl}" alt=""></span>
        </div>
        <h2 class="welcome-title" id="okla-welcome-title">OKLA poradce</h2>
        <div class="welcome-input"></div>
        <div class="suggestions">
          <div class="suggestions-list">
            <button class="suggested" type="button">${chatIcon}<span>Pomozte mi vybrat elektroniku</span></button>
            <button class="suggested" type="button">${chatIcon}<span>Doporučte měřicí techniku pro projekt</span></button>
            <button class="suggested" type="button">${chatIcon}<span>Poradíte s dopravou a vrácením?</span></button>
          </div>
        </div>
      </section>
    </template>
    <section class="panel" id="okla-panel" role="dialog" aria-modal="false" aria-label="AI poradce OKLA" aria-hidden="true">
      <header class="topbar">
        <div class="topbar-group">
          <button class="top-action info-control" type="button" aria-label="Informace o AI poradci" title="Informace o AI poradci">${infoIcon}</button>
        </div>
        <span class="brand-mini" aria-hidden="true"><img data-robot-image src="${assetUrl}" alt=""></span>
        <div class="topbar-group">
          <button class="top-action expand" type="button" aria-label="Zvětšit chat" aria-pressed="false" title="Zvětšit chat">${expandIcon}</button>
          <button class="top-action collapse" type="button" aria-label="Zavřít chat" title="Zavřít chat">${collapseIcon}</button>
        </div>
      </header>
      <div class="messages" id="okla-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="composer-area">
        <form class="composer">
          <label class="sr-only" for="okla-input">Napište dotaz</label>
          <textarea id="okla-input" rows="1" maxlength="1200" placeholder="Zeptejte se na cokoliv…" aria-describedby="okla-disclaimer"></textarea>
          <button class="send" type="submit" aria-label="Odeslat zprávu" disabled>${sendIcon}</button>
        </form>
        <p class="disclaimer" id="okla-disclaimer">Odpovědi vytváří AI. Ověřte důležité informace a neposílejte osobní údaje.</p>
      </div>
    </section>
    <button class="launcher" type="button" aria-label="Otevřít OKLA poradce" aria-controls="okla-panel" aria-expanded="false">
      <img class="launcher-desktop-icon" data-robot-image src="${assetUrl}" alt="">
      <svg class="launcher-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="10.5" r="6.5"></circle><path d="m8.5 15.5-5 5"></path></svg>
    </button>
    <div class="sr-only" id="okla-status" role="status" aria-live="assertive"></div>`;

  const panel = shadow.querySelector<HTMLElement>(".panel")!;
  const launcher = shadow.querySelector<HTMLButtonElement>(".launcher")!;
  const info = shadow.querySelector<HTMLButtonElement>(".info-control")!;
  const expand = shadow.querySelector<HTMLButtonElement>(".expand")!;
  const collapse = shadow.querySelector<HTMLButtonElement>(".collapse")!;
  const messages = shadow.querySelector<HTMLElement>(".messages")!;
  const welcomeTemplate = shadow.querySelector<HTMLTemplateElement>("#welcome-template")!;
  const form = shadow.querySelector<HTMLFormElement>("form")!;
  const input = shadow.querySelector<HTMLTextAreaElement>("textarea")!;
  const send = shadow.querySelector<HTMLButtonElement>(".send")!;
  const composerArea = shadow.querySelector<HTMLElement>(".composer-area")!;
  const disclaimer = shadow.querySelector<HTMLElement>(".disclaimer")!;
  const status = shadow.querySelector<HTMLElement>("#okla-status")!;
  const deliveryReceipt = new DeliveryReceiptController();
  const typingIndicator = new TypingIndicatorController();
  shadow.querySelectorAll<HTMLImageElement>("[data-robot-image], [data-mobile-assistant-image]").forEach(installImageFallback);
  let history: Array<{ role: "user" | "assistant"; content: string }> = [];
  let busy = false;
  let controller: AbortController | null = null;
  let focusTimer: ReturnType<typeof setTimeout> | undefined;
  let lifecycle = 0;

  function setOpen(open: boolean) {
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Zavřít OKLA poradce" : "Otevřít OKLA poradce");
    if (focusTimer !== undefined) clearTimeout(focusTimer);
    if (open) focusTimer = setTimeout(() => input.focus(), 180);
    else launcher.focus();
  }

  function scrollDown() { messages.scrollTop = messages.scrollHeight; }

  function safeLink(value: string): string | undefined {
    try {
      const parsed = new URL(value, window.location.href);
      return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? parsed.toString() : undefined;
    } catch {
      return undefined;
    }
  }

  function fixDashes(value: string): string {
    return value.replace(/-{2,}/g, "—");
  }

  function renderInline(container: HTMLElement, value: string) {
    const pattern = /\*\*([^*\n]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
    let index = 0;
    for (const match of value.matchAll(pattern)) {
      const start = match.index ?? 0;
      container.append(document.createTextNode(fixDashes(value.slice(index, start))));
      if (match[1] !== undefined) {
        const bold = document.createElement("strong");
        bold.textContent = fixDashes(match[1]);
        container.append(bold);
      } else {
        const url = safeLink(match[3] ?? "");
        if (url) {
          const link = document.createElement("a");
          link.textContent = fixDashes(match[2] ?? url);
          link.href = url;
          if (/^https?:/i.test(url)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
          container.append(link);
        } else container.append(document.createTextNode(fixDashes(match[0])));
      }
      index = start + match[0].length;
    }
    container.append(document.createTextNode(fixDashes(value.slice(index))));
  }

  const BULLET = /^\s*[-•*]\s+/;

  function appendRichText(container: HTMLElement, value: string) {
    container.replaceChildren();
    const lines = value.split("\n");
    let i = 0;
    while (i < lines.length) {
      if (BULLET.test(lines[i]!)) {
        const list = document.createElement("ul");
        list.className = "md-list";
        while (i < lines.length && BULLET.test(lines[i]!)) {
          const item = document.createElement("li");
          renderInline(item, lines[i]!.replace(BULLET, ""));
          list.append(item);
          i += 1;
        }
        container.append(list);
      } else {
        const buffer: string[] = [];
        while (i < lines.length && !BULLET.test(lines[i]!)) {
          buffer.push(lines[i]!);
          i += 1;
        }
        while (buffer.length && buffer[buffer.length - 1]!.trim() === "") buffer.pop();
        while (buffer.length && buffer[0]!.trim() === "") buffer.shift();
        if (buffer.length) {
          const block = document.createElement("div");
          block.className = "md-par";
          renderInline(block, buffer.join("\n"));
          container.append(block);
        }
      }
    }
  }

  function addUserMessage(content: string, sentAt = new Date()) {
    const row = document.createElement("div");
    row.className = "message-row user";
    const stack = document.createElement("div");
    stack.className = "message-stack";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = content;
    const delivery = document.createElement("div");
    delivery.className = "delivery-slot";
    delivery.setAttribute("aria-live", "polite");
    stack.append(bubble, delivery);
    row.append(stack);
    messages.append(row);
    deliveryReceipt.schedule(delivery, sentAt);
    scrollDown();
  }

  function addAssistantMessage(content = "") {
    const row = document.createElement("div");
    row.className = "message-row assistant";
    const avatar = document.createElement("span");
    avatar.className = "assistant-avatar";
    avatar.setAttribute("aria-hidden", "true");
    const avatarImage = document.createElement("img");
    avatarImage.src = assetUrl;
    avatarImage.alt = "";
    avatarImage.dataset.robotImage = "";
    avatar.append(avatarImage);
    installImageFallback(avatarImage);
    const stack = document.createElement("div");
    stack.className = "message-stack assistant-stack";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    appendRichText(bubble, content);
    const timeSlot = document.createElement("div");
    timeSlot.className = "assistant-time-slot";
    stack.append(bubble, timeSlot);
    row.append(avatar, stack);
    messages.append(row);
    scrollDown();
    return { row, bubble, timeSlot };
  }

  function completeAssistantMessage(message: ReturnType<typeof addAssistantMessage>, completedAt = new Date()) {
    appendChatTime(message.timeSlot, completedAt, "assistant-time");
  }

  function bindSuggestions() {
    messages.querySelectorAll<HTMLButtonElement>(".suggested").forEach((button) => {
      button.addEventListener("click", () => void submit(button.textContent || ""));
    });
  }

  function showWelcome() {
    messages.replaceChildren(welcomeTemplate.content.cloneNode(true));
    messages.classList.remove("conversation");
    panel.classList.remove("chatting");
    const slot = messages.querySelector<HTMLElement>(".welcome-input");
    if (slot) slot.append(form);
    composerArea.hidden = true;
    bindSuggestions();
    messages.scrollTop = 0;
  }

  function beginConversation() {
    if (panel.classList.contains("chatting")) return;
    composerArea.hidden = false;
    composerArea.insertBefore(form, disclaimer);
    if (messages.querySelector(".welcome")) messages.replaceChildren();
    messages.classList.add("conversation");
    panel.classList.add("chatting");
  }

  async function readSse(response: Response, onToken: (token: string) => void): Promise<void> {
    if (!response.ok) {
      let message = "Odpověď se nepodařilo načíst.";
      try { message = (await response.json()).error || message; } catch { /* bezpečný fallback */ }
      throw new Error(message);
    }
    if (!response.body) throw new Error("Server neposlal datový proud.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";
      for (const block of blocks) {
        const event = block.match(/^event:\s*(.+)$/m)?.[1];
        const raw = block.match(/^data:\s*(.+)$/m)?.[1];
        if (!raw) continue;
        const data = JSON.parse(raw) as { text?: string; message?: string };
        if (event === "token" && data.text) onToken(data.text);
        if (event === "error") throw new Error(data.message || "Odpověď se nepodařilo načíst.");
      }
      if (done) break;
    }
  }

  async function submit(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    const run = ++lifecycle;
    busy = true;
    send.disabled = true;
    input.disabled = true;
    beginConversation();
    addUserMessage(message, new Date());
    const priorHistory = history.slice(-12);
    history.push({ role: "user", content: message });
    input.value = "";
    input.style.height = "auto";
    typingIndicator.show(messages);
    status.textContent = "";
    controller = new AbortController();
    let answer = "";
    let assistant: ReturnType<typeof addAssistantMessage> | null = null;

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, history: priorHistory }),
        signal: controller.signal
      });
      await readSse(response, (token) => {
        if (run !== lifecycle) return;
        answer += token;
        if (!assistant) {
          assistant = addAssistantMessage();
          typingIndicator.moveToEnd(messages);
        }
        appendRichText(assistant.bubble, answer);
        scrollDown();
      });
      if (run !== lifecycle) return;
      if (!answer) throw new Error("Server neposlal odpověď.");
      if (!assistant) assistant = addAssistantMessage(answer);
      completeAssistantMessage(assistant, new Date());
      history.push({ role: "assistant", content: answer });
      status.textContent = "Odpověď je hotová.";
    } catch (error) {
      if (run !== lifecycle || (error as Error).name === "AbortError") return;
      const messageText = error instanceof Error ? error.message : "Odpověď se nepodařilo načíst.";
      typingIndicator.hide();
      if (!assistant) assistant = addAssistantMessage();
      appendRichText(assistant.bubble, `Omlouvám se, něco se nepovedlo: ${messageText} Zkuste dotaz odeslat znovu.`);
      assistant.bubble.setAttribute("role", "alert");
      completeAssistantMessage(assistant, new Date());
      status.textContent = messageText;
    } finally {
      typingIndicator.hide();
      if (run !== lifecycle) return;
      busy = false;
      input.disabled = false;
      send.disabled = !input.value.trim();
      controller = null;
      input.focus();
      scrollDown();
    }
  }

  function showAssistantInfo() {
    if (busy) return;
    beginConversation();
    const text = "Jsem **OKLA poradce**, virtuální asistent s umělou inteligencí.\n\n- Pomohu vám vybrat elektroniku podle použití, rozpočtu a požadovaných funkcí.\n- Vysvětlím vlastnosti produktů a poradím s informacemi o nákupu z dostupných podkladů.\n- Nemám přístup k vašim objednávkám ani zákaznickému účtu. S konkrétní objednávkou pomůže [podpora@okla.cz](mailto:podpora@okla.cz).\n\nMoje odpovědi mohou obsahovat chyby. Aktuální cenu, dostupnost a důležité parametry si ověřte na stránce produktu. Do chatu neposílejte osobní ani platební údaje.\n\n**S čím vám mohu pomoci?**";
    const message = addAssistantMessage(text);
    completeAssistantMessage(message, new Date());
    history.push({ role: "assistant", content: text });
    status.textContent = "Informace o AI poradci.";
    scrollDown();
  }

  launcher.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  info.addEventListener("click", showAssistantInfo);
  expand.addEventListener("click", () => {
    const expanded = panel.classList.toggle("expanded");
    expand.setAttribute("aria-pressed", String(expanded));
    expand.setAttribute("aria-label", expanded ? "Zmenšit chat" : "Zvětšit chat");
    expand.title = expanded ? "Zmenšit chat" : "Zvětšit chat";
  });
  collapse.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (event) => { event.preventDefault(); void submit(input.value); });
  input.addEventListener("input", () => {
    send.disabled = busy || !input.value.trim();
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 72)}px`;
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
  });
  shadow.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("open")) setOpen(false);
  });

  teardown = () => {
    lifecycle += 1;
    controller?.abort();
    deliveryReceipt.cancel();
    typingIndicator.hide();
    if (focusTimer !== undefined) clearTimeout(focusTimer);
  };
  showWelcome();
})();
