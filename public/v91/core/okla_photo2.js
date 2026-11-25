/* OKLA – PC only: pointing at a product card shows the product's second photo; moving away brings the first one back.
   The second photo's file name comes from okla_photo2_map.js (built from the shop by tools/build_second_photos.mjs);
   only the file name in the card's own picture address is swapped, so the size and look stay the same. The second
   photo is loaded first and swapped in only once it is there (never an empty card); a product with one photo gets a
   gentle zoom instead. The whole card reacts - picture, name, price. */
(function(){
 'use strict';
 if(window.__oklaPhoto2)return;window.__oklaPhoto2=true;
 var pc=window.matchMedia('(min-width:992px) and (hover:hover)');
 var MAP=window.OKLA_PHOTO2||{};
 var current=null;

 function file(u){return decodeURIComponent(String(u||'').split('?')[0].split('/').pop()||'')}
 function second(img){
  if(img.dataset.oklaP2!==undefined)return img.dataset.oklaP2;
  var src=img.currentSrc||img.getAttribute('src')||'',f=file(src),s=MAP[f]||'';
  var url='';
  if(s){var cut=src.split('?'),path=cut[0];url=path.slice(0,path.lastIndexOf('/')+1)+encodeURI(s)+(cut[1]?'?'+cut.slice(1).join('?'):'')}
  img.dataset.oklaP2=url;
  if(url){img.dataset.oklaP1=src;if(img.getAttribute('srcset'))img.dataset.oklaP1set=img.getAttribute('srcset')}
  return url;
 }
 function show(card){
  var img=card.querySelector('a.image img');if(!img)return;
  card.__oklaP2on=true;
  var url=second(img);
  /* one photo only: it comes a little closer instead (okla_photo2.css) */
  if(!url){card.classList.add('okla-photo-zoom');return}
  var pre=new Image();
  pre.onload=function(){if(!card.__oklaP2on)return;if(img.getAttribute('srcset'))img.removeAttribute('srcset');img.src=url;card.classList.add('okla-photo2-on')};
  pre.src=url;
  if(pre.complete&&pre.naturalWidth)pre.onload();
 }
 function hide(card){
  card.__oklaP2on=false;
  card.classList.remove('okla-photo-zoom');
  if(!card.classList.contains('okla-photo2-on'))return;
  var img=card.querySelector('a.image img');
  if(img&&img.dataset.oklaP1){img.src=img.dataset.oklaP1;if(img.dataset.oklaP1set)img.setAttribute('srcset',img.dataset.oklaP1set)}
  card.classList.remove('okla-photo2-on');
 }
 document.addEventListener('mouseover',function(e){
  if(!pc.matches)return;
  var card=e.target.closest&&e.target.closest('.product');
  if(card===current)return;
  if(current)hide(current);
  current=card||null;
  if(current)show(current);
 },{passive:true});
 document.addEventListener('mouseout',function(e){
  if(!current||!pc.matches)return;
  if(!e.relatedTarget||!current.contains(e.relatedTarget)){hide(current);current=null}
 },{passive:true});
})();
