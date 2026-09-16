/* REALYNK LIST DEDUPE V1 — hide exact duplicate listings without deleting data */
(function(){
'use strict';
if(window.__REALYNK_LIST_DEDUPE_V1__)return;
window.__REALYNK_LIST_DEDUPE_V1__=true;
function norm(v){return String(v??'').trim().toLowerCase().replace(/\s+/g,' ')}
function key(card){
 const title=norm(card.querySelector('h3')?.textContent||'');
 const vals=[...card.querySelectorAll('.detail b')].map(x=>norm(x.textContent));
 const area=norm(card.querySelector('div')?.textContent||'');
 return [title,area,...vals].join('|');
}
function dedupe(){
 const host=document.getElementById('myList');if(!host)return;
 const seen=new Set();let unique=0;
 [...host.querySelectorAll(':scope > .property')].forEach(card=>{
   const k=key(card);if(seen.has(k)){card.remove()}else{seen.add(k);unique++}
 });
 const count=document.getElementById('count');if(count)count.textContent=String(unique);
}
function start(){
 [300,800,1500,2500,4000].forEach(ms=>setTimeout(dedupe,ms));
 const host=document.getElementById('myList');
 if(host&&window.MutationObserver)new MutationObserver(function(){setTimeout(dedupe,30)}).observe(host,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkListDedupe={refresh:dedupe};
})();
