/* OKLA – homepage in Shoptet's wide layout (no left sidebar): Shoptet splits the page into separate blocks - the main
   content (#content), a full-width box with the banners, and a second <main class="content"> with the product
   sections. All the homepage scripts work on one #content, so before they run the banners and the product sections are
   gathered back into #content (in their order), and the emptied boxes go. Nothing is changed on any other page or when
   the page already comes in one piece. */
(function(){
 'use strict';
 if(window.__oklaHomeMergeV1)return;window.__oklaHomeMergeV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 function merge(){
  var main=document.getElementById('content');if(!main)return;
  var others=[].slice.call(document.querySelectorAll('main.content')).filter(function(m){return m!==main&&!main.contains(m)});
  var banners=[].slice.call(document.querySelectorAll('.content-wrapper.homepage-box .banners-row')).filter(function(b){return !main.contains(b)});
  if(!others.length&&!banners.length)return;
  var frag=document.createDocumentFragment();
  banners.forEach(function(b){
   var box=b.closest('.content-wrapper');frag.appendChild(b);
   if(box&&!box.querySelector('img,a,.banner-wrapper'))box.remove();
  });
  others.forEach(function(m){
   while(m.firstChild)frag.appendChild(m.firstChild);
   var box=m.closest('.content-wrapper');if(box&&box!==document.getElementById('content-wrapper'))box.remove();
  });
  /* after the hidden page title (and the phone search), before anything our scripts added later (the magazine) */
  var ref=null;
  for(var c=main.firstElementChild;c;c=c.nextElementSibling){
   if(c.matches('h1,.okla-hsearch'))continue;
   ref=c;break;
  }
  main.insertBefore(frag,ref);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',merge,{once:true});else merge();
})();
