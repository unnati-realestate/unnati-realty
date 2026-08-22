/* REALYNK_FINAL_FIX_V1 */
(function(){
  'use strict';
  var DB='realynkMediaDB', STORE='videos';
  function openDB(){return new Promise(function(resolve,reject){if(!window.indexedDB)return reject(new Error('IndexedDB unavailable'));var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error)}})}
  function putVideo(id,file){return openDB().then(function(db){return new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(file,id);tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error)}})})}
  function getVideo(id){return openDB().then(function(db){return new Promise(function(resolve,reject){var r=db.transaction(STORE,'readonly').objectStore(STORE).get(id);r.onsuccess=function(){resolve(r.result||null)};r.onerror=function(){reject(r.error)}})})}
  function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
  function properties(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
  var videoInput=document.getElementById('video');
  if(videoInput){videoInput.addEventListener('change',function(){var f=videoInput.files&&videoInput.files[0];if(!f)return;window.__realynkPendingVideo=f;},false)}
  function enhanceCards(){
    var list=properties();
    document.querySelectorAll('.property').forEach(function(card){
      if(card.getAttribute('data-final-enhanced')==='1')return;
      var titleEl=card.querySelector('h3'); if(!titleEl)return;
      var title=titleEl.textContent.trim();
      var p=list.find(function(x){return String(x.title||'').trim()===title});
      if(!p)return;
      card.setAttribute('data-final-enhanced','1');
      var phone=String(p.phone||profile().accountPhone||'9658364364').replace(/\D/g,'');
      var row=document.createElement('div'); row.className='realynk-actions';
      row.innerHTML='<button type="button" data-act="call">📞 Call</button><button type="button" data-act="share">↗ Share</button>'+(p.videoName?'<button type="button" data-act="video">🎥 Video</button>':'');
      card.appendChild(row);
      row.querySelector('[data-act="call"]').onclick=function(){window.location.href='tel:+91'+phone};
      row.querySelector('[data-act="share"]').onclick=function(){var text=(p.title||'Property')+' - '+(p.area||'')+' '+(p.price||'');if(navigator.share)navigator.share({title:p.title||'REALYNK Property',text:text,url:location.href}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(text+' '+location.href).then(function(){alert('Property link copied')})};
      var vb=row.querySelector('[data-act="video"]');
      if(vb){vb.onclick=function(){getVideo(p.id).then(function(file){if(!file){alert('Video preview is not available on this device.');return}var u=URL.createObjectURL(file);var w=window.open('','_blank');if(w){w.document.write('<title>REALYNK Property Video</title><meta name="viewport" content="width=device-width,initial-scale=1"><video controls autoplay playsinline style="width:100%;height:auto" src="'+u+'"></video>');w.document.close()}}).catch(function(){alert('Video preview is not available.');})}}
    });
  }
  var css=document.createElement('style');css.textContent='.realynk-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px}.realynk-actions button{border:1px solid #dfe6ee;background:#fff;color:#0b3768;border-radius:10px;padding:10px 6px;font-weight:800;min-height:42px}.realynk-actions button:active{transform:scale(.98)}@media(max-width:480px){.realynk-actions button{font-size:12px}}';document.head.appendChild(css);
  function captureVideoAfterPost(){
    var f=window.__realynkPendingVideo;if(!f)return;
    var started=Date.now();
    (function poll(){
      var p=properties();
      if(p.length && p[0].videoName===f.name){putVideo(p[0].id,f).then(function(){window.__realynkPendingVideo=null;setTimeout(enhanceCards,100)}).catch(function(){});return}
      if(Date.now()-started<5000)setTimeout(poll,150);
    })();
  }
  var submit=document.getElementById('submit');
  if(submit){submit.addEventListener('click',function(){setTimeout(captureVideoAfterPost,250)},true)}
  var obs=new MutationObserver(function(){enhanceCards()});obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(enhanceCards,500);
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){})})}
})();
