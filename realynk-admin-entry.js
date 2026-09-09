/* REALYNK SUPER ADMIN ENTRY V3 — hidden admin trigger with direct Google sign-in */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({login_hint:ADMIN,prompt:'select_account'});
let clicks=0,timer=null;

function isAdmin(){return String(auth.currentUser?.email||'').toLowerCase()===ADMIN}

function loadPanel(){
  if(!isAdmin())return;
  if(document.querySelector('script[data-realynk-super-admin]'))return;
  const s=document.createElement('script');
  s.type='module';
  s.dataset.realynkSuperAdmin='1';
  s.src='./super-admin.js?v=7';
  document.head.appendChild(s);
}

function addEntry(){
  if(!isAdmin())return removeEntry();
  const account=document.getElementById('account'),page=account?.querySelector('.page');
  if(!page||document.getElementById('realynkSuperAdminEntry'))return;
  const box=document.createElement('div');
  box.id='realynkSuperAdminEntry';
  box.style.cssText='margin:14px 0;padding:14px;border:1px solid #f4b400;border-radius:14px;background:#fffaf0';
  box.innerHTML='<button id="realynkSuperAdminButton" type="button" style="width:100%;border:0;border-radius:11px;padding:14px;background:#fff3c4;color:#7d5b00;font-weight:800;font-size:15px;cursor:pointer">👑 Super Admin / Broker Verification</button><div style="font-size:12px;color:#6b7a8c;margin-top:7px;text-align:center">Admin access only</div>';
  page.appendChild(box);
  box.querySelector('#realynkSuperAdminButton').addEventListener('click',()=>loadPanel());
}

function removeEntry(){document.getElementById('realynkSuperAdminEntry')?.remove()}

async function hiddenAdminLogin(){
  /* This function is called directly from the logo click event. Firebase is already
     imported above, so signInWithPopup retains the browser user gesture. */
  try{
    if(isAdmin()){addEntry();loadPanel();return;}
    const result=await signInWithPopup(auth,provider);
    const email=String(result.user?.email||'').toLowerCase();
    if(email!==ADMIN){
      alert('This Google account is not the Realynk Super Admin account.');
      removeEntry();
      return;
    }
    addEntry();
    loadPanel();
  }catch(e){
    console.error('Super Admin login failed',e);
    if(e?.code!=='auth/popup-closed-by-user'){
      alert('Super Admin login failed: '+(e?.code||e?.message||'Unknown error'));
    }
  }
}

function watchLogo(){
  document.addEventListener('click',function(e){
    const logo=e.target.closest('img[src*="logo.png"], img[alt*="Realynk"], img[alt*="realynk"]');
    if(!logo)return;
    clicks++;
    clearTimeout(timer);
    timer=setTimeout(()=>{clicks=0},3000);
    if(clicks>=5){
      clicks=0;
      hiddenAdminLogin();
    }
  },true);
}

onAuthStateChanged(auth,u=>{
  if(String(u?.email||'').toLowerCase()===ADMIN){addEntry();loadPanel();}
  else removeEntry();
});

function start(){watchLogo();addEntry();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
