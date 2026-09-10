/* REALYNK CATEGORY FILTER V3 — instant filtered-list focus */
(function(){
'use strict';
if(window.__REALYNK_CATEGORY_FILTER_V3__)return;
window.__REALYNK_CATEGORY_FILTER_V3__=true;
var active='All';
function injectHeavy(){
 var q=document.querySelector('.quick');
 if(!q||document.getElementById('heavyDeposit'))return;
 var b=document.createElement('button');
 b.id='heavyDeposit';b.type='button';b.className='heavy';b.innerHTML='💰<b>Heavy Deposit</b>';
 q.appendChild(b);
}
function typeOf(card){
 var d=card.querySelector('.details .detail:first-child b');
 if(d&&d.textContent.trim()){
   var v=d.textContent.trim();
   if(/^buy$/i.test(v)||/^sale$/i.test(v)||/^rent$/i.test(v)||/^commercial$/i.test(v)||/^heavy deposit$/i.test(v))return v;
 }
 var text=String(card.textContent||'').toLowerCase();
 if(text.indexOf('heavy deposit')>=0)return 'Heavy Deposit';
 if(text.indexOf('commercial')>=0)return 'Commercial';
 if(text.indexOf('rent')>=0)return 'Rent';
 if(text.indexOf('sale')>=0)return 'Sale';
 if(text.indexOf('buy')>=0)return 'Buy';
 return '';
}
function cards(){
 var list=document.getElementById('homeList');
 if(!list)return [];
 return Array.prototype.slice.call(list.querySelectorAll('.property'));
}
function apply(){
 var list=document.getElementById('homeList');
 if(!list)return 0;
 var bar=document.getElementById('filterBar'),title=document.getElementById('filterTitle');
 if(bar)bar.style.display=active==='All'?'none':'flex';
 if(title)title.textContent=active==='All'?'':active+' Properties';
 var wanted=active.toLowerCase(),visible=0;
 cards().forEach(function(c){
   var show=active==='All'||typeOf(c).toLowerCase()===wanted;
   c.style.display=show?'':'none';
   if(show)visible++;
 });
 var empty=document.getElementById('realynkCategoryEmpty');
 if(active!=='All'&&!visible){
   if(!empty){empty=document.createElement('div');empty.id='realynkCategoryEmpty';empty.className='empty';list.appendChild(empty)}
   empty.textContent='No '+active.toLowerCase()+' properties available.';empty.style.display='';
 }else if(empty)empty.style.display='none';
 return visible;
}
function focusResults(){
 if(active==='All')return;
 var list=document.getElementById('homeList');
 if(!list)return;
 var target=cards().find(function(c){return c.style.display!=='none';});
 if(!target)return;
 var y=target.getBoundingClientRect().top+window.scrollY-118;
 if(y<0)y=0;
 window.scrollTo(0,y);
}
function run(v){
 active=v||'All';
 apply();
 focusResults();
 [120,450,900,1500].forEach(function(ms){setTimeout(function(){if(apply())focusResults();},ms)});
}
function bind(){
 injectHeavy();
 var map={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit',clearFilter:'All'};
 Object.keys(map).forEach(function(id){
   var b=document.getElementById(id);if(!b)return;
   b.onclick=function(e){e.preventDefault();run(map[id]);};
 });
 var s=document.getElementById('search');
 if(s)s.addEventListener('input',function(){active='All';setTimeout(apply,50)},false);
 var c=document.getElementById('clearFilter');
 if(c)c.onclick=function(e){e.preventDefault();if(s)s.value='';run('All');};
 apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(bind,50)},{once:true});else setTimeout(bind,50);
window.realynkCategoryFilter={setFilter:run,refresh:apply};
})();
