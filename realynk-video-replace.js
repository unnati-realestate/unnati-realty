/* REALYNK VIDEO REPLACE — lets a broker remove the selected video and choose another */
(function(){
  'use strict';
  function bind(){
    var box=document.getElementById('videoBox'), input=document.getElementById('video'), player=document.getElementById('videoPlayer');
    if(!box||!input||!player||box.__realynkReplaceBound)return;
    box.__realynkReplaceBound=true;
    var actions=document.createElement('div');
    actions.style.cssText='display:flex;gap:8px;padding:10px;background:#111';
    actions.innerHTML='<button type="button" id="realynkRemoveVideo" style="flex:1;border:0;border-radius:9px;padding:11px;background:#fff;color:#b42318;font-weight:800;cursor:pointer">🗑️ Remove Video</button><button type="button" id="realynkChangeVideo" style="flex:1;border:0;border-radius:9px;padding:11px;background:#fff;color:#0b3768;font-weight:800;cursor:pointer">🔄 Choose Another</button>';
    box.appendChild(actions);
    document.getElementById('realynkRemoveVideo').onclick=function(){
      if(window.realynkMedia&&typeof window.realynkMedia.clearVideoSelection==='function')window.realynkMedia.clearVideoSelection();
      else{try{input.value=''}catch(_){};box.style.display='none';player.removeAttribute('src');try{player.load()}catch(_){} }
    };
    document.getElementById('realynkChangeVideo').onclick=function(){try{input.click()}catch(_){} };
    input.addEventListener('change',function(){
      var file=input.files&&input.files[0];
      if(!file)return;
      var old=player.getAttribute('src');if(old&&old.indexOf('blob:')===0){try{URL.revokeObjectURL(old)}catch(_){} }
      var url=URL.createObjectURL(file);player.src=url;box.style.display='block';
    });
  }
  function start(){bind();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
