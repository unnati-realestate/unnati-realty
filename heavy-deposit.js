/* REALYNK EARLY CATEGORY CLICK OWNER — loaded synchronously before the module boot.
   Keeps the existing UI, but prevents the old inline renderer from stealing
   Commercial / Heavy Deposit clicks. */
(function(){
  'use strict';
  if(window.__REALYNK_EARLY_CATEGORY_CLICK_OWNER__) return;
  window.__REALYNK_EARLY_CATEGORY_CLICK_OWNER__=true;

  var active='';

  function typeOf(card){
    var b=card.querySelector('.details .detail:first-child b');
    return String(b&&b.textContent||'').trim().toLowerCase();
  }

  function match(type,wanted){
    type=String(type||'').trim().toLowerCase();
    if(wanted==='commercial'){
      return type==='commercial'||type.indexOf('commercial')!==-1||type==='shop'||type==='office'||type==='showroom'||type==='warehouse';
    }
    if(wanted==='heavy deposit'){
      return type==='heavy deposit'||type.indexOf('heavy deposit')!==-1;
    }
    return type===wanted;
  }

  function clearButtons(id){
    document.querySelectorAll('.quick button').forEach(function(b){
      b.classList.toggle('active',b.id===id);
    });
  }

  function apply(){
    if(!active) return;
    var host=document.getElementById('homeList');
    if(!host) return;
    var wanted=active.toLowerCase();
    var rows=[].slice.call(host.querySelectorAll('.realynkListingRow'));
    var cards=[].slice.call(host.querySelectorAll('.property'));
    var target=null;

    rows.forEach(function(row){
      var ok=match(row.dataset.type||'',wanted);
      row.style.display=ok?'':'none';
      if(ok&&!target) target=row;
    });

    cards.forEach(function(card){
      var ok=match(typeOf(card),wanted);
      card.style.display=ok?'':'none';
      if(ok&&!target) target=card;
    });

    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function choose(id,type,e){
    e.preventDefault();
    e.stopImmediatePropagation();
    active=type;
    clearButtons(id);
    apply();
    [50,150,350,700,1200,2000].forEach(function(ms){setTimeout(apply,ms);});
  }

  /* Capture handler is installed synchronously, before the async/module boot.
     Therefore the legacy inline Commercial onclick cannot overwrite the filter. */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#commercial,#heavyDeposit'):null;
    if(!b) return;
    choose(b.id,b.id==='commercial'?'Commercial':'Heavy Deposit',e);
  },true);

  /* When Buy/Sale/Rent is selected, release this category filter and leave
     those existing controls completely untouched. */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;
    if(!b||b.id==='commercial'||b.id==='heavyDeposit') return;
    active='';
    var host=document.getElementById('homeList');
    if(host){
      [].slice.call(host.querySelectorAll('.realynkListingRow,.property')).forEach(function(x){x.style.display=''});
    }
  },false);

  function watch(){
    var host=document.getElementById('homeList');
    if(!host||host.__realynkEarlyCategoryObserver) return;
    host.__realynkEarlyCategoryObserver=true;
    new MutationObserver(function(){if(active)setTimeout(apply,0);}).observe(host,{childList:true,subtree:true});
  }

  watch();
  setInterval(watch,300);
})();
