"use strict";(()=>{var he=Object.defineProperty;var ge=(o,t,l)=>t in o?he(o,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[t]=l;var I=(o,t,l)=>ge(o,typeof t!="symbol"?t+"":t,l);var fe="assets/okla-robot-launcher.png";function be(o,t){let{scriptSrc:l,apiUrl:p,assetBaseUrl:m,locationOrigin:u}=o,b;return m?b=new URL(m.endsWith("/")?m:`${m}/`,u):p?b=new URL(p.endsWith("/")?p:`${p}/`,u):l?b=new URL(".",l):b=new URL(u.endsWith("/")?u:`${u}/`),new URL(t,b).toString()}function G(o){return be(o,fe)}function Z(o){let t=o.dataset.fallbackClass||"robot-fallback",l=()=>{o.hidden=!0,o.parentElement?.classList.add(t)};o.addEventListener("error",l,{once:!0}),queueMicrotask(()=>{o.complete&&o.naturalWidth===0&&l()})}var xe=new Intl.DateTimeFormat("cs-CZ",{hour:"2-digit",minute:"2-digit",hourCycle:"h23"});function X(o){return xe.format(o)}function Q(o,t,l){let p=o.ownerDocument.createElement("time");return p.className=l,p.dateTime=t.toISOString(),p.textContent=X(t),o.replaceChildren(p),p}function ve(o){let t=o.createElement("div");t.className="typing-row",t.dataset.state="typing",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-label","Pracuji na odpov\u011Bdi");let l=o.createElement("span");l.className="typing-dots",l.setAttribute("aria-hidden","true");for(let m=0;m<3;m+=1){let u=o.createElement("span");u.className="typing-dot",l.append(u)}let p=o.createElement("span");return p.className="typing-label",p.textContent="Pracuji na odpov\u011Bdi\u2026",t.append(l,p),t}var N=class{constructor(){I(this,"row")}show(t){return this.hide(),this.row=ve(t.ownerDocument),t.append(this.row),this.row}hide(){this.row?.remove(),this.row=void 0}moveToEnd(t){this.row?.isConnected&&t.append(this.row)}isVisible(){return this.row?.isConnected??!1}},U=class{constructor(){I(this,"timer");I(this,"generation",0)}schedule(t,l=new Date,p=500){this.cancel();let m=this.generation;t.replaceChildren(),t.classList.remove("visible"),this.timer=setTimeout(()=>{if(m!==this.generation||!t.isConnected)return;let u=t.ownerDocument.createElement("span");u.className="receipt-check",u.setAttribute("aria-hidden","true"),u.textContent="\u2713";let b=t.ownerDocument.createElement("span");b.textContent="Doru\u010Deno";let c=t.ownerDocument.createElement("time");c.dateTime=l.toISOString(),c.textContent=X(l),t.setAttribute("aria-label",`Doru\u010Deno ${c.textContent}`),t.append(u,b,c),t.classList.add("visible"),this.timer=void 0},p)}cancel(){this.generation+=1,this.timer!==void 0&&clearTimeout(this.timer),this.timer=void 0}hasPendingTimer(){return this.timer!==void 0}};(()=>{let o="okla-ai-chat";if(document.querySelector(o))return;let t=document.currentScript,l=(t?.dataset.apiUrl||(t?.src?new URL(t.src).origin:"")).replace(/\/$/,""),p={scriptSrc:t?.src,apiUrl:t?.dataset.apiUrl||l,assetBaseUrl:t?.dataset.assetBaseUrl,locationOrigin:window.location.origin},m=G(p),u=()=>{};customElements.get(o)||customElements.define(o,class extends HTMLElement{disconnectedCallback(){u()}});let b=document.createElement(o),c=b.attachShadow({mode:"open"});document.body.append(b);let ee='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',te='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',ae='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6.5 9 5.5 5.5L17.5 9"/></svg>',ne='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>',D='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.5 6A2.5 2.5 0 0 1 5 3.5h7A2.5 2.5 0 0 1 14.5 6v3A2.5 2.5 0 0 1 12 11.5H7.2L4 14.2A.55.55 0 0 1 3 13.8V11.4A2.5 2.5 0 0 1 2.5 9V6z"/><path d="M16 8.5h3A2.5 2.5 0 0 1 21.5 11v3a2.5 2.5 0 0 1-2 2.45V19a.55.55 0 0 1-.9.43L15.3 17H13a2.5 2.5 0 0 1-2.45-2H12A4 4 0 0 0 16 11v-2.5z"/></svg>';c.innerHTML=`
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
          left: -34.2px;
          right: auto;
          top: clamp(110px, 73dvh, calc(100dvh - 110px));
          bottom: auto;
          width: 79.2px;
          height: 140.4px;
          border: 3.6px solid #fff;
          border-radius: 0 41.4px 41.4px 0;
          background: linear-gradient(160deg, #254daa 4%, #38369c 50%, #6d2d96 100%);
          color: #fff;
          box-shadow: 7px 10px 24px rgba(22, 25, 72, .3);
          transform: translateY(-50%);
          transform-origin: center;
          transition: opacity .18s ease, transform .18s ease, visibility 0s, box-shadow .18s ease;
        }
        .launcher:hover {
          border-color: #fff;
          box-shadow: 6px 11px 24px rgba(10, 25, 58, .32);
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
          right: 5.4px;
          display: block;
          width: 28.8px;
          height: 28.8px;
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
          <span class="welcome-logo" aria-hidden="true"><img data-robot-image src="${m}" alt=""></span>
        </div>
        <h2 class="welcome-title" id="okla-welcome-title">OKLA poradce</h2>
        <div class="welcome-input"></div>
        <div class="suggestions">
          <div class="suggestions-list">
            <button class="suggested" type="button">${D}<span>Pomozte mi vybrat elektroniku</span></button>
            <button class="suggested" type="button">${D}<span>Doporu\u010Dte m\u011B\u0159ic\xED techniku pro projekt</span></button>
            <button class="suggested" type="button">${D}<span>Porad\xEDte s dopravou a vr\xE1cen\xEDm?</span></button>
          </div>
        </div>
      </section>
    </template>
    <section class="panel" id="okla-panel" role="dialog" aria-modal="false" aria-label="AI poradce OKLA" aria-hidden="true">
      <header class="topbar">
        <div class="topbar-group">
          <button class="top-action info-control" type="button" aria-label="Informace o AI poradci" title="Informace o AI poradci">${ee}</button>
        </div>
        <span class="brand-mini" aria-hidden="true"><img data-robot-image src="${m}" alt=""></span>
        <div class="topbar-group">
          <button class="top-action expand" type="button" aria-label="Zv\u011Bt\u0161it chat" aria-pressed="false" title="Zv\u011Bt\u0161it chat">${te}</button>
          <button class="top-action collapse" type="button" aria-label="Zav\u0159\xEDt chat" title="Zav\u0159\xEDt chat">${ae}</button>
        </div>
      </header>
      <div class="messages" id="okla-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="composer-area">
        <form class="composer">
          <label class="sr-only" for="okla-input">Napi\u0161te dotaz</label>
          <textarea id="okla-input" rows="1" maxlength="1200" placeholder="Zeptejte se na cokoliv\u2026" aria-describedby="okla-disclaimer"></textarea>
          <button class="send" type="submit" aria-label="Odeslat zpr\xE1vu" disabled>${ne}</button>
        </form>
        <p class="disclaimer" id="okla-disclaimer">Odpov\u011Bdi vytv\xE1\u0159\xED AI. Ov\u011B\u0159te d\u016Fle\u017Eit\xE9 informace a nepos\xEDlejte osobn\xED \xFAdaje.</p>
      </div>
    </section>
    <button class="launcher" type="button" aria-label="Otev\u0159\xEDt OKLA poradce" aria-controls="okla-panel" aria-expanded="false">
      <img class="launcher-desktop-icon" data-robot-image src="${m}" alt="">
      <svg class="launcher-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="10.5" r="6.5"></circle><path d="m8.5 15.5-5 5"></path></svg>
    </button>
    <div class="sr-only" id="okla-status" role="status" aria-live="assertive"></div>`;let x=c.querySelector(".panel"),T=c.querySelector(".launcher"),oe=c.querySelector(".info-control"),A=c.querySelector(".expand"),ie=c.querySelector(".collapse"),h=c.querySelector(".messages"),se=c.querySelector("#welcome-template"),S=c.querySelector("form"),g=c.querySelector("textarea"),R=c.querySelector(".send"),j=c.querySelector(".composer-area"),re=c.querySelector(".disclaimer"),M=c.querySelector("#okla-status"),_=new U,w=new N;c.querySelectorAll("[data-robot-image], [data-mobile-assistant-image]").forEach(Z);let H=[],y=!1,C=null,k,v=0;function B(e){x.classList.toggle("open",e),x.setAttribute("aria-hidden",String(!e)),T.setAttribute("aria-expanded",String(e)),T.setAttribute("aria-label",e?"Zav\u0159\xEDt OKLA poradce":"Otev\u0159\xEDt OKLA poradce"),k!==void 0&&clearTimeout(k),e?k=setTimeout(()=>g.focus(),180):T.focus()}function E(){h.scrollTop=h.scrollHeight}function le(e){try{let s=new URL(e,window.location.href);return["http:","https:","mailto:"].includes(s.protocol)?s.toString():void 0}catch{return}}function L(e){return e.replace(/-{2,}/g,"\u2014")}function P(e,s){let r=/\*\*([^*\n]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g,i=0;for(let a of s.matchAll(r)){let n=a.index??0;if(e.append(document.createTextNode(L(s.slice(i,n)))),a[1]!==void 0){let d=document.createElement("strong");d.textContent=L(a[1]),e.append(d)}else{let d=le(a[3]??"");if(d){let f=document.createElement("a");f.textContent=L(a[2]??d),f.href=d,/^https?:/i.test(d)&&(f.target="_blank",f.rel="noopener noreferrer"),e.append(f)}else e.append(document.createTextNode(L(a[0])))}i=n+a[0].length}e.append(document.createTextNode(L(s.slice(i))))}let O=/^\s*[-•*]\s+/;function q(e,s){e.replaceChildren();let r=s.split(`
`),i=0;for(;i<r.length;)if(O.test(r[i])){let a=document.createElement("ul");for(a.className="md-list";i<r.length&&O.test(r[i]);){let n=document.createElement("li");P(n,r[i].replace(O,"")),a.append(n),i+=1}e.append(a)}else{let a=[];for(;i<r.length&&!O.test(r[i]);)a.push(r[i]),i+=1;for(;a.length&&a[a.length-1].trim()==="";)a.pop();for(;a.length&&a[0].trim()==="";)a.shift();if(a.length){let n=document.createElement("div");n.className="md-par",P(n,a.join(`
`)),e.append(n)}}}function ce(e,s=new Date){let r=document.createElement("div");r.className="message-row user";let i=document.createElement("div");i.className="message-stack";let a=document.createElement("div");a.className="bubble",a.textContent=e;let n=document.createElement("div");n.className="delivery-slot",n.setAttribute("aria-live","polite"),i.append(a,n),r.append(i),h.append(r),_.schedule(n,s),E()}function z(e=""){let s=document.createElement("div");s.className="message-row assistant";let r=document.createElement("span");r.className="assistant-avatar",r.setAttribute("aria-hidden","true");let i=document.createElement("img");i.src=m,i.alt="",i.dataset.robotImage="",r.append(i),Z(i);let a=document.createElement("div");a.className="message-stack assistant-stack";let n=document.createElement("div");n.className="bubble",q(n,e);let d=document.createElement("div");return d.className="assistant-time-slot",a.append(n,d),s.append(r,a),h.append(s),E(),{row:s,bubble:n,timeSlot:d}}function $(e,s=new Date){Q(e.timeSlot,s,"assistant-time")}function de(){h.querySelectorAll(".suggested").forEach(e=>{e.addEventListener("click",()=>{V(e.textContent||"")})})}function pe(){h.replaceChildren(se.content.cloneNode(!0)),h.classList.remove("conversation"),x.classList.remove("chatting");let e=h.querySelector(".welcome-input");e&&e.append(S),j.hidden=!0,de(),h.scrollTop=0}function K(){x.classList.contains("chatting")||(j.hidden=!1,j.insertBefore(S,re),h.querySelector(".welcome")&&h.replaceChildren(),h.classList.add("conversation"),x.classList.add("chatting"))}async function ue(e,s){if(!e.ok){let n="Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";try{n=(await e.json()).error||n}catch{}throw new Error(n)}if(!e.body)throw new Error("Server neposlal datov\xFD proud.");let r=e.body.getReader(),i=new TextDecoder,a="";for(;;){let{done:n,value:d}=await r.read();a+=i.decode(d,{stream:!n});let f=a.split(/\r?\n\r?\n/);a=f.pop()??"";for(let F of f){let W=F.match(/^event:\s*(.+)$/m)?.[1],J=F.match(/^data:\s*(.+)$/m)?.[1];if(!J)continue;let Y=JSON.parse(J);if(W==="token"&&Y.text&&s(Y.text),W==="error")throw new Error(Y.message||"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.")}if(n)break}}async function V(e){let s=e.trim();if(!s||y)return;let r=++v;y=!0,R.disabled=!0,g.disabled=!0,K(),ce(s,new Date);let i=H.slice(-12);H.push({role:"user",content:s}),g.value="",g.style.height="auto",w.show(h),M.textContent="",C=new AbortController;let a="",n=null;try{let d=await fetch(`${l}/api/chat`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message:s,history:i}),signal:C.signal});if(await ue(d,f=>{r===v&&(a+=f,n||(n=z(),w.moveToEnd(h)),q(n.bubble,a),E())}),r!==v)return;if(!a)throw new Error("Server neposlal odpov\u011B\u010F.");n||(n=z(a)),$(n,new Date),H.push({role:"assistant",content:a}),M.textContent="Odpov\u011B\u010F je hotov\xE1."}catch(d){if(r!==v||d.name==="AbortError")return;let f=d instanceof Error?d.message:"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";w.hide(),n||(n=z()),q(n.bubble,`Omlouv\xE1m se, n\u011Bco se nepovedlo: ${f} Zkuste dotaz odeslat znovu.`),n.bubble.setAttribute("role","alert"),$(n,new Date),M.textContent=f}finally{if(w.hide(),r!==v)return;y=!1,g.disabled=!1,R.disabled=!g.value.trim(),C=null,g.focus(),E()}}function me(){if(y)return;K();let e=`Jsem **OKLA poradce**, virtu\xE1ln\xED asistent s um\u011Blou inteligenc\xED.

- Pomohu v\xE1m vybrat elektroniku podle pou\u017Eit\xED, rozpo\u010Dtu a po\u017Eadovan\xFDch funkc\xED.
- Vysv\u011Btl\xEDm vlastnosti produkt\u016F a porad\xEDm s informacemi o n\xE1kupu z dostupn\xFDch podklad\u016F.
- Nem\xE1m p\u0159\xEDstup k va\u0161im objedn\xE1vk\xE1m ani z\xE1kaznick\xE9mu \xFA\u010Dtu. S konkr\xE9tn\xED objedn\xE1vkou pom\u016F\u017Ee [podpora@okla.cz](mailto:podpora@okla.cz).

Moje odpov\u011Bdi mohou obsahovat chyby. Aktu\xE1ln\xED cenu, dostupnost a d\u016Fle\u017Eit\xE9 parametry si ov\u011B\u0159te na str\xE1nce produktu. Do chatu nepos\xEDlejte osobn\xED ani platebn\xED \xFAdaje.

**S \u010D\xEDm v\xE1m mohu pomoci?**`,s=z(e);$(s,new Date),H.push({role:"assistant",content:e}),M.textContent="Informace o AI poradci.",E()}T.addEventListener("click",()=>B(!x.classList.contains("open"))),oe.addEventListener("click",me),A.addEventListener("click",()=>{let e=x.classList.toggle("expanded");A.setAttribute("aria-pressed",String(e)),A.setAttribute("aria-label",e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"),A.title=e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"}),ie.addEventListener("click",()=>B(!1)),S.addEventListener("submit",e=>{e.preventDefault(),V(g.value)}),g.addEventListener("input",()=>{R.disabled=y||!g.value.trim(),g.style.height="auto",g.style.height=`${Math.min(g.scrollHeight,72)}px`}),g.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),S.requestSubmit())}),c.addEventListener("keydown",e=>{e.key==="Escape"&&x.classList.contains("open")&&B(!1)}),u=()=>{v+=1,C?.abort(),_.cancel(),w.hide(),k!==void 0&&clearTimeout(k)},pe()})();})();
