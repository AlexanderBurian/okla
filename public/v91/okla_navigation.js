/* OKLA V91: DOM-only breadcrumb enhancer; visual rules in standalone CSS. */
(function(){'use strict';
 if(window.__oklaBreadcrumbV89)return;window.__oklaBreadcrumbV89=true;
 
 function makeBullet(){
  var n=document.createElement('span');n.className='navigation-bullet ok91-generated-bullet';n.setAttribute('aria-hidden','true');
  var span=document.createElement('span');span.className='ok91-chevron';span.textContent='>';n.appendChild(span);return n;
 }
 function ensureBullets(nav){
  var items=[].slice.call(nav.querySelectorAll('[itemprop="itemListElement"]'));
  if(items.length<2)return;
  var correct=items.slice(1).every(function(item){var prev=item.previousElementSibling;return prev&&prev.classList.contains('ok91-generated-bullet')});
  if(correct&&nav.querySelectorAll('.ok91-generated-bullet').length===items.length-1)return;
  nav.querySelectorAll('.navigation-bullet').forEach(function(n){n.remove()});
  items.slice(1).forEach(function(item){item.parentNode.insertBefore(makeBullet(),item)});
 }
 function enhance(nav){
  var home=nav.querySelector('#navigation-first a.navigation-home-icon')||nav.querySelector('a.navigation-home-icon');
  if(home){
    // Hide only duplicate visual home links; keep their schema nodes and main link.
    nav.querySelectorAll('a.navigation-home-icon').forEach(function(a,i){if(a!==home){a.hidden=true;a.style.setProperty('display','none','important');a.setAttribute('aria-hidden','true');a.tabIndex=-1;}});
    // Remove old injected icons only, preserve native visually hidden name and structured-data markup.
    home.querySelectorAll('svg,img,i').forEach(function(el){el.remove()});
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ok91-home-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d','M3 10.5 12 3l9 7.5V21h-6.5v-6.5h-5V21H3z');svg.appendChild(p);home.appendChild(svg);
    home.setAttribute('aria-label','Domů');
  }
  ensureBullets(nav);
  if(!nav.__oklaBulletObserver){
   var queued=false;nav.__oklaBulletObserver=new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;ensureBullets(nav)})});
   nav.__oklaBulletObserver.observe(nav,{childList:true,subtree:true});
  }
 }
 function run(){document.querySelectorAll('.breadcrumbs').forEach(enhance)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 window.addEventListener('load',run,{once:true});
 setTimeout(run,250);setTimeout(run,900);setTimeout(run,1800);
 if(window.MutationObserver){
  var queued=false;
  new MutationObserver(function(records){
   if(queued||!records.some(function(record){return Array.from(record.addedNodes).some(function(node){return node.nodeType===1&&((node.matches&&node.matches('.breadcrumbs'))||(node.querySelector&&node.querySelector('.breadcrumbs')))})}))return;
   queued=true;requestAnimationFrame(function(){queued=false;run()});
  }).observe(document.documentElement,{childList:true,subtree:true});
 }
})();
