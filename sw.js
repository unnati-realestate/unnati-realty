const CACHE='realynk-v12';
const SHELL=['./','./index.html','./fixed.html?v=12','./manifest.webmanifest','./logo.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('realynk-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;if(event.request.mode==='navigate'){event.respondWith(fetch('./fixed.html?v=12',{cache:'no-store'}).catch(()=>caches.match('./fixed.html?v=12')));return}event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)))})