/* OKLA – the category pictograms (left sidebar on PC, the phone Katalog panel, category menus) are replaced by the same
   product photos as the homepage category circles (v91/img/catc/), on a small light grey circle. */
(function(){
 'use strict';
 if(window.__oklaCatPhotosV1)return;window.__oklaCatPhotosV1=true;
 var base=window.__oklaAssetBase||'';
 var MAP={'multitooly.png':'multitooly','chytra-elektronika.png':'chytra','merici-technika.png':'merici','endoskopy.png':'endoskopy','prakticke-vychytavky.png':'vychytavky','designove-gadgety.png':'gadgety','projektory.png':'projektory','prislusenstvi.svg':'prislusenstvi'};
 function swap(root){
  (root||document).querySelectorAll('img[src*="/img/cat/"]').forEach(function(img){
   if(img.closest('#okla-cat-circles'))return;
   var m=(img.getAttribute('src')||'').match(/\/img\/cat\/([^?#]+)$/);if(!m||!MAP[m[1]])return;
   img.src=base+'v91/img/catc/'+MAP[m[1]]+'.webp';img.classList.add('okla-cat-photo');
   /* the grey circle is a frame of its own, so the photo can sit larger inside it */
   if(!img.parentNode.classList.contains('okla-cat-photo-wrap')){var w=document.createElement('span');w.className='okla-cat-photo-wrap';img.parentNode.insertBefore(w,img);w.appendChild(img)}
  });
 }
 /* category names shown shorter than in Shoptet: "Měřicí technika a nářadí" -> "Měřicí technika" (every place it is shown) */
 var RENAME=[[/^\s*M[ěe][řr]ic[ií] technika a n[áa][řr]ad[ií]\s*$/i,'Měřicí technika']];
 function rename(root){
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null),n,list=[];
  while((n=w.nextNode())){if(n.nodeValue.length<40&&/n[áa][řr]ad/i.test(n.nodeValue))list.push(n)}
  list.forEach(function(t){RENAME.forEach(function(r){if(r[0].test(t.nodeValue))t.nodeValue=r[1]})});
  if(/M[ěe][řr]ic[ií] technika a n[áa][řr]ad[ií]/i.test(document.title))document.title=document.title.replace(/M[ěe][řr]ic[ií] technika a n[áa][řr]ad[ií]/i,'Měřicí technika');
 }
 function swapAll(){swap();if(document.body)rename(document.body)}
 swapAll();
 if(window.MutationObserver){var q=false;new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;swapAll()})}).observe(document.documentElement,{childList:true,subtree:true})}
})();
