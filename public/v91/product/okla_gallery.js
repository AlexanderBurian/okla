/* OKLA product page - the picture viewer. A click on the product's main picture opens the shop's pictures over the whole
   screen: a grey bar on top (logo, "2 / 6", close), the picture in the middle on white with arrows at the sides, the
   thumbnails in a row underneath (the current one framed). Arrow keys, Escape, swiping on phones and the phone's Back
   button work. It replaces Shoptet's own lightbox (colorbox) for the product pictures only - colorbox stays for the
   shop's other dialogs. The pictures are the ones Shoptet lists for its lightbox (a.cbox-gal) with the thumbnails of
   .p-thumbnail. */
(function(){
 'use strict';
 if(window.__oklaGalleryV1)return;window.__oklaGalleryV1=true;

 var NS='http://www.w3.org/2000/svg';
 function el(tag,cls){var n=document.createElement(tag);if(cls)n.className=cls;return n}
 function icon(d,cls){
  var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');if(cls)s.setAttribute('class',cls);
  var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);return s;
 }
 function key(u){try{var x=new URL(u,location.href);return x.pathname.replace(/\/user\/shop\/[^/]+\//,'/')}catch(e){return u}}

 /* the shop's pictures: big picture + its thumbnail, in the shop's order */
 function pictures(){
  var thumbs={};
  document.querySelectorAll('#content .p-detail a.p-thumbnail[href]').forEach(function(a){
   var img=a.querySelector('img');if(img)thumbs[key(a.href)]=img.getAttribute('data-src')||img.currentSrc||img.src;
  });
  var list=[],seen={};
  var links=document.querySelectorAll('#content .p-detail a.cbox-gal[href]');
  if(!links.length)links=document.querySelectorAll('#content .p-detail a.p-thumbnail[href]');
  [].forEach.call(links,function(a){
   var k=key(a.href);if(seen[k])return;seen[k]=1;
   list.push({src:a.href,thumb:thumbs[k]||a.href});
  });
  if(!list.length){
   var main=document.querySelector('#content .p-detail a.p-main-image[href]');
   if(main)list.push({src:main.href,thumb:main.href});
  }
  return list;
 }
 function altText(){var h=document.querySelector('#content h1');return h?h.textContent.replace(/\s+/g,' ').trim():''}

 var box=null,stage,img,count,strip,prev,next,list=[],index=0,lastFocus=null,pushed=false;

 function build(){
  box=el('div','okla-gal');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Galerie obrázků produktu');box.hidden=true;box.tabIndex=-1;
  var bar=el('div','okla-gal__bar');
  var logo=el('img','okla-gal__logo');logo.src=(window.__oklaAssetBase||'')+'v91/img/okla-logo.png';logo.alt='OKLA.cz';
  count=el('div','okla-gal__count');count.setAttribute('aria-live','polite');
  var close=el('button','okla-gal__close');close.type='button';close.setAttribute('aria-label','Zavřít galerii');
  close.appendChild(icon('M6 6l12 12M18 6 6 18'));
  close.addEventListener('click',function(){hide(true)});
  bar.append(logo,count,close);
  stage=el('div','okla-gal__stage');
  img=el('img','okla-gal__img');img.decoding='async';img.draggable=false;
  prev=el('button','okla-gal__nav okla-gal__nav--prev');prev.type='button';prev.setAttribute('aria-label','Předchozí obrázek');prev.appendChild(icon('m15 5-7 7 7 7'));
  next=el('button','okla-gal__nav okla-gal__nav--next');next.type='button';next.setAttribute('aria-label','Další obrázek');next.appendChild(icon('m9 5 7 7-7 7'));
  prev.addEventListener('click',function(){go(index-1)});
  next.addEventListener('click',function(){go(index+1)});
  stage.append(img,prev,next);
  strip=el('div','okla-gal__thumbs');
  box.append(bar,stage,strip);
  document.body.appendChild(box);
  /* swipe on phones */
  var x0=null,y0=0;
  stage.addEventListener('touchstart',function(e){if(e.touches.length===1){x0=e.touches[0].clientX;y0=e.touches[0].clientY}else x0=null},{passive:true});
  stage.addEventListener('touchend',function(e){
   if(x0===null||!e.changedTouches.length)return;
   var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
   if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2)go(index+(dx<0?1:-1));
  },{passive:true});
  box.addEventListener('keydown',function(e){
   if(e.key==='Escape'){e.preventDefault();hide(true)}
   else if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}
   else if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}
   else if(e.key==='Tab'){
    /* focus stays inside the viewer */
    var f=[].slice.call(box.querySelectorAll('button:not([hidden])')).filter(function(b){return b.offsetParent!==null});
    if(!f.length)return;var first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
  });
 }

 function renderThumbs(){
  strip.replaceChildren();
  list.forEach(function(p,i){
   var b=el('button','okla-gal__thumb');b.type='button';b.setAttribute('aria-label','Obrázek '+(i+1)+' z '+list.length);
   var t=el('img');t.src=p.thumb;t.alt='';t.loading='lazy';t.decoding='async';b.appendChild(t);
   b.addEventListener('click',function(){go(i)});
   strip.appendChild(b);
  });
  strip.hidden=list.length<2;
 }

 function go(i){
  if(!list.length)return;
  index=(i+list.length)%list.length;
  var p=list[index];
  img.src=p.src;img.alt=altText()+(list.length>1?' – obrázek '+(index+1):'');
  count.textContent=list.length>1?(index+1)+' / '+list.length:'';
  prev.hidden=next.hidden=list.length<2;
  [].forEach.call(strip.children,function(b,j){
   var on=j===index;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'true':'false');
   if(on&&b.scrollIntoView)b.scrollIntoView({block:'nearest',inline:'center'});
  });
  /* the neighbours load in advance, so the next picture is there at once */
  [index+1,index-1].forEach(function(j){if(list.length>1){var n=new Image();n.src=list[(j+list.length)%list.length].src}});
 }

 function show(start){
  list=pictures();if(!list.length)return false;
  if(!box)build();
  renderThumbs();
  lastFocus=document.activeElement;
  box.hidden=false;
  document.documentElement.classList.add('okla-gal-open');
  go(start);
  /* the phone's Back button closes the viewer instead of leaving the page */
  try{history.pushState({oklaGallery:1},'');pushed=true}catch(e){pushed=false}
  /* the viewer itself takes the focus (keys work at once; no focus ring on the close button until Tab is used) */
  box.focus({preventScroll:true});
  return true;
 }
 function hide(fromUser){
  if(!box||box.hidden)return;
  box.hidden=true;
  document.documentElement.classList.remove('okla-gal-open');
  img.removeAttribute('src');
  if(pushed){pushed=false;if(fromUser&&history.state&&history.state.oklaGallery)history.back()}
  if(lastFocus&&lastFocus.focus)try{lastFocus.focus({preventScroll:true})}catch(e){}
 }
 window.addEventListener('popstate',function(){if(box&&!box.hidden){pushed=false;hide(false)}});

 /* which picture the main image shows now (Shoptet swaps it when a thumbnail is chosen) */
 function currentIndex(){
  var main=document.querySelector('#content .p-detail a.p-main-image[href]');
  if(!main)return 0;
  var k=key(main.href),l=pictures();
  for(var i=0;i<l.length;i++)if(key(l[i].src)===k)return i;
  return 0;
 }

 /* a click (or tap) on the main picture opens this viewer; Shoptet's lightbox and zoom handlers do not get it */
 document.addEventListener('click',function(e){
  var t=e.target;
  if(!t||!t.closest)return;
  var hit=t.closest('#content .p-detail .p-image, #content .p-detail a.cbox-gal');
  if(!hit||(box&&box.contains(t)))return;
  var i=hit.matches('a.cbox-gal')?(function(){var k=key(hit.href),l=pictures();for(var j=0;j<l.length;j++)if(key(l[j].src)===k)return j;return 0})():currentIndex();
  if(show(i)){e.preventDefault();e.stopImmediatePropagation();}
 },true);
})();
