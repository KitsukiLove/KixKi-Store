"""Fondo de escritorio mejorado (colina con luz) y capa de pasto que se mece con el viento."""
import random, math

S = {}

# ------------------------------------------------------------------ fondo de día
def _flowers(seed, n, ymin, ymax):
    r = random.Random(seed)
    out = ""
    cols = ["#ffffff", "#fff6b0", "#ffffff", "#ffd7ea", "#fffbd0"]
    for _ in range(n):
        y = r.uniform(ymin, ymax)
        # mas flores hacia abajo y a la izquierda (la ladera iluminada)
        x = r.uniform(-20, 1500) * (0.55 + 0.45 * r.random())
        s = 0.7 + (y - ymin) / (ymax - ymin) * 2.4
        out += f"<circle cx='{x:.0f}' cy='{y:.0f}' r='{s:.1f}' fill='{r.choice(cols)}' opacity='.9'/>"
    return out

S["wall_day"] = f"""
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
<defs>
<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'>
 <stop offset='0' stop-color='#0a47c7'/><stop offset='.22' stop-color='#1f6fe4'/><stop offset='.46' stop-color='#4f9ff2'/><stop offset='.64' stop-color='#9ccffa'/><stop offset='.74' stop-color='#d4ebfd'/><stop offset='.8' stop-color='#f1f9ff'/></linearGradient>
<radialGradient id='sun' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#fff' stop-opacity='.55'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient>
<linearGradient id='haze' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff' stop-opacity='0'/><stop offset='.7' stop-color='#fff' stop-opacity='.6'/><stop offset='1' stop-color='#fff' stop-opacity='.2'/></linearGradient>
<linearGradient id='far' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#bfe2a6'/><stop offset='1' stop-color='#86c462'/></linearGradient>
<linearGradient id='h2' x1='0' y1='0' x2='.2' y2='1'><stop offset='0' stop-color='#8fd44a'/><stop offset='.5' stop-color='#58a824'/><stop offset='1' stop-color='#2c7513'/></linearGradient>
<linearGradient id='h' x1='.05' y1='0' x2='.35' y2='1'>
 <stop offset='0' stop-color='#d4fa66'/><stop offset='.14' stop-color='#97dc34'/><stop offset='.42' stop-color='#5fb024'/><stop offset='.75' stop-color='#34801a'/><stop offset='1' stop-color='#1c5a0c'/></linearGradient>
<linearGradient id='lit' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#fff8b0' stop-opacity='.55'/><stop offset='.55' stop-color='#fff8b0' stop-opacity='.1'/><stop offset='1' stop-color='#fff8b0' stop-opacity='0'/></linearGradient>
<linearGradient id='sh' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0e3a06' stop-opacity='0'/><stop offset='1' stop-color='#0e3a06' stop-opacity='.55'/></linearGradient>
<filter id='b1' x='-30%' y='-90%' width='160%' height='280%'><feGaussianBlur stdDeviation='17'/></filter>
<filter id='b2' x='-30%' y='-90%' width='160%' height='280%'><feGaussianBlur stdDeviation='8'/></filter>
<filter id='tx' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.03 .5' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 .1  0 0 0 0 .35  0 0 0 0 .05  0 0 0 1.4 -.45'/></filter>
<clipPath id='hc'><path d='M-20 640 C 200 540 560 470 920 540 C 1200 595 1430 650 1620 628 V 900 H -20Z'/></clipPath>
</defs>
<rect width='1600' height='900' fill='url(#s)'/>
<circle cx='1180' cy='250' r='420' fill='url(#sun)'/>
<g fill='#fff' filter='url(#b1)' opacity='.95'>
 <ellipse cx='250' cy='200' rx='240' ry='48'/><ellipse cx='430' cy='168' rx='180' ry='44'/><ellipse cx='130' cy='250' rx='180' ry='34'/>
 <ellipse cx='990' cy='135' rx='270' ry='40'/><ellipse cx='1200' cy='165' rx='200' ry='38'/><ellipse cx='820' cy='185' rx='160' ry='30'/>
 <ellipse cx='1460' cy='290' rx='220' ry='38'/><ellipse cx='700' cy='400' rx='330' ry='32'/><ellipse cx='1250' cy='440' rx='290' ry='30'/>
 <ellipse cx='320' cy='455' rx='270' ry='30'/><ellipse cx='1540' cy='120' rx='160' ry='30'/>
</g>
<g fill='#fff' filter='url(#b2)' opacity='.85'>
 <ellipse cx='345' cy='195' rx='130' ry='20'/><ellipse cx='1020' cy='128' rx='160' ry='16'/><ellipse cx='1430' cy='284' rx='130' ry='16'/><ellipse cx='700' cy='394' rx='190' ry='13'/><ellipse cx='1260' cy='434' rx='170' ry='12'/>
</g>
<rect y='470' width='1600' height='160' fill='url(#haze)'/>
<g fill='#fff' filter='url(#b1)' opacity='.8'><ellipse cx='500' cy='575' rx='380' ry='20'/><ellipse cx='1180' cy='590' rx='420' ry='18'/></g>
<path d='M-10 612 C 180 574 360 588 540 603 C 740 620 900 572 1100 588 C 1300 604 1460 586 1610 602 V 720 H -10Z' fill='url(#far)' opacity='.85'/>
<path d='M740 668 C 980 580 1260 566 1620 618 V 900 H 740Z' fill='url(#h2)'/>
<path d='M-20 640 C 200 540 560 470 920 540 C 1200 595 1430 650 1620 628 V 900 H -20Z' fill='url(#h)'/>
<g clip-path='url(#hc)'>
 <rect x='-20' y='440' width='1660' height='460' filter='url(#tx)' opacity='.28'/>
 <path d='M-20 700 C 220 600 580 540 920 610 C 1200 665 1430 720 1620 700 V 790 C 1430 810 1200 755 920 700 C 580 632 220 692 -20 800Z' fill='url(#lit)'/>
 <path d='M-20 560 C 200 520 520 440 840 500 C 700 520 400 560 -20 640Z' fill='#f4ffb0' opacity='.32'/>
 <path d='M-20 790 C 400 700 900 700 1620 800 V 900 H -20Z' fill='url(#sh)'/>
 {_flowers(5, 70, 640, 880)}
</g>
</svg>"""

