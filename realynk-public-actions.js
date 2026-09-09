/* REALYNK PUBLIC PROPERTY ACTIONS V4 — official business WhatsApp destination */
(function(){
'use strict';
if(window.__REALYNK_PUBLIC_ACTIONS_V4__)return;
window.__REALYNK_PUBLIC_ACTIONS_V4__=true;
var BUSINESS_PHONE='9658364364';
function styles(){if(document.getElementById('realynkPublicActionStyles'))return;var s=document.createElement('style');s.id='realynkPublicActionStyles';s.textContent='.realynkPublicActions{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.realynkPublicActions button{border:0;border-radius:11px;padding:13px 8px;font-weight:800;font-size:14px;cursor:pointer;background:#0b3768;color:#fff}.realynkPublicActions .enq{background:#155a9c}.realynkPublicActions .share{background:#f4b400;color:#17324d}.realynkPublicActions button:active{transform:scale(.98)}';document.head.appendChild(s)}
function propertyUrl(){return location.href.split('#')[0]}
function wa(message){return 'https://wa.me/91'+BUSINESS_PHONE+'?text='+encodeURIComponent(message)}
function copy(url,msg){if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){alert(msg||'Property link copied')}).catch(function(){prompt('Copy property link:',url)});else prompt('Copy property link:',url)}
function add(root){if(!root)return;var cards=[];if(root.matches&&root.matches('.property'))cards=[root];cards=cards.concat(Array.prototype.slice.call(root.querySelectorAll?root.querySelectorAll('.property'):[]));cards.forEach(function(card){if(card.querySelector('.realynkPublicActions'))return;var title=(card.querySelector('h3')?.textContent||'Property').trim();var old=Array.prototype.slice.call(card.querySelectorAll('button')).find(function(x){return String(x.textContent||'').toLowerCase().indexOf('whatsapp')>=0});if(old&&old.parentNode)old.parentNode.removeChild(old);var box=document.createElement('div');box.className='realynkPublicActions';function btn(text,fn,cl){var b=document.createElement('button');b.type='button';b.textContent=text;if(cl)b.className=cl;b.onclick=fn;box.appendChild(b)}
btn('📞 Call',function(){location.href='tel:+91'+BUSINESS_PHONE});
btn('💬 WhatsApp',function(){window.open(wa('Hi, I found this property on Realynk: '+title),'_blank')});
btn('✉️ Enquire',function(){window.open(wa('Hello, I want to enquire about this property on Realynk: '+title+'. Please share more details and arrange a site visit.'),'_blank')},'enq');
btn('🔗 Share',function(){var url=propertyUrl();if(navigator.share)navigator.share({title:title,text:'Check this property on Realynk',url:url}).catch(function(){});else copy(url,'Realynk property link copied')},'share');
card.appendChild(box)})}
function start(){styles();add(document.getElementById('homeList'));setTimeout(function(){add(document.getElementById('homeList'))},500);setTimeout(function(){add(document.getElementById('homeList'))},1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
