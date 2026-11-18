/* OKLA / zapati_firsthalf.js / verze 53 / nav, bannery, karty, nekonecne slidery */
(function(){
  'use strict';
  /* the styles that stood here live in legacy/v53/zapati_firsthalf.css (bundle 31-legacy-css) */
  document.documentElement.setAttribute('data-okla-layout','53');
  // The site font (Open Sans) is self-hosted: okla_global_typography.css.
  // OKLA V19 native SVG icons – generated from path arrays, never parsed from HTML.
  var svgNS='http://www.w3.org/2000/svg';
  var categoryPaths={
    'elektronicke multitooly':['M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z','M9 9h6v6H9z','M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3'],
    'chytra elektronika':['M3.5 4.5h12v11h-12z','M9.5 15.5v3M6 18.5h7','M18 7.5h3v12h-5v-12h2z','M18 17.5h1'],
    'merici technika a naradi':['M3 6.3a1.7 1.7 0 0 1 1.7-1.7h5A1.7 1.7 0 0 1 11.4 6.3v8a1.7 1.7 0 0 1-1.7 1.7h-5A1.7 1.7 0 0 1 3 14.3Z','M4.8 6.7h4.8v3.6H4.8z','M5.3 12.8h0M7.2 12.8h0M9.1 12.8h0','M6.8 16c0 2.7 0 4.4 4 4.4 4.1 0 5.6-1.8 5.6-5.3V10','M15.6 9.3a1.7 1.7 0 1 0 2.4 2.4 1.7 1.7 0 0 0-2.4-2.4Z','M18.6 8.6l1.5-1.5M19.4 11.4l1.9.4M18.4 12.6l1.2 1.6'],
    'endoskopy a inspekcni kamery':['M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z','M9.5 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z','m17 10 5-3v10l-5-3'],
    'prakticke vychytavky':['M9 16a6.5 6.5 0 1 1 6 0c-.8.8-1.1 1.2-1.2 2H10.2c-.1-.8-.4-1.2-1.2-2Z','M10 20h4M11 22h2','M9.3 10.5a3 3 0 0 1 2.7-2.8'],
    'designove gadgety':['m12 2 1.9 7.9L22 12l-8.1 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2Z','m19 2 .4 2 1.6.5-1.6.5-.4 2-.5-2-1.5-.5 1.5-.5z'],
    'projektory a obraz':['M4 5.5h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z','M9.5 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z','m17 10 5-2.5v9L17 14'],
    'prislusenstvi':['M9 2.5v5','M15 2.5v5','M6.5 7.5h11v3.5a5.5 5.5 0 0 1-11 0Z','M12 16.5v2.5a2.5 2.5 0 0 0 2.5 2.5H15']
  };
  // OKLA pictograms (PNG/SVG art) per category. When present these replace the line icons above.
  var categoryImages={'elektronicke multitooly':'multitooly.png','chytra elektronika':'chytra-elektronika.png','merici technika a naradi':'merici-technika.png','endoskopy a inspekcni kamery':'endoskopy.png','prakticke vychytavky':'prakticke-vychytavky.png','designove gadgety':'designove-gadgety.png','projektory a obraz':'projektory.png','chytra domacnost':'chytra-domacnost.png','prislusenstvi':'prislusenstvi.svg'};
  function normalize(t){return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[,+]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();}
  function insertIcons(){var iconBase=(window.__oklaAssetBase||'')+'v91/img/cat/';document.querySelectorAll('#categories .topic>a,.box-categories .topic>a').forEach(function(link){var txt=Array.from(link.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join(' ');var key=normalize(txt||link.textContent),data=categoryPaths[key],imgsrc=categoryImages[key];if(!data&&!imgsrc)return;var prev=link.querySelector('.okla-cat-svg,.okla-category-png,.okla-category-icon-font');if(prev&&(prev.querySelector('svg path')||prev.querySelector('img.okla-category-png'))){link.classList.add('okla-category-with-icon');return;}if(prev)prev.remove();var wrap=document.createElement('span');wrap.className='okla-cat-svg';wrap.setAttribute('aria-hidden','true');if(imgsrc){var im=document.createElement('img');im.className='okla-category-png';im.src=iconBase+imgsrc;im.alt='';im.setAttribute('loading','lazy');wrap.appendChild(im);}else{var svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('focusable','false');data.forEach(function(d){var p=document.createElementNS(svgNS,'path');p.setAttribute('d',d);svg.appendChild(p);});wrap.appendChild(svg);}link.prepend(wrap);link.classList.add('okla-category-with-icon');Array.from(link.childNodes).forEach(function(n){if(n.nodeType===3&&n.textContent.trim()){var label=document.createElement('span');label.className='okla-cat-label';label.textContent=/endoskop/i.test(n.textContent)?'Endoskopy':n.textContent.trim();link.replaceChild(label,n);}});});}
  // Align each SVG's actual x position to the heading, regardless of Shoptet link padding.
  /* retired: the sidebar's boxes are clean islands now (okla_sidebar_clean.css) - the links keep no shift of their own */
  function alignCategoryIcons(){var sb=document.querySelector('#content-wrapper aside.sidebar.sidebar-left');if(sb){sb.querySelectorAll('#categories .topic>a.okla-category-with-icon').forEach(function(l){l.style.removeProperty('transform');l.style.removeProperty('width');l.style.removeProperty('--okla-hover-overhang')})}return;var sidebar=document.querySelector('#content-wrapper aside.sidebar.sidebar-left');if(!sidebar)return;var heading=sidebar.querySelector('.box-categories .pageElement__heading span')||sidebar.querySelector('.box-categories .pageElement__heading');if(!heading)return;var target=heading.getBoundingClientRect().left;sidebar.querySelectorAll('#categories .topic>a.okla-category-with-icon').forEach(function(link){var icon=link.querySelector('.okla-cat-svg');if(!icon)return;link.style.removeProperty('transform');link.style.removeProperty('width');var original=icon.getBoundingClientRect().left;if(!original)return;var delta=Math.max(-30,Math.min(45,Math.round((target-original)/((link.currentCSSZoom)||1))));link.style.setProperty('transform','translate3d('+delta+'px,0,0)','important');if(delta>0)link.style.setProperty('width','calc(100% - '+(14+delta)+'px)','important');var overhang=Math.max(0,Math.round((link.getBoundingClientRect().left-sidebar.getBoundingClientRect().left)/((link.currentCSSZoom)||1)));link.style.setProperty('--okla-hover-overhang',overhang+'px');});}
  // Draw sidebar background / separators against actual measured boxes, not inner gutters.
  function alignSidebarChrome(){var wrapper=document.getElementById('content-wrapper'),sidebar=wrapper&&wrapper.querySelector('aside.sidebar.sidebar-left'),category=sidebar&&sidebar.querySelector('.box-categories');if(!sidebar||!category)return;var side=sidebar.getBoundingClientRect(),cat=category.getBoundingClientRect(),wrap=wrapper.getBoundingClientRect();if(!side.height||!side.width||!cat.height)return;var zk=sidebar.currentCSSZoom||parseFloat(getComputedStyle(sidebar).zoom)||1;/* floor, not ceil: the 1px divider must start at or above the (fractional) bottom of the last category, otherwise a white 1px gap shows under an active item */var h=Math.max(0,Math.floor((cat.bottom-side.top)/zk));var white=sidebar.querySelector('#okla-sidebar-top-white');if(!white){white=document.createElement('div');white.id='okla-sidebar-top-white';white.setAttribute('aria-hidden','true');sidebar.insertBefore(white,sidebar.firstChild);}white.style.setProperty('height',h+'px','important');var line=sidebar.querySelector('#okla-sidebar-horizontal');if(!line){line=document.createElement('div');line.id='okla-sidebar-horizontal';line.setAttribute('aria-hidden','true');sidebar.appendChild(line);}line.style.setProperty('top',h+'px','important');var vertical=wrapper.querySelector(':scope > #okla-sidebar-vertical');if(!vertical){vertical=document.createElement('div');vertical.id='okla-sidebar-vertical';vertical.setAttribute('aria-hidden','true');wrapper.appendChild(vertical);}vertical.style.setProperty('left',Math.round((side.right-wrap.left)/zk-1)+'px','important');}
  /* Keep every curated product row in the product area. Shoptet assigns a new
     numeric suffix whenever another homepage group is added, so the two newer
     rows are recognised both by their current IDs and by their visible names. */
  function homepageProductSections(root){
    var ordered=[],seen={};
    function add(i){if(seen[i])return;var h=root.querySelector('.homepage-products-heading-'+i),p=root.querySelector('.homepage-products-'+i);if(h&&p){seen[i]=1;ordered.push({id:i,heading:h,group:p});}}
    [1,4,2].forEach(add);
    var wanted=[['vychytavky','gadgets','kutyuk'],['nejlepsi naradi','best tools','najlepsie naradie','legjobb szerszamok']];
    wanted.forEach(function(titles){
      var match=Array.from(root.querySelectorAll('[class*="homepage-products-heading-"]')).find(function(h){
        var copy=h.cloneNode(true),more=copy.querySelector('.okla-section-more');if(more)more.remove();
        return titles.indexOf(normalize(copy.textContent))>=0;
      });
      var found=match&&String(match.className).match(/(?:^|\s)homepage-products-heading-(\d+)(?:\s|$)/);if(found)add(Number(found[1]));
    });
    /* Current Shoptet slots are useful fallbacks after an early translation
       changes the heading before this module runs. */
    [7,10].forEach(add);
    /* extra rows (copies made by okla_home_merge.js) in slots 101+ */
    [101,102,103,104,105,106].forEach(add);
    return ordered;
  }
  function arrangeHomepage(){if(location.pathname!=='/'&&location.pathname!=='')return;var root=document.querySelector('main#content');if(!root)return;var banners=root.querySelector('.banners-row');if(!banners)return;root.querySelectorAll('[data-okla-home-product-tail]').forEach(function(el){el.removeAttribute('data-okla-home-product-tail');});var last=banners;homepageProductSections(root).forEach(function(section){var wrapper=section.group.closest('.okla-slider-shell')||section.group;last.after(section.heading);section.heading.after(wrapper);last=wrapper;});if(last!==banners)last.setAttribute('data-okla-home-product-tail','1');var w=root.querySelector('.homepage-box.welcome-wrapper');if(w){last.after(w);last=w;}var benefit=root.querySelector('.benefitBanner.position--benefitHomepage');if(benefit)root.appendChild(benefit);document.body.classList.add('okla-home-sections');}
  // Dekorativní zlute hvezdy s jasnou informaci Bez hodnoceni; skutecne recenze Shoptetu se nenahrazuji.
  var emptyStars=''+Array(5).fill('').join('')+'Bez hodnocení';
  function decorateCard(card){if(card.dataset.oklaCard==='44')return;var inner=card.querySelector('.p-in-in'),name=inner&&inner.querySelector('a.name'),rating=inner&&inner.querySelector('.ratings-wrapper');if(inner&&name&&rating){var availability=rating.querySelector('.availability');var placeholder=rating.querySelector('.stars-placeholder');if(placeholder&&!rating.querySelector('.stars, [itemprop="ratingValue"],[data-rating]')){placeholder.innerHTML=emptyStars;}rating.classList.add('okla-ratings');inner.insertBefore(rating,name);if(availability)name.after(availability);}card.dataset.oklaCard='44';}
  var sliderInstances=[];
  /* all sliders waiting to be sized are sized in one go, in the next frame (before it is painted) */
  var sizeQueue=[],sizeQueued=false;
  function sizeAll(list){list.forEach(function(s){if(s.busy)s.finish();});var ms=list.map(function(s){return s.measure();});list.forEach(function(s,i){s.apply(ms[i]);});var ps=list.map(function(s){return s.posRead();});list.forEach(function(s,i){s.posWrite(ps[i]);});}
  var posQueue=[],posQueued=false;
  function queuePosition(s){if(posQueue.indexOf(s)<0)posQueue.push(s);if(posQueued)return;posQueued=true;window.requestAnimationFrame(function(){posQueued=false;var list=posQueue;posQueue=[];var ps=list.map(function(x){return x.posRead();});list.forEach(function(x,i){x.posWrite(ps[i]);});});}
  function queueSize(s){if(sizeQueue.indexOf(s)<0)sizeQueue.push(s);if(sizeQueued)return;sizeQueued=true;window.requestAnimationFrame(function(){sizeQueued=false;var list=sizeQueue;sizeQueue=[];sizeAll(list.filter(function(x){return x.group.isConnected;}));});}

  // V46: visible right-aligned "Více" in each homepage section heading.
  function oklaAddSectionLink(heading,group){
    if(!heading || heading.querySelector('.okla-section-more'))return;
    var firstHeading=heading.querySelector('a:not(.okla-section-more)'),title=(heading.textContent||'').trim();
    var isNews=/novink|nové produkty/i.test(title);
    var isAction=/akční|akce|výprodej|slev/i.test(title);
    var choices=isNews?['Novinky','Nové produkty']:isAction?['Akční zboží','Akce','Výprodej']:title?[title]:[];
    var destination=heading.getAttribute('data-category-url')||group.getAttribute('data-category-url')||(firstHeading&&firstHeading.getAttribute('href'))||'';
    if(!destination || destination==='#'){
      var nav=document.querySelectorAll('#navigation a[href], aside.sidebar a[href], .menu-level-1 a[href], .menu-level-2 a[href]');
      outer: for(var z=0;z<choices.length;z++){for(var n=0;n<nav.length;n++){var text=(nav[n].textContent||'').trim(),href=nav[n].getAttribute('href')||'';if(text.toLocaleLowerCase('cs')===choices[z].toLocaleLowerCase('cs') && href && href!=='#' && !/^javascript:/i.test(href)){destination=href;break outer;}}}
    }
    // sections whose own page has a different name in the menu
    if(!destination || destination==='#'){var known={'vychytávky':'/prakticke-vychytavky/','nejlepší nářadí':'/merici-technika-a-naradi/'};destination=known[title.toLocaleLowerCase('cs')]||'';}
    // no real page for this section (e.g. Akční zboží, Novinky): no "Více" link rather than one leading to a 404
    if(!destination || destination==='#')return;
    var more=document.createElement('a');more.className='okla-section-more';more.href=destination;
    more.setAttribute('aria-label','Zobrazit kategorii '+(title||'produktů'));
    var label=document.createElement('span');label.textContent='Více';
    more.appendChild(label);more.appendChild(oklaSvg(['m9 5 7 7-7 7']));
    heading.appendChild(more);
  }
  function sliderFor(group,heading){var cards=Array.prototype.slice.call(group.children).filter(function(el){return el.classList.contains('product');});if(!cards.length)return;if(group.classList.contains('okla-slider-track')||group.closest('.okla-slider-shell')||group.dataset.oklaSlider==='53'){heading.classList.add('okla-slider-heading');oklaAddSectionLink(heading,group);return;}cards.forEach(decorateCard);if(matchMedia('(min-width:992px)').matches&&cards.length>1&&cards.length<=5){cards.forEach(function(c){var k=c.cloneNode(true);k.setAttribute('data-okla-clone','1');k.setAttribute('aria-hidden','true');k.querySelectorAll('[id]').forEach(function(n){n.removeAttribute('id')});k.querySelectorAll('a,button,input,select,textarea').forEach(function(n){n.setAttribute('tabindex','-1')});group.appendChild(k)});cards=Array.prototype.slice.call(group.children).filter(function(el){return el.classList.contains('product');});}var shell=document.createElement('div');shell.className='okla-slider-shell';var viewport=document.createElement('div');viewport.className='okla-slider-viewport';group.parentNode.insertBefore(shell,group);shell.appendChild(viewport);viewport.appendChild(group);group.classList.add('okla-slider-track');group.dataset.oklaSlider='53';heading.classList.add('okla-slider-heading');oklaAddSectionLink(heading,group);var controls=document.createElement('span');controls.className='okla-slider-controls';var left=document.createElement('button'),right=document.createElement('button');left.type=right.type='button';left.className='okla-slider-prev';right.className='okla-slider-next';left.setAttribute('aria-label','Předchozí produkty');right.setAttribute('aria-label','Další produkty');left.replaceChildren(oklaSvg(['m15 18-6-6 6-6']));right.replaceChildren(oklaSvg(['m9 18 6-6-6-6']));controls.append(left,right);shell.appendChild(controls);var host=group.closest('main#content');
    var s={group:group,viewport:viewport,controls:controls,count:cards.length,visible:1,busy:false,dir:'',timer:null,fallback:null,paused:false,reduced:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches};sliderInstances.push(s);
    /* the arrows' place: read (posRead) and written (posWrite) separately, so all sliders are placed together in one frame */function posRead(){if(!shell.isConnected||!host||!host.isConnected)return null;var h=host.getBoundingClientRect(),r=shell.getBoundingClientRect();if(!h.width||!r.width)return null;var cz=controls.currentCSSZoom||1;return {l:Math.min(0,Math.round((h.left-r.left)/cz)),right:Math.min(0,Math.round((r.right-h.right)/cz))};}function posWrite(v){if(!v)return;if(controls.style.getPropertyValue('left')!==v.l+'px')controls.style.setProperty('left',v.l+'px','important');if(controls.style.getPropertyValue('right')!==v.right+'px')controls.style.setProperty('right',v.right+'px','important');controls.style.removeProperty('top');controls.style.removeProperty('bottom');controls.style.removeProperty('height');controls.style.removeProperty('width');}function positionControls(){posWrite(posRead());}
    /* measuring (reads) and sizing (writes) are separate, so all sliders are measured together and then sized together: one layout for all of them instead of two per slider. The step is worked out from the track's width, the same as the first card's width plus the gap. */function measure(){var limit=matchMedia('(min-width:992px)').matches?5:matchMedia('(min-width:768px)').matches?3:2;var visible=Math.min(limit,Math.max(1,s.count-1));var cs=window.getComputedStyle(group);return {visible:visible,gap:parseFloat(cs.columnGap)||14,width:group.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0)};}function apply(m){s.visible=m.visible;group.style.setProperty('--okla-card-width','calc((100% - '+((m.visible-1)*m.gap)+'px) / '+m.visible+')');s.step=m.width>0?(m.width-(m.visible-1)*m.gap)/m.visible+m.gap:0;controls.style.display=s.count<=1?'none':'';}function size(){if(s.busy)finish();apply(measure());positionControls();}s.measure=measure;s.apply=apply;s.posRead=posRead;s.posWrite=posWrite;s.finish=finish;
    function finish(){if(!s.busy)return;window.clearTimeout(s.fallback);group.style.transition='none';if(s.dir==='next'&&group.firstElementChild)group.appendChild(group.firstElementChild);group.style.transform='translate3d(0,0,0)';void group.offsetWidth;group.style.transition='';s.busy=false;s.dir='';}
    var phoneMq=matchMedia('(max-width:767px)');/* phones: the row is scrolled by the finger (okla_mobile_sliders.css); the arrows, if shown, scroll it by a card */function move(direction){if(phoneMq.matches){var first=group.querySelector('.product');var st=first?first.getBoundingClientRect().width+10:viewport.clientWidth/2;viewport.scrollBy({left:direction==='prev'?-st:st,behavior:s.reduced?'auto':'smooth'});return;}if(s.busy||s.count<=1)return;/* the step is measured on start and after a size change only (measuring on every move forced the whole page to be laid out again, every 4 s for every slider) */if(!s.step||s.stale){s.stale=false;size();}if(!s.step)return;s.busy=true;s.dir=direction;var duration=s.reduced?0:560;if(direction==='prev'){group.style.transition='none';group.prepend(group.lastElementChild);group.style.transform='translate3d('+(-s.step)+'px,0,0)';void group.offsetWidth;group.style.transition='transform '+duration+'ms cubic-bezier(.22,.61,.36,1)';group.style.transform='translate3d(0,0,0)';}else{group.style.transition='transform '+duration+'ms cubic-bezier(.22,.61,.36,1)';group.style.transform='translate3d('+(-s.step)+'px,0,0)';}s.fallback=window.setTimeout(finish,duration+110);}
    group.addEventListener('transitionend',function(e){if(e.target===group&&e.propertyName==='transform')finish();});left.addEventListener('click',function(){move('prev');});right.addEventListener('click',function(){move('next');});
    viewport.addEventListener('mouseenter',function(){s.paused=true;});viewport.addEventListener('mouseleave',function(){s.paused=false;});viewport.addEventListener('focusin',function(){s.paused=true;});viewport.addEventListener('focusout',function(e){if(!viewport.contains(e.relatedTarget))s.paused=false;});
    var x=0,y=0,swipedAt=0;viewport.addEventListener('touchstart',function(e){if(e.touches.length===1){x=e.touches[0].clientX;y=e.touches[0].clientY;}},{passive:true});viewport.addEventListener('touchend',function(e){if(phoneMq.matches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){swipedAt=Date.now();move(dx<0?'next':'prev');}},{passive:true});viewport.addEventListener('click',function(e){if(Date.now()-swipedAt<450){e.preventDefault();e.stopPropagation();}else if(!e.target.closest('a,button,input,form'))s.paused=false;},true);
    s.resize=size;queueSize(s);var ro=null,io=null;if(window.ResizeObserver){ro=new ResizeObserver(function(){s.stale=true;queuePosition(s);});ro.observe(viewport);ro.observe(host);}/* autoplay only while the slider is on screen: sliders out of view do not move (no work, no layout) */s.onScreen=true;if(window.IntersectionObserver){io=new IntersectionObserver(function(entries){s.onScreen=entries[entries.length-1].isIntersecting;},{rootMargin:'100px 0px'});io.observe(viewport);}viewport.querySelectorAll('img').forEach(function(im){if(!im.complete)im.addEventListener('load',function(){queuePosition(s);},{once:true});});if(!s.reduced&&s.count>1)s.timer=window.setInterval(function(){if(!s.paused&&!s.busy&&s.onScreen&&!document.hidden&&!phoneMq.matches)move('next');},4200);/* a slider that is replaced (the product page's filter chips) is stopped and forgotten: its timer and observers went on running before */s.destroy=function(){window.clearInterval(s.timer);window.clearTimeout(s.fallback);if(ro)ro.disconnect();if(io)io.disconnect();var k=sliderInstances.indexOf(s);if(k>=0)sliderInstances.splice(k,1);};group.__oklaSlider=s;}
  window.__oklaSliderFor=sliderFor; /* exposed so the product page uses this same slider; homepage behaviour unchanged */
  function initHomepage(){if(location.pathname!=='/'&&location.pathname!=='')return;arrangeHomepage();var root=document.querySelector('main#content');if(!root)return;homepageProductSections(root).forEach(function(section){sliderFor(section.group,section.heading);});arrangeHomepage();insertIcons();}
  // V26: preserve native Shoptet login popup, cart count/widget and mobile navigation toggles.
  // V27 – native Shoptet actions, bespoke SVG icons (no icon fonts, no fake features).
  function oklaSvg(paths,view){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',view||'0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');paths.forEach(function(d){var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.appendChild(p);});return svg;}
  function oklaElement(name,cls,label){var el=document.createElement(name);if(cls)el.className=cls;if(label!==undefined)el.textContent=label;return el;}
  // V30: unstyled proxy login button prevents Shoptet top-nav-button hover entirely.
  // V31: exact reference positions, preserving native Shoptet account and cart behavior.
  function oklaSolidSvg(path,kind){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');var node=document.createElementNS('http://www.w3.org/2000/svg','path');node.setAttribute('d',path);if(kind)node.setAttribute('class',kind);svg.appendChild(node);return svg;}
  function oklaCzechFlag(){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),ns='http://www.w3.org/2000/svg';svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');var defs=document.createElementNS(ns,'defs'),clip=document.createElementNS(ns,'clipPath');clip.setAttribute('id','okla-cz-flag-clip');var clipCircle=document.createElementNS(ns,'circle');clipCircle.setAttribute('cx','16');clipCircle.setAttribute('cy','16');clipCircle.setAttribute('r','15.4');clip.appendChild(clipCircle);defs.appendChild(clip);svg.appendChild(defs);var group=document.createElementNS(ns,'g');group.setAttribute('clip-path','url(#okla-cz-flag-clip)');var bg=document.createElementNS(ns,'rect');bg.setAttribute('width','32');bg.setAttribute('height','32');bg.setAttribute('fill','#fff');group.appendChild(bg);var red=document.createElementNS(ns,'rect');red.setAttribute('y','16');red.setAttribute('width','32');red.setAttribute('height','16');red.setAttribute('fill','#d7142d');group.appendChild(red);var blue=document.createElementNS(ns,'path');blue.setAttribute('d','M0 0 17 16 0 32Z');blue.setAttribute('fill','#053888');group.appendChild(blue);svg.appendChild(group);return svg;}
  function updateOklaHeader(){var nav=document.querySelector('#header .header-top>.navigation-buttons'),cart=nav&&nav.querySelector('a.cart-count');if(!nav||!cart)return;if(!nav.querySelector('.okla-header-account')){var account=oklaElement('button','okla-header-account');account.type='button';account.setAttribute('aria-label','Můj účet – přihlásit se');var icon=oklaElement('span','okla-header-icon');icon.appendChild(oklaSolidSvg('M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM4.8 20.1c.1-4 3-6.5 7.2-6.5s7.1 2.5 7.2 6.5v.4H4.8v-.4Z'));var copy=oklaElement('span','okla-header-copy');copy.appendChild(oklaElement('strong','','Můj účet'));copy.appendChild(oklaElement('small','','Přihlásit se'));account.appendChild(icon);account.appendChild(copy);account.appendChild(oklaElement('span','okla-header-chevron'));account.addEventListener('click',function(){var origin=document.querySelector('.top-navigation-bar .top-nav-button-login');if(origin)origin.click();else window.location.href='/login/';});cart.parentNode.insertBefore(account,cart);}if(!nav.querySelector('.okla-header-orders')){var orders=oklaElement('a','okla-header-orders');orders.href='/klient/';orders.rel='nofollow';orders.title='Moje objednávky';orders.setAttribute('aria-label','Moje objednávky');var bag=oklaSolidSvg('M7.7 2.6h8.6v2.7h3.8v16H3.9v-16h3.8Zm1.8 2.7h5V4h-5Z','okla-bag-body');var check=document.createElementNS('http://www.w3.org/2000/svg','path');check.setAttribute('d','m8.4 13.1 2.6 2.7 4.8-5.1');check.setAttribute('class','okla-bag-check');bag.appendChild(check);bag.style.setProperty('fill','#062b5e','important');bag.style.setProperty('stroke','none','important');var bp=bag.querySelector('.okla-bag-body');if(bp){bp.style.setProperty('fill','#062b5e','important');bp.style.setProperty('stroke','none','important');}check.style.setProperty('fill','none','important');check.style.setProperty('stroke','#fff','important');check.style.setProperty('stroke-width','1.7','important');orders.appendChild(bag);cart.parentNode.insertBefore(orders,cart);}if(!nav.querySelector('.okla-header-favorites')){var fav=oklaElement('button','okla-header-favorites');fav.type='button';fav.title='Oblíbené produkty';fav.setAttribute('aria-label','Oblíbené produkty');var fh=oklaSolidSvg('M12 21.1C8.7 18.8 3 14.4 3 9.2 3 4.1 9.5 2.5 12 6.2c2.5-3.7 9-2.1 9 3 0 5.2-5.7 9.6-9 11.9Z');fh.style.setProperty('fill','#062b5e','important');fh.style.setProperty('stroke','none','important');fh.querySelector('path').style.setProperty('fill','#062b5e','important');fh.querySelector('path').style.setProperty('stroke','none','important');fav.appendChild(fh);fav.addEventListener('click',function(){oklaOpenFavorites();});cart.parentNode.insertBefore(fav,cart);}if(!nav.querySelector('.okla-header-locale')){var locale=oklaElement('span','okla-header-locale');locale.title='Čeština · CZK';locale.setAttribute('aria-label','Čeština, česká koruna');locale.appendChild(oklaCzechFlag());cart.parentNode.insertBefore(locale,cart);}cart.classList.remove('btn','btn-icon');cart.setAttribute('title','Nákupní košík');if(!cart.querySelector('.okla-cart-symbol')){var ico=oklaElement('span','okla-cart-symbol');ico.setAttribute('aria-hidden','true');ico.appendChild(oklaSvg(['M3 3h3l2 11c.2 1.3 1.3 2.2 2.6 2.2h8.1c1.1 0 2.1-.7 2.4-1.8l1.1-6.3H7','M10 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z','M18 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z']));cart.insertBefore(ico,cart.firstChild);}if(!nav.querySelector('.okla-mobile-actions')){var mobile=document.querySelector('.top-navigation-bar .responsive-tools');if(mobile){mobile.classList.add('okla-mobile-actions');cart.parentNode.insertBefore(mobile,cart);}}nav.classList.add('okla-header-ready');}
  // Insert a warranty information strip exactly between the two Shoptet homepage groups.
  // OKLA V36: bespoke multicolor vector pictograms and exact one-card-per-click infinite warranty carousel.
  function oklaWarrantyIcon(type){var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 48 48');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');var sets={
  time:[['M24 6.5a17.5 17.5 0 1 0 0 35 17.5 17.5 0 0 0 0-35Z','#0649b1',2.7],['M24 12v12l7.5 4.5','#f2a518',3.2],['M24 4v3M24 41v3M4 24h3M41 24h3','#598de0',2]],
  rules:[['M12 5.5h17l7 7v27H12a3 3 0 0 1-3-3v-28a3 3 0 0 1 3-3Z','#3d71c5',2.6],['M29 6v8h8','#9b8bdb',2.3],['M16 21h15M16 27h11M16 33h7','#236ada',2.6],['m30 32 2.6 2.5 4.3-5.2','#0857d3',2.7]],
  claim:[['M24 4.5 39 10v13.5c0 10.2-6.6 16.6-15 20-8.4-3.4-15-9.8-15-20V10L24 4.5Z','#14976c',2.8],['m16 24 5.7 5.5L33 18','#e5a621',3.5],['M24 8.2 35 12v11.6','#8dd7ae',1.8]],
  support:[['M8 27v-4a16 16 0 0 1 32 0v4','#8657c7',2.7],['M9 25H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h6V25H9Z','#e48c30',2.6],['M39 25h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-6V25h3Z','#e48c30',2.6],['M36 40c-2.2 3-5.7 4-10.5 4','#8657c7',2.6],['M25 44h-4','#8657c7',3.4]],
  contacts:[['M7 10h34v25H20l-9 7v-7H7a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z','#074dbc',2.6],['M12 21h24M12 27h17','#e28240',2.8],['M32 6h10','#558adf',2.2]]
  };(sets[type]||sets.time).forEach(function(item){var path=document.createElementNS(ns,'path');path.setAttribute('d',item[0]);path.setAttribute('fill','none');path.setAttribute('stroke',item[1]);path.setAttribute('stroke-width',String(item[2]));path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.appendChild(path);});return svg;}
  var WARRANTY_BLOCK_HTML='<div class="okla-warranty-inner"><div class="okla-warranty-content"><h2 class="okla-warranty-title">2 roky záruka.</h2><p class="okla-warranty-subtitle">Nakupujte s jistotou.</p></div><a href="/obchodni-podminky/" class="okla-warranty-button">Více o záruce</a></div>';
  function insertWarrantyBlock(){if(location.pathname!=='/'&&location.pathname!=='')return;var root=document.querySelector('main#content');if(!root)return;var rows=root.querySelectorAll('.okla-slider-shell'),row=rows[1];if(!row)return;var block=root.querySelector('#okla-warranty');if(!block){block=document.createElement('section');block.id='okla-warranty';block.setAttribute('aria-label','Informace o záruce');block.innerHTML=WARRANTY_BLOCK_HTML;}if(row.nextElementSibling!==block)row.after(block);}
  // Small self-contained favorites list, stored in this browser (Shoptet itself has no wishlist on this shop).
  var oklaFavKey='okla-local-favorites-v1';
  function oklaReadFavorites(){try{var o=JSON.parse(localStorage.getItem(oklaFavKey)||'[]');return Array.isArray(o)?o.filter(function(v){return v&&typeof v.url==='string'&&typeof v.name==='string';}).slice(0,80):[];}catch(_){return [];}}
  function oklaSaveFavorites(list){try{localStorage.setItem(oklaFavKey,JSON.stringify(list.slice(0,80)));}catch(_){}}
  function oklaOpenFavorites(){var existing=document.getElementById('okla-favorites-popover');if(existing)existing.remove();var screen=oklaElement('div');screen.id='okla-favorites-popover';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Oblíbené produkty');var frame=oklaElement('div','okla-fav-window'),head=oklaElement('div','okla-fav-head');head.appendChild(oklaElement('strong','','Oblíbené produkty'));var close=oklaElement('button','','×');close.type='button';close.setAttribute('aria-label','Zavřít');close.addEventListener('click',function(){screen.remove();});head.appendChild(close);frame.appendChild(head);var items=oklaReadFavorites();if(!items.length)frame.appendChild(oklaElement('p','okla-fav-empty','Zatím nemáte uložené produkty. Srdíčkem na produktu ho přidáte do oblíbených.'));items.forEach(function(item){var line=oklaElement('div','okla-fav-row'),a=oklaElement('a','',item.name);a.href=item.url;line.appendChild(a);var rm=oklaElement('button','','Odebrat');rm.type='button';rm.addEventListener('click',function(){oklaSaveFavorites(oklaReadFavorites().filter(function(i){return i.url!==item.url;}));screen.remove();oklaInsertFavoriteButtons();oklaOpenFavorites();});line.appendChild(rm);frame.appendChild(line);});screen.appendChild(frame);screen.addEventListener('click',function(e){if(e.target===screen)screen.remove();});var onkey=function(e){if(e.key==='Escape'){screen.remove();document.removeEventListener('keydown',onkey);}};document.addEventListener('keydown',onkey);document.body.appendChild(screen);close.focus();}
  // V46: no hearts on product cards or product listings. Saved favorites remain accessible from the header.
  function oklaInsertFavoriteButtons(){
    document.querySelectorAll('#content .product .okla-fav-toggle,#content .products .okla-fav-toggle').forEach(function(el){el.remove();});
    return; /* favourites are not offered on this shop: no favourite button is created on the product page */
    var info=document.querySelector('body.type-detail #content .p-detail-info,body.type-detail #content .p-detail .p-info-wrapper,body.type-detail #content .p-detail');
    if(!info || info.querySelector('.okla-detail-favorite'))return;
    var titleNode=document.querySelector('body.type-detail #content h1');
    var name=titleNode?(titleNode.textContent||'').trim():'';
    if(!name)return;
    var url=location.pathname;
    var btn=oklaElement('button','okla-detail-favorite');btn.type='button';
    var icon=oklaSolidSvg('M12 21s-9-5.9-9-12c0-5.2 6.6-7 9-3.2 2.4-3.8 9-2 9 3.2 0 6.1-9 12-9 12Z');
    var label=oklaElement('span');btn.appendChild(icon);btn.appendChild(label);
    function update(){var active=oklaReadFavorites().some(function(item){return item.url===url;});btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',active?'true':'false');btn.setAttribute('aria-label',active?'Odebrat z oblíbených':'Přidat do oblíbených');label.textContent=active?'V oblíbených':'Přidat do oblíbených';}
    btn.addEventListener('click',function(){var all=oklaReadFavorites(),idx=all.findIndex(function(item){return item.url===url;});if(idx>=0)all.splice(idx,1);else all.push({url:url,name:name});oklaSaveFavorites(all);update();});update();
    var detailActions=info.querySelector('.add-to-cart,.p-detail-info-wrapper,.p-tools');if(detailActions&&detailActions.parentNode)detailActions.after(btn);else info.appendChild(btn);
  }
  // V35: force escape from Shoptet main's 20px gutters to both edges of the white content column.
  // V50: bleed only across the actual right-side main content corridor, not over the sidebar.
  // V53: exact edge-to-edge width inside the right Shoptet content corridor.
  // Keep the sidebar untouched and compensate pre-existing negative CSS margins.
  function alignWarrantyStrip(){
    var strip=document.getElementById('okla-warranty-strip');
    var main=strip&&strip.closest('main#content');
    if(!strip||!main)return;
    strip.style.removeProperty('margin-left');
    strip.style.removeProperty('margin-right');
    strip.style.removeProperty('width');
    strip.style.removeProperty('max-width');
    var natural=strip.getBoundingClientRect(),rect=main.getBoundingClientRect();
    if(natural.width<=0||rect.width<=0)return;
    var sidebar=document.querySelector('#content-wrapper aside.sidebar.sidebar-left');
    var targetLeft=rect.left,targetRight=rect.right;
    if(sidebar&&matchMedia('(min-width:992px)').matches){
      var side=sidebar.getBoundingClientRect();
      // Only use the sidebar edge when it really borders the current content column.
      if(side.width>0&&side.right<=rect.left+4&&rect.left-side.right<90)
        targetLeft=side.right;
    }
    // On smaller screens the main box itself is the content corridor.
    var baseMargin=parseFloat(window.getComputedStyle(strip).marginLeft)||0;
    var sz=strip.currentCSSZoom||1;
    var newMargin=baseMargin+(targetLeft-natural.left)/sz;
    var newWidth=(targetRight-targetLeft)/sz;
    if(!Number.isFinite(newMargin)||!Number.isFinite(newWidth)||newWidth<=0)return;
    strip.style.setProperty('margin-left',(Math.round(newMargin*100)/100)+'px','important');
    strip.style.setProperty('margin-right','0px','important');
    strip.style.setProperty('width',(Math.round(newWidth*100)/100)+'px','important');
    strip.style.setProperty('max-width','none','important');
  }
  function syncOklaExactHeader(){var nav=document.querySelector('#header .header-top>.navigation-buttons');if(!nav)return;var row=nav.querySelector('.okla-exact-header');if(matchMedia('(min-width:992px)').matches){if(!row){row=document.createElement('div');row.className='okla-exact-header';row.setAttribute('role','group');row.setAttribute('aria-label','Účet, objednávky, oblíbené, jazyk a košík');nav.appendChild(row);}['.okla-header-account','.okla-header-orders','.okla-header-favorites','.okla-header-locale','a.cart-count'].forEach(function(q){var el=nav.querySelector(q);if(el&&el.parentNode!==row)row.appendChild(el);});[['.okla-header-orders','orders'],['a.cart-count','cart']].forEach(function(entry){var dest=row.querySelector(entry[0]),cls='okla-exact-separator--'+entry[1];if(dest&&!row.querySelector('.'+cls)){var line=document.createElement('span');line.className='okla-exact-separator '+cls;line.setAttribute('aria-hidden','true');row.insertBefore(line,dest);}});}else if(row){row.querySelectorAll('.okla-exact-separator').forEach(function(line){line.remove();});Array.from(row.children).forEach(function(el){nav.insertBefore(el,row);});row.remove();}}
  // V50: optical uniformity of right-side actions; single clean separators and crisp strokes.
  function refineOklaHeader(){
    var row=document.querySelector('#header .header-top .navigation-buttons .okla-exact-header');
    if(!row)return;
    var selectors=['.okla-header-orders','.okla-header-favorites','.okla-header-locale','a.cart-count'];
    var order=row.querySelector(selectors[0]),fav=row.querySelector(selectors[1]),locale=row.querySelector(selectors[2]),cart=row.querySelector(selectors[3]);
    if(order&&order.dataset.oklaIconVersion!=='50'){
      var b=oklaSvg(['M6 8h12l1.3 12H4.7L6 8Z','M9 9V6a3 3 0 0 1 6 0v3','m8.8 14 2.3 2.3 4.2-4.2']);
      b.classList.add('okla-header-lineicon');order.replaceChildren(b);order.dataset.oklaIconVersion='50';
    }
    if(fav&&fav.dataset.oklaIconVersion!=='50'){
      var h=oklaSvg(['M20.6 8.7c0 4.1-8.6 10.4-8.6 10.4S3.4 12.8 3.4 8.7a4.6 4.6 0 0 1 8.6-2.1 4.6 4.6 0 0 1 8.6 2.1Z']);
      h.classList.add('okla-header-lineicon');fav.replaceChildren(h);fav.dataset.oklaIconVersion='50';
    }
    if(locale&&locale.dataset.oklaIconVersion!=='50'){
      var flag=oklaCzechFlag();flag.classList.add('okla-header-flagicon');locale.replaceChildren(flag);locale.dataset.oklaIconVersion='50';
    }
    if(cart&&cart.dataset.oklaIconVersion!=='50'){
      var wrap=cart.querySelector('.okla-cart-symbol');
      if(!wrap){wrap=oklaElement('span','okla-cart-symbol');wrap.setAttribute('aria-hidden','true');cart.insertBefore(wrap,cart.firstChild);}
      var c=oklaSvg(['M3 3.5h2.3l2.1 10.7a2 2 0 0 0 1.9 1.6h8.3a2 2 0 0 0 1.9-1.6L21 7H6.2','M9.5 20.5h.02','M17.9 20.5h.02']);
      c.classList.add('okla-header-lineicon');wrap.replaceChildren(c);cart.dataset.oklaIconVersion='50';
    }
    // Remove historical span separators, then rebuild exactly one borderless 1px rule at each intended location.
    row.querySelectorAll(':scope > .okla-exact-separator').forEach(function(el){el.remove();});
    function separatorBefore(el,cls){
      if(!el)return;
      var line=oklaElement('span','okla-exact-separator '+cls);
      line.setAttribute('aria-hidden','true');row.insertBefore(line,el);
    }
    separatorBefore(order,'okla-exact-separator--orders');
    separatorBefore(cart,'okla-exact-separator--cart');
  }
  function bootstrap(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();insertIcons();initHomepage();insertWarrantyBlock();alignWarrantyStrip();oklaInsertFavoriteButtons();alignCategoryIcons();alignSidebarChrome();syncHeroHeight();syncCarousel();}
  var bannerDesktop=null;
  function syncCarousel(){var el=document.querySelector('#content .banners-row #carousel');if(!el||!window.jQuery||!window.jQuery.fn||typeof window.jQuery.fn.carousel!=='function')return;var desktop=matchMedia('(min-width:768px)').matches;if(bannerDesktop===desktop)return;bannerDesktop=desktop;var $c=window.jQuery(el);if(desktop){$c.carousel('pause');$c.carousel(0);$c.carousel('pause');}else{$c.carousel('cycle');}}
  // OKLA V25: top hero is exactly as tall as each lower banner, on every desktop width.
  var oklaHeroObserver=null,oklaHeroObserved=null;
  function syncHeroHeight(){var row=document.querySelector('#content .banners-row'),main=row&&row.querySelector('#carousel'),lower=row&&row.querySelector('.next-to-carousel-banners>.banner-wrapper');if(!main)return;/* the homepage's hero sizes itself (okla_home_banners.css): a height copied from the small banner beside it cut the hero short */main.style.removeProperty('height');main.style.removeProperty('aspect-ratio');return;if(!lower)return;if(!matchMedia('(min-width:768px)').matches){main.style.removeProperty('height');main.style.removeProperty('aspect-ratio');return;}var target=lower.getBoundingClientRect().height/(main.currentCSSZoom||1);if(target>0){main.style.setProperty('height',Math.round(target*100)/100+'px','important');main.style.setProperty('aspect-ratio','auto','important');}if('ResizeObserver'in window&&(!oklaHeroObserver||oklaHeroObserved!==lower)){if(oklaHeroObserver)oklaHeroObserver.disconnect();oklaHeroObserver=new ResizeObserver(function(){syncHeroHeight();});oklaHeroObserver.observe(lower);oklaHeroObserved=lower;}}
  function onResize(){syncOklaExactHeader();sizeAll(sliderInstances.filter(function(x){return x.group.isConnected;}));alignCategoryIcons();alignSidebarChrome();alignWarrantyStrip();syncHeroHeight();syncCarousel();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);else bootstrap();
  window.addEventListener('load',function(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();initHomepage();insertWarrantyBlock();alignWarrantyStrip();oklaInsertFavoriteButtons();alignCategoryIcons();alignSidebarChrome();sizeAll(sliderInstances.filter(function(x){return x.group.isConnected;}));syncHeroHeight();syncCarousel();});window.addEventListener('resize',onResize,{passive:true});
  // The ordering pages add their cart link later; they call this to build the same header as the homepage.
  window.oklaHeaderRefresh=function(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();};
})();
