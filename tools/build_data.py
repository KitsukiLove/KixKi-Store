#!/usr/bin/env python3
"""Genera js/data.js a partir de data/preguntas50.json + data/resultados.json.
Rasgos (inspirados en Big Five): C constancia, O curiosidad, E energia, A cuidado, F firmeza, K calma, R reserva.
Calibra por simulacion: media/sd por rasgo, desplazamiento por encantamiento (cada uno gana ~1/14),
mapa de porcentajes y umbrales de nivel. Uso: python3 tools/build_data.py [--check]"""
import json, sys, math
from pathlib import Path
import numpy as np
R = Path(__file__).resolve().parent.parent
Q = json.loads((R / "data/preguntas50.json").read_text())["q"]
RES = json.loads((R / "data/resultados.json").read_text())
T = "COEAFKR"; TI = {t: i for i, t in enumerate(T)}
PROF = {"reparacion":"AK","irrompibilidad":"CK","fortuna":"OE","toque_seda":"CR","eficiencia":"CE","filo":"AF",
        "proteccion":"AR","botin":"OF","espinas":"FR","infinidad":"CO","paso_helado":"OK","aspecto_igneo":"EF",
        "lealtad":"EA","sigilo":"KR"}
ORDER = list(PROF); NE = len(ORDER)
COLORS = {"reparacion":"#7ef0c4","irrompibilidad":"#9aa5b8","fortuna":"#ffd36e","toque_seda":"#e8d8ff",
 "eficiencia":"#5ec8ff","filo":"#ff4d4d","proteccion":"#3f7bff","botin":"#e0a458","espinas":"#4caf50",
 "infinidad":"#b36bff","paso_helado":"#8ff0ff","aspecto_igneo":"#ff8a00","lealtad":"#ff8fc7","sigilo":"#6b5bd2"}
NAMES = {"esc":"escenario","ab":"ab","obj":"objeto","orb":"orbes"}
rng = np.random.default_rng(7)

# ---- matriz de pesos por pregunta: W[q][opcion] = vector de 7 ----
def weights(x):
    if x["f"] == "orb": return None
    M = np.zeros((len(x["o"]), 7))
    for i, o in enumerate(x["o"]):
        M[i, TI[o[1][0]]] += 2; M[i, TI[o[1][1]]] += 1
    return M
W = [weights(x) for x in Q]

def simulate(n, beta, latent=True):
    """n usuarios; devuelve puntos crudos (n,7). beta=0 -> respuestas al azar."""
    lat = rng.normal(0, 1, (n, 7)) if latent else np.zeros((n, 7))
    raw = np.zeros((n, 7))
    for x, M in zip(Q, W):
        if x["f"] == "orb":
            t = TI[x["t"]]; s = -1 if x.get("rev") else 1
            k = np.arange(5) - 2
            lg = beta * 0.9 * lat[:, [t]] * s * k[None, :]
            p = np.exp(lg - lg.max(1, keepdims=True)); p /= p.sum(1, keepdims=True)
            v = (p.cumsum(1) < rng.random((n, 1))).sum(1)
            raw[:, t] += v / 2
        else:
            u = beta * (lat @ M.T) * 0.5
            p = np.exp(u - u.max(1, keepdims=True)); p /= p.sum(1, keepdims=True)
            c = (p.cumsum(1) < rng.random((n, 1))).sum(1).clip(0, M.shape[0] - 1)
            raw += M[c]
    return raw

# media y sd exactas con respuestas al azar son referencia; la poblacion simulada define la escala
BETA = 1.1
pop = np.vstack([simulate(30000, b) for b in (0.35, 0.8, 1.2)])   # mezcla de personas poco y muy definidas
mu, sd = pop.mean(0), pop.std(0)
rnd = simulate(40000, 0.0, latent=False)
P_A = np.array([TI[PROF[e][0]] for e in ORDER]); P_B = np.array([TI[PROF[e][1]] for e in ORDER])
def aff(raw, off):
    z = (raw - mu) / sd
    return (z[:, P_A] + z[:, P_B]) / math.sqrt(2) + off
