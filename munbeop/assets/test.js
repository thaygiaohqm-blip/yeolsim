/* Super Munbeop - Test đầu vào 1급 → 6급 */
(() => {
  "use strict";
  const { store, esc, jp, rich, shuffle, band, lvtag, $, $$, verdict, celebrate, wobble, buzz, pickWord, verdictHTML, meter, speak, plain } = SB;
  const main = $("#main");
  const RAW = {
    k1: `저는 학생（　）.|이에요|예요|가 아니에요|이 있어요|1|학생 có patchim (ㅇ), nên dùng 이에요.
비（　） 와요.|이|가|을|에서|2|Chủ ngữ không có patchim dùng 가.
저는 밥（　） 먹어요.|을|를|이|가|1|Tân ngữ có patchim dùng 을.
도서관（　） 공부해요.|에|에서|을|가|2|Nơi diễn ra hành động dùng 에서.
어제 친구를 만나（　）.|았어요|었어요|을 거예요|ㅂ니다|1|Quá khứ của 만나다 là 만났어요 (-았어요).
저는 커피를 마시（　） 싶어요.|고|면|서|지|1|Muốn làm gì: V + -고 싶다.
사과가 세（　） 있어요.|개|명|권|마리|1|Đồ vật nhỏ đếm bằng 개; 3 là 세 khi đứng trước đơn vị.
한국어 책이 책상 위에（　）.|있어요|이에요|해요|가요|1|Nơi chốn + 에 + 있어요 (ở, có).`,
    k2: `지금 밥을 먹（　） 있어요.|고|면|서|는|1|Đang làm gì: V + -고 있다.
비가 오（　） 우산을 쓰세요.|니까|아서|지만|고|1|Vế sau là mệnh lệnh nên dùng -(으)니까, không dùng -아/어서.
여기에서 사진을 찍어도（　）?|돼요|해요|있어요|싶어요|1|Xin phép: -아/어도 되다.
도서관에서는 떠들면（　）.|안 돼요|돼요|좋아요|싶어요|1|Cấm đoán: -(으)면 안 되다.
내일 시험이 있어서 공부해（　） 해요.|야|도|서|면|1|Nghĩa vụ: -아/어야 하다.
한국에 가 본（　）이 있어요.|적|수|것|때|1|Kinh nghiệm: -(으)ㄴ 적이 있다.
한국어를 잘하시（　）.|네요|ㅂ시다|겠어요|러 가요|1|Cảm thán khi nhận ra: -네요.
오늘은 어제（　） 더 추워요.|보다|에서|부터|처럼|1|So sánh hơn: A는 B보다 더 …`,
    k3: `열심히 공부했（　） 시험에 떨어졌어요.|는데도|으니까|기 때문에|거든요|1|Nhượng bộ: -(으)ㄴ/는데도 (dù … vẫn).
길이 막히（　） 늦었어요.|는 바람에|기 위해|도록|ㄹ수록|1|Nguyên nhân bất ngờ dẫn đến kết quả xấu: -는 바람에.
한국어는 배울（　） 재미있어요.|수록|때문에|자마자|동안|1|Càng … càng …: -(으)ㄹ수록.
집에 오（　） 샤워를 했어요.|자마자|면서|다가|지만|1|Ngay khi: -자마자.
친구가 내일 오（　） 했어요.|ㄴ다고|라고|자고|냐고|1|Câu gián tiếp trần thuật của động từ: -ㄴ/는다고 하다.
늦（　） 택시를 탔어요.|을까 봐|는 동안|자마자|은 채로|1|Lo sợ điều không mong muốn: -(으)ㄹ까 봐.
창문으로 바다가 （　）.|보여요|봐요|보세요|봤어요|1|Bị động: 보다 → 보이다, bể “được nhìn thấy” là 보여요.
이 영화는 （　） 만해요.|볼|본|보는|봐|1|Đáng làm gì: -(으)ㄹ 만하다.`,
    k4: `그는 노래를 잘할 （　） 춤도 잘 춰요.|뿐만 아니라|때문에|바람에|만큼|1|Không những … mà còn: -(으)ㄹ 뿐만 아니라.
시험 공부를 하（　） 잠을 못 잤어요.|느라고|도록|다가|면서|1|Vì mải làm việc này nên không làm được việc khác: -느라고.
비가 오는데도 （　） 사람들이 많이 왔어요.|불구하고|대해서|따라서|비해서|1|Bất chấp: -(으)ㄴ/는데도 불구하고.
학생（　） 열심히 공부해야 합니다.|으로서|으로써|에게서|에서|1|Với tư cách là: (으)로서.
한국 문화（　） 이야기합시다.|에 대해|에 비해|에 따라|에 의해|1|Về (đề tài): 에 대해(서).
사람（　） 생각이 달라요.|에 따라|에 대해|에 비해|에 관해|1|Tùy theo: 에 따라(서).
시작한 （　） 끝까지 해야 해요.|이상|만큼|대신|바람|1|Một khi đã …: -(으)ㄴ 이상.
내일 비가 올（　） 몰라요.|지도|수록|뿐이|만큼|1|Biết đâu, có thể: -(으)ㄹ지도 모르다.`,
    k5: `비싸（　） 꼭 사야 해요.|더라도|길래|마당에|기는커녕|1|Dù … cũng …: -더라도.
세월은 누구에게나 빨리 지나가기（　）.|마련이에요|나름이에요|일쑤예요|따름이에요|1|Đương nhiên là vậy: -기 마련이다.
그는 나를 도와주기（　） 방해만 했어요.|는커녕|나 마나|는 둥|길래|1|Đừng nói là … mà còn …: -기는커녕.
이렇게 고생하느니 （　） 그만두는 게 낫겠어요.|차라리|오히려|도리어|아마|1|Thà … còn hơn: -느니 차라리.
지금 가 （　） 이미 끝났을 거예요.|봤자|보니까|본 김에|보려고|1|Dù có … cũng vô ích: -아/어 봤자.
시장에 가는（　） 과일도 좀 사 오세요.|김에|대신|바람에|만큼|1|Nhân tiện: -는 김에.
성공은 노력하기（　）.|나름이에요|마련이에요|십상이에요|따름이에요|1|Tùy thuộc vào: -기 나름이다.
남녀노소（　） 누구나 즐길 수 있어요.|를 막론하고|를 불구하고|에 따라|에 비해|1|Bất kể: (을/를) 막론하고.`,
    k6: `그의 용기는 대단하기（　） 없어요.|짝이|마저|따위|만큼|1|Cực kỳ …: -기 짝이 없다.
어제 일찍 잤（　） 지각하지 않았을 텐데.|더라면|다마는|건마는|지언정|1|Giá mà …: -았/었더라면.
비록 가난（　） 정직하게 살겠다.|할지언정|하기에|하느라|하는 바람에|1|Dù có … cũng …: -(으)ㄹ지언정.
가장 믿었던 친구（　） 나를 배신했다.|마저|부터|처럼|더러|1|Đến cả (điều không mong): 마저.
후회（　） 소용이 없다.|한들|하더니|하다가|하므로|1|Dù có … cũng vô ích: -(으)ㄴ들.
그 정도 일이면 화를 낼（　）.|법도 하다|만도 못하다|나름이다|일쑤다|1|Cũng có thể …, dễ hiểu: -(으)ㄹ 법하다.
남자나 여자（　） 할 것 없이 모두 모였다.|나|도|를|만|1|Dù … hay … cũng: (이)나 (이)나 할 것 없이.
이렇게 빨리 끝날（　）!|줄이야|때문에|마당에|따름이다|1|Không ngờ là: -(으)ㄹ 줄이야.`
  };
  const lvName = lv => (SB.C.levels.find(l => l.id === lv) || { name: lv }).name;
  const bank = {};
  for (const [lv, txt] of Object.entries(RAW)) bank[lv] = txt.split("\n").map(l => { const [q, a, b, c, d, ans, exp] = l.split("|"); return { q, o: [a, b, c, d], ans: +ans, exp }; });
  const PER = 8, PASS = 7, ORDER = ["k1", "k2", "k3", "k4", "k5", "k6"];

  async function route() {
    SB.setNav("test");
    const saved = store.get("placement", null);
    main.innerHTML = band({ big: "시험", bigJp: true, title: "Test đầu vào", text: "Làm từ 1급 lên 6급, mỗi cấp 8 câu. Đúng từ 7 câu thì sang cấp tiếp theo; kết quả gợi ý bạn nên bắt đầu học từ cấp nào.", meta: `<b>${PER * 6}</b><span>câu tối đa</span>` }) +
      `<section class="sec"><div class="wrap">${saved ? resultHTML(saved, true) : ""}<div class="card__actions"><button class="btn btn--primary" type="button" data-start>${saved ? "Làm lại test" : "Bắt đầu"}</button></div></div></section>`;
    $("[data-start]").onclick = start;
    SB.setCur({ refresh: route });
  }
  function resultHTML(r, old) {
    return `<div class="presult"><h2>${old ? "Kết quả gần nhất" : "Kết quả của bạn"}</h2><p class="presult__lv">Nên bắt đầu từ: <b>${lvName(r.start)}</b></p>
      <ul class="plist">${ORDER.map(lv => r.s[lv] ? `<li>${lvtag(lv)} <b>${r.s[lv][0]}/${r.s[lv][1]}</b> ${meter(r.s[lv][0], r.s[lv][1])} ${r.s[lv][0] >= PASS ? "Đạt" : "Chưa đạt"}</li>` : `<li>${lvtag(lv)} <span class="muted">Không làm</span></li>`).join("")}</ul>
      <p>${esc(r.note)}</p><div class="card__actions"><a class="btn btn--primary" href="#/cap-do/${r.start}">Học ${lvName(r.start)}</a><a class="btn btn--ghost" href="#/giao-trinh">Xem giáo trình</a></div></div>`;
  }
  async function start() {
    const qs = {}; ORDER.forEach(lv => qs[lv] = shuffle(bank[lv]).slice(0, PER).map(x => { const idx = shuffle([0, 1, 2, 3]), o = idx.map(i => x.o[i]); return { q: x.q, o, ans: idx.indexOf(x.ans - 1) + 1, exp: x.exp }; }));
    const st = { li: 0, k: 0, right: 0, s: {}, ans: null };
    function next() {
      const lv = ORDER[st.li];
      if (st.k >= PER) {
        st.s[lv] = [st.right, PER];
        if (st.right < PASS || st.li === ORDER.length - 1) return finish();
        st.li++; st.k = 0; st.right = 0;
      }
      draw();
    }
    function draw() {
      const lv = ORDER[st.li], q = qs[lv][st.k];
      main.innerHTML = band({ big: lvName(lv), title: `Câu ${st.k + 1} / ${PER}`, text: `Cấp ${lvName(lv)}`, compact: true }) +
        `<section class="sec"><div class="wrap"><div class="card"><div class="quiz"><div class="quiz__q"><p class="test-ask">Chọn đáp án đúng</p><div class="say say--sm" lang="ko">${jp(q.q, { hl: false })}</div></div>
          <div class="opts">${q.o.map((o, i) => `<button class="opt jp-opt" type="button" data-o="${i}" lang="ko"><span class="k">${i + 1}</span><span>${jp(o, { hl: false })}</span></button>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div><div class="card__actions" hidden data-nw><button class="btn btn--primary" type="button" data-next>Tiếp</button></div></div></div></div></section>`;
      $$("[data-o]").forEach(b => b.onclick = () => {
        const i = +b.dataset.o, ok = i === q.ans - 1; if (ok) st.right++;
        $$("[data-o]").forEach((x, k) => { x.disabled = true; if (k === q.ans - 1) x.classList.add("is-right"); else if (k === i) x.classList.add("is-wrong"); });
        const fb = $(".feedback"); fb.className = "feedback " + (ok ? "ok" : "no"); fb.innerHTML = verdictHTML(ok, pickWord(ok), rich(q.exp)); verdict(fb, ok); ok ? celebrate(b) : (wobble(b), buzz());
        $("[data-nw]").hidden = false; $("[data-next]").focus({ preventScroll: true });
      });
      $("[data-next]").onclick = () => { st.k++; next(); };
    }
    function finish() {
      let start = "k1", note = "";
      const done = ORDER.filter(lv => st.s[lv] && st.s[lv][0] >= PASS);
      if (!done.length) { start = "k1"; note = "Hãy bắt đầu từ nền tảng 1급 để chắc kiến thức."; }
      else if (done.length === ORDER.length) { start = "k6"; note = "Bạn vượt qua cả sáu cấp. Hãy học 6급 để mở rộng và hệ thống hoá."; }
      else { const last = ORDER[ORDER.indexOf(done[done.length - 1]) + 1]; start = last; note = `Bạn vững đến ${lvName(done[done.length - 1])}. Nên bắt đầu từ ${lvName(last)}, rồi quay lại ôn các mẫu hay sai.`; }
      const r = { start, s: st.s, note, t: Date.now() };
      store.set("placement", r); SB.notify();
      main.innerHTML = band({ big: "결과", bigJp: true, title: "Kết quả test đầu vào", compact: true }) + `<section class="sec"><div class="wrap">${resultHTML(r)}<div class="card__actions"><button class="btn btn--ghost" type="button" data-again>Làm lại</button></div></div></section>`;
      $("[data-again]").onclick = start_;
    }
    const start_ = start;
    draw();
  }
  SB.test = { route };
})();
