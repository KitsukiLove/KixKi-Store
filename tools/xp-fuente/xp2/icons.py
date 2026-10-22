"""Iconos vectoriales estilo Windows XP (32x32): contorno oscuro, degradado y brillo glossy."""
import math

def G(i, c1, c2, vert=True, mid=None):
    m = f"<stop offset='.5' stop-color='{mid}'/>" if mid else ""
    d = "x1='0' y1='0' x2='0' y2='1'" if vert else "x1='0' y1='0' x2='1' y2='1'"
    return f"<linearGradient id='{i}' {d}><stop offset='0' stop-color='{c1}'/>{m}<stop offset='1' stop-color='{c2}'/></linearGradient>"

GLOSS = "<linearGradient id='gl' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff' stop-opacity='.85'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></linearGradient>"
SHADOW = "<ellipse cx='16' cy='30' rx='11' ry='1.6' fill='#000' opacity='.2'/>"

def wrap(defs, body, shadow=True):
    return (f"<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>"
            f"<defs>{GLOSS}{defs}</defs>{SHADOW if shadow else ''}{body}</svg>")

def star(cx, cy, ro, ri, n=5, rot=-90):
    pts = []
    for k in range(n * 2):
        r = ro if k % 2 == 0 else ri
        a = math.radians(rot + k * 180 / n)
        pts.append(f"{cx + r*math.cos(a):.2f},{cy + r*math.sin(a):.2f}")
    return " ".join(pts)

I = {}

# --- tiendas: bolsa de compras morada
I["tiendas"] = wrap(G("a", "#c7b6ff", "#6a45d8"), """
<path d='M11 13 C11 3.5 21 3.5 21 13' fill='none' stroke='#2e2073' stroke-width='3.4' stroke-linecap='round'/>
<path d='M11 13 C11 5.5 21 5.5 21 13' fill='none' stroke='#a99aef' stroke-width='1.4' stroke-linecap='round'/>
<path d='M5.2 11 H26.8 L28.4 27.2 Q28.6 29.2 26.6 29.2 H5.4 Q3.4 29.2 3.6 27.2Z' fill='url(#a)' stroke='#2e2073' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M6 12 H26 L26.7 17.5 C20.5 19.5 11.5 19.5 5.3 17.5Z' fill='url(#gl)' opacity='.9'/>
<circle cx='11' cy='13.2' r='1.3' fill='#2e2073'/><circle cx='21' cy='13.2' r='1.3' fill='#2e2073'/>""")

# --- importante: llave dorada
I["importante"] = wrap(G("a", "#fff3a0", "#e59a00") + G("b", "#fff3a0", "#d98a00", False), """
<g transform='rotate(45 16 16)'>
<rect x='14' y='14.3' width='16' height='3.8' rx='1.2' fill='url(#a)' stroke='#7a4a00' stroke-width='1.1'/>
<rect x='23' y='17.6' width='3' height='5' rx='.8' fill='url(#a)' stroke='#7a4a00' stroke-width='1'/>
<rect x='27.2' y='17.6' width='2.4' height='3.6' rx='.8' fill='url(#a)' stroke='#7a4a00' stroke-width='1'/>
<circle cx='9' cy='16' r='7.2' fill='url(#b)' stroke='#7a4a00' stroke-width='1.3'/>
<circle cx='8' cy='16' r='2.6' fill='#fff8d6' stroke='#7a4a00' stroke-width='1.1'/>
<path d='M3.4 14 A6 6 0 0 1 10 9.2' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round' opacity='.85'/>
</g>""")

# --- control: panel con deslizadores
I["control"] = wrap(G("a", "#ffffff", "#cfc9b3") + G("k", "#9fd0ff", "#1d63d6"), """
<rect x='3' y='4.5' width='26' height='23' rx='3' fill='url(#a)' stroke='#5b5a46' stroke-width='1.3'/>
<rect x='3.8' y='5.3' width='24.4' height='5.5' rx='2' fill='url(#gl)' opacity='.8'/>
<g stroke='#7a7966' stroke-width='2.2' stroke-linecap='round'><path d='M8 11.5H24'/><path d='M8 16.5H24'/><path d='M8 21.5H24'/></g>
<g fill='url(#k)' stroke='#0a3a9e' stroke-width='1.1'><circle cx='12' cy='11.5' r='3'/><circle cx='20.5' cy='16.5' r='3'/><circle cx='14.5' cy='21.5' r='3'/></g>""")

