/* REALYNK SERVICE WORKER — SAFE CACHE V42
   Stabilize the live HTML without rewriting the large legacy index file.
   Network remains authoritative; this worker removes duplicate legacy boot tags
   and points the page at the current safe boot. */
const CACHE='realynk-v42';
const SHELL=['./','./index.html','./manifest.webmanifest','./logo.png'];

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
    html=html.replace('<script src="./heavy-deposit.js?v=20"></script>','');
    html=html.replace('<script type="module" src="./realynk-boot.js?v=1"></script>','');
    if(html.indexOf('./realynk-boot.js?v=5')<0){
      html=html.replace('</body>','<script src="./realynk-boot.js?v=5"></script></body>');
    }
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
