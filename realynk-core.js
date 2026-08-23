import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const ADMIN_EMAIL = "service.realynk@gmail.com";
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let user = null;
let admin = false;
let brokers = {};
let properties = [];
let unsubs = [];

const $ = id => document.getElementById(id);
const digits = v => String(v || "").replace(/\D/g, "");
const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const localProfile = () => { try { return JSON.parse(localStorage.getItem("realynkBrokerProfile") || "{}"); } catch { return {}; } };
const saveLocalProfile = p => localStorage.setItem("realynkBrokerProfile", JSON.stringify(p));
function toast(msg){ const t=$("toast"); if(!t) return; t.textContent=msg; t.style.display="block"; clearTimeout(window.__rt); window.__rt=setTimeout(()=>t.style.display="none",2800); }
function setScreen(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); const el=$(id); if(el)el.classList.add("active"); document.querySelectorAll(".bottom button").forEach(b=>b.classList.toggle("active",b.dataset.nav===id)); window.scrollTo(0,0); }

function blankNewBrokerForm(){
  const p=localProfile();
  const ids=["agentName","accountPhone","agentEmail","companyName","officeAddress","city","state","pincode","experience","specialization","serviceAreas","reraNo","reraCompetency","gstin","website"];
  const ownerProfile=(p.agentName==="Deepak Rajput" && digits(p.accountPhone)==="9658364364" && String(p.agentEmail||"").toLowerCase()===ADMIN_EMAIL);
  if(ownerProfile) localStorage.setItem("realynkOwnerDevice","1");
  const ownerDevice=localStorage.getItem("realynkOwnerDevice")==="1";
  const looksSeed=(p.agentName==="Deepak Rajput" && digits(p.accountPhone)==="9658364364") || (!p.agentName && $("accountPhone")?.value==="9658364364");
  if(!admin && !ownerDevice && looksSeed){
    try{localStorage.removeItem("realynkBrokerProfile");}catch{}
    ids.forEach(id=>{const e=$(id);if(e)e.value="";});
    if($("state"))$("state").value="";
    if($("declaration"))$("declaration").checked=false;
  }
  if(!admin){
    const phone=$("phone"); if(phone && (phone.value==="9658364364" || !localProfile().agentName)) phone.value="";
  }
}

function injectCSS(){
  if($("rt-style"))return;
  const s=document.createElement("style");s.id="rt-style";s.textContent=`
  .rt-admin{border:2px solid #f4b400!important;background:#fffaf0!important}.rt-admin h3{margin:0;color:#0b3768}.rt-pill{display:inline-block;padding:5px 9px;border-radius:999px;background:#fff7df;color:#946200;font-size:12px;font-weight:800}.rt-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.rt-actions button{border:1px solid #dfe6ee;background:#fff;border-radius:10px;padding:11px;font-weight:800;color:#0b3768}.rt-approve{background:#18864b!important;color:#fff!important;border-color:#18864b!important}.rt-danger{color:#b42318!important}.rt-profile{background:#f8fbff;border:1px solid #dfe6ee;border-radius:12px;padding:12px;margin-top:10px}.rt-lock{font-size:12px;color:#6b7a8c}.rt-photo{width:96px;height:72px;object-fit:cover;border-radius:8px}.rt-media{display:flex;gap:7px;overflow:auto;margin-top:8px}
  `;document.head.appendChild(s);
}

