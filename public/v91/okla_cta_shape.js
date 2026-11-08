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

 /* Any button that still computes to a green fill becomes the OKLA blue. This is
    the final safety net over every green source (product commerce, login,
    detail, drawer, …). It targets BUTTONS only, so green text ("Skladem") and
    the green cross-sell checkmark are never touched. */
 var GREEN_BTN_SEL='button,input[type="submit"],input[type="button"],input[type="reset"],.btn,a.btn,.button,[role="button"],.add-to-cart-button,.btn-cart,.btn-conversion,.btn-primary,.okla-green-cta,.unveil-button';
 function isGreenFill(v){var n=(v||'').match(/[0-9.]+/g);if(!n||n.length<3)return false;var r=+n[0],g=+n[1],b=+n[2];var a=n.length>3?+n[3]:1;return a>=.2&&g>=110&&g>r*1.23&&g>b*1.36&&r<180&&b<125;}
 function blueify(b){
  b.style.setProperty('background','#0074e8','important');
  b.style.setProperty('background-color','#0074e8','important');
  b.style.setProperty('background-image','none','important');
  b.style.setProperty('border-color','#0074e8','important');
  b.style.setProperty('color','#fff','important');
  b.classList.add('okla-cta-blueforced');
  b.querySelectorAll('span,strong,b,small,i').forEach(function(x){x.style.setProperty('color','#fff','important')});
 }
 function greenToBlue(){
  /* The navy "Otevřít filtr" is not green, so colour it blue via its own button
     variables — colour only, nothing about its size or width changes. */
  document.querySelectorAll('.unveil-button').forEach(function(b){
   b.style.setProperty('--okla-button-rest-background','#0074e8','important');
   b.style.setProperty('--okla-button-rest-border','#0074e8','important');
   b.style.setProperty('--okla-button-rest-color','#fff','important');
  });
  document.querySelectorAll(GREEN_BTN_SEL).forEach(function(b){
   if(b.classList.contains('okla-xsell__item'))return;
   if(isGreenFill(getComputedStyle(b).backgroundColor))blueify(b);
  });
 }
 var HB='#0068d1',RB='#0074e8';
 function setHoverBlue(b,c){b.style.setProperty('background',c,'important');b.style.setProperty('background-color',c,'important');b.style.setProperty('border-color',c,'important')}
 document.addEventListener('mouseover',function(e){var b=e.target.closest&&e.target.closest('.okla-cta-blueforced');if(b)setHoverBlue(b,HB)},true);
 document.addEventListener('mouseout',function(e){var b=e.target.closest&&e.target.closest('.okla-cta-blueforced');if(!b)return;if(e.relatedTarget&&b.contains(e.relatedTarget))return;setHoverBlue(b,RB)},true);

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
   greenToBlue();
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
   /* Phones: only make the cart icon a touch smaller so the icon + "Do košíku"
      fit in the EXISTING button — the button's own size/width is left untouched. */
   var mobile=!window.matchMedia||window.matchMedia('(max-width:767px)').matches;
   if(mobile){
    document.querySelectorAll('.product .btn-cart,.product .add-to-cart-button').forEach(function(b){
     var ic=b.querySelector(':scope > svg.okla-cta-cart');
     if(ic){ic.style.setProperty('width','16px','important');ic.style.setProperty('height','16px','important');ic.style.setProperty('min-width','16px','important');ic.style.setProperty('margin','0 6px 0 0','important');}
    });
   }
  }catch(e){}
  busy=false;
 }
 function schedule(){requestAnimationFrame(decorate)}

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
 window.addEventListener('load',decorate);
 try{var mo=new MutationObserver(function(){if(!busy)schedule()});(document.body||document.documentElement).appendChild&&mo.observe(document.body||document.documentElement,{childList:true,subtree:true});}catch(e){}
 [300,900,2000].forEach(function(t){setTimeout(decorate,t)});
})();
