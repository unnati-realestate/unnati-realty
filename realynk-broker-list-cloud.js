/* REALYNK BROKER DIRECTORY CLOUD V2 — stable public broker directory, single live listener, render-safe mount */
(function(){'use strict';if(window.__REALYNK_BROKER_DIRECTORY_CLOUD_V2__)return;window.__REALYNK_BROKER_DIRECTORY_CLOUD_V2__=true;
const F='https://www.gstatic.com/firebasejs/12.1.0/firebase-';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db=null,unsubscribe=null,started=false;
function mount(rows){
 const page=document.querySelector('#brokers .page');
 if(!page)return false;
 let box=document.getElementById('realynkCloudBrokerDirectory');
 if(!box){box=document.createElement('div');box.id='realynkCloudBrokerDirectory';box.className='panel';page.appendChild(box)}
 if(!rows.length){box.innerHTML='<h3 style="margin:0;color:#0b3768">🤝 Realynk Broker Network</h3><p style="color:#6b7a8c;margin-bottom:0">Verified broker profiles will appear here.</p>';return true}
 rows.sort((a,b)=>String(a.fullName||a.name||'').localeCompare(String(b.fullName||b.name||'')));
 box.innerHTML='<h3 style="margin:0 0 6px;color:#0b3768">🤝 Realynk Broker Network</h3><p style="color:#6b7a8c;margin:0 0 12px">Verified brokers and brokers under verification.</p>'+rows.map(b=>{const ok=b.verified===true&&b.approved===true;const status=ok?'Verified':'Pending Verification';const cls=ok?'#e9f8ef':'#fff7df';const fg=ok?'#18864b':'#9a6700';const phone=String(b.phone||b.accountPhone||'').replace(/\D/g,'');const slug=String(b.fullName||b.name||'realynk-broker').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const url=location.origin+location.pathname.replace(/[^/]*$/,'')+'professional-profile.html?broker='+encodeURIComponent(slug);return '<div style="border:1px solid #dfe6ee;border-radius:16px;padding:14px;margin:10px 0;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><div style="font-size:20px;font-weight:800;color:#0b3768">'+esc(b.fullName||b.name||b.agentName||'Broker')+'</div><div style="font-weight:700;margin-top:3px">'+esc(b.companyName||'Broker / Agent')+'</div><div style="font-size:13px;color:#6b7a8c;margin-top:4px">'+esc(b.city||'')+(b.state?', '+esc(b.state):'')+'</div></div><span style="background:'+cls+';color:'+fg+';padding:6px 9px;border-radius:9px;font-size:12px;font-weight:800;white-space:nowrap">'+status+'</span></div>'+(b.serviceAreas||b.areas?'<div style="margin-top:8px;font-size:13px;color:#6b7a8c">📍 '+esc(b.serviceAreas||b.areas)+'</div>':'')+(b.experience?'<div style="margin-top:4px;font-size:13px;color:#6b7a8c">⭐ '+esc(b.experience)+'</div>':'')+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px">'+(phone?'<a href="tel:+91'+phone+'" style="text-align:center;text-decoration:none;padding:10px;border-radius:10px;background:#0b3768;color:#fff;font-weight:800">📞 Call</a>':'')+'<button type="button" data-rbd-share="'+esc(b.id)+'" data-rbd-url="'+esc(url)+'" style="padding:10px;border-radius:10px;border:1px solid #dfe6ee;background:#fff;color:#0b3768;font-weight:800">🔗 Share</button></div></div>'}).join('');
 box.querySelectorAll('[data-rbd-share]').forEach(btn=>btn.onclick=()=>{const b=rows.find(x=>x.id===btn.dataset.rbdShare);if(!b)return;const msg='🏠 '+(b.fullName||b.name||'Realynk Broker')+'\n'+(b.companyName||'Broker / Agent')+'\n'+(b.verified===true&&b.approved===true?'🟢 Verified Broker':'🟡 Pending Verification')+'\n'+btn.dataset.rbdUrl;window.open('https://web.whatsapp.com/send?text='+encodeURIComponent(msg),'_blank','noopener')});
 return true;
}
async function start(){
 if(started)return true;
 started=true;
 try{const a=await import(F+'app.js'),fs=await import(F+'firestore.js'),cfg=await import('./firebase-config.js');const app=a.getApps().length?a.getApps()[0]:a.initializeApp(cfg.firebaseConfig);db=fs.getFirestore(app);unsubscribe=fs.onSnapshot(fs.collection(db,'brokers'),snap=>{const rows=[];snap.forEach(d=>{const b=d.data()||{};if(!b.uid||String(b.email||'').toLowerCase()==='seagullairexpress@gmail.com')return;rows.push({id:d.id,...b})});mount(rows)},e=>{console.warn('Realynk broker directory watch failed',e)});return true}catch(e){started=false;console.warn('Realynk broker directory failed',e);return false}}
function refresh(){if(!started)start();else mount([])}
function run(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,50);document.addEventListener('click',e=>{if(e.target.closest('[data-nav="brokers"]'))setTimeout(()=>mount([]),300)},true)}
run();window.realynkBrokerDirectory={refresh:start};
})();