function profilePayload(){
  return {uid:user?.uid||"",fullName:$("agentName")?.value.trim()||"",phone:digits($("accountPhone")?.value),email:$("agentEmail")?.value.trim()||user?.email||"",accountType:$("accountType")?.value||"Individual",companyName:$("companyName")?.value.trim()||"",officeAddress:$("officeAddress")?.value.trim()||"",city:$("city")?.value.trim()||"",state:$("state")?.value.trim()||"",pincode:$("pincode")?.value.trim()||"",experience:$("experience")?.value||"",specialization:$("specialization")?.value.trim()||"",serviceAreas:$("serviceAreas")?.value.trim()||"",reraNo:$("reraNo")?.value.trim()||"",reraCompetency:$("reraCompetency")?.value.trim()||"",gstin:$("gstin")?.value.trim()||"",website:$("website")?.value.trim()||""};
}
function fillAccount(p=localProfile()){
  const map={agentName:p.agentName,accountPhone:p.accountPhone,agentEmail:p.agentEmail,accountType:p.accountType,companyName:p.companyName,officeAddress:p.officeAddress,city:p.city,state:p.state,pincode:p.pincode,experience:p.experience,specialization:p.specialization,serviceAreas:p.serviceAreas,reraNo:p.reraNo,reraCompetency:p.reraCompetency,gstin:p.gstin,website:p.website};
  Object.entries(map).forEach(([id,v])=>{const e=$(id);if(e && v!=null)e.value=v;});
  if($("declaration"))$("declaration").checked=!!p.declaration;
  updateStatus(p);
}
function updateStatus(p=localProfile()){
  const verified=p.status==="verified" || p.approved===true;
  if($("accountStatus")){ $("accountStatus").textContent=verified?"✓ Verified Broker":"Pending Admin Approval"; $("accountStatus").className=verified?"badge":"badge pending"; }
  if($("mobileVerifyStatus"))$("mobileVerifyStatus").textContent="Not required";
  if($("profileVerifyStatus"))$("profileVerifyStatus").textContent=verified?"Approved":"Pending";
}

async function ensureAuth(){
  if(auth.currentUser)return auth.currentUser;
  try{const c=await signInAnonymously(auth);return c.user;}catch(e){console.warn("Anonymous auth unavailable",e);return null;}
}

