/* Realynk authentication bootstrap.
   The broker network itself is handled by realynk-core.js.
   New brokers are kept separate from the admin account and remain pending
   until the Realynk admin approves them.
*/
(function(){
  "use strict";
  function load(){
    if(document.querySelector('script[data-realynk-core="1"]')) return;
    var s=document.createElement("script");
    s.type="module";
    s.src="./realynk-core.js?v=2";
    s.dataset.realynkCore="1";
    document.head.appendChild(s);
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", load, {once:true});
  else load();
})();
