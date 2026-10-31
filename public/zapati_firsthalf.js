/* OKLA V86 single bootstrap. Host on Cloudflare Pages public/ root, or GitHub CDN.
   Replace previous loader; NEVER install duplicate OKLA bootstrap tags. */
(function(){
'use strict';
if(window.__oklaCompleteV71)return;
window.__oklaCompleteV71=true;
var current=document.currentScript;
var base=current&&current.src?current.src.split(/[?#]/)[0].replace(/[^/]*$/,''):'';
if(!base){console.error('[OKLA] Use an external script URL.');return}
window.__oklaAssetsBase=base;
var steps=["legacy/v53/zapati_firsthalf.js","legacy/v55/okla_news_v55.js","legacy/v57/okla_patch_v57.js",{"file":"legacy/v61/okla_mobile_v61.css","media":"(max-width:767px)"},"legacy/v61/okla_mobile_v61.js","legacy/v62/okla_recovery_v62.js","legacy/v65/okla_mobile_v65.js","legacy/v66/okla_mobile_v66.js","legacy/v67/okla_native_cart_v67.js","legacy/v69/okla_mobile_v69.js","okla_mobile_v71.js","okla_mobile_v72.js","okla_mobile_v73.js","okla_mobile_v74.js","okla_mobile_v75.js","okla_mobile_v76.js","okla_mobile_v77.js","okla_desktop_v78.js","okla_desktop_v79.js","okla_desktop_v80.js","okla_desktop_v81.js","okla_v86_catalog.js",{"file":"okla_detail_v86.css"},"okla_detail_v86.js"];
var pos=0;
function next(){
if(pos===steps.length){window.__oklaAssetLoaderStatus='loaded';return}
var entry=steps[pos++],path=typeof entry==='string'?entry:entry.file,url=base+path;
if(/\.css(?:[?#]|$)/.test(path)){
 var l=document.createElement('link');l.rel='stylesheet';l.href=url;
 if(entry.media)l.media=entry.media;
 l.onload=next;l.onerror=function(){console.error('[OKLA] CSS unavailable:',url);next()};
 (document.head||document.documentElement).appendChild(l);
}else{
 var j=document.createElement('script');j.src=url;j.async=false;
 j.onload=next;j.onerror=function(){console.error('[OKLA] JS unavailable:',url);next()};
 (document.head||document.documentElement).appendChild(j);
}
}
window.__oklaAssetLoaderStatus='loading';
next();
})();