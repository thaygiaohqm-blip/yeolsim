#!/usr/bin/env python3
"""Biên dịch source/gram/*.txt -> data/gram-<cấp>.js (tô mẫu bằng {}, tạo bài sắp xếp câu, bài điền chỗ trống)."""
import re, json, os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source', 'gram'); OUT = os.path.join(ROOT, 'data')
report = []
def plain(s): return s.replace('{', '').replace('}', '')
def norm_pat(t): return re.sub(r'[^가-힣A-Za-z0-9]', '', plain(t))
def parse(path):
    lvl = None; groups = {}; pats = []; cur = None; sense = None
    for ln, line in enumerate(open(path, encoding='utf8').read().split('\n'), 1):
        line = line.rstrip()
        if not line.strip(): continue
        m = re.match(r'^@(\w+)\s*(.*)$', line)
        if not m: raise SystemExit(f'{path}:{ln}: dòng không hợp lệ: {line[:40]}')
        k, v = m.group(1), m.group(2).strip()
        if k == 'level': lvl = v
        elif k == 'group' and (cur is None or '|' in v):
            a = [x.strip() for x in v.split('|')]
            groups[int(a[0])] = {'n': int(a[0]), 'ko': a[1], 'vi': a[2], 'desc': a[3] if len(a) > 3 else ''}
        elif k == 'p':
            a = [x.strip() for x in v.split('|')]
            cur = {'id': a[0], 'pat': a[1], 'form': [], 'exp': [], 'senses': [], 'cmp': [], 'note': [], 'theme': [], 'ctx': [], 'book': [], 'g': None}
            pats.append(cur); sense = None
        elif k == 'group': cur['g'] = int(v)
        elif k in ('mean', 'core'): cur[k] = v
        elif k in ('form', 'exp', 'note'): cur[k].append(v)
        elif k == 'sense':
            a = [x.strip() for x in v.split('|')]
            sense = {'n': int(a[0]), 'label': a[1], 'ex': []}; cur['senses'].append(sense)
        elif k == 'ex':
            if sense is None: sense = {'n': 1, 'label': '', 'ex': []}; cur['senses'].append(sense)
            if ' | ' not in v: raise SystemExit(f'{path}:{ln}: ví dụ thiếu " | "')
            ko, vi = [x.strip() for x in v.split(' | ', 1)]
            sense['ex'].append({'ko': ko, 'vi': vi, 'ln': ln})
        elif k == 'cmp':
            a = [x.strip() for x in v.split(' | ', 2)]
            cur['cmp'].append({'pat': a[0], 'lv': a[1], 'desc': a[2] if len(a) > 2 else ''})
        elif k in ('theme', 'ctx'): cur[k] = [x.strip() for x in v.split(',') if x.strip()]
        elif k == 'book':
            a = [x.strip() for x in v.split('|')]
            cur['book'].append([a[0], a[1], int(a[2]) if len(a) > 2 else 0])
        else: raise SystemExit(f'{path}:{ln}: thẻ lạ @{k}')
    return lvl, groups, pats
def make_sao(ko):
    """4 cụm (eojeol) liên tiếp để xếp lại; phần còn lại là pre/post."""
    ps = plain(ko); w = ps.split(' ')
    if len(w) < 4: return None
    hi = None
    cum = 0
    spans = []
    # vị trí eojeol đầu tiên chứa {}
    for i, t in enumerate(ko.split(' ')):
        if '{' in t or '}' in t or (hi is not None and False): hi = i; break
    best = None
    for s in range(0, len(w) - 3):
        sc = 0
        if hi is not None and s <= hi <= s + 3: sc += 5 - abs((hi - s) - 2)
        if best is None or sc > best[0]: best = (sc, s)
    s = best[1]; ch = w[s:s+4]; pre = ' '.join(w[:s]); post = ' '.join(w[s+4:])
    last = ch[3]; tail = ''
    while last and last[-1] in '.?!,': tail = last[-1] + tail; last = last[:-1]
    ch[3] = last
    if tail: post = (tail + (' ' + post if post else ''))
    if pre: pre += ' '
    return {'pre': pre, 'c': ch, 'post': post}
def build_level(path):
    lvl, groups, pats = parse(path)
    out = []; nohl = 0
    for p in pats:
        pid = f"{lvl}-{p['id']}"
        senses = []
        for s in p['senses']:
            exs = []
            for e in s['ex']:
                ko = e['ko']
                if ko.count('{') != ko.count('}') or '{' not in ko: nohl += 1; report.append(f'[thiếu {{}}] {pid} dòng {e["ln"]}: {ko}')
                ex = {'ko': ko, 'vi': e['vi']}
                hl = re.findall(r'\{([^}]*)\}', ko)
                if len(hl) == 1 and hl[0].strip(): ex['cl'] = hl[0]
                so = make_sao(ko)
                if so: ex['so'] = so
                exs.append(ex)
            senses.append({'n': s['n'], 'label': s['label'], 'ex': exs})
        if not p.get('mean') or not p['senses']: report.append(f'[thiếu mean/ex] {pid}')
        out.append({'id': pid, 'no': p['id'], 'lv': lvl, 'g': p['g'], 'pat': p['pat'], 'mean': p.get('mean', ''), 'core': p.get('core', ''),
                    'form': p['form'], 'exp': p['exp'], 'senses': senses, 'cmp': p['cmp'], 'note': p['note'],
                    'theme': p['theme'], 'ctx': p['ctx'], 'book': p['book'], 'opt': re.sub(r'\s*\([^)]*[A-Za-zà-ỹ][^)]*\)', '', p['pat'].split(' / ')[0].split(' · ')[0]).strip(),
                    'cc': 'V' if p['form'] and p['form'][0].startswith('V') else 'N' if p['form'] and p['form'][0].startswith('N') else 'A' if p['form'] and p['form'][0].startswith('A') else 'X'})
    return {'level': lvl, 'groups': [groups[k] for k in sorted(groups)], 'pats': out, 'tests': [], '_nohl': nohl}
def resolve_cmp(datas):
    allp = [(d['level'], p, {norm_pat(x) for x in re.split(r'[·/]', p['pat'])}) for d in datas for p in d['pats']]
    miss = 0
    for lv, p, _ in allp:
        for c in p['cmp']:
            wants = {norm_pat(x) for x in re.split(r'[·/]', c['pat'])} | {norm_pat(re.sub(r'\(.*?\)$', '', c['pat'].strip()))}
            wants.discard('')
            cand = [(l2, q) for l2, q, al in allp if q['id'] != p['id'] and wants & al]
            if cand:
                pref = [x for x in cand if x[0] == c.get('lv')] or cand
                c['id'] = pref[0][1]['id']
            else: miss += 1; report.append(f'[đối chiếu chưa nối] {p["id"]} {c["pat"]}')
    return miss
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    datas = [build_level(f) for f in sorted(glob.glob(os.path.join(SRC, '*.txt')))]
    print('đối chiếu chưa nối:', resolve_cmp(datas))
    for d in datas:
        nohl = d.pop('_nohl')
        js = 'SB.register(' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ');\n'
        open(os.path.join(OUT, f'gram-{d["level"]}.js'), 'w', encoding='utf8').write(js)
        print(d['level'], len(d['pats']), 'mẫu,', sum(len(s['ex']) for p in d['pats'] for s in p['senses']), 'ví dụ,', nohl, 'thiếu {}')
    open(os.path.join(ROOT, 'tools', 'report.txt'), 'w', encoding='utf8').write('\n'.join(report))
    print(len(report), 'dòng báo cáo')
