/* REALYNK SUPER ADMIN ENTRY V5 — reliable admin login */
(function(){
'use strict';
var ADMIN='seagullairexpress@gmail.com';
async function login(){
 try{
  var appmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
  var authmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js');
  var cfg=await import('./firebase-config.js');
  var app=appmod.getApps().length?appmod.getApps()[0]:appmod.initializeApp(cfg.firebaseConfig);
  var auth=authmod.getAuth(app);
  if(auth.currentUser&&String(auth.currentUser.email||'').toLowerCase()===ADMIN){loadAdmin();return;}
  var provider=new authmod.GoogleAuthProvider();
  provider.setCustomParameters({login_hint:ADMIN,prompt:'select_account'});
  var result=await authmod.signInWithPopup(auth,provider);
  if(String(result.user?.email||'').toLowerCase()!==ADMIN){await authmod.signOut(auth);alert('Please use the Super Admin Google account.');return;}
  loadAdmin();
 }catch(e){console.error('Super Admin login',e);if(e?.code!=='auth/popup-closed-by-user')alert('Super Admin login failed: '+(e?.message||'Please try again.'));}
}
function loadAdmin(){if(document.getElementById('realynkSuperAdminLoader'))return;var s=document.createElement('script');s.id='realynkSuperAdminLoader';s.type='module';s.src='./super-admin.js?v=6';document.head.appendChild(s)}
function addEntry(){
 if(document.getElementById('realynkSuperAdminEntry'))return;
 var account=document.getElementById('account'),page=account&&account.querySelector('.page');if(!page)return;
 var box=document.createElement('div');box.id='realynkSuperAdminEntry';box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
 box.innerHTML='<button type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
 page.appendChild(box);box.querySelector('button').onclick=login;
}
async function check(){try{
 var appmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');var authmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js');var cfg=await import('./firebase-config.js');var app=appmod.getApps().length?appmod.getApps()[0]:appmod.initializeApp(cfg.firebaseConfig);var auth=authmod.getAuth(app);
 authmod.onAuthStateChanged(auth,function(u){if(String(u&&u.email||'').toLowerCase()===ADMIN)addEntry();else{var x=document.getElementById('realynkSuperAdminEntry');if(x)x.remove()}});
}catch(e){console.warn('Admin access check',e)}}
function start(){check()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();