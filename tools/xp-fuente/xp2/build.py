#!/usr/bin/env python3
"""Construye xp.css a partir de xp.src.css sustituyendo @@nombre@@ por url("data:image/svg+xml,...").
Uso: build.py <src.css> <out.css>"""
import re, sys
from urllib.parse import quote

def enc(svg: str) -> str:
    svg = re.sub(r">\s+<", "><", svg.strip())
    svg = re.sub(r"\s+", " ", svg)
    # solo se codifica lo imprescindible para que quede legible dentro del CSS
    out = quote(svg, safe=" /:=,;.-_()'!*@[]")
    out = out.replace(" ", "%20")
    return 'url("data:image/svg+xml,' + out + '")'

S = {}
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import icons as _icons
import scenery as _scenery
for _k, _v in _icons.I.items():
    S["ic_" + _k] = _v
S.update(_scenery.S)
CATS = ["tiendas","importante","control","utilidad","pantalla","privacidad","fotos","internet","dia","emulacion","decoracion","musica","teclados","favs","news","packs"]


# ---------------------------------------------------------------- fondos de escritorio
def stars(n, seed):
    import random
    r = random.Random(seed)
    s = ""
    for _ in range(n):
        x, y = r.randint(10, 1590), r.randint(10, 520)
        rad = r.choice([.8, 1, 1, 1.3, 1.8])
        o = r.choice([.5, .7, .9])
        s += f"<circle cx='{x}' cy='{y}' r='{rad}' fill='#fff' opacity='{o}'/>"
    return s

S["wall_day"] = """
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
<defs>
<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'>
 <stop offset='0' stop-color='#0f4fd0'/><stop offset='.30' stop-color='#2f7fe9'/><stop offset='.55' stop-color='#6fb0f6'/><stop offset='.72' stop-color='#bfe0fb'/><stop offset='.80' stop-color='#e6f4fe'/></linearGradient>
<linearGradient id='h' x1='0' y1='0' x2='.25' y2='1'>
 <stop offset='0' stop-color='#b4ec54'/><stop offset='.22' stop-color='#7cc92f'/><stop offset='.6' stop-color='#4a9d1b'/><stop offset='1' stop-color='#235f0d'/></linearGradient>
<linearGradient id='h2' x1='0' y1='0' x2='0' y2='1'>
 <stop offset='0' stop-color='#6fbf2c'/><stop offset='1' stop-color='#2f7b14'/></linearGradient>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='0'>
 <stop offset='0' stop-color='#f4ffc0' stop-opacity='.55'/><stop offset='.6' stop-color='#f4ffc0' stop-opacity='0'/></linearGradient>
<filter id='b' x='-30%' y='-80%' width='160%' height='260%'><feGaussianBlur stdDeviation='15'/></filter>
<filter id='b2' x='-30%' y='-80%' width='160%' height='260%'><feGaussianBlur stdDeviation='7'/></filter>
</defs>
<rect width='1600' height='900' fill='url(#s)'/>
<g fill='#fff' filter='url(#b)' opacity='.95'>
 <ellipse cx='260' cy='210' rx='230' ry='46'/><ellipse cx='420' cy='180' rx='170' ry='42'/><ellipse cx='150' cy='250' rx='170' ry='34'/>
 <ellipse cx='980' cy='140' rx='260' ry='40'/><ellipse cx='1180' cy='170' rx='190' ry='36'/><ellipse cx='820' cy='185' rx='150' ry='30'/>
 <ellipse cx='1450' cy='300' rx='210' ry='38'/><ellipse cx='700' cy='400' rx='320' ry='34'/><ellipse cx='1250' cy='430' rx='280' ry='30'/>
 <ellipse cx='320' cy='440' rx='260' ry='30'/>
</g>
<g fill='#fff' filter='url(#b2)' opacity='.8'>
 <ellipse cx='340' cy='200' rx='120' ry='20'/><ellipse cx='1020' cy='132' rx='150' ry='16'/><ellipse cx='1420' cy='296' rx='120' ry='16'/>
</g>
<path d='M0 600 C 200 520 480 470 760 490 C 1060 512 1320 600 1600 580 L1600 900 L0 900Z' fill='url(#h2)' opacity='.55'/>
<path d='M-20 640 C 220 540 560 480 900 540 C 1180 590 1420 650 1620 630 L1620 900 L-20 900Z' fill='url(#h)'/>
<path d='M-20 640 C 220 540 560 480 900 540 C 1180 590 1420 650 1620 630 L1620 700 C 1400 700 1180 640 900 592 C 560 534 220 590 -20 700Z' fill='url(#g)'/>
</svg>"""

