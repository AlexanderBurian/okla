/* OKLA – product page tools (Tisk, Zeptat se, Hlídat, Sdílet) in the OKLA style (okla_product_tools.css).
   Sdílet: Shoptet's share block loads Twitter and Facebook widgets that often stay empty; it is replaced by our own
   panel – Kopírovat odkaz, Facebook, WhatsApp, X, E-mail – and on phones by the system share sheet when available.
   Tisk, Zeptat se and Hlídat stay Shoptet's own (their dialogs are styled in CSS). */
(function(){
 'use strict';
 if(window.__oklaProductToolsV1)return;window.__oklaProductToolsV1=true;
 var NS='http://www.w3.org/2000/svg';
 var ICONS={
  link:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  facebook:'M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v6h4v-6h3l1-4h-4V8z',
  whatsapp:'M4 20l1.3-4A8 8 0 1 1 8 18.7z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.3-2.3l.8-1-1-2z',
  x:'M5 4l14 16 M19 4L5 20',
  mail:'M3 6h18v12H3z M3 7l9 6 9-6',
  check:'M5 12.5l4.5 4.5L19 7'
 };
 function svg(name){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');var p=document.createElementNS(NS,'path');p.setAttribute('d',ICONS[name]);s.appendChild(p);return s}
 function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
 var panel=null,anchor=null;
 function close(){if(panel){panel.hidden=true;if(anchor)anchor.setAttribute('aria-expanded','false')}}
 function build(){
  panel=el('div','okla-share');panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Sdílet produkt');
  panel.appendChild(el('p','okla-share__title','Sdílet produkt'));
  var list=el('div','okla-share__list');
  var url=location.origin+location.pathname,title=(document.querySelector('#content h1')||{}).textContent||document.title;
  title=title.replace(/\s+/g,' ').trim();
  var u=encodeURIComponent(url),t=encodeURIComponent(title);
  var copy=el('button','okla-share__item okla-share__item--copy');copy.type='button';copy.append(svg('link'),el('span',null,'Kopírovat odkaz'));
  copy.addEventListener('click',function(){
   var done=function(){copy.classList.add('is-done');copy.replaceChildren(svg('check'),el('span',null,'Odkaz zkopírován'));setTimeout(function(){copy.classList.remove('is-done');copy.replaceChildren(svg('link'),el('span',null,'Kopírovat odkaz'))},2200)};
   if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(done,function(){prompt('Odkaz na produkt:',url)});
   else prompt('Odkaz na produkt:',url);
  });
  list.appendChild(copy);
  [['facebook','Facebook','https://www.facebook.com/sharer/sharer.php?u='+u],
   ['whatsapp','WhatsApp','https://wa.me/?text='+t+'%20'+u],
   ['x','X','https://twitter.com/intent/tweet?url='+u+'&text='+t],
   ['mail','E-mail','mailto:?subject='+t+'&body='+t+'%0A'+u]].forEach(function(s){
   var a=el('a','okla-share__item okla-share__item--'+s[0]);a.href=s[2];
   if(s[0]!=='mail'){a.target='_blank';a.rel='noopener noreferrer'}
   a.append(svg(s[0]),el('span',null,s[1]));a.addEventListener('click',close);list.appendChild(a);
  });
  panel.appendChild(list);
  document.body.appendChild(panel);
 }
 function place(){
  var r=anchor.getBoundingClientRect(),w=panel.offsetWidth||260;
  var left=Math.max(12,Math.min(r.left+r.width/2-w/2,document.documentElement.clientWidth-w-12));
  panel.style.left=(left+window.pageXOffset)+'px';panel.style.top=(r.bottom+window.pageYOffset+10)+'px';
 }
 document.addEventListener('click',function(e){
  var trigger=e.target.closest&&e.target.closest('#content .js-share-buttons-trigger, #content a.link-icon.share');
  if(trigger){
   e.preventDefault();e.stopImmediatePropagation();
   var url=location.origin+location.pathname,title=((document.querySelector('#content h1')||{}).textContent||document.title).replace(/\s+/g,' ').trim();
   if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({title:title,url:url}).catch(function(){});return}
   if(!panel)build();
   anchor=trigger;
   if(panel.hidden){panel.hidden=false;trigger.setAttribute('aria-expanded','true');place()}else close();
   return;
  }
  if(panel&&!panel.hidden&&!panel.contains(e.target))close();
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 window.addEventListener('resize',function(){if(panel&&!panel.hidden)place()});
})();