off = np.zeros(NE)
for it in range(300):
    win = aff(pop, off).argmax(1)
    share = np.bincount(win, minlength=NE) / len(win)
    off += (0.25 * 0.985 ** it) * (math.log(1 / NE) - np.log(np.maximum(share, 1e-3)))
    off -= off.mean()
A = aff(pop, off); win = A.argmax(1); top = A.max(1)
share = np.bincount(win, minlength=NE) / len(win)
shr = np.bincount(aff(rnd, off).argmax(1), minlength=NE) / len(rnd)
# mapa de porcentaje: pct = 8 + 92*clamp((aff-lo)/(hi-lo))
lo, hi = float(np.percentile(A, 3)), float(np.percentile(top, 97))
LV = [float(np.percentile(top, p)) for p in (18, 42, 66, 86)]   # umbrales de nivel II..V
if "--check" in sys.argv or True:
    print("rasgos mu", mu.round(2), "sd", sd.round(2))
    print("gana (poblacion)  min %.3f max %.3f" % (share.min(), share.max()))
    print("gana (azar puro)  min %.3f max %.3f" % (shr.min(), shr.max()))
    print("lo %.2f hi %.2f  niveles" % (lo, hi), [round(v, 2) for v in LV])
    # personas "puras": respuestas siempre hacia un par
    for e in ORDER:
        a, b = TI[PROF[e][0]], TI[PROF[e][1]]
        lat = np.zeros((4000, 7)); lat[:, a] = 1.4; lat[:, b] = 1.4
        lat += rng.normal(0, .5, lat.shape)
        # reusar simulador con latente fijo
        raw = np.zeros((4000, 7))
        for x, M in zip(Q, W):
            if x["f"] == "orb":
                t = TI[x["t"]]; s = -1 if x.get("rev") else 1; k = np.arange(5) - 2
                lg = BETA * 0.9 * lat[:, [t]] * s * k[None, :]
                p = np.exp(lg - lg.max(1, keepdims=True)); p /= p.sum(1, keepdims=True)
                raw[:, t] += (p.cumsum(1) < rng.random((4000, 1))).sum(1) / 2
            else:
                u = BETA * (lat @ M.T) * 0.5
                p = np.exp(u - u.max(1, keepdims=True)); p /= p.sum(1, keepdims=True)
                c = (p.cumsum(1) < rng.random((4000, 1))).sum(1).clip(0, M.shape[0] - 1)
                raw += M[c]
        w = aff(raw, off).argmax(1)
        print("  persona %-15s %s  acierta %.0f%%" % (e, PROF[e], 100 * (w == ORDER.index(e)).mean()))

data = {
  "traits": {"C":"Constancia","O":"Curiosidad","E":"Energía","A":"Cuidado","F":"Firmeza","K":"Calma","R":"Reserva"},
  "order": ORDER, "prof": PROF,
  "mu": [round(float(v), 4) for v in mu], "sd": [round(float(v), 4) for v in sd],
  "off": [round(float(v), 4) for v in off], "lo": round(lo, 4), "hi": round(hi, 4), "lv": [round(v, 4) for v in LV],
  "enchants": {e: {**RES[e], "color": COLORS[e]} for e in ORDER},
  "q": [],
}
for x in Q:
    if x["f"] == "orb":
        data["q"].append({"f": "orb", "t": x["q"], "r": x["t"], "v": -1 if x.get("rev") else 1})
    else:
        data["q"].append({"f": x["f"], "t": x["q"], "o": [[o[0], o[1][0], o[1][1]] for o in x["o"]]})
(R / "js").mkdir(exist_ok=True)
(R / "js/data.js").write_text("window.MESA=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("js/data.js:", (R / "js/data.js").stat().st_size, "bytes;", len(data["q"]), "preguntas")
