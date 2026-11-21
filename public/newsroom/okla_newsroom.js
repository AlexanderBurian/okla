/* Okla newsroom – /newsroom and the article list /nase-novinky/. Article grid in the Alza-style layout with a search and
   a category filter. The articles are Shoptet's own (v91/core/okla_articles.js): a new article published in Shoptet
   appears on its own, a removed one disappears, a changed title, picture or text shows at once. On /nase-novinky/ they
   are read from the page itself, on /newsroom from that list. Loaded by zapati_firsthalf.js on these paths only. */
(function(){
'use strict';
if(window.__oklaNewsroomV1)return;
if(!/^\/(newsroom|nase-novinky)(\/|\.html)?$/.test(location.pathname))return;
var A=window.oklaArticles;
if(!A)return;
window.__oklaNewsroomV1=true;

var ICON={
 search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
 clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

var CSS=[
 /* Same rule as the article page: everything in the Shoptet content area except the newsroom is hidden, and the content
    runs the full width. The Shoptet page title therefore does not show twice. */
 'body.okla-newsroom-page #content :not(:has(.okla-newsroom)):not(.okla-newsroom):not(.okla-newsroom *){display:none!important}',
 'body.okla-newsroom-page #content,body.okla-newsroom-page #content :has(.okla-newsroom){max-width:none!important;width:100%!important;margin:0!important;padding:0!important}',
 '.okla-newsroom{box-sizing:border-box;width:100%;padding:28px 28px 72px;color:#081d3a;font-family:inherit}',
 '.okla-newsroom *,.okla-newsroom *::before,.okla-newsroom *::after{box-sizing:border-box}',
 '.okla-newsroom .nr-hero{display:flex;flex-direction:column;align-items:center;padding:76px 24px 60px;border-radius:24px;text-align:center;background:#eef3fa}',
 '.okla-newsroom .nr-title{margin:0;font-size:56px;line-height:1.1;font-weight:700;color:#081d3a}',
 '.okla-newsroom .nr-lead{margin:14px 0 0;max-width:640px;font-size:17px;line-height:1.6;color:#3b4a5e}',
 '.okla-newsroom .nr-controls{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;width:100%;margin-top:44px}',
 '.okla-newsroom .nr-field{position:relative;flex:0 1 240px;min-width:0;margin:0}',
 '.okla-newsroom .nr-field input,.okla-newsroom .nr-field select{width:100%;height:48px;padding:0 44px 0 16px;border:0;border-radius:10px;background:#fff;color:#081d3a;font:inherit;font-size:15px;line-height:1.2;box-shadow:0 2px 10px rgba(8,29,58,.07);appearance:none;-webkit-appearance:none;outline:none}',
 '.okla-newsroom .nr-field input::placeholder{color:#7a8594;opacity:1}',
 '.okla-newsroom .nr-field input:focus,.okla-newsroom .nr-field select:focus{box-shadow:0 0 0 3px rgba(7,85,206,.28),0 2px 10px rgba(8,29,58,.07)}',
 '.okla-newsroom .nr-field svg{position:absolute;top:50%;right:14px;width:18px;height:18px;margin-top:-9px;pointer-events:none;fill:none;stroke:#566476;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
 '.okla-newsroom .nr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
 '.okla-newsroom .nr-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:36px 32px;max-width:1320px;margin:56px auto 0}',
 '.okla-newsroom .nr-card{display:flex;flex-direction:column;min-width:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(8,29,58,.08)}',
 '.okla-newsroom .nr-card__media{display:block;aspect-ratio:16/9;background:#eef3fa;overflow:hidden}',
 '.okla-newsroom .nr-card__media img{display:block;width:100%;height:100%;object-fit:cover}',
 '.okla-newsroom .nr-card__body{display:flex;flex:1;flex-direction:column;padding:22px 24px 24px}',
 '.okla-newsroom .nr-card__category{margin:0;font-size:14px;font-weight:600;color:#6b7480}',
 '.okla-newsroom .nr-card__title{margin:10px 0 12px;font-size:22px;line-height:1.3;font-weight:700}',
 '.okla-newsroom .nr-card__title a{color:#081d3a;text-decoration:none}',
 '.okla-newsroom .nr-card__title a:hover{color:#0755ce;text-decoration:underline}',
 '.okla-newsroom .nr-card__excerpt{margin:0;font-size:15px;line-height:1.6;color:#3b4a5e}',
 '.okla-newsroom .nr-card__meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px 22px;margin-top:auto;padding-top:22px;font-size:14px;color:#566476}',
 '.okla-newsroom .nr-card__read{display:inline-flex;align-items:center;gap:6px}',
 '.okla-newsroom .nr-card__read svg{display:block;width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
 '.okla-newsroom .nr-empty{margin:40px 0 0;text-align:center;font-size:16px;line-height:1.6;color:#566476}',
 '.okla-newsroom .nr-empty[hidden]{display:none}',
 '.okla-newsroom a:focus-visible{outline:2px solid #074ebe;outline-offset:3px}',
 '@media (max-width:1024px){.okla-newsroom .nr-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
 '@media (max-width:640px){'
 +'.okla-newsroom{padding:16px 16px 44px}'
 +'.okla-newsroom .nr-hero{padding:44px 18px 36px;border-radius:18px}'
 +'.okla-newsroom .nr-title{font-size:38px}'
 +'.okla-newsroom .nr-lead{font-size:16px}'
 +'.okla-newsroom .nr-controls{flex-direction:column;align-items:stretch;margin-top:28px}'
 +'.okla-newsroom .nr-field{flex:none;width:100%}'
 +'.okla-newsroom .nr-grid{grid-template-columns:minmax(0,1fr);gap:24px;margin-top:32px}'
 +'.okla-newsroom .nr-card__title{font-size:20px}'
 +'}'
].join('\n');

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
/* Lower case without diacritics, so that "usb" finds "USB‑C" and "nfc" finds "NFC". */
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function options(list){
 var seen={},values=[];
 list.forEach(function(a){if(a.label&&!seen[a.label]){seen[a.label]=true;values.push(a.label)}});
 values.sort(function(x,y){return x.localeCompare(y,'cs')});
 return '<option value="">Všechny kategorie</option>'+values.map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>'}).join('');
}
function card(a){
 var el=document.createElement('article');
 el.className='nr-card';
 el.innerHTML='<a class="nr-card__media" href="'+esc(a.href)+'" tabindex="-1" aria-hidden="true">'+(a.img?'<img src="'+esc(a.img)+'" alt="" loading="lazy" decoding="async">':'')+'</a>'
  +'<div class="nr-card__body">'
  +(a.label?'<p class="nr-card__category">'+esc(a.label)+'</p>':'')
  +'<h2 class="nr-card__title"><a href="'+esc(a.href)+'">'+esc(a.title)+'</a></h2>'
  +'<p class="nr-card__excerpt">'+esc(A.shorten(a.desc,220))+'</p>'
  +'<div class="nr-card__meta">'+(a.date?'<time>'+esc(a.date)+'</time>':'')+'<span class="nr-card__read">'+ICON.clock+a.minutes+' min čtení</span></div>'
  +'</div>';
 return el;
}

var tries=0;
function mount(){
 var content=document.querySelector('#content');
 if(!content){if(++tries<40)setTimeout(mount,250);return}
 if(document.querySelector('.okla-newsroom'))return;
 /* /nase-novinky/ is the list itself: read before Shoptet's full copies of the articles are removed below */
 var onList=/^\/nase-novinky\/?$/.test(location.pathname);
 if(onList){var here=A.parse(content.innerHTML);if(here)A.keep(here)}
 if(!document.getElementById('okla-newsroom-styles')){
  var style=document.createElement('style');style.id='okla-newsroom-styles';style.textContent=CSS;document.head.appendChild(style);
 }
 document.body.classList.add('okla-newsroom-page');
 var root=document.createElement('section');
 root.className='okla-newsroom';
 root.setAttribute('aria-label','Newsroom Okla');
 root.innerHTML='<header class="nr-hero">'
  +'<h1 class="nr-title">Newsroom</h1>'
  +'<p class="nr-lead">Průvodci a návody k produktům z nabídky Okla. Hledejte podle slova nebo kategorie.</p>'
  +'<div class="nr-controls">'
  +'<label class="nr-field"><span class="nr-sr">Hledat článek</span><input type="search" placeholder="Hledat článek" autocomplete="off">'+ICON.search+'</label>'
  +'<label class="nr-field"><span class="nr-sr">Kategorie</span><select data-filter="category"><option value="">Všechny kategorie</option></select>'+ICON.chevron+'</label>'
  +'</div>'
  +'</header>'
  +'<div class="nr-grid"></div>'
  +'<p class="nr-empty" hidden>Pro toto hledání nemáme žádný článek. Zkuste jiné slovo nebo zrušte filtr.</p>';
 content.insertBefore(root,content.firstChild);
 /* /nase-novinky/: Shoptet prints every article in full, each with its own inline stylesheet that hides everything but
    the article; the list is replaced by the cards above, so those copies go */
 if(onList){
  [].slice.call(content.querySelectorAll('.news-wrapper')).forEach(function(n){n.remove()});
  [].slice.call(content.querySelectorAll('style')).forEach(function(st){if(/\.okla-clanek/.test(st.textContent||''))st.remove()});
 }

 var grid=root.querySelector('.nr-grid');
 var empty=root.querySelector('.nr-empty');
 var search=root.querySelector('input[type="search"]');
 var select=root.querySelector('select');
 var articles=[];

 function render(){
  var q=norm(search.value).trim(),category=select.value;
  var list=articles.filter(function(a){
   return (!category||a.label===category)&&(!q||norm(a.title+' '+a.desc+' '+a.label).indexOf(q)!==-1);
  });
  grid.innerHTML='';
  list.forEach(function(a){grid.appendChild(card(a))});
  /* "nothing found" only for a search or a filter, not while the list is still being read */
  empty.hidden=list.length>0||!articles.length;
 }
 function use(list){
  if(!list)return;
  articles=list;
  var chosen=select.value;select.innerHTML=options(list);select.value=chosen;
  render();
 }
 search.addEventListener('input',render);
 select.addEventListener('change',render);
 use(A.cached());
 if(!onList&&!A.fresh())A.load(use);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
