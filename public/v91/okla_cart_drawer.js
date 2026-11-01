/* OKLA cart drawer: after a product is added to the cart, a panel slides in from the right on desktop
   (from the bottom on phones) over a dimmed page. It shows the added product, related products and two ways on. */
(function(){
 'use strict';
 if(window.__oklaCartDrawerV1)return;
 window.__oklaCartDrawerV1=true;

 var root=null;
 var hooked={request:false};
 var pendingCartUntil=0;

 function catalog(){return window.OKLA_V86_CATALOG||{}}
 function byCode(code){return code?catalog()[code]||null:null}

 function byName(name){
  var codes=Object.keys(catalog());
  for(var i=0;i<codes.length;i++){if(catalog()[codes[i]].name===name)return catalog()[codes[i]]}
  return null;
 }

 function codeFromUrl(){
  var path=location.pathname,codes=Object.keys(catalog());
  for(var i=0;i<codes.length;i++){
   var p=catalog()[codes[i]];
   if(!p||!p.url)continue;
   try{if(new URL(p.url).pathname===path)return p.code}catch(e){}
  }
  return null;
 }

 function priceText(v){
  var n=Math.round(Number(String(v).replace(/[\s ]/g,'').replace(',','.')));
  if(!isFinite(n)||n<=0)return '';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+',-';
 }

 function el(tag,cls,text){
  var n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!=null)n.textContent=text;
  return n;
 }

 function build(){
  if(root)return root;
  root=el('div','okla-cd');
  root.id='okla-cart-drawer';
  root.setAttribute('role','dialog');
  root.setAttribute('aria-modal','true');
  root.setAttribute('aria-labelledby','okla-cd-title');
  root.setAttribute('aria-hidden','true');

  var overlay=el('div','okla-cd__overlay');
  var panel=el('div','okla-cd__panel');

  var head=el('div','okla-cd__head');
  var check=el('span','okla-cd__check','✓');
  check.setAttribute('aria-hidden','true');
  var title=el('h2','okla-cd__title','Zboží přidáno do košíku');
  title.id='okla-cd-title';
  var close=el('button','okla-cd__close','×');
  close.type='button';
  close.setAttribute('aria-label','Zavřít');
  head.append(check,title,close);

  var item=el('div','okla-cd__item');
  var img=el('img','okla-cd__img');
  img.alt='';
  var info=el('div','okla-cd__info');
  var name=el('div','okla-cd__name');
  var qty=el('div','okla-cd__qty');
  info.append(name,qty);
  var price=el('div','okla-cd__price');
  item.append(img,info,price);

  var body=el('div','okla-cd__body');
  var subtitle=el('h3','okla-cd__subtitle','Nejčastěji zakoupeno společně');
  var cards=el('div','okla-cd__cards');
  body.append(subtitle,cards);

  var foot=el('div','okla-cd__foot');
  var stay=el('button','okla-cd__btn okla-cd__btn--ghost','Pokračovat v nákupu');
  stay.type='button';
  var go=el('a','okla-cd__btn okla-cd__btn--primary','Pokračovat do košíku');
  go.href='/kosik/';
  foot.append(stay,go);

  panel.append(head,item,body,foot);
  root.append(overlay,panel);
  document.body.appendChild(root);

  overlay.addEventListener('click',hide);
  close.addEventListener('click',hide);
  stay.addEventListener('click',hide);
  document.addEventListener('keydown',function(e){
   if(e.key==='Escape'&&root.classList.contains('is-open'))hide();
  });

  root._refs={img:img,name:name,qty:qty,price:price,cards:cards};
  return root;
 }

 function renderSuggestions(currentCode){
  var cur=byCode(currentCode);
  var codes=(cur&&cur.related)||[];
  var cards=root._refs.cards;
  cards.textContent='';
  var shown=0;
  codes.forEach(function(code){
   if(shown>=3||code===currentCode)return;
   var s=byCode(code);
   if(!s)return;
   shown++;
   var card=el('div','okla-cd__card');
   var im=el('img','okla-cd__card-img');
   im.alt='';
   im.src=s.image||'';
   var nm=el('a','okla-cd__card-name',s.name);
   nm.href=s.url||'#';
   var pr=el('div','okla-cd__card-price',priceText(s.price));
   var btn=el('button','okla-cd__card-btn','Do košíku');
   btn.type='button';
   btn.addEventListener('click',function(){addSuggestion(s,btn)});
   card.append(im,nm,pr,btn);
   cards.append(card);
  });
 }

 function addSuggestion(s,btn){
  var cart=window.shoptet&&window.shoptet.cartShared;
  if(!cart||typeof cart.addToCart!=='function'){
   window.location.href=s.url||'/kosik/';
   return;
  }
  btn.disabled=true;
  btn.textContent='Přidávám…';
  cart.addToCart({productCode:s.code,amount:1});
 }

 /* Shoptet's own message at the top of the page (.messages) and its cart popup are hidden for a few seconds after an add. */
 function quietNativePopups(){
  var until=Date.now()+4000;
  var hide=function(){document.querySelectorAll('.messages > *, #cart-widget').forEach(function(n){n.style.setProperty('display','none','important')})};
  hide();
  var box=document.querySelector('.messages');
  if(!box||!window.MutationObserver)return;
  var observer=new MutationObserver(function(){if(Date.now()<until)hide();else observer.disconnect()});
  observer.observe(box,{childList:true,subtree:true});
  setTimeout(function(){observer.disconnect()},until-Date.now()+100);
 }

 function show(p,amount){
  var r=build()._refs;
  r.img.src=p.image||'';
  r.img.style.display=p.image?'':'none';
  r.name.textContent=p.name||'';
  r.qty.textContent=(amount||1)+' ks';
  r.price.textContent=p.priceText||priceText(p.price);
  renderSuggestions(p.code||null);
  quietNativePopups();
  root.classList.add('is-open');
  root.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('okla-cd-lock');
  var closeBtn=root.querySelector('.okla-cd__close');
  if(closeBtn)closeBtn.focus();
 }

 function hide(){
  if(!root)return;
  root.classList.remove('is-open');
  root.setAttribute('aria-hidden','true');
  document.documentElement.classList.remove('okla-cd-lock');
  /* The scrollbar comes back, so the page is a little narrower again: measured layouts are told to update. */
  window.dispatchEvent(new Event('resize'));
 }

 function settle(result,done,failed){
  if(result&&typeof result.then==='function')result.then(done,failed||function(){});
  else done();
 }

 /* Adds through the shared cart API (product cards, related products, suggestions). */
 function hookCart(){
  var cart=window.shoptet&&window.shoptet.cartShared;
  if(!cart||typeof cart.addToCart!=='function')return false;
  if(cart.addToCart.__oklaDrawer)return true;
  var original=cart.addToCart;
  var wrapped=function(opts){
   var code=opts&&opts.productCode;
   var amount=(opts&&opts.amount)||1;
   var p=byCode(code);
   if(p)pendingCartUntil=Date.now()+4000;
   var result=original.apply(this,arguments);
   if(p){
    settle(result,function(){show({code:p.code,name:p.name,image:p.image,price:p.price},amount)});
   }
   return result;
  };
  wrapped.__oklaDrawer=true;
  cart.addToCart=wrapped;
  return true;
 }

 /* Product page: the add request of the native button. Cart API adds are handled by hookCart. */
 function productFromPage(){
  var h1=document.querySelector('.p-detail-inner-header h1, .p-detail h1, h1');
  var title=h1?h1.textContent.trim():'';
  var p=byCode(codeFromUrl())||byName(title);
  var qtyInput=document.querySelector('.add-to-cart input.amount');
  var amount=qtyInput?parseInt(qtyInput.value,10)||1:1;
  if(p)return {item:{code:p.code,name:p.name,image:p.image,price:p.price},amount:amount};
  var img=document.querySelector('.p-main-image img');
  var pr=document.querySelector('.price-final');
  return {item:{code:null,name:title,image:img?img.getAttribute('src'):'',priceText:pr?pr.textContent.trim():''},amount:amount};
 }

 function onNativeAdd(){
  if(Date.now()<pendingCartUntil)return;
  if(!document.querySelector('.p-detail'))return;
  var r=productFromPage();
  show(r.item,r.amount);
 }

 function hookRequests(){
  if(hooked.request)return true;
  var XHR=window.XMLHttpRequest;
  if(!XHR)return false;
  var open=XHR.prototype.open,send=XHR.prototype.send;
  XHR.prototype.open=function(method,url){
   this.__oklaUrl=String(url||'');
   return open.apply(this,arguments);
  };
  XHR.prototype.send=function(){
   var xhr=this;
   if((xhr.__oklaUrl||'').indexOf('addCartItem')!==-1){
    xhr.addEventListener('loadend',function(){if(xhr.status>=200&&xhr.status<300)onNativeAdd()});
   }
   return send.apply(this,arguments);
  };
  if(window.fetch){
   var fetchOriginal=window.fetch;
   window.fetch=function(input){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    var result=fetchOriginal.apply(this,arguments);
    if(String(url).indexOf('addCartItem')!==-1){
     result.then(function(res){if(res.ok)onNativeAdd()},function(){});
    }
    return result;
   };
  }
  hooked.request=true;
  return true;
 }

 function start(){
  if(!document.body)return;
  build();
  hookRequests();
  hookCart();
  /* Shoptet can replace its cart object after load, so the hook is checked again every second. */
  setInterval(function(){hookRequests();hookCart()},1000);
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
