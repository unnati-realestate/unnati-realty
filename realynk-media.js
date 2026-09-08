/* REALYNK MEDIA V1 — lightweight property video persistence
   Stores the selected video Blob in IndexedDB instead of localStorage.
   This avoids putting large video data into the SPA/localStorage and keeps the
   current UI engine untouched. Cloud upload can consume the stored Blob later. */
(function(){
  'use strict';
  var DB='realynk-media', STORE='propertyVideos';
  var selectedFile=null;
  function openDB(){return new Promise(function(resolve,reject){
    if(!window.indexedDB){reject(new Error('IndexedDB unavailable'));return;}
    var r=indexedDB.open(DB,1);
    r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
    r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error||new Error('DB error'))};
  })}
  function put(id,file){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({blob:file,name:file.name,type:file.type,size:file.size,savedAt:Date.now()},String(id));
    tx.oncomplete=function(){db.close();resolve()};tx.onerror=function(){db.close();reject(tx.error)};
  })})}
  function get(id){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var r=db.transaction(STORE,'readonly').objectStore(STORE).get(String(id));
    r.onsuccess=function(){db.close();resolve(r.result||null)};r.onerror=function(){db.close();reject(r.error)};
  })})}
  function remove(id){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(String(id));
    tx.oncomplete=function(){db.close();resolve()};tx.onerror=function(){db.close();reject(tx.error)};
  })})}
  function bind(){
    var input=document.getElementById('video');
    if(input&&!input.__realynkMediaBound){
      input.__realynkMediaBound=true;
      input.addEventListener('change',function(){selectedFile=input.files&&input.files[0]||null;});
    }
    var submit=document.getElementById('submit');
    if(submit&&!submit.__realynkMediaSubmitBound){
      submit.__realynkMediaSubmitBound=true;
      submit.addEventListener('click',function(){
        if(!selectedFile)return;
        setTimeout(function(){
          try{
            var list=JSON.parse(localStorage.getItem('realynkProperties')||'[]');
            var p=Array.isArray(list)&&list[0];
            if(p&&p.id)put(p.id,selectedFile).then(function(){
              window.dispatchEvent(new CustomEvent('realynkMediaSaved',{detail:{propertyId:p.id,type:'video',name:selectedFile.name,size:selectedFile.size}}));
            }).catch(function(e){console.warn('Realynk video save failed',e)});
          }catch(e){console.warn('Realynk video metadata failed',e)}
        },350);
      },true);
    }
  }
  window.realynkMedia={getVideo:get,removeVideo:remove};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
