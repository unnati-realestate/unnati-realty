/* Realynk share helper kept intentionally lightweight. The clean hotfix renders the single Share button. */
(function(){
  'use strict';
  function start(){
    document.addEventListener('click',function(e){
      var btn=e.target.closest('.realynk-share-btn');
      if(!btn || btn.dataset.realynkHandled==='1') return;
      btn.dataset.realynkHandled='1';
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
