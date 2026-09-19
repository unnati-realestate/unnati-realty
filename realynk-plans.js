/* REALYNK PLANS V4 — production plan limits, referral bonus and plan UI */
(function(){
'use strict';
if(window.__REALYNK_PLANS_V4__) return;
window.__REALYNK_PLANS_V4__=true;

const PLANS={
  FREE:{id:'FREE',name:'FREE',price:0,listingLimit:10},
  STARTER:{id:'STARTER',name:'STARTER',price:199,listingLimit:25},
  GROWTH:{id:'GROWTH',name:'GROWTH',price:299,listingLimit:50},
  PRO:{id:'PRO',name:'PRO',price:499,listingLimit:100},
  BUSINESS:{id:'BUSINESS',name:'BUSINESS',price:899,listingLimit:250},
  ELITE:{id:'ELITE',name:'ELITE',price:1499,listingLimit:Infinity}
};
const SUB_KEY='realynkSubscriptionV3', BONUS_KEY='realynkReferralBonusListingsV3';
const ADMIN_EMAILS=['seagullairexpress@gmail.com','service.realynk@gmail.com'];
let cloudUser=null, cloudDb=null, cloudReady=false;

function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function getSub(){try{const x=JSON.parse(localStorage.getItem(SUB_KEY)||'null');return x&&x.plan?x:{plan:'FREE',status:'active',expiresAt:null}}catch(e){return{plan:'FREE',status:'active',expiresAt:null}}}
function applyCloudSubscription(d){
 if(!d||!d.planId)return;
 const exp=d.planExpiresAt?.toDate?d.planExpiresAt.toDate():d.planExpiresAt;
 if(d.planStatus==='active' && (!exp || new Date(exp)>new Date())) saveSub(d.planId,'active',exp?new Date(exp).toISOString():null);
 else if(d.planStatus==='expired' || (exp && new Date(exp)<=new Date())) saveSub('FREE','active',null);
}
function bonusLocal(){return Math.max(0,Number(localStorage.getItem(BONUS_KEY)||0))}
function saveSub(plan,status,expiresAt){const x={plan:PLANS[plan]?plan:'FREE',status:status||'active',expiresAt:expiresAt||null,updatedAt:new Date().toISOString()};localStorage.setItem(SUB_KEY,JSON.stringify(x));return x}
function isAdmin(){
 const p=profile(),email=String(p.agentEmail||'').toLowerCase();
 return ADMIN_EMAILS.indexOf(email)>=0 || ADMIN_EMAILS.indexOf(String(cloudUser?.email||'').toLowerCase())>=0 ||
   localStorage.getItem('realynkOwnerDevice')==='1';
}
function current(){const s=getSub();return Object.assign({},PLANS[s.plan]||PLANS.FREE,s)}
function effectiveLimit(){if(isAdmin())return Infinity;return current().listingLimit+bonusLocal()}
function listingCount(){try{return JSON.parse(localStorage.getItem('realynkProperties')||'[]').filter(x=>x&&x.mine).length}catch(e){return 0}}
function allowed(count){return isAdmin() || Number(count||listingCount())<effectiveLimit()}
function formatLimit(n){return n===Infinity?'Unlimited':String(n)}

function css(){
 if(document.getElementById('rpv3-css'))return;
 const s=document.createElement('style');s.id='rpv3-css';
 s.textContent=`
 .rpv3{margin:14px 0;border:1px solid #dfe6ee;border-radius:16px;background:#fff;padding:16px}
 .rpv3 h3{margin:0;color:#0b3768}.rpv3-muted{font-size:12px;color:#6b7a8c}
 .rpv3-current{margin-top:10px;padding:12px;border-radius:12px;background:#f5f8fb}
 .rpv3-plans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:12px}
 .rpv3-plan{border:1px solid #dfe6ee;border-radius:13px;padding:11px;background:#fff}
 .rpv3-plan strong{color:#0b3768}.rpv3-price{font-size:19px;font-weight:900;margin:4px 0}
 .rpv3-btn{width:100%;border:0;border-radius:9px;padding:9px;background:#0b3768;color:#fff;font-weight:800;cursor:pointer}
 .rpv3-free{background:#18864b}.rpv3-ref{margin-top:12px;border:1px dashed #f4b400;background:#fffaf0;padding:12px;border-radius:12px}
 @media(max-width:560px){.rpv3-plans{grid-template-columns:1fr}}
 `;
 document.head.appendChild(s);
}
function panelHTML(){
 const p=current(), count=listingCount(), limit=effectiveLimit(), ref=String(profile().uid||'').trim();
 const plans=Object.values(PLANS).map(x=>'<div class="rpv3-plan"><strong>'+x.name+'</strong><div class="rpv3-price">'+(x.price?'₹'+x.price+'/month':'₹0')+'</div><div class="rpv3-muted">'+formatLimit(x.listingLimit)+' listings'+(x.id==='FREE'?'':' / month')+'</div><button class="rpv3-btn '+(x.id==='FREE'?'rpv3-free':'')+'" data-rpv-plan="'+x.id+'">'+(x.id===p.id?'Current Plan':x.price?'Choose Plan':'Use FREE')+'</button></div>').join('');
 return '<div class="rpv3-current"><b>'+p.name+'</b> · '+(p.price?'₹'+p.price+'/month':'₹0')+'<br><span class="rpv3-muted">Listings: '+count+' / '+formatLimit(limit)+(bonusLocal()?' · Referral bonus +'+bonusLocal():'')+'</span></div>'+
 '<div class="rpv3-plans">'+plans+'</div>'+
 (ref?'<div class="rpv3-ref"><b>🎁 Referral Bonus</b><div class="rpv3-muted" style="margin-top:4px">Har successful broker referral par +5 free listings. Bonus aapke plan limit ke upar add hota hai.</div></div>':'');
}
function render(){
 css();
 ['account','dashboard'].forEach(id=>{
   const host=document.getElementById(id);if(!host)return;
   const page=host.querySelector('.page')||host;
   let box=document.getElementById('rpv3-'+id);
   if(!box){box=document.createElement('div');box.id='rpv3-'+id;box.className='rpv3';page.appendChild(box)}
   box.innerHTML='<h3>💳 ReaLynk Plans</h3><div class="rpv3-muted">Choose your listing capacity. Super Admin has unlimited posting.</div>'+panelHTML();
 });
 document.querySelectorAll('[data-rpv-plan]').forEach(b=>b.onclick=function(){
   const id=b.getAttribute('data-rpv-plan');
   if(id==='FREE'){saveSub('FREE','active',null);render();return}
   if(!isAdmin() && listingCount()>=effectiveLimit()){alert('Pehle current plan ki listing limit complete karein. Paid plan uske baad available hoga.');return}
   if(window.realynkSubscriptionPayment?.open){window.realynkSubscriptionPayment.open(id)}else{alert('Payment module loading... thoda wait karke dobara try karein.');}
 });
}
async function initCloud(){
 try{
  const [app,au,fs,cfg]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js'),
   import('./firebase-config.js')
  ]);
  const a=app.getApps().length?app.getApps()[0]:app.initializeApp(cfg.firebaseConfig);
  const auth=au.getAuth(a);cloudDb=fs.getFirestore(a);cloudReady=true;
  au.onAuthStateChanged(auth,u=>{cloudUser=u||null; if(u&&!isAdmin()){
    fs.onSnapshot(fs.doc(cloudDb,'brokerEntitlements',u.uid),snap=>{
      const d=snap.exists()?snap.data():{};
      applyCloudSubscription(d);
      const b=Math.max(0,Number(d.bonusListings||0));
      localStorage.setItem(BONUS_KEY,String(b));
      render();
    },()=>{});
  }});
 }catch(e){console.warn('ReaLynk plan cloud init failed',e)}
}
function gate(e){
 if(isAdmin())return;
 const count=listingCount(),limit=effectiveLimit();
 if(count>=limit){
   e.preventDefault();e.stopImmediatePropagation();
   alert('Listing limit reached. Your '+current().name+' plan allows '+formatLimit(limit)+' listings. Upgrade your plan or earn referral bonus listings.');
   render();
   return false;
 }
}
document.addEventListener('click',function(e){if(e.target.closest('#submit'))gate(e)},true);
function start(){
  render();
  setTimeout(render,800);
  setTimeout(render,2000);
  document.addEventListener('click',function(e){if(e.target.closest('[data-nav="account"],[data-nav="dashboard"]'))setTimeout(render,100);},true);
  setInterval(render,5000);
  initCloud();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkPlans={plans:PLANS,getSubscription:getSub,current:current,effectiveLimit:effectiveLimit,listingAllowed:allowed,save:saveSub,render:render,isSuperAdmin:isAdmin};
})();