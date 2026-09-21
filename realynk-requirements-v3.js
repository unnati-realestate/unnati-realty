/* REALYNK REQUIREMENTS V3 — cloud-backed broker requirements + inventory matching */
(function(){
'use strict';
if(window.__REALYNK_REQUIREMENTS_V3__)return;
window.__REALYNK_REQUIREMENTS_V3__=true;
const KEY='realynkRequirementsV3';
const FIREBASE_VERSION='12.1.0';
let db=null, auth=null;
function initFirebase(){
  try{
    if(window.__REALYNK_REQ_FIREBASE__) return window.__REALYNK_REQ_FIREBASE__;
    const p=import('./firebase-config.js');
    return p.then(cfg=>Promise.all([
      import('https://www.gstatic.com/firebasejs/'+FIREBASE_VERSION+'/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/'+FIREBASE_VERSION+'/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/'+FIREBASE_VERSION+'/firebase-firestore.js')
    ]).then(([appm,authm,fsm])=>{
      const app=appm.getApps().length?appm.getApps()[0]:appm.initializeApp(cfg.firebaseConfig);
      db=fsm.getFirestore(app); auth=authm.getAuth(app);
      window.__REALYNK_REQ_FIREBASE__={db,auth,fsm,authm};
      return window.__REALYNK_REQ_FIREBASE__;
    }));
  }catch(e){return Promise.reject(e)}
}
function getLocal(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function saveLocal(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){return false}}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,' ').trim()}
function num(v){const n=Number(String(v||'').replace(/[^0-9.]/g,''));return isFinite(n)?n:0}
function tokens(s){return norm(s).split(/\s+/).filter(x=>x.length>2)}
function bhk(s){const m=norm(s).match(/(\\d+)\\s*bhk/);return m?Number(m[1]):0}
function price(p){
  const n=num(p.price||p.salePrice||p.expectedAmount||p.budget||p.rent);
  if(n)return n;
  const t=String(p.desc||p.description||p.details||'').replace(/,/g,'');
  const m=t.match(/(?:₹|rs\\.?|inr)?\\s*(\\d+(?:\\.\\d+)?)\\s*(crore|cr|lakh|lac|l|k)?/i);
  if(!m)return 0;
  let x=Number(m[1]),u=String(m[2]||'').toLowerCase();
  if(u==='crore'||u==='cr')x*=10000000; else if(u==='lakh'||u==='lac'||u==='l')x*=100000; else if(u==='k')x*=1000;
  return x;
}
function matchOne(r,p){
  let score=0;
  const rt=norm(r.type), pt=norm(p.type||p.listingType||p.category);
  const text=norm([p.title,p.area,p.description,p.desc,p.location,p.locality,p.city,p.bhk,p.propertyType,p.category].join(' '));
  const reqText=norm((r.property||'')+' '+(r.note||'')), rb=bhk(reqText), pb=bhk(text);
  if((rt==='buy'&&(pt==='buy'||pt==='sale'))||pt===rt)score+=30;
  else if(rt==='rent'&&pt==='lease')score+=20;
  if(rb&&pb){if(rb===pb)score+=25;else if(Math.abs(rb-pb)===1)score+=8}
  const loc=tokens(r.location), hits=loc.filter(x=>text.includes(x)).length;
  if(loc.length&&hits)score+=Math.min(30,10*hits);
  const pp=price(p), max=num(r.max), min=num(r.min);
  if(max&&pp){if(pp<=max)score+=10;else if(pp<=max*1.1)score+=5}
  if(min&&pp){if(pp>=min)score+=5;else if(pp>=min*.9)score+=2}
  return Math.max(0,Math.min(100,score));
}
async function cloudProperties(){
  try{
    const f=await initFirebase(), snap=await f.fsm.getDocs(f.fsm.collection(f.db,'properties'));
    return snap.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>String(p.status||'').toLowerCase()!=='deleted');
  }catch(e){console.warn('Requirement cloud inventory read failed',e);return[]}
}
async function saveCloud(r){
  try{
    const f=await initFirebase(), u=f.auth.currentUser;
    if(!u||u.isAnonymous)return false;
    await f.fsm.setDoc(f.fsm.doc(f.db,'requirements',r.id),Object.assign({},r,{brokerUid:u.uid}));
    return true;
  }catch(e){console.warn('Requirement cloud save failed',e);return false}
}
function inject(){
  const q=document.querySelector('.quick'); if(!q||document.getElementById('postRequirement'))return;
  const b=document.createElement('button');b.id='postRequirement';b.type='button';
  b.innerHTML='🔎<b>Post Requirement</b>';b.onclick=openModal;q.appendChild(b);
}
function close(){document.getElementById('realynkReqModal')?.remove()}
function openModal(){
  if(document.getElementById('realynkReqModal'))return;
  const wrap=document.createElement('div');wrap.id='realynkReqModal';
  wrap.innerHTML='<div class="realynkReqBackdrop"></div><div class="realynkReqBox" role="dialog" aria-modal="true"><button class="realynkReqClose" type="button">×</button><div class="realynkReqHead"><div class="realynkReqIcon">🔎</div><div><h2>Post Buyer / Tenant Requirement</h2><p>Requirement save karke available properties se match karein.</p></div></div><form id="realynkReqForm"><label>Requirement Type<select id="rrType"><option>Buy</option><option>Rent</option><option>Commercial</option><option>Heavy Deposit</option></select></label><label>Property / BHK<input id="rrProperty" placeholder="2 BHK / Shop / Office" required></label><label>Preferred Location<input id="rrLocation" placeholder="Mira Road, Bhayandar..." required></label><div class="realynkReqGrid"><label>Min Budget (₹)<input id="rrMin" type="number" min="0" placeholder="5000000"></label><label>Max Budget (₹)<input id="rrMax" type="number" min="0" placeholder="9000000" required></label></div><label>Note (optional)<textarea id="rrNote" rows="3" placeholder="Higher floor, parking, possession etc."></textarea><button class="realynkReqSubmit" type="submit">🚀 Post Requirement & Find Matches</button></form><div id="realynkReqResult"></div></div>';
  document.body.appendChild(wrap);
  if(!document.getElementById('realynkReqCSS')){const css=document.createElement('style');css.id='realynkReqCSS';css.textContent='#postRequirement{border:1px solid rgba(0,0,0,.08);cursor:pointer}.realynkReqBackdrop{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:9998}.realynkReqBox{position:fixed;z-index:9999;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,560px);max-height:88vh;overflow:auto;background:#fff;border-radius:20px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.28)}.realynkReqClose{position:absolute;right:14px;top:10px;border:0;background:none;font-size:30px;cursor:pointer}.realynkReqHead{display:flex;gap:12px;align-items:center;margin-bottom:18px}.realynkReqIcon{font-size:28px}.realynkReqBox h2{margin:0 30px 4px 0;font-size:21px}.realynkReqBox p{margin:0;color:#666;font-size:13px}.realynkReqBox label{display:block;font-weight:700;font-size:13px;margin:12px 0}.realynkReqBox input,.realynkReqBox select,.realynkReqBox textarea{width:100%;box-sizing:border-box;margin-top:6px;padding:11px 12px;border:1px solid #ddd;border-radius:10px;font:inherit}.realynkReqGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.realynkReqSubmit{width:100%;padding:13px;border:0;border-radius:11px;background:#0b3768;color:#fff;font-weight:800;cursor:pointer;margin-top:8px}.realynkMatch{border:1px solid #e6e6e6;border-radius:12px;padding:12px;margin-top:8px}.realynkMatch strong{display:block}.realynkMatch small{color:#666}@media(max-width:520px){.realynkReqBox{padding:18px}.realynkReqGrid{grid-template-columns:1fr}}';document.head.appendChild(css)}
  wrap.querySelector('.realynkReqClose').onclick=close;wrap.querySelector('.realynkReqBackdrop').onclick=close;wrap.querySelector('#realynkReqForm').onsubmit=submit;
}
async function submit(e){
  e.preventDefault();
  const r={id:'REQ-'+Date.now(),type:rrType.value,property:rrProperty.value.trim(),location:rrLocation.value.trim(),min:rrMin.value,max:rrMax.value,note:rrNote.value.trim(),createdAt:new Date().toISOString()};
  const a=getLocal();a.unshift(Object.assign({},r,{mine:true}));saveLocal(a);
  const out=document.getElementById('realynkReqResult');out.innerHTML='<div style="text-align:center;padding:16px">🔎 Matching properties search ho rahi hain...</div>';
  const props=await cloudProperties(); const matches=props.map(p=>({p,score:matchOne(r,p)})).filter(x=>x.score>=35).sort((a,b)=>b.score-a.score).slice(0,10);
  const cloudSaved=await saveCloud(r);
  out.innerHTML='<div style="font-weight:800">✅ Requirement posted</div><div style="font-size:13px;color:#666;margin-top:4px">'+matches.length+' matching properties found'+(cloudSaved?' and requirement synced.':'.')+'</div>'+matches.map(x=>{const p=x.p;return '<div class="realynkMatch"><strong>'+String(p.title||p.name||'Property')+'</strong><small>'+String(p.area||p.locality||'')+' · '+String(p.price||price(p)||'')+' · '+String(p.type||'')+' · '+x.score+'% match</small></div>'}).join('');
  document.getElementById('realynkReqForm').style.display='none';
}
function start(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,300);
window.realynkRequirements={open:openModal,get:getLocal,findMatches:async r=>{const p=await cloudProperties();return p.map(x=>({p:x,score:matchOne(r,x)})).filter(x=>x.score>=35).sort((a,b)=>b.score-a.score)}};
})();