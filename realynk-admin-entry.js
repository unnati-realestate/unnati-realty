/* REALYNK SUPER ADMIN ENTRY — admin-only, no visible broker control */
(function(){
  'use strict';
  var ADMIN='seagullairexpress@gmail.com', clicks=0, timer=null;
  function loadAdmin(){
    if(document.getElementById('realynkSuperAdminLoader'))return;
    var s=document.createElement('script');s.id='realynkSuperAdminLoader';s.type='module';s.src='./super-admin.js?v=4';document.head.appendChild(s);
  }
  function addEntry(){
    if(document.getElementById('realynkSuperAdminEntry'))return;
    var account=document.getElementById('account'),page=account&&account.querySelector('.page');
    if(!page)return;
    var box=document.createElement('div');box.id='realynkSuperAdminEntry';box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
    box.innerHTML='<button type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
    page.appendChild(box);box.querySelector('button').onclick=loadAdmin;
  }
  async function check(){
    try{
      var appmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
      var authmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js');
      var cfg=await import('./firebase-config.js');
      var app=appmod.getApps().length?appmod.getApps()[0]:appmod.initializeApp(cfg.firebaseConfig);
      var auth=authmod.getAuth(app);
      authmod.onAuthStateChanged(auth,function(u){
        var ok=String(u&&u.email||'').toLowerCase()===ADMIN;
        if(ok)addEntry();else{var x=document.getElementById('realynkSuperAdminEntry');if(x)x.remove();}
      });
    }catch(e){console.warn('Admin access check',e)}
  }
  function secret(){
    var logo=document.querySelector('.logo');if(!logo)return;
    logo.addEventListener('click',function(){clicks++;clearTimeout(timer);timer=setTimeout(function(){clicks=0},2500);if(clicks>=5){clicks=0;loadAdmin();}});
  }
  function start(){check();secret()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();