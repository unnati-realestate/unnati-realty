/* REALYNK AUTH ENTRY V6 — authoritative broker verification + property cloud sync start at page load */
(function(){
'use strict';
if(window.__REALYNK_AUTH_ENTRY_V6__)return;
window.__REALYNK_AUTH_ENTRY_V6__=true;
function load(src,key){if(window[key]||document.querySelector('script[data-realynk-auth-loader="'+key+'"]'))return;const s=document.createElement('script');s.type='module';s.src=src;s.async=true;s.dataset.realynkAuthLoader=key;document.head.appendChild(s)}
load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3');
load('./firebase-cloud.js?v=5','realynkCloudSync');
})();
