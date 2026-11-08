/* OKLA CTA shape. On top of the blue CTA palette (okla_all_cta_blue.css):
   1. A cart pictogram on the LEFT of every "do košíku / přidat do košíku" button.
   2. Less rounded corners on all commerce CTAs (still slightly rounded).
   Done with inline styles / a prepended inline SVG, so it beats every stylesheet
   rule regardless of specificity and survives the shop's own re-renders. */
(function(){
 'use strict';
 if(window.__oklaCtaShapeV1)return;window.__oklaCtaShapeV1=true;

 var RADIUS='5px';
 /* every commerce call-to-action gets the squarer corner */
 var RADIUS_SEL='.btn-primary,.btn-conversion,.btn-cart,.add-to-cart-button,.okla-green-cta,.okla-m-buybar__btn,.okla-dbb__btn,#okla-cart-drawer .okla-cd__card-btn,#okla-cart-drawer .okla-cd__btn--primary,#okla-cart-preview .okla-cp__go,.next-step-forward,.next-step-finish,.okla-ord-btn--track';
 /* only the real add-to-cart buttons get the cart icon */
 var ICON_SEL='.btn-cart,.add-to-cart-button,.okla-m-buybar__btn,#okla-cart-drawer .okla-cd__card-btn,#okla-cart-drawer .okla-cd__btn--primary';

 var NS='http://www.w3.org/2000/svg';
 function cartSvg(){
  var s=document.createElementNS(NS,'svg');
  s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','okla-cta-cart');s.setAttribute('aria-hidden','true');
  s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');
  s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');
  /* inline !important beats the stylesheet rules that hide cart glyphs inside these buttons */
  s.style.setProperty('display','inline-block','important');
  s.style.setProperty('width','18px','important');
  s.style.setProperty('height','18px','important');
  s.style.setProperty('min-width','18px','important');
  s.style.setProperty('margin','0 8px 0 0','important');
  s.style.setProperty('flex','0 0 auto','important');
  s.style.setProperty('opacity','1','important');
  s.style.setProperty('visibility','visible','important');
  s.style.setProperty('vertical-align','middle','important');
  s.style.setProperty('color','inherit','important');
  var p=document.createElementNS(NS,'path');p.setAttribute('d','M2.5 3h2.3l2 11a1.8 1.8 0 0 0 1.8 1.5h8.1a1.8 1.8 0 0 0 1.8-1.4L21.5 7H6');s.appendChild(p);
  [[9,20],[18,20]].forEach(function(c){var ci=document.createElementNS(NS,'circle');ci.setAttribute('cx',c[0]);ci.setAttribute('cy',c[1]);ci.setAttribute('r','1.5');s.appendChild(ci)});
  return s;
 }

 var busy=false;
 function decorate(){
  if(busy)return;busy=true;
  try{
   document.querySelectorAll(RADIUS_SEL).forEach(function(b){b.style.setProperty('border-radius',RADIUS,'important')});
   document.querySelectorAll(ICON_SEL).forEach(function(b){
    if(b.querySelector(':scope > svg.okla-cta-cart'))return;       /* already has our icon */
    b.style.setProperty('display','inline-flex','important');
    b.style.setProperty('align-items','center','important');
    b.style.setProperty('justify-content','center','important');
    var svgs=b.querySelectorAll('svg');                            /* hide the shop's own cart glyph */
    for(var i=0;i<svgs.length;i++){if(!svgs[i].classList.contains('okla-cta-cart'))svgs[i].style.setProperty('display','none','important')}
    b.insertBefore(cartSvg(),b.firstChild);
   });
  }catch(e){}
  busy=false;
 }
 function schedule(){requestAnimationFrame(decorate)}

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
 window.addEventListener('load',decorate);
 try{var mo=new MutationObserver(function(){if(!busy)schedule()});(document.body||document.documentElement).appendChild&&mo.observe(document.body||document.documentElement,{childList:true,subtree:true});}catch(e){}
 [300,900,2000].forEach(function(t){setTimeout(decorate,t)});
})();
