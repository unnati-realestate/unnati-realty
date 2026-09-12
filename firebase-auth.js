/* REALYNK AUTH ENTRY V18 — stable catalog, property rows and mobile filters */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V18__)return;window.__REALYNK_AUTH_ENTRY_V18__=true;
window.addEventListener('realynkCloudPropertiesRestored',function(){try{var home=document.querySelector('.screen.active');if(!home||home.id!=='home')return;window.__REALYNK_SUPPRESS_SYNTHETIC_HOME_NAV__=true;setTimeout(function(){window.__REALYNK_SUPPRESS_SYNTHETIC_HOME_NAV__=false},900)}catch(_){ }},true);
window.addEventListener('click',function(e){try{if(!window.__REALYNK_SUPPRESS_SYNTHETIC_HOME_NAV__||e.isTrusted)return;var nav=e.target&&e.target.closest?e.target.closest('[data-nav]'):null;if(nav&&nav.getAttribute('data-nav')==='home'){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();window.__REALYNK_SUPPRESS_SYNTHETIC_HOME_NAV__=false}}catch(_){ }},true);
function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');if(module)s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true);
load('./firebase-cloud.js?v=8','realynkCloudSync',true);
load('./realynk-public-catalog.js?v=6','realynkPublicCatalog',false);
load('./realynk-property-form.js?v=3','realynkPropertyForm',false);
load('./realynk-property-display.js?v=8','realynkPropertyDisplay',false);
load('./realynk-category-filter.js?v=21','realynkCategoryFilter',false);
})();
