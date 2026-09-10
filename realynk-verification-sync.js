/* REALYNK VERIFICATION SYNC V1 — Firestore status is authoritative */
(function(){
'use strict';
if(window.__REALYNK_VERIFICATION_SYNC_V1__)return;
window.__REALYNK_VERIFICATION_SYNC_V1__=true;
const ADMIN='seagullairexpress@gmail.com';
function local(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function save(p){localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));window.dispatchEvent(new CustomEvent('realynkProfileStatusChanged'));}
function renderStatus(){
  const p=local();
  const verified=p.approved===true||p.verified===true||String(p.status||'').toLowerCase()==='verified';
  const rejected=String(p.status||'').toLowerCase()==='rejected';
  const label=verified?'Verified':rejected?'Rejected':'Pending Review';
  const card=document.getElementById('brokerProfileCard');
  if(card){card.querySelectorAll('.badge').forEach(function(el){if(/pending review|verified|rejected/i.test(el.textContent||'')){el.textContent=label;el.classList.toggle('pending',!verified&&!rejected)}})}
  const account=document.getElementById('accountStatus');
  if(account){account.textContent=label;account.classList.toggle('pending',!verified&&!rejected)}
}
async function start(){
  const [{getApps,initializeApp},{getAuth,onAuthStateChanged},{getFirestore,doc,onSnapshot},{firebaseConfig}]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js'),
    import('./firebase-config.js')
  ]);
  const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
  onAuthStateChanged(auth,user=>{
    if(!user||String(user.email||'').toLowerCase()===ADMIN){renderStatus();return;}
    const ref=doc(db,'brokers',user.uid);
    onSnapshot(ref,snap=>{
      if(!snap.exists()){renderStatus();return;}
      const d=snap.data()||{},p=local();
      if(d.approved===true||d.verified===true||String(d.status||'').toLowerCase()==='verified'){
        p.status='verified';p.approved=true;p.verified=true;
      }else if(String(d.status||'').toLowerCase()==='rejected'){
        p.status='rejected';p.approved=false;p.verified=false;
      }else if(d.status){
        p.status=String(d.status).toLowerCase();p.approved=d.approved===true;p.verified=d.verified===true;
      }
      save(p);renderStatus();
    },err=>console.warn('Realynk verification sync failed',err));
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>start().catch(console.error),{once:true});else start().catch(console.error);
window.realynkVerificationSync={refresh:renderStatus};
})();
