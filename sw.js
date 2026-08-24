const CACHE='realynk-v31';
const SHELL=[
  './','./index.html','./manifest.webmanifest','./logo.png',
  './realynk-boot.js','./realynk-core.js','./property-management-ui.js',
  './pwa-branding.js','./video-duration-fix.js','./firebase-auth.js','./firebase-config.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('realynk-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response && response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
  );
});
