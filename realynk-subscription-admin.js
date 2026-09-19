/* REALYNK SUBSCRIPTION ADMIN V2 — owner-only payment verification */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

if(!window.__REALYNK_SUBSCRIPTION_ADMIN_V1__){
window.__REALYNK_SUBSCRIPTION_ADMIN_V1__=true;
const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
let rows=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function isAdmin(){return String(auth.currentUser?.email||'').toLowerCase()===ADMIN}
function render(){
 if(!isAdmin())return;
 const host=document.getElementById('superAdminPanel');if(!host)return;
 let box=document.getElementById('realynkSubscriptionAdmin');
 if(!box){box=document.createElement('div');box.id='realynkSubscriptionAdmin';box.className='panel';host.parentNode.insertBefore(box,host.nextSibling)}
 const pending=rows.filter(x=>x.status==='pending');
 box.innerHTML='<div style="margin-top:14px;padding:14px;border:2px solid #0b3768;border-radius:14px;background:#f5f9ff"><h3 style="margin:0">💳 ReaLynk Subscription Payments</h3><div style="font-size:12px;color:#667;margin:4px 0 10px">UPI: 9029663383@slc · Manual UTR verification</div>'+(pending.length?pending.map(x=>'<div style="padding:11px;margin-top:8px;background:#fff;border:1px solid #ddd;border-radius:10px"><b>'+esc(x.brokerName||'Broker')+'</b><div style="font-size:12px">'+esc(x.planName)+' · ₹'+esc(x.amount)+' · UTR: <b>'+esc(x.txnRef)+'</b></div><div style="font-size:11px;color:#667">'+esc(x.brokerEmail)+'</div><div style="display:flex;gap:8px;margin-top:8px"><button data-sub-approve="'+esc(x.id)+'" style="flex:1;padding:9px;border:0;border-radius:9px;background:#18864b;color:#fff;font-weight:800">✓ Verify & Activate</button><button data-sub-reject="'+esc(x.id)+'" style="flex:1;padding:9px;border:1px solid #d99;border-radius:9px;background:#fff;color:#a22;font-weight:800">Reject</button></div></div>').join(''):'<div style="font-size:12px;color:#667">No pending subscription payments.</div>')+'</div>';
 box.querySelectorAll('[data-sub-approve]').forEach(b=>b.onclick=async()=>{
  b.disabled=true;const x=rows.find(r=>r.id===b.dataset.subApprove);if(!x)return;
  try{
   const expires=new Date(Date.now()+30*24*60*60*1000);
   await updateDoc(doc(db,'subscriptionPayments',x.id),{status:'paid',verifiedAt:serverTimestamp(),verifiedBy:ADMIN});
   await setDoc(doc(db,'brokerEntitlements',x.brokerUid),{planId:x.planId,planName:x.planName,planStatus:'active',planPrice:x.amount,planExpiresAt:expires,updatedAt:serverTimestamp(),updatedBy:ADMIN},{merge:true});
  }catch(e){alert('Activation failed: '+(e?.message||'Firebase error'));b.disabled=false}
 });
 box.querySelectorAll('[data-sub-reject]').forEach(b=>b.onclick=async()=>{
  const x=rows.find(r=>r.id===b.dataset.subReject);if(!x)return;
  try{await updateDoc(doc(db,'subscriptionPayments',x.id),{status:'rejected',rejectedAt:serverTimestamp(),rejectedBy:ADMIN})}catch(e){alert('Reject failed: '+(e?.message||'Firebase error'))}
 });
}
onAuthStateChanged(auth,u=>{
  if(isAdmin()){
    render();
    onSnapshot(collection(db,'subscriptionPayments'),snap=>{rows=[];snap.forEach(d=>rows.push({...d.data(),id:d.id}));render()},e=>console.warn('Subscription payment watch failed',e));
  } else {
    rows=[];
  }
});
}