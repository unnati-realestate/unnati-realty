(function(){
  'use strict';
  function $(id){return document.getElementById(id)}
  function toast(msg){var t=$('toast');if(!t)return; t.textContent=msg;t.style.display='block';clearTimeout(window.__realynkToast);window.__realynkToast=setTimeout(function(){t.style.display='none'},2200)}
  function show(id){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
    var el=$(id);if(!el)return;
    el.classList.add('active');
    document.querySelectorAll('[data-nav]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-nav')===id)});
    window.scrollTo(0,0);
    if(id==='dashboard' && typeof window.realynkRenderDashboard==='function') window.realynkRenderDashboard();
    if(id==='home' && typeof window.realynkRenderHome==='function') window.realynkRenderHome();
  }
  function filter(type){
    var q=$('search');if(q){q.value=type;q.dispatchEvent(new Event('input',{bubbles:true}))}
    var bar=$('filterBar'),title=$('filterTitle');
    if(bar){bar.style.display='flex';if(title)title.textContent=type+' Properties'}
    show('home');
  }
  function bind(){
    document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(e){e.preventDefault();show(b.getAttribute('data-nav'))}});
    document.querySelectorAll('[data-back]').forEach(function(b){b.onclick=function(e){e.preventDefault();show(b.getAttribute('data-back')||'home')}});
    var map={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial'};
    Object.keys(map).forEach(function(id){var b=$(id);if(b)b.onclick=function(){filter(map[id])}});
    var pq=$('postQuick');if(pq)pq.onclick=function(){show('post')};
    var bp=$('brokerPost');if(bp)bp.onclick=function(){show('post')};
    var add=$('add');if(add)add.onclick=function(){show('post')};
    var clear=$('clearFilter');if(clear)clear.onclick=function(){var q=$('search');if(q){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))}var bar=$('filterBar');if(bar)bar.style.display='none';show('home')};
    var search=$('search');if(search && !search.__repairBound){search.__repairBound=true;search.addEventListener('input',function(){if(typeof window.realynkRenderHome==='function')window.realynkRenderHome()})}
    bindMedia();
    var submit=$('submit');if(submit && !submit.__repairBound){submit.__repairBound=true;submit.addEventListener('click',function(){if(typeof window.realynkSubmit==='function'){window.realynkSubmit();return}toast('Property form is ready. Please try again.')})}
    var lang=$('lang');if(lang && !lang.__repairBound){lang.__repairBound=true;lang.addEventListener('change',function(){localStorage.setItem('realynkLang',lang.value);if(typeof window.realynkApplyLanguage==='function')window.realynkApplyLanguage(lang.value)})}
  }
  var repairPhotos=[];
  function bindMedia(){
    var input=$('photos');
    if(input && !input.__repairBound){input.__repairBound=true;input.addEventListener('change',function(){
      var files=Array.prototype.slice.call(input.files||[]).filter(function(f){return /^image\//.test(f.type)});
      if(repairPhotos.length+files.length>10){toast('Maximum 10 photos allowed');return}
      repairPhotos=repairPhotos.concat(files);renderPhotos();input.value='';
    })}
    var vid=$('video');
    if(vid && !vid.__repairBound){vid.__repairBound=true;vid.addEventListener('change',function(){
      var f=vid.files&&vid.files[0];if(!f)return;var url=URL.createObjectURL(f),player=$('videoPlayer');
      if(!player){return}
      player.onloadedmetadata=function(){if(player.duration>60){URL.revokeObjectURL(url);player.removeAttribute('src');var box=$('videoBox');if(box)box.style.display='none';toast('Video must be 60 seconds or less');return}player.src=url;var box=$('videoBox');if(box)box.style.display='block';toast('Video added successfully')};
      player.src=url;
    })}
  }
  function renderPhotos(){
    var grid=$('photoGrid'),counter=$('counter');if(!grid)return;grid.innerHTML='';
    repairPhotos.forEach(function(f,i){var d=document.createElement('div');d.className='mediaItem';var img=document.createElement('img');img.src=URL.createObjectURL(f);var b=document.createElement('button');b.type='button';b.className='remove';b.textContent='×';b.onclick=function(){repairPhotos.splice(i,1);renderPhotos()};d.appendChild(img);d.appendChild(b);grid.appendChild(d)});
    if(counter)counter.textContent=repairPhotos.length+' / 10 photos selected';
  }
  window.realynkRepairShow=show;
  window.realynkRepairPhotos=function(){return repairPhotos.slice()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
