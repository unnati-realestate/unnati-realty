/* REALYNK PROPERTY ACTION BUTTONS — lightweight public-card enhancement */
(function(){
  'use strict';
  if(window.__REALYNK_PROPERTY_BUTTONS_V1__)return;
  window.__REALYNK_PROPERTY_BUTTONS_V1__=true;

  function addStyles(){
    if(document.getElementById('realynkPropertyButtonStyles'))return;
    var s=document.createElement('style');
    s.id='realynkPropertyButtonStyles';
    s.textContent='.actions.realynkActionsReady{flex-wrap:wrap}.realynkExtraBtn{cursor:pointer}.realynkEnquireBtn{border-color:#0b3768!important;color:#0b3768!important}.realynkShareBtn{border-color:#6b7280!important;color:#374151!important}';
    document.head.appendChild(s);
  }

  function shareProperty(card,title){
    var url=location.href.split('#')[0];
    var data={title:title||'Realynk Property',text:'Check this property on Realynk: '+(title||'Property'),url:url};
    if(navigator.share){navigator.share(data).catch(function(){});return}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){
        var t=document.getElementById('toast');
        if(t){t.textContent='Property link copied';t.style.display='block';setTimeout(function(){t.style.display='none'},1800)}
      }).catch(function(){prompt('Copy property link:',url)});
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
      var actions=card.querySelector('.actions');
      if(!actions||actions.querySelector('.realynkExtraBtn'))return;
      actions.classList.add('realynkActionsReady');
      var title=(card.querySelector('h3')?.textContent||'Property').trim();
      var wa=actions.querySelector('button[onclick*="wa.me"]');

      var enquire=document.createElement('button');
      enquire.type='button';
      enquire.className='realynkExtraBtn realynkEnquireBtn';
      enquire.textContent='✉️ Enquire';
      enquire.onclick=function(){
        if(wa){wa.click();return;}
        var phone=card.querySelector('button[onclick*="tel:+91"]');
        if(phone){phone.click();return;}
        var t=document.getElementById('toast');
        if(t){t.textContent='Broker contact is not available';t.style.display='block';setTimeout(function(){t.style.display='none'},2000)}
      };

      var share=document.createElement('button');
      share.type='button';
      share.className='realynkExtraBtn realynkShareBtn';
      share.textContent='🔗 Share';
      share.onclick=function(){shareProperty(card,title)};
      actions.append(enquire,share);
    });
  }

  function start(){
    addStyles();
    enhance(document);
    var list=document.getElementById('homeList');
    if(list&&window.MutationObserver){
      var observer=new MutationObserver(function(){enhance(list)});
      observer.observe(list,{childList:true});
    }
    var dash=document.getElementById('myList');
    if(dash&&window.MutationObserver){
      var observer2=new MutationObserver(function(){enhance(dash)});
      observer2.observe(dash,{childList:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
