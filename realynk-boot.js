/* REALYNK BOOT - load the stable core plus one master action layer. */
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
    var quick=document.querySelector('.quick'),post=document.getElementById('postQuick');
    if(quick&&!document.getElementById('heavyDeposit')){
      var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='🔐<b>Heavy Deposit</b>';
      if(post)quick.insertBefore(b,post);else quick.appendChild(b);
    }
  }
  function start(){
    heavy();
    load('./pwa-branding.js?v=3');
    load('./professional-ui.js?v=4');
    load('./realynk-core.js?v=9','module');
    load('./property-management.js?v=2','module');
    load('./video-duration-fix.js?v=4');
    load('./realynk-master-fix.js?v=1','module');
    setTimeout(heavy,500);setTimeout(heavy,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
