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
  });
 }
 swap();
 if(window.MutationObserver){var q=false;new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;swap()})}).observe(document.documentElement,{childList:true,subtree:true})}
})();
