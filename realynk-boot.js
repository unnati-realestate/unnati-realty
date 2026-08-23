/* Realynk boot: load the unified broker/network core and restore the Heavy Deposit UI. */
(function(){
  'use strict';
  function ensureHeavyUI(){
    var quick=document.querySelector('.quick');
    var commercial=document.getElementById('commercial');
    var post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');
      b.id='heavyDeposit'; b.type='button';
      b.innerHTML='🔐<b data-i18n="heavyDeposit">Heavy Deposit</b>';
      b.style.cssText='min-height:86px;background:#fff;border:1px solid var(--line);border-radius:16px;color:var(--navy);font-weight:800;font-size:22px;cursor:pointer;';
      if(post) quick.insertBefore(b,post); else quick.appendChild(b);
    }
    var type=document.getElementById('type');
    if(type && !type.querySelector('option[value="Heavy Deposit"]')){
      var o=document.createElement('option'); o.value='Heavy Deposit'; o.textContent='Heavy Deposit'; type.appendChild(o);
    }
  }
  ensureHeavyUI();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureHeavyUI);
  setTimeout(ensureHeavyUI,500);
  setTimeout(ensureHeavyUI,1500);
  import('./realynk-core.js?v=4').catch(function(e){console.error('Realynk core failed to load',e);});
})();
