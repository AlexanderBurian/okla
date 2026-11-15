/* Homepage brand carousel. The list is deliberately curated from brands actually sold on OKLA. */
(function(){
 'use strict';
 if(window.__oklaHomeBrandsV2)return;window.__oklaHomeBrandsV2=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var brands=[
  ['ANENG','aneng.svg'],['Benetech','benetech.png'],['Flipper Devices','flipper.svg'],
  ['HABOTEST','habotest.svg'],['LAFVIN','lafvin.png'],['LILYGO','lilygo-wordmark.png'],
  ['M5Stack','m5stack.svg'],['TASI','tasi.png'],['WANBO','wanbo.png'],
  ['Waveshare','waveshare.png'],['WINTACT','wintact.jpg'],['YESIDO','yesido.png']
 ];
 function chevron(direction){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(direction==='prev'?'M15 5l-7 7 7 7':'M9 5l7 7-7 7')+'"/></svg>';
 }
 function mount(){
  var news=document.getElementById('okla-news-v55');
  if(!news||!news.parentNode)return false;
  var heading=news.querySelector('.okn-heading');if(heading)heading.textContent='Novinky';
  var button=news.querySelector('.okn-button');if(button&&button.firstChild)button.firstChild.nodeValue='Všechny novinky';
  if(document.getElementById('okla-brands-v1'))return true;
  var base=window.__oklaAssetBase||'';
  var section=document.createElement('section');section.id='okla-brands-v1';section.setAttribute('aria-label','Značky v nabídce');
  var title=document.createElement('h2');title.className='okla-brands__title';title.textContent='Značky';section.appendChild(title);
  var slider=document.createElement('div');slider.className='okla-brands__slider';
  var prev=document.createElement('button');prev.type='button';prev.className='okla-brands__arrow okla-brands__arrow--prev';prev.setAttribute('aria-label','Předchozí značky');prev.innerHTML=chevron('prev');
  var next=document.createElement('button');next.type='button';next.className='okla-brands__arrow okla-brands__arrow--next';next.setAttribute('aria-label','Další značky');next.innerHTML=chevron('next');
  var viewport=document.createElement('div');viewport.className='okla-brands__viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','Posuvný seznam značek');
  var track=document.createElement('div');track.className='okla-brands__track';
  brands.forEach(function(entry){
   var brand=entry[0],file=entry[1];
   var link=document.createElement('a');link.className='okla-brands__item';link.href='/vyhledavani/?string='+encodeURIComponent(brand);link.setAttribute('data-brand',brand);link.setAttribute('aria-label','Produkty značky '+brand);
   var logo=document.createElement('img');logo.className='okla-brands__logo';logo.src=base+'v91/img/brands/'+file;logo.alt=brand;logo.loading='lazy';logo.decoding='async';link.appendChild(logo);track.appendChild(link);
  });
  viewport.appendChild(track);slider.append(prev,viewport,next);section.appendChild(slider);news.after(section);
  function step(direction){var amount=Math.max(220,Math.floor(viewport.clientWidth*.78));viewport.scrollBy({left:direction*amount,behavior:'smooth'})}
  function state(){var max=viewport.scrollWidth-viewport.clientWidth;prev.disabled=viewport.scrollLeft<3;next.disabled=viewport.scrollLeft>max-3}
  prev.addEventListener('click',function(){step(-1)});next.addEventListener('click',function(){step(1)});viewport.addEventListener('scroll',state,{passive:true});window.addEventListener('resize',state,{passive:true});
  requestAnimationFrame(state);setTimeout(state,300);return true;
 }
 var tries=0;function retry(){if(mount())return;if(++tries<80)setTimeout(retry,125)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',retry,{once:true});else retry();
 window.addEventListener('load',mount,{once:true});
})();
