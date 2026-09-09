/* REALYNK PROPERTY ACTION BUTTONS V2 — legacy + current card compatible */
(function(){
  'use strict';
  if(window.__REALYNK_PROPERTY_BUTTONS_V2__)return;
  window.__REALYNK_PROPERTY_BUTTONS_V2__=true;

  function addStyles(){
    if(document.getElementById('realynkPropertyButtonStyles'))return;
    var s=document.createElement('style');
    s.id='realynkPropertyButtonStyles';
    s.textContent='.realynkActionsReady{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.realynkActionsReady button{flex:1 1 120px;min-width:120px}.realynkExtraBtn{cursor:pointer}.realynkEnquireBtn{border:1px solid #0b3768!important;color:#0b3768!important;background:#fff!important}.realynkShareBtn{border:1px solid #f4b400!important;color:#17324d!important;background:#fffaf0!important}';
    document.head.appendChild(s);
  }

  function toast(msg){
    var t=document.getElementById('toast');
    if(!t)return;
    t.textContent=msg;t.style.display='block';
    clearTimeout(window.__realynkActionToast);
    window.__realynkActionToast=setTimeout(function(){t.style.display='none'},1800);
  }

  function shareProperty(title){
    var url=location.href.split('#')[0];
    var data={title:title||'Realynk Property',text:'Check this property on Realynk: '+(title||'Property'),url:url};
    if(navigator.share){navigator.share(data).catch(function(){});return}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){toast('Property link copied')}).catch(function(){prompt('Copy property link:',url)});
      return;
    }
    prompt('Copy property link:',url);
  }

  function enhance(root){
    if(!root)return;
    var cards=[];
    if(root.matches&&root.matches('.property'))cards=[root];
    if(root.querySelectorAll)cards=cards.concat(Array.prototype.slice.call(root.querySelectorAll('.property')));
    cards.forEach(function(card){
      var existing=card.querySelector('.realynkActionsReady');
      var nativeActions=card.querySelector('.actions');
      var title=(card.querySelector('h3')?.textContent||'Property').trim();

      if(nativeActions){
        if(existing)return;
        existing=nativeActions;
        existing.classList.add('realynkActionsReady');
      }else{
        existing=document.createElement('div');
        existing.className='realynkActionsReady';
        var oldWa=Array.prototype.slice.call(card.querySelectorAll('button')).find(function(b){return String(b.getAttribute('onclick')||'').indexOf('wa.me')>=0});
        var oldTel=Array.prototype.slice.call(card.querySelectorAll('button')).find(function(b){return String(b.getAttribute('onclick')||'').indexOf('tel:+91')>=0});
        var wa=oldWa&&String(oldWa.getAttribute('onclick')||'').match(/wa\.me\/91([0-9]+)/);
        var tel=oldTel&&String(oldTel.getAttribute('onclick')||'').match(/tel:\+91([0-9]+)/);
        var phone=(tel&&tel[1])||(wa&&wa[1])||'';
        if(oldWa){oldWa.parentNode.removeChild(oldWa)}
        var call=document.createElement('button');call.type='button';call.textContent='📞 Call';call.className='primary';call.onclick=function(){if(phone)location.href='tel:+91'+phone;else toast('Broker contact is not available')};
        var whatsapp=document.createElement('button');whatsapp.type='button';whatsapp.textContent='💬 WhatsApp';whatsapp.className='primary';whatsapp.onclick=function(){if(phone)window.open('https://wa.me/91'+phone+'?text='+encodeURIComponent('Hi, I found this property on Realynk: '+title),'_blank');else toast('Broker contact is not available')};
        existing.append(call,whatsapp);
        card.appendChild(existing);
      }

      if(existing.querySelector('.realynkExtraBtn'))return;
      var waBtn=Array.prototype.slice.call(existing.querySelectorAll('button')).find(function(b){return String(b.textContent||'').toLowerCase().indexOf('whatsapp')>=0});
      var enquire=document.createElement('button');
      enquire.type='button';enquire.className='realynkExtraBtn realynkEnquireBtn';enquire.textContent='✉️ Enquire';
      enquire.onclick=function(){
        if(waBtn){waBtn.click();return}
        toast('Broker contact is not available');
      };
      var share=document.createElement('button');
      share.type='button';share.className='realynkExtraBtn realynkShareBtn';share.textContent='🔗 Share';
      share.onclick=function(){shareProperty(title)};
      existing.append(enquire,share);
    });
  }

  function refresh(){
    enhance(document.getElementById('homeList'));
    enhance(document.getElementById('myList'));
  }

  function hook(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__realynkButtonsHook)return;
    function wrapped(){var r=fn.apply(this,arguments);setTimeout(refresh,0);return r}
    wrapped.__realynkButtonsHook=true;
    window[name]=wrapped;
  }

  function start(){
    addStyles();
    refresh();
    hook('render');
    hook('dashboard');
    setTimeout(refresh,300);
    setTimeout(refresh,1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
