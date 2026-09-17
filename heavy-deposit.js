/* REALYNK QUICK CATEGORY CONTROLLER — synchronous, all categories */
(function(){
'use strict';
if(window.__REALYNK_EARLY_CATEGORY_CLICK_OWNER__)return;
window.__REALYNK_EARLY_CATEGORY_CLICK_OWNER__=true;
var active='';
var ids={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit'};
function clean(v){return String(v||'').trim().toLowerCase()}
function commercial(v){v=clean(v);return v==='commercial'||v.indexOf('commercial')!==-1||v==='shop'||v==='office'||v==='showroom'||v==='warehouse'||v==='land / plot'||v==='land'||v==='plot'}
function match(v,w){v=clean(v);w=clean(w);if(!w)return true;if(w==='commercial')return commercial(v);if(w==='heavy deposit')return v==='heavy deposit'||v.indexOf('heavy deposit')!==-1;return v===w}
function typeOf(card){var b=card&&card.querySelector('.details .detail:first-child b');return b?b.textContent:''}
function clearButtons(id){document.querySelectorAll('.quick button').forEach(function(b){b.classList.toggle('active',b.id===id)})}
function apply(scroll){
 var host=document.getElementById('homeList');if(!host)return;
 var wanted=active,target=null;
 host.querySelectorAll('.realynkListingRow').forEach(function(row){var ok=!wanted||match(row.dataset.type||'',wanted);row.style.display=ok?'':'none';if(ok&&!target)target=row});
 host.querySelectorAll('.property').forEach(function(card){var ok=!wanted||match(typeOf(card),wanted);card.style.display=ok?'':'none';if(ok&&!target)target=card});
 if(scroll&&target&&target.scrollIntoView){try{target.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){target.scrollIntoView()}}
}
function choose(id,e){
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 active=ids[id]||'';
 window.__REALYNK_CATEGORY_FILTER__='';
 window.__REALYNK_CATEGORY_UI_FILTER__=active;
 clearButtons(id);
 var search=document.getElementById('search');if(search)search.value='';
 var home=document.getElementById('home');if(home&&!home.classList.contains('active')){document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s===home)});document.querySelectorAll('.bottom button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-nav')==='home')});window.scrollTo(0,0)}
 apply(true);
 [50,150,350,700,1200,2000,3500].forEach(function(ms){setTimeout(function(){apply(false)},ms)});
}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;if(!b||!ids[b.id])return;choose(b.id,e)},true);
function ensureHeavy(){var q=document.querySelector('.quick');if(!q)return;var b=document.getElementById('heavyDeposit');if(!b){b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.innerHTML='💰<b>Heavy Deposit</b>';q.appendChild(b)}}
function removeLand(){var type=document.getElementById('type');if(!type)return;Array.prototype.slice.call(type.options).forEach(function(o){var v=clean(o.value),t=clean(o.textContent);if(v==='land / plot'||v==='land'||v==='plot'||t.indexOf('land / plot')!==-1)o.remove()});if(!type.querySelector('option[value="Heavy Deposit"]')){var o=document.createElement('option');o.value='Heavy Deposit';o.textContent='💰 Heavy Deposit';type.appendChild(o)}}
function watch(){ensureHeavy();removeLand();apply(false)}
function start(){watch();var host=document.getElementById('homeList');if(host&&!host.__realynkCategoryObserver){host.__realynkCategoryObserver=true;new MutationObserver(function(){if(active)setTimeout(function(){apply(false)},0)}).observe(host,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
setInterval(function(){ensureHeavy();removeLand()},500);
var style=document.createElement('style');style.textContent='.quick button:focus,.quick button:focus-visible,.quick button.active{outline:none!important;box-shadow:none!important}.quick button.active{border:1px solid var(--line)!important;background:#fff!important}';document.head.appendChild(style);
})();