/* OKLA – product detail content switcher (like kratas.cz).
   The three existing sections under the product – description, reviews and
   parameters – keep their content and look; only the switching changes:
   - desktop: three equal tabs, the active one is a white tab joined to the
     white content panel below it;
   - phone: an accordion of rounded rows, the description open by default.
   Discussion is not offered. This module owns the switching: its capture-phase
   listener handles the tab clicks before the older native/okla_detail handlers,
   and a pane is shown only by the .okla-ptab-open class. */
(function(){
 'use strict';
 if(window.__oklaDetailTabsV1)return;window.__oklaDetailTabsV1=true;
 /* tabs on every screen size (the phone accordion is no longer used) */
 var PHONE=window.matchMedia('(max-width:0px)');
 var NS='http://www.w3.org/2000/svg';
 function chevron(){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');var p=document.createElementNS(NS,'path');p.setAttribute('d','m6 9 6 6 6-6');s.appendChild(p);return s}
 /* the description starts straight with its content: no "Detailní popis produktu"
    caption and no repeated product name (the title is already above the image) */
 function norm(t){return (t||'').replace(/\s+/g,' ').trim().toLowerCase()}
 function tidyDescription(){
  var d=document.getElementById('description');if(!d)return;
  [].slice.call(d.querySelectorAll('.basic-description > h2, .basic-description > h3, .description-inner > h2, .description-inner > h3')).forEach(function(h){
   if(/^detailn[ií] popis/.test(norm(h.textContent)))h.classList.add('okla-ptab-hidden-el');
  });
  var title=document.querySelector('#content .p-detail-inner-header h1');var name=title&&norm(title.textContent);
  if(!name)return;
  [].slice.call(d.querySelectorAll('.okla-rich-intro h1, .okla-rich-intro h2, .basic-description > h1, .basic-description > h2, .okla-rich > h1, .okla-rich > h2')).forEach(function(h){
   if(norm(h.textContent)===name)h.classList.add('okla-ptab-hidden-el');
  });
  [].slice.call(d.querySelectorAll('.okla-rich-intro')).forEach(function(intro){
   var rest=[].slice.call(intro.children).filter(function(c){return !c.classList.contains('okla-ptab-hidden-el')&&norm(c.textContent)});
   if(!rest.length)intro.classList.add('okla-ptab-hidden-el');
  });
 }
 function setup(){
  var tabs=document.querySelector('#content ul.p-detail-tabs'),content=document.querySelector('#content #tab-content');
  if(!tabs||!content)return false;
  if(tabs.dataset.oklaTabs==='1')return true;
  /* okla_detail.js adds the review/parameters tabs first; wait for it */
  if(tabs.dataset.ok97Formatted!=='1')return false;
  var wrapper=tabs.closest('.shp-tabs-wrapper')||content.parentElement;
  var items=[];
  [].slice.call(tabs.children).forEach(function(li){
   var a=li.querySelector('a');if(!a)return;
   var id=(a.getAttribute('href')||'').replace(/^[^#]*#/,'');
   /* discussion is not offered; Shoptet's own rating tab is folded into our "Hodnocení" (okla_detail.js) */
   var isDiscussion=/discussion|diskuz|ratingTab/i.test(id+' '+li.className+' '+(li.getAttribute('data-testid')||''));
   var pane=id&&document.getElementById(id);
   if(isDiscussion){li.style.display='none';li.classList.add('okla-ptab-hidden');if(pane)pane.classList.add('okla-ptab-hidden');return}
   if(!pane||!content.contains(pane))return;
   var isDesc=/description/.test(id);
   if(isDesc&&!a.querySelector('.okla-tab-label')){var lab=document.createElement('span');lab.className='okla-tab-label';lab.textContent='Popis produktu';a.appendChild(lab)}
   items.push({li:li,a:a,pane:pane,id:id,label:isDesc?'Popis produktu':(a.textContent||'').trim(),desc:isDesc});
  });
  if(!items.length)return true;
  /* order: description, parameters, reviews (the li elements are moved, their listeners stay) */
  var rank=function(it){return it.desc?0:/param/i.test(it.id)?1:/review|rating|hodnoc/i.test(it.id)?2:3};
  items.sort(function(a,b){return rank(a)-rank(b)});
  items.forEach(function(it){tabs.appendChild(it.li)});
  tidyDescription();
  /* panes that are not one of the tabs (e.g. discussion) stay hidden */
  [].slice.call(content.children).forEach(function(n){if(n.classList.contains('tab-pane')&&!items.some(function(it){return it.pane===n}))n.classList.add('okla-ptab-hidden')});
  items.forEach(function(it,i){
   var head=document.createElement('button');head.type='button';head.className='okla-ptab-head';
   head.setAttribute('aria-expanded','false');head.setAttribute('aria-controls',it.pane.id);
   var t=document.createElement('span');t.className='okla-ptab-title';t.textContent=it.label;head.appendChild(t);
   var c=document.createElement('span');c.className='okla-ptab-chev';c.appendChild(chevron());head.appendChild(c);
   head.style.order=String(i*2);it.pane.style.order=String(i*2+1);
   content.insertBefore(head,it.pane);it.head=head;
   head.addEventListener('click',function(){setOpen(it,!it.pane.classList.contains('okla-ptab-open'))});
  });
  function setOpen(it,open){
   it.pane.classList.toggle('okla-ptab-open',open);
   it.pane.classList.toggle('active',open);it.pane.classList.toggle('in',open);
   it.head.classList.toggle('is-open',open);it.head.setAttribute('aria-expanded',open?'true':'false');
  }
  function activate(it){
   items.forEach(function(x,i){
    var on=x===it;
    x.li.classList.toggle('active',on);x.a.setAttribute('aria-selected',on?'true':'false');
    setOpen(x,on);
    if(on)wrapper.setAttribute('data-okla-active',i===0?'first':(i===items.length-1?'last':'mid'));
   });
  }
  tabs.addEventListener('click',function(e){
   var a=e.target.closest&&e.target.closest('a');if(!a||!tabs.contains(a))return;
   var it=items.find(function(x){return x.a===a});if(!it)return;
   e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
   activate(it);
  },true);
  /* start: the tab Shoptet marked active, a matching #hash, else the description */
  var hash=(location.hash||'').slice(1);
  var start=items.find(function(x){return hash&&x.id===hash})||items.find(function(x){return x.li.classList.contains('active')})||items[0];
  if(PHONE.matches){items.forEach(function(x){setOpen(x,x===start)})}
  activate(start);
  function onChange(){
   if(PHONE.matches)return;
   var open=items.filter(function(x){return x.pane.classList.contains('okla-ptab-open')});
   activate(open[0]||items[0]);
  }
  if(PHONE.addEventListener)PHONE.addEventListener('change',onChange);else if(PHONE.addListener)PHONE.addListener(onChange);
  wrapper.style.setProperty('--okla-ptabs-n',String(items.length));
  wrapper.classList.add('okla-ptabs');
  /* the line under the tabs runs across the whole white page card: its overhang on both sides */
  function line(){
   var card=document.getElementById('content-wrapper')||document.body,c=card.getBoundingClientRect(),t=content.getBoundingClientRect();
   if(!t.width)return;
   content.style.setProperty('--okla-pt-l',Math.max(0,Math.round(t.left-c.left))+'px');
   content.style.setProperty('--okla-pt-r',Math.max(0,Math.round(c.right-t.right))+'px');
  }
  line();addEventListener('resize',line);addEventListener('load',line);setTimeout(line,800);
  tabs.dataset.oklaTabs='1';
  return true;
 }
 function start(){
  if(setup())return;
  var tries=0;
  var mo=new MutationObserver(function(){if(setup()||++tries>80)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ok97-formatted']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
