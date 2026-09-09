/* REALYNK SAFE BOOT V30 — stable lightweight startup */
(function(){'use strict';
function load(src,key,module){if(window[key])return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';document.head.appendChild(s)}
function start(){
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=58').catch(function(){});
  load('./realynk-media.js?v=3','realynkMedia',false);
  load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true);
  load('./realynk-broker-auth.js?v=4','realynkBrokerAuth',true);
  load('./realynk-property-filter.js?v=4','realynkPropertyFilter',false);
  load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);
  load('./realynk-heavy-deposit.js?v=3','realynkHeavyDeposit',false);
  document.addEventListener('click',function(e){
    var nav=e.target.closest('[data-nav]');
    if(nav&&nav.getAttribute('data-nav')==='brokers')load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);
    if(e.target.closest('#submit'))load('./firebase-cloud.js?v=4','realynkCloudSync',true);
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
