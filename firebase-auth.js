/* REALYNK AUTH ENTRY V23 — cloud-first mobile auth; no legacy property batch sync */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V23__)return;window.__REALYNK_AUTH_ENTRY_V23__=true;
window.addEventListener('realynkCloudPropertiesRestored',function(){try{var home=document.querySelector('.screen.active');if(!home||home.id!=='home')return;setTimeout(function(){if(window.realynkPropertyDisplay&&window.realynkPropertyDisplay.refresh)window.realynkPropertyDisplay.refresh();if(window.realynkCategoryFilter&&window.realynkCategoryFilter.refresh)window.realynkCategoryFilter.refresh()},120)}catch(_){ }},true);
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
/* IMPORTANT: legacy firebase-cloud.js performed repeated full property restores and localStorage/media syncs. The V8 stability layer is now the cloud-first master, so do not start the heavy legacy sync on mobile. */
load('./realynk-public-catalog.js?v=8','realynkPublicCatalogV8',false);
load('./realynk-property-form.js?v=5','realynkPropertyFormV5',false);
load('./realynk-property-display.js?v=11','realynkPropertyDisplayV11',false);
load('./realynk-category-filter.js?v=24','realynkCategoryFilterV24',false);
})();
