const CACHE='realynk-v4';
const SHELL=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 const doc=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
 if(doc){
  e.respondWith(fetch(e.request).then(async r=>{
   const text=await r.clone().text();
   const patched=text.replace(/<section id="post" class="screen">[\s\S]*?<\/section>/,POST_SECTION);
   const final=patched.replace('</body>',POST_SCRIPT+'</body>');
   const h=new Headers(r.headers);h.delete('content-encoding');h.delete('content-length');h.set('content-type','text/html;charset=utf-8');
   const out=new Response(final,{status:r.status,statusText:r.statusText,headers:h});
   caches.open(CACHE).then(c=>c.put(e.request,out.clone()));
   return out;
  }).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))));
 }else e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
const POST_SECTION=`<section id="post" class="screen"><div class="page"><button class="back" data-back="home">←</button><h2 data-t="postTitle">Post Property</h2><div class="panel">
<div class="field"><label data-t="propertyTitle">Property Title</label><input id="pTitle" placeholder="e.g. 2 BHK Near Metro"></div>
<div class="field"><label data-t="area">Area</label><input id="pArea" placeholder="Mira Road East"></div>
<div class="field"><label data-t="type">Purpose / Type</label><select id="pType"><option>Buy</option><option>Rent</option><option>Commercial</option></select></div>
<div class="field"><label>Property Type</label><select id="pPropertyType"><option>Flat / Apartment</option><option>House / Villa</option><option>Shop</option><option>Office</option><option>Plot / Land</option><option>Warehouse</option><option>Other</option></select></div>
<div class="field"><label data-t="price">Price / Rent</label><input id="pPrice" placeholder="₹25,000 / month"></div>
<div class="field"><label>BHK</label><select id="pBhk"><option>Not specified</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK</option><option>5+ BHK</option></select></div>
<div class="field"><label>Area Size</label><input id="pAreaSize" placeholder="e.g. 850 sq.ft."></div>
<div class="field"><label data-t="description">Description</label><textarea id="pDesc" placeholder="Property details"></textarea></div>
<div class="field"><label>Property Photos &amp; Video</label><div class="uploadRow"><label class="uploadBtn">📷 Add Photos<input id="pPhotos" type="file" accept="image/*" multiple hidden></label><label class="uploadBtn">🎥 Add Video<input id="pVideo" type="file" accept="video/*" hidden></label></div><div class="mediaHint">Add multiple photos and one property video. Preview before posting.</div><div id="mediaPreview" class="mediaGrid"></div></div>
<div class="field"><label data-t="contact">Contact / WhatsApp</label><input id="pPhone" value="9658364364"></div><button class="primary full" id="submitBtn" data-t="submit">Post Listing</button>
</div></div></section>`;
const POST_SCRIPT=`<script>(()=>{if(window.__realynkPostFix)return;window.__realynkPostFix=1;const s=document.createElement('style');s.textContent='.mediaGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.mediaThumb{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#edf2f7;border:1px solid #dfe6ee}.mediaThumb img,.mediaThumb video{width:100%;height:100%;object-fit:cover}.removeMedia{position:absolute;right:5px;top:5px;width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:#b42318;font-weight:900}.uploadRow{display:grid;grid-template-columns:1fr 1fr;gap:9px}.uploadBtn{display:flex;align-items:center;justify-content:center;gap:7px;min-height:54px;border:1px dashed #9fb3c7;border-radius:13px;background:#f8fbfe;color:#0b3768;font-weight:800}.mediaHint{font-size:12px;color:#6b7a8c;margin-top:7px}';document.head.appendChild(s);if(typeof applyLang==='function')applyLang();let photos=[],video=null;const $=id=>document.getElementById(id),box=()=>$('mediaPreview');function draw(){box().innerHTML='';photos.forEach((p,i)=>{let d=document.createElement('div');d.className='mediaThumb';d.innerHTML='<img src="'+p.url+'" alt="Property photo"><button class="removeMedia" data-i="'+i+'">×</button>';box().appendChild(d)});if(video){let d=document.createElement('div');d.className='mediaThumb';d.innerHTML='<video src="'+video.url+'" controls playsinline></video><button class="removeMedia" id="rmv">×</button>';box().appendChild(d)}}$('pPhotos').onchange=e=>{[...e.target.files].forEach(f=>{let url=URL.createObjectURL(f);photos.push({file:f,url})});e.target.value='';draw()};$('pVideo').onchange=e=>{let f=e.target.files[0];if(!f)return;if(video)URL.revokeObjectURL(video.url);video={file:f,url:URL.createObjectURL(f)};e.target.value='';draw()};box().onclick=e=>{let b=e.target.closest('.removeMedia');if(!b)return;if(b.id==='rmv'){URL.revokeObjectURL(video.url);video=null}else{let i=+b.dataset.i;URL.revokeObjectURL(photos[i].url);photos.splice(i,1)}draw()};$('submitBtn').onclick=()=>{let title=$('pTitle').value.trim(),area=$('pArea').value.trim(),price=$('pPrice').value.trim();if(!title||!area||!price){alert('Please add title, area and price.');return}let list=JSON.parse(localStorage.getItem('realynkProperties')||'[]');list.unshift({id:Date.now(),title,area,type:$('pType').value,propertyType:$('pPropertyType').value,price,bhk:$('pBhk').value,areaSize:$('pAreaSize').value,desc:$('pDesc').value,phone:$('pPhone').value||'9658364364',mine:true,mediaPreview:photos.length+(video?1:0)});localStorage.setItem('realynkProperties',JSON.stringify(list));alert('Listing posted successfully. Photos/video are previewed on this device.');photos.forEach(p=>URL.revokeObjectURL(p.url));if(video)URL.revokeObjectURL(video.url);photos=[];video=null;draw();['pTitle','pArea','pPrice','pAreaSize','pDesc'].forEach(id=>$(id).value='')};})();</script>`;