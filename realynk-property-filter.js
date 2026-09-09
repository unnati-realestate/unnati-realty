/* REALYNK PROPERTY FILTER V7 — core owns Heavy Deposit; helper handles only standard filters */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V7__)return;
window.__REALYNK_PROPERTY_FILTER_V7__=true;
var active='All';
function apply(){
 var list=document.getElementById('homeList');if(!list)return;
 var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');
 if(bar)bar.style.display=active==='All'?'none':'flex';
 if(title)title.textContent=active==='All'?'':active+' Properties';
 var cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'&&c.id!=='realynkHeavyDepositEmpty'});
 var needle=String(active||'').trim().toLowerCase(),visible=0;
 cards.forEach(function(c){
   var show=active==='All'||String(c.textContent||'').toLowerCase().indexOf(needle)>=0;
   c.style.display=show?'':'none';if(show)visible++;
 });
 var empty=document.getElementById('realynkFilterEmpty');
 if(active!=='All'&&!visible){
   if(!empty){empty=document.createElement('div');empty.id='realynkFilterEmpty';empty.className='empty';list.appendChild(empty)}
   empty.textContent='No '+String(active).toLowerCase()+' properties available.';empty.style.display='';
 }else if(empty)empty.style.display='none';
}
function set(v){active=v||'All';apply()}
document.addEventListener('click',function(e){
 var el=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');
 if(!el)return;
 var id=el.id;
 set(id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':'Commercial');
},false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.realynkPropertyFilter={setFilter:set,getFilter:function(){return active},refresh:apply};
})();
