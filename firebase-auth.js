/* REALYNK AUTH ENTRY V8 — unified property cloud + authoritative broker verification + mobile-safe filters */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V8__)return;
window.__REALYNK_AUTH_ENTRY_V8__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=6','realynkCloudSync',true);
load('./realynk-category-filter.js?v=14','realynkCategoryFilterV14',false);
})();
