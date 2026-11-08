"use strict";(()=>{var Le=Object.defineProperty;var Te=(n,t,l)=>t in n?Le(n,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):n[t]=l;var j=(n,t,l)=>Te(n,typeof t!="symbol"?t+"":t,l);var Ae="assets/okla-robot-launcher.png";function q(n,t){let{scriptSrc:l,apiUrl:u,assetBaseUrl:m,locationOrigin:p}=n,g;return m?g=new URL(m.endsWith("/")?m:`${m}/`,p):u?g=new URL(u.endsWith("/")?u:`${u}/`,p):l?g=new URL(".",l):g=new URL(p.endsWith("/")?p:`${p}/`),new URL(t,g).toString()}function oe(n){return q(n,Ae)}function J(n){let t=n.dataset.fallbackClass||"robot-fallback",l=()=>{n.hidden=!0,n.parentElement?.classList.add(t)};n.addEventListener("error",l,{once:!0}),queueMicrotask(()=>{n.complete&&n.naturalWidth===0&&l()})}var Me=new Intl.DateTimeFormat("cs-CZ",{hour:"2-digit",minute:"2-digit",hourCycle:"h23"});function ie(n){return Me.format(n)}function se(n,t,l){let u=n.ownerDocument.createElement("time");return u.className=l,u.dateTime=t.toISOString(),u.textContent=ie(t),n.replaceChildren(u),u}function Se(n){let t=n.createElement("div");t.className="typing-row",t.dataset.state="typing",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-label","Pracuji na odpov\u011Bdi");let l=n.createElement("span");l.className="typing-dots",l.setAttribute("aria-hidden","true");for(let m=0;m<3;m+=1){let p=n.createElement("span");p.className="typing-dot",l.append(p)}let u=n.createElement("span");return u.className="typing-label",u.textContent="Pracuji na odpov\u011Bdi\u2026",t.append(l,u),t}var B=class{constructor(){j(this,"row")}show(t){return this.hide(),this.row=Se(t.ownerDocument),t.append(this.row),this.row}hide(){this.row?.remove(),this.row=void 0}moveToEnd(t){this.row?.isConnected&&t.append(this.row)}isVisible(){return this.row?.isConnected??!1}},$=class{constructor(){j(this,"timer");j(this,"generation",0)}schedule(t,l=new Date,u=500){this.cancel();let m=this.generation;t.replaceChildren(),t.classList.remove("visible"),this.timer=setTimeout(()=>{if(m!==this.generation||!t.isConnected)return;let p=t.ownerDocument.createElement("span");p.className="receipt-check",p.setAttribute("aria-hidden","true"),p.textContent="\u2713";let g=t.ownerDocument.createElement("span");g.textContent="Doru\u010Deno";let y=t.ownerDocument.createElement("time");y.dateTime=l.toISOString(),y.textContent=ie(l),t.setAttribute("aria-label",`Doru\u010Deno ${y.textContent}`),t.append(p,g,y),t.classList.add("visible"),this.timer=void 0},u)}cancel(){this.generation+=1,this.timer!==void 0&&clearTimeout(this.timer),this.timer=void 0}hasPendingTimer(){return this.timer!==void 0}};(()=>{let n="okla-ai-chat";if(document.querySelector(n))return;let t=["localhost","127.0.0.1"].includes(window.location.hostname),l=document.body.matches(".type-index, .type-category, .type-detail, .type-search, .type-manufacturer")||!!document.querySelector("#content .p-detail");if(document.body.matches(".ordering-process, .in-kontakty, .type-cart")||/^\/(?:kosik|objednavka|objednavky|kontakt|kontakty|cart|checkout)(?:\/|$)/i.test(window.location.pathname)||!t&&!l)return;let m=document.currentScript,p=(m?.dataset.apiUrl||(m?.src?new URL(m.src).origin:"")).replace(/\/$/,"");p&&fetch(`${p}/health`,{mode:"cors",cache:"no-store"}).catch(()=>{});let g={scriptSrc:m?.src,apiUrl:m?.dataset.apiUrl||p,assetBaseUrl:m?.dataset.assetBaseUrl,locationOrigin:window.location.origin},y=oe(g),re=q(g,"assets/okla-brand-logo.png"),le=q(g,"assets/okla-assistant-avatar.png"),X=()=>{};customElements.get(n)||customElements.define(n,class extends HTMLElement{disconnectedCallback(){X()}});let Y=document.createElement(n),h=Y.attachShadow({mode:"open"});document.body.append(Y);let ce='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',de='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',pe='<svg class="collapse-desktop-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6.5 9 5.5 5.5L17.5 9"/></svg>',ue='<svg class="mobile-close-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>',me='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>',P='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.5 6A2.5 2.5 0 0 1 5 3.5h7A2.5 2.5 0 0 1 14.5 6v3A2.5 2.5 0 0 1 12 11.5H7.2L4 14.2A.55.55 0 0 1 3 13.8V11.4A2.5 2.5 0 0 1 2.5 9V6z"/><path d="M16 8.5h3A2.5 2.5 0 0 1 21.5 11v3a2.5 2.5 0 0 1-2 2.45V19a.55.55 0 0 1-.9.43L15.3 17H13a2.5 2.5 0 0 1-2.45-2H12A4 4 0 0 0 16 11v-2.5z"/></svg>';h.innerHTML=`
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
        font-family: "Exo 2", Arial, sans-serif;
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
        width: 116px;
        height: 30px;
        background: transparent;
        transform: translate(-50%, -50%);
        display: block;
      }
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
      .mobile-close-icon { display: none; }
      .messages {
        min-height: 0;
        overflow: auto;
        overscroll-behavior: contain;
        padding: 0 20px;
        background: #fff;
        scrollbar-width: thin;
        scrollbar-color: #bdcada transparent;
      }
      .welcome { display: flex; min-height: 100%; flex-direction: column; padding: 30px 0 8px; }
      .welcome-input { margin-top: 0; }
      .welcome-input .composer { border-color: #e4e9f1; box-shadow: 0 1px 3px rgba(16, 40, 80, .05); }
      .welcome-input .composer:focus-within { border-color: #1f6fd8; box-shadow: inset 0 0 0 1px #1f6fd8; }
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
      .typing-row { display: flex; height: 25px; align-items: center; gap: 8px; margin: -2px 0 11px; padding-left: 0; color: #747b86; font-size: 11.5px; line-height: 16px; animation: message-in .18s ease both; }
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
      .composer:focus-within { border-color: #1f6fd8; box-shadow: inset 0 0 0 1px #1f6fd8; }
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
        font-size: 16px;
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
          left: -19.7px;
          right: auto;
          top: clamp(180px, 82dvh, calc(100dvh - 86px));
          bottom: auto;
          width: 45.5px;
          height: 80.7px;
          border: 2px solid #fff;
          border-radius: 0 23.8px 23.8px 0;
          padding: 5.75px;
          background: linear-gradient(160deg, #254daa 4%, #38369c 50%, #6d2d96 100%);
          color: #fff;
          box-shadow: 3.5px 5px 12px rgba(22, 25, 72, .3);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(-50%) translateX(-118%) scale(.94);
          transform-origin: center;
          transition: opacity .34s ease, transform .56s cubic-bezier(.16, 1, .3, 1), visibility 0s linear .56s, box-shadow .22s ease;
        }
        :host(.mobile-launcher-visible) .launcher {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(-50%) translateX(0) scale(1);
          transition: opacity .34s ease, transform .56s cubic-bezier(.16, 1, .3, 1), visibility 0s, box-shadow .22s ease;
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
          left: calc(50% + 6.5px);
          right: auto;
          display: block;
          width: 16.6px;
          height: 16.6px;
          border-radius: 0;
          transform: translate(-50%, -50%);
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
          inset: 0;
          width: 100%;
          height: 100dvh;
          min-height: 0;
          max-height: none;
          border: 0;
          border-radius: 0;
          padding-top: env(safe-area-inset-top);
          padding-right: env(safe-area-inset-right);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          transform: translateY(28px) scale(.985);
          transform-origin: center bottom;
          transition: opacity .3s ease, transform .46s cubic-bezier(.16, 1, .3, 1), visibility 0s linear .46s;
        }
        .panel.open {
          transform: translateY(0) scale(1);
          transition: opacity .3s ease, transform .46s cubic-bezier(.16, 1, .3, 1), visibility 0s;
        }
        .expand { display: none; }
        .collapse .collapse-desktop-icon { display: none; }
        .collapse .mobile-close-icon { display: block; width: 22px; height: 22px; stroke-width: 2; }
        .collapse { width: 42px; height: 42px; }
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
      <section class="welcome" aria-label="OKLA.cz">
        <div class="welcome-input"></div>
        <div class="suggestions">
          <div class="suggestions-list">
            <button class="suggested" type="button">${P}<span>Pomozte mi vybrat elektroniku</span></button>
            <button class="suggested" type="button">${P}<span>Doporu\u010Dte m\u011B\u0159ic\xED techniku pro projekt</span></button>
            <button class="suggested" type="button">${P}<span>Porad\xEDte s dopravou a vr\xE1cen\xEDm?</span></button>
          </div>
        </div>
      </section>
    </template>
    <section class="panel" id="okla-panel" role="dialog" aria-modal="false" aria-label="AI poradce OKLA" aria-hidden="true">
      <header class="topbar">
        <div class="topbar-group">
          <button class="top-action info-control" type="button" aria-label="Informace o AI poradci" title="Informace o AI poradci">${ce}</button>
        </div>
        <span class="brand-mini" aria-hidden="true"><img data-brand-image data-fallback-class="brand-fallback" src="${re}" alt=""></span>
        <div class="topbar-group">
          <button class="top-action expand" type="button" aria-label="Zv\u011Bt\u0161it chat" aria-pressed="false" title="Zv\u011Bt\u0161it chat">${de}</button>
          <button class="top-action collapse" type="button" aria-label="Zav\u0159\xEDt chat" title="Zav\u0159\xEDt chat">${pe}${ue}</button>
        </div>
      </header>
      <div class="messages" id="okla-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="composer-area">
        <form class="composer">
          <label class="sr-only" for="okla-input">Napi\u0161te dotaz</label>
          <textarea id="okla-input" rows="1" maxlength="1200" placeholder="Zeptejte se na cokoliv\u2026" aria-describedby="okla-disclaimer"></textarea>
          <button class="send" type="submit" aria-label="Odeslat zpr\xE1vu" disabled>${me}</button>
        </form>
        <p class="disclaimer" id="okla-disclaimer">Odpov\u011Bdi vytv\xE1\u0159\xED AI. Ov\u011B\u0159te d\u016Fle\u017Eit\xE9 informace a nepos\xEDlejte osobn\xED \xFAdaje.</p>
      </div>
    </section>
    <button class="launcher" type="button" aria-label="Otev\u0159\xEDt OKLA poradce" aria-controls="okla-panel" aria-expanded="false">
      <img class="launcher-desktop-icon" data-robot-image src="${y}" alt="">
      <svg class="launcher-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="10.5" r="6.5"></circle><path d="m8.5 15.5-5 5"></path></svg>
    </button>
    <div class="sr-only" id="okla-status" role="status" aria-live="assertive"></div>`;let x=h.querySelector(".panel"),z=h.querySelector(".launcher"),he=h.querySelector(".info-control"),O=h.querySelector(".expand"),be=h.querySelector(".collapse"),b=h.querySelector(".messages"),fe=h.querySelector("#welcome-template"),I=h.querySelector("form"),f=h.querySelector("textarea"),Z=h.querySelector(".send"),_=h.querySelector(".composer-area"),ge=h.querySelector(".disclaimer"),U=h.querySelector("#okla-status"),G=new $,L=new B;h.querySelectorAll("[data-robot-image], [data-mobile-assistant-image], [data-brand-image], [data-assistant-avatar]").forEach(J);let N=[],T=!1,A=null,M,k=0,S=window.matchMedia("(max-width: 466px)"),Q=!S.matches;function E(){let e=Math.min(520,Math.max(320,window.innerHeight*.55));(!S.matches||window.scrollY>=e)&&(Q=!0),Y.classList.toggle("mobile-launcher-visible",Q)}window.addEventListener("scroll",E,{passive:!0}),S.addEventListener("change",E),E();function K(e){x.classList.toggle("open",e),x.setAttribute("aria-hidden",String(!e)),x.setAttribute("aria-modal",String(e&&S.matches)),z.setAttribute("aria-expanded",String(e)),z.setAttribute("aria-label",e?"Zav\u0159\xEDt OKLA poradce":"Otev\u0159\xEDt OKLA poradce"),M!==void 0&&clearTimeout(M),e?M=setTimeout(()=>f.focus(),180):z.focus(),E()}function H(){b.scrollTop=b.scrollHeight}function xe(e){try{let s=new URL(e,window.location.href);return["http:","https:","mailto:"].includes(s.protocol)?s.toString():void 0}catch{return}}function C(e){return e.replace(/-{2,}/g,"\u2014")}function ee(e,s){let r=/\*\*([^*\n]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g,i=0;for(let a of s.matchAll(r)){let o=a.index??0;if(e.append(document.createTextNode(C(s.slice(i,o)))),a[1]!==void 0){let d=document.createElement("strong");d.textContent=C(a[1]),e.append(d)}else{let d=xe(a[3]??"");if(d){let c=document.createElement("a");c.textContent=C(a[2]??d),c.href=d,/^https?:/i.test(d)&&(c.target="_blank",c.rel="noopener noreferrer"),e.append(c)}else e.append(document.createTextNode(C(a[0])))}i=o+a[0].length}e.append(document.createTextNode(C(s.slice(i))))}let D=/^\s*[-•*]\s+/;function V(e,s){e.replaceChildren();let r=s.split(`
`),i=0;for(;i<r.length;)if(D.test(r[i])){let a=document.createElement("ul");for(a.className="md-list";i<r.length&&D.test(r[i]);){let o=document.createElement("li");ee(o,r[i].replace(D,"")),a.append(o),i+=1}e.append(a)}else{let a=[];for(;i<r.length&&!D.test(r[i]);)a.push(r[i]),i+=1;for(;a.length&&a[a.length-1].trim()==="";)a.pop();for(;a.length&&a[0].trim()==="";)a.shift();if(a.length){let o=document.createElement("div");o.className="md-par",ee(o,a.join(`
`)),e.append(o)}}}function ve(e,s=new Date){let r=document.createElement("div");r.className="message-row user";let i=document.createElement("div");i.className="message-stack";let a=document.createElement("div");a.className="bubble",a.textContent=e;let o=document.createElement("div");o.className="delivery-slot",o.setAttribute("aria-live","polite"),i.append(a,o),r.append(i),b.append(r),G.schedule(o,s),H()}function R(e=""){let s=document.createElement("div");s.className="message-row assistant";let r=document.createElement("span");r.className="assistant-avatar",r.setAttribute("aria-hidden","true");let i=document.createElement("img");i.src=le,i.alt="",i.dataset.assistantAvatar="",i.dataset.fallbackClass="avatar-fallback",r.append(i),J(i);let a=document.createElement("div");a.className="message-stack assistant-stack";let o=document.createElement("div");o.className="bubble",V(o,e);let d=document.createElement("div");return d.className="assistant-time-slot",a.append(o,d),s.append(r,a),b.append(s),H(),{row:s,bubble:o,timeSlot:d}}function W(e,s=new Date){se(e.timeSlot,s,"assistant-time")}function we(){b.querySelectorAll(".suggested").forEach(e=>{e.addEventListener("click",()=>{ae(e.textContent||"")})})}function ye(){b.replaceChildren(fe.content.cloneNode(!0)),b.classList.remove("conversation"),x.classList.remove("chatting");let e=b.querySelector(".welcome-input");e&&e.append(I),_.hidden=!0,we(),b.scrollTop=0}function te(){x.classList.contains("chatting")||(_.hidden=!1,_.insertBefore(I,ge),b.querySelector(".welcome")&&b.replaceChildren(),b.classList.add("conversation"),x.classList.add("chatting"))}async function ke(e,s){if(!e.ok){let o="Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";try{o=(await e.json()).error||o}catch{}throw new Error(o)}if(!e.body)throw new Error("Server neposlal datov\xFD proud.");let r=e.body.getReader(),i=new TextDecoder,a="";for(;;){let{done:o,value:d}=await r.read();a+=i.decode(d,{stream:!o});let c=a.split(/\r?\n\r?\n/);a=c.pop()??"";for(let v of c){let w=v.match(/^event:\s*(.+)$/m)?.[1],ne=v.match(/^data:\s*(.+)$/m)?.[1];if(!ne)continue;let F=JSON.parse(ne);if(w==="token"&&F.text&&s(F.text),w==="error")throw new Error(F.message||"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.")}if(o)break}}async function ae(e){let s=e.trim();if(!s||T)return;let r=++k;T=!0,Z.disabled=!0,f.disabled=!0,te(),ve(s,new Date);let i=N.slice(-12);N.push({role:"user",content:s}),f.value="",f.style.height="auto",L.show(b),U.textContent="",A=new AbortController;let a=!1,o=window.setTimeout(()=>{a=!0,A?.abort()},15e3),d="",c=null;try{let v=await fetch(`${p}/api/chat`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message:s,history:i}),signal:A.signal});if(await ke(v,w=>{r===k&&(o!==void 0&&(clearTimeout(o),o=void 0),d+=w,c||(c=R(),L.moveToEnd(b)),V(c.bubble,d),H())}),r!==k)return;if(!d)throw new Error("Server neposlal odpov\u011B\u010F.");c||(c=R(d)),W(c,new Date),N.push({role:"assistant",content:d}),U.textContent="Odpov\u011B\u010F je hotov\xE1."}catch(v){if(r!==k||v.name==="AbortError"&&!a)return;let w=a?"Odpov\u011B\u010F trvala p\u0159\xEDli\u0161 dlouho. Zkuste dotaz pros\xEDm znovu.":v instanceof Error?v.message:"Odpov\u011B\u010F se nepoda\u0159ilo na\u010D\xEDst.";L.hide(),c||(c=R()),V(c.bubble,`Omlouv\xE1m se, n\u011Bco se nepovedlo: ${w} Zkuste dotaz odeslat znovu.`),c.bubble.setAttribute("role","alert"),W(c,new Date),U.textContent=w}finally{if(o!==void 0&&clearTimeout(o),L.hide(),r!==k)return;T=!1,f.disabled=!1,Z.disabled=!f.value.trim(),A=null,f.focus(),H()}}function Ee(){if(T)return;te();let e=`Jsem **OKLA poradce**, virtu\xE1ln\xED asistent s um\u011Blou inteligenc\xED.

- Pomohu v\xE1m vybrat elektroniku podle pou\u017Eit\xED, rozpo\u010Dtu a po\u017Eadovan\xFDch funkc\xED.
- Vysv\u011Btl\xEDm vlastnosti produkt\u016F a porad\xEDm s informacemi o n\xE1kupu z dostupn\xFDch podklad\u016F.
- Nem\xE1m p\u0159\xEDstup k va\u0161im objedn\xE1vk\xE1m ani z\xE1kaznick\xE9mu \xFA\u010Dtu. S konkr\xE9tn\xED objedn\xE1vkou pom\u016F\u017Ee [podpora@okla.cz](mailto:podpora@okla.cz).

Moje odpov\u011Bdi mohou obsahovat chyby. Aktu\xE1ln\xED cenu, dostupnost a d\u016Fle\u017Eit\xE9 parametry si ov\u011B\u0159te na str\xE1nce produktu. Do chatu nepos\xEDlejte osobn\xED ani platebn\xED \xFAdaje.

**S \u010D\xEDm v\xE1m mohu pomoci?**`,s=R(e);W(s,new Date),N.push({role:"assistant",content:e}),U.textContent="Informace o AI poradci.",H()}z.addEventListener("click",()=>K(!x.classList.contains("open"))),he.addEventListener("click",Ee),O.addEventListener("click",()=>{let e=x.classList.toggle("expanded");O.setAttribute("aria-pressed",String(e)),O.setAttribute("aria-label",e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"),O.title=e?"Zmen\u0161it chat":"Zv\u011Bt\u0161it chat"}),be.addEventListener("click",()=>K(!1)),I.addEventListener("submit",e=>{e.preventDefault(),ae(f.value)}),f.addEventListener("input",()=>{Z.disabled=T||!f.value.trim(),f.style.height="auto",f.style.height=`${Math.min(f.scrollHeight,72)}px`}),f.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),I.requestSubmit())}),h.addEventListener("keydown",e=>{e.key==="Escape"&&x.classList.contains("open")&&K(!1)}),X=()=>{k+=1,A?.abort(),G.cancel(),L.hide(),M!==void 0&&clearTimeout(M),window.removeEventListener("scroll",E),S.removeEventListener("change",E)},ye()})();})();