S["wall_night"] = f"""
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
<defs>
<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'>
 <stop offset='0' stop-color='#020618'/><stop offset='.45' stop-color='#0a1a4f'/><stop offset='.72' stop-color='#1f3f94'/><stop offset='.82' stop-color='#3a62b8'/></linearGradient>
<linearGradient id='h' x1='0' y1='0' x2='.25' y2='1'>
 <stop offset='0' stop-color='#2d6a2c'/><stop offset='.3' stop-color='#1c4d1d'/><stop offset='1' stop-color='#0a2410'/></linearGradient>
<radialGradient id='m' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#fffbe0' stop-opacity='.9'/><stop offset='.35' stop-color='#cfe0ff' stop-opacity='.25'/><stop offset='1' stop-color='#cfe0ff' stop-opacity='0'/></radialGradient>
<filter id='b' x='-30%' y='-80%' width='160%' height='260%'><feGaussianBlur stdDeviation='16'/></filter>
</defs>
<rect width='1600' height='900' fill='url(#s)'/>
{stars(150, 7)}
<circle cx='1240' cy='170' r='150' fill='url(#m)'/><circle cx='1240' cy='170' r='40' fill='#fffbe6'/><circle cx='1255' cy='162' r='36' fill='#0e1f5c' opacity='.0'/>
<g fill='#5b78c0' filter='url(#b)' opacity='.35'><ellipse cx='400' cy='430' rx='300' ry='26'/><ellipse cx='1000' cy='470' rx='340' ry='24'/></g>
<path d='M-20 640 C 220 540 560 480 900 540 C 1180 590 1420 650 1620 630 L1620 900 L-20 900Z' fill='url(#h)'/>
</svg>"""

# ---------------------------------------------------------------- botones de la barra de titulo (para ::before del hero)
def caps(a, b, c, d, xa="#cc4600", xb="#dc5c2c", xc="#e27b4e", xd="#ffccb2"):
    return f"""
<svg xmlns='http://www.w3.org/2000/svg' width='67' height='21' viewBox='0 0 67 21'>
<defs>
<radialGradient id='n' cx='.9' cy='.9' r='1.15'><stop offset='0' stop-color='{a}'/><stop offset='.55' stop-color='{b}'/><stop offset='.7' stop-color='{c}'/><stop offset='1' stop-color='{d}'/></radialGradient>
<radialGradient id='x' cx='.9' cy='.9' r='1.15'><stop offset='0' stop-color='{xa}'/><stop offset='.55' stop-color='{xb}'/><stop offset='.7' stop-color='{xc}'/><stop offset='1' stop-color='{xd}'/></radialGradient>
</defs>
<rect x='.5' y='.5' width='20' height='20' rx='3.5' fill='url(#n)' stroke='#fff'/>
<rect x='23.5' y='.5' width='20' height='20' rx='3.5' fill='url(#n)' stroke='#fff'/>
<rect x='46.5' y='.5' width='20' height='20' rx='3.5' fill='url(#x)' stroke='#fff'/>
<rect x='5' y='13' width='8' height='3' fill='#fff'/>
<rect x='28' y='5' width='11' height='11' fill='none' stroke='#fff' stroke-width='1.4'/><rect x='28' y='5' width='11' height='3' fill='#fff'/>
<path d='M51.5 6l9 9M60.5 6l-9 9' stroke='#fff' stroke-width='2.2' stroke-linecap='square'/>
</svg>"""

S["caps_blue"]   = caps("#0054e9", "#2263d5", "#4479e4", "#a3bbec")
S["caps_olive"]  = caps("#6b7f2a", "#8a9f48", "#a2b564", "#d3dcae")
S["caps_silver"] = caps("#6a6a8c", "#8d8dab", "#a9a9c4", "#dcdce8")
S["caps_noir"]   = caps("#101010", "#2a2e3a", "#3f4656", "#8d97ad")
S["caps_zune"]   = caps("#101010", "#2a2a2a", "#454545", "#a0a0a0", "#d85a00", "#ee7a1e", "#f59a4c", "#ffd0a8")

