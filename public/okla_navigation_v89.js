/* OKLA V89: one accessible breadcrumb house; compact separators. */
(function(){'use strict';
 if(window.__oklaBreadcrumbV89)return;window.__oklaBreadcrumbV89=true;
 var style=document.createElement('style');style.id='ok89-breadcrumb-style';style.textContent=`
 /* Preserve Shoptet position and schema.org BreadcrumbList structure. */
 html body .breadcrumbs.navigation-home-icon-wrapper{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:0!important;min-height:34px!important;padding:6px 0!important;background:transparent!important;color:#777!important}
 html body .breadcrumbs [itemprop="itemListElement"]{display:inline-flex!important;align-items:center!important;gap:0!important;min-height:22px!important;width:auto!important;margin:0!important;padding:0!important;float:none!important;background:none!important}
 html body .breadcrumbs [itemprop="itemListElement"]::before,html body .breadcrumbs [itemprop="itemListElement"]::after{display:none!important;content:none!important}
 html body .breadcrumbs .sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
 html body .breadcrumbs a:not(.navigation-home-icon){color:#2C5F9E!important;text-decoration:none!important;font:400 12px/1.45 Roboto,Arial,sans-serif!important}
 html body .breadcrumbs a:not(.navigation-home-icon):hover{text-decoration:underline!important}
 html body .breadcrumbs #navigation-first a.navigation-home-icon{display:inline-flex!important;align-items:center!important;justify-content:center!important;position:static!important;width:20px!important;height:22px!important;margin:0!important;padding:0!important;float:none!important;text-indent:0!important;background:none!important;background-image:none!important;box-shadow:none!important;border:0!important;transform:none!important}
 html body .breadcrumbs #navigation-first a.navigation-home-icon::before,html body .breadcrumbs #navigation-first a.navigation-home-icon::after{content:none!important;display:none!important;background:none!important;border:0!important;box-shadow:none!important}
 html body .breadcrumbs #navigation-first a.navigation-home-icon svg:not(.ok89-home-icon),html body .breadcrumbs #navigation-first a.navigation-home-icon img{display:none!important}
 html body .breadcrumbs #navigation-first a.navigation-home-icon svg.ok89-home-icon{display:block!important;width:16px!important;height:16px!important;min-width:16px!important;max-width:16px!important;fill:none!important;stroke:#2C5F9E!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 html body .breadcrumbs .navigation-bullet{display:inline-flex!important;align-items:center!important;justify-content:center!important;position:static!important;vertical-align:middle!important;float:none!important;flex:0 0 12px!important;min-width:12px!important;max-width:12px!important;width:12px!important;height:18px!important;min-height:0!important;max-height:18px!important;margin:0 7px!important;padding:0!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;clip-path:none!important;transform:none!important;overflow:visible!important;text-indent:0!important;font-size:0!important;line-height:1!important;color:transparent!important}
 html body .breadcrumbs .navigation-bullet::before,html body .breadcrumbs .navigation-bullet::after{display:none!important;content:none!important;border:0!important;background:none!important;box-shadow:none!important;transform:none!important}
 html body .breadcrumbs .navigation-bullet .ok89-chevron{display:inline-block!important;position:static!important;line-height:1!important;font:400 13px/1 Roboto,Arial,sans-serif!important;letter-spacing:0!important;color:#A6ADB6!important;transform:none!important}
 html body .breadcrumbs [data-testid="breadcrumbsLastLevel"] [itemprop="name"]{color:#777!important;font:400 12px/1.45 Roboto,Arial,sans-serif!important}
 @media(max-width:375px){html body .breadcrumbs .navigation-bullet{margin:0 4px!important}}
 `;document.head.appendChild(style);
 function run(){var nav=document.querySelector('.breadcrumbs');if(!nav)return;
  var home=nav.querySelector('#navigation-first a.navigation-home-icon')||nav.querySelector('a.navigation-home-icon');
  if(home){
    // Remove old injected icons only, preserve native visually hidden name and structured-data markup.
    home.querySelectorAll('svg').forEach(function(svg){svg.remove()});
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ok89-home-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d','M3 10.5 12 3l9 7.5V21h-6.5v-6.5h-5V21H3z');svg.appendChild(p);home.appendChild(svg);
    home.setAttribute('aria-label','Domů');
  }
  nav.querySelectorAll('.navigation-bullet').forEach(function(n){
    n.replaceChildren();var span=document.createElement('span');span.className='ok89-chevron';span.setAttribute('aria-hidden','true');span.textContent='›';n.appendChild(span);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();