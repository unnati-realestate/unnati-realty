/* REALYNK SUBSCRIPTION PAYMENT V2 — Super Admin bypass + UPI/QR */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

(function(){
'use strict';
if(window.__REALYNK_SUBSCRIPTION_PAYMENT_V1__) return;
window.__REALYNK_SUBSCRIPTION_PAYMENT_V1__=true;

const UPI_ID='9029663383@slc', PAYEE='MR DEEPAK RAJPUT';
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app), db=getFirestore(app);
let currentUser=null, paymentRows=[];

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function plans(){return window.realynkPlans?.plans||{}}
function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function count(){try{return JSON.parse(localStorage.getItem('realynkProperties')||'[]').filter(x=>x&&x.mine).length}catch(e){return 0}}
function effectiveLimit(){return Number(window.realynkPlans?.effectiveLimit?.()||10)}
function isAdmin(){return !!window.realynkPlans?.isSuperAdmin?.()}
function modal(){return document.getElementById('realynkSubPayModal')}
function close(){const m=modal();if(m)m.remove()}

function css(){
 if(document.getElementById('rsubpay-css'))return;
 const s=document.createElement('style');s.id='rsubpay-css';
 s.textContent=`.rsubpay-back{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px}.rsubpay{width:min(480px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;padding:18px;box-shadow:0 20px 70px rgba(0,0,0,.25)}.rsubpay h2{margin:0;color:#0b3768}.rsubpay .amt{font-size:28px;font-weight:900;margin:8px 0}.rsubpay .qr{display:flex;justify-content:center;margin:12px 0}.rsubpay .qr img{width:210px;height:210px;border:8px solid #fff;box-shadow:0 2px 12px #ddd}.rsubpay label{display:block;font-size:13px;font-weight:800;margin:10px 0 5px}.rsubpay input{width:100%;box-sizing:border-box;padding:11px;border:1px solid #ccd5df;border-radius:9px}.rsubpay button{border:0;border-radius:10px;padding:11px 14px;font-weight:800;cursor:pointer}.rsubpay .submit{width:100%;background:#0b3768;color:#fff;margin-top:12px}.rsubpay .cancel{background:#eee;color:#333}.rsubpay .note{font-size:12px;color:#667;line-height:1.45}`;
 document.head.appendChild(s);
}

async function open(planId){
 const p=plans()[planId]; if(!p||!p.price)return;
 if(!currentUser){alert('Please login first.');return}
 if(!isAdmin() && count()<effectiveLimit()){
   alert('Pehle current plan ki listing limit complete karein. Paid plan uske baad available hoga.');
   return;
 }
 css(); close();
 const upi=`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE)}&am=${p.price}&cu=INR&tn=${encodeURIComponent('ReaLynk '+p.name+' Plan')}`;
 const qr='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(upi);
 const back=document.createElement('div');back.id='realynkSubPayModal';back.className='rsubpay-back';
 back.innerHTML='<div class="rsubpay"><div style="display:flex;justify-content:space-between;gap:10px"><h2>💳 '+esc(p.name)+' Plan</h2><button class="cancel" id="rsubClose">✕</button></div><div class="amt">₹'+p.price+' / month</div><div class="note">UPI ID: <b>'+esc(UPI_ID)+'</b><br>Payee: <b>'+esc(PAYEE)+'</b></div><div class="qr"><img src="'+qr+'" alt="ReaLynk UPI QR"></div><div class="note">QR scan karke exact amount ₹'+p.price+' pay karein. Payment ke baad UTR / Transaction ID yahan enter karein.</div><label>UTR / Transaction ID</label><input id="rsubUtr" maxlength="80" placeholder="Enter UTR / Transaction ID"><button class="submit" id="rsubSubmit">Payment Submit for Verification</button><div id="rsubMsg" class="note" style="margin-top:9px"></div></div>';
 document.body.appendChild(back);
 back.querySelector('#rsubClose').onclick=close;
 back.querySelector('#rsubSubmit').onclick=async()=>{
   const btn=back.querySelector('#rsubSubmit'),utr=back.querySelector('#rsubUtr').value.trim(),msg=back.querySelector('#rsubMsg');
   if(!utr){msg.textContent='UTR / Transaction ID enter karein.';return}
   btn.disabled=true;msg.textContent='Submitting...';
   try{
    await addDoc(collection(db,'subscriptionPayments'),{brokerUid:currentUser.uid,brokerName:profile().agentName||currentUser.displayName||'Broker',brokerEmail:currentUser.email||'',planId:p.id,planName:p.name,amount:p.price,txnRef:utr,status:'pending',createdAt:serverTimestamp()});
    msg.textContent='Payment request submit ho gaya. Admin verification ke baad plan activate hoga.';
    btn.style.display='none';
   }catch(e){msg.textContent='Submit failed: '+(e?.message||'Firebase error');btn.disabled=false}
 };
}

onAuthStateChanged(auth,u=>{
 currentUser=u||null;
 if(u){
   const q=query(collection(db,'subscriptionPayments'),where('brokerUid','==',u.uid));
   onSnapshot(q,s=>{paymentRows=[];s.forEach(d=>paymentRows.push({...d.data(),id:d.id}));});
 }
});
window.realynkSubscriptionPayment={open,close,payments:()=>paymentRows};
})();