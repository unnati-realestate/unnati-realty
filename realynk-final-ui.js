import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
let brokers = {};
let properties = [];
let activeFilter = "";

const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const digits = v => String(v || "").replace(/\D/g, "");
const $ = id => document.getElementById(id);

function style(){
  if($('realynk-final-style')) return;
  const s=document.createElement('style'); s.id='realynk-final-style';
  s.textContent=`
  :root{--rn-navy:#082d57;--rn-blue:#155a9c;--rn-gold:#f4b400;--rn-bg:#f5f7fb}
  body{background:var(--rn-bg)!important}.app{max-width:980px!important}
  .top{height:92px!important;padding:8px 22px!important}.logo{width:96px!important;height:82px!important}
  .hero{padding:34px 24px 28px!important;border-radius:0 0 32px 32px!important;background:linear-gradient(135deg,#061f40,#155a9c)!important}
  .hero h1{font-size:40px!important;font-weight:900!important;letter-spacing:-1px}.hero h1 span{color:var(--rn-gold)!important}
  .hero .search{max-width:780px;box-shadow:0 10px 30px rgba(0,0,0,.12)}
  .quick{grid-template-columns:repeat(3,1fr)!important;padding:18px 20px!important;gap:14px!important}
  .quick button{min-height:112px!important;border-radius:18px!important;background:#fff!important;box-shadow:0 4px 16px rgba(8,45,87,.06);font-size:28px!important;transition:.15s}
  .quick button:hover{transform:translateY(-2px);box-shadow:0 9px 22px rgba(8,45,87,.12)}
  .quick button b{font-size:16px!important;margin-top:9px!important}.quick button.active{border:2px solid var(--rn-gold)!important;background:#fffaf0!important}
  .filterBar{margin:0 20px 8px!important;border-radius:14px!important;box-shadow:0 3px 12px rgba(0,0,0,.04)}
  .page h2{font-weight:900!important;color:var(--rn-navy)}
  .property{box-shadow:0 5px 18px rgba(8,45,87,.06)!important;border-radius:18px!important}
  .bottom{width:min(980px,100%)!important;height:78px!important}.bottom button.active{color:var(--rn-gold)!important}
  .rn-broker-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0 20px 10px}
  .rn-benefit{background:#fff;border:1px solid #dfe6ee;border-radius:14px;padding:12px;text-align:center}.rn-benefit b{display:block;color:var(--rn-navy);font-size:14px}.rn-benefit span{font-size:11px;color:#6b7a8c}
  @media(max-width:620px){.hero h1{font-size:31px!important}.quick{grid-template-columns:1fr 1fr!important;padding:12px!important}.quick button{min-height:94px!important}.top{padding:7px 12px!important}.logo{width:86px!important;height:76px!important}.rn-broker-strip{grid-template-columns:repeat(2,1fr);margin:0 12px 8px}}
  `; document.head.appendChild(s);
}

function ensureHeavy(){
  const q=document.querySelector('.quick'); if(!q)return;
  let b=$('heavyDeposit');
  if(!b){b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='🔐<b>Heavy Deposit</b>';q.insertBefore(b,$('postQuick')||null);}
}

function benefits(){
  const home=$('home'); if(!home || $('rnBenefitStrip'))return;
  const strip=document.createElement('div'); strip.id='rnBenefitStrip'; strip.className='rn-broker-strip';
  strip.innerHTML='<div class="rn-benefit"><b>✓ Verified Brokers</b><span>Trusted network</span></div><div class="rn-benefit"><b>🤝 Broker Network</b><span>Share inventory</span></div><div class="rn-benefit"><b>🏠 Shared Properties</b><span>Find client matches</span></div><div class="rn-benefit"><b>💬 Call & WhatsApp</b><span>Close deals together</span></div>';
  const q=home.querySelector('.quick'); if(q)q.insertAdjacentElement('afterend',strip);
}

function visibleProperties(){return properties.filter(p=>{const b=brokers[p.brokerUid]||{};return b.approved===true || (p.brokerUid && !Object.keys(brokers).length);});}

