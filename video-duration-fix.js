/* REALYNK VIDEO DURATION FIX - maximum 2 minutes */
(function(){
  'use strict';
  const MAX_SECONDS=120;
  function toast(msg){
    const t=document.getElementById('toast');
    if(t){t.textContent=msg;t.style.display='block';clearTimeout(window.__rvToast);window.__rvToast=setTimeout(()=>t.style.display='none',2800);}
    else alert(msg);
  }
  function apply(){
    const input=document.getElementById('video');
    if(!input || input.dataset.twoMinFix==='1')return;
    input.dataset.twoMinFix='1';
    const notice=document.querySelector('[data-i18n="mediaNotice"]');
    if(notice)notice.textContent='Maximum 10 photos. Video maximum 2 minutes.';
    input.addEventListener('change',function(){
      const file=input.files&&input.files[0];
      if(!file)return;
      const url=URL.createObjectURL(file);
      const v=document.createElement('video');
      v.preload='metadata';
      v.onloadedmetadata=function(){
        URL.revokeObjectURL(url);
        if(Number.isFinite(v.duration) && v.duration>MAX_SECONDS){
          input.value='';
          const box=document.getElementById('videoBox');
          if(box)box.style.display='none';
          toast('Video must be 2 minutes or less.');
        }
      };
      v.onerror=function(){URL.revokeObjectURL(url);};
      v.src=url;
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  const mo=new MutationObserver(apply);mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
})();
