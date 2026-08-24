/* Realynk action fix: makes Broker Network, Shared Properties and Call & WhatsApp clickable. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  function showScreen(id){
    const nav=document.querySelector('.bottom button[data-nav="'+id+'"]');
    if(nav){nav.click();return true;}
    document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
    window.scrollTo(0,0);
    return !!$(id);
  }
  function homeAll(){
    showScreen('home');
    const clear=$('clearFilter');
    if(clear) clear.click();
    setTimeout(()=>$("homeList")?.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
  function bind(){
    document.querySelectorAll('.rn-benefit').forEach(card=>{
      if(card.dataset.rnActionBound==='1')return;
      card.dataset.rnActionBound='1';
      const text=card.textContent.toLowerCase();
      let action='all';
      if(text.includes('broker network')) action='brokers';
      else if(text.includes('shared properties')) action='shared';
      else if(text.includes('call & whatsapp')) action='contact';
      card.dataset.rnAction=action;
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.style.cursor='pointer';
      card.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        if(action==='brokers') showScreen('brokers');
        else homeAll();
      },true);
      card.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}
      });
    });
  }
  function start(){
    bind();
    new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
    setTimeout(bind,500);setTimeout(bind,1500);setTimeout(bind,3000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
