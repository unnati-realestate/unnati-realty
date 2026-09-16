/* REALYNK BROKER EARNING V3 — ₹10 lead unlock + payment request flow */
(function(){
'use strict';
if(window.__REALYNK_BROKER_EARNING_V3__)return;
window.__REALYNK_BROKER_EARNING_V3__=true;

function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function firebase(){return window.firebase||null}
function getAuth(){try{return firebase()&&firebase().auth?firebase().auth():null}catch(e){return null}}
function getDb(){try{return firebase()&&firebase().firestore?firebase().firestore():null}catch(e){return null}}
function uid(){var a=getAuth();return a&&a.currentUser?a.currentUser.uid:''}

function showModal(){
 var old=document.getElementById('realynkLeadUnlockModal');if(old)old.remove();
 var p=profile(),name=p.agentName||p.name||'Broker';
 var m=document.createElement('div');m.id='realynkLeadUnlockModal';m.style='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px';
 m.innerHTML='<div style="width:min(460px,100%);background:#fff;border-radius:18px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.25)">'+
 '<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:11px;letter-spacing:.08em;font-weight:800;opacity:.6">LEAD UNLOCK</div><h3 style="margin:5px 0">Unlock a buyer / tenant lead</h3></div><button id="rluClose" type="button" style="border:0;background:#eee;border-radius:50%;width:34px;height:34px;font-size:20px">×</button></div>'+
 '<div style="margin-top:12px;padding:12px;border-radius:12px;background:#f7f7f7"><b>₹10 per lead</b><div style="font-size:12px;margin-top:4px;opacity:.7">Payment is recorded as pending until verified by admin.</div></div>'+
 '<label style="display:block;margin-top:14px;font-size:12px;font-weight:700">Lead ID</label><input id="rluLead" placeholder="Enter lead ID" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ddd;border-radius:10px;margin-top:5px">'+
 '<label style="display:block;margin-top:11px;font-size:12px;font-weight:700">UPI Transaction Reference</label><input id="rluTxn" placeholder="After payment, enter UTR / transaction ID" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ddd;border-radius:10px;margin-top:5px">'+
 '<div style="display:flex;gap:8px;margin-top:14px"><button id="rluPay" type="button" style="flex:1;padding:12px;border:0;border-radius:10px;background:#111;color:#fff;font-weight:800">Pay ₹10 by UPI</button><button id="rluSubmit" type="button" style="flex:1;padding:12px;border:1px solid #111;border-radius:10px;background:#fff;font-weight:800">I Have Paid</button></div>'+
 '<div id="rluMsg" style="margin-top:10px;font-size:12px;line-height:1.45;opacity:.75">'+esc(name)+', payment verification is required before the lead is unlocked.</div></div>';
 document.body.appendChild(m);
 document.getElementById('rluClose').onclick=function(){m.remove()};
 document.getElementById('rluPay').onclick=function(){
   var upi=window.REALYNK_UPI_ID||localStorage.getItem('realynkPlatformUpi')||'';
   var msg=document.getElementById('rluMsg');
   if(!upi){msg.textContent='UPI payment setup is not configured yet. Admin UPI ID/QR must be added before real payment can be collected.';return;}
   var lead=(document.getElementById('rluLead').value||'').trim();
   if(!lead){msg.textContent='Pehle Lead ID enter kijiye.';return;}
   var link='upi://pay?pa='+encodeURIComponent(upi)+'&pn='+encodeURIComponent('ReaLynk')+'&am=10&cu=INR&tn='+encodeURIComponent('ReaLynk Lead Unlock '+lead);
   window.location.href=link;
 };
 document.getElementById('rluSubmit').onclick=submitPayment;
}

function submitPayment(){
 var lead=(document.getElementById('rluLead').value||'').trim(),txn=(document.getElementById('rluTxn').value||'').trim(),msg=document.getElementById('rluMsg');
 if(!lead){msg.textContent='Pehle Lead ID enter kijiye.';return}
 if(!txn){msg.textContent='Payment ke baad UTR / transaction reference enter kijiye.';return}
 var a=getAuth(),db=getDb(),u=a&&a.currentUser;
 if(!u||u.isAnonymous){msg.textContent='Broker account se login karke payment submit kijiye.';return}
 if(!db){msg.textContent='Payment service abhi connect nahi hai.';return}
 var id=u.uid+'_'+lead+'_'+Date.now();
 db.collection('leadPayments').doc(id).set({brokerUid:u.uid,brokerEmail:u.email||'',brokerName:profile().agentName||profile().name||'',leadId:lead,amount:10,currency:'INR',txnRef:txn,status:'pending',createdAt:new Date().toISOString()}).then(function(){msg.textContent='✅ Payment request submit ho gayi. Admin verification ke baad lead unlock hoga.'}).catch(function(e){msg.textContent='Payment request save nahi hui: '+(e&&e.message?e.message:'Firestore error')});
}

function render(){
 var host=document.getElementById('myList');if(!host)return;
 var box=document.getElementById('realynkEarningPanel');if(!box){box=document.createElement('div');box.id='realynkEarningPanel';box.className='panel';host.parentNode.insertBefore(box,host)}
 var p=profile(),name=p.agentName||p.name||'Broker';
 box.innerHTML='<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><div style="font-size:11px;letter-spacing:.08em;opacity:.65;font-weight:800">BROKER EARNING</div><h3 style="margin:4px 0 2px">'+esc(name)+', earn with ReaLynk</h3><div style="font-size:13px;opacity:.72">Buyer / tenant leads can be unlocked for ₹10.</div></div><div style="font-size:30px">💰</div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px"><div style="padding:12px;border:1px solid #e6e6e6;border-radius:12px"><b>FREE</b><div style="font-size:12px;margin-top:4px">List properties & profile</div></div><div style="padding:12px;border:2px solid #111;border-radius:12px"><b>PRO · ₹499/month</b><div style="font-size:12px;margin-top:4px">Priority business tools</div></div><div style="padding:12px;border:1px solid #e6e6e6;border-radius:12px"><b>LEAD UNLOCK · ₹10</b><div style="font-size:12px;margin-top:4px">Unlock high-intent contact</div></div></div><button id="realynkEarningLead" type="button" style="width:100%;margin-top:12px;padding:13px;border:0;border-radius:11px;background:#111;color:#fff;font-weight:800;cursor:pointer">🔓 Unlock Lead for ₹10</button><div style="margin-top:9px;font-size:11px;opacity:.65">Flow: UPI payment → UTR submission → Admin verification → Lead unlock.</div>';
 var b=document.getElementById('realynkEarningLead');if(b)b.onclick=showModal;
}
function start(){if(document.getElementById('myList')){render();setInterval(render,4000)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,700);
window.realynkBrokerEarning={refresh:render,openLeadUnlock:showModal,submitPayment:submitPayment};
})();
