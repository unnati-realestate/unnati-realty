/* REALYNK HEAVY DEPOSIT V3 — click-only, no observer */
(function(){
'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_V3__)return;window.__REALYNK_HEAVY_DEPOSIT_V3__=true;
var active=false;
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v||'').trim().toLowerCase()}
function isHeavy(p){return !!(p&&(norm(p.deposit)||norm(p.depositAmount)||norm(p.depositText)||norm(p.title).indexOf('heavy deposit')>=0||norm(p.description).indexOf('heavy deposit')>=0))}
function inject(){var q=document.querySelector('.quick');if(!q||document.getElementById('heavyDeposit'))return;var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='💰<b>Heavy Deposit</b>';q.appendChild(b);b.addEventListener('click',function(){active=true;apply()})}
function apply(){var list=document.getElementById('homeList');if(!list)return;var ps=props(),cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkHeavyDepositEmpty'});if(!active){cards.forEach(function(c){c.style.display=''});return}cards.forEach(function(c){c.style.display='none'});ps.forEach(function(p){if(!isHeavy(p))return;var t=norm(p.title),a=norm(p.area);for(var i=0;i<cards.length;i++){var s=norm(cards[i].textContent);if((t&&s.indexOf(t)>=0)||(a&&s.indexOf(a)>=0)){cards[i].style.display='';break}}});var empty=document.getElementById('realynkHeavyDepositEmpty');if(!empty){empty=document.createElement('div');empty.id='realynkHeavyDepositEmpty';empty.className='empty';list.appendChild(empty)}var any=cards.some(function(c){return c.style.display!=='none'});empty.textContent='No heavy deposit properties available.';empty.style.display=any?'none':''}
document.addEventListener('click',function(e){var normal=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');if(normal){active=false;var m=document.getElementById('realynkHeavyDepositEmpty');if(m)m.style.display='none'}},false);
function start(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkHeavyDeposit={setFilter:function(v){active=!!v;apply()},getFilter:function(){return active}};
})();
