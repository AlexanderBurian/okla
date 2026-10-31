/* OKLA V57 — stable homepage cleanup + neon technology art + cart visual fix */
(function(){
'use strict';if(window.__okla57)return;window.__okla57=true;

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