/* REALYNK SERVICE WORKER — SAFE CACHE V40
   Keep the PWA shell small. Never pin old JavaScript patch files in the cache.
   Network is preferred; cache is only a fallback for offline use. */
const CACHE='realynk-v40';
const SHELL=['./','./index.html','./manifest.webmanifest','./logo.png'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(k=>k.startsWith('realynk-') && k!==CACHE).map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        if(response && response.ok && event.request.destination!=='document'){
          const copy=response.clone();
          caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
        }
        return response;
      })
      .catch(()=>caches.match(event.request).then(r=>r || caches.match('./index.html')))
  );
});
