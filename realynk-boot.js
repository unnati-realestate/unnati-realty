/* REALYNK SAFE BOOT V86 — cloud-first property core + broker earning */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_V86__)return;window.__REALYNK_SAFE_BOOT_V86__=true;
window.__REALYNK_CLOUD_FIRST__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';s.dataset.realynkLoader=key;document.head.appendChild(s)}
function idle(fn,delay){if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});else setTimeout(fn,delay||500)}
function refreshPropertyViews(){setTimeout(function(){try{const active=document.querySelector('.screen.active');if(active&&active.id==='home'&&typeof render==='function')render();setTimeout(function(){try{if(window.realynkPublicCatalog&&window.realynkPublicCatalog.refresh)window.realynkPublicCatalog.refresh();if(window.realynkPropertyDisplay&&window.realynkPropertyDisplay.refresh)window.realynkPropertyDisplay.refresh();if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh()}catch(_){ }},160)}catch(_){}},80)}
function start(){
try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){ }
window.addEventListener('realynkCloudPropertiesRestored',refreshPropertyViews,false);
load('./realynk-stability.js?v=10','realynkStabilityV10',true);
load('./realynk-broker-name-fix.js?v=1','realynkBrokerNameFixV1',false);
load('./realynk-payment-core.js?v=1','realynkPaymentCoreV1',false);
load('./realynk-payment-adapter.js?v=1','realynkPaymentAdapterV1',true);
idle(function(){
 load('./firebase-auth.js?v=23','realynkAuthEntryV23',false);
 load('./realynk-media.js?v=4','realynkMedia',false);
 load('./realynk-heavy-deposit-type.js?v=1','realynkHeavyDepositType',false);
 load('./realynk-public-actions.js?v=5','realynkPublicActions',false);
 load('./realynk-broker-share-card.js?v=4','realynkRefreshBrokerShareCard',false);
 load('./realynk-requirements.js?v=1','realynkRequirements',false);
 load('./realynk-broker-invite.js?v=6','realynkBrokerInvite',false);
 load('./realynk-broker-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
 load('./realynk-list-dedupe.js?v=1','realynkListDedupeV1',false);
},300);
document.addEventListener('click',function(e){
var nav=e.target.closest('[data-nav]');
if(nav&&nav.getAttribute('data-nav')==='brokers'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);load('./realynk-broker-share-card.js?v=4','realynkRefreshBrokerShareCard',false);load('./realynk-broker-invite.js?v=6','realynkBrokerInvite',false)}
if(nav&&nav.getAttribute('data-nav')==='dashboard'){load('./realynk-property-actions.js?v=8','realynkPropertyActions',false);load('./realynk-status-actions.js?v=3','realynkStatusActions',false);load('./realynk-broker-dashboard.js?v=1','realynkBrokerDashboardV1',false);load('./realynk-broker-earning.js?v=3','realynkBrokerEarningV3',false);load('./realynk-dashboard-controls-fix.js?v=2','realynkDashboardControlsV2',false)}
if(nav&&nav.getAttribute('data-nav')==='account'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-digital-card.js?v=5','realynkDigitalCard',false);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true)}
if(e.target.closest('#postQuick,#brokerPost,#add'))load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);
},true);
idle(function(){load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true)},2200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();