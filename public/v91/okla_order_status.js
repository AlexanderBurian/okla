/* OKLA V91 – "Stav objednávky" page (structure + look only for now).
   Renders our card with an order-summary box at the top and an Alza-style status
   timeline below. Shown on the /stav-objednavky/ page (a CMS page the shop
   creates) or into any element marked [data-okla-order-status].

   DATA IS A PLACEHOLDER. getOrder() returns demo values so the structure is
   visible; later it will read the real order (from a query param, the account
   order detail, or the AI backend) and the carrier state from Zásilkovna. */
(function(){
 'use strict';
 if(window.__oklaOrderStatusV1)return;
 window.__oklaOrderStatusV1=true;

 var NS='http://www.w3.org/2000/svg';
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

 /* -------- PLACEHOLDER DATA -------- */
 function getOrder(){
  return {
   number:'250042',
   dateLabel:'Vytvořeno 2. 11. 2025',
   statusLabel:'Expedováno',
   currentStep:2,            /* 0..4; the active step. 4 = doručeno, -1 = cancelled */
   cancelled:false,
   stepSubs:['2. 11.','2. 11.','dnes','',''],
   trackingUrl:'',           /* reused from Shoptet's own "Sledovat zásilku" link later */
   trackingNote:'Zásilkovna'
  };
 }

 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 function svg(paths){
  var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
  paths.forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p)});
  return s;
 }

 function build(order){
  var sec=el('section','okla-order-status');
  sec.appendChild(el('h1','okla-os-title','Stav objednávky'));

  var card=el('div','okla-os-card');

  /* box at the top: order summary */
  var head=el('div','okla-os-head');
  var main=el('div','okla-os-head__main');
  main.appendChild(el('span','okla-os-head__label','Objednávka'));
  main.appendChild(el('span','okla-os-head__num','#'+order.number));
  if(order.dateLabel)main.appendChild(el('span','okla-os-head__date',order.dateLabel));
  head.appendChild(main);
  var badge=el('span','okla-os-badge',order.statusLabel||'');
  if(order.cancelled)badge.classList.add('is-cancelled');
  else if(order.currentStep>=4)badge.classList.add('is-delivered');
  head.appendChild(badge);
  card.appendChild(head);

  /* timeline */
  var ol=el('ol','okla-os-steps');
  STEPS.forEach(function(step,i){
   var li=el('li','okla-os-step');
   if(order.cancelled){li.classList.add('is-upcoming')}
   else if(i<order.currentStep)li.classList.add('is-done');
   else if(i===order.currentStep)li.classList.add('is-active');
   else li.classList.add('is-upcoming');
   var dot=el('span','okla-os-step__dot');
   dot.appendChild(svg(ICONS[step.icon]));
   li.appendChild(dot);
   var info=el('span','okla-os-step__info');
   info.appendChild(el('span','okla-os-step__label',step.label));
   var sub=order.stepSubs&&order.stepSubs[i];
   if(sub)info.appendChild(el('span','okla-os-step__sub',sub));
   li.appendChild(info);
   ol.appendChild(li);
  });
  card.appendChild(ol);

  /* tracking row */
  var track=el('div','okla-os-track');
  var btn=el('a','okla-os-track__btn');
  btn.href=order.trackingUrl||'#';
  btn.appendChild(document.createTextNode('Sledovat zásilku'));
  btn.appendChild(svg(['M5 12h14','M13 6l6 6-6 6']));
  if(!order.trackingUrl){btn.setAttribute('aria-disabled','true');btn.style.opacity='.55';btn.style.pointerEvents='none'}
  track.appendChild(btn);
  var note=el('span','okla-os-track__note');
  note.appendChild(document.createTextNode((order.trackingNote||'Zásilkovna')+' · '));
  var b=el('b',null,'číslo zásilky doplní Shoptet');
  note.appendChild(b);
  track.appendChild(note);
  card.appendChild(track);

  sec.appendChild(card);

  var hint=el('p','okla-os-note');
  hint.appendChild(document.createTextNode('Náhled struktury s ukázkovými daty. Stav a číslo zásilky se po napojení načtou z vaší objednávky. '));
  sec.appendChild(hint);

  return sec;
 }

 function mount(){
  if(document.querySelector('.okla-order-status'))return true;
  var target=document.querySelector('[data-okla-order-status]');
  var onPage=/^\/stav-objednavky(\/|$)/.test(location.pathname);
  if(!target&&!onPage)return false;
  var host=target||document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  var node=build(getOrder());
  if(target)target.appendChild(node);
  else host.insertBefore(node,host.firstChild);
  return true;
 }

 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