# ------------------------------------------------------------------ fondo de noche
def _stars(seed, n):
    r = random.Random(seed)
    s = ""
    for _ in range(n):
        s += f"<circle cx='{r.randint(8,1592)}' cy='{r.randint(8,500)}' r='{r.choice([.7,.9,1,1.2,1.6])}' fill='#fff' opacity='{r.choice([.45,.65,.9])}'/>"
    return s

S["wall_night"] = f"""
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
<defs>
<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#01040f'/><stop offset='.4' stop-color='#071546'/><stop offset='.7' stop-color='#17399a'/><stop offset='.82' stop-color='#3963bb'/></linearGradient>
<radialGradient id='m' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#fffbe0' stop-opacity='.85'/><stop offset='.3' stop-color='#cfe0ff' stop-opacity='.28'/><stop offset='1' stop-color='#cfe0ff' stop-opacity='0'/></radialGradient>
<linearGradient id='h' x1='.05' y1='0' x2='.35' y2='1'><stop offset='0' stop-color='#37803a'/><stop offset='.3' stop-color='#1f5a22'/><stop offset='.7' stop-color='#123b16'/><stop offset='1' stop-color='#071f0b'/></linearGradient>
<linearGradient id='h2' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1c4a22'/><stop offset='1' stop-color='#0b2610'/></linearGradient>
<linearGradient id='far' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a4f7a'/><stop offset='1' stop-color='#1a3a2c'/></linearGradient>
<linearGradient id='lit' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#bcd6ff' stop-opacity='.3'/><stop offset='.6' stop-color='#bcd6ff' stop-opacity='0'/></linearGradient>
<filter id='b' x='-30%' y='-90%' width='160%' height='280%'><feGaussianBlur stdDeviation='16'/></filter>
<clipPath id='hc'><path d='M-20 640 C 200 540 560 470 920 540 C 1200 595 1430 650 1620 628 V 900 H -20Z'/></clipPath>
</defs>
<rect width='1600' height='900' fill='url(#s)'/>
{_stars(7, 170)}
<circle cx='1240' cy='170' r='170' fill='url(#m)'/><circle cx='1240' cy='170' r='40' fill='#fffbe6'/>
<g fill='#4a6ab8' filter='url(#b)' opacity='.3'><ellipse cx='380' cy='420' rx='300' ry='24'/><ellipse cx='1000' cy='470' rx='340' ry='22'/><ellipse cx='1400' cy='330' rx='200' ry='20'/></g>
<path d='M-10 612 C 180 574 360 588 540 603 C 740 620 900 572 1100 588 C 1300 604 1460 586 1610 602 V 720 H -10Z' fill='url(#far)' opacity='.9'/>
<path d='M740 668 C 980 580 1260 566 1620 618 V 900 H 740Z' fill='url(#h2)'/>
<path d='M-20 640 C 200 540 560 470 920 540 C 1200 595 1430 650 1620 628 V 900 H -20Z' fill='url(#h)'/>
<g clip-path='url(#hc)'><path d='M-20 700 C 220 600 580 540 920 610 C 1200 665 1430 720 1620 700 V 790 C 1430 810 1200 755 920 700 C 580 632 220 692 -20 800Z' fill='url(#lit)'/></g>
</svg>"""

