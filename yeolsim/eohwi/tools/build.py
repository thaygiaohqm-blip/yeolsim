#!/usr/bin/env python3
"""tools/src/k*.txt -> data/words.js. Dòng: ko|loại|hán tự|Hán Việt|nghĩa|ví dụ|dịch ví dụ"""
import glob, json, os, re, sys
D = os.path.dirname(os.path.abspath(__file__)); out = []; n = 0; bad = []
for f in sorted(glob.glob(os.path.join(D, 'src', 'k*.txt'))):
    lv = t = None
    for ln, line in enumerate(open(f, encoding='utf8'), 1):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('@lv'): lv = line.split()[1]; continue
        if line.startswith('@t'): t = line[2:].strip(); continue
        a = [x.strip() for x in line.split('|')]
        if len(a) != 7: bad.append(f'{os.path.basename(f)}:{ln} có {len(a)} trường'); continue
        ko, pos, hj, hv, vi, ex, exvi = a
        if hj and hv and len(hj) != len(hv.split()): bad.append(f'{os.path.basename(f)}:{ln} {ko}: {len(hj)} hán tự nhưng {len(hv.split())} âm HV (sẽ không tách được từng chữ)')
        n += 1
        out.append({'id': f'{lv}-{n:03d}', 'lv': lv, 't': t, 'ko': ko, 'pos': pos, 'hj': hj, 'hv': hv, 'vi': vi, 'ex': ex, 'exvi': exvi})
open(os.path.join(os.path.dirname(D), 'data', 'words.js'), 'w', encoding='utf8').write('window.WORDS=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(out), 'từ,', sum(1 for w in out if w['hj']), 'có hán tự'); print('\n'.join(bad) or 'không có lỗi')
