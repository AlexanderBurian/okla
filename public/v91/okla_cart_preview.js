/* OKLA: desktop hover cart preview driven by the actual Shoptet basket. */
(function(){
'use strict';if(window.__oklaHoverCart)return;window.__oklaHoverCart=1;
var mq=matchMedia('(min-width:992px)'),pop,anchor,timer,version=0,lastX=-1,lastY=-1;
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function txt(s){return String(s||'').replace(/\s+/g,' ').trim()}
function cart(){return document.querySelector('#header .header-top .okla-exact-header > a.cart-count')}
function count(){
 var a;try{if(typeof getShoptetDataLayer==='function')a=getShoptetDataLayer('cart')}catch(e){}
 if(!Array.isArray(a)&&Array.isArray(window.dataLayer))for(var i=dataLayer.length-1;i>=0;i--){
  var d=dataLayer[i]&&dataLayer[i].shoptet;if(d&&Array.isArray(d.cart)){a=d.cart;break}
 }
 if(!Array.isArray(a))return null;
 return a.reduce(function(s,item){var n=Number(item&&item.quantity);return s+(isFinite(n)&&n>0?n:0)},0)
}
function effectiveCount(){
 var q=count(),v=window.__oklaVerifiedCartCount;
 if(v&&Date.now()-v.at<12000)return v.value;
 return q;
}
function badge(){
 var c=cart(),q=effectiveCount();if(!c||q===null)return;
 var b=c.querySelector(':scope > .okla-reference-cart-badge');
 if(!b){b=el('span','okla-reference-cart-badge');b.setAttribute('aria-hidden','true');c.appendChild(b)}
 b.hidden=q<=0;b.textContent=q>99?'99+':String(q);
}
function lang(){var l=String(window.OKLA_LANG||document.documentElement.lang||'cs').slice(0,2);
 return l==='en'?['Your cart','Items','Total','View cart','Cart is empty','Loading…','Unable to load cart']:l==='sk'?['Váš košík','Kusov','Celkom','Prejsť do košíka','Košík je prázdny','Načítavam…','Nepodarilo sa načítať']:l==='hu'?['Kosár','Darab','Összesen','Kosár megnyitása','A kosár üres','Betöltés…','Nem sikerült betölteni']:['Váš košík','Kusů','Celkem','Přejít do košíku','Košík je prázdný','Načítám…','Náhled není dostupný']}
function build(){
 if(pop)return;pop=el('aside');pop.id='okla-cart-preview';pop.setAttribute('role','region');pop.setAttribute('aria-hidden','true');
 var head=el('div','okla-cp__header'),name=el('h2','okla-cp__heading'),countNode=el('span','okla-cp__count');
 head.append(name,countNode);
 var list=el('div','okla-cp__list'),foot=el('div','okla-cp__footer'),total=el('div','okla-cp__total'),label=el('span'),sum=el('strong'),go=el('a','okla-cp__go');
 go.href='/kosik/';total.append(label,sum);foot.append(total,go);pop.append(head,list,foot);document.body.appendChild(pop);
 pop.refs={name:name,count:countNode,list:list,total:total,label:label,sum:sum,go:go};
 pop.addEventListener('pointerenter',function(){clearTimeout(timer);timer=0});
 pop.addEventListener('pointerleave',delay);
}
function header(){
 var r=pop.refs,l=lang(),q=effectiveCount(),c=cart(),price=c&&c.querySelector('.cart-price');
 r.name.textContent=l[0];r.count.textContent=q===null?'':l[1]+': '+q;r.label.textContent=l[2];r.go.textContent=l[3];
 r.sum.textContent=price?txt(price.textContent):'';r.total.style.display=r.sum.textContent?'':'none';
}
function message(s){pop.refs.list.replaceChildren(el('div','okla-cp__message',s))}
function itemTotal(row){
 var node=row.querySelector('td.p-total .price-final,td.p-total .price,td.p-total strong,td.p-total');
 if(!node)return '';
 var value=txt(node.textContent);
 // Avoid showing Shoptet action labels ("Součet", "Odstranit z košíku")
 // alongside the actual monetary amount.
 var amounts=value.match(/(?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:Kč|EUR|€|Ft)/gi);
 return amounts&&amounts.length?amounts[0].replace(/\s+/g,' ').trim():'';
}
function render(html){
 var d=new DOMParser().parseFromString(html,'text/html'),out=pop.refs.list;out.replaceChildren();
 d.querySelectorAll('table.cart-table tr.removeable,#cart-form tr.removeable').forEach(function(row){
  var a=row.querySelector('td.p-name a[href],.p-name a.main-link');if(!a)return;
  var input=row.querySelector('input.amount'),image=row.querySelector('.cart-p-image img'),price=itemTotal(row);
  var item=el('div','okla-cp__item'),img=el('img','okla-cp__thumb'),info=el('div'),link=el('a','okla-cp__name',txt(a.textContent));
  link.href=a.href||'/kosik/';img.alt='';img.loading='lazy';
  if(image)img.src=image.getAttribute('data-src')||image.src;else img.style.visibility='hidden';
  info.append(link,el('div','okla-cp__qty',(input?input.value:'1')+' ks'));
  item.append(img,info,el('div','okla-cp__price',price));out.appendChild(item);
 });
 if(out.children.length){
  var total=0;
  out.querySelectorAll('.okla-cp__qty').forEach(function(n){total+=parseInt(n.textContent,10)||0});
  if(total>0)window.__oklaVerifiedCartCount={value:total,at:Date.now()};
 }else message(effectiveCount()>0?lang()[6]:lang()[4]);
}
function move(){
 if(!anchor||!pop)return;var r=anchor.getBoundingClientRect(),w=Math.min(420,innerWidth-24);
 var left=Math.max(12,Math.min(innerWidth-w-12,r.right-w));
 pop.style.width=w+'px';pop.style.left=left+'px';pop.style.top=Math.max(8,r.bottom+12)+'px';
 var face=anchor.querySelector('okla-action-face');
 var icon=face&&face.shadowRoot&&face.shadowRoot.querySelector('.figure')||anchor.querySelector('.okla-cart-symbol'),ir=icon?icon.getBoundingClientRect():r;
 var center=ir.left+ir.width/2;
 var right=Math.max(18,Math.min(w-26,left+w-center-9));
 pop.style.setProperty('--okla-cart-arrow-right',right+'px');
}
function close(){clearTimeout(timer);timer=0;anchor=null;version++;if(pop){pop.classList.remove('is-open');pop.setAttribute('aria-hidden','true')}}
function pointerInside(){
 if(lastX<0||lastY<0)return false;
 var node=document.elementFromPoint(lastX,lastY);
 return !!(node&&((anchor&&anchor.contains(node))||(pop&&pop.contains(node))));
}
function delay(){
 if(timer)return;
 timer=setTimeout(function(){
  timer=0;
  if(!pointerInside())close();
 },180);
}
window.__oklaCartPreviewClose=close;
function show(c){
 if(!mq.matches||document.documentElement.classList.contains('okla-search-open'))return;
 clearTimeout(timer);timer=0;if(anchor===c)return;
 if(typeof window.__oklaLoginHoverClose==='function')window.__oklaLoginHoverClose();
 build();anchor=c;pop.classList.add('is-open');pop.setAttribute('aria-hidden','false');
 header();move();message(lang()[5]);var v=++version;
 fetch('/kosik/',{credentials:'same-origin',cache:'no-store'}).then(function(r){if(!r.ok)throw Error('cart');return r.text()})
 .then(function(s){if(v===version&&anchor){render(s);badge();header()}}).catch(function(){if(v===version&&anchor)message(lang()[6])});
}
function target(e){return e&&e.closest&&e.closest('#header .header-top .okla-exact-header > a.cart-count')}
function updated(){
 window.__oklaVerifiedCartCount=null;
 badge();
 if(anchor){
  var c=cart(),keep=pointerInside();
  close();
  if(c&&keep)show(c);
 }
 setTimeout(badge,300);
}
function start(){
 document.addEventListener('pointerover',function(e){
  if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  lastX=e.clientX;lastY=e.clientY;
  var c=target(e.target);
  if(c&&(!e.relatedTarget||!c.contains(e.relatedTarget)))show(c);
 },true);
 document.addEventListener('pointerout',function(e){
  if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  lastX=e.clientX;lastY=e.clientY;
  var c=target(e.target);if(c&&(!e.relatedTarget||!c.contains(e.relatedTarget)))delay();
 },true);
 document.addEventListener('pointermove',function(e){
  if(!mq.matches||!anchor)return;
  if(e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
  lastX=e.clientX;lastY=e.clientY;
  if(pointerInside()){clearTimeout(timer);timer=0}else delay();
 },true);
 // Click opens the same hover preview; the button inside it still opens /kosik/.
 document.addEventListener('click',function(e){
  var c=target(e.target);
  if(!mq.matches||!c||e.button>0)return;
  e.preventDefault();e.stopImmediatePropagation();
  clearTimeout(timer);timer=0;
  if(anchor!==c)show(c);
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 document.addEventListener('pointerdown',function(e){if(anchor&&pop&&!pop.contains(e.target)&&!target(e.target))close()},true);
 addEventListener('scroll',move,{passive:true});addEventListener('resize',function(){if(!mq.matches)close();else move()},{passive:true});
 ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated'].forEach(function(x){document.documentElement.addEventListener(x,updated)});
 badge();setTimeout(badge,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();