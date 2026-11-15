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
 /* more product rows on the homepage: copies of existing ones (heading + products) after the last row, chosen so that
    two equal rows never follow each other. Made before the slider script runs, so the copies get their own sliders;
    the copies carry no ids (no duplicate ids on the page). */
 var EXTRA=[1];
 function moreRows(){
  var main=document.getElementById('content');if(!main||main.querySelector('[data-okla-row-copy]'))return;
  var blocks=[].slice.call(main.querySelectorAll(':scope>.products-block[id^="products-"]'));if(blocks.length<3)return;
  var last=blocks[blocks.length-1],lastNo=last.id.replace('products-',''),after=last;
  var prev=lastNo;
  EXTRA.forEach(function(no){
   if(String(no)===String(prev))return;
   var block=main.querySelector(':scope>#products-'+no),title=main.querySelector(':scope>.homepage-products-heading-'+no);
   if(!block||!title)return;
   var t=title.cloneNode(true),b=block.cloneNode(true);
   var slot=String(101+main.querySelectorAll(':scope>.products-block[data-okla-row-copy]').length);
   [t,b].forEach(function(n){n.setAttribute('data-okla-row-copy',String(no));n.removeAttribute('id');n.querySelectorAll('[id]').forEach(function(x){x.removeAttribute('id')});
    /* its own slot number, so the slider script (homepageProductSections) treats it as a section of its own */
    n.className=n.className.replace(new RegExp('(homepage-products(?:-heading)?-)'+no+'(?![0-9])','g'),'$1'+slot)});
   b.removeAttribute('data-testid');
   after.after(t);t.after(b);after=b;prev=no;
  });
 }
 function run(){merge();try{moreRows()}catch(e){}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
