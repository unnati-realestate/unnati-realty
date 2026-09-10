/* REALYNK BROKER INVITE CLOUD V1 — Firestore invitation tracking bridge */
(function(){
'use strict';
if(window.__REALYNK_BROKER_INVITE_CLOUD_V1__)return;
window.__REALYNK_BROKER_INVITE_CLOUD_V1__=true;
const ADMIN='seagullairexpress@gmail.com';
const CFG='./firebase-config.js';
const FIREBASE='https://www.gstatic.com/firebasejs/12.1.0/firebase-';
async function modules(){
 const appm=await import(FIREBASE+'app.js');
 const authm=await import(FIREBASE+'auth.js');
 const dbm=await import(FIREBASE+'firestore.js');
 const cfg=await import(CFG);
 const app=appm.getApps().length?appm.getApps()[0]:appm.initializeApp(cfg.firebaseConfig);
 return {auth:authm.getAuth(app),db:dbm.getFirestore(app),setDoc:dbm.setDoc,doc:dbm.doc,serverTimestamp:dbm.serverTimestamp};
}
function norm(v){let d=String(v||'').replace(/\D/g,'');if(d.length===10)return d;if(d.length===12&&d.startsWith('91'))return d.slice(2);if(d.length===11&&d[0]==='0')return d.slice(1);return d}
function esc(v){return String(v||'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]||c))}
async function saveCloud(item){const m=await modules();if(String(m.auth.currentUser?.email||'').toLowerCase()!==ADMIN)throw new Error('admin-auth-required');await m.setDoc(m.doc(m.db,'brokerInvitations',item.id),{...item,createdAt:m.serverTimestamp(),invitedBy:ADMIN});}
function handle(){document.addEventListener('click',async function(e){const b=e.target.closest&&e.target.closest('#riSave');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 const q=id=>document.getElementById(id);const name=q('riName')?.value.trim(),phone=norm(q('riPhone')?.value),email=q('riEmail')?.value.trim(),company=q('riCompany')?.value.trim(),city=q('riCity')?.value.trim(),areas=q('riAreas')?.value.trim(),rera=q('riRera')?.value||'Not Disclosed',exp=q('riExp')?.value.trim(),msg=q('riMsg');
 const show=(t,bg,fg)=>{if(msg){msg.textContent=t;msg.style.display='block';msg.style.background=bg;msg.style.color=fg}};
 if(!name||phone.length!==10){show('Broker name aur valid Indian mobile number zaroori hai. 10 digit, 0XXXXXXXXX ya +91XXXXXXXXXX format chalega.','#fff1f0','#b42318');return}
 let a=[];try{a=JSON.parse(localStorage.getItem('realynkBrokerInvites')||'[]')}catch(_){a=[]}if(a.some(x=>x.phone===phone)){show('Is mobile number ka broker invitation pehle se added hai.','#fff7df','#9a6700');return}
 const id='INV-'+Date.now();const item={id,name,phone,email,company,city,areas,reraStatus:rera,experience:exp,status:'Invited'};
 const profile='https://unnati-realestate.github.io/unnati-realty/';
 try{await saveCloud(item)}catch(err){console.error('Realynk invite cloud save failed',err);show('Invitation cloud mein save nahi hua. Admin login check karke dobara try karein.','#fff1f0','#b42318');return}
 item.createdAt=new Date().toISOString();a.push(item);localStorage.setItem('realynkBrokerInvites',JSON.stringify(a));
 const invite=profile+'broker-invite.html?id='+encodeURIComponent(id);const text='🤝 Realynk Broker Network Invitation\n\nNamaste '+name+',\nAapko Realynk Broker Network se judne ke liye invite kiya gaya hai.\n\nJoin / Accept Invitation:\n'+invite+'\n\nAapki profile acceptance aur Realynk verification ke baad hi active hogi.';
 window.open('https://web.whatsapp.com/send?phone=91'+phone+'&text='+encodeURIComponent(text),'_blank','noopener');show('Broker save ho gaya aur tracked invitation WhatsApp Web par khol diya gaya hai.','#e9f8ef','#18864b');
 },true)}
function start(){handle()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();