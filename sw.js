const CACHE='realynk-v15';
const SHELL=['./','./index.html','./manifest.webmanifest','./logo.png'];
const BAD="$('type').onchange=updateListingFields};";
const GOOD="$('type').onchange=updateListingFields;";
function fixIndexResponse(r){return r.text().then(html=>{html=html.replace(BAD,GOOD);return new Response(html,{status:r.status,statusText:r.statusText,headers:r.headers})})}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('realynk-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{if(!r||!r.ok)throw new Error('navigation fetch failed');return fixIndexResponse(r)}).catch(()=>caches.match('./index.html').then(r=>r?fixIndexResponse(r):r)));return}event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))))});