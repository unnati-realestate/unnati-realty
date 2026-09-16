/* REALYNK AUTH ENTRY — cloud-first mobile auth; no legacy property catalog */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_SINGLE_SOURCE__)return;window.__REALYNK_AUTH_ENTRY_SINGLE_SOURCE__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
/* Firebase/realynk-stability.js is the authoritative property source. The old public
   catalog is deliberately not loaded because it can restore stale localStorage data. */
load('./realynk-property-form.js?v=5','realynkPropertyFormV5',false);
load('./realynk-property-display.js?v=12','realynkPropertyDisplaySingleSource',false);
load('./realynk-category-filter.js?v=24','realynkCategoryFilterV24',false);
})();
