/* REALYNK PROPERTY FILTER V3 — low-CPU category filtering */
(function(){'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V3__)return;window.__REALYNK_PROPERTY_FILTER_V3__=true;
var active='All',timer=0;
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v||'').trim().toLowerCase()}
function match(p){return active==='All'||norm(p&&p.type)===norm(active)}
function setBar(){var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');if(!bar||!title)return;bar.style.display=active==='All'?'none':'flex';title.textContent=active+' Properties'}
function applyNow(){var list=document.getElementById('homeList');if(!list)return;var ps=props(),cards=Array.prototype.slice.call(list.children||[]).filter(function(c){return c.id!=='realynkFilterEmpty'});if(!ps.length){cards.forEach(function(c){c.style.display=''});return}
 cards.forEach(function(card){card.style.display=''});
 ps.forEach(function(p){var t=norm(p.title),a=norm(p.area);var card=cards.find(function(c){var s=norm(c.textContent);return(t&&s.indexOf(t)>=0)||(a&&s.indexOf(a)>=0)});if(card&&p.id!=null)card.dataset.realynkPropertyId=String(p.id)});
 var visible=false;cards.forEach(function(card){var p=ps.find(function(x){return String(x.id||'')===String(card.dataset.realynkPropertyId||'')});var show=active==='All'||!!(p&&match(p));card.style.display=show?'':'none';if(show)visible=true});
 var m=document.getElementById('realynkFilterEmpty');if(active!=='All'&&!visible){if(!m){m=document.createElement('div');m.id='realynkFilterEmpty';m.className='empty';list.appendChild(m)}m.textContent='No '+active.toLowerCase()+' properties available.';m.style.display=''}else if(m)m.style.display='none'}
function apply(){setBar();clearTimeout(timer);timer=setTimeout(applyNow,120)}
function click(e){var el=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');if(!el)return;var id=el.id;active=id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':'Commercial';apply();setTimeout(applyNow,500)}
document.addEventListener('click',click,false);
function start(){apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkPropertyFilter={setFilter:function(v){active=v||'All';apply()},getFilter:function(){return active}};
})();
