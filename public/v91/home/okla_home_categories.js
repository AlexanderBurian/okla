/* Okla – homepage categories as one row of big round tiles (Best Buy style): a light grey circle with a product photo
   from the category and the category name under it. PC: one row across the full width (the left sidebar is gone on the
   homepage); phones: the same circles in a row that scrolls sideways (replaces the icon tiles #okla-v61-categories).
   The categories and their links come from the shop's own navigation; a category without its photo yet (an empty
   one) would show its pictogram instead; every current category has its photo. */
(function(){
 'use strict';
 if(window.__oklaHomeCategoriesV1)return;window.__oklaHomeCategoriesV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var base=window.__oklaAssetBase||'';
 function norm(t){return (t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[,+]/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}
 /* a photo of a typical product of the category (cut out of the shop's own product photo) */
 var PHOTO={'elektronicke multitooly':'multitooly','chytra elektronika':'chytra','merici technika a naradi':'merici','merici technika':'merici','endoskopy a inspekcni kamery':'endoskopy','endoskopy':'endoskopy','prakticke vychytavky':'vychytavky','designove gadgety':'gadgety','projektory a obraz':'projektory','prislusenstvi':'prislusenstvi'};
 /* the pictograms of the categories (the same set as the category menus) */
 var ICON={'elektronicke multitooly':'multitooly.png','chytra elektronika':'chytra-elektronika.png','merici technika a naradi':'merici-technika.png','merici technika':'merici-technika.png','endoskopy a inspekcni kamery':'endoskopy.png','endoskopy':'endoskopy.png','prakticke vychytavky':'prakticke-vychytavky.png','designove gadgety':'designove-gadgety.png','projektory a obraz':'projektory.png','chytra domacnost':'chytra-domacnost.png','prislusenstvi':'prislusenstvi.svg'};
 function nice(label){
  var t=label.replace(/\s+/g,' ').trim();
  if(/endoskop/i.test(t))return 'Endoskopy';
  if(/m[ěe][řr]ic[ií] technika/i.test(t))return 'Měřicí technika';
  if(t===t.toUpperCase())t=t.charAt(0)+t.slice(1).toLowerCase();
  return t;
 }
 function categories(){
  var q=document.querySelectorAll('#navigation .menu-level-1 > li > a[href],#content-wrapper aside.sidebar #categories .topic>a[href],.box-categories #categories a[href]');
  var seen={},out=[];
  [].forEach.call(q,function(a){
   var label=(a.textContent||'').replace(/\s+/g,' ').trim(),href=a.getAttribute('href'),key=norm(label);
   if(!label||!href||href==='#'||seen[href]||!ICON[key])return;
   seen[href]=1;out.push({label:nice(label),href:href,key:key});
  });
  return out.slice(0,10);
 }
 function build(list){
  var sec=document.createElement('nav');sec.id='okla-cat-circles';sec.setAttribute('aria-label','Kategorie');
  var row=document.createElement('div');row.className='okcc-row';
  list.forEach(function(c){
   var a=document.createElement('a');a.className='okcc-item';a.href=c.href;
   var circle=document.createElement('span');circle.className='okcc-circle';
   var img=document.createElement('img');img.alt='';img.loading='eager';img.decoding='async';
   if(PHOTO[c.key]){img.src=base+'v91/img/catc/'+PHOTO[c.key]+'.webp';img.className='okcc-photo'}
   else{img.src=base+'v91/img/cat/'+ICON[c.key];img.className='okcc-icon'}
   circle.appendChild(img);
   var name=document.createElement('span');name.className='okcc-name';name.textContent=c.label;
   a.append(circle,name);row.appendChild(a);
  });
  sec.appendChild(row);
  return sec;
 }
 function mount(){
  if(document.getElementById('okla-cat-circles'))return true;
  var main=document.querySelector('main#content')||document.querySelector('#content');if(!main)return false;
  var list=categories();if(list.length<3)return false;
  var banners=main.querySelector('.banners-row');
  var anchor=banners||main.querySelector('.homepage-group-title');
  if(!anchor)return false;
  var sec=build(list);
  if(banners)banners.after(sec);else anchor.before(sec);
  document.documentElement.classList.add('okla-cc-on');
  keepPlace(sec);
  /* the product sliders and the hero measured the content before the sidebar went away: let them measure again */
  [60,400,1200].forEach(function(t){setTimeout(function(){try{window.dispatchEvent(new Event('resize'))}catch(e){}},t)});
  return true;
 }
 /* other homepage scripts re-order the sections after they load (phones): the row always goes back right under
    the banners */
 function keepPlace(sec){
  function fix(){
   var main=sec.parentNode,banners=main&&main.querySelector('.banners-row');
   if(!banners||banners.parentNode!==main)return;
   if(banners.nextElementSibling!==sec)banners.after(sec);
  }
  if(window.MutationObserver&&sec.parentNode)new MutationObserver(function(){fix()}).observe(sec.parentNode,{childList:true});
  setTimeout(fix,300);setTimeout(fix,1500);
 }
 var tries=0;
 (function tick(){if(mount())return;if(++tries<80)setTimeout(tick,120)})();
})();
