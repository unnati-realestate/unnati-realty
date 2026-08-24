/* Realynk Share/Contact UI repair — clean Call, WhatsApp and branded Share actions. */
(function(){
  'use strict';
  const digits=v=>String(v||'').replace(/\D/g,'');
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function getPhone(card){
    const data=card.querySelector('[data-call],[data-wa]');
    if(data){ const p=digits(data.dataset.call||data.dataset.wa); if(p)return p; }
    const buttons=card.querySelectorAll('button');
    for(const b of buttons){
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
    if(navigator.share){ navigator.share({title,text,url:shareUrl.href}).catch(e=>{if(e?.name!=='AbortError')copy(shareUrl.href,text);}); }
    else copy(shareUrl.href,text);
  }
  function copy(url,text){
    const value=text+'\n'+url;
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(value).then(()=>alert('Branded Realynk property link copied. You can paste it on WhatsApp.')).catch(()=>fallback(url));
    }else fallback(url);
  }
  function fallback(url){ window.prompt('Copy this Realynk property link:',url); }

  function repair(){
    document.querySelectorAll('.property').forEach(card=>{
      let row=card.querySelector('.rn-actions');
      if(!row){
        const buttons=[...card.querySelectorAll('button')];
        const hasAction=buttons.some(b=>/call|whatsapp|share/i.test(b.textContent||''));
        if(!hasAction)return;
        row=document.createElement('div'); row.className='rn-actions'; card.appendChild(row);
      }
      const phone=getPhone(card);
      const oldShare=card.querySelector('[data-share]');
      const shareId=oldShare?.dataset.share||'';
      row.innerHTML=(phone
        ? '<button type="button" class="rn-clean-call">📞 Call Broker</button><button type="button" class="rn-clean-wa">💬 WhatsApp</button>'
        : '<button type="button" disabled>📞 Call Broker</button><button type="button" disabled>💬 WhatsApp</button>')
        +'<button type="button" class="rn-clean-share" data-share-id="'+esc(shareId)+'">↗️ Share</button>';
      row.querySelector('.rn-clean-call')?.addEventListener('click',()=>{location.href='tel:+91'+phone;});
      row.querySelector('.rn-clean-wa')?.addEventListener('click',()=>{const title=card.querySelector('h3')?.textContent?.trim()||'Property';location.href='https://wa.me/91'+phone+'?text='+encodeURIComponent('Hi, I found your property on Realynk: '+title);});
      row.querySelector('.rn-clean-share')?.addEventListener('click',()=>share(card));
    });
  }

  function start(){
    repair();
    const mo=new MutationObserver(()=>repair());
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(repair,500);setTimeout(repair,1500);setTimeout(repair,3000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
