/* REALYNK BROKER VERIFICATION SYNC V2 — broker + application source of truth */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, doc, onSnapshot, collection, query, where } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
(() => {
'use strict';
if(window.__REALYNK_BROKER_VERIFICATION_SYNC_V2__)return;
window.__REALYNK_BROKER_VERIFICATION_SYNC_V2__=true;
const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
let stopBroker=null,stopApps=null,brokerData=null,appData=null,currentUser=null;
function readProfile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(_){return {}}}
function writeProfile(p){localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));window.dispatchEvent(new CustomEvent('realynkProfileStatusChanged'))}
function statusOf(d){if(!d)return'pending';if(d.approved===true||d.verified===true||String(d.status||'').toLowerCase()==='verified')return'verified';if(String(d.status||'').toLowerCase()==='rejected'||d.rejected===true)return'rejected';return'pending'}
function setStatusUI(status){const verified=status==='verified',rejected=status==='rejected',el=document.getElementById('accountStatus');if(el){el.textContent=verified?'✓ Verified Broker':rejected?'✕ Rejected':'Pending Verification';el.className='badge'+(verified||rejected?'':' pending')}const host=document.getElementById('brokerProfileCard');if(host)host.querySelectorAll('*').forEach(node=>{if(node.children.length===0){const t=String(node.textContent||'').trim();if(t==='Pending Review'||t==='Pending Verification'||t==='✓ Verified Broker')node.textContent=verified?'✓ Verified':rejected?'✕ Rejected':'Pending Review'}})}
function apply(){if(!currentUser||String(currentUser.email||'').toLowerCase()===ADMIN)return;const source=brokerData&&statusOf(brokerData)!=='pending'?brokerData:(appData&&statusOf(appData)!=='pending'?appData:brokerData||appData);if(!source)return;const status=statusOf(source),p=readProfile();p.uid=currentUser.uid;p.agentEmail=p.agentEmail||currentUser.email||'';if(source.name&&!p.agentName)p.agentName=source.name;if(source.fullName&&!p.agentName)p.agentName=source.fullName;if(source.companyName)p.companyName=source.companyName;if(source.city)p.city=source.city;if(source.state)p.state=source.state;p.status=status;p.approved=status==='verified';p.verified=status==='verified';if(source.approvedAt)p.approvedAt=source.approvedAt;writeProfile(p);setStatusUI(status)}
function watch(user){if(stopBroker){try{stopBroker()}catch(_){}}if(stopApps){try{stopApps()}catch(_){}}stopBroker=stopApps=null;brokerData=appData=null;currentUser=user;if(!user||String(user.email||'').toLowerCase()===ADMIN)return;stopBroker=onSnapshot(doc(db,'brokers',user.uid),snap=>{brokerData=snap.exists()?snap.data():null;apply()},err=>console.error('Realynk broker verification watch failed',err));const q=query(collection(db,'brokerApplications'),where('uid','==',user.uid));stopApps=onSnapshot(q,snap=>{let best=null;snap.forEach(d=>{const x=d.data()||{};if(!best||statusOf(x)==='verified'||(statusOf(x)==='rejected'&&statusOf(best)==='pending'))best=x});appData=best;apply()},err=>console.error('Realynk application verification watch failed',err))}
onAuthStateChanged(auth,watch);window.addEventListener('realynkProfileStatusChanged',()=>{const p=readProfile();if(p.status)setStatusUI(String(p.status).toLowerCase())});
})();