/* OKLA V91: product detail behavior, native Shoptet cart state preserved.
   Real stock from schema.org Offer. Catalog from supplied CSV only.
   Shoptet native form, product/gallery links, rating and discussion retained. */
(function () {
 'use strict';
 if (window.__oklaV88) return;
 window.__oklaV88 = true;
 
 var catalog=window.OKLA_V86_CATALOG;
 if (!catalog) return;
 var NS='http://www.w3.org/2000/svg';
 var q=(s,root=document)=>root.querySelector(s);
 var qa=(s,root=document)=>Array.from(root.querySelectorAll(s));
 var el=(tag,cls,text)=>{var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 function svgCart(cls){var x=document.createElementNS(NS,'svg');x.setAttribute('viewBox','0 0 24 24');x.setAttribute('aria-hidden','true');if(cls)x.classList.add(cls);var p=document.createElementNS(NS,'path');p.setAttribute('d','M3 4h2.5l2 10.6h10.1L21 7.5H6 M10 20h.01 M18 20h.01');x.appendChild(p);return x}
 function svgIcon(path){var s=document.createElementNS(NS,'svg');s.setAttribute('aria-hidden','true');s.setAttribute('viewBox','0 0 24 24');var p=document.createElementNS(NS,'path');p.setAttribute('d',path);s.appendChild(p);return s}
 function stockStatus(form,buy){
  // Schema.org offer is the canonical native stock signal, not the uploaded CSV.
  var link=q('link[itemprop="availability"]',form);
  var href=link&&link.getAttribute('href')||'';
  if(/OutOfStock|SoldOut|Discontinued/i.test(href))return false;
  if(/InStock|LimitedAvailability/i.test(href))return true;
  if(/PreOrder|BackOrder/i.test(href))return false;
  var msg=(q('.availability-label',buy)?.textContent||'').toLowerCase();
  if(/nedostupn|není skladem|vyprodán/.test(msg))return false;
  if(/skladem|k dispozici/.test(msg))return true;
  return null;
 }
 function brandModel(h1,brand){if(!brand)return;var name=h1.textContent;
  var patterns=[/LILYGO T Embed CC1101 ESP32 S3/i,/LILYGO T Deck Plus/i,/M5Stack Cardputer ADV/i,/WANBO X5 Pro/i,/Flipper Zero/i];
  var match=patterns.map(r=>name.match(r)).find(Boolean);if(!match)return;
  var start=match.index,span=el('span','ok86-model',match[0]);h1.textContent='';h1.append(document.createTextNode(name.slice(0,start)),span,document.createTextNode(name.slice(start+match[0].length)))
 }
 function setMeta(attr,key,value){var m=q('meta['+attr+'="'+key+'"]');if(!m){m=el('meta');m.setAttribute(attr,key);document.head.appendChild(m)}m.setAttribute('content',value)}
 function canonical(){var href=location.origin+location.pathname;var l=q('link[rel="canonical"]');if(!l){l=el('link');l.setAttribute('rel','canonical');document.head.append(l)}l.href=href;return href}
 function updateSeo(p){document.title=p.seoTitle;setMeta('name','description',p.metaDescription);setMeta('property','og:title',p.seoTitle);setMeta('property','og:description',p.metaDescription);setMeta('property','og:url',canonical())}
 function configureAvailability(form,buy,btn){
  var available=stockStatus(form,buy),box=q('.availability-value',buy);
  if(box){box.classList.toggle('ok86-out',available===false);box.classList.toggle('ok86-in',available===true)}
  if(available===false){
    if(!btn.disabled){btn.disabled=true;btn.dataset.ok91DisabledByTheme='1'}
    btn.setAttribute('aria-disabled','true');btn.classList.add('ok86-disabled');
  }else if(available===true){
    if(btn.dataset.ok91DisabledByTheme==='1'){
      btn.disabled=false;delete btn.dataset.ok91DisabledByTheme;
      btn.removeAttribute('aria-disabled');btn.classList.remove('ok86-disabled');
    }
  }
  // Unknown native state: do not change Shoptet disabled/enabled state.
 }
 function paramsTab(p,detail){var tabs=q('ul.p-detail-tabs',document);var content=q('#tab-content');if(!tabs||!content||q('#ok86-parameters'))return;
  var li=el('li','shp-tab ok86-parameters-tab');li.setAttribute('role','none');
  var a=el('a','shp-tab-link','Parametry');a.href='#ok86-parameters';a.setAttribute('role','tab');a.setAttribute('aria-selected','false');li.append(a);
  var disc=q('li[data-testid="tabDiscussion"]',tabs);if(disc)tabs.insertBefore(li,disc);else tabs.append(li);
  var panel=el('div','tab-pane fade');panel.id='ok86-parameters';panel.setAttribute('role','tabpanel');
  var table=el('table','ok86-params');var tb=el('tbody');
  Object.entries(p.parameters).forEach(([key,value])=>{if(!value)return;var tr=el('tr');var th=el('th',null,key);th.scope='row';tr.append(th,el('td',null,value));tb.append(tr)});
  table.append(tb);panel.append(table);content.append(panel);
  a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();qa('li.shp-tab',tabs).forEach(n=>n.classList.remove('active'));li.classList.add('active');qa('.tab-pane',content).forEach(n=>n.classList.remove('active','in'));panel.classList.add('active','in');history.replaceState(history.state,'','#ok86-parameters')});
  qa('a.shp-tab-link',tabs).filter(n=>n!==a).forEach(native=>native.addEventListener('click',()=>{li.classList.remove('active');panel.classList.remove('active','in')},false));
 }
 function richDescription(p){var basic=q('#description .basic-description');if(!basic)return;
  // Markup is generated only from the 33-row supplied CSV, HTML-escaped on export.
  basic.innerHTML=p.descHtml;
  var compat=p.compatibilityAndPackage;
  if(compat&&(compat.compatibility||compat.package)){
   var sec=el('section','ok86-compatibility');sec.append(el('h3',null,'Kompatibilita a obsah balení'));
   if(compat.compatibility)sec.append(el('p',null,'Kompatibilita: '+compat.compatibility));
   if(compat.package)sec.append(el('p',null,'Obsah balení: '+compat.package));
   basic.append(sec);
  }
 }
 function trustBar(detail){if(q('.ok86-trust'))return;
  var strip=el('section','ok86-trust');strip.setAttribute('aria-label','Informace k nákupu');
  var facts=[
   ['M3 7h18 M7 3v8 M17 3v8 M5 21h14', 'Odstoupení do 14 dnů','/vraceni-zbozi-a-odstoupeni/'],
   ['M12 3 4 7v6c0 5 4 8 8 9 4-1 8-4 8-9V7z','Zákonná odpovědnost za vady 24 měsíců','/reklamacni-rad/'],
   ['M3 7h18v12H3z M3 11h18','Doprava a platba v košíku před objednávkou','/doprava-a-platba/'],
   ['M3 5h18v14H3z M3 6l9 7 9-7','Kontakt: podpora@okla.cz','mailto:podpora@okla.cz']
  ];
  facts.forEach(([path,title,href])=>{var box=el('div');box.append(svgIcon(path));var a=el('a',null,title);a.href=href;box.append(a);strip.append(box)});
  var related=q('.ok86-related');var detailEnd=related||q('.p-detail-tabs-wrapper')||detail;
  detailEnd.after(strip);
 }
 function knownUrl(p){return p.url||null}
 function relatedCarousel(p,detail){var records=p.related.map(c=>catalog[c]).filter(Boolean);if(records.length<1||q('.ok86-related'))return;
  var section=el('section','ok86-related');section.append(el('h2',null,'Mohlo by vás zajímat'));var track=el('div','ok86-related-track');
  records.forEach(r=>{var item=el('article','ok86-related-card');
   var img=el('img');img.src=r.image;img.alt=r.imageDesc;img.loading='lazy';item.append(img);
   var href=knownUrl(r);var name=el(href?'a':'div','ok86-related-title',r.name);if(href)name.href=href;item.append(name);
   if(r.isNew===true)item.append(el('div','ok86-related-badge','NOVINKA'));
   item.append(el('div','ok86-related-price',Number(r.price).toLocaleString('cs-CZ')+' Kč'));
   if(href){var c=el('a','ok86-related-link');c.href=href;c.append(svgCart(),document.createTextNode('Zobrazit produkt'));item.append(c)}
   track.append(item)
  });section.append(track);var tabs=q('.p-detail-tabs-wrapper');if(tabs)tabs.after(section);else detail.after(section);
 }
 function init(){
  var detail=q('#content .p-detail'),form=q('#product-detail-form',detail||document),top=q('.row.product-top',form||document),sku=q('[itemprop="sku"]',form||document)?.getAttribute('content')||q('.p-code>span:last-child',detail||document)?.textContent?.trim();
  if(!detail||!form||!top||!sku||!catalog[sku])return;
  if(detail.dataset.ok89Complete==='1')return;
  var p=catalog[sku],gallery=q(':scope > .p-image-wrapper',top),buy=q(':scope > .p-info-wrapper',top),header=q('.p-detail-inner-header',detail),rating=q(':scope > .col-xs-12 > .p-detail-info',top)||q(':scope > .p-info-wrapper > .p-detail-info',top),btn=q(':scope > .add-to-cart > button.add-to-cart-button',buy||document),price=q(':scope > .p-final-price-wrapper',buy||document);
  if(!gallery||!buy||!header||!rating||!btn||!price)return;
  /* V87 duplicate boot could leave the buy box marked empty and entirely invisible. */
  buy.classList.remove('ok86-empty');
  var journal=[];function move(n,target,before){if(!n||!target)return;journal.push({n,parent:n.parentNode,next:n.nextSibling});target.insertBefore(n,before||null)}
  var orphan=rating.parentNode;
  var originalRatingWrapper=orphan!==buy&&orphan!==gallery&&orphan.parentNode===top?orphan:null;
  // Move the original native nodes, never clone listeners or the purchase form.
  move(header,buy,buy.firstChild);move(rating,buy,header.nextSibling);
  var link=q(':scope > p[data-testid="productCardDescr"]',buy),short=q(':scope > .p-short-description',buy),stock=q(':scope > .availability-value',buy);
  if(short)move(short,buy,price);if(link)move(link,buy,price);if(stock)move(stock,buy,price);
  top.classList.add('ok86-grid');if(originalRatingWrapper)originalRatingWrapper.classList.add('ok86-empty');buy.classList.remove('ok86-empty');
  function rollback(){for(var j=journal.length-1;j>=0;j--){var x=journal[j];if(x.next&&x.next.parentNode===x.parent)x.parent.insertBefore(x.n,x.next);else x.parent.appendChild(x.n)}top.classList.remove('ok86-grid');if(originalRatingWrapper)originalRatingWrapper.classList.remove('ok86-empty');document.body.classList.remove('ok89-detail')}
  {
   // Atomic DOM rewrite: no intermediate blank frame; CSS is already injected.
   var h1=q('h1',header);if(h1){h1.textContent=p.name;brandModel(h1,p.brand)}
   // Existing code is relocated, not erased. Do not output unverified manufacturer URLs.
   var code=q('.p-code',header);if(code)code.style.display='none';
   if(p.brand){var bLink=el('a','ok86-brand','Vše od '+p.brand);bLink.href='/vyhledavani/?string='+encodeURIComponent(p.brand);header.before(bLink)}
   var noRating=q('.stars-label',rating);if(noRating&&/neohodnoceno/i.test(noRating.textContent))noRating.textContent='Zatím bez hodnocení';
   // Five filled decorative stars only when no verified customer rating exists.
   if(noRating&&/bez hodnocení|neohodnoceno/i.test(noRating.textContent)){
    var starContainer=q('.stars-wrapper',rating);
    if(starContainer&&!q('.ok91-decorative-stars',starContainer)){
      var ds=el('span','ok91-decorative-stars');ds.setAttribute('aria-hidden','true');
      for(var k=0;k<5;k++){
       var sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','0 0 24 24');
       var pa=document.createElementNS(NS,'path');pa.setAttribute('d','M12 2l3.09 6.26 6.91 1.01-5 4.88 1.18 6.9L12 17.8l-6.18 3.25L7 14.15 2 9.27l6.91-1.01L12 2z');
       sv.appendChild(pa);ds.appendChild(sv);
      }
      starContainer.prepend(ds);starContainer.classList.add('ok91-unrated');
    }
   }
   if(short)short.textContent=p.shortDescription;
   if(link){link.classList.add('ok86-description-link');var al=q('a',link);if(al){al.textContent='Zobrazit celý popis';al.href='#description'}}
   var micro=el('div','ok86-micro');micro.append(el('span',null,'Kód: '+p.code),el('span',null,'Zákonná odpovědnost za vady 24 měsíců'));buy.append(micro);
   var img=q('.p-main-image img',gallery);if(img)img.alt=p.imageDesc;
   var zoom=q('.p-main-image',gallery);if(zoom)zoom.setAttribute('data-alt',p.imageDesc);
   if(!q('.ok86-cart-icon',btn))btn.prepend(svgCart('ok86-cart-icon'));
   configureAvailability(form,buy,btn);
   var availability=q('.availability-value',buy);if(availability){new MutationObserver(()=>configureAvailability(form,buy,btn)).observe(availability,{characterData:true,childList:true,subtree:true})}
   form.addEventListener('submit',function(ev){if(stockStatus(form,buy)===false){ev.preventDefault();ev.stopImmediatePropagation()}},true);
   richDescription(p);paramsTab(p,detail);relatedCarousel(p,detail);trustBar(detail);updateSeo(p);
   detail.dataset.ok89Complete='1';document.body.classList.add('ok89-detail');
   window.oklaV89State={code:p.code,active:true,stock:stockStatus(form,buy),relatedRendered:q('.ok86-related-track')?.children.length||0,parameters:Object.keys(p.parameters).length};
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 /* Do not invoke init again on window.load; the native nodes have already moved. */
})();