/* REALYNK PUBLIC CATALOG V1 — common Firestore property source for every device */
(function(){'use strict';
if(window.__REALYNK_PUBLIC_CATALOG_V1__)return;window.__REALYNK_PUBLIC_CATALOG_V1__=true;
function merge(remote){var local=[];try{local=JSON.parse(localStorage.getItem('realynkProperties')||'[]')}catch(_){}if(!Array.isArray(local))local=[];var map={};local.forEach(function(p){if(p&&p.id!=null)map[String(p.id)]=p});remote.forEach(function(p){if(!p)return;var id=String(p.id||'');if(!id)return;map[id]=Object.assign({},map[id]||{},p,{id:p.id})});var out=Object.values(map).sort(function(a,b){return Number(b.id||0)-Number(a.id||0)});try{localStorage.setItem('realynkProperties',JSON.stringify(out))}catch(_){}window.dispatchEvent(new Event('realynkCloudPropertiesRestored'))}
async function load(){try{var appmod=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),fs=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js'),cfg=await import('./firebase-config.js');var app=appmod.getApps().length?appmod.getApps()[0]:appmod.initializeApp(cfg.firebaseConfig),db=fs.getFirestore(app),snap=await fs.getDocs(fs.collection(db,'properties')),rows=[];snap.forEach(function(d){var x=d.data()||{};rows.push(Object.assign({},x,{id:x.id||d.id}))});if(rows.length)merge(rows)}catch(e){console.warn('Realynk public catalog failed',e)}}
function start(){load();setTimeout(load,2500);setTimeout(load,8000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkPublicCatalog={refresh:load};
})();
