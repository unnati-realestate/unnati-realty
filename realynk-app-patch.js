/* REALYNK APP PATCH — disabled legacy renderer; Firebase cloud-first is authoritative */
(function(){
'use strict';
if(window.__REALYNK_LEGACY_PATCH_DISABLED__)return;
window.__REALYNK_LEGACY_PATCH_DISABLED__=true;
/* Property posting, rendering, edit, status and delete are intentionally owned by realynk-stability.js. */
})();
