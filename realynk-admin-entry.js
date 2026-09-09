/* REALYNK SUPER ADMIN ENTRY — lightweight, no Firebase until clicked */
(function(){
  'use strict';
  var injected=false;
  function add(){
    if(injected)return;
    var account=document.getElementById('account');
    if(!account)return;
    var page=account.querySelector('.page');
    if(!page||document.getElementById('realynkSuperAdminEntry'))return;
    injected=true;
    var box=document.createElement('div');
    box.id='realynkSuperAdminEntry';
    box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
    box.innerHTML='<button type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
    box.querySelector('button').onclick=function(){
      var s=document.createElement('script');s.type='module';s.src='./super-admin.js?v=3';s.onload=function(){window.dispatchEvent(new Event('realynkAdminOpen'))};document.head.appendChild(s);
    };
    page.appendChild(box);
  }
  function start(){add();new MutationObserver(add).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