# --- utilidad: escudo con visto
I["utilidad"] = wrap(G("a", "#a8d2ff", "#1759d0"), """
<path d='M16 2.5 L27.2 6.6 V15 C27.2 22 22.4 26.8 16 29.6 C9.6 26.8 4.8 22 4.8 15 V6.6Z' fill='url(#a)' stroke='#0b3a8c' stroke-width='1.4' stroke-linejoin='round'/>
<path d='M16 2.5 L27.2 6.6 V15 C27.2 22 22.4 26.8 16 29.6Z' fill='#0b3a8c' opacity='.18'/>
<path d='M7 7.6 L16 4.4 V13 C12 13.5 9 12 7 10Z' fill='url(#gl)' opacity='.75'/>
<path d='M10.2 16.2 L14.4 20.4 L22 11.2' fill='none' stroke='#14631c' stroke-width='4.6' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M10.2 16.2 L14.4 20.4 L22 11.2' fill='none' stroke='#7be26e' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>""")

# --- pantalla: movil con paisaje
I["pantalla"] = wrap(G("a", "#f1f1f7", "#8c8ca6") + G("s", "#69b0ff", "#1c62d8") + G("h", "#8be04a", "#3a8a17"), """
<rect x='8.5' y='2' width='15' height='27.5' rx='3.2' fill='url(#a)' stroke='#34344d' stroke-width='1.3'/>
<rect x='10.5' y='5.6' width='11' height='17' rx='1' fill='url(#s)' stroke='#1b3f8a' stroke-width='.8'/>
<path d='M10.9 20 C13 16.5 17 17 21.1 19.6 V22.2 H10.9Z' fill='url(#h)'/>
<circle cx='18.6' cy='9.6' r='1.7' fill='#ffe66e'/>
<path d='M10.8 6 H21.2 L10.8 15Z' fill='#fff' opacity='.28'/>
<circle cx='16' cy='26.2' r='1.5' fill='#fff' stroke='#34344d' stroke-width='.9'/>
<rect x='13.5' y='3.4' width='5' height='1' rx='.5' fill='#34344d'/>""")

# --- privacidad: candado dorado
I["privacidad"] = wrap(G("a", "#fff09a", "#e29a00"), """
<path d='M10.4 15 V10.8 A5.6 5.6 0 0 1 21.6 10.8 V15' fill='none' stroke='#4a5166' stroke-width='4' stroke-linecap='round'/>
<path d='M10.4 15 V10.8 A5.6 5.6 0 0 1 21.6 10.8 V15' fill='none' stroke='#c3cbe0' stroke-width='1.8' stroke-linecap='round'/>
<rect x='5.6' y='14' width='20.8' height='15' rx='2.8' fill='url(#a)' stroke='#7a4a00' stroke-width='1.3'/>
<rect x='6.6' y='15' width='18.8' height='6' rx='2' fill='url(#gl)' opacity='.8'/>
<circle cx='16' cy='20.8' r='2.5' fill='#5a3600'/><rect x='15.1' y='21' width='1.8' height='5.2' rx=".8" fill='#5a3600'/>""")

# --- fotos: marco con paisaje
I["fotos"] = wrap(G("a", "#ffffff", "#dcd8c6") + G("s", "#5aa6ff", "#bfe0ff") + G("h", "#8be04a", "#3a8a17"), """
<rect x='2.6' y='5.6' width='26.8' height='21' rx='1.8' fill='url(#a)' stroke='#6c6a5a' stroke-width='1.3'/>
<rect x='5.2' y='8.2' width='21.6' height='15.8' fill='url(#s)' stroke='#2f5ea8' stroke-width='.9'/>
<circle cx='21.6' cy='12.6' r='2.8' fill='#ffe66e' stroke='#e0b000' stroke-width='.6'/>
<path d='M5.6 23.6 V19.6 C9.6 14.6 15.6 15.6 19.6 19 C22 17.6 24.4 17.8 26.4 18.8 V23.6Z' fill='url(#h)' stroke='#2a6a12' stroke-width='.8'/>
<path d='M5.4 8.4 H17 L5.4 18Z' fill='#fff' opacity='.28'/>""")

