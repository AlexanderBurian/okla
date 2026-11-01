/* OKLA desktop search, as on Alza: when the search field is focused the rest of the page is blurred and a panel opens
   right under the field. Empty field: popular searches and frequently searched products. While typing: the matching
   products from the catalogue and a row that searches the whole shop. Phones keep Shoptet's own search. */
(function(){
 'use strict';
 if(window.__oklaSearchV1)return;
 window.__oklaSearchV1=true;

 var POPULAR_TERMS=['Flipper Zero','ESP32','Chytré brýle','Endoskop','Projektor','Termokamera'];
 var POPULAR_CODES=['OKL-001','OKL-030','OKL-006','OKL-020','OKL-004','OKL-032'];
 var HOT=3;
 var MAX_RESULTS=6;
 var desktop=window.matchMedia('(min-width: 992px)');

 var box=null,input=null,form=null,panel=null,overlay=null;
 var items=[],active=-1;

 function catalog(){return window.OKLA_V86_CATALOG||{}}

 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}

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
 function searchShop(text){
  input.value=text;
  close();
  var btn=form.querySelector('button[type=submit]');
  if(btn)btn.click();
  else form.submit();
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

 function render(){
  var q=input.value.trim();
  panel.textContent='';
  items=[];
  active=-1;
  if(!q){
   var chips=el('div','okla-search-chips');
   POPULAR_TERMS.forEach(function(t){
    var c=el('button','okla-search-chip',t);
    c.type='button';
    c.addEventListener('click',function(){searchShop(t)});
    chips.appendChild(c);
   });
   panel.appendChild(chips);
   var all=catalog();
   POPULAR_CODES.forEach(function(code,i){
    if(!all[code])return;
    var row=productRow(all[code],i<HOT);
    panel.appendChild(row);
    items.push(row);
   });
   return;
  }
  var found=matches(q);
  if(found.length){
   panel.appendChild(el('p','okla-search-heading','Produkty'));
   found.slice(0,MAX_RESULTS).forEach(function(p){
    var row=productRow(p,POPULAR_CODES.indexOf(p.code)!==-1&&POPULAR_CODES.indexOf(p.code)<HOT);
    panel.appendChild(row);
    items.push(row);
   });
  }else{
   panel.appendChild(el('p','okla-search-empty','Mezi produkty jsme pro „'+q+'“ nic nenašli. Zkuste hledat v celém obchodě.'));
  }
  var allBtn=el('button','okla-search-all','Zobrazit všechny výsledky pro „'+q+'“');
  allBtn.type='button';
  allBtn.addEventListener('click',function(){searchShop(q)});
  panel.appendChild(allBtn);
  items.push(allBtn);
 }

 function mark(i){
  items.forEach(function(n,k){n.classList.toggle('is-active',k===i)});
  active=i;
  if(items[i]&&items[i].scrollIntoView)items[i].scrollIntoView({block:'nearest'});
 }

 function open(){
  if(!desktop.matches||!panel)return;
  render();
  document.documentElement.classList.add('okla-search-open');
  input.setAttribute('aria-expanded','true');
 }

 function close(){
  document.documentElement.classList.remove('okla-search-open');
  if(input)input.setAttribute('aria-expanded','false');
  active=-1;
 }

 function onKey(e){
  if(!isOpen())return;
  if(e.key==='Escape'){e.preventDefault();close();input.blur();return}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   if(!items.length)return;
   e.preventDefault();
   var n=e.key==='ArrowDown'?active+1:active-1;
   if(n<0)n=items.length-1;
   if(n>=items.length)n=0;
   mark(n);
   return;
  }
  if(e.key==='Enter'&&active>=0&&items[active]){
   e.preventDefault();
   items[active].click();
  }
 }

 function setup(){
  input=document.querySelector('#header .header-top .search input.search-input');
  if(!input||input.closest('#okla-v61-header'))return false;
  form=input.closest('form');
  box=input.closest('.search')||form;
  if(!form||!box)return false;
  overlay=el('div','okla-search-overlay');
  overlay.setAttribute('aria-hidden','true');
  document.body.appendChild(overlay);
  panel=el('div','okla-search-panel');
  panel.id='okla-search-panel';
  panel.setAttribute('role','listbox');
  panel.setAttribute('aria-label','Návrhy vyhledávání');
  box.appendChild(panel);
  input.setAttribute('aria-controls','okla-search-panel');
  input.setAttribute('aria-expanded','false');
  /* A click in the panel keeps the focus in the field, so the panel stays open until the link or button acts. */
  panel.addEventListener('mousedown',function(e){e.preventDefault()});
  overlay.addEventListener('mousedown',function(){close();input.blur()});
  input.addEventListener('focus',open);
  input.addEventListener('click',function(){if(!isOpen())open()});
  input.addEventListener('input',function(){if(isOpen())render();else open()});
  input.addEventListener('blur',function(){setTimeout(function(){if(document.activeElement!==input)close()},120)});
  input.addEventListener('keydown',onKey);
  var onChange=function(){if(!desktop.matches)close()};
  if(desktop.addEventListener)desktop.addEventListener('change',onChange);
  else if(desktop.addListener)desktop.addListener(onChange);
  return true;
 }

 function start(){
  if(setup())return;
  /* The header can still be built by the other scripts; the field is looked for again for a few seconds. */
  var tries=0;
  var t=setInterval(function(){if(setup()||++tries>20)clearInterval(t)},250);
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
 else start();
})();
