/* Super Eohwi — từ vựng tiếng Hàn kèm hán tự và âm Hán Việt */
(function(){
const {esc,speak}=SE,$=(s,r=document)=>r.querySelector(s);
const main=$('#main'),H1=$('#h1'),LEAD=$('#lead'),CRUMB=$('#crumb'),META=$('#meta');
const W=window.WORDS||[],BY={};W.forEach(w=>BY[w.id]=w);
const LV=[['k1','1급','Sơ cấp 1 · TOPIK I'],['k2','2급','Sơ cấp 2 · TOPIK I'],['k3','3급','Trung cấp 1 · TOPIK II'],['k4','4급','Trung cấp 2 · TOPIK II'],['k5','5급','Cao cấp 1 · TOPIK II'],['k6','6급','Cao cấp 2 · TOPIK II']];
const LVN=Object.fromEntries(LV.map(x=>[x[0],x[1]]));
const st=SE.store('eohwi');
const known=()=>st.get('known')||{},rv=()=>st.get('rv')||{};
const mark=(map,id,on)=>{const m=Object.assign({},st.get(map)||{});on?m[id]=1:delete m[id];st.set(map,m)};
const head=o=>{H1.textContent=o.h1;LEAD.innerHTML=o.lead||'';CRUMB.innerHTML=o.crumb||'';META.innerHTML=(o.meta||[]).map(x=>'<span class="chip">'+esc(x)+'</span>').join('')};
const SPK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
const rom=t=>'<span class="rom">'+esc(KR.rom(t))+'</span>';
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const tabs=cur=>'<nav class="tabs2" aria-label="Các mục">'+[['#/','cap','Cấp độ'],['#/han-tu','han','Hán tự'],['#/tim','tim','Tìm kiếm'],['#/test','test','Kiểm tra nhanh'],['#/on-tap','rev','Cần ôn ('+Object.keys(rv()).length+')']].map(t=>'<a href="'+t[0]+'"'+(cur===t[1]?' aria-current="true"':'')+'>'+t[2]+'</a>').join('')+'<span class="sp"></span><button type="button" id="rt" aria-pressed="'+(st.get('norom')?'false':'true')+'">romaja</button></nav>';
function afterRender(){const nr=!!st.get('norom');document.body.classList.toggle('no-rom',nr);const b=$('#rt');if(b)b.onclick=()=>{st.set('norom',!st.get('norom'));afterRender();b.setAttribute('aria-pressed',st.get('norom')?'false':'true')};
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();speak(b.dataset.say)});
  document.querySelectorAll('[data-know]').forEach(b=>b.onclick=()=>{const id=b.dataset.know,on=!known()[id];mark('known',id,on);if(on)mark('rv',id,false);b.closest('.wd').classList.toggle('k',on);b.textContent=on?'✓ Đã thuộc':'Đánh dấu đã thuộc'});
  document.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{const id=b.dataset.rv,on=!rv()[id];mark('rv',id,on);b.textContent=on?'− Bỏ khỏi cần ôn':'+ Cần ôn'})}
