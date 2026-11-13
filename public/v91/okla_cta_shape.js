/* OKLA CTA shape. On top of the blue CTA palette (okla_all_cta_blue.css):
   1. A cart pictogram on the LEFT of every "do košíku / přidat do košíku" button.
   2. One corner rounding (RADIUS) on every button of the shop - commerce CTAs, form submits, page CTAs.
   Done with inline styles / a prepended inline SVG, so it beats every stylesheet
   rule regardless of specificity and survives the shop's own re-renders. */
(function(){
 'use strict';
 if(window.__oklaCtaShapeV1)return;window.__oklaCtaShapeV1=true;

 var RADIUS='8px';
 /* The "Do košíku" in product previews (listing / carousel cards, the cart drawer's suggestions) is styled entirely
    in CSS (okla_product_commerce.css: square corners, no icon, a fixed size), so this script leaves it alone - setting
    its size or adding an icon after load is what made it jump in width. */
 var CARD_SEL='.product .p-tools .btn-cart,.product .p-tools .add-to-cart-button,#okla-cart-drawer .okla-cd__card-btn';
 function isCard(b){return b.matches(CARD_SEL)&&!b.closest('#product-detail-form')}
 /* every button gets the same corner */
 var RADIUS_SEL='.btn-primary,.btn-conversion,.btn-cart,.add-to-cart-button,.okla-green-cta,.okla-m-buybar__btn,.okla-dbb__btn,#okla-cart-drawer .okla-cd__card-btn,#okla-cart-drawer .okla-cd__btn--primary,#okla-cart-preview .okla-cp__go,.next-step-forward,.next-step-finish,.okla-ord-btn--track,.btn:not(.okla-hsearch__btn),.okla-hero__cta,.okla-warranty-button,.okn-button,.okla-promo-btn,.oka-c-btn,.ohb-btn,.okla-social-btn,.okla-os-lookup__btn,.okla-rk__submit,#okla-cart-drawer .okla-cd__btn,.loadMore__button,.okla-lang-pill';
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
   document.querySelectorAll(RADIUS_SEL).forEach(function(b){
    if(isCard(b)||b.closest('#okla-v61-bottom,#okla-v61-drawer .okm61-drawer-close'))return;
    b.style.setProperty('border-radius',RADIUS,'important');
    b.style.setProperty('-webkit-border-radius',RADIUS,'important');
   });
   document.querySelectorAll(ICON_SEL).forEach(function(b){
    if(isCard(b))return;
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
  }catch(e){}
  busy=false;
 }
 function schedule(){requestAnimationFrame(decorate)}

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
 window.addEventListener('load',decorate);
 try{var mo=new MutationObserver(function(){if(!busy)schedule()});(document.body||document.documentElement).appendChild&&mo.observe(document.body||document.documentElement,{childList:true,subtree:true});}catch(e){}
 [300,900,2000].forEach(function(t){setTimeout(decorate,t)});
})();
