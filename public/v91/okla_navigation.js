/* OKLA V91: DOM-only breadcrumb enhancer; visual rules in standalone CSS. */
(function(){'use strict';
 if(window.__oklaBreadcrumbV89)return;window.__oklaBreadcrumbV89=true;
 
 function run(){var nav=document.querySelector('.breadcrumbs');if(!nav)return;
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
  nav.querySelectorAll('.navigation-bullet').forEach(function(n){
    n.replaceChildren();var span=document.createElement('span');span.className='ok91-chevron';span.setAttribute('aria-hidden','true');span.textContent='›';n.appendChild(span);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();