# ------------------------------------------------------------------ pasto que se mece
def grass(seed=11):
    r = random.Random(seed)
    rows = [  # n, alto min/max, ancho min/max, degradado, amplitud, desplazamiento y, clase de ritmo
        (92, 22, 46, 2.4, 3.6, "g1", (2.5, 5), 5, "r1"),
        (74, 36, 78, 3.0, 4.8, "g2", (3.5, 7), 3, "r2"),
        (54, 56, 118, 3.8, 6.0, "g3", (4.5, 9), 0, "r3"),
    ]
    dur = {"r1": 6.0, "r2": 5.0, "r3": 4.2}
    blades = ""
    for n, hmin, hmax, wmin, wmax, g, amp, yo, cls in rows:
        for _ in range(n):
            x = r.uniform(-4, 1604)
            h = r.uniform(hmin, hmax)
            w = r.uniform(wmin, wmax)
            b = r.uniform(-.35, .6) * h * .35
            y = 220 + yo
            d = (f"M{x-w:.0f} {y}Q{x-w*.5+b*.1:.0f} {y-h*.62:.0f} {x+b:.0f} {y-h:.0f}"
                 f"Q{x+w*.6+b*.15:.0f} {y-h*.55:.0f} {x+w:.0f} {y}Z")
            # el retraso depende de x: asi el viento «viaja» de un lado a otro
            lag = -(x / 1600) * dur[cls] * .9 - r.uniform(0, .5)
            blades += f"<path class='b {cls}' style='--l:{lag:.1f}s;--a:{r.uniform(*amp):.0f}' d='{d}' fill='url(#{g})'/>"
    flowers = ""
    for _ in range(9):
        x = r.uniform(20, 1580)
        h = r.uniform(70, 118)
        lag = -(x / 1600) * dur["r3"] * .9
        c = r.choice(["#ffffff", "#fff3a6", "#ffd9ec"])
        flowers += (f"<g class='b r3' style='--l:{lag:.1f}s;--a:6'>"
                    f"<path d='M{x:.0f} 224Q{x+5:.0f} {224-h*.55:.0f} {x+3:.0f} {224-h:.0f}' stroke='#3f8f1a' stroke-width='2.2' fill='none'/>"
                    f"<circle cx='{x+3:.0f}' cy='{224-h:.0f}' r='5.5' fill='{c}'/><circle cx='{x+3:.0f}' cy='{224-h:.0f}' r='2.2' fill='#f0a800'/></g>")
    return f"""
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 220' preserveAspectRatio='xMidYMax slice'>
<defs>
<linearGradient id='g1' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#3f8f1c'/><stop offset='1' stop-color='#a4e048'/></linearGradient>
<linearGradient id='g2' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#2f7d14'/><stop offset='1' stop-color='#8fd53a'/></linearGradient>
<linearGradient id='g3' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#1f6a0c'/><stop offset='.6' stop-color='#4fb020'/><stop offset='1' stop-color='#b8ee58'/></linearGradient>
</defs>
<style>
.b{{transform-box:fill-box;transform-origin:50% 100%;animation:w var(--d,5s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}}
.r1{{--d:6s}}.r2{{--d:5s}}.r3{{--d:4.2s}}
@keyframes w{{from{{transform:rotate(calc(var(--a) * -.55deg))}}to{{transform:rotate(calc(var(--a) * 1deg))}}}}
@media (prefers-reduced-motion:reduce){{.b{{animation:none}}}}
</style>
{blades}{flowers}
</svg>"""

S["grass"] = grass()
