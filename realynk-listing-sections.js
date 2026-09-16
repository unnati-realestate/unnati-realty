/* REALYNK LISTING SECTIONS — stable rows + clear rent deposit + land/plot + stable status */
(function(){
  'use strict';
  if(window.__REALYNK_LISTING_SECTIONS_V2__) return;
  window.__REALYNK_LISTING_SECTIONS_V2__=true;

  var CATS=[
    {key:'Rent',label:'🔑 Rent Properties'},
    {key:'Sale',label:'🏷️ Sale Properties'},
    {key:'Buy',label:'🏠 Buy Properties'},
    {key:'Commercial',label:'🏢 Commercial Properties'},
    {key:'Heavy Deposit',label:'💰 Heavy Deposit Properties'},
    {key:'Land / Plot',label:'🌳 Land / Plot Properties'}
  ];
  var cloudById={};

  function addTypeOption(){
    var type=document.getElementById('type');
    if(!type) return;
    if(!type.querySelector('option[value="Land / Plot"]')){
      var o=document.createElement('option');
      o.value='Land / Plot'; o.textContent='🌳 Land / Plot'; type.appendChild(o);
    }
    function sync(){
      var v=String(type.value||'');
      var deposit=document.getElementById('depositField');
      var price=document.getElementById('price');
      var label=price&&price.closest('.field')&&price.closest('.field').querySelector('label');
      if(deposit) deposit.style.display=(v==='Rent'||v==='Heavy Deposit')?'block':'none';
      if(label) label.textContent=(v==='Rent'?'Rent':v==='Heavy Deposit'?'Amount / Deposit':'Price');
      if(price) price.placeholder=(v==='Rent'?'₹25,000 / month':v==='Heavy Deposit'?'₹5,00,000':'₹85,00,000');
    }
    type.addEventListener('change',sync,false); sync();
  }

  function sectionFor(type){
    var t=String(type||'').trim().toLowerCase();
    return CATS.find(function(c){return c.key.toLowerCase()===t})||null;
  }

  function fixDeposit(card){
    var details=card.querySelector('.details');
    if(!details) return;
    var typeNode=details.querySelector('.detail:first-child b');
    var type=typeNode?typeNode.textContent.trim():'';
    if(type!=='Rent' && type!=='Heavy Deposit') return;
    var p=cloudById[String(card.dataset.propertyId||'')];
    var deposit=p&&p.deposit?String(p.deposit).trim():'';
    var old=[].slice.call(card.children).find(function(el){return /^\s*Deposit\s*:/i.test(el.textContent||'')});
    if(old && !deposit) deposit=(old.textContent||'').replace(/^\s*Deposit\s*:\s*/i,'').trim();
    var existing=details.querySelector('.realynkDepositDetail');
    if(existing){if(existing.querySelector('b'))existing.querySelector('b').textContent=deposit||'Not specified';if(old)old.remove();return;}
    var tile=document.createElement('div');
    tile.className='detail realynkDepositDetail';
    tile.innerHTML='<span>DEPOSIT</span><b></b>';
    tile.querySelector('b').textContent=deposit||'Not specified';
    details.appendChild(tile);
    if(old)old.remove();
  }

  function decorateAll(){
    document.querySelectorAll('#homeList .property,#myList .property').forEach(fixDeposit);
  }

  function statusText(p,status){
    var s=String(status||'active').toLowerCase();
    var type=String(p&&p.type||'').toLowerCase();
    if(s==='off market') return '🟠 Off Market';
    if(s==='sold'){
      if(type==='rent') return '🟣 Rented';
      if(type==='heavy deposit') return '🟣 Booked';
      if(type==='commercial') return '🟣 Closed';
      return '🟣 Sold';
    }
    return '🟢 Active';
  }

  function statusClass(status){
    var s=String(status||'active').toLowerCase();
    return s==='sold'?'sold':s==='off market'?'offmarket':'active';
  }

  function styleStatusControls(){
    document.querySelectorAll('#myList .property').forEach(function(card){
      var old=card.querySelector('.realynkPermanentControls .rt-status');
      if(old && old.tagName==='BUTTON' && !card.querySelector('.realynkStatusSelect')){
        var id=old.dataset.id||card.dataset.propertyId;
        var current=old.dataset.status||'sold';
        var typeNode=card.querySelector('.details .detail:first-child b');
        var p={type:typeNode?typeNode.textContent.trim():''};
        var select=document.createElement('select');
        select.className='realynkStatusSelect '+statusClass(current);
        select.dataset.id=id;
        select.setAttribute('aria-label','Property status');
        [['active','🟢 Active'],['sold',statusText(p,'sold')],['off market','🟠 Off Market']].forEach(function(x){
          var op=document.createElement('option');op.value=x[0];op.textContent=x[1];if(x[0]===current)op.selected=true;select.appendChild(op);
        });
        select.addEventListener('change',function(){
          select.className='realynkStatusSelect '+statusClass(select.value);
          if(window.realynkPropertyStatus) window.realynkPropertyStatus(id,select.value);
          else if(window.realynkPropertyStatus===undefined && window.realynkPropertyStatusChange) window.realynkPropertyStatusChange(id,select.value);
        });
        old.style.display='none';
        old.setAttribute('aria-hidden','true');
        old.parentNode.insertBefore(select,old.nextSibling);
      }
      var st=card.querySelector('.realynkStatusSelect');
      if(st){
        var typeNode=card.querySelector('.details .detail:first-child b');
        var p={type:typeNode?typeNode.textContent.trim():''};
        var current=st.value||'active';
        st.className='realynkStatusSelect '+statusClass(current);
        if(st.options[1])st.options[1].textContent=statusText(p,'sold');
        card.classList.remove('realynkCardActive','realynkCardSold','realynkCardOffMarket');
        card.classList.add(current==='sold'?'realynkCardSold':current==='off market'?'realynkCardOffMarket':'realynkCardActive');
      }
    });
  }

  function makeSections(){
    var host=document.getElementById('homeList');
    if(!host) return;
    var cards=[].slice.call(host.querySelectorAll(':scope > .property'));
    if(!cards.length) return;
    var groups={}; CATS.forEach(function(c){groups[c.key]=[]}); var other=[];
    cards.forEach(function(card){
      fixDeposit(card);
      var b=card.querySelector('.details .detail:first-child b');
      var type=b?b.textContent.trim():'';
      var c=sectionFor(type);
      if(c) groups[c.key].push(card); else other.push(card);
    });
    host.innerHTML='';
    CATS.forEach(function(c){
      var arr=groups[c.key]; if(!arr.length) return;
      var section=document.createElement('section'); section.className='realynkListingRow'; section.dataset.type=c.key;
      var h=document.createElement('h3'); h.textContent=c.label; section.appendChild(h);
      var wrap=document.createElement('div'); wrap.className='realynkSectionCards';
      arr.forEach(function(card){wrap.appendChild(card)}); section.appendChild(wrap); host.appendChild(section);
    });
    other.forEach(function(card){host.appendChild(card)});
    decorateAll();
  }

  function addQuickButtons(){
    var q=document.querySelector('.quick'); if(!q) return;
    [['heavyDeposit','💰','Heavy Deposit'],['landPlot','🌳','Land / Plot']].forEach(function(x){
      if(document.getElementById(x[0])) return;
      var b=document.createElement('button'); b.id=x[0]; b.type='button'; b.innerHTML=x[1]+'<b>'+x[2]+'</b>';
      b.addEventListener('click',function(){
        var s=document.querySelector('.realynkListingRow[data-type="'+x[2]+'"]');
        if(s) s.scrollIntoView({behavior:'smooth',block:'start'});
        else {var post=document.getElementById('postQuick'); if(post) post.click(); setTimeout(function(){var t=document.getElementById('type');if(t){t.value=x[2];t.dispatchEvent(new Event('change'))}},100)}
      }); q.appendChild(b);
    });
  }

  function addStyle(){
    if(document.getElementById('realynkListingSectionsCSS')) return;
    var s=document.createElement('style'); s.id='realynkListingSectionsCSS';
    s.textContent='.realynkListingRow{margin:22px 0}.realynkListingRow h3{margin:0 0 10px;padding:0 4px;font-size:21px;color:#0b3768}.realynkSectionCards{display:grid;gap:10px}.realynkListingRow .property{margin:0}.realynkDepositDetail{display:block!important}.realynkDepositDetail b{font-size:16px;color:#0b3768}.quick button{min-height:86px}.realynkListingRow:before{content:"";display:block;height:1px;background:#dfe6ee;margin-bottom:16px}.realynkPermanentControls{grid-template-columns:1fr 1fr!important;align-items:center!important}.realynkPermanentControls .rt-edit,.realynkPermanentControls .rt-delete{min-height:46px!important;border-radius:12px!important;font-weight:700!important}.realynkStatusSelect{width:100%;min-height:46px;padding:0 12px;border-radius:12px;border:2px solid #cbd5e1;font-size:15px;font-weight:800;background:#fff;cursor:pointer}.realynkStatusSelect.active{border-color:#22c55e;background:#ecfdf5;color:#15803d}.realynkStatusSelect.sold{border-color:#8b5cf6;background:#f5f3ff;color:#6d28d9}.realynkStatusSelect.offmarket{border-color:#f59e0b;background:#fffbeb;color:#b45309}.realynkCardActive{border-left:5px solid #22c55e!important}.realynkCardSold{border-left:5px solid #8b5cf6!important}.realynkCardOffMarket{border-left:5px solid #f59e0b!important}@media(max-width:480px){.realynkListingRow h3{font-size:19px}.quick button{min-height:78px}.realynkPermanentControls{grid-template-columns:1fr 1fr!important}.realynkStatusSelect{min-height:44px;font-size:14px}}';
    document.head.appendChild(s);
  }

  async function bindCloud(){
    try{
      var fa=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
      var ff=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js');
      var cfg=await import('./firebase-config.js');
      var app=fa.getApps().length?fa.getApps()[0]:fa.initializeApp(cfg.firebaseConfig); var db=ff.getFirestore(app);
      ff.onSnapshot(ff.collection(db,'properties'),function(s){cloudById={};s.forEach(function(d){cloudById[String(d.id)]={...d.data(),id:d.id}});decorateAll();styleStatusControls()});
    }catch(e){console.warn('Realynk listing section cloud map',e)}
  }

  function start(){
    addStyle(); addTypeOption(); addQuickButtons(); bindCloud();
    var host=document.getElementById('homeList');
    if(host){
      var observer=new MutationObserver(function(){
        if(host.querySelector(':scope > .property')) setTimeout(makeSections,0);
      });
      observer.observe(host,{childList:true});
      setTimeout(makeSections,300);
    }
    var dash=document.getElementById('myList');
    if(dash)new MutationObserver(function(){setTimeout(function(){decorateAll();styleStatusControls()},0)}).observe(dash,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,100);
  window.realynkListingSections={refresh:makeSections};
})();
