/* OKLA left sidebar: Shoptet's "Top 10" list points at old product pictures that no longer exist (404). A picture that
   fails is replaced by the product's picture from the catalogue, found by the product link. */
(function(){
 'use strict';
 if(window.__oklaSidebarV1)return;
 window.__oklaSidebarV1=true;

 function catalogImage(href){
  var all=window.OKLA_V86_CATALOG||{},path;
  try{path=new URL(href,location.href).pathname}catch(e){return null}
  for(var code in all){
   var p=all[code];
   try{if(p.url&&new URL(p.url).pathname===path)return p.image||null}catch(e){}
  }
  return null;
 }

 function repair(img){
  if(img.dataset.oklaRepaired)return;
  var link=img.closest('a[href]')||(img.closest('li,.product,div')||document).querySelector('a[href]');
  var src=link&&catalogImage(link.getAttribute('href'));
  if(!src)return;
  img.dataset.oklaRepaired='1';
  img.removeAttribute('srcset');
  img.removeAttribute('data-srcset');
  img.setAttribute('data-src',src);
  img.src=src;
 }

 function broken(img){return img.complete&&img.naturalWidth===0&&(img.currentSrc||img.src)}

 function check(){
  var side=document.querySelector('aside.sidebar');
  if(!side)return;
  Array.prototype.forEach.call(side.querySelectorAll('img'),function(img){
   if(img.dataset.oklaWatched!=='1'){
    img.dataset.oklaWatched='1';
    img.addEventListener('error',function(){repair(img)});
   }
   if(broken(img))repair(img);
  });
 }

 function start(){
  check();
  window.addEventListener('load',check);
  /* Lazy pictures get their address when they scroll into view; they are checked again then. */
  window.addEventListener('scroll',function(){clearTimeout(start.t);start.t=setTimeout(check,200)},{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
