/* Realynk action buttons — stable, single Call / WhatsApp / Share row. */
(function(){
  'use strict';
  const digits=v=>String(v||'').replace(/\D/g,'');
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function getPhone(card){
    const data=card.querySelector('[data-call],[data-wa]');
    if(data){ const p=digits(data.dataset.call||data.dataset.wa); if(p)return p; }
    for(const b of card.querySelectorAll('button,a')){
      const s=String(b.getAttribute('onclick')||'')+' '+String(b.getAttribute('href')||'');
      const m=s.match(/(?:tel:\+?91|wa\.me\/(?:91)?)(\d{10})/i);
      if(m)return m[1];
    }
    return digits(localStorage.getItem('realynkBrokerPhone')||'');
  }

  function share(card){
    const title=(card.querySelector('h3')?.textContent||'Realynk Property').trim();
    const area=(card.querySelector('.rn-muted,.rt-lock')?.textContent||'').replace(/^📍\s*/,'').trim();
    const shareUrl=new URL('./share.html',location.href);
    shareUrl.searchParams.set('title',title);
    if(area) shareUrl.searchParams.set('area',area);
    const text=title+(area?'\n📍 '+area:'')+'\n\nListed on Realynk — India\'s Real Estate Agent Network.';
    if(navigator.share){
      navigator.share({title,text,url:shareUrl.href}).catch(e=>{if(e?.name!=='AbortError')copy(shareUrl.href,text);});
    }else copy(shareUrl.href,text);
  }
  function copy(url,text){
    const value=text+'\n'+url;
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(value).then(()=>alert('Realynk property link copied.')).catch(()=>fallback(url));
    }else fallback(url);
  }
  function fallback(url){ window.prompt('Copy this Realynk property link:',url); }

  function cleanCard(card){
    if(card.dataset.realynkActions==='1' && card.querySelector('.rn-actions')) return;
    const phone=getPhone(card);

    // Remove malformed injected Share/JS text and all older action rows/buttons.
    card.querySelectorAll('*').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t.includes('navigator.clipboard') || t.includes('writeText(location.href)') || t.includes("Property link copied")) el.remove();
    });
    card.querySelectorAll('.rn-actions').forEach(el=>el.remove());
    card.querySelectorAll('button,a').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(/^(📞?\s*)?(Call Broker|Call|WhatsApp|Share|↗️ Share)$/i.test(t) || /navigator\.clipboard|writeText/.test(el.getAttribute('onclick')||'')) el.remove();
    });

    const row=document.createElement('div');
    row.className='rn-actions';
    row.dataset.realynkActions='1';
    row.innerHTML=(phone
      ? '<button type="button" class="rn-clean-call">📞 Call Broker</button><button type="button" class="rn-clean-wa">💬 WhatsApp</button>'
      : '<button type="button" disabled>📞 Call Broker</button><button type="button" disabled>💬 WhatsApp</button>')
      +'<button type="button" class="rn-clean-share">↗️ Share</button>';

    card.appendChild(row);
    row.querySelector('.rn-clean-call')?.addEventListener('click',()=>{location.href='tel:+91'+phone;});
    row.querySelector('.rn-clean-wa')?.addEventListener('click',()=>{
      const title=card.querySelector('h3')?.textContent?.trim()||'Property';
      location.href='https://wa.me/91'+phone+'?text='+encodeURIComponent('Hi, I found your property on Realynk: '+title);
    });
    row.querySelector('.rn-clean-share')?.addEventListener('click',()=>share(card));
  }

  function repair(){
    document.querySelectorAll('.property').forEach(cleanCard);
  }

  function start(){
    repair();
    const mo=new MutationObserver(()=>repair());
    mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
