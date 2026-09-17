/* REALYNK CATEGORY FINAL CONTROLLER — unified category filtering */
(function(){
'use strict';
if(window.__REALYNK_CATEGORY_FINAL_CONTROLLER__)return;
window.__REALYNK_CATEGORY_FINAL_CONTROLLER__=true;

function clean(v){return String(v||'').trim().toLowerCase()}
function commercial(v){v=clean(v);return v==='commercial'||v.indexOf('commercial')!==-1||v==='shop'||v==='office'||v==='showroom'||v==='warehouse'||v==='land / plot'||v==='land'||v==='plot'}
function matches(v,w){
  v=clean(v); w=clean(w);
  if(!w)return true;
  if(w==='commercial')return commercial(v);
  if(w==='heavy deposit')return v==='heavy deposit'||v.indexOf('heavy deposit')!==-1;
  return v===w;
}
function cardType(card){var b=card&&card.querySelector('.details .detail:first-child b');return b?b.textContent:''}
function current(){return window.__REALYNK_CATEGORY_UI_FILTER__||''}
function apply(scroll){
  var wanted=current(),host=document.getElementById('homeList');
  if(!host)return;
  var first=null;
  host.querySelectorAll('.realynkListingRow').forEach(function(row){var ok=!wanted||matches(row.dataset.type||'',wanted);row.style.display=ok?'':'none';if(ok&&!first)first=row});
  host.querySelectorAll('.property').forEach(function(card){var ok=!wanted||matches(cardType(card),wanted);card.style.display=ok?'':'none';if(scroll&&ok&&!first)first=card});
  if(scroll&&first){try{first.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){first.scrollIntoView()}}
}
function selectCategory(id){
  var wanted={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial',heavyDeposit:'Heavy Deposit'}[id]||'';
  window.__REALYNK_CATEGORY_UI_FILTER__=wanted;
  window.__REALYNK_CATEGORY_FILTER__='';
  document.querySelectorAll('.quick button').forEach(function(b){b.classList.remove('active')});
  var btn=document.getElementById(id);if(btn)btn.classList.add('active');
  var s=document.getElementById('search');if(s)s.dispatchEvent(new Event('input',{bubbles:true}));
  [0,50,150,300,600,1000,1800,3000].forEach(function(ms){setTimeout(function(){apply(ms===0)},ms)});
}
function installClick(){
  window.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.quick button'):null;if(!b)return;
    var id=b.id;if(!({buy:1,sale:1,rent:1,commercial:1,heavyDeposit:1}[id]))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();selectCategory(id);
  },true);
}
function installObserver(){
  var host=document.getElementById('homeList');if(!host){setTimeout(installObserver,100);return}
  if(window.__REALYNK_CATEGORY_FINAL_OBSERVER__)return;window.__REALYNK_CATEGORY_FINAL_OBSERVER__=true;
  var timer=0;
  var observer=new MutationObserver(function(){if(!current())return;clearTimeout(timer);timer=setTimeout(function(){apply(false)},0)});
  observer.observe(host,{childList:true,subtree:true});
  window.__REALYNK_CATEGORY_FINAL_REFRESH__=function(){apply(false)};
  setTimeout(function(){apply(false)},100);
}
function removeLand(){var type=document.getElementById('type');if(!type)return;Array.prototype.slice.call(type.options).forEach(function(o){var v=clean(o.value),t=clean(o.textContent);if(v==='land / plot'||v==='land'||v==='plot'||t.indexOf('land / plot')!==-1)o.remove()})}
function setupForm(){
  var type=document.getElementById('type');if(!type)return;
  if(!type.querySelector('option[value="Heavy Deposit"]')){var o=document.createElement('option');o.value='Heavy Deposit';o.textContent='💰 Heavy Deposit';type.appendChild(o)}
  function sync(){var v=String(type.value||''),deposit=document.getElementById('depositField');if(deposit)deposit.style.display=(v==='Heavy Deposit'||v==='Rent')?'block':'none'}
  type.addEventListener('change',sync,false);sync();removeLand();setInterval(removeLand,500);
}
function css(){if(document.getElementById('realynkCategoryFinalCSS'))return;var s=document.createElement('style');s.id='realynkCategoryFinalCSS';s.textContent='.quick button:focus,.quick button:focus-visible,.quick button.active{outline:none!important;box-shadow:none!important}.quick button.active{border:1px solid var(--line)!important;background:#fff!important}';document.head.appendChild(s)}
function start(){installClick();installObserver();setupForm();css()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
