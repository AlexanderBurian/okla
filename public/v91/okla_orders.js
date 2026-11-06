/* OKLA V91 – customer "Moje objednávky" list enhancement. After sign-in Shoptet
   renders the order history in #content. We enhance it NON-DESTRUCTIVELY: every
   order keeps its native detail link, but we turn it into an arrow that expands
   the order detail inline (lazy-fetched from the same link), and we add a
   "Reklamovat" shortcut per order that pre-fills /reklamace/.

   The detection needs a strong signal (a detail link + an order-number-like
   token in the row) and never rewrites native nodes, so if the theme differs it
   simply does nothing rather than breaking the page. */
(function(){
 'use strict';
 if(window.__oklaOrdersV1)return;
 window.__oklaOrdersV1=true;

 var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true" class="okla-ord-chev"><path d="M6 9l6 6 6-6"/></svg>';

 function scope(){return document.querySelector('#content .content-inner')||document.querySelector('#content')}
 /* The order number is read from the detail link (…?id=250042 or a number in the
    path) or from a cell that is purely a number – never from the whole row text,
    whose cells concatenate without separators. */
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

 function cleanFetchedDetail(html){
  var doc;
  try{doc=new DOMParser().parseFromString(html,'text/html')}catch(e){return null}
  var inner=doc.querySelector('#content .content-inner')||doc.querySelector('#content')||doc.body;
  if(!inner)return null;
  /* Drop anything that should not live inside an inline panel. */
  Array.prototype.forEach.call(inner.querySelectorAll('script,style,form,.breadcrumbs,.breadcrumb,.breadcrumbs-wrapper,h1,.okla-order-status,.okla-rk'),function(n){n.remove()});
  var frag=document.createElement('div');
  frag.className='okla-ord-detail__body';
  frag.innerHTML=inner.innerHTML;
  /* Neutralise ids so the fetched copy cannot clash with the live page. */
  Array.prototype.forEach.call(frag.querySelectorAll('[id]'),function(n){n.removeAttribute('id')});
  return frag;
 }

 function makePanelHost(row){
  /* For a table row, the panel is a new full-width row right below it; otherwise
     a sibling block. */
  if(row.tagName==='TR'){
   var cells=row.children.length||1;
   var tr=document.createElement('tr');
   tr.className='okla-ord-detail';
   var td=document.createElement('td');
   td.colSpan=cells;
   tr.appendChild(td);
   row.parentNode.insertBefore(tr,row.nextSibling);
   return {wrap:tr,body:td};
  }
  var div=document.createElement('div');
  div.className='okla-ord-detail okla-ord-detail--block';
  row.parentNode.insertBefore(div,row.nextSibling);
  return {wrap:div,body:div};
 }

 function enhance(item){
  var row=item.row,link=item.link;
  if(row.dataset.oklaOrder)return;
  row.dataset.oklaOrder='1';
  row.classList.add('okla-ord-row');
  var num=orderNumber(item);

  /* The detail link becomes the arrow toggle (still navigable without JS). */
  link.classList.add('okla-ord-open');
  if(!link.querySelector('.okla-ord-chev')){
   var span=document.createElement('span');span.className='okla-ord-chev-wrap';span.innerHTML=CHEV;
   link.appendChild(span);
  }
  link.setAttribute('aria-expanded','false');

  var panel=null,loaded=false;

  function collapse(){
   if(!panel)return;
   panel.wrap.classList.remove('is-open');
   row.classList.remove('is-open');
   link.setAttribute('aria-expanded','false');
  }
  function expand(){
   if(!panel){panel=makePanelHost(row);}
   panel.wrap.classList.add('is-open');
   row.classList.add('is-open');
   link.setAttribute('aria-expanded','true');
   if(loaded)return;
   loaded=true;
   panel.body.innerHTML='<div class="okla-ord-detail__loading"><span class="okla-ord-spin"></span>Načítám detail objednávky…</div>';
   fetch(item.href,{credentials:'same-origin'})
    .then(function(r){if(!r.ok)throw 0;return r.text()})
    .then(function(html){
     var frag=cleanFetchedDetail(html);
     if(!frag||!frag.textContent.trim()){throw 0}
     panel.body.innerHTML='';
     panel.body.appendChild(frag);
    })
    .catch(function(){
     loaded=false;
     panel.body.innerHTML='<div class="okla-ord-detail__loading">Detail se nepodařilo načíst. '+
       '<a href="'+item.href+'">Otevřít objednávku</a></div>';
    });
  }
  link.addEventListener('click',function(e){
   e.preventDefault();
   if(row.classList.contains('is-open'))collapse();else expand();
  });

  /* "Reklamovat" shortcut – prefilled complaint for this order. */
  var rkHref='/reklamace/'+(num?('?order='+encodeURIComponent(num)):'');
  var actionHost=link.parentNode;
  if(actionHost&&!actionHost.querySelector('.okla-ord-rk')){
   var rk=document.createElement('a');
   rk.className='okla-ord-rk';rk.href=rkHref;rk.textContent='Reklamovat';
   rk.setAttribute('rel','nofollow');
   actionHost.appendChild(rk);
  }
 }

 function run(){
  var root=scope();
  if(!root)return false;
  var orders=findOrders(root);
  if(!orders.length)return false;
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
