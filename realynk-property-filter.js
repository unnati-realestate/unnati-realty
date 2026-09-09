/* REALYNK PROPERTY FILTER V8 — one unified filter for All/Buy/Sale/Rent/Commercial/Heavy Deposit */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V8__)return;
window.__REALYNK_PROPERTY_FILTER_V8__=true;
var active='All';
function cardType(card){
  var d=card.querySelector('.details .detail:first-child b');
  return String(d?d.textContent:'').trim();
}
function apply(){
  var list=document.getElementById('homeList');if(!list)return;
  var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');
  if(bar)bar.style.display=active==='All'?'none':'flex';
  if(title)title.textContent=active==='All'?'':active+' Properties';
  var cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'&&c.id!=='realynkHeavyDepositEmpty'});
  var wanted=String(active||'').trim().toLowerCase(),visible=0;
  cards.forEach(function(c){
    var type=cardType(c).toLowerCase();
    var show=active==='All'||type===wanted;
    c.style.display=show?'':'none';
    if(show)visible++;
  });
  var empty=document.getElementById('realynkFilterEmpty');
  if(active!=='All'&&!visible){
    if(!empty){empty=document.createElement('div');empty.id='realynkFilterEmpty';empty.className='empty';list.appendChild(empty)}
    empty.textContent='No '+String(active).toLowerCase()+' properties available.';empty.style.display='';
  }else if(empty)empty.style.display='none';
}
function set(v){active=v||'All';apply()}
function fromId(id){return id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':id==='commercial'?'Commercial':id==='heavyDeposit'?'Heavy Deposit':'All'}
document.addEventListener('click',function(e){
  var el=e.target.closest('#buy,#sale,#rent,#commercial,#heavyDeposit,#clearFilter');
  if(!el)return;
  set(fromId(el.id));
  setTimeout(apply,40);
},false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.realynkPropertyFilter={setFilter:set,getFilter:function(){return active},refresh:apply};
})();
