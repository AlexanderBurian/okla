/* OKLA – prints the Shoptet header tag (HTML kód > záhlaví) for a released commit.

   Usage:  node tools/head_tag.js <full commit sha>

   The tag puts the storefront's look straight into the page's <head>, like any web site: one <link rel="stylesheet">
   per bundle in the bundle table's order (written by a tiny inline script, so they are ordinary render-blocking
   stylesheets of the page). Bundles for every kind of page ("all") are on; the others (product, home, checkout, ...)
   are downloaded too but switched off (media="not all") until the loader switches on the ones of this page - in place,
   so the cascade order never changes. The scripts of the "all" bundles are preloaded (as the CORS fetch the loader reads them with), so on a first visit they download
   together with the HTML instead of after the loader. Then the curtain, the Twitter widget switch-off (its share
   buttons are hidden; OKLA's own share links are used) and the loader itself. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const sha=process.argv[2];
if(!/^[0-9a-f]{40}$/.test(sha||'')){console.error('usage: node tools/head_tag.js <full 40-character commit sha>');process.exit(1)}
const src=fs.readFileSync(path.join(__dirname,'..','public','zapati_firsthalf.js'),'utf8');
const a=src.indexOf('/*@bundles*/'),b=src.indexOf('/*@end*/');
const box={};vm.createContext(box);vm.runInContext(src.slice(a,b)+'\nthis.BUNDLES=BUNDLES;',box);
const css=[],js=[],home=[];
for(const [name,kind,files] of box.BUNDLES){
 const on=kind==='all'&&name!=='99-later';
 if(files.some(f=>f.endsWith('.css')))css.push((on?'':'-')+name);
 if(on&&files.some(f=>!f.endsWith('.css')))js.push(name);
 if(kind==='home'&&files.some(f=>!f.endsWith('.css')))home.push(name);
}
const base='https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@'+sha+'/public/';
const writer="<script>(function(b,c,j,h){var H=location.pathname=='/';if(H){j=j.concat(h);"+
 /* the homepage: its scripts and the first banner's two pictures (the largest thing on a phone's first screen) start
    with the HTML instead of after the loader and the banner script */
 "['v91/assets/storewide-bg.webp','v91/img/promo/storewide-gift.webp'].forEach(function(i){document.write('<link rel=\"preload\" as=\"image\" fetchpriority=\"high\" href=\"'+b+i+'\">')})}"+
 "var w='';c.forEach(function(n){var off=n.charAt(0)=='-';if(off)n=n.slice(1);if(off&&H&&h.indexOf(n)>-1)off=false;"+
 "w+='<link rel=\"stylesheet\" crossorigin=\"anonymous\" data-okla-b=\"'+n+'\" href=\"'+b+'dist/'+n+'.css?v=91\"'+(off?' media=\"not all\"':'')+"+
 "' onload=\"this.setAttribute(\\'data-okla-l\\',1)\" onerror=\"this.setAttribute(\\'data-okla-e\\',1)\">'});"+
 "j.forEach(function(n){w+='<link rel=\"preload\" as=\"fetch\" crossorigin=\"anonymous\" href=\"'+b+'dist/'+n+'.js?v=91\">'});document.write(w)})"+
 "('"+base+"',"+JSON.stringify(css).replace(/"/g,"'")+","+JSON.stringify(js).replace(/"/g,"'")+","+JSON.stringify(home).replace(/"/g,"'")+")</script>";
const tag=[
 '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
 '<style id="okla-curtain">html:not(.okla-ready) body{opacity:0}</style>',
 "<script>setTimeout(function(){document.documentElement.classList.add('okla-ready')},2500)</script>",
 writer,
 "<script>window.twttr={_e:[],ready:function(){},widgets:{load:function(){}}}</script><meta id=\"twitter-wjs\">",
 '<script async src="'+base+'zapati_firsthalf.js?v=ai-'+sha.slice(0,7)+'" data-api-url="https://okla-chatpot.onrender.com"></script>'
].join('\n');
console.log(tag);
