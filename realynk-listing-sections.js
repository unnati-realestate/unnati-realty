/* REALYNK LISTING SECTIONS — separate home rows + clear rent deposit + land/plot */
(function(){
  'use strict';
  if(window.__REALYNK_LISTING_SECTIONS_V1__) return;
  window.__REALYNK_LISTING_SECTIONS_V1__=true;

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

  function makeSections(){
    var host=document.getElementById('homeList');
    if(!host) return;
    var cards=[].slice.call(host.querySelectorAll(':scope > .property'));
    if(!cards.length) return;
    var groups={};
    CATS.forEach(function(c){groups[c.key]=[]});
    var other=[];
    cards.forEach(function(card){
      fixDeposit(card);
      var b=card.querySelector('.details .detail:first-child b');
      var type=b?b.textContent.trim():'';
      var c=sectionFor(type);
      if(c) groups[c.key].push(card); else other.push(card);
    });
    host.innerHTML='';
    CATS.forEach(function(c){
      var arr=groups[c.key];
      if(!arr.length) return;
      var section=document.createElement('section');
      section.className='realynkListingRow';
      section.dataset.type=c.key;
      var h=document.createElement('h3');
      h.textContent=c.label;
      section.appendChild(h);
      var wrap=document.createElement('div');
      wrap.className='realynkSectionCards';
      arr.forEach(function(card){wrap.appendChild(card)});
      section.appendChild(wrap); host.appendChild(section);
    });
    if(other.length) other.forEach(function(card){host.appendChild(card)});
    decorateAll();
  }

  function addQuickButtons(){
    var q=document.querySelector('.quick');
    if(!q) return;
    [['heavyDeposit','💰','Heavy Deposit'],['landPlot','🌳','Land / Plot']].forEach(function(x){
      if(document.getElementById(x[0])) return;
      var b=document.createElement('button'); b.id=x[0]; b.type='button'; b.innerHTML=x[1]+'<b>'+x[2]+'</b>';
      b.addEventListener('click',function(){
        var s=document.querySelector('.realynkListingRow[data-type="'+x[2]+'"]');
        if(s) s.scrollIntoView({behavior:'smooth',block:'start'});
        else {var post=document.getElementById('postQuick'); if(post) post.click(); setTimeout(function(){var t=document.getElementById('type');if(t){t.value=x[2];t.dispatchEvent(new Event('change'))}},100)}
      });
      q.appendChild(b);
    });
  }

  function addStyle(){
    if(document.getElementById('realynkListingSectionsCSS')) return;
    var s=document.createElement('style');s.id='realynkListingSectionsCSS';
    s.textContent='.realynkListingRow{margin:22px 0}.realynkListingRow h3{margin:0 0 10px;padding:0 4px;font-size:21px;color:#0b3768}.realynkSectionCards{display:grid;gap:10px}.realynkListingRow .property{margin:0}.realynkDepositDetail{display:block!important}.realynkDepositDetail b{font-size:16px;color:#0b3768}.quick button{min-height:86px}.realynkListingRow:before{content:"";display:block;height:1px;background:#dfe6ee;margin-bottom:16px}@media(max-width:480px){.realynkListingRow h3{font-size:19px}.quick button{min-height:78px}}';
    document.head.appendChild(s);
  }

  async function bindCloud(){
    try{
      var fa=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
      var ff=await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js');
      var cfg=await import('./firebase-config.js');
      var app=fa.getApps().length?fa.getApps()[0]:fa.initializeApp(cfg.firebaseConfig);
      var db=ff.getFirestore(app);
      ff.onSnapshot(ff.collection(db,'properties'),function(s){
        cloudById={};s.forEach(function(d){cloudById[String(d.id)]={...d.data(),id:d.id}});
        decorateAll();
      });
    }catch(e){console.warn('Realynk listing section cloud map',e)}
  }

  function start(){
    addStyle(); addTypeOption(); addQuickButtons(); bindCloud();
    var host=document.getElementById('homeList');
    if(host){
      var busy=false;
      var run=function(){if(busy)return;busy=true;try{makeSections()}finally{busy=false}};
      new MutationObserver(function(){setTimeout(run,0)}).observe(host,{childList:true});
      setTimeout(run,300);
    }
    var dash=document.getElementById('myList');
    if(dash)new MutationObserver(function(){setTimeout(decorateAll,0)}).observe(dash,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,100);
  window.realynkListingSections={refresh:makeSections};
})();
