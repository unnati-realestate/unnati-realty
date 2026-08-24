/* Realynk owner property management UI */
(function(){
  'use strict';
  const KEY='realynkProperties';
  const read=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};
  const save=a=>{localStorage.setItem(KEY,JSON.stringify(a));window.dispatchEvent(new Event('realynkCloudSync'));};
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(window.__pmToast);window.__pmToast=setTimeout(()=>t.style.display='none',2200);}
  function typeLabel(type){return type||'Rent'}
  function render(){
    const out=document.getElementById('myList');
    if(!out)return;
    const a=read().filter(p=>p.mine);
    const h='<h3 class="pm-heading">Manage My Properties</h3>';
    if(!a.length){out.innerHTML=h+'<div class="panel empty">Your posted properties will appear here.</div>';return;}
    out.innerHTML=h+a.map((p,i)=>{
      const status=p.status||'Available';
      const closed=status==='Sold Out'||status==='Rented Out';
      const action=String(p.type||'').toLowerCase()==='rent'?'Rented Out':'Sold Out';
      return `<div class="panel property pm-card" data-pm-index="${i}"><h3>${esc(p.title||'Property')}</h3><div>📍 ${esc(p.area||'Location not specified')}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(typeLabel(p.type))}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price||'On Request')}</b></div></div>${p.deposit?`<div class="pm-line"><b>Deposit:</b> ${esc(p.deposit)}</div>`:''}<div class="pm-status ${closed?'pm-closed':'pm-open'}">${esc(status)}</div><div class="pm-actions"><button type="button" data-pm-edit="${i}">✏️ Edit</button><button type="button" data-pm-status="${i}">${closed?'🟢 Mark Available':(action==='Rented Out'?'🔴 Rented Out':'🔴 Sold Out')}</button><button type="button" class="pm-delete" data-pm-delete="${i}">🗑️ Delete</button></div></div>`;
    }).join('');
    out.querySelectorAll('[data-pm-edit]').forEach(b=>b.onclick=()=>edit(Number(b.dataset.pmEdit)));
    out.querySelectorAll('[data-pm-status]').forEach(b=>b.onclick=()=>changeStatus(Number(b.dataset.pmStatus)));
    out.querySelectorAll('[data-pm-delete]').forEach(b=>b.onclick=()=>remove(Number(b.dataset.pmDelete)));
  }
  function edit(i){
    const a=read().filter(p=>p.mine),p=a[i];if(!p)return;
    const all=read(),realIndex=all.findIndex(x=>x.id===p.id);if(realIndex<0)return;
    const title=prompt('Property Title',p.title||'');if(title===null)return;
    const area=prompt('Area / Location',p.area||'');if(area===null)return;
    const type=prompt('Type: Buy / Sale / Rent / Commercial / Heavy Deposit',p.type||'Rent');if(type===null)return;
    const price=prompt('Price / Rent',p.price||'');if(price===null)return;
    const deposit=prompt('Deposit',p.deposit||'');if(deposit===null)return;
    const desc=prompt('Description',p.desc||p.description||'');if(desc===null)return;
    all[realIndex]={...p,title,area,type,price,deposit,desc,description:desc};save(all);render();toast('Property updated successfully');
  }
  function changeStatus(i){
    const mine=read().filter(p=>p.mine),p=mine[i];if(!p)return;
    const all=read(),idx=all.findIndex(x=>x.id===p.id);if(idx<0)return;
    const closed=p.status==='Sold Out'||p.status==='Rented Out';
    all[idx].status=closed?'Available':(String(p.type||'').toLowerCase()==='rent'?'Rented Out':'Sold Out');
    save(all);render();toast('Property status updated');
  }
  function remove(i){
    const mine=read().filter(p=>p.mine),p=mine[i];if(!p)return;
    if(!confirm('Delete this property permanently?'))return;
    const all=read();const idx=all.findIndex(x=>x.id===p.id);if(idx>=0)all.splice(idx,1);save(all);render();toast('Property deleted');
  }
  function css(){if(document.getElementById('pm-style'))return;const s=document.createElement('style');s.id='pm-style';s.textContent=`.pm-heading{margin:20px 0 10px;color:#0b3768;font-size:20px}.pm-card{border:1px solid #dfe6ee!important}.pm-line{margin-top:8px;color:#6b7a8c}.pm-status{display:inline-block;margin-top:10px;padding:7px 10px;border-radius:999px;font-size:12px;font-weight:800}.pm-open{background:#e9f8ef;color:#18864b}.pm-closed{background:#fff1f0;color:#b42318}.pm-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:12px}.pm-actions button{border:1px solid #dfe6ee;background:#fff;border-radius:10px;padding:10px 5px;font-weight:800;color:#0b3768;font-size:12px}.pm-actions .pm-delete{color:#b42318}@media(max-width:480px){.pm-actions{grid-template-columns:1fr 1fr 1fr}.pm-actions button{font-size:11px;padding:10px 3px}}`;document.head.appendChild(s)}
  function start(){css();render();const out=document.getElementById('myList');if(out&&!out.dataset.pmObserver){out.dataset.pmObserver='1';new MutationObserver(()=>setTimeout(render,30)).observe(out,{childList:true,subtree:false});}document.querySelectorAll('[data-nav="dashboard"]').forEach(b=>b.addEventListener('click',()=>setTimeout(render,150)));document.addEventListener('click',e=>{if(e.target.closest('#dashboard'))setTimeout(render,120)},true);window.addEventListener('storage',render);window.addEventListener('realynkCloudSync',render);setInterval(()=>{if(document.getElementById('dashboard')?.classList.contains('active'))render()},1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
