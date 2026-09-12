/* REALYNK AUTH ENTRY V21 — cache-busted mobile catalog + property rows */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V21__)return;window.__REALYNK_AUTH_ENTRY_V21__=true;
window.addEventListener('realynkCloudPropertiesRestored',function(){try{var home=document.querySelector('.screen.active');if(!home||home.id!=='home')return;setTimeout(function(){if(window.realynkPropertyDisplay&&window.realynkPropertyDisplay.refresh)window.realynkPropertyDisplay.refresh();if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh()},120)}catch(_){ }} ,true);
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=9','realynkCloudSyncV9',true);
load('./realynk-public-catalog.js?v=7','realynkPublicCatalogV7',false);
load('./realynk-property-form.js?v=4','realynkPropertyFormV4',false);
load('./realynk-property-display.js?v=10','realynkPropertyDisplayV10',false);
load('./realynk-category-filter.js?v=23','realynkCategoryFilterV23',false);
})();
