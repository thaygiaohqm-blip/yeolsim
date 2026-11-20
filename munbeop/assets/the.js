/* Super Munbeop - Thể của từ: tra cứu cách chia động từ / tính từ tiếng Hàn và luyện chia */
(() => {
  "use strict";
  const { esc, speak, toast, $, $$, shuffle, band, ICON_SPEAK, celebrate, wobble, verdict, buzz, pickWord, verdictHTML, doneHTML, afterDone } = SB;
  const main = $("#main");

  /* từ mẫu: dạng từ điển | nghĩa | loại bất quy tắc | v/a */
  const RAW = `가다|đi|reg|v;오다|đến|reg|v;먹다|ăn|reg|v;읽다|đọc|reg|v;앉다|ngồi|reg|v;작다|nhỏ|reg|a;좋다|tốt, thích|reg|a;많다|nhiều|reg|a;있다|có, ở|reg|v;없다|không có|reg|a;
    보다|xem|reg|v;마시다|uống|reg|v;배우다|học|reg|v;주다|cho|reg|v;되다|trở thành|reg|v;
    하다|làm|ha|v;공부하다|học|ha|v;일하다|làm việc|ha|v;사랑하다|yêu|ha|v;좋아하다|thích|ha|v;따뜻하다|ấm áp|ha|a;피곤하다|mệt|ha|a;
    쓰다|viết, dùng|eu|v;크다|to, lớn|eu|a;예쁘다|đẹp|eu|a;바쁘다|bận|eu|a;아프다|đau|eu|a;나쁘다|xấu|eu|a;
    모르다|không biết|reu|v;부르다|gọi, hát|reu|v;다르다|khác|reu|a;빠르다|nhanh|reu|a;
    돕다|giúp|b|v;춥다|lạnh|b|a;덥다|nóng|b|a;어렵다|khó|b|a;쉽다|dễ|b|a;맵다|cay|b|a;
    듣다|nghe|d|v;걷다|đi bộ|d|v;묻다|hỏi|d|v;
    낫다|khỏi bệnh|s|v;짓다|xây, đặt|s|v;
    그렇다|như vậy|h|a;파랗다|xanh dương|h|a;하얗다|trắng|h|a;빨갛다|đỏ|h|a;
    살다|sống|l|v;만들다|làm ra|l|v;알다|biết|l|v;길다|dài|l|a;멀다|xa|l|a`.replace(/\s*\n\s*/g, "");
  const WORDS = RAW.split(";").map(s => { const [w, vi, tag, k] = s.split("|"); return { w, vi, tag, k }; });
  const TAGN = { reg: "Quy tắc", ha: "Động/tính từ 하다", eu: "Bất quy tắc ㅡ (으 rụng)", reu: "Bất quy tắc 르", b: "Bất quy tắc ㅂ", d: "Bất quy tắc ㄷ", s: "Bất quy tắc ㅅ", h: "Bất quy tắc ㅎ", l: "Gốc có ㄹ (ㄹ 탈락)" };
  const TAGHINT = {
    reg: "Gốc từ + đuôi; có patchim dùng 아/어 theo nguyên âm cuối (ㅏ, ㅗ → 아; còn lại → 어).",
    ha: "하 + 여 rút thành 해: 공부해요, 따뜻해요.",
    eu: "ㅡ rụng trước 아/어: 쓰 → 써, 바쁘 → 바빠 (nguyên âm đứng trước ㅡ là ㅏ/ㅗ thì dùng 아, ngược lại dùng 어).",
    reu: "르 → ㄹ라/ㄹ러: 모르 → 몰라, 부르 → 불러.",
    b: "ㅂ → 우 trước nguyên âm: 춥 → 추워, 돕 → 도와.",
    d: "ㄷ → ㄹ trước nguyên âm: 듣 → 들어.",
    s: "ㅅ rụng trước nguyên âm: 낫 → 나아, 짓 → 지어.",
    h: "ㅎ rụng và nguyên âm đổi: 그렇 → 그래, 파랗 → 파래, 하얗 → 하얘.",
    l: "ㄹ rụng trước ㄴ, ㅂ, ㅅ: 살 → 사니까, 삽니다, 사세요."
  };
  const NAME = Object.fromEntries(KR.FORMS.map(f => [f.id, f]));
  const guessTag = (w, k) => { const f = WORDS.find(x => x.w === w); return f ? f.tag : KR.guess(w.replace(/다$/, "")); };

  function table(w, tag, k) {
    const r = KR.conj(w, tag, k);
    const rows = KR.FORMS.filter(f => f.for.includes(k)).map(f => `<tr><th scope="row">${esc(f.vi)}</th><td class="jp" lang="ko"><b>${esc(r[f.id])}</b></td><td class="muted">${esc(SB.romaji(r[f.id]))}</td><td><button class="icon-btn" type="button" data-say="${esc(r[f.id])}" aria-label="Nghe">${ICON_SPEAK}</button></td></tr>`).join("");
    return `<table class="ctable"><thead><tr><th>Dạng</th><th class="jp" lang="ko">${esc(w)}</th><th>Romaja</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  const bindSay = root => $$("[data-say]", root).forEach(b => b.onclick = () => speak(b.dataset.say));

  function page() {
    SB.setNav("the");
    const first = WORDS[0];
    main.innerHTML = band({ big: "형", bigJp: true, title: "Thể của từ: chia động từ, tính từ", text: "Gõ động từ hoặc tính từ ở dạng từ điển (kết thúc bằng 다), chọn loại bất quy tắc rồi xem toàn bộ cách chia thường gặp.", extra: `<div class="hero__actions" style="margin-top:12px"><a class="btn btn--primary" href="#/the/luyen">Luyện chia từ</a></div>` }) +
      `<section class="sec"><div class="wrap"><div class="card">
        <form class="toolbar" data-f style="gap:10px;flex-wrap:wrap">
          <input class="finder" name="w" lang="ko" value="${first.w}" placeholder="Ví dụ: 먹다, 춥다, 듣다" aria-label="Từ cần chia" autocomplete="off">
          <select class="finder" name="k" aria-label="Loại từ"><option value="v">Động từ</option><option value="a">Tính từ</option></select>
          <select class="finder" name="t" aria-label="Loại bất quy tắc"><option value="">Tự đoán</option>${Object.entries(TAGN).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
          <button class="btn btn--primary" type="submit">Chia</button>
        </form>
        <p class="card__hint" data-hint></p><div data-out></div></div>
        <div class="sec__head" style="margin-top:28px"><h2>Chọn nhanh một từ mẫu</h2></div>
        <div class="chips chips--wrap">${WORDS.map((x, i) => `<button class="chip" type="button" data-i="${i}" lang="ko">${x.w}<small> ${esc(x.vi)}</small></button>`).join("")}</div>
        <div class="sec__head" style="margin-top:28px"><h2>Các loại bất quy tắc</h2></div>
        <ul class="rows rows--tight">${Object.keys(TAGN).map(k => `<li class="row"><span><b>${TAGN[k]}</b><br><span class="row__vi">${esc(TAGHINT[k])}</span></span></li>`).join("")}</ul>
      </div></section>`;
    const f = $("[data-f]");
    const run = () => {
      let w = f.w.value.trim(); if (!w) return;
      if (!/다$/.test(w)) w += "다";
      const k = f.k.value, t = f.t.value || guessTag(w, k);
      let ok = true; try { KR.conj(w, t, k); } catch (e) { ok = false; }
      const known = WORDS.some(x => x.w === w);
      $("[data-hint]").innerHTML = ok ? `<b>${esc(TAGN[t])}</b>. ${esc(TAGHINT[t])}${known || f.t.value ? "" : " Nếu đây là từ bất quy tắc (ㅂ, ㄷ, ㅅ, ㅎ), hãy chọn loại ở ô bên cạnh."}` : "Không chia được từ này.";
      $("[data-out]").innerHTML = ok ? table(w, t, k) : ""; bindSay(main);
    };
    f.onsubmit = e => { e.preventDefault(); run(); };
    $$("[data-i]").forEach(b => b.onclick = () => { const x = WORDS[+b.dataset.i]; f.w.value = x.w; f.k.value = x.k; f.t.value = x.tag; run(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    run();
    SB.setCur({ refresh: page });
  }

  /* ---------------- luyện chia từ */
  function practice() {
    SB.setNav("the");
    const N = 12, qs = [];
    const pool = shuffle(WORDS);
    for (let i = 0; i < N; i++) {
      const w = pool[i % pool.length], forms = KR.FORMS.filter(f => f.for.includes(w.k) && !["go", "jianta", "gosipda"].includes(f.id));
      const f = forms[Math.floor(Math.random() * forms.length)];
      qs.push({ w, f, ans: KR.conj(w.w, w.tag, w.k)[f.id] });
    }
    const st = { i: 0, right: 0, streak: 0, wrong: [] };
    const norm = s => String(s || "").replace(/\s+/g, "");
    function draw() {
      if (st.i >= qs.length) {
        main.innerHTML = band({ big: "결과", bigJp: true, title: "Luyện chia từ", compact: true }) +
          `<section class="sec"><div class="wrap">${doneHTML("Hoàn thành", st.right, qs.length, st.wrong.length ? "Các từ chia sai: " + st.wrong.map(x => `<b lang="ko">${esc(x)}</b>`).join(", ") : "Không sai câu nào.", `<a class="btn btn--primary" href="#/the/luyen" data-again>Luyện lại</a><a class="btn btn--ghost" href="#/the">Về trang chia từ</a>`)}</div></section>`;
        afterDone(main, st.right, qs.length); $("[data-again]").onclick = e => { e.preventDefault(); practice(); }; return;
      }
      const q = qs[st.i];
      main.innerHTML = band({ big: "", title: `Câu ${st.i + 1} / ${qs.length}`, text: "Chia từ theo dạng được yêu cầu.", compact: true }) +
        `<section class="sec"><div class="wrap"><div class="card"><div class="quiz"><div class="quiz__q"><p class="test-ask">${esc(NAME[q.f.id].vi)}</p>
          <div class="say" lang="ko">${esc(q.w.w)}</div><div class="card__hint">${esc(q.w.vi)} · ${esc(TAGN[q.w.tag])}</div></div>
          <form data-f><input class="finder finder--big" name="a" lang="ko" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ đáp án (có thể không dấu cách)" aria-label="Đáp án"><div class="card__actions"><button class="btn btn--primary" type="submit">Kiểm tra</button></div></form>
          <div class="feedback" aria-live="polite"></div><div class="card__actions" hidden data-nw><button class="btn btn--primary" type="button" data-next>Tiếp</button></div></div></div></div></section>`;
      const f = $("[data-f]"); f.a.focus();
      f.onsubmit = e => {
        e.preventDefault(); if (f.a.disabled) return;
        const ok = norm(f.a.value) === norm(q.ans); f.a.disabled = true;
        if (ok) { st.right++; st.streak++; } else { st.streak = 0; st.wrong.push(q.w.w); }
        const fb = $(".feedback"); fb.className = "feedback " + (ok ? "ok" : "no");
        fb.innerHTML = verdictHTML(ok, pickWord(ok), `<span lang="ko" class="jp">${esc(q.ans)}</span> <small class="muted">${esc(SB.romaji(q.ans))}</small>`, st.streak); verdict(fb, ok); ok ? celebrate(f) : (wobble(f), buzz());
        speak(q.ans);
        $("[data-nw]").hidden = false; $("[data-next]").focus({ preventScroll: true });
      };
      $("[data-next]").onclick = () => { st.i++; draw(); };
    }
    draw();
    SB.setCur({ refresh: practice });
  }
  SB.the = { route(b) { return b === "luyen" ? practice() : page(); } };
})();
