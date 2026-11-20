/* Super Hangeul — bảng chữ cái, phát âm, ghép âm tiết, kiểm tra */
(function(){
const {esc,speak}=SE,$=(s,r=document)=>r.querySelector(s);
const main=$('#main'),H1=$('#h1'),LEAD=$('#lead'),CRUMB=$('#crumb'),META=$('#meta');
const st=SE.store('hangeul');
const head=o=>{H1.textContent=o.h1;LEAD.innerHTML=o.lead||'';CRUMB.innerHTML=o.crumb||'';META.innerHTML=(o.meta||[]).map(x=>'<span class="chip">'+esc(x)+'</span>').join('')};
const SPK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
/* [ký tự, romaja, cách đọc gần đúng cho người Việt, từ ví dụ, nghĩa] */
const VOW=[['ㅏ','a','a','아이','em bé'],['ㅑ','ya','ia / gia','야구','bóng chày'],['ㅓ','eo','ơ (miệng mở hơn ơ)','어머니','mẹ'],['ㅕ','yeo','yơ','여자','phụ nữ'],['ㅗ','o','ô','오리','con vịt'],['ㅛ','yo','yô','요리','nấu ăn'],['ㅜ','u','u','우유','sữa'],['ㅠ','yu','yu','유리','thủy tinh'],['ㅡ','eu','ư','음악','âm nhạc'],['ㅣ','i','i','이름','tên']];
const DV=[['ㅐ','ae','e (mở)','개','con chó'],['ㅒ','yae','ye (mở)','얘기','câu chuyện'],['ㅔ','e','ê','네','vâng'],['ㅖ','ye','yê','예','vâng (lịch sự)'],['ㅘ','wa','oa','과일','trái cây'],['ㅙ','wae','oe','왜','tại sao'],['ㅚ','oe','uê','외국','nước ngoài'],['ㅝ','wo','uơ','원','won (tiền)'],['ㅞ','we','uê','웨이터','người phục vụ'],['ㅟ','wi','uy','위','phía trên'],['ㅢ','ui','ưi','의사','bác sĩ']];
const CON=[['ㄱ','g / k','k – g nhẹ','가방','cặp'],['ㄴ','n','n','나라','đất nước'],['ㄷ','d / t','t – đ nhẹ','다리','cái cầu / chân'],['ㄹ','r / l','r đầu âm, l cuối âm','라면','mì ăn liền'],['ㅁ','m','m','마음','tấm lòng'],['ㅂ','b / p','p – b nhẹ','바다','biển'],['ㅅ','s','x – s nhẹ','사랑','tình yêu'],['ㅇ','ng / -','không đọc ở đầu, “ng” ở cuối','아기','em bé'],['ㅈ','j','ch nhẹ','자리','chỗ ngồi'],['ㅊ','ch','ch bật hơi mạnh','차','trà / xe'],['ㅋ','k','kh bật hơi mạnh','코','mũi'],['ㅌ','t','th bật hơi mạnh','토끼','con thỏ'],['ㅍ','p','ph bật hơi (môi)','포도','nho'],['ㅎ','h','h','하늘','bầu trời']];
const DC=[['ㄲ','kk','k căng (nén hơi, không bật)','까치','chim ác là'],['ㄸ','tt','t căng','딸기','dâu tây'],['ㅃ','pp','p căng','빵','bánh mì'],['ㅆ','ss','x căng','쓰기','viết'],['ㅉ','jj','ch căng','짜다','mặn']];
const ALL=[].concat(VOW,DV,CON,DC);
const RULES=[
 ['Patchim đại diện (대표음)','Khi ở cuối âm tiết, các phụ âm chỉ còn đọc thành 7 âm: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ. ㄲ ㅋ→[ㄱ]; ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ→[ㄷ]; ㅍ→[ㅂ].',[['부엌','[부억]','bếp'],['옷','[옫]','quần áo'],['꽃','[꼳]','hoa'],['앞','[압]','phía trước'],['낮','[낟]','ban ngày']]],
 ['Nối âm (연음)','Patchim đứng trước nguyên âm (ㅇ không âm) thì chuyển sang làm phụ âm đầu của âm tiết sau.',[['한국어','[한구거]','tiếng Hàn'],['먹어요','[머거요]','ăn'],['읽어요','[일거요]','đọc'],['직업','[지겁]','nghề nghiệp'],['음악이','[으마기]','âm nhạc (chủ ngữ)']]],
 ['Mũi hóa (비음화)','Patchim ㄱ ㄷ ㅂ gặp ㄴ ㅁ thì đổi thành ㅇ ㄴ ㅁ.',[['감사합니다','[감사함니다]','cảm ơn'],['한국말','[한궁말]','tiếng Hàn'],['먹는','[멍는]','đang ăn'],['입니다','[임니다]','là'],['앞문','[암문]','cửa trước']]],
 ['Căng hóa (경음화)','Sau patchim ㄱ ㄷ ㅂ, phụ âm ㄱ ㄷ ㅂ ㅅ ㅈ đọc căng thành ㄲ ㄸ ㅃ ㅆ ㅉ.',[['학교','[학꾜]','trường học'],['식당','[식땅]','quán ăn'],['입구','[입꾸]','lối vào'],['숟가락','[숟까락]','cái thìa'],['잡지','[잡찌]','tạp chí']]],
 ['Lưỡi hóa (유음화)','ㄴ gần ㄹ thì đọc thành ㄹ.',[['신라','[실라]','Silla'],['설날','[설랄]','Tết Seol'],['연락','[열락]','liên lạc'],['난로','[날로]','lò sưởi']]],
 ['Bật hơi hóa với ㅎ (격음화)','ㅎ gặp ㄱ ㄷ ㅂ ㅈ thì tạo thành âm bật hơi ㅋ ㅌ ㅍ ㅊ.',[['좋다','[조타]','tốt'],['입학','[이팍]','nhập học'],['못해요','[모태요]','không giỏi'],['좋고','[조코]','tốt và']]],
 ['Vòm hóa (구개음화)','Patchim ㄷ ㅌ gặp 이 hoặc 히 thì đọc thành ㅈ ㅊ.',[['같이','[가치]','cùng nhau'],['굳이','[구지]','cứ'],['해돋이','[해도지]','bình minh']]]
];
const tabs=c=>'<nav class="tabs2">'+[['#/','home','Bắt đầu'],['#/bang','bang','Bảng chữ cái'],['#/phat-am','pa','Phát âm'],['#/viet','viet','Ghép âm tiết'],['#/test','test','Kiểm tra']].map(t=>'<a href="'+t[0]+'"'+(c===t[1]?' aria-current="true"':'')+'>'+t[2]+'</a>').join('')+'</nav>';
const bind=()=>document.querySelectorAll('[data-say]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();speak(b.dataset.say)});
const grid=(t,arr)=>'<h2>'+t+'</h2><div class="hanj">'+arr.map(a=>'<a href="#/bang" data-say="'+esc(a[3])+'" title="Nghe: '+esc(a[3])+'"><div class="c" style="font-family:var(--jp)" lang="ko">'+a[0]+'</div><b>'+esc(a[1])+'</b><br><small>'+esc(a[2])+'</small><br><span lang="ko">'+esc(a[3])+'</span> <small>'+esc(a[4])+'</small></a>').join('')+'</div>';
function home(){
  head({h1:'Hangeul — Bảng chữ cái tiếng Hàn',lead:'Hangeul gồm 14 phụ âm, 10 nguyên âm cơ bản và các âm ghép. Chỉ cần vài giờ để đọc được, vì mỗi chữ đại diện đúng một âm.',meta:['24 chữ cái cơ bản','40 chữ cái gồm cả âm đôi','Có audio']});
  main.innerHTML=tabs('home')+'<div class="lvs"><a class="lvc" href="#/bang"><b>1. Bảng chữ cái</b><small>Nguyên âm, phụ âm, âm đôi và cách đọc gần đúng với tiếng Việt. Bấm vào chữ để nghe.</small></a><a class="lvc" href="#/viet"><b>2. Ghép âm tiết</b><small>Một âm tiết = phụ âm đầu + nguyên âm (+ patchim). Gõ hoặc ghép để xem cách đọc.</small></a><a class="lvc" href="#/phat-am"><b>3. Quy tắc phát âm</b><small>Patchim, nối âm, mũi hóa, căng hóa… kèm ví dụ có audio.</small></a><a class="lvc" href="#/test"><b>4. Kiểm tra</b><small>Nhận mặt chữ và âm đọc.</small></a></div>'
  +'<div class="wd"><div class="hd"><span class="ko" lang="ko">한</span><span class="hv">cấu tạo âm tiết</span></div><div>Âm tiết <b lang="ko">한</b> = <b>ㅎ</b> (phụ âm đầu) + <b>ㅏ</b> (nguyên âm) + <b>ㄴ</b> (patchim, phụ âm cuối) → đọc “han”. Nguyên âm dọc (ㅏ ㅣ…) đặt bên phải phụ âm, nguyên âm ngang (ㅗ ㅜ ㅡ) đặt bên dưới.</div></div>';
}
function bang(){
  head({h1:'Bảng chữ cái',lead:'Bấm một ô để nghe từ ví dụ. Cột “gần giống” là cách đọc xấp xỉ bằng tiếng Việt, hãy nghe audio để quen âm chuẩn.',meta:['10 nguyên âm','11 nguyên âm đôi','14 phụ âm','5 phụ âm căng']});
  main.innerHTML=tabs('bang')+grid('Nguyên âm cơ bản',VOW)+grid('Nguyên âm ghép',DV)+grid('Phụ âm',CON)+grid('Phụ âm căng (nén hơi, không bật hơi)',DC)
   +'<p class="note">Ba nhóm dễ nhầm: ㄱ/ㅋ/ㄲ, ㄷ/ㅌ/ㄸ, ㅂ/ㅍ/ㅃ, ㅈ/ㅊ/ㅉ (thường / bật hơi / căng). Hãy nghe và so sánh: 가 – 카 – 까.</p>';bind();
}
function phatam(){
  head({h1:'Quy tắc phát âm',lead:'Chữ viết và cách đọc tiếng Hàn khác nhau ở một số trường hợp. Phần romaja trong web này đã áp dụng các quy tắc dưới đây.',meta:[RULES.length+' quy tắc']});
  main.innerHTML=tabs('pa')+RULES.map((r,i)=>'<article class="wd"><div class="hd"><span class="ko" style="font-size:20px">'+(i+1)+'. '+esc(r[0])+'</span></div><div>'+esc(r[1])+'</div>'+r[2].map(e=>'<div class="ac" style="justify-content:space-between"><span><b lang="ko" style="font-size:20px">'+e[0]+'</b> <span lang="ko" style="color:var(--coral-ink)">'+e[1]+'</span> <span class="rom" style="display:inline">'+esc(KR.rom(e[0]))+'</span> <small style="color:var(--muted)">'+esc(e[2])+'</small></span><button class="btn ghost sm" type="button" data-say="'+esc(e[0])+'">'+SPK+'</button></div>').join('')+'</article>').join('');bind();
}
function viet(q){
  head({h1:'Ghép và phân tích âm tiết',lead:'Gõ tiếng Hàn để xem từng âm tiết tách ra thế nào, hoặc chọn phụ âm đầu, nguyên âm, patchim để ghép.'});
  const Ls=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],Vs=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'],Ts=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const sel=(id,a,d)=>'<label>'+id[0]+' <select id="'+id[1]+'" class="srch" style="width:auto;display:inline-block;font-family:var(--jp)">'+a.map(x=>'<option'+(x===d?' selected':'')+' value="'+x+'">'+(x||'(không)')+'</option>').join('')+'</select></label> ';
  main.innerHTML=tabs('viet')+'<div class="wd"><b>Ghép âm tiết</b><div>'+sel(['Phụ âm đầu','sl'],Ls,'ㅎ')+sel(['Nguyên âm','sv'],Vs,'ㅏ')+sel(['Patchim','st'],Ts,'ㄴ')+'</div><div class="q"><div class="big" id="syl" lang="ko"></div><div id="syr"></div><button class="btn ghost sm" id="sysay" type="button">'+SPK+' Nghe</button></div></div>'
   +'<div class="wd"><b>Phân tích câu tiếng Hàn</b><input class="srch" id="inp" placeholder="Gõ hoặc dán tiếng Hàn, ví dụ: 안녕하세요" value="'+esc(q||'안녕하세요')+'" lang="ko"><div id="an"></div></div>';
  const upd=()=>{const s=KR.enc($('#sl').value,$('#sv').value,$('#st').value);$('#syl').textContent=s;$('#syr').innerHTML='<span class="rom" style="display:block;font-size:18px">'+esc(KR.rom(s))+'</span>'};
  ['sl','sv','st'].forEach(i=>$('#'+i).onchange=upd);upd();$('#sysay').onclick=()=>speak($('#syl').textContent);
  const an=()=>{const v=$('#inp').value,cs=[...v].filter(KR.isH);$('#an').innerHTML=v.trim()?'<p><span class="rom" style="display:block;font-size:18px">'+esc(KR.rom(v))+'</span> <button class="btn ghost sm" type="button" data-say="'+esc(v)+'">'+SPK+' Nghe</button></p>'+(cs.length?'<div class="hanj">'+cs.map(c=>{const d=KR.dec(c);return '<div class="wd" style="text-align:center;margin:0"><div class="ko" lang="ko" style="font-size:32px">'+c+'</div><small>'+d.l+' + '+d.v+(d.t?' + '+d.t:'')+'</small></div>'}).join('')+'</div>':''):'';bind()};
  $('#inp').oninput=an;an();
}
function test(){
  head({h1:'Kiểm tra nhận mặt chữ',lead:'20 câu, nhận diện chữ cái và âm đọc.'});
  const qs=shuffle(ALL).slice(0,20);let i=0,ok=0;const wrong=[];
  const view=()=>{
    if(i>=qs.length){main.innerHTML=tabs('test')+'<div class="q"><div class="big">'+ok+'/'+qs.length+'</div><p>'+(ok>=16?'Rất tốt!':'Hãy xem lại bảng chữ cái rồi thử lại.')+'</p></div>'+(wrong.length?'<p>Chữ cần ôn: '+wrong.map(w=>'<b lang="ko">'+w[0]+'</b> ('+w[1]+')').join(', ')+'</p>':'')+'<button class="btn" id="again" type="button">Làm lại</button>';$('#again').onclick=test;return}
    const w=qs[i],rev=Math.random()<.4;
    const pool=ALL.filter(x=>x[1]!==w[1]&&x[0]!==w[0]),opt=shuffle([w].concat(shuffle(pool).slice(0,3)));
    main.innerHTML='<p style="color:var(--muted)">Câu '+(i+1)+'/'+qs.length+'</p><div class="q"><div class="ask">'+(rev?'Chữ nào đọc là “'+esc(w[1])+'”?':'Chữ này đọc là gì?')+'</div><div class="big" lang="ko">'+(rev?'?':w[0])+'</div><div class="opts">'+opt.map(o=>'<button type="button" data-o="'+o[0]+'" lang="ko">'+(rev?o[0]:esc(o[1]))+'</button>').join('')+'</div></div><div id="fb"></div>';
    document.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{const r=b.dataset.o===w[0];document.querySelectorAll('.opts button').forEach(x=>{x.disabled=true;if(x.dataset.o===w[0])x.classList.add('ok')});if(!r){b.classList.add('no');wrong.push(w)}else ok++;speak(w[3]);
      $('#fb').innerHTML='<p class="note"><b lang="ko">'+w[0]+'</b> = '+esc(w[1])+' ('+esc(w[2])+'). Ví dụ: <span lang="ko">'+w[3]+'</span> ('+esc(w[4])+')</p><button class="btn" id="nx" type="button">'+(i+1<qs.length?'Câu tiếp →':'Xem kết quả')+'</button>';$('#nx').onclick=()=>{i++;view()};$('#nx').focus()})};view();
}
function route(){const raw=location.hash.replace(/^#\/?/,''),[p,qs]=raw.split('?'),q=new URLSearchParams(qs||'');window.scrollTo(0,0);
  ({'':home,bang,'phat-am':phatam,viet:()=>viet(q.get('q')),test})[p]?({'':home,bang,'phat-am':phatam,viet:()=>viet(q.get('q')),test})[p]():home()}
window.addEventListener('hashchange',route);route();
})();
