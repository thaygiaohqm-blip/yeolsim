/* Super Munbeop - điều hướng, trang chủ, màu giao diện, bật tắt hiển thị, cầu nối đăng nhập */
(() => {
  "use strict";
  const { C, S, P, store, saveS, esc, jp, toast, $, $$, fmt, band, meter, listeners, paintReviewBadge } = SB;
  const main = $("#main"), G = SB.G;
  let current = null;
  SB.setCur = c => { current = c; };
  const setNav = k => $$("[data-nav]").forEach(a => k && a.dataset.nav === k ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  SB.setNav = setNav;
  SB.notFound = () => {
    setNav("");
    main.innerHTML = `<div class="wrap sec"><div class="empty"><h3>Không có trang này</h3><p>Đường dẫn có thể đã thay đổi.</p><a class="btn btn--primary" href="#/">Về trang chủ</a></div></div>`;
  };
  async function home() {
    setNav(""); await G.loadAll();
    const tiles = [
      ["#/cap-do", "급", "Cấp độ", "Từ 1급 đến 6급, chia nhóm cùng sắc thái"], ["#/chu-de", "주제", "Chủ đề", "Nguyên nhân, cảm xúc, điều kiện, so sánh…"],
      ["#/boi-canh", "상황", "Bối cảnh", "Hội thoại, công sở, văn viết, báo chí"], ["#/giao-trinh", "교재", "Giáo trình", "Tiếng Hàn tổng hợp: Sơ cấp 1, Cao cấp 6"],
      ["#/the", "형", "Thể của từ", "Chia động từ, tính từ, bất quy tắc, luyện chia"], ["#/dem", "수", "Số đếm", "Số Hán Hàn, thuần Hàn và đơn vị đếm"],
      ["#/test", "시험", "Test đầu vào", "Biết mình đang ở cấp nào"], ["#/on-tap", "복습", "Cần ôn", "Những mẫu bạn chưa thuộc"]];
    const all = G.allPats(), ok = G.learnedIn(all);
    main.innerHTML = `<section class="hero"><div class="wrap hero__in"><div><p class="hero__kicker">Ngữ pháp tiếng Hàn</p><h1>Super <em>Munbeop</em></h1>
      <p class="hero__lead">Mỗi mẫu có nghĩa, cấu trúc, giải thích, ví dụ tách theo từng nghĩa, đối chiếu và lưu ý. Mọi câu ví dụ đều nghe được.</p>
      <form class="hero__search" data-hsearch role="search"><input type="search" name="q" placeholder="Tìm ngữ pháp: -(으)니까, nguyên nhân, 거예요…" aria-label="Tìm ngữ pháp"><button class="btn btn--primary" type="submit">Tìm</button></form>
      <div class="hero__cta"><a class="btn btn--primary" href="#/cap-do/k1">Học 1급</a><a class="btn btn--ghost" href="#/giao-trinh">Theo giáo trình</a><a class="btn btn--ghost" href="#/test">Làm test đầu vào</a></div></div>
      <div class="hero__meta"><b>${fmt(all.length)}</b><span>mẫu đã mở</span>${meter(ok, all.length)}<span>${ok} đã học</span></div></div></section>
      <section class="sec"><div class="wrap"><ul class="hometiles">${tiles.map(t => `<li><a href="${t[0]}"><b>${t[2]}</b><small>${t[3]}</small></a></li>`).join("")}</ul></div></section>`;
    const hf = $("[data-hsearch]"); if (hf) hf.onsubmit = e => { e.preventDefault(); location.hash = "#/tim-kiem?q=" + encodeURIComponent(hf.q.value.trim()); };
    SB.setCur({ refresh: home });
  }
  async function route() {
    if (current && current.destroy) current.destroy();
    current = null;
    const h = location.hash.replace(/^#\/?/, ""), [path, qs] = h.split("?"), parts = path.split("/").filter(Boolean).map(decodeURIComponent), q = new URLSearchParams(qs || "");
    window.scrollTo(0, 0);
    const R = G.routes;
    try {
      if (!parts.length) return await home();
      const [a, b, c] = parts;
      if (a === "tim-kiem") { setNav("search"); return await SB.search.page(q.get("q") || ""); }
      if (a === "cap-do") { setNav("level"); return b ? (c === "nhom" ? (parts[4] === "test" ? await SB.lt.runGroup(b, parts[3]) : await R.groupStudy(b, parts[3])) : await R.level(b)) : await R.levelList(); }
      if (a === "chu-de") { setNav("theme"); return b ? (c === "hoc" ? await R.facetStudy("theme", b, q) : await R.facetDetail("theme", b, q)) : await R.facetList("theme"); }
      if (a === "boi-canh") { setNav("ctx"); return b ? (c === "hoc" ? await R.facetStudy("ctx", b, q) : await R.facetDetail("ctx", b, q)) : await R.facetList("ctx"); }
      if (a === "giao-trinh") { setNav("gt"); if (b && c && parts[3] === "on-tap") return await R.bookUnitStudy(b, c); if (b && c && parts[3] === "test") return await SB.lt.runBook(b, c); if (b && c === "bai-tap") return await SB.ex.route(b, parts[3], qs); if (b && c && parts[3] === "bai-tap") { await G.loadAll(); const bk = C.books.find(x => x.id === b); if (bk && await SB.ex.unitPage(bk, c)) return; return SB.notFound(); } return c === "can-on" ? await R.bookReview(b) : c ? await R.bookUnit(b, c) : b ? await R.book(b) : await R.books(); }
      if (a === "ngu-phap") { setNav("level"); return await R.detail(b); }
      if (a === "on-tap") { setNav("rev"); return b === "hoc" ? await R.reviewStudy() : await R.review(); }
      if (a === "the") { setNav("the"); return await SB.the.route(b, c); }
      if (a === "dem") { setNav("dem"); return await SB.dem.route(b, c); }
      if (a === "test") { setNav("test"); return await SB.test.route(); }
      SB.notFound();
    } catch (err) {
      console.error(err);
      main.innerHTML = `<div class="wrap sec"><div class="empty"><h3>Không tải được dữ liệu</h3><p>Hãy mở trang qua một máy chủ web (ví dụ Vercel) hoặc kiểm tra thư mục data/ có đủ file.</p><a class="btn btn--primary" href="#/">Về trang chủ</a></div></div>`;
    }
  }
  SB.route = route;

  const THEMES = [
    { id: "momiji", ko: "단풍", name: "Lá phong", note: "Nâu đỏ mùa thu", c: ["#7a2f14", "#f2a04a", "#c8102e", "#faf0e3"], meta: "#7a2f14" },
    { id: "kohaku", ko: "호박", name: "Hổ phách", note: "Vàng hổ phách, ấm áp", c: ["#7a4a0d", "#f0b429", "#c0392b", "#faf3e0"], meta: "#7a4a0d" },
    { id: "matcha", ko: "말차", name: "Trà xanh", note: "Xanh lá, tự nhiên", c: ["#3f5a22", "#a3c45a", "#d9622b", "#f4f2e4"], meta: "#3f5a22" },
    { id: "reu", ko: "이끼", name: "Rêu", note: "Xanh rêu, mặc định", c: ["#004646", "#27c4b5", "#ed3838", "#f7f4ed"], meta: "#004646" },
    { id: "umi", ko: "바다", name: "Biển", note: "Xanh biển, tươi mát", c: ["#0b5563", "#2bb3d6", "#ef6a4c", "#eef6f8"], meta: "#0b5563" },
    { id: "ai", ko: "쪽빛", name: "Chàm", note: "Xanh chàm, dịu mắt", c: ["#233a63", "#5fa8d8", "#e0533d", "#f1f3f7"], meta: "#233a63" },
    { id: "fuji", ko: "등꽃", name: "Tử đằng", note: "Tím hoa tử đằng, thanh nhã", c: ["#4b3a78", "#b79ae6", "#e0476b", "#f4f0fa"], meta: "#4b3a78" },
    { id: "sakura", ko: "벚꽃", name: "Anh đào", note: "Hồng mận, ấm áp", c: ["#7a2e4a", "#ee8fae", "#d23b3b", "#fbf1f2"], meta: "#7a2e4a" },
    { id: "sumi", ko: "숯", name: "Than đá", note: "Xám than, tối giản", c: ["#2f3437", "#8aa0a8", "#e5533d", "#f1f2f2"], meta: "#2f3437" },
    { id: "yoru", ko: "밤", name: "Ban đêm", note: "Nền tối, học buổi tối", c: ["#0b1416", "#134e4c", "#3fd1c0", "#ff6b6b"], meta: "#0b1416" }
  ];
  function applyTheme(id) {
    const t = THEMES.find(x => x.id === id) || THEMES.find(x => x.id === "reu");
    if (t.id === "reu") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t.id;
    const m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", t.meta);
    $$(".theme-opt").forEach(o => o.setAttribute("aria-checked", o.dataset.t === t.id));
  }
  (function themePicker() {
    const btn = $("[data-theme-btn]"), menu = $(".theme-menu");
    menu.innerHTML = "<p>Màu giao diện</p>" + THEMES.map(t => `<button class="theme-opt" type="button" role="menuitemradio" data-t="${t.id}" aria-checked="false"><span class="sw">${t.c.map(c => `<i style="background:${c}"></i>`).join("")}</span><span><b>${t.name}</b><small>${t.note}</small></span><span class="ja" lang="ko">${t.ko}</span></button>`).join("");
    const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", ev => { ev.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute("aria-expanded", open); });
    menu.addEventListener("click", ev => { const o = ev.target.closest(".theme-opt"); if (!o) return; S.theme = o.dataset.t; saveS(); applyTheme(S.theme); close(); toast(`Đã đổi sang màu ${THEMES.find(x => x.id === S.theme).name}`); });
    document.addEventListener("click", ev => { if (!ev.target.closest(".themes")) close(); });
    document.addEventListener("keydown", ev => { if (ev.key === "Escape") close(); });
    applyTheme(S.theme || "reu");
  })();
  const paintToggles = () => $$("[data-toggle]").forEach(b => b.setAttribute("aria-pressed", !!S[b.dataset.toggle]));
  function flip(key) {
    S[key] = !S[key]; saveS(); paintToggles();
    toast(S.romaji ? "Đang hiện romaja" : "Đã ẩn romaja");
    if (current && current.refresh) current.refresh(); else route();
  }
  $$("[data-toggle]").forEach(b => b.addEventListener("click", () => flip(b.dataset.toggle)));
  document.addEventListener("keydown", ev => {
    if (ev.target.matches("input, textarea") || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === "r" || ev.key === "R") flip("romaji");
  });
  const PKEYS = ["placement"];
  SB.sync = {
    snapshot: () => ({ progress: JSON.parse(JSON.stringify(P)), placement: store.get("placement", null) }),
    onChange: fn => listeners.push(fn), toast,
    apply(blob) {
      const before = JSON.stringify([P, store.get("placement", null)]), p = (blob && blob.progress) || {};
      P.ok = p.ok || {}; P.rv = p.rv || {}; P.gt = p.gt || {}; P.ts = p.ts || {}; P.clr = p.clr || 0;
      store.set("progress", P);
      if (blob && blob.placement) store.set("placement", blob.placement); else { try { localStorage.removeItem("sb:placement"); } catch (e) { /* bỏ qua */ } }
      paintReviewBadge();
      if (JSON.stringify([P, store.get("placement", null)]) !== before && !(current && current.destroy) && /^(#\/?)?$|^#\/(k[1-6])?$/.test(location.hash)) route();
    }
  };
  paintToggles(); paintReviewBadge();
  window.addEventListener("hashchange", route);
  route();
})();
