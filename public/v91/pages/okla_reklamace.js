/* OKLA V123 – "Reklamace a vrácení zboží" form. A dedicated, fully functional
   complaint / return form on /reklamace/ (a page the shop has not created, so we
   take over the Shoptet 404). It submits automatically to Shoptet's own mail form
   action (/action/MailForm/SendEmail/, formId 1 – the same endpoint the contact
   form uses), so the shop receives every claim by e-mail with no extra backend.

   Prefill via URL: /reklamace/?order=250042&product=...&sku=...&type=reklamace
   A graceful fallback (mailto with the full claim) covers the rare case the mail
   action is unreachable, so the customer is never left stranded. */
(function(){
 'use strict';
 if(window.__oklaReklamaceV1)return;
 window.__oklaReklamaceV1=true;

 var MAIL='podpora@okla.cz';
 var POLICY='/reklamacni-rad/';
 var ENDPOINT='/action/MailForm/SendEmail/';
 var FORM_ID='1';
 var CONSENT_ID='40';

 var ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
 var CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function qp(name){try{return (new URLSearchParams(location.search)).get(name)||''}catch(e){return ''}}

 function makeRef(){
  var d=new Date();
  function p(n){return (n<10?'0':'')+n}
  var stamp=''+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate());
  var r='';var alpha='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(var i=0;i<4;i++)r+=alpha[Math.floor(Math.random()*alpha.length)];
  return 'REK-'+stamp+'-'+r;
 }

 var TYPES=[
  {v:'reklamace',b:'Reklamace (vada)',s:'Zboží je vadné nebo přestalo fungovat.'},
  {v:'vraceni',b:'Vrácení do 14 dní',s:'Odstoupení od smlouvy bez udání důvodu.'},
  {v:'vymena',b:'Výměna zboží',s:'Jiná velikost, varianta nebo kus.'}
 ];
 var RESOLUTIONS=[
  {v:'oprava',b:'Oprava'},
  {v:'vymena',b:'Výměna'},
  {v:'vraceni',b:'Vrácení peněz'},
  {v:'sleva',b:'Sleva'}
 ];
 var TYPE_LABEL={reklamace:'Reklamace (vada)',vraceni:'Vrácení do 14 dní (odstoupení)',vymena:'Výměna zboží'};
 var RES_LABEL={oprava:'Oprava',vymena:'Výměna',vraceni:'Vrácení peněz',sleva:'Sleva'};

 function choiceCards(name,items,checkedVal){
  return items.map(function(it,i){
   var id='okla-rk-'+name+'-'+it.v;
   var checked=(checkedVal?it.v===checkedVal:i===0)?' checked':'';
   return '<div class="okla-rk__choice">'+
     '<input type="radio" id="'+id+'" name="'+name+'" value="'+it.v+'"'+checked+'>'+
     '<label for="'+id+'"><b>'+esc(it.b)+'</b>'+(it.s?'<span>'+esc(it.s)+'</span>':'')+'</label>'+
   '</div>';
  }).join('');
 }

 function field(opts){
  var req=opts.req?'<span class="req" aria-hidden="true">*</span>':'';
  var cls='okla-rk__field'+(opts.full?' okla-rk__field--full':'');
  var input;
  if(opts.tag==='textarea'){
   input='<textarea id="'+opts.id+'" name="'+opts.name+'"'+(opts.req?' required':'')+(opts.ph?' placeholder="'+esc(opts.ph)+'"':'')+'>'+esc(opts.val||'')+'</textarea>';
  }else if(opts.tag==='select'){
   input='<select id="'+opts.id+'" name="'+opts.name+'">'+opts.options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>'}).join('')+'</select>';
  }else{
   input='<input type="'+(opts.type||'text')+'" id="'+opts.id+'" name="'+opts.name+'" value="'+esc(opts.val||'')+'"'+(opts.req?' required':'')+(opts.ph?' placeholder="'+esc(opts.ph)+'"':'')+(opts.attr||'')+'>';
  }
  return '<div class="'+cls+'" data-field="'+opts.name+'">'+
    '<label class="okla-rk__label" for="'+opts.id+'">'+esc(opts.label)+req+'</label>'+
    input+
    (opts.hint?'<p class="okla-rk__hint">'+esc(opts.hint)+'</p>':'')+
    '<p class="okla-rk__err">'+esc(opts.err||'Vyplňte prosím toto pole.')+'</p>'+
  '</div>';
 }

 function buildHTML(ref){
  var pOrder=esc(qp('order')||qp('code'));
  var pProduct=esc(qp('product'));
  var pSku=esc(qp('sku'));
  var pType=qp('type');
  if(!TYPE_LABEL[pType])pType='';
  return ''+
  '<section class="okla-rk" aria-labelledby="okla-rk-title">'+
   '<h1 class="okla-rk__title" id="okla-rk-title">Reklamace a vrácení zboží</h1>'+
   '<p class="okla-rk__lead">Vyplňte formulář a my se vám ozveme nejpozději do 3 pracovních dnů. '+
     'Postup i lhůty najdete v <a href="'+POLICY+'">reklamačním řádu</a>.</p>'+
   '<div class="okla-rk__ref-wrap"><span class="okla-rk__ref">Číslo požadavku: <b>'+esc(ref)+'</b></span></div>'+

   '<form class="okla-rk__card" id="okla-rk-form" novalidate>'+
     '<div class="okla-rk__banner" id="okla-rk-banner" role="alert"></div>'+

     '<fieldset class="okla-rk__step">'+
       '<legend class="okla-rk__legend"><span class="okla-rk__num">1</span>Co chcete řešit?</legend>'+
       '<div class="okla-rk__choices" role="radiogroup" aria-label="Typ požadavku" data-field="type">'+
         choiceCards('type',TYPES,pType)+
       '</div>'+
     '</fieldset>'+

     '<fieldset class="okla-rk__step">'+
       '<legend class="okla-rk__legend"><span class="okla-rk__num">2</span>Objednávka a produkt</legend>'+
       '<div class="okla-rk__grid">'+
         field({id:'okla-rk-order',name:'order',label:'Číslo objednávky',req:true,ph:'např. 250042',err:'Zadejte číslo objednávky.',val:pOrder})+
         field({id:'okla-rk-date',name:'date',label:'Datum nákupu',type:'date'})+
         field({id:'okla-rk-product',name:'product',label:'Název produktu',req:true,full:true,ph:'např. USB endoskop 5 m',err:'Uveďte, kterého produktu se to týká.',val:pProduct})+
         field({id:'okla-rk-sku',name:'sku',label:'Kód / SKU',hint:'Nepovinné – najdete na faktuře.',val:pSku})+
         field({id:'okla-rk-qty',name:'qty',label:'Počet kusů',type:'number',attr:' min="1"',val:'1'})+
       '</div>'+
     '</fieldset>'+

     '<fieldset class="okla-rk__step">'+
       '<legend class="okla-rk__legend"><span class="okla-rk__num">3</span>Popis a řešení</legend>'+
       '<div class="okla-rk__grid">'+
         field({id:'okla-rk-desc',name:'desc',tag:'textarea',label:'Popis závady / důvod vrácení',req:true,full:true,ph:'Popište prosím co nejpřesněji, jak se závada projevuje, kdy nastala a za jakých okolností.',err:'Popište prosím závadu nebo důvod.'})+
       '</div>'+
       '<div class="okla-rk__label" style="margin:18px 0 10px">Požadované řešení<span class="req" aria-hidden="true">*</span></div>'+
       '<div class="okla-rk__choices" role="radiogroup" aria-label="Požadované řešení" data-field="resolution" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+
         choiceCards('resolution',RESOLUTIONS,'')+
       '</div>'+
       '<div class="okla-rk__cond" id="okla-rk-cond-account" style="margin-top:18px">'+
         '<div class="okla-rk__grid">'+
           field({id:'okla-rk-account',name:'account',label:'Číslo bankovního účtu pro vrácení',full:true,ph:'123456789/0100',hint:'Vyplňte pro vrácení peněz.',err:'Pro vrácení peněz zadejte číslo účtu.'})+
         '</div>'+
       '</div>'+
     '</fieldset>'+

     '<fieldset class="okla-rk__step">'+
       '<legend class="okla-rk__legend"><span class="okla-rk__num">4</span>Kontaktní údaje</legend>'+
       '<div class="okla-rk__grid">'+
         field({id:'okla-rk-name',name:'name',label:'Jméno a příjmení',req:true,ph:'Jan Novák',err:'Zadejte jméno a příjmení.'})+
         field({id:'okla-rk-email',name:'email',type:'email',label:'E-mail',req:true,ph:'vas@email.cz',err:'Zadejte platný e-mail.'})+
         field({id:'okla-rk-phone',name:'phone',type:'tel',label:'Telefon',req:true,ph:'+420 777 123 456',err:'Zadejte telefonní číslo.'})+
         field({id:'okla-rk-photos',name:'photos',type:'url',label:'Odkaz na fotografie',hint:'Nepovinné – odkaz na fotky vady (Google Disk, Úschovna…).'})+
       '</div>'+
       '<div class="okla-rk__consent" data-field="consent">'+
         '<input type="checkbox" id="okla-rk-consent" name="consent">'+
         '<label for="okla-rk-consent">Seznámil/a jsem se s <a href="'+POLICY+'" target="_blank" rel="noopener">reklamačním řádem</a> a souhlasím se zpracováním uvedených údajů za účelem vyřízení požadavku.<span class="req" aria-hidden="true"> *</span></label>'+
       '</div>'+
     '</fieldset>'+

     '<div class="okla-rk__actions">'+
       '<button type="submit" class="okla-rk__submit" id="okla-rk-submit">Odeslat reklamaci'+ARROW+'</button>'+
       '<p class="okla-rk__formnote">Kopii požadavku vám zašleme na uvedený e-mail. Nebo nám napište přímo na <a href="mailto:'+MAIL+'">'+MAIL+'</a>.</p>'+
     '</div>'+

     '<input type="text" name="surname" value="" autocomplete="off" tabindex="-1" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">'+
   '</form>'+

   '<div class="okla-rk__done" id="okla-rk-done" role="status" aria-live="polite">'+
     '<div class="okla-rk__done-ic">'+CHECK+'</div>'+
     '<h2>Reklamace byla odeslána</h2>'+
     '<p>Děkujeme. Váš požadavek jsme přijali a ozveme se nejpozději do 3 pracovních dnů. Kopii jsme odeslali na váš e-mail.</p>'+
     '<div class="okla-rk__ref-wrap"><span class="okla-rk__ref">Číslo požadavku: <b>'+esc(ref)+'</b></span></div>'+
     '<div class="okla-rk__done-links">'+
       '<a class="is-primary" href="/">Zpět na úvod</a>'+
       '<a class="is-ghost" href="'+POLICY+'">Reklamační řád</a>'+
     '</div>'+
   '</div>'+
  '</section>';
 }

 function buildMessage(d){
  var L=[];
  L.push('NOVÁ REKLAMACE / VRÁCENÍ — '+d.ref);
  L.push('');
  L.push('Typ požadavku: '+(TYPE_LABEL[d.type]||d.type));
  L.push('Požadované řešení: '+(RES_LABEL[d.resolution]||d.resolution));
  L.push('');
  L.push('— Objednávka a produkt —');
  L.push('Číslo objednávky: '+(d.order||'—'));
  if(d.date)L.push('Datum nákupu: '+d.date);
  L.push('Produkt: '+d.product);
  if(d.sku)L.push('Kód / SKU: '+d.sku);
  if(d.qty)L.push('Počet kusů: '+d.qty);
  L.push('');
  L.push('— Popis —');
  L.push(d.desc);
  L.push('');
  L.push('— Kontakt —');
  L.push('Jméno: '+d.name);
  L.push('E-mail: '+d.email);
  L.push('Telefon: '+d.phone);
  if(d.account)L.push('Bankovní účet (vrácení peněz): '+d.account);
  if(d.photos)L.push('Fotografie: '+d.photos);
  L.push('');
  L.push('Odesláno z webového formuláře /reklamace/.');
  return L.join('\n');
 }

 function wire(root,ref){
  var form=root.querySelector('#okla-rk-form');
  var done=root.querySelector('#okla-rk-done');
  var banner=root.querySelector('#okla-rk-banner');
  var submit=root.querySelector('#okla-rk-submit');
  var condAccount=root.querySelector('#okla-rk-cond-account');

  function val(name){var el=form.querySelector('[name="'+name+'"]');return el?el.value.trim():''}
  function radio(name){var el=form.querySelector('[name="'+name+'"]:checked');return el?el.value:''}
  function fieldWrap(name){return form.querySelector('[data-field="'+name+'"]')}
  function setInvalid(name,on){var w=fieldWrap(name);if(w)w.classList.toggle('is-invalid',!!on)}
  function clearInvalid(){Array.prototype.forEach.call(form.querySelectorAll('.is-invalid'),function(w){w.classList.remove('is-invalid')})}

  /* Bank account is required (and shown) when the customer wants their money back. */
  function syncAccount(){
   var wantsRefund=radio('resolution')==='vraceni'||radio('type')==='vraceni';
   condAccount.classList.toggle('is-on',wantsRefund);
   return wantsRefund;
  }
  Array.prototype.forEach.call(form.querySelectorAll('[name="resolution"],[name="type"]'),function(r){
   r.addEventListener('change',syncAccount);
  });
  /* Vrácení do 14 dní → sensible default resolution = refund. */
  Array.prototype.forEach.call(form.querySelectorAll('[name="type"]'),function(r){
   r.addEventListener('change',function(){
    if(radio('type')==='vraceni'){var rr=form.querySelector('[name="resolution"][value="vraceni"]');if(rr)rr.checked=true}
    if(radio('type')==='vymena'){var rv=form.querySelector('[name="resolution"][value="vymena"]');if(rv)rv.checked=true}
    syncAccount();
   });
  });
  syncAccount();

  /* Clear a field's error as soon as the customer edits it. */
  Array.prototype.forEach.call(form.querySelectorAll('input,textarea,select'),function(el){
   el.addEventListener('input',function(){var w=el.closest('.okla-rk__field,.okla-rk__consent');if(w)w.classList.remove('is-invalid')});
  });

  function validate(){
   clearInvalid();
   var first=null;
   function bad(name){setInvalid(name,true);if(!first)first=fieldWrap(name)}
   if(!radio('type'))bad('type');
   if(!val('order'))bad('order');
   if(!val('product'))bad('product');
   if(!val('desc'))bad('desc');
   if(!radio('resolution'))bad('resolution');
   if(!val('name'))bad('name');
   var email=val('email');
   if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))bad('email');
   var phone=val('phone');
   if(!phone||phone.replace(/[^\d]/g,'').length<9)bad('phone');
   if(syncAccount()&&!val('account'))bad('account');
   var consent=form.querySelector('[name="consent"]');
   if(!consent.checked){fieldWrap('consent').classList.add('is-invalid');if(!first)first=fieldWrap('consent')}
   if(first){
    var focusable=first.querySelector('input,textarea,select');
    if(focusable&&focusable.focus)focusable.focus();
    else first.scrollIntoView({behavior:'smooth',block:'center'});
   }
   return !first;
  }

  function collect(){
   return {
    ref:ref,type:radio('type'),resolution:radio('resolution'),
    order:val('order'),date:val('date'),product:val('product'),sku:val('sku'),qty:val('qty'),
    desc:val('desc'),name:val('name'),email:val('email'),phone:val('phone'),
    account:val('account'),photos:val('photos')
   };
  }

  function showBanner(withMailto,data){
   banner.innerHTML='Odeslání se teď nezdařilo. Zkuste to prosím znovu'+
     (withMailto?', nebo odešlete reklamaci <a href="'+withMailto+'">e-mailem</a>.':'.');
   banner.classList.add('is-on');
   banner.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function succeed(){
   form.style.display='none';
   banner.classList.remove('is-on');
   done.classList.add('is-on');
   if(done.scrollIntoView)done.scrollIntoView({behavior:'smooth',block:'start'});
   try{if(window.dataLayer)window.dataLayer.push({event:'okla_reklamace_sent',ref:ref})}catch(e){}
  }

  form.addEventListener('submit',function(e){
   e.preventDefault();
   banner.classList.remove('is-on');
   if(!validate())return;
   var data=collect();
   var message=buildMessage(data);
   var mailto='mailto:'+MAIL+'?subject='+encodeURIComponent('Reklamace '+data.ref)+'&body='+encodeURIComponent(message);

   submit.disabled=true;submit.classList.add('is-loading');

   var body=new URLSearchParams();
   body.set('formId',FORM_ID);
   body.set('fullName',data.name);
   body.set('email',data.email);
   body.set('surname',''); /* honeypot stays empty */
   body.set('message',message);
   body.append('consents[]',CONSENT_ID);

   fetch(ENDPOINT,{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With':'XMLHttpRequest','Accept':'application/json, text/javascript, */*; q=0.01'},
    body:body.toString(),
    credentials:'same-origin'
   }).then(function(res){
    if(!res.ok)throw new Error('http '+res.status);
    return res.text().catch(function(){return ''});
   }).then(function(text){
    /* Shoptet answers 200 on success; guard against an explicit error payload. */
    if(/"errors?"\s*:\s*\[[^\]]+\]|has-error|js-error/i.test(text||''))throw new Error('form error');
    succeed();
   }).catch(function(){
    submit.disabled=false;submit.classList.remove('is-loading');
    showBanner(mailto,data);
   });
  });
 }

 function mount(){
  if(document.querySelector('.okla-rk'))return true;
  var target=document.querySelector('[data-okla-reklamace]');
  var onPage=/^\/reklamace(\/|$)/.test(location.pathname);
  if(!target&&!onPage)return false;
  var host=target||document.querySelector('#content .content-inner')||document.querySelector('#content')||document.body;
  if(!host)return false;
  var ref=makeRef();
  var wrap=document.createElement('div');
  wrap.innerHTML=buildHTML(ref);
  var node=wrap.firstChild;
  if(target){
   target.appendChild(node);
  }else{
   document.documentElement.classList.add('okla-rk-takeover');
   host.insertBefore(node,host.firstChild);
   document.title='Reklamace a vrácení zboží · OKLA';
  }
  wire(node,ref);
  return true;
 }

 if(!mount()){
  var tries=0;
  var mo=new MutationObserver(function(){if(mount()||++tries>40)mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
 }
})();
