/* OKLA V57 — stable homepage cleanup + neon technology art + cart visual fix */
(function(){
'use strict';if(window.__okla57)return;window.__okla57=true;
var stylesheet=document.createElement('style');stylesheet.id='okla-v57-css';stylesheet.textContent="/* OKLA V57 — welcome gone and proper cart icon */\nbody.type-index #content-wrapper main#content .homepage-box.welcome-wrapper,\nbody.type-index #content-wrapper main#content .welcome-wrapper,\nbody.type-index #content-wrapper main#content .homepage-welcome-wrapper{display:none!important}\n#content #okla-news-v55 .okn-image img{filter:saturate(1.15) contrast(1.065)!important;object-position:center!important;object-fit:cover!important}\n@media(min-width:992px){\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count{\n display:flex!important;align-items:center!important;justify-content:center!important;\n position:relative!important;flex:0 0 46px!important;width:46px!important;min-width:46px!important;max-width:46px!important;\n height:42px!important;min-height:42px!important;max-height:42px!important;margin:0!important;padding:0!important;\n border:0!important;outline-offset:2px!important;background:transparent!important;background-image:none!important;\n box-shadow:none!important;text-shadow:none!important;filter:none!important;transform:none!important;vertical-align:middle!important;\n overflow:visible!important;text-decoration:none!important;cursor:pointer!important;line-height:0!important;\n}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count::before,\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count::after{content:none!important;display:none!important}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count>*:not(.okla-cart-symbol){display:none!important}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count>.okla-cart-symbol{\n all:unset!important;display:grid!important;place-items:center!important;\n flex:0 0 26px!important;width:26px!important;height:26px!important;min-width:26px!important;max-width:26px!important;\n min-height:26px!important;max-height:26px!important;margin:0!important;padding:0!important;position:static!important;box-shadow:none!important;\n}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count>.okla-cart-symbol>svg{\n display:block!important;flex:none!important;width:26px!important;height:26px!important;min-width:26px!important;max-width:26px!important;\n stroke:#123b72!important;stroke-width:1.8!important;stroke-linejoin:round!important;stroke-linecap:round!important;\n fill:none!important;margin:0!important;transform:none!important;filter:none!important;opacity:1!important;\n}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count>.okla-cart-symbol>svg path,\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count>.okla-cart-symbol>svg circle{\n fill:none!important;stroke:#123b72!important;stroke-width:1.8!important;stroke-linejoin:round!important;stroke-linecap:round!important;\n}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>a.cart-count:focus-visible{outline:2px solid #1672b7!important}\nbody #header .header-top>.navigation-buttons.okla-header-ready .okla-exact-header>.okla-exact-separator{\n display:block!important;width:1px!important;min-width:1px!important;max-width:1px!important;flex:0 0 1px!important;height:26px!important;\n min-height:26px!important;max-height:26px!important;border:0!important;background:#d3d8e0!important;box-shadow:none!important;\n}\n}";
(document.head||document.documentElement).appendChild(stylesheet);
var images=["https://images.pexels.com/photos/8108726/pexels-photo-8108726.jpeg?auto=compress&w=1260&h=750&dpr=1","https://images.pexels.com/photos/28374509/pexels-photo-28374509.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200","https://images.pexels.com/photos/8022861/pexels-photo-8022861.jpeg?auto=compress&w=1260&h=750&dpr=1","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1300&q=90","https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1300&q=90"], fallback=["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1300&q=85","https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1300&q=85"];
function svgCart(){
var ns='http://www.w3.org/2000/svg';
var svg=document.createElementNS(ns,'svg');
svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('okla-header-lineicon');
var p=document.createElementNS(ns,'path');p.setAttribute('d','M2.8 4.2h2.4l2.2 10.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 8H6');svg.appendChild(p);
[10,18].forEach(function(x){var c=document.createElementNS(ns,'circle');c.setAttribute('cx',x);c.setAttribute('cy','20');c.setAttribute('r','1.2');svg.appendChild(c)});return svg;
}
function fixCart(){
var row=document.querySelector('#header .header-top .navigation-buttons .okla-exact-header');
if(!row)return;
var cart=row.querySelector('a.cart-count');if(!cart)return;
var symbol=cart.querySelector('.okla-cart-symbol');
if(!symbol){symbol=document.createElement('span');symbol.className='okla-cart-symbol';symbol.setAttribute('aria-hidden','true');cart.prepend(symbol)}
if(symbol.dataset.oklaIconVersion!=='57'){symbol.replaceChildren(svgCart());symbol.dataset.oklaIconVersion='57'}
cart.setAttribute('aria-label','Nákupní košík');cart.setAttribute('title','Nákupní košík');
}
function cleanWelcome(){
if(location.pathname!=='/'&&location.pathname!=='')return;
var main=document.querySelector('main#content')||document.querySelector('#content');if(!main)return;
main.querySelectorAll('.homepage-box.welcome-wrapper,.welcome-wrapper,.welcome-text,.homepage-welcome-wrapper,.homepage-box').forEach(function(node){
if(node.closest('#okla-news-v55'))return;
if(node.classList.contains('welcome-wrapper')||/Vítejte v našem obchodě|Vítáme Vás ve zkušební verzi služby Shoptet/i.test(node.textContent||''))node.remove()
});
}
function fixImages(){
var cards=document.querySelectorAll('#okla-news-v55 .okn-card');if(cards.length<5)return;
Array.from(cards).slice(0,5).forEach(function(card,i){
var img=card.querySelector('.okn-image img');if(!img||img.dataset.oklaImg==='57')return;
img.dataset.oklaImg='57';img.onerror=function(){this.onerror=null;this.src=fallback[i]};img.src=images[i];
})
}
function apply(){cleanWelcome();fixImages();fixCart()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('load',apply,{once:true});window.addEventListener('resize',fixCart,{passive:true});
setTimeout(apply,200);setTimeout(apply,750);setTimeout(apply,1700);
})();