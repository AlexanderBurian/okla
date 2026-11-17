/* OKLA – builds the storefront bundles.

   Reads the bundle table from public/zapati_firsthalf.js (between the @bundles and @end markers) and writes, for every
   bundle, public/dist/<bundle>.css and/or public/dist/<bundle>.js: the bundle's source files joined in the table's order.

   Nothing in the result behaves differently from the separate files:
   - JS: each file is minified on its own (spaces, comments and local variable names only - no rewriting of the code,
     no newer syntax) and runs inside its own try/catch, so an error in one file still leaves the others running (the
     error is re-thrown asynchronously, so it is reported exactly as before).
   - CSS: comments and indentation are removed (nothing else), relative url(...) paths are rewritten so they still point
     to the same files from public/dist/, and an @import (the web font) is moved to the top of the bundle, the only
     place where it counts.

   Usage:  cd tools && npm install   (once)
           node tools/build.js       (after any change to a source file or to the table) */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
let esbuild;
try{esbuild=require('esbuild')}catch(e){console.error('esbuild is missing: run "npm install" in tools/ first.');process.exit(1)}

const PUBLIC=path.join(__dirname,'..','public');
const DIST=path.join(PUBLIC,'dist');
const LOADER=path.join(PUBLIC,'zapati_firsthalf.js');

/* the bundle table, exactly as the loader has it */
function readTable(){
 const src=fs.readFileSync(LOADER,'utf8');
 const a=src.indexOf('/*@bundles*/'),b=src.indexOf('/*@end*/');
 if(a<0||b<a)throw new Error('bundle table markers not found in zapati_firsthalf.js');
 const box={};vm.createContext(box);
 vm.runInContext(src.slice(a,b)+'\nthis.BUNDLES=BUNDLES;',box);
 return box.BUNDLES;
}

