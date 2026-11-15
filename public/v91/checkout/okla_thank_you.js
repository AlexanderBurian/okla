/* OKLA – the thank-you page after an order is sent (/objednavka/dekujeme/).
   Shoptet prints a heading, the order number, a "Platba a doručení" table and an "Obsah objednávky" table. Neither
   table is shown here; the page is only:
   - a thank-you header with the order number and the order-tracking / continue-shopping buttons, and
   - for a plain bank transfer ("Převodem") only: a payment card with a QR payment (Czech "QR Platba", SPAYD) for the
     shop's account, the amount to pay and the variable symbol (the order number, as Shoptet uses it), plus the same
     details to type in by hand.
   Cash on delivery, card / Apple Pay / Google Pay and payment-gateway transfers (paid automatically) get no payment
   card. The amount and the payment method are read from Shoptet's own table; nothing is invented. Anything else
   Shoptet puts on the page (conversion scripts, a registration offer) stays where it is. */
(function(){
 'use strict';
 if(window.__oklaThankYouV1)return;window.__oklaThankYouV1=true;

 function txt(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
 function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 /* line icons on a 24px grid; drawn with explicit attributes so no site-wide svg rule can change them */
 function svg(d,cls){return '<svg class="okla-ty-ic '+(cls||'')+'" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+
  d.split('|').map(function(p){return '<path d="'+p+'"/>'}).join('')+'</svg>'}
 var IC={
  check:'M5 12.5l4.5 4.5L19 7',
  copy:'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z|M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1'
 };
 /* the shop's bank account for payments by bank transfer */
 var BANK={iban:'CZ3203000000000361065328',account:'361065328/0300'};
 var QR_LIB='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';

 function isThankYou(){
  if(/^\/objednavka\/dekujeme\/?$/.test(location.pathname))return true;
  if(document.body&&/(^|\s)in-dekujeme(\s|$)/.test(document.body.className))return true;
  var h=document.querySelector('#content h1');
  return !!h&&/objednavka (byla )?odeslana/.test(norm(txt(h)));
 }

 /* Shoptet's label/value table: shipping, payment, amount to pay */
 function readFacts(main){
  var tables=[].slice.call(main.querySelectorAll('table'));
  for(var i=0;i<tables.length;i++){
   var t=tables[i];if(t.querySelector('img'))continue;
   var rows=[].slice.call(t.rows||[]).map(function(r){var c=r.cells;return c.length>=2?{label:txt(c[0]).replace(/:\s*$/,''),value:txt(c[c.length-1])}:null}).filter(function(x){return x&&x.label&&x.value});
   if(rows.length&&rows.some(function(r){return /doprav|platb|uhrad/.test(norm(r.label))}))return {table:t,rows:rows};
  }
  return null;
 }
 /* the innermost element whose text matches (a heading, the "Číslo …" line, the closing lines) */
 function short(main,re,skip){
  var all=[].slice.call(main.querySelectorAll('h1,h2,h3,h4,h5,p,div,span,strong,td,a')).filter(function(el){
   var s=txt(el);
   return s&&s.length<=120&&!el.querySelector('table')&&!(skip&&skip.some(function(x){return x.contains(el)}))&&!el.closest('.okla-ty')&&re.test(norm(s));
  });
  all=all.filter(function(el){return !all.some(function(o){return o!==el&&el.contains(o)})});
  var el=all[0];if(!el)return null;
  /* the outermost element that still holds only this text */
  while(el.parentElement&&el.parentElement!==main&&txt(el.parentElement)===txt(el))el=el.parentElement;
  return el;
 }
 function hide(el){if(el)el.classList.add('okla-ty-src')}

 /* a plain bank transfer only (not a gateway / instant transfer, card, Apple Pay, Google Pay or cash on delivery) */
 function payment(rows,number){
  var method=rows.filter(function(r){return /platb/.test(norm(r.label))})[0];
  var m=method?norm(method.value):'';
  if(!/prevod/.test(m)||/online|okamzit|rychl|brana|gopay|comgate|thepay|shoptet ?pay|apple|google|kart|dobir/.test(m))return null;
  var amountRow=rows.filter(function(r){return /uhrad|celkem/.test(norm(r.label))})[0];
  var vs=String(number||'').replace(/\D/g,'');
  if(!amountRow||!vs||vs.length>10)return null;
  var a=amountRow.value.replace(/[^\d,.]/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');
  var n=parseFloat(a);if(!(n>0))return null;
  var amount=n.toFixed(2);
  return {vs:vs,amount:amount,amountText:amountRow.value,
   spd:'SPD*1.0*ACC:'+BANK.iban+'*AM:'+amount+'*CC:CZK*X-VS:'+vs+'*MSG:OKLA OBJEDNAVKA '+vs};
 }

 function build(){
  var main=document.querySelector('main#content')||document.getElementById('content');
  if(!main||main.querySelector('.okla-ty'))return;
  var facts=readFacts(main);
  var itemTables=[].slice.call(main.querySelectorAll('table')).filter(function(t){return t.querySelector('img')});
  var tables=(facts?[facts.table]:[]).concat(itemTables);
  var h1=main.querySelector('h1');
  var numEl=short(main,/^cislo( objednavky)?\s*:?\s*\S+/,tables);
  if(!facts&&!numEl)return;
  var number=numEl?txt(numEl).replace(/^\S+\s+(objednávky\s*)?:?\s*/i,''):'';
  var hFacts=short(main,/^platba a doruceni$/,tables),hItems=short(main,/^obsah objednavky$/,tables);
  var mailEl=short(main,/^rekapitulaci .*e-?mail/,tables),thanksEl=short(main,/^dekujeme[!.]?$/,tables);
  var sentEl=short(main,/^objednavka (byla )?odeslana[!.]?$/,tables),backEl=short(main,/^zpet do obchodu$/,tables);

  var title=h1&&txt(h1)?txt(h1):'Děkujeme za objednávku';
  title=title.charAt(0).toUpperCase()+title.slice(1).toLowerCase();
  var mailLine=(mailEl&&txt(mailEl).match(/rekapitulaci[^.!]*[.!]/i)||['Rekapitulaci vám zašleme i e-mailem.'])[0].replace(/Vám/g,'vám');
  var pay=facts&&payment(facts.rows,number);

  var html='<section class="okla-ty'+(pay?' okla-ty--pay':'')+'" aria-labelledby="okla-ty-title">'+
   '<header class="okla-ty__head">'+
    '<span class="okla-ty__ok">'+svg(IC.check)+'</span>'+
    '<h1 id="okla-ty-title" class="okla-ty__title">'+esc(title)+'</h1>'+
    '<p class="okla-ty__lead">Objednávka byla odeslána. '+esc(mailLine)+'</p>'+
    (number?'<p class="okla-ty__num"><span>Číslo objednávky</span><strong>'+esc(number)+'</strong></p>':'')+
   '</header>';
  if(pay){
   var row=function(label,value,copy,big){return '<div class="okla-ty__prow'+(big?' okla-ty__prow--big':'')+'"><dt>'+label+'</dt><dd><span class="okla-ty__pval">'+esc(value)+'</span>'+
    '<button type="button" class="okla-ty__copy" data-copy="'+esc(copy)+'" aria-label="Zkopírovat: '+label+'" title="Zkopírovat">'+svg(IC.copy,'okla-ty__cp')+svg(IC.check,'okla-ty__copied')+'</button></dd></div>'};
   html+='<div class="okla-ty__pay">'+
    '<div class="okla-ty__payhead">'+
     '<div><h2 class="okla-ty__h">Zaplaťte převodem</h2><p class="okla-ty__paylead">Uhraďte objednávku přes QR kód, nebo zadejte platbu ručně.</p></div>'+
    '</div>'+
    '<div class="okla-ty__paybody">'+
     '<figure class="okla-ty__qrbox">'+
      '<div class="okla-ty__qr" data-spd="'+esc(pay.spd)+'" role="img" aria-label="QR kód pro platbu '+esc(pay.amountText)+'"></div>'+
      '<figcaption>Naskenujte v aplikaci své banky</figcaption>'+
     '</figure>'+
     '<dl class="okla-ty__pdl">'+
      row('Částka k úhradě',pay.amountText,pay.amount.replace('.',','),true)+
      row('Číslo účtu',BANK.account,BANK.account)+
      row('IBAN',BANK.iban.replace(/(.{4})/g,'$1 ').trim(),BANK.iban)+
      row('Variabilní symbol',pay.vs,pay.vs)+
     '</dl>'+
    '</div>'+
    '<p class="okla-ty__paynote">QR kód pro platbu najdete i v potvrzovacím e-mailu.</p>'+
   '</div>';
  }
  html+='<div class="okla-ty__actions">'+
    '<a class="okla-ty__btn okla-ty__btn--primary" href="/stav-objednavky/">Sledovat objednávku</a>'+
    '<a class="okla-ty__btn okla-ty__btn--ghost" href="/">Pokračovat v nákupu</a>'+
   '</div>'+
  '</section>';

  var box=document.createElement('div');box.innerHTML=html;var sec=box.firstChild;
  var anchor=h1||numEl||tables[0];
  /* insert at the top level of the content so no Shoptet wrapper narrows it */
  var top=anchor;while(top.parentElement&&top.parentElement!==main&&!top.parentElement.classList.contains('content-inner'))top=top.parentElement;
  top.parentNode.insertBefore(sec,top);
  [h1,numEl,hFacts,hItems,mailEl,thanksEl,sentEl,backEl].concat(tables).forEach(hide);
  /* a wrapper that held only what is now hidden would leave an empty gap */
  [].slice.call(main.querySelectorAll('.okla-ty-src')).forEach(function(el){
   var p=el.parentElement;
   while(p&&p!==main&&!p.contains(sec)){
    var visible=[].slice.call(p.children).some(function(c){return !c.classList.contains('okla-ty-src')&&!/^(SCRIPT|STYLE|NOSCRIPT|BR)$/.test(c.tagName)&&(txt(c)||c.querySelector('img,iframe,canvas,svg,form,input'))});
    if(visible)break;p.classList.add('okla-ty-src');p=p.parentElement;
   }
  });
  document.documentElement.classList.add('okla-ty-page');
  if(pay)drawQr(sec.querySelector('.okla-ty__qr'));
  sec.addEventListener('click',copyClick);
 }

 /* The QR code as crisp squares: whole-pixel modules, one path, black on white, no smoothing between modules. */
 function drawQr(box){
  if(!box)return;
  function paint(){
   try{
    var q=window.qrcode(0,'M');q.addData(box.getAttribute('data-spd'));q.make();
    /* every module is a whole number of screen pixels, also under the desktop page zoom and on HiDPI screens */
    var n=q.getModuleCount(),k=(box.currentCSSZoom||window.__oklaDZ||1)*(window.devicePixelRatio||1);
    var dev=Math.max(4,Math.floor(224*k/n)),css=n*dev/k,d='';
    for(var r=0;r<n;r++){
     for(var c=0;c<n;c++){
      if(!q.isDark(r,c))continue;
      var run=1;while(c+run<n&&q.isDark(r,c+run))run++;
      d+='M'+c+' '+r+'h'+run+'v1h-'+run+'z';
      c+=run-1;
     }
    }
    box.innerHTML='<svg class="okla-ty__qrsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+n+' '+n+'" shape-rendering="crispEdges" aria-hidden="true"><rect width="'+n+'" height="'+n+'" fill="#ffffff"/><path fill="#000000" d="'+d+'"/></svg>';
    box.style.setProperty('--qr',css.toFixed(3)+'px');
    box.classList.add('is-ready');
   }catch(e){fail()}
  }
  function fail(){box.classList.add('is-failed');box.innerHTML='<span>QR kód se nepodařilo zobrazit. Použijte prosím údaje vedle.</span>'}
  if(window.qrcode)return paint();
  var s=document.createElement('script');s.src=QR_LIB;s.async=true;s.onload=function(){window.qrcode?paint():fail()};s.onerror=fail;
  document.head.appendChild(s);
 }
 function copyClick(e){
  var b=e.target.closest&&e.target.closest('.okla-ty__copy');if(!b)return;
  var v=b.getAttribute('data-copy')||'';
  function done(){b.classList.add('is-done');setTimeout(function(){b.classList.remove('is-done')},1600)}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(done,function(){});
  else{var t=document.createElement('textarea');t.value=v;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(err){}t.remove()}
 }

 function start(){if(isThankYou())build()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
