(function(){'use strict';
function ready(){
  if(document.documentElement.dataset.professionalUi==='1')return;
  document.documentElement.dataset.professionalUi='1';
  var css=document.createElement('link');css.rel='stylesheet';css.href='./professional-ui.css?v=1';document.head.appendChild(css);
  var q=document.querySelector('.quick');
  if(q){
    var b=document.getElementById('heavyDeposit');
    if(b){b.className='';b.style.cssText='';}
    q.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-label',(x.innerText||'').trim());});
  }
  // Keep category controls reliable even when older scripts bind first.
  ['buy','sale','rent','commercial','heavyDeposit'].forEach(function(id){
    var el=document.getElementById(id);if(!el||el.dataset.proUi)return;el.dataset.proUi='1';
    el.addEventListener('click',function(){setTimeout(function(){var h=document.querySelector('#homeList');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});},80);},false);
  });
  var showAll=document.getElementById('clearFilter');
  if(showAll&&!showAll.dataset.proUi){showAll.dataset.proUi='1';showAll.addEventListener('click',function(){setTimeout(function(){var h=document.querySelector('#homeList');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});},80);},false);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
setTimeout(ready,1200);setTimeout(ready,2500);
})();
