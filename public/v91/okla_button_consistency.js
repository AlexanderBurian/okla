/* OKLA V126 – retain each button's resting colours on hover.
   Shoptet and older modules use many unrelated hover fills; snapshotting the
   final computed resting state lets the last CSS layer add only an outline. */
(function(){
 'use strict';
 if(window.__oklaButtonConsistencyV126)return;
 window.__oklaButtonConsistencyV126=true;

 var selector='button,input[type="button"],input[type="submit"],input[type="reset"],.btn,a.btn,.button,a.button,[role="button"]';

 function remember(button,force){
  if(!button||button.nodeType!==1||!button.matches(selector))return;
  if(button.dataset.oklaButtonRest==='1'&&!force)return;
  var style=getComputedStyle(button);
  button.style.setProperty('--okla-button-rest-background',style.backgroundColor);
  button.style.setProperty('--okla-button-rest-image',style.backgroundImage);
  button.style.setProperty('--okla-button-rest-border',style.borderColor);
  button.style.setProperty('--okla-button-rest-color',style.color);
  button.dataset.oklaButtonRest='1';
 }

 function scan(root,force){
  if(!root)return;
  if(root.nodeType===1)remember(root,force);
  if(root.querySelectorAll)root.querySelectorAll(selector).forEach(function(button){remember(button,force)});
 }

 function start(){
  scan(document,false);
  if(window.MutationObserver&&document.body){
   new MutationObserver(function(records){
    records.forEach(function(record){record.addedNodes.forEach(function(node){scan(node,false)})});
   }).observe(document.body,{childList:true,subtree:true});
  }
  window.addEventListener('load',function(){scan(document,true)},{once:true});
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
