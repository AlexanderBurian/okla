/* OKLA newsroom – /newsroom. Article grid in the Alza-style layout with search and two filters.
   Colours, type and buttons follow the OKLA storefront. Loaded by zapati_firsthalf.js on this path only. */
(function(){
'use strict';
if(window.__oklaNewsroomV1)return;
if(!/^\/newsroom(\/|\.html)?$/.test(location.pathname))return;
window.__oklaNewsroomV1=true;

/* Current articles, newest first. A new article is one more object in this list. The href values are the page addresses
   used in Shoptet; change them if the article pages get different addresses. */
var ARTICLES=[
 {title:'Flipper Zero: co všechno zvládne kapesní multitool?',
  excerpt:'Sub-GHz rádio, čtečka RFID a NFC karet a infračervený vysílač v kapesním přístroji. Samo o sobě nic neotevře, záleží na tom, co s ním umíte a na jaké systémy máte oprávnění.',
  img:'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@74fbf8aff4d9b1bef0ef07fffc0df555da069f7b/public/clanky/obrazky/flipper-hero.webp',
  href:'/clanky/flipper-zero/',date:'2026-10-31',minutes:12,topic:'Elektronika',category:'Multitool a RF'},
 {title:'Wi-Fi endoskopická kamera: na co se zaměřit při výběru',
  excerpt:'Ne každý endoskop nabídne stejně dobrý obraz. Záleží na průměru sondy, délce kabelu, přísvícení i kompatibilitě s telefonem.',
  img:'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@29ff0c42ead6d31d4716e30b9c270e22604b5794/public/clanky/obrazky/wifi-endoskop-hero.webp',
  href:'/clanky/wifi-endoskop/',date:'2026-10-31',minutes:9,topic:'Měření a kontrola',category:'Endoskopy'},
 {title:'USB-C testery: jak snadno zkontrolovat nabíjení',
  excerpt:'Přehledné měření napětí, proudu a výkonu vám pomůže zjistit, co skutečně zvládne nabíječka nebo kabel.',
  img:'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@29ff0c42ead6d31d4716e30b9c270e22604b5794/public/clanky/obrazky/usb-c-testery-hero.webp',
  href:'/clanky/usb-c-testery/',date:'2026-10-31',minutes:8,topic:'Nabíjení a napájení',category:'Testery'},
 {title:'NFC karty a štítky: nenápadná technologie s velkým využitím',
  excerpt:'Jednoduché sdílení kontaktů, spouštění automatizací i rychlé otevírání odkazů. NFC dokáže zpříjemnit běžné činnosti a vejde se do peněženky.',
  img:'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@f0c536abe08d9abcc1ae5a3eb32e8b07187773ce/public/clanky/obrazky/nfc-karty-hero-v2.webp',
  href:'/clanky/nfc-karty/',date:'2026-10-31',minutes:8,topic:'Chytré technologie',category:'NFC'},
 {title:'Chytré měřicí gadgety: drobnosti, které ušetří čas',
  excerpt:'Od laserových dálkoměrů až po digitální váhy. Jaké parametry sledovat a kdy se vyplatí pořídit specializovaný nástroj?',
  img:'https://cdn.jsdelivr.net/gh/AlexanderBurian/okla@29ff0c42ead6d31d4716e30b9c270e22604b5794/public/clanky/obrazky/merici-technika-hero.webp',
  href:'/clanky/merici-technika/',date:'2026-10-31',minutes:8,topic:'Měření a kontrola',category:'Měřicí přístroje'}
];

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
 '.okla-newsroom .nr-hero{display:flex;flex-direction:column;align-items:center;padding:76px 24px 60px;border-radius:24px;text-align:center;background:linear-gradient(115deg,#f3effe 0%,#ddd0fb 45%,#c2aef6 100%)}',
 '.okla-newsroom .nr-title{margin:0;font-size:56px;line-height:1.1;font-weight:700;color:#081d3a}',
 '.okla-newsroom .nr-lead{margin:14px 0 0;max-width:640px;font-size:17px;line-height:1.6;color:#3b4a5e}',
 '.okla-newsroom .nr-controls{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;width:100%;margin-top:44px}',
 '.okla-newsroom .nr-field{position:relative;flex:0 1 240px;min-width:0;margin:0}',
 '.okla-newsroom .nr-field input,.okla-newsroom .nr-field select{width:100%;height:48px;padding:0 44px 0 16px;border:0;border-radius:10px;background:#fff;color:#081d3a;font:inherit;font-size:15px;line-height:1.2;box-shadow:0 2px 10px rgba(8,29,58,.07);appearance:none;-webkit-appearance:none;outline:none}',
 '.okla-newsroom .nr-field input::placeholder{color:#7a8594;opacity:1}',
 '.okla-newsroom .nr-field input:focus,.okla-newsroom .nr-field select:focus{box-shadow:0 0 0 3px rgba(0,140,219,.28),0 2px 10px rgba(8,29,58,.07)}',
 '.okla-newsroom .nr-field svg{position:absolute;top:50%;right:14px;width:18px;height:18px;margin-top:-9px;pointer-events:none;fill:none;stroke:#566476;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
 '.okla-newsroom .nr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
 '.okla-newsroom .nr-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:36px 32px;max-width:1200px;margin:56px auto 0}',
 '.okla-newsroom .nr-card{display:flex;flex-direction:column;min-width:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(8,29,58,.08)}',
 '.okla-newsroom .nr-card__media{display:block;aspect-ratio:16/9;background:#eef3fa;overflow:hidden}',
 '.okla-newsroom .nr-card__media img{display:block;width:100%;height:100%;object-fit:cover}',
 '.okla-newsroom .nr-card__body{display:flex;flex:1;flex-direction:column;padding:22px 24px 24px}',
 '.okla-newsroom .nr-card__category{margin:0;font-size:14px;font-weight:600;color:#6b7480}',
 '.okla-newsroom .nr-card__title{margin:10px 0 12px;font-size:22px;line-height:1.3;font-weight:700}',
 '.okla-newsroom .nr-card__title a{color:#081d3a;text-decoration:none}',
 '.okla-newsroom .nr-card__title a:hover{color:#008cdb;text-decoration:underline}',
 '.okla-newsroom .nr-card__excerpt{margin:0;font-size:15px;line-height:1.6;color:#3b4a5e}',
 '.okla-newsroom .nr-card__meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px 22px;margin-top:auto;padding-top:22px;font-size:14px;color:#566476}',
 '.okla-newsroom .nr-card__read{display:inline-flex;align-items:center;gap:6px}',
 '.okla-newsroom .nr-card__read svg{display:block;width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
 '.okla-newsroom .nr-empty{margin:40px 0 0;text-align:center;font-size:16px;line-height:1.6;color:#566476}',
 '.okla-newsroom .nr-empty[hidden]{display:none}',
 '.okla-newsroom a:focus-visible{outline:2px solid #007fc6;outline-offset:3px}',
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
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function options(key,first){
 var seen={},values=[];
 ARTICLES.forEach(function(a){if(!seen[a[key]]){seen[a[key]]=true;values.push(a[key])}});
 values.sort(function(x,y){return x.localeCompare(y,'cs')});
 return '<option value="">'+first+'</option>'+values.map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>'}).join('');
}
function card(a){
 var el=document.createElement('article');
 el.className='nr-card';
 el.innerHTML='<a class="nr-card__media" href="'+esc(a.href)+'" tabindex="-1" aria-hidden="true"><img src="'+esc(a.img)+'" alt="" loading="lazy" decoding="async"></a>'
  +'<div class="nr-card__body">'
  +'<p class="nr-card__category">'+esc(a.category)+'</p>'
  +'<h2 class="nr-card__title"><a href="'+esc(a.href)+'">'+esc(a.title)+'</a></h2>'
  +'<p class="nr-card__excerpt">'+esc(a.excerpt)+'</p>'
  +'<div class="nr-card__meta"><time datetime="'+esc(a.date)+'">'+esc(a.date)+'</time><span class="nr-card__read">'+ICON.clock+a.minutes+' min čtení</span></div>'
  +'</div>';
 return el;
}

var tries=0;
function mount(){
 var content=document.querySelector('#content');
 if(!content){if(++tries<40)setTimeout(mount,250);return}
 if(document.querySelector('.okla-newsroom'))return;
 if(!document.getElementById('okla-newsroom-styles')){
  var style=document.createElement('style');style.id='okla-newsroom-styles';style.textContent=CSS;document.head.appendChild(style);
 }
 document.body.classList.add('okla-newsroom-page');
 var root=document.createElement('section');
 root.className='okla-newsroom';
 root.setAttribute('aria-label','Newsroom OKLA');
 root.innerHTML='<header class="nr-hero">'
  +'<h1 class="nr-title">Newsroom</h1>'
  +'<p class="nr-lead">Průvodci a návody k produktům z nabídky OKLA. Hledejte podle slova, tématu nebo kategorie.</p>'
  +'<div class="nr-controls">'
  +'<label class="nr-field"><span class="nr-sr">Hledat článek</span><input type="search" placeholder="Hledat článek" autocomplete="off">'+ICON.search+'</label>'
  +'<label class="nr-field"><span class="nr-sr">Téma</span><select data-filter="topic">'+options('topic','Všechna témata')+'</select>'+ICON.chevron+'</label>'
  +'<label class="nr-field"><span class="nr-sr">Kategorie</span><select data-filter="category">'+options('category','Všechny kategorie')+'</select>'+ICON.chevron+'</label>'
  +'</div>'
  +'</header>'
  +'<div class="nr-grid"></div>'
  +'<p class="nr-empty" hidden>Pro toto hledání nemáme žádný článek. Zkuste jiné slovo nebo zrušte filtr.</p>';
 content.insertBefore(root,content.firstChild);

 var grid=root.querySelector('.nr-grid');
 var empty=root.querySelector('.nr-empty');
 var search=root.querySelector('input[type="search"]');
 var selects=root.querySelectorAll('select');

 function render(){
  var q=norm(search.value).trim(),topic='',category='';
  selects.forEach(function(s){if(s.getAttribute('data-filter')==='topic')topic=s.value;else category=s.value});
  var list=ARTICLES.filter(function(a){
   return (!topic||a.topic===topic)
    &&(!category||a.category===category)
    &&(!q||norm(a.title+' '+a.excerpt+' '+a.topic+' '+a.category).indexOf(q)!==-1);
  });
  grid.innerHTML='';
  list.forEach(function(a){grid.appendChild(card(a))});
  empty.hidden=list.length>0;
 }
 search.addEventListener('input',render);
 selects.forEach(function(s){s.addEventListener('change',render)});
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