# --- internet: globo terraqueo
I["internet"] = wrap("<radialGradient id='a' cx='.35' cy='.3' r='.9'><stop offset='0' stop-color='#bfe4ff'/><stop offset='.55' stop-color='#3a8cf0'/><stop offset='1' stop-color='#0f46b8'/></radialGradient>" + G("g", "#8be04a", "#2f8a1a"), """
<circle cx='16' cy='16' r='13' fill='url(#a)' stroke='#0b3a8c' stroke-width='1.4'/>
<path d='M7 9.5 C10 6.5 14 7 15.5 9.5 C16.5 12 13 13 13.5 15.5 C10.5 16.5 9 14.5 7 14 C5.5 12.5 6 11 7 9.5Z M16.5 17.5 C19 16.5 22.5 17.5 22 20.5 C21.5 24 18.5 25.5 17 24 C15.5 22.5 15.5 19 16.5 17.5Z M19.5 7.5 C22 6.5 24.5 8 25 10.5 C23.5 11.5 21 11 19.5 9.5Z' fill='url(#g)' stroke='#1f6a12' stroke-width='.7' stroke-linejoin='round'/>
<g fill='none' stroke='#fff' stroke-opacity='.35' stroke-width='.8'><ellipse cx='16' cy='16' rx='5.5' ry='13'/><path d='M3.2 16 H28.8'/><path d='M5 9.5 H27 M5 22.5 H27'/></g>
<ellipse cx='11.5' cy='8' rx='6' ry='3.4' transform='rotate(-30 11.5 8)' fill='#fff' opacity='.5'/>""")

# --- dia a dia: calendario
cal_cells = ""
for r in range(3):
    for c in range(5):
        x = 6.6 + c * 4.1; y = 15.4 + r * 4.1
        fill = "#e8531f" if (r, c) == (1, 2) else "#d5dff3"
        cal_cells += f"<rect x='{x:.1f}' y='{y:.1f}' width='3' height='3' rx='.5' fill='{fill}'/>"
I["dia"] = wrap(G("a", "#ffffff", "#e4e8f2") + G("r", "#ff8a78", "#c81e0c"), f"""
<rect x='3.6' y='5' width='24.8' height='23.6' rx='2.6' fill='url(#a)' stroke='#5b6275' stroke-width='1.3'/>
<path d='M3.6 7.6 Q3.6 5 6.2 5 H25.8 Q28.4 5 28.4 7.6 V12.6 H3.6Z' fill='url(#r)' stroke='#7a1408' stroke-width='1.2' stroke-linejoin='round'/>
<path d='M5 6.2 H27 V9 C20 10.4 12 10.4 5 9Z' fill='url(#gl)' opacity='.6'/>
<rect x='9' y='2.6' width='2.6' height='6' rx='1.2' fill='#4a4f60' stroke='#23262f' stroke-width='.6'/><rect x='20.4' y='2.6' width='2.6' height='6' rx='1.2' fill='#4a4f60' stroke='#23262f' stroke-width='.6'/>
{cal_cells}""")

# --- emulacion: mando de juegos
I["emulacion"] = wrap(G("a", "#f0f0f8", "#8586a6"), """
<path d='M8 9.5 H24 C28.6 9.5 30.8 13.5 30.4 18.5 C30 23.5 28.4 26 25.8 26 C23.4 26 22.4 24 21 22.2 H11 C9.6 24 8.6 26 6.2 26 C3.6 26 2 23.5 1.6 18.5 C1.2 13.5 3.4 9.5 8 9.5Z' fill='url(#a)' stroke='#2f3050' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M5 11.2 C6 10.4 7 10.3 8.2 10.3 H23.8 C25 10.3 26 10.4 27 11.2 C20 14 12 14 5 11.2Z' fill='url(#gl)' opacity='.8'/>
<g fill='#2f3050'><rect x='5.4' y='14.6' width='7' height='2.6' rx='.6'/><rect x='7.6' y='12.4' width='2.6' height='7' rx='.6'/></g>
<circle cx='23.6' cy='14.6' r='2.2' fill='#ee4636' stroke='#7a1408' stroke-width='.8'/><circle cx='26.8' cy='18' r='2.2' fill='#3fae4a' stroke='#14631c' stroke-width='.8'/>
<rect x='13' y='16.6' width='2.6' height='1.4' rx='.7' fill='#2f3050'/><rect x='16.4' y='16.6' width='2.6' height='1.4' rx='.7' fill='#2f3050'/>""")

