/* Presentation hook for the isolated homepage retail refresh. */
(function(){
 'use strict';
 if(window.__oklaHomeRetailRefresh)return;window.__oklaHomeRetailRefresh=true;
 document.documentElement.classList.add('okla-home-retail');
 function numeric(node,names){
  if(!node)return 0;
  for(var i=0;i<names.length;i++){
   var raw=node.getAttribute(names[i]);
   if(raw!=null){var value=Number(String(raw).replace(',','.'));if(Number.isFinite(value))return value}
  }
  return 0;
 }
 function ratings(){
  var mobile=window.matchMedia('(max-width:767px)').matches;
  document.querySelectorAll('main#content .okla-slider-shell .product').forEach(function(card){
   var wrap=card.querySelector('.ratings-wrapper');if(!wrap)return;
   wrap.querySelectorAll('.okla-retail-rating-meta').forEach(function(old){old.remove()});
   wrap.classList.remove('okla-retail-rating');
   if(!mobile)return;
   var countNode=wrap.querySelector('[data-micro-rating-count]')||card.querySelector('[itemprop="ratingCount"]');
   var valueNode=wrap.querySelector('[data-micro-rating-value],[itemprop="ratingValue"]')||card.querySelector('[itemprop="ratingValue"]');
   var count=numeric(countNode,['data-micro-rating-count','content','data-rating-count']);
   var value=numeric(valueNode,['data-micro-rating-value','content','data-rating']);
   if(!count)return;
   wrap.classList.add('okla-retail-rating');
   var meta=document.createElement('span');meta.className='okla-retail-rating-meta';
   if(value){var score=document.createElement('strong');score.className='okla-retail-rating-score';score.textContent=value.toFixed(1).replace('.',',');meta.appendChild(score)}
   var link=document.createElement('a');link.className='okla-retail-rating-count';
   var productLink=card.querySelector('a.name,a.image');link.href=(productLink&&productLink.href?productLink.href.split('#')[0]:'')+'#hodnoceni';
   link.textContent='('+count+')';link.setAttribute('aria-label',count+' zákaznických recenzí');meta.appendChild(link);wrap.appendChild(meta);
  });
 }
 function apply(){
  var section=document.getElementById('okla-v61-categories');
  if(section)section.querySelectorAll('.okla-retail-category-title').forEach(function(heading){heading.remove()});
  ratings();
  return !!section&&!!document.querySelector('main#content .okla-slider-shell .product');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 window.addEventListener('load',apply,{once:true});
 window.addEventListener('resize',apply,{passive:true});
 var tries=0,timer=setInterval(function(){if(apply()||++tries>20)clearInterval(timer)},120);
})();
