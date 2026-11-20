/* Okla "added to cart" dialog (Alza style). After a product is added to the cart, a dialog opens over the dimmed page
   (centred on PC, full screen on phones): a green confirmation, the added product with a quantity stepper (it changes
   the amount in the real Shoptet cart) and its price, up to eight products "bought together" as
   product cards, and two ways on. Opens on every add to cart (product cards, the product page, the cart API). */
(function(){
 'use strict';
 if(window.__oklaCartModalV1)return;
 window.__oklaCartModalV1=true;

 var root=null,refs={},state=null;
 var hooked={request:false};
 var pendingCartUntil=0,lastAdd=null,silentUntil=0;

 function catalog(){return window.OKLA_V86_CATALOG||{}}
 function list(){var c=catalog();return Object.keys(c).map(function(k){return c[k]}).filter(Boolean)}
 function byCode(code){return code?catalog()[code]||null:null}
 function byName(name){var l=list();for(var i=0;i<l.length;i++)if(l[i].name===name)return l[i];return null}
 function pathOf(url){try{return new URL(url,location.origin).pathname}catch(e){return ''}}
 function byUrlPath(href){var p=pathOf(href);if(!p)return null;var l=list();for(var i=0;i<l.length;i++)if(l[i].url&&pathOf(l[i].url)===p)return l[i];return null}
 function num(v){var n=Number(String(v==null?'':v).replace(/[^\d,.-]/g,'').replace(',','.'));return isFinite(n)?n:0}
 function money(n){n=Math.round(n);if(!(n>0))return '';return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'} /* the same '589 Kč' as the product cards */
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 var NS='http://www.w3.org/2000/svg';
 function icon(d,cls){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');if(cls)s.setAttribute('class',cls);var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);return s}
 var CHEVRON_L='m15 18-6-6 6-6',CHEVRON_R='m9 18 6-6-6-6',CHECK='M5 12.5l4.5 4.5L19 7',MINUS='M5 12h14',PLUS='M12 5v14M5 12h14',CLOSE='M6 6l12 12M18 6 6 18';

 function productFromCard(startEl){
  var card=startEl.closest&&startEl.closest('[data-micro-sku],[data-product-id],.product,.p,li.product');
  if(!card)return null;
  var sku=card.getAttribute&&(card.getAttribute('data-micro-sku')||card.getAttribute('data-product-code'));
  if(sku&&byCode(sku))return byCode(sku);
  var a=card.querySelector('a[href]');if(a){var p=byUrlPath(a.getAttribute('href'));if(p)return p}
  var nm=card.querySelector('.name,.product-name,a.name,.p-name');
  if(nm){var q=byName(nm.textContent.replace(/\s+/g,' ').trim());if(q)return q}
  return null;
 }

 function build(){
  if(root)return root;
  root=el('div','okla-cm');root.id='okla-cart-modal';
  root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','okla-cm-title');root.setAttribute('aria-hidden','true');
  var overlay=el('div','okla-cm__overlay');
  var box=el('div','okla-cm__box');
  var close=el('button','okla-cm__close');close.type='button';close.setAttribute('aria-label','Zavřít');close.appendChild(icon(CLOSE));

  var scroll=el('div','okla-cm__scroll');
  var top=el('div','okla-cm__top');
  var head=el('div','okla-cm__head');
  var ok=el('span','okla-cm__ok');ok.appendChild(icon(CHECK));
  var title=el('h2','okla-cm__title','Zboží přidáno do košíku');title.id='okla-cm-title';
  head.append(ok,title);
  var items=el('div','okla-cm__items');
  top.append(head,items);

  var more=el('div','okla-cm__more');
  var subtitle=el('h3','okla-cm__subtitle','Nejčastěji zakoupeno společně');
  var cards=el('div','okla-cm__cards');
  more.append(subtitle,cards);
  scroll.append(top,more);

  var foot=el('div','okla-cm__foot');
  var stay=el('button','okla-cm__btn okla-cm__btn--back');stay.type='button';stay.append(icon(CHEVRON_L),el('span','','Pokračovat v nákupu'));
  var go=el('a','okla-cm__btn okla-cm__btn--go');go.href='/kosik/';go.append(el('span','','Pokračovat do košíku'),icon(CHEVRON_R));
  foot.append(stay,go);

  /* the cross belongs to the top of the content: it scrolls (and is pulled on a phone) together with it */
  top.style.position='relative';top.appendChild(close);
  box.append(scroll,foot);
  root.append(overlay,box);
  document.body.appendChild(root);
  overlay.addEventListener('click',hide);close.addEventListener('click',hide);stay.addEventListener('click',hide);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('is-open'))hide()});
  refs={items:items,cards:cards,more:more,scroll:scroll};
  return root;
 }

 /* ---- the added product, with a stepper bound to the real cart ---- */
 function itemRow(p,amount,withStepper){
  var row=el('div','okla-cm__item');
  var pic=el(p.url?'a':'span','okla-cm__pic');if(p.url)pic.href=p.url;
  if(p.image){var im=el('img');im.src=p.image;im.alt='';im.draggable=false;pic.appendChild(im)}
  var name=el(p.url?'a':'div','okla-cm__name',p.name||'');if(p.url)name.href=p.url;
  var qty=el('div','okla-cm__qty');
  var unit=p.price?num(p.price):num(p.priceText);
  var priceBox=el('div','okla-cm__price');
  var withVat=el('div','okla-cm__price-vat'),noVat=el('div','okla-cm__price-novat');
  priceBox.append(withVat,noVat);
  function paint(n){
   withVat.textContent=unit?money(unit*n):(p.priceText||'');
   
  }
  if(withStepper){
   var minus=el('button','okla-cm__step okla-cm__step--minus');minus.type='button';minus.setAttribute('aria-label','Ubrat kus');minus.appendChild(icon(MINUS));
   var val=el('span','okla-cm__qty-val');val.setAttribute('aria-live','polite');
   var plus=el('button','okla-cm__step okla-cm__step--plus');plus.type='button';plus.setAttribute('aria-label','Přidat kus');plus.appendChild(icon(PLUS));
   qty.append(minus,val,plus);
   var setVal=function(n){val.textContent=n+' ks';minus.disabled=n<=1;paint(n)};
   setVal(amount);
   var busy=false;
   var change=function(delta){
    if(busy||!state)return;var target=state.amount+delta;if(target<1)return;
    busy=true;qty.classList.add('is-busy');setVal(target);
    setCartAmount(p,target).then(function(real){state.amount=real||target;setVal(state.amount)},function(){setVal(state.amount)}).then(function(){busy=false;qty.classList.remove('is-busy')});
   };
   minus.addEventListener('click',function(){change(-1)});plus.addEventListener('click',function(){change(1)});
   row._sync=function(n){if(!busy&&n>0){state.amount=n;setVal(n)}};
  }else{
   qty.append(el('span','okla-cm__qty-val',(amount||1)+' ks'));paint(amount||1);
  }
  row.append(pic,name,qty,priceBox);
  return row;
 }

 /* The cart page holds a small form per cart line (item id, price id, amount, csrf). We read it and post the new
    amount the same way the cart page does. */
 function cartLine(p){
  var path=pathOf(p.url);if(!path)return Promise.resolve(null);
  return fetch('/kosik/',{cache:'no-store',credentials:'same-origin'}).then(function(r){return r.text()}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html');var found=null;
   doc.querySelectorAll('input[name="amount"]').forEach(function(inp){
    if(found)return;var form=inp.closest('form');var row=inp.closest('tr,[data-micro="cartItem"],.cart-item,li')||form;
    if(!form||!row)return;
    var link=row.querySelector('a[href]');var hit=false;
    row.querySelectorAll('a[href]').forEach(function(a){if(pathOf(a.getAttribute('href'))===path)hit=true});
    if(!hit)return;
    var fields=new URLSearchParams();form.querySelectorAll('input[name]').forEach(function(i){if(i.type!=='submit'&&i.type!=='button')fields.set(i.name,i.value)});
    found={action:form.getAttribute('action')||'/action/Cart/setCartItemAmount/',fields:fields,amount:parseInt(inp.value,10)||1};
   });
   return found;
  });
 }
 function refreshHeaderCart(){
  try{var s=window.shoptet;if(s&&s.cartShared&&typeof s.cartShared.getCartContent==='function')s.cartShared.getCartContent()}catch(e){}
  try{document.dispatchEvent(new CustomEvent('ShoptetCartUpdated'))}catch(e){}
 }
 function setCartAmount(p,n){
  return cartLine(p).then(function(line){
   if(!line)throw new Error('no cart line');
   line.fields.set('amount',String(n));
   silentUntil=Date.now()+3000;
   return fetch(line.action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json, text/html'},body:line.fields.toString()})
    .then(function(r){if(!r.ok)throw new Error('amount failed');refreshHeaderCart();return n});
  });
 }

 /* ---- bought together: related products first, then the same category, then the rest ---- */
 function suggestions(cur){
  var out=[],seen={};if(cur&&cur.code)seen[cur.code]=1;
  function push(p){if(p&&!seen[p.code]&&p.price&&p.url){seen[p.code]=1;out.push(p)}}
  ((cur&&cur.related)||[]).forEach(function(c){push(byCode(c))});
  var all=list();
  if(cur&&cur.defaultCategory)all.forEach(function(p){if(p.defaultCategory===cur.defaultCategory)push(p)});
  all.forEach(push);
  return out.slice(0,8);
 }
 function stars(){var s=el('span','okla-cm__stars');s.setAttribute('aria-hidden','true');for(var i=0;i<5;i++)s.appendChild(icon('M12 3.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.9l-5.25 2.8 1-5.85L3.5 9.7l5.9-.9z'));return s}
 function renderCards(cur){
  var cards=refs.cards;cards.textContent='';
  var l=suggestions(cur);refs.more.style.display=l.length?'':'none';
  l.forEach(function(s){
   var card=el('div','okla-cm__card');
   var pic=el('a','okla-cm__card-pic');pic.href=s.url;var im=el('img');im.src=s.image||'';im.alt='';im.loading='lazy';im.draggable=false;pic.appendChild(im);
   var nm=el('a','okla-cm__card-name',s.name);nm.href=s.url;
   var pr=el('div','okla-cm__card-price',money(num(s.price)));
   var btn=el('button','okla-cm__card-btn');btn.type='button';btn.append(el('span','okla-cm__cart-ic'),el('span','','Do košíku'));
   btn.addEventListener('click',function(){addSuggestion(s,btn)});
   card.append(pic,stars(),nm,pr,btn);cards.append(card);
  });
 }
 function addSuggestion(s,btn){
  var cart=window.shoptet&&window.shoptet.cartShared;
  if(!cart||typeof cart.addToCart!=='function'){location.href=s.url||'/kosik/';return}
  btn.disabled=true;btn.classList.add('is-busy');
  cart.addToCart({productCode:s.code,amount:1});
 }

 function quietNativePopups(){
  var until=Date.now()+4000;
  var hideN=function(){document.querySelectorAll('.messages > *, #cart-widget').forEach(function(n){n.style.setProperty('display','none','important')})};
  hideN();var box=document.querySelector('.messages');if(!box||!window.MutationObserver)return;
  var ob=new MutationObserver(function(){if(Date.now()<until)hideN();else ob.disconnect()});
  ob.observe(box,{childList:true,subtree:true});setTimeout(function(){ob.disconnect()},4100);
 }
 function selectedCrossSell(){try{var fn=window.__oklaXsellSelected;var l=typeof fn==='function'?fn():[];return Array.isArray(l)?l:[]}catch(e){return []}}

 function show(p,amount){
  build();
  var cat=byCode(p.code)||byUrlPath(p.url)||byName(p.name)||null;
  var main={code:p.code||(cat&&cat.code),name:p.name||(cat&&cat.name),image:p.image||(cat&&cat.image),price:p.price||(cat&&cat.price),priceText:p.priceText,url:(cat&&cat.url)||p.url||''};
  state={product:main,amount:amount||1};
  refs.items.textContent='';
  var row=itemRow(main,state.amount,!!main.url);refs.items.appendChild(row);
  /* companions added together with it: just a small "+N" beside the product's name */
  var extra=selectedCrossSell().filter(function(x){return !(x.name&&x.name===main.name)}).length;
  if(extra>0){var nm=row.querySelector('.okla-cm__name');if(nm){var tag=el('span','okla-cm__plus','+'+extra);tag.title=extra===1?'a 1 doporučený produkt':'a '+extra+' doporučené produkty';nm.after(tag);var wrap=el('div','okla-cm__namewrap');nm.before(wrap);wrap.append(nm,tag)}}
  renderCards(cat||main);
  quietNativePopups();
  refs.scroll.scrollTop=0;
  root.classList.add('is-open');root.setAttribute('aria-hidden','false');document.documentElement.classList.add('okla-cm-lock');
  /* focus for keyboards only: a tap-opened panel shows no ring around the cross */
  var c=root.querySelector('.okla-cm__close');if(c)c.focus({preventScroll:true,focusVisible:false});
  /* the real amount in the cart (the product may have been there already) */
  if(main.url&&row._sync)cartLine(main).then(function(line){if(line&&state&&state.product===main)row._sync(line.amount)},function(){});
 }
 function hide(){
  if(!root)return;
  root.classList.remove('is-open');root.setAttribute('aria-hidden','true');document.documentElement.classList.remove('okla-cm-lock');
  window.dispatchEvent(new Event('resize'));
 }

 function settle(result,done){if(result&&typeof result.then==='function')result.then(done,function(){});else done()}
 function hookCart(){
  var cart=window.shoptet&&window.shoptet.cartShared;
  if(!cart||typeof cart.addToCart!=='function')return false;
  if(cart.addToCart.__oklaModal)return true;
  var original=cart.addToCart;
  var wrapped=function(opts){
   var code=opts&&opts.productCode,amount=(opts&&opts.amount)||1,p=byCode(code);
   if(p)pendingCartUntil=Date.now()+4000;
   var result=original.apply(this,arguments);
   if(p)settle(result,function(){show({code:p.code,name:p.name,image:p.image,price:p.price,url:p.url},amount)});
   return result;
  };
  wrapped.__oklaModal=true;wrapped.__oklaDrawer=true;cart.addToCart=wrapped;return true;
 }
 function productFromPage(){
  var h1=document.querySelector('.p-detail-inner-header h1, .p-detail h1, h1');var title=h1?h1.textContent.trim():'';
  var p=byUrlPath(location.href)||byName(title);
  var q=document.querySelector('.add-to-cart input.amount');var amount=q?parseInt(q.value,10)||1:1;
  if(p)return {item:{code:p.code,name:p.name,image:p.image,price:p.price,url:p.url},amount:amount};
  var img=document.querySelector('.p-main-image img'),pr=document.querySelector('.price-final');
  return {item:{code:null,name:title,image:img?img.getAttribute('src'):'',priceText:pr?pr.textContent.trim():'',url:location.href},amount:amount};
 }
 function onNativeAdd(){
  if(window.__oklaXsellAdding)return;
  if(Date.now()<pendingCartUntil||Date.now()<silentUntil)return;
  if(document.querySelector('.p-detail')){var r=productFromPage();show(r.item,r.amount);return}
  if(lastAdd&&Date.now()-lastAdd.at<6000){show(lastAdd.p,1);lastAdd=null}
 }
 function trackAddClicks(){
  document.addEventListener('click',function(e){
   var btn=e.target.closest&&e.target.closest('.add-to-cart-button,button.btn-cart,.btn-cart,[data-testid="buttonAddToCart"]');
   if(!btn||btn.closest('.okla-cm'))return;
   if(document.querySelector('.p-detail')&&btn.closest('.p-detail .p-info-wrapper'))return;
   var p=productFromCard(btn);
   if(p)lastAdd={p:{code:p.code,name:p.name,image:p.image,price:p.price,url:p.url},at:Date.now()};
  },true);
 }
 function hookRequests(){
  if(hooked.request)return true;
  var XHR=window.XMLHttpRequest;if(!XHR)return false;
  var open=XHR.prototype.open,send=XHR.prototype.send;
  XHR.prototype.open=function(method,url){this.__oklaUrl=String(url||'');return open.apply(this,arguments)};
  XHR.prototype.send=function(){var x=this;if((x.__oklaUrl||'').indexOf('addCartItem')!==-1)x.addEventListener('loadend',function(){if(x.status>=200&&x.status<300)onNativeAdd()});return send.apply(this,arguments)};
  if(window.fetch){
   var f=window.fetch;
   window.fetch=function(input){var url=typeof input==='string'?input:(input&&input.url)||'';var res=f.apply(this,arguments);if(String(url).indexOf('addCartItem')!==-1)res.then(function(r){if(r.ok)onNativeAdd()},function(){});return res};
  }
  hooked.request=true;return true;
 }
 function start(){
  if(!document.body)return;
  build();trackAddClicks();hookRequests();hookCart();
  setInterval(function(){hookRequests();hookCart()},1000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
