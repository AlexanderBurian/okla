/* Checks that a loader (public/zapati_firsthalf.js, in source mode) loads exactly the same files in the same order as a
   reference loader, on every kind of page. Usage: node tools/check_order.js <reference-loader.js> [new-loader.js]
   Both loaders are run in a small fake page; the files they ask for are compared. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ref=process.argv[2],cur=process.argv[3]||path.join(__dirname,'..','public','zapati_firsthalf.js');
if(!ref){console.error('usage: node tools/check_order.js <reference-loader.js> [loader.js]');process.exit(2)}

const PAGES=[
 ['home','/',['type-index']],
 ['category','/merici-technika-a-naradi/',['type-category']],
 ['product','/aneng-616/',['type-detail'],{product:true}],
 ['cart','/kosik/',['ordering-process','in-kosik']],
 ['checkout','/objednavka/krok-1/',['ordering-process','in-krok-1']],
 ['thank-you','/objednavka/dekujeme/',['in-dekujeme']],
 ['thank-you-h1','/x/',[],{h1:'Objednávka byla odeslána'}],
 ['newsroom','/newsroom/',[]],
 ['article-list','/nase-novinky/',['in-nase-novinky']],
 ['article','/nase-novinky/nfc/',['in-nase-novinky']],
 ['order-status','/stav-objednavky/',['in-404']],
 ['login','/login/',['in-login']],
 ['register','/registrace/',['in-registrace']],
 ['complaint','/reklamace/',['in-404']],
 ['orders','/objednavky/',['in-objednavky']],
 ['client','/klient/',['in-klient']],
 ['account-link','/x/',[],{logout:true}],
 ['about','/o-nas/',[]],
 ['how-to-buy','/jak-nakupovat/',[]],
 ['contact','/kontakt/',['in-kontakt']],
 ['legal','/obchodni-podminky/',[]],
 ['legal2','/doprava-a-platba/',[]],
 ['404','/nic/',['in-404']],
 ['detail+checkout','/x/',['ordering-process'],{product:true}]
];

function run(file,page,source){
 const [,pathname,classes,opt={}]=page;
 const appended=[];
 const store={};if(source)store['okla-src']='1';
 function el(tag){
  const e={tagName:tag.toUpperCase(),style:{setProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return false}},
   setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},remove(){},appendChild(c){appended.push(c);return c},textContent:''};
  return e;
 }
 const htmlClasses=new Set();
 const root=el('html');
 root.classList={add(...c){c.forEach(x=>htmlClasses.add(x))},remove(...c){c.forEach(x=>htmlClasses.delete(x))},toggle(c,on){if(on)htmlClasses.add(c);else htmlClasses.delete(c)},contains(c){return htmlClasses.has(c)}};
 const head=el('head');
 const body={className:classes.join(' '),classList:{contains:c=>classes.includes(c)}};
 const document={
  currentScript:{src:'https://cdn.example/gh/x/okla@abc/public/zapati_firsthalf.js?v=1',getAttribute:()=>null},
  documentElement:root,head,body,readyState:'complete',cookie:'',
  querySelector(sel){
   if(sel==='#content .p-detail')return opt.product?{}:null;
   if(sel==='#content h1')return opt.h1?{textContent:opt.h1}:null;
   return null;
  },
  querySelectorAll(sel){
   if(/odhl|#content-wrapper a/.test(sel)&&opt.logout)return [{textContent:'Odhlásit se'}];
   return [];
  },
  createElement:el,addEventListener(){}
 };
 const sandbox={
  window:null,document,location:{pathname,search:''},
  localStorage:{getItem:k=>store[k]==null?null:store[k],setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},
  matchMedia:()=>({matches:false,addEventListener(){}}),screen:{width:1920,height:1080},innerWidth:1920,
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame(){},
  fetch:()=>({then(){return this},catch(){return this}}),MutationObserver:function(){this.observe=function(){}},
  console:{warn(){},error(){},log(){}},URL,JSON,Math,String,Object,Array,RegExp
 };
 sandbox.window=sandbox;sandbox.addEventListener=function(){};
 vm.createContext(sandbox);
 vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});
 const strip=u=>u.replace(/^https:\/\/cdn\.example\/gh\/x\/okla@abc\/public\//,'').replace(/\?.*$/,'');
 const pre=appended.filter(e=>e.rel==='preload'&&!/okla_i18n_/.test(e.href)).map(e=>strip(e.href));
 const loads=appended.filter(e=>e.rel==='stylesheet'||(e.tagName==='SCRIPT'&&e.src&&!/ai\/v1/.test(e.src))).map(e=>strip(e.href||e.src));
 return {pre,loads,html:[...htmlClasses].filter(c=>c==='okla-legal-wide')};
}

let bad=0;
for(const page of PAGES){
 const a=run(ref,page,false),b=run(cur,page,true);
 /* reference: its preload list is every file, main files first, then the later ones */
 const want=a.pre;
 /* current loader in source mode: main files are loaded at once, the later ones are preloaded */
 const got=b.loads.concat(b.pre);
 const same=JSON.stringify(want)===JSON.stringify(got)&&JSON.stringify(a.html)===JSON.stringify(b.html);
 if(!same){bad++;console.log('DIFFERENT',page[0]);console.log(' reference:',want.join(' '));console.log(' current:  ',got.join(' '))}
 else console.log('same      ',page[0].padEnd(16),want.length,'files');
}
process.exit(bad?1:0);
