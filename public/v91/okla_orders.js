/* OKLA V125 – customer "Moje objednávky" list. After sign-in Shoptet renders the
   order history in #content. We rebuild it as one calm UI: each order is a single
   grey card; clicking the card opens it in place, with sections (delivery status,
   products, actions) split by light horizontal rules. Products carry tiny
   thumbnails; the delivery status shows at once as a small stepper. A "Reklamovat"
   shortcut pre-fills /reklamace/.

   Detection needs a strong signal (a detail link + an order-number token). If the
   theme does not match we leave the native page untouched rather than break it. */
(function(){
 'use strict';
 if(window.__oklaOrdersV1)return;
 window.__oklaOrdersV1=true;

 var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true" class="okla-ord-chev"><path d="M6 9l6 6 6-6"/></svg>';
 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
 var CLAIM='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4.5 6v5.2c0 4.5 3 8.1 7.5 9.8 4.5-1.7 7.5-5.3 7.5-9.8V6L12 3Z"/><path d="M12 8v5M12 16.5v.1"/></svg>';
 var INVOICE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3Z"/><path d="M15 3v4h4M8 11h8M8 14h8M8 17h5"/></svg>';
 var IMAGE_CACHE={};

 var STEPS=['Objednáno','Zpracování','Expedováno','V přepravě','Doručeno'];
 var STATUS_MAP=[
  {m:['storno','zrus','zamit','odstoupen','vraceno zbozi'],cancelled:true,label:'Zrušeno'},
  /* "doruceno"/"dorucena" only – NOT "doruceni" (the delivery method). */
  {m:['doruceno','dorucena','doruceny','vyrizeno','vyrizena','dokonceno','dokoncena','vyzvednuto'],step:4},
  {m:['v preprav','na ceste','prepravuje','predano doprav'],step:3},
  {m:['expedov','odeslan','pripraveno k vyzvednuti'],step:2},
  {m:['zpracov','potvrzen','prijata platba','platba prijata','balime','kompletuje','vyrizuje'],step:1},
  {m:['prijat','nova','ceka','zalozen','nezaplacen','vytvoren','objednan'],step:0}
 ];
 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
 function mapStatus(text){var n=norm(text);for(var i=0;i<STATUS_MAP.length;i++){if(STATUS_MAP[i].m.some(function(x){return n.indexOf(x)!==-1}))return STATUS_MAP[i]}return null}
 function tclean(s){return String(s||'').replace(/\s+/g,' ').trim()}
 function el(t,c){var n=document.createElement(t);if(c)n.className=c;return n}

 function scope(){return document.querySelector('#content .content-inner')||document.querySelector('#content')}

 /* Confirmation popup shown before every complaint is started. */
 function confirmReklamace(num,href){
  var ov=el('div','okla-ord-modal');
  ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
  ov.innerHTML='<div class="okla-ord-modal__box" role="document">'+
    '<div class="okla-ord-modal__ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v5"/><path d="M12 17.3v.1"/></svg></div>'+
    '<h3 class="okla-ord-modal__title">Podat reklamaci?</h3>'+
    '<p class="okla-ord-modal__text">Otevřeme reklamační formulář'+(num?(' pro objednávku <b>#'+num+'</b>'):'')+' s předvyplněnými údaji. Chcete pokračovat?</p>'+
    '<div class="okla-ord-modal__btns">'+
      '<button type="button" class="okla-ord-modal__btn okla-ord-modal__cancel">Zrušit</button>'+
      '<a class="okla-ord-modal__btn okla-ord-modal__ok" href="'+href+'">Pokračovat</a>'+
    '</div>'+
  '</div>';
  function close(){document.removeEventListener('keydown',onKey);if(ov.parentNode)ov.parentNode.removeChild(ov)}
  function onKey(e){if(e.key==='Escape')close()}
  ov.addEventListener('click',function(e){if(e.target===ov)close()});
  ov.querySelector('.okla-ord-modal__cancel').addEventListener('click',close);
  document.addEventListener('keydown',onKey);
  (document.body||document.documentElement).appendChild(ov);
  var ok=ov.querySelector('.okla-ord-modal__ok');if(ok&&ok.focus)ok.focus();
 }

 function orderNumber(item){
  var href=item.href||'';
  var mq=href.match(/[?&](?:id|order|code|number)=([^&]+)/i);
  if(mq){var d=decodeURIComponent(mq[1]).match(/\d{3,}/);if(d)return d[0]}
  var mp=href.match(/\/(\d{4,})(?:\/|$)/);
  if(mp)return mp[1];
  var cells=item.row.querySelectorAll('td,th,[class*="col"],[class*="cell"]');
  for(var i=0;i<cells.length;i++){var m=cells[i].textContent.trim().match(/^#?\s*(\d{3,})\b/);if(m)return m[1]}
  var mr=(item.row.textContent||'').match(/\d{4,}/);
  return mr?mr[0]:'';
 }
 /* A cell is a real STATUS only if it maps and does NOT look like a delivery
    method, carrier, payment or price/quantity (those share words with statuses,
    e.g. "Doručení na adresu" vs the "Doručeno" status). */
 function isStatusText(t){
  var n=norm(t);
  if(/doruceni|zasilkovn|vydejn|baliko|dopravc|ceska posta|\bposta\b|ppl|dpd|gls|kuryr|osobni odber|platb|prevod|dobirk|hotove|kartou|adres|\bpsc\b|\bkc\b|czk|eur|\bks\b/.test(n))return false;
  return !!mapStatus(t);
 }
 function rowStatus(row){
  /* Prefer an explicit status element Shoptet marks as such. */
  var ex=row.querySelector('[class*="status"],[class*="state"],[class*="stav"],[data-status]');
  if(ex){var et=tclean(ex.textContent);if(et&&et.length<60&&mapStatus(et)&&isStatusText(et))return et}
  var cells=row.querySelectorAll('td,th,span,div');
  for(var i=0;i<cells.length;i++){var t=tclean(cells[i].textContent);if(t&&t.length<40&&isStatusText(t))return t}
  return '';
 }
 function dateIn(text){
  var m=String(text||'').match(/(\d{1,3})\.\s?(\d{1,2})\.\s?(\d{2,4})(?!\d)/);if(!m)return '';
  var day=m[1];while(day.length>1&&Number(day)>31)day=day.slice(1);
  return day+'.'+m[2]+'.'+m[3];
 }
 function totalIn(text){var ms=String(text||'').match(/\d[\d\s ]*(?:[.,]\d{1,2})?\s*(?:Kč|CZK|€|EUR|Ft|HUF)/gi);return ms?tclean(ms[ms.length-1]):''}

 function findOrders(root){
  var out=[],seen=[];
  [].slice.call(root.querySelectorAll('a[href]')).forEach(function(a){
   var href=a.getAttribute('href')||'';
   if(!/(objednavk|objednavka|order)/i.test(href))return;
   if(/^\/objednavky\/?($|[?#])/.test(href))return;
   if(/\/reklamace/i.test(href))return;
   var row=a.closest('tr, li, .order, [class*="order-"], [data-order], article');
   if(!row||row===root||seen.indexOf(row)>-1)return;
   if(!/\d{3,}/.test(row.textContent))return;
   seen.push(row);
   out.push({row:row,link:a,href:href});
  });
  return out;
 }

 /* Small, calm delivery-status stepper (one accent colour, the rest neutral). */
 function stepper(statusText){
  var mapped=mapStatus(statusText);
  var cancelled=mapped&&mapped.cancelled;
  var cur=mapped?(cancelled?-1:mapped.step):-1;
  var box=el('div','okla-ord-status');
  box.appendChild(Object.assign(el('span','okla-ord-status__label'),{textContent:'Stav doručení'}));
  if(cancelled){
   var b=el('span','okla-ord-status__cancel');b.textContent='Zrušeno';box.appendChild(b);return box;
  }
  var ol=el('ol','okla-ord-steps');
  STEPS.forEach(function(name,i){
   var li=el('li','okla-ord-step'+(i<cur?' is-done':i===cur?' is-active':' is-upcoming'));
   li.appendChild(el('span','okla-ord-step__dot'));
   li.appendChild(Object.assign(el('span','okla-ord-step__t'),{textContent:name}));
   ol.appendChild(li);
  });
  box.appendChild(ol);
  return box;
 }

 /* Shoptet lazy-loads images: the real URL may be in src, data-src, data-original
    or data-micro-image, while src can hold a blank/placeholder. Take the first
    real (non-data:) URL so an actual product photo is shown. */
 function absoluteUrl(value,base){
  if(!value)return '';
  try{var url=new URL(value,base||location.href);return /^(?:https?:)$/.test(url.protocol)?url.href:''}catch(e){return ''}
 }
 function srcFromSet(value){
  if(!value)return '';
  var first=String(value).split(',')[0].trim();
  return first.split(/\s+/)[0]||'';
 }
 function imgSrc(img,base){
  if(!img)return '';
  var picture=img.closest&&img.closest('picture');
  var source=picture&&picture.querySelector('source');
  var cand=[img.currentSrc,img.getAttribute('src'),img.getAttribute('data-src'),img.getAttribute('data-original'),img.getAttribute('data-lazy'),img.getAttribute('data-micro-image'),srcFromSet(img.getAttribute('srcset')),srcFromSet(img.getAttribute('data-srcset')),source&&srcFromSet(source.getAttribute('srcset')),source&&srcFromSet(source.getAttribute('data-srcset'))];
  for(var i=0;i<cand.length;i++){
   var s=cand[i];
   if(s&&!/^data:/i.test(s)&&!/placeholder|blank\.(?:gif|png)/i.test(s)&&s.replace(/\s/g,'').length>8)return absoluteUrl(s,base);
  }
  return '';
 }

 function parseItems(doc,base){
  base=absoluteUrl(base,location.href)||location.href;
  var inner=doc.querySelector('#content .content-inner')||doc.querySelector('#content')||doc.body;
  if(!inner)return [];
  var out=[];
  [].slice.call(inner.querySelectorAll('table tr')).forEach(function(tr){
   if(tr.querySelector('th'))return;
   var cells=[].slice.call(tr.children);
   var img=tr.querySelector('img');
   if(cells.length<2&&!img)return;
   var link=tr.querySelector('a');
   var name=link?tclean(link.textContent):'';
   if(!name){var best='';cells.forEach(function(c){var t=tclean(c.textContent);if(t.replace(/[^0-9a-zA-ZÀ-ž]/g,'').length>best.replace(/[^0-9a-zA-ZÀ-ž]/g,'').length)best=t});name=best}
   var linkHref=link&&link.getAttribute('href')||'';
   if(!name||/mezisou|celkov|doprava|platba|dob[ií]rka|sleva|dph|zaokrouhl|po[sš]tovn|baln[eé]|z[aá]silkov|v[yý]dejn[ií]\s*m[ií]sto|shipping|delivery|payment|invoice|faktur/i.test(name))return;
   if(link&&/faktur|invoice|doklad|tracking|sledov|reklamac/i.test(linkHref))return;
   if(!link&&!img)return;
   var src=imgSrc(img,base);
   var href=linkHref?absoluteUrl(linkHref,base):'';
   var rowText=tclean(tr.textContent),prices=rowText.match(/\d[\d\s ]*(?:[.,]\d{1,2})?\s*(?:Kč|CZK|€|EUR|Ft|HUF)/gi)||[];
   var price=prices.length?tclean(prices[prices.length-1]):'';
   var meta='';
   cells.forEach(function(c){var t=tclean(c.textContent);if(price)t=tclean(t.replace(price,''));if(t&&t!==name&&/\d/.test(t)&&t.length<44)meta+=(meta?' · ':'')+t});
   out.push({img:src,href:href,name:name.slice(0,80),meta:meta.slice(0,90),price:price});
  });
  if(out.length)return out.slice(0,14);
  [].slice.call(inner.querySelectorAll('img')).forEach(function(im){
   var src=imgSrc(im,base);if(!src||/sprite|icon|logo|placeholder/i.test(src))return;
   var link=im.closest('a[href]');
   out.push({img:src,href:link?absoluteUrl(link.getAttribute('href'),base):'',name:tclean(im.getAttribute('alt'))||'Položka',meta:''});
  });
  return out.slice(0,14);
 }
 function invoiceLink(doc,base,html){
  base=absoluteUrl(base,location.href)||location.href;
  var direct=doc.querySelector('a.invoice,a[data-invoice],a[href$=".pdf" i],a[href*="faktur" i],a[href*="invoice" i]');
  if(direct)return absoluteUrl(direct.getAttribute('href'),base);
  var links=[].slice.call(doc.querySelectorAll('a[href]'));
  var preferred=links.find(function(a){var t=norm((a.textContent||'')+' '+(a.getAttribute('href')||''));return /faktur|invoice|danov.{0,8}doklad|da[nň]ov.{0,8}doklad/.test(t)});
  if(!preferred)preferred=links.find(function(a){var href=a.getAttribute('href')||'';return /\.pdf(?:[?#]|$)/i.test(href)&&!/reklamac|obchodni|podmink/i.test(href)});
  if(preferred)return absoluteUrl(preferred.getAttribute('href'),base);
  var match=String(html||'').match(/href\s*=\s*["']([^"']*(?:faktur|invoice|danov[^"']*doklad|\.pdf(?:[?#][^"']*)?)[^"']*)["']/i);
  return match?absoluteUrl(match[1],base):'';
 }
 function uniqueLines(values){
  var seen={},out=[];values.forEach(function(value){var line=tclean(value);var key=norm(line);if(!line||key.length<2||seen[key])return;seen[key]=true;out.push(line)});return out;
 }
 function sectionLines(container,heading){
  var values=[];
  [].slice.call(container.querySelectorAll('tr')).forEach(function(row){
   var cells=[].slice.call(row.querySelectorAll('th,td')).map(function(cell){return tclean(cell.textContent)}).filter(Boolean);
   if(cells.length)values.push(cells.join(cells.length>1?' — ':''));
  });
  if(!values.length)[].slice.call(container.querySelectorAll('address,p,li,dd,.form-group')).forEach(function(node){values.push(node.textContent)});
  if(!values.length){
   var clone=container.cloneNode(true);[].slice.call(clone.querySelectorAll('br')).forEach(function(br){br.replaceWith('\n')});
   values=String(clone.textContent||'').split(/\n+/);
  }
  var headingText=norm(heading&&heading.textContent||'');
  return uniqueLines(values).filter(function(line){var n=norm(line);return n!==headingText&&!/fakturacni udaje|dodaci udaje|billing|delivery address/.test(n)}).slice(0,10);
 }
 function detailBlock(doc,kind){
  var isBilling=kind==='billing';
  var direct=isBilling?
   doc.querySelector('.billing-address,.invoice-address,[class*="billing-address"],[class*="invoice-address"],[data-billing-address]'):
   doc.querySelector('.delivery-address,.shipping-address,[class*="delivery-address"],[class*="shipping-address"],[data-delivery-address]');
  var pattern=isBilling?/fakturacni|invoice address|billing/i:/dodaci|delivery address|shipping address/i;
  var heading=null;
  if(!direct){heading=[].slice.call(doc.querySelectorAll('h2,h3,h4,h5,legend,.box-heading,.pageElement__heading,strong,th')).find(function(node){return pattern.test(norm(node.textContent))})||null}
  var container=direct;
  if(!container&&heading)container=heading.closest('section,fieldset,.box,[class*="box"],[class*="address"],[class*="col-"],table')||heading.parentElement;
  if(!container)return null;
  var lines=sectionLines(container,heading);
  return lines.length?{title:isBilling?'Fakturační údaje':'Dodací údaje',lines:lines}:null;
 }

 function moneyValue(text){
  var found=String(text||'').match(/(\d+(?:[ . ]\d{3})*(?:[.,]\d{1,2})?)\s*(Kč|CZK|€|EUR|Ft|HUF)/i);
  if(found)return tclean(found[1]+' '+found[2]);
  return /\bzdarma\b|\bfree\b/i.test(String(text||''))?'Zdarma':'';
 }
 function trimShippingValue(value){
  return tclean(String(value||'')
   .replace(/\d+(?:[ . ]\d{3})*(?:[.,]\d{1,2})?\s*(?:Kč|CZK|€|EUR|Ft|HUF)/gi,'')
   .replace(/^(?:zp[uů]sob\s+)?(?:doprava|dopravy|dopravn[eé]|doru[cč]en[ií]|po[sš]tovn[eé]|p[řr]eprava|p[řr]epravy|shipping|delivery)(?:\s*[:–—-]\s*|\s+)/i,'')
   .replace(/^[\s:–—-]+|[\s:–—-]+$/g,''));
 }
 function shippingInfo(doc){
  var price='',method='',pickup=[];
  var pickupPattern=/z-?box|alza\s*box|parcel\s*(?:box|shop)|bal[ií]kovn|z[aá]silkovn|packeta|v[yý]dejn[ií]\s*(?:m[ií]sto|bod)|odb[eě]rn[ií]\s*m[ií]sto|pobo[cč]k|pickup\s*(?:point|place)|boxu\b/i;
  var shippingPattern=/\b(?:doprava|dopravn[eé]|po[sš]tovn[eé]|p[řr]eprava|shipping|delivery)\b/i;
  [].slice.call(doc.querySelectorAll('tr')).forEach(function(row){
   var cells=[].slice.call(row.querySelectorAll('th,td')).map(function(cell){return tclean(cell.textContent)}).filter(Boolean);
   var text=cells.length?cells.join(' '):tclean(row.textContent),normal=norm(text);
   if(!text)return;
   if(shippingPattern.test(normal)&&!/stav doruceni|doprava a platba/.test(normal)){
    if(!price)price=moneyValue(text);
    if(!method){
     var candidate=trimShippingValue(cells.length>1?cells.slice(1).join(' '):text);
     if(candidate&&candidate.length<140)method=candidate;
    }
   }
   if(pickupPattern.test(normal)){
    var point=trimShippingValue(cells.length>1?cells.slice(1).join(' — '):text);
    if(point&&point.length<220)pickup.push(point);
   }
  });
  /* Pickup widgets are often outside tables. Read only compact leaf-like
     elements, never the text of the complete order page. */
  [].slice.call(doc.querySelectorAll('address,dd,p,li,.form-group,[class*="pickup"],[class*="branch"],[class*="vydejn"],[class*="zasilkov"]')).forEach(function(node){
   if(node.children.length>5)return;
   var text=tclean(node.textContent),normal=norm(text);
   if(!text||text.length>220||!pickupPattern.test(normal))return;
   var point=trimShippingValue(text);if(point)pickup.push(point);
  });
  pickup=uniqueLines(pickup).slice(0,4);
  var delivery=detailBlock(doc,'delivery');
  var destination=pickup.length?pickup:(delivery?delivery.lines.slice(0,6):[]);
  if(!method&&pickup.length)method=pickup[0];
  return {price:price,method:method,destination:destination};
 }
 function shippingSummary(doc){
  var info=shippingInfo(doc);
  if(!info.price&&!info.method&&!info.destination.length)return null;
  var section=el('section','okla-ord-sec okla-ord-shipping');
  section.appendChild(Object.assign(el('h3','okla-ord-shipping__title'),{textContent:'Doprava a doručení'}));
  var grid=el('dl','okla-ord-shipping__grid');
  function row(label,values){
   values=(Array.isArray(values)?values:[values]).filter(Boolean);if(!values.length)return;
   var wrap=el('div','okla-ord-shipping__row');
   wrap.appendChild(Object.assign(el('dt'),{textContent:label}));
   var dd=el('dd');values.forEach(function(value,i){if(i)dd.appendChild(document.createElement('br'));dd.appendChild(document.createTextNode(value))});
   wrap.appendChild(dd);grid.appendChild(wrap);
  }
  row('Cena dopravy',info.price);
  row('Způsob dopravy',info.method);
  row('Místo doručení',info.destination);
  section.appendChild(grid);return section;
 }
 function detailsGrid(doc){
  var billing=detailBlock(doc,'billing'),delivery=detailBlock(doc,'delivery');
  /* Shoptet omits a separate delivery block when it is identical to billing.
     Keep both requested cards visible and mirror the address in that case. */
  if(!delivery&&billing)delivery={title:'Dodací údaje',lines:billing.lines.slice()};
  var data=[billing,delivery].filter(Boolean);
  if(!data.length)return null;
  var section=el('div','okla-ord-sec okla-ord-details');
  var grid=el('div','okla-ord-details__grid');
  data.forEach(function(group){
   var card=el('section','okla-ord-detail-card');
   card.appendChild(Object.assign(el('h3','okla-ord-detail-card__title'),{textContent:group.title}));
   var list=el('ul','okla-ord-detail-card__lines');
   group.lines.forEach(function(line){list.appendChild(Object.assign(el('li'),{textContent:line}))});
   card.appendChild(list);grid.appendChild(card);
  });
  section.appendChild(grid);return section;
 }
 function bestImage(doc,base){
  var meta=doc.querySelector('meta[property="og:image"],meta[name="twitter:image"]');
  var value=meta&&meta.getAttribute('content');
  if(value&&!/placeholder|logo/i.test(value))return absoluteUrl(value,base);
  var image=doc.querySelector('.p-main-image img,.p-image img,[itemprop="image"],main img.product-image,.product-detail img');
  return imgSrc(image,base);
 }
 function hydrateImage(item){
  if(item.img||!item.href)return Promise.resolve(item);
  var href=absoluteUrl(item.href,location.href);
  if(!href)return Promise.resolve(item);
  try{if(new URL(href).origin!==location.origin)return Promise.resolve(item)}catch(e){return Promise.resolve(item)}
  if(IMAGE_CACHE[href]!==undefined){item.img=IMAGE_CACHE[href];return Promise.resolve(item)}
  return fetch(href,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');
   item.img=bestImage(doc,href)||'';IMAGE_CACHE[href]=item.img;return item;
  }).catch(function(){IMAGE_CACHE[href]='';return item});
 }
 function hydrateImages(items){
  var pending=items.filter(function(item){return !item.img&&item.href});
  var cursor=0,workers=[];
  function work(){if(cursor>=pending.length)return Promise.resolve();return hydrateImage(pending[cursor++]).then(work)}
  for(var i=0;i<Math.min(3,pending.length);i++)workers.push(work());
  return Promise.all(workers).then(function(){return items});
 }
 function itemsList(items){
  var ul=el('ul','okla-ord-items');
  items.forEach(function(it){
   var li=el('li','okla-ord-item');
   var media;
   if(it.img){var im=el('img','okla-ord-thumb');im.src=it.img;im.alt=it.name||'';im.loading='lazy';im.decoding='async';im.width=56;im.height=56;im.onerror=function(){this.classList.add('okla-ord-thumb--ph');this.removeAttribute('src')};media=im;}
   else media=el('span','okla-ord-thumb okla-ord-thumb--ph');
   if(it.href){var mediaLink=el('a','okla-ord-item__thumb-link');mediaLink.href=it.href;mediaLink.setAttribute('aria-label','Otevřít produkt '+(it.name||''));mediaLink.appendChild(media);li.appendChild(mediaLink)}else li.appendChild(media);
   var info=el('div','okla-ord-item__info');
   var nameNode=el(it.href?'a':'span','okla-ord-item__name');nameNode.textContent=it.name||'Položka';if(it.href)nameNode.href=it.href;info.appendChild(nameNode);
   if(it.meta)info.appendChild(Object.assign(el('span','okla-ord-item__meta'),{textContent:it.meta}));
   li.appendChild(info);
   if(it.price)li.appendChild(Object.assign(el('strong','okla-ord-item__price'),{textContent:it.price}));
   ul.appendChild(li);
  });
  return ul;
 }
 function trackingLink(doc){
  var a=doc.querySelector('a[href*="zasilkovna"],a[href*="packeta"],a[href*="tracking"],a[href*="sledov"],a[href*="dpd"],a[href*="ppl"]');
  return a?a.getAttribute('href'):'';
 }

 function buildCard(item){
  var num=orderNumber(item), status=rowStatus(item.row),
      date=dateIn(item.row.textContent), total=totalIn(item.row.textContent);
  var mapped=mapStatus(status), cur=mapped?(mapped.cancelled?-1:mapped.step):-1;

  var card=el('div','okla-ord-card');
  var head=el('div','okla-ord-head');
  head.setAttribute('role','button');head.setAttribute('tabindex','0');head.setAttribute('aria-expanded','false');

  var main=el('div','okla-ord-head__main');
  main.appendChild(Object.assign(el('span','okla-ord-head__num'),{textContent:num?('#'+num):'Objednávka'}));
  if(date)main.appendChild(Object.assign(el('span','okla-ord-head__date'),{textContent:date}));
  head.appendChild(main);

  var previews=el('div','okla-ord-head__thumbs');
  previews.setAttribute('aria-label','Produkty v objednávce');
  head.appendChild(previews);

  var st=el('span','okla-ord-head__status'+(mapped&&mapped.cancelled?' is-cancelled':cur>=4?' is-delivered':''));
  st.appendChild(el('span','okla-ord-head__dot'));
  st.appendChild(Object.assign(el('span',null),{textContent:(mapped&&mapped.cancelled)?'Zrušeno':(mapped?STEPS[mapped.step]:(tclean(status)||'—'))}));
  head.appendChild(st);

  if(total)head.appendChild(Object.assign(el('span','okla-ord-head__total'),{textContent:total}));
  var chev=el('span','okla-ord-head__chev');chev.innerHTML=CHEV;head.appendChild(chev);

  var body=el('div','okla-ord-body');
  card.appendChild(head);card.appendChild(body);

  var loaded=false;
  function paintPreviews(items){
   previews.innerHTML='';
   items.filter(function(it){return !!it.img}).slice(0,3).forEach(function(it){
    var im=el('img','okla-ord-head__thumb');im.src=it.img;im.alt='';im.loading='eager';im.decoding='async';im.width=38;im.height=38;
    im.onerror=function(){this.remove()};previews.appendChild(im);
   });
   previews.hidden=!previews.children.length;
  }
  function fill(){
   if(loaded)return;loaded=true;
   var secS=el('div','okla-ord-sec');secS.appendChild(stepper(status));body.appendChild(secS);
   var secI=el('div','okla-ord-sec');
   secI.innerHTML='<div class="okla-ord-loading"><span class="okla-ord-spin"></span>Načítám položky…</div>';
   body.appendChild(secI);
   var secA=el('div','okla-ord-sec okla-ord-actions');
   var rk=el('a','okla-ord-btn okla-ord-btn--rk');rk.href='/reklamace/'+(num?('?order='+encodeURIComponent(num)+'&type=reklamace'):'?type=reklamace');rk.rel='nofollow';rk.innerHTML=CLAIM+'<span>Reklamovat zboží</span>';
   rk.addEventListener('click',function(e){e.preventDefault();confirmReklamace(num,rk.getAttribute('href'))});
   var invoiceDisabled=el('button','okla-ord-btn okla-ord-btn--invoice is-disabled');invoiceDisabled.type='button';invoiceDisabled.disabled=true;invoiceDisabled.title='Faktura zatím není k dispozici';invoiceDisabled.innerHTML=INVOICE+'<span>Faktura (PDF)</span>';
   secA.appendChild(invoiceDisabled);
   secA.appendChild(rk);
   body.appendChild(secA);
   fetch(item.href,{credentials:'same-origin'})
    .then(function(r){if(!r.ok)throw 0;return r.text()})
    .then(function(html){
     var doc=new DOMParser().parseFromString(html,'text/html');
     var items=parseItems(doc,item.href), track=trackingLink(doc), invoice=invoiceLink(doc,item.href,html), details=detailsGrid(doc), shipping=shippingSummary(doc);
     return hydrateImages(items).then(function(items){return {items:items,track:track,invoice:invoice,details:details,shipping:shipping}});
    })
    .then(function(data){
     var items=data.items,track=data.track;
     secI.innerHTML='';
     paintPreviews(items);
     if(items.length)secI.appendChild(itemsList(items));
     else secI.innerHTML='<p class="okla-ord-note">Položky nelze zobrazit. <a href="'+item.href+'">Otevřít objednávku</a></p>';
     if(items.length){
      var claimUrl='/reklamace/?order='+encodeURIComponent(num)+'&type=reklamace&product='+encodeURIComponent(items[0].name||'');
      rk.setAttribute('href',claimUrl);
     }
     if(data.shipping)body.insertBefore(data.shipping,secA);
     if(data.details)body.insertBefore(data.details,secA);
     if(data.invoice){
      var invoice=el('a','okla-ord-btn okla-ord-btn--invoice');invoice.href=data.invoice;invoice.target='_blank';invoice.rel='noopener';invoice.innerHTML=INVOICE+'<span>Faktura (PDF)</span>';
      invoiceDisabled.replaceWith(invoice);
     }
     if(track){
      var t=el('a','okla-ord-btn okla-ord-btn--track');t.href=track;t.target='_blank';t.rel='noopener';
      t.innerHTML='Sledovat zásilku'+ARROW;secA.insertBefore(t,rk);
     }
    })
    .catch(function(){
     secI.innerHTML='<p class="okla-ord-note">Detail se nepodařilo načíst. <a href="'+item.href+'">Otevřít objednávku</a></p>';
    });
  }
  function toggle(){
   var open=card.classList.toggle('is-open');
   head.setAttribute('aria-expanded',open?'true':'false');
   if(open)fill();
  }
  head.addEventListener('click',toggle);
  head.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
  /* Load product images before the card reaches the viewport. This keeps the
     collapsed row useful without fetching every historical order at once. */
  if('IntersectionObserver' in window){
   var io=new IntersectionObserver(function(entries){
    if(!entries.some(function(entry){return entry.isIntersecting}))return;
    io.disconnect();fill();
   },{rootMargin:'240px 0px'});
   io.observe(card);
  }else fill();
  return card;
 }

 function hideNativeOrderChrome(root,host,cards){
  host.classList.add('okla-ord-native-hidden');
  var selectors=['.pagination','.pagination-wrapper','.pagination-count','.pagination-loader','.paginator','.paging','[class*="pagination"]','[class*="paginator"]','[class*="paging"]'];
  [].slice.call(root.querySelectorAll(selectors.join(','))).forEach(function(node){if(!cards.contains(node))node.classList.add('okla-ord-native-hidden')});
  var parent=host.parentElement;if(!parent)return;
  var children=[].slice.call(parent.children),hasPagerCopy=children.some(function(node){return /str[aá]nka\s+z|polo[zž]ek\s+celkem/i.test(tclean(node.textContent))});
  if(!hasPagerCopy)return;
  children.forEach(function(node){
   if(node===host||node===cards||node.contains(cards))return;
   var text=tclean(node.textContent);
   if(/^\d+$/.test(text)||/str[aá]nka\s+z|polo[zž]ek\s+celkem/i.test(text))node.classList.add('okla-ord-native-hidden');
  });
 }

 function run(){
  var root=scope();if(!root)return false;
  var orders=findOrders(root);if(!orders.length)return false;
  var first=orders[0].row;
  var host=first.closest('table')||first.closest('ul,ol,.orders,[class*="order-list"]')||first.parentNode;
  if(!host||!host.parentNode)return false;
  var cards=el('div','okla-ord-cards');
  host.parentNode.insertBefore(cards,host);
  hideNativeOrderChrome(root,host,cards);
  /* Hide a lingering caption/heading row that belonged to the native table. */
  orders.forEach(function(item){cards.appendChild(buildCard(item))});
  document.documentElement.classList.add('okla-ord-ready');
  return true;
 }
 function start(){
  if(run())return;
  var tries=0;
  var mo=new MutationObserver(function(){if(run()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){mo.disconnect()},12000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
