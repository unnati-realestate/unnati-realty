/* REALYNK PROPERTY FILTER V6 — direct card filtering, Heavy Deposit included */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V6__)return;
window.__REALYNK_PROPERTY_FILTER_V6__=true;
var active='All';
function norm(v){return String(v==null?'':v).trim().toLowerCase()}
function apply(){
 var list=document.getElementById('homeList');if(!list)return;
 var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');
 if(bar)bar.style.display=active==='All'?'none':'flex';
 if(title)title.textContent=active==='All'?'':active+' Properties';
 var cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'&&c.id!=='realynkHeavyDepositEmpty'});
 var needle=norm(active);
 var visible=0;
 cards.forEach(function(c){
   if(active==='All'){c.style.display='';visible++;return}
   var text=norm(c.textContent);
   var show=active==='Heavy Deposit'?text.indexOf('heavy deposit')>=0:(text.indexOf(needle)>=0);
   c.style.display=show?'':'none';
   if(show)visible++;
 });
 var empty=document.getElementById('realynkFilterEmpty');
 if(active!=='All'&&!visible){
   if(!empty){empty=document.createElement('div');empty.id='realynkFilterEmpty';empty.className='empty';list.appendChild(empty)}
   empty.textContent='No '+active.toLowerCase()+' properties available.';empty.style.display='';
 }else if(empty)empty.style.display='none';
 var hd=document.getElementById('realynkHeavyDepositEmpty');if(hd)hd.style.display='none';
}
function set(v){active=v||'All';apply()}
document.addEventListener('click',function(e){
 var el=e.target.closest('#buy,#sale,#rent,#commercial,#heavyDeposit,#clearFilter');
 if(!el)return;
 var id=el.id;
 set(id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':id==='commercial'?'Commercial':'Heavy Deposit');
},false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.realynkPropertyFilter={setFilter:set,getFilter:function(){return active},refresh:apply};
})();
