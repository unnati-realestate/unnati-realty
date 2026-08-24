/* Realynk Firebase entrypoint + lightweight property sharing fix. */
(function(){
  'use strict';

  function addShareButtons(root){
    var scope=root||document;
    scope.querySelectorAll('.property').forEach(function(card){
      if(card.querySelector('[data-realynk-share]')) return;
      var buttons=card.querySelectorAll('button');
      if(!buttons.length) return;

      var share=document.createElement('button');
      share.type='button';
      share.setAttribute('data-realynk-share','1');
      share.textContent='↗️ Share';
      share.className='primary realynk-share-btn';
      share.style.cssText='margin-left:8px;background:#fff;color:#0b3768;border:1px solid #dfe6ee;min-width:100px;';

      var last=buttons[buttons.length-1];
      last.insertAdjacentElement('afterend',share);
    });
  }

  async function shareCard(card){
    var title=(card.querySelector('h3')||{}).textContent||'Realynk Property';
    var location='';
    var firstDiv=card.querySelector('h3 + div');
    if(firstDiv) location=firstDiv.textContent.trim();
    var text=title+(location?'\n'+location:'')+'\n\nProperty listed on Realynk — India\'s Real Estate Agent Network.';
    var url=window.location.href.split('#')[0];

    if(navigator.share){
      try{
        await navigator.share({title:title,text:text,url:url});
        return;
      }catch(e){
        if(e && e.name==='AbortError') return;
      }
    }

    try{
      await navigator.clipboard.writeText(text+'\n'+url);
      alert('Property details copied. You can paste them on WhatsApp or anywhere.');
    }catch(e){
      window.prompt('Copy property details:',text+'\n'+url);
    }
  }

  function start(){
    addShareButtons(document);

    document.addEventListener('click',function(e){
      var btn=e.target.closest('[data-realynk-share]');
      if(!btn) return;
      e.preventDefault();
      e.stopPropagation();
      shareCard(btn.closest('.property'));
    },true);

    var list=document.getElementById('homeList');
    if(list){
      new MutationObserver(function(){addShareButtons(list);}).observe(list,{childList:true,subtree:true});
    }

    var myList=document.getElementById('myList');
    if(myList){
      new MutationObserver(function(){addShareButtons(myList);}).observe(myList,{childList:true,subtree:true});
    }

    setTimeout(function(){addShareButtons(document);},800);
    setTimeout(function(){addShareButtons(document);},2000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
