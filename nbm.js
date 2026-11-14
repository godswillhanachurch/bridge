// 다가오는 사역 일정: 교회 홈페이지의 일정 달력(events.json)에서 사역 관련 일정만 불러옵니다.
(function(){
  var box=document.getElementById('nbmUp'); if(!box||!window.fetch) return;
  var WD=['일','월','화','수','목','금','토'], RX=/북향민|탈북민|반찬|아웃리치|브릿지|호스팅|게더링|NK/;
  function key(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  fetch('https://godswillhana.org/events.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(data){
    var today=new Date();today.setHours(0,0,0,0);var out=[],seen={};
    var mine=function(x){return x.kind==='ministry'||RX.test(x.title||'')};
    for(var i=0;i<90&&out.length<4;i++){
      var d=new Date(today);d.setDate(d.getDate()+i);var k=key(d),skip=(data.skip||[]).indexOf(k)>-1;
      (data.events||[]).forEach(function(e){var a=parse(e.date),b=e.end?parse(e.end):a;if(mine(e)&&+d===+a)out.push({d:d,t:e.time||'',title:e.title,note:e.note||''})});
      if(!skip)(data.weekly||[]).forEach(function(w){if(mine(w)&&d.getDay()===w.day&&!seen[w.title]){seen[w.title]=1;out.push({d:d,t:w.time||'',title:w.title,note:'매주 '+WD[w.day]+'요일'+(w.note?' · '+w.note:''),weekly:1})}});
    }
    if(!out.length) return;
    box.innerHTML=out.slice(0,4).map(function(x){return '<li><time>'+(x.d.getMonth()+1)+'.'+x.d.getDate()+' ('+WD[x.d.getDay()]+')</time><span>'+(x.t?esc(x.t)+' · ':'')+esc(x.title)+(x.note?'<small>'+esc(x.note)+'</small>':'')+'</span></li>'}).join('');
    box.closest('.nbm-up-wrap').hidden=false;
  }).catch(function(){});
})();

// 걸어온 길: 휴대폰에서는 연도를 누르면 그해 내용이 펼쳐집니다.
(function(){
  var ol=document.querySelector('.nbm-history'); if(!ol) return;
  ol.querySelectorAll(':scope>li').forEach(function(li){
    var n=li.querySelectorAll('ul>li').length, h=li.querySelector('.nbm-yhint');
    if(h) h.textContent='주요 활동 '+n+'건';
  });
  ol.addEventListener('click',function(e){
    var b=e.target.closest('.nbm-year button,.nbm-yhint'); if(!b) return;
    var li=b.closest('.nbm-history>li'), on=!li.classList.contains('open');
    li.classList.toggle('open',on);
    li.querySelectorAll('[aria-expanded]').forEach(function(x){x.setAttribute('aria-expanded',on)});
  });
})();

// 우리의 가치: 영어 단어를 누르면 옆(휴대폰은 아래) 설명이 바뀝니다.
(function(){
  var fl=document.querySelector('.nbm-vflower'), pn=document.querySelector('.nbm-vpanel'); if(!fl||!pn) return;
  fl.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    fl.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    pn.className='nbm-vpanel '+b.parentNode.className.split(' ')[0];
    pn.querySelector('.nbm-vp-k').textContent=b.getAttribute('data-k')+(b.parentNode.classList.contains('nbm-vcore')?' · 중심 가치':'');
    pn.querySelector('.nbm-vp-e').textContent=b.querySelector('b').textContent;
    pn.querySelector('.nbm-vp-ko').textContent=b.getAttribute('data-ko');
    pn.querySelector('.nbm-vp-en').textContent=b.getAttribute('data-en');
    pn.classList.remove('flash'); void pn.offsetWidth; pn.classList.add('flash');
  });
})();

// 나눔 이야기: 반찬나눔 / 식사초대·행사 탭
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.nbm-alb-tabs [role=tab]')); if(!tabs.length) return;
  function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
    document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0; if(!d)return;
      var n=tabs[(i+d+tabs.length)%tabs.length]; sel(n); n.focus();});});
  if(location.hash==='#alb-event') sel(tabs[1]);
})();

// 4E 프로세스: 휴대폰에서는 설명을 접어 두고 '더보기'로 펼칩니다 (교회 북한선교 페이지와 같게)
(function(){
  document.querySelectorAll('.msn-4e>li').forEach(function(li,i){
    var d=li.querySelector('p:last-child'); if(!d) return;
    d.id='e4d'+(i+1);
    var b=document.createElement('button'); b.type='button'; b.className='msn-4e-more'; b.textContent='더보기';
    b.setAttribute('aria-expanded','false'); b.setAttribute('aria-controls',d.id);
    b.addEventListener('click',function(){ var on=!li.classList.contains('open'); li.classList.toggle('open',on); b.setAttribute('aria-expanded',on); b.textContent=on?'접기':'더보기'; });
    li.insertBefore(b,d);
  });
})();
