/* Sitewide password visibility controls for native Shoptet fields. */
(function(){
 'use strict';
 if(window.__oklaPasswordToggleV1)return;
 window.__oklaPasswordToggleV1=true;

 var EYE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>';
 var EYE_OFF='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 6.1A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17.5 17.5 0 0 1-2.7 3.4M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.5-.7"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

 function setState(input,button,visible){
  input.type=visible?'text':'password';
  button.setAttribute('aria-pressed',visible?'true':'false');
  button.setAttribute('aria-label',visible?'Skrýt heslo':'Zobrazit heslo');
  button.title=visible?'Skrýt heslo':'Zobrazit heslo';
  button.innerHTML=visible?EYE_OFF:EYE;
 }
 function enhance(input){
  if(!input||input.dataset.oklaPasswordToggle==='1')return;
  var host=input.parentElement;if(!host)return;
  input.dataset.oklaPasswordToggle='1';
  input.classList.add('okla-password-input');
  host.classList.add('okla-password-host');
  var button=document.createElement('button');
  button.type='button';button.className='okla-password-toggle';
  setState(input,button,false);
  button.addEventListener('click',function(){
   var start=input.selectionStart,end=input.selectionEnd;
   setState(input,button,input.type==='password');
   input.focus({preventScroll:true});
   try{input.setSelectionRange(start,end)}catch(e){}
  });
  host.appendChild(button);
  var form=input.form;
  if(form)form.addEventListener('submit',function(){if(input.type!=='password')setState(input,button,false)},true);
 }
 function scan(root){
  if(!root)return;
  if(root.matches&&root.matches('input[type="password"]'))enhance(root);
  if(root.querySelectorAll)root.querySelectorAll('input[type="password"]').forEach(enhance);
 }
 function start(){
  scan(document);
  if(window.MutationObserver&&document.body)new MutationObserver(function(records){
   records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1)scan(node)})});
  }).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
