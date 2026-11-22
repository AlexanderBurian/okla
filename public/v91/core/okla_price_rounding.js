/* Okla – prices in whole crowns. A registered customer's 5 % discount gives prices with haléře ("2 460,50 Kč",
   "369,55 Kč"); everywhere on the storefront - product cards, sliders, search, the product page, "Doporučujeme přidat
   k nákupu", the cart drawer - they are shown rounded to the nearest whole crown (from 50 haléřů up: 2 460,50 -> 2 461 Kč,
   369,55 -> 370 Kč, 559,45 -> 559 Kč). The thousands space and the "Kč" or ",-" after the number stay as they were.
   Runs before the page is shown and again on whatever is added or changed later.
   The cart page and the order steps keep Shoptet's own amounts: they are what the order charges, and they become whole
   crowns too once rounding to whole crowns is set in Shoptet. */
(function(){
 'use strict';
 if(window.__oklaPriceRounding)return;window.__oklaPriceRounding=true;
 /* 2 460,50 Kč | 369,55 Kč | 844,55,- | 1 089,5 Kč */
 var PRICE=/(\d{1,3}(?:[   ]\d{3})+|\d+),(\d{1,2})(?=[   ]*(?:Kč|,-|CZK))/g;
 function skipPage(){return !!(document.body&&document.body.classList.contains('ordering-process'))}
 function round(text){
  return text.replace(PRICE,function(all,whole,dec){
   var sep=(whole.match(/[   ]/)||[' '])[0];
   var n=Math.round(parseFloat(whole.replace(/[   ]/g,'')+'.'+dec));
   return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,sep);
  });
 }
 function fixNode(t){
  var v=t.nodeValue;if(!v||!/\d,\d/.test(v))return;
  var p=t.parentElement;if(!p||p.closest('script,style,textarea,input,[contenteditable]'))return;
  var r=round(v);if(r!==v)t.nodeValue=r;
 }
 function sweep(root){
  if(!root)return;
  if(root.nodeType===3){fixNode(root);return}
  if(root.nodeType!==1)return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return /\d,\d/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  var list=[],n;while((n=w.nextNode()))list.push(n);
  list.forEach(fixNode);
 }
 window.oklaRoundPrice=round;
 function start(){
  if(skipPage())return;
  sweep(document.body);
  if(!window.MutationObserver)return;
  var queue=[],pending=false;
  new MutationObserver(function(ms){
   ms.forEach(function(m){if(m.type==='characterData')queue.push(m.target);else m.addedNodes.forEach(function(x){queue.push(x)})});
   if(pending||!queue.length)return;pending=true;
   requestAnimationFrame(function(){pending=false;var q=queue;queue=[];q.forEach(function(x){if(x.isConnected)sweep(x)})});
  }).observe(document.body,{childList:true,subtree:true,characterData:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
