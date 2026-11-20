#!/usr/bin/env python3
"""lessons.txt -> data.js (window.SE_NOI)"""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))
stages = []; cur = None; les = None
for ln, line in enumerate(open(os.path.join(D, 'lessons.txt'), encoding='utf8'), 1):
    line = line.rstrip()
    if not line.strip(): continue
    m = re.match(r'^@(\w+)\s+(.*)$', line)
    if not m: raise SystemExit(f'dòng {ln} lỗi')
    k, v = m.group(1), m.group(2)
    if k == 'stage':
        a = [x.strip() for x in v.split('|')]
        cur = {'id': a[0], 'n': a[1], 't': a[2], 'lv': a[3], 'goal': a[4], 'lessons': []}; stages.append(cur)
    elif k == 'l':
        a = [x.strip() for x in v.split('|')]
        les = {'id': a[0], 't': a[1], 'vi': a[2], 'goal': a[3], 'ph': [], 'dl': [], 'tip': '', 'ai': {}}; cur['lessons'].append(les)
    elif k == 'ph': les['ph'].append([x.strip() for x in v.split(' | ', 1)])
    elif k == 'dl': a = [x.strip() for x in v.split(' | ', 2)]; les['dl'].append(a)
    elif k == 'tip': les['tip'] = v
    elif k == 'ai':
        a = [x.strip() for x in v.split(' | ')]
        les['ai'] = {'role': a[0], 'open': a[1], 'targets': [t.strip() for t in a[2].split(';')], 'goal': a[3]}
    else: raise SystemExit(f'thẻ lạ {k}')
for s in stages:
    for l in s['lessons']:
        assert len(l['ph']) == 6 and len(l['dl']) == 4 and l['ai'] and l['tip'], l['id']
open(os.path.join(os.path.dirname(D), 'data.js'), 'w', encoding='utf8').write('window.SE_NOI=' + json.dumps(stages, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(stages), 'chặng,', sum(len(s['lessons']) for s in stages), 'bài')
