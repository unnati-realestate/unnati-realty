/* REALYNK BULK PROPERTY POST V1 — WhatsApp-style text parser + preview + batch posting */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

(function(){
'use strict';
if(window.__REALYNK_BULK_PROPERTY_POST_V1__)return;
window.__REALYNK_BULK_PROPERTY_POST_V1__=true;

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app),db=getFirestore(app),ADMIN='seagullairexpress@gmail.com';
const $=id=>document.getElementById(id);
const clean=v=>String(v||'').trim();
const digits=v=>String(v||'').replace(/\D/g,'');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=[];

function inferType(text){
 const s=text.toLowerCase();
 if(/\b(rent|rental|for rent|lease)\b/.test(s))return 'Rent';
 if(/\b(commercial|shop|office|warehouse|showroom|industrial|godown)\b/.test(s))return 'Commercial';
 if(/\b(buy|purchase)\b/.test(s))return 'Buy';
 return 'Sale';
}
function propertyType(text){
 const s=text.toUpperCase().replace(/-/g,' ');
 const m=s.match(/\b(4\s*BHK|3\s*BHK|2\s*BHK|1\s*BHK|1\s*RK|4\s*RK|3\s*RK|2\s*RK)\b/);
 if(m)return m[1].replace(/\s+/g,' ');
 if(/\bVILLA\b/.test(s))return 'Villa';
 if(/\bBUNGALOW\b/.test(s))return 'Bungalow';
 if(/\bSHOP\b/.test(s))return 'Shop';
 if(/\bOFFICE\b/.test(s))return 'Office';
 if(/\bSHOWROOM\b/.test(s))return 'Showroom';
 if(/\bWAREHOUSE|GODOWN\b/.test(s))return 'Warehouse / Godown';
 return '';
}
function priceLine(lines){
 return lines.find(x=>/₹|rs\.?\s*\d|\b\d+(?:\.\d+)?\s*(?:lac|lakh|crore|cr)\b/i.test(x))||'';
}
function parse(text){
 const raw=String(text||'').replace(/\r/g,'').trim();
 if(!raw)return [];
 let blocks=raw.split(/(?=^\s*(?:🔹|🔷|🔸|▪️)\s*)/m).map(x=>x.trim()).filter(Boolean);
 if(blocks.length===1){
   blocks=raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(x=>/₹|lac|lakh|crore/i.test(x));
 }
 const heading=(raw.match(/^\s*[^\n]*(?:SALE|RENT|BUY|COMMERCIAL)[^\n]*$/im)||[])[0]||'';
 const headerNorm=s=>s.replace(/[🏡🏠🏢🏘️🏷️💰📞📱🔹🔷🔸▪️•*_-]/gu,'').replace(/\s+/g,' ').trim().toLowerCase();
 const headingNorm=headerNorm(heading);
 blocks=blocks.filter(b=>headerNorm(b.split('\n')[0])!==headingNorm);
 return blocks.map((block,i)=>{
   const lines=block.split('\n').map(x=>x.trim()).filter(Boolean);
   let title=(lines[0]||'Property '+(i+1)).replace(/^[🔹🔷🔸▪️•*]\s*/u,'').trim();
   const body=lines.slice(1);
   const p=priceLine(lines);
   if(/^(?:🏡|🏠)?\s*flats?\s+for\s+(?:sale|rent)|^properties?\s+for\s+(?:sale|rent)/i.test(title)) return null;
   let area='';
   const dash=title.match(/\s[–—-]\s(.+)$/);
   if(dash){area=dash[1].trim();title=title.replace(/\s[–—-]\s(.+)$/,'').trim();}
   const desc=body.filter(x=>x!==p).map(x=>x.replace(/^[-•*]\s*/,'').trim()).filter(Boolean).join(' • ');
   return {title,area,type:inferType(heading+' '+block),propertyType:propertyType(block),price:p.replace(/^[•*💰💵💸🤑\s]+/u,'').trim(),description:desc};
 }).filter(Boolean).filter(x=>x.title);
}
function css(){
 if($('realynkBulkPropertyCSS'))return;
 const s=document.createElement('style');s.id='realynkBulkPropertyCSS';
 s.textContent='.rbp-btn{width:100%;margin-top:10px;padding:13px;border:1px solid #0b3768;border-radius:11px;background:#fff;color:#0b3768;font-weight:800;cursor:pointer}.rbp-modal{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px}.rbp-box{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}.rbp-box h3{margin:0 0 6px;color:#0b3768}.rbp-muted{color:#6b7a8c;font-size:13px}.rbp-area{width:100%;min-height:170px;border:1px solid #cfd9e5;border-radius:12px;padding:12px;font-size:15px}.rbp-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.rbp-card{border:1px solid #dfe6ee;border-radius:13px;padding:12px;margin:10px 0}.rbp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rbp-grid input,.rbp-grid select,.rbp-card textarea{width:100%;padding:10px;border:1px solid #cfd9e5;border-radius:9px}.rbp-card textarea{min-height:65px;margin-top:8px}.rbp-danger{background:#fff1f0!important;color:#b42318!important;border-color:#f0b4ae!important;width:auto!important;display:inline-block!important;padding:7px 12px!important;margin-top:8px!important;font-size:12px!important;border-radius:8px!important}@media(max-width:560px){.rbp-grid{grid-template-columns:1fr}}';
 document.head.appendChild(s);
}
function modal(){
 if($('rbpModal'))return;
 const m=document.createElement('div');m.id='rbpModal';m.className='rbp-modal';
 m.innerHTML='<div class="rbp-box"><h3>📋 Bulk Property Post</h3><div class="rbp-muted">WhatsApp/group में भेजा हुआ पूरा property message यहाँ paste करें.</div><textarea id="rbpText" class="rbp-area" placeholder="🏡 FLATS FOR SALE..."></textarea><div id="rbpPreview"></div><div class="rbp-actions"><button id="rbpClose" class="back" type="button">Close</button><button id="rbpParse" class="primary" type="button">Preview Properties</button></div></div>';
 document.body.appendChild(m);
 $('rbpClose').onclick=()=>m.remove();
 $('rbpParse').onclick=()=>renderPreview(parse($('rbpText').value));
}
function renderPreview(list){
 items=list;
 const box=$('rbpPreview');if(!box)return;
 if(!list.length){box.innerHTML='<p class="rbp-muted">कोई अलग property block नहीं मिला. हर property को 🔹 से शुरू करना सबसे अच्छा रहेगा.</p>';return;}
 box.innerHTML='<h4>'+list.length+' Properties Found</h4>'+list.map((p,i)=>'<div class="rbp-card"><b>Property '+(i+1)+'</b><div class="rbp-grid" style="margin-top:8px"><input data-rbp="title" data-i="'+i+'" value="'+esc(p.title)+'" placeholder="Title"><input data-rbp="area" data-i="'+i+'" value="'+esc(p.area)+'" placeholder="Location"><select data-rbp="type" data-i="'+i+'">'+['Buy','Sale','Rent','Commercial','Heavy Deposit'].map(x=>'<option '+(p.type===x?'selected':'')+'>'+x+'</option>').join('')+'</select><input data-rbp="propertyType" data-i="'+i+'" value="'+esc(p.propertyType)+'" placeholder="Property Type"></div><input data-rbp="price" data-i="'+i+'" value="'+esc(p.price)+'" placeholder="Price / Rent" style="width:100%;margin-top:8px;padding:10px;border:1px solid #cfd9e5;border-radius:9px"><textarea data-rbp="description" data-i="'+i+'" placeholder="Description">'+esc(p.description)+'</textarea><button class="rbp-btn rbp-danger" data-remove="'+i+'" type="button">🗑️ Remove</button></div>').join('')+
 '<div class="rbp-actions"><button id="rbpBack" class="back" type="button">← Edit Message</button><button id="rbpPost" class="primary" type="button">Post All '+list.length+' Properties</button></div>';
 box.querySelectorAll('[data-rbp]').forEach(el=>el.addEventListener('input',()=>{items[Number(el.dataset.i)][el.dataset.rbp]=el.value}));
 box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{items.splice(Number(b.dataset.remove),1);renderPreview(items)});
 $('rbpBack').onclick=()=>{$('rbpPreview').innerHTML='';$('rbpText').focus()};
 $('rbpPost').onclick=postAll;
}
function waitUser(){
 return new Promise(resolve=>{
  if(auth.currentUser&&!auth.currentUser.isAnonymous)return resolve(auth.currentUser);
  const off=onAuthStateChanged(auth,u=>{if(u&&!u.isAnonymous){off();resolve(u)}});
  setTimeout(()=>{try{off()}catch(_){ }resolve(null)},8000);
 });
}
async function postAll(){
 if(!items.length){alert('Please add at least one property.');return;}
 const u=await waitUser();if(!u){alert('Please sign in to your Broker Account first.');return;}
 const prof=(()=>{try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')}catch(_){return{}}})();
 if(!prof.agentName){alert('Please create your Broker Account first.');return;}
 const isAdmin=String(u.email||prof.agentEmail||'').toLowerCase()===ADMIN;
 let count=0;
 try{const snap=await getDocs(query(collection(db,'properties'),where('brokerUid','==',u.uid)));snap.forEach(d=>{if(String(d.data()?.status||'').toLowerCase()!=='deleted')count++})}catch(e){alert('Properties count could not be checked. Please try again.');return;}
 const limit=isAdmin?Infinity:(window.realynkPlans?.effectiveLimit?window.realynkPlans.effectiveLimit():10);
 if(!isAdmin && count+items.length>limit){alert('Aapki posting limit '+limit+' hai. Abhi '+count+' listings hain aur '+items.length+' properties post karni hain. '+Math.max(0,count+items.length-limit)+' properties limit se bahar hain.');return;}
 const batch=writeBatch(db), now=Date.now(), brokerEmail=u.email||prof.agentEmail||'', brokerPhone=digits(prof.accountPhone||prof.phone||'');
 items.forEach((p,i)=>{
   const id=String(now+i)+'-bulk-'+Math.random().toString(36).slice(2,6);
   const ref=doc(db,'properties',id);
   batch.set(ref,{id,title:clean(p.title)||'Property '+(i+1),area:clean(p.area),type:p.type||'Sale',propertyType:clean(p.propertyType),price:clean(p.price),deposit:'',size:'',description:clean(p.description),phone:digits(prof.accountPhone||prof.phone||'9658364364'),brokerUid:u.uid,brokerName:u.displayName||prof.agentName,brokerPhone,brokerEmail,brokerKey:digits(brokerPhone)||brokerEmail.toLowerCase(),status:'active',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),bulkPosted:true});
 });
 const btn=$('rbpPost');if(btn){btn.disabled=true;btn.textContent='Posting...';}
 try{
   await batch.commit();
   alert(items.length+' properties successfully posted to ReaLynk.');
   $('rbpModal')?.remove();
   window.dispatchEvent(new Event('realynkCloudPropertiesChanged'));
   document.querySelector('[data-nav="dashboard"]')?.click();
 }catch(e){console.error(e);alert(String(e?.code||'').includes('permission')?'Firebase permission blocked bulk posting.':'Bulk posting failed. Please try again.');if(btn){btn.disabled=false;btn.textContent='Post All Properties';}}
}
function install(){
 css();
 const home=$('bulkPostProperty');
 if(home&&!home.dataset.rbpHome){home.dataset.rbpHome='1';home.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();modal() },true)}
 const post=$('submit');
 const old=$('rbpOpen');if(old)old.remove();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,400),{once:true});else setTimeout(install,400);
window.realynkBulkProperty={open:modal,parse};
})();