# ---------------------------------------------------------------- flechas de las barras de desplazamiento (blancas, el fondo lo pone el CSS)
def arrow(d):
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='17' height='17' viewBox='0 0 17 17'><path d='{d}' fill='%23fff' stroke='%23314b8c' stroke-width='.5' stroke-opacity='.55'/></svg>"
S["ar_up"]    = arrow("M4.5 10.5 L8.5 6 L12.5 10.5 L11 11.5 L8.5 8.8 L6 11.5Z")
S["ar_down"]  = arrow("M4.5 6.5 L8.5 11 L12.5 6.5 L11 5.5 L8.5 8.2 L6 5.5Z")
S["ar_left"]  = arrow("M10.5 4.5 L6 8.5 L10.5 12.5 L11.5 11 L8.8 8.5 L11.5 6Z")
S["ar_right"] = arrow("M6.5 4.5 L11 8.5 L6.5 12.5 L5.5 11 L8.2 8.5 L5.5 6Z")

# rayitas de agarre del pulgar
S["grip_v"] = "<svg xmlns='http://www.w3.org/2000/svg' width='9' height='7' viewBox='0 0 9 7'><path d='M0 .5h9M0 3.5h9M0 6.5h9' stroke='%23fff' stroke-opacity='.85'/><path d='M0 1.5h9M0 4.5h9' stroke='%232a4fa8' stroke-opacity='.35'/></svg>"
S["grip_h"] = "<svg xmlns='http://www.w3.org/2000/svg' width='7' height='9' viewBox='0 0 7 9'><path d='M.5 0v9M3.5 0v9M6.5 0v9' stroke='%23fff' stroke-opacity='.85'/><path d='M1.5 0v9M4.5 0v9' stroke='%232a4fa8' stroke-opacity='.35'/></svg>"

# ---------------------------------------------------------------- cursores (flecha blanca con borde negro y la manita)
S["cur_arrow"] = """<svg xmlns='http://www.w3.org/2000/svg' width='20' height='28' viewBox='0 0 20 28'>
<path d='M1.5 1.5 L1.5 21.5 L6.2 17.2 L9.6 25 L13 23.6 L9.7 16 L16.2 15.9Z' fill='#fff' stroke='#000' stroke-width='1.3' stroke-linejoin='round'/></svg>"""
S["cur_hand"] = """<svg xmlns='http://www.w3.org/2000/svg' width='24' height='26' viewBox='0 0 24 26'>
<path d='M8.5 1.5c1.2 0 2 .8 2 2v7.2c.4-.5 1-.8 1.700-.8 1 0 1.600.5 1.900 1.200.4-.5 1-.8 1.700-.8 1.100 0 1.800.7 2 1.500.4-.4 1-.6 1.600-.6 1.300 0 2.100 1 2.100 2.300v5.300c0 3.200-2.200 6-5.300 6h-3.300c-2 0-3.300-.8-4.400-2.100L3.500 16.300c-.700-.9-.5-1.900.3-2.400.8-.5 1.700-.3 2.300.3L6.600 15V3.500c0-1.200.8-2 1.900-2Z' fill='#fff' stroke='#000' stroke-width='1.300' stroke-linejoin='round'/>
<path d='M10.500 11v4.500M13.700 11.800v3.700M16.900 12.800v2.700' stroke='#000' stroke-width='1' stroke-linecap='round'/></svg>"""

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    css = open(src, encoding="utf-8").read()
    missing = []
    def rep(m):
        k = m.group(1)
        if k not in S:
            missing.append(k); return m.group(0)
        return enc(S[k])
    vars_ = "".join(f"--xpi-{k}:@@ic_{k}@@;" for k in _icons.I)
    maps_ = "\n".join(f'.di[data-id="{c}"],.tk[data-id="{c}"],.tab[href="#{c}"],.cat#{c}{{--xpi:var(--xpi-{c})}}' for c in CATS)
    css = css.replace("/*@@ICON_VARS@@*/", ":root{" + vars_ + "}").replace("/*@@ICON_MAP@@*/", maps_)
    css = re.sub(r"@@([a-z_]+)@@", rep, css)
    open(out, "w", encoding="utf-8").write(css)
    print("ok", len(css), "bytes", "faltan:" + ",".join(missing) if missing else "")
