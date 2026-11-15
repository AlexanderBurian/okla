/* OKLA V91 – "Kontakty" page. Laid out after NVIDIA's contact page but in OKLA
   blue: three contact cards, a "where to find us" block with CZ/SK/HU tabs, and
   a working contact form submitted through Shoptet's native MailForm action.
   Shown on /kontakty/ (takes over the CMS page). */
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
 var ENDPOINT='/action/MailForm/SendEmail/';
 var FORM_ID='1';
 var CONSENT_ID='40';

 var HTML=''+
 '<section class="oka-contact" aria-label="Kontakty">'+

 /* TOP: cards */
 '<div class="oka-c-top"><div class="oka-c-wrap">'+
   '<div class="oka-c-top__head"><h1>Kontaktujte OKLA</h1></div>'+
   '<div class="oka-c-cards">'+
     card('icon-support.png','Zákaznická podpora','Pomůžeme s objednávkou i reklamací.','Napsat podpoře','Dotaz k objednávce')+
     card('icon-advice-user-reference-v4.svg','Poradenství s výběrem','Pomůžeme vybrat vhodný přístroj.','Poradit s výběrem','Poradenství s výběrem')+
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
   '<form class="oka-c-formel" action="'+ENDPOINT+'" method="post">'+
     '<input type="hidden" name="formId" value="'+FORM_ID+'">'+
     '<div class="oka-c-row">'+
       '<div class="oka-c-field"><label for="okc-name">Jméno a příjmení</label><input id="okc-name" name="fullName" type="text" autocomplete="name" required placeholder="Jan Novák"></div>'+
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
     '<label class="oka-c-consent"><input type="checkbox" name="consents[]" value="'+CONSENT_ID+'" required><span>Souhlasím se zpracováním uvedených údajů za účelem vyřízení dotazu.</span></label>'+
     '<input type="text" name="surname" value="" autocomplete="off" tabindex="-1" aria-hidden="true" class="oka-c-honeypot">'+
     '<button type="submit" class="oka-c-btn">Odeslat zprávu'+ARROW+'</button>'+
     '<p class="oka-c-form__status" role="status" aria-live="polite"></p>'+
     '<p class="oka-c-form__note">Zpráva bude bezpečně odeslána přes kontaktní formulář Shoptetu. Nebo nám napište přímo na <a href="mailto:'+MAIL+'">'+MAIL+'</a>.</p>'+
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
  /* Real Shoptet mail form. The native action remains on the form as a
     no-JavaScript fallback; AJAX only keeps the visitor on this page. */
  var form=root.querySelector('.oka-c-formel');
  if(form)form.addEventListener('submit',function(e){
   e.preventDefault();
   function v(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():''}
   if(!form.checkValidity()){form.reportValidity();return}
   var name=v('fullName'),email=v('email'),topic=v('topic'),msg=v('message');
   var button=form.querySelector('button[type="submit"]'),status=form.querySelector('.oka-c-form__status');
   var original=button.innerHTML;button.disabled=true;button.textContent='Odesílám…';status.textContent='';status.className='oka-c-form__status';
   var body=new URLSearchParams();
   body.set('formId',FORM_ID);body.set('fullName',name);body.set('email',email);body.set('surname','');
   body.set('message','Téma: '+topic+'\n\n'+msg);body.append('consents[]',CONSENT_ID);
   try{if(window.shoptet&&shoptet.csrf&&shoptet.csrf.token)body.set('__csrf__',shoptet.csrf.token)}catch(err){}
   fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json, text/javascript, */*; q=0.01'},body:body.toString(),credentials:'same-origin'})
    .then(function(response){if(!response.ok)throw new Error('http '+response.status);return response.text()})
    .then(function(text){
     if(/"errors?"\s*:\s*\[[^\]]+\]|has-error|js-error/i.test(text||''))throw new Error('form error');
     form.reset();status.textContent='Zpráva byla odeslána. Ozveme se vám co nejdříve.';status.classList.add('is-success');
    })
    .catch(function(){status.innerHTML='Zprávu se nepodařilo odeslat. Napište nám na <a href="mailto:'+MAIL+'">'+MAIL+'</a>.';status.classList.add('is-error')})
    .finally(function(){button.disabled=false;button.innerHTML=original});
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
  /* Footer deep links: open the actual contact form with a relevant subject.
     The form is added by JavaScript, so the browser's initial hash jump is too early. */
  var topicFromUrl=new URLSearchParams(location.search).get('tema');
  var topics={
   objednavka:'Dotaz k objednávce',
   reklamace:'Reklamace nebo vrácení',
   poradenstvi:'Poradenství s výběrem',
   velkoobchod:'Velkoobchod / spolupráce',
   jine:'Jiné'
  };
  if(location.hash==='#okla-contact-form'){
   var sel=node.querySelector('#okc-topic');
   if(sel&&Object.prototype.hasOwnProperty.call(topics,topicFromUrl))sel.value=topics[topicFromUrl];
   requestAnimationFrame(function(){
    requestAnimationFrame(function(){
     var target=node.querySelector('#okla-contact-form');
     if(target)target.scrollIntoView({behavior:'auto',block:'start'});
    });
   });
  }
  return true;
 }
 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