/* CSS: comments and runs of whitespace out, strings and url(...) untouched */
const IDENT=/[A-Za-z0-9_\-%\u0080-￿]/;
function minifyCss(css){
 let out='',i=0;const n=css.length;
 const last=()=>out.length?out[out.length-1]:'';
 while(i<n){
  const c=css[i];
  if(c==='/'&&css[i+1]==='*'){
   const j=css.indexOf('*/',i+2);i=j<0?n:j+2;
   /* a comment between two word characters still separates them */
   if(IDENT.test(last())&&i<n&&IDENT.test(css[i]))out+=' ';
   continue;
  }
  if(c==='"'||c==="'"){
   let j=i+1;while(j<n&&css[j]!==c){if(css[j]==='\\')j++;j++}
   out+=css.slice(i,j+1);i=j+1;continue;
  }
  if(c==='u'&&/^url\(/i.test(css.slice(i,i+4))&&!/[\w-]/.test(last())){
   /* unquoted url(...) is copied as it is */
   let j=i+4;while(j<n&&/\s/.test(css[j]))j++;
   if(css[j]!=='"'&&css[j]!=="'"){const k=css.indexOf(')',j);out+=css.slice(i,k+1);i=k+1;continue}
  }
  if(/\s/.test(c)){
   let j=i;while(j<n&&/\s/.test(css[j]))j++;
   /* drop the space next to { } ; , and at the start; otherwise one space */
   const next=css[j]||'';
   if(out.length&&!'{};,'.includes(last())&&!'{};,'.includes(next))out+=' ';
   i=j;continue;
  }
  out+=c;i++;
 }
 return out.trim();
}

/* relative url(...) of a source stylesheet -> the same file seen from public/dist/ */
function rebaseUrls(css,file){
 const dir=path.posix.dirname(file);
 return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,(m,q,ref)=>{
  const r=ref.trim();
  if(!r||/^(data:|https?:|\/\/|\/|#)/i.test(r))return m;
  const target=path.posix.normalize(path.posix.join(dir,r));
  return 'url('+q+path.posix.relative('dist',target)+q+')';
 });
}

/* Style speed: a rule whose last part STARTS with a multi-argument :is()/:where() - "html body :is(.a, .b):not(#x)" - is
   tried by the browser on EVERY element at every restyle (it cannot be filed under a class, id or tag). About 170 such
   rules made each restyle of a page twice as slow. Each argument becomes a selector of its own, filed under its class /
   id / tag: "html body :where(.a):is(*,D):not(#x), html body :where(.b):is(*,D):not(#x)". :where() keeps the argument's
   exact meaning (also an argument with combinators inside) and adds nothing to specificity; :is(*,D) matches every
   element and adds exactly the specificity of the original :is() (the highest of its arguments - D is a dummy selector
   with that specificity that never matches). So every element gets the same rules with the same specificity in the same
   order: the cascade is unchanged. A :where() original gets no D (its specificity is zero). */
function topSplit(s,test){ /* indexes of top-level characters for which test(ch, i) is true (outside (), [], strings) */
 const out=[];let d=0,q='';
 for(let i=0;i<s.length;i++){const ch=s[i];
  if(q){if(ch==='\\')i++;else if(ch===q)q='';continue}
  if(ch==='"'||ch==="'"){q=ch;continue}
  if(ch==='\\'){i++;continue}
  if(ch==='('||ch==='[')d++;else if(ch===')'||ch===']')d--;
  else if(d===0&&test(ch,i))out.push(i);
 }
 return out;
}
function splitList(s){const cut=topSplit(s,ch=>ch===',');const parts=[];let a=0;for(const i of cut){parts.push(s.slice(a,i));a=i+1}parts.push(s.slice(a));return parts.map(x=>x.trim())}
function closeParen(s,i){/* s[i]==='(' -> index of its ')' */let d=0,q='';for(let j=i;j<s.length;j++){const ch=s[j];if(q){if(ch==='\\')j++;else if(ch===q)q='';continue}if(ch==='"'||ch==="'"){q=ch;continue}if(ch==='\\'){j++;continue}if(ch==='(')d++;else if(ch===')'&&--d===0)return j}return -1}
const IDCH=/[A-Za-z0-9_\-\u0080-￿]/;
function ident(s,i){while(i<s.length&&(IDCH.test(s[i])||s[i]==='\\')){if(s[i]==='\\')i++;i++}return i}
function spec(sel){ /* [ids, classes, types] of a complex selector */
 let a=0,b=0,c=0,i=0;const n=sel.length;
 while(i<n){const ch=sel[i];
  if(ch==='#'){a++;i=ident(sel,i+1)}
  else if(ch==='.'){b++;i=ident(sel,i+1)}
  else if(ch==='['){b++;let d=0,q='';for(;i<n;i++){const x=sel[i];if(q){if(x==='\\')i++;else if(x===q)q='';continue}if(x==='"'||x==="'"){q=x;continue}if(x==='[')d++;else if(x===']'&&--d===0){i++;break}}}
  else if(ch===':'){
   if(sel[i+1]===':'){c++;i=ident(sel,i+2);if(sel[i]==='('){i=closeParen(sel,i)+1}continue}
   const e=ident(sel,i+1),name=sel.slice(i+1,e).toLowerCase();i=e;
   if(/^(before|after|first-line|first-letter)$/.test(name)){c++;continue}
   if(sel[i]==='('){const j=closeParen(sel,i),inner=sel.slice(i+1,j);i=j+1;
    if(name==='where')continue;
    if(name==='is'||name==='not'||name==='has'||name==='matches'||name==='-webkit-any'){const m=maxSpec(splitList(inner).map(spec));a+=m[0];b+=m[1];c+=m[2];continue}
    if(/^nth-(last-)?child$/.test(name)&&/\sof\s/.test(inner)){const m=maxSpec(splitList(inner.replace(/^.*?\sof\s/,'')).map(spec));b++;a+=m[0];b+=m[1];c+=m[2];continue}
    b++;continue}
   b++;
  }
  else if(ch==='*'){i++}
  else if(IDCH.test(ch)||ch==='\\'){c++;i=ident(sel,i)}
  else i++;
 }
 return [a,b,c];
}
function cmpSpec(x,y){return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]}
function maxSpec(list){return list.reduce((m,s)=>cmpSpec(s,m)>0?s:m,[0,0,0])}
function dummy(s){ /* a selector with specificity s that matches nothing */
 if(!s[0]&&!s[1]&&!s[2])return '';
 let d=(s[2]?'okla-sp':'')+'#okla-sp'.repeat(s[0])+'.okla-sp'.repeat(s[1]);
 for(let k=1;k<s[2];k++)d+=' okla-sp';
 if(!s[2]&&!d)return '';
 return d;
}
let bucketStats={rules:0,selectors:0};
function bucketSelector(sel){
 const comb=topSplit(sel,ch=>ch===' '||ch==='>'||ch==='+'||ch==='~');
 const start=comb.length?comb[comb.length-1]+1:0;
 const last=sel.slice(start);
 const m=/^:(is|where)\(/i.exec(last);
 if(!m)return null;
 const open=start+m[0].length-1,close=closeParen(sel,open);
 if(close<0)return null;
 const args=splitList(sel.slice(open+1,close)).filter(Boolean);
 if(args.length<2)return null;
 /* an argument that is itself :is()/:where()-led or holds a pseudo-element: left as it is */
 if(args.some(x=>/::|:(before|after)\b/i.test(x)))return null;
 const pre=sel.slice(0,start),rest=sel.slice(close+1);
 const pad=m[1].toLowerCase()==='is'?dummy(maxSpec(args.map(spec))):'';
 return args.map(x=>pre+':where('+x+')'+(pad?':is(*,'+pad+')':'')+rest);
}
function bucketCss(css){
 /* walk the (minified) stylesheet; preludes of style rules are rewritten, at-rules and @keyframes steps are left alone */
 let out='',i=0,start=0,q='';const stack=[];
 const n=css.length;
 for(i=0;i<n;i++){const ch=css[i];
  if(q){if(ch==='\\')i++;else if(ch===q)q='';continue}
  if(ch==='"'||ch==="'"){q=ch;continue}
  if(ch==='/'&&css[i+1]==='*'){const j=css.indexOf('*/',i+2);i=j<0?n:j+1;continue}
  if(ch==='{'){
   const prelude=css.slice(start,i);const t=prelude.trim();
   let kind='style';
   if(t[0]==='@')kind=/^@(-webkit-)?keyframes/i.test(t)?'keyframes':'at';
   else if(stack.length&&stack[stack.length-1]==='keyframes')kind='step';
   if(kind==='style'){
    const parts=splitList(t);let changed=false;const outParts=[];
    for(const p of parts){const r=bucketSelector(p);if(r){changed=true;bucketStats.selectors++;outParts.push(...r)}else outParts.push(p)}
    if(changed){bucketStats.rules++;out+=css.slice(start,i).replace(t,outParts.join(','))}else out+=prelude;
   }else out+=prelude;
   out+='{';stack.push(kind);start=i+1;continue}
  if(ch==='}'){out+=css.slice(start,i+1);stack.pop();start=i+1;continue}
  if(ch===';'&&(!stack.length||stack[stack.length-1]==='at')){out+=css.slice(start,i+1);start=i+1;continue}
 }
 out+=css.slice(start);
 return out;
}

function buildCss(name,files){
 let imports='',body='';
 for(const f of files){
  let css=fs.readFileSync(path.join(PUBLIC,f),'utf8').replace(/^﻿/,'');
  css=rebaseUrls(css,f);
  css=minifyCss(css);
  css=bucketCss(css);
  css=css.replace(/@import\s+(?:url\([^)]*\)|(['"])[^'"]*\1)[^;]*;/g,m=>{imports+=m;return ''});
  body+=css+'\n';
 }
 return '/* OKLA '+name+': '+files.join(' ')+' (generated by tools/build.js) */\n'+imports+(imports?'\n':'')+body;
}

function buildJs(name,files){
 let out='/* OKLA '+name+': '+files.join(' ')+' (generated by tools/build.js) */\n';
 for(const f of files){
  const src=fs.readFileSync(path.join(PUBLIC,f),'utf8').replace(/^﻿/,'');
  const min=esbuild.transformSync(src,{loader:'js',minifyWhitespace:true,minifyIdentifiers:true,minifySyntax:false,legalComments:'none',charset:'utf8',sourcefile:f}).code;
  out+='try{'+min.replace(/\s+$/,'')+'\n}catch(e){setTimeout(function(){throw e})}\n';
 }
 return out;
}

const table=readTable();
fs.mkdirSync(DIST,{recursive:true});
const keep=new Set();
let total={src:0,out:0};
for(const [name,,files] of table){
 for(const f of files)if(!fs.existsSync(path.join(PUBLIC,f)))throw new Error(name+': missing source file '+f);
 const css=files.filter(f=>f.endsWith('.css')),js=files.filter(f=>!f.endsWith('.css'));
 const size=list=>list.reduce((s,f)=>s+fs.statSync(path.join(PUBLIC,f)).size,0);
 if(css.length){const o=buildCss(name,css);fs.writeFileSync(path.join(DIST,name+'.css'),o);keep.add(name+'.css');total.src+=size(css);total.out+=Buffer.byteLength(o)}
 if(js.length){const o=buildJs(name,js);fs.writeFileSync(path.join(DIST,name+'.js'),o);keep.add(name+'.js');total.src+=size(js);total.out+=Buffer.byteLength(o)}
}
/* bundles no longer in the table */
for(const f of fs.readdirSync(DIST))if(!keep.has(f))fs.unlinkSync(path.join(DIST,f));
console.log('fast-filed selectors: '+bucketStats.selectors+' in '+bucketStats.rules+' rules');console.log(table.length+' bundles, '+keep.size+' files in public/dist: '+Math.round(total.src/1024)+' kB of sources -> '+Math.round(total.out/1024)+' kB');
