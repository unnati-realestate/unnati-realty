/* REALYNK SUPER ADMIN ENTRY — lightweight, Firebase only after click */
(function(){
  'use strict';
  var bound=false;
  function bind(){
    var btn=document.getElementById('realynkSuperAdminEntry');
    if(!btn||btn.dataset.bound==='1')return;
    btn.dataset.bound='1';bound=true;
    btn.onclick=function(){
      var old=document.getElementById('realynkSuperAdminLoader');
      if(old)return;
      var s=document.createElement('script');s.id='realynkSuperAdminLoader';s.type='module';s.src='./super-admin.js?v=4';document.head.appendChild(s);
    };
  }
  function addFallback(){
    var account=document.getElementById('account'),page=account&&account.querySelector('.page');
    if(!page||document.getElementById('realynkSuperAdminEntry'))return;
    var box=document.createElement('div');box.id='realynkSuperAdminEntry';box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
    box.innerHTML='<button type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
    page.appendChild(box);bind();
  }
  function start(){bind();if(!document.getElementById('realynkSuperAdminEntry'))addFallback();new MutationObserver(function(){bind();if(!document.getElementById('realynkSuperAdminEntry'))addFallback()}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
