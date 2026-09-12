/* REALYNK AUTH ENTRY V12 — authoritative catalog, filters and card rows */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V12__)return;
window.__REALYNK_AUTH_ENTRY_V12__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=6','realynkCloudSync',true);
load('./realynk-public-catalog.js?v=3','realynkPublicCatalog',false);
load('./realynk-property-form.js?v=2','realynkPropertyForm',false);
load('./realynk-property-display.js?v=5','realynkPropertyDisplayV5',false);
load('./realynk-category-filter.js?v=17','realynkCategoryFilterV17',false);
})();
