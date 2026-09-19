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
 var box=document.getElementById('realynkEarningPanel');
 if(!box){box=document.createElement('div');box.id='realynkEarningPanel';box.className='panel';host.parentNode.insertBefore(box,host)}
 var p=profile(),name=p.agentName||p.name||'Broker';
 var admin=String(p.agentEmail||'').toLowerCase()==='seagullairexpress@gmail.com' || !!(window.realynkPlans&&window.realynkPlans.isSuperAdmin&&window.realynkPlans.isSuperAdmin());
 var mine=[];
 try{mine=JSON.parse(localStorage.getItem('realynkProperties')||'[]');if(!Array.isArray(mine))mine=[];mine=mine.filter(function(x){return x&&x.mine})}catch(e){mine=[]}
 var count=mine.length;
 if(admin){
   box.innerHTML='<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><div style="font-size:11px;letter-spacing:.08em;opacity:.65;font-weight:800">BROKER LISTING STATUS</div><h3 style="margin:4px 0 2px">'+esc(name)+'</h3><div style="font-size:13px;opacity:.72">Super Admin account</div></div><div style="font-size:30px">♾️</div></div><div style="margin-top:14px;padding:14px;border:1px solid #bfe3cc;border-radius:12px;background:#f2fff6"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>POSTING LIMIT</b><b style="color:#18864b">UNLIMITED</b></div><div style="margin-top:9px;color:#18864b;font-weight:800">✓ Super Admin can post unlimited properties.</div><div style="margin-top:6px;font-size:12px;opacity:.72">Current properties on this account: '+count+'</div></div>';
   return;
 }
 var plans=window.realynkPlans, cur=plans&&plans.current?plans.current():{name:'FREE',price:0,listingLimit:10}, limit=plans&&plans.effectiveLimit?plans.effectiveLimit():cur.listingLimit, bonus=0;
 try{bonus=Math.max(0,Number(localStorage.getItem('realynkReferralBonusListingsV3')||0))}catch(e){}
 var limText=limit===Infinity?'Unlimited':String(limit), planText=cur.price?'₹'+cur.price+'/month':'₹0';
 box.innerHTML='<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><div style="font-size:11px;letter-spacing:.08em;opacity:.65;font-weight:800">BROKER LISTING PLAN</div><h3 style="margin:4px 0 2px">'+esc(name)+', ReaLynk plan</h3><div style="font-size:13px;opacity:.72">'+esc(cur.name)+' · '+planText+'</div></div><div style="font-size:30px">🎁</div></div><div style="margin-top:14px;padding:14px;border:1px solid #dfe6ee;border-radius:12px;background:#f8fbff"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>LISTINGS</b><b>'+count+' / '+limText+'</b></div><div style="height:10px;background:#e9eef4;border-radius:99px;margin-top:9px;overflow:hidden"><div style="height:100%;width:'+(limit===Infinity?0:Math.min(100,(count/Math.max(1,limit))*100))+'%;background:#18864b;border-radius:99px"></div></div><div style="margin-top:9px;font-weight:800;color:'+(count<limit?'#18864b':'#b42318')+'">'+(count<limit?'✓ Listing capacity available':'🔒 Listing limit reached')+'</div>'+(bonus?'<div style="margin-top:6px;font-size:12px;opacity:.72">Referral bonus: +'+bonus+' listings</div>':'')+'</div>';
}
function start(){if(document.getElementById('myList')){render();setInterval(render,4000)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,700);
window.realynkBrokerEarning={refresh:render,openLeadUnlock:showModal,submitPayment:submitPayment};
})();
