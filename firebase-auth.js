/* REALYNK AUTH ENTRY — cloud-first mobile auth; one property renderer */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_SINGLE_SOURCE__)return;window.__REALYNK_AUTH_ENTRY_SINGLE_SOURCE__=true;
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
/* realynk-stability.js owns Firebase property loading, rendering, posting, status and delete.
   Do not load legacy public catalog or secondary property display/renderers here. */
load('./realynk-property-form.js?v=5','realynkPropertyFormV5',false);
load('./realynk-category-filter.js?v=24','realynkCategoryFilterV24',false);
})();
