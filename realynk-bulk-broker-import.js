/* REALYNK BULK BROKER IMPORT V1 — Excel/CSV -> Firestore invitations */
(function(){
'use strict';
if(window.__REALYNK_BULK_BROKER_IMPORT_V1__)return;
window.__REALYNK_BULK_BROKER_IMPORT_V1__=true;
var ADMIN='seagullairexpress@gmail.com';
var XLSX_URL='https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs';
var $=function(id){return document.getElementById(id)};
var clean=function(v){return String(v==null?'':v).trim()};
var phone=function(v){var d=String(v==null?'':'').replace(/\D/g,'');if(d.length===12&&d.slice(0,2)==='91')d=d.slice(2);if(d.length===11&&d[0]==='0')d=d.slice(1);return d.length===10?d:''};
var val=function(r,words){var ks=Object.keys(r||{});for(var i=0;i<words.length;i++)for(var j=0;j<ks.length;j++){var k=ks[j].toLowerCase().replace(/[\s_\-\/()]+/g,'');if(words[i].some(function(w){return k.indexOf(w)>=0}))return clean(r[ks[j]])}return ''};
async function fb(){var a=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),au=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),fs=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js'),cfg=await import('./firebase-config.js');var app=a.getApps().length?a.getApps()[0]:a.initializeApp(cfg.firebaseConfig);return{auth:au.getAuth(app),db:fs.getFirestore(app),fs:fs}}
function addButton(){var s=$('brokers');if(!s||$('realynkBulkImportBtn'))return;var h=s.querySelector('.page'),b=document.createElement('button');b.id='realynkBulkImportBtn';b.type='button';b.className='primary full';b.style.cssText='display:block;width:100%;margin:0 0 10px;padding:14px;border:0;border-radius:11px;background:#18864b;color:#fff;font-weight:800;font-size:16px;cursor:pointer';b.textContent='📥 Bulk Import Brokers (Excel)';h.insertBefore(b,h.querySelector('h2').nextSibling);b.onclick=open}
async function open(){
 if($('bulkBrokerModal'))return;
 var F=await fb();if(!F.auth.currentUser||String(F.auth.currentUser.email||'').toLowerCase()!==ADMIN){alert('Super Admin login required.');return}
 var m=document.createElement('div');m.id='bulkBrokerModal';m.style.cssText='position:fixed;inset:0;background:rgba(9,30,55,.62);z-index:11000;display:flex;align-items:center;justify-content:center;padding:12px';
 m.innerHTML='<div style="width:min(900px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:20px;padding:18px"><div style="display:flex;justify-content:space-between"><h2 style="margin:0;color:#0b3768">📥 Bulk Broker Import</h2><button id="bbiClose" type="button">×</button></div><p style="color:#6b7a8c">Excel की सभी sheets पढ़ी जाएंगी. Duplicate mobile numbers और पहले से मौजूद invitations skip होंगे.</p><input id="bbiFile" type="file" accept=".xlsx,.xls,.csv" style="width:100%;padding:10px"><div id="bbiMsg" style="margin:12px 0"></div><div id="bbiSummary"></div><button id="bbiSave" class="primary" type="button" disabled style="margin:12px 0">Import & Save New Brokers</button><div id="bbiTable"></div></div>';
 document.body.appendChild(m);$('bbiClose').onclick=function(){m.remove()};
 $('bbiFile').onchange=async function(){try{
  $('bbiMsg').textContent='Excel पढ़ी जा रही है…';var X=window.XLSX||(window.XLSX=(await import(XLSX_URL)));var fr=new FileReader();
  fr.onload=async function(){try{var wb=X.read(fr.result,{type:'array'}),map=new Map();wb.SheetNames.forEach(function(sn){X.utils.sheet_to_json(wb.Sheets[sn],{defval:''}).forEach(function(r){var p=phone(val(r,[['whatsappnumber'],['whatsapp'],['mobilenumber'],['mobile'],['phone']]));if(!p)return;if(!map.has(p))map.set(p,{name:val(r,[['brokername'],['broker','consultant'],['name']])||'Broker',phone:p,company:val(r,[['firm','agency'],['company']]),email:val(r,[['emailid'],['email']]),city:val(r,[['city']]),areas:val(r,[['areaserved'],['serviceareas'],['areas']])})})});var rows=Array.from(map.values());var old=new Set();(await F.fs.getDocs(F.fs.collection(F.db,'brokerInvitations'))).forEach(function(d){var x=d.data()||{},p=phone(x.phone);if(p)old.add(p)});(await F.fs.getDocs(F.fs.collection(F.db,'brokers'))).forEach(function(d){var x=d.data()||{},p=phone(x.phone||x.mobile);if(p)old.add(p)});rows.forEach(function(x){x.status=old.has(x.phone)?'Already in Realynk':'New'});window.__REALYNK_BULK_ROWS__=rows;$('bbiSummary').innerHTML='<b>Unique brokers: '+rows.length+'</b> &nbsp; <span style="color:#18864b">New: '+rows.filter(x=>x.status==='New').length+'</span> &nbsp; <span style="color:#9a6700">Already: '+rows.filter(x=>x.status!=='New').length+'</span>';$('bbiSave').disabled=!rows.some(x=>x.status==='New');render(rows);$('bbiMsg').textContent='✓ Duplicate check complete.'}catch(e){$('bbiMsg').textContent='❌ '+e.message}};fr.readAsArrayBuffer(this.files[0])
 }catch(e){$('bbiMsg').textContent='❌ '+e.message}};
 $('bbiSave').onclick=async function(){var rows=(window.__REALYNK_BULK_ROWS__||[]).filter(x=>x.status==='New');if(!rows.length)return;this.disabled=true;this.textContent='Saving…';try{var batch=F.fs.writeBatch(F.db),stamp=Date.now();rows.forEach(function(x,i){var id='INV-BULK-'+stamp+'-'+String(i+1).padStart(3,'0');x.id=id;x.status='Invited';batch.set(F.fs.doc(F.db,'brokerInvitations',id),{id:id,name:x.name,phone:x.phone,email:x.email,company:x.company,city:x.city,areas:x.areas,status:'Invited',source:'bulk-excel',invitedBy:ADMIN,createdAt:F.fs.serverTimestamp()})});await batch.commit();$('bbiMsg').textContent='✓ '+rows.length+' broker invitations Firebase में save हो गए.';this.textContent='✓ Imported';render(window.__REALYNK_BULK_ROWS__)}catch(e){$('bbiMsg').textContent='❌ Save failed: '+e.message;this.disabled=false;this.textContent='Import & Save New Brokers'}};
 function inviteUrl(x){return new URL('./broker-invite.html?id='+encodeURIComponent(x.id),window.location.href).href}
 function inviteMessage(x){var link=inviteUrl(x);return 'Namaste '+(x.name&&x.name!=='Broker'?x.name:'Sir/Madam')+',\
\
ReaLynk — Broker-to-Broker Property Network mein aapko invite kiya gaya hai. 🤝\
\
Yahan brokers apni property listings share kar sakte hain, buyers/sellers/tenants ke saath business opportunities connect kar sakte hain aur apna Digital Broker Card share kar sakte hain.\
\
👉 Join / Accept Invitation: '+link+'\
\
Link open karke Accept & Join karein aur apni Broker Profile complete karein. Profile submit hone ke baad verification process hoga.\
\
ReaLynk — Connect • Share • Grow\
\
Dhanyavaad.'}
 function openWhatsApp(x){if(!x.id)return;var url='https://wa.me/91'+x.phone+'?text='+encodeURIComponent(inviteMessage(x));window.open(url,'_blank','noopener,noreferrer')}
 function copyInvite(x){if(!x.id)return;var msg=inviteMessage(x);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(msg).then(function(){alert('Invitation message copy ho gaya. Ab WhatsApp mein paste karke Send karein.')}).catch(function(){prompt('Invitation message copy karein:',msg)})}else prompt('Invitation message copy karein:',msg)}
 function render(rows){var h='<div style="overflow:auto;border:1px solid #dfe6ee;border-radius:12px"><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f5f7fb"><th style="padding:8px;text-align:left">Name</th><th style="padding:8px;text-align:left">Mobile</th><th style="padding:8px;text-align:left">Company</th><th style="padding:8px;text-align:left">Status</th><th style="padding:8px;text-align:left">Invite</th></tr>';rows.forEach(function(x,i){var action=x.id?'<button type="button" data-bbi-wa="'+i+'" style="border:0;border-radius:8px;background:#25D366;color:#fff;font-weight:800;padding:7px 9px;cursor:pointer">📲 WhatsApp</button> <button type="button" data-bbi-copy="'+i+'" style="border:1px solid #ccd6e2;border-radius:8px;background:#fff;padding:7px 9px;cursor:pointer">Copy</button>':'-';h+='<tr><td style="padding:8px;border-top:1px solid #eee">'+String(x.name).replace(/[<>]/g,'')+'</td><td style="padding:8px;border-top:1px solid #eee">'+x.phone+'</td><td style="padding:8px;border-top:1px solid #eee">'+String(x.company||'-').replace(/[<>]/g,'')+'</td><td style="padding:8px;border-top:1px solid #eee">'+x.status+'</td><td style="padding:8px;border-top:1px solid #eee;white-space:nowrap">'+action+'</td></tr>'});$('bbiTable').innerHTML=h+'</table></div>'}
 document.addEventListener('click',function(e){var wa=e.target.closest&&e.target.closest('[data-bbi-wa]');if(wa){var x=(window.__REALYNK_BULK_ROWS__||[])[Number(wa.getAttribute('data-bbi-wa'))];if(x)openWhatsApp(x);return}var cp=e.target.closest&&e.target.closest('[data-bbi-copy]');if(cp){var x=(window.__REALYNK_BULK_ROWS__||[])[Number(cp.getAttribute('data-bbi-copy'))];if(x)copyInvite(x);return}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){addButton()},{once:true});else addButton();
document.addEventListener('click',function(e){var n=e.target.closest&&e.target.closest('[data-nav]');if(n&&n.getAttribute('data-nav')==='brokers'){setTimeout(addButton,200);setTimeout(addButton,800)}},true);
})();