#!/usr/bin/env python3
"""Crea un logo pixel de reserva (dos letras sobre un color) para cada app que no tenga logo en data/meta.json.
Uso:  python3 tools/logos-letras.py      (desde la carpeta principal)
Los archivos quedan en logos/<nombre>.svg. La página los usa SOLO si el logo oficial no carga.
No toca los que ya existen."""
import json, re, unicodedata, os, colorsys, hashlib
F = {  # letras 3x5
"A":"010 101 111 101 101","B":"110 101 110 101 110","C":"011 100 100 100 011","D":"110 101 101 101 110","E":"111 100 110 100 111",
"F":"111 100 110 100 100","G":"011 100 101 101 011","H":"101 101 111 101 101","I":"111 010 010 010 111","J":"001 001 001 101 010",
"K":"101 101 110 101 101","L":"100 100 100 100 111","M":"101 111 111 101 101","N":"110 101 101 101 101","O":"010 101 101 101 010",
"P":"110 101 110 100 100","Q":"010 101 101 110 011","R":"110 101 110 101 101","S":"011 100 010 001 110","T":"111 010 010 010 010",
"U":"101 101 101 101 111","V":"101 101 101 101 010","W":"101 101 111 111 101","X":"101 101 010 101 101","Y":"101 101 010 010 010","Z":"111 001 010 100 111"}
def slug(s):
    s = unicodedata.normalize("NFD", s.lower()); s = re.sub(r"[̀-ͯ]", "", s)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
def initials(name):
    words = [w for w in re.split(r"[^A-Za-z0-9]+", name) if w]
    parts = []
    for w in words:                                  # NewPipe -> New, Pipe · KDE se queda entera
        parts += re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", w).split()
    L = [re.sub(r"[^A-Za-z]", "", p)[:1].upper() for p in parts]
    L = [x for x in L if x]
    if len(L) >= 2: return L[0] + L[1]
    letters = re.sub(r"[^A-Za-z]", "", name).upper()
    return (letters + "X")[:2]
def rect_path(cells, color):
    d = "".join(f"M{x} {y}h1v1h-1z" for x, y in cells)
    return f'<path fill="{color}" d="{d}"/>'
def hexc(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h, l, s); return "#%02x%02x%02x" % (round(r*255), round(g*255), round(b*255))
def make(name):
    hue = int(hashlib.md5(name.encode()).hexdigest()[:4], 16) % 360 / 360
    bg, dark, text = hexc(hue, .55, .62), hexc(hue, .5, .36), "#ffffff"
    t = initials(name); cells = []; shad = []
    for i, ch in enumerate(t):
        rows = F[ch].split()
        for y, row in enumerate(rows):
            for x, c in enumerate(row):
                if c == "1":
                    cells.append((3 + i*4 + x, 4 + y)); shad.append((3 + i*4 + x, 5 + y))
    tile = [(x, 0) for x in range(1, 12)] + [(x, 12) for x in range(1, 12)] + [(x, y) for y in range(1, 12) for x in range(13)]
    hl = [(x, 0) for x in range(1, 12)] + [(0, 1)]
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 13 13" shape-rendering="crispEdges">'
            + rect_path(tile, bg) + '<path fill="#fff" fill-opacity=".22" d="' + "".join(f"M{x} {y}h1v1h-1z" for x, y in hl) + '"/>'
            + rect_path([c for c in shad if c not in cells], dark) + rect_path(cells, text) + "</svg>")
meta = json.load(open("data/meta.json", encoding="utf-8")); apps = json.load(open("apps.json", encoding="utf-8"))
os.makedirs("logos", exist_ok=True); n = 0
for c in apps["categories"]:
    for a in c["apps"]:
        s = slug(a["name"]); f = f"logos/{s}.svg"
        if s in meta["logos"] or os.path.exists(f): continue
        open(f, "w", encoding="utf-8").write(make(a["name"])); n += 1
print("Logos de letras creados:", n)
