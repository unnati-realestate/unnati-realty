/* REALYNK HEAVY DEPOSIT QUICK FIX — filter existing rendered sections without touching Buy/Sale/Rent/Commercial */
(function(){
  'use strict';
  if(window.__REALYNK_HEAVY_DEPOSIT_QUICK_FIX__) return;
  window.__REALYNK_HEAVY_DEPOSIT_QUICK_FIX__=true;
  var active=false;

  function apply(){
    if(!active) return;
    var host=document.getElementById('homeList');
    if(!host) return;
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    if(rows.length){
      rows.forEach(function(row){ row.style.display=(String(row.dataset.type||'').toLowerCase()==='heavy deposit')?'':'none'; });
    }else{
      [].slice.call(host.querySelectorAll('.property')).forEach(function(card){
        var b=card.querySelector('.details .detail:first-child b');
        var type=String(b&&b.textContent||'').trim().toLowerCase();
        card.style.display=(type==='heavy deposit')?'':'none';
      });
    }
    var row=host.querySelector('.realynkListingRow[data-type="Heavy Deposit"]');
    if(row) setTimeout(function(){row.scrollIntoView({behavior:'smooth',block:'start'});},20);
  }

  function bind(){
    var b=document.getElementById('heavyDeposit');
    if(!b || b.dataset.heavyFix) return;
    b.dataset.heavyFix='1';
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      active=true;
      b.classList.add('active');
      apply();
      [100,300,700,1200].forEach(function(ms){setTimeout(apply,ms)});
    },true);
  }

  function clearOnOtherQuick(){
    document.addEventListener('click',function(e){
      var b=e.target.closest('.quick button');
      if(!b || b.id==='heavyDeposit') return;
      active=false;
      var host=document.getElementById('homeList');
      if(!host) return;
      [].slice.call(host.querySelectorAll('.realynkListingRow,.property')).forEach(function(x){x.style.display=''});
    },false);
  }

  function start(){
    bind();
    clearOnOtherQuick();
    var host=document.getElementById('homeList');
    if(host)new MutationObserver(function(){bind();if(active)setTimeout(apply,0)}).observe(host,{childList:true,subtree:true});
    setInterval(bind,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,50);
})();
