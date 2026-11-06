/* OKLA V91 – customer account / client centre ("Zákaznické centrum"). Brings the
   logged-in account pages (Moje objednávky, Moje platby, …) and the login/register
   pages into the OKLA style: tags <html> with .okla-acc (so the CSS can card the
   content, hide the decorative side-art and drop the mobile footer) and rebuilds
   the account menu as a clean list from its standard "Moje …" / "Odhlásit se"
   labels. Everything is defensive: if the menu is not found, nothing is rebuilt. */
(function(){
 'use strict';
 if(window.__oklaAccountV1)return;
 window.__oklaAccountV1=true;

 function tclean(s){return String(s||'').replace(/\s+/g,' ').trim()}

 function isFormPage(){
  return document.body&&/(^|\s)in-(login|registrace|zapomenute-heslo)(\b|-)/.test(document.body.className);
 }
 /* Only the client-centre menu counts – the header account dropdown also has a
    logout link, so we deliberately exclude #header to avoid tagging normal pages. */
 function accountLinks(){
  var out=[],seen=[];
  var lists=[document.querySelector('#content'),document.querySelector('#content-wrapper aside'),document.querySelector('#content-wrapper .sidebar'),document.querySelector('.sidebar')];
  lists.forEach(function(root){
   if(!root)return;
   [].slice.call(root.querySelectorAll('a[href]')).forEach(function(a){if(seen.indexOf(a)<0){seen.push(a);out.push(a)}});
  });
  return out;
 }
 function findLogout(){
  var links=accountLinks();
  for(var i=0;i<links.length;i++){if(/^odhl[aá]sit/i.test(tclean(links[i].textContent)))return links[i]}
  return null;
 }

 function buildNav(){
  var all=accountLinks();
  var items=[],nodes=[];
  all.forEach(function(a){
   var raw=tclean(a.textContent),t=raw.toLowerCase(),href=a.getAttribute('href')||'';
   if(!raw||!href||href==='#'||/^javascript:/i.test(href))return;
   var isLogout=/^odhl[aá]sit/.test(t);
   if(!(/^moje\s/.test(t)||isLogout))return;
   if(items.some(function(x){return x.href===href&&x.logout===isLogout}))return;
   items.push({label:raw,href:href,logout:isLogout});nodes.push(a);
  });
  if(items.length<3)return false;   /* not a real account menu – leave the page alone */

  var nav=document.createElement('nav');
  nav.className='okla-acc-nav';nav.setAttribute('aria-label','Zákaznické centrum');
  var head=document.createElement('div');head.className='okla-acc-nav__head';head.textContent='Zákaznické centrum';
  nav.appendChild(head);
  var path=location.pathname.replace(/\/+$/,'');
  items.forEach(function(it){
   var a=document.createElement('a');a.href=it.href;a.textContent=it.label;
   a.className='okla-acc-nav__link'+(it.logout?' is-logout':'');
   var hp=it.href.replace(/^https?:\/\/[^/]+/,'').replace(/[?#].*$/,'').replace(/\/+$/,'');
   if(!it.logout&&hp&&hp===path)a.className+=' is-active';
   nav.appendChild(a);
  });

  /* Place our menu where the native one is. */
  var anchor=nodes[0].closest('ul, ol, .box, nav, .sidebar-inner, aside')||nodes[0].parentNode;
  /* Hide a native "Zákaznické / klientské centrum" heading BEFORE we insert ours
     (inserting shifts the siblings). */
  function hideHeading(el){if(el&&el!==anchor&&el!==nav&&/z[aá]kaznick|klientsk[eé]\s*centrum/i.test(tclean(el.textContent))&&el.children.length<2)el.classList.add('okla-acc-native-hide')}
  hideHeading(anchor.previousElementSibling);
  if(anchor.parentNode){hideHeading(anchor.parentNode.previousElementSibling);hideHeading(anchor.parentNode.firstElementChild)}
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(nav,anchor);
  else (document.querySelector('#content-wrapper')||document.body).insertBefore(nav,(document.querySelector('#content-wrapper')||document.body).firstChild);
  nodes.forEach(function(a){var li=a.closest('li');(li||a).classList.add('okla-acc-native-hide')});
  return true;
 }

 function run(){
  if(!document.body)return false;
  var center=!!findLogout();
  if(!center&&!isFormPage())return false;
  document.documentElement.classList.add('okla-acc');
  if(center){document.documentElement.classList.add('okla-acc-center');buildNav();}
  return true;
 }

 if(!run()){
  var tries=0;
  var mo=new MutationObserver(function(){if(run()||++tries>30)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){mo.disconnect()},8000);
 }
})();
