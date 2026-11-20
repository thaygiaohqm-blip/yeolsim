/* Super Munbeop - Số và đơn vị đếm: số Hán Hàn, số thuần Hàn, bảng đơn vị đếm, luyện đọc */
(() => {
  "use strict";
  const { esc, speak, $, $$, shuffle, band, ICON_SPEAK, celebrate, wobble, verdict, buzz, pickWord, verdictHTML, doneHTML, afterDone } = SB;
  const main = $("#main");

  /* [đơn vị, loại (n thuần Hàn | s Hán Hàn), đếm gì, ví dụ, nghĩa, nhóm] */
  const RAW = `개|n|đồ vật nhỏ nói chung|사과 세 개|ba quả táo|vat;명|n|người (thông thường)|학생 두 명|hai học sinh|nguoi;분|n|người (kính trọng)|손님 세 분|ba vị khách|nguoi;마리|n|động vật, côn trùng, cá|고양이 한 마리|một con mèo|vat;
    권|n|sách, vở, tạp chí|책 네 권|bốn quyển sách|vat;장|n|vật mỏng: giấy, vé, ảnh|표 두 장|hai tấm vé|vat;대|n|xe, máy móc|자동차 한 대|một chiếc ô tô|vat;병|n|chai|맥주 두 병|hai chai bia|an;
    잔|n|cốc, tách|커피 한 잔|một tách cà phê|an;그릇|n|bát, đĩa (đồ ăn)|밥 두 그릇|hai bát cơm|an;송이|n|bông hoa, chùm nho|장미 세 송이|ba bông hồng|vat;켤레|n|đôi (giày, tất)|신발 한 켤레|một đôi giày|vat;
    그루|n|cây|나무 두 그루|hai cái cây|vat;살|n|tuổi (thuần Hàn)|스무 살|hai mươi tuổi|tg;시|n|giờ (đồng hồ)|세 시|ba giờ|tg;시간|n|tiếng (khoảng thời gian)|두 시간|hai tiếng|tg;
    달|n|tháng (khoảng thời gian)|세 달|ba tháng|tg;번|n|lần|세 번|ba lần|tg;
    분(phút)|s|phút|오 분|năm phút|tg;초|s|giây|삼십 초|ba mươi giây|tg;월|s|tháng (lịch)|칠 월|tháng bảy|tg;일|s|ngày (lịch)|이십오 일|ngày hai mươi lăm|tg;
    년|s|năm|이천이십육 년|năm 2026|tg;개월|s|tháng (số tháng, Hán Hàn)|육 개월|sáu tháng|tg;주|s|tuần|이 주|hai tuần|tg;원|s|won (tiền Hàn)|오천 원|năm nghìn won|so;
    층|s|tầng|삼 층|tầng ba|so;번(số)|s|số thứ tự, số hiệu|십이 번|số 12|so;학년|s|năm học, lớp|이 학년|năm hai|so;과|s|bài học|십 과|bài 10|so;
    페이지|s|trang|이십 페이지|trang 20|so;퍼센트|s|phần trăm|오십 퍼센트|năm mươi phần trăm|so;킬로|s|ki-lô-gam, ki-lô-mét|십 킬로|mười ki-lô|so`.replace(/\s*\n\s*/g, "");
  const D = RAW.split(";").map(s => { const [c, t, what, ex, vi, g] = s.split("|"); return { c, base: c.replace(/\(.*\)/, ""), t, what, ex, vi, g }; });
  const GROUPS = [["vat", "Đếm vật, động vật, cây cối"], ["nguoi", "Đếm người"], ["an", "Đồ ăn, thức uống"], ["tg", "Thời gian, tuổi"], ["so", "Tiền, tầng, số hiệu, đo lường"]];

  const sino = n => KR.sino(n), nat = (n, ctr) => KR.native(n, ctr);
  const sayBt = t => `<button class="icon-btn" type="button" data-say="${esc(t)}" aria-label="Nghe">${SB.ICON_SPEAK}</button>`;
  const bindSay = root => $$("[data-say]", root).forEach(b => b.onclick = () => speak(b.dataset.say));

  function list() {
    SB.setNav("dem");
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 30, 40, 50, 60, 70, 80, 90, 99];
    main.innerHTML = band({ big: "수", bigJp: true, title: "Số và đơn vị đếm", text: "Tiếng Hàn có hai hệ số: số Hán Hàn (일, 이, 삼…) và số thuần Hàn (하나, 둘, 셋…). Mỗi đơn vị đếm đi với một hệ số nhất định.",
        extra: '<div class="band__cta"><a class="btn btn--primary" href="#/dem/luyen">Luyện đọc số</a></div>' }) +
      `<section class="sec"><div class="wrap">
        <div class="card"><form class="toolbar" data-f><input class="finder" name="n" type="number" min="0" max="999999999" value="2026" aria-label="Nhập số" style="max-width:200px"><button class="btn btn--primary" type="submit">Đọc số này</button></form>
        <div data-out></div></div>
        <div class="sec__head" style="margin-top:28px"><h2>Bảng số 1–99</h2></div>
        <table class="ctable"><thead><tr><th>Số</th><th class="jp" lang="ko">Hán Hàn</th><th class="jp" lang="ko">Thuần Hàn</th><th class="jp" lang="ko">Trước đơn vị</th></tr></thead><tbody>
        ${nums.map(n => `<tr><th scope="row">${n}</th><td class="jp" lang="ko">${sino(n)}</td><td class="jp" lang="ko">${nat(n)}</td><td class="jp" lang="ko"><b>${nat(n, true)}</b></td></tr>`).join("")}</tbody></table>
        <p class="card__hint">Số thuần Hàn chỉ dùng đến 99. Từ 100 trở lên luôn dùng số Hán Hàn. Số 1, 2, 3, 4, 20 đổi dạng khi đứng trước đơn vị: 한, 두, 세, 네, 스무.</p>
        ${GROUPS.map(([g, name]) => `<div class="sec__head" style="margin-top:28px"><h2>${name}</h2></div><ul class="rows rows--tight">${D.filter(x => x.g === g).map(x => `<li class="row"><span class="row__l"><span class="row__ja jp" lang="ko" style="font-size:24px">${esc(x.base)}</span><span class="pill">${x.t === "n" ? "thuần Hàn" : "Hán Hàn"}</span></span>
          <span class="row__vi">${esc(x.what)}<br><span lang="ko" class="jp">${esc(x.ex)}</span> · ${esc(x.vi)}</span><span class="row__side">${sayBt(x.ex)}</span></li>`).join("")}</ul>`).join("")}
        <div class="sec__head" style="margin-top:28px"><h2>Quy tắc cần nhớ</h2></div>
        <ul class="gform"><li><b>Giờ và phút</b>: giờ dùng số thuần Hàn (세 시), phút dùng số Hán Hàn (오 분). 3시 5분 → 세 시 오 분.</li>
        <li><b>Ngày tháng</b>: dùng số Hán Hàn: 6월 25일 → 유월 이십오일. Riêng 6 và 10 đổi: 유월 (6), 시월 (10).</li>
        <li><b>Tuổi</b>: 살 đi với số thuần Hàn (스무 살), 세 đi với số Hán Hàn (이십 세, trang trọng).</li>
        <li><b>Tiền</b>: 원 đi với số Hán Hàn: 오천 원. Không đọc 일 trước 천, 백, 십, 만 khi đứng đầu: 천 원, 만 원.</li>
        <li><b>Số điện thoại</b>: đọc từng chữ số Hán Hàn, số 0 đọc 공 hoặc 영, nối bằng 에 hoặc 의 không cần: 010 → 공일공.</li></ul>
      </div></section>`;
    const f = $("[data-f]"), out = $("[data-out]");
    const run = () => {
      const n = Math.max(0, Math.min(999999999, Math.floor(+f.n.value || 0)));
      const rows = [["Hán Hàn", sino(n)]]; if (n >= 1 && n <= 99) { rows.push(["Thuần Hàn", nat(n)]); rows.push(["Trước đơn vị", nat(n, true)]); }
      out.innerHTML = `<table class="ctable"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td class="jp" lang="ko"><b>${esc(v)}</b></td><td class="muted">${esc(SB.romaji(v))}</td><td>${sayBt(v)}</td></tr>`).join("")}</tbody></table>`; bindSay(out);
    };
    f.onsubmit = e => { e.preventDefault(); run(); }; run(); bindSay(main);
    SB.setCur({ refresh: list });
  }

  /* ---------------- luyện: đọc "số + đơn vị" bằng chữ Hàn */
  function practice() {
    SB.setNav("dem");
    const N = 12, qs = [], pool = shuffle(D);
    for (let i = 0; i < N; i++) {
      const c = pool[i % pool.length];
      let n, ans, show;
      if (c.t === "n") { n = c.base === "살" ? 1 + Math.floor(Math.random() * 40) : 1 + Math.floor(Math.random() * (c.base === "시" ? 12 : 20)); ans = nat(n, true) + " " + c.base; }
      else if (c.base === "원") { n = [500, 1000, 3000, 5000, 12000, 25000, 70000, 100000][Math.floor(Math.random() * 8)]; ans = sino(n) + " 원"; }
      else if (c.base === "년") { n = 1950 + Math.floor(Math.random() * 80); ans = sino(n) + " 년"; }
      else if (c.base === "월") { n = 1 + Math.floor(Math.random() * 12); ans = ({ 6: "유", 10: "시" }[n] || sino(n)) + " 월"; }
      else { n = 1 + Math.floor(Math.random() * 59); ans = sino(n) + " " + c.base; }
      qs.push({ c, n, ans });
    }
    const st = { i: 0, right: 0, streak: 0, wrong: [] }, norm = s => String(s || "").replace(/\s+/g, "");
    function draw() {
      if (st.i >= qs.length) {
        main.innerHTML = band({ big: "결과", bigJp: true, title: "Luyện đọc số", compact: true }) + `<section class="sec"><div class="wrap">${doneHTML("Hoàn thành", st.right, qs.length, st.wrong.length ? "Cần xem lại: " + st.wrong.map(x => `<b lang="ko">${esc(x)}</b>`).join(", ") : "Không sai câu nào.", `<a class="btn btn--primary" href="#/dem/luyen" data-again>Luyện lại</a><a class="btn btn--ghost" href="#/dem">Về bảng số</a>`)}</div></section>`;
        afterDone(main, st.right, qs.length); $("[data-again]").onclick = e => { e.preventDefault(); practice(); }; return;
      }
      const q = qs[st.i];
      main.innerHTML = band({ big: "", title: `Câu ${st.i + 1} / ${qs.length}`, text: "Viết cách đọc bằng chữ Hàn.", compact: true }) +
        `<section class="sec"><div class="wrap"><div class="card"><div class="quiz"><div class="quiz__q"><p class="test-ask">Đọc bằng chữ Hàn</p>
          <div class="say" lang="ko">${q.n.toLocaleString("en-US")}${esc(q.c.base)}</div><div class="card__hint">${esc(q.c.what)} · dùng số ${q.c.t === "n" ? "thuần Hàn" : "Hán Hàn"}</div></div>
          <form data-f><input class="finder finder--big" name="a" lang="ko" autocomplete="off" spellcheck="false" aria-label="Đáp án" placeholder="Ví dụ: 세 개"><div class="card__actions"><button class="btn btn--primary" type="submit">Kiểm tra</button></div></form>
          <div class="feedback" aria-live="polite"></div><div class="card__actions" hidden data-nw><button class="btn btn--primary" type="button" data-next>Tiếp</button></div></div></div></div></section>`;
      const f = $("[data-f]"); f.a.focus();
      f.onsubmit = e => {
        e.preventDefault(); if (f.a.disabled) return; f.a.disabled = true;
        const ok = norm(f.a.value) === norm(q.ans); if (ok) { st.right++; st.streak++; } else { st.streak = 0; st.wrong.push(q.ans); }
        const fb = $(".feedback"); fb.className = "feedback " + (ok ? "ok" : "no"); fb.innerHTML = verdictHTML(ok, pickWord(ok), `<span lang="ko" class="jp">${esc(q.ans)}</span>`, st.streak); verdict(fb, ok); ok ? celebrate(f) : (wobble(f), buzz()); speak(q.ans);
        $("[data-nw]").hidden = false; $("[data-next]").focus({ preventScroll: true });
      };
      $("[data-next]").onclick = () => { st.i++; draw(); };
    }
    draw(); SB.setCur({ refresh: practice });
  }
  SB.dem = { route(b) { return b === "luyen" ? practice() : list(); } };
})();
