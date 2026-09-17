/* REALYNK SAFE BOOT — single property renderer for mobile + laptop */
(function(){
'use strict';
if(window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__)return;window.__REALYNK_SAFE_BOOT_SINGLE_SOURCE__=true;
window.__REALYNK_CLOUD_FIRST__=true;
function load(src,key,module,ordered){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=ordered?false:true;s.dataset.realynkLoader=key;if(module)s.type='module';document.head.appendChild(s)}
function idle(fn,delay){if(window.requestIdleCallback)window.requestIdleCallback(fn,{timeout:delay||1500});else setTimeout(fn,delay||500)}
function refreshPropertyViews(){setTimeout(function(){try{if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh()}catch(_){}},120)}

/* CATEGORY CLICK OWNER: installed before any async property script can bind. */
function installCategoryControl(){
 if(window.__REALYNK_BOOT_CATEGORY_CONTROL__)return;
 window.__REALYNK_BOOT_CATEGORY_CONTROL__=true;
 var active='';
 function clean(v){return String(v||'').trim().toLowerCase()}
 function commercialType(v){v=clean(v);return v==='commercial'||v.indexOf('commercial')!==-1||v==='shop'||v==='office'||v==='showroom'||v==='warehouse'||v==='land / plot'||v==='land'||v==='plot'}
 function match(v,w){v=clean(v);w=clean(w);return w==='commercial'?commercialType(v):w==='heavy deposit'?(v==='heavy deposit'||v.indexOf('heavy deposit')!==-1):v===w}
 function typeOf(card){var b=card&&card.querySelector('.details .detail:first-child b');return b?b.textContent:''}
 function clearActive(){document.querySelectorAll('.quick button').forEach(function(b){b.classList.remove('active')})}
 function clearViews(){var host=document.getElementById('homeList');if(!host)return;[].slice.call(host.querySelectorAll('.realynkListingRow,.property')).forEach(function(x){x.style.display=''})}
 function rerender(){var s=document.getElementById('search');if(s)s.dispatchEvent(new Event('input',{bubbles:true}))}
 function apply(){
  if(!active)return;
  var host=document.getElementById('homeList');if(!host)return;
  var wanted=active,target=null;
  [].slice.call(host.querySelectorAll('.realynkListingRow')).forEach(function(row){var ok=match(row.dataset.type||'',wanted);row.style.display=ok?'':'none';if(ok&&!target)target=row});
  [].slice.call(host.querySelectorAll('.property')).forEach(function(card){var ok=match(typeOf(card),wanted);card.style.display=ok?'':'none';if(ok&&!target)target=card});
  if(target&&target.scrollIntoView)target.scrollIntoView({behavior:'smooth',block:'start'});
 }
 document.addEventListener('click',function(e){
  var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;if(!b)return;
  clearActive();
  if(b.id==='commercial'||b.id==='heavyDeposit'){
   e.preventDefault();e.stopImmediatePropagation();active=b.id==='commercial'?'Commercial':'Heavy Deposit';window.__REALYNK_CATEGORY_FILTER__=active;rerender();apply();
   [50,150,300,600,1000,1800,3000].forEach(function(ms){setTimeout(function(){rerender();apply()},ms)});
  }else{active='';window.__REALYNK_CATEGORY_FILTER__='';clearViews();rerender()}
 },true);
 function removeLand(){var type=document.getElementById('type');if(!type)return;[].slice.call(type.options).forEach(function(o){if(clean(o.value)==='land / plot'||clean(o.textContent).indexOf('land / plot')!==-1)o.remove()})}
 removeLand();setInterval(removeLand,500);
 var css=document.createElement('style');css.textContent='.quick button:focus,.quick button:focus-visible,.quick button.active{outline:none!important;box-shadow:none!important}.quick button.active{border:1px solid var(--line)!important;background:#fff!important}#commercial:focus,#commercial:focus-visible,#heavyDeposit:focus,#heavyDeposit:focus-visible{outline:none!important;box-shadow:none!important}';document.head.appendChild(css);
}

function start(){
try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){})}}catch(_){ }
installCategoryControl();
window.addEventListener('realynkCloudPropertiesRestored',refreshPropertyViews,false);
window.addEventListener('realynkCloudPropertiesChanged',refreshPropertyViews,false);
/* Existing renderer remains intact for Buy/Sale/Rent. */
load('./realynk-stability.js?v=19','realynkStabilityV19',true,true);
load('./realynk-listing-sections.js?v=8','realynkListingSectionsV8',false,true);
load('./realynk-deal-fields.js?v=4','realynkDealFieldsV4',true);
load('./realynk-cloud-unify.js?v=1','realynkCloudUnify',false);
load('./realynk-payment-core.js?v=1','realynkPaymentCoreV1',false);
load('./realynk-payment-adapter.js?v=1','realynkPaymentAdapterV1',true);
idle(function(){
 load('./firebase-auth.js?v=24','realynkAuthEntryV24',false);
 load('./realynk-media.js?v=4','realynkMedia',false);
 load('./realynk-heavy-deposit-type.js?v=2','realynkHeavyDepositType',false);
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
if(nav&&nav.getAttribute('data-nav')==='account'){load('./realynk-broker-auth.js?v=7','realynkBrokerAuthV7',true);load('./realynk-digital-card.js?v=5','realynkDigitalCard',false);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);}
if(e.target.closest('#postQuick,#brokerPost,#add'))load('./realynk-video-replace.js?v=1','realynkVideoReplace',false);
},true);
idle(function(){load('./realynk-admin-entry.js?v=8','realynkAdminEntry',true)},2200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();