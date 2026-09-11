/* REALYNK AUTH ENTRY V7 — authoritative broker verification + property cloud sync + category filter */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V7__)return;
window.__REALYNK_AUTH_ENTRY_V7__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=5','realynkCloudSync',true);
load('./realynk-category-filter.js?v=12','realynkCategoryFilterV12',false);
})();
