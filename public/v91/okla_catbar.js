/* OKLA – PC category bar under the header (DATART style): the shop's top categories in one row; pointing at one (or
   focusing it) opens a white panel under the bar with the category's best sellers - photo, name, price - taken from
   the category page's own "Nejprodávanější" box (fetched once, on first open), and a "Zobrazit vše" link. The page
   behind is dimmed while the panel is open. PC only (≥992px), not in the checkout. The bar is as wide as the
   header and the content (Shoptet's .container), not the whole window. */
(function(){
 'use strict';
 if(window.__oklaCatbarV1)return;window.__oklaCatbarV1=true;
 var b=document.body;if(!b||/(^|\s)(in-kosik|in-krok-\d|ordering-process|in-objednavka|in-dokonceni)/.test(b.className))return;
 var SKIP=/obchodni-podminky|kontakt|blog|clanky|newsroom/i;
 function nice(t){t=t.replace(/\s+/g,' ').trim();if(t===t.toUpperCase())t=t.charAt(0)+t.slice(1).toLowerCase();return t.replace(/ a nářadí$/i,'')}
 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function cats(){
  var out=[],seen={};
  [].forEach.call(document.querySelectorAll('#navigation .menu-level-1>li>a[href]'),function(a){
   var href=a.getAttribute('href'),t=nice(a.textContent||'');
   if(!t||!href||href==='#'||SKIP.test(href)||seen[href])return;seen[href]=1;out.push({href:href,label:t});
  });
  return out.slice(0,9);
 }
 var cache={};
 function load(href){
  if(cache[href])return cache[href];
  cache[href]=fetch(href,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(html){
   var doc=new DOMParser().parseFromString(html,'text/html'),list=[];
   var cards=doc.querySelectorAll('#productsTop .p, .products-top .p');
   if(!cards.length)cards=doc.querySelectorAll('#products .p, .products-block .p');
   [].some.call(cards,function(p){
    var a=p.querySelector('a.name'),img=p.querySelector('a.image img'),price=p.querySelector('.price-final strong, .price-final');
    if(!a)return false;
    var src=img&&(img.getAttribute('data-src')||img.getAttribute('src'))||'';if(/^data:/.test(src))src='';
    list.push({href:a.getAttribute('href'),name:(a.textContent||'').replace(/\s+/g,' ').trim(),img:src,price:price?(price.textContent||'').replace(/\s+/g,' ').trim():''});
    return list.length>=6;
   });
   return list;
  }).catch(function(){return []});
  return cache[href];
 }
 function build(list){
  var bar=el('nav','okla-catbar container');bar.id='okla-catbar';bar.setAttribute('aria-label','Kategorie');
  var inner=el('div','okcb-inner'),ul=el('ul','okcb-list');
  var panel=el('div','okcb-panel');panel.id='okla-catbar-panel';panel.hidden=true;
  var dim=el('div','okcb-dim');dim.hidden=true;
  var openIdx=-1,tOpen=0,tClose=0;
  function render(i){
   var c=list[i];panel.innerHTML='';
   var wrap=el('div','okcb-panel-in');
   var head=el('div','okcb-head');var h=el('a','okcb-title',c.label);h.href=c.href;var all=el('a','okcb-all','Zobrazit vše');all.href=c.href;head.append(h,all);
   var grid=el('div','okcb-grid');grid.appendChild(el('p','okcb-loading','Načítám…'));
   wrap.append(head,grid);panel.appendChild(wrap);
   load(c.href).then(function(items){
    if(openIdx!==i)return;grid.innerHTML='';
    if(!items.length){grid.appendChild(el('p','okcb-loading',''));return}
    items.forEach(function(it){
     var a=el('a','okcb-item');a.href=it.href;
     var f=el('span','okcb-img');if(it.img){var im=el('img');im.src=it.img;im.alt='';im.loading='lazy';f.appendChild(im)}
     var n=el('span','okcb-name',it.name),p=el('span','okcb-price',it.price);
     a.append(f,n,p);grid.appendChild(a);
    });
   });
  }
  function open(i){
   clearTimeout(tClose);if(openIdx===i)return;openIdx=i;
   [].forEach.call(ul.children,function(li,k){li.firstChild.setAttribute('aria-expanded',k===i?'true':'false');li.classList.toggle('is-open',k===i)});
   render(i);panel.hidden=false;dim.hidden=false;document.documentElement.classList.add('okcb-open');
  }
  function close(){
   clearTimeout(tOpen);openIdx=-1;panel.hidden=true;dim.hidden=true;document.documentElement.classList.remove('okcb-open');
   [].forEach.call(ul.children,function(li){li.firstChild.setAttribute('aria-expanded','false');li.classList.remove('is-open')});
  }
  list.forEach(function(c,i){
   var li=el('li','okcb-li'),a=el('a','okcb-link',c.label);a.href=c.href;a.setAttribute('aria-expanded','false');a.setAttribute('aria-controls','okla-catbar-panel');
   li.appendChild(a);ul.appendChild(li);
   li.addEventListener('mouseenter',function(){clearTimeout(tClose);clearTimeout(tOpen);tOpen=setTimeout(function(){open(i)},openIdx>=0?0:140)});
   a.addEventListener('focus',function(){open(i)});
  });
  bar.addEventListener('mouseleave',function(){clearTimeout(tOpen);tClose=setTimeout(close,220)});
  panel.addEventListener('mouseenter',function(){clearTimeout(tClose)});
  panel.addEventListener('mouseleave',function(){tClose=setTimeout(close,220)});
  dim.addEventListener('click',close);
  /* the bar scrolled away under a still mouse: the panel closes */
  window.addEventListener('scroll',function(){if(openIdx>=0&&bar.getBoundingClientRect().bottom<0)close()},{passive:true});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&openIdx>=0){var a=ul.children[openIdx].firstChild;close();a.focus()}});
  bar.addEventListener('focusout',function(e){if(!bar.contains(e.relatedTarget)&&!panel.contains(e.relatedTarget))close()});
  panel.addEventListener('focusout',function(e){if(!bar.contains(e.relatedTarget)&&!panel.contains(e.relatedTarget))close()});
  inner.appendChild(ul);bar.append(inner,panel);
  return {bar:bar,dim:dim};
 }
 function mount(){
  if(document.getElementById('okla-catbar'))return true;
  var header=document.getElementById('header');if(!header)return false;
  var list=cats();if(list.length<3)return false;
  var x=build(list);header.appendChild(x.bar);document.body.appendChild(x.dim);
  document.documentElement.classList.add('okla-catbar-on');
  /* exactly as wide as the header's own row (the content column) */
  function sync(){var n=header.querySelector('.navigation-wrapper');if(n&&n.offsetWidth)x.bar.style.setProperty('width',n.offsetWidth+'px','important');
   /* the grey band and the panel's white run across the whole window: how far the window reaches past the bar (the
      page is zoomed by --okla-dz, so window pixels are divided by it) */
   var dz=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--okla-dz'))||1;
   x.bar.style.setProperty('--okcb-out',(x.bar.getBoundingClientRect().left/dz)+'px');
   x.bar.style.setProperty('--okcb-w',(document.documentElement.clientWidth/dz)+'px')}
  sync();window.addEventListener('resize',sync);setTimeout(sync,600);setTimeout(sync,2000);
  /* the current category stays marked */
  [].forEach.call(x.bar.querySelectorAll('.okcb-link'),function(a){if(location.pathname.indexOf(a.getAttribute('href'))===0)a.classList.add('is-current')});
  return true;
 }
 var tries=0;
 (function tick(){if(mount())return;if(++tries<60)setTimeout(tick,150)})();
})();
