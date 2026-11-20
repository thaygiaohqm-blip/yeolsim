#!/usr/bin/env python3
"""Giai đoạn 3: ghép stage2.json + out/NN.txt + 250 từ tuyển chọn (tools/src) -> data/words.js"""
import glob, json, os, re, collections
H = os.path.dirname(os.path.abspath(__file__)); T = os.path.dirname(H); D = os.path.join(os.path.dirname(T), 'data')
rows = json.load(open(os.path.join(H, 'stage2.json'), encoding='utf8'))
vi = {}
for f in sorted(glob.glob(os.path.join(H, 'out', '[0-9][0-9].txt'))):
    for l in open(f, encoding='utf8'):
        l = l.rstrip('\n')
        if l.strip(): i, _, v = l.partition('|'); vi[int(i)] = v.strip()
miss = [r['id'] for r in rows if r['id'] not in vi]
assert not miss, f'thiếu nghĩa: {miss[:10]}'
POS = {'명': 'danh từ', '동': 'động từ', '형': 'tính từ', '부': 'phó từ', '관': 'định từ', '대': 'đại từ', '수': 'số từ', '의': 'danh từ phụ thuộc', '감': 'thán từ', '보': 'trợ động từ', '불': 'từ rút gọn', '고': 'danh từ riêng'}
cur = []
for f in sorted(glob.glob(os.path.join(T, 'src', 'k*.txt'))):
    lv = t = None
    for line in open(f, encoding='utf8'):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('@lv'): lv = line.split()[1]; continue
        if line.startswith('@t'): t = line[2:].strip(); continue
        a = [x.strip() for x in line.split('|')]
        cur.append(dict(lv=lv, t=t, ko=a[0], pos=a[1], hj=a[2], hv=a[3], vi=a[4], ex=a[5], exvi=a[6]))
for n, c in enumerate(cur): c['old'] = None
# id cũ (k1-001...) theo thứ tự trong src
cnt = collections.Counter(); old = []
for c in cur:
    cnt[c['lv']] += 1; c['old'] = f"{c['lv']}-{cnt['k'+c['lv'][-1]] if False else 0}"
cnt = collections.Counter(); n = 0
for c in cur:
    n += 1; c['old'] = f"{c['lv']}-{n:03d}"
byko = collections.defaultdict(list)
for r in rows: byko[r['ko']].append(r)
used = set(); OLD = {}
out = []
for r in rows:
    w = dict(id='w%05d' % r['id'], lv=r['lv'], ko=r['ko'], pos=POS.get(r['pos'], r['pos']), hj=r['hj'], hv=r['hv'], vi=vi[r['id']], ex='', exvi='', t='', r=r['rank'] if r['rank'] < 100000 else 0)
    out.append(w)
for c in cur:
    cand = [r for r in byko.get(c['ko'], []) if r['id'] not in used]
    if cand:
        r = cand[0]; used.add(r['id']); w = out[r['id'] - 1]
        w.update(pos=c['pos'], hj=c['hj'] or w['hj'], hv=c['hv'] or w['hv'], vi=c['vi'], ex=c['ex'], exvi=c['exvi'], t=c['t'])
        OLD[c['old']] = w['id']
    else:
        w = dict(id='x%03d' % (len(OLD) + 1), lv=c['lv'], ko=c['ko'], pos=c['pos'], hj=c['hj'], hv=c['hv'], vi=c['vi'], ex=c['ex'], exvi=c['exvi'], t=c['t'], r=0)
        w['id'] = 'x%03d' % (len([1 for k in OLD.values() if k.startswith('x')]) + 1); OLD[c['old']] = w['id']; out.append(w)
F = ['id', 'lv', 'ko', 'pos', 'hj', 'hv', 'vi', 'ex', 'exvi', 't', 'r']
js = 'window.WF=' + json.dumps(F) + ';window.WORDS=' + json.dumps([[w[k] for k in F] for w in out], ensure_ascii=False, separators=(',', ':')) + ';window.WOLD=' + json.dumps(OLD, separators=(',', ':')) + ';\n'
open(os.path.join(D, 'words.js'), 'w', encoding='utf8').write(js)
print(len(out), 'từ;', sum(1 for w in out if w['hj']), 'có hán tự;', sum(1 for w in out if w['hv']), 'có HV;', sum(1 for w in out if w['ex']), 'có ví dụ;', len(js) // 1024, 'KB')
print(collections.Counter(w['lv'] for w in out))