function render(filter=''){
  activeFilter=filter||'';
  const out=$('homeList'); if(!out)return;
  const q=($('search')?.value||'').trim().toLowerCase();
  let list=visibleProperties();
  if(filter) list=list.filter(p=>String(p.type||'').toLowerCase()===filter.toLowerCase());
  if(q) list=list.filter(p=>[p.title,p.area,p.description,p.type,p.brokerName].join(' ').toLowerCase().includes(q));
  const bar=$('filterBar'), title=$('filterTitle');
  if(bar)bar.style.display=filter?'flex':'none'; if(title)title.textContent=filter?filter+' Properties':'';
  if(!list.length){out.innerHTML='<div class="panel empty">No '+esc(filter||'')+' properties found yet.</div>';return;}
  out.innerHTML=list.map(p=>{
    const b=brokers[p.brokerUid]||{}; const phone=digits(p.phone||b.phone); const photos=Array.isArray(p.photoUrls)?p.photoUrls:[];
    return `<div class="panel property"><h3>${esc(p.title||'Property')}</h3><div class="rn-muted">📍 ${esc(p.area||p.location||'Location not specified')}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type||'')}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||'On Request')}</b></div></div>${p.deposit?`<div class="rn-muted" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>`:''}${p.size?`<div class="rn-muted"><b>Area:</b> ${esc(p.size)}</div>`:''}${p.description?`<p>${esc(p.description)}</p>`:''}${photos.length?`<div class="listingMedia">${photos.slice(0,10).map(u=>`<img src="${esc(u)}" alt="Property photo">`).join('')}</div>`:''}<div class="badge">Broker: ${esc(b.fullName||p.brokerName||'Realynk Broker')}</div><div class="rn-actions">${phone?`<button type="button" data-call="${phone}">📞 Call Broker</button><button type="button" data-wa="${phone}" data-title="${esc(p.title||'Property')}">💬 WhatsApp</button>`:''}</div></div>`;
  }).join('');
  out.querySelectorAll('[data-call]').forEach(x=>x.onclick=()=>location.href='tel:+91'+x.dataset.call);
  out.querySelectorAll('[data-wa]').forEach(x=>x.onclick=()=>location.href='https://wa.me/91'+x.dataset.wa+'?text='+encodeURIComponent('Hi, I found your property on Realynk: '+x.dataset.title));
}

function category(type){
  document.querySelectorAll('.quick button').forEach(b=>b.classList.remove('active'));
  const id=type.toLowerCase().replace(' ',''); $(id==='heavydeposit'?'heavyDeposit':id)?.classList.add('active');
  render(type); setTimeout(()=>$('homeList')?.scrollIntoView({behavior:'smooth',block:'start'}),60);
}

function wire(){
  const map={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit'};
  Object.entries(map).forEach(([id,type])=>{
    const el=$(id); if(!el || el.dataset.rnFinal==='1')return; el.dataset.rnFinal='1';
    el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();category(type)},true);
  });
  const clear=$('clearFilter'); if(clear && clear.dataset.rnFinal!=='1'){clear.dataset.rnFinal='1';clear.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll('.quick button').forEach(b=>b.classList.remove('active'));render('')},true);}
  const post=$('postQuick'); if(post && post.dataset.rnFinal!=='1'){post.dataset.rnFinal='1';post.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();$('post')?.classList.add('active');$('home')?.classList.remove('active');window.scrollTo(0,0)},true);}
  const search=$('search'); if(search && search.dataset.rnFinal!=='1'){search.dataset.rnFinal='1';search.addEventListener('input',()=>render(activeFilter));}
}

function listen(){
  onSnapshot(collection(db,'brokers'),snap=>{brokers={};snap.forEach(d=>brokers[d.id]=d.data());});
  onSnapshot(collection(db,'properties'),snap=>{properties=[];snap.forEach(d=>properties.push({...d.data(),id:d.id}));});
}

function start(){style();ensureHeavy();benefits();wire();setTimeout(()=>{ensureHeavy();wire();benefits();},600);setTimeout(wire,1600);listen();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
