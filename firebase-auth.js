/* REALYNK AUTH ENTRY V16 — single-loader public catalog + property rows + stable mobile filters */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V16__)return;window.__REALYNK_AUTH_ENTRY_V16__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=8','realynkCloudSync',true);
load('./realynk-public-catalog.js?v=5','realynkPublicCatalog',false);
load('./realynk-property-form.js?v=2','realynkPropertyForm',false);
load('./realynk-property-display.js?v=7','realynkPropertyDisplay',false);
load('./realynk-category-filter.js?v=20','realynkCategoryFilter',false);
})();
