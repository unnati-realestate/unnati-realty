/* REALYNK SAFE BOOT V3
   The inline index.html is the primary application engine.
   Keep this boot file tiny: PWA registration + one Heavy Deposit control only.
*/
(function(){
  'use strict';

  function registerPWA(){
    if(!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js?v=40').catch(function(){});
  }

  function addHeavyDeposit(){
    var quick=document.querySelector('.quick');
    var post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');
      b.id='heavyDeposit';
      b.type='button';
      b.innerHTML='🔐<b>Heavy Deposit</b>';
      b.onclick=function(){
        var home=document.getElementById('home');
        var list=document.getElementById('homeList');
        var bar=document.getElementById('filterBar');
        var title=document.getElementById('filterTitle');
        document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
        if(home) home.classList.add('active');
        if(bar) bar.style.display='flex';
        if(title) title.textContent='Heavy Deposit';
        if(list){
          list.querySelectorAll('.property').forEach(function(card){
            var text=(card.textContent||'').toLowerCase();
            card.style.display=text.indexOf('heavy deposit')>=0?'':'none';
          });
        }
        window.scrollTo(0,0);
      };
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
    registerPWA();
    addHeavyDeposit();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
