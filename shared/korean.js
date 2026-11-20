/* Super Yeolsim — bộ xử lý tiếng Hàn dùng chung (không phụ thuộc thư viện ngoài).
   KR.rom(text)        phiên âm romaja (Romanization of Korean, có áp dụng luật biến âm chính)
   KR.conj(dict, tag)  chia động từ / tính từ ở các dạng đuôi câu thường gặp
   KR.sino(n), KR.native(n, counter)  đọc số theo số Hán Hàn / số thuần Hàn
   KR.sim(a, b)        độ giống nhau của hai câu tiếng Hàn (dùng để chấm điểm nói) */
(function (root) {
  "use strict";
  const S0 = 0xAC00, S1 = 0xD7A3;
  const L = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const V = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
  const T = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const isH = c => !!c && c >= "가" && c <= "힣";
  const dec = ch => { const n = ch.charCodeAt(0) - S0; return { l: L[(n / 588) | 0], v: V[((n % 588) / 28) | 0], t: T[n % 28] }; };
  const enc = (l, v, t) => String.fromCharCode(S0 + L.indexOf(l) * 588 + V.indexOf(v) * 28 + (t ? T.indexOf(t) : 0));
  const hasFinal = ch => isH(ch) && (ch.charCodeAt(0) - S0) % 28 !== 0;
  const finalOf = ch => (isH(ch) ? T[(ch.charCodeAt(0) - S0) % 28] : "");
  const withFinal = (ch, t) => { const d = dec(ch); return enc(d.l, d.v, t); };
  const lastCh = s => s[s.length - 1] || "";
  const initR = { ㄱ:"g",ㄲ:"kk",ㄴ:"n",ㄷ:"d",ㄸ:"tt",ㄹ:"r",ㅁ:"m",ㅂ:"b",ㅃ:"pp",ㅅ:"s",ㅆ:"ss",ㅇ:"",ㅈ:"j",ㅉ:"jj",ㅊ:"ch",ㅋ:"k",ㅌ:"t",ㅍ:"p",ㅎ:"h" };
  const vowR = { ㅏ:"a",ㅐ:"ae",ㅑ:"ya",ㅒ:"yae",ㅓ:"eo",ㅔ:"e",ㅕ:"yeo",ㅖ:"ye",ㅗ:"o",ㅘ:"wa",ㅙ:"wae",ㅚ:"oe",ㅛ:"yo",ㅜ:"u",ㅝ:"wo",ㅞ:"we",ㅟ:"wi",ㅠ:"yu",ㅡ:"eu",ㅢ:"ui",ㅣ:"i" };
  const finR = { ㄱ:"k",ㄴ:"n",ㄷ:"t",ㄹ:"l",ㅁ:"m",ㅂ:"p",ㅇ:"ng" };
  const SPLIT = { ㄳ:["ㄱ","ㅅ"],ㄵ:["ㄴ","ㅈ"],ㄶ:["ㄴ","ㅎ"],ㄺ:["ㄹ","ㄱ"],ㄻ:["ㄹ","ㅁ"],ㄼ:["ㄹ","ㅂ"],ㄽ:["ㄹ","ㅅ"],ㄾ:["ㄹ","ㅌ"],ㄿ:["ㄹ","ㅍ"],ㅀ:["ㄹ","ㅎ"],ㅄ:["ㅂ","ㅅ"] };
  const REP = { ㄲ:"ㄱ",ㅋ:"ㄱ",ㅅ:"ㄷ",ㅆ:"ㄷ",ㅈ:"ㄷ",ㅊ:"ㄷ",ㅌ:"ㄷ",ㅍ:"ㅂ" };   // âm cuối rút gọn về 7 âm
  const ASP = { ㄱ:"ㅋ",ㄷ:"ㅌ",ㅈ:"ㅊ",ㅂ:"ㅍ" };

  /* ---------- phiên âm romaja theo cách phát âm ---------- */
  function romWord(w) {
    const sy = [...w].map(ch => isH(ch) ? dec(ch) : { raw: ch });
    for (let i = 0; i < sy.length; i++) {
      const c = sy[i], n = sy[i + 1];
      if (c.raw || !c.t) continue;
      const parts = SPLIT[c.t] || [c.t];
      if (!n || n.raw) { c.fin = finalSound(c.t); continue; }
      if (n.l === "ㅇ") {                                   // nối âm
        if (c.t === "ㅇ") { c.fin = "ㅇ"; continue; }
        if (c.t === "ㅎ") { c.fin = ""; continue; }
        if (parts.length === 2 && parts[1] === "ㅎ") { c.fin = parts[0]; continue; }  // ㄶ, ㅀ: ㅎ câm
        let mv = parts[parts.length - 1];
        c.fin = parts.length === 2 ? parts[0] : "";
        if (mv === "ㄷ" && n.v === "ㅣ") mv = "ㅈ";            // 해돋이 → 해도지
        if (mv === "ㅌ" && n.v === "ㅣ") mv = "ㅊ";            // 같이 → 가치
        n.l = mv; continue;
      }
      let f = parts.length === 2 ? (c.t === "ㄺ" || c.t === "ㄼ" || c.t === "ㄽ" || c.t === "ㄾ" || c.t === "ㅀ" ? "ㄹ" : c.t === "ㄻ" ? "ㅁ" : c.t === "ㄳ" ? "ㄱ" : c.t === "ㄵ" || c.t === "ㄶ" ? "ㄴ" : "ㅂ") : c.t;
      if (c.t === "ㄺ" && ["ㄱ"].includes(n.l)) f = "ㄹ";
      if ((c.t === "ㅎ" || c.t === "ㄶ" || c.t === "ㅀ") && ASP[n.l]) { n.l = ASP[n.l]; c.fin = c.t === "ㄶ" ? "ㄴ" : c.t === "ㅀ" ? "ㄹ" : ""; continue; }
      if (c.t === "ㄶ" && n.l === "ㅅ") f = "ㄴ";
      f = REP[f] || f;
      if (n.l === "ㅎ" && ASP[f]) { n.l = ASP[f]; c.fin = ""; continue; }
      if ((n.l === "ㄴ" || n.l === "ㅁ") && (f === "ㄱ" || f === "ㄷ" || f === "ㅂ")) f = f === "ㄱ" ? "ㅇ" : f === "ㄷ" ? "ㄴ" : "ㅁ";
      if (n.l === "ㄹ") {
        if (f === "ㅁ" || f === "ㅇ") n.l = "ㄴ";
        else if (f === "ㄱ" || f === "ㅂ") { f = f === "ㄱ" ? "ㅇ" : "ㅁ"; n.l = "ㄴ"; }
        else if (f === "ㄷ") { f = "ㄴ"; n.l = "ㄴ"; }
      }
      if (f === "ㄴ" && n.l === "ㄹ") { f = "ㄹ"; }
      if (f === "ㄹ" && n.l === "ㄴ") { n.l = "ㄹ"; }
      c.fin = f;
    }
    let out = "", prevOpen = false;
    sy.forEach((c, i) => {
      if (c.raw) { out += c.raw; prevOpen = false; return; }
      let ini = initR[c.l];
      if (c.l === "ㄹ") ini = (i > 0 && !sy[i - 1].raw && sy[i - 1].fin === "ㄹ") ? "l" : (prevOpen ? "r" : "r");
      out += ini + vowR[c.v] + (c.fin === undefined ? (c.t ? finR[finalSound(c.t)] || "" : "") : (c.fin ? finR[c.fin] || "" : ""));
      prevOpen = !c.t || c.fin === "";
    });
    return out;
  }
  function finalSound(t) {
    if (!t) return "";
    if (SPLIT[t]) { const p = SPLIT[t]; return t === "ㄺ" ? "ㄱ" : t === "ㄼ" || t === "ㄽ" || t === "ㄾ" || t === "ㅀ" ? "ㄹ" : t === "ㄻ" ? "ㅁ" : t === "ㄳ" ? "ㄱ" : t === "ㄵ" || t === "ㄶ" ? "ㄴ" : "ㅂ"; }
    return REP[t] || (t === "ㅎ" ? "ㄷ" : t);
  }
  /* ㄺ cuối câu đọc ㄱ (닭 → dak), ㄼ đọc ㄹ (여덟 → yeodeol), ㄻ đọc ㅁ (삶 → sam) */
  function rom(text) {
    return String(text == null ? "" : text).replace(/[{}]/g, "").split(/(\s+)/).map(w => /^\s*$/.test(w) ? w : romWord(w)).join("").replace(/\s+/g, " ").trim();
  }

  /* ---------- chia động từ / tính từ ---------- */
  const isOpen = s => !hasFinal(lastCh(s));
  const vowelOf = s => { const c = lastCh(s); return isH(c) ? dec(c).v : ""; };
  const bright = v => v === "ㅏ" || v === "ㅗ" || v === "ㅑ" || v === "ㅘ";       // nguyên âm sáng → 아
  /* hậu tố gắn phụ âm cuối vào âm tiết cuối: 가 + ㄹ → 갈 */
  const addJong = (s, j) => s.slice(0, -1) + withFinal(lastCh(s), j);
  /* Gốc từ theo từng loại; tag: reg | b | d | s | reu | h | l | eu | ha (hoặc để trống để tự đoán) */
  function guess(stem) {
    if (/하$/.test(stem)) return "ha";
    if (lastCh(stem) === "르") return "reu";
    if (finalOf(lastCh(stem)) === "ㄹ") return "l";
    if (vowelOf(stem) === "ㅡ" && isOpen(stem)) return "eu";
    return "reg";
  }
  /* gốc + 아/어 đã rút gọn (không gồm 요): 가, 봐, 먹어, 도와, 들어, 써, 해 … */
  function eoForm(stem, tag) {
    const last = lastCh(stem), head = stem.slice(0, -1), d = dec(last);
    if (tag === "ha") return head + "해";
    if (tag === "h") return head + enc(d.l, d.v === "ㅑ" ? "ㅒ" : "ㅐ", "");
    if (tag === "b") return head + withFinal(last, "") + (/[돕곱]$/.test(stem) ? "와" : "워");
    if (tag === "d") return head + withFinal(last, "ㄹ") + (bright(d.v) ? "아" : "어");
    if (tag === "s") return head + withFinal(last, "") + (bright(d.v) ? "아" : "어");
    if (tag === "reu") { const p = head, pv = p ? vowelOf(p) : ""; return (p ? addJong(p, "ㄹ") : "ㄹ") + (bright(pv) ? "라" : "러"); }
    if (tag === "eu") { const pv = head ? vowelOf(head) : ""; return head + enc(d.l, bright(pv) ? "ㅏ" : "ㅓ", ""); }
    if (isOpen(stem)) {
      const v = d.v;
      if (v === "ㅗ") return head + enc(d.l, "ㅘ", "");
      if (v === "ㅜ") return head + enc(d.l, "ㅝ", "");
      if (v === "ㅣ") return head + enc(d.l, "ㅕ", "");
      if (v === "ㅚ") return head + enc(d.l, "ㅙ", "");
      return stem;
    }
    return stem + (bright(d.v) ? "아" : "어");
  }
  /* gốc dùng trước nguyên âm (khi gắn 으 / ㄴ / ㄹ): 돕 → 도우, 듣 → 들, 낫 → 나, 그렇 → 그러 */
  function vStem(stem, tag) {
    const last = lastCh(stem), head = stem.slice(0, -1);
    if (tag === "b") return head + withFinal(last, "") + "우";
    if (tag === "d") return head + withFinal(last, "ㄹ");
    if (tag === "s") return head + withFinal(last, "");
    if (tag === "h") return head + withFinal(last, "");
    return stem;
  }
  /* kiểu đuôi: eu = (으)X (니까, 면, 세요), n = (으)ㄴ, r = (으)ㄹ, b = ㅂ/습니다
     tag s: 나으니까 (còn 으), 지으니까; tag h: 그러니까 (không có 으); tag d: 들으니까 */
  function attach(stem, tag, kind, suf) {
    const v = vStem(stem, tag), open = isOpen(v);
    if (tag === "l") {                                      // ㄹ rụng trước ㄴ ㅂ ㅅ
      const dr = addJong(stem, "");
      if (kind === "n") return addJong(stem, "ㄴ");
      if (kind === "r") return stem;
      if (kind === "b") return addJong(stem, "ㅂ") + "니다";
      return /^(니|세|시|오)/.test(suf) ? dr + suf : stem + suf;
    }
    if (kind === "b") return (tag === "b" || tag === "d" || tag === "s" || tag === "h") ? stem + "습니다" : open ? addJong(v, "ㅂ") + "니다" : v + "습니다";
    const withEu = tag === "s" || tag === "d" || (!open && tag !== "h");
    if (tag === "s") { if (kind === "n") return v + "은"; if (kind === "r") return v + "을"; }
    if (kind === "n") return open ? addJong(v, "ㄴ") : v + "은";
    if (kind === "r") return open ? addJong(v, "ㄹ") : v + "을";
    if (tag === "s") return v + "으" + suf;
    if (tag === "d") return v + "으" + suf;
    return open ? v + suf : v + "으" + suf;
  }
  const FORMS = [
    { id: "haeyo", vi: "Đuôi thân mật lịch sự -아/어요", ex: "먹어요", for: "va" },
    { id: "hamnida", vi: "Đuôi trang trọng -ㅂ/습니다", ex: "먹습니다", for: "va" },
    { id: "past", vi: "Quá khứ -았/었어요", ex: "먹었어요", for: "va" },
    { id: "future", vi: "Dự định, phỏng đoán -(으)ㄹ 거예요", ex: "먹을 거예요", for: "va" },
    { id: "go", vi: "Nối câu -고 (và, rồi)", ex: "먹고", for: "va" },
    { id: "eoseo", vi: "Lý do / nối tiếp -아/어서", ex: "먹어서", for: "va" },
    { id: "nikka", vi: "Lý do -(으)니까", ex: "먹으니까", for: "va" },
    { id: "myeon", vi: "Điều kiện -(으)면", ex: "먹으면", for: "va" },
    { id: "seyo", vi: "Kính ngữ -(으)세요", ex: "드세요 / 먹으세요", for: "v" },
    { id: "su", vi: "Có thể -(으)ㄹ 수 있다", ex: "먹을 수 있다", for: "v" },
    { id: "jianta", vi: "Phủ định -지 않다", ex: "먹지 않아요", for: "va" },
    { id: "gosipda", vi: "Muốn -고 싶다", ex: "먹고 싶어요", for: "v" },
    { id: "juseyo", vi: "Nhờ vả -아/어 주세요", ex: "먹어 주세요", for: "v" },
    { id: "modpres", vi: "Định ngữ hiện tại -는 / -(으)ㄴ", ex: "먹는 / 작은", for: "va" },
    { id: "modpast", vi: "Định ngữ quá khứ -(으)ㄴ", ex: "먹은", for: "v" },
    { id: "ndeun", vi: "Bối cảnh, đối lập -는데 / -(으)ㄴ데", ex: "먹는데 / 작은데", for: "va" }
  ];
  /* dict: dạng từ điển (…다); tag: loại bất quy tắc; kind: "v" động từ | "a" tính từ */
  function conj(dict, tag, kind) {
    const stem = dict.replace(/다$/, ""); tag = tag || guess(stem);
    const E = eoForm(stem, tag), out = {};
    out.haeyo = E + "요";
    out.hamnida = attach(stem, tag, "b");
    out.past = addJong(E, "ㅆ") + "어요";
    out.future = attach(stem, tag, "r") + " 거예요";
    out.go = stem + "고";
    out.eoseo = E + "서";
    out.nikka = attach(stem, tag, "eu", "니까");
    out.myeon = attach(stem, tag, "eu", "면");
    out.seyo = attach(stem, tag, "eu", "세요");
    out.su = attach(stem, tag, "r") + " 수 있다";
    out.jianta = stem + "지 않아요";
    out.gosipda = stem + "고 싶어요";
    out.juseyo = E + " 주세요";
    out.modpast = attach(stem, tag, "n");
    const hasIt = /(있|없)$/.test(stem);
    const mp = kind === "a" && !hasIt ? attach(stem, tag, "n") : (tag === "l" ? addJong(stem, "") + "는" : stem + "는");
    out.modpres = mp;
    out.ndeun = (kind === "a" && !hasIt ? attach(stem, tag, "n") : mp) + "데";
    return out;
  }

  /* ---------- đọc số ---------- */
  const SD = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  function sino(n) {
    n = Math.floor(n); if (n === 0) return "영"; if (n < 0) return "마이너스 " + sino(-n);
    const unit = (x) => { let s = ""; const t = [["천", 1000], ["백", 100], ["십", 10]]; for (const [u, v] of t) { const d = Math.floor(x / v) % 10; if (d) s += (d === 1 ? "" : SD[d]) + u; } return s + SD[x % 10]; };
    const big = [["조", 1e12], ["억", 1e8], ["만", 1e4]]; let s = "", r = n;
    for (const [u, v] of big) { const q = Math.floor(r / v); if (q) { s += (q === 1 && u === "만" ? "" : unit(q)) + u + " "; r -= q * v; } }
    if (r) s += unit(r);
    return s.trim();
  }
  const NT = ["", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"], NC = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];
  const NTEN = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"], NTENC = ["", "열", "스무", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"];
  /* số thuần Hàn 1–99. withCounter = true: dạng đứng trước đơn vị (한, 두, 세, 네, 스무) */
  function native(n, withCounter) {
    if (n < 1 || n > 99) return sino(n);
    const t = Math.floor(n / 10), o = n % 10;
    if (o === 0) return withCounter ? NTENC[t] : NTEN[t];
    return (NTEN[t] || "") + (withCounter ? NC[o] : NT[o]);
  }

  /* ---------- độ giống nhau giữa hai câu (chấm nói) ---------- */
  const norm = s => String(s || "").normalize("NFC").replace(/[^가-힣a-zA-Z0-9]/g, "");
  const jamo = s => [...norm(s)].map(c => isH(c) ? (() => { const d = dec(c); return d.l + d.v + (d.t || ""); })() : c).join("");
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }
  /* tỉ lệ 0..1, so ở mức jamo để lỗi một nét (받침, nguyên âm gần nhau) không bị trừ nặng như sai cả chữ */
  function sim(a, b) { const x = jamo(a), y = jamo(b); if (!x.length && !y.length) return 1; return Math.max(0, 1 - lev(x, y) / Math.max(x.length, y.length)); }

  root.KR = { isH, dec, enc, hasFinal, rom, conj, FORMS, sino, native, sim, norm, guess, lev };
  if (typeof module !== "undefined") module.exports = root.KR;
})(typeof window !== "undefined" ? window : globalThis);
