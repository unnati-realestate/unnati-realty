/* REALYNK SAFE BOOT — single property renderer for mobile + laptop */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__)return;window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__=true;
window.__REALYNK_CLOUD_FIRST__=true;
function load(src,key,module,ordered){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=ordered?false:true;s.dataset.realynkLoader=key;if(module)s.type='module';document.head.appendChild(s)}
function idle(fn,delay){if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});else setTimeout(fn,delay||500)}
function refreshPropertyViews(){setTimeout(function(){try{if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh();if(window.__REALYNK_CATEGORY_FINAL_REFRESH__)window.__REALYNK_CATEGORY_FINAL_REFRESH__()}catch(_){}},120)}
function start(){
 try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){}
 /* ONE owner for Buy, Sale, Rent, Commercial and Heavy Deposit. Load it now, not during idle time. */
 load('./heavy-deposit.js?v=33','realynkQuickCategoryOwnerV30',false,true);
 window.addEventListener('realynkCloudPropertiesRestored',refreshPropertyViews,false);
 window.addEventListener('realynkCloudPropertiesChanged',refreshPropertyViews,false);
 load('./realynk-stability.js?v=23','realynkStabilityV20',true,true);
 load('./realynk-listing-sections.js?v=9','realynkListingSectionsV8',false,true);
 load('./realynk-deal-fields.js?v=4','realynkDealFieldsV4',true);
 load('./realynk-cloud-unify.js?v=1','realynkCloudUnify',false);
 load('./realynk-payment-core.js?v=1','realynkPaymentCoreV1',false);
 load('./realynk-payment-adapter.js?v=1','realynkPaymentAdapterV1',true);
 idle(function(){load('./firebase-auth.js?v=24','realynkAuthEntryV24',false);load('./realynk-media.js?v=4','realynkMedia',false);load('./realynk-heavy-deposit-type.js?v=2','realynkHeavyDepositType',false);load('./realynk-public-actions.js?v=5','realynkPublicActions',false);load('./realynk-broker-share-card.js?v=4','realynkRefreshBrokerShareCard',false);load('./realynk-requirements.js?v=1','realynkRequirements',false);load('./realynk-broker-invite.js?v=8','realynkBrokerInvite',false);load('./realynk-broker-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);load('./realynk-list-dedupe.js?v=1','realynkListDedupeV1',false);load('./realynk-bulk-broker-import.js?v=2','realynkBulkBrokerImportV1',false)},300);
 document.addEventListener('click',function(e){var nav=e.target.closest('[data-nav]');if(nav&&nav.getAttribute('data-nav')==='brokers'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-professional-profile.js?v=2','realynkProfessionalProfile',false);load('./realynk-broker-share-card.js?v=4','realynkRefreshBrokerShareCard',false);load('./realynk-broker-invite.js?v=8','realynkBrokerInvite',false);load('./realynk-bulk-broker-import.js?v=2','realynkBulkBrokerImportV1',false)}if(nav&&nav.getAttribute('data-nav')==='dashboard'){load('./realynk-broker-dashboard.js?v=1','realynkBrokerDashboardV1',false);load('./realynk-broker-earning.js?v=4','realynkBrokerEarningV3',false)}if(nav&&nav.getAttribute('data-nav')==='account'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-digital-card.js?v=5','realynkDigitalCard',false);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true)}if(e.target.closest('#postQuick,#brokerPost,#add'))load('./realynk-video-replace.js?v=1','realynkVideoReplace',false)},true);
 idle(function(){load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true)},2200)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();