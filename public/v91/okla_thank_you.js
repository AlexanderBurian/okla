/* OKLA – "Objednávka odeslána" (/objednavka/dekujeme/, the page Shoptet shows after an order is sent).
   Shoptet renders a plain heading, the order number, a "Platba a doručení" table and an "Obsah objednávky" table.
   Here they are read from the page and shown in the checkout style: a success header with the order number, the
   ordered items on the left and a grey recap (shipping, payment, amount to pay) with the next steps on the right.
   Paid by bank transfer: a QR payment (Czech SPAYD standard) with the shop's account, the amount and the variable
   symbol (the order number, as Shoptet uses it), and the same details to type in by hand. Cash on delivery and other
   payments show no payment details. Only what Shoptet printed is shown (no invented data). Anything else Shoptet puts on the page (payment details,
   a QR code, the registration offer, conversion scripts) stays where it is, below. If the tables cannot be read,
   the page is left as it is. */
(function(){
 'use strict';
 if(window.__oklaThankYouV1)return;window.__oklaThankYouV1=true;

 function txt(el){return (el&&el.textContent||'').replace(/\s+/g,' ').trim()}
 function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function svg(d,cls){return '<svg class="'+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+d.split('|').map(function(p){return '<path d="'+p+'"/>'}).join('')+'</svg>'}
 var IC={
  check:'M5 12.5l4.5 4.5L19 7',
  truck:'M2.5 6.5h11v9.5h-11z|M13.5 9.5h4l3 3.4V16h-7|M6.5 17.5h.01|M17 17.5h.01',
  card:'M3 6h18v12H3z|M3 10h18|M7 15h4',
  arrow:'M5 12h14|M13 6l6 6-6 6',
  box:'M12 3l8 4.5v9L12 21l-8-4.5v-9z|M4 7.5l8 4.5 8-4.5|M12 12v9',
  bank:'M3 9.5 12 4l9 5.5|M4.5 10v8|M9.5 10v8|M14.5 10v8|M19.5 10v8|M3 20h18',
  copy:'M9 9h11v11H9z|M5 15H4V4h11v1'
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

 /* the label/value table: two cells per row, with shipping / payment / amount */
 function readFacts(main){
  var tables=[].slice.call(main.querySelectorAll('table'));
  for(var i=0;i<tables.length;i++){
   var t=tables[i];if(t.querySelector('img'))continue;
   var rows=[].slice.call(t.rows||[]).map(function(r){var c=r.cells;return c.length>=2?{label:txt(c[0]).replace(/:\s*$/,''),value:txt(c[c.length-1])}:null}).filter(function(x){return x&&x.label&&x.value});
   if(rows.length&&rows.some(function(r){return /doprav|platb|uhrad/.test(norm(r.label))}))return {table:t,rows:rows};
  }
  return null;
 }
 /* the items table: a row per item, with its picture */
 function readItems(main){
  var tables=[].slice.call(main.querySelectorAll('table')).filter(function(t){return t.querySelector('img')});
  if(!tables.length)return null;
  var t=tables[0],items=[];
  [].slice.call(t.rows||[]).forEach(function(r){
   var cells=[].slice.call(r.cells);if(!cells.length||r.querySelector('th'))return;
   var img=r.querySelector('img'),link=r.querySelector('a[href]:not([href^="#"])');
   var texts=cells.map(txt).filter(Boolean);
   var qtyCell=cells.filter(function(c){return /\d\s*ks\b/.test(txt(c))})[0];
   var nameCell=cells.filter(function(c){var s=txt(c);return s&&c!==qtyCell&&!/^[\d\s.,]+(kc|czk|€|eur)?$/i.test(norm(s))&&!/\d\s*ks\b/.test(s)})[0];
   var total=texts.length?texts[texts.length-1]:'';
   if(!nameCell)return;
   var src=img?(img.getAttribute('data-src')||img.currentSrc||img.getAttribute('src')||''):'';
   items.push({name:txt(nameCell),href:link?link.getAttribute('href'):'',src:src,qty:qtyCell?txt(qtyCell):'',total:total===txt(qtyCell)?'':total});
  });
  return items.length?{table:t,items:items}:null;
 }
 /* a short element whose only job is a given text (a heading, the "Číslo …" line, the closing lines) */
 function short(main,re,skip){
  var all=[].slice.call(main.querySelectorAll('h1,h2,h3,h4,h5,p,div,span,strong,td,a')).filter(function(el){
   var s=txt(el);
   return s&&s.length<=120&&!el.querySelector('table')&&!(skip&&skip.some(function(x){return x.contains(el)}))&&!el.closest('.okla-ty')&&re.test(norm(s));
  });
  /* the innermost element with this text (not a wrapper that also holds other lines) */
  all=all.filter(function(el){return !all.some(function(o){return o!==el&&el.contains(o)})});
  var el=all[0];if(!el)return null;
  /* the outermost element that still holds only this text */
  while(el.parentElement&&el.parentElement!==main&&txt(el.parentElement)===txt(el))el=el.parentElement;
  return el;
 }
 function hide(el){if(el)el.classList.add('okla-ty-src')}

 function build(){
  var main=document.querySelector('main#content')||document.getElementById('content');
  if(!main||main.querySelector('.okla-ty'))return;
  var facts=readFacts(main),items=readItems(main);
  if(!facts&&!items)return;
  var tables=[facts&&facts.table,items&&items.table].filter(Boolean);
  var h1=main.querySelector('h1');
  var numEl=short(main,/^cislo( objednavky)?\s*:?\s*\S+/,tables);
  var number=numEl?txt(numEl).replace(/^\S+\s+(objednávky\s*)?:?\s*/i,''):'';
  var hFacts=short(main,/^platba a doruceni$/,tables),hItems=short(main,/^obsah objednavky$/,tables);
  var mailEl=short(main,/^rekapitulaci .*e-?mail/,tables),thanksEl=short(main,/^dekujeme[!.]?$/,tables);
  var sentEl=short(main,/^objednavka (byla )?odeslana[!.]?$/,tables),backEl=short(main,/^zpet do obchodu$/,tables);

  var title=h1&&txt(h1)?txt(h1):'Děkujeme za objednávku';
  title=title.charAt(0).toUpperCase()+title.slice(1).toLowerCase();
  var mailLine=(mailEl&&txt(mailEl).match(/rekapitulaci[^.!]*[.!]/i)||['Rekapitulaci vám zašleme i e-mailem.'])[0].replace(/Vám/g,'vám');
  var lead='Objednávka byla odeslána. '+mailLine;
  var pay=facts&&payment(facts.rows,number);

  var html='<section class="okla-ty" aria-labelledby="okla-ty-title">'+
   '<header class="okla-ty__head">'+
    '<span class="okla-ty__ok">'+svg(IC.check)+'</span>'+
    '<h1 id="okla-ty-title" class="okla-ty__title">'+esc(title)+'</h1>'+
    '<p class="okla-ty__lead">'+esc(lead)+'</p>'+
    (number?'<p class="okla-ty__num"><span>Číslo objednávky</span><strong>'+esc(number)+'</strong></p>':'')+
   '</header>'+
   '<div class="okla-ty__grid">';
  html+='<div class="okla-ty__main">';
  if(pay){
   var row=function(label,value,copy){return '<div class="okla-ty__prow"><dt>'+label+'</dt><dd><span>'+esc(value)+'</span>'+
    '<button type="button" class="okla-ty__copy" data-copy="'+esc(copy)+'" aria-label="Zkopírovat: '+label+'" title="Zkopírovat">'+svg(IC.copy)+svg(IC.check,'okla-ty__copied')+'</button></dd></div>'};
   html+='<div class="okla-ty__pay">'+
    '<div class="okla-ty__qr" data-spd="'+esc(pay.spd)+'" role="img" aria-label="QR kód pro platbu"></div>'+
    '<div class="okla-ty__paybody">'+
     '<h2 class="okla-ty__h">'+svg(IC.bank)+'<span>Zaplaťte převodem</span></h2>'+
     '<p class="okla-ty__paylead">Naskenujte QR kód v aplikaci své banky, nebo zadejte platbu ručně.</p>'+
     '<dl class="okla-ty__pdl">'+
      row('Číslo účtu',BANK.account,BANK.account)+
      row('IBAN',BANK.iban.replace(/(.{4})/g,'$1 ').trim(),BANK.iban)+
      row('Variabilní symbol',pay.vs,pay.vs)+
      row('Částka',pay.amountText,pay.amount.replace('.',','))+
     '</dl>'+
     '<p class="okla-ty__paynote">QR kód pro platbu najdete i v potvrzovacím e-mailu.</p>'+
    '</div>'+
   '</div>';
  }
  if(items){
   html+='<div class="okla-ty__items"><h2 class="okla-ty__h">'+svg(IC.box)+'<span>Obsah objednávky</span><em>'+items.items.length+'</em></h2><ul class="okla-ty__list">'+
    items.items.map(function(it){
     var name=it.href?'<a href="'+esc(it.href)+'">'+esc(it.name)+'</a>':esc(it.name);
     return '<li class="okla-ty__item">'+
      '<span class="okla-ty__thumb">'+(it.src?'<img src="'+esc(it.src)+'" alt="" loading="lazy">':'')+'</span>'+
      '<span class="okla-ty__name">'+name+(it.qty?'<span class="okla-ty__qty">'+esc(it.qty.replace(/\s*\/\s*/,' × '))+'</span>':'')+'</span>'+
      '<span class="okla-ty__total">'+esc(it.total)+'</span></li>';
    }).join('')+'</ul></div>';
  }
  html+='</div><aside class="okla-ty__side">';
  if(facts){
   var amount=null;
   var rows=facts.rows.filter(function(r){if(/uhrad|celkem/.test(norm(r.label))&&!amount){amount=r;return false}return true});
   html+='<div class="okla-ty__recap"><h2 class="okla-ty__h"><span>Platba a doručení</span></h2><dl class="okla-ty__facts">'+
    rows.map(function(r){var ic=/doprav/.test(norm(r.label))?IC.truck:/platb/.test(norm(r.label))?IC.card:'';
     return '<div class="okla-ty__fact">'+(ic?svg(ic,'okla-ty__fic'):'')+'<dt>'+esc(r.label.replace(/^zvolená\s+/i,'').replace(/^./,function(c){return c.toUpperCase()}))+'</dt><dd>'+esc(r.value)+'</dd></div>'}).join('')+
    '</dl>'+
    (amount?'<div class="okla-ty__sum"><span>'+esc(amount.label)+'</span><strong>'+esc(amount.value)+'</strong></div>':'')+
   '</div>';
  }
  html+='<div class="okla-ty__next">'+
    '<a class="okla-ty__btn okla-ty__btn--primary" href="/">Pokračovat v nákupu'+svg(IC.arrow)+'</a>'+
    '<a class="okla-ty__btn okla-ty__btn--ghost" href="/stav-objednavky/">Stav objednávky</a>'+
   '</div>'+
  '</aside></div></section>';

  var box=document.createElement('div');box.innerHTML=html;var sec=box.firstChild;
  var anchor=h1||tables[0];
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

 /* bank transfer only: the amount and the variable symbol (Shoptet's order number) for the QR payment */
 function payment(rows,number){
  var method=rows.filter(function(r){return /platb/.test(norm(r.label))})[0];
  if(!method||!/prevod/.test(norm(method.value)))return null;
  var amountRow=rows.filter(function(r){return /uhrad|celkem/.test(norm(r.label))})[0];
  var vs=String(number||'').replace(/\D/g,'');
  if(!amountRow||!vs||vs.length>10)return null;
  var a=amountRow.value.replace(/[^\d,.]/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');
  var n=parseFloat(a);if(!(n>0))return null;
  var amount=n.toFixed(2);
  return {vs:vs,amount:amount,amountText:amountRow.value,
   spd:'SPD*1.0*ACC:'+BANK.iban+'*AM:'+amount+'*CC:CZK*X-VS:'+vs+'*MSG:OKLA OBJEDNAVKA '+vs};
 }
 function drawQr(box){
  if(!box)return;
  function paint(){
   try{var q=window.qrcode(0,'M');q.addData(box.getAttribute('data-spd'));q.make();box.innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true});box.classList.add('is-ready')}
   catch(e){fail()}
  }
  function fail(){box.classList.add('is-failed');box.innerHTML='<span>QR kód se nepodařilo zobrazit. Použijte prosím údaje k platbě.</span>'}
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
