/* REALYNK HEAVY DEPOSIT V4 — uses the unified property filter */
(function(){
'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_V4__)return;
window.__REALYNK_HEAVY_DEPOSIT_V4__=true;
function inject(){
 var q=document.querySelector('.quick');
 if(!q||document.getElementById('heavyDeposit'))return;
 var b=document.createElement('button');
 b.id='heavyDeposit';b.type='button';b.innerHTML='💰<b>Heavy Deposit</b>';
 q.appendChild(b);
}
function start(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkHeavyDeposit={setFilter:function(v){if(window.realynkPropertyFilter)window.realynkPropertyFilter.setFilter(v?'Heavy Deposit':'All')},getFilter:function(){return !!(window.realynkPropertyFilter&&window.realynkPropertyFilter.getFilter()==='Heavy Deposit')}};
})();
