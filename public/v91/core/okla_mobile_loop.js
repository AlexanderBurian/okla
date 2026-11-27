/* Okla – phones: every row the finger moves sideways has no end (product rows on every page, the deal cards, the
   articles, the category circles, the brands, the cart's and the article's suggestions).
   How: nothing is copied while the page loads. The first time a finger touches a row, the row's items are put there
   several times over (copies before and after them, without ids, out of the tab order and hidden from screen
   readers) and the row is moved by exactly the copies put in front - the same items stand in the same place, so
   nothing visibly moves. Enough copies are made for a strong flick (at least about 2000 px each way). Only once the
   row has completely stopped (no finger, no momentum) it is moved back to the middle by whole sets - the same items
   again stand in the same place and the snap points repeat, so the jump cannot be seen. (Moving a row while it was
   still gliding made it jerk on phones.) If the row's own items have changed since (a price read later, a card
   dropped, a filter) the copies are made again, the row kept where it is. PC and tablets are not touched: when the
   window grows past a phone the copies go. */
(function(){
 'use strict';
 if(window.__oklaLoopAll)return;window.__oklaLoopAll=1;
 var phone=matchMedia('(max-width:767px)');
 /* [the scrolling element, the element holding the items inside it (empty: the same one)] */
 var ROWS=[
  ['.okla-slider-shell>.okla-slider-viewport','.okla-slider-track'],
  ['#okla-deals .okd-track',''],
  ['.olg-band .olg-track',''],
  ['#okla-news-v55 .okn-grid',''],
  ['#okla-cat-circles .okcc-row',''],
  ['#okla-cart-recs .ocr-grid',''],
  ['.okla-art-aside .okla-art-products','']
 ];
 var SEL=ROWS.map(function(r){return r[0]}).join(',');
 var MARK='data-okla-loop',live=[];

 function trackOf(vp){for(var i=0;i<ROWS.length;i++)if(vp.matches(ROWS[i][0]))return ROWS[i][1]?vp.querySelector(':scope>'+ROWS[i][1]):vp;return null}
 function own(tr){return [].filter.call(tr.children,function(c){return !c.hasAttribute(MARK)&&!c.hasAttribute('data-okla-clone')&&!c.hasAttribute('data-okla-copy')})}
 function scrolls(vp){var s=getComputedStyle(vp).overflowX;return (s==='auto'||s==='scroll')&&vp.clientWidth>0}
 /* what the row's own items look like now: their text, picture, visibility */
 function sign(items){return items.map(function(c){var im=c.querySelector('img');return c.className+'|'+(c.hidden?1:0)+'|'+c.style.cssText+'|'+(im?im.getAttribute('src'):'')+'|'+c.textContent.replace(/\s+/g,' ')}).join('\n')}
 function copy(el){
  var c=el.cloneNode(true);c.setAttribute(MARK,'1');c.setAttribute('aria-hidden','true');c.removeAttribute('id');
  c.querySelectorAll('[id]').forEach(function(n){n.removeAttribute('id')});
  if(c.matches('a,button,input,select,textarea'))c.tabIndex=-1;
  c.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(function(n){n.setAttribute('tabindex','-1')});
  return c;
 }
 /* at once, never gliding (a row may have smooth scrolling set with !important) */
 function jump(vp,x){
  var v=vp.style.getPropertyValue('scroll-behavior'),p=vp.style.getPropertyPriority('scroll-behavior');
  vp.style.setProperty('scroll-behavior','auto','important');
  try{vp.scrollTo({left:x,behavior:'instant'})}catch(e){vp.scrollLeft=x}
  if(Math.abs(vp.scrollLeft-x)>1)vp.scrollLeft=x;
  if(v)vp.style.setProperty('scroll-behavior',v,p);else vp.style.removeProperty('scroll-behavior');
 }

 function drop(L){
  var a=L.ref,before=a&&a.isConnected?a.getBoundingClientRect().left:0;
  L.tr.querySelectorAll(':scope>['+MARK+']').forEach(function(n){n.remove()});
  L.k=0;L.w=0;L.next=null;L.ref=null;
  if(a&&a.isConnected)jump(L.vp,L.vp.scrollLeft+(a.getBoundingClientRect().left-before));
 }
 /* the copies: k sets in front, k after; the row kept where it was */
 function build(L){
  var items=own(L.tr);
  var a=items[0],before=a?a.getBoundingClientRect().left:0;
  L.tr.querySelectorAll(':scope>['+MARK+']').forEach(function(n){n.remove()});
  L.items=items;L.sig=sign(items);L.k=0;L.w=0;L.next=null;L.ref=a;
  /* measured on the first item that is shown (a filter may hide some) */
  var ri=-1;for(var i=0;i<items.length;i++)if(items[i].getClientRects().length){ri=i;break}
  if(ri<0||items.length<2||!scrolls(L.vp)||L.vp.scrollWidth<=L.vp.clientWidth+8){if(a)jump(L.vp,L.vp.scrollLeft+(a.getBoundingClientRect().left-before));return}
  /* one set after, to measure a set's width (its gaps included) */
  var f=document.createDocumentFragment();items.forEach(function(el){f.appendChild(copy(el))});
  var next=f.childNodes[ri];L.tr.appendChild(f);
  L.ref=items[ri];
  var w=next.getBoundingClientRect().left-L.ref.getBoundingClientRect().left;
  if(!(w>40)){drop(L);return}
  var k=Math.max(1,Math.min(5,Math.ceil(2000/w)));
  for(var j=1;j<k;j++){f=document.createDocumentFragment();items.forEach(function(el){f.appendChild(copy(el))});L.tr.appendChild(f)}
  f=document.createDocumentFragment();
  for(j=0;j<k;j++)items.forEach(function(el){f.appendChild(copy(el))});
  L.tr.insertBefore(f,a);
  L.k=k;L.w=w;L.next=next;
  jump(L.vp,L.vp.scrollLeft+(a.getBoundingClientRect().left-before));
 }
 /* the row has stopped: back to the middle by whole sets */
 function settle(L){
  if(L.touching||!L.k||!L.vp.isConnected)return;
  if(sign(own(L.tr))!==L.sig){build(L);return}
  var w=L.next&&L.next.isConnected&&L.ref.isConnected?L.next.getBoundingClientRect().left-L.ref.getBoundingClientRect().left:0;
  if(!(w>40))return;L.w=w;
  var x=L.vp.scrollLeft,n=Math.round((x-L.k*w)/w);
  if(n)jump(L.vp,x-n*w);
 }
 function attach(vp){
  if(vp.__oklaLoop)return vp.__oklaLoop;
  var tr=trackOf(vp);if(!tr)return null;
  var L={vp:vp,tr:tr,items:[],k:0,w:0,next:null,sig:'',touching:false,t:0};
  vp.__oklaLoop=L;live.push(L);
  function later(){clearTimeout(L.t);L.t=setTimeout(function(){settle(L)},160)}
  vp.addEventListener('touchend',function(){L.touching=false;later()},{passive:true});
  vp.addEventListener('touchcancel',function(){L.touching=false;later()},{passive:true});
  vp.addEventListener('scroll',function(){if(L.k)later()},{passive:true});
  if('onscrollend' in window)vp.addEventListener('scrollend',function(){if(L.k&&!L.touching){clearTimeout(L.t);settle(L)}},{passive:true});
  return L;
 }
 /* the first touch of a row makes its copies (and a later touch remakes them if the row's items have changed) */
 document.addEventListener('touchstart',function(e){
  if(!phone.matches||!e.target||!e.target.closest)return;
  var vp=e.target.closest(SEL);if(!vp)return;
  var L=attach(vp);if(!L)return;
  L.touching=true;clearTimeout(L.t);
  try{if(!L.k||sign(own(L.tr))!==L.sig)build(L)}catch(err){}
 },{passive:true,capture:true});
 /* past a phone: no copies */
 function mode(){
  live=live.filter(function(L){return L.vp.isConnected});
  if(!phone.matches)live.forEach(function(L){if(L.k)drop(L)});
 }
 if(phone.addEventListener)phone.addEventListener('change',mode);else if(phone.addListener)phone.addListener(mode);
})();
