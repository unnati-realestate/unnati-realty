/* REALYNK VERIFICATION SYNC V4 — broker verification + referral bonus */
(function(){
'use strict';
if(window.__REALYNK_VERIFICATION_SYNC_V4__)return;
window.__REALYNK_VERIFICATION_SYNC_V4__=true;
const ADMIN='seagullairexpress@gmail.com';
function local(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function save(p){localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));window.dispatchEvent(new CustomEvent('realynkProfileStatusChanged'))}
function statusOf(d){if(!d)return'pending';if(d.approved===true||d.verified===true||String(d.status||'').toLowerCase()==='verified')return'verified';if(String(d.status||'').toLowerCase()==='rejected'||d.rejected===true)return'rejected';return'pending'}
function renderStatus(){const p=local(),s=String(p.status||'pending').toLowerCase(),label=s==='verified'?'✓ Verified Broker':s==='rejected'?'✕ Rejected':'Pending Verification';const account=document.getElementById('accountStatus');if(account){account.textContent=label;account.classList.toggle('pending',s!=='verified'&&s!=='rejected')}const card=document.getElementById('brokerProfileCard');if(card)card.querySelectorAll('.badge').forEach(function(el){if(/pending review|pending verification|verified|rejected/i.test(el.textContent||'')){el.textContent=s==='verified'?'Verified':s==='rejected'?'Rejected':'Pending Review';el.classList.toggle('pending',s!=='verified'&&s!=='rejected')}})}
async function awardReferral(db,fs,newUid,referrerUid){
 if(!referrerUid||referrerUid===newUid)return;
 try{
  const rewardRef=fs.doc(db,'referralRewards',newUid);
  await fs.runTransaction(db,async tx=>{
   const reward=await tx.get(rewardRef);
   if(reward.exists())return;
   const entRef=fs.doc(db,'brokerEntitlements',referrerUid),ent=await tx.get(entRef);
   const old=ent.exists()?ent.data():{};
   const next=Math.max(0,Number(old.bonusListings||0))+5;
   tx.set(entRef,{bonusListings:next,updatedAt:fs.serverTimestamp()},{merge:true});
   tx.set(rewardRef,{referrerUid:referrerUid,bonusListings:5,awardedAt:fs.serverTimestamp(),sourceBrokerUid:newUid});
  });
 }catch(e){console.warn('Referral bonus award failed',e)}
}
async function start(){
 const [{getApps,initializeApp},{getAuth,onAuthStateChanged},fs,{firebaseConfig}]=await Promise.all([
  import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js'),import('./firebase-config.js')
 ]);
 const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=fs.getFirestore(app);let stopBroker=null,stopApps=null,awardedUid='';
 function apply(broker,application,user){
  if(!user||String(user.email||'').toLowerCase()===ADMIN)return;
  const source=statusOf(broker)!=='pending'?broker:(statusOf(application)!=='pending'?application:broker||application);
  if(!source){renderStatus();return}
  const s=statusOf(source),p=local();p.uid=user.uid;p.agentEmail=p.agentEmail||user.email||'';
  if(source.name&&!p.agentName)p.agentName=source.name;if(source.fullName&&!p.agentName)p.agentName=source.fullName;
  if(source.referredByUid&&!p.referredByUid)p.referredByUid=source.referredByUid;
  p.status=s;p.approved=s==='verified';p.verified=s==='verified';save(p);renderStatus();
  if(s==='verified'&&p.referredByUid&&awardedUid!==user.uid){awardedUid=user.uid;awardReferral(db,fs,user.uid,p.referredByUid)}
 }
 onAuthStateChanged(auth,user=>{
  if(stopBroker){try{stopBroker()}catch(e){}}if(stopApps){try{stopApps()}catch(e){}}stopBroker=stopApps=null;
  if(!user||String(user.email||'').toLowerCase()===ADMIN){renderStatus();return}
  let broker=null,application=null;
  stopBroker=fs.onSnapshot(fs.doc(db,'brokers',user.uid),snap=>{broker=snap.exists()?snap.data():null;apply(broker,application,user)},err=>console.warn('Broker verification read failed',err));
  const q=fs.query(fs.collection(db,'brokerApplications'),fs.where('uid','==',user.uid));
  stopApps=fs.onSnapshot(q,snap=>{let best=null;snap.forEach(d=>{const x=d.data()||{};if(!best||statusOf(x)==='verified'||(statusOf(x)==='rejected'&&statusOf(best)==='pending'))best=x});application=best;apply(broker,application,user)},err=>console.warn('Application verification read failed',err));
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>start().catch(console.error),{once:true});else start().catch(console.error);
window.realynkVerificationSync={refresh:renderStatus};
})();