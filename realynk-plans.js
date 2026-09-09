/* REALYNK PLANS V2 — pricing UI + subscription entitlement foundation */
(function(){'use strict';
if(window.__REALYNK_PLANS_V2__)return;window.__REALYNK_PLANS_V2__=true;
var plans={
 FREE:{id:'FREE',name:'Free',price:0,listingLimit:5,featured:false,analytics:false,agency:false},
 BASIC:{id:'BASIC',name:'Basic',price:99,listingLimit:20,featured:false,analytics:true,agency:false},
 PREMIUM:{id:'PREMIUM',name:'Premium',price:249,listingLimit:100,featured:true,analytics:true,agency:false},
 PRO:{id:'PRO',name:'Pro / Agency',price:499,listingLimit:500,featured:true,analytics:true,agency:true}
};
var KEY='realynkSubscription';
function get(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.plan?x:{plan:'FREE',status:'active',expiresAt:null}}catch(e){return{plan:'FREE',status:'active',expiresAt:null}}}
function current(){var x=get();return Object.assign({},plans[x.plan]||plans.FREE,x)}
function save(plan,status,expiresAt,gateway){var x={plan:plans[plan]?plan:'FREE',status:status||'active',expiresAt:expiresAt||null,gateway:gateway||null,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(x));return x}
function can(feature){var p=current();return feature==='featured'?!!p.featured:feature==='analytics'?!!p.analytics:feature==='agency'?!!p.agency:true}
function listingAllowed(count){return Number(count||0)<Number(current().listingLimit)}
window.realynkPlans={plans:plans,get:get,current:current,save:save,can:can,listingAllowed:listingAllowed};
})();