async function saveBroker(){
  const p=profilePayload();
  if(!p.fullName||p.phone.length!==10||!p.city||!p.state){toast("Please fill Name, Mobile, City and State");return;}
  if(!$("declaration")?.checked){toast("Please confirm the declaration");return;}
  const old=localProfile();
  const next={...p,agentName:p.fullName,accountPhone:p.phone,agentEmail:p.email,declaration:true,status:old.status==="verified"?"verified":"pending",approved:old.approved===true};
  saveLocalProfile(next); fillAccount(next);
  const u=await ensureAuth();
  if(u){
    try{const r=doc(db,"brokers",u.uid);const oldDoc=await getDoc(r);const prev=oldDoc.exists()?oldDoc.data():{};await setDoc(r,{...p,uid:u.uid,approved:prev.approved===true,verified:prev.approved===true,createdAt:prev.createdAt||serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}catch(e){console.warn(e);}
  }
  toast(next.approved?"Broker account updated":"Broker account submitted for admin approval");
  setScreen("brokers");
}

async function syncLocalProperties(){
  const u=await ensureAuth(); if(!u)return;
  let list=[];try{list=JSON.parse(localStorage.getItem("realynkProperties")||"[]");}catch{}
  if(!Array.isArray(list))return;
  const p=localProfile();
  for(const item of list.slice(0,20)){
    if(!item.id)continue;
    try{await setDoc(doc(db,"properties",String(item.id)),{...item,brokerUid:u.uid,brokerName:p.agentName||"",brokerPhone:p.accountPhone||"",updatedAt:serverTimestamp()},{merge:true});}catch(e){console.warn("property sync",e);}
  }
}

function renderAdmin(){
  if(!admin)return;
  const account=$("account");if(!account)return;
  let box=$("rtAdminPanel");
  if(!box){box=document.createElement("div");box.id="rtAdminPanel";box.className="panel rt-admin";const page=account.querySelector(".page");box.innerHTML='<h3>🔐 Realynk Admin Panel</h3><p class="rt-lock">Only the admin account can see this panel.</p><div id="rtAdminList"></div>';page.appendChild(box);}
  const pending=Object.values(brokers).filter(b=>b.approved!==true && (b.fullName||b.phone||b.email));
  $("rtAdminList").innerHTML=pending.length?pending.map(b=>`<div class="rt-profile"><b>${esc(b.fullName||"New Broker")}</b><div class="rt-lock">${esc(b.companyName||"Broker / Agent")} • ${esc(b.city||"")}</div><div class="rt-lock">${esc(b.email||"")} • ${esc(b.phone||"")}</div><div class="rt-actions"><button class="rt-approve" data-approve="${esc(b.uid)}">✓ Approve</button><button class="rt-danger" data-reject="${esc(b.uid)}">Reject</button></div></div>`).join(""):'<div class="rt-lock" style="padding:10px 0">No pending brokers.</div>';
  $("rtAdminList").querySelectorAll("[data-approve]").forEach(btn=>btn.onclick=async()=>{btn.disabled=true;try{await updateDoc(doc(db,"brokers",btn.dataset.approve),{approved:true,verified:true,approvedAt:serverTimestamp()});toast("Broker approved");}catch(e){btn.disabled=false;toast("Approval failed");}});
  $("rtAdminList").querySelectorAll("[data-reject]").forEach(btn=>btn.onclick=async()=>{if(!confirm("Reject this broker?"))return;btn.disabled=true;try{await updateDoc(doc(db,"brokers",btn.dataset.reject),{approved:false,verified:false,rejectedAt:serverTimestamp()});toast("Broker rejected");}catch(e){btn.disabled=false;}});
}

function renderBrokers(){
  const host=$("brokerProfileCard");if(!host)return;
  const list=Object.values(brokers).filter(b=>b.approved===true && String(b.email||"").toLowerCase()!==ADMIN_EMAIL);
  host.innerHTML=list.length?'<div style="font-weight:800;font-size:18px;color:#0b3768">Approved Brokers</div>'+list.map(b=>{const ph=digits(b.phone);const count=properties.filter(p=>p.brokerUid===b.uid).length;return `<div class="rt-profile"><div style="font-size:20px;font-weight:800;color:#0b3768">${esc(b.fullName||"Broker")}</div><div class="rt-lock">${esc(b.companyName||"Real Estate Broker")} • ${esc(b.city||"")}</div><div class="rt-lock">${count} active ${count===1?'property':'properties'}</div><div class="rt-actions">${ph?`<button onclick="location.href='tel:+91${ph}'">📞 Call</button><button onclick="location.href='https://wa.me/91${ph}'">💬 WhatsApp</button>`:""}</div></div>`}).join(""):'<div class="empty">No approved brokers yet.</div>';
}

function renderProperties(filter=""){
  const host=$("homeList");if(!host)return;
  let list=properties.filter(p=>{const b=brokers[p.brokerUid]||{};return b.approved===true && (!filter || String(p.type||"").toLowerCase()===filter.toLowerCase());});
  const search=$("search")?.value.trim().toLowerCase();if(search)list=list.filter(p=>[p.title,p.area,p.description,p.brokerName].join(" ").toLowerCase().includes(search));
  if(!list.length){host.innerHTML='<div class="empty">No properties found.</div>';return;}
  host.innerHTML=list.map(p=>{const b=brokers[p.brokerUid]||{};const ph=digits(p.phone||b.phone);const media=Array.isArray(p.photoUrls)?p.photoUrls:(Array.isArray(p.photos)?p.photos:[]);return `<div class="panel property"><h3>${esc(p.title||"Property")}</h3><div class="rt-lock">📍 ${esc(p.area||"Location not specified")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||"")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||"On Request")}</b></div></div>${p.deposit?`<div class="rt-lock" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>`:""}${p.size?`<div class="rt-lock"><b>Area:</b> ${esc(p.size)}</div>`:""}${p.description?`<p>${esc(p.description)}</p>`:""}${media.length?`<div class="rt-media">${media.slice(0,10).map(u=>`<img class="rt-photo" src="${esc(u)}" alt="Property photo">`).join("")}</div>`:""}<div class="badge">Broker: ${esc(b.fullName||p.brokerName||"Realynk Broker")}</div><div class="rt-actions">${ph?`<button onclick="location.href='tel:+91${ph}'">📞 Call Broker</button><button onclick="location.href='https://wa.me/91${ph}?text=${encodeURIComponent('Hi, I found your property on Realynk: '+(p.title||''))}'">💬 WhatsApp</button>`:""}</div></div>`}).join("");
}

function subscribeCloud(){
  unsubs.forEach(fn=>{try{fn()}catch{}});unsubs=[];
  try{unsubs.push(onSnapshot(collection(db,"brokers"),snap=>{brokers={};snap.forEach(d=>brokers[d.id]=d.data());renderBrokers();renderAdmin();renderProperties();}));}catch(e){console.warn(e)}
  try{unsubs.push(onSnapshot(collection(db,"properties"),snap=>{properties=[];snap.forEach(d=>{const p=d.data();if(p.brokerUid)properties.push({...p,id:d.id});});renderProperties();renderBrokers();}));}catch(e){console.warn(e)}
}

function adminLogin(){
  const provider=new GoogleAuthProvider();
  signInWithPopup(auth,provider).then(c=>{if(c.user.email?.toLowerCase()!==ADMIN_EMAIL){toast("This Google account is not the Realynk admin account");return signOut(auth);}toast("Admin access enabled");}).catch(e=>{console.warn(e);toast("Admin login could not be completed");});
}
function addHiddenAdminAccess(){
  const logo=document.querySelector(".logo");if(!logo||logo.dataset.rtBound)return;logo.dataset.rtBound="1";let taps=0,timer=null;logo.addEventListener("click",()=>{taps++;clearTimeout(timer);timer=setTimeout(()=>taps=0,1600);if(taps>=5){taps=0;adminLogin();}});
}

function hookUI(){
  injectCSS();
  blankNewBrokerForm();
  fillAccount(localProfile());
  $("saveAccount")?.addEventListener("click",e=>{e.stopImmediatePropagation();saveBroker();},true);
  $("search")?.addEventListener("input",()=>renderProperties());
  ["buy","sale","rent","commercial"].forEach(id=>$(id)?.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();const f=id[0].toUpperCase()+id.slice(1);renderProperties(f);const fb=$("filterBar"),ft=$("filterTitle");if(fb){fb.style.display="flex";if(ft)ft.textContent=f;}},true));
  $("clearFilter")?.addEventListener("click",e=>{e.stopImmediatePropagation();const fb=$("filterBar");if(fb)fb.style.display="none";renderProperties("");},true);
  $("heavyDeposit")?.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();renderProperties("Heavy Deposit");const fb=$("filterBar"),ft=$("filterTitle");if(fb){fb.style.display="flex";if(ft)ft.textContent="Heavy Deposit";}},true);
  $("postQuick")?.addEventListener("click",e=>{e.stopImmediatePropagation();setScreen("post")},true);$("brokerPost")?.addEventListener("click",e=>{e.stopImmediatePropagation();setScreen("post")},true);$("add")?.addEventListener("click",e=>{e.stopImmediatePropagation();setScreen("post")},true);
  document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",e=>{e.stopImmediatePropagation();setScreen(b.dataset.nav)},true));
  document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",e=>{e.stopImmediatePropagation();setScreen(b.dataset.back)},true));
  $("submit")?.addEventListener("click",()=>setTimeout(syncLocalProperties,1800),true);
  addHiddenAdminAccess();
  setTimeout(()=>$("heavyDeposit")?.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();renderProperties("Heavy Deposit");const fb=$("filterBar"),ft=$("filterTitle");if(fb){fb.style.display="flex";if(ft)ft.textContent="Heavy Deposit";}},true),1200);
  renderProperties();renderBrokers();
}

onAuthStateChanged(auth,async u=>{
  user=u;admin=!!u?.email && u.email.toLowerCase()===ADMIN_EMAIL;
  if(admin)renderAdmin(); else blankNewBrokerForm();
  subscribeCloud();
});

window.addEventListener("DOMContentLoaded",()=>{hookUI();ensureAuth().then(()=>syncLocalProperties());setTimeout(()=>{hookUI();subscribeCloud();},900);});
