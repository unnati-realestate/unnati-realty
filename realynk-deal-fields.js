/* REALYNK CATEGORY DETAILS V5 — final Buy/Rent/Sale/Commercial/Heavy Deposit form fields */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
(function(){
'use strict';
if(window.__REALYNK_DEAL_FIELDS_V5__)return;window.__REALYNK_DEAL_FIELDS_V5__=true;
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),KEY='realynkPendingDealFieldsV5';
const $=id=>document.getElementById(id);
const val=id=>($(id)?.value||'').trim();
function addFieldAfter(anchorId,id,label,placeholder){
  if($(id))return $(id).closest('.field');
  const a=$(anchorId); if(!a||!a.closest('.field'))return null;
  const f=document.createElement('div'); f.className='field'; f.id=id+'Field';
  f.innerHTML='<label>'+label+'</label><input id="'+id+'" placeholder="'+placeholder+'">';
  a.closest('.field').insertAdjacentElement('afterend',f); return f;
}
function addSelectAfter(anchorId,id,label,options){
  if($(id))return $(id).closest('.field');
  const a=$(anchorId); if(!a||!a.closest('.field'))return null;
  const f=document.createElement('div'); f.className='field'; f.id=id+'Field';
  const l=document.createElement('label'); l.textContent=label; f.appendChild(l);
  const s=document.createElement('select'); s.id=id;
  options.forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;s.appendChild(o)});
  f.appendChild(s); a.closest('.field').insertAdjacentElement('afterend',f); return f;
}
function option(value,label){
  const t=$('type'); if(!t)return;
  if(!Array.from(t.options).some(o=>o.value===value)){const o=document.createElement('option');o.value=value;o.textContent=label;t.appendChild(o)}
}
function setup(){
  const t=$('type'),price=$('price'); if(!t||!price)return;
  option('Heavy Deposit','💰 Heavy Deposit');
  const pf=price.closest('.field');
  addSelectAfter('title','propertyType','Property Type',['Select','1 RK','1 BHK','2 BHK','3 BHK','4 BHK','Villa','Bungalow','Plot','Other']);
  addSelectAfter('propertyType','commercialDeal','Commercial Purpose',['For Sale','For Rent']);
  addFieldAfter('size','floor','Floor','e.g. 8');
  addFieldAfter('floor','totalFloors','Total Floors','e.g. 22');
  addSelectAfter('totalFloors','furnishing','Furnishing',['Select','Unfurnished','Semi-Furnished','Fully Furnished']);
  addSelectAfter('furnishing','parking','Parking',['Select','No Parking','Open Parking','Covered Parking','Covered + Open Parking']);
  addSelectAfter('parking','facing','Facing',['Select','East','West','North','South','North-East','North-West','South-East','South-West']);
  addFieldAfter('facing','availability','Possession / Available From','Ready to Move / Oct 2026');
  addFieldAfter('price','finalPrice','Final Price','₹80,00,000 (Negotiable)');
  addFieldAfter('deposit','maintenanceRent','Monthly Maintenance / Rent','₹6,000 / month');
  const sizeF=$('sizeField'), sizeL=sizeF?.querySelector('label'), finalF=$('finalPriceField'), maintF=$('maintenanceRentField'), dealF=$('commercialDealField');
  const depositF=$('depositField'), depositL=depositF?.querySelector('label'), priceL=pf.querySelector('label');
  function sync(){
    const v=t.value, isRent=v==='Rent', isHeavy=v==='Heavy Deposit', isCommercial=v==='Commercial', isSale=v==='Sale', isBuy=v==='Buy';
    if(priceL)priceL.textContent=isRent?'Rent':isHeavy?'Heavy Deposit':'Price';
    price.placeholder=isRent?'₹25,000 / month':isHeavy?'₹16,00,000':'₹85,00,000';
    if(depositF){depositF.style.display=isRent?'block':'none';if(depositL)depositL.textContent='Security Deposit'}
    if(maintF)maintF.style.display=isHeavy?'block':'none';
    if(finalF)finalF.style.display=isSale||isCommercial?'block':'none';
    if(dealF)dealF.style.display=isCommercial?'block':'none';
    if(sizeF){sizeF.style.display='block';if(sizeL)sizeL.textContent='Carpet Area'}
    ['floorField','totalFloorsField','furnishingField','parkingField','facingField','availabilityField'].forEach(id=>{const e=$(id);if(e)e.style.display='block'});
    if(isCommercial){
      const pt=$('propertyType');
      if(pt){
        const current=pt.value;
        const opts=['Select','Shop','Office','Showroom','Warehouse / Godown','Industrial Property','Land','Plot','Hotel / Guest House','Other'];
        pt.innerHTML='';opts.forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;pt.appendChild(o)});
        if(opts.includes(current))pt.value=current;
      }
      if(sizeL)sizeL.textContent='Carpet Area / Area';
      $('facingField')?.style.setProperty('display','none');
    }else{
      const pt=$('propertyType');
      if(pt){
        const current=pt.value;
        const opts=['Select','1 RK','1 BHK','2 BHK','3 BHK','4 BHK','Villa','Bungalow','Other'];
        pt.innerHTML='';opts.forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;pt.appendChild(o)});
        if(opts.includes(current))pt.value=current; else pt.value='Select';
      }
    }
    if(isHeavy){ if(sizeL)sizeL.textContent='Carpet Area'; }
  }
  t.addEventListener('change',sync,true); sync();
}
function savePending(){
  const t=$('type');if(!t)return;
  const payload={type:t.value,propertyType:val('propertyType'),commercialDeal:val('commercialDeal'),finalPrice:val('finalPrice'),maintenanceRent:val('maintenanceRent'),floor:val('floor'),totalFloors:val('totalFloors'),furnishing:val('furnishing'),parking:val('parking'),facing:val('facing'),availability:val('availability'),editId:window.__editId||null,title:val('title'),area:val('area'),savedAt:Date.now()};
  try{localStorage.setItem(KEY,JSON.stringify(payload))}catch(e){}
}
function clearPending(){try{localStorage.removeItem(KEY)}catch(e){}}
function addDetail(card,label,value){
  if(!value||value==='Select')return; const box=card.querySelector('.details');if(!box)return;
  let d=Array.from(box.querySelectorAll('.detail')).find(x=>x.querySelector('span')?.textContent===label);
  if(!d){d=document.createElement('div');d.className='detail';d.innerHTML='<span>'+label+'</span><b></b>';box.appendChild(d)}
  d.querySelector('b').textContent=value;
}
function decorate(raw){
  document.querySelectorAll('#homeList .property,#myList .property').forEach(card=>{
    if(raw.propertyType&&raw.propertyType!=='Select')addDetail(card,'PROPERTY TYPE',raw.propertyType);
    if(raw.type==='Commercial'&&raw.commercialDeal)addDetail(card,'SALE / RENT',raw.commercialDeal);
    if((raw.type==='Sale'||raw.type==='Commercial')&&raw.finalPrice)addDetail(card,'FINAL PRICE',raw.finalPrice);
    if(raw.type==='Heavy Deposit'&&raw.maintenanceRent)addDetail(card,'MONTHLY MAINTENANCE / RENT',raw.maintenanceRent);
    if(raw.floor)addDetail(card,'FLOOR',raw.floor);
    if(raw.totalFloors)addDetail(card,'TOTAL FLOORS',raw.totalFloors);
    if(raw.furnishing&&raw.furnishing!=='Select')addDetail(card,'FURNISHING',raw.furnishing);
    if(raw.parking&&raw.parking!=='Select')addDetail(card,'PARKING',raw.parking);
    if(raw.facing&&raw.facing!=='Select'&&raw.type!=='Commercial')addDetail(card,'FACING',raw.facing);
    if(raw.availability)addDetail(card,'POSSESSION / AVAILABLE',raw.availability);
  });
}
async function persist(raw,uid){
  if(!uid||!raw)return false;
  try{
    let target=raw.editId||null;
    if(!target){
      const snap=await new Promise(resolve=>{let off=null;off=onSnapshot(collection(db,'properties'),s=>{off&&off();resolve(s)},()=>{off&&off();resolve(null)})});
      if(snap){let best=null;snap.forEach(d=>{const p=d.data()||{};if(String(p.brokerUid||'')!==String(uid)||String(p.title||'').trim()!==raw.title||String(p.area||'').trim()!==raw.area)return;const ts=p.createdAt?.toMillis?p.createdAt.toMillis():0;if(!best||ts>(best.ts||0))best={id:d.id,ts}});target=best?.id||null}
    }
    if(!target)return false;
    const patch={propertyType:raw.propertyType||'',commercialDeal:raw.type==='Commercial'?raw.commercialDeal||'':'',finalPrice:(raw.type==='Sale'||raw.type==='Commercial')?raw.finalPrice||'':'',maintenanceRent:raw.type==='Heavy Deposit'?raw.maintenanceRent||'':'',floor:raw.floor||'',totalFloors:raw.totalFloors||'',furnishing:raw.furnishing||'',parking:raw.parking||'',facing:raw.type==='Commercial'?'':raw.facing||'',availability:raw.availability||''};
    await updateDoc(doc(db,'properties',String(target)),patch);decorate(raw);clearPending();return true;
  }catch(e){console.warn('Realynk category detail sync failed',e);decorate(raw);return false}
}
function watch(){
  onAuthStateChanged(auth,u=>{if(!u||u.isAnonymous)return;let last='';
    setInterval(async()=>{let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
      if(!raw||!raw.savedAt||Date.now()-raw.savedAt>120000||String(raw.savedAt)===last)return;last=String(raw.savedAt);
      decorate(raw);await new Promise(r=>setTimeout(r,900));await persist(raw,u.uid);
    },500);
  });
}
document.addEventListener('click',e=>{if(e.target.closest('#submit'))savePending()},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{setup();watch()},120),{once:true});else setTimeout(()=>{setup();watch()},120);
})();