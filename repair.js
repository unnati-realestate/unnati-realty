(function(){
  'use strict';
  function $(id){return document.getElementById(id)}
  function getProps(){try{var p=JSON.parse(localStorage.getItem('realynkProperties')||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
  function setProps(p){localStorage.setItem('realynkProperties',JSON.stringify(p))}
  function toast(msg){var t=$('toast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(window.__realynkToast);window.__realynkToast=setTimeout(function(){t.style.display='none'},2200)}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='"'?'&quot;':'&#39;'})}
  function card(p){
    var media=(p.photos&&p.photos.length)?'<div class="listingMedia">'+p.photos.slice(0,10).map(function(x){return '<img src="'+x+'" alt="Property photo">'}).join('')+'</div>':'';
    return '<div class="panel property"><h3>'+esc(p.title)+'</h3><div>📍 '+esc(p.area)+'</div><div class="price">'+esc(p.price)+'</div><div class="details"><div class="detail"><span>Type</span><b>'+esc(p.type)+'</b></div><div class="detail"><span>Contact</span><b>'+esc(p.phone)+'</b></div></div><p>'+esc(p.desc)+'</p>'+media+'</div>';
  }
  function renderHome(){
    var box=$('homeList');if(!box)return;
    var q=(($('search')&&$('search').value)||'').trim().toLowerCase(),list=getProps();
    if(q)list=list.filter(function(p){return [p.title,p.area,p.type,p.desc].join(' ').toLowerCase().indexOf(q)>=0});
    box.innerHTML=list.length?list.map(card).join(''):'<div class="empty">No properties found.</div>';
  }
  function renderDashboard(){
    var list=getProps().filter(function(p){return p.mine}),count=$('count'),box=$('myList');
    if(count)count.textContent=list.length;
    if(box)box.innerHTML=list.length?list.map(card).join(''):'<div class="empty">Your posted properties will appear here.</div>';
  }
  function show(id){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
    var el=$(id);if(!el)return;el.classList.add('active');
    document.querySelectorAll('[data-nav]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-nav')===id)});
    window.scrollTo(0,0);if(id==='home')renderHome();if(id==='dashboard')renderDashboard();
  }
  function filter(type){var q=$('search');if(q){q.value=type}var bar=$('filterBar'),title=$('filterTitle');if(bar)bar.style.display='flex';if(title)title.textContent=type+' Properties';show('home')}
  var repairPhotos=[];
  function renderPhotos(){var grid=$('photoGrid'),counter=$('counter');if(!grid)return;grid.innerHTML='';repairPhotos.forEach(function(f,i){var d=document.createElement('div');d.className='mediaItem';var img=document.createElement('img');img.src=URL.createObjectURL(f);var b=document.createElement('button');b.type='button';b.className='remove';b.textContent='×';b.onclick=function(){repairPhotos.splice(i,1);renderPhotos()};d.appendChild(img);d.appendChild(b);grid.appendChild(d)});if(counter)counter.textContent=repairPhotos.length+' / 10 photos selected'}
  function bindMedia(){
    var input=$('photos');if(input&&!input.__repairBound){input.__repairBound=true;input.addEventListener('change',function(){var files=Array.prototype.slice.call(input.files||[]).filter(function(f){return /^image\//.test(f.type)});if(repairPhotos.length+files.length>10){toast('Maximum 10 photos allowed');return}repairPhotos=repairPhotos.concat(files);renderPhotos();input.value=''})}
    var vid=$('video');if(vid&&!vid.__repairBound){vid.__repairBound=true;vid.addEventListener('change',function(){var f=vid.files&&vid.files[0];if(!f)return;var url=URL.createObjectURL(f),player=$('videoPlayer');if(!player)return;player.onloadedmetadata=function(){if(player.duration>60){URL.revokeObjectURL(url);player.removeAttribute('src');var box=$('videoBox');if(box)box.style.display='none';toast('Video must be 60 seconds or less');return}player.src=url;var box=$('videoBox');if(box)box.style.display='block';toast('Video added successfully')};player.src=url})}
  }
  function submit(){
    var title=$('title')&&$('title').value.trim();if(!title){toast('Please enter Property Title');if($('title'))$('title').focus();return}
    var p={id:Date.now(),title:title,area:$('area')?$('area').value.trim():'',price:$('price')?$('price').value.trim():'',type:$('type')?$('type').value:'Buy',desc:$('desc')?$('desc').value.trim():'',phone:$('phone')?$('phone').value.trim():'',mine:true,photos:[],videoName:($('video')&&$('video').files&&$('video').files[0])?$('video').files[0].name:''};
    var jobs=repairPhotos.map(function(f){return new Promise(function(resolve){var r=new FileReader();r.onload=function(){resolve(r.result)};r.readAsDataURL(f)})});
    Promise.all(jobs).then(function(arr){p.photos=arr;try{var all=getProps();all.unshift(p);setProps(all);toast('Property posted successfully');['title','area','price','deposit','size','desc'].forEach(function(id){if($(id))$(id).value=''});repairPhotos=[];renderPhotos();show('dashboard')}catch(e){toast('Photo files are too large. Please use fewer/smaller photos.')}})
  }
  function bind(){
    document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(e){e.preventDefault();show(b.getAttribute('data-nav'))}});
    document.querySelectorAll('[data-back]').forEach(function(b){b.onclick=function(e){e.preventDefault();show(b.getAttribute('data-back')||'home')}});
    var map={buy:'Buy',sale:'Sale',rent:'Rent',commercial:'Commercial'};Object.keys(map).forEach(function(id){var b=$(id);if(b)b.onclick=function(){filter(map[id])}});
    if($('postQuick'))$('postQuick').onclick=function(){show('post')};if($('brokerPost'))$('brokerPost').onclick=function(){show('post')};if($('add'))$('add').onclick=function(){show('post')};
    if($('clearFilter'))$('clearFilter').onclick=function(){if($('search'))$('search').value='';if($('filterBar'))$('filterBar').style.display='none';renderHome()};
    if($('search')&&!$('search').__repairBound){$('search').__repairBound=true;$('search').addEventListener('input',renderHome)}
    bindMedia();
    if($('submit')&&!$('submit').__repairBound){$('submit').__repairBound=true;$('submit').addEventListener('click',submit)}
    var lang=$('lang');if(lang&&!lang.__repairBound){lang.__repairBound=true;lang.addEventListener('change',function(){localStorage.setItem('realynkLang',lang.value);if(typeof window.realynkApplyLanguage==='function')window.realynkApplyLanguage(lang.value)})}
    renderHome();renderDashboard();
  }
  window.realynkRenderHome=renderHome;window.realynkRenderDashboard=renderDashboard;window.realynkSubmit=submit;window.realynkRepairShow=show;window.realynkRepairPhotos=function(){return repairPhotos.slice()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
