/* REALYNK BROKER AUTH V5 — Firestore verification is source of truth */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
if(!window.__REALYNK_BROKER_AUTH_SINGLETON_V5__){
window.__REALYNK_BROKER_AUTH_SINGLETON_V5__=true;
const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig); const auth=getAuth(app); const db=getFirestore(app);
const provider=new GoogleAuthProvider(); provider.setCustomParameters({prompt:'select_account'}); let popupBusy=false;
function isAdmin(user=auth.currentUser){return String(user?.email||'').toLowerCase()===ADMIN}
function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return {}}}
function saveProfile(p){localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));window.dispatchEvent(new CustomEvent('realynkProfileStatusChanged'))}
function markAdminProfileVerified(){const p=profile();if(!p.agentName&&!p.agentEmail)return; p.status='verified';p.verified=true;p.approved=true;saveProfile(p)}
function upsertLocalProfile(user){const p=profile();if(!p.agentEmail)p.agentEmail=user.email||'';if(!p.agentName)p.agentName=user.displayName||'';if(!p.accountPhone&&user.phoneNumber)p.accountPhone=user.phoneNumber;localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));return p}
async function syncBroker(user){
  if(!user||isAdmin(user))return;
  const p=upsertLocalProfile(user),ref=doc(db,'brokers',user.uid),snap=await getDoc(ref);
  if(snap.exists()){
    const cloud=snap.data()||{};
    /* Firestore is authoritative for verification status. Never let the local Pending value override it. */
    if(cloud.approved===true||cloud.verified===true||String(cloud.status||'').toLowerCase()==='verified'){
      p.status='verified';p.approved=true;p.verified=true;
      if(cloud.approvedAt)p.approvedAt=cloud.approvedAt;
      saveProfile(p);
    }else if(String(cloud.status||'').toLowerCase()==='rejected'){
      p.status='rejected';p.approved=false;p.verified=false;saveProfile(p);
    }else if(cloud.status){
      p.status=String(cloud.status).toLowerCase();p.approved=cloud.approved===true;p.verified=cloud.verified===true;saveProfile(p);
    }
  }
  const data={uid:user.uid,email:user.email||p.agentEmail||'',name:p.agentName||user.displayName||'',agentName:p.agentName||user.displayName||'',accountPhone:p.accountPhone||'',accountType:p.accountType||'Individual',companyName:p.companyName||'',officeAddress:p.officeAddress||'',city:p.city||'',state:p.state||'',pincode:p.pincode||'',experience:p.experience||'',specialization:p.specialization||'',serviceAreas:p.serviceAreas||'',reraNo:p.reraNo||'',reraCompetency:p.reraCompetency||'',gstin:p.gstin||'',website:p.website||'',declaration:!!p.declaration,updatedAt:serverTimestamp()};
  if(!snap.exists())Object.assign(data,{approved:false,verified:false,status:'pending',createdAt:serverTimestamp()});
  await setDoc(ref,data,{merge:true});
}
function ensureBox(){const page=document.querySelector('#account .page');if(!page)return null;let box=document.getElementById('realynkBrokerAuthBox');if(!box){box=document.createElement('div');box.id='realynkBrokerAuthBox';box.className='panel';const h=page.querySelector('h2');if(h&&h.nextSibling)page.insertBefore(box,h.nextSibling);else page.prepend(box)}return box}
async function startPopup(button){if(popupBusy)return;popupBusy=true;if(button){button.disabled=true;button.dataset.oldText=button.textContent;button.textContent='Opening Google account chooser…'}try{const r=await signInWithPopup(auth,provider);if(isAdmin(r.user)){alert('This is the Super Admin account. Please choose your broker Google account.')}}catch(e){console.error('Broker login failed',e);if(e?.code!=='auth/popup-closed-by-user'&&e?.code!=='auth/cancelled-popup-request')alert('Broker login failed: '+(e?.code||e?.message||'Unknown error'))}finally{popupBusy=false;if(button){button.disabled=false;button.textContent=button.dataset.oldText||'Continue with Google'}}}
function render(user){const box=ensureBox();if(!box)return;if(isAdmin(user)){box.innerHTML='<b>🔐 Super Admin account</b><p class="small">Admin account is kept separate from broker profiles.</p><button id="realynkBrokerSwitch" class="primary full" type="button">👤 Continue as Broker / Switch Google Account</button>';box.querySelector('#realynkBrokerSwitch').onclick=function(){startPopup(this)}}else if(user){const p=profile();const st=(p.status||'pending').toLowerCase();const label=st==='verified'?'Verified':st==='rejected'?'Rejected':'Pending Review';box.innerHTML='<b>👤 Broker Login</b><p class="small">Signed in as <strong>'+String(user.email||'').replace(/[<>]/g,'')+'</strong>. Verification status: <strong>'+label+'</strong>.</p><button id="realynkBrokerSignOut" class="back full" type="button">Sign out / Switch Account</button>';box.querySelector('#realynkBrokerSignOut').onclick=()=>signOut(auth).catch(e=>console.error(e))}else{box.innerHTML='<b>👤 Broker Login / Register</b><p class="small">Sign in with your Google account to connect this broker profile with Realynk. New broker accounts remain Pending until Super Admin verification.</p><button id="realynkBrokerLogin" class="primary full" type="button">Continue with Google</button>';box.querySelector('#realynkBrokerLogin').onclick=function(){startPopup(this)}}}
function hookSave(){document.addEventListener('click',async e=>{if(!e.target.closest('#saveAccount'))return;const user=auth.currentUser;if(!user||isAdmin(user))return;try{await new Promise(r=>setTimeout(r,250));await syncBroker(user);render(user)}catch(err){console.error('Broker profile sync failed',err);alert('Profile saved locally, but cloud sync failed. Please try again.')}},true)}
onAuthStateChanged(auth,async user=>{if(isAdmin(user))markAdminProfileVerified();render(user);if(user&&!isAdmin(user)){try{await syncBroker(user);render(user)}catch(e){console.error('Broker auth sync failed',e)}}});
function start(){hookSave();render(auth.currentUser);if(isAdmin())markAdminProfileVerified()} if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
