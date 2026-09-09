/* REALYNK HEAVY DEPOSIT V5 — working button delegated to unified filter */
(function(){
'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_V5__)return;
window.__REALYNK_HEAVY_DEPOSIT_V5__=true;
function inject(){
 var q=document.querySelector('.quick');
 if(!q||document.getElementById('heavyDeposit'))return;
 var b=document.createElement('button');
 b.id='heavyDeposit';b.type='button';b.innerHTML='💰<b>Heavy Deposit</b>';
 q.appendChild(b);
 b.addEventListener('click',function(e){
   e.preventDefault();
   e.stopImmediatePropagation();
   if(window.realynkPropertyFilter&&typeof window.realynkPropertyFilter.setFilter==='function'){
     window.realynkPropertyFilter.setFilter('Heavy Deposit');
   }
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
window.realynkHeavyDeposit={setFilter:function(v){if(window.realynkPropertyFilter)window.realynkPropertyFilter.setFilter(v?'Heavy Deposit':'All')},getFilter:function(){return !!(window.realynkPropertyFilter&&window.realynkPropertyFilter.getFilter()==='Heavy Deposit')}};
})();
