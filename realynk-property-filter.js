/* REALYNK PROPERTY FILTER V1 — reliable Buy/Sale/Rent/Commercial filtering */
(function(){'use strict';
if(window.__REALYNK_PROPERTY_FILTER_V1__)return;window.__REALYNK_PROPERTY_FILTER_V1__=true;
var active='All';
function props(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function norm(v){return String(v||'').trim().toLowerCase()}
function typeOf(p){return norm(p&&p.type)}
function match(p){return active==='All'||typeOf(p)===norm(active)}
function setBar(){var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');if(!bar||!title)return;bar.style.display=active==='All'?'none':'flex';title.textContent=active+' Properties'}
function mapCards(){var list=document.getElementById('homeList');if(!list)return;var ps=props(),cards=Array.prototype.slice.call(list.children||[]);if(!ps.length){cards.forEach(function(c){c.style.display=''});return}
 cards.forEach(function(card){card.style.display=''});
 ps.forEach(function(p){var title=norm(p.title),area=norm(p.area);var card=cards.find(function(c){var t=norm(c.textContent);return (title&&t.indexOf(title)>=0)||(area&&t.indexOf(area)>=0)});if(card)card.dataset.realynkPropertyId=String(p.id||'')});
 cards.forEach(function(card){var id=card.dataset.realynkPropertyId;var p=ps.find(function(x){return String(x.id||'')===String(id)});if(!p){card.style.display=active==='All'?'':'none';return}card.style.display=match(p)?'':'none'});
 var visible=cards.some(function(c){return c.style.display!=='none'});if(!visible&&active!=='All'){list.innerHTML='<div class="empty">No '+active.toLowerCase()+' properties available.</div>'}
}
function apply(){setBar();setTimeout(mapCards,80);setTimeout(mapCards,350)}
function click(e){var el=e.target.closest('#buy,#sale,#rent,#commercial,#clearFilter');if(!el)return;var id=el.id;active=id==='clearFilter'?'All':id==='buy'?'Buy':id==='sale'?'Sale':id==='rent'?'Rent':'Commercial';apply()}
document.addEventListener('click',click,false);
var obs=new MutationObserver(function(){if(active!=='All')mapCards()});
function start(){var list=document.getElementById('homeList');if(list)obs.observe(list,{childList:true,subtree:true});apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.realynkPropertyFilter={setFilter:function(v){active=v||'All';apply()},getFilter:function(){return active}};
})();
