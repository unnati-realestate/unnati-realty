/* REALYNK CATEGORY FILTER FIX V2 — robust Commercial + Heavy Deposit filter */
(function(){
  'use strict';
  if(window.__REALYNK_CATEGORY_FILTER_FIX_V2__) return;
  window.__REALYNK_CATEGORY_FILTER_FIX_V2__=true;
  var active='';
  function clearOthers(id){document.querySelectorAll('.quick button').forEach(function(b){b.classList.toggle('active',b.id===id);});}
  function typeOf(card){
    var b=card.querySelector('.details .detail:first-child b');
    return String(b&&b.textContent||'').trim().toLowerCase();
  }
  function matches(card,wanted){
    var t=typeOf(card);
    if(wanted==='commercial') return t==='commercial'||t.indexOf('commercial')!==-1||t==='shop'||t==='office'||t==='showroom'||t==='warehouse';
    if(wanted==='heavy deposit') return t==='heavy deposit'||t.indexOf('heavy deposit')!==-1;
    return t===wanted;
  }
  function apply(){
    if(!active)return;
    var host=document.getElementById('homeList'); if(!host)return;
    var wanted=active.toLowerCase();
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    var foundRow=null;
    rows.forEach(function(row){
      var rt=String(row.dataset.type||'').trim().toLowerCase();
      var showRow=(wanted==='commercial' && (rt==='commercial'||rt.indexOf('commercial')!==-1)) || rt===wanted;
      row.style.display=showRow?'':'none';
      if(showRow)foundRow=row;
    });
    var cards=[].slice.call(host.querySelectorAll('.property'));
    var found=null;
    cards.forEach(function(card){
      var ok=matches(card,wanted);
      card.style.display=ok?'':'none';
      if(ok&&!found)found=card;
    });
    if(foundRow) setTimeout(function(){foundRow.scrollIntoView({behavior:'smooth',block:'start'});},30);
    else if(found) setTimeout(function(){found.scrollIntoView({behavior:'smooth',block:'start'});},30);
  }
  function choose(id,type,e){
    e.preventDefault();e.stopImmediatePropagation();active=type;clearOthers(id);apply();
    [80,250,600,1200,2000].forEach(function(ms){setTimeout(apply,ms);});
  }
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#commercial,#heavyDeposit'):null;
    if(!b)return;
    choose(b.id,b.id==='commercial'?'Commercial':'Heavy Deposit',e);
  },true);
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;
    if(!b||b.id==='commercial'||b.id==='heavyDeposit')return;
    active='';
    document.querySelectorAll('#homeList .realynkListingRow,#homeList .property').forEach(function(x){x.style.display='';});
  },false);
  function watch(){
    var host=document.getElementById('homeList');
    if(!host||host.__realynkCategoryObserverV2)return;
    host.__realynkCategoryObserverV2=true;
    new MutationObserver(function(){if(active)setTimeout(apply,0);}).observe(host,{childList:true,subtree:true});
  }
  watch();setInterval(watch,500);
})();
