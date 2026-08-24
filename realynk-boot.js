/* REALYNK BOOT - clean single-engine loader. */
(function(){
  'use strict';
  function load(src,type){
    if(document.querySelector('script[data-realynk-clean="'+src+'"]')) return;
    var s=document.createElement('script');
    if(type==='module') s.type='module';
    s.src=src;
    s.dataset.realynkClean=src;
    document.body.appendChild(s);
  }
  function heavy(){
    var quick=document.querySelector('.quick'), post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='🔐<b>Heavy Deposit</b>';
      if(post) quick.insertBefore(b,post); else quick.appendChild(b);
    }
    var type=document.getElementById('type');
    if(type && !type.querySelector('option[value="Heavy Deposit"]')){var o=document.createElement('option');o.value='Heavy Deposit';o.textContent='Heavy Deposit';type.appendChild(o)}
  }
  function start(){
    heavy();
    load('./pwa-branding.js?v=2');
    load('./professional-ui.js?v=3');
    load('./realynk-core.js?v=8','module');
    load('./property-management-ui.js?v=5');
    load('./realynk-hotfix.js?v=2','module');
    load('./realynk-final-fix.js?v=3');
    load('./category-stable-fix.js?v=1');
    load('./video-duration-fix.js?v=2');
    setTimeout(heavy,500);setTimeout(heavy,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
