/* OKLA – an open search bar at the very top of the homepage, so visitors can
   type straight away instead of first tapping the magnifier. As they type it
   shows live product results (name, photo, price) in a dropdown — the same
   results as the shop's own whisper search (/action/ProductSearch/ajaxSearch/) —
   and still submits the real Shoptet search on Enter / the button. Mobile only;
   the 16px input keeps iOS from zooming in. Not a copy of anyone else's layout. */
(function(){
 'use strict';
 if(window.__oklaHomeSearchV1)return;window.__oklaHomeSearchV1=true;

 function isHome(){return !!(document.body&&document.body.classList.contains('type-index'))}
 function lang(){var l=document.querySelector('input[name="language"]');return (l&&l.value)||document.documentElement.lang||'cs';}

 function runSearch(term){
  term=(term||'').trim();
  if(!term)return;
  var ns=document.querySelector('input[name="string"]');
  if(ns){
   var form=ns.closest('form');
   ns.value=term;
   ns.dispatchEvent(new Event('input',{bubbles:true}));
   if(form){try{if(form.requestSubmit)form.requestSubmit();else form.submit();return;}catch(e){}}
  }
  location.href='/vyhledavani/?q='+encodeURIComponent(term);
 }

 var CSS=''
  +'.okla-hsearch{position:relative;width:100%;margin:0 0 16px;font-family:"Exo 2",Arial,sans-serif}'
  +'@media(min-width:768px){.okla-hsearch{display:none!important}}'
  +'.okla-hsearch__form{display:flex;align-items:center;gap:10px;width:100%;max-width:680px;margin:0 auto;box-sizing:border-box;height:52px;padding:0 8px 0 16px;background:#fff;border:1px solid #e1e8f1;border-radius:12px;box-shadow:0 4px 16px rgba(18,41,68,.08)}'
  +'.okla-hsearch__form:focus-within{border-color:#0074e8;box-shadow:0 4px 18px rgba(0,116,232,.16)}'
  +'html body .okla-hsearch .okla-hsearch__form,html body .okla-hsearch .okla-hsearch__in,html body .okla-hsearch .okla-hsearch__btn{outline:none!important}'
  +'html body .okla-hsearch .okla-hsearch__in:is(:focus,:focus-visible,:active){outline:none!important;box-shadow:none!important;border:0!important}'
  +'.okla-hsearch__ic{flex:0 0 22px;width:22px;height:22px;color:#64748b}'
  +'.okla-hsearch__ic svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block}'
  +'.okla-hsearch__in{flex:1 1 auto;min-width:0;height:100%;border:0!important;outline:none!important;box-shadow:none!important;background:transparent;color:#1a1a1a;font:400 16px/1.2 "Exo 2",Arial,sans-serif}'
  +'.okla-hsearch__in::placeholder{color:#8a97a8}'
  +'.okla-hsearch__btn{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 18px;border:0;border-radius:9px;background:#0074e8;color:#fff;font:700 14px/1 "Exo 2",Arial,sans-serif;cursor:pointer}'
  +'.okla-hsearch__btn:hover{background:#0068d1}'
  /* live results dropdown */
  +'.okla-hsearch__res{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:60;box-sizing:border-box;width:100%;max-width:680px;margin:0 auto;background:#fff;border:1px solid #e6ecf4;border-radius:12px;box-shadow:0 14px 34px rgba(18,41,68,.16);overflow:hidden;max-height:70vh;overflow-y:auto;-webkit-overflow-scrolling:touch;display:none}'
  +'.okla-hsearch__res.is-open{display:block}'
  +'.okla-hsearch__cats{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px 4px}'
  +'.okla-hsearch__cat{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:#eef4fd;color:#005cbd;font:600 12.5px/1 "Exo 2",Arial,sans-serif;text-decoration:none;white-space:nowrap}'
  +'.okla-hsearch__cat:active{background:#e0ebfb}'
  +'.okla-hsearch__item{display:flex;align-items:center;gap:12px;padding:10px 14px;text-decoration:none;border-top:1px solid #f1f4f8}'
  +'.okla-hsearch__item:first-child{border-top:0}'
  +'.okla-hsearch__cats + .okla-hsearch__item{border-top:1px solid #f1f4f8;margin-top:6px}'
  +'.okla-hsearch__item:active{background:#f7faff}'
  +'.okla-hsearch__thumb{flex:0 0 46px;width:46px;height:46px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid #eef1f5}'
  +'.okla-hsearch__meta{flex:1 1 auto;min-width:0}'
  +'.okla-hsearch__name{display:block;color:#1a1a1a;font:600 14px/1.3 "Exo 2",Arial,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
  +'.okla-hsearch__price{flex:0 0 auto;color:#d92b20;font:700 14px/1 "Exo 2",Arial,sans-serif;white-space:nowrap}'
  +'.okla-hsearch__all{display:block;padding:13px 14px;text-align:center;text-decoration:none;color:#0074e8;background:#f6faff;border-top:1px solid #eef1f5;font:700 13px/1 "Exo 2",Arial,sans-serif;cursor:pointer}'
  +'.okla-hsearch__empty{padding:16px 14px;text-align:center;color:#555;font:500 13px/1.4 "Exo 2",Arial,sans-serif}'
  +'@media(max-width:767px){.okla-hsearch{margin:2px 0 14px}.okla-hsearch__form{height:48px;padding:0 6px 0 14px}.okla-hsearch__btn{height:38px;padding:0 14px;font-size:13px}}';

 var MAG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>';

 function esc(s){return (s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

 /* Turn the whisperer HTML into a small, clean set of rows. */
 function render(box,html,term){
  var doc=new DOMParser().parseFromString(html,'text/html');
  var parts='';
  /* category / section shortcuts */
  var cats=[].slice.call(doc.querySelectorAll('a.search-whisperer-category')).slice(0,4);
  if(cats.length){
   parts+='<div class="okla-hsearch__cats">';
   cats.forEach(function(a){
    var name=(a.querySelector('span')?a.querySelector('span').textContent:a.textContent).trim();
    parts+='<a class="okla-hsearch__cat" href="'+esc(a.getAttribute('href'))+'">'+esc(name)+'</a>';
   });
   parts+='</div>';
  }
  /* products */
  var lis=[].slice.call(doc.querySelectorAll('.search-whisperer-products li, li[data-testid="productItem"]')).slice(0,6);
  lis.forEach(function(li){
   var a=li.querySelector('a');if(!a)return;
   var img=li.querySelector('img');
   var src=img?(img.getAttribute('data-src')||img.getAttribute('src')||''):'';
   var name=(li.querySelector('.p-name')||{}).textContent||a.textContent;
   var pr=li.querySelector('.price-final,.price');
   var price=pr?pr.textContent.replace(/\s+/g,' ').trim():'';
   parts+='<a class="okla-hsearch__item" href="'+esc(a.getAttribute('href'))+'">'
     +(src?'<img class="okla-hsearch__thumb" src="'+esc(src)+'" alt="" loading="lazy">':'<span class="okla-hsearch__thumb"></span>')
     +'<span class="okla-hsearch__meta"><span class="okla-hsearch__name">'+esc(name.trim())+'</span></span>'
     +(price?'<span class="okla-hsearch__price">'+esc(price)+'</span>':'')
     +'</a>';
  });
  if(!parts){
   box.innerHTML='<div class="okla-hsearch__empty">Nic jsme nenašli. Zkuste jiný výraz.</div>';
  }else{
   parts+='<a class="okla-hsearch__all" data-okla-all="1">Zobrazit všechny výsledky</a>';
   box.innerHTML=parts;
  }
  box.classList.add('is-open');
 }

 var ctrl=null;
 function fetchResults(box,term){
  if(ctrl){try{ctrl.abort();}catch(e){}}
  ctrl=('AbortController' in window)?new AbortController():null;
  var url='/action/ProductSearch/ajaxSearch/?language='+encodeURIComponent(lang())+'&string='+encodeURIComponent(term);
  fetch(url,{headers:{'X-Requested-With':'XMLHttpRequest'},signal:ctrl?ctrl.signal:undefined})
   .then(function(r){return r.json();})            /* response is a JSON string of HTML */
   .then(function(html){if(typeof html!=='string')html=String(html||'');render(box,html,term);})
   .catch(function(){/* aborted or network error: leave the dropdown as-is */});
 }

 function build(){
  var sec=document.createElement('section');
  sec.className='okla-hsearch';
  sec.setAttribute('aria-label','Vyhledávání');
  sec.innerHTML='<form class="okla-hsearch__form" role="search">'
   +'<span class="okla-hsearch__ic" aria-hidden="true">'+MAG+'</span>'
   +'<input class="okla-hsearch__in" type="search" enterkeyhint="search" autocomplete="off" aria-label="Co hledáte?" placeholder="Co hledáte?">'
   +'<button class="okla-hsearch__btn" type="submit">Hledat</button>'
   +'</form>'
   +'<div class="okla-hsearch__res" role="listbox" aria-label="Našeptávač"></div>';
  var form=sec.querySelector('form'),input=sec.querySelector('input'),box=sec.querySelector('.okla-hsearch__res');

  form.addEventListener('submit',function(e){e.preventDefault();runSearch(input.value);});

  var timer=null;
  input.addEventListener('input',function(){
   var term=input.value.trim();
   if(timer)clearTimeout(timer);
   if(term.length<2){box.classList.remove('is-open');box.innerHTML='';return;}
   timer=setTimeout(function(){fetchResults(box,term);},170);
  });
  input.addEventListener('focus',function(){if(box.innerHTML&&input.value.trim().length>=2)box.classList.add('is-open');});

  /* "show all" footer runs the full search */
  box.addEventListener('click',function(e){
   var all=e.target.closest('[data-okla-all]');
   if(all){e.preventDefault();runSearch(input.value);}
  });

  /* close on outside tap / Escape */
  document.addEventListener('click',function(e){if(!sec.contains(e.target))box.classList.remove('is-open');});
  input.addEventListener('keydown',function(e){if(e.key==='Escape')box.classList.remove('is-open');});

  return sec;
 }

 function mount(){
  if(!isHome())return true;
  if(document.querySelector('.okla-hsearch'))return true;
  var content=document.querySelector('#content .content-inner')||document.querySelector('main#content')||document.querySelector('#content');
  if(!content)return false;
  var banners=content.querySelector('.banners-row');
  var sec=build();
  if(banners&&banners.parentNode)banners.parentNode.insertBefore(sec,banners);
  else content.insertBefore(sec,content.firstChild);
  if(!document.getElementById('okla-hsearch-style')){var st=document.createElement('style');st.id='okla-hsearch-style';st.textContent=CSS;document.head.appendChild(st);}
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
