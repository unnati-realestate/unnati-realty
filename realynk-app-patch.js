import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore, collection, onSnapshot, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const ADMIN = "service.realynk@gmail.com";
let brokers = {};
let properties = {};
let activeFilter = "";

const $ = id => document.getElementById(id);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const digits = v => String(v || "").replace(/\D/g,"");

function toast(msg){
  const t=$("toast"); if(!t) return;
  t.textContent=msg; t.style.display="block";
  clearTimeout(window.__rnPatchToast);
  window.__rnPatchToast=setTimeout(()=>t.style.display="none",2800);
}
function readProfile(){ try { return JSON.parse(localStorage.getItem("realynkBrokerProfile") || "{}"); } catch { return {}; } }
function saveProfile(p){ localStorage.setItem("realynkBrokerProfile", JSON.stringify(p)); }
function blankSeedForPublic(){
  const p=readProfile();
  const isSeed=p.agentName==="Deepak Rajput" && digits(p.accountPhone)==="9658364364";
  const isAdmin=(auth.currentUser?.email||"").toLowerCase()===ADMIN;
  if(isSeed && !isAdmin){
    localStorage.removeItem("realynkBrokerProfile");
    ["agentName","accountPhone","agentEmail","companyName","officeAddress","city","state","pincode","experience","specialization","serviceAreas","reraNo","reraCompetency","gstin","website","phone"].forEach(id=>{const e=$(id);if(e)e.value="";});
  }
}
function addHeavyOption(){
  const s=$("type"); if(!s || s.querySelector('option[value="Heavy Deposit"]')) return;
  const o=document.createElement("option"); o.value="Heavy Deposit"; o.textContent="Heavy Deposit"; s.appendChild(o);
}
function showPost(){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("post")?.classList.add("active");window.scrollTo(0,0);}
function hookButtons(){
  const map={buy:"Buy",sale:"Sale",rent:"Rent",commercial:"Commercial",heavyDeposit:"Heavy Deposit"};
  Object.entries(map).forEach(([id,type])=>{
    const b=$(id); if(!b)return;
    b.onclick=(e)=>{e.preventDefault();e.stopPropagation();activeFilter=type;renderProperties(type);};
  });
  $("postQuick")?.addEventListener("click",showPost,true);$("brokerPost")?.addEventListener("click",showPost,true);$("add")?.addEventListener("click",showPost,true);
  $("clearFilter")?.addEventListener("click",e=>{e.preventDefault();activeFilter="";renderProperties("");},true);
  $("search")?.addEventListener("input",()=>renderProperties(activeFilter));
}
function renderProperties(filter=""){
  const out=$("homeList"); if(!out)return;
  const q=($("search")?.value||"").trim().toLowerCase();
  let list=Object.values(properties).filter(p=>{const b=brokers[p.brokerUid]||{};return b.approved===true&&(p.brokerUid||b.uid);});
  if(filter)list=list.filter(p=>String(p.type||"").toLowerCase()===filter.toLowerCase());
  if(q)list=list.filter(p=>[p.title,p.area,p.location,p.description,p.type,p.brokerName].join(" ").toLowerCase().includes(q));
  const bar=$("filterBar"),title=$("filterTitle");if(bar)bar.style.display=filter?"flex":"none";if(title)title.textContent=filter?`${filter} Properties`:"";
  if(!list.length){out.innerHTML=`<div class="panel empty">No ${esc(filter||"property")} properties found yet.</div>`;return;}
  out.innerHTML=list.map(p=>{const b=brokers[p.brokerUid]||{},ph=digits(p.phone||b.phone),photos=Array.isArray(p.photoUrls)?p.photoUrls:(Array.isArray(p.photos)?p.photos:[]);const call=ph?`<button type="button" data-rn-call="${ph}">📞 Call Broker</button><button type="button" data-rn-wa="${ph}" data-title="${esc(p.title||"Property")}">💬 WhatsApp</button>`:"";return `<div class="panel property"><h3>${esc(p.title||"Property")}</h3><div class="rn-muted">📍 ${esc(p.area||p.location||"Location not specified")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||"")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||p.rent||"On Request")}</b></div></div>${p.deposit?`<div class="rn-muted" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>`:""}${p.size?`<div class="rn-muted"><b>Area:</b> ${esc(p.size)}</div>`:""}${p.description?`<p>${esc(p.description)}</p>`:""}${photos.length?`<div class="listingMedia">${photos.slice(0,10).map(u=>`<img src="${esc(u)}" alt="Property photo">`).join("")}</div>`:""}<div class="badge">Broker: ${esc(b.fullName||p.brokerName||"Realynk Broker")}</div>${call?`<div class="rn-actions">${call}</div>`:""}</div>`;}).join("");
  out.querySelectorAll("[data-rn-call]").forEach(b=>b.onclick=()=>location.href="tel:+91"+b.dataset.rnCall);
  out.querySelectorAll("[data-rn-wa]").forEach(b=>b.onclick=()=>location.href="https://wa.me/91"+b.dataset.rnWa+"?text="+encodeURIComponent("Hi, I found your property on Realynk: "+(b.dataset.title||"")));
}
function injectLoginUI(){
  const page=$("account")?.querySelector(".page");if(!page||$("rnLoginBox"))return;
  const box=document.createElement("div");box.id="rnLoginBox";box.className="panel";
  box.innerHTML=`<div style="font-size:19px;font-weight:800;color:#0b3768">🔐 Login / Logout</div><div id="rnAuthState" class="small" style="margin:7px 0 10px">Checking account…</div><div id="rnAuthForm"><div class="field"><label>Email</label><input id="rnEmail" type="email" autocomplete="email" placeholder="broker@email.com"></div><div class="field"><label>Password</label><input id="rnPassword" type="password" autocomplete="current-password" placeholder="Minimum 6 characters"></div><div class="rt-actions"><button id="rnLogin" class="primary" type="button">Login</button><button id="rnRegister" class="back" type="button">Create Account</button></div><button id="rnAdminGoogle" class="back full" style="margin-top:9px" type="button">Admin Login</button></div><button id="rnLogout" class="back full" type="button" style="display:none">Logout</button>`;
  page.insertBefore(box,page.firstChild);
  $("rnLogin").onclick=async()=>{const email=$("rnEmail").value.trim(),pass=$("rnPassword").value;if(!email||pass.length<6){toast("Enter a valid email and 6+ character password");return;}try{await signInWithEmailAndPassword(auth,email,pass);toast("Login successful");}catch(e){toast(e.code==="auth/invalid-credential"?"Email or password is incorrect":(e.message||"Login failed"));}};
  $("rnRegister").onclick=async()=>{const email=$("rnEmail").value.trim(),pass=$("rnPassword").value;if(!email||pass.length<6){toast("Enter email and 6+ character password");return;}try{const c=await createUserWithEmailAndPassword(auth,email,pass);await setDoc(doc(db,"brokers",c.user.uid),{uid:c.user.uid,email,fullName:"",phone:"",approved:false,verified:false,createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});toast("Account created. Fill your broker profile and submit for approval.");}catch(e){toast(e.message||"Account creation failed");}};
  $("rnAdminGoogle").onclick=async()=>{try{const c=await signInWithPopup(auth,new GoogleAuthProvider());if((c.user.email||"").toLowerCase()!==ADMIN){await signOut(auth);toast("This is not the Realynk admin account");}else toast("Admin login successful");}catch(e){toast("Admin login cancelled or unavailable");}};
  $("rnLogout").onclick=async()=>{try{await signOut(auth);localStorage.removeItem("realynkBrokerProfile");toast("Logged out");}catch(e){toast("Logout failed");}};
}
function updateAuthUI(user){
  const state=$("rnAuthState"),form=$("rnAuthForm"),out=$("rnLogout");if(!state)return;
  if(user&&user.email){state.textContent=(user.email.toLowerCase()===ADMIN?"Admin signed in: ":"Signed in: ")+user.email;if(form)form.style.display="none";if(out)out.style.display="block";}else{state.textContent="Not logged in. You can browse properties without an account.";if(form)form.style.display="block";if(out)out.style.display="none";}
}
async function syncProfileToCloud(user){
  if(!user||!user.email)return;const p=readProfile();if(!p.agentName&&!p.accountPhone&&!p.agentEmail)return;const ref=doc(db,"brokers",user.uid),snap=await getDoc(ref),prev=snap.exists()?snap.data():{};await setDoc(ref,{uid:user.uid,fullName:p.agentName||"",phone:digits(p.accountPhone||p.phone||""),email:p.agentEmail||user.email,accountType:p.accountType||"Individual",companyName:p.companyName||"",officeAddress:p.officeAddress||"",city:p.city||"",state:p.state||"",pincode:p.pincode||"",experience:p.experience||"",specialization:p.specialization||"",serviceAreas:p.serviceAreas||"",reraNo:p.reraNo||"",reraCompetency:p.reraCompetency||"",gstin:p.gstin||"",website:p.website||"",approved:prev.approved===true,verified:prev.approved===true,updatedAt:serverTimestamp()},{merge:true});
}
function init(){
  injectLoginUI();addHeavyOption();hookButtons();blankSeedForPublic();
  const ro=new MutationObserver(()=>{injectLoginUI();addHeavyOption();hookButtons();});ro.observe(document.body,{childList:true,subtree:true});
  onAuthStateChanged(auth,async user=>{updateAuthUI(user);blankSeedForPublic();if(user?.email)await syncProfileToCloud(user).catch(()=>{});hookButtons();});
  onSnapshot(collection(db,"brokers"),snap=>{brokers={};snap.forEach(d=>brokers[d.id]=d.data());renderProperties(activeFilter);});
  onSnapshot(collection(db,"properties"),snap=>{properties={};snap.forEach(d=>properties[d.id]={...d.data(),id:d.id});renderProperties(activeFilter);});
  setTimeout(()=>renderProperties(activeFilter),1200);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
