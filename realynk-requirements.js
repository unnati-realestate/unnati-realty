/* REALYNK REQUIREMENTS V1 — broker requirement + local matching */
(function(){
'use strict';
if(window.__REALYNK_REQUIREMENTS_V1__)return;
window.__REALYNK_REQUIREMENTS_V1__=true;
var KEY='realynkRequirements';
function get(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(a){localStorage.setItem(KEY,JSON.stringify(a))}
function inject(){
 var q=document.querySelector('.quick');
 if(!q||document.getElementById('postRequirement'))return;
 var b=document.createElement('button');b.id='postRequirement';b.type='button';b.innerHTML='🔎<b>Post Requirement</b>';
 b.onclick=openModal;q.appendChild(b);
}
function openModal(){
 if(document.getElementById('realynkReqModal'))return;
 var wrap=document.createElement('div');wrap.id='realynkReqModal';
 wrap.innerHTML='<div class="realynkReqBackdrop"></div><div class="realynkReqBox" role="dialog" aria-modal="true"><button class="realynkReqClose" type="button">×</button><div class="realynkReqHead"><div class="realynkReqIcon">🔎</div><div><h2>Post Buyer / Tenant Requirement</h2><p>Apni requirement post karein aur matching properties dhoondhein.</p></div></div><form id="realynkReqForm"><label>Requirement Type<select id="rrType"><option>Buy</option><option>Rent</option><option>Commercial</option><option>Heavy Deposit</option></select></label><label>Property / BHK<input id="rrProperty" placeholder="2 BHK / Shop / Office" required></label><label>Preferred Location<input id="rrLocation" placeholder="Mira Road, Bhayandar..." required></label><div class="realynkReqGrid"><label>Min Budget (₹)<input id="rrMin" type="number" min="0" placeholder="5000000"></label><label>Max Budget (₹)<input id="rrMax" type="number" min="0" placeholder="9000000" required></label></div><label>Note (optional)<textarea id="rrNote" rows="3" placeholder="Higher floor, parking, possession etc."></textarea><button class="realynkReqSubmit" type="submit">🚀 Post Requirement & Find Matches</button></form><div id="realynkReqResult"></div></div>';
 document.body.appendChild(wrap);
 var css=document.createElement('style');css.id='realynkReqCSS';css.textContent='#postRequirement{border:1px solid rgba(0,0,0,.08);cursor:pointer} .realynkReqBackdrop{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:9998}.realynkReqBox{position:fixed;z-index:9999;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,560px);max-height:88vh;overflow:auto;background:#fff;border-radius:20px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.28)}.realynkReqClose{position:absolute;right:14px;top:10px;border:0;background:none;font-size:30px;cursor:pointer}.realynkReqHead{display:flex;gap:12px;align-items:center;margin-bottom:18px}.realynkReqIcon{font-size:28px}.realynkReqBox h2{margin:0 30px 4px 0;font-size:21px}.realynkReqBox p{margin:0;color:#666;font-size:13px}.realynkReqBox label{display:block;font-weight:700;font-size:13px;margin:12px 0}.realynkReqBox input,.realynkReqBox select,.realynkReqBox textarea{width:100%;box-sizing:border-box;margin-top:6px;padding:11px 12px;border:1px solid #ddd;border-radius:10px;font:inherit}.realynkReqGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.realynkReqSubmit{width:100%;padding:13px;border:0;border-radius:11px;background:#111;color:#fff;font-weight:800;cursor:pointer;margin-top:8px}.realynkReqResult{margin-top:16px}.realynkMatch{border:1px solid #e6e6e6;border-radius:12px;padding:12px;margin-top:8px}.realynkMatch strong{display:block}.realynkMatch small{color:#666}@media(max-width:520px){.realynkReqBox{padding:18px}.realynkReqGrid{grid-template-columns:1fr}}';document.head.appendChild(css);
 document.querySelector('.realynkReqClose').onclick=close;document.querySelector('.realynkReqBackdrop').onclick=close;document.getElementById('realynkReqForm').onsubmit=submit;
}
function close(){var m=document.getElementById('realynkReqModal');if(m)m.remove()}
function num(v){return Number(String(v||'').replace(/[^0-9.]/g,''))||0}
function match(r){
 var props=[];try{props=JSON.parse(localStorage.getItem('realynkProperties')||'[]')}catch(e){}
 var max=num(r.max),min=num(r.min),loc=String(r.location).toLowerCase(),type=String(r.type).toLowerCase();
 return props.map(function(p){var score=0,pt=String(p.type||'').toLowerCase(),text=(String(p.title||'')+' '+String(p.area||'')+' '+String(p.desc||'')).toLowerCase(),price=num(p.price);if(pt===type)score+=40;else if(type==='buy'&&pt==='sale')score+=40;if(loc&&text.indexOf(loc)>=0)score+=35;else if(loc&&loc.split(/[, ]+/).some(function(x){return x.length>3&&text.indexOf(x)>=0}))score+=15;if(max&&price&&price<=max)score+=15;if(min&&price&&price>=min)score+=10;return{p:p,score:Math.min(score,100)}}).filter(function(x){return x.score>=35}).sort(function(a,b){return b.score-a.score}).slice(0,5)
}
function submit(e){e.preventDefault();var r={id:'REQ-'+Date.now(),type:rrType.value,property:rrProperty.value.trim(),location:rrLocation.value.trim(),min:rrMin.value,max:rrMax.value,note:rrNote.value.trim(),createdAt:new Date().toISOString(),mine:true};var a=get();a.unshift(r);save(a);var matches=match(r),out=document.getElementById('realynkReqResult');out.innerHTML='<div style="font-weight:800">✅ Requirement posted</div><div style="font-size:13px;color:#666;margin-top:4px">'+matches.length+' matching properties found in your current inventory.</div>'+matches.map(function(x){var p=x.p;return '<div class="realynkMatch"><strong>'+String(p.title||'Property')+'</strong><small>'+String(p.area||'')+' · '+String(p.price||'')+' · '+String(p.type||'')+' · '+x.score+'% match</small></div>'}).join('');document.getElementById('realynkReqForm').style.display='none'}
function start(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,300);
window.realynkRequirements={open:openModal,get:get,findMatches:match};
})();