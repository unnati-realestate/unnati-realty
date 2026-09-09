/* REALYNK ADMIN TEST VERIFY — lets the Super Admin verify the local admin broker profile for testing */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';
if(!window.__REALYNK_ADMIN_TEST_VERIFY__){
window.__REALYNK_ADMIN_TEST_VERIFY__=true;
const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig); const auth=getAuth(app);
function isAdmin(){return String(auth.currentUser?.email||'').toLowerCase()===ADMIN}
function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return {}}}
function add(){if(!isAdmin())return;const panel=document.getElementById('superAdminPanel');if(!panel||document.getElementById('realynkAdminTestVerify'))return;const box=document.createElement('div');box.id='realynkAdminTestVerify';box.style.cssText='margin-top:14px;padding:13px;border:1px solid #d7a000;border-radius:12px;background:#fffdf4';box.innerHTML='<b style="color:#0b3768">🧪 My Broker Profile — Testing</b><div style="font-size:12px;color:#6b7a8c;margin:5px 0 10px">Your Super Admin account stays separate. This only marks your local broker profile as Verified for testing property posting.</div><button id="realynkAdminTestVerifyBtn" type="button" style="width:100%;border:0;border-radius:10px;padding:12px;background:#18864b;color:#fff;font-weight:800;cursor:pointer">✓ Approve My Broker Profile for Testing</button>';panel.appendChild(box);box.querySelector('#realynkAdminTestVerifyBtn').onclick=function(){const current=profile();current.status='verified';current.approved=true;current.verified=true;current.approvedAt=new Date().toISOString();localStorage.setItem('realynkBrokerProfile',JSON.stringify(current));alert('Your broker profile is now Verified for testing.');location.reload()}}
function watch(){new MutationObserver(add).observe(document.body,{childList:true,subtree:true});add()}
onAuthStateChanged(auth,()=>setTimeout(add,300));if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
}
