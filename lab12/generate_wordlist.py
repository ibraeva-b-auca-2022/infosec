#!/usr/bin/env python3
import sys
import itertools
import re

def leet_variants(s):
    subs = {'a':'4','A':'4','o':'0','O':'0','i':'1','I':'1','e':'3','E':'3','s':'5','S':'5','t':'7','T':'7'}
    variants = {s, s.lower(), s.upper(), s.capitalize()}
    # simple one-char leet combos
    for i,ch in enumerate(s):
        if ch in subs:
            v = s[:i] + subs[ch] + s[i+1:]
            variants.add(v)
            variants.add(v.lower())
    return variants

def load_info(path):
    data = {}
    with open(path, encoding='utf-8') as f:
        for line in f:
            line=line.strip()
            if not line or line.startswith('#'): continue
            if ':' in line:
                k,v = line.split(':',1)
                data.setdefault(k.strip().lower(), []).append(v.strip())
            else:
                # treat as generic word
                data.setdefault('words', []).append(line)
    return data

def gen_dates(dob):
    # dob formats: YYYY-MM-DD or DD.MM.YYYY etc.
    m = re.match(r'(\d{4})[^\d]?(\d{2})[^\d]?(\d{2})', dob)
    if not m:
        return []
    Y, M, D = m.group(1), m.group(2), m.group(3)
    yy = Y[2:]
    return [Y, yy, D+M+Y, D+M+yy, D+M, M+Y, D+M]

def main():
    if len(sys.argv) < 2:
        print("Usage: gen_wordlist.py info.txt > wordlist.txt", file=sys.stderr)
        sys.exit(1)
    info = load_info(sys.argv[1])
    pool = []

    # collect base tokens
    for key, vals in info.items():
        if key == 'dob':
            for v in vals:
                pool += gen_dates(v)
        else:
            pool += vals

    pool = list(dict.fromkeys(pool))  # dedupe, keep order

    # generate single tokens + variations
    tokens = set()
    for p in pool:
        tokens.add(p)
        tokens.update(leet_variants(p))
        tokens.add(p + "123")
        tokens.add(p + "!" )
        tokens.add(p + "@123")
        tokens.add(p + "2020")
        tokens.add(p + "2021")
        # initials
        tokens.add(''.join([word[0] for word in p.split() if word]))

    # generate pairwise combinations and triple combos
    out = set(tokens)
    items = list(tokens)
    for a,b in itertools.permutations(items,2):
        if len(a) + len(b) > 32: continue
        out.add(a + b)
        out.add(a + "." + b)
        out.add(a + "_" + b)
        out.add(a + "-" + b)
    for a,b,c in itertools.permutations(items,3):
        if len(a)+len(b)+len(c) > 32: continue
        out.add(a + b + c)

    # filter some weak ones and print
    filtered = sorted([w for w in out if len(w) >= 4 and len(w) <= 32])
    for w in filtered:
        print(w)

if __name__ == "__main__":
    main()

