(function(){'use strict';
function ready(){
  if(document.documentElement.dataset.professionalUi==='1')return;
  document.documentElement.dataset.professionalUi='1';
  var css=document.createElement('link');css.rel='stylesheet';css.href='./professional-ui.css?v=2';document.head.appendChild(css);
  var q=document.querySelector('.quick');
  if(q){
    var b=document.getElementById('heavyDeposit');
    if(b){b.className='';b.style.cssText='';}
    q.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-label',(x.innerText||'').trim());});
  }
  ['buy','sale','rent','commercial','heavyDeposit'].forEach(function(id){
    var el=document.getElementById(id);if(!el||el.dataset.proUi)return;el.dataset.proUi='1';
    el.addEventListener('click',function(){setTimeout(function(){var h=document.querySelector('#homeList');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});},80);},false);
  });
  var showAll=document.getElementById('clearFilter');
  if(showAll&&!showAll.dataset.proUi){showAll.dataset.proUi='1';showAll.addEventListener('click',function(){setTimeout(function(){var h=document.querySelector('#homeList');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});},80);},false);}

  /* Make the four network/action cards real navigation controls. */
  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-rn-benefit]');
    if(!btn)return;
    var action=btn.getAttribute('data-rn-benefit');
    if(action==='brokers'){
      e.preventDefault();e.stopImmediatePropagation();
      document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
      var screen=document.getElementById('brokers');if(screen)screen.classList.add('active');
      document.querySelectorAll('.bottom button').forEach(function(b){b.classList.toggle('active',b.dataset.nav==='brokers');});
      window.scrollTo(0,0);return;
    }
    if(action==='shared'||action==='contact'){
      e.preventDefault();e.stopImmediatePropagation();
      document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
      var home=document.getElementById('home');if(home)home.classList.add('active');
      document.querySelectorAll('.bottom button').forEach(function(b){b.classList.toggle('active',b.dataset.nav==='home');});
      var list=document.getElementById('homeList');
      if(list){setTimeout(function(){list.scrollIntoView({behavior:'smooth',block:'start'});},80);}
      if(action==='contact' && list){setTimeout(function(){var first=list.querySelector('[data-call], [data-wa]');if(first)first.focus();},350);}
    }
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
setTimeout(ready,1200);setTimeout(ready,2500);
})();
