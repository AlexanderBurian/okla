/* Okla – prices in whole crowns. A registered customer's percentage discount can make Shoptet render halere
   ("2 460,50 Kc", "559,55 Kc"). Every displayed amount, including cart rows and dynamically inserted product
   recommendations, is rounded to the nearest whole crown. This changes text only; native prices and values
   submitted to Shoptet stay untouched. */
(function(){
 'use strict';
 if(window.__oklaPriceRounding)return;window.__oklaPriceRounding=true;
 /* 2 460,50 Kč | 559,55 Kč | 844,55,- | 1 089,5 CZK */
 var PRICE=/(\d{1,3}(?:[   ]\d{3})+|\d+),(\d{1,2})(?=[   ]*(?:Kč|,-|CZK))/g;
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
