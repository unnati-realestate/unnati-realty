/* REALYNK BROKER NAME FIX V1 — restore broker name on dashboard cards */
(function(){
'use strict';
if(window.__REALYNK_BROKER_NAME_FIX_V1__)return;
window.__REALYNK_BROKER_NAME_FIX_V1__=true;
function getName(){
 try{
  var p=JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{};
  return String(p.agentName||p.name||'').trim()||'Realynk Broker';
 }catch(e){return 'Realynk Broker'}
}
function apply(){
 var host=document.getElementById('myList');
 if(!host)return;
 var name=getName();
 host.querySelectorAll('.property').forEach(function(card){
  if(card.querySelector('.realynk-broker-name'))return;
  var badge=document.createElement('div');
  badge.className='badge realynk-broker-name';
  badge.textContent='Broker: '+name;
  var status=card.querySelector('.badge');
  if(status)status.parentNode.insertBefore(badge,status);
  else{
   var actions=card.querySelector('.rt-actions');
   if(actions)card.insertBefore(badge,actions);
   else card.appendChild(badge);
  }
 });
}
function start(){
 apply();
 var host=document.getElementById('myList');
 if(host)new MutationObserver(apply).observe(host,{childList:true,subtree:true});
 window.addEventListener('realynkProfileStatusChanged',apply);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
