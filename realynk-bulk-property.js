/* REALYNK BULK PROPERTY POST V2 — stable WhatsApp/group parser + batch posting */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

(function(){
'use strict';
if(window.__REALYNK_BULK_PROPERTY_POST_V2__) return;
window.__REALYNK_BULK_PROPERTY_POST_V2__=true;

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const auth=getAuth(app), db=getFirestore(app), ADMIN='seagullairexpress@gmail.com';
const $=id=>document.getElementById(id);
const clean=v=>String(v??'').trim();
const digits=v=>String(v??'').replace(/\D/g,'');
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let items=[];

function inferType(text){
 const s=String(text||'').toLowerCase();
 if(/\b(heavy\s*deposit|heavy\s*deposit\s*property)\b/.test(s)) return 'Heavy Deposit';
 if(/\b(for\s+rent|rent|rental|lease|monthly\s+rent)\b/.test(s)) return 'Rent';
 if(/\b(commercial|shop|office|warehouse|showroom|industrial|godown|plot|land)\b/.test(s)) return 'Commercial';
 if(/\b(for\s+sale|sale|sell|selling|asking)\b/.test(s)) return 'Sale';
 if(/\b(buy|purchase)\b/.test(s)) return 'Buy';
 return 'Sale';
}
function propertyType(text){
 const s=String(text||'').toUpperCase().replace(/-/g,' ');
 const m=s.match(/\b(4\s*BHK|3\s*BHK|2\s*BHK|1\s*BHK|4\s*RK|3\s*RK|2\s*RK|1\s*RK)\b/);
 if(m) return m[1].replace(/\s+/g,' ');
 if(/\bVILLA\b/.test(s)) return 'Villa';
 if(/\bBUNGALOW\b/.test(s)) return 'Bungalow';
 if(/\bSHOP\b/.test(s)) return 'Shop';
 if(/\bOFFICE\b/.test(s)) return 'Office';
 if(/\bSHOWROOM\b/.test(s)) return 'Showroom';
 if(/\bWAREHOUSE|GODOWN\b/.test(s)) return 'Warehouse / Godown';
 if(/\bPLOT\b/.test(s)) return 'Plot';
 if(/\bLAND\b/.test(s)) return 'Land';
 return '';
}
function priceLine(lines){
 return lines.find(x=>/₹|rs\.?\s*\d|\b\d+(?:\.\d+)?\s*(?:lac|lakh|crore|cr)\b/i.test(x))||'';
}
function normalizeHeader(s){
 return String(s||'').replace(/[🏡🏠🏢🏘️🏷️💰📞📱🔹🔷🔸▪️•*_-]/gu,'').replace(/\s+/g,' ').trim().toLowerCase();
}
function parse(text){
 const raw=String(text||'').replace(/\r/g,'').trim();
 if(!raw) return [];

 const phoneMatch=(raw.match(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/)||[])[0]||'';
 const firmMatch=(raw.match(/(?:UNNATI\s+REALTY|JUDGE\s+PROPERTIES|[A-Z][A-Z &.-]{2,40}\s+PROPERTIES)/i)||[])[0]||'';
 const heading=(raw.match(/^\s*[^\n]*(?:SALE|RENT|BUY|COMMERCIAL|HEAVY\s*DEPOSIT)[^\n]*$/im)||[])[0]||'';

 let blocks=[];
 const rawLines=raw.split('\n').map(x=>x.trim()).filter(Boolean);
 let current='';
 for(const line of rawLines){
   if(/^[🔥🔹🔷🔸▪️💥🏠🏡]\s*/u.test(line)){
     if(current) blocks.push(current.trim());
     current=line;
   }else if(current){
     // Keep continuation/details lines with the current property.
     // Footer/contact lines are removed later.
     current+='\n'+line;
   }
 }
 if(current) blocks.push(current.trim());
 if(!blocks.length){
   blocks=raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean);
 }
 
 blocks=blocks.filter(b=>{
   const first=normalizeHeader(b.split('\n')[0]);
   return !/^mira\s+bhayandar$/i.test(first) &&
     !/^1bhk\s+for\s+rent$/i.test(first) &&
     !/^call\s+for\s+visit$/i.test(first) &&
     !/^unnati\s+realty$/i.test(first) &&
     !/^judge\s+properties$/i.test(first) &&
     !/^balaji\s+estate\s+consultancy$/i.test(first);
 });
 
 function moneyCompact(v){
   const n=Number(String(v||'').replace(/,/g,''));
   return Number.isFinite(n)?Math.round(n).toLocaleString('en-IN'):'';
 }

 function parseRentDeposit(block){
   const s=String(block||'');
   let m=s.match(/(?:₹\s*)?(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|L)?\s*(?:\+1)?\b/i);
   if(m){
     const rentK=Number(m[1]), depLakh=Number(m[2]);
     if(rentK>0 && rentK<1000 && depLakh>=0 && depLakh<1000){
       return {rent:'₹'+moneyCompact(rentK*1000)+'/month',deposit:'₹'+moneyCompact(depLakh*100000),raw:m[0]};
     }
   }
   m=s.match(/(?:₹\s*)?(\d+(?:\.\d+)?)\s*k\s*\/\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/i);
   if(m) return {rent:'₹'+moneyCompact(Number(m[1])*1000)+'/month',deposit:'₹'+moneyCompact(Number(m[2])*100000),raw:m[0]};
   return {rent:'',deposit:'',raw:''};
 }

 function splitTitleLocation(title){
   let t=String(title||'').replace(/^\s*[🔥🔹🔷🔸▪️💥🏠🏡]\s*/u,'').replace(/\s+/g,' ').trim();
   const bhk=t.match(/^((?:\d\s*)?(?:BHK|RK))\b/i);
   if(!bhk) return {title:t,area:''};
   const type=bhk[1].replace(/\s+/g,' ').toUpperCase();
   let rest=t.slice(bhk[0].length).trim();
   const locHints=[
     'Ramdev Park','Golden Nest','Dahisar West','Shanti Garden','Mira Road','Mira Gaon',
     'Bhayandar East','Bhayandar West','Naya Nagar','New Golden Nest','Queens Park',
     'Gaurav City','Gaurav Galaxy','Deepak Hospital','Station Road','Near Station'
   ];
   let found='';
   const low=rest.toLowerCase();
   for(const hint of locHints){
     const idx=low.lastIndexOf(hint.toLowerCase());
     if(idx>0){ found=rest.slice(idx).trim(); rest=rest.slice(0,idx).trim(); break; }
   }
   return {title:rest||type,area:found};
 }

 return blocks.map((block,i)=>{
   // WhatsApp messages often put a city/category heading before the first 🔥 listing.
   // Keep only the actual listing lines when a block contains an emoji-led property.
   let blockLines=block.split('\n').map(x=>x.trim()).filter(Boolean);
   const firstListingIndex=blockLines.findIndex(x=>/^[🔥🔹🔷🔸▪️💥🏠🏡]\s*/u.test(x));
   if(firstListingIndex>0) blockLines=blockLines.slice(firstListingIndex);
   block=blockLines.join('\n');
   const lines=blockLines;
   let first=(lines[0]||('Property '+(i+1))).replace(/^[🔥🔹🔷🔸▪️💥🏠🏡]\s*/u,'').trim();
   if(/^Mira\s+Bhayandar$/i.test(first) || /^1bhk\s+for\s+rent$/i.test(first)) return null;

   const rd=parseRentDeposit(block);
   let price=rd.rent||'';
   let deposit=rd.deposit||'';
   const compactRaw=rd.raw||'';

   if(!price){
     const p=priceLine(lines);
     price=p.replace(/^[•*💰💵💸🤑\s]+/u,'').trim();
   }

   const titleLine=first.replace(compactRaw,'').replace(/\s{2,}/g,' ').trim();
   const split=splitTitleLocation(titleLine);
   const title=split.title, area=split.area;

   const desc=lines.slice(1)
     .filter(x=>!compactRaw || !x.includes(compactRaw))
     .filter(x=>!phoneMatch || digits(x)!==digits(phoneMatch))
     .filter(x=>!firmMatch || normalizeHeader(x)!==normalizeHeader(firmMatch))
     .filter(x=>!/^\s*(?:📞|📱|☎️|Call For Visit)\s*/iu.test(x))
     .map(x=>x.replace(/^[🔥🔹🔷🔸▪️•*]\s*/u,'').trim())
     .filter(Boolean).join(' • ');

   return {
     title,
     area,
     type:rd.rent?'Rent':inferType(block+' '+heading),
     propertyType:propertyType(block),
     price,
     deposit,
     description:desc,
     brokerFirm:clean(firmMatch),
     brokerContact:clean(phoneMatch)
   };
 }).filter(Boolean).filter(x=>x.title);
}
function css(){
 if($('realynkBulkPropertyCSS')) return;
 const s=document.createElement('style');s.id='realynkBulkPropertyCSS';
 s.textContent='.rbp-modal{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:99999;display:flex;align-items:center;justify-content:center;padding:14px}.rbp-box{width:min(760px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}.rbp-box h3{margin:0 0 6px;color:#0b3768}.rbp-muted{color:#6b7a8c;font-size:13px}.rbp-area{width:100%;min-height:170px;border:1px solid #cfd9e5;border-radius:12px;padding:12px;font-size:15px;box-sizing:border-box}.rbp-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.rbp-card{border:1px solid #dfe6ee;border-radius:13px;padding:12px;margin:10px 0}.rbp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rbp-grid input,.rbp-grid select,.rbp-card textarea{width:100%;padding:10px;border:1px solid #cfd9e5;border-radius:9px;box-sizing:border-box}.rbp-card textarea{min-height:65px;margin-top:8px}.rbp-danger{background:#fff1f0!important;color:#b42318!important;border-color:#f0b4ae!important;width:auto!important;padding:7px 12px!important;margin-top:8px!important}.rbp-actions button{min-height:52px!important;padding:12px 16px!important;border-radius:11px!important;border:1px solid #d7e0ea!important;background:#fff!important;color:#0b3768!important;font-size:16px!important;font-weight:800!important;line-height:1.2!important}.rbp-actions button#rbpParse,.rbp-actions button#rbpPost{background:#0b3768!important;color:#fff!important;border-color:#0b3768!important}.rbp-actions button:disabled{opacity:.65;cursor:not-allowed}.rbp-actions button:hover{filter:brightness(.98)}@media(max-width:560px){.rbp-grid{grid-template-columns:1fr}}';
 document.head.appendChild(s);
}
function renderPreview(list){
 items=list;
 const box=$('rbpPreview');if(!box)return;
 if(!list.length){box.innerHTML='<p class="rbp-muted">कोई property नहीं मिली. हर property को 🔹 से शुरू करना सबसे अच्छा रहेगा.</p>';return;}
 box.innerHTML='<h4>'+list.length+' Properties Found</h4>'+list.map((p,i)=>'<div class="rbp-card"><b>Property '+(i+1)+'</b><div class="rbp-grid" style="margin-top:8px"><input data-rbp="title" data-i="'+i+'" value="'+esc(p.title)+'" placeholder="Title"><input data-rbp="area" data-i="'+i+'" value="'+esc(p.area)+'" placeholder="Location"><select data-rbp="type" data-i="'+i+'">'+['Buy','Sale','Rent','Commercial','Heavy Deposit'].map(x=>'<option '+(p.type===x?'selected':'')+'>'+x+'</option>').join('')+'</select><input data-rbp="propertyType" data-i="'+i+'" value="'+esc(p.propertyType)+'" placeholder="Property Type"></div><input data-rbp="price" data-i="'+i+'" value="'+esc(p.price)+'" placeholder="Price / Rent" style="width:100%;margin-top:8px;padding:10px;border:1px solid #cfd9e5;border-radius:9px;box-sizing:border-box"><input data-rbp="deposit" data-i="'+i+'" value="'+esc(p.deposit||'')+'" placeholder="Security Deposit" style="width:100%;margin-top:8px;padding:10px;border:1px solid #cfd9e5;border-radius:9px;box-sizing:border-box"><textarea data-rbp="description" data-i="'+i+'" placeholder="Description">'+esc(p.description)+'</textarea><button class="rbp-danger" data-remove="'+i+'" type="button">🗑️ Remove</button></div>').join('')+'<div class="rbp-actions"><button id="rbpBack" type="button">← Edit Message</button><button id="rbpPost" type="button">Post All '+list.length+' Properties</button></div>';
 box.querySelectorAll('[data-rbp]').forEach(el=>el.addEventListener('input',()=>{items[Number(el.dataset.i)][el.dataset.rbp]=el.value}));
 box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{items.splice(Number(b.dataset.remove),1);renderPreview(items)});
 $('rbpBack').onclick=()=>{box.innerHTML='';$('rbpText')?.focus()};
 $('rbpPost').onclick=postAll;
}
function openModal(){
 if($('rbpModal')) return;
 const m=document.createElement('div');m.id='rbpModal';m.className='rbp-modal';
 m.innerHTML='<div class="rbp-box"><h3>📋 Bulk Property Post</h3><div class="rbp-muted">WhatsApp/group में भेजा हुआ पूरा property message यहाँ paste करें.</div><textarea id="rbpText" class="rbp-area" placeholder="🏡 FLATS FOR SALE..."></textarea><div id="rbpPreview"></div><div class="rbp-actions"><button id="rbpClose" type="button">Close</button><button id="rbpParse" type="button">Preview Properties</button></div></div>';
 document.body.appendChild(m);
 $('rbpClose').onclick=()=>m.remove();
 $('rbpParse').onclick=()=>renderPreview(parse($('rbpText').value));
}
function waitUser(){
 return new Promise(resolve=>{
  if(auth.currentUser&&!auth.currentUser.isAnonymous) return resolve(auth.currentUser);
  let done=false;
  const finish=u=>{if(done)return;done=true;try{off()}catch(_){}resolve(u||null)};
  const off=onAuthStateChanged(auth,u=>{if(u&&!u.isAnonymous)finish(u)});
  setTimeout(()=>finish(null),8000);
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
 if(!isAdmin&&count+items.length>limit){alert('Aapki posting limit '+limit+' hai. Abhi '+count+' listings hain aur '+items.length+' properties post karni hain.');return;}
 const batch=writeBatch(db),now=Date.now(),brokerEmail=u.email||prof.agentEmail||'';
 const profilePhone=digits(prof.accountPhone||prof.phone||'');
 const parsedFirm=clean(items.find(x=>x.brokerFirm)?.brokerFirm);
 const parsedContact=digits(items.find(x=>x.brokerContact)?.brokerContact||'');
 const finalBrokerName=parsedFirm||u.displayName||prof.agentName;
 const finalBrokerPhone=parsedContact||profilePhone;
 items.forEach((p,i)=>{
  const id=String(now+i)+'-bulk-'+Math.random().toString(36).slice(2,6);
  batch.set(doc(db,'properties',id),{id,title:clean(p.title)||'Property '+(i+1),area:clean(p.area),type:p.type||'Sale',propertyType:clean(p.propertyType),price:clean(p.price),deposit:clean(p.deposit),size:'',description:clean(p.description),phone:finalBrokerPhone,brokerUid:u.uid,brokerName:finalBrokerName,brokerPhone:finalBrokerPhone,brokerEmail,brokerKey:digits(finalBrokerPhone)||brokerEmail.toLowerCase(),status:'active',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),bulkPosted:true});
 });
 const btn=$('rbpPost');if(btn){btn.disabled=true;btn.textContent='Posting...';}
 try{await batch.commit();alert(items.length+' properties successfully posted to ReaLynk.');$('rbpModal')?.remove();window.dispatchEvent(new Event('realynkCloudPropertiesChanged'));document.querySelector('[data-nav="dashboard"]')?.click();}
 catch(e){console.error(e);alert(String(e?.code||'').includes('permission')?'Firebase permission blocked bulk posting.':'Bulk posting failed. Please try again.');if(btn){btn.disabled=false;btn.textContent='Post All Properties';}}
}
function install(){
 css();
 const home=$('bulkPostProperty');
 if(home&&!home.dataset.rbpHome){home.dataset.rbpHome='1';home.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openModal();},true);}
}
function boot(){setTimeout(install,250);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.realynkBulkProperty={open:openModal,parse};
})();