/* Okla – the thank-you page after an order is sent (/objednavka/dekujeme/), one calm white panel like the empty cart
   (okla_empty_states.js), on phones and PC alike:
   - on top the order steps (Košík, Doprava a platba, Dodací údaje), all three done;
   - in the middle a picture (a parcel with a check mark), "Děkujeme za objednávku", one line with the order number, a
     small block with the delivery (with the pickup point's name), the payment method and the total, for a plain bank
     transfer ("Převodem") a payment card with a QR payment (Czech "QR Platba", SPAYD) for the shop's account, the amount
     to pay and the variable symbol (the order number, as Shoptet uses it) plus the same details to type in by hand, and
     "Pokračovat v nákupu";
   - at the bottom left the way to support.
   The payment method and the amount to pay are read from Shoptet's own table; the delivery and its pickup point from
   what the checkout showed (okla_order_snapshot.js, kept in this browser tab), Shoptet's table otherwise. Nothing is
   invented. Cash on delivery, card / Apple Pay / Google Pay and payment-gateway transfers (paid automatically) get no
   payment card. Shoptet's heading, number line and tables are hidden; anything else it puts on the page (conversion
   scripts, a registration offer) stays where it is. */
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
  copy:'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z|M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  help:'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z|M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7|M12 17h.01'
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
   spd:'SPD*1.0*ACC:'+BANK.iban+'*AM:'+amount+'*CC:CZK*X-VS:'+vs+'*MSG:Okla objednavka '+vs};
 }

 /* what okla_order_snapshot.js kept during the checkout (this tab, the last 6 hours) */
 function snapshot(){
  try{var s=JSON.parse(sessionStorage.getItem('okla-order-snapshot')||'null');if(s&&s.items&&s.items.length&&Date.now()-s.t<6*3600*1000)return s}catch(e){}
  return null;
 }
 function factValue(rows,re){var r=(rows||[]).filter(function(x){return re.test(norm(x.label))})[0];return r?r.value:''}

 /* the pickup point as Shoptet writes it ("2317 | Name, Street 1, Town, 123 45"): the place's name and its address lines */
 function pointParts(p){
  var s=String(p||'').replace(/^\s*\d+\s*\|\s*/,'');var parts=s.split(/\s*,\s*/).filter(Boolean);
  if(parts.length<2)return {name:s,lines:[]};
  var name=parts.shift(),zip=parts.length&&/^\d{3}\s?\d{2}$/.test(parts[parts.length-1])?parts.pop():'';
  var town=parts.length>1?parts.pop():'';
  var lines=parts.slice();if(town||zip)lines.push((zip+' '+town).trim());
  return {name:name,lines:lines};
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
  var pay=facts&&payment(facts.rows,number);

  /* the facts: the payment method and the amount to pay are Shoptet's, the delivery what the checkout kept (with the
     pickup point's name) or Shoptet's */
  var s=snapshot()||{};
  var rows=facts?facts.rows:[];
  var place=s.point?pointParts(s.point):null;
  var ship=[(s.shipping&&s.shipping.name)||factValue(rows,/doprav/),place&&place.name].filter(Boolean).join(' – ');
  var payName=factValue(rows,/^platb|zpusob platby/)||(s.payment&&s.payment.name)||'';
  var total=factValue(rows,/uhrad|celkem/)||s.total||'';

  var STEP=function(d){return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="'+d+'"/></svg>'};
  var html='<section class="okla-ty'+(pay?' okla-ty--pay':'')+'" aria-labelledby="okla-ty-title">'+
   '<ol class="okla-ty__steps" aria-label="Kroky objednávky">'+
    [['Košík','Košík'],['Doprava a platba','Doprava'],['Dodací údaje','Údaje']].map(function(st){
     return '<li class="okla-ty__step is-done"><span class="okla-ty__dot">'+STEP(IC.check)+'</span><span class="okla-ty__sname"><span class="okla-ty__long">'+st[0]+'</span><span class="okla-ty__short">'+st[1]+'</span></span></li>'}).join('')+
   '</ol>'+
   '<div class="okla-ty__main">'+
    '<div class="okla-ty__pic" aria-hidden="true"><img src="'+(window.__oklaAssetBase||'')+'v91/img/okla-manul-order-complete-clean.png" alt="" width="1280" height="1280" loading="eager" decoding="async"></div>'+
    '<h1 id="okla-ty-title" class="okla-ty__title">Děkujeme za objednávku</h1>'+
    '<p class="okla-ty__lead">'+(number?'Objednávku č. <strong>'+esc(number)+'</strong> jsme přijali':'Objednávku jsme přijali')+' a už na ní pracujeme. Potvrzení jsme vám poslali e-mailem.</p>';
  if(ship||payName||total){
   var fact=function(label,value){return value?'<div class="okla-ty__fact"><dt>'+label+'</dt><dd>'+esc(value)+'</dd></div>':''};
   html+='<dl class="okla-ty__facts">'+fact('Doprava',ship)+fact('Platba',payName)+fact('Celkem',total)+'</dl>';
  }
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
  html+='<a class="okla-ty__btn" href="/">Pokračovat v nákupu</a>'+
   '</div>'+
   '<div class="okla-ty__foot"><a class="okla-ty__help" href="mailto:podpora@okla.cz">'+svg(IC.help)+'<span>Potřebujete s objednávkou pomoct? Napište nám</span></a></div>'+
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
