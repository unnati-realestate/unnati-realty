/* REALYNK MEDIA V4 — safe video persistence + mobile photo compression */
(function(){
  'use strict';
  var DB='realynk-media', STORE='propertyVideos', selectedFile=null, compressingPhotos=false;
  function openDB(){return new Promise(function(resolve,reject){
    if(!window.indexedDB)return reject(new Error('IndexedDB unavailable'));
    var r=indexedDB.open(DB,1);
    r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
    r.onsuccess=function(){resolve(r.result)};r.onerror=function(){reject(r.error||new Error('DB error'));};
  });}
  function put(id,file){return openDB().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({blob:file,name:file.name,type:file.type,size:file.size,savedAt:Date.now()},String(id));
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
  function clearSelection(){
    selectedFile=null;
    var input=document.getElementById('video');
    if(input){try{input.value=''}catch(_){} }
    var box=document.getElementById('videoBox'),player=document.getElementById('videoPlayer');
    if(player){try{player.pause()}catch(_){};var src=player.getAttribute('src');if(src&&src.indexOf('blob:')===0){try{URL.revokeObjectURL(src)}catch(_){}};player.removeAttribute('src');try{player.load()}catch(_){}}
    if(box)box.style.display='none';
    window.dispatchEvent(new CustomEvent('realynkVideoCleared'));
  }
  function compressImage(file){return new Promise(function(resolve){
    if(!file||!/^image\//i.test(file.type)){resolve(file);return;}
    var img=new Image(),url=URL.createObjectURL(file);
    img.onload=function(){
      try{
        var max=1280,w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,scale=Math.min(1,max/Math.max(w,h));
        var cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale)),c=document.createElement('canvas');c.width=cw;c.height=ch;
        var ctx=c.getContext('2d');ctx.drawImage(img,0,0,cw,ch);
        c.toBlob(function(blob){URL.revokeObjectURL(url);if(!blob){resolve(file);return;}resolve(new File([blob],(file.name||'photo') .replace(/\.[^.]+$/i,'.jpg'),{type:'image/jpeg',lastModified:Date.now()}));},'image/jpeg',0.68);
      }catch(e){URL.revokeObjectURL(url);resolve(file)}
    };
    img.onerror=function(){URL.revokeObjectURL(url);resolve(file)};img.src=url;
  });}
  async function compressSelectedPhotos(input,originalEvent){
    if(compressingPhotos||!input||!input.files||!input.files.length)return;
    compressingPhotos=true;
    try{
      var files=Array.prototype.slice.call(input.files,0,10),out=[];
      for(var i=0;i<files.length;i++)out.push(await compressImage(files[i]));
      var dt=new DataTransfer();out.forEach(function(f){dt.items.add(f)});input.files=dt.files;
      input.dataset.realynkCompressed='1';
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }catch(e){console.warn('Realynk photo compression failed',e)}
    compressingPhotos=false;
  }
  function bind(){
    var photoInput=document.getElementById('photos');
    if(photoInput&&!photoInput.__realynkPhotoCompressionBound){
      photoInput.__realynkPhotoCompressionBound=true;
      photoInput.addEventListener('change',function(e){
        if(photoInput.dataset.realynkCompressed==='1'){delete photoInput.dataset.realynkCompressed;return;}
        if(photoInput.files&&photoInput.files.length&&!compressingPhotos){e.stopImmediatePropagation();compressSelectedPhotos(photoInput,e);}
      },true);
    }
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
  window.realynkMedia={getVideo:get,removeVideo:remove,saveVideo:put,clearVideoSelection:clearSelection};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
