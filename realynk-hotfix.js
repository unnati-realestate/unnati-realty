/* REALYNK HOTFIX V1 - one Firebase property feed, working category/contact/share buttons. */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app), db=getFirestore(app);
let uid="", properties=[], filter="", drawing=false;
const $=id=>document.getElementById(id);
const digits=v=>String(v||"").replace(/\D/g,"");
const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const profile=()=>{try{return JSON.parse(localStorage.getItem("realynkBrokerProfile")||"{}")}catch{return {}}};
const toast=m=>{const t=$("toast");if(!t)return;t.textContent=m;t.style.display="block";clearTimeout(window.__rhToast);window.__rhToast=setTimeout(()=>t.style.display="none",2600)};
const active=p=>{const s=String(p.status||"active").toLowerCase();return s!=="sold"&&s!=="sold out"&&s!=="soldout"&&s!=="rented out"&&s!=="inactive"};
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));document.querySelectorAll(".bottom button").forEach(b=>b.classList.toggle("active",b.dataset.nav===id));window.scrollTo(0,0)}
function matches(p){if(!filter)return true;const type=String(p.type||"").toLowerCase(),title=String(p.title||"").toLowerCase();if(filter==="Heavy Deposit")return type.includes("heavy")||title.includes("heavy deposit");return type===filter.toLowerCase()}
function share(url,title){const text="Hi, I found this property on Realynk: "+title;if(navigator.share){navigator.share({title,text,url}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(text+"\n"+url).then(()=>toast("Property link copied"))}else{window.prompt("Copy property link",url)}}
function card(p){const ph=digits(p.phone||p.brokerPhone||"9658364364");const url=location.origin+location.pathname+"?property="+encodeURIComponent(p.id||"");return `<div class="panel property" data-property-id="${esc(p.id)}"><h3>${esc(p.title||"Property")}</h3><div>📍 ${esc(p.area||"Location not specified")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||"")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||"On Request")}</b></div></div>${p.deposit?`<div style="margin-top:7px">Deposit: <b>${esc(p.deposit)}</b></div>`:""}${p.size?`<div style="margin-top:7px">Area: <b>${esc(p.size)}</b></div>`:""}<p>${esc(p.description||p.desc||"")}</p><div class="badge">Broker: ${esc(p.brokerName||"Realynk Broker")}</div><div class="rh-actions">${ph?`<button class="rh-call" data-phone="${ph}" type="button">📞 Call Broker</button><button class="rh-wa" data-phone="${ph}" type="button">💬 WhatsApp</button>`:""}<button class="rh-share" data-url="${esc(url)}" data-title="${esc(p.title||"Realynk Property")}" type="button">↗ Share</button></div></div>`}
function render(){if(drawing)return;const host=$("homeList");if(!host)return;const q=($("search")?.value||"").trim().toLowerCase();let list=properties.filter(p=>active(p)&&matches(p));if(q)list=list.filter(p=>[p.title,p.area,p.type,p.description,p.desc,p.size,p.deposit,p.brokerName].join(" ").toLowerCase().includes(q));if($("filterBar"))$("filterBar").style.display=filter?"flex":"none";if($("filterTitle"))$("filterTitle").textContent=filter||"";drawing=true;host.innerHTML=list.length?list.map(card).join(""):'<div class="empty">No properties found.</div>';drawing=false}
function bind(){
  if(window.__realynkHotfixBound)return;window.__realynkHotfixBound=true;
  const stop=e=>{e.preventDefault();e.stopImmediatePropagation()};
  const setFilter=v=>{filter=v;render()};
  [["buy","Buy"],["sale","Sale"],["rent","Rent"],["commercial","Commercial"],["heavyDeposit","Heavy Deposit"]].forEach(([id,v])=>$(id)?.addEventListener("click",e=>{stop(e);show("home");setFilter(v)},true));
  $("clearFilter")?.addEventListener("click",e=>{stop(e);filter="";if($("search"))$("search").value="";render()},true);
  $("search")?.addEventListener("input",()=>render(),true);
  document.addEventListener("click",e=>{const b=e.target.closest?.("button");if(!b)return;if(b.classList.contains("rh-call")){stop(e);location.href="tel:+91"+b.dataset.phone}else if(b.classList.contains("rh-wa")){stop(e);location.href="https://wa.me/91"+b.dataset.phone}else if(b.classList.contains("rh-share")){stop(e);share(b.dataset.url,b.dataset.title)}},true);
  const mo=new MutationObserver(()=>{if(!drawing)render()});if($("homeList"))mo.observe($("homeList"),{childList:true,subtree:true});
}
async function syncLocal(){let u=auth.currentUser;if(!u){try{u=(await signInAnonymously(auth)).user}catch{return}}uid=u.uid;const p=profile();if(p.agentName){try{await setDoc(doc(db,"brokers",uid),{uid,fullName:p.agentName,phone:digits(p.accountPhone),email:p.agentEmail||"",companyName:p.companyName||"",city:p.city||"",state:p.state||"",approved:p.approved===true,verified:p.approved===true,updatedAt:serverTimestamp()},{merge:true})}catch(e){console.warn("broker sync",e)}}let local=[];try{local=JSON.parse(localStorage.getItem("realynkProperties")||"[]")}catch{}if(!Array.isArray(local))return;for(const x of local.slice(0,50)){if(!x?.id)continue;try{await setDoc(doc(db,"properties",String(x.id)),{...x,brokerUid:uid,brokerName:p.agentName||x.broker||x.brokerName||"Realynk Broker",brokerPhone:digits(p.accountPhone||x.phone||""),status:x.status||"active",updatedAt:serverTimestamp()},{merge:true})}catch(e){console.warn("property sync",e)}}}
function start(){bind();syncLocal();onSnapshot(collection(db,"properties"),s=>{properties=[];s.forEach(d=>properties.push({...d.data(),id:d.id}));render()},e=>console.warn("property feed",e));setInterval(()=>{syncLocal().then(render)},5000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
