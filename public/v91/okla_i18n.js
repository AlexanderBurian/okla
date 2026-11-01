/* OKLA languages: Czech (the shop's own language), English, Slovak and Hungarian. The choice is made in the header (the flag) and
   in the footer ("Jazyk webu") and remembered in the browser. A chosen language other than Czech is applied in place:
   its pack (okla_i18n_<lang>.js) translates the texts, field hints, labels and Shoptet's messages, and its product file
   (okla_i18n_products_<lang>.js) the product names, descriptions and specifications. Content added later (the cart
   drawer, search suggestions, a redrawn cart) is translated as it appears. Prices stay in CZK. */
(function(){
 'use strict';
 if(window.__oklaI18nV1)return;
 window.__oklaI18nV1=true;

 var KEY='okla-lang';
 var LANGS=['cs','en','sk','hu'];
 var LABEL={cs:'Čeština',en:'English',sk:'Slovenčina',hu:'Magyar'};
 var HTML_LANG={cs:'cs',en:'en',sk:'sk',hu:'hu'};
 var root=document.documentElement;
 var base=(document.currentScript&&document.currentScript.src||'').split(/[?#]/)[0].replace(/[^/]*$/,'');

 function valid(l){return LANGS.indexOf(l)!==-1}
 function stored(){
  var v=null;
  try{v=localStorage.getItem(KEY)}catch(e){}
  if(!valid(v)){var m=document.cookie.match(/(?:^|;\s*)okla-lang=(\w+)/);v=m?m[1]:'cs'}
  return valid(v)?v:'cs';
 }
 var lang=stored();
 window.OKLA_LANG=lang;
 root.setAttribute('data-okla-lang',lang);

 function choose(next){
  if(next===lang||!valid(next))return;
  try{localStorage.setItem(KEY,next)}catch(e){}
  document.cookie='okla-lang='+next+';path=/;max-age=31536000;samesite=lax';
  location.reload();
 }

 /* The pack of the chosen language; Czech needs none. */
 var PACK={dict:{},attr:{},messages:{},rules:[],attrRules:[],title:[],cardMore:'...'};
 var P={names:{},shorts:[],shortExact:{},byCode:{}};

 function own(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
 /* A name inside a label: a product, else a text the pack knows (a category). */
 function productName(cs){return P.names[cs]||(own(PACK.dict,cs)?PACK.dict[cs]:cs)}

 function addProducts(list){
  (list||[]).forEach(function(p){
   P.byCode[p.code]=p;
   if(p.name_cs&&p.name_t){
    P.names[p.name_cs]=p.name_t;
    var a=p.name_cs.split(' – '),b=p.name_t.split(' – ');
    if(a.length===2&&b.length===2)P.names['– '+a[1]]='– '+b[1];
   }
   Object.keys(p.catalog_names||{}).forEach(function(k){P.names[k]=p.catalog_names[k]});
   [[p.short_cs_text,p.short_t_text],[p.catalog_short_cs,p.catalog_short_t]].forEach(function(pair){
    if(pair[0]&&pair[1]){P.shorts.push({cs:pair[0],t:pair[1]});P.shortExact[pair[0].replace(/\s+/g,' ').trim()]=pair[1]}
   });
  });
 }

 /* Country names in Czech, mapped to the chosen language through the browser's own names. */
 var REGIONS=null;
 function regions(){
  if(REGIONS)return REGIONS;
  REGIONS={};
  try{
   var cs=new Intl.DisplayNames(['cs'],{type:'region'}),to=new Intl.DisplayNames([HTML_LANG[lang]],{type:'region'});
   for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b);try{var n=cs.of(c);if(n&&n!==c)REGIONS[n]=to.of(c)}catch(e){}}
  }catch(e){}
  return REGIONS;
 }

 function translateText(t){
  var key=t.replace(/\s+/g,' ').trim();
  if(!key)return null;
  if(own(PACK.dict,key))return PACK.dict[key];
  if(own(P.names,key))return P.names[key];
  for(var i=0;i<PACK.rules.length;i++){var m=key.match(PACK.rules[i][0]);if(m)return PACK.rules[i][1].apply(null,m)}
  /* A product's short description, whole or shortened on a product card (with or without "..."). */
  if(own(P.shortExact,key))return P.shortExact[key];
  if(key.length>=40){
   var dots=/(\.\.\.|…)$/.test(key),head=key.replace(/(\.\.\.|…)$/,'');
   for(var j=0;j<P.shorts.length;j++){
    var s=P.shorts[j];
    if(s.cs.indexOf(head)===0){
     var want=Math.max(40,Math.round(s.t.length*head.length/s.cs.length));
     var cut=want>=s.t.length?s.t:s.t.slice(0,want).replace(/[\s,.;:]+\S*$/,'');
     return dots?cut+PACK.cardMore:cut;
    }
   }
  }
  var r=regions();
  if(own(r,key))return r[key];
  return null;
 }

 var done=new WeakMap();
 function doTextNode(n){
  var v=n.nodeValue;
  if(done.get(n)===v)return;
  var t=translateText(v);
  if(t!=null){
   v=v.match(/^\s*/)[0]+t+v.match(/\s*$/)[0];
   n.nodeValue=v;
  }
  done.set(n,v);
 }
 var ATTRS=['placeholder','aria-label','title','alt'];
 function doAttrs(el){
  for(var i=0;i<ATTRS.length;i++){
   var a=ATTRS[i],v=el.getAttribute(a);
   if(!v||!/[A-Za-zÀ-ž]/.test(v))continue;
   var k=v.trim(),t=null;
   if(own(PACK.attr,k))t=PACK.attr[k];
   else if(own(PACK.dict,k))t=PACK.dict[k];
   else if(own(P.names,k))t=P.names[k];
   else for(var j=0;j<PACK.attrRules.length;j++){var r=PACK.attrRules[j],m=k.match(r[0]);if(m){t=r[1]+productName(m[1])+(r[2]||'');break}}
   if(t!=null&&t!==v)el.setAttribute(a,t);
  }
  if(el.tagName==='INPUT'&&(el.type==='submit'||el.type==='button')&&el.value&&own(PACK.dict,el.value.trim()))el.value=PACK.dict[el.value.trim()];
 }
 var SKIP=/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TEXTAREA|CODE|PRE)$/;
 function walk(node){
  if(node.nodeType===3){
   var p=node.parentElement;
   if(p&&!SKIP.test(p.tagName)&&!p.closest('[data-okla-i18n-skip]'))doTextNode(node);
   return;
  }
  if(node.nodeType!==1||SKIP.test(node.tagName)||node.hasAttribute('data-okla-i18n-skip'))return;
  doAttrs(node);
  if(node.tagName==='INPUT'||node.tagName==='SELECT')return;
  for(var c=node.firstChild;c;c=c.nextSibling)walk(c);
 }

 /* ---------- The product page: the translated description, short text and specifications ---------- */
 function productOnPage(){
  var codeEl=document.querySelector('.p-detail .p-code');
  var m=codeEl&&codeEl.textContent.match(/OKL-\d+/);
  if(m&&P.byCode[m[0]])return P.byCode[m[0]];
  var h1=document.querySelector('.p-detail h1');
  var name=h1?h1.textContent.replace(/\s+/g,' ').trim():'';
  for(var c in P.byCode){if(P.byCode[c].name_cs===name)return P.byCode[c]}
  return null;
 }
 function bare(s){return String(s||'').replace(/\s+/g,' ').trim().replace(/:$/,'')}
 /* Replaces the text of a table cell and keeps its own markup (a link, the colon in its own span). */
 function setCell(cell,cs,t){
  var nodes=[],w=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT),n;
  while((n=w.nextNode()))if(n.nodeValue.trim())nodes.push(n);
  var target=null;
  nodes.forEach(function(x){if(!target&&bare(x.nodeValue)===bare(cs))target=x});
  if(!target)nodes.forEach(function(x){if(!target||x.nodeValue.trim().length>target.nodeValue.trim().length)target=x});
  if(!target)return;
  var colon=/:\s*$/.test(target.nodeValue)&&!/:\s*$/.test(t)?':':'';
  target.nodeValue=target.nodeValue.match(/^\s*/)[0]+bare(t)+colon+target.nodeValue.match(/\s*$/)[0];
  nodes.forEach(function(x){if(x!==target&&bare(x.nodeValue)&&bare(x.nodeValue)!==':'&&cell.textContent.indexOf(x.nodeValue)!==-1&&bare(cs).indexOf(bare(x.nodeValue))!==-1)x.nodeValue=''});
  done.set(target,target.nodeValue);
 }
 function translateProductPage(){
  var p=productOnPage();
  if(!p)return;
  if(p.name_t&&document.title.indexOf(p.name_t)!==0)document.title=p.name_t+' | OKLA.cz';
  var desc=document.querySelector('#description .basic-description');
  if(desc&&p.desc_t_html&&!desc.hasAttribute('data-okla-i18n')){desc.innerHTML=p.desc_t_html;desc.setAttribute('data-okla-i18n',lang)}
  var short=document.querySelector('.p-detail .p-short-description');
  if(short&&p.short_t_html&&!short.hasAttribute('data-okla-i18n')){short.innerHTML=p.short_t_html;short.setAttribute('data-okla-i18n',lang)}
  var rows=document.querySelectorAll('.extended-description tr');
  if(!rows.length||!p.params)return;
  var used={};
  Array.prototype.forEach.call(rows,function(tr){
   if(tr.hasAttribute('data-okla-i18n'))return;
   var cells=tr.querySelectorAll('th,td');
   if(cells.length<2)return;
   var name=bare(cells[0].textContent),value=bare(cells[cells.length-1].textContent);
   for(var i=0;i<p.params.length;i++){
    var q=p.params[i];
    if(used[i]||bare(q[0])!==name)continue;
    used[i]=true;
    setCell(cells[0],q[0],q[2]);
    if(bare(q[1])===value)setCell(cells[cells.length-1],q[1],q[3]);
    tr.setAttribute('data-okla-i18n',lang);
    break;
   }
  });
 }

 /* ---------- Shoptet's own messages ---------- */
 function translateMessages(){
  var m=window.shoptet&&window.shoptet.messages;
  if(!m||m.__oklaI18n)return;
  Object.keys(PACK.messages).forEach(function(k){
   if(k.indexOf('validator.')===0){if(m.validator)m.validator[k.slice(10)]=PACK.messages[k]}
   else m[k]=PACK.messages[k];
  });
  m.__oklaI18n=lang;
 }

 /* ---------- The switches: the flag in the header and "Jazyk webu" in the footer ---------- */
 var NS='http://www.w3.org/2000/svg';
 var FLAGS={
  hu:'<rect width="32" height="11" fill="#ce2939"/><rect y="10.6" width="32" height="10.8" fill="#fff"/><rect y="21.3" width="32" height="10.7" fill="#477050"/>',
  cs:'<rect width="32" height="32" fill="#fff"/><rect y="16" width="32" height="16" fill="#e0112b"/><path d="M0 0 17 16 0 32Z" fill="#0b2540"/>',
  en:'<rect width="32" height="32" fill="#012169"/><path d="M-4 0 36 32M36 0-4 32" stroke="#fff" stroke-width="6"/><path d="M-4 0 36 32M36 0-4 32" stroke="#c8102e" stroke-width="2.4"/><path d="M16 0v32M0 16h32" stroke="#fff" stroke-width="9"/><path d="M16 0v32M0 16h32" stroke="#c8102e" stroke-width="5"/>',
  sk:'<rect width="32" height="11" fill="#fff"/><rect y="10.6" width="32" height="10.8" fill="#0b4ea2"/><rect y="21.3" width="32" height="10.7" fill="#ee1c25"/><path d="M6.5 8.5h11v9.2c0 4-3 6.3-5.5 7.3-2.5-1-5.5-3.3-5.5-7.3Z" fill="#ee1c25" stroke="#fff" stroke-width="1"/><path d="M11.3 10.6h1.4v2.4h2.4v1.3h-2.4v1.4h3.1v1.3h-3.1v2.6h-1.4V17H8.2v-1.3h3.1v-1.4H8.9V13h2.4Z" fill="#fff"/><path d="M7.6 21.2c1-1.6 2.5-1.7 3.2-.6.7-1.3 1.7-1.3 2.4 0 .7-1.1 2.2-1 3.2.6-1.4 1.5-3 2.6-4.4 3.2-1.4-.6-3-1.7-4.4-3.2Z" fill="#0b4ea2"/>'
 };
 var flagSeq=0;
 function flag(code){
  var id='okla-flag-'+code+'-'+(++flagSeq);
  var s=document.createElementNS(NS,'svg');
  s.setAttribute('viewBox','0 0 32 32');
  s.setAttribute('aria-hidden','true');
  s.setAttribute('class','okla-lang-flag');
  s.innerHTML='<defs><clipPath id="'+id+'"><circle cx="16" cy="16" r="15.4"/></clipPath></defs><g clip-path="url(#'+id+')">'+FLAGS[code]+'</g>';
  return s;
 }

 function toggleHeader(holder,open){holder.classList.toggle('is-open',open);holder.setAttribute('aria-expanded',open?'true':'false')}

 function buildHeaderSwitch(holder){
  holder.setAttribute('role','button');
  holder.setAttribute('tabindex','0');
  holder.setAttribute('aria-haspopup','menu');
  holder.setAttribute('aria-expanded','false');
  holder.setAttribute('title',LABEL[lang]+' · CZK');
  holder.setAttribute('aria-label',LABEL[lang]+' · CZK');
  holder.setAttribute('data-okla-i18n-skip','');
  holder.replaceChildren(flag(lang));
  var menu=document.createElement('div');
  menu.className='okla-lang-menu';
  menu.setAttribute('role','menu');
  LANGS.forEach(function(code){
   var b=document.createElement('button');
   b.type='button';
   b.className='okla-lang-option'+(code===lang?' is-current':'');
   b.setAttribute('role','menuitemradio');
   b.setAttribute('aria-checked',code===lang?'true':'false');
   b.setAttribute('lang',HTML_LANG[code]);
   b.appendChild(flag(code));
   var s=document.createElement('span');s.textContent=LABEL[code];b.appendChild(s);
   b.addEventListener('click',function(e){e.stopPropagation();choose(code)});
   menu.appendChild(b);
  });
  holder.appendChild(menu);
  return true;
 }

 /* Phones have their own top bar (logo and search); the same switch goes between them. */
 function mobileHolder(){
  var bar=document.querySelector('#okla-v61-header .okm61-top');
  if(!bar)return null;
  var holder=bar.querySelector('.okla-lang-mobile');
  if(!holder){
   holder=document.createElement('span');
   holder.className='okla-lang-mobile';
   var search=bar.querySelector('.okla-m-search-open');
   bar.insertBefore(holder,search||null);
  }
  return holder;
 }

 function headerSwitch(){
  var mobile=mobileHolder();
  if(mobile)wireSwitch(mobile);
  return wireSwitch(document.querySelector('#header .okla-header-locale'));
 }

 function wireSwitch(holder){
  if(!holder)return false;
  /* The homepage header code redraws the flag once; the switch is built again if that happened after it. */
  if(holder.querySelector('.okla-lang-menu'))return true;
  holder.dataset.oklaIconVersion='50';
  if(!holder.hasAttribute('data-okla-lang-ready')){
   holder.setAttribute('data-okla-lang-ready','1');
   holder.addEventListener('click',function(e){var menu=holder.querySelector('.okla-lang-menu');if(menu&&!menu.contains(e.target))toggleHeader(holder,!holder.classList.contains('is-open'))});
   holder.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleHeader(holder,!holder.classList.contains('is-open'))}if(e.key==='Escape')toggleHeader(holder,false)});
   document.addEventListener('mousedown',function(e){if(!holder.contains(e.target))toggleHeader(holder,false)});
  }
  return buildHeaderSwitch(holder);
 }

 function footerSwitch(){
  var box=document.querySelector('#okla-footer-links .okla-lang');
  if(!box||box.hasAttribute('data-okla-lang-ready'))return !!box;
  box.setAttribute('data-okla-lang-ready','1');
  box.setAttribute('role','group');
  box.setAttribute('data-okla-i18n-skip','');
  box.setAttribute('aria-label','Jazyk webu · Language');
  box.replaceChildren();
  LANGS.forEach(function(code){
   var b=document.createElement('button');
   b.type='button';
   b.className='okla-lang-pill'+(code===lang?' is-current':'');
   b.setAttribute('aria-pressed',code===lang?'true':'false');
   b.setAttribute('lang',HTML_LANG[code]);
   b.appendChild(flag(code));
   var s=document.createElement('span');s.textContent=LABEL[code];b.appendChild(s);
   b.addEventListener('click',function(){choose(code)});
   box.appendChild(b);
  });
  return true;
 }

 /* ---------- Running it ---------- */
 var active=false;
 var queue=[],scheduled=false;
 function flush(){
  scheduled=false;
  var list=queue;queue=[];
  if(active){translateProductPage();list.forEach(walk)}
  headerSwitch();
  footerSwitch();
 }
 function schedule(n){queue.push(n);if(!scheduled){scheduled=true;setTimeout(flush,0)}}

 function start(){
  if(!document.body){document.addEventListener('DOMContentLoaded',start,{once:true});return}
  if(active){
   root.lang=HTML_LANG[lang];
   translateMessages();
   walk(document.body);
   translateProductPage();
   PACK.title.forEach(function(r){document.title=document.title.replace(r[0],r[1])});
   /* A title the patterns did not cover is translated part by part ("Objednávka - informace o Vás - OKLA"). */
   var whole=translateText(document.title);
   if(whole!=null)document.title=whole;
   else if(/ - /.test(document.title)){
    var parts=document.title.split(' - '),joined=parts.join(' - ');
    for(var i=parts.length-1;i>0;i--){var t=translateText(parts.slice(0,i).join(' - '));if(t!=null){joined=[t].concat(parts.slice(i)).join(' - ');break}}
    document.title=joined;
   }
  }
  headerSwitch();
  footerSwitch();
  new MutationObserver(function(list){
   list.forEach(function(m){
    if(m.type==='characterData')schedule(m.target);
    else if(m.type==='attributes'){if(active)doAttrs(m.target)}
    else m.addedNodes.forEach(function(n){schedule(n)});
   });
  }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});
  /* Shoptet fills its messages after its own scripts load. */
  if(active){setTimeout(translateMessages,0);window.addEventListener('load',translateMessages)}
  root.classList.remove('okla-i18n-pending');
 }

 function load(file,done){
  var s=document.createElement('script');
  s.src=base+file+'?v=1';
  s.onload=s.onerror=done;
  (document.head||root).appendChild(s);
 }

 if(lang!=='cs'){
  /* The page is hidden for a moment so Czech texts do not flash before they are translated; never longer than 1.5 s. */
  root.classList.add('okla-i18n-pending');
  setTimeout(function(){root.classList.remove('okla-i18n-pending')},1500);
  load('okla_i18n_'+lang+'.js',function(){
   var pack=window.OKLA_I18N_PACKS&&window.OKLA_I18N_PACKS[lang];
   if(pack){Object.keys(PACK).forEach(function(k){if(pack[k]!=null)PACK[k]=pack[k]});active=true}
   load('okla_i18n_products_'+lang+'.js',function(){
    addProducts(window.OKLA_I18N_PRODUCTS&&window.OKLA_I18N_PRODUCTS[lang]);
    start();
   });
  });
 }else start();

 window.OKLA_I18N={lang:lang,languages:LANGS.slice(),choose:choose,translate:translateText};
})();
