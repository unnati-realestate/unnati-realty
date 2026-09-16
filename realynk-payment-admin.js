/* REALYNK PAYMENT ADMIN V1 — verify ₹10 lead unlock payments */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
if(!window.__REALYNK_PAYMENT_ADMIN_V1__){
window.__REALYNK_PAYMENT_ADMIN_V1__=true;
const ADMIN='seagullairexpress@gmail.com';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);let rows=[];
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function render(){if(String(auth.currentUser?.email||'').toLowerCase()!==ADMIN)return;const host=document.getElementById('superAdminPanel');if(!host)return;let box=document.getElementById('realynkPaymentAdmin');if(!box){box=document.createElement('div');box.id='realynkPaymentAdmin';box.className='panel';host.parentNode.insertBefore(box,host.nextSibling)}const pending=rows.filter(x=>x.status==='pending');box.innerHTML='<div style="margin-top:14px;padding:14px;border:2px solid #18864b;border-radius:14px;background:#f5fff9"><h3 style="margin:0">💳 Lead Unlock Payments</h3><div style="font-size:12px;color:#667;margin:4px 0 10px">UPI: 9029663383@slc · ₹10 per lead</div>'+ (pending.length?pending.map(x=>'<div style="padding:11px;margin-top:8px;background:#fff;border:1px solid #ddd;border-radius:10px"><b>'+esc(x.brokerName||'Broker')+'</b><div style="font-size:12px">Lead: '+esc(x.leadId)+' · UTR: <b>'+esc(x.txnRef)+'</b></div><div style="display:flex;gap:8px;margin-top:8px"><button data-pay-approve="'+esc(x.id)+'" style="flex:1;padding:9px;border:0;border-radius:9px;background:#18864b;color:#fff;font-weight:800">✓ Verify & Unlock</button><button data-pay-reject="'+esc(x.id)+'" style="flex:1;padding:9px;border:1px solid #d99;border-radius:9px;background:#fff;color:#a22;font-weight:800">Reject</button></div></div>').join(''):'<div style="font-size:12px;color:#667">No pending payments.</div>')+'</div>';
box.querySelectorAll('[data-pay-approve]').forEach(b=>b.onclick=async()=>{b.disabled=true;const x=rows.find(r=>r.id===b.dataset.payApprove);if(!x)return;try{await updateDoc(doc(db,'leadPayments',x.id),{status:'paid',verifiedAt:serverTimestamp(),verifiedBy:ADMIN});await setDoc(doc(db,'leadUnlocks',x.brokerUid+'_'+x.leadId),{brokerUid:x.brokerUid,leadId:x.leadId,unlocked:true,amount:10,unlockedAt:serverTimestamp(),paymentId:x.id});}catch(e){alert('Verification failed: '+(e?.message||'Firebase error'));b.disabled=false}});
box.querySelectorAll('[data-pay-reject]').forEach(b=>b.onclick=async()=>{const x=rows.find(r=>r.id===b.dataset.payReject);if(!x)return;try{await updateDoc(doc(db,'leadPayments',x.id),{status:'rejected',rejectedAt:serverTimestamp(),rejectedBy:ADMIN})}catch(e){alert('Reject failed: '+(e?.message||'Firebase error'))}});
}
onAuthStateChanged(auth,u=>{if(String(u?.email||'').toLowerCase()===ADMIN)render()});
onSnapshot(collection(db,'leadPayments'),snap=>{rows=[];snap.forEach(d=>rows.push({...d.data(),id:d.id}));render()},e=>console.warn('Payment admin watch failed',e));
}
