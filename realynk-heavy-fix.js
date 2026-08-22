(function(){'use strict';
function qs(id){return document.getElementById(id)}
function addHeavyOption(){
  var type=qs('type');
  if(!type)return;
  if(!type.querySelector('option[value="Heavy Deposit"]')){
    var o=document.createElement('option');o.value='Heavy Deposit';o.textContent='🔐 Heavy Deposit';type.appendChild(o)
  }
}
function setHeavyFields(){
  var type=qs('type'), deposit=qs('depositField'), size=qs('sizeField');
  if(!type)return;
  var heavy=type.value==='Heavy Deposit';
  if(deposit)deposit.style.display=heavy?'block':(type.value==='Rent'?'block':'none');
  if(size)size.style.display=(heavy||type.value==='Commercial')?'block':'none';
}
function addHeavyButton(){
  var quick=document.querySelector('.quick'), commercial=qs('commercial'), post=qs('postQuick');
  if(!quick||qs('heavyDepositQuick'))return;
  var b=document.createElement('button');b.id='heavyDepositQuick';b.type='button';
  b.innerHTML='🔐<b>Heavy Deposit</b>';
  b.onclick=function(){
    if(post&&typeof post.click==='function')post.click();
    setTimeout(function(){addHeavyOption();var t=qs('type');if(t){t.value='Heavy Deposit';t.dispatchEvent(new Event('change',{bubbles:true}));}setHeavyFields()},80)
  };
  if(commercial&&commercial.parentNode)commercial.parentNode.insertBefore(b,post||null);else quick.appendChild(b)
}
function setup(){addHeavyOption();addHeavyButton();setHeavyFields();var t=qs('type');if(t&&!t.__rkHeavyBound){t.addEventListener('change',setHeavyFields);t.__rkHeavyBound=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
window.addEventListener('load',setup);
new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});
})();