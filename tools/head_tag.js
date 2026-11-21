/* Okla – prints the Shoptet header tag (HTML kód > záhlaví) for a released commit.

   Usage:  node tools/head_tag.js <full commit sha>

   The tag puts the storefront's look straight into the page's <head>, like any web site: one <link rel="stylesheet">
   per bundle in the bundle table's order (written by a tiny inline script, so they are ordinary render-blocking
   stylesheets of the page). Bundles for every kind of page ("all") are on. The others are written too, in their place in
   the order, so the cascade never changes:
   - those this address can be (e.g. product and category for an ordinary address) are downloaded but switched off
     (media="not all") until the loader switches on the ones of this page;
   - those it cannot be (the checkout on a product page, the account on the homepage...) are written disabled: the
     browser does not download them at all (the loader would still switch one on if the page turned out to need it).
   The site font and the scripts of the "all" bundles are preloaded, so on a first visit they download together with
   the HTML instead of after the loader. Then the curtain (it waits for the loader, which lifts it when the page is
   finished; 7 s at most if the loader never comes), the Twitter widget switch-off (its share buttons are hidden; Okla's
   own share links are used) and the loader itself, at high priority. */
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
 /* [name, kind]: "all" is on, "later" is the deferred bundle (downloaded, off), the rest by the kind of page */
 if(files.some(f=>f.endsWith('.css')))css.push([name,on?'all':(name==='99-later'?'later':kind)]);
 if(on&&files.some(f=>!f.endsWith('.css')))js.push(name);
 if(kind==='home'&&files.some(f=>!f.endsWith('.css')))home.push(name);
}
const base='https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@'+sha+'/public/';
const FONT='https://cdn.jsdelivr.net/npm/@fontsource-variable/open-sans@5.2.7/files/open-sans-';
/* Which kinds of page an address can be (the loader decides for sure from the page itself). An ordinary address is a
   product, a category, the 404 page or an account page; the others have addresses of their own. */
const kinds=
 "function K(p){"+
 "if(p=='/')return'home';"+
 "if(/^\\/objednavka\\/dekujeme/.test(p))return'checkout thankYou';"+
 "if(/^\\/(kosik|objednavka)(\\/|$)/.test(p))return'checkout';"+
 "if(/^\\/nase-novinky\\/[^/]+/.test(p))return'article';"+
 "if(/^\\/(newsroom|nase-novinky)(\\/|$)/.test(p))return'newsroom';"+
 "if(/^\\/stav-objednavky/.test(p))return'orderStatus account signIn';"+
 "if(/^\\/reklamace/.test(p))return'complaint';"+
 "if(/^\\/o-nas/.test(p))return'about';"+
 "if(/^\\/jak-nakupovat/.test(p))return'howToBuy';"+
 "if(/^\\/kontakt/.test(p))return'contact';"+
 "if(/^\\/(obchodni-podminky|podminky-ochrany-osobnich-udaju|reklamacni-rad|vraceni-zbozi-a-odstoupeni|podminky-reklamnich-akci|prohlaseni-o-pristupnosti|doprava-a-platba)/.test(p))return'legal';"+
 "return'product category notFound account signIn orders orderStatus'}";
const writer="<script>(function(b,c,j,h){"+kinds+"var p=location.pathname,H=p=='/',k=' '+K(p)+' ';if(H){j=j.concat(h);"+
 /* the homepage: its scripts and the first banner's two pictures (the largest thing on a phone's first screen) start
    with the HTML instead of after the loader and the banner script */
 "['v91/assets/storewide-bg.webp','v91/img/promo/storewide-gift.webp'].forEach(function(i){document.write('<link rel=\"preload\" as=\"image\" fetchpriority=\"high\" href=\"'+b+i+'\">')})}"+
 "var w='';c.forEach(function(x){var n=x[0],t=x[1],m='';"+
 "if(t!='all'){m=(t=='later'||k.indexOf(' '+t+' ')>-1)?' media=\"not all\"':' media=\"not all\" disabled';if(H&&h.indexOf(n)>-1)m=''}"+
 "w+='<link rel=\"stylesheet\" crossorigin=\"anonymous\" data-okla-b=\"'+n+'\" href=\"'+b+'dist/'+n+'.css?v=91\"'+m+"+
 "' onload=\"this.setAttribute(\\'data-okla-l\\',1)\" onerror=\"this.setAttribute(\\'data-okla-e\\',1)\">'});"+
 "j.forEach(function(n){w+='<link rel=\"preload\" as=\"fetch\" crossorigin=\"anonymous\" href=\"'+b+'dist/'+n+'.js?v=91\">'});document.write(w)})"+
 "('"+base+"',"+JSON.stringify(css).replace(/"/g,"'")+","+JSON.stringify(js).replace(/"/g,"'")+","+JSON.stringify(home).replace(/"/g,"'")+")</script>";
const tag=[
 '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
 '<link rel="preload" as="font" type="font/woff2" crossorigin href="'+FONT+'latin-wght-normal.woff2">',
 '<link rel="preload" as="font" type="font/woff2" crossorigin href="'+FONT+'latin-ext-wght-normal.woff2">',
 '<style id="okla-curtain">html:not(.okla-ready) body{opacity:0}</style>',
 "<script>setTimeout(function(){document.documentElement.classList.add('okla-ready')},7000)</script>",
 writer,
 "<script>window.twttr={_e:[],ready:function(){},widgets:{load:function(){}}}</script><meta id=\"twitter-wjs\">",
 '<script async fetchpriority="high" src="'+base+'zapati_firsthalf.js?v=ai-'+sha.slice(0,7)+'" data-api-url="https://okla-chatpot.onrender.com"></script>'
].join('\n');
console.log(tag);
