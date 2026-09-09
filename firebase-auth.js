/* REALYNK AUTH COMPATIBILITY V2 — photo edit bridge */
(function(){
'use strict';
if(window.__REALYNK_AUTH_COMPAT_V2__)return;
window.__REALYNK_AUTH_COMPAT_V2__=true;
function profile(){try{return JSON.parse(localStorage.getItem('realynkBrokerProfile')||'{}')||{}}catch(e){return{}}}
function save(p){try{localStorage.setItem('realynkBrokerProfile',JSON.stringify(p));return true}catch(e){return false}}
function install(){
 var card=document.querySelector('.realynkDigitalCard');
 if(!card||card.querySelector('.realynkPhotoBridge'))return;
 var input=card.querySelector('.rdcPhotoInput');
 var avatar=card.querySelector('.rdcAvatar');
 if(!input||!avatar)return;
 var wrap=document.createElement('div');wrap.className='realynkPhotoBridge';wrap.style.cssText='display:flex;gap:8px;margin:8px 0;flex-wrap:wrap';
 var edit=document.createElement('button');edit.type='button';edit.textContent='✏️ Edit / Change Photo';edit.style.cssText='border:0;border-radius:10px;padding:11px 14px;background:#0b3768;color:#fff;font-weight:800;cursor:pointer';
 var remove=document.createElement('button');remove.type='button';remove.textContent='🗑️ Remove Photo';remove.style.cssText='border:1px solid #dfe6ee;border-radius:10px;padding:11px 14px;background:#fff;color:#b42318;font-weight:800;cursor:pointer';
 edit.onclick=function(){input.value='';input.click()};
 remove.onclick=function(){var p=profile();delete p.photo;delete p.photoURL;if(save(p)){avatar.src='./logo.png';alert('Broker photo removed.')}};
 wrap.appendChild(edit);wrap.appendChild(remove);input.parentNode.insertBefore(wrap,input.parentNode.firstChild.nextSibling||input);
}
function later(){setTimeout(install,250);setTimeout(install,800);setTimeout(install,1500)}
document.addEventListener('click',function(e){var n=e.target.closest('[data-nav="account"]');if(n)later()},true);
later();
})();