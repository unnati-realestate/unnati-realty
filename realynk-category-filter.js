/* REALYNK CATEGORY FILTER V7 — stable loaders */
(function(){
'use strict';
if(window.__REALYNK_CATEGORY_FILTER_V7__)return;window.__REALYNK_CATEGORY_FILTER_V7__=true;var active='All';
function injectHeavy(){var q=document.querySelector('.quick');if(!q||document.getElementById('heavyDeposit'))return;var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.className='heavy';b.innerHTML='💰<b>Heavy Deposit</b>';q.appendChild(b)}
function typeOf(c){var d=c.querySelector('.details .detail:first-child b');if(d&&d.textContent.trim())return d.textContent.trim();var t=String(c.textContent||'').toLowerCase();if(t.includes('heavy deposit'))return'Heavy Deposit';if(t.includes('commercial'))return'Commercial';if(t.includes('rent'))return'Rent';if(t.includes('sale'))return'Sale';if(t.includes('buy'))return'Buy';return''}
function cards(){var l=document.getElementById('homeList');return l?[...l.querySelectorAll('.property')]:[]}
function apply(){var l=document.getElementById('homeList');if(!l)return 0;var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');if(bar)bar.style.display=active==='All'?'none':'flex';if(title)title.textContent=active==='All'?'':active+' Properties';var n=0;cards().forEach(function(c){var ok=active==='All'||typeOf(c).toLowerCase()===active.toLowerCase();c.style.display=ok?'':'none';if(ok)n++});return n}
function focus(){if(active==='All')return;var c=cards().find(function(x){return x.style.display!=='none'});if(c)window.scrollTo(0,Math.max(0,c.getBoundingClientRect().top+scrollY-118))}
function run(v){active=v||'All';apply();focus();[120,450,900,1500].forEach(function(ms){setTimeout(function(){if(apply())focus()},ms)})}
function bind(){injectHeavy();var m={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit',clearFilter:'All'};Object.keys(m).forEach(function(id){var b=document.getElementById(id);if(b)b.onclick=function(e){e.preventDefault();run(m[id])}});apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(bind,50)},{once:true});else setTimeout(bind,50);window.realynkCategoryFilter={setFilter:run,refresh:apply};
})();
(function(){'use strict';function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';s.dataset.realynkLoader=key;document.head.appendChild(s)}load('./realynk-broker-invite.js?v=4','realynkBrokerInvite',false);load('./realynk-broker-invite-cloud.js?v=1','realynkBrokerInviteCloud',false);load('./realynk-admin-entry.js?v=6','realynkAdminEntry',true)})();
