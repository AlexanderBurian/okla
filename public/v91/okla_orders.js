/* OKLA V91 – customer "Moje objednávky" list enhancement. After sign-in Shoptet
   renders the order history in #content. We enhance it NON-DESTRUCTIVELY: every
   order keeps its native detail link, but it becomes an arrow that expands a clean
   inline panel. On open the customer immediately sees the DELIVERY STATUS (a small
   stepper mapped from the order's status), then the products with tiny thumbnails,
   plus a "Sledovat zásilku" link when available and a "Reklamovat" shortcut that
   pre-fills /reklamace/.

   Detection needs a strong signal (a detail link + an order-number-like token) and
   never rewrites native nodes, so if the theme differs it simply does nothing. */
(function(){
 'use strict';
 if(window.__oklaOrdersV1)return;
 window.__oklaOrdersV1=true;

 var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true" class="okla-ord-chev"><path d="M6 9l6 6 6-6"/></svg>';
 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

 var STEPS=['Objednáno','Zpracování','Expedováno','V přepravě','Doručeno'];
 var STATUS_MAP=[
  {m:['storno','zrus','zamit','vrac','odstoupen'],cancelled:true,label:'Zrušeno'},
  {m:['dorucen','vyrizen','dokoncen','vyzvednut'],step:4},
  {m:['v preprav','na ceste','ceste','dopravci','vydejn','prepravuje'],step:3},
  {m:['expedov','odeslan','pripraveno k vyzvednuti','predano doprav'],step:2},
  {m:['zpracov','potvrzen','prijata platba','platba prijata','balime','kompletuje'],step:1},
  {m:['prijat','nova','ceka','zalozen','nezaplacen','vytvoren','objednan'],step:0}
 ];
 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
 function mapStatus(text){var n=norm(text);for(var i=0;i<STATUS_MAP.length;i++){if(STATUS_MAP[i].m.some(function(x){return n.indexOf(x)!==-1}))return STATUS_MAP[i]}return null}
 function tclean(s){return String(s||'').replace(/\s+/g,' ').trim()}

 function scope(){return document.querySelector('#content .content-inner')||document.querySelector('#content')}

 /* The order number comes from the detail link (…?id=250042 or a number in the
    path) or a cell that is purely a number – never from the whole row text, whose
    cells concatenate without separators. */
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

 /* The status is usually already printed in the list row; we read it from there so
    the stepper can appear instantly, before the detail is fetched. */
 function rowStatus(row){
  var cells=row.querySelectorAll('td,th,[class*="status"],[class*="state"],[class*="col"]');
  for(var i=0;i<cells.length;i++){var t=tclean(cells[i].textContent);if(t&&t.length<40&&mapStatus(t))return t}
  return '';
 }

 function findOrders(root){
  var out=[],seen=[];
  var links=[].slice.call(root.querySelectorAll('a[href]'));
  links.forEach(function(a){
   var href=a.getAttribute('href')||'';
   if(!/(objednavk|objednavka|order)/i.test(href))return;
   if(/^\/objednavky\/?($|[?#])/.test(href))return;        /* the list page itself */
   if(/\/reklamace/i.test(href))return;
   var row=a.closest('tr, li, .order, [class*="order-"], [data-order], article');
   if(!row||row===root||seen.indexOf(row)>-1)return;
   if(!/\d{3,}/.test(row.textContent))return;              /* looks like an order row */
   seen.push(row);
   out.push({row:row,link:a,href:href});
  });
  return out;
 }

 function stepper(statusText){
  var mapped=mapStatus(statusText);
  var cancelled=mapped&&mapped.cancelled;
  var cur=mapped?(cancelled?-1:mapped.step):-1;
  var box=document.createElement('div');box.className='okla-ord-status';
  var head=document.createElement('div');head.className='okla-ord-status__head';
  var lbl=document.createElement('span');lbl.className='okla-ord-status__label';
  lbl.textContent='Stav doručení';
  var badge=document.createElement('span');badge.className='okla-ord-status__badge';
  badge.textContent=cancelled?'Zrušeno':(mapped?STEPS[mapped.step]:(tclean(statusText)||'—'));
  if(cancelled)badge.classList.add('is-cancelled');else if(cur>=4)badge.classList.add('is-delivered');
  head.appendChild(lbl);head.appendChild(badge);box.appendChild(head);
  if(!cancelled){
   var ol=document.createElement('ol');ol.className='okla-ord-steps';
   STEPS.forEach(function(name,i){
    var li=document.createElement('li');li.className='okla-ord-step';
    if(i<cur)li.className+=' is-done';else if(i===cur)li.className+=' is-active';else li.className+=' is-upcoming';
    var dot=document.createElement('span');dot.className='okla-ord-step__dot';
    var t=document.createElement('span');t.className='okla-ord-step__t';t.textContent=name;
    li.appendChild(dot);li.appendChild(t);ol.appendChild(li);
   });
   box.appendChild(ol);
  }
  return box;
 }

 function parseItems(doc){
  var inner=doc.querySelector('#content .content-inner')||doc.querySelector('#content')||doc.body;
  if(!inner)return [];
  var out=[];
  var trs=[].slice.call(inner.querySelectorAll('table tr'));
  trs.forEach(function(tr){
   if(tr.querySelector('th'))return;
   var cells=[].slice.call(tr.children);
   var img=tr.querySelector('img');
   if(cells.length<2&&!img)return;
   var link=tr.querySelector('a');
   var name=link?tclean(link.textContent):'';
   if(!name){var best='';cells.forEach(function(c){var t=tclean(c.textContent);if(t.replace(/[^0-9a-zA-ZÀ-ž]/g,'').length>best.replace(/[^0-9a-zA-ZÀ-ž]/g,'').length)best=t});name=best}
   if(!name||/mezisou|celkem|doprava|platba|sleva|dph|zaokrouhl/i.test(name))return;
   var src=img?(img.getAttribute('src')||img.getAttribute('data-src')||''):'';
   var meta='';
   cells.forEach(function(c){var t=tclean(c.textContent);if(t&&t!==name&&/\d/.test(t)&&t.length<24)meta+=(meta?' · ':'')+t});
   out.push({img:src,name:name.slice(0,80),meta:meta.slice(0,60)});
  });
  if(out.length)return out.slice(0,14);
  [].slice.call(inner.querySelectorAll('img')).forEach(function(im){
   var src=im.getAttribute('src')||im.getAttribute('data-src')||'';if(!src)return;
   if(/sprite|icon|logo|placeholder/i.test(src))return;
   out.push({img:src,name:tclean(im.getAttribute('alt'))||'Položka',meta:''});
  });
  return out.slice(0,14);
 }

 function itemsList(items){
  var ul=document.createElement('ul');ul.className='okla-ord-items';
  items.forEach(function(it){
   var li=document.createElement('li');li.className='okla-ord-item';
   if(it.img){var im=document.createElement('img');im.className='okla-ord-thumb';im.src=it.img;im.alt=it.name||'';im.loading='lazy';li.appendChild(im);}
   else{var ph=document.createElement('span');ph.className='okla-ord-thumb okla-ord-thumb--ph';ph.setAttribute('aria-hidden','true');li.appendChild(ph);}
   var info=document.createElement('div');info.className='okla-ord-item__info';
   var nm=document.createElement('span');nm.className='okla-ord-item__name';nm.textContent=it.name||'Položka';info.appendChild(nm);
   if(it.meta){var mt=document.createElement('span');mt.className='okla-ord-item__meta';mt.textContent=it.meta;info.appendChild(mt);}
   li.appendChild(info);ul.appendChild(li);
  });
  return ul;
 }

 function trackingLink(doc){
  var a=doc.querySelector('a[href*="zasilkovna"],a[href*="packeta"],a[href*="tracking"],a[href*="sledov"],a[href*="dpd"],a[href*="ppl"]');
  return a?a.getAttribute('href'):'';
 }

 function makePanelHost(row){
  if(row.tagName==='TR'){
   var cells=row.children.length||1;
   var tr=document.createElement('tr');tr.className='okla-ord-detail';
   var td=document.createElement('td');td.colSpan=cells;tr.appendChild(td);
   row.parentNode.insertBefore(tr,row.nextSibling);
   return {wrap:tr,body:td};
  }
  var div=document.createElement('div');div.className='okla-ord-detail okla-ord-detail--block';
  row.parentNode.insertBefore(div,row.nextSibling);
  return {wrap:div,body:div};
 }

 function enhance(item){
  var row=item.row,link=item.link;
  if(row.dataset.oklaOrder)return;
  row.dataset.oklaOrder='1';
  row.classList.add('okla-ord-row');
  var num=orderNumber(item);
  var status=rowStatus(row);

  link.classList.add('okla-ord-open','okla-ord-detailbtn');
  if(!link.querySelector('.okla-ord-chev')){
   var cw=document.createElement('span');cw.className='okla-ord-chev-wrap';cw.innerHTML=CHEV;link.appendChild(cw);
  }
  link.setAttribute('aria-expanded','false');

  /* Keep the two buttons together and symmetric. */
  var actions=document.createElement('span');actions.className='okla-ord-actions';
  if(link.parentNode){link.parentNode.insertBefore(actions,link);actions.appendChild(link);}
  var rk=document.createElement('a');rk.className='okla-ord-rk';rk.href='/reklamace/'+(num?('?order='+encodeURIComponent(num)):'');
  rk.setAttribute('rel','nofollow');rk.textContent='Reklamovat';
  actions.appendChild(rk);

  var panel=null,loaded=false;

  function collapse(){if(!panel)return;panel.wrap.classList.remove('is-open');row.classList.remove('is-open');link.setAttribute('aria-expanded','false');}
  function expand(){
   if(!panel)panel=makePanelHost(row);
   panel.wrap.classList.add('is-open');row.classList.add('is-open');link.setAttribute('aria-expanded','true');
   if(loaded)return;loaded=true;
   panel.body.innerHTML='';
   var inner=document.createElement('div');inner.className='okla-ord-detail__body';
   inner.appendChild(stepper(status));
   var box=document.createElement('div');box.className='okla-ord-itemsbox';
   box.innerHTML='<div class="okla-ord-detail__loading"><span class="okla-ord-spin"></span>Načítám položky objednávky…</div>';
   inner.appendChild(box);
   panel.body.appendChild(inner);
   fetch(item.href,{credentials:'same-origin'})
    .then(function(r){if(!r.ok)throw 0;return r.text()})
    .then(function(html){
     var doc;try{doc=new DOMParser().parseFromString(html,'text/html')}catch(e){throw 0}
     var items=parseItems(doc);
     var track=trackingLink(doc);
     box.innerHTML='';
     if(items.length)box.appendChild(itemsList(items));
     else box.innerHTML='<p class="okla-ord-detail__note">Položky nelze zobrazit. <a href="'+item.href+'">Otevřít objednávku</a></p>';
     if(track){
      var t=document.createElement('a');t.className='okla-ord-track';t.href=track;t.target='_blank';t.rel='noopener';
      t.innerHTML='Sledovat zásilku'+ARROW;box.appendChild(t);
     }
    })
    .catch(function(){
     loaded=false;
     box.innerHTML='<p class="okla-ord-detail__note">Detail se nepodařilo načíst. <a href="'+item.href+'">Otevřít objednávku</a></p>';
    });
  }
  link.addEventListener('click',function(e){e.preventDefault();if(row.classList.contains('is-open'))collapse();else expand();});
 }

 function run(){
  var root=scope();if(!root)return false;
  var orders=findOrders(root);if(!orders.length)return false;
  document.documentElement.classList.add('okla-ord-ready');
  orders.forEach(enhance);
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
