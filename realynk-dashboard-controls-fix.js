/* REALYNK DASHBOARD CONTROLS V2 — reliable Edit/Delete on cloud dashboard, preserves Status */
(function(){
'use strict';
if(window.__REALYNK_DASHBOARD_CONTROLS_V2__)return;
window.__REALYNK_DASHBOARD_CONTROLS_V2__=true;
function styles(){
 if(document.getElementById('realynkDashControlStyleV2'))return;
 var s=document.createElement('style');s.id='realynkDashControlStyleV2';
 s.textContent='.realynkDashControlsV2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.realynkDashControlsV2 button{width:100%;min-height:40px;border:1px solid #cfd9e5;border-radius:9px;background:#fff;color:#17324d;font-weight:800;font-size:12px;padding:8px;cursor:pointer}.realynkDashDeleteV2{color:#b42318!important;border-color:#e2caca!important}';
 document.head.appendChild(s);
}
function callAction(name,id){
 var fn=window[name];
 if(typeof fn==='function'){fn(String(id));return}
 setTimeout(function(){if(typeof window[name]==='function')window[name](String(id));},250);
}
function add(){
 var host=document.getElementById('myList');if(!host)return;
 host.querySelectorAll('.property').forEach(function(card){
  var id=card.getAttribute('data-property-id')||card.dataset.propertyId;if(!id)return;
  var box=card.querySelector('.realynkDashControlsV2');
  if(!box){box=document.createElement('div');box.className='realynkDashControlsV2';card.appendChild(box)}
  if(!box.querySelector('.realynkDashEditV2')){
   var e=document.createElement('button');e.type='button';e.className='realynkDashEditV2';e.textContent='✎ Edit';
   e.onclick=function(ev){ev.preventDefault();ev.stopImmediatePropagation();callAction('realynkPropertyEdit',id)};box.appendChild(e);
  }
  if(!box.querySelector('.realynkDashDeleteV2')){
   var d=document.createElement('button');d.type='button';d.className='realynkDashDeleteV2';d.textContent='🗑 Delete';
   d.onclick=function(ev){ev.preventDefault();ev.stopImmediatePropagation();callAction('realynkPropertyDelete',id)};box.appendChild(d);
  }
 });
}
function start(){
 styles();
 [100,400,900,1800,3500,6000].forEach(function(ms){setTimeout(add,ms)});
 var host=document.getElementById('myList');
 if(host&&window.MutationObserver)new MutationObserver(function(){setTimeout(add,30)}).observe(host,{childList:true,subtree:true});
 if(window.MutationObserver)new MutationObserver(function(){if(document.getElementById('myList'))add()}).observe(document.body,{childList:true,subtree:true});
 window.realynkDashboardControls={refresh:add};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,300);
})();