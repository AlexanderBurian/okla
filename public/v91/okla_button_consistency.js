/* OKLA V127 – retain each button's resting colours and classify its fill.
   The last CSS layer can then darken filled actions very slightly and softly
   tint empty actions without inheriting unrelated legacy hover colours. */
(function(){
 'use strict';
 if(window.__oklaButtonConsistencyV127)return;
 window.__oklaButtonConsistencyV127=true;

 var selector='button,input[type="button"],input[type="submit"],input[type="reset"],.btn,a.btn,.button,a.button,[role="button"]';

 /* A genuinely green fill (bright or medium green, not turquoise/grey/blue). */
 function isGreen(value){
  var n=(value||'').match(/[0-9.]+/g);
  if(!n||n.length<3)return false;
  var r=+n[0],g=+n[1],b=+n[2];
  return g>=110&&g>r*1.23&&g>b*1.36&&r<180&&b<125;
 }
 /* Buttons that must adopt the OKLA blue even though their base colour is not
    green (e.g. the dark-navy "Otevřít filtr"). */
 function forceBlue(button){
  try{return button.matches('.unveil-button,.filter-toggle,.js-filter-toggle')}catch(e){return false}
 }

 function isFilled(value){
  var numbers=(value.match(/[\d.]+/g)||[]).map(Number);
  if(numbers.length<3)return false;
  var alpha=numbers.length>3?numbers[3]:1;
  if(alpha<.15)return false;
  return !(numbers[0]>242&&numbers[1]>242&&numbers[2]>242);
 }

 /* Which buttons need their resting colours read. A cross-sell row is a compound product picker that only exposes
    role="button" for keyboard activation. It is not a visual button and must never receive the global empty-button
    hover class: its marks are cleared here instead. */
 function wants(button,force){
  if(!button||button.nodeType!==1||!button.matches(selector))return false;
  if(button.classList.contains('okla-xsell__item')){
   button.classList.remove('okla-button--filled','okla-button--empty');
   button.removeAttribute('data-okla-button-rest');
   button.style.removeProperty('--okla-button-rest-background');
   button.style.removeProperty('--okla-button-rest-image');
   button.style.removeProperty('--okla-button-rest-border');
   button.style.removeProperty('--okla-button-rest-color');
   return false;
  }
  return !(button.dataset.oklaButtonRest==='1'&&!force);
 }

 function apply(button,style){
  var bg=style.bg,img=style.img,bd=style.bd,col=style.col;
  /* Only the navy filter button ("Otevřít filtr") becomes the OKLA blue; every
     other button keeps its own resting colour (green stays green). Use the deeper
     #005cbd (rgb 0,92,189) — the lighter #0074e8 read as "light blue". */
  if(forceBlue(button)){
   bg='rgb(0,92,189)';bd='rgb(0,92,189)';img='none';col='rgb(255,255,255)';
  }
  button.style.setProperty('--okla-button-rest-background',bg);
  button.style.setProperty('--okla-button-rest-image',img);
  button.style.setProperty('--okla-button-rest-border',bd);
  button.style.setProperty('--okla-button-rest-color',col);
  var filled=isFilled(bg)||img!=='none';
  button.classList.toggle('okla-button--filled',filled);
  button.classList.toggle('okla-button--empty',!filled);
  /* Green buttons share one hover colour (see okla_button_consistency.css). */
  button.classList.toggle('okla-button--green',filled&&!forceBlue(button)&&isGreen(bg));
  button.dataset.oklaButtonRest='1';
 }

 /* Reads all resting colours of a round at once, then writes them, so the page's styles are recomputed once per round
    instead of once per button. A button's marks can only affect buttons nested inside it, so a nested button is read
    in a later round, after its outer button - the same values the one-by-one pass read. */
 function process(list){
  var waiting=new Set(list);
  while(list.length){
   var round=[],rest=[];
   for(var i=0;i<list.length;i++){
    var b=list[i],p=b.parentElement,blocked=false;
    while(p){if(waiting.has(p)){blocked=true;break;}p=p.parentElement;}
    (blocked?rest:round).push(b);
   }
   var styles=round.map(function(b){var cs=getComputedStyle(b);return {bg:cs.backgroundColor,img:cs.backgroundImage,bd:cs.borderColor,col:cs.color}});
   for(var k=0;k<round.length;k++){waiting.delete(round[k]);apply(round[k],styles[k])}
   list=rest;
  }
 }

 function collect(root,force,out,seen){
  if(!root)return;
  if(root.nodeType===1&&!seen.has(root)){seen.add(root);if(wants(root,force))out.push(root)}
  if(root.querySelectorAll)root.querySelectorAll(selector).forEach(function(button){if(seen.has(button))return;seen.add(button);if(wants(button,force))out.push(button)});
 }

 function scan(root,force){var out=[];collect(root,force,out,new Set());process(out)}

 function start(){
  scan(document,false);
  if(window.MutationObserver&&document.body){
   new MutationObserver(function(records){
    var out=[],seen=new Set();
    records.forEach(function(record){record.addedNodes.forEach(function(node){collect(node,false,out,seen)})});
    process(out);
   }).observe(document.body,{childList:true,subtree:true});
  }
  window.addEventListener('load',function(){scan(document,true)},{once:true});
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
