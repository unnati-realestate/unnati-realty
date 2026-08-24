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
    const notice=document.querySelector('[data-i18n="mediaNotice"]');
    if(notice)notice.textContent='Maximum 10 photos. Video maximum 2 minutes.';
    if(!input)return;
    if(input.dataset.twoMinFix==='1')return;
    input.dataset.twoMinFix='1';

    /* The original page still has an older 60-second validator.
       For 61-120 second videos, this capture listener makes that old
       validator see a safe duration while preserving the selected file. */
    const player=document.getElementById('videoPlayer');
    if(player && player.dataset.twoMinMetadataFix!=='1'){
      player.dataset.twoMinMetadataFix='1';
      player.addEventListener('loadedmetadata',function(){
        const d=Number(player.duration);
        if(Number.isFinite(d) && d>60 && d<=MAX_SECONDS){
          try{
            Object.defineProperty(player,'duration',{value:59.9,configurable:true});
            setTimeout(function(){try{delete player.duration;}catch(e){}},0);
          }catch(e){}
        }
      },true);
    }

    input.addEventListener('change',function(e){
      const file=input.files&&input.files[0];
      if(!file)return;
      const url=URL.createObjectURL(file);
      const check=document.createElement('video');
      check.preload='metadata';
      check.onloadedmetadata=function(){
        const duration=Number(check.duration);
        URL.revokeObjectURL(url);
        if(Number.isFinite(duration) && duration>MAX_SECONDS){
          e.stopImmediatePropagation();
          input.value='';
          const box=document.getElementById('videoBox');
          if(box)box.style.display='none';
          toast('Video must be 2 minutes or less.');
        }
      };
      check.onerror=function(){URL.revokeObjectURL(url);};
      check.src=url;
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  const mo=new MutationObserver(apply);mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
})();
