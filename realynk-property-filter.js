/* REALYNK PROPERTY FILTER V4 — click-only, no observer */
(function(){
'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V4__)return;window.__REALYNK_PROPERTY_FILTER_V4__=true;
var active='All';
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v||'').trim().toLowerCase()}
function match(p){return active==='All'||norm(p&&p.type)===norm(active)}
function setBar(){var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');if(!bar||!title)return;bar.style.display=active==='All'?'none':'flex';title.textContent=active+' Properties'}
function apply(){var list=document.getElementById('homeList');if(!list)return;setBar();var ps=props(),cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'});if(!ps.length){cards.forEach(function(c){c.style.display=''});return}cards.forEach(function(c){c.style.display=''});ps.forEach(function(p){var t=norm(p.title),a=norm(p.area);for(var i=0;i<cards.length;i++){var s=norm(cards[i].textContent);if((t&&s.indexOf(t)>=0)||(a&&s.indexOf(a)>=0)){cards[i].dataset.realynkPropertyId=String(p.id||'');break}}});var visible=false;cards.forEach(function(c){var p=ps.find(function(x){return String(x.id||'')===String(c.dataset.realynkPropertyId||'')});var show=active==='All'||!!(p&&match(p));c.style.display=show?'':'none';if(show)visible=true});var m=document.getElementById('realynkFilterEmpty');if(active!=='All'&&!visible){if(!m){m=document.createElement('div');m.id='realynkFilterEmpty';m.className='empty';list.appendChild(m)}m.textContent='No '+active.toLowerCase()+' properties available.';m.style.display=''}else if(m)m.style.display='none'}
document.addEventListener('click',function(e){var el=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');if(!el)return;var id=el.id;active=id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':'Commercial';apply()},false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){apply()},{once:true});else apply();
window.realynkPropertyFilter={setFilter:function(v){active=v||'All';apply()},getFilter:function(){return active}};
})();
