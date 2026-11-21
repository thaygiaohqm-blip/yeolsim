/* Super Eohwi — từ vựng tiếng Hàn kèm hán tự và âm Hán Việt */
(function(){
const {esc,speak}=SE,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const main=$('#main'),H1=$('#h1'),LEAD=$('#lead'),CRUMB=$('#crumb'),META=$('#meta');
const WF=window.WF||[],W=(window.WORDS||[]).map(r=>{const o={};WF.forEach((k,i)=>o[k]=r[i]);return o}),BY={};W.forEach(w=>BY[w.id]=w);
const CH=50,byLv=lv=>W.filter(w=>w.lv===lv);
const GT=window.GT||[];
GT.forEach(b=>b.units.forEach(u=>{u.e=u.w.map(i=>BY[i]).filter(Boolean).concat((u.x||[]).map((x,j)=>{const id='x:'+b.id+':'+u.n+':'+j,e={id,ko:x[0],hj:x[1],hv:x[2],vi:x[3],pos:'',lv:'',ex:'',exvi:'',t:'',r:0};BY[id]=e;return e}))}));
const LV=[['k1','1급','Sơ cấp 1 · TOPIK I'],['k2','2급','Sơ cấp 2 · TOPIK I'],['k3','3급','Trung cấp 1 · TOPIK II'],['k4','4급','Trung cấp 2 · TOPIK II'],['k5','5급','Cao cấp 1 · TOPIK II'],['k6','6급','Cao cấp 2 · TOPIK II']];
const LVN=Object.fromEntries(LV.map(x=>[x[0],x[1]]));
const st=SE.store('eohwi');
(function mig(){const O=window.WOLD||{};['known','rv'].forEach(n=>{const m=st.get(n);if(!m)return;let ch=0;const o={};Object.keys(m).forEach(k=>{if(O[k]){o[O[k]]=1;ch=1}else o[k]=m[k]});if(ch)st.set(n,o)})})();
const known=()=>st.get('known')||{},rv=()=>st.get('rv')||{};
const mark=(map,id,on)=>{const m=Object.assign({},st.get(map)||{});on?m[id]=1:delete m[id];st.set(map,m)};
const head=o=>{H1.textContent=o.h1;LEAD.innerHTML=o.lead||'';CRUMB.innerHTML=o.crumb||'';META.innerHTML=(o.meta||[]).map(x=>'<span class="chip">'+esc(x)+'</span>').join('')};
const SPK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
const rom=t=>'<span class="rom">'+esc(KR.rom(t))+'</span>';
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const MODES=[['card','Học thẻ'],['quiz','Trắc nghiệm'],['write','Viết lại'],['dict','Nghe – viết'],['match','Ghép cặp'],['reflex','Phản xạ'],['table','Bảng che']];
const bar=(base,n)=>n>=1?'<div class="toolrow"><span class="tl">Ôn tập</span>'+MODES.map(m=>'<a class="btn ghost sm" href="'+base+'/luyen?m='+m[0]+'">'+m[1]+'</a>').join('')+'</div>':'';
const tabs=cur=>'<nav class="tabs2" aria-label="Các mục">'+[['#/','cap','Cấp độ'],['#/giao-trinh','gt','Giáo trình'],['#/han-tu','han','Hán tự'],['#/tim','tim','Tìm kiếm'],['#/test','test','Kiểm tra trình độ'],['#/on-tap','rev','Ôn tập ('+(Object.keys(rv()).length+(window.__due||0))+')']].map(t=>'<a href="'+t[0]+'"'+(cur===t[1]?' aria-current="true"':'')+'>'+t[2]+'</a>').join('')+'<span class="sp"></span><button type="button" id="rt" aria-pressed="'+(st.get('norom')?'false':'true')+'">romaja</button></nav>';
function afterRender(){const nr=!!st.get('norom');document.body.classList.toggle('no-rom',nr);const b=$('#rt');if(b)b.onclick=()=>{st.set('norom',!st.get('norom'));afterRender();b.setAttribute('aria-pressed',st.get('norom')?'false':'true')};
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.stopPropagation();speak(b.dataset.say)});
  document.querySelectorAll('[data-know]').forEach(b=>b.onclick=()=>{const id=b.dataset.know,on=!known()[id];mark('known',id,on);if(on)mark('rv',id,false);b.closest('.wd').classList.toggle('k',on);b.textContent=on?'✓ Đã thuộc':'Đánh dấu đã thuộc'});
  document.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{const id=b.dataset.rv,on=!rv()[id];mark('rv',id,on);b.textContent=on?'− Bỏ khỏi cần ôn':'+ Cần ôn'})}
