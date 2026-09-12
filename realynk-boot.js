/* REALYNK SAFE BOOT V61 — shared catalog + persistent property display */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_V61__)return;
window.__REALYNK_SAFE_BOOT_V61__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';s.dataset.realynkLoader=key;document.head.appendChild(s)}
function idle(fn,delay){if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});else setTimeout(fn,delay||500)}
function refreshPropertyViews(){setTimeout(function(){try{var active=document.querySelector('.screen.active'),id=active&&active.id,btn=id&&document.querySelector('[data-nav="'+id+'"];');if(btn)btn.click();}catch(_){}},80)}
function start(){
 try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){ }
 window.addEventListener('realynkCloudPropertiesRestored',refreshPropertyViews,false);
 idle(function(){
  load('./realynk-media.js?v=3','realynkMedia',false);
  load('./firebase-cloud.js?v=7','realynkCloudSync',true);
  load('./realynk-public-catalog.js?v=2','realynkPublicCatalog',false);
  load('./realynk-property-form.js?v=2','realynkPropertyForm',false);
  load('./realynk-property-display.js?v=4','realynkPropertyDisplayV4',false);
  load('./realynk-category-filter.js?v=16','realynkCategoryFilterV16',false);
  load('./realynk-heavy-deposit-type.js?v=1','realynkHeavyDepositType',false);
  load('./realynk-public-actions.js?v=5','realynkPublicActions',false);
  load('./realynk-broker-share-card.js?v=3','realynkRefreshBrokerShareCard',false);
  load('./realynk-requirements.js?v=1','realynkRequirements',false);
  load('./realynk-broker-invite.js?v=6','realynkBrokerInvite',false);
  load('./realynk-broker-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
 },500);
 document.addEventListener('click',function(e){
  var nav=e.target.closest('[data-nav]');
  if(nav&&nav.getAttribute('data-nav')==='brokers'){
   load('./realynk-broker-auth.js?v=6','realynkBrokerAuthV6',true);
   load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);
   load('./realynk-broker-share-card.js?v=3','realynkRefreshBrokerShareCard',false);
   load('./realynk-broker-invite.js?v=6','realynkBrokerInvite',false);
   load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
  }
  if(nav&&nav.getAttribute('data-nav')==='dashboard'){
   load('./realynk-property-actions.js?v=5','realynkPropertyActions',false);
   load('./realynk-status-actions.js?v=1','realynkStatusActions',false);
  }
  if(e.target.closest('#account')){
   load('./realynk-broker-auth.js?v=6','realynkBrokerAuthV6',true);
   load('./realynk-digital-card.js?v=1','realynkDigitalCard',false);
   load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true)
  }
  if(e.target.closest('#postQuick,#brokerPost,#add')){load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);load('./realynk-property-form.js?v=2','realynkPropertyForm',false)}
 },true);
 idle(function(){load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true)},2200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
