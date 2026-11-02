#!/usr/bin/env python3
"""Íconos pixel 12x12 de los 14 encantamientos -> js/icons.js (+ hoja de contacto para revisar).
Paleta: k contorno, a color, b sombra, c luz, w blanco, y dorado. '.' transparente.
sym=True: cada fila trae la mitad izquierda (6) y se espeja."""
import json
from pathlib import Path
R = Path(__file__).resolve().parent.parent
S = True
ICONS = {
 "reparacion": (S, ["..kkk.", ".kaaak", "kaccaa", "kacaaa", "kaaaaa", ".kaaaa", "..kaaa", "...kaa", "....ka", ".....k"]),
 "proteccion": (S, ["kkkkkk", "kaaaaa", "kaccca", "kacaaa", "kacaaa", "kaaaaa", ".kaaab", ".kaabb", "..kabb", "...kkk"]),
 "irrompibilidad": (S, ["..kkkk", ".kcaaa", "kcaaaa", "kkkkkk", "kaaaaa", ".kaaaa", "..kaaa", "...kaa", "....ka", ".....k"]),
 "fortuna": (S, ["..kkk.", ".kaaak", "kaacaa", "kaaaaa", ".kkaab", ".kkaab", "kaaaaa", "kaacaa", ".kaaak", "..kkk.", "....kb"]),
 "infinidad": (False, [".kkkk..kkkk.", "kaaaakkaaaak", "ka..aaaa..ak", "kaaaakkaaaak", ".kkkk..kkkk."]),
 "paso_helado": (S, ["....kc", "k...ka", ".k.kac", "..kaka", "kkkkkc", ".kaaaa", "..kcka", ".k.kac", "k...ka", "....kc"]),
 "aspecto_igneo": (S, ["....kk", "...kak", "..kaak", ".kaack", ".kayyk", "kaayyk", "kaayyk", "kaayyw", ".kaayy", "..kkkk"]),
 "toque_seda": (False, ["........kkk.", ".......kcwak", "......kcwaak", ".....kcwaak.", "....kcwaak..", "...kcwaak...", "..kcwaak....", ".kcwaak.....", "kwaakk......", "kkkk........"]),
 "eficiencia": (False, ["......kkkk..", ".....kaayyk.", "....kaayyk..", "...kaayyk...", "..kaayykkk..", ".kaayyaaayk.", "kkkkkaayyk..", "....kaayk...", "...kaayk....", "...kayk.....", "..kyk.......", "..kk........"]),
 "filo": (False, ["..........kk", ".........kck", "........kcck", ".......kcck.", "......kcck..", ".k...kcck...", "..k.kcck....", "...kcck.....", "...kbk......", "..kykk......", ".kyk.k......", "kk.........."]),
 "botin": (S, ["......", "..kkkk", ".kyyyy", "kyycyy", "kyycyy", "kyyyyy", "kkkkkk", "kbbbbb", "kbbkyy", "kbbkyy", ".kkkkk"]),
 "espinas": (S, ["...ka.", "...ka.", "k..ka.", "ka.kac", ".kkkac", ".kaaac", "kaaaac", "kkaaac", "k.kaab", "..kkkk"]),
 "lealtad": (False, ["kkk......kkk", "kcckkkkkkcck", ".kcccccccck.", "kcckaaaakcck", "kkk......kkk"]),
 "sigilo": (S, ["......", "......", "..kkkk", ".kaaaa", "kaaccc", "kakwwk", "kakwwk", "kaaccc", ".kaaaa", "..kkkk"]),
}
out = {}
for name, (sym, rows) in ICONS.items():
    full = []
    for r in rows:
        if sym:
            if len(r) != 6: raise SystemExit(f"{name}: fila '{r}' mide {len(r)} (debe ser 6)")
            r = r + r[::-1]
        if len(r) != 12: raise SystemExit(f"{name}: fila '{r}' mide {len(r)} (debe ser 12)")
        full.append(r)
    if len(full) > 12: raise SystemExit(f"{name}: {len(full)} filas")
    top = (12 - len(full)) // 2
    full = ["." * 12] * top + full + ["." * 12] * (12 - len(full) - top)
    out[name] = full
(R / "js/icons.js").write_text("window.MESA_ICONS=" + json.dumps(out, separators=(",", ":")) + ";\n")
# hoja de contacto (solo con --hoja; necesita Pillow)
if "--hoja" not in __import__("sys").argv:
    print("ok", len(out)); raise SystemExit
from PIL import Image
data = json.loads((R / "js/data.js").read_text()[len("window.MESA="):-2])
def sh(c, f): return tuple(max(0, min(255, int(v * f))) for v in c)
sheet = Image.new("RGB", (7 * 12 * 8 + 8 * 8, 2 * 12 * 8 + 3 * 8), (21, 12, 51))
for n, (name, rows) in enumerate(out.items()):
    col = tuple(int(data["enchants"][name]["color"][i:i+2], 16) for i in (1, 3, 5))
    pal = {"k": (26, 15, 58), "a": col, "b": sh(col, .6), "c": tuple(min(255, int(v*1.3+40)) for v in col), "w": (255,255,255), "y": (255,211,110)}
    ox, oy = 8 + (n % 7) * (12 * 8 + 8), 8 + (n // 7) * (12 * 8 + 8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in pal:
                for dy in range(8):
                    for dx in range(8): sheet.putpixel((ox + x*8 + dx, oy + y*8 + dy), pal[ch])
import sys
if "--hoja" in sys.argv: sheet.save(R / "iconos-hoja.png")  # hoja de contacto opcional para revisar los íconos
print("ok", len(out))
