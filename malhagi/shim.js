/* Lớp tương thích: cung cấp window.SE cho app.js (dùng KR, YsTTS và khoá lưu trữ của Super Yeolsim) */
(function(){
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
  const put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  let tm;
  const toast=m=>{if(!m)return;let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1d2a2a;color:#fff;padding:10px 16px;border-radius:12px;z-index:200;max-width:90vw;font-size:14px';document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(tm);tm=setTimeout(()=>t.hidden=true,3500)};
  const store=name=>{const k='yeolsim:'+name;let o={};try{o=JSON.parse(get(k)||'{}')}catch(e){}return{get:x=>o[x],set:(x,v)=>{o[x]=v;put(k,JSON.stringify(o))}}};
  const fx=(ok,el)=>{try{(el||document.body).animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:350})}catch(e){}};
  const speak=t=>{if(window.YsTTS&&!YsTTS.speak(String(t).replace(/\([^)]*\)/g,''),.9))toast('Trình duyệt chưa hỗ trợ đọc tiếng Hàn.')};
  window.SE={esc,get,put,toast,store,fx,speak};
})();
