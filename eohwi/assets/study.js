/* Eohwi — bộ công cụ ôn tập: học thẻ, trắc nghiệm, viết lại, nghe–viết, ghép cặp, phản xạ, bảng che, tải bộ từ, in phiếu tập viết.
   Lịch ôn ngắt quãng (1·2·4·8·16·32 ngày) lưu theo từng từ. */
window.EhStudy=function(C){
const {main,head,tabs,esc,speak,rom,st,shuffle,W,SPK,afterRender}=C;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* ---- hiệu ứng ---- */
const calm=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function celebrate(el,big){
  if(!el)return;try{el.animate([{transform:'scale(1)'},{transform:'scale(1.045)'},{transform:'scale(1)'}],{duration:380,easing:'cubic-bezier(.3,1.6,.5,1)'})}catch(e){}
  if(calm())return;const r=el.getBoundingClientRect(),cols=['#27c4b5','#ed3838','#e2b13a','#2a5fa8','#f4ecd8'];
  const n=big?46:16,x0=r.left+r.width/2,y0=r.top+r.height/2;
  for(let i=0;i<n;i++){const d=document.createElement('i');d.className='confetto';d.style.cssText='left:'+x0+'px;top:'+y0+'px;background:'+cols[i%cols.length]+';'+(i%3?'':'border-radius:50%;');document.body.appendChild(d);
    const ang=Math.random()*Math.PI*2,dist=(big?140:70)+Math.random()*(big?160:60),dx=Math.cos(ang)*dist,dy=Math.sin(ang)*dist*.7-(big?60:30);
    d.animate([{transform:'translate(-50%,-50%) rotate(0) scale(1)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px)) rotate('+(Math.random()*540-270)+'deg) scale(.9)',opacity:1,offset:.6},{transform:'translate(calc(-50% + '+dx*1.1+'px), calc(-50% + '+(dy+70)+'px)) rotate('+Math.random()*720+'deg) scale(.6)',opacity:0}],{duration:750+Math.random()*450,easing:'cubic-bezier(.2,.7,.4,1)'}).onfinish=()=>d.remove()}
}
function wobble(el){if(!el)return;if(calm()){el.animate([{opacity:1},{opacity:.55},{opacity:1}],{duration:300});return}
  el.animate([{transform:'translateX(0)'},{transform:'translateX(-9px)'},{transform:'translateX(8px)'},{transform:'translateX(-6px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:420,easing:'ease-out'})}
function glow(el,ok){if(!el||calm())return;const c=ok?'#27c4b5':'#ed3838';el.animate(ok?[{boxShadow:'0 0 0 0 '+c+'99'},{boxShadow:'0 0 0 16px '+c+'00'}]:[{boxShadow:'inset 0 0 0 2px '+c},{boxShadow:'inset 0 0 0 0 '+c+'00'}],{duration:ok?700:600,easing:'ease-out'})}
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(45)}catch(e){}};
const PRAISE=[['Chính xác!','정답'],['Tuyệt vời!','대단해요'],['Giỏi lắm!','잘했어요'],['Chuẩn rồi!','완벽해요'],['Đúng rồi!','맞아요']],OOPS=[['Chưa đúng','아쉬워요'],['Suýt nữa rồi','조금만 더'],['Chưa chính xác','틀렸어요']];
const ICON_OK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',ICON_NO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10"/><path d="M17 7L7 17"/></svg>';
function verdictHTML(ok,ans,streak){const l=ok?PRAISE:OOPS,w=l[Math.random()*l.length|0];
  return '<span class="verdict verdict--'+(ok?'ok':'no')+'"><span class="verdict__icon">'+(ok?ICON_OK:ICON_NO)+'</span><span class="verdict__word">'+w[0]+'<span class="verdict__ko" lang="ko">'+w[1]+(ok?'!':'…')+'</span></span>'+(ok&&streak>=3?'<span class="streak">'+streak+' câu đúng liên tiếp</span>':'')+'</span>'+(ans?'<div class="verdict__ans">'+ans+'</div>':'')}
const fxAns=(btn,ok)=>{glow(btn,ok);if(ok)celebrate(btn,false);else{wobble(btn);buzz()}};
const DAY=864e5,IV=[0,1,2,4,8,16,32];
const srs=()=>st.get('srs')||{};
const MODES=[['card','카','Học thẻ'],['quiz','선','Trắc nghiệm'],['write','쓰','Viết lại'],['dict','듣','Nghe – viết'],['match','짝','Ghép cặp'],['reflex','속','Phản xạ'],['table','표','Bảng che']];
C.MODES=MODES;
/* ---- lịch ôn ---- */
function grade(id,ok){
  const s=Object.assign({},srs()),b=s[id]?s[id][0]:0,nb=ok?Math.min(b+1,6):0;
  s[id]=[nb,Date.now()+IV[nb]*DAY];st.set('srs',s);
  C.mark('rv',id,!ok);C.mark('known',id,ok&&nb>=2?true:(ok?!!C.known()[id]:false));
}
C.grade=grade;
C.dueIds=()=>{const n=Date.now(),s=srs();return Object.keys(s).filter(id=>s[id][1]<=n&&C.BY[id])};
C.learnedN=()=>Object.keys(srs()).length;
/* ---- tiện ích ---- */
const clean=s=>String(s).replace(/\([^)]*\)/g,'').replace(/[~…]/g,'').trim();
const nz=s=>clean(s).replace(/[\s\-·.,!?'"“”]/g,'').toLowerCase();
const rz=s=>(typeof KR!=='undefined'?KR.rom(clean(s)):'').replace(/[\s\-']/g,'').toLowerCase();
function okAns(t,w){const a=nz(t);if(!a)return false;if(a===nz(w.ko))return true;if(/^[a-z]+$/.test(a)&&a===rz(w.ko))return true;return false}
const hjHTML=w=>w.hj?'<span class="hj" lang="ko">'+esc(w.hj)+'</span><span class="hv">'+esc(w.hv)+'</span>':'';
function opts4(w,items,get){
  const v=get(w),seen=new Set([v]),pick=[];
  const pools=[shuffle(items).filter(x=>x.pos===w.pos&&x.pos),shuffle(items),shuffle(W).filter(x=>x.lv===w.lv&&x.pos===w.pos),shuffle(W)];
  for(const p of pools){for(const x of p){if(pick.length>=3)break;const g=get(x);if(g&&!seen.has(g)&&x.id!==w.id){seen.add(g);pick.push(g)}}if(pick.length>=3)break}
  return shuffle([v].concat(pick));
}
function ring(right,total){const c=2*Math.PI*52,p=total?right/total:0;return '<svg class="score-ring" viewBox="0 0 120 120" role="img" aria-label="Đúng '+Math.round(p*100)+' phần trăm"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+c.toFixed(1)+'" data-off="'+(c*(1-p)).toFixed(1)+'"/><text x="60" y="58" text-anchor="middle">'+right+'/'+total+'</text><text x="60" y="78" text-anchor="middle" class="sub">'+Math.round(p*100)+'%</text></svg>'}
function afterDone(root,r,t){const fg=$('.score-ring .fg',root);if(fg)requestAnimationFrame(()=>requestAnimationFrame(()=>{fg.style.strokeDashoffset=fg.dataset.off}));if(t&&r/t>=.7)setTimeout(()=>celebrate($('.score-ring',root),true),650)}
function dl(items,name,fmt){
  const sep=fmt==='csv'?',':'\t',q=s=>fmt==='csv'?'"'+String(s||'').replace(/"/g,'""')+'"':String(s||'').replace(/[\t\n]/g,' ');
  const rows=items.map(w=>[w.ko,w.hj,w.hv,typeof KR!=='undefined'?KR.rom(w.ko):'',w.vi,w.ex,w.exvi].map(q).join(sep));
  const head1=['Hàn','Hán tự','Âm Hán Việt','Romaja','Nghĩa','Ví dụ','Nghĩa ví dụ'].map(q).join(sep);
  const b=new Blob(['﻿'+head1+'\n'+rows.join('\n')],{type:'text/'+(fmt==='csv'?'csv':'tab-separated-values')+';charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.'+fmt;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
}
function printSheet(items,title){
  let d=$('#printsheet');if(d)d.remove();d=document.createElement('div');d.id='printsheet';
  d.innerHTML='<h2>'+esc(title)+' — phiếu tập viết</h2>'+items.map(w=>'<div class="ps-row"><div class="ps-w"><b lang="ko">'+esc(w.ko)+'</b><small>'+esc(w.hj?w.hj+' · '+w.hv:'')+'</small><small>'+esc(w.vi)+'</small></div><div class="ps-g">'+Array.from({length:7},(_,i)=>'<span lang="ko" class="'+(i<2?'g1':'')+'">'+(i<2?esc(w.ko):'')+'</span>').join('')+'</div></div>').join('');
  document.body.appendChild(d);document.body.classList.add('printing');
  const done=()=>{document.body.classList.remove('printing');d.remove();window.removeEventListener('afterprint',done)};
  window.addEventListener('afterprint',done);setTimeout(()=>window.print(),50);
}
/* ---- chính ---- */
function study(cfg){
  const items=cfg.items.slice(),n=items.length;
  const S={mode:MODES.some(m=>m[0]===cfg.mode)?cfg.mode:'card',i:0,flip:false,dir:st.get('dir')||'ko',list:false,timer:null,keys:null};
  const cleanup=()=>{clearInterval(S.timer);if(S.keys)document.removeEventListener('keydown',S.keys);S.keys=null;document.removeEventListener('click',closeMenu)};
  window.addEventListener('hashchange',cleanup,{once:true});
  const dueN=items.filter(w=>srs()[w.id]&&srs()[w.id][1]<=Date.now()).length;
  head({h1:cfg.title,crumb:'<a href="'+cfg.back+'">‹ '+esc(cfg.backText||'Quay lại')+'</a>',lead:cfg.sub||'',meta:[n+' từ']});
  if(!n){main.innerHTML=tabs('')+'<div class="empty2">Chưa có từ nào để luyện. <a href="'+cfg.back+'">Quay lại</a></div>';afterRender();return}
  main.innerHTML=tabs(cfg.tab||'')+'<section class="study"><div class="study__bar"><div class="modes" role="group" aria-label="Chế độ luyện tập">'
   +MODES.map(m=>'<button type="button" data-mode="'+m[0]+'"><span lang="ko">'+m[1]+'</span>'+m[2]+'</button>').join('')+'</div>'
   +'<div class="study__stats"><span>Đã học <b data-s-ok></b></span><span class="rvs">Cần ôn <b data-s-rv></b></span>'+(dueN?'<span class="due">Đến hạn <b>'+dueN+'</b></span>':'')
   +'<button class="btn ghost sm" type="button" data-list>Danh sách</button>'
   +'<span class="dl"><button class="btn ghost sm" type="button" data-dl aria-expanded="false">Tải / In</button><span class="dl__menu" hidden><button type="button" data-fmt="tsv">.TSV (Anki, Quizlet)</button><button type="button" data-fmt="csv">.CSV (Excel, Sheets)</button><button type="button" data-print>In phiếu tập viết</button></span></span></div></div>'
   +'<div class="wl" data-wl hidden></div><div data-stage></div></section>';
  const stage=$('[data-stage]'),wl=$('[data-wl]');
  const stats=()=>{const k=C.known();$('[data-s-ok]').textContent=items.filter(w=>k[w.id]).length+'/'+n;$('[data-s-rv]').textContent=items.filter(w=>C.rv()[w.id]).length};
  function paintList(){wl.innerHTML=items.map((w,i)=>{const s=srs()[w.id];return '<button type="button" data-go="'+i+'"'+(S.mode==='card'&&i===S.i?' aria-current="true"':'')+'><i>'+(i+1)+'</i><b lang="ko">'+esc(w.ko)+'</b><span>'+esc(w.vi)+'</span><u class="dot b'+(s?s[0]:'x')+'"></u></button>'}).join('')}
  wl.onclick=e=>{const b=e.target.closest('[data-go]');if(!b)return;S.mode='card';S.i=+b.dataset.go;S.flip=false;wl.hidden=true;paint()};
  $('[data-list]').onclick=()=>{wl.hidden=!wl.hidden;if(!wl.hidden)paintList()};
  const dlb=$('[data-dl]'),dlm=$('.dl__menu');dlb.onclick=e=>{e.stopPropagation();dlm.hidden=!dlm.hidden;dlb.setAttribute('aria-expanded',!dlm.hidden)};
  function closeMenu(e){if(!e.target.closest('.dl')){dlm.hidden=true;dlb.setAttribute('aria-expanded','false')}}
  document.addEventListener('click',closeMenu);
  $$('[data-fmt]').forEach(b=>b.onclick=()=>{dl(items,(cfg.file||'eohwi'),b.dataset.fmt);dlm.hidden=true});
  $('[data-print]').onclick=()=>{dlm.hidden=true;printSheet(items,cfg.title)};
  $$('[data-mode]').forEach(b=>b.onclick=()=>{S.mode=b.dataset.mode;S.flip=false;history.replaceState(null,'',location.hash.replace(/([?&])m=[^&]*&?/,'$1').replace(/[?&]$/,'')+(location.hash.includes('?')?'&':'?')+'m='+S.mode);paint()});
  function paint(){clearInterval(S.timer);if(S.keys){document.removeEventListener('keydown',S.keys);S.keys=null}
    $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));
    ({card:pCard,quiz:pQuiz,write:()=>pWrite(false),dict:()=>pWrite(true),match:pMatch,reflex:pReflex,table:pTable})[S.mode]();
    stats();if(!wl.hidden)paintList();afterRender()}
  const onKey=fn=>{S.keys=e=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;fn(e)};document.addEventListener('keydown',S.keys)};
  const doneBox=(r,t,extra)=>(setTimeout(()=>afterDone(stage,r,t),30),'')+'<div class="q done">'+ring(r,t)+'<p>'+(t&&r/t>=.8?'Rất tốt! Bạn nắm khá vững bộ từ này.':t&&r/t>=.5?'Khá ổn. Hãy ôn lại các từ sai bên dưới.':'Cần ôn thêm. Thử chế độ Học thẻ trước nhé.')+'</p>'+(extra||'')+'</div>';
  const wrongList=ws=>ws.length?'<h3>Từ cần ôn lại ('+ws.length+')</h3>'+ws.map(C.card).join(''):'';

  /* ===== học thẻ ===== */
  function pCard(){
    const w=items[S.i],front=S.dir==='ko';
    const f=front?'<div class="cf-ko" lang="ko">'+esc(w.ko)+'</div>'+hjHTML(w)+rom(w.ko):'<div class="cf-vi">'+esc(w.vi)+'</div>'+(w.hj?'<div class="cf-hint">gốc Hán: '+esc(w.hj)+'</div>':'');
    const b=front?'<div class="cf-vi">'+esc(w.vi)+'</div>'+(w.pos?'<small>'+esc(w.pos)+'</small>':''):'<div class="cf-ko" lang="ko">'+esc(w.ko)+'</div>'+hjHTML(w)+rom(w.ko);
    const ex=w.ex?'<div class="ex"><span class="k2" lang="ko">'+esc(w.ex)+'</span>'+rom(w.ex)+esc(w.exvi)+'</div>':'';
    const auto=!!st.get('auto');
    stage.innerHTML='<div class="flip'+(S.flip?' is-flipped':'')+(S.deal?' deal-'+S.deal:'')+'"><div class="flip__inner"><div class="cardx cx-f"><div class="cx-n">'+(S.i+1)+' / '+n+'</div>'+f+'<p class="cx-h">Chạm để lật · vuốt ngang để chuyển thẻ</p></div><div class="cardx cx-b"><div class="cx-n">'+(S.i+1)+' / '+n+'</div>'+b+ex+'</div></div></div>'
     +'<div class="ctl"><button class="btn coral" type="button" data-act="rv">↺ Chưa thuộc</button><button class="nav" type="button" data-act="prev" aria-label="Thẻ trước">‹</button><button class="nav" type="button" data-act="say" aria-label="Nghe">'+SPK+'</button><button class="nav" type="button" data-act="next" aria-label="Thẻ sau">›</button><button class="btn" type="button" data-act="ok">✓ Đã học</button></div>'
     +'<div class="opt-row"><button class="chip-b" type="button" data-dir aria-pressed="'+(front?'false':'true')+'">Mặt trước: '+(front?'Hàn':'Việt')+'</button><button class="chip-b" type="button" data-auto aria-pressed="'+auto+'">Tự đọc: '+(auto?'bật':'tắt')+'</button><button class="chip-b" type="button" data-shuf>Xáo trộn</button></div>'
     +'<p class="kbd-hint"><kbd>Space</kbd> lật · <kbd>←</kbd><kbd>→</kbd> chuyển · <kbd>1</kbd> chưa thuộc · <kbd>2</kbd> đã học · <kbd>S</kbd> nghe</p><p class="swipe-hint"><span>‹</span> Vuốt phải: thẻ trước · Vuốt trái: thẻ sau <span>›</span></p>';
    S.deal='';
    const fl=$('.flip',stage);
    const go=(d,fx)=>{S.i=(S.i+d+n)%n;S.flip=false;S.deal=d>0?'next':'prev';pCard();stats();if(!wl.hidden)paintList()};
    const act=(a,fromSwipe)=>{if(a==='say')speak(w.ko);else if(a==='prev')go(-1);else if(a==='next')go(1);else if(a==='rv'){grade(w.id,false);wobble($('.flip',stage));buzz();go(1)}else if(a==='ok'){grade(w.id,true);celebrate($('.flip',stage),false);go(1)}};
    const turn=()=>{S.flip=!S.flip;fl.classList.toggle('is-flipped',S.flip);if(S.flip&&S.dir==='vi')speak(w.ko)};
    let pid=null,sx=0,sy=0,dx=0,t0=0,axis=null,swipedAt=-1e9;
    const reset=anim=>{fl.classList.remove('dragging');fl.style.transition=anim?'transform .22s cubic-bezier(.2,.8,.3,1), opacity .22s':'';fl.style.transform='';fl.style.opacity='';if(anim)setTimeout(()=>{fl.style.transition=''},240)};
    fl.addEventListener('click',e=>{if(e.target.closest('[data-say]'))return;if(performance.now()-swipedAt<400)return;turn()});
    fl.addEventListener('pointerdown',e=>{if(pid!==null||(e.pointerType==='mouse'&&e.button!==0))return;pid=e.pointerId;sx=e.clientX;sy=e.clientY;dx=0;t0=performance.now();axis=null});
    fl.addEventListener('pointermove',e=>{if(e.pointerId!==pid)return;const mx=e.clientX-sx,my=e.clientY-sy;
      if(!axis){if(Math.abs(mx)<8&&Math.abs(my)<8)return;axis=Math.abs(mx)>Math.abs(my)*1.2?'x':'y';if(axis==='x'){try{fl.setPointerCapture(pid)}catch(x){}fl.classList.add('dragging')}}
      if(axis!=='x')return;dx=mx;const lim=Math.min(Math.abs(dx),140)*Math.sign(dx);fl.style.transition='none';fl.style.transform='translateX('+dx+'px) rotate('+Math.max(-8,Math.min(8,lim/18))+'deg)';fl.style.opacity=String(1-Math.min(Math.abs(dx)/420,.45))});
    const finish=e=>{if(e.pointerId!==pid)return;const was=axis;pid=null;axis=null;if(was!=='x')return;swipedAt=performance.now();
      const dt=Math.max(1,performance.now()-t0),v=Math.abs(dx)/dt,far=Math.abs(dx)>Math.min(90,fl.offsetWidth*.2)||(Math.abs(dx)>36&&v>.5);
      if(e.type==='pointercancel'||!far)return reset(true);const dir=dx<0?1:-1;
      if(calm()){reset(false);return go(dir)}
      fl.style.transition='transform .16s ease-in, opacity .16s';fl.style.transform='translateX('+(dx<0?'-':'')+Math.max(fl.offsetWidth,280)+'px) rotate('+(dx<0?-10:10)+'deg)';fl.style.opacity='0';setTimeout(()=>go(dir),150)};
    fl.addEventListener('pointerup',finish);fl.addEventListener('pointercancel',finish);
    $$('[data-act]',stage).forEach(b=>b.onclick=()=>act(b.dataset.act));
    $('[data-dir]',stage).onclick=()=>{S.dir=S.dir==='ko'?'vi':'ko';st.set('dir',S.dir);S.flip=false;pCard()};
    $('[data-auto]',stage).onclick=()=>{st.set('auto',!auto);pCard()};
    $('[data-shuf]',stage).onclick=()=>{const a=shuffle(items);items.splice(0,n,...a);S.i=0;S.flip=false;pCard();if(!wl.hidden)paintList()};
    onKey(e=>{if(e.key===' '){e.preventDefault();turn()}else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);else if(e.key==='1')act('rv');else if(e.key==='2')act('ok');else if(e.key.toLowerCase()==='s')act('say')});
    if(auto&&S.dir==='ko')speak(w.ko);
  }

  /* ===== trắc nghiệm ===== */
  function pQuiz(){
    const Q={deck:shuffle(items).slice(0,Math.min(n,20)),k:0,right:0,wrong:[]};
    const kinds=w=>['ko-vi','vi-ko','audio'].concat(w.hj&&w.hv?['hj-ko','hj-vi']:[]);
    const spec=(w,kd)=>({'ko-vi':{q:w.ko,cls:'',ask:'Nghĩa của từ này là gì?',get:x=>x.vi},'vi-ko':{q:w.vi,cls:'vi',ask:'Từ tiếng Hàn nào có nghĩa này?',get:x=>x.ko},'audio':{q:'🔊',cls:'au',ask:'Nghe và chọn từ đúng',get:x=>x.ko},'hj-ko':{q:w.hj,cls:'hj',ask:'Hán tự này đọc là từ nào? (Hán Việt: '+w.hv+')',get:x=>x.ko},'hj-vi':{q:w.hj,cls:'hj',ask:'Từ có hán tự này nghĩa là gì?',get:x=>x.vi}})[kd];
    const view=()=>{
      if(Q.k>=Q.deck.length){stage.innerHTML=doneBox(Q.right,Q.deck.length,'<div class="row"><button class="btn" data-again>Làm lại</button>'+(Q.wrong.length?'<button class="btn ghost" data-wr>Luyện riêng từ sai</button>':'')+'</div>')+wrongList(Q.wrong);afterRender();
        $('[data-again]',stage).onclick=pQuiz;const wr=$('[data-wr]',stage);if(wr)wr.onclick=()=>{items.splice(0,n,...Q.wrong);S.mode='card';S.i=0;paint()};return}
      const w=Q.deck[Q.k],kd=shuffle(kinds(w))[0],sp=spec(w,kd),op=opts4(w,items,sp.get);
      stage.innerHTML='<p class="prog">Câu '+(Q.k+1)+'/'+Q.deck.length+'<i style="width:'+Q.k/Q.deck.length*100+'%"></i></p><div class="q"><div class="ask">'+esc(sp.ask)+'</div><div class="big '+sp.cls+'" lang="'+(sp.cls==='vi'?'vi':'ko')+'">'+(kd==='audio'?'<button class="nav big-au" type="button" data-say="'+esc(w.ko)+'">'+SPK+'</button>':esc(sp.q))+'</div><div class="opts">'+op.map((o,i)=>'<button type="button" data-o="'+i+'"><kbd>'+(i+1)+'</kbd> '+esc(o)+'</button>').join('')+'</div></div><div id="fb"></div>';
      const ans=sp.get(w);let locked=false;
      const pick=i=>{if(locked)return;locked=true;const right=op[i]===ans;$$('.opts button',stage).forEach((x,j)=>{x.disabled=true;if(op[j]===ans)x.classList.add('ok')});if(!right)$$('.opts button',stage)[i].classList.add('no');
        S.streak=right?(S.streak||0)+1:0;fxAns($$('.opts button',stage)[i],right);grade(w.id,right);if(right)Q.right++;else Q.wrong.push(w);speak(w.ko);stats();
        $('#fb',stage).innerHTML='<div class="vd">'+verdictHTML(right,right?'':'Đáp án: <b>'+esc(ans)+'</b>',S.streak)+'</div>'+C.card(w)+'<button class="btn" id="nx" type="button">'+(Q.k+1<Q.deck.length?'Câu tiếp →':'Xem kết quả')+'</button>';afterRender();const nx=$('#nx');nx.onclick=()=>{Q.k++;view()};nx.focus()};
      $$('.opts button',stage).forEach((b,i)=>b.onclick=()=>pick(i));
      onKey(e=>{if(/^[1-4]$/.test(e.key))pick(+e.key-1);else if(e.key==='Enter'&&locked)$('#nx')&&$('#nx').click()});
      if(kd==='audio'){speak(w.ko)}afterRender();
    };view();
  }

  /* ===== viết lại / nghe–viết ===== */
  function pWrite(dict){
    const Q={deck:shuffle(items).slice(0,Math.min(n,20)),k:0,right:0,wrong:[]};
    const view=()=>{
      if(Q.k>=Q.deck.length){stage.innerHTML=doneBox(Q.right,Q.deck.length,'<div class="row"><button class="btn" data-again>Làm lại</button></div>')+wrongList(Q.wrong);afterRender();$('[data-again]',stage).onclick=()=>pWrite(dict);return}
      const w=Q.deck[Q.k];let hint=0,checked=false;
      const prompt=dict?'<div class="ask">Nghe rồi gõ lại từ tiếng Hàn (có thể gõ hangeul hoặc romaja)</div><div class="big"><button class="nav big-au" type="button" data-say="'+esc(w.ko)+'">'+SPK+'</button></div>':'<div class="ask">Gõ từ tiếng Hàn có nghĩa:</div><div class="big vi">'+esc(w.vi)+'</div>'+(w.hj?'<div class="cf-hint">gốc Hán '+esc(w.hj)+' · '+esc(w.hv)+'</div>':'');
      stage.innerHTML='<p class="prog">Câu '+(Q.k+1)+'/'+Q.deck.length+'<i style="width:'+Q.k/Q.deck.length*100+'%"></i></p><div class="q">'+prompt+'<form class="wf" autocomplete="off"><input id="ans" lang="ko" inputmode="text" autocapitalize="off" spellcheck="false" placeholder="한글 또는 romaja"><button class="btn" type="submit">Kiểm tra</button></form><div class="row c"><button type="button" class="btn ghost sm" data-hint>Gợi ý</button><button type="button" class="btn ghost sm" data-skip>Không biết</button></div><div id="fb"></div></div>';
      const inp=$('#ans',stage);inp.focus();if(dict)speak(w.ko);
      const settle=ok=>{checked=true;S.streak=ok?(S.streak||0)+1:0;fxAns($('.wf',stage),ok);grade(w.id,ok);if(ok)Q.right++;else Q.wrong.push(w);stats();inp.disabled=true;
        $('#fb',stage).innerHTML='<div class="vd">'+verdictHTML(ok,ok?'':'Đáp án: <b lang="ko">'+esc(w.ko)+'</b>',S.streak)+'</div>'+C.card(w)+'<button class="btn" id="nx" type="button">'+(Q.k+1<Q.deck.length?'Câu tiếp →':'Xem kết quả')+'</button>';afterRender();speak(w.ko);const nx=$('#nx');nx.onclick=()=>{Q.k++;view()};nx.focus()};
      $('.wf',stage).onsubmit=e=>{e.preventDefault();if(checked)return;settle(okAns(inp.value,w))};
      $('[data-skip]',stage).onclick=()=>{if(!checked)settle(false)};
      $('[data-hint]',stage).onclick=()=>{if(checked)return;hint++;const k=clean(w.ko);inp.placeholder=k.slice(0,hint)+'…';inp.focus()};
    };view();
  }

  /* ===== ghép cặp ===== */
  function pMatch(){
    const M={deck:shuffle(items),r:0,miss:0,got:0};const per=6,rounds=Math.ceil(n/per);
    const round=()=>{
      if(M.r>=rounds){stage.innerHTML=doneBox(Math.max(0,M.deck.length-M.miss),M.deck.length,'<p>Số lần ghép sai: <b>'+M.miss+'</b></p><div class="row"><button class="btn" data-again>Chơi lại</button></div>');afterRender();$('[data-again]',stage).onclick=pMatch;return}
      const set=M.deck.slice(M.r*per,M.r*per+per),L=shuffle(set),R=shuffle(set);let sel=null,left=set.length;
      stage.innerHTML='<p class="prog">Lượt '+(M.r+1)+'/'+rounds+' · sai '+M.miss+'<i style="width:'+M.r/rounds*100+'%"></i></p><div class="mt"><div class="mt-c">'+L.map(w=>'<button type="button" data-t="k" data-id="'+esc(w.id)+'" lang="ko">'+esc(w.ko)+'</button>').join('')+'</div><div class="mt-c">'+R.map(w=>'<button type="button" data-t="v" data-id="'+esc(w.id)+'">'+esc(w.vi)+'</button>').join('')+'</div></div><p class="kbd-hint">Chọn một từ Hàn rồi chọn nghĩa tương ứng.</p>';
      $$('.mt button',stage).forEach(b=>b.onclick=()=>{
        if(b.classList.contains('gone'))return;
        if(!sel||sel.dataset.t===b.dataset.t){if(sel)sel.classList.remove('sel');sel=b;b.classList.add('sel');if(b.dataset.t==='k')speak(C.BY[b.dataset.id].ko);return}
        const a=sel;sel=null;a.classList.remove('sel');
        if(a.dataset.id===b.dataset.id){[a,b].forEach(x=>{celebrate(x,false);x.classList.add('gone')});grade(a.dataset.id,true);stats();if(--left===0)setTimeout(()=>{M.r++;round()},450)}
        else{M.miss++;buzz();[a,b].forEach(x=>{x.classList.add('bad');wobble(x);setTimeout(()=>x.classList.remove('bad'),400)});grade(a.dataset.t==='k'?a.dataset.id:b.dataset.id,false)}
      });
    };round();
  }

  /* ===== phản xạ (60 giây) ===== */
  function pReflex(){
    const T=60;stage.innerHTML='<div class="q"><div class="big">⚡</div><p>Trả lời thật nhanh trong <b>'+T+' giây</b>. Đúng +1, sai −1. Càng nhiều chuỗi đúng liên tiếp càng vui.</p><button class="btn" data-go>Bắt đầu</button></div>';
    $('[data-go]',stage).onclick=()=>{
      let score=0,streak=0,best=0,t=T,right=0,total=0,locked=false;const wrong=[];const pool=shuffle(items);let k=0;
      const next=()=>{locked=false;const w=pool[k++%pool.length],rev=Math.random()<.5,get=rev?(x=>x.ko):(x=>x.vi),op=opts4(w,items,get);
        $('.rf-q',stage).innerHTML='<div class="big '+(rev?'vi':'')+'" lang="'+(rev?'vi':'ko')+'">'+esc(rev?w.vi:w.ko)+'</div><div class="opts">'+op.map((o,i)=>'<button type="button" data-o="'+i+'"><kbd>'+(i+1)+'</kbd> '+esc(o)+'</button>').join('')+'</div>';
        const pick=i=>{if(locked||t<=0)return;locked=true;total++;const ok=op[i]===get(w),bs=$$('.opts button',stage);bs[i].classList.add(ok?'ok':'no');fxAns(bs[i],ok);if(!ok)bs.forEach((x,j)=>op[j]===get(w)&&x.classList.add('ok'));
          grade(w.id,ok);if(ok){right++;score++;streak++;best=Math.max(best,streak)}else{score=Math.max(0,score-1);streak=0;wrong.push(w)}
          $('[data-sc]',stage).textContent=score;$('[data-st]',stage).textContent=streak;setTimeout(next,ok?250:700)};
        $$('.opts button',stage).forEach((b,i)=>b.onclick=()=>pick(i));S.pick=pick};
      stage.innerHTML='<div class="rf-h"><span>Điểm <b data-sc>0</b></span><span>Chuỗi <b data-st>0</b></span><span>⏱ <b data-t>'+T+'</b>s</span></div><div class="bar"><i data-bar style="width:100%"></i></div><div class="q rf-q"></div>';
      onKey(e=>{if(/^[1-4]$/.test(e.key)&&S.pick)S.pick(+e.key-1)});
      next();
      S.timer=setInterval(()=>{t--;$('[data-t]',stage).textContent=t;$('[data-bar]',stage).style.width=t/T*100+'%';
        if(t<=0){clearInterval(S.timer);const prev=+(st.get('reflexBest')||0);if(score>prev)st.set('reflexBest',score);
          stage.innerHTML=doneBox(right,total,'<p>Điểm: <b>'+score+'</b> · chuỗi dài nhất: <b>'+best+'</b>'+(score>prev&&prev?' · 🏆 Kỷ lục mới!':prev?' · kỷ lục: '+prev:'')+'</p><div class="row"><button class="btn" data-again>Chơi lại</button></div>')+wrongList(wrong.filter((w,i,a)=>a.indexOf(w)===i));afterRender();$('[data-again]',stage).onclick=pReflex}},1000);
    };
  }

  /* ===== bảng che ===== */
  function pTable(){
    const cols=[['ko','Hàn'],['hj','Hán tự · Hán Việt'],['vi','Nghĩa'],['ex','Ví dụ']];const hide=new Set(st.get('hideCols')||[]);
    stage.innerHTML='<p class="note">Bấm vào tên cột để che/hiện cả cột, bấm một ô để hiện riêng ô đó. Che cột Nghĩa hoặc cột Hàn rồi tự kiểm tra.</p><div class="tbl-w"><table class="tbl"><thead><tr><th>#</th>'+cols.map(c=>'<th><button type="button" data-col="'+c[0]+'" aria-pressed="'+hide.has(c[0])+'">'+c[1]+'</button></th>').join('')+'<th></th></tr></thead><tbody>'
     +items.map((w,i)=>'<tr data-r="'+i+'"><td>'+(i+1)+'</td><td data-c="ko" lang="ko" class="k">'+esc(w.ko)+'</td><td data-c="hj" lang="ko">'+(w.hj?esc(w.hj)+' · '+esc(w.hv):'—')+'</td><td data-c="vi">'+esc(w.vi)+'</td><td data-c="ex" lang="ko" class="exc">'+esc(w.ex||'')+'</td><td><button class="nav sm" type="button" data-say="'+esc(w.ko)+'" aria-label="Nghe">'+SPK+'</button></td></tr>').join('')+'</tbody></table></div>';
    const apply=()=>{$$('td[data-c]',stage).forEach(td=>td.classList.toggle('cov',hide.has(td.dataset.c)&&!td.classList.contains('shown')));$$('[data-col]',stage).forEach(b=>b.setAttribute('aria-pressed',hide.has(b.dataset.col)))};
    $$('[data-col]',stage).forEach(b=>b.onclick=()=>{const c=b.dataset.col;hide.has(c)?hide.delete(c):hide.add(c);st.set('hideCols',[...hide]);$$('td.shown',stage).forEach(t=>t.classList.remove('shown'));apply()});
    $$('td[data-c]',stage).forEach(td=>td.onclick=()=>{if(td.classList.contains('cov')){td.classList.add('shown');apply()}else if(hide.has(td.dataset.c)){td.classList.remove('shown');apply()}});
    apply();
  }
  paint();
}
return study;
};
