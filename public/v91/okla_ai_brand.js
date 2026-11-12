/* OKLA AI widget branding bridge. The deployed widget has its own multilingual
   shadow DOM, so branding is changed without replacing that newer runtime. */
(function(){
'use strict';
if(window.__oklaAiBrandV91)return;
window.__oklaAiBrandV91=true;
var base=window.__oklaAssetBase||'';
var logo=base+'ai/v1/assets/okla-brand-logo.png';
var avatar=base+'ai/v1/assets/okla-assistant-avatar.png';

function patch(host){
 var root=host&&host.shadowRoot;
 if(!root||root.querySelector('style[data-okla-brand-patch]'))return false;
 var style=document.createElement('style');
 style.setAttribute('data-okla-brand-patch','');
 style.textContent=''
  +'.brand-mini{display:block!important;width:116px!important;height:30px!important;background:transparent!important}'
  +'.brand-mini img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important}'
  +'.welcome-brand,.welcome-title{display:none!important}'
  +'.welcome{justify-content:center!important;padding-top:30px!important}'
  +'.welcome-input{margin-top:0!important}'
  +'.assistant-avatar{overflow:visible!important;border-radius:0!important;background:transparent!important}'
  +'.assistant-avatar img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important}'
  +'textarea{font-size:16px!important}';
 root.appendChild(style);

 function apply(){
  var brand=root.querySelector('.brand-mini img');
  if(brand&&brand.getAttribute('src')!==logo){brand.src=logo;brand.removeAttribute('hidden')}
  var welcome=root.querySelector('.welcome');
  if(welcome){welcome.removeAttribute('aria-labelledby');welcome.setAttribute('aria-label','OKLA.cz')}
  root.querySelectorAll('.welcome-brand,.welcome-title').forEach(function(node){node.remove()});
  root.querySelectorAll('.assistant-avatar img').forEach(function(img){
   if(img.getAttribute('src')!==avatar){img.src=avatar;img.removeAttribute('hidden')}
  });
 }
 apply();
 new MutationObserver(apply).observe(root,{childList:true,subtree:true});
 return true;
}

function scan(){
 var host=document.querySelector('okla-ai-chat');
 return patch(host);
}
if(!scan()&&window.MutationObserver){
 var observer=new MutationObserver(function(){if(scan())observer.disconnect()});
 observer.observe(document.documentElement,{childList:true,subtree:true});
}
})();

/* The chat button steps aside (an open chat stays open):
   - on the homepage until the visitor has scrolled a little (once shown, it stays);
   - while search, the Katalog / Menu panel, the added-to-cart panel, the login popup or the hover cart is open. */
(function(){
 if(window.__oklaAiAwayV1)return;window.__oklaAiAwayV1=true;
 var root=document.documentElement,isHome=!!(document.body&&document.body.classList.contains('type-index')),scrolledOnce=!isHome;
 var CSS=':host(.okla-ai-away) .panel:not(.open)+.launcher{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .16s ease,visibility 0s linear .16s!important}';
 function overlayOpen(){
  var b=document.body;
  if(root.classList.contains('okla-m-lock')||root.classList.contains('okla-search-open')||root.classList.contains('okla-cd-lock'))return true;
  if(b&&(b.classList.contains('okla-v61-locked')||b.classList.contains('login-window-visible')))return true;
  var cp=document.getElementById('okla-cart-preview');if(cp&&cp.classList.contains('is-open'))return true;
  return false;
 }
 function update(){
  var host=document.querySelector('okla-ai-chat');if(!host)return;
  var sr=host.shadowRoot;
  if(sr&&!sr.querySelector('style[data-okla-ai-away]')){var st=document.createElement('style');st.setAttribute('data-okla-ai-away','');st.textContent=CSS;sr.appendChild(st)}
  if(!scrolledOnce&&window.scrollY>=Math.min(520,Math.max(320,window.innerHeight*.55)))scrolledOnce=true;
  host.classList.toggle('okla-ai-away',!scrolledOnce||overlayOpen());
 }
 var queued=false;function soon(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;update()})}
 window.addEventListener('scroll',soon,{passive:true});
 new MutationObserver(soon).observe(root,{attributes:true,attributeFilter:['class']});
 function watchBody(){if(document.body)new MutationObserver(soon).observe(document.body,{attributes:true,attributeFilter:['class'],childList:true})}
 if(document.body)watchBody();else document.addEventListener('DOMContentLoaded',watchBody,{once:true});
 document.addEventListener('click',function(){setTimeout(soon,0)},true);
 var cpWatched=false;
 setInterval(function(){
  var cp=document.getElementById('okla-cart-preview');
  if(cp&&!cpWatched){cpWatched=true;new MutationObserver(soon).observe(cp,{attributes:true,attributeFilter:['class']})}
 },1000);
 update();
})();
