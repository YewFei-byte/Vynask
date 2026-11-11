(function(){
  var els=document.querySelectorAll('[data-zh]'),zh=false,btn=document.getElementById('lang');
  els.forEach(function(e){e.setAttribute('data-en',e.innerHTML)});
  btn.addEventListener('click',function(ev){
    var b=ev.target.closest('button');if(!b)return;
    var z=b.getAttribute('data-l')==='zh';if(z===zh)return;zh=z;
    document.documentElement.lang=zh?'zh-Hans':'en';
    els.forEach(function(e){e.innerHTML=e.getAttribute(zh?'data-zh':'data-en')});
    btn.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
  });
})();
(function(){
  var d=document,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hd=d.querySelector('header'),pg=d.createElement('div'),hero=d.querySelector('.hero'),t=false;pg.id='pg';hd.appendChild(pg);
  function up(){t=false;var y=window.scrollY,m=d.documentElement.scrollHeight-innerHeight;hd.classList.toggle('sc',y>8);pg.style.transform='scaleX('+(m>0?Math.min(1,y/m):0)+')';if(!rm&&y<hero.offsetHeight+200)hero.style.setProperty('--py',(y*.18).toFixed(1));spy()}
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(up)}},{passive:true});up();
  var ln=d.querySelectorAll('.links a'),secs=Array.prototype.map.call(ln,function(a){return d.querySelector(a.getAttribute('href'))});
  function spy(){if(!secs)return;var c=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=150)c=i});ln.forEach(function(a,i){a.classList.toggle('on',i===c)})}
  spy();
  
})();

(function(){
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)})},{rootMargin:'80px 0px'});
  document.querySelectorAll('.hero,.band,.flow,.panel,section,.wa').forEach(function(e){io.observe(e)});
})();

(function(){
  var v=document.querySelector('.video');if(!v)return;
  var src=(v.getAttribute('data-src')||'').trim(),poster=(v.getAttribute('data-poster')||'').trim();
  var soon=v.innerHTML;                                   // keep the "coming soon" placeholder as a fallback
    if(src){
    var vid=document.createElement('video');
    vid.controls=false;vid.preload='metadata';vid.setAttribute('playsinline','');
    if(poster)vid.poster=poster;
    vid.src=src; // Removed #t=0.001 so the poster image stays visible
    vid.addEventListener('error',function(){              // file missing or unsupported: fall back
      v.innerHTML=soon;youtube();
    });
    v.innerHTML='';v.appendChild(vid);
    var pb=document.createElement('button');pb.type='button';pb.className='yt over';pb.setAttribute('aria-label','Play video');
    pb.innerHTML='<span class="play" aria-hidden="true"></span>';
    pb.addEventListener('click',function(){               // purple play button starts the video
      vid.controls=true;pb.remove();vid.play();
    });
    vid.addEventListener('ended',function(){vid.controls=false;vid.currentTime=0;v.appendChild(pb)});  // button returns when it finishes
    v.appendChild(pb);
    return;
  }
  youtube();
  function youtube(){
  if(!v.getAttribute('data-yt'))return;
  var id=(v.getAttribute('data-yt')||'').trim();if(!id)return;
  var m=id.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);if(m)id=m[1];
  if(!/^[\w-]{11}$/.test(id))return;
  v.innerHTML='';
  var b=document.createElement('button');b.type='button';b.className='yt';b.setAttribute('aria-label','Play video');
  b.style.backgroundImage=poster?'url('+poster+')':'url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)';b.innerHTML='<span class="play" aria-hidden="true"></span>';
  b.addEventListener('click',function(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="VynAsk video" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'});
  v.appendChild(b);
  }
})();

(function(){
  var w=document.querySelector('.wa');if(!w)return;
  document.documentElement.classList.add('wapre');
  setTimeout(function(){w.classList.add('show')},5000);
})();

/* ============ WHY VYNASK carousel ============ */
(function(){
  var slides = document.querySelectorAll('.slide');
  var count  = document.getElementById('carCount');
  var n = slides.length, i = 0;                       // n = how many cards, i = which one is in the middle

  function pad(x){ return (x < 10 ? '0' : '') + x; }  // 1 -> "01"

  function render(){
    slides.forEach(function(s, k){
      var d = (k - i + n) % n;                        // distance from the middle card (wraps around)
      s.className = 'slide' + (d === 0 ? ' is-active' : d === 1 ? ' is-next' : d === n - 1 ? ' is-prev' : '');
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });
    count.textContent = pad(i + 1) + ' / ' + pad(n);
  }
  function go(step){ i = (i + step + n) % n; render(); }

  document.getElementById('carNext').addEventListener('click', function(){ go(1); });
  document.getElementById('carPrev').addEventListener('click', function(){ go(-1); });

  slides.forEach(function(s, k){                      // click a faded side card to bring it forward
    s.addEventListener('click', function(){ if (k !== i){ i = k; render(); } });
  });

  document.addEventListener('keydown', function(e){   // keyboard arrows (only while the carousel is on screen)
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target.closest && e.target.closest('[role=tablist]')) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) return;
    var r = document.getElementById('car').getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft')  go(-1);
  });

  var x0 = null, track = document.querySelector('.car-track');   // swipe on phones
  track.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    x0 = null;
  });

  render();
})();

/* ============ click-to-zoom for feature screenshots ============ */
(function(){
  var imgs=document.querySelectorAll('img.zoom');if(!imgs.length)return;
  var ov=document.createElement('div');ov.className='lb';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
  var big=document.createElement('img');ov.appendChild(big);document.body.appendChild(ov);
  function open(i){big.src=i.currentSrc||i.src;big.alt=i.alt;ov.classList.add('open')}
  function close(){ov.classList.remove('open')}
  imgs.forEach(function(i){
    i.addEventListener('click',function(){open(i)});
    i.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}});
  });
  ov.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();


/* ============ KEY FEATURES: tabs ============ */
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.ftab'));if(!tabs.length)return;
  function sel(t,focus){
    tabs.forEach(function(x){
      var on=x===t;
      x.setAttribute('aria-selected',on?'true':'false');
      x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;
    });
    if(focus)t.focus();
    if(innerWidth<=900&&t.scrollIntoView)t.scrollIntoView({block:'nearest',inline:'center'});
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){
      var n=null;
      if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%tabs.length;
      else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;
      else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;
      if(n!==null){e.preventDefault();sel(tabs[n],true)}
    });
  });
  sel(tabs[0]);
})();

(function(){
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var boxes=document.querySelectorAll('.pcard,.fcard,.wcard,.step,.wacard,.chat');
  var io=new IntersectionObserver(function(es){
    var n=0;
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.style.setProperty('--d',(n++*0.09).toFixed(2)+'s');
      e.target.classList.add('in');io.unobserve(e.target);
    });
  },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  boxes.forEach(function(b){b.classList.add('pop');io.observe(b)});
})();

document.querySelectorAll('.video[data-poster]').forEach(box => {
  const poster = box.getAttribute('data-poster');
  if (poster) {
    box.style.backgroundImage = `url('${poster}')`;
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
  }
});
