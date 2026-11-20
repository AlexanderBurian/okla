/* Okla – homepage: the search field types example searches by itself ("Flipper Zero", "digitální multimetr", ...),
   so the visitor starts thinking of what to look for. Only the placeholder is animated - the field stays empty and
   works as usual. The moment the visitor touches the search (focus, click, tap), the animation stops for good and the
   ordinary placeholder is back, so they type their own words.
   PC: the header search field. Phones: the search box at the top of the homepage. */
(function(){
 'use strict';
 if(window.__oklaSearchTypingV1)return;window.__oklaSearchTypingV1=true;
 if(location.pathname!=='/'&&location.pathname!=='')return;
 var TERMS=['Flipper Zero','digitální multimetr','LILYGO T-Embed','endoskop s kamerou','chytré brýle','ESP32 deska','vlhkoměr dřeva','projektor'];
 var phone=window.matchMedia('(max-width:767px)');
 var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 var stopped=false,timer=null,target=null;

 function findTarget(){
  /* phones: the homepage search box (okla_home_search.js); PC: the header search field */
  var inp=phone.matches?document.querySelector('.okla-hsearch__in'):document.querySelector('#header .header-top .search input.query-input,#header input.query-input[name="string"]');
  if(!inp||!inp.getClientRects().length)return null;
  /* while it types, the placeholder is a soft grey (half opacity), noticeable but quiet */
  if(!document.getElementById('okla-st-style')){var st=document.createElement('style');st.id='okla-st-style';st.textContent='input.okla-st-typing::placeholder{color:#3f4b59!important;-webkit-text-fill-color:#3f4b59!important;opacity:.5!important}';document.head.appendChild(st)}
  inp.classList.add('okla-st-typing');
  return {node:inp,rest:inp.getAttribute('placeholder')||'Napište, co hledáte',set:function(s){inp.setAttribute('placeholder',s)},watch:inp,input:inp};
 }
 function stop(){
  if(stopped)return;stopped=true;clearTimeout(timer);
  if(target){target.set(target.rest);if(target.input)target.input.classList.remove('okla-st-typing')}
 }
 function idle(){return !target.input||!target.input.value}

 function run(){
  var term=0,pos=0,phase='type',blink=0;
  function tick(){
   if(stopped)return;
   if(!target.node.isConnected){stop();return}
   if(!idle()){timer=setTimeout(tick,400);return}
   var word=TERMS[term],delay;
   if(phase==='type'){
    pos++;target.set(word.slice(0,pos)+'|');
    if(pos>=word.length){phase='hold';blink=0}
    delay=75+Math.random()*70;
   }else if(phase==='hold'){
    blink++;target.set(word+(blink%2?'':'|'));
    if(blink>=4)phase='erase';
    delay=420;
   }else if(phase==='erase'){
    pos--;target.set(word.slice(0,pos)+'|');
    if(pos<=0){phase='pause';term=(term+1)%TERMS.length}
    delay=32;
   }else{
    target.set('|');phase='type';delay=380;
   }
   timer=setTimeout(tick,delay);
  }
  tick();
 }

 function begin(){
  target=findTarget();
  if(!target)return false;
  ['pointerdown','focus','focusin','keydown','click'].forEach(function(ev){target.watch.addEventListener(ev,stop,{once:true,capture:true})});
  if(reduce){target.set('Např. '+TERMS[0]);return true}
  run();
  return true;
 }
 /* starts once the page is shown (the loader's curtain is gone) and the field exists */
 var tries=0;
 (function wait(){
  if(stopped)return;
  if(document.readyState!=='loading'&&(window.__oklaRevealed||!document.documentElement.classList.contains('okla-curtain'))){
   if(begin())return;
  }
  if(++tries<120)setTimeout(wait,150);
 })();
 /* switching between phone and PC width: the old target is left as it was */
 if(phone.addEventListener)phone.addEventListener('change',stop);
})();
