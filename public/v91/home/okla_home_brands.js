/* Homepage brand carousel. The list is deliberately curated from brands actually sold on OKLA.
   It is built with the homepage product slider's own markup (okla-slider-shell / viewport / track / controls with
   okla-slider-prev / next), so the arrows get exactly the same look from the shared styles, and it moves the same way:
   an endless loop shifted one logo at a time, swipe on touch screens; no autoplay (the product rows don't either). */
(function(){
 'use strict';
 if(window.__oklaHomeBrandsV3)return;window.__oklaHomeBrandsV3=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var brands=[
  ['ANENG','aneng.svg'],['Benetech','benetech.png'],['Flipper Devices','flipper.svg'],
  ['HABOTEST','habotest.svg'],['LAFVIN','lafvin.png'],['LILYGO','lilygo-wordmark.png'],
  ['M5Stack','m5stack.svg'],['TASI','tasi.png'],['WANBO','wanbo.png'],
  ['Waveshare','waveshare.png'],['WINTACT','wintact.jpg'],['YESIDO','yesido.png']
 ];
 var NS='http://www.w3.org/2000/svg';
 function chevron(d){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);return s}
 function mount(){
  var news=document.getElementById('okla-news-v55');
  if(!news||!news.parentNode)return false;
  var heading=news.querySelector('.okn-heading');if(heading)heading.textContent='Novinky';
  var button=news.querySelector('.okn-button');if(button&&button.firstChild)button.firstChild.nodeValue='Všechny novinky';
  if(document.getElementById('okla-brands-v1'))return true;
  var base=window.__oklaAssetBase||'';
  var section=document.createElement('section');section.id='okla-brands-v1';section.setAttribute('aria-label','Značky v nabídce');
  var title=document.createElement('h2');title.className='okla-brands__title';title.textContent='Značky';section.appendChild(title);
  var shell=document.createElement('div');shell.className='okla-slider-shell okla-brands__shell';
  var viewport=document.createElement('div');viewport.className='okla-slider-viewport okla-brands__viewport';
  var track=document.createElement('div');track.className='okla-slider-track okla-brands__track';
  brands.forEach(function(entry){
   var brand=entry[0],file=entry[1];
   var link=document.createElement('a');link.className='okla-brands__item';link.href='/vyhledavani/?string='+encodeURIComponent(brand);link.setAttribute('data-brand',brand);link.setAttribute('aria-label','Produkty značky '+brand);
   var logo=document.createElement('img');logo.className='okla-brands__logo';logo.src=base+'v91/img/brands/'+file;logo.alt=brand;logo.decoding='async';logo.draggable=false;link.appendChild(logo);track.appendChild(link);
  });
  var controls=document.createElement('span');controls.className='okla-slider-controls';
  var left=document.createElement('button'),right=document.createElement('button');left.type=right.type='button';
  left.className='okla-slider-prev';right.className='okla-slider-next';
  left.setAttribute('aria-label','Předchozí značky');right.setAttribute('aria-label','Další značky');
  left.appendChild(chevron('m15 18-6-6 6-6'));right.appendChild(chevron('m9 18 6-6-6-6'));controls.append(left,right);
  viewport.appendChild(track);shell.append(viewport,controls);section.appendChild(shell);news.after(section);

  var host=shell.closest('main#content')||section,busy=false,dir='',fallback=null,step=0;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* the arrows sit on the island's edges, exactly like the product sliders' */
  function positionControls(){if(!shell.isConnected)return;var h=host.getBoundingClientRect(),r=shell.getBoundingClientRect();if(!h.width||!r.width)return;var cz=controls.currentCSSZoom||1;controls.style.setProperty('left',Math.min(0,Math.round((h.left-r.left)/cz))+'px','important');controls.style.setProperty('right',Math.min(0,Math.round((r.right-h.right)/cz))+'px','important')}
  function size(){if(busy)finish();var gap=parseFloat(getComputedStyle(track).columnGap)||0,first=track.firstElementChild;step=first?first.getBoundingClientRect().width/(first.currentCSSZoom||1)+gap:0;positionControls()}
  function finish(){if(!busy)return;clearTimeout(fallback);track.style.transition='none';if(dir==='next'&&track.firstElementChild)track.appendChild(track.firstElementChild);track.style.transform='translate3d(0,0,0)';void track.offsetWidth;track.style.transition='';busy=false;dir=''}
  function move(direction){if(busy)return;size();if(!step)return;busy=true;dir=direction;var duration=reduced?0:560,ease='transform '+duration+'ms cubic-bezier(.22,.61,.36,1)';
   if(direction==='prev'){track.style.transition='none';track.prepend(track.lastElementChild);track.style.transform='translate3d('+(-step)+'px,0,0)';void track.offsetWidth;track.style.transition=ease;track.style.transform='translate3d(0,0,0)'}
   else{track.style.transition=ease;track.style.transform='translate3d('+(-step)+'px,0,0)'}
   fallback=setTimeout(finish,duration+110)}
  track.addEventListener('transitionend',function(e){if(e.target===track&&e.propertyName==='transform')finish()});
  left.addEventListener('click',function(){move('prev')});right.addEventListener('click',function(){move('next')});
  /* phones: the row scrolls freely under the finger (CSS); the one-logo swipe is for the other touch screens */
  var phone=window.matchMedia('(max-width:767px)');
  var x=0,y=0,swipedAt=0;
  viewport.addEventListener('touchstart',function(e){if(e.touches.length===1){x=e.touches[0].clientX;y=e.touches[0].clientY}},{passive:true});
  viewport.addEventListener('touchend',function(e){if(phone.matches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){swipedAt=Date.now();move(dx<0?'next':'prev')}},{passive:true});
  viewport.addEventListener('click',function(e){if(Date.now()-swipedAt<450){e.preventDefault();e.stopPropagation()}},true);
  size();addEventListener('resize',size,{passive:true});
  if(window.ResizeObserver){var ro=new ResizeObserver(function(){requestAnimationFrame(positionControls)});ro.observe(viewport);ro.observe(host)}
  return true;
 }
 var tries=0;function retry(){if(mount())return;if(++tries<80)setTimeout(retry,125)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',retry,{once:true});else retry();
 window.addEventListener('load',mount,{once:true});
})();
