/* REALYNK VIDEO DURATION FIX - maximum 2 minutes */
(function(){
  'use strict';
  const MAX_SECONDS = 120;

  function toast(msg){
    const t=document.getElementById('toast');
    if(t){
      t.textContent=msg;
      t.style.display='block';
      clearTimeout(window.__rvToast);
      window.__rvToast=setTimeout(()=>t.style.display='none',2800);
    } else alert(msg);
  }

  function apply(){
    const input=document.getElementById('video');
    const notice=document.querySelector('[data-i18n="mediaNotice"]');
    if(notice) notice.textContent='Maximum 10 photos. Video maximum 2 minutes.';
    if(!input || input.dataset.twoMinFix==='1') return;

    input.dataset.twoMinFix='1';

    /* Replace the old 60-second onchange validator completely.
       The original page used input.onchange, so assigning a new onchange
       removes that old validator instead of fighting with it. */
    input.onchange=function(){
      const file=input.files && input.files[0];
      const player=document.getElementById('videoPlayer');
      const box=document.getElementById('videoBox');
      if(!file || !player) return;

      if(window.videoUrl){
        try{ URL.revokeObjectURL(window.videoUrl); }catch(e){}
      }

      const url=URL.createObjectURL(file);
      const check=document.createElement('video');
      check.preload='metadata';

      check.onloadedmetadata=function(){
        const duration=Number(check.duration);
        if(!Number.isFinite(duration)){
          URL.revokeObjectURL(url);
          return;
        }

        if(duration>MAX_SECONDS){
          URL.revokeObjectURL(url);
          input.value='';
          player.removeAttribute('src');
          player.load();
          if(box) box.style.display='none';
          toast('Video must be 2 minutes or less.');
          return;
        }

        /* Keep the selected file and show its preview. */
        window.videoUrl=url;
        window.videoFile=file;
        player.src=url;
        if(box) box.style.display='block';
        toast('Video added successfully');
      };

      check.onerror=function(){
        URL.revokeObjectURL(url);
        input.value='';
        if(box) box.style.display='none';
        toast('Unable to read this video. Please try another video.');
      };

      check.src=url;
    };
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();

  const mo=new MutationObserver(apply);
  mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(apply,500);
  setTimeout(apply,1500);
  setTimeout(apply,3000);
})();
