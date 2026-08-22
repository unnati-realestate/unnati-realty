(function(){
  function setup(){
    var commercial=document.getElementById('commercial'), post=document.getElementById('postQuick');
    if(!commercial||!post)return;
    if(!document.getElementById('heavyDeposit')){
      var b=document.createElement('button'); b.id='heavyDeposit'; b.type='button'; b.innerHTML='🔐<b data-hd>Heavy Deposit</b>';
      commercial.parentNode.insertBefore(b,post);
      b.onclick=function(){
        var search=document.getElementById('search');
        if(search){search.value='Heavy Deposit';search.dispatchEvent(new Event('input',{bubbles:true}));}
        var title=document.getElementById('filterTitle'), bar=document.getElementById('filterBar');
        if(bar){bar.style.display='flex';if(title)title.textContent=hd('heavyDeposit')+' '+hd('featured');}
      };
    }
    var type=document.getElementById('type');
    if(type&&!type.querySelector('option[value="Heavy Deposit"]')){
      var o=document.createElement('option');o.value='Heavy Deposit';o.setAttribute('data-hd-key','heavyDeposit');type.appendChild(o);
    }
    update();
  }
  function hd(k){var lang=(localStorage.getItem('realynkLang')||'en');var d={en:{heavyDeposit:'Heavy Deposit',featured:'Properties'},hi:{heavyDeposit:'हेवी डिपॉजिट',featured:'प्रॉपर्टीज'},mr:{heavyDeposit:'हेवी डिपॉझिट',featured:'प्रॉपर्टीज'},gu:{heavyDeposit:'હેવી ડિપોઝિટ',featured:'પ્રોપર્ટીઝ'}};return(d[lang]&&d[lang][k])||d.en[k]||k}
  function update(){var b=document.querySelector('#heavyDeposit [data-hd]');if(b)b.textContent=hd('heavyDeposit');var o=document.querySelector('#type option[value="Heavy Deposit"]');if(o)o.textContent=hd('heavyDeposit');}
  window.addEventListener('load',setup);setup();
  var l=document.getElementById('lang');if(l)l.addEventListener('change',function(){setTimeout(update,0)});
})();