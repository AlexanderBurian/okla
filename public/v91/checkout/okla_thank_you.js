/* Okla – the thank-you page after an order is sent (/objednavka/dekujeme/).
   Shoptet prints a heading, the order number, a "Platba a doručení" table and an "Obsah objednávky" table. Neither
   table is shown; the page is two columns (one on phones):
   - left: a check mark, "Už na vaší objednávce pracujeme" with the order number, for a plain bank transfer
     ("Převodem") a payment card with a QR payment (Czech "QR Platba", SPAYD) for the shop's account, the amount to pay
     and the variable symbol (the order number, as Shoptet uses it) plus the same details to type in by hand, the
     order-tracking / continue-shopping buttons and a photo of the warehouse;
   - right: the order summary - delivery (with the pickup point or the address), payment, the items with their photos,
     quantities and prices, the subtotal, delivery and the total - and links to the order status, returns and help.
   The items, the delivery and its pickup point come from what the checkout showed (okla_order_snapshot.js, kept in
   this browser tab); the payment method and the amount to pay are read from Shoptet's own table, and when nothing was
   kept the items come from Shoptet's table. Nothing is invented. Cash on delivery, card / Apple Pay / Google Pay and
   payment-gateway transfers (paid automatically) get no payment card. Anything else Shoptet puts on the page
   (conversion scripts, a registration offer) stays where it is. */
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
  box:'M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z|M3.5 7.5 12 11.5l8.5-4|M12 11.5v9',
  back:'M9 14 4 9l5-5|M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  chat:'M4 5h16v11H9l-5 4z|M8 9.5h8|M8 12.5h5',
  next:'m9 5 7 7-7 7',
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
   spd:'SPD*1.0*ACC:'+BANK.iban+'*AM:'+amount+'*CC:CZK*X-VS:'+vs+'*MSG:Okla objednavka '+vs};
 }

 /* what okla_order_snapshot.js kept during the checkout (this tab, the last 6 hours) */
 function snapshot(){
  try{var s=JSON.parse(sessionStorage.getItem('okla-order-snapshot')||'null');if(s&&s.items&&s.items.length&&Date.now()-s.t<6*3600*1000)return s}catch(e){}
  return null;
 }
 /* the items from Shoptet's own "Obsah objednávky" table, when nothing was kept */
 function tableItems(tables){
  var out=[];
  tables.forEach(function(t){[].slice.call(t.rows||[]).forEach(function(r){
   var img=r.querySelector('img');if(!img)return;
   var cells=[].slice.call(r.cells),links=[].slice.call(r.querySelectorAll('a')).filter(function(a){return txt(a)});
   var name=links.length?txt(links[0]):cells.map(txt).sort(function(a,b){return b.length-a.length})[0]||'';
   var qty=(cells.map(txt).filter(function(s){return /^\d+\s*(ks|×|x)?$/i.test(s)})[0]||'1').replace(/\D/g,'')||'1';
   var price=cells.map(txt).filter(function(s){return /kč/i.test(s)}).pop()||'';
   var a=img.closest('a')||links[0];
   if(name)out.push({href:a?a.getAttribute('href'):'',name:name,variant:'',img:img.getAttribute('data-src')||img.getAttribute('src')||'',qty:qty,price:price});
  })});
  return out;
 }
 function nice(s){s=String(s||'').trim();return /^zdarma$/i.test(s)?'Zdarma':s}
 function factValue(rows,re){var r=(rows||[]).filter(function(x){return re.test(norm(x.label))})[0];return r?r.value:''}

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
  var mailLine=(mailEl&&txt(mailEl).match(/rekapitulaci[^.!]*[.!]/i)||['Rekapitulaci vám zašleme i e-mailem.'])[0].replace(/Vám/g,'vám');
  var pay=facts&&payment(facts.rows,number);

  /* the order: what the checkout kept, Shoptet's own tables otherwise; the payment method and the amount to pay are
     always Shoptet's */
  var s=snapshot()||{};
  var items=(s.items&&s.items.length)?s.items:tableItems(itemTables);
  var rows=facts?facts.rows:[];
  var shipName=(s.shipping&&s.shipping.name)||factValue(rows,/doprav/);
  var payName=factValue(rows,/^platb|zpusob platby/)||(s.payment&&s.payment.name)||'';
  var total=factValue(rows,/uhrad|celkem/)||s.total||'';
  var count=items.reduce(function(n,i){return n+(parseInt(i.qty,10)||1)},0);
  var where=s.point?[s.point]:(s.address||[]);

  var html='<section class="okla-ty'+(pay?' okla-ty--pay':'')+'" aria-labelledby="okla-ty-title">'+
   '<div class="okla-ty__main">'+
    '<span class="okla-ty__ok">'+svg(IC.check)+'</span>'+
    '<h1 id="okla-ty-title" class="okla-ty__title">Už na vaší objednávce pracujeme</h1>'+
    '<p class="okla-ty__lead">'+(number?'Vaši objednávku č. <strong>'+esc(number)+'</strong> jsme přijali ke zpracování. ':'Vaši objednávku jsme přijali ke zpracování. ')+esc(mailLine)+'</p>';
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
    '<figure class="okla-ty__photo"><img src="'+esc((window.__oklaAssetBase||'')+'v91/img/about/sklad.webp')+'" alt="" loading="lazy" decoding="async"></figure>'+
   '</div>';

  /* the order summary */
  html+='<aside class="okla-ty__side" aria-label="Shrnutí objednávky">'+
   '<h2 class="okla-ty__sh">Shrnutí objednávky</h2>';
  if(shipName||where.length){
   html+='<div class="okla-ty__blk"><h3>Doručení</h3>'+(shipName?'<p class="okla-ty__strong">'+esc(shipName)+'</p>':'')+
    (where.length?'<p class="okla-ty__addr">'+where.map(esc).join('<br>')+'</p>':'')+'</div>';
  }
  if(payName)html+='<div class="okla-ty__blk"><h3>Platba</h3><p class="okla-ty__strong">'+esc(payName)+'</p></div>';
  if(items.length){
   html+='<ul class="okla-ty__items">'+items.map(function(i){
    var link=i.href?' href="'+esc(i.href)+'"':'';
    return '<li class="okla-ty__item">'+
     '<a class="okla-ty__thumb"'+link+' tabindex="-1" aria-hidden="true">'+(i.img?'<img src="'+esc(i.img)+'" alt="" loading="lazy">':'')+'</a>'+
     '<div class="okla-ty__ibody">'+
      (i.href?'<a class="okla-ty__iname" href="'+esc(i.href)+'">'+esc(i.name)+'</a>':'<span class="okla-ty__iname">'+esc(i.name)+'</span>')+
      (i.variant?'<span class="okla-ty__imeta">'+esc(i.variant)+'</span>':'')+
      '<span class="okla-ty__imeta">Množství: '+esc(i.qty||'1')+'</span>'+
      (i.price?'<span class="okla-ty__iprice">'+esc(i.price)+'</span>':'')+
     '</div></li>';
   }).join('')+'</ul>';
  }
  html+='<dl class="okla-ty__sum">';
  if(s.goods&&count)html+='<div><dt>Mezisoučet '+count+' ks</dt><dd>'+esc(s.goods)+'</dd></div>';
  if(s.shipping&&s.shipping.price)html+='<div><dt>Doprava</dt><dd>'+esc(nice(s.shipping.price))+'</dd></div>';
  if(s.payment&&s.payment.price&&!/^zdarma$/i.test(s.payment.price))html+='<div><dt>Platba</dt><dd>'+esc(nice(s.payment.price))+'</dd></div>';
  if(total)html+='<div class="okla-ty__total"><dt>Celkem</dt><dd>'+esc(total)+'</dd></div>';
  html+='</dl>'+
   '<div class="okla-ty__svc"><h2 class="okla-ty__sh">S čím vám ještě pomůžeme</h2>'+
    '<a class="okla-ty__svcrow" href="/stav-objednavky/">'+svg(IC.box)+'<span><strong>Stav objednávky</strong><small>Kde je vaše zásilka a kdy dorazí</small></span>'+svg(IC.next,'okla-ty__chev')+'</a>'+
    '<a class="okla-ty__svcrow" href="/vraceni-zbozi-a-odstoupeni/">'+svg(IC.back)+'<span><strong>Vrácení do 14 dnů</strong><small>Bez udání důvodu, jednoduše online</small></span>'+svg(IC.next,'okla-ty__chev')+'</a>'+
    '<a class="okla-ty__svcrow" href="/kontakt/">'+svg(IC.chat)+'<span><strong>Poradíme vám</strong><small>S objednávkou, výrobkem i reklamací</small></span>'+svg(IC.next,'okla-ty__chev')+'</a>'+
   '</div>'+
  '</aside>'+
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
