/* OKLA desktop search, as on Alza: when a search field is focused the rest of the page is blurred and a panel opens
   right under the field. Empty field: popular searches and frequently searched products. While typing: the matching
   products from the catalogue and a row that searches the whole shop. Phones keep Shoptet's own search.
   Attaches to the header field and to the empty-cart search field; each gets its own panel, sharing one overlay. */
(function(){
 'use strict';
 if(window.__oklaSearchV1)return;
 window.__oklaSearchV1=true;

 var POPULAR_TERMS=['Flipper Zero','ESP32','Chytré brýle','Endoskop','Projektor'];
 var POPULAR_CODES=['OKL-001','OKL-030','OKL-006','OKL-020','OKL-004','OKL-032'];
 var HOT=3;
 var MAX_RESULTS=6;
 var desktop=window.matchMedia('(min-width: 992px)');

 var overlay=null;        /* one shared blur overlay */
 var openInst=null;       /* the instance whose panel is currently open */
 var instances=[];        /* every attached field, so only the open one shows its panel */
 var SELECTORS=[
  '#header .header-top .search input.search-input',
  '.cart-empty .search input.search-input',
  '.empty-cart-boxes .search-form input[name="string"]'
 ];

 function catalog(){return window.OKLA_V86_CATALOG||{}}

 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}

 function priceText(v){
  var n=Math.round(Number(String(v).replace(/[\s ]/g,'').replace(',','.')));
  if(!isFinite(n)||n<=0)return '';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč';
 }

 function el(tag,cls,text){
  var n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!=null)n.textContent=text;
  return n;
 }

 function isOpen(){return document.documentElement.classList.contains('okla-search-open')}

 /* Searches the whole shop with the given text, through Shoptet's own form. */
 function searchShop(inst,text){
  inst.input.value=text;
  close();
  var btn=inst.form.querySelector('button[type=submit]');
  if(btn)btn.click();
  else inst.form.submit();
 }

 function productRow(p,hot){
  var a=el('a','okla-search-item');
  a.href=p.url||'#';
  a.setAttribute('role','option');
  var img=el('img','okla-search-item__img');
  img.alt='';
  img.loading='lazy';
  img.src=p.image||'';
  var info=el('span','okla-search-item__info');
  info.appendChild(el('span','okla-search-item__name',p.name||''));
  if(hot){
   var badge=el('span','okla-search-item__hot','Často hledané');
   info.appendChild(badge);
  }
  a.append(img,info);
  var price=priceText(p.price);
  if(price)a.appendChild(el('span','okla-search-item__price',price));
  return a;
 }

 function matches(q){
  var words=norm(q).split(/\s+/).filter(Boolean);
  var all=catalog(),out=[];
  Object.keys(all).forEach(function(code){
   var p=all[code];
   var hay=norm((p.name||'')+' '+(p.brand||'')+' '+(p.defaultCategory||''));
   if(words.every(function(w){return hay.indexOf(w)!==-1}))out.push(p);
  });
  return out;
 }

 function render(inst){
  var q=inst.input.value.trim();
  inst.panel.textContent='';
  inst.items=[];
  inst.active=-1;
  if(!q){
   var chips=el('div','okla-search-chips');
   POPULAR_TERMS.forEach(function(t){
    var c=el('button','okla-search-chip',t);
    c.type='button';
    c.addEventListener('click',function(){searchShop(inst,t)});
    chips.appendChild(c);
   });
   inst.panel.appendChild(chips);
   /* The cart (lite) field shows only the popular chips when empty, no product list. */
   if(!inst.lite){
    var all=catalog();
    POPULAR_CODES.forEach(function(code,i){
     if(!all[code])return;
     var row=productRow(all[code],i<HOT);
     inst.panel.appendChild(row);
     inst.items.push(row);
    });
   }
   return;
  }
  var found=matches(q);
  if(found.length){
   inst.panel.appendChild(el('p','okla-search-heading','Produkty'));
   found.slice(0,inst.lite?1:MAX_RESULTS).forEach(function(p){
    var row=productRow(p,POPULAR_CODES.indexOf(p.code)!==-1&&POPULAR_CODES.indexOf(p.code)<HOT);
    inst.panel.appendChild(row);
    inst.items.push(row);
   });
  }else{
   inst.panel.appendChild(el('p','okla-search-empty','Mezi produkty jsme pro „'+q+'“ nic nenašli. Zkuste hledat v celém obchodě.'));
  }
  var allBtn=el('button','okla-search-all','Zobrazit všechny výsledky pro „'+q+'“');
  allBtn.type='button';
  allBtn.addEventListener('click',function(){searchShop(inst,q)});
  inst.panel.appendChild(allBtn);
  inst.items.push(allBtn);
 }

 function mark(inst,i){
  inst.items.forEach(function(n,k){n.classList.toggle('is-active',k===i)});
  inst.active=i;
  if(inst.items[i]&&inst.items[i].scrollIntoView)inst.items[i].scrollIntoView({block:'nearest'});
 }

 function open(inst){
  if(!desktop.matches||!inst.panel)return;
  if(openInst&&openInst!==inst)close();
  openInst=inst;
  render(inst);
  /* With more than one field only the focused one's panel is shown. */
  instances.forEach(function(x){if(x.panel)x.panel.style.display=(x===inst?'block':'none')});
  /* The header field blurs the page behind its panel; the cart field does not. */
  if(!inst.lite)document.documentElement.classList.add('okla-search-open');
  inst.input.setAttribute('aria-expanded','true');
 }

 function close(){
  document.documentElement.classList.remove('okla-search-open');
  if(openInst)openInst.input.setAttribute('aria-expanded','false');
  instances.forEach(function(x){if(x.panel)x.panel.style.display=''});
  openInst=null;
 }

 function onKey(inst,e){
  if(!isOpen()||openInst!==inst)return;
  if(e.key==='Escape'){e.preventDefault();close();inst.input.blur();return}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   if(!inst.items.length)return;
   e.preventDefault();
   var n=e.key==='ArrowDown'?inst.active+1:inst.active-1;
   if(n<0)n=inst.items.length-1;
   if(n>=inst.items.length)n=0;
   mark(inst,n);
   return;
  }
  if(e.key==='Enter'&&inst.active>=0&&inst.items[inst.active]){
   e.preventDefault();
   inst.items[inst.active].click();
  }
 }

 function ensureOverlay(){
  if(overlay)return;
  overlay=el('div','okla-search-overlay');
  overlay.setAttribute('aria-hidden','true');
  document.body.appendChild(overlay);
  overlay.addEventListener('mousedown',function(){var i=openInst;close();if(i)i.input.blur()});
 }

 function attach(input){
  if(!input||input.closest('#okla-v61-header'))return false;
  if(input.__oklaSearchBound)return true;
  var form=input.closest('form');
  var box=input.closest('.search')||form;
  if(!form||!box)return false;
  ensureOverlay();
  var panel=el('div','okla-search-panel');
  panel.setAttribute('role','listbox');
  panel.setAttribute('aria-label','Návrhy vyhledávání');
  box.appendChild(panel);
  var inst={input:input,form:form,box:box,panel:panel,items:[],active:-1,lite:!input.closest('#header')};
  instances.push(inst);
  input.__oklaSearchBound=true;
  input.setAttribute('aria-expanded','false');
  /* A click in the panel keeps the focus in the field, so the panel stays open until the link or button acts. */
  panel.addEventListener('mousedown',function(e){e.preventDefault()});
  input.addEventListener('focus',function(){open(inst)});
  input.addEventListener('click',function(){if(!isOpen())open(inst)});
  input.addEventListener('input',function(){if(isOpen()&&openInst===inst)render(inst);else open(inst)});
  input.addEventListener('blur',function(){setTimeout(function(){if(document.activeElement!==input)close()},120)});
  input.addEventListener('keydown',function(e){onKey(inst,e)});
  return true;
 }

 function setupAll(){
  var any=false;
  SELECTORS.forEach(function(sel){
   document.querySelectorAll(sel).forEach(function(inp){if(attach(inp))any=true});
  });
  return any;
 }

 function start(){
  var onChange=function(){if(!desktop.matches)close()};
  if(desktop.addEventListener)desktop.addEventListener('change',onChange);
  else if(desktop.addListener)desktop.addListener(onChange);
  setupAll();
  /* The header and the cart can still be built by the other scripts; the fields are looked for again for a few seconds. */
  var tries=0;
  var t=setInterval(function(){setupAll();if(++tries>20)clearInterval(t)},250);
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
