/* REALYNK STATUS COLOURS — stable professional dashboard controls */
(function(){
  'use strict';
  if(window.__REALYNK_STATUS_COLOURS_V1__) return;
  window.__REALYNK_STATUS_COLOURS_V1__=true;

  function apply(){
    if(!document.getElementById('realynkStatusColoursCSS')){
      var s=document.createElement('style');
      s.id='realynkStatusColoursCSS';
      s.textContent=''
      +'.realynkPermanentControls .rt-edit{background:#eff6ff!important;border:2px solid #2563eb!important;color:#1d4ed8!important;}'
      +'.realynkPermanentControls .rt-delete{background:#fef2f2!important;border:2px solid #dc2626!important;color:#b91c1c!important;}'
      +'.realynkStatusSelect.status-active{background:#ecfdf5!important;border-color:#22c55e!important;color:#15803d!important;}'
      +'.realynkStatusSelect.status-rented{background:#eff6ff!important;border-color:#3b82f6!important;color:#1d4ed8!important;}'
      +'.realynkStatusSelect.status-sold{background:#faf5ff!important;border-color:#9333ea!important;color:#7e22ce!important;}'
      +'.realynkStatusSelect.status-booked{background:#fffbeb!important;border-color:#eab308!important;color:#a16207!important;}'
      +'.realynkStatusSelect.status-offmarket{background:#fff7ed!important;border-color:#f97316!important;color:#c2410c!important;}'
      +'.realynkCardActive{border-left-color:#22c55e!important;}'
      +'.realynkCardSold{border-left-color:#9333ea!important;}'
      +'.realynkCardOffMarket{border-left-color:#f97316!important;}';
      document.head.appendChild(s);
    }
    document.querySelectorAll('#myList .property').forEach(function(card){
      var select=card.querySelector('.realynkStatusSelect');
      if(!select) return;
      var value=String(select.value||'active').toLowerCase();
      var typeNode=card.querySelector('.details .detail:first-child b');
      var type=typeNode?String(typeNode.textContent||'').trim().toLowerCase():'';
      select.classList.remove('status-active','status-rented','status-sold','status-booked','status-offmarket');
      if(value==='active') select.classList.add('status-active');
      else if(value==='off market') select.classList.add('status-offmarket');
      else if(type==='rent') select.classList.add('status-rented');
      else if(type==='heavy deposit') select.classList.add('status-booked');
      else select.classList.add('status-sold');
    });
  }
  function start(){
    apply();
    var host=document.getElementById('myList');
    if(host) new MutationObserver(function(){setTimeout(apply,0)}).observe(host,{childList:true,subtree:true});
    setInterval(apply,1500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else setTimeout(start,120);
})();
