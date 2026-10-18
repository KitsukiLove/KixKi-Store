#!/usr/bin/env python3
"""Construye xp.css (v2 Lila) a partir de xp.src.css. Uso: build2.py <src.css> <out.css>"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B
import menuicons as MI
S = dict(B.S)
for k, v in MI.M.items():
    S["mi_" + k] = v
if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    css = open(src, encoding="utf-8").read()
    missing = []
    def rep(m):
        k = m.group(1)
        if k not in S:
            missing.append(k); return m.group(0)
        return B.enc(S[k])
    maps_ = "\n".join(f'.di[data-id="{c}"],.tk[data-id="{c}"],.tab[href="#{c}"],.cat#{c}{{--xpi:var(--xpi-{c})}}' for c in B.CATS)
    css = css.replace("/*@@ICON_MAP@@*/", maps_)
    css = re.sub(r"@@([a-z_]+)@@", rep, css)
    open(out, "w", encoding="utf-8").write(css)
    print("ok", len(css), "bytes", "faltan:" + ",".join(missing) if missing else "")
