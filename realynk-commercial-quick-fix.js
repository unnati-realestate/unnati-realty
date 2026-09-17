/* REALYNK COMMERCIAL QUICK FIX — jump to the existing Commercial section only */
(function(){
  'use strict';
  if(window.__REALYNK_COMMERCIAL_QUICK_FIX__) return;
  window.__REALYNK_COMMERCIAL_QUICK_FIX__=true;

  function isCommercialCard(card){
    var node=card.querySelector('.details .detail:first-child b');
    var type=String(node&&node.textContent||'').trim().toLowerCase();
    return type==='commercial' || type.indexOf('commercial')!==-1 || type==='shop' || type==='office' || type==='showroom' || type==='warehouse';
  }

  function jump(){
    var row=document.querySelector('#homeList .realynkListingRow[data-type="Commercial"]');
    if(row){ row.scrollIntoView({behavior:'smooth',block:'start'}); return true; }
    var cards=[].slice.call(document.querySelectorAll('#homeList .property')).filter(isCommercialCard);
    if(cards.length){ cards[0].scrollIntoView({behavior:'smooth',block:'start'}); return true; }
    return false;
  }

  window.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#commercial'):null;
    if(!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    b.classList.add('active');
    if(jump()) return;
    [150,500,1000].forEach(function(ms){setTimeout(jump,ms)});
  },true);
})();
