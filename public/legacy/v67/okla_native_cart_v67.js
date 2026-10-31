/* OKLA V67 – recover native Shoptet cart controls from inside constrained price panel.
   Nodes are moved, not cloned: Shoptet form listeners and native product actions remain intact. */
(function(){
'use strict';
if(window.__oklaV67)return;window.__oklaV67=true;
const mobile=window.matchMedia('(max-width:767px)');
let observer=null,scheduled=false;
function restoreNativeCart(){
 if(!mobile.matches)return;
 let fixed=0;
 document.querySelectorAll('main#content .okla-slider-shell .product .p-bottom').forEach(bottom=>{
  const prices=bottom.querySelector('.prices');
  if(!prices)return;
  const nested=prices.querySelector(':scope > .p-tools');
  if(nested){
    prices.after(nested); /* move the original DOM subtree with existing Shoptet form and listeners */
    fixed++;
  }
  const tools=bottom.querySelector(':scope > .p-tools');
  if(tools){
    tools.style.setProperty('position','static','important');
    tools.style.setProperty('float','none','important');
    tools.style.setProperty('width','100%','important');
    tools.style.setProperty('max-width','100%','important');
    tools.style.setProperty('transform','none','important');
    tools.style.setProperty('display','flex','important');
    tools.style.setProperty('visibility','visible','important');
    tools.style.setProperty('opacity','1','important');
  }
 });
 window.__oklaV67Moved=(window.__oklaV67Moved||0)+fixed;
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;restoreNativeCart()})}
function ready(){
 restoreNativeCart();
 if(!observer){const root=document.querySelector('main#content');if(root){observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true})}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
window.addEventListener('load',ready,{once:true});
window.addEventListener('resize',schedule,{passive:true});
setTimeout(ready,350);setTimeout(ready,1100);
window.oklaMobileV67Inspect=function(){
const d=window.oklaMobileV66Inspect?.()||{};
d.nativeCartMoved=window.__oklaV67Moved||0;
d.cartInPrices=document.querySelectorAll('main#content .okla-slider-shell .prices > .p-tools').length;
d.nativeCartInBottom=document.querySelectorAll('main#content .okla-slider-shell .p-bottom > .p-tools').length;
return d;
};
})();