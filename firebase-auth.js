/* REALYNK AUTH ENTRY V11 — current property catalog/display + mobile-safe filters */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V11__)return;
window.__REALYNK_AUTH_ENTRY_V11__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=6','realynkCloudSync',true);
load('./realynk-public-catalog.js?v=2','realynkPublicCatalog',false);
load('./realynk-property-form.js?v=2','realynkPropertyForm',false);
load('./realynk-property-display.js?v=4','realynkPropertyDisplayV4',false);
load('./realynk-category-filter.js?v=16','realynkCategoryFilterV16',false);
})();
