#!/usr/bin/env python3
"""Giai đoạn 1: đọc danh sách 한국어 학습용 어휘 목록 (국립국어원, KOGL loại 1) -> stage1.json"""
import json, pickle, re, collections
vi, ko, g = pickle.load(open('/tmp/aux.pkl', 'rb'))
CJK = re.compile(r'^[一-鿿㐀-䶿]+[-~]?$')
rows = []
for line in open('nikl_list.txt', encoding='utf8').read().splitlines()[2:]:
    a = line.split('\t')
    if len(a) < 5 or not a[1].strip(): continue
    rank = int(a[0]) if a[0].strip().isdigit() else 100000 + len(rows)
    w, pos, pul, gr = a[1], a[2], a[3].strip(), a[4].strip()
    base = re.sub(r'\d+$', '', w)
    hj = pul.rstrip('-~') if CJK.match(pul) else ''
    en = ''
    for p, gl in g.get(base, []):
        en = gl[0]; break
    en = re.sub(r'\s*\([^)]*\)', '', en).strip()[:60]
    rows.append(dict(rank=rank, ko=base, raw=w, pos=pos, hj=hj, gr=gr, en=en))
rows.sort(key=lambda r: r['rank'])
json.dump(rows, open('stage1.json', 'w', encoding='utf8'), ensure_ascii=False)
c = collections.Counter(ch for r in rows for ch in r['hj'])
print(len(rows), 'từ;', sum(1 for r in rows if r['hj']), 'có hán tự;', len(c), 'chữ Hán khác nhau;', sum(1 for r in rows if r['en']), 'có gloss tiếng Anh')
miss = [ch for ch in c if ch not in vi]; print('thiếu HV:', len(miss), ''.join(miss)[:80])
print(c.most_common(60))
