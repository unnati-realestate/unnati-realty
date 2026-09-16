/* REALYNK CLOUD UNIFY — mobile + laptop use the same Firebase property source */
(function(){
'use strict';
if(window.__REALYNK_CLOUD_UNIFY__)return;window.__REALYNK_CLOUD_UNIFY__=true;
function run(){
  var active=document.querySelector('.screen.active');
  if(!active)return;
  if(active.id==='dashboard' && window.realynkPropertyEdit && window.realynkPropertyDelete){
    var list=document.getElementById('myList');
    if(list && !list.querySelector('.property') && window.realynkPublicCatalog && window.realynkPublicCatalog.refresh){
      window.realynkPublicCatalog.refresh().catch(function(){});
    }
  }
}
function start(){
  run();
  setInterval(run,2000);
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-nav="dashboard"]'))setTimeout(run,700);
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
