/* REALYNK HEAVY DEPOSIT LISTING TYPE — lightweight, no observer */
(function(){
'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_TYPE__)return;
window.__REALYNK_HEAVY_DEPOSIT_TYPE__=true;
function start(){
  var type=document.getElementById('type');
  if(!type)return;
  if(!type.querySelector('option[value="Heavy Deposit"]')){
    var o=document.createElement('option');
    o.value='Heavy Deposit';
    o.textContent='💰 Heavy Deposit';
    type.appendChild(o);
  }
  function sync(){
    var v=String(type.value||'');
    var deposit=document.getElementById('depositField');
    if(deposit && (v==='Heavy Deposit'||v==='Rent')) deposit.style.display='block';
  }
  type.addEventListener('change',sync,false);
  sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
