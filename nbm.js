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
