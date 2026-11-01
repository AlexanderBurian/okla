"use strict";(()=>{var fe=Object.defineProperty;var xe=(o,a,l)=>a in o?fe(o,a,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[a]=l;var N=(o,a,l)=>xe(o,typeof a!="symbol"?a+"":a,l);var ve="assets/okla-robot-launcher.png";function we(o,a){let{scriptSrc:l,apiUrl:d,assetBaseUrl:p,locationOrigin:u}=o,f;return p?f=new URL(p.endsWith("/")?p:`${p}/`,u):d?f=new URL(d.endsWith("/")?d:`${d}/`,u):l?f=new URL(".",l):f=new URL(u.endsWith("/")?u:`${u}/`),new URL(a,f).toString()}function ee(o){return we(o,ve)}function Z(o){let a=o.dataset.fallbackClass||"robot-fallback",l=()=>{o.hidden=!0,o.parentElement?.classList.add(a)};o.addEventListener("error",l,{once:!0}),queueMicrotask(()=>{o.complete&&o.naturalWidth===0&&l()})}var ye=new Intl.DateTimeFormat("cs-CZ",{hour:"2-digit",minute:"2-digit",hourCycle:"h23"});function te(o){return ye.format(o)}function ae(o,a,l){let d=o.ownerDocument.createElement("time");return d.className=l,d.dateTime=a.toISOString(),d.textContent=te(a),o.replaceChildren(d),d}function ke(o){let a=o.createElement("div");a.className="typing-row",a.dataset.state="typing",a.setAttribute("role","status"),a.setAttribute("aria-live","polite"),a.setAttribute("aria-label","Pracuji na odpov\u011Bdi");let l=o.createElement("span");l.className="typing-dots",l.setAttribute("aria-hidden","true");for(let p=0;p<3;p+=1){let u=o.createElement("span");u.className="typing-dot",l.append(u)}let d=o.createElement("span");return d.className="typing-label",d.textContent="Pracuji na odpov\u011Bdi\u2026",a.append(l,d),a}var U=class{constructor(){N(this,"row")}show(a){return this.hide(),this.row=ke(a.ownerDocument),a.append(this.row),this.row}hide(){this.row?.remove(),this.row=void 0}moveToEnd(a){this.row?.isConnected&&a.append(this.row)}isVisible(){return this.row?.isConnected??!1}},D=class{constructor(){N(this,"timer");N(this,"generation",0)}schedule(a,l=new Date,d=500){this.cancel();let p=this.generation;a.replaceChildren(),a.classList.remove("visible"),this.timer=setTimeout(()=>{if(p!==this.generation||!a.isConnected)return;let u=a.ownerDocument.createElement("span");u.className="receipt-check",u.setAttribute("aria-hidden","true"),u.textContent="\u2713";let f=a.ownerDocument.createElement("span");f.textContent="Doru\u010Deno";let x=a.ownerDocument.createElement("time");x.dateTime=l.toISOString(),x.textContent=te(l),a.setAttribute("aria-label",`Doru\u010Deno ${x.textContent}`),a.append(u,f,x),a.classList.add("visible"),this.timer=void 0},d)}cancel(){this.generation+=1,this.timer!==void 0&&clearTimeout(this.timer),this.timer=void 0}hasPendingTimer(){return this.timer!==void 0}};(()=>{let o="okla-ai-chat";if(document.querySelector(o))return;let a=["localhost","127.0.0.1"].includes(window.location.hostname),l=document.body.matches(".type-index, .type-category, .type-detail, .type-search, .type-manufacturer")||!!document.querySelector("#content .p-detail");if(document.body.matches(".ordering-process, .in-kontakty, .type-cart")||/^\/(?:kosik|objednavka|objednavky|kontakt|kontakty|cart|checkout)(?:\/|$)/i.test(window.location.pathname)||!a&&!l)return;let p=document.currentScript,u=(p?.dataset.apiUrl||(p?.src?new URL(p.src).origin:"")).replace(/\/$/,""),f={scriptSrc:p?.src,apiUrl:p?.dataset.apiUrl||u,assetBaseUrl:p?.dataset.assetBaseUrl,locationOrigin:window.location.origin},x=ee(f),_=()=>{};customElements.get(o)||customElements.define(o,class extends HTMLElement{disconnectedCallback(){_()}});let K=document.createElement(o),m=K.attachShadow({mode:"open"});document.body.append(K);let ne='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',oe='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',ie='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6.5 9 5.5 5.5L17.5 9"/></svg>',se='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>',j='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.5 6A2.5 2.5 0 0 1 5 3.5h7A2.5 2.5 0 0 1 14.5 6v3A2.5 2.5 0 0 1 12 11.5H7.2L4 14.2A.55.55 0 0 1 3 13.8V11.4A2.5 2.5 0 0 1 2.5 9V6z"/><path d="M16 8.5h3A2.5 2.5 0 0 1 21.5 11v3a2.5 2.5 0 0 1-2 2.45V19a.55.55 0 0 1-.9.43L15.3 17H13a2.5 2.5 0 0 1-2.45-2H12A4 4 0 0 0 16 11v-2.5z"/></svg>';m.innerHTML=`
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
          <span class="welcome-logo" aria-hidden="true"><img data-robot-image src="${x}" alt=""></span>
        </div>
        <h2 class="welcome-title" id="okla-welcome-title">OKLA poradce</h2>
        <div class="welcome-input"></div>
        <div class="suggestions">
          <div class="suggestions-list">
            <button class="suggested" type="button">${j}<span>Pomozte mi vybrat elektroniku</span></button>
            <button class="suggested" type="button">${j}<span>Doporu\u010Dte m\u011B\u0159ic\xED techniku pro projekt</span></button>
            <button class="suggested" type="button">${j}<span>Porad\xEDte s dopravou a vr\xE1cen\xEDm?</span></button>
          </div>
        </div>
      </section>
    </template>
    <section class="panel" id="okla-panel" role="dialog" aria-modal="false" aria-label="AI poradce OKLA" aria-hidden="true">
      <header class="topbar">
        <div class="topbar-group">
          <button class="top-action info-control" type="button" aria-label="Informace o AI poradci" title="Informace o AI poradci">${ne}</button>
        </div>
        <span class="brand-mini" aria-hidden="true"><img data-robot-image src="${x}" alt=""></span>
        <div class="topbar-group">
          <button class="top-action expand" type="button" aria-label="Zv\u011Bt\u0161it chat" aria-pressed="false" title="Zv\u011Bt\u0161it chat">${oe}</button>
          <button class="top-action collapse" type="button" aria-label="Zav\u0159\xEDt chat" title="Zav\u0159\xEDt chat">${ie}</button>
        </div>
      </header>
      <div class="messages" id="okla-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="composer-area">
        <form class="composer">
          <label class="sr-only" for="okla-input">Napi\u0161te dotaz</label>
          <textarea id="okla-input" rows="1" maxlength="1200" placeholder="Zeptejte se na cokoliv\u2026" aria-describedby="okla-disclaimer"></textarea>
          <button class="send" type="submit" aria-label="Odeslat zpr\xE1vu" disabled>${se}</button>
        </form>
        <p class="disclaimer" id="okla-disclaimer">Odpov\u011Bdi vytv\xE1\u0159\xED AI. Ov\u011B\u0159te d\u016Fle\u017Eit\xE9 informace a nepos\xEDlejte osobn\xED \xFAdaje.</p>
      </div>
    </section>
    <button class="launcher" type="button" aria-label="Otev\u0159\xEDt OKLA poradce" aria-controls="okla-panel" aria-expanded="false">
      <img class="launcher-desktop-icon" data-robot-image src="${x}" alt="">
      <svg class="launcher-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="10.5" r="6.5"></circle><path d="m8.5 15.5-5 5"></path></svg>
    </button>
    <div class="sr-only" id="okla-status" role="status" aria-live="assertive"></div>`;let v=m.querySelector(".panel"),A=m.querySelector(".launcher"),re=m.querySelector(".info-control"),S=m.querySelector(".expand"),le=m.querySelector(".collapse"),h=m.querySelector(".messages"),ce=m.querySelector("#welcome-template"),M=m.querySelector("form"),g=m.querySelector("textarea"),R=m.querySelector(".send"),B=m.querySelector(".composer-area"),de=m.querySelector(".disclaimer"),H=m.querySelector("#okla-status"),V=new D,y=new U;m.querySelectorAll("[data-robot-image], [data-mobile-assistant-image]").forEach(Z);let C=[],k=!1,O=null,E,w=0;function q(e){v.classList.toggle("open",e),v.setAttribute("aria-hidden",String(!e)),A.setAttribute("aria-expanded",String(e)),A.setAttribute("aria-label",e?"Zav\u0159\xEDt OKLA poradce":"Otev\u0159\xEDt OKLA poradce"),E!==void 0&&clearTimeout(E),e?E=setTimeout(()=>g.focus(),180):A.focus()}function L(){h.scrollTop=h.scrollHeight}function pe(e){try{let s=new URL(e,window.location.href);return["http:","https:","mailto:"].includes(s.protocol)?s.toString():void 0}catch{return}}function T(e){return e.replace(/-{2,}/g,"\u2014")}function F(e,s){let r=/\*\*([^*\n]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g,i=0;for(let t of s.matchAll(r)){let n=t.index??0;if(e.append(document.createTextNode(T(s.slice(i,n)))),t[1]!==void 0){let c=document.createElement("strong");c.textContent=T(t[1]),e.append(c)}else{let c=pe(t[3]??"");if(c){let b=document.createElement("a");b.textContent=T(t[2]??c),b.href=c,/^https?:/i.test(c)&&(b.target="_blank",b.rel="noopener noreferrer"),e.append(b)}else e.append(document.createTextNode(T(t[0])))}i=n+t[0].length}e.append(document.createTextNode(T(s.slice(i))))}let z=/^\s*[-•*]\s+/;function $(e,s){e.replaceChildren();let r=s.split(`
`),i=0;for(;i<r.length;)if(z.test(r[i])){let t=document.createElement("ul");for(t.className="md-list";i<r.length&&z.test(r[i]);){let n=document.createElement("li");F(n,r[i].replace(z,"")),t.append(n),i+=1}e.append(t)}else{let t=[];for(;i<r.length&&!z.test(r[i]);)t.push(r[i]),i+=1;for(;t.length&&t[t.length-1].trim()==="";)t.pop();for(;t.length&&t[0].trim()==="";)t.shift();if(t.length){let n=document.createElement("div");n.className="md-par",F(n,t.join(`
`)),e.append(n)}}}function ue(e,s=new Date){let r=document.createElement("div");r.className="message-row user";let i=document.createElement("div");i.className="message-stack";let t=document.createElement("div");t.className="bubble",t.textContent=e;let n=document.createElement("div");n.className="delivery-slot",n.setAttribute("aria-live","polite"),i.append(t,n),r.append(i),h.append(r),V.schedule(n,s),L()}function I(e=""){let s=document.createElement("div");s.className="message-row assistant";let r=document.createElement("span");r.className="assistant-avatar",r.setAttribute("aria-hidden","true");let i=document.createElement("img");i.src=x,i.alt="",i.dataset.robotImage="",r.append(i),Z(i);let t=document.createElement("div");t.className="message-stack assistant-stack";let n=document.createElement("div");n.className="bubble",$(n,e);let c=document.createElement("div");return c.className="assistant-time-slot",t.append(n,c),s.append(r,t),h.append(s),L(),{row:s,bubble:n,timeSlot:c}}function Y(e,s=new Date){ae(e.timeSlot,s,"assistant-time")}function me(){h.querySelectorAll(".suggested").forEach(e=>{e.addEventListener("click",()=>{J(e.textContent||"")})})}function he(){h.replaceChildren(ce.content.cloneNode(!0)),h.classList.remove("conversation"),v.classList.remove("chatting");let e=h.querySelector(".welcome-input");e&&e.append(M),B.hidden=!0,me(),h.scrollTop=0}function W(){v.classList.contains("chatting")||(B.hidden=!1,B.insertBefore(M,de),h.querySelector(".welcome")&&h.replaceChildren(),h.classList.add("conversation"),v.classList.add("chatting"))}async function ge(e,s){if(!e.ok){let n="Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";try{n=(await e.json()).error||n}catch{}throw new Error(n)}if(!e.body)throw new Error("Server neposlal datov\xFD proud.");let r=e.body.getReader(),i=new TextDecoder,t="";for(;;){let{done:n,value:c}=await r.read();t+=i.decode(c,{stream:!n});let b=t.split(/\r?\n\r?\n/);t=b.pop()??"";for(let G of b){let X=G.match(/^event:\s*(.+)$/m)?.[1],Q=G.match(/^data:\s*(.+)$/m)?.[1];if(!Q)continue;let P=JSON.parse(Q);if(X==="token"&&P.text&&s(P.text),X==="error")throw new Error(P.message||"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.")}if(n)break}}async function J(e){let s=e.trim();if(!s||k)return;let r=++w;k=!0,R.disabled=!0,g.disabled=!0,W(),ue(s,new Date);let i=C.slice(-12);C.push({role:"user",content:s}),g.value="",g.style.height="auto",y.show(h),H.textContent="",O=new AbortController;let t="",n=null;try{let c=await fetch(`${u}/api/chat`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message:s,history:i}),signal:O.signal});if(await ge(c,b=>{r===w&&(t+=b,n||(n=I(),y.moveToEnd(h)),$(n.bubble,t),L())}),r!==w)return;if(!t)throw new Error("Server neposlal odpov\u011B\u010F.");n||(n=I(t)),Y(n,new Date),C.push({role:"assistant",content:t}),H.textContent="Odpov\u011B\u010F je hotov\xE1."}catch(c){if(r!==w||c.name==="AbortError")return;let b=c instanceof Error?c.message:"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";y.hide(),n||(n=I()),$(n.bubble,`Omlouv\xE1m se, n\u011Bco se nepovedlo: ${b} Zkuste dotaz odeslat znovu.`),n.bubble.setAttribute("role","alert"),Y(n,new Date),H.textContent=b}finally{if(y.hide(),r!==w)return;k=!1,g.disabled=!1,R.disabled=!g.value.trim(),O=null,g.focus(),L()}}function be(){if(k)return;W();let e=`Jsem **OKLA poradce**, virtu\xE1ln\xED asistent s um\u011Blou inteligenc\xED.

- Pomohu v\xE1m vybrat elektroniku podle pou\u017Eit\xED, rozpo\u010Dtu a po\u017Eadovan\xFDch funkc\xED.
- Vysv\u011Btl\xEDm vlastnosti produkt\u016F a porad\xEDm s informacemi o n\xE1kupu z dostupn\xFDch podklad\u016F.
- Nem\xE1m p\u0159\xEDstup k va\u0161im objedn\xE1vk\xE1m ani z\xE1kaznick\xE9mu \xFA\u010Dtu. S konkr\xE9tn\xED objedn\xE1vkou pom\u016F\u017Ee [podpora@okla.cz](mailto:podpora@okla.cz).

Moje odpov\u011Bdi mohou obsahovat chyby. Aktu\xE1ln\xED cenu, dostupnost a d\u016Fle\u017Eit\xE9 parametry si ov\u011B\u0159te na str\xE1nce produktu. Do chatu nepos\xEDlejte osobn\xED ani platebn\xED \xFAdaje.

**S \u010D\xEDm v\xE1m mohu pomoci?**`,s=I(e);Y(s,new Date),C.push({role:"assistant",content:e}),H.textContent="Informace o AI poradci.",L()}A.addEventListener("click",()=>q(!v.classList.contains("open"))),re.addEventListener("click",be),S.addEventListener("click",()=>{let e=v.classList.toggle("expanded");S.setAttribute("aria-pressed",String(e)),S.setAttribute("aria-label",e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"),S.title=e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"}),le.addEventListener("click",()=>q(!1)),M.addEventListener("submit",e=>{e.preventDefault(),J(g.value)}),g.addEventListener("input",()=>{R.disabled=k||!g.value.trim(),g.style.height="auto",g.style.height=`${Math.min(g.scrollHeight,72)}px`}),g.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),M.requestSubmit())}),m.addEventListener("keydown",e=>{e.key==="Escape"&&v.classList.contains("open")&&q(!1)}),_=()=>{w+=1,O?.abort(),V.cancel(),y.hide(),E!==void 0&&clearTimeout(E)},he()})();})();
