/* REALYNK PROPERTY FORM V3 — deal-specific price fields */
(function(){'use strict';
if(window.__REALYNK_PROPERTY_FORM_V3__)return;window.__REALYNK_PROPERTY_FORM_V3__=true;
function ensureOption(type,value,label){
 if(!type)return;
 if(!Array.from(type.options).some(function(o){return o.value===value;})){
  var o=document.createElement('option');o.value=value;o.textContent=label;type.appendChild(o);
 }
}
function ensureFieldAfter(anchorId,id,label,placeholder){
 if(document.getElementById(id))return document.getElementById(id).closest('.field');
 var anchor=document.getElementById(anchorId);if(!anchor)return null;
 var field=document.createElement('div');field.className='field';field.id=id+'Field';
 field.innerHTML='<label>'+label+'</label><input id="'+id+'" placeholder="'+placeholder+'">';
 anchor.closest('.field').insertAdjacentElement('afterend',field);
 return field;
}
function start(){
 var type=document.getElementById('type'),price=document.getElementById('price'),priceField=price&&price.closest('.field'),depositField=document.getElementById('depositField'),sizeField=document.getElementById('sizeField');
 if(!type||!priceField)return;
 ensureOption(type,'Heavy Deposit','💰 Heavy Deposit');
 ensureOption(type,'Land / Plot','🌳 Land / Plot');
 var finalField=ensureFieldAfter('price','finalPrice','Final Price','₹80,00,000 (Negotiable)');
 var maintenanceField=ensureFieldAfter('deposit','maintenanceRent','Monthly Maintenance / Rent','₹6,000 / month');
 var finalPrice=document.getElementById('finalPrice'),maintenance=document.getElementById('maintenanceRent');
 var label=priceField.querySelector('label'),depositLabel=depositField&&depositField.querySelector('label'),sizeLabel=sizeField&&sizeField.querySelector('label');
 function sync(){
  var v=String(type.value||''),isRent=v==='Rent',isHeavy=v==='Heavy Deposit',isPlot=v==='Land / Plot',isFinal=v==='Sale'||v==='Commercial'||isPlot;
  if(label)label.textContent=isRent?'Rent':isHeavy?'Heavy Deposit':'Price';
  price.placeholder=isRent?'₹25,000 / month':isHeavy?'₹5,00,000':'₹85,00,000';
  if(depositField){depositField.style.display=(isRent||isHeavy)?'block':'none';if(depositLabel)depositLabel.textContent=isHeavy?'Heavy Deposit':'Deposit';}
  if(finalField)finalField.style.display=isFinal?'block':'none';
  if(finalPrice)finalPrice.placeholder=isPlot?'₹45,00,000 (Negotiable)':'₹80,00,000 (Negotiable)';
  if(maintenanceField)maintenanceField.style.display=isHeavy?'block':'none';
  if(maintenance)maintenance.placeholder='₹6,000 / month';
  if(sizeField){sizeField.style.display='block';if(sizeLabel)sizeLabel.textContent=isPlot?'Size':'Carpet / Usable Area';}
 }
 type.addEventListener('change',sync,false);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,80)},{once:true});else setTimeout(start,80);
window.realynkPropertyForm={refresh:start};
})();
