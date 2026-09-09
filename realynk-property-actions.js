/* REALYNK PROPERTY ACTIONS V1 — lightweight edit/delete for My Listings */
(function(){
  'use strict';
  if(window.__REALYNK_PROPERTY_ACTIONS_V1__) return;
  window.__REALYNK_PROPERTY_ACTIONS_V1__=true;

  var editId=null;
  var originalSubmitText='Submit Property';

  function props(){
    try{
      var a=JSON.parse(localStorage.getItem('realynkProperties')||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return []}
  }
  function save(a){
    try{localStorage.setItem('realynkProperties',JSON.stringify(a));return true}catch(e){return false}
  }
  function el(id){return document.getElementById(id)}
  function toast(msg){
    var b=el('toast');
    if(!b)return;
    b.textContent=msg;
    b.style.display='block';
    clearTimeout(window.__realynkActionToast);
    window.__realynkActionToast=setTimeout(function(){b.style.display='none'},2500);
  }
  function addStyles(){
    if(document.getElementById('realynkPropertyActionStyles'))return;
    var s=document.createElement('style');
    s.id='realynkPropertyActionStyles';
    s.textContent='.realynkPropertyActions{display:flex;gap:8px;margin-top:10px}.realynkPropertyActions button{flex:1;border-radius:10px;padding:11px 12px;font-weight:800;cursor:pointer}.realynkEditBtn{border:1px solid #cfd9e5;background:#fff;color:#0b3768}.realynkDeleteBtn{border:1px solid #efc5c2;background:#fff;color:#b42318}.realynkEditNotice{font-size:12px;color:#6b7a8c;margin:8px 0}.realynkCancelEdit{margin-top:8px}';
    document.head.appendChild(s);
  }
  function injectActions(){
    var list=el('myList');
    if(!list)return;
    var mine=props().filter(function(p){return p.mine});
    var cards=Array.from(list.querySelectorAll('.property'));
    cards.forEach(function(card,i){
      if(card.querySelector('.realynkPropertyActions'))return;
      var p=mine[i];
      if(!p)return;
      card.setAttribute('data-realynk-property-id',String(p.id));
      var box=document.createElement('div');
      box.className='realynkPropertyActions';
      var e=document.createElement('button');e.type='button';e.className='realynkEditBtn';e.textContent='✎ Edit';e.setAttribute('data-property-action','edit');e.setAttribute('data-id',String(p.id));
      var d=document.createElement('button');d.type='button';d.className='realynkDeleteBtn';d.textContent='🗑 Delete';d.setAttribute('data-property-action','delete');d.setAttribute('data-id',String(p.id));
      box.appendChild(e);box.appendChild(d);card.appendChild(box);
    });
  }
  function clearForm(){
    ['title','area','price','deposit','size','desc'].forEach(function(id){if(el(id))el(id).value=''});
    if(el('photos'))el('photos').value='';
    if(el('video'))el('video').value='';
    if(el('photoGrid'))el('photoGrid').innerHTML='';
    if(el('videoBox'))el('videoBox').style.display='none';
    if(el('counter'))el('counter').textContent='0 / 10 photos selected';
    if(el('type'))el('type').value='Buy';
    if(el('depositField'))el('depositField').style.display='none';
    if(el('sizeField'))el('sizeField').style.display='none';
  }
  function setEditMode(p){
    editId=p.id;
    if(el('title'))el('title').value=p.title||'';
    if(el('area'))el('area').value=p.area||'';
    if(el('type'))el('type').value=p.type||'Buy';
    if(el('price'))el('price').value=p.price||'';
    if(el('deposit'))el('deposit').value=p.deposit||'';
    if(el('size'))el('size').value=p.size||'';
    if(el('desc'))el('desc').value=p.desc||'';
    if(el('phone'))el('phone').value=p.phone||'';
    if(el('depositField'))el('depositField').style.display=(p.type==='Rent'||p.type==='Heavy Deposit')?'block':'none';
    if(el('sizeField'))el('sizeField').style.display=p.type==='Sale'?'block':'none';
    var submit=el('submit');
    if(submit){originalSubmitText=submit.textContent;submit.textContent='Save Changes';}
    ['photos','video'].forEach(function(id){if(el(id)){el(id).disabled=true;el(id).title='Media stays unchanged while editing property details';}});
    if(submit && !el('realynkCancelEdit')){
      var c=document.createElement('button');
      c.type='button';c.id='realynkCancelEdit';c.className='back full realynkCancelEdit';c.textContent='Cancel Edit';
      submit.parentNode.insertBefore(c,submit.nextSibling);
      c.onclick=function(){cancelEdit()};
    }
    var old=el('realynkEditNotice');if(old)old.remove();
    if(submit){var n=document.createElement('div');n.id='realynkEditNotice';n.className='realynkEditNotice';n.textContent='Editing property details. Existing photos/video will be kept.';submit.parentNode.insertBefore(n,submit);}
    var nav=document.querySelector('[data-nav="post"]');if(nav)nav.click();
  }
  function cancelEdit(){
    editId=null;
    clearForm();
    var submit=el('submit');if(submit)submit.textContent=originalSubmitText||'Submit Property';
    ['photos','video'].forEach(function(id){if(el(id))el(id).disabled=false});
    var c=el('realynkCancelEdit');if(c)c.remove();
    var n=el('realynkEditNotice');if(n)n.remove();
    var nav=document.querySelector('[data-nav="dashboard"]');if(nav)nav.click();
  }
  function saveEdit(){
    var a=props(),idx=a.findIndex(function(p){return String(p.id)===String(editId)});
    if(idx<0){toast('Property not found');cancelEdit();return}
    var p=a[idx];
    p.title=(el('title')&&el('title').value||'').trim();
    if(!p.title){toast('Please enter Property Title');if(el('title'))el('title').focus();return}
    p.area=(el('area')&&el('area').value||'').trim();
    p.type=el('type')?el('type').value:p.type;
    p.price=(el('price')&&el('price').value||'').trim();
    p.deposit=(el('deposit')&&el('deposit').value||'').trim();
    p.size=(el('size')&&el('size').value||'').trim();
    p.desc=(el('desc')&&el('desc').value||'').trim();
    p.phone=(el('phone')&&el('phone').value||'').trim();
    p.updatedAt=Date.now();
    if(!save(a)){toast('Could not save changes');return}
    toast('Property updated successfully');
    editId=null;
    clearForm();
    var submit=el('submit');if(submit)submit.textContent=originalSubmitText||'Submit Property';
    ['photos','video'].forEach(function(id){if(el(id))el(id).disabled=false});
    var c=el('realynkCancelEdit');if(c)c.remove();
    var n=el('realynkEditNotice');if(n)n.remove();
    var nav=document.querySelector('[data-nav="dashboard"]');if(nav)nav.click();
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-property-action]');
    if(!b)return;
    var id=b.getAttribute('data-id');
    var a=props(),p=a.find(function(x){return String(x.id)===String(id)});
    if(!p)return;
    if(b.getAttribute('data-property-action')==='delete'){
      if(!window.confirm('Delete this property listing?'))return;
      a=a.filter(function(x){return String(x.id)!==String(id)});
      if(!save(a)){toast('Could not delete property');return}
      toast('Property deleted');
      var nav=document.querySelector('[data-nav="dashboard"]');if(nav)nav.click();
      return;
    }
    if(b.getAttribute('data-property-action')==='edit')setEditMode(p);
  },true);
  document.addEventListener('click',function(e){
    var nav=e.target.closest('[data-nav="dashboard"]');
    if(nav)setTimeout(injectActions,30);
    var add=e.target.closest('#add');
    if(add && editId===null)setTimeout(clearForm,20);
  },true);
  document.addEventListener('click',function(e){
    if(e.target.closest('#submit') && editId!==null){
      e.preventDefault();
      e.stopImmediatePropagation();
      saveEdit();
    }
  },true);
  addStyles();
  setTimeout(injectActions,80);
  window.realynkPropertyActions={refresh:injectActions,cancelEdit:cancelEdit};
})();
