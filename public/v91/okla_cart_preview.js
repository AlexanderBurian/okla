/* OKLA: desktop hover cart preview driven by the actual Shoptet basket. */
(function(){
'use strict';if(window.__oklaHoverCart)return;window.__oklaHoverCart=1;
var mq=matchMedia('(min-width:992px)'),pop,anchor,timer,version=0;
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function txt(s){return String(s||'').replace(/\s+/g,' ').trim()}
function cart(){return document.querySelector('#header .header-top .okla-exact-header > a.cart-count')}
function count(){
 var a;try{if(typeof getShoptetDataLayer==='function')a=getShoptetDataLayer('cart')}catch(e){}
 if(!Array.isArray(a)&&Array.isArray(window.dataLayer))for(var i=0;i<dataLayer.length;i++){
  var d=dataLayer[i]&&dataLayer[i].shoptet;if(d&&Array.isArray(d.cart)){a=d.cart;break}
 }
 if(!Array.isArray(a))return null;
 return a.reduce(function(s,item){var n=Number(item&&item.quantity);return s+(isFinite(n)&&n>0?n:0)},0)
}
function badge(){
 var c=cart(),q=count();if(!c||q===null)return;
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
 pop.addEventListener('pointerenter',function(){clearTimeout(timer)});
 pop.addEventListener('pointerleave',delay);
 pop.addEventListener('focusin',function(){clearTimeout(timer)});
}
function header(){
 var r=pop.refs,l=lang(),q=count(),c=cart(),price=c&&c.querySelector('.cart-price');
 r.name.textContent=l[0];r.count.textContent=q===null?'':l[1]+': '+q;r.label.textContent=l[2];r.go.textContent=l[3];
 r.sum.textContent=price?txt(price.textContent):'';r.total.style.display=r.sum.textContent?'':'none';
}
function message(s){pop.refs.list.replaceChildren(el('div','okla-cp__message',s))}
function render(html){
 var d=new DOMParser().parseFromString(html,'text/html'),out=pop.refs.list;out.replaceChildren();
 d.querySelectorAll('table.cart-table tr.removeable,#cart-form tr.removeable').forEach(function(row){
  var a=row.querySelector('td.p-name a[href],.p-name a.main-link');if(!a)return;
  var input=row.querySelector('input.amount'),image=row.querySelector('.cart-p-image img'),price=row.querySelector('td.p-total strong,td.p-total .price-final,td.p-total');
  var item=el('div','okla-cp__item'),img=el('img','okla-cp__thumb'),info=el('div'),link=el('a','okla-cp__name',txt(a.textContent));
  link.href=a.href||'/kosik/';img.alt='';img.loading='lazy';
  if(image)img.src=image.getAttribute('data-src')||image.src;else img.style.visibility='hidden';
  info.append(link,el('div','okla-cp__qty',(input?input.value:'1')+' ks'));
  item.append(img,info,el('div','okla-cp__price',price?txt(price.textContent):''));out.appendChild(item);
 });
 if(!out.children.length)message(count()>0?lang()[6]:lang()[4]);
}
function move(){
 if(!anchor||!pop)return;var r=anchor.getBoundingClientRect(),w=Math.min(420,innerWidth-24);
 pop.style.width=w+'px';pop.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w))+'px';pop.style.top=Math.max(8,r.bottom+12)+'px';
}
function close(){clearTimeout(timer);anchor=null;version++;if(pop){pop.classList.remove('is-open');pop.setAttribute('aria-hidden','true')}}
function delay(){clearTimeout(timer);timer=setTimeout(function(){if(pop&&!pop.contains(document.activeElement))close()},220)}
function show(c){
 if(!mq.matches||document.documentElement.classList.contains('okla-search-open'))return;
 clearTimeout(timer);if(anchor===c)return;build();anchor=c;pop.classList.add('is-open');pop.setAttribute('aria-hidden','false');
 header();move();message(lang()[5]);var v=++version;
 fetch('/kosik/',{credentials:'same-origin',cache:'no-store'}).then(function(r){if(!r.ok)throw Error('cart');return r.text()})
 .then(function(s){if(v===version&&anchor){render(s);badge();header()}}).catch(function(){if(v===version&&anchor)message(lang()[6])});
}
function target(e){return e&&e.closest&&e.closest('#header .header-top .okla-exact-header > a.cart-count')}
function updated(){badge();if(anchor){close();show(cart())}setTimeout(badge,300)}
function start(){
 document.addEventListener('pointerover',function(e){var c=target(e.target);if(c&&(!e.relatedTarget||!c.contains(e.relatedTarget)))show(c)},true);
 document.addEventListener('pointerout',function(e){var c=target(e.target);if(c&&(!e.relatedTarget||!c.contains(e.relatedTarget)))delay()},true);
 document.addEventListener('focusin',function(e){var c=target(e.target);if(c)show(c)});
 document.addEventListener('focusout',function(e){var c=target(e.target);if(c&&!c.contains(e.relatedTarget))delay()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 document.addEventListener('pointerdown',function(e){if(anchor&&pop&&!pop.contains(e.target)&&!target(e.target))close()},true);
 addEventListener('scroll',move,{passive:true});addEventListener('resize',function(){if(!mq.matches)close();else move()},{passive:true});
 ['ShoptetDataLayerUpdated','ShoptetCartUpdated','ShoptetDOMCartCountUpdated'].forEach(function(x){document.documentElement.addEventListener(x,updated)});
 badge();setTimeout(badge,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();