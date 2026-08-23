import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let cloudProperties = [];
let brokers = {};
let activeFilter = "";

const $ = id => document.getElementById(id);
const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const digits = v => String(v || "").replace(/\D/g, "");
const norm = v => String(v || "").trim().toLowerCase().replace(/[\s_-]+/g, " ");

function localProperties(){
  try { const p = JSON.parse(localStorage.getItem("realynkProperties") || "[]"); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

function typeOf(p){ return p.type || p.listingType || p.listing_type || ""; }
function descriptionOf(p){ return p.description || p.desc || ""; }
function photosOf(p){ return Array.isArray(p.photoUrls) ? p.photoUrls : (Array.isArray(p.photos) ? p.photos : []); }

function currentUid(){ return auth.currentUser?.uid || ""; }

function visibleForCategory(){
  const uid = currentUid();
  const local = localProperties().map(p => ({...p, __local:true, brokerUid:p.brokerUid || uid}));
  const merged = [...cloudProperties, ...local];
  const seen = new Set();
  return merged.filter(p => {
    const key = String(p.id || p.propertyId || (p.title+"|"+p.area+"|"+typeOf(p)));
    if(seen.has(key)) return false;
    seen.add(key);
    const b = brokers[p.brokerUid] || {};
    return b.approved === true || (uid && p.brokerUid === uid) || p.__local === true;
  });
}

function card(p){
  const b = brokers[p.brokerUid] || {};
  const phone = digits(p.phone || p.brokerPhone || b.phone);
  const photos = photosOf(p);
  const description = descriptionOf(p);
  return `<div class="panel property">
    <h3>${esc(p.title || "Property")}</h3>
    <div class="rt-lock">📍 ${esc(p.area || p.location || "Location not specified")}</div>
    <div class="details">
      <div class="detail"><span>TYPE</span><b>${esc(typeOf(p))}</b></div>
      <div class="detail"><span>PRICE / RENT</span><b>${esc(p.price || p.rent || "On Request")}</b></div>
    </div>
    ${p.deposit ? `<div class="rt-lock" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>` : ""}
    ${p.size ? `<div class="rt-lock"><b>Area:</b> ${esc(p.size)}</div>` : ""}
    ${description ? `<p>${esc(description)}</p>` : ""}
    ${photos.length ? `<div class="rt-media">${photos.slice(0,10).map(u => `<img class="rt-photo" src="${esc(u)}" alt="Property photo">`).join("")}</div>` : ""}
    <div class="badge">Broker: ${esc(b.fullName || p.brokerName || p.broker || "Realynk Broker")}</div>
    ${phone ? `<div class="rt-actions"><button type="button" data-cat-call="${phone}">📞 Call Broker</button><button type="button" data-cat-wa="${phone}" data-title="${esc(p.title || "Property")}">💬 WhatsApp</button></div>` : ""}
  </div>`;
}

function render(filter=""){
  activeFilter = filter || "";
  const out = $("homeList");
  if(!out) return;
  let list = visibleForCategory();
  if(filter) list = list.filter(p => norm(typeOf(p)) === norm(filter));
  const q = ($( "search")?.value || "").trim().toLowerCase();
  if(q) list = list.filter(p => [p.title,p.area,p.location,descriptionOf(p),typeOf(p),p.brokerName,p.broker].join(" ").toLowerCase().includes(q));
  const bar = $("filterBar"), title = $("filterTitle");
  if(bar) bar.style.display = filter ? "flex" : "none";
  if(title) title.textContent = filter ? filter + " Properties" : "";
  if(!list.length){ out.innerHTML = `<div class="panel empty">No ${esc(filter || "")} properties posted yet.</div>`; return; }
  out.innerHTML = list.map(card).join("");
  out.querySelectorAll("[data-cat-call]").forEach(b => b.onclick = () => location.href = "tel:+91" + b.dataset.catCall);
  out.querySelectorAll("[data-cat-wa]").forEach(b => b.onclick = () => location.href = "https://wa.me/91" + b.dataset.catWa + "?text=" + encodeURIComponent("Hi, I found your property on Realynk: " + (b.dataset.title || "Property")));
}

function setFilter(type){
  activeFilter = type;
  document.querySelectorAll(".quick button").forEach(b => b.classList.remove("active"));
  const id = type === "Heavy Deposit" ? "heavyDeposit" : type.toLowerCase();
  $(id)?.classList.add("active");
  render(type);
  setTimeout(() => $("homeList")?.scrollIntoView({behavior:"smooth", block:"start"}), 60);
}

function wire(){
  const map = {buy:"Buy", sale:"Sale", rent:"Rent", commercial:"Commercial", heavyDeposit:"Heavy Deposit"};
  Object.entries(map).forEach(([id,type]) => {
    const el = $(id);
    if(!el || el.dataset.categoryDisplay === "1") return;
    el.dataset.categoryDisplay = "1";
    el.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); setFilter(type); }, true);
  });
  const clear = $("clearFilter");
  if(clear && clear.dataset.categoryDisplay !== "1"){
    clear.dataset.categoryDisplay = "1";
    clear.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); activeFilter=""; document.querySelectorAll(".quick button").forEach(b=>b.classList.remove("active")); render(""); }, true);
  }
  const search = $("search");
  if(search && search.dataset.categorySearch !== "1"){
    search.dataset.categorySearch = "1";
    search.addEventListener("input", () => render(activeFilter));
  }
}

function start(){
  wire();
  new MutationObserver(wire).observe(document.body,{childList:true,subtree:true});
  onSnapshot(collection(db,"brokers"), snap => { brokers={}; snap.forEach(d=>brokers[d.id]=d.data()); render(activeFilter); });
  onSnapshot(collection(db,"properties"), snap => { cloudProperties=[]; snap.forEach(d=>cloudProperties.push({...d.data(),id:d.id})); render(activeFilter); });
  setTimeout(wire,500); setTimeout(wire,1500); setTimeout(()=>render(activeFilter),1800);
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true}); else start();
