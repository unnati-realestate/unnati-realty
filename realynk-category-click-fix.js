/* REALYNK CATEGORY CLICK FIX — runs before stability so Commercial + Heavy Deposit work on first click */
(function(){
  'use strict';
  if(window.__REALYNK_CATEGORY_CLICK_FIX__) return;
  window.__REALYNK_CATEGORY_CLICK_FIX__=true;

  var active='';
  function typeOf(card){
    var b=card.querySelector('.details .detail:first-child b');
    return String(b&&b.textContent||'').trim().toLowerCase();
  }
  function match(type,wanted){
    type=String(type||'').trim().toLowerCase();
    if(wanted==='commercial') return type==='commercial'||type.indexOf('commercial')!==-1||type==='shop'||type==='office'||type==='showroom'||type==='warehouse';
    if(wanted==='heavy deposit') return type==='heavy deposit'||type.indexOf('heavy deposit')!==-1;
    return type===wanted;
  }
  function clearOtherButtons(id){
    document.querySelectorAll('.quick button').forEach(function(b){b.classList.toggle('active',b.id===id);});
  }
  function apply(){
    if(!active) return;
    var host=document.getElementById('homeList');
    if(!host) return;
    var wanted=active.toLowerCase();
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    var foundRow=null;
    rows.forEach(function(row){
      var rt=String(row.dataset.type||'').trim().toLowerCase();
      var ok=match(rt,wanted);
      row.style.display=ok?'':'none';
      if(ok&&!foundRow) foundRow=row;
    });
    var cards=[].slice.call(host.querySelectorAll('.property'));
    var first=null;
    cards.forEach(function(card){
      var ok=match(typeOf(card),wanted);
      card.style.display=ok?'':'none';
      if(ok&&!first) first=card;
    });
    var target=foundRow||first;
    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function choose(id,type,e){
    e.preventDefault();
    e.stopImmediatePropagation();
    active=type;
    clearOtherButtons(id);
    apply();
    [50,150,350,700,1200,2000].forEach(function(ms){setTimeout(apply,ms);});
  }

  /* This is intentionally registered before stability's button listeners. */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#commercial,#heavyDeposit'):null;
    if(!b) return;
    choose(b.id,b.id==='commercial'?'Commercial':'Heavy Deposit',e);
  },true);

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;
    if(!b||b.id==='commercial'||b.id==='heavyDeposit') return;
    active='';
    var host=document.getElementById('homeList');
    if(host)[].slice.call(host.querySelectorAll('.realynkListingRow,.property')).forEach(function(x){x.style.display='';});
  },false);

  function watch(){
    var host=document.getElementById('homeList');
    if(!host||host.__realynkCategoryClickObserver)return;
    host.__realynkCategoryClickObserver=true;
    new MutationObserver(function(){if(active)setTimeout(apply,0);}).observe(host,{childList:true,subtree:true});
  }
  watch();
  setInterval(watch,300);
})();
