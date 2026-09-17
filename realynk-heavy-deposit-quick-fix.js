/* REALYNK HEAVY DEPOSIT QUICK FIX V2 — delegated click, works without refresh */
(function(){
  'use strict';
  if(window.__REALYNK_HEAVY_DEPOSIT_QUICK_FIX_V2__) return;
  window.__REALYNK_HEAVY_DEPOSIT_QUICK_FIX_V2__=true;
  var active=false;

  function apply(){
    if(!active) return;
    var host=document.getElementById('homeList');
    if(!host) return;
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    if(rows.length){
      rows.forEach(function(row){
        row.style.display=(String(row.dataset.type||'').trim().toLowerCase()==='heavy deposit')?'':'none';
      });
      var row=rows.find(function(r){return String(r.dataset.type||'').trim().toLowerCase()==='heavy deposit';});
      if(row) row.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    var cards=[].slice.call(host.querySelectorAll('.property'));
    var first=null;
    cards.forEach(function(card){
      var b=card.querySelector('.details .detail:first-child b');
      var type=String(b&&b.textContent||'').trim().toLowerCase();
      var ok=type==='heavy deposit'||type.indexOf('heavy deposit')!==-1;
      card.style.display=ok?'':'none';
      if(ok&&!first) first=card;
    });
    if(first) first.scrollIntoView({behavior:'smooth',block:'start'});
  }

  /* Delegated handler is installed immediately, so a dynamically-created button
     works on its first click; no page refresh or timing race is required. */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#heavyDeposit'):null;
    if(!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    active=true;
    document.querySelectorAll('.quick button').forEach(function(x){x.classList.toggle('active',x===b);});
    apply();
    [50,150,350,700,1200,2000].forEach(function(ms){setTimeout(apply,ms);});
  },true);

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;
    if(!b||b.id==='heavyDeposit') return;
    active=false;
    var host=document.getElementById('homeList');
    if(!host) return;
    [].slice.call(host.querySelectorAll('.realynkListingRow,.property')).forEach(function(x){x.style.display='';});
  },false);

  var host=null;
  function watch(){
    host=document.getElementById('homeList');
    if(!host||host.__realynkHeavyFixV2) return;
    host.__realynkHeavyFixV2=true;
    new MutationObserver(function(){if(active)setTimeout(apply,0);}).observe(host,{childList:true,subtree:true});
  }
  watch();
  setInterval(watch,300);
})();
