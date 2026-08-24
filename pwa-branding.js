/* Realynk PWA branding: use the approved Realynk logo everywhere the browser can show an app icon. */
(function(){
  'use strict';
  const logo='./logo.png';
  function addLink(rel,href,extra){
    if(document.querySelector('link[rel="'+rel+'"]')) return;
    const l=document.createElement('link'); l.rel=rel; l.href=href;
    if(extra) Object.keys(extra).forEach(k=>l.setAttribute(k,extra[k]));
    document.head.appendChild(l);
  }
  addLink('manifest','./manifest.webmanifest');
  addLink('icon',logo,{type:'image/png'});
  addLink('apple-touch-icon',logo,{sizes:'512x512'});
  function meta(property,content){
    if(!content || document.querySelector('meta[property="'+property+'"]')) return;
    const m=document.createElement('meta'); m.setAttribute('property',property); m.content=content; document.head.appendChild(m);
  }
  meta('og:type','website');
  meta('og:title',"Realynk — India's Real Estate Agent Network");
  meta('og:description','Trusted property and broker network across India.');
  meta('og:image',new URL(logo,location.href).href);
  meta('og:site_name','Realynk');
  meta('twitter:card','summary');
  meta('twitter:title',"Realynk — India's Real Estate Agent Network");
  meta('twitter:image',new URL(logo,location.href).href);
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
})();
