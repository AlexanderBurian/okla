/* OKLA CTA shape. On top of the blue CTA palette (okla_all_cta_blue.css):
   1. A cart pictogram on the LEFT of every "do košíku / přidat do košíku" button.
   2. Less rounded corners on all commerce CTAs (still slightly rounded).
   Done with inline styles / a prepended inline SVG, so it beats every stylesheet
   rule regardless of specificity and survives the shop's own re-renders. */
(function(){
 'use strict';
 if(window.__oklaCtaShapeV1)return;window.__oklaCtaShapeV1=true;

 var RADIUS='5px',CART_RADIUS='0px';
 /* every commerce call-to-action gets the squarer corner */
 var RADIUS_SEL='.btn-primary,.btn-conversion,.btn-cart,.add-to-cart-button,.okla-green-cta,.okla-m-buybar__btn,.okla-dbb__btn,#okla-cart-drawer .okla-cd__card-btn,#okla-cart-drawer .okla-cd__btn--primary,#okla-cart-preview .okla-cp__go,.next-step-forward,.next-step-finish,.okla-ord-btn--track';
 /* only the real add-to-cart buttons get the cart icon */
 var ICON_SEL='.btn-cart,.add-to-cart-button,.okla-m-buybar__btn,#okla-cart-drawer .okla-cd__card-btn,#okla-cart-drawer .okla-cd__btn--primary';

 /* Only the navy "Otevřít filtr" is recoloured — the OKLA blue, via its own
    button variables (colour only, size/shape untouched). Every other button
    keeps its own colour: green stays green. */
 /* The filter toggle gets a deeper OKLA blue — never the lighter #0074e8. */
 var FILTER_BLUE='#005cbd';
 function filterBlue(){
  document.querySelectorAll('.unveil-button').forEach(function(b){
   /* Drive the button variables … */
   b.style.setProperty('--okla-button-rest-background',FILTER_BLUE,'important');
   b.style.setProperty('--okla-button-rest-border',FILTER_BLUE,'important');
   b.style.setProperty('--okla-button-rest-color','#fff','important');
   /* …and, because the theme paints a navy `background` directly (beating the
      variable) and lightens it on :hover, pin the real colours inline. An inline
      !important beats every stylesheet rule — rest AND hover — so the button is
      one flat deeper blue with no hover change at all. */
   b.style.setProperty('background',FILTER_BLUE,'important');
   b.style.setProperty('background-color',FILTER_BLUE,'important');
   b.style.setProperty('background-image','none','important');
   b.style.setProperty('border-color',FILTER_BLUE,'important');
   b.style.setProperty('color','#fff','important');
   b.style.setProperty('box-shadow','none','important');
   b.style.setProperty('transition','none','important');
   b.style.setProperty('-webkit-tap-highlight-color','transparent','important');
  });
 }

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
   filterBlue();
   /* Login / registration: the submit button matches the 10 px rounding of
      the form fields instead of the squarer commerce corner. */
   var authPage=!!(document.body&&/(^|\s)in-(login|registrace)(\s|$)/.test(document.body.className));
   document.querySelectorAll(RADIUS_SEL).forEach(function(b){
    var radius=(authPage&&b.closest('#content'))?'10px':(b.matches(ICON_SEL)?CART_RADIUS:RADIUS);
    b.style.setProperty('border-radius',radius,'important');
    b.style.setProperty('-webkit-border-radius',radius,'important');
   });
   document.querySelectorAll(ICON_SEL).forEach(function(b){
    var drawerPrimary=!!b.matches('#okla-cart-drawer .okla-cd__btn--primary');
    /* phones: "Pokračovat do košíku" does not fit one line beside the icon - the label alone, centred
       (okla_cart_drawer.css hides the icon there) */
    var phoneDrawer=drawerPrimary&&!!window.matchMedia&&window.matchMedia('(max-width:767px)').matches;
    b.style.setProperty('display',phoneDrawer?'flex':drawerPrimary?'grid':'inline-flex','important');
    b.style.setProperty('align-items','center','important');
    b.style.setProperty('justify-content','center','important');
    if(phoneDrawer){b.style.setProperty('padding-left','12px','important');b.style.setProperty('padding-right','12px','important')}
    else if(drawerPrimary){
     b.style.setProperty('grid-template-columns','18px minmax(0,auto) 18px','important');
     b.style.setProperty('column-gap','8px','important');
     b.style.setProperty('padding-left','10px','important');
     b.style.setProperty('padding-right','10px','important');
    }
    var existing=b.querySelector(':scope > svg.okla-cta-cart');
    if(existing){if(drawerPrimary)existing.style.setProperty('margin','0','important');if(phoneDrawer)existing.style.setProperty('display','none','important');return;} /* already has our icon */
    var svgs=b.querySelectorAll('svg');                            /* hide the shop's own cart glyph */
    for(var i=0;i<svgs.length;i++){if(!svgs[i].classList.contains('okla-cta-cart'))svgs[i].style.setProperty('display','none','important')}
    var cart=cartSvg();if(drawerPrimary)cart.style.setProperty('margin','0','important');if(phoneDrawer)cart.style.setProperty('display','none','important');b.insertBefore(cart,b.firstChild);
   });
   /* Phones: the product "Do košíku" button a touch wider (so the cart icon +
      label sit comfortably) and the whole thing a touch shorter. */
   var mobile=!window.matchMedia||window.matchMedia('(max-width:767px)').matches;
   if(mobile){
    document.querySelectorAll('.product .btn-cart,.product .add-to-cart-button').forEach(function(b){
     b.style.setProperty('width','140px','important');
     b.style.setProperty('max-width','100%','important');
     b.style.setProperty('min-width','0','important');
     b.style.setProperty('height','36px','important');
     b.style.setProperty('min-height','36px','important');
     b.style.setProperty('padding-top','0','important');
     b.style.setProperty('padding-bottom','0','important');
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
