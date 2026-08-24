/* Realynk unified boot: one network/admin engine + professional UI layer. */
(function(){
  'use strict';
  function loadScript(src,type){
    if(document.querySelector('script[data-realynk-src="'+src+'"]')) return;
    var s=document.createElement('script');
    if(type==='module')s.type='module';
    s.src=src;
    if(src.indexOf('property-management-ui.js')>=0)s.src='./property-management-ui.js?v=2';
    s.dataset.realynkSrc=src;
    document.head.appendChild(s);
  }
  function ensureHeavyUI(){
    var quick=document.querySelector('.quick');
    var post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');
      b.id='heavyDeposit'; b.type='button';
      b.innerHTML='🔐<b data-i18n="heavyDeposit">Heavy Deposit</b>';
      if(post) quick.insertBefore(b,post); else quick.appendChild(b);
    }
    var type=document.getElementById('type');
    if(type && !type.querySelector('option[value="Heavy Deposit"]')){
      var o=document.createElement('option'); o.value='Heavy Deposit'; o.textContent='Heavy Deposit'; type.appendChild(o);
    }
  }
  function start(){
    ensureHeavyUI();
    loadScript('./professional-ui.js?v=2');
    loadScript('./realynk-core.js?v=6','module');
    loadScript('./realynk-final-ui.js?v=3','module');
    loadScript('./category-display.js?v=1','module');
    loadScript('./property-management-ui.js?v=2');
    loadScript('./realynk-action-fix.js?v=1');
    loadScript('./network-visibility-fix.js?v=1','module');
    setTimeout(ensureHeavyUI,500);
    setTimeout(ensureHeavyUI,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
