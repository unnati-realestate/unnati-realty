/* REALYNK SAFE BOOT — single property renderer for mobile + laptop */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__)return;window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__=true;
window.__REALYNK_CLOUD_FIRST__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';s.dataset.realynkLoader=key;document.head.appendChild(s)}
function idle(fn,delay){if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});else setTimeout(fn,delay||500)}
function refreshPropertyViews(){setTimeout(function(){try{if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh()}catch(_){}},120)}
function ensureOwnerControls(){
 var list=document.getElementById('myList'); if(!list)return;
 list.querySelectorAll('.property').forEach(function(card){
   var id=card.getAttribute('data-property-id')||card.dataset.propertyId; if(!id)return;
   var old=card.querySelector('[data-realynk-persistent-actions]'); if(old)return;
   var box=document.createElement('div'); box.setAttribute('data-realynk-persistent-actions','1');
   box.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;padding-top:4px;position:relative;z-index:5';
   var edit=document.createElement('button'); edit.type='button'; edit.textContent='✎ Edit'; edit.dataset.id=id; edit.dataset.realynkPersistentAction='edit';
   edit.style.cssText='flex:1;min-width:120px;padding:12px;border:1px solid #cfd9e5;border-radius:10px;background:#fff;color:#0b3768;font-weight:800;font-size:15px;cursor:pointer';
   var del=document.createElement('button'); del.type='button'; del.textContent='🗑 Delete'; del.dataset.id=id; del.dataset.realynkPersistentAction='delete';
   del.style.cssText='flex:1;min-width:120px;padding:12px;border:1px solid #efc5c2;border-radius:10px;background:#fff;color:#b42318;font-weight:800;font-size:15px;cursor:pointer';
   box.append(edit,del); card.appendChild(box);
 });
}
function bindPersistentControls(){
 document.addEventListener('click',function(e){
   var b=e.target.closest('[data-realynk-persistent-action]'); if(!b)return;
   e.preventDefault();e.stopImmediatePropagation();
   var id=b.dataset.id;
   if(b.dataset.realynkPersistentAction==='edit'&&window.realynkPropertyEdit)window.realynkPropertyEdit(id);
   if(b.dataset.realynkPersistentAction==='delete'&&window.realynkPropertyDelete)window.realynkPropertyDelete(id);
 },true);
 ensureOwnerControls();
 var list=document.getElementById('myList');
 if(list){new MutationObserver(function(){ensureOwnerControls()}).observe(list,{childList:true,subtree:true})}
 setInterval(ensureOwnerControls,1000);
}
function start(){
try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){ }
window.addEventListener('realynkCloudPropertiesRestored',refreshPropertyViews,false);
window.addEventListener('realynkCloudPropertiesChanged',refreshPropertyViews,false);
load('./realynk-stability.js?v=11','realynkStabilityV11',true);
load('./realynk-cloud-unify.js?v=1','realynkCloudUnify',false);
load('./realynk-broker-name-fix.js?v=1','realynkBrokerNameFixV1',false);
load('./realynk-payment-core.js?v=1','realynkPaymentCoreV1',false);
load('./realynk-payment-adapter.js?v=1','realynkPaymentAdapterV1',true);
idle(function(){
 load('./firebase-auth.js?v=24','realynkAuthEntryV24',false);
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
if(nav&&nav.getAttribute('data-nav')==='dashboard'){load('./realynk-broker-dashboard.js?v=1','realynkBrokerDashboardV1',false);load('./realynk-broker-earning.js?v=3','realynkBrokerEarningV3',false)}
if(nav&&nav.getAttribute('data-nav')==='account'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-digital-card.js?v=5','realynkDigitalCard',false);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true)}
if(e.target.closest('#postQuick,#brokerPost,#add'))load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);
},true);
idle(function(){load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true)},2200);
setTimeout(bindPersistentControls,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
