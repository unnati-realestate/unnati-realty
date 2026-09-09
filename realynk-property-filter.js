/* REALYNK PROPERTY FILTER V5 — unified category filtering */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V5__)return;
window.__REALYNK_PROPERTY_FILTER_V5__=true;
var active='All';
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v==null?'':v).trim().toLowerCase()}
function match(p){return active==='All'||norm(p&&p.type)===norm(active)}
function apply(){
 var list=document.getElementById('homeList');if(!list)return;
 var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');
 if(bar){bar.style.display=active==='All'?'none':'flex'}
 if(title)title.textContent=active==='All'?'':active+' Properties';
 var ps=props();
 var cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'&&c.id!=='realynkHeavyDepositEmpty'});
 cards.forEach(function(c){c.style.display='none';c.removeAttribute('data-realynk-property-id')});
 if(active==='All'){cards.forEach(function(c){c.style.display=''});return}
 ps.forEach(function(p){
   if(!match(p))return;
   var t=norm(p.title),a=norm(p.area);
   for(var i=0;i<cards.length;i++){
     var c=cards[i];
     if(c.dataset.realynkPropertyId)continue;
     var s=norm(c.textContent);
     if((t&&s.indexOf(t)>=0)||(a&&s.indexOf(a)>=0)){c.dataset.realynkPropertyId=String(p.id||'');c.style.display='';break}
   }
 });
 var visible=cards.some(function(c){return c.style.display!=='none'});
 var empty=document.getElementById('realynkFilterEmpty');
 if(!visible){
   if(!empty){empty=document.createElement('div');empty.id='realynkFilterEmpty';empty.className='empty';list.appendChild(empty)}
   empty.textContent='No '+active.toLowerCase()+' properties available.';empty.style.display='';
 }else if(empty)empty.style.display='none';
}
function set(v){active=v||'All';var hd=document.getElementById('realynkHeavyDepositEmpty');if(hd)hd.style.display='none';apply()}
document.addEventListener('click',function(e){
 var el=e.target.closest('#buy,#sale,#rent,#commercial,#heavyDeposit,#clearFilter');
 if(!el)return;
 var id=el.id;
 set(id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':id==='commercial'?'Commercial':'Heavy Deposit');
},false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.realynkPropertyFilter={setFilter:set,getFilter:function(){return active},refresh:apply};
})();
