#!/usr/bin/env python3
"""Giai đoạn 2: gắn âm Hán Việt + chia 6 cấp + xuất các lô cần dịch nghĩa"""
import json, re, collections
rows = json.load(open('stage1.json', encoding='utf8'))
hvc = json.load(open('hv_chars.json', encoding='utf8')); hvw = json.load(open('hv_words.json', encoding='utf8'))
MAN = dict(zip('亦雰瞬昨靑綜販但踊坪棄較妊槪衡徙甁輛秒購椅摯魅悚弘汽貸菜褐撥飯縮睡髥蒐喊惹痲襪街旣肖迅醋猖脂肪濯靴煎饅',
 'diệc phân thuấn tạc thanh tổng phán đãn dũng bình khí giảo nhâm khái hành tỉ bình lượng miểu cấu ỷ chí mị tủng hoằng khí thải thái hạt bát phạn súc thụy nhiêm sưu hám nhạ ma miệt nhai ký tiếu tấn thố xương chi phương trạc ngoa tiễn man'.split()))
MAN.update({'週': 'chu', '媤': 'ti', '學': 'học'})
import unicodedata
_OA = {'ó':'o','ò':'o','ỏ':'o','õ':'o','ọ':'o'}
def _syl(x):
    """Đổi dấu kiểu cũ -> mới cho vần oa/oe/uy mở (hoá->hóa, thuỷ->thủy)"""
    m = re.fullmatch(r'(.*?)(o|u)([áàảãạ]|[éèẻẽẹ]|[ýỳỷỹỵ])', x)
    if m and ((m.group(2) == 'o' and m.group(3) in 'áàảãạéèẻẽẹ') or (m.group(2) == 'u' and m.group(3) in 'ýỳỷỹỵ')):
        pre, v, t = m.groups(); base = {'á':'a','à':'a','ả':'a','ã':'a','ạ':'a','é':'e','è':'e','ẻ':'e','ẽ':'e','ẹ':'e','ý':'y','ỳ':'y','ỷ':'y','ỹ':'y','ỵ':'y'}[t]
        tone = {'á':'\u0301','à':'\u0300','ả':'\u0309','ã':'\u0303','ạ':'\u0323','é':'\u0301','è':'\u0300','ẻ':'\u0309','ẽ':'\u0303','ẹ':'\u0323','ý':'\u0301','ỳ':'\u0300','ỷ':'\u0309','ỹ':'\u0303','ỵ':'\u0323'}[t]
        if pre.lower() in ('q',) : return x
        return unicodedata.normalize('NFC', pre + unicodedata.normalize('NFC', v + tone) + base)
    return x
SYL = {'kí':'ký','kì':'kỳ','kĩ':'kỹ','kỉ':'kỷ','lí':'lý','lì':'lỳ','quí':'quý','mĩ':'mỹ'}
def norm(s):
    return ' '.join(SYL.get(x, _syl(x)) for x in s.split())
def hv(h):
    if not h: return ''
    if h in hvw and len(h.split()) == 1 and len(hvw[h].split()) == len(h): return norm(hvw[h])
    out = []
    for c in h:
        r = MAN.get(c) or hvc.get(c)
        if not r: return ''
        out.append(r)
    return norm(' '.join(out))
POS = {'명':'danh từ','동':'động từ','형':'tính từ','부':'phó từ','관':'định từ','대':'đại từ','수':'số từ','의':'danh từ phụ thuộc','감':'thán từ','보':'trợ từ vị ngữ','불':'phân tích bất năng','고':'danh từ riêng'}
by = collections.defaultdict(list)
for r in rows: by[r['gr']].append(r)
LV = {'A': ('k1', 'k2'), 'B': ('k3', 'k4'), 'C': ('k5', 'k6')}
for g, lst in by.items():
    lst.sort(key=lambda r: r['rank']); cut = round(len(lst) * .45)
    for i, r in enumerate(lst): r['lv'] = LV[g][0 if i < cut else 1]
for r in rows:
    r['hv'] = hv(r['hj']); r['posvi'] = POS.get(r['pos'], r['pos'])
rows.sort(key=lambda r: (r['lv'], r['rank']))
for i, r in enumerate(rows): r['id'] = i + 1
json.dump(rows, open('stage2.json', 'w', encoding='utf8'), ensure_ascii=False)
print(collections.Counter(r['lv'] for r in rows)); print('có hán tự:', sum(1 for r in rows if r['hj']), ' có HV:', sum(1 for r in rows if r['hv']))
import os; os.makedirs('batches', exist_ok=True)
N = 400
for b in range(0, len(rows), N):
    with open(f'batches/in_{b//N+1:02d}.txt', 'w', encoding='utf8') as f:
        for r in rows[b:b+N]:
            hint = (r['hj'] + ' ' + r['hv']).strip()
            f.write(f"{r['id']}|{r['ko']}|{r['posvi'][:4]}|{hint}|{r['en'][:38]}\n")
print(len(rows) // N + 1, 'lô')
