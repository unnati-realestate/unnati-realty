/* REALYNK CATEGORY FILTER FIX — Commercial + Heavy Deposit, UI-only, leaves Buy/Sale/Rent untouched */
(function(){
  'use strict';
  if(window.__REALYNK_CATEGORY_FILTER_FIX__) return;
  window.__REALYNK_CATEGORY_FILTER_FIX__=true;
  var active='';
  function clearOthers(id){document.querySelectorAll('.quick button').forEach(function(b){b.classList.toggle('active',b.id===id)});}
  function cardType(card){var b=card.querySelector('.details .detail:first-child b');return String(b&&b.textContent||'').trim().toLowerCase();}
  function apply(){
    if(!active)return;
    var host=document.getElementById('homeList');if(!host)return;
    var wanted=active.toLowerCase();
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    if(rows.length){
      rows.forEach(function(row){row.style.display=String(row.dataset.type||'').trim().toLowerCase()===wanted?'':'none';});
      var row=rows.find(function(r){return String(r.dataset.type||'').trim().toLowerCase()===wanted;});
      if(row)setTimeout(function(){row.scrollIntoView({behavior:'smooth',block:'start'});},30);
    }else{
      var cards=[].slice.call(host.querySelectorAll('.property'));
      cards.forEach(function(card){card.style.display=cardType(card)===wanted?'':'none';});
      var first=cards.find(function(card){return cardType(card)===wanted;});
      if(first)setTimeout(function(){first.scrollIntoView({behavior:'smooth',block:'start'});},30);
    }
  }
  function choose(id,type,e){e.preventDefault();e.stopImmediatePropagation();active=type;clearOthers(id);apply();[80,250,600,1200].forEach(function(ms){setTimeout(apply,ms);});}
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#commercial,#heavyDeposit'):null;if(!b)return;choose(b.id,b.id==='commercial'?'Commercial':'Heavy Deposit',e);},true);
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;if(!b||b.id==='commercial'||b.id==='heavyDeposit')return;active='';document.querySelectorAll('#homeList .realynkListingRow,#homeList .property').forEach(function(x){x.style.display='';});},false);
  var host=document.getElementById('homeList');
  function watch(){host=document.getElementById('homeList');if(!host||host.__realynkCategoryObserver)return;host.__realynkCategoryObserver=true;new MutationObserver(function(){if(active)setTimeout(apply,0);}).observe(host,{childList:true,subtree:true});}
  watch();setInterval(watch,500);
})();
