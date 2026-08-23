import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const ADMIN_EMAILS = ["realynk8@gmail.com"];
let me = null;
let brokers = {};
let cloudProperties = [];

const esc = s => String(s ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const digits = s => String(s || "").replace(/\D/g, "");
const isAdmin = () => !!me && ADMIN_EMAILS.includes(String(me.email || "").toLowerCase());
const readProfile = () => { try { return JSON.parse(localStorage.getItem("realynkBrokerProfile") || "{}"); } catch (_) { return {}; } };

function clearNewBrokerDefaults() {
  let p = readProfile();
  const seed = String(p.agentName || "").trim() === "Deepak Rajput" && String(p.accountPhone || "").replace(/\D/g, "") === "9658364364";
  if (p && p.agentName && !seed) return;
  if (seed && !isAdmin()) { try { localStorage.removeItem("realynkBrokerProfile"); } catch (_) {} }
  const ids = ["agentName","accountPhone","agentEmail","companyName","officeAddress","city","state","phone"];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
}

function injectStyle(){
  if(document.getElementById("realynk-network-style")) return;
  const s=document.createElement("style"); s.id="realynk-network-style";
  s.textContent=`
  .rn-card{background:#fff;border:1px solid #dfe6ee;border-radius:16px;padding:14px;margin:10px 0}
  .rn-title{font-size:20px;font-weight:800;color:#0b3768}.rn-muted{color:#6b7a8c;font-size:13px;margin-top:3px}
  .rn-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.rn-actions button{border:1px solid #dfe6ee;background:#fff;color:#0b3768;border-radius:10px;padding:10px;font-weight:800}
  .rn-approve{background:#18864b!important;color:#fff!important;border-color:#18864b!important}.rn-reject{color:#b42318!important}
  .rn-admin{border:2px solid #f4b400;background:#fffaf0}.rn-count{display:inline-block;background:#fff7df;color:#9a6700;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:800;margin-left:5px}
  `; document.head.appendChild(s);
}

function renderAdminPanel(){
  if(!isAdmin()) return;
  const account = document.getElementById("account"); if(!account) return;
  let box=document.getElementById("rnAdminPanel");
  if(!box){
    box=document.createElement("div"); box.id="rnAdminPanel"; box.className="panel rn-admin";
    box.innerHTML='<div style="font-size:20px;font-weight:800;color:#0b3768">Admin Panel <span id="rnPendingCount" class="rn-count">0 Pending</span></div><p class="rn-muted">Approve brokers here. Only approved brokers appear in the public network.</p><div id="rnPendingList"></div>';
    const panel=account.querySelector(".panel"); if(panel) panel.parentNode.insertBefore(box,panel.nextSibling); else account.querySelector(".page")?.appendChild(box);
  }
  renderPending();
}

function renderPending(){
  const list=document.getElementById("rnPendingList"), count=document.getElementById("rnPendingCount"); if(!list) return;
  const pending=Object.values(brokers).filter(b=>b.uid!==me?.uid && b.approved!==true && (b.fullName || b.phone || b.email));
  if(count) count.textContent=`${pending.length} Pending`;
  list.innerHTML=pending.length?pending.map(b=>{
    const phone=digits(b.phone);
    return `<div class="rn-card"><div class="rn-title">${esc(b.fullName||"New Broker")}</div><div class="rn-muted">${esc(b.companyName||"Broker / Agent")} • ${esc(b.city||"")}</div><div class="rn-muted">${esc(b.email||"")} ${phone?`• ${esc(phone)}`:""}</div><div class="rn-actions"><button class="rn-approve" data-rn-approve="${esc(b.uid)}">✓ Approve Broker</button><button class="rn-reject" data-rn-reject="${esc(b.uid)}">Reject</button></div></div>`;
  }).join(""):'<div class="rn-muted" style="padding:12px 0">No pending brokers.</div>';
  list.querySelectorAll("[data-rn-approve]").forEach(btn=>btn.onclick=async()=>{btn.disabled=true;await updateDoc(doc(db,"brokers",btn.dataset.rnApprove),{approved:true,verified:true,approvedAt:new Date()});});
  list.querySelectorAll("[data-rn-reject]").forEach(btn=>btn.onclick=async()=>{if(confirm("Reject this broker?")){btn.disabled=true;await updateDoc(doc(db,"brokers",btn.dataset.rnReject),{approved:false,verified:false});}});
}

function publicBrokers(){
  return Object.values(brokers).filter(b=>b.approved===true && b.uid!==me?.uid && String(b.email||"").toLowerCase()!==ADMIN_EMAILS[0]);
}

function renderBrokerNetwork(){
  const host=document.getElementById("brokerProfileCard"); if(!host) return;
  const list=publicBrokers();
  host.innerHTML=list.length?`<div style="font-weight:800;font-size:18px;color:#0b3768">Approved Brokers</div>`+list.map(b=>{
    const phone=digits(b.phone), count=cloudProperties.filter(p=>p.brokerUid===b.uid).length;
    return `<div class="rn-card"><div class="rn-title">${esc(b.fullName||"Broker")}</div><div class="rn-muted">${esc(b.companyName||"Real Estate Broker")} • ${esc(b.city||"")}</div><div class="rn-muted">${count} active ${count===1?'property':'properties'}</div><div class="rn-actions">${phone?`<button onclick="location.href='tel:+91${phone}'">📞 Call</button><button onclick="location.href='https://wa.me/91${phone}'">💬 WhatsApp</button>`:""}</div></div>`;
  }).join(""):'<div class="empty">No approved brokers yet.</div>';
}

function renderProperties(){
  const home=document.getElementById("homeList"); if(!home) return;
  const list=[...cloudProperties].sort((a,b)=>String(b.syncedAt||"").localeCompare(String(a.syncedAt||"")));
  if(!list.length){ home.innerHTML='<div class="empty">No properties posted yet.</div>'; return; }
  home.innerHTML=list.map(p=>{
    const b=brokers[p.brokerUid]||{}; const phone=digits(p.phone||b.phone); const media=Array.isArray(p.photoUrls)?p.photoUrls:[];
    return `<div class="panel property"><h3>${esc(p.title||"Property")}</h3><div class="rn-muted">📍 ${esc(p.area||"")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||"")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||"—")}</b></div></div>${p.description?`<p>${esc(p.description)}</p>`:""}${media.length?`<div class="listingMedia">${media.slice(0,10).map(u=>`<img src="${esc(u)}" alt="Property photo">`).join("")}</div>`:""}<div class="badge">Broker: ${esc(b.fullName||"Realynk Broker")}</div><div class="rn-actions">${phone?`<button onclick="location.href='tel:+91${phone}'">📞 Call Broker</button><button onclick="location.href='https://wa.me/91${phone}?text=${encodeURIComponent('Hi, I found your property on Realynk: '+(p.title||''))}'">💬 WhatsApp</button>`:""}</div></div>`;
  }).join("");
}

function subscribe(){
  onSnapshot(collection(db,"brokers"),snap=>{
    brokers={}; snap.forEach(d=>{brokers[d.id]=d.data()});
    renderAdminPanel(); renderBrokerNetwork();
  },e=>console.warn("Realynk brokers read failed",e));
  onSnapshot(collection(db,"properties"),snap=>{
    cloudProperties=[]; snap.forEach(d=>cloudProperties.push({...d.data(),id:d.id}));
    renderProperties(); renderBrokerNetwork();
  },e=>console.warn("Realynk properties read failed",e));
}

async function ensureProfileCloud(){
  if(!me) return;
  const p=readProfile();
  if(!p.agentName && !p.accountPhone && !p.agentEmail) return;
  const ref=doc(db,"brokers",me.uid); const old=await getDoc(ref); const prev=old.exists()?old.data():{};
  await setDoc(ref,{uid:me.uid,fullName:p.agentName||"",phone:p.accountPhone||"",email:p.agentEmail||me.email||"",companyName:p.companyName||"",city:p.city||"",state:p.state||"",updatedAt:new Date(),approved:prev.approved===true,verified:prev.approved===true},{merge:true});
}

function hookProfileChanges(){
  ["agentName","accountPhone","agentEmail","companyName","officeAddress","city","state"].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener("change",()=>setTimeout(()=>ensureProfileCloud().catch(()=>{}),150));});
}

onAuthStateChanged(auth,user=>{me=user||null; if(me){clearNewBrokerDefaults(); ensureProfileCloud().catch(()=>{}); renderAdminPanel();} else {clearNewBrokerDefaults();}});

window.addEventListener("DOMContentLoaded",()=>{injectStyle(); clearNewBrokerDefaults(); hookProfileChanges(); setTimeout(()=>{renderAdminPanel();subscribe();},500);});
