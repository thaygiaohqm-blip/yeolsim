/* Giọng đọc chung cho cả bốn ứng dụng: tiếng Hàn chuẩn Seoul, ưu tiên giọng nữ.
   Trình duyệt tự có sẵn các giọng này tùy thiết bị, nên module chọn giọng Hàn tốt nhất đang có theo thứ tự ưu tiên. */
(function () {
  if (window.YsTTS) return;
  const ok = "speechSynthesis" in window;
  const FEMALE = [
    /sunhi|sun-hi|선히/i,       /* Microsoft SunHi Online (Natural), Edge và Windows 11 */
    /yuna|유나/i,               /* iPhone, iPad, Mac */
    /google.*(한국어|korean)|(한국어|korean).*google/i,  /* Chrome, Android */
    /heami|혜미/i, /sora|소라/i, /jiyeon|지연/i, /seoyeon|서연/i, /narae|나래/i, /jinhee|진희/i
  ];
  const MALE = /injoon|in-joon|hyunsu|bongjin|gookmin|male(?!\w)|남/i;
  let voice = null, checked = false;
  function pick() {
    if (!ok) return;
    const vs = speechSynthesis.getVoices().filter(v => /^ko([-_]|$)/i.test(v.lang) || /korea|한국/i.test(v.name));
    if (!vs.length) return;
    checked = true;
    const fine = vs.filter(v => !MALE.test(v.name)), pool = fine.length ? fine : vs;
    let best = null;
    for (const re of FEMALE) { const hit = pool.filter(v => re.test(v.name)); if (hit.length) { best = hit[0]; break; } }
    voice = best || pool.find(v => /^ko[-_]KR/i.test(v.lang)) || pool[0];
  }
  if (ok) { pick(); speechSynthesis.addEventListener("voiceschanged", pick); }
  function utter(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    if (voice) u.voice = voice;
    u.rate = rate || 0.9;
    return u;
  }
  window.YsTTS = {
    supported: ok,
    hasVoice: () => !ok || !checked || !!voice,
    voiceName: () => voice ? voice.name : "",
    utter,
    speak(text, rate) {
      if (!ok || !text) return false;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter(text, rate));
      return true;
    }
  };
})();
