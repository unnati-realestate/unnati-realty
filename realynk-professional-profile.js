/* Realynk Professional Broker Profile integration — safe, event-driven */
(function(){
  'use strict';
  function profile(){
    try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{};}
    catch(e){return{};}
  }
  function addProfileLink(){
    var box=document.getElementById('brokerProfileCard');
    if(!box || box.dataset.proLink==='1') return;
    var p=profile();
    if(!p.agentName) return;
    box.dataset.proLink='1';
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='primary full';
    btn.style.marginTop='12px';
    btn.textContent='👤 View Professional Profile';
    btn.onclick=function(){location.href='./professional-profile.html';};
    box.appendChild(btn);
  }
  window.realynkRefreshProfessionalProfile=addProfileLink;
  document.addEventListener('click',function(e){
    var nav=e.target.closest('[data-nav="brokers"]');
    if(nav) setTimeout(addProfileLink,60);
  });
  window.addEventListener('realynkProfileSaved',function(){setTimeout(addProfileLink,60);});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addProfileLink,{once:true});
  else addProfileLink();
})();
