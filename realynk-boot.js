/* REALYNK SAFE BOOT V5
   Tiny runtime only: PWA metadata/registration, Heavy Deposit control,
   and lazy loading of the professional broker profile module.
*/
(function(){
  'use strict';
  var profileLoaded=false;

  function addLink(rel,href,attrs){
    if(document.querySelector('link[rel="'+rel+'"]')) return;
    var l=document.createElement('link');
    l.rel=rel;
    l.href=href;
    if(attrs) Object.keys(attrs).forEach(function(k){l.setAttribute(k,attrs[k]);});
    document.head.appendChild(l);
  }

  function setupPWA(){
    addLink('manifest','./manifest.webmanifest');
    addLink('icon','./logo.png',{type:'image/png'});
    addLink('apple-touch-icon','./logo.png',{sizes:'512x512'});
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js?v=42').catch(function(){});
    }
  }

  function loadProfessionalProfile(){
    if(profileLoaded) return;
    profileLoaded=true;
    var s=document.createElement('script');
    s.src='./realynk-professional-profile.js?v=2';
    s.async=true;
    s.onerror=function(){profileLoaded=false;};
    document.head.appendChild(s);
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
    setupPWA();
    addHeavyDeposit();
    document.addEventListener('click',function(e){
      if(e.target.closest('[data-nav="brokers"]')) loadProfessionalProfile();
    },true);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
