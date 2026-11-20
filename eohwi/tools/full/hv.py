#!/usr/bin/env python3
"""Dựng bảng âm Hán Việt: từ en-Wiktionary (mục tiếng Việt) và Unihan. Xuất hv_chars.json, hv_words.json"""
import json, re, pickle, collections
hvc = collections.defaultdict(collections.Counter); hvw = {}; rel = {}
for l in open('/tmp/nikl/vi.jsonl', encoding='utf8'):
    d = json.loads(l); w = d['word']; et = d.get('etymology_text') or ''
    if re.fullmatch(r'[一-鿿]', w):
        for s in d.get('senses', []):
            for r in s.get('related', []):
                if 'han-viet-reading' in r.get('tags', []): rel.setdefault(w, []).append(r['word'].lower())
    if 'Sino-Vietnamese' in et:
        m = re.search(r'from\s+([一-鿿]+)', et)
        if m:
            h = m.group(1); syl = w.lower().split()
            if len(h) == len(syl):
                hvw.setdefault(h, collections.Counter())[w.lower()] += 1
                for c, s in zip(h, syl): hvc[c][s] += 1
fl = pickle.load(open('/tmp/unihan_all.pkl', 'rb'))
def var(ch):
    f = fl.get(ch, {}); out = []
    for k in ('kTraditionalVariant', 'kZVariant', 'kSemanticVariant', 'kSimplifiedVariant', 'kSpecializedSemanticVariant'):
        out += [chr(int(v, 16)) for v in re.findall(r'U\+([0-9A-F]+)', f.get(k, ''))]
    return out
def char_hv(ch, depth=0):
    if ch in hvc: return hvc[ch].most_common(1)[0][0]
    if ch in rel: return rel[ch][0]
    f = fl.get(ch, {})
    if 'kVietnamese' in f: return f['kVietnamese'].split()[0].lower()
    if depth < 2:
        for v in var(ch):
            r = char_hv(v, depth + 1)
            if r: return r
    return None
chars = {}
for ch in set(c for r in json.load(open('stage1.json', encoding='utf8')) for c in r['hj']):
    r = char_hv(ch)
    if r: chars[ch] = r
words = {h: c.most_common(1)[0][0] for h, c in hvw.items()}
json.dump(chars, open('hv_chars.json', 'w', encoding='utf8'), ensure_ascii=False); json.dump(words, open('hv_words.json', 'w', encoding='utf8'), ensure_ascii=False)
rows = json.load(open('stage1.json', encoding='utf8')); used = collections.Counter(c for r in rows for c in r['hj'])
miss = [c for c in used if c not in chars]
print(len(used), 'chữ Hán;', len(chars), 'có âm HV;', len(words), 'từ ghép có sẵn; thiếu:', len(miss), ''.join(miss))
print({c: chars.get(c) for c in '問電食韓酒愛春學行經'})
