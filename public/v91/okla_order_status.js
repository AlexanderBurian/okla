/* OKLA V91 – "Stav objednávky" page. Our card with an order-summary box on top
   and an Alza-style status timeline below. Shown on /stav-objednavky/ (a CMS page
   the shop creates) or into any [data-okla-order-status] element.

   REAL DATA, two sources (first that yields something wins):
   1) URL query params — link to the page from the order confirmation e-mail or
      the account with Shoptet variables, e.g.
      /stav-objednavky/?code={订单号}&status={stav}&t={tracking_url}&date={datum}
      Params: code|c|order, status|s, date|d, tracking|t (full URL or a bare
      Zásilkovna number), carrier. This needs no backend and no login.
   2) An order-detail page in the DOM (the account) — best-effort: the status is
      read from known selectors or matched from the page text, the tracking link
      is reused from Shoptet's own "Sledovat zásilku" link.
   If neither is present it shows demo values with a note. Status text is mapped
   to a step tolerantly (lower-cased, diacritics removed). */
(function(){
 'use strict';
 if(window.__oklaOrderStatusV1)return;
 window.__oklaOrderStatusV1=true;

 var NS='http://www.w3.org/2000/svg';

 var CONFIG={
  params:{code:['code','c','order'],status:['status','s'],date:['date','d'],tracking:['tracking','t'],carrier:['carrier']},
  /* Public Zásilkovna tracking for a bare parcel number (used only when a full
     tracking URL is not supplied). Change here if the format ever differs. */
  packetaTrackBase:'https://tracking.packeta.com/cs/?id='
 };

 var ICONS={
  received:['M9 4h6v3H9z','M7 6h10v14H7z','M9.4 13l1.9 1.9L15 11'],
  processing:['M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3Z','M3.5 7.5 12 12l8.5-4.5','M12 12v9'],
  shipped:['M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3Z','M8.4 12.4l2 2 4.2-4.2'],
  transit:['M3 6h11v9H3z','M14 9h3.2l2.8 3v3H14','M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z','M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  delivered:['M4 11 12 4l8 7','M6 10.5V19h12v-8.5','M9.5 15l1.6 1.6L15 13']
 };

 var STEPS=[
  {label:'Objednáno',icon:'received'},
  {label:'Zpracování',icon:'processing'},
  {label:'Expedováno',icon:'shipped'},
  {label:'V přepravě',icon:'transit'},
  {label:'Doručeno',icon:'delivered'}
 ];

 /* status phrase (normalized) -> step reached; first match wins */
 var STATUS_MAP=[
  {m:['storno','zrus','zamit','vrac','odstoupen'],cancelled:true,label:'Zrušeno'},
  {m:['dorucen','vyrizen','dokoncen','vyzvednut','predano zakaznik'],step:4},
  {m:['v preprav','na ceste','ceste','dopravci','vydejn','prepravuje'],step:3},
  {m:['expedov','odeslan','pripraveno k vyzvednuti','predano doprav'],step:2},
  {m:['zpracov','potvrzen','prijata platba','platba prijata','balime','kompletuje'],step:1},
  {m:['prijat','nova','ceka','zalozen','nezaplacen','vytvoren','objednan'],step:0}
 ];

 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}

 function param(names){
  var u;try{u=new URLSearchParams(location.search)}catch(e){return ''}
  for(var i=0;i<names.length;i++){var v=u.get(names[i]);if(v)return v.trim()}
  return '';
 }

 function mapStatus(text){
  var n=norm(text);
  for(var i=0;i<STATUS_MAP.length;i++){
   if(STATUS_MAP[i].m.some(function(x){return n.indexOf(x)!==-1}))return STATUS_MAP[i];
  }
  return null;
 }

 /* Best-effort read from a Shoptet order-detail page (the account). */
 function fromDom(){
  var scope=document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  if(!scope)return null;
  var a=scope.querySelector('a[href*="zasilkovna"],a[href*="packeta"],a[href*="tracking"],a[href*="sledov"]');
  var statusEl=scope.querySelector('.order-status,[class*="order-status"],.status-name,.order-state,[class*="orderStatus"]');
  var statusText=statusEl?statusEl.textContent.trim():'';
  if(!statusText){
   var n=norm(scope.textContent||'');
   for(var i=0;i<STATUS_MAP.length;i++){
    if(STATUS_MAP[i].m.some(function(x){return n.indexOf(x)!==-1})){statusText=STATUS_MAP[i].label||'';break}
   }
  }
  var numEl=scope.querySelector('[class*="order-number"],[class*="order-code"],[class*="orderNumber"]');
  var number=numEl?(numEl.textContent.match(/\d{4,}/)||[''])[0]:'';
  if(!a&&!statusText)return null;
  return {number:number,statusLabel:statusText,trackingUrl:a?a.href:'',dateLabel:''};
 }

 function demoOrder(){
  return {number:'250042',dateLabel:'Vytvořeno 2. 11. 2025',statusLabel:'Expedováno',trackingUrl:'',carrier:'Zásilkovna',demo:true};
 }

 function getOrder(){
  var code=param(CONFIG.params.code),status=param(CONFIG.params.status),date=param(CONFIG.params.date),
      tracking=param(CONFIG.params.tracking),carrier=param(CONFIG.params.carrier);
  var base=null;
  if(code||status||tracking){
   base={number:code,statusLabel:status,dateLabel:date?('Vytvořeno '+date):'',trackingRaw:tracking,carrier:carrier};
  }else{
   base=fromDom();
  }
  /* No order in the URL and none on the page -> ask the visitor to look one up. */
  if(!base)return {needsLookup:true};

  var mapped=base.statusLabel?mapStatus(base.statusLabel):null;
  var cancelled=mapped?!!mapped.cancelled:false;
  var currentStep=mapped?(cancelled?-1:mapped.step):0;

  var trackingUrl=base.trackingUrl||'';
  if(!trackingUrl&&base.trackingRaw){
   trackingUrl=/^https?:/i.test(base.trackingRaw)?base.trackingRaw:CONFIG.packetaTrackBase+encodeURIComponent(base.trackingRaw);
  }

  return {
   number:base.number||'—',
   dateLabel:base.dateLabel||'',
   /* A recognised status shows the canonical Czech label, so e-mail links may use
      plain-ASCII status tokens (e.g. status=expedovano) and still read nicely. */
   statusLabel:cancelled?'Zrušeno':(mapped?STEPS[mapped.step].label:(base.statusLabel||STEPS[0].label)),
   currentStep:currentStep,
   cancelled:cancelled,
   trackingUrl:trackingUrl,
   carrier:base.carrier||'Zásilkovna',
   demo:!!base.demo
  };
 }

 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function svg(paths){
  var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
  paths.forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});
  return s;
 }

 function buildLookup(){
  var sec=el('section','okla-order-status');
  sec.appendChild(el('h1','okla-os-title','Stav objednávky'));
  var card=el('div','okla-os-card');
  var wrap=el('div','okla-os-lookup');
  var ico=el('div','okla-os-lookup__icon');
  /* The same 3D cardboard parcel as the checkout step track. */
  ico.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 42 14 24 23 6 14Z" fill="#ebc996"/><path d="M6 14 24 23V43L6 34Z" fill="#cf9a5f"/><path d="M42 14 24 23V43L42 34Z" fill="#b8814a"/><path d="M17.2 8.4 35.2 17.4 30.8 19.6 12.8 10.6Z" fill="#f6e6c6"/><path d="M30.8 19.6 35.2 17.4V24.4L30.8 26.6Z" fill="#e3c99d"/><path d="M10 27.5 17 31V35.2L10 31.7Z" fill="#fbf3e3"/><path d="M6 14 24 23 42 14" fill="none" stroke="#f4dcb2" stroke-width=".8" stroke-linejoin="round"/><path d="M24 23V43" stroke="#9a6a38" stroke-width=".8"/></svg>';
  wrap.appendChild(ico);
  var intro=el('p','okla-os-lookup__intro');
  intro.appendChild(document.createTextNode('Zadejte '));
  intro.appendChild(el('b',null,'číslo zásilky'));
  intro.appendChild(document.createTextNode(' a '));
  intro.appendChild(el('b',null,'PSČ'));
  intro.appendChild(document.createTextNode(' z doručovací adresy. Číslo zásilky najdete v e-mailu „Odeslaná zásilka".'));
  wrap.appendChild(intro);

  var form=el('form','okla-os-lookup__form');
  var f1=el('div','okla-os-field');
  f1.appendChild(el('label',null,'Číslo zásilky'));
  var i1=el('input');i1.type='text';i1.name='num';i1.autocomplete='off';i1.placeholder='např. Z123 456 789';
  f1.appendChild(i1);form.appendChild(f1);
  var f2=el('div','okla-os-field okla-os-field--psc');
  f2.appendChild(el('label',null,'PSČ'));
  var i2=el('input');i2.type='text';i2.name='psc';i2.inputMode='numeric';i2.autocomplete='off';i2.placeholder='110 00';
  f2.appendChild(i2);form.appendChild(f2);
  var btn=el('button','okla-os-lookup__btn');btn.type='submit';
  var btnLabel=document.createTextNode('Zobrazit stav');
  btn.appendChild(btnLabel);
  btn.appendChild(svg(['M5 12h14','M13 6l6 6-6 6']));
  form.appendChild(btn);
  wrap.appendChild(form);
  var err=el('p','okla-os-lookup__err','');
  wrap.appendChild(err);

  function setErr(msg){err.textContent=msg;wrap.classList.add('is-invalid')}
  function clearErr(){wrap.classList.remove('is-invalid')}
  function loading(on){btn.disabled=on;btnLabel.textContent=on?'Ověřuji…':'Zobrazit stav'}
  function carrierFallback(num,psc){
   location.href=location.pathname+'?t='+encodeURIComponent(num.replace(/\s+/g,''))+'&status=expedovano'+(psc?'&psc='+encodeURIComponent(psc):'');
  }

  form.addEventListener('submit',function(e){
   e.preventDefault();
   var num=(i1.value||'').trim();
   var psc=(i2.value||'').trim().replace(/\s+/g,'');
   if(!num){setErr('Zadejte prosím číslo zásilky.');return}
   clearErr();
   var api=window.__oklaApiUrl;
   /* Verified mode (order + ZIP against the Shoptet API) runs only when it is
      switched on (window.__oklaOrderStatusVerify) and the backend is reachable.
      Otherwise we go straight to carrier tracking by the parcel number — works
      with no API and no backend. */
   if(!window.__oklaOrderStatusVerify||!api){carrierFallback(num,psc);return}
   if(!psc){setErr('Pro ověření zadejte i PSČ.');return}
   loading(true);
   fetch(api+'/api/order-status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:num,zip:psc})})
    .then(function(r){return r.json().catch(function(){return {}})})
    .then(function(res){
     loading(false);
     if(res&&res.ok){
      var node=build({number:res.number,dateLabel:res.dateLabel||'',statusLabel:res.statusLabel,currentStep:typeof res.step==='number'?res.step:0,cancelled:!!res.cancelled,trackingUrl:res.trackingUrl||'',carrier:res.carrier||'Zásilkovna'});
      if(sec.parentNode)sec.parentNode.replaceChild(node,sec);
      return;
     }
     if(res&&res.configured===false){carrierFallback(num,psc);return}
     setErr('Zásilku se nepodařilo ověřit. Zkontrolujte číslo zásilky a PSČ.');
    })
    .catch(function(){loading(false);carrierFallback(num,psc)});
  });

  card.appendChild(wrap);
  sec.appendChild(card);
  return sec;
 }

 function build(order){
  if(order.needsLookup)return buildLookup();
  var sec=el('section','okla-order-status');
  sec.appendChild(el('h1','okla-os-title','Stav objednávky'));
  var card=el('div','okla-os-card');

  var head=el('div','okla-os-head');
  var main=el('div','okla-os-head__main');
  main.appendChild(el('span','okla-os-head__label','Objednávka'));
  main.appendChild(el('span','okla-os-head__num',(order.number&&order.number!=='—'?'#':'')+order.number));
  if(order.dateLabel)main.appendChild(el('span','okla-os-head__date',order.dateLabel));
  head.appendChild(main);
  var badge=el('span','okla-os-badge',order.statusLabel||'');
  if(order.cancelled)badge.classList.add('is-cancelled');
  else if(order.currentStep>=4)badge.classList.add('is-delivered');
  head.appendChild(badge);
  card.appendChild(head);

  var ol=el('ol','okla-os-steps');
  STEPS.forEach(function(step,i){
   var li=el('li','okla-os-step');
   if(order.cancelled)li.classList.add('is-upcoming');
   else if(i<order.currentStep)li.classList.add('is-done');
   else if(i===order.currentStep)li.classList.add('is-active');
   else li.classList.add('is-upcoming');
   var dot=el('span','okla-os-step__dot');
   dot.appendChild(svg(ICONS[step.icon]));
   li.appendChild(dot);
   var info=el('span','okla-os-step__info');
   info.appendChild(el('span','okla-os-step__label',step.label));
   li.appendChild(info);
   ol.appendChild(li);
  });
  card.appendChild(ol);

  var track=el('div','okla-os-track');
  var btn=el('a','okla-os-track__btn');
  btn.href=order.trackingUrl||'#';
  if(order.trackingUrl){btn.target='_blank';btn.rel='noopener'}
  btn.appendChild(document.createTextNode('Sledovat zásilku'));
  btn.appendChild(svg(['M5 12h14','M13 6l6 6-6 6']));
  if(!order.trackingUrl){btn.setAttribute('aria-disabled','true');btn.style.opacity='.5';btn.style.pointerEvents='none'}
  track.appendChild(btn);
  var note=el('span','okla-os-track__note');
  if(order.trackingUrl){
   note.appendChild(document.createTextNode('Doprava: '));
   note.appendChild(el('b',null,order.carrier));
  }else{
   note.appendChild(document.createTextNode(order.carrier+' · číslo zásilky zatím není k dispozici'));
  }
  track.appendChild(note);
  card.appendChild(track);

  sec.appendChild(card);

  if(order.demo){
   var hint=el('p','okla-os-note');
   hint.appendChild(document.createTextNode('Náhled s ukázkovými daty. Přidejte do odkazu parametry objednávky, např. '));
   hint.appendChild(el('a',null,'/stav-objednavky/?code=250042&status=Expedováno'));
   hint.appendChild(document.createTextNode(' (odkaz pošlete z potvrzovacího e-mailu se Shoptet proměnnými).'));
   sec.appendChild(hint);
  }
  return sec;
 }

 function mount(){
  if(document.querySelector('.okla-order-status'))return true;
  var target=document.querySelector('[data-okla-order-status]');
  var onPage=/^\/stav-objednavky(\/|$)/.test(location.pathname);
  if(!target&&!onPage)return false;
  var host=target||document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  var node=build(getOrder());
  if(target){
   target.appendChild(node);
  }else{
   /* On the dedicated page we take over the content area so nothing Shoptet
      rendered (e.g. its 404 when the CMS page is missing) shows behind us. */
   document.documentElement.classList.add('okla-os-takeover');
   host.insertBefore(node,host.firstChild);
   document.title='Stav objednávky';
  }
  return true;
 }

 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
