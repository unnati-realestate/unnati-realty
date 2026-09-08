// Realynk Professional Broker Profile integration
(function(){'use strict';
function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function addProfileLink(){const box=document.getElementById('brokerProfileCard');if(!box||box.dataset.proLink==='1')return;const p=profile();if(!p.agentName)return;box.dataset.proLink='1';const btn=document.createElement('button');btn.type='button';btn.className='primary full';btn.style.marginTop='12px';btn.textContent='👤 View Professional Profile';btn.onclick=function(){location.href='./professional-profile.html'};box.appendChild(btn)}
window.addEventListener('load',()=>setTimeout(addProfileLink,250));window.addEventListener('realynkProfileSaved',()=>setTimeout(addProfileLink,100));const original=localStorage.setItem.bind(localStorage);localStorage.setItem=function(k,v){original(k,v);if(k==='realynkBrokerProfile')setTimeout(addProfileLink,150)};setInterval(addProfileLink,1200);
})();
