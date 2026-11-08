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
  +'.assistant-avatar{overflow:hidden!important;border-radius:50%!important}'
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
