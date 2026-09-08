/* REALYNK SAFE BOOT V2
   The main index.html already contains the complete navigation/posting engine.
   Previous layered patch modules could compete for the same DOM and make the page
   unresponsive. Keep boot intentionally lightweight until each module is audited.
*/
(function(){
  'use strict';
  function addHeavyDeposit(){
    var quick=document.querySelector('.quick');
    var post=document.getElementById('postQuick');
    if(quick && !document.getElementById('heavyDeposit')){
      var b=document.createElement('button');
      b.id='heavyDeposit';
      b.type='button';
      b.innerHTML='🔐<b>Heavy Deposit</b>';
      b.onclick=function(){
        var home=document.getElementById('home');
        var list=document.getElementById('homeList');
        var bar=document.getElementById('filterBar');
        var title=document.getElementById('filterTitle');
        document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
        if(home)home.classList.add('active');
        if(bar)bar.style.display='flex';
        if(title)title.textContent='Heavy Deposit';
        if(list){
          var cards=list.querySelectorAll('.property');
          cards.forEach(function(card){
            var text=(card.textContent||'').toLowerCase();
            card.style.display=text.indexOf('heavy deposit')>=0?'':'none';
          });
        }
        window.scrollTo(0,0);
      };
      if(post)quick.insertBefore(b,post);else quick.appendChild(b);
    }
    var type=document.getElementById('type');
    if(type && !type.querySelector('option[value="Heavy Deposit"]')){
      var o=document.createElement('option');
      o.value='Heavy Deposit';
      o.textContent='Heavy Deposit';
      type.appendChild(o);
    }
  }
  function start(){addHeavyDeposit();setTimeout(addHeavyDeposit,700);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
