/* REALYNK SUPER ADMIN ENTRY V2 — admin-only, reliable Google sign-in */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({login_hint:ADMIN,prompt:'select_account'});

function addEntry(){
  if(String(auth.currentUser?.email||'').toLowerCase()!==ADMIN)return;
  const account=document.getElementById('account'),page=account?.querySelector('.page');
  if(!page||document.getElementById('realynkSuperAdminEntry'))return;
  const box=document.createElement('div');
  box.id='realynkSuperAdminEntry';
  box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
  box.innerHTML='<button id="realynkSuperAdminButton" type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
  page.appendChild(box);
  document.getElementById('realynkSuperAdminButton').addEventListener('click',async()=>{
    const btn=document.getElementById('realynkSuperAdminButton');
    if(btn)btn.disabled=true;
    try{
      const result=await signInWithPopup(auth,provider);
      if(String(result.user?.email||'').toLowerCase()!==ADMIN){alert('This Google account is not the Realynk Super Admin account.');return;}
      const s=document.createElement('script');s.type='module';s.src='./super-admin.js?v=6';document.head.appendChild(s);
    }catch(e){
      console.error('Super Admin login failed',e);
      alert('Super Admin login failed: '+(e?.code||e?.message||'Unknown error'));
    }finally{if(btn)btn.disabled=false;}
  });
}

onAuthStateChanged(auth,u=>{
  if(String(u?.email||'').toLowerCase()===ADMIN)addEntry();
  else document.getElementById('realynkSuperAdminEntry')?.remove();
});

function start(){addEntry();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
