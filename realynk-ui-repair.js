/* REALYNK_UI_REPAIR_V2 - safe property-share repair. Avoids recursive MutationObserver loops. */
(function(){
  'use strict';
  const BAD=/navigator\.clipboard|writeText\(|Property link copied|location\.href\)\;alert/i;
  const cleanText=s=>String(s||'').replace(/\s+/g,' ').trim();
  let scheduled=false;

  function shareForCard(card){
    const title=card.querySelector('h3')?.textContent?.trim()||'Realynk Property';
    const area=card.querySelector('.rn-muted')?.textContent?.replace(/^📍\s*/,'').trim()||'';
    const price=card.querySelector('.detail:nth-child(2) b')?.textContent?.trim()||'';
    const text=`${title}${area?'\n📍 '+area:''}${price?'\n💰 '+price:''}\n\nListed on Realynk — India's Real Estate Agent Network.`;
    const url=location.href.split('#')[0];
    if(navigator.share){
      navigator.share({title,text,url}).catch(e=>{if(e?.name!=='AbortError')copy(text+'\n'+url);});
    }else copy(text+'\n'+url);
  }
  function copy(text){
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(text).then(()=>alert('Property link copied. You can paste it on WhatsApp.')).catch(()=>fallback(text));
    }else fallback(text);
  }
  function fallback(text){window.prompt('Copy property details/link:',text);}

  function repair(){
    scheduled=false;
    document.querySelectorAll('.property').forEach(card=>{
      const bad=Array.from(card.querySelectorAll('*')).find(el=>BAD.test(cleanText(el.textContent)));
      if(!bad)return;
      const row=bad.closest('.rn-actions,.realynk-actions')||bad.parentElement;
      if(!row)return;
      const good=Array.from(row.querySelectorAll('button')).find(b=>/^\s*(↗️?|Share)/i.test(cleanText(b.textContent)));
      if(good){
        if(cleanText(good.textContent)!=='↗️ Share') good.textContent='↗️ Share';
        good.onclick=()=>shareForCard(card);
      }else{
        row.innerHTML='<button type="button" class="rn-share-repaired">↗️ Share</button>';
        row.querySelector('.rn-share-repaired').onclick=()=>shareForCard(card);
      }
      Array.from(card.querySelectorAll('*')).forEach(el=>{
        if(el!==row&&BAD.test(cleanText(el.textContent))&&el.children.length===0)el.remove();
      });
    });
  }

  function scheduleRepair(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(repair);
  }

  function start(){
    repair();
    // Observe only for genuinely new DOM changes, with a scheduled/guarded repair.
    // This prevents the old repair() -> DOM mutation -> repair() infinite loop.
    const observer=new MutationObserver(records=>{
      if(records.some(r=>r.addedNodes&&r.addedNodes.length)) scheduleRepair();
    });
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(repair,800);
    setTimeout(repair,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
