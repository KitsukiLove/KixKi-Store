#!/usr/bin/env python3
"""Une los 7 bloques, valida contra matrix.json y escribe data/preguntas.json."""
import json, sys
from pathlib import Path
D = Path(__file__).resolve().parent.parent / "data"
m = json.loads((D / "matrix.json").read_text())
res = json.loads((D / "resultados.json").read_text())
ids = set(m["enchantments"])
errs, qs = [], []
for b in range(1, 8):
    d = json.loads((D / f"preguntas_bloque{b}.json").read_text())
    if len(d["questions"]) != 10:
        errs.append(f"bloque {b}: {len(d['questions'])} preguntas")
    for q in d["questions"]:
        i = q["id"]
        if i != len(qs):
            errs.append(f"id {i} fuera de orden (esperaba {len(qs)})")
        mains = [o["main"] for o in m["questions"][i]]
        got = [o["enchant"] for o in q["options"]]
        if got != mains:
            errs.append(f"id {i}: opciones {got} != matriz {mains}")
        if len(q["options"]) != 4 or not q["text"].strip() or any(not o["text"].strip() for o in q["options"]):
            errs.append(f"id {i}: texto vacío o != 4 opciones")
        qs.append({"id": i, "block": b, "theme": d["theme"], "text": q["text"],
                   "options": [{"enchant": o["enchant"], "text": o["text"],
                                "second": m["questions"][i][k]["second"]}
                               for k, o in enumerate(q["options"])]})
for e in ids:
    r = res.get(e)
    if not r: errs.append(f"resultado faltante: {e}"); continue
    for k in ("nombre","subtitulo","frase","descripcion","fortalezas","debilidades","como_te_ven","combina_con","herramienta_ideal"):
        if k not in r: errs.append(f"{e}: falta {k}")
    for c in r.get("combina_con", []):
        if c["id"] not in ids or c["id"] == e: errs.append(f"{e}: combina_con inválido {c['id']}")
if len(qs) != 70: errs.append(f"total {len(qs)}")
if errs:
    print("\n".join(errs)); sys.exit(1)
(D / "preguntas.json").write_text(json.dumps({"enchantments": m["enchantments"], "max": m["max"], "questions": qs}, ensure_ascii=False))
print("OK: 70 preguntas válidas, 14 resultados completos")
