/* REALYNK CATEGORY FILTER V12 — reliable type parsing + reliable category jump */
(function(){'use strict';if(window.__REALYNK_CATEGORY_FILTER_V12__)return;window.__REALYNK_CATEGORY_FILTER_V12__=true;var active='All';
function injectHeavy(){var q=document.querySelector('.quick');if(!q||document.getElementById('heavyDeposit'))return;var b=document.createElement('button');b.id='heavyDeposit';b.type='button';b.className='heavy';b.innerHTML='💰<b>Heavy Deposit</b>';q.appendChild(b)}
function typeOf(c){
 var d=c.querySelector('.details .detail:first-child b');
 var v=d?String(d.textContent||'').trim():'';
 if(v){v=v.replace(/^TYPE\s*:?\s*/i,'').trim();var m=v.match(/^(Heavy Deposit|Commercial|Rent|Sale|Buy)\b/i);if(m)return m[1]}
 var t=String(c.textContent||'').toLowerCase();
 if(/heavy\s+deposit/.test(t))return'Heavy Deposit';if(/\bcommercial\b/.test(t))return'Commercial';if(/\brent\b/.test(t))return'Rent';if(/\bsale\b/.test(t))return'Sale';if(/\bbuy\b/.test(t))return'Buy';return''
}
function cards(){var l=document.getElementById('homeList');return l?[...l.querySelectorAll('.property')]:[]}
function apply(){var l=document.getElementById('homeList');if(!l)return 0;var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');if(bar)bar.style.display=active==='All'?'none':'flex';if(title)title.textContent=active==='All'?'':active+' Properties';var n=0;cards().forEach(function(c){var ok=active==='All'||typeOf(c).toLowerCase()===active.toLowerCase();c.style.display=ok?'':'none';if(ok)n++});return n}
function focus(){if(active==='All')return;var c=cards().find(function(x){return x.style.display!=='none'});if(!c)return;var y=c.getBoundingClientRect().top+window.scrollY-118;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})}
function run(v){active=v||'All';var n=apply();if(n)focus();[120,450,900,1500].forEach(function(ms){setTimeout(function(){var count=apply();if(count)focus()},ms)})}
function bind(){injectHeavy();var m={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit',clearFilter:'All'};Object.keys(m).forEach(function(id){var b=document.getElementById(id);if(b)b.onclick=function(e){e.preventDefault();e.stopPropagation();run(m[id])}});apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(bind,50)},{once:true});else setTimeout(bind,50);
window.realynkCategoryFilter={setFilter:run,refresh:apply}
})();
(function(){'use strict';function load(src,key,module){if(window[key]||document.querySelector('script[data-realynk-loader="'+key+'"]'))return;var s=document.createElement('script');s.src=src;s.async=true;if(module)s.type='module';s.dataset.realynkLoader=key;document.head.appendChild(s)}load('./realynk-broker-invite.js?v=6','realynkBrokerInvite',false);load('./realynk-broker-invite-cloud.js?v=3','realynkBrokerInviteCloud',false);load('./realynk-admin-entry.js?v=7','realynkAdminEntry',true);load('./realynk-broker-list-cloud.js?v=1','realynkBrokerDirectory',false);load('./realynk-verification-sync.js?v=3','realynkBrokerVerificationSyncV3',true)})();