/* OKLA mobile v69: original static, external header only on upward scroll */
(function(){'use strict';if(window.__oklaV69)return;window.__oklaV69=true;
var mq=matchMedia('(max-width:767px)');
var floating=null,lastY=Math.max(0,window.scrollY||0),direction='none';
function original(){return document.querySelector('#header #okla-v61-header')}
function create(){
if(!mq.matches||floating||!original()||!document.body)return;
var source=original().querySelector('.okm61-logo');if(!source)return;
floating=document.createElement('div');floating.id='okla-v69-floating';floating.setAttribute('aria-hidden','true');floating.inert=true;
var shell=document.createElement('div');shell.className='okm69-shell';
var row=document.createElement('div');row.className='okm69-logo-row';
var logo=document.createElement('a');logo.className='okm69-logo';logo.href=source.getAttribute('href')||'/';logo.setAttribute('aria-label','OKLA – úvodní stránka');
var originImg=source.querySelector('img');if(originImg){var img=document.createElement('img');img.src=originImg.currentSrc||originImg.src;img.alt=originImg.alt||'OKLA';logo.appendChild(img)}else logo.textContent=source.textContent||'OKLA';
row.appendChild(logo);
var originalForm=original().querySelector('.okm61-search form'),originalInput=originalForm&&originalForm.querySelector('input[name]');
var form=document.createElement('form');form.className='okm69-search';form.method='get';form.action=originalForm&&originalForm.getAttribute('action')||'/vyhledavani/';form.setAttribute('role','search');
var btn=document.createElement('button');btn.type='submit';btn.setAttribute('aria-label','Hledat');btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m15.9 15.9 4.7 4.7"/></svg>';
var input=document.createElement('input');input.type='search';input.name=originalInput&&originalInput.name||'string';input.placeholder=originalInput&&originalInput.placeholder||'Napište, co hledáte';input.setAttribute('aria-label','Vyhledat produkt');
form.append(btn,input);shell.append(row,form);floating.appendChild(shell);document.body.appendChild(floating)
}
function visible(show){if(!floating)return;floating.classList.toggle('okla-v69-visible',show);floating.setAttribute('aria-hidden',show?'false':'true');floating.inert=!show}
function update(){var y=Math.max(0,window.scrollY||window.pageYOffset||0),dy=y-lastY;lastY=y;
if(!mq.matches){visible(false);return}
if(!floating)create();var originalHeader=document.getElementById('header');
if(y<=2||(originalHeader&&originalHeader.getBoundingClientRect().bottom>0)){direction='top';visible(false);return}
if(dy>0){direction='down';visible(false)}else if(dy<0){direction='up';visible(true)}
}
function ready(){create();update()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
addEventListener('scroll',update,{passive:true});addEventListener('resize',ready,{passive:true});addEventListener('load',ready,{once:true});setTimeout(ready,300);setTimeout(ready,900);setTimeout(ready,2000);
window.oklaMobileV69Inspect=function(){var o=document.getElementById('header');return {mobile:mq.matches,scrollY:Math.round(scrollY),direction:direction,originalPosition:o?getComputedStyle(o).position:null,originalBottom:o?Math.round(o.getBoundingClientRect().bottom):null,floatingExists:!!floating,floatingVisible:!!(floating&&floating.classList.contains('okla-v69-visible')),horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2}}
})();