/* REALYNK PROPERTY FORM V1 — clear price/deposit/size fields by listing type */
(function(){'use strict';
if(window.__REALYNK_PROPERTY_FORM_V1__)return;window.__REALYNK_PROPERTY_FORM_V1__=true;
function start(){
 var type=document.getElementById('type'),price=document.getElementById('price'),priceField=price&&price.closest('.field'),depositField=document.getElementById('depositField'),sizeField=document.getElementById('sizeField');
 if(!type)return;
 var label=priceField&&priceField.querySelector('label');
 function sync(){var v=String(type.value||''),isRent=v==='Rent',isHeavy=v==='Heavy Deposit';
  if(label)label.textContent=isRent?'Rent':isHeavy?'Amount / Deposit':'Price';
  if(price)price.placeholder=isRent?'₹25,000 / month':isHeavy?'₹5,00,000':'₹85,00,000';
  if(depositField)depositField.style.display=(isRent||isHeavy)?'block':'none';
  if(sizeField)sizeField.style.display='block';
 }
 type.addEventListener('change',sync,false);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,60)},{once:true});else setTimeout(start,60);
window.realynkPropertyForm={refresh:start};
})();
