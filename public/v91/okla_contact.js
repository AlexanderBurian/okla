/* OKLA V91 – "Kontakty" page. Laid out after NVIDIA's contact page but in OKLA
   blue: three contact cards, a "where to find us" block with CZ/SK/HU tabs, and
   a working contact form (opens the visitor's e-mail client pre-filled to
   podpora@okla.cz). Shown on /kontakty/ (takes over the CMS page). */
(function(){
 'use strict';
 if(window.__oklaContactV1)return;
 window.__oklaContactV1=true;

 var BASE=window.__oklaAssetBase||'';
 function IMG(f){return BASE+'v91/img/contact/'+f}
 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

 function card(img,title,text,btn,topic){
  return '<div class="oka-c-card">'+
   '<div class="oka-c-card__ic"><img src="'+IMG(img)+'" alt="" loading="lazy"></div>'+
   '<h3>'+title+'</h3><p>'+text+'</p>'+
   '<a class="oka-c-btn" href="#okla-contact-form" data-contact-topic="'+topic+'">'+btn+ARROW+'</a>'+
  '</div>';
 }
  function col(title,items){
  var h='<div class="oka-c-col"><h3>'+title+'</h3>';
  items.forEach(function(it){h+='<div class="oka-c-item"><b>'+it[0]+'</b><span>'+it[1]+'</span></div>'});
  return h+'</div>';
 }
 function panel(id,active,cols){return '<div class="oka-c-panel'+(active?' is-active':'')+'" data-panel="'+id+'"><div class="oka-c-grid">'+cols+'</div></div>'}

 var MAIL='podpora@okla.cz';

 var HTML=''+
 '<section class="oka-contact" aria-label="Kontakty">'+

 /* TOP: cards */
 '<div class="oka-c-top"><div class="oka-c-wrap">'+
   '<div class="oka-c-top__head"><h1>Kontaktujte OKLA</h1></div>'+
   '<div class="oka-c-cards">'+
     card('icon-support.png','Zákaznická podpora','Pomůžeme s objednávkou i reklamací.','Napsat podpoře','Dotaz k objednávce')+
     card('icon-advice.webp','Poradenství s výběrem','Pomůžeme vybrat vhodný přístroj.','Poradit s výběrem','Poradenství s výběrem')+
     card('icon-business.png','Pro firmy a velkoobchod','Napište nám ohledně velkoobchodní spolupráce.','Chci spolupracovat','Velkoobchod / spolupráce')+
   '</div>'+
 '</div></div>'+

 /* LOCATIONS */
 '<div class="oka-c-loc"><div class="oka-c-wrap">'+
   '<div class="oka-c-loc__head"><h2>Kde nás najdete</h2></div>'+
   '<div class="oka-c-tabs">'+
     '<button type="button" class="oka-c-tab is-active" data-tab="cz">Česko</button>'+
     '<button type="button" class="oka-c-tab" data-tab="sk">Slovensko</button>'+
     '<button type="button" class="oka-c-tab" data-tab="hu">Maďarsko</button>'+
   '</div>'+
   '<div class="oka-c-panels">'+
     panel('cz',true,
       col('Sídlo a sklad',[['OKLA – sklad a zázemí','Ostrava, Moravskoslezský kraj'],['Otevírací doba podpory','Po–Pá 9:00–17:00']])+
       col('Kontakt',[['E-mail','<a href="mailto:'+MAIL+'">'+MAIL+'</a>'],['Online objednávky','24/7 na okla.cz']])+
       col('Doručení',[['Dopravci a výdejní místa','Po celém Česku'],['Expedice','Zpravidla do 24 hodin v pracovní dny']])
     )+
     panel('sk',false,
       col('Doručujeme',[['Slovenská republika','Doručujeme od roku 2022'],['Jazyk podpory','Slovenčina i čeština']])+
       col('Kontakt',[['E-mail','<a href="mailto:'+MAIL+'">'+MAIL+'</a>'],['Objednávky','24/7 na okla.cz']])+
       col('Doprava',[['Zásielkovňa a kuriéri','Výdajné miesta po celej SR'],['Expedícia','Zo skladu v Ostrave']])
     )+
     panel('hu',false,
       col('Doručujeme',[['Maďarsko','Doručujeme od roku 2024'],['Jazyk podpory','Maďarsky i česky']])+
       col('Kontakt',[['E-mail','<a href="mailto:'+MAIL+'">'+MAIL+'</a>'],['Objednávky','24/7 na okla.cz']])+
       col('Doprava',[['Výdejní místa a kurýři','Po celém Maďarsku'],['Expedice','Ze skladu v Ostravě']])
     )+
   '</div>'+
 '</div></div>'+

 /* FORM */
 '<div class="oka-c-form" id="okla-contact-form"><div class="oka-c-wrap"><div class="oka-c-form__inner">'+
   '<div class="oka-c-form__head"><h2>Napište nám</h2></div>'+
   '<form class="oka-c-formel" novalidate>'+
     '<div class="oka-c-row">'+
       '<div class="oka-c-field"><label for="okc-name">Jméno a příjmení</label><input id="okc-name" name="name" type="text" autocomplete="name" required placeholder="Jan Novák"></div>'+
       '<div class="oka-c-field"><label for="okc-email">E-mail</label><input id="okc-email" name="email" type="email" autocomplete="email" required placeholder="vas@email.cz"></div>'+
     '</div>'+
     '<div class="oka-c-row">'+
       '<div class="oka-c-field oka-c-field--full"><label for="okc-topic">Téma</label>'+
         '<select id="okc-topic" name="topic">'+
           '<option>Dotaz k objednávce</option>'+
           '<option>Poradenství s výběrem</option>'+
           '<option>Reklamace nebo vrácení</option>'+
           '<option>Velkoobchod / spolupráce</option>'+
           '<option>Jiné</option>'+
         '</select>'+
       '</div>'+
     '</div>'+
     '<div class="oka-c-row">'+
       '<div class="oka-c-field oka-c-field--full"><label for="okc-msg">Zpráva</label><textarea id="okc-msg" name="message" required placeholder="S čím vám můžeme pomoci?"></textarea></div>'+
     '</div>'+
     '<button type="submit" class="oka-c-btn">Odeslat zprávu'+ARROW+'</button>'+
     '<p class="oka-c-form__note">Odesláním se otevře váš e-mailový klient s předvyplněnou zprávou. Nebo nám napište přímo na <a href="mailto:'+MAIL+'">'+MAIL+'</a>.</p>'+
   '</form>'+
 '</div></div></div>'+

 '</section>';

 function wire(root){
  /* Each contact card leads to the shared form and selects a relevant topic. */
  Array.prototype.forEach.call(root.querySelectorAll('.oka-c-card .oka-c-btn'),function(link){
   link.addEventListener('click',function(event){
    var target=root.querySelector('#okla-contact-form');
    if(!target)return;
    event.preventDefault();
    var select=root.querySelector('#okc-topic');
    var topic=link.getAttribute('data-contact-topic');
    if(select&&topic)select.value=topic;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
   });
  });
  /* tabs */
  var tabs=[].slice.call(root.querySelectorAll('.oka-c-tab'));
  var panels=[].slice.call(root.querySelectorAll('.oka-c-panel'));
  tabs.forEach(function(t){t.addEventListener('click',function(){
   var id=t.getAttribute('data-tab');
   tabs.forEach(function(x){x.classList.toggle('is-active',x===t)});
   panels.forEach(function(p){p.classList.toggle('is-active',p.getAttribute('data-panel')===id)});
  })});
  /* form -> mailto */
  var form=root.querySelector('.oka-c-formel');
  if(form)form.addEventListener('submit',function(e){
   e.preventDefault();
   function v(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():''}
   var name=v('name'),email=v('email'),topic=v('topic'),msg=v('message');
   if(!name||!email||!msg){
    if(!name)form.querySelector('[name="name"]').focus();
    else if(!email)form.querySelector('[name="email"]').focus();
    else form.querySelector('[name="message"]').focus();
    return;
   }
   var subject='Kontakt z webu: '+topic;
   var body='Jméno: '+name+'\nE-mail: '+email+'\nTéma: '+topic+'\n\n'+msg+'\n';
   window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
 }

 function mount(){
  if(document.querySelector('.oka-contact'))return true;
  var onPage=/^\/kontakt(y)?(\/|$)/.test(location.pathname)||(document.body&&document.body.classList.contains('in-kontakt'));
  if(!onPage)return false;
  var host=document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  if(!host)return false;
  document.documentElement.classList.add('okla-contact-takeover');
  var wrap=document.createElement('div');
  wrap.innerHTML=HTML;
  var node=wrap.firstChild;
  host.insertBefore(node,host.firstChild);
  document.title='Kontakty · OKLA';
  wire(node);
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
