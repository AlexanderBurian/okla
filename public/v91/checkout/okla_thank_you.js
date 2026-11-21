/* Okla – the thank-you page after an order is sent (/objednavka/dekujeme/), laid out as Decathlon's.
   Shoptet prints a heading, the order number, a "Platba a doručení" table and an "Obsah objednávky" table. Neither
   table is shown; the page is two columns (one on phones):
   - left: a check mark, "Už na vaší objednávce pracujeme" with the order number and one line, for a plain bank transfer
     ("Převodem") a payment card with a QR payment (Czech "QR Platba", SPAYD) for the shop's account, the amount to pay
     and the variable symbol (the order number, as Shoptet uses it) plus the same details to type in by hand, and a
     white delivery van with the Okla logo (v91/img/okla-van.webp) driving left to right: it reaches out to the page
     panel's left edge (the screen's on phones), which cuts off a bit of its rear;
   - right: the order summary - delivery (the method with the pickup point's name, then its address), the items with
     their photos, quantities and prices, then the subtotal, delivery, payment and the total - and a slider of other
     products (the ordered items' categories first, from the shop's live catalogue).
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

 /* the pickup point as Shoptet writes it ("2317 | Name, Street 1, Town, 123 45"): the place's name and its address lines */
 function pointParts(p){
  var s=String(p||'').replace(/^\s*\d+\s*\|\s*/,'');var parts=s.split(/\s*,\s*/).filter(Boolean);
  if(parts.length<2)return {name:s,lines:[]};
  var name=parts.shift(),zip=parts.length&&/^\d{3}\s?\d{2}$/.test(parts[parts.length-1])?parts.pop():'';
  var town=parts.length>1?parts.pop():'';
  var lines=parts.slice();if(town||zip)lines.push((zip+' '+town).trim());
  return {name:name,lines:lines};
 }
 /* products for the slider: the shop's catalogue (okla_live_catalog.js keeps it current), those of the ordered items'
    categories first, never an ordered one, only what is in stock */
 function suggestions(items){
  var cat=window.OKLA_V86_CATALOG||{},all=Object.keys(cat).map(function(k){return cat[k]}).filter(function(p){return p&&p.url&&p.image&&p.name&&p.available!==false});
  function path(u){try{return new URL(u,location.origin).pathname}catch(e){return ''}}
  var ordered={};items.forEach(function(i){ordered[path(i.href)]=1});
  var cats={};all.forEach(function(p){if(ordered[path(p.url)])cats[p.defaultCategory]=1});
  var rest=all.filter(function(p){return !ordered[path(p.url)]});
  var same=rest.filter(function(p){return cats[p.defaultCategory]}),other=rest.filter(function(p){return !cats[p.defaultCategory]});
  same.sort(function(a,b){return (b.price||0)-(a.price||0)});other.sort(function(a,b){return (b.price||0)-(a.price||0)});
  return same.concat(other).slice(0,10);
 }
 function kc(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}

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

  /* the order: what the checkout kept, Shoptet's own tables otherwise; the payment method and the amount to pay are
     always Shoptet's */
  var s=snapshot()||{};
  var items=(s.items&&s.items.length)?s.items:tableItems(itemTables);
  var rows=facts?facts.rows:[];
  var shipName=(s.shipping&&s.shipping.name)||factValue(rows,/doprav/);
  var payName=factValue(rows,/^platb|zpusob platby/)||(s.payment&&s.payment.name)||'';
  var total=factValue(rows,/uhrad|celkem/)||s.total||'';
  var count=items.reduce(function(n,i){return n+(parseInt(i.qty,10)||1)},0);
  var place=s.point?pointParts(s.point):null;
  var addr=place?place.lines:(s.address||[]);

  /* as on Decathlon: on the left the check mark, the heading, one line, (the payment card for a bank transfer) and the
     Okla delivery van; on the right the summary - delivery with its address, the items, the totals - and a product slider */
  var html='<section class="okla-ty'+(pay?' okla-ty--pay':'')+'" aria-labelledby="okla-ty-title">'+
   '<div class="okla-ty__main">'+
    '<span class="okla-ty__ok"><svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M33.5 18.6V20A13.5 13.5 0 1 1 25.5 7.7"/><path d="m14.5 19.5 4.8 4.8L34 9.6"/></svg></span>'+
    '<h1 id="okla-ty-title" class="okla-ty__title">Už na vaší objednávce pracujeme</h1>'+
    '<p class="okla-ty__lead">'+(number?'Vaši objednávku č. '+esc(number)+' jsme přijali ke zpracování. ':'Vaši objednávku jsme přijali ke zpracování. ')+'Vyřídíme ji v co nejkratším možném termínu.</p>';
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
  html+='<figure class="okla-ty__photo"><img src="'+esc((window.__oklaAssetBase||'')+'v91/img/okla-van.webp')+'" width="1200" height="507" alt="Dodávka Okla.cz" loading="lazy" decoding="async"></figure>'+
   '</div>';

  /* the summary */
  html+='<aside class="okla-ty__side" aria-label="Shrnutí objednávky">'+
   '<h2 class="okla-ty__sh">Shrnutí objednávky</h2>';
  if(shipName||place||addr.length){
   html+='<div class="okla-ty__blk"><h3>Doručení</h3>'+
    '<p class="okla-ty__strong">'+esc([shipName,place&&place.name].filter(Boolean).join(' – '))+'</p>'+
    (addr.length?'<p class="okla-ty__lbl">Adresa:</p><p class="okla-ty__addr">'+addr.map(esc).join('<br>')+'</p>':'')+'</div>';
  }
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
  html+='<div class="okla-ty__sum">';
  if(s.goods&&count)html+='<div class="okla-ty__srow"><span>Mezisoučet '+count+' ks</span><span>'+esc(s.goods)+'</span></div>';
  if(s.shipping&&s.shipping.name)html+='<div class="okla-ty__srow okla-ty__srow--sub"><span><strong>Doručení</strong><small>'+esc(s.shipping.name)+'</small></span><span>'+esc(nice(s.shipping.price))+'</span></div>';
  if(payName)html+='<div class="okla-ty__srow okla-ty__srow--sub"><span><strong>Platba</strong><small>'+esc(payName)+'</small></span><span>'+esc(nice(s.payment&&s.payment.price||''))+'</span></div>';
  if(total)html+='<div class="okla-ty__srow okla-ty__srow--total"><span>Celkem</span><span>'+esc(total)+'</span></div>';
  html+='</div>';
  var picks=suggestions(items);
  if(picks.length){
   html+='<div class="okla-ty__more">'+
    '<div class="okla-ty__morehead"><div><h2 class="okla-ty__sh">Mohlo by se vám hodit</h2><p class="okla-ty__morelead">Další užitečné vychytávky z naší nabídky.</p></div>'+
    '<div class="okla-ty__arrows"><button type="button" class="okla-ty__arrow" data-dir="-1" aria-label="Předchozí" disabled>'+svg('m14.5 6-6 6 6 6')+'</button>'+
    '<button type="button" class="okla-ty__arrow" data-dir="1" aria-label="Další">'+svg('m9.5 6 6 6-6 6')+'</button></div></div>'+
    '<div class="okla-ty__track">'+picks.map(function(p){var u;try{u=new URL(p.url,location.origin).pathname}catch(e){u=p.url}
     return '<a class="okla-ty__card" href="'+esc(u)+'"><span class="okla-ty__cimg"><img src="'+esc(p.image)+'" alt="" loading="lazy" decoding="async"></span>'+
      '<span class="okla-ty__cname">'+esc(p.name)+'</span>'+(p.price?'<span class="okla-ty__cprice">'+kc(p.price)+'</span>':'')+'</a>'}).join('')+'</div>'+
   '</div>';
  }
  html+='</aside></section>';

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
  slider(sec.querySelector('.okla-ty__more'));
  bleed(sec.querySelector('.okla-ty__photo'));
 }
 /* the van runs out to the white page panel's left edge (on phones the screen's): the gap between the column and that
    edge, in the page's own (zoomed) pixels, goes to --ty-bleed */
 function bleed(fig){
  if(!fig)return;
  function measure(){
   fig.style.removeProperty('--ty-bleed');
   var panel=document.getElementById('content-wrapper'),z=fig.currentCSSZoom||1;
   var edge=panel?Math.max(panel.getBoundingClientRect().left,0):0;
   var d=Math.round((fig.getBoundingClientRect().left-edge)/z);
   if(d>0&&d<200)fig.style.setProperty('--ty-bleed',d+'px');
  }
  var t;window.addEventListener('resize',function(){cancelAnimationFrame(t);t=requestAnimationFrame(measure)});
  measure();
 }
 /* the slider: the arrows move it by one card; each arrow is off at its end */
 function slider(more){
  if(!more)return;
  var track=more.querySelector('.okla-ty__track'),btns=more.querySelectorAll('.okla-ty__arrow');
  function step(){var c=track.querySelector('.okla-ty__card');if(!c)return 200;var g=parseFloat(getComputedStyle(track).columnGap)||0;return c.getBoundingClientRect().width/(c.currentCSSZoom||1)+g}
  function sync(){var max=track.scrollWidth-track.clientWidth-2;btns[0].disabled=track.scrollLeft<=2;btns[1].disabled=track.scrollLeft>=max}
  [].forEach.call(btns,function(b){b.addEventListener('click',function(){track.scrollBy({left:step()*(+b.getAttribute('data-dir')),behavior:'smooth'})})});
  track.addEventListener('scroll',function(){requestAnimationFrame(sync)},{passive:true});
  window.addEventListener('resize',sync);setTimeout(sync,300);sync();
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
