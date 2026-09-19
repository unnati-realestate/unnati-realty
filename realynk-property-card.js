/* REALYNK DIGITAL PROPERTY CARD V2 — Dashboard + Home property cards */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_CARD_V1__)return;
window.__REALYNK_PROPERTY_CARD_V1__=true;

function styles(){
 if(document.getElementById('realynkPropertyCardActionCSS'))return;
 var s=document.createElement('style');s.id='realynkPropertyCardActionCSS';
 s.textContent='.realynkPropertyCardActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.realynkPropertyCardActions button{border:0;border-radius:11px;padding:12px 8px;font-weight:800;font-size:13px;cursor:pointer;background:#0b3768;color:#fff}.realynkPropertyCardActions .rpcShare{background:#f4b400;color:#17324d}.realynkPropertyCardActions .rpcCopy{background:#eaf1f8;color:#0b3768}@media(max-width:480px){.realynkPropertyCardActions{grid-template-columns:1fr 1fr}}';
 document.head.appendChild(s);
}
function add(){
 var hosts=[document.getElementById('homeList'),document.getElementById('myList')].filter(Boolean);if(!hosts.length)return;
 hosts.forEach(function(host){host.querySelectorAll('.property').forEach(function(card){
  if(card.querySelector('.realynkPropertyCardActions'))return;
  var id=card.getAttribute('data-property-id');if(!id)return;
  var url=location.origin+location.pathname.replace(/[^/]*$/,'')+'property-card.html?id='+encodeURIComponent(id);
  var box=document.createElement('div');box.className='realynkPropertyCardActions';
  var share=document.createElement('button');share.type='button';share.className='rpcShare';share.textContent='🏠 Digital Property Card';
  share.onclick=function(){var text='🏠 Check this property on ReaLynk:\n'+(card.querySelector('h3')?.textContent||'Property')+'\n\n🔗 Digital Property Card:\n'+url;try{if(navigator.share){navigator.share({title:'ReaLynk Digital Property Card',text:text,url:url}).catch(function(){});return}}catch(e){}window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank')};
  var copy=document.createElement('button');copy.type='button';copy.className='rpcCopy';copy.textContent='📋 Copy Card Link';
  copy.onclick=function(){if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){alert('Digital Property Card link copied')}).catch(function(){prompt('Copy Digital Property Card link:',url)});else prompt('Copy Digital Property Card link:',url)};
  box.appendChild(share);box.appendChild(copy);card.appendChild(box);
 });
}
function start(){
 styles();[0,400,1000,2000,3500].forEach(function(ms){setTimeout(add,ms)});
 var host=document.getElementById('homeList');
 if(host&&window.MutationObserver)new MutationObserver(function(){setTimeout(add,20)}).observe(host,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();