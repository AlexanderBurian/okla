/* OKLA V109: reuse the existing live desktop header as a fixed navigation bar.
   It stays visible in BOTH scroll directions, and returns to the original flow
   only when the visitor is almost at the top. No cloned links or icons. */
(function(){
 'use strict';
 if(window.__oklaDesktopStickyV105)return;
 window.__oklaDesktopStickyV105=true;

 var root=document.documentElement;
 var desktop=window.matchMedia('(min-width:992px)');
 var header=null,spacer=null,active=false,scheduled=false;
 var originalTop=0,originalHeight=80,enterAt=150,exitAt=100;
 var activationLock=false;

 /* The two real login/cart links render artwork in open Shadow Roots.
    Provide a compact style only while sticky, preserving all existing actions. */
 function syncFaces(compact){
  if(!header||!header.isConnected)return;
  var faces=header.querySelectorAll('okla-action-face');
  for(var i=0;i<faces.length;i++){
   var host=faces[i],shadow=host.shadowRoot;
   if(!shadow)continue;
   if(!shadow.querySelector('#okla-v113-sticky-face')){
    var st=document.createElement('style');
    st.id='okla-v113-sticky-face';
    st.textContent=[
     ':host([data-okla-sticky-compact]) .face{height:41px!important;font-size:13px!important;line-height:17px!important;}',
     ':host([data-okla-sticky-compact]) .face>svg.figure{width:32px!important;height:40px!important;}',
     ':host([data-okla-sticky-compact]) .face>svg:not(.figure):not(.arrow){width:18px!important;height:26px!important;}',
     ':host([data-okla-sticky-compact]) .face .label{margin-left:6px!important;}',
     ':host([data-okla-sticky-compact]) .face .arrow{width:17px!important;height:11px!important;margin-left:8px!important;}',
     ':host([data-okla-sticky-compact]) .face .price{font-size:13.5px!important;line-height:18px!important;margin-left:5px!important;}',
     ':host([data-okla-sticky-compact]) .face .count text{font-size:10px!important;}'
    ].join('');
    shadow.appendChild(st);
   }
   if(compact){
    if(!host.hasAttribute('data-okla-sticky-compact'))host.setAttribute('data-okla-sticky-compact','');
   }else if(host.hasAttribute('data-okla-sticky-compact')){
    host.removeAttribute('data-okla-sticky-compact');
   }
  }
 }

 function scrollY(){
  return window.scrollY||window.pageYOffset||root.scrollTop||0;
 }
 function locate(){
  if(header&&header.isConnected&&spacer&&spacer.isConnected)return true;
  root.classList.remove('okla-desktop-sticky');
  active=false;
  header=document.querySelector('#header .header-top');
  if(!header||!header.parentNode)return false;
  spacer=document.createElement('div');
  spacer.className='okla-desktop-sticky-space';
  spacer.setAttribute('aria-hidden','true');
  header.parentNode.insertBefore(spacer,header);
  return true;
 }
 function setGeometry(rect){
  if(!rect||rect.width<=0||rect.height<=0)return;
  // Snap the fixed header to physical pixels to avoid fractional raster blur.
  var scale=Math.max(1,window.devicePixelRatio||1);
  /* The bar sits inside the proportionally zoomed page: measured (screen) px
     are converted to its own CSS px. */
  var z=(header&&header.currentCSSZoom)||window.__oklaDZ||1;
  var snap=function(n){return Math.round(n/z*scale)/scale};
  var x=snap(rect.left),width=snap(rect.width),h=rect.height/z;
  root.style.setProperty('--okla-sticky-left',x+'px');
  root.style.setProperty('--okla-sticky-negative-left',(-x)+'px');
  root.style.setProperty('--okla-sticky-width',width+'px');
  root.style.setProperty('--okla-sticky-height',h.toFixed(2)+'px');
  // Pinned bar: 30% shorter than the natural header, then another 10% lower (V113).
  root.style.setProperty('--okla-sticky-compact-height',Math.max(50,Math.round(h*0.70*0.9))+'px');
  spacer.style.height=h.toFixed(2)+'px';
 }
 function geometry(){
  if(!locate())return;
  // Once pinned, the invisible placeholder retains the original layout's
  // width and location; never use the pinned header's viewport rect.
  var rect=active?spacer.getBoundingClientRect():header.getBoundingClientRect();
  if(rect.width<1)return;
  if(!active)originalHeight=rect.height||originalHeight;
  originalTop=scrollY()+rect.top;
  if(rect.height<1){
   rect={left:rect.left,width:rect.width,height:originalHeight};
  }
  setGeometry(rect);
  enterAt=Math.max(150,originalTop+originalHeight+24);
  exitAt=Math.min(100,enterAt-48);
 }
 function show(){
  if(active||!desktop.matches||!locate())return;
  // Measure the natural grid before it is fixed, preserving its content width.
  geometry();
  if(scrollY()<enterAt)return;
  activationLock=true;
  root.classList.add('okla-desktop-sticky');
  active=true;
  syncFaces(true);
  activationLock=false;
 }
 function hide(){
  if(!active)return;
  root.classList.remove('okla-desktop-sticky');
  active=false;
  syncFaces(false);
  // Keep geometry aligned for the next activation after a resize or font load.
 }
 function update(){
  if(!locate())return;
  if(!desktop.matches){hide();return}
  var y=scrollY();
  // Deliberately independent of scroll direction. Hysteresis prevents
  // flicker at the threshold; once shown it stays until the top region.
  if(active){
   if(y<=exitAt)hide();
  }else if(y>=enterAt)show();
 }
 function tick(){
  scheduled=false;
  if(activationLock)return;
  update();
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(tick);
 }
 function resize(){
  if(!locate())return;
  if(!desktop.matches){hide();return}
  geometry();
  if(active)syncFaces(true);
  schedule();
 }
 function start(){
  if(!locate())return;
  geometry();
  schedule();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('orientationchange',resize,{passive:true});
  window.addEventListener('pageshow',resize);
  if(desktop.addEventListener)desktop.addEventListener('change',resize);
  window.addEventListener('load',resize,{once:true});
  [350,1200,2600].forEach(function(ms){setTimeout(resize,ms)});
  if(window.MutationObserver&&header){
   var faceScheduled=false;
   new MutationObserver(function(changes){
    if(!active||faceScheduled)return;
    for(var i=0;i<changes.length;i++)if(changes[i].addedNodes.length){
     faceScheduled=true;
     requestAnimationFrame(function(){faceScheduled=false;syncFaces(true)});
     break;
    }
   }).observe(header,{childList:true,subtree:true});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();