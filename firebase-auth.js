/* Realynk unified Firebase/network bootstrap. */
(function(){
  "use strict";
  function load(){
    if(document.querySelector('script[data-realynk-v3="1"]')) return;
    const s=document.createElement("script");
    s.type="module";
    s.src="./realynk-v3.js?v=10";
    s.dataset.realynkV3="1";
    document.head.appendChild(s);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",load,{once:true});
  else load();
})();
