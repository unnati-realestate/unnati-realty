/* REALYNK SAFE BOOT V31 — deferred startup to prevent browser/PWA freezes */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_V31__)return;
window.__REALYNK_SAFE_BOOT_V31__=true;
function load(src,key,module){
  if(window[key])return;
  var s=document.createElement('script');
  s.src=src;
  s.async=true;
  if(module)s.type='module';
  document.head.appendChild(s);
}
function idle(fn,delay){
  if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});
  else setTimeout(fn,delay||500);
}
function start(){
  /* Do not keep a service worker controlling the page while stability is being repaired. */
  try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){ }

  /* Load only the small, non-auth UI helpers after the first paint. */
  idle(function(){
    load('./realynk-media.js?v=3','realynkMedia',false);
    load('./realynk-property-filter.js?v=4','realynkPropertyFilter',false);
    load('./realynk-heavy-deposit.js?v=3','realynkHeavyDeposit',false);
  },1200);

  document.addEventListener('click',function(e){
    var nav=e.target.closest('[data-nav]');
    if(nav&&nav.getAttribute('data-nav')==='brokers'){
      load('./realynk-broker-auth.js?v=4','realynkBrokerAuth',true);
      load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);
    }
    if(e.target.closest('#account'))load('./realynk-broker-auth.js?v=4','realynkBrokerAuth',true);
    if(e.target.closest('#postQuick,#brokerPost,#add'))load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);
    if(e.target.closest('#submit'))load('./firebase-cloud.js?v=4','realynkCloudSync',true);
  },true);

  /* Admin/auth code is never loaded on the initial Home screen. */
  idle(function(){
    load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true);
  },2500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
