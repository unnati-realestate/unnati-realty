import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let uid = "";
let editingId = "";
const $ = id => document.getElementById(id);
const read = () => { try { const x=JSON.parse(localStorage.getItem("realynkProperties")||"[]"); return Array.isArray(x)?x:[]; } catch { return []; } };
const save = a => localStorage.setItem("realynkProperties", JSON.stringify(a));
const esc = v => String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const mine = p => !p.brokerUid || !uid || p.brokerUid===uid;

function ensureHeavyDepositOption(){
  const s=$("type"); if(!s || [...s.options].some(o=>o.value==="Heavy Deposit")){
    const o=document.createElement("option"); o.value="Heavy Deposit"; o.textContent="Heavy Deposit"; s?.appendChild(o);
  }
}
function fill(p){
  ensureHeavyDepositOption();
  ["title","area","price","deposit","size","desc","phone"].forEach(k=>{ if($(k)) $(k).value=p[k]??p.description??""; });
  if($("desc")) $("desc").value=p.description||p.desc||"";
  if($("type")) $("type").value=p.type||p.listingType||"Rent";
  $("submit").textContent="Save Changes";
  editingId=String(p.id||p.propertyId||"");
  if(window.showScreen) window.showScreen("post"); else { document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active")); $("post")?.classList.add("active"); }
  window.scrollTo({top:0,behavior:"smooth"});
}
function collect(old){
  return {...old,id:editingId||old.id||String(Date.now()),title:$("title")?.value.trim()||old.title||"",area:$("area")?.value.trim()||old.area||"",type:$("type")?.value||old.type||"Rent",listingType:$("type")?.value||old.listingType||"Rent",price:$("price")?.value.trim()||"",deposit:$("deposit")?.value.trim()||"",size:$("size")?.value.trim()||"",description:$("desc")?.value.trim()||"",phone:$("phone")?.value.trim()||old.phone||"",brokerUid:old.brokerUid||uid,status:old.status||"Available",updatedAt:Date.now()};
}
async function saveEdit(e){
  if(!editingId) return;
  e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
  const arr=read(); const i=arr.findIndex(p=>String(p.id||p.propertyId)===editingId); if(i<0){ editingId=""; return; }
  const updated=collect(arr[i]); arr[i]=updated; save(arr);
  if(uid && updated.brokerUid===uid){ try { await setDoc(doc(db,"properties",editingId),updated,{merge:true}); } catch(err){ console.warn("Realynk edit sync failed",err); } }
  editingId=""; $("submit").textContent="Submit Property"; alert("Property updated successfully.");
  document.querySelector('[data-back="home"]')?.click();
  window.dispatchEvent(new Event("realynkPropertyChanged"));
}
async function status(id,status){
  const arr=read(); const i=arr.findIndex(p=>String(p.id||p.propertyId)===String(id)); if(i<0)return;
  const p=arr[i]; if(!mine(p))return;
  p.status=status; p.availability=status; p.updatedAt=Date.now(); arr[i]=p; save(arr);
  if(uid && p.brokerUid===uid){ try{await setDoc(doc(db,"properties",String(id)),p,{merge:true});}catch(e){console.warn(e);} }
  renderManage(); window.dispatchEvent(new Event("realynkPropertyChanged"));
}
async function remove(id){
  const arr=read(); const p=arr.find(x=>String(x.id||x.propertyId)===String(id)); if(!p||!mine(p))return;
  if(!confirm("Delete this property permanently?"))return;
  save(arr.filter(x=>String(x.id||x.propertyId)!==String(id)));
  if(uid && p.brokerUid===uid){ try{await deleteDoc(doc(db,"properties",String(id)));}catch(e){console.warn(e);} }
  renderManage(); window.dispatchEvent(new Event("realynkPropertyChanged"));
}
function renderManage(){
  const dash=$("dashboard"); if(!dash)return;
  let box=$("propertyManager"); if(!box){box=document.createElement("div");box.id="propertyManager";box.className="panel";dash.querySelector(".page")?.appendChild(box);}
  const list=read().filter(mine);
  box.innerHTML=`<h3 style="margin:0 0 12px;color:#0b3768">Manage My Properties</h3>`+(list.length?list.map(p=>{const id=String(p.id||p.propertyId);const type=p.type||p.listingType||"";const st=p.status||"Available";return `<div class="panel" style="margin:10px 0"><b>${esc(p.title||"Property")}</b><div class="small">${esc(type)} • ${esc(p.area||"")} • ${esc(p.price||"")}</div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px"><button class="back" data-edit-prop="${esc(id)}">✏️ Edit</button><button class="back" data-status-prop="${esc(id)}" data-status="${st==='Available'?'Sold Out':'Available'}">${st==='Available'?'🔴 Sold Out':'🟢 Available'}</button>${type==='Rent'?`<button class="back" data-status-prop="${esc(id)}" data-status="Rented Out">🔴 Rented Out</button>`:''}<button class="back" data-delete-prop="${esc(id)}">🗑️ Delete</button></div><span class="badge ${st!=='Available'?'pending':''}">${esc(st)}</span></div>`}).join(""):`<div class="empty">No properties posted by this account yet.</div>`;
}
function bind(){
  ensureHeavyDepositOption(); renderManage();
  document.addEventListener("click",e=>{
    const ed=e.target.closest?.("[data-edit-prop]"); if(ed){const p=read().find(x=>String(x.id||x.propertyId)===ed.dataset.editProp);if(p&&mine(p)){e.preventDefault();fill(p);}return;}
    const st=e.target.closest?.("[data-status-prop]"); if(st){e.preventDefault();status(st.dataset.statusProp,st.dataset.status);return;}
    const del=e.target.closest?.("[data-delete-prop]"); if(del){e.preventDefault();remove(del.dataset.deleteProp);return;}
  },true);
  const submit=$("submit"); if(submit)submit.addEventListener("click",saveEdit,true);
  window.addEventListener("realynkPropertyChanged",renderManage);
  setInterval(renderManage,2500);
}
onAuthStateChanged(auth,u=>{uid=u?.uid||""; renderManage();});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