# --- decoracion: paleta de pintor
I["decoracion"] = wrap(G("a", "#fff6d6", "#dfb36e"), """
<path d='M16 3.2 C24.8 3.2 30.4 8.4 30.4 15 C30.4 20.4 26.2 21.8 23.6 21.2 C21.2 20.7 20.4 22.4 21.4 24.4 C22.6 27 20.4 29 16.6 29 C8.2 29 2.2 23.4 2.2 15.6 C2.2 8.4 8.4 3.2 16 3.2Z' fill='url(#a)' stroke='#7a5420' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M6 8 C9 5.4 14 4.6 19 5.2 C13 6.2 9 8.6 6.4 12Z' fill='#fff' opacity='.7'/>
<circle cx='8.6' cy='13' r='2.5' fill='#e8321e' stroke='#7a1408' stroke-width='.8'/><circle cx='13.4' cy='8.6' r='2.5' fill='#ffd21a' stroke='#8a6a00' stroke-width='.8'/>
<circle cx='20.4' cy='8.8' r='2.5' fill='#2f86f0' stroke='#0b3a8c' stroke-width='.8'/><circle cx='25.2' cy='14' r='2.5' fill='#3fae4a' stroke='#14631c' stroke-width='.8'/>
<circle cx='10.6' cy='20.4' r='2.6' fill='#7fb6ff' stroke='#7a5420' stroke-width='1'/>""")

# --- musica: notas
I["musica"] = wrap(G("a", "#8ef0b6", "#16975a") + G("b", "#b6ffd2", "#16975a"), """
<path d='M12.2 22 V8 L26 5 V19' fill='none' stroke='#0d5a35' stroke-width='2.4' stroke-linejoin='round'/>
<path d='M12.2 8 L26 5 V10.6 L12.2 13.6Z' fill='url(#a)' stroke='#0d5a35' stroke-width='1.2' stroke-linejoin='round'/>
<ellipse cx='8.6' cy='22.6' rx='4.6' ry='3.5' transform='rotate(-22 8.6 22.6)' fill='url(#b)' stroke='#0d5a35' stroke-width='1.3'/>
<ellipse cx='22.4' cy='19.6' rx='4.6' ry='3.5' transform='rotate(-22 22.4 19.6)' fill='url(#b)' stroke='#0d5a35' stroke-width='1.3'/>
<path d='M13.4 9.4 L24.8 7' stroke='#fff' stroke-width='1.2' opacity='.6' stroke-linecap='round'/>""")

# --- teclados: teclado
keys = ""
for r, (n, x0, y) in enumerate([(7, 5.2, 11.2), (6, 6.8, 15.2)]):
    for c in range(n):
        keys += f"<rect x='{x0 + c*3.7:.1f}' y='{y}' width='3' height='3' rx='.6' fill='#fff' stroke='#8a8aa4' stroke-width='.6'/>"
keys += "<rect x='9' y='19.2' width='14' height='3' rx='.6' fill='#fff' stroke='#8a8aa4' stroke-width='.6'/>"
keys += "<rect x='5.2' y='19.2' width='3' height='3' rx='.6' fill='#fff' stroke='#8a8aa4' stroke-width='.6'/><rect x='23.8' y='19.2' width='3' height='3' rx='.6' fill='#fff' stroke='#8a8aa4' stroke-width='.6'/>"
I["teclados"] = wrap(G("a", "#f6f6fa", "#a9aabd"), f"""
<rect x='1.8' y='8' width='28.4' height='18' rx='2.6' fill='url(#a)' stroke='#3f405a' stroke-width='1.3'/>
<rect x='2.6' y='8.8' width='26.8' height='5' rx='2' fill='url(#gl)' opacity='.7'/>{keys}""")

# --- favoritas: estrella dorada
I["favs"] = wrap(G("a", "#fff6a0", "#f0a000"), f"""
<polygon points='{star(16,16.8,14,6.2)}' fill='url(#a)' stroke='#9a5f00' stroke-width='1.4' stroke-linejoin='round'/>
<polygon points='{star(16,16.8,14,6.2)}' fill='url(#gl)' opacity='.55' transform='translate(0 -1.2) scale(1 .62)' transform-origin='16 16'/>
<ellipse cx='11.6' cy='12.2' rx='2.4' ry='1.2' transform='rotate(-35 11.6 12.2)' fill='#fff' opacity='.85'/>""")

