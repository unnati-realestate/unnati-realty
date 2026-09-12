/* REALYNK PROPERTY DISPLAY V7 — reliable amount + size rows for every listing type */
(function(){'use strict';
if(window.__REALYNK_PROPERTY_DISPLAY_V7__)return;window.__REALYNK_PROPERTY_DISPLAY_V7__=true;
function read(){try{var x=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}}
function norm(x){return String(x||'').toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g,' ').trim()}
function words(x){return norm(x).split(/\s+/).filter(function(w){return w.length>1})}
function areaFromCard(card){var s=String(card.textContent||'');var m=s.match(/📍\s*([^\n]+?)(?:\s+(?:CARPET|TYPE|PRICE|RENT|DEPOSIT|SALE)\b|$)/i);return norm(m?m[1]:'')}
function score(p,title,area,index,list){var pt=norm(p.title),pa=norm(p.area),s=0;if(pt===title)s+=120;else if(title&&pt&&(pt.indexOf(title)>=0||title.indexOf(pt)>=0))s+=60;var aw=words(area),pw=words(pa);if(area&&pa===area)s+=90;else if(area&&pa&&(pa.indexOf(area)>=0||area.indexOf(pa)>=0))s+=50;aw.forEach(function(w){if(pw.indexOf(w)>=0)s+=7});var pos=list.indexOf(p);if(pos>=0)s+=Math.max(0,6-Math.abs(index-pos));return s}
function findProp(card,list,index){var id=String(card.getAttribute('data-realynk-id')||'');if(id){var direct=list.find(function(p){return String(p&&p.id)==id});if(direct)return direct}var h=card.querySelector('h3'),title=norm(h&&h.textContent),area=areaFromCard(card),best=null,bs=-1;list.forEach(function(p){var s=score(p,title,area,index,list);if(s>bs){bs=s;best=p}});return bs>0?best:null}
function money(v){var s=String(v==null?'':v).trim();if(!s)return'—';if(/^₹/.test(s))return s;var raw=s.replace(/,/g,'').replace(/\s/g,'');if(/^\d+(?:\.\d+)?$/.test(raw)){var n=Number(raw);if(isFinite(n)){return '₹'+n.toLocaleString('en-IN',{maximumFractionDigits:2})}}return s}
function addStyle(){if(document.getElementById('realynkPropertyDisplayV7Style'))return;var st=document.createElement('style');st.id='realynkPropertyDisplayV7Style';st.textContent='.details{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.details .detail{min-width:0}.details .detail span{display:block;color:var(--muted);font-size:12px;font-weight:700;margin-bottom:4px}.details .detail b{display:block;font-size:16px;color:var(--navy);line-height:1.3;word-break:break-word}';document.head.appendChild(st)}
function setDetail(box,label,value){var d=document.createElement('div');d.className='detail';var sp=document.createElement('span');sp.textContent=label;var b=document.createElement('b');b.textContent=value;d.appendChild(sp);d.appendChild(b);box.appendChild(d)}
function apply(){addStyle();var list=read(),cards=Array.prototype.slice.call(document.querySelectorAll('#homeList .property'));cards.forEach(function(card,i){var p=findProp(card,list,i);if(!p)return;var type=String(p.type||card.getAttribute('data-realynk-type')||'').trim(),t=type.toLowerCase(),sig=[type,p.price,p.deposit,p.size,p.id].map(function(x){return String(x==null?'':x)}).join('|');if(card.getAttribute('data-realynk-card-sig')===sig)return;var old=card.querySelector('.details'),box=old||document.createElement('div');box.className='details';box.innerHTML='';
if(t==='rent'){setDetail(box,'RENT',money(p.price));setDetail(box,'DEPOSIT',money(p.deposit))}
else if(t==='heavy deposit'){setDetail(box,'AMOUNT / DEPOSIT',money(p.price));setDetail(box,'DEPOSIT',money(p.deposit))}
else if(t==='sale'){setDetail(box,'SALE PRICE',money(p.price));setDetail(box,'CARPET / USABLE AREA',String(p.size||'—'))}
else if(t==='buy'){setDetail(box,'PRICE',money(p.price));setDetail(box,'CARPET / USABLE AREA',String(p.size||'—'))}
else if(t==='commercial'){setDetail(box,'PRICE / RENT',money(p.price));setDetail(box,'CARPET / USABLE AREA',String(p.size||'—'))}
else{setDetail(box,'PRICE',money(p.price));setDetail(box,'CARPET / USABLE AREA',String(p.size||'—'))}
if(t==='rent'||t==='heavy deposit')setDetail(box,'CARPET / USABLE AREA',String(p.size||'—'));
card.setAttribute('data-realynk-type',type);if(p.id!=null)card.setAttribute('data-realynk-id',String(p.id));card.setAttribute('data-realynk-card-sig',sig);if(old&&old!==box)old.replaceWith(box);else if(!old){var media=card.querySelector('.listingMedia');if(media)media.before(box);else card.appendChild(box)}})}
function start(){apply();window.addEventListener('realynkCloudPropertiesRestored',function(){setTimeout(apply,100);setTimeout(apply,800)});var host=document.getElementById('homeList');if(host&&window.MutationObserver)new MutationObserver(function(){setTimeout(apply,0)}).observe(host,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,80)},{once:true});else setTimeout(start,80);
window.realynkPropertyDisplay={refresh:apply};
})();
