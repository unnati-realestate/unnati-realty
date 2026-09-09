/* REALYNK HEAVY DEPOSIT V2 — low-CPU category filtering */
(function(){'use strict';
if(window.__REALYNK_HEAVY_DEPOSIT_V2__)return;window.__REALYNK_HEAVY_DEPOSIT_V2__=true;
var active=false,timer=0;
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v||'').trim().toLowerCase()}
function isHeavy(p){return !!(p&&(norm(p.deposit)||norm(p.depositAmount)||norm(p.depositText)||norm(p.title).indexOf('heavy deposit')>=0||norm(p.description).indexOf('heavy deposit')>=0))}
function inject(){var q=document.querySelector('.quick');if(!q||document.getElementById('heavyDeposit'))return;var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='💰<b>Heavy Deposit</b>';q.appendChild(b);b.addEventListener('click',function(){active=true;apply()})}
function applyNow(){inject();var list=document.getElementById('homeList');if(!list)return;var ps=props(),cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkHeavyDepositEmpty'});if(!active){cards.forEach(function(c){c.style.display=''});return}var visible=false;cards.forEach(function(c){c.style.display='';});ps.forEach(function(p){var t=norm(p.title),a=norm(p.area),c=cards.find(function(x){var s=norm(x.textContent);return(t&&s.indexOf(t)>=0)||(a&&s.indexOf(a)>=0)});if(c&&p.id!=null)c.dataset.realynkHeavyId=String(p.id)});cards.forEach(function(c){var p=ps.find(function(x){return String(x.id||'')===String(c.dataset.realynkHeavyId||'')});var show=!!(p&&isHeavy(p));c.style.display=show?'':'none';if(show)visible=true});var empty=document.getElementById('realynkHeavyDepositEmpty');if(active&&!visible){if(!empty){empty=document.createElement('div');empty.id='realynkHeavyDepositEmpty';empty.className='empty';list.appendChild(empty)}empty.textContent='No heavy deposit properties available.';empty.style.display=''}else if(empty)empty.style.display='none'}
function apply(){clearTimeout(timer);timer=setTimeout(applyNow,120)}
document.addEventListener('click',function(e){var normal=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');if(normal){active=false;var m=document.getElementById('realynkHeavyDepositEmpty');if(m)m.style.display='none'}},false);
document.addEventListener('click',function(e){if(e.target.closest('.quick'))setTimeout(inject,150);},false);
function start(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkHeavyDeposit={setFilter:function(v){active=!!v;apply()},getFilter:function(){return active}};
})();
