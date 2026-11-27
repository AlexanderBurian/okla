/* OKLA – PC category pages: the left column as on the big marketplaces. Under "Kategorie" a "Filtry" panel built from the
   shop's own filters, so every choice really filters (each one is a plain link to the filtered listing - the shop's
   own address for it): quick picks, then sections that fold - Dostupnost (in stock, with its count), Značka (the
   category's brands with their counts, the first five and "Více"), Cena (from - to, and three price bands worked out
   from the category's own cheapest and dearest product). At the end of the column a few links that help with a
   purchase, as on the big shops. The shop's own filter box and "Top 10 produktů" are not shown (okla_cat_facets.css).
   Phones have no left column. */
(function(){
 'use strict';
 if(window.__oklaCatFacets)return;window.__oklaCatFacets=true;
 var b=document.body;
 if(!b||!/(^|\s)type-category(\s|$)/.test(b.className))return;
 if(!window.matchMedia||!matchMedia('(min-width:992px)').matches)return; /* phones: no left column */

 function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
 function num(t){var m=String(t||'').replace(/\s+/g,'').match(/\d+/);return m?+m[0]:0}
 function money(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'}
 var CHEV='<svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 6.5 6 1.5l5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var ARROW='<svg viewBox="0 0 8 12" aria-hidden="true"><path d="m2 1.5 4.5 4.5L2 10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

 /* the listing's address with the price set (or removed); the page number is dropped - a new filter starts at page 1 */
 function priceUrl(min,max){
  var u=new URL(location.href);u.pathname=u.pathname.replace(/strana-\d+\/?$/,'');
  if(min==null){u.searchParams.delete('priceMin');u.searchParams.delete('priceMax')}
  else{u.searchParams.set('priceMin',min);u.searchParams.set('priceMax',max)}
  return u.pathname+u.search;
 }
 /* a round step for the price bands */
 function round(v,step){return Math.max(step,Math.round(v/step)*step)}

 function option(href,label,count,on,radio){
  var a=el('a','okla-fac-opt'+(radio?' is-radio':'')+(on?' is-on':''));a.href=href;a.setAttribute('role',radio?'menuitemradio':'menuitemcheckbox');a.setAttribute('aria-checked',on?'true':'false');
  a.appendChild(el('span','okla-fac-opt__box'));a.appendChild(el('span','okla-fac-opt__label',label));
  if(count!=null)a.appendChild(el('span','okla-fac-opt__count','('+count+')'));
  return a;
 }
 function section(title,open){
  var s=el('section','okla-fac'+(open?' is-open':''));
  var h=el('button','okla-fac__head');h.type='button';h.setAttribute('aria-expanded',open?'true':'false');
  h.appendChild(el('span','',title));h.insertAdjacentHTML('beforeend',CHEV);
  var body=el('div','okla-fac__body');
  h.addEventListener('click',function(){var o=!s.classList.contains('is-open');s.classList.toggle('is-open',o);h.setAttribute('aria-expanded',o?'true':'false')});
  s.append(h,body);return {s:s,body:body};
 }

 function build(){
  var side=document.querySelector('aside.sidebar-left .sidebar-inner');
  var filters=side&&side.querySelector('#filters');
  if(!side||!filters)return false;
  var old=document.getElementById('okla-facets');if(old)old.remove();

  var stock=filters.querySelector('input[data-filter-code="stock"]');
  var brands=[].slice.call(filters.querySelectorAll('input[data-filter-code="manufacturerId"]')).map(function(i){
   var lab=filters.querySelector('label[for="'+CSS.escape(i.id)+'"]'),c=lab&&lab.querySelector('.filter-count');
   var name=lab?lab.textContent.replace(c?c.textContent:'','').replace(/ /g,' ').trim():i.value;
   return {name:name,count:c?num(c.textContent):null,url:i.getAttribute('data-url'),on:i.checked};
  }).filter(function(x){return x.url&&!/^n\/?a$/i.test(x.name)});
  var catMin=num((document.getElementById('categoryMinValue')||{}).textContent),catMax=num((document.getElementById('categoryMaxValue')||{}).textContent);
  var q=new URL(location.href).searchParams,curMin=q.has('priceMin')?+q.get('priceMin'):null,curMax=q.has('priceMax')?+q.get('priceMax'):null;
  var filtered=(stock&&stock.checked)||brands.some(function(x){return x.on})||curMin!=null;
  /* the price bands come from the whole category (the shop gives the filtered listing's range once a filter is on):
     remembered from the unfiltered page for this visit */
  var base=location.pathname.replace(/strana-\d+\/?$/,'').replace(/:[^/]+\/$/,'/'),key='okla-fac-range:'+base;
  try{if(!filtered&&catMax>catMin)sessionStorage.setItem(key,catMin+'-'+catMax);else{var m=(sessionStorage.getItem(key)||'').match(/^(\d+)-(\d+)$/);if(m){catMin=+m[1];catMax=+m[2]}}}catch(e){}
  var manyBrands=brands.length>1;

  var box=el('div','box okla-facets');box.id='okla-facets';
  box.appendChild(el('h3','okla-facets__title','Filtry'));

  /* quick picks: in stock, the two brands with the most products, the cheapest band */
  var bands=[];
  if(catMax-catMin>=400){
   var span=catMax-catMin,step=span>3000?500:span>1200?100:50,a=round(catMin+span/3,step),z=round(catMin+span*2/3,step);
   if(z<=a)z=a+step;
   bands=[{label:'do '+money(a),min:catMin,max:a},{label:money(a)+' – '+money(z),min:a,max:z},{label:'od '+money(z),min:z,max:catMax}];
  }
  var chips=el('div','okla-facets__chips');
  function chip(href,label,on){var c=el('a','okla-chip'+(on?' is-on':''),label);c.href=href;if(on)c.setAttribute('aria-current','true');chips.appendChild(c)}
  if(stock)chip(stock.getAttribute('data-url'),'Na skladě',stock.checked);
  if(manyBrands)brands.filter(function(x){return x.count||x.on}).sort(function(x,y){return (y.count||0)-(x.count||0)}).slice(0,2).forEach(function(x){chip(x.url,x.name,x.on)});
  if(bands.length){var c0=bands[0],on0=curMin===c0.min&&curMax===c0.max;chip(on0?priceUrl(null):priceUrl(c0.min,c0.max),bands[0].label,on0)}
  if(chips.children.length)box.appendChild(chips);

  if(stock){
   var s1=section('Dostupnost',true);
   var lab=filters.querySelector('label[for="stock"]');
   s1.body.appendChild(option(stock.getAttribute('data-url'),'Na skladě',lab?num((lab.querySelector('.filter-count')||{}).textContent):null,stock.checked));
   box.appendChild(s1.s);
  }
  if(manyBrands){
   var s2=section('Značka',true),SHOW=5;
   brands.forEach(function(x,i){var o=option(x.url,x.name,x.count,x.on);
    /* nothing to show with this brand under the other filters: greyed, not a link */
    if(x.count===0&&!x.on){o.classList.add('is-empty');o.removeAttribute('href');o.setAttribute('aria-disabled','true')}
    if(i>=SHOW&&!x.on)o.classList.add('is-more');s2.body.appendChild(o)});
   var hidden=s2.body.querySelectorAll('.is-more').length;
   if(hidden){
    var more=el('button','okla-fac__more','Více ('+hidden+')');more.type='button';
    more.addEventListener('click',function(){s2.s.classList.add('is-all');more.remove()});
    s2.body.appendChild(more);
   }
   box.appendChild(s2.s);
  }
  if(catMax>catMin){
   var s3=section('Cena (Kč)',true);
   var f=el('form','okla-fac-price');f.noValidate=true;
   var i1=el('input');i1.type='number';i1.inputMode='numeric';i1.min=0;i1.placeholder='od';i1.setAttribute('aria-label','Cena od');if(curMin!=null)i1.value=curMin;
   var i2=el('input');i2.type='number';i2.inputMode='numeric';i2.min=0;i2.placeholder='do';i2.setAttribute('aria-label','Cena do');if(curMax!=null)i2.value=curMax;
   var go=el('button','okla-fac-price__go','Použít');go.type='submit';
   f.append(i1,el('span','okla-fac-price__dash','–'),i2,go);
   f.addEventListener('submit',function(e){
    e.preventDefault();
    var lo=i1.value===''?catMin:Math.max(0,Math.floor(+i1.value)),hi=i2.value===''?catMax:Math.max(0,Math.ceil(+i2.value));
    if(hi<lo){var t=lo;lo=hi;hi=t}
    location.href=priceUrl(lo,hi);
   });
   s3.body.appendChild(f);
   bands.forEach(function(x){var on=curMin===x.min&&curMax===x.max;s3.body.appendChild(option(on?priceUrl(null):priceUrl(x.min,x.max),x.label,null,on,true))});
   box.appendChild(s3.s);
  }
  /* any filter on: one link back to the whole category */
  if(filtered){
   var clear=el('a','okla-facets__clear','Zrušit všechny filtry');
   clear.href=base;
   box.appendChild(clear);
  }
  var cats=side.querySelector('.box-categories');
  if(cats&&cats.nextSibling)side.insertBefore(box,cats.nextSibling);else side.appendChild(box);

  /* the helpful links at the end of the column */
  if(!document.getElementById('okla-side-links')){
   var I={news:'clipboard',track:'truck',back:'return',shield:'shield',truck:'card',chat:'chat'}; /* v91/img/picto/*.webp */
   var LINKS=[
    ['news','Články a návody','/nase-novinky/','Průvodci a návody k produktům z naší nabídky.'],
    ['track','Stav objednávky','/stav-objednavky/','Zjistěte, kde je vaše zásilka.'],
    ['back','Vrácení do 14 dnů','/vraceni-zbozi-a-odstoupeni/','Zboží můžete vrátit bez udání důvodu.'],
    ['shield','Záruka 24 měsíců','/reklamace/','Na veškeré zboží. Reklamace vyřídíme rychle.'],
    ['truck','Doprava a platba','/doprava-a-platba/','Jak vám zboží doručíme a jak zaplatit.'],
    ['chat','Napište nám','/kontakty/','Potřebujete s něčím poradit?']
   ];
   var lb=el('nav','box okla-side-links');lb.id='okla-side-links';lb.setAttribute('aria-label','Pomoc s nákupem');
   LINKS.forEach(function(l){
    var a=el('a','okla-side-link');a.href=l[2];
    a.innerHTML='<img class="okla-side-link__ic" src="'+(window.__oklaAssetBase||'')+'v91/img/picto/'+I[l[0]]+'.webp" alt="" width="28" height="28" decoding="async">';
    var t=el('span','okla-side-link__text'),h=el('strong','okla-side-link__title',l[1]);h.insertAdjacentHTML('beforeend',ARROW);
    t.append(h,el('span','okla-side-link__desc',l[3]));a.appendChild(t);lb.appendChild(a);
   });
   side.appendChild(lb);
  }
  return true;
 }

 var n=0;(function tick(){if(build())return;if(++n<60)setTimeout(tick,150)})();
 /* the shop redraws its filters after a change made in place (e.g. sorting): the panel is built again from them */
 var queued=false;
 function watch(){
  var f=document.querySelector('aside.sidebar-left #filters');if(!f){if(++watch.n<40)setTimeout(watch,300);return}
  new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;build()})}).observe(f.parentNode||f,{childList:true,subtree:true});
 }
 watch.n=0;watch();
})();