# --- novedades: estallido naranja con destello
I["news"] = wrap(G("a", "#ffd66a", "#ee5a14"), f"""
<polygon points='{star(16,16,14.5,10.4,12,-90)}' fill='url(#a)' stroke='#9a3200' stroke-width='1.3' stroke-linejoin='round'/>
<polygon points='{star(16,16,14.5,10.4,12,-90)}' fill='url(#gl)' opacity='.45' transform='translate(0 -2) scale(1 .6)' transform-origin='16 16'/>
<polygon points='{star(16,16,8.6,2.2,4,-90)}' fill='#fff' stroke='#c4500a' stroke-width='.6' stroke-linejoin='round'/>""")

# --- packs: caja de regalo
I["packs"] = wrap(G("a", "#ff8f80", "#c8261a") + G("b", "#ffb0a0", "#d8382a") + G("y", "#fff3a0", "#e8a000"), """
<rect x='5' y='14.4' width='22' height='14.4' rx='1.6' fill='url(#a)' stroke='#6e130b' stroke-width='1.3'/>
<rect x='3.2' y='10' width='25.6' height='5.8' rx='1.6' fill='url(#b)' stroke='#6e130b' stroke-width='1.3'/>
<rect x='14' y='10' width='4' height='18.8' fill='url(#y)' stroke='#8a5a00' stroke-width='.9'/>
<path d='M16 9.6 C10 9 8.4 3.6 12.2 3.6 C14.6 3.6 15.8 6.8 16 9.6Z M16 9.6 C22 9 23.6 3.6 19.8 3.6 C17.4 3.6 16.2 6.8 16 9.6Z' fill='url(#y)' stroke='#8a5a00' stroke-width='1' stroke-linejoin='round'/>
<rect x='5.8' y='11' width='8' height='2' rx='1' fill='#fff' opacity='.45'/>""")

# --- extras de interfaz
I["search"] = wrap("<radialGradient id='a' cx='.35' cy='.3' r='.9'><stop offset='0' stop-color='#ffffff'/><stop offset='.6' stop-color='#cfe6ff'/><stop offset='1' stop-color='#7db4f2'/></radialGradient>", """
<path d='M19 19 L28 28' stroke='#4a2e12' stroke-width='5' stroke-linecap='round'/><path d='M19 19 L28 28' stroke='#b9824a' stroke-width='2.6' stroke-linecap='round'/>
<circle cx='13' cy='13' r='9' fill='url(#a)' stroke='#2f4f8a' stroke-width='2.2'/>
<path d='M7.6 11 C8.4 8 11 6.4 13.6 6.6' stroke='#fff' stroke-width='1.8' fill='none' stroke-linecap='round'/>""", shadow=False)

I["home"] = wrap(G("w", "#fffbe8", "#e6d9a8") + G("r", "#ff8a6a", "#c0301a"), """
<path d='M5.4 15 V28 H26.6 V15' fill='url(#w)' stroke='#6e5a1e' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M2 16 L16 3.6 L30 16 L27.6 17.6 L16 7.6 L4.4 17.6Z' fill='url(#r)' stroke='#6e130b' stroke-width='1.2' stroke-linejoin='round'/>
<rect x='13' y='19' width='6' height='9' rx='.6' fill='#7a4c1e' stroke='#4a2c0a' stroke-width='.9'/>
<rect x='7.6' y='18.6' width='3.8' height='3.8' fill='#9fd0ff' stroke='#4a2c0a' stroke-width='.8'/><rect x='20.6' y='18.6' width='3.8' height='3.8' fill='#9fd0ff' stroke='#4a2c0a' stroke-width='.8'/>""")

I["moon"] = wrap(G("a", "#fff6b0", "#f0b400"), """
<path d='M22.8 3.6 C15 4.4 9.6 10 9.6 17 C9.6 24 15.4 29 22.4 28.6 C25.4 28.4 27.6 27.4 29 26 C20 25.6 15.4 19 17.4 12 C18.4 8.6 20.4 5.6 22.8 3.6Z' fill='url(#a)' stroke='#8a5a00' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M21 5.6 C16 8 12 12 12 17' stroke='#fff' stroke-width='1.6' fill='none' stroke-linecap='round' opacity='.8'/>""")

I["more"] = wrap(G("a", "#ffffff", "#c9d6f5"), """
<g stroke='#1e3f8f' stroke-width='1.2'><circle cx='6' cy='16' r='3.6' fill='url(#a)'/><circle cx='16' cy='16' r='3.6' fill='url(#a)'/><circle cx='26' cy='16' r='3.6' fill='url(#a)'/></g>""", shadow=False)
