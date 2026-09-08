/* REALYNK MEDIA V2 — safe property video persistence + cloud handoff */
(function(){
  'use strict';
  var DB='realynk-media', STORE='propertyVideos', selectedFile=null;
  function openDB(){return new Promise(function(resolve,reject){
    if(!window.indexedDB)return reject(new Error('IndexedDB unavailable'));
    var r=indexedDB.open(DB,1);
    r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
    r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error||new Error('DB error'));};
  });}
  function put(id,file){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put({blob:file,name:file.name,type:file.type,size:file.size,savedAt:Date.now()},String(id));
    tx.oncomplete=function(){db.close();resolve()};tx.onerror=function(){db.close();reject(tx.error)};
  });});}
  function get(id){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var r=db.transaction(STORE,'readonly').objectStore(STORE).get(String(id));
    r.onsuccess=function(){db.close();resolve(r.result||null)};r.onerror=function(){db.close();reject(r.error)};
  });});}
  function remove(id){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(String(id));
    tx.oncomplete=function(){db.close();resolve()};tx.onerror=function(){db.close();reject(tx.error)};
  });});}
  function latest(){try{var a=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(a)?a[0]:null}catch(_){return null}}
  function bind(){
    var input=document.getElementById('video');
    if(input&&!input.__realynkMediaBound){input.__realynkMediaBound=true;input.addEventListener('change',function(){selectedFile=input.files&&input.files[0]||null;});}
    var submit=document.getElementById('submit');
    if(submit&&!submit.__realynkMediaSubmitBound){
      submit.__realynkMediaSubmitBound=true;
      submit.addEventListener('click',function(){
        var file=selectedFile;if(!file)return;
        setTimeout(function(){var p=latest();if(!p||!p.id)return;put(p.id,file).then(function(){
          try{localStorage.setItem('realynkLastVideoPropertyId',String(p.id));}catch(_){ }
          window.dispatchEvent(new CustomEvent('realynkMediaSaved',{detail:{propertyId:p.id,type:'video',name:file.name,size:file.size}}));
          if(window.realynkCloudSync&&typeof window.realynkCloudSync.syncLatestProperty==='function')window.realynkCloudSync.syncLatestProperty();
        }).catch(function(e){console.warn('Realynk video save failed',e)});},450);
      },true);
    }
  }
  window.realynkMedia={getVideo:get,removeVideo:remove,saveVideo:put};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();