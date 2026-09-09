/* REALYNK SERVICE WORKER — SAFE CACHE V44
   Network remains authoritative. Inject the current safe runtime modules. */
const CACHE='realynk-v44';
const SHELL=['./','./index.html','./manifest.webmanifest','./logo.png','./realynk-media.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith('realynk-')&&k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});

function stabilizeDocument(response){
  return response.text().then(html=>{
    html=html.replace(/<script[^>]+heavy-deposit\.js[^>]*><\/script>/g,'');
    html=html.replace(/<script[^>]+realynk-boot\.js[^>]*><\/script>/g,'');
    html=html.replace(/<script[^>]+realynk-media\.js[^>]*><\/script>/g,'');
    html=html.replace('</body>','<script src="./realynk-boot.js?v=7"></script><script src="./realynk-media.js?v=2"></script></body>');
    return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
  });
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(
    fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response&&response.ok&&event.request.destination==='document')return stabilizeDocument(response);
      if(response&&response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
  );
});
