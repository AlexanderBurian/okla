/* Homepage article labels and a brand island derived only from brands present in OKLA_V86_CATALOG. */
(function(){
 'use strict';
 if(window.__oklaHomeBrandsV1)return;window.__oklaHomeBrandsV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 function mount(){
  var news=document.getElementById('okla-news-v55');
  if(!news||!news.parentNode)return false;
  var heading=news.querySelector('.okn-heading');if(heading)heading.textContent='Novinky';
  var button=news.querySelector('.okn-button');if(button&&button.firstChild)button.firstChild.nodeValue='Všechny novinky';
  if(document.getElementById('okla-brands-v1'))return true;
  var catalog=window.OKLA_V86_CATALOG||{};
  var logos={'Flipper Devices':'flipper.svg','LILYGO':'lilygo-wordmark.png','M5Stack':'m5stack.svg','WANBO':'wanbo.png'};
  var seen={},brands=Object.keys(logos),base=window.__oklaAssetBase||'';
  brands.forEach(function(brand){seen[brand]=true});
  Object.keys(catalog).forEach(function(key){
   var brand=String(catalog[key]&&catalog[key].brand||'').trim();
   if(brand&&!seen[brand]){seen[brand]=true;brands.push(brand)}
  });
  brands.sort(function(a,b){return a.localeCompare(b,'cs')});
  if(!brands.length)return false;
  var section=document.createElement('section');section.id='okla-brands-v1';section.setAttribute('aria-label','Značky v nabídce');
  var title=document.createElement('h2');title.className='okla-brands__title';title.textContent='Značky';section.appendChild(title);
  var grid=document.createElement('div');grid.className='okla-brands__grid';
  brands.forEach(function(brand){
   var link=document.createElement('a');link.className='okla-brands__item';link.href='/vyhledavani/?string='+encodeURIComponent(brand);link.setAttribute('data-brand',brand);link.setAttribute('aria-label','Produkty značky '+brand);
   if(logos[brand]){var logo=document.createElement('img');logo.className='okla-brands__logo';logo.src=base+'v91/img/brands/'+logos[brand];logo.alt=brand;logo.loading='lazy';logo.decoding='async';link.appendChild(logo)}
   else{var name=document.createElement('span');name.className='okla-brands__name';name.textContent=brand;link.appendChild(name)}grid.appendChild(link);
  });
  section.appendChild(grid);news.after(section);return true;
 }
 var tries=0;function retry(){if(mount())return;if(++tries<80)setTimeout(retry,125)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',retry,{once:true});else retry();
 window.addEventListener('load',mount,{once:true});
})();
