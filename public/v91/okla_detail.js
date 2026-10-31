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
 /* Native Shoptet buttons .increase and .decrease already handle min/max/step and accessibility.
    Do not duplicate them or their events. */
 function useNativeQuantity(buy){
  var quantity=q('.add-to-cart .quantity',buy);
  if(!quantity)return;
  quantity.classList.remove('ok86-stepper-ready');
  qa('.ok86-qty-step',quantity).forEach(n=>n.remove());
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
  var related=q('.ok86-related');var detailEnd=related||q('.p-detail-tabs-wrapper,.p-details-tabs-wrapper')||detail;
  detailEnd.after(strip);
 }
 function knownUrl(p){return p.url||null}
 /* Shows either the review block or the native tab content. Never scrolls. */
 function showTabPanel(name){
  var review=q('.ok97-review-block'),content=q('#tab-content');
  if(review)review.style.setProperty('display',name==='review'?'':'none','important');
  if(content)content.style.setProperty('display',name==='review'?'none':'','important');
 }
 /* Alza-style tabs: retain native Shoptet tab links, markup and event handlers. */
 function formatTabs(){
  var tabs=q('ul.p-detail-tabs');
  if(!tabs||tabs.dataset.ok97Formatted==='1')return;
  var links=qa('a.shp-tab-link',tabs);
  var desc=links.find(a=>(a.getAttribute('href')||'').includes('description'))||links[0];
  var params=q('li.ok86-parameters-tab',tabs),discussion=q('li[data-testid="tabDiscussion"]',tabs);
  if(!desc)return;
  var homeLi=desc.closest('li');
  if(!homeLi)return;
  /* Only real sections get navigable tabs; unsupported tabs are not fabricated. */
  var review=q('.ok97-review-block');
  if(review&&!q('li.ok97-review-tab',tabs)){
   var reviewLi=el('li','shp-tab ok97-review-tab'),reviewLink=el('a','ok97-anchor-tab','Recenze');
   reviewLink.href='#ok97-review-block';
   reviewLi.append(reviewLink);
   homeLi.after(reviewLi);
   /* Panels switch in place: the click is prevented, so the page never jumps to the anchor. */
   reviewLink.addEventListener('click',function(e){
    e.preventDefault();
    qa('li.shp-tab',tabs).forEach(li=>li.classList.remove('active'));
    reviewLi.classList.add('active');
    showTabPanel('review');
   });
   qa('a.shp-tab-link',tabs).forEach(a=>a.addEventListener('click',function(){
    reviewLi.classList.remove('active');
    showTabPanel('content');
   }));
  }
  var reviewTab=q('li.ok97-review-tab',tabs);
  if(params)(reviewTab||homeLi).after(params);
  if(discussion)(params||reviewTab||homeLi).after(discussion);
  /* Keep Shoptet native click listeners, aria roles, and anchor; replace only visual text. */
  /* Text glyph avoids oversized inline SVG inherited from legacy Shoptet CSS. */
  var home=el('span','ok99-tab-house','⌂');home.setAttribute('aria-hidden','true');
  desc.replaceChildren(home);
  desc.setAttribute('aria-label','Popis');desc.setAttribute('title','Popis');
  tabs.dataset.ok97Formatted='1';
 }
 /* Display only a real Shoptet native price; do not overwrite variant prices or add fabricated discounts. */
 function formattedPrice(raw){
  var match=String(raw||'').replace(/\u00a0/g,' ').match(/(\d[\d\s]*)(?:[.,]00)?\s*Kč/i);
  if(!match)return null;
  var num=Number(match[1].replace(/\s/g,''));
  return Number.isFinite(num)&&num>=0?num.toLocaleString('cs-CZ')+',-':null;
 }
 function formatDetailPrice(buy){
  /* Shoptet wraps the amount in .price-final-holder; the holder is the text node to reformat. */
  var holder=q('.p-final-price-wrapper .price-final .price-final-holder',buy)||q('.p-final-price-wrapper .price-final',buy);
  if(!holder||holder.children.length)return;
  var price=formattedPrice(holder.textContent);
  if(price&&holder.textContent.trim()!==price)holder.textContent=price;
 }
 function hasRealReviews(){
  var ld=qa('script[type="application/ld+json"]');
  for(var i=0;i<ld.length;i++){try{
    var d=JSON.parse(ld[i].textContent),nodes=Array.isArray(d)?d:[d];
    for(var node of nodes){
      var x=node&&node.aggregateRating;
      if(x&&Number(x.ratingCount||x.reviewCount)>0)return true;
    }
  }catch(e){}}
  var label=q('#content .p-detail-info .stars-label')?.textContent||'';
  return /[1-5](?:[,.][0-9])?\s*\/\s*5/.test(label);
 }
 /* Separate review section. Existing product-box ratings are intentionally left untouched. */
 function reviewSection(detail){
  if(hasRealReviews()||q('.ok97-review-block'))return;
  var nativeLabel=q('.p-detail-info .stars-label',detail)?.textContent||'';
  if(!/zatím bez hodnocení|neohodnoceno/i.test(nativeLabel))return;
  var tabs=q('.p-detail-tabs-wrapper,.p-details-tabs-wrapper');
  if(!tabs)return;
  var section=el('section','ok97-review-block');
  section.id='ok97-review-block';
  section.setAttribute('aria-label','Hodnocení produktu');
  section.append(el('h2',null,'Produkt zatím nikdo nehodnotil'));
  /* Separate neutral outline symbols, not inline SVG and never a fabricated rating. */
  var stars=el('div','ok97-review-stars');stars.setAttribute('aria-hidden','true');
  for(var i=0;i<5;i++)stars.append(el('span','ok99-star','☆'));
  section.append(stars);
  /* No "Napsat recenzi" link unless a real Shoptet review URL is present. */
  var nativeReview=qa('a[href]',detail).find(a=>/napsat (recenzi|hodnocení)|přidat hodnocení/i.test(a.textContent||'')&&!a.getAttribute('href')?.startsWith('javascript:'));
  if(nativeReview){
   var link=el('a','ok97-write-review','Napsat recenzi');link.href=nativeReview.href;
   var icon=document.createElementNS(NS,'svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');var pp=document.createElementNS(NS,'path');pp.setAttribute('d','M4 20h4l11-11-4-4L4 16v4z M13 7l4 4');icon.append(pp);link.prepend(icon);section.append(link);
  }
  tabs.after(section);
 }
 /* A card may be actionable only after its own live Shoptet stock has been confirmed. */
 function shoptetAvailability(doc){
  var node=doc.querySelector('link[itemprop="availability"],meta[itemprop="availability"]');
  var v=node?.getAttribute('href')||node?.getAttribute('content')||'';
  if(/OutOfStock|SoldOut|Discontinued|BackOrder|PreOrder/i.test(v))return false;
  if(/InStock|LimitedAvailability/i.test(v))return true;
  var txt=doc.querySelector('.availability-label,.availability-value')?.textContent||'';
  if(/nedostupn|není skladem|vyprodán/i.test(txt))return false;
  if(/skladem|k dispozici/i.test(txt))return true;
  return null;
 }
 function liveCardState(r,card,btn){
  if(!r.url)return;
  var path;try{path=new URL(r.url,location.origin).pathname}catch(e){return}
  fetch(path,{credentials:'same-origin',headers:{'Accept':'text/html'}}).then(resp=>{
   if(!resp.ok||!resp.headers.get('content-type')?.includes('text/html'))throw new Error('invalid product response');
   return resp.text();
  }).then(html=>{
   var doc=new DOMParser().parseFromString(html,'text/html');
   /* Product code and availability must agree with the native product page. */
   var sku=doc.querySelector('[itemprop="sku"]')?.getAttribute('content')||
     doc.querySelector('.p-code')?.textContent?.replace(/^\s*Kód\s*:\s*/i,'').trim();
   if(!sku||sku!==r.code)return;
   var stock=shoptetAvailability(doc);
   var nativePrice=doc.querySelector('.p-final-price-wrapper .price-final strong,.p-final-price-wrapper .price-final')?.textContent;
   var priceText=formattedPrice(nativePrice);
   if(priceText){var span=q('.price-final strong',card);if(span)span.textContent=priceText}
   if(stock===false){btn.disabled=true;btn.classList.add('ok97-unavailable');btn.setAttribute('aria-disabled','true');return}
   if(stock===true&&window.shoptet?.cartShared?.addToCart){
    btn.disabled=false;btn.classList.remove('ok97-unavailable');btn.removeAttribute('aria-disabled');
    btn.onclick=function(){
      if(btn.disabled)return;
      window.shoptet.cartShared.addToCart({productCode:r.code,amount:1});
    };
   }
  }).catch(()=>{ /* Unknown stock: leave button disabled; never invent stock. */ });
 }
 function categoryHref(cat){
  var crumbs=qa('.breadcrumbs a[href]');var match=crumbs.find(a=>a.textContent.trim()===cat);
  return match?.getAttribute('href')||null;
 }
 function relatedCarousel(p,detail){
  var records=Object.values(catalog).filter(x=>x.defaultCategory===p.defaultCategory&&x.code!==p.code)
    .sort((a,b)=>a.code.localeCompare(b.code,'cs')).slice(0,10);
  if(!records.length||q('.ok86-related'))return;
  var sec=el('section','ok86-related');
  /* Homepage slider markup (.okla-slider-*). The native loader's sliderFor() builds the shell, arrows,
     autoplay and swipe, so the product slider behaves exactly like the homepage one. */
  var heading=el('div','homepage-group-title h4 okla-slider-heading','Mohlo by vás zajímat');
  var href=categoryHref(p.defaultCategory);
  if(href)heading.setAttribute('data-category-url',href);
  var group=el('div','products products-block');
  records.forEach(r=>{
   var item=el('div','product');
   var box=el('div','p');box.dataset.testid='productItem';
   var destination=knownUrl(r);
   var url=destination?new URL(destination,location.origin).pathname:null;
   var image=el(url?'a':'span','image');if(url)image.href=url;
   var img=el('img');img.src=r.image;img.alt=r.imageDesc||r.name;img.loading='lazy';image.append(img);
   var pin=el('div','p-in'),inner=el('div','p-in-in');
   var name=el(url?'a':'span','name');if(url)name.href=url;name.append(el('span',null,r.name));
   inner.append(name);
   var pBottom=el('div','p-bottom'),prices=el('div','prices'),priceBox=el('div','price price-final');
   priceBox.append(el('strong',null,Number(r.price).toLocaleString('cs-CZ')+',-'));
   prices.append(priceBox);
   var tools=el('div','p-tools'),btn=el('button','btn btn-cart add-to-cart-button ok97-unavailable','Do košíku');
   btn.type='button';btn.disabled=true;btn.setAttribute('aria-disabled','true');
   tools.append(btn);
   pBottom.append(prices,tools);
   pin.append(inner,pBottom);
   box.append(image,pin,el('span','p-code','Kód: '+r.code));
   item.append(box);group.append(item);
   liveCardState(r,item,btn);
  });
  sec.append(heading,group);
  var review=q('.ok97-review-block'),tabs=q('.p-detail-tabs-wrapper,.p-details-tabs-wrapper');
  if(review)review.after(sec);else if(tabs)tabs.after(sec);else detail.after(sec);
  if(window.__oklaSliderFor)window.__oklaSliderFor(group,heading);
 }
 function init(){
  var detail=q('#content .p-detail'),form=q('#product-detail-form',detail||document),top=q('.row.product-top',detail||document)||q('.row.product-top',document),sku=q('[itemprop="sku"]',form||document)?.getAttribute('content')||q('.p-code>span:last-child',detail||document)?.textContent?.trim();
  if(!detail||!form||!top||!sku||!catalog[sku])return;
  if(detail.dataset.ok89Complete==='1')return;
  var p=catalog[sku],gallery=q(':scope > .p-image-wrapper',top),buy=q(':scope > .p-info-wrapper',top),header=q('.p-detail-inner-header',detail),rating=q('.p-detail-info',top)||q('.p-detail-info',detail),btn=q('.add-to-cart button.add-to-cart-button.btn-conversion',buy||document)||q('.add-to-cart button.add-to-cart-button',buy||document),price=q('.p-final-price-wrapper',buy||document);
  if(!gallery||!buy||!header||!btn||!price)return;
  /* V87 duplicate boot could leave the buy box marked empty and entirely invisible. */
  buy.classList.remove('ok86-empty');
  var journal=[];function move(n,target,before){if(!n||!target)return;journal.push({n,parent:n.parentNode,next:n.nextSibling});target.insertBefore(n,before||null)}
  var orphan=rating&&rating.parentNode;
  var originalRatingWrapper=orphan&&orphan!==buy&&orphan!==gallery&&orphan.parentNode===top?orphan:null;
  // Move the original native nodes, never clone listeners or the purchase form.
  move(header,buy,buy.firstChild);if(rating)move(rating,buy,header.nextSibling);
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
   var noRating=rating&&q('.stars-label',rating);if(noRating&&/neohodnoceno/i.test(noRating.textContent))noRating.textContent='Zatím bez hodnocení';
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
   /* Keep exactly one native Shoptet submit button; no injected SVG or duplicated CTA. */
   btn.classList.add('ok99-native-primary');
   qa('.add-to-cart button.add-to-cart-button',buy).forEach(function(b){
    if(b!==btn){b.setAttribute('aria-hidden','true');b.tabIndex=-1;}
   });
   qa('svg.ok86-cart-icon',btn).forEach(n=>n.remove());
   if(!q('.ok99-cart-graphic',btn)){
    var icon=el('span','ok99-cart-graphic','🛒');icon.setAttribute('aria-hidden','true');btn.prepend(icon);
   }
   useNativeQuantity(buy);
   configureAvailability(form,buy,btn);
   var availability=q('.availability-value',buy);if(availability){new MutationObserver(()=>configureAvailability(form,buy,btn)).observe(availability,{characterData:true,childList:true,subtree:true})}
   form.addEventListener('submit',function(ev){if(stockStatus(form,buy)===false){ev.preventDefault();ev.stopImmediatePropagation()}},true);
   richDescription(p);paramsTab(p,detail);formatDetailPrice(buy);reviewSection(detail);formatTabs();relatedCarousel(p,detail);trustBar(detail);updateSeo(p);
   detail.dataset.ok89Complete='1';document.body.classList.add('ok89-detail');
   window.oklaV89State={code:p.code,active:true,stock:stockStatus(form,buy),relatedRendered:q('.ok86-related-track')?.children.length||0,parameters:Object.keys(p.parameters).length};
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 /* Do not invoke init again on window.load; the native nodes have already moved. */
})();