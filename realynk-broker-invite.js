/* REALYNK BROKER INVITE V3 — accept 10-digit, 0XXXXXXXXX and +91XXXXXXXXXX numbers */
(function(){
'use strict';
var KEY='realynkBrokerInvites';
function get(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){return false}}
function normalizePhone(v){var d=String(v||'').replace(/\D/g,'');if(d.length===10)return d;if(d.length===12&&d.slice(0,2)==='91')return d.slice(2);if(d.length===11&&d.charAt(0)==='0')return d.slice(1);return d}
function openModal(){
 if(document.getElementById('realynkInviteModal'))return;
 var m=document.createElement('div');m.id='realynkInviteModal';m.style.cssText='position:fixed;inset:0;background:rgba(9,30,55,.58);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px';
 m.innerHTML='<div style="width:min(560px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:20px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.25)"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0;color:#0b3768">🤝 Add / Invite Broker</h2><button id="riClose" type="button" style="border:0;background:#f3f6f9;border-radius:10px;padding:8px 12px;font-size:20px">×</button></div><p style="color:#6b7a8c;line-height:1.45">Broker ki details add karein. Invitation bhejne ke baad broker khud accept karke Realynk profile activate karega.</p><div id="riMsg" style="display:none;padding:10px;border-radius:10px;margin:8px 0"></div><div style="display:grid;gap:11px"><input id="riName" placeholder="Broker Name *" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><input id="riPhone" placeholder="Mobile / WhatsApp (10 digit ya +91XXXXXXXXXX) *" inputmode="tel" maxlength="13" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><input id="riEmail" placeholder="Email (Optional)" type="email" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><input id="riCompany" placeholder="Company / Agency" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><input id="riCity" placeholder="City" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><input id="riAreas" placeholder="Areas Served (e.g. Mira Road, Bhayandar)" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><select id="riRera" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><option value="Not Disclosed">RERA Status — Not Disclosed</option><option value="Registered">RERA Registered</option><option value="Applied">RERA Applied</option><option value="Not Registered">Not Registered</option></select><input id="riExp" placeholder="Experience (e.g. 8 years)" style="padding:13px;border:1px solid #cfd9e5;border-radius:10px;font-size:16px"><button id="riSave" class="primary full" type="button" style="padding:14px;border:0;border-radius:11px;background:#0b3768;color:#fff;font-weight:800;font-size:16px">Save & Create WhatsApp Invite</button></div><p style="font-size:12px;color:#6b7a8c;margin-bottom:0">Note: RERA optional hai. Added broker ko Verified nahi dikhaya jayega jab tak woh khud accept/verify na kare.</p></div>';
 document.body.appendChild(m);
 document.getElementById('riClose').onclick=function(){m.remove()};
 document.getElementById('riSave').onclick=function(){
  var name=document.getElementById('riName').value.trim(),phone=normalizePhone(document.getElementById('riPhone').value),email=document.getElementById('riEmail').value.trim(),company=document.getElementById('riCompany').value.trim(),city=document.getElementById('riCity').value.trim(),areas=document.getElementById('riAreas').value.trim(),rera=document.getElementById('riRera').value,exp=document.getElementById('riExp').value.trim();
  var msg=document.getElementById('riMsg');
  if(!name||phone.length!==10){msg.textContent='Broker name aur valid Indian mobile number zaroori hai. 10 digit, 0XXXXXXXXX ya +91XXXXXXXXXX format chalega.';msg.style.display='block';msg.style.background='#fff1f0';msg.style.color='#b42318';return}
  var a=get(),exists=a.some(function(x){return x.phone===phone});
  if(exists){msg.textContent='Is mobile number ka broker invitation pehle se added hai.';msg.style.display='block';msg.style.background='#fff7df';msg.style.color='#9a6700';return}
  var item={id:'INV-'+Date.now(),name:name,phone:phone,email:email,company:company,city:city,areas:areas,reraStatus:rera,experience:exp,status:'Invited',createdAt:new Date().toISOString()};a.push(item);save(a);
  var profile='https://unnati-realestate.github.io/unnati-realty/';
  var text='🤝 Realynk Broker Network Invitation\n\nNamaste '+name+',\nAapko Realynk Broker Network se judne ke liye invite kiya gaya hai. Yahan brokers aapas mein connect karke properties aur requirements match kar sakte hain aur milkar co-broking deals kar sakte hain.\n\nJoin / Explore Realynk:\n'+profile+'\n\nAapki profile aapki acceptance ke baad hi activate hogi.';
  var url='https://web.whatsapp.com/send?phone=91'+phone+'&text='+encodeURIComponent(text);
  window.open(url,'_blank','noopener');
  msg.textContent='Broker save ho gaya. WhatsApp Web invitation khol diya gaya hai.';msg.style.display='block';msg.style.background='#e9f8ef';msg.style.color='#18864b';
 };
}
function addButton(){
 var sec=document.getElementById('brokers');if(!sec||document.getElementById('realynkAddBrokerBtn'))return false;
 var host=sec.querySelector('.page');if(!host)return false;
 var b=document.createElement('button');b.id='realynkAddBrokerBtn';b.type='button';b.className='primary full';b.style.cssText='display:block;width:100%;margin:0 0 12px;padding:14px;border:0;border-radius:11px;background:#0b3768;color:#fff;font-weight:800;font-size:16px;cursor:pointer';b.textContent='＋ Add / Invite Broker';
 var h=host.querySelector('h2');if(h&&h.nextSibling)host.insertBefore(b,h.nextSibling);else host.prepend(b);b.onclick=openModal;return true;
}
function start(){addButton();[150,400,800,1400,2200].forEach(function(ms){setTimeout(addButton,ms)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
document.addEventListener('click',function(e){var n=e.target.closest&&e.target.closest('[data-nav]');if(n&&n.getAttribute('data-nav')==='brokers'){setTimeout(addButton,80);setTimeout(addButton,350);setTimeout(addButton,900)}},true);
window.realynkBrokerInvite={open:openModal,list:get,addButton:addButton};
})();