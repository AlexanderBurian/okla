/* OKLA cart drawer: after a product is added to the cart, a panel slides in from the right on desktop
   (from the bottom on phones) over a dimmed page. It shows the added product, related products and two ways on. */
(function(){
 'use strict';
 if(window.__oklaCartDrawerV1)return;
 window.__oklaCartDrawerV1=true;

 var root=null;
 var hooked={cart:false,form:false};

 function catalog(){return window.OKLA_V86_CATALOG||{}}
 function byCode(code){return code?catalog()[code]||null:null}

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

 function show(p,amount){
  var r=build()._refs;
  r.img.src=p.image||'';
  r.img.style.display=p.image?'':'none';
  r.name.textContent=p.name||'';
  r.qty.textContent=(amount||1)+' ks';
  r.price.textContent=p.priceText||priceText(p.price);
  renderSuggestions(p.code||null);
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
 }

 function whenDone(result,fn){
  if(result&&typeof result.then==='function')result.then(fn,function(){});
  else fn();
 }

 function hookCart(){
  if(hooked.cart)return true;
  var cart=window.shoptet&&window.shoptet.cartShared;
  if(!cart||typeof cart.addToCart!=='function')return false;
  var original=cart.addToCart;
  var wrapped=function(opts){
   var result=original.apply(this,arguments);
   var p=byCode(opts&&opts.productCode);
   var amount=(opts&&opts.amount)||1;
   if(p)whenDone(result,function(){show({code:p.code,name:p.name,image:p.image,price:p.price},amount)});
   return result;
  };
  cart.addToCart=wrapped;
  hooked.cart=true;
  return true;
 }

 function hookProductForm(){
  if(hooked.form)return true;
  if(!window.jQuery)return false;
  if(!document.querySelector('.p-detail'))return true;
  window.jQuery(document).ajaxSuccess(function(e,xhr,settings){
   if(!settings||String(settings.url||'').indexOf('addCartItem')===-1)return;
   var qtyInput=document.querySelector('.add-to-cart input.amount');
   var amount=qtyInput?parseInt(qtyInput.value,10)||1:1;
   var code=codeFromUrl();
   var p=byCode(code);
   if(p){show({code:p.code,name:p.name,image:p.image,price:p.price},amount);return}
   var h1=document.querySelector('.p-detail-inner-header h1, .p-detail h1, h1');
   var img=document.querySelector('.p-main-image img');
   var pr=document.querySelector('.price-final');
   show({code:null,name:h1?h1.textContent.trim():'',image:img?img.getAttribute('src'):'',priceText:pr?pr.textContent.trim():''},amount);
  });
  hooked.form=true;
  return true;
 }

 function start(){
  if(!document.body)return;
  build();
  var tries=0;
  var timer=setInterval(function(){
   tries++;
   var a=hookCart(),b=hookProductForm();
   if((a&&b)||tries>60)clearInterval(timer);
  },250);
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