/* ---------- thẻ từ ---------- */
function card(w){
  const hj=w.hj?'<span class="hj" lang="ko">'+esc(w.hj)+'</span><span class="hv">'+esc(w.hv)+'</span>':'<span class="nh">không có gốc Hán</span>';
  return '<article class="wd'+(known()[w.id]?' k':'')+'"><div class="hd"><span class="ko" lang="ko">'+esc(w.ko)+'</span>'+hj+'<span class="pos">'+esc(w.pos)+(w.lv?' · '+LVN[w.lv]:'')+'</span></div>'+rom(w.ko)
   +'<div class="vi">'+esc(w.vi)+'</div>'+(w.ex?'<div class="ex"><span class="k2" lang="ko">'+esc(w.ex)+'</span>'+rom(w.ex)+esc(w.exvi)+'</div>':'')
   +'<div class="ac"><button class="btn ghost sm" type="button" data-say="'+esc(w.ko)+'" aria-label="Nghe từ">'+SPK+' Từ</button>'+(w.ex?'<button class="btn ghost sm" type="button" data-say="'+esc(w.ex)+'" aria-label="Nghe câu">'+SPK+' Câu</button>':'')
   +'<button class="btn ghost sm" type="button" data-know="'+w.id+'">'+(known()[w.id]?'✓ Đã thuộc':'Đánh dấu đã thuộc')+'</button><button class="btn ghost sm" type="button" data-rv="'+w.id+'">'+(rv()[w.id]?'− Bỏ khỏi cần ôn':'+ Cần ôn')+'</button></div></article>';
}
/* thẻ cho từ riêng của giáo trình (chưa có trong danh sách cấp độ) */
function xcard(x){
  const hj=x[1]?'<span class="hj" lang="ko">'+esc(x[1])+'</span><span class="hv">'+esc(x[2])+'</span>':'<span class="nh">không có gốc Hán</span>';
  return '<article class="wd"><div class="hd"><span class="ko" lang="ko">'+esc(x[0])+'</span>'+hj+'</div>'+rom(x[0])+'<div class="vi">'+esc(x[3])+'</div><div class="ac"><button class="btn ghost sm" type="button" data-say="'+esc(x[0])+'">'+SPK+' Từ</button></div></article>';
}
/* ---------- trang chủ / cấp độ ---------- */
function home(){
  const hj=W.filter(w=>w.hj).length,kn=Object.keys(known()).length;
  head({h1:'Eohwi — Từ vựng tiếng Hàn',lead:'Toàn bộ từ vựng trong danh sách từ vựng học tiếng Hàn của Viện Quốc ngữ (NIKL), chia thành 6 cấp 1급–6급. Từ gốc Hán đều có hán tự và âm Hán Việt, giúp người Việt đoán nghĩa và nhớ nhanh hơn.',meta:[W.length.toLocaleString('vi-VN')+' từ',hj.toLocaleString('vi-VN')+' từ có hán tự',kn+' từ đã thuộc']});
  main.innerHTML=tabs('cap')+'<p class="note"><b>Mẹo:</b> khoảng 60–70% từ vựng tiếng Hàn là từ Hán–Hàn, đọc gần giống Hán Việt (<span lang="ko">학교 學校</span> “học hiệu”, <span lang="ko">경제 經濟</span> “kinh tế”). Xem <a href="#/han-tu">chỉ mục hán tự</a> để học theo từng chữ.</p><div class="lvs">'
   +LV.map(l=>{const ws=byLv(l[0]),k=ws.filter(w=>known()[w.id]).length;return '<a class="lvc" href="#/'+l[0]+'"><b>'+l[1]+'</b><small>'+l[2]+'</small><p style="margin:8px 0 0">'+ws.length+' từ · '+k+' đã thuộc</p><div class="bar"><i style="width:'+(ws.length?k/ws.length*100:0)+'%"></i></div></a>'}).join('')+'</div>'
   +'<p class="note" style="margin-top:16px">Nguồn từ vựng và phân cấp: <i>한국어 학습용 어휘 목록</i> của Viện Quốc ngữ Hàn Quốc (국립국어원), giấy phép KOGL loại 1. Việc chia thành 6 cấp dựa trên hạng A/B/C của danh sách gốc và tần suất sử dụng, không phải danh sách chính thức của TOPIK. Nghĩa tiếng Việt và âm Hán Việt do Yeolsim soạn/suy ra tự động, có thể còn sai sót.</p>';
}
function level(lv){
  const ws=byLv(lv);if(!ws.length)return nf();
  const n=Math.ceil(ws.length/CH),ts=[...new Set(ws.map(w=>w.t).filter(Boolean))];
  head({h1:LVN[lv]+' — '+LV.find(l=>l[0]===lv)[2],crumb:'<a href="#/">Cấp độ</a>',lead:'Học theo từng nhóm '+CH+' từ, sắp xếp theo mức độ thông dụng (từ thông dụng nhất đứng trước).',meta:[ws.length+' từ',n+' nhóm']});
  let h=tabs('cap')+bar('#/'+lv,ws.length);
  if(ts.length)h+='<h3>Theo chủ đề (từ có ví dụ)</h3><div class="topics">'+ts.map((t,i)=>{const x=ws.filter(w=>w.t===t),k=x.filter(w=>known()[w.id]).length;return '<a href="#/'+lv+'/t/'+(i+1)+'"><span><b>'+esc(t)+'</b><br><small style="color:var(--muted)">'+x.length+' từ · đã thuộc '+k+'</small></span><span aria-hidden="true">›</span></a>'}).join('')+'</div><h3 style="margin-top:20px">Theo nhóm thông dụng</h3>';
  h+='<div class="topics">';
  for(let i=0;i<n;i++){const x=ws.slice(i*CH,(i+1)*CH),k=x.filter(w=>known()[w.id]).length;h+='<a href="#/'+lv+'/'+(i+1)+'"><span><b>Nhóm '+(i+1)+'</b> <span lang="ko">'+esc(x[0].ko)+' … '+esc(x[x.length-1].ko)+'</span><br><small style="color:var(--muted)">'+x.length+' từ · đã thuộc '+k+'</small></span><span aria-hidden="true">›</span></a>'}
  main.innerHTML=h+'</div>';
}
function group(lv,n,t){
  const ws=byLv(lv);let x,title,back,lq;
  if(t){const ts=[...new Set(ws.map(w=>w.t).filter(Boolean))],tt=ts[n-1];if(!tt)return nf();x=ws.filter(w=>w.t===tt);title=tt;lq='#/'+lv+'/t/'+n}
  else{x=ws.slice((n-1)*CH,n*CH);if(!x.length)return nf();title='Nhóm '+n;lq='#/'+lv+'/'+n}
  head({h1:title,crumb:'<a href="#/">Cấp độ</a> › <a href="#/'+lv+'">'+LVN[lv]+'</a>',meta:[LVN[lv],x.length+' từ']});
  const nav=t?'':'<div class="row" style="margin-top:12px">'+(n>1?'<a class="btn ghost" href="#/'+lv+'/'+(n-1)+'">← Nhóm trước</a>':'')+(n*CH<ws.length?'<a class="btn" href="#/'+lv+'/'+(n+1)+'">Nhóm sau →</a>':'')+'</div>';
  main.innerHTML=tabs('cap')+bar(lq,x.length)+x.map(card).join('')+nav;
}
/* ---------- giáo trình ---------- */
function gtList(){
  head({h1:'Từ vựng theo giáo trình',lead:'Từ mới của từng bài trong bộ giáo trình Tiếng Hàn Tổng hợp (Sejong/KF). Chọn một quyển, rồi chọn bài.',meta:[GT.length+' quyển']});
  main.innerHTML=tabs('gt')+'<div class="lvs">'+GT.map(b=>{const n=b.units.reduce((a,u)=>a+u.e.length,0);return b.units.length?'<a class="lvc" href="#/giao-trinh/'+b.id+'"><b>'+esc(b.name)+'</b><small>'+esc(b.vi)+'</small><p style="margin:8px 0 0">'+b.units.length+' bài · '+n+' từ</p></a>':'<div class="lvc" style="opacity:.55"><b>'+esc(b.name)+'</b><small>'+esc(b.vi)+'</small><p style="margin:8px 0 0">Chưa có dữ liệu</p></div>'}).join('')+'</div><p class="note" style="margin-top:16px">Từ vựng được đối chiếu từ “Bảng từ mới” cuối mỗi quyển với danh sách từ vựng NIKL, nên có thể chưa đủ mọi từ trong sách. Sách và âm thanh gốc không đi kèm trang này.</p>';
}
function gtBook(id){
  const b=GT.find(x=>x.id===id);if(!b||!b.units.length)return nf();
  head({h1:b.name,crumb:'<a href="#/giao-trinh">Giáo trình</a>',lead:esc(b.vi),meta:[b.units.length+' bài']});
  main.innerHTML=tabs('gt')+'<div class="topics">'+b.units.map(u=>{const c=u.e.length,k=u.e.filter(w=>known()[w.id]).length;return '<a href="#/giao-trinh/'+id+'/'+u.n+'"><span><b>Bài '+u.n+'</b> <span lang="ko">'+esc(u.ko)+'</span> — '+esc(u.vi)+'<br><small style="color:var(--muted)">'+c+' từ · đã thuộc '+k+'</small></span><span aria-hidden="true">›</span></a>'}).join('')+'</div>';
}
function gtUnit(id,n,practice){
  const b=GT.find(x=>x.id===id),u=b&&b.units.find(x=>x.n===n);if(!u)return nf();
  const ws=u.e,back='#/giao-trinh/'+id+'/'+n;
  if(practice)return quiz(ws,b.name+' · Bài '+n,back,{file:b.id+'-bai'+n,tab:'gt'});
  head({h1:'Bài '+n+' · '+u.ko,crumb:'<a href="#/giao-trinh">Giáo trình</a> › <a href="#/giao-trinh/'+id+'">'+esc(b.name)+'</a>',lead:esc(u.vi),meta:[ws.length+' từ']});
  const prev=b.units.find(x=>x.n===n-1),next=b.units.find(x=>x.n===n+1);
  main.innerHTML=tabs('gt')+bar(back,ws.length)+ws.map(card).join('')
   +'<div class="row" style="margin-top:12px">'+(prev?'<a class="btn ghost" href="#/giao-trinh/'+id+'/'+prev.n+'">← Bài '+prev.n+'</a>':'')+(next?'<a class="btn" href="#/giao-trinh/'+id+'/'+next.n+'">Bài '+next.n+' →</a>':'')+'</div>';
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
let IDX=null;
const strip=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
function idx(){if(!IDX)IDX=W.map(w=>({w,vi:strip(w.vi),hv:strip(w.hv),r:KR.rom(w.ko).replace(/[-\s]/g,'')}));return IDX}
function find(q){
  head({h1:'Tìm từ',lead:'Gõ tiếng Hàn, romaja, tiếng Việt, hán tự hoặc âm Hán Việt.'});
  main.innerHTML=tabs('tim')+'<input class="srch" id="q" type="search" placeholder="Ví dụ: 학교, hakgyo, trường, 學, kinh tế" value="'+esc(q||'')+'" autofocus><div id="res"></div>';
  let tm;
  const run=()=>{const v=$('#q').value.trim(),R=$('#res');if(!v){R.innerHTML='<div class="empty2">Gõ để tìm trong '+W.length.toLocaleString('vi-VN')+' từ.</div>';return}
    const k=strip(v),kr=k.replace(/[\s-]/g,''),r=idx().filter(o=>o.w.ko.includes(v)||(o.w.hj&&o.w.hj.includes(v))||o.vi.includes(k)||(o.hv&&o.hv.includes(k))||o.r.includes(kr)).map(o=>o.w);
    r.sort((a,b)=>(b.ko===v)-(a.ko===v)||a.r-b.r);
    R.innerHTML=r.length?'<p class="note">'+r.length+' kết quả'+(r.length>60?' (hiện 60 đầu)':'')+'</p>'+r.slice(0,60).map(card).join(''):'<div class="empty2">Không có từ nào khớp.</div>';afterRender()};
  $('#q').oninput=()=>{clearTimeout(tm);tm=setTimeout(run,120)};run();
}
/* ---------- luyện tập (bộ công cụ ôn tập trong study.js) ---------- */
const C0={};
const study=EhStudy(Object.assign(C0,{main,head,tabs,esc,speak,rom,st,shuffle,W,SPK,afterRender,mark,known,rv,BY,card}));
function quiz(items,title,back,o){o=o||{};const m=new URLSearchParams((location.hash.split('?')[1])||'').get('m');study({items,title,back,mode:m||o.mode||'card',file:o.file||'eohwi',tab:o.tab||'',sub:o.sub})}
/* ---------- kiểm tra trình độ ---------- */
function placement(){
  head({h1:'Kiểm tra trình độ',lead:'Làm lần lượt 6 chặng từ 1급 đến 6급, mỗi chặng 6 câu. Đúng từ 5/6 câu mới sang chặng kế tiếp. Kết quả gợi ý cấp độ nên bắt đầu.'});
  const last=st.get('placement');
  main.innerHTML=tabs('test')+(last?'<p class="note">Kết quả gần nhất: gợi ý bắt đầu từ <b>'+esc(last.lv)+'</b> ('+new Date(last.at).toLocaleDateString('vi-VN')+').</p>':'')+'<div class="q"><p>Bài kiểm tra không tính vào tiến độ học. Không biết thì bấm “Không biết”, đừng đoán.</p><button class="btn" id="go" type="button">Bắt đầu</button></div>';
  $('#go').onclick=()=>{let stage=0,k=0,right=0;const hist=[];let qs=null;
    const run=()=>{
      const lv=LV[stage][0];
      if(!qs)qs=shuffle(byLv(lv).filter(w=>w.vi)).slice(0,6);
      if(k>=6){hist.push([LV[stage][1],right]);
        if(right>=5&&stage<5){stage++;k=0;right=0;qs=null;return run()}
        const start=right>=5?'6급':(right>=3?LV[stage][1]:LV[Math.max(0,stage-1)][1]);
        st.set('placement',{lv:start,at:Date.now()});
        main.innerHTML=tabs('test')+'<div class="q done"><div class="big">'+esc(start)+'</div><p>Gợi ý: bắt đầu ôn từ cấp '+esc(start)+'.</p><p style="color:var(--muted)">'+hist.map(h=>h[0]+': '+h[1]+'/6').join(' · ')+'</p><div class="row c"><a class="btn" href="#/k'+parseInt(start)+'">Học '+esc(start)+'</a><button class="btn ghost" id="again" type="button">Làm lại</button></div></div>';$('#again').onclick=placement;return}
      const w=qs[k],op=shuffle([w.vi].concat(shuffle(W.filter(x=>x.lv===lv&&x.pos===w.pos&&x.vi&&x.vi!==w.vi)).slice(0,3).map(x=>x.vi)));
      main.innerHTML=tabs('test')+'<p class="prog">Chặng '+LV[stage][1]+' · câu '+(k+1)+'/6<i style="width:'+k/6*100+'%"></i></p><div class="q"><div class="ask">Nghĩa của từ này là gì?</div><div class="big" lang="ko">'+esc(w.ko)+'</div><div class="opts">'+op.map((o,i)=>'<button type="button" data-o="'+i+'">'+esc(o)+'</button>').join('')+'</div><div class="row c"><button class="btn ghost sm" id="dk" type="button">Không biết</button></div></div>';
      const nx=ok=>{if(ok)right++;k++;run()};
      $$('.opts button').forEach((b,i)=>b.onclick=()=>nx(op[i]===w.vi));$('#dk').onclick=()=>nx(false);
    };run()};
}
function route(){window.__due=C0.dueIds().length;
  const raw=location.hash.replace(/^#\/?/,''),[path,qs]=raw.split('?'),p=path.split('/').filter(Boolean).map(decodeURIComponent),q=new URLSearchParams(qs||'');
  window.scrollTo(0,0);
  const L=p[p.length-1]==='luyen';
  if(!p.length)home();
  else if(p[0]==='han-tu')han(p[1]);
  else if(p[0]==='tim')find(q.get('q'));
  else if(p[0]==='test')placement();
  else if(p[0]==='den-han'){const ids=C0.dueIds().map(id=>BY[id]);quiz(ids,'Ôn đến hạn','#/on-tap',{file:'den-han',tab:'rev'})}
  else if(p[0]==='on-tap'){const ids=Object.keys(rv()).map(id=>BY[id]).filter(Boolean);
    if(L)quiz(ids,'Luyện từ chưa thuộc','#/on-tap',{file:'can-on',tab:'rev'});
    else{const due=C0.dueIds().length;head({h1:'Ôn tập',lead:'Lịch ôn ngắt quãng (1, 2, 4, 8, 16, 32 ngày) tự xếp các từ đến hạn. Từ trả lời sai hoặc bấm “Chưa thuộc” nằm ở mục chưa thuộc.',meta:[due+' từ đến hạn',ids.length+' từ chưa thuộc',C0.learnedN()+' từ đã vào lịch ôn']});
      main.innerHTML=tabs('rev')+'<div class="lvs"><a class="lvc" href="#/den-han/luyen"><b>Đến hạn ôn</b><small>Ôn đúng lúc sắp quên</small><p style="margin:8px 0 0">'+due+' từ</p></a><a class="lvc" href="#/on-tap/luyen"><b>Chưa thuộc</b><small>Từ sai hoặc đã đánh dấu</small><p style="margin:8px 0 0">'+ids.length+' từ</p></a></div>'+(ids.length?bar('#/on-tap',ids.length)+ids.map(card).join(''):'<div class="empty2">Chưa có từ nào cần ôn.</div>')}}

  else if(p[0]==='giao-trinh'){if(!p[1])gtList();else if(!p[2])gtBook(p[1]);else gtUnit(p[1],+p[2],L)}
  else if(LVN[p[0]]){const lv=p[0];
    if(!p[1])level(lv);
    else if(p[1]==='luyen')quiz(byLv(lv),'Luyện '+LVN[lv],'#/'+lv);
    else if(p[1]==='t'){const ts=[...new Set(byLv(lv).map(w=>w.t).filter(Boolean))],n=+p[2];
      if(p[3]==='luyen')quiz(byLv(lv).filter(w=>w.t===ts[n-1]),ts[n-1]||'',  '#/'+lv+'/t/'+n);else group(lv,n,true)}
    else if(p[2]==='luyen')quiz(byLv(lv).slice((+p[1]-1)*CH,+p[1]*CH),'Nhóm '+p[1]+' · '+LVN[lv],'#/'+lv+'/'+p[1]);
    else group(lv,+p[1],false)}
  else nf();
  afterRender();
}
window.addEventListener('hashchange',route);route();
})();
