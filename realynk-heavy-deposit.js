/* REALYNK HEAVY DEPOSIT V6 — button is owned by the unified core */
(function(){
'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_V6__)return;
window.__REALYNK_HEAVY_DEPOSIT_V6__=true;
function inject(){
 var q=document.querySelector('.quick');
 if(!q||document.getElementById('heavyDeposit'))return;
 var b=document.createElement('button');
 b.id='heavyDeposit';b.type='button';b.className='heavy';b.innerHTML='💰<b>Heavy Deposit</b>';
 q.appendChild(b);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
window.realynkHeavyDeposit={setFilter:function(v){var b=document.getElementById('heavyDeposit');if(b&&v)b.click()},getFilter:function(){return false}};
})();
