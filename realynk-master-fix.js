/* REALYNK MASTER ACTION FIX - single click layer for Home/category/navigation/actions */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":'&#39;'}[c]));
const digits=v=>String(v||"").replace(/\D/g,"");
let cloud=[],filter="";

function local(){try{const a=JSON.parse(localStorage.getItem("realynkProperties")||"[]");return Array.isArray(a)?a:[]}catch{return[]}}
function all(){const m=new Map();[...cloud,...local()].forEach(p=>{if(!p)return;const id=String(p.id||p.propertyId||(p.title+"|"+(p.area||"")+"|"+(p.type||"")));m.set(id,{...(m.get(id)||{}),...p})});return [...m.values()]}
function active(p){const s=String(p.status||"active").toLowerCase();return !["sold","sold out","soldout","rented out","inactive"].includes(s)}
function match(p){if(!filter)return true;const t=String(p.type||p.listingType||"").toLowerCase(),title=String(p.title||"").toLowerCase();if(filter==="Heavy Deposit")return t.includes("heavy")||title.includes("heavy deposit");return t===filter.toLowerCase()}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));document.querySelectorAll(".bottom button").forEach(b=>b.classList.toggle("active",b.dataset.nav===id));window.scrollTo(0,0)}
function phone(p){return digits(p.phone||p.brokerPhone||"")}
function card(p){const ph=phone(p);const title=p.title||"Property";const url=location.origin+location.pathname+"?property="+encodeURIComponent(p.id||"");return `<div class="panel property"><h3>${esc(title)}</h3><div class="rt-lock">📍 ${esc(p.area||p.location||"Location not specified")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||p.listingType||"")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||p.rent||"On Request")}</b></div></div>${p.deposit?`<div class="rt-lock" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>`:""}${p.size?`<div class="rt-lock"><b>Area:</b> ${esc(p.size)}</div>`:""}${p.description||p.desc?`<p>${esc(p.description||p.desc)}</p>`:""}<div class="badge">Broker: ${esc(p.brokerName||p.agentName||p.broker||"Realynk Broker")}</div><div class="rt-actions" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">${ph?`<button type="button" data-rm-call="${ph}">📞 Call</button><button type="button" data-rm-wa="${ph}" data-title="${esc(title)}">💬 WhatsApp</button>`:""}<button type="button" data-rm-share="${esc(url)}" data-title="${esc(title)}">↗️ Share</button></div></div>`}
function render(){const out=$("homeList");if(!out)return;let list=all().filter(active).filter(match);const q=($("search")?.value||"").trim().toLowerCase();if(q)list=list.filter(p=>[p.title,p.area,p.location,p.type,p.listingType,p.description,p.desc,p.deposit,p.brokerName,p.broker].join(" ").toLowerCase().includes(q));const bar=$("filterBar"),title=$("filterTitle");if(bar)bar.style.display=filter?"flex":"none";if(title)title.textContent=filter?filter+" Properties":"";out.innerHTML=list.length?list.map(card).join(""):('<div class="panel empty">No '+esc(filter||"")+" properties found yet.</div>')}
function category(type){filter=type;show("home");document.querySelectorAll(".quick button").forEach(b=>b.classList.toggle("active",(b.id==="heavyDeposit"?"Heavy Deposit":(b.id||"").replace(/^./,c=>c.toUpperCase()))===type));render();setTimeout(()=>$("homeList")?.scrollIntoView({behavior:"smooth",block:"start"}),60)}
function ensureTiles(){const q=document.querySelector(".quick");if(!q)return;const post=$("postQuick");if(!$("sale")){const b=document.createElement("button");b.id="sale";b.type="button";b.innerHTML='🏷️<b>Sale</b>';post?q.insertBefore(b,post):q.appendChild(b)}if(!$("heavyDeposit")){const b=document.createElement("button");b.id="heavyDeposit";b.type="button";b.innerHTML='🔐<b>Heavy Deposit</b>';post?q.insertBefore(b,post):q.appendChild(b)}}
function clear(){filter="";document.querySelectorAll(".quick button").forEach(b=>b.classList.remove("active"));if($("search"))$("search").value="";render()}
function share(url,title){const text="Hi, I found this property on Realynk: "+title;if(navigator.share)navigator.share({title,text,url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text+"\n"+url).then(()=>alert("Property link copied."));else window.prompt("Copy property link:",url)}
function handle(e){const t=e.target?.closest?.("button,[data-rn-benefit],.rn-benefit");if(!t)return;
  const id=t.id;
  const nav=t.dataset?.nav;
  if(nav){e.preventDefault();e.stopPropagation();show(nav);if(nav==="home")render();return}
  if(["buy","sale","rent","commercial","heavyDeposit"].includes(id)){e.preventDefault();e.stopPropagation();const type=id==="heavyDeposit"?"Heavy Deposit":id[0].toUpperCase()+id.slice(1);category(type);return}
  if(id==="clearFilter"){e.preventDefault();e.stopPropagation();clear();return}
  if(id==="postQuick"||id==="brokerPost"){e.preventDefault();e.stopPropagation();show("post");return}
  if(t.dataset?.rnBenefit){e.preventDefault();e.stopPropagation();const a=t.dataset.rnBenefit;if(a==="brokers")show("brokers");else {show("home");clear()}return}
  if(t.classList.contains("rn-benefit")){e.preventDefault();e.stopPropagation();show("home");clear();return}
  if(t.dataset?.rmCall){e.preventDefault();e.stopPropagation();location.href="tel:+91"+t.dataset.rmCall;return}
  if(t.dataset?.rmWa){e.preventDefault();e.stopPropagation();location.href="https://wa.me/91"+t.dataset.rmWa+"?text="+encodeURIComponent("Hi, I found your property on Realynk: "+(t.dataset.title||"Property"));return}
  if(t.dataset?.rmShare){e.preventDefault();e.stopPropagation();share(t.dataset.rmShare,t.dataset.title||"Realynk Property");return}
}
function start(){ensureTiles();window.addEventListener("click",handle,true);setTimeout(ensureTiles,500);setTimeout(ensureTiles,1500);try{const u=auth.currentUser||null;if(!u)signInAnonymously(auth).catch(()=>{});}catch{}onSnapshot(collection(db,"properties"),s=>{cloud=[];s.forEach(d=>cloud.push({...d.data(),id:d.id}));if($("home")?.classList.contains("active"))render()},()=>{});render()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
