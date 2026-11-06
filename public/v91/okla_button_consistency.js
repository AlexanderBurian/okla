/* OKLA V127 – retain each button's resting colours and classify its fill.
   The last CSS layer can then darken filled actions very slightly and softly
   tint empty actions without inheriting unrelated legacy hover colours. */
(function(){
 'use strict';
 if(window.__oklaButtonConsistencyV127)return;
 window.__oklaButtonConsistencyV127=true;

 var selector='button,input[type="button"],input[type="submit"],input[type="reset"],.btn,a.btn,.button,a.button,[role="button"]';

 function isFilled(value){
  var numbers=(value.match(/[\d.]+/g)||[]).map(Number);
  if(numbers.length<3)return false;
  var alpha=numbers.length>3?numbers[3]:1;
  if(alpha<.15)return false;
  return !(numbers[0]>242&&numbers[1]>242&&numbers[2]>242);
 }

 function remember(button,force){
  if(!button||button.nodeType!==1||!button.matches(selector))return;
  if(button.dataset.oklaButtonRest==='1'&&!force)return;
  var style=getComputedStyle(button);
  button.style.setProperty('--okla-button-rest-background',style.backgroundColor);
  button.style.setProperty('--okla-button-rest-image',style.backgroundImage);
  button.style.setProperty('--okla-button-rest-border',style.borderColor);
  button.style.setProperty('--okla-button-rest-color',style.color);
  var filled=isFilled(style.backgroundColor)||style.backgroundImage!=='none';
  button.classList.toggle('okla-button--filled',filled);
  button.classList.toggle('okla-button--empty',!filled);
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
