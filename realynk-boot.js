/* REALYNK BOOT - single stable engine only. */
(function(){
  'use strict';
  function load(src,type){
    if(document.querySelector('script[data-realynk-stable="'+src+'"]')) return;
    var s=document.createElement('script');
    if(type==='module') s.type='module';
    s.src=src;
    s.dataset.realynkStable=src;
    document.body.appendChild(s);
  }
  function heavy(){
    var quick=document.querySelector('.quick'), post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');
      b.id='heavyDeposit';
      b.type='button';
      b.innerHTML='🔐<b>Heavy Deposit</b>';
      if(post) quick.insertBefore(b,post); else quick.appendChild(b);
    }
    var type=document.getElementById('type');
    if(type && !type.querySelector('option[value="Heavy Deposit"]')){
      var o=document.createElement('option');
      o.value='Heavy Deposit';
      o.textContent='Heavy Deposit';
      type.appendChild(o);
    }
  }
  function start(){
    heavy();
    /* Do not load the old competing hotfix/final/category/master layers. */
    load('./pwa-branding.js?v=4');
    load('./realynk-core.js?v=10','module');
    load('./property-management-ui.js?v=6');
    load('./video-duration-fix.js?v=5');
    setTimeout(heavy,500);
    setTimeout(heavy,1500);
    setTimeout(heavy,3000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
