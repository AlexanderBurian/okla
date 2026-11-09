/* OKLA – an open search bar at the very top of the homepage, so visitors can
   type straight away instead of first tapping the magnifier. It submits through
   the shop's own search (the native input[name="string"] form), so results are
   the real Shoptet search. It sits on top of the page-top gradient (a white
   field over the wash) without changing it. Not a copy of anyone else's layout. */
(function(){
 'use strict';
 if(window.__oklaHomeSearchV1)return;window.__oklaHomeSearchV1=true;

 function isHome(){return !!(document.body&&document.body.classList.contains('type-index'))}

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
  +'.okla-hsearch{width:100%;margin:0 0 16px;font-family:"Exo 2",Arial,sans-serif}'
  +'@media(min-width:768px){.okla-hsearch{display:none!important}}'
  +'.okla-hsearch__form{display:flex;align-items:center;gap:10px;width:100%;max-width:680px;margin:0 auto;box-sizing:border-box;height:52px;padding:0 8px 0 16px;background:#fff;border:1px solid #e1e8f1;border-radius:12px;box-shadow:0 4px 16px rgba(18,41,68,.08)}'
  +'.okla-hsearch__form:focus-within{border-color:#0074e8;box-shadow:0 4px 18px rgba(0,116,232,.16)}'
  +'html body .okla-hsearch .okla-hsearch__form,html body .okla-hsearch .okla-hsearch__in,html body .okla-hsearch .okla-hsearch__btn{outline:none!important}'
  +'html body .okla-hsearch .okla-hsearch__in:is(:focus,:focus-visible,:active){outline:none!important;box-shadow:none!important;border:0!important}'
  +'.okla-hsearch__ic{flex:0 0 22px;width:22px;height:22px;color:#64748b}'
  +'.okla-hsearch__ic svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block}'
  +'.okla-hsearch__in{flex:1 1 auto;min-width:0;height:100%;border:0!important;outline:none!important;box-shadow:none!important;background:transparent;color:#0b2540;font:400 16px/1.2 "Exo 2",Arial,sans-serif}'
  +'.okla-hsearch__in::placeholder{color:#8a97a8}'
  +'.okla-hsearch__btn{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 18px;border:0;border-radius:9px;background:#0074e8;color:#fff;font:700 14px/1 "Exo 2",Arial,sans-serif;cursor:pointer}'
  +'.okla-hsearch__btn:hover{background:#0068d1}'
  +'@media(max-width:767px){.okla-hsearch{margin:2px 0 14px}.okla-hsearch__form{height:48px;padding:0 6px 0 14px}.okla-hsearch__btn{height:38px;padding:0 14px;font-size:13px}}';

 var MAG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>';

 function build(){
  var sec=document.createElement('section');
  sec.className='okla-hsearch';
  sec.setAttribute('aria-label','Vyhledávání');
  sec.innerHTML='<form class="okla-hsearch__form" role="search">'
   +'<span class="okla-hsearch__ic" aria-hidden="true">'+MAG+'</span>'
   +'<input class="okla-hsearch__in" type="search" enterkeyhint="search" autocomplete="off" aria-label="Co hledáte?" placeholder="Co hledáte?">'
   +'<button class="okla-hsearch__btn" type="submit">Hledat</button>'
   +'</form>';
  var form=sec.querySelector('form'),input=sec.querySelector('input');
  form.addEventListener('submit',function(e){e.preventDefault();runSearch(input.value)});
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