/* ---------- thẻ từ ---------- */
function card(w){
  const hj=w.hj?'<span class="hj" lang="ko">'+esc(w.hj)+'</span><span class="hv">'+esc(w.hv)+'</span>':'<span class="nh">không có gốc Hán</span>';
  return '<article class="wd'+(known()[w.id]?' k':'')+'"><div class="hd"><span class="ko" lang="ko">'+esc(w.ko)+'</span>'+hj+'<span class="pos">'+esc(w.pos)+' · '+LVN[w.lv]+'</span></div>'+rom(w.ko)
   +'<div class="vi">'+esc(w.vi)+'</div><div class="ex"><span class="k2" lang="ko">'+esc(w.ex)+'</span>'+rom(w.ex)+esc(w.exvi)+'</div>'
   +'<div class="ac"><button class="btn ghost sm" type="button" data-say="'+esc(w.ko)+'" aria-label="Nghe từ">'+SPK+' Từ</button><button class="btn ghost sm" type="button" data-say="'+esc(w.ex)+'" aria-label="Nghe câu">'+SPK+' Câu</button>'
   +'<button class="btn ghost sm" type="button" data-know="'+w.id+'">'+(known()[w.id]?'✓ Đã thuộc':'Đánh dấu đã thuộc')+'</button><button class="btn ghost sm" type="button" data-rv="'+w.id+'">'+(rv()[w.id]?'− Bỏ khỏi cần ôn':'+ Cần ôn')+'</button></div></article>';
}
/* ---------- trang chủ / cấp độ ---------- */
function home(){
  const hj=W.filter(w=>w.hj).length,kn=Object.keys(known()).length;
  head({h1:'Eohwi — Từ vựng tiếng Hàn',lead:'Từ vựng TOPIK 1급–6급. Với từ gốc Hán, mỗi từ đều có hán tự và âm Hán Việt, giúp người Việt đoán nghĩa và nhớ nhanh hơn.',meta:[W.length+' từ',hj+' từ có hán tự',kn+' từ đã thuộc']});
  main.innerHTML=tabs('cap')+'<p class="note"><b>Mẹo:</b> khoảng 60–70% từ vựng tiếng Hàn là từ Hán–Hàn, đọc gần giống Hán Việt (<span lang="ko">학교 學校</span> “học hiệu”, <span lang="ko">경제 經濟</span> “kinh tế”). Xem <a href="#/han-tu">chỉ mục hán tự</a> để học theo từng chữ.</p><div class="lvs">'
   +LV.map(l=>{const ws=W.filter(w=>w.lv===l[0]),k=ws.filter(w=>known()[w.id]).length;return '<a class="lvc" href="#/'+l[0]+'"><b>'+l[1]+'</b><small>'+l[2]+'</small><p style="margin:8px 0 0">'+ws.length+' từ · '+k+' đã thuộc</p><div class="bar"><i style="width:'+(ws.length?k/ws.length*100:0)+'%"></i></div></a>'}).join('')+'</div>';
}
function level(lv){
  const ws=W.filter(w=>w.lv===lv);if(!ws.length)return nf();
  const ts=[...new Set(ws.map(w=>w.t))];
  head({h1:LVN[lv]+' — '+LV.find(l=>l[0]===lv)[2],crumb:'<a href="#/">Cấp độ</a>',lead:'Chọn một chủ đề để học từng nhóm từ, hoặc luyện cả cấp.',meta:[ws.length+' từ',ts.length+' chủ đề']});
  main.innerHTML=tabs('cap')+'<div class="row" style="margin-bottom:12px"><a class="btn" href="#/'+lv+'/luyen">Luyện cả cấp '+LVN[lv]+'</a></div><div class="topics">'
   +ts.map((t,i)=>{const x=ws.filter(w=>w.t===t),k=x.filter(w=>known()[w.id]).length;return '<a href="#/'+lv+'/'+(i+1)+'"><span><b>'+esc(t)+'</b><br><small style="color:var(--muted)">'+x.length+' từ · đã thuộc '+k+'</small></span><span aria-hidden="true">›</span></a>'}).join('')+'</div>';
}
function topic(lv,n){
  const ws=W.filter(w=>w.lv===lv),ts=[...new Set(ws.map(w=>w.t))],t=ts[n-1];if(!t)return nf();
  const x=ws.filter(w=>w.t===t);
  head({h1:t,crumb:'<a href="#/">Cấp độ</a> › <a href="#/'+lv+'">'+LVN[lv]+'</a>',meta:[LVN[lv],x.length+' từ']});
  main.innerHTML=tabs('cap')+'<div class="row" style="margin-bottom:8px"><a class="btn" href="#/'+lv+'/'+n+'/luyen">Luyện nhóm này</a></div>'+x.map(card).join('');
}
const nf=()=>{head({h1:'Không có trang này'});main.innerHTML=tabs('')+'<div class="empty2">Đường dẫn không tồn tại. <a href="#/">Về trang chủ</a></div>'};
/* ---------- chỉ mục hán tự ---------- */
function hanMap(){const m={};W.forEach(w=>{if(!w.hj)return;const sy=w.hv.split(/\s+/);if([...w.hj].length!==sy.length)return;[...w.hj].forEach((c,i)=>{(m[c]=m[c]||{c,hv:new Set(),ws:[]});m[c].hv.add(sy[i].toLowerCase());m[c].ws.push(w)})});return m}
function han(q){
  const M=hanMap(),list=Object.values(M).sort((a,b)=>b.ws.length-a.ws.length||a.c.localeCompare(b.c));
  if(q){const m=M[q];if(!m)return nf();
    head({h1:m.c,crumb:'<a href="#/han-tu">Chỉ mục hán tự</a>',lead:'Âm Hán Việt: <b>'+[...m.hv].join(' / ')+'</b>. Các từ tiếng Hàn chứa chữ này:',meta:[m.ws.length+' từ']});
    main.innerHTML=tabs('han')+m.ws.map(card).join('');return}
  head({h1:'Chỉ mục hán tự',lead:'Học theo từng chữ Hán: bấm một chữ để xem mọi từ chứa nó. Rất hợp với người Việt vì âm Hán Việt gần với âm Hàn.',meta:[list.length+' chữ Hán']});
  main.innerHTML=tabs('han')+'<div class="hanj">'+list.map(m=>'<a href="#/han-tu/'+encodeURIComponent(m.c)+'"><div class="c" lang="ko">'+esc(m.c)+'</div><b>'+[...m.hv].join('/')+'</b><br><small>'+m.ws.length+' từ</small></a>').join('')+'</div>';
}
/* ---------- tìm kiếm ---------- */
function find(q){
  head({h1:'Tìm từ',lead:'Gõ tiếng Hàn, romaja, tiếng Việt, hán tự hoặc âm Hán Việt.'});
  main.innerHTML=tabs('tim')+'<input class="srch" id="q" type="search" placeholder="Ví dụ: 학교, hakgyo, trường, 學, kinh tế" value="'+esc(q||'')+'" autofocus><div id="res"></div>';
  const strip=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d');
  const run=()=>{const v=$('#q').value.trim(),R=$('#res');if(!v){R.innerHTML='<div class="empty2">Gõ để tìm trong '+W.length+' từ.</div>';return}
    const k=strip(v),r=W.filter(w=>w.ko.includes(v)||w.hj.includes(v)||strip(w.vi).includes(k)||strip(w.hv).includes(k)||KR.rom(w.ko).replace(/-/g,'').includes(k.replace(/[\s-]/g,'')));
    R.innerHTML=r.length?'<p class="note">'+r.length+' kết quả</p>'+r.slice(0,60).map(card).join(''):'<div class="empty2">Không có từ nào khớp.</div>';afterRender()};
  $('#q').oninput=run;run();
}
/* ---------- luyện tập ---------- */
function quiz(items,title,back){
  head({h1:title,crumb:'<a href="'+back+'">‹ Quay lại</a>'});
  if(items.length<4){main.innerHTML=tabs('')+'<div class="empty2">Cần ít nhất 4 từ để luyện. <a href="'+back+'">Quay lại</a></div>';afterRender();return}
  const qs=shuffle(items).slice(0,20);let i=0,ok=0;const wrong=[];
  const pool=shuffle(W);
  const mk=w=>{const kinds=['ko-vi','vi-ko'].concat(w.hj?['hj-ko','hj-vi']:[]);const kind=kinds[Math.random()*kinds.length|0];
    const f={'ko-vi':[x=>x.ko,x=>x.vi,'Nghĩa của từ này là gì?','ko'],'vi-ko':[x=>x.vi,x=>x.ko,'Từ tiếng Hàn nào có nghĩa này?',''],'hj-ko':[x=>x.hj,x=>x.ko,'Hán tự này đọc là từ Hàn nào? (âm HV: '+w.hv+')','hj'],'hj-vi':[x=>x.hj,x=>x.vi,'Từ có hán tự này nghĩa là gì?','hj']}[kind];
    const cand=pool.filter(x=>x.id!==w.id&&f[1](x)!==f[1](w)&&(kind.startsWith('hj')?true:true)).slice(0,3);
    return{w,q:f[0](w),a:f[1](w),opts:shuffle([f[1](w)].concat(cand.map(f[1]))),ask:f[2],cls:f[3]}};
  const view=()=>{
    if(i>=qs.length){main.innerHTML=tabs('')+'<div class="q"><div class="big">'+ok+'/'+qs.length+'</div><p>'+(ok/qs.length>=.8?'Rất tốt!':'Hãy ôn lại các từ sai bên dưới.')+'</p></div>'+(wrong.length?'<h3>Từ cần ôn</h3>'+wrong.map(card).join(''):'')+'<div class="row"><button class="btn" id="again" type="button">Luyện lại</button><a class="btn ghost" href="'+back+'">Quay lại</a></div>';$('#again').onclick=()=>quiz(items,title,back);afterRender();return}
    const q=mk(qs[i]);
    main.innerHTML='<p class="muted" style="color:var(--muted)">Câu '+(i+1)+'/'+qs.length+'</p><div class="q"><div class="ask">'+esc(q.ask)+'</div><div class="big '+q.cls+'" lang="ko">'+esc(q.q)+'</div><div class="opts">'+q.opts.map(o=>'<button type="button" data-o="'+esc(o)+'">'+esc(o)+'</button>').join('')+'</div></div><div id="fb"></div>';
    document.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{
      const right=b.dataset.o===q.a;document.querySelectorAll('.opts button').forEach(x=>{x.disabled=true;if(x.dataset.o===q.a)x.classList.add('ok')});
      if(!right)b.classList.add('no');
      if(right){ok++;mark('rv',q.w.id,false);}else{wrong.push(q.w);mark('rv',q.w.id,true)}
      speak(q.w.ko);$('#fb').innerHTML=card(q.w)+'<button class="btn" id="nx" type="button">'+(i+1<qs.length?'Câu tiếp →':'Xem kết quả')+'</button>';afterRender();$('#nx').onclick=()=>{i++;view()};$('#nx').focus()});
  };view();
}
function route(){
  const raw=location.hash.replace(/^#\/?/,''),[path,qs]=raw.split('?'),p=path.split('/').filter(Boolean).map(decodeURIComponent),q=new URLSearchParams(qs||'');
  window.scrollTo(0,0);
  if(!p.length)home();
  else if(p[0]==='han-tu')han(p[1]);
  else if(p[0]==='tim')find(q.get('q'));
  else if(p[0]==='test'){quiz(W,'Kiểm tra nhanh','#/')}
  else if(p[0]==='on-tap'){const ids=Object.keys(rv()).map(id=>BY[id]).filter(Boolean);head({h1:'Cần ôn',lead:'Từ bạn trả lời sai hoặc đã đánh dấu sẽ nằm ở đây.',meta:[ids.length+' từ']});
    main.innerHTML=tabs('rev')+(ids.length?'<div class="row" style="margin-bottom:8px"><a class="btn" href="#/on-tap/luyen">Luyện các từ này</a></div>'+ids.map(card).join(''):'<div class="empty2">Chưa có từ nào cần ôn.</div>')}
  else if(p[0]==='on-tap'&&p[1]==='luyen'){}
  else if(LVN[p[0]]){if(!p[1])level(p[0]);else if(p[1]==='luyen')quiz(W.filter(w=>w.lv===p[0]),'Luyện '+LVN[p[0]],'#/'+p[0]);else if(p[2]==='luyen'){const t=[...new Set(W.filter(w=>w.lv===p[0]).map(w=>w.t))][p[1]-1];quiz(W.filter(w=>w.lv===p[0]&&w.t===t),t,'#/'+p[0]+'/'+p[1])}else topic(p[0],+p[1])}
  else nf();
  afterRender();
}
/* “on-tap/luyen” xử lý riêng vì route đầu đã khớp p[0]==='on-tap' */
const _route=route;
function route2(){const raw=location.hash.replace(/^#\/?/,'');if(raw==='on-tap/luyen'){const ids=Object.keys(rv()).map(id=>BY[id]).filter(Boolean);quiz(ids,'Luyện từ cần ôn','#/on-tap');afterRender();return}_route()}
window.addEventListener('hashchange',route2);route2();
})();
