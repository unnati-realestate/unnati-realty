/* REALYNK SAFE BOOT V11 */
(function(){'use strict';
function load(src,key,module){if(window[key])return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';document.head.appendChild(s)}
function start(){
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=47').catch(function(){});
  load('./realynk-media.js?v=2','realynkMedia',false);
  load('./realynk-admin-entry.js?v=2','realynkAdminEntry',false);
  document.addEventListener('click',function(e){
    var nav=e.target.closest('[data-nav]');
    if(nav&&nav.getAttribute('data-nav')==='brokers')load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);
    if(e.target.closest('#realynkSuperAdminEntry'))load('./super-admin.js?v=4','realynkSuperAdmin',true);
    if(e.target.closest('#submit'))load('./firebase-cloud.js?v=3','realynkCloudSync',true);
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
