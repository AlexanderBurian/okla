/* OKLA – products beside an article (/nase-novinky/<article>/).
   The article text carries hand-made product cards (.okla-clanek__aside .okla-clanek__card); some point to products the
   shop no longer sells and one article lists the same product twice. Here the column is rebuilt from the homepage's own
   product cards (cloned 1:1: picture, rating, name, stock, price, "Do košíku" that really adds to the cart):
   first the article's products that are still on sale, then other products, always 3 different ones.
   If the homepage cannot be read, the original cards stay as they are. */
(function(){
 'use strict';
 if(window.__oklaArticleProductsV1)return;window.__oklaArticleProductsV1=true;
 var COUNT=3;

 function path(href){try{return new URL(href,location.href).pathname.replace(/\/?$/,'/')}catch(e){return ''}}
 function cardHref(card){var a=card.querySelector('a.name[href],a.image[href],a[href]');return a?path(a.getAttribute('href')):''}
 function shuffle(list){for(var i=list.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=list[i];list[i]=list[j];list[j]=t}return list}

 function build(aside,doc){
  /* every product card on the homepage, once each */
  var seen={},cards=[];
  [].slice.call(doc.querySelectorAll('.products .product')).forEach(function(p){
   var h=cardHref(p);if(!h||seen[h])return;seen[h]=1;cards.push({href:h,el:p});
  });
  if(cards.length<COUNT)return false;
  /* the article's own products that are still on sale, in the article's order, then the rest at random */
  var wanted=[];
  [].slice.call(aside.querySelectorAll('.okla-clanek__card a[href]')).forEach(function(a){var h=path(a.getAttribute('href'));if(h&&wanted.indexOf(h)<0)wanted.push(h)});
  var byHref={};cards.forEach(function(c){byHref[c.href]=c});
  var pick=[];
  wanted.forEach(function(h){if(byHref[h]&&pick.length<COUNT)pick.push(byHref[h])});
  shuffle(cards.filter(function(c){return pick.indexOf(c)<0})).forEach(function(c){if(pick.length<COUNT)pick.push(c)});

  var box=document.createElement('div');
  box.className='products products-block okla-art-products';
  pick.forEach(function(c){
   var n=c.el.cloneNode(true);
   n.querySelectorAll('img[data-src]').forEach(function(i){i.src=i.getAttribute('data-src');i.removeAttribute('data-src')});
   n.querySelectorAll('[id]').forEach(function(e){e.removeAttribute('id')});
   box.appendChild(n);
  });
  [].slice.call(aside.children).forEach(function(ch){ch.style.setProperty('display','none','important');ch.classList.add('okla-art-old')});
  aside.appendChild(box);
  aside.classList.add('okla-art-aside');
  aside.style.removeProperty('display');
  /* the dead-link guard may already have collapsed the two-column layout: bring the column back */
  var lay=aside.closest('.okla-clanek__layout');
  if(lay){lay.style.removeProperty('display');lay.style.removeProperty('grid-template-columns')}
  document.documentElement.classList.add('okla-art-products-on');
  return true;
 }

 function start(){
  var aside=document.querySelector('.okla-clanek__aside');
  if(!aside||aside.querySelector('.okla-art-products')||!window.fetch)return;
  fetch('/',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   if(!html)return;
   build(aside,new DOMParser().parseFromString(html,'text/html'));
  }).catch(function(){});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
