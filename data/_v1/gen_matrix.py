#!/usr/bin/env python3
"""Genera la matriz de puntuación balanceada del test.

14 encantamientos x 70 preguntas x 4 respuestas.
- Cada encantamiento es respuesta PRINCIPAL (3 pts) exactamente 20 veces.
- Cada respuesta da además 1 pt a un encantamiento "vecino" (afinidad),
  repartido de la forma más pareja posible.
- Dentro de una pregunta los 4 principales son distintos.
Salida: data/matrix.json
"""
import json
import random
import sys
from collections import Counter
from pathlib import Path

SEED = 20261031
ENCH = [
    "reparacion", "irrompibilidad", "fortuna", "toque_seda", "eficiencia",
    "filo", "proteccion", "botin", "espinas", "infinidad",
    "paso_helado", "aspecto_igneo", "lealtad", "sigilo",
]
AFFINITY = {
    "reparacion": ["proteccion", "lealtad", "paso_helado"],
    "irrompibilidad": ["proteccion", "reparacion", "eficiencia"],
    "fortuna": ["botin", "infinidad", "paso_helado"],
    "toque_seda": ["sigilo", "eficiencia", "irrompibilidad"],
    "eficiencia": ["filo", "irrompibilidad", "toque_seda"],
    "filo": ["aspecto_igneo", "eficiencia", "espinas"],
    "proteccion": ["reparacion", "lealtad", "irrompibilidad"],
    "botin": ["fortuna", "infinidad", "aspecto_igneo"],
    "espinas": ["filo", "proteccion", "sigilo"],
    "infinidad": ["fortuna", "botin", "paso_helado"],
    "paso_helado": ["reparacion", "sigilo", "infinidad"],
    "aspecto_igneo": ["filo", "botin", "espinas"],
    "lealtad": ["proteccion", "reparacion", "aspecto_igneo"],
    "sigilo": ["toque_seda", "espinas", "paso_helado"],
}
OFFSET_SETS = [[0, 3, 7, 10], [0, 1, 5, 9], [0, 2, 6, 11], [0, 4, 8, 13], [0, 5, 7, 12]]
N_Q, BLOCKS, PER_BLOCK = 70, 7, 10


def build_sets(rng):
    questions = []
    for offs in OFFSET_SETS:
        labels = ENCH[:]
        rng.shuffle(labels)
        for i in range(14):
            group = [labels[(i + o) % 14] for o in offs]
            rng.shuffle(group)
            questions.append(group)
    return questions


def block_cost(qs):
    """Suma de cuánto se sale cada encantamiento de 2..4 apariciones por bloque."""
    cost = 0
    for b in range(BLOCKS):
        c = Counter(e for q in qs[b * PER_BLOCK:(b + 1) * PER_BLOCK] for e in q)
        for e in ENCH:
            cost += max(0, 2 - c[e]) + max(0, c[e] - 4)
    return cost


def balance_blocks(qs, rng):
    """Intercambia preguntas de lugar hasta que ningún bloque quede desparejo."""
    cost = block_cost(qs)
    for _ in range(40000):
        if cost == 0:
            return True
        i, j = rng.randrange(N_Q), rng.randrange(N_Q)
        if i // PER_BLOCK == j // PER_BLOCK:
            continue
        qs[i], qs[j] = qs[j], qs[i]
        new = block_cost(qs)
        if new <= cost:
            cost = new
        else:
            qs[i], qs[j] = qs[j], qs[i]
    return cost == 0


def main():
    rng = random.Random(SEED)
    for _ in range(200):
        qs = build_sets(rng)
        rng.shuffle(qs)
        if balance_blocks(qs, rng):
            break
    else:
        sys.exit("No se encontró un reparto por bloques balanceado")

    # Secundarios: el vecino menos usado hasta ahora
    used = Counter()
    matrix = []
    for q in qs:
        opts = []
        for prim in q:
            cands = [a for a in AFFINITY[prim] if a not in q or a != prim]
            cands.sort(key=lambda a: (used[a], rng.random()))
            sec = cands[0]
            used[sec] += 1
            opts.append({"main": prim, "second": sec})
        matrix.append(opts)

    prim_count = Counter(o["main"] for q in matrix for o in q)
    assert all(prim_count[e] == 20 for e in ENCH), prim_count
    assert all(len({o["main"] for o in q}) == 4 for q in matrix)

    # Máximo posible por encantamiento (mejor opción de cada pregunta)
    maxpts = {}
    for e in ENCH:
        total = 0
        for q in matrix:
            best = 0
            for o in q:
                pts = 3 if o["main"] == e else (1 if o["second"] == e else 0)
                best = max(best, pts)
            total += best
        maxpts[e] = total

    out = {"enchantments": ENCH, "max": maxpts, "questions": matrix}
    path = Path(__file__).resolve().parent.parent / "data" / "matrix.json"
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(out, ensure_ascii=False, indent=1))

    print("Principales por encantamiento:", dict(prim_count))
    print("Secundarios por encantamiento:", {e: used[e] for e in ENCH})
    print("Máximo posible:", maxpts)
    for b in range(BLOCKS):
        c = Counter(o["main"] for q in matrix[b * PER_BLOCK:(b + 1) * PER_BLOCK] for o in q)
        print(f"Bloque {b+1}:", [c[e] for e in ENCH])


if __name__ == "__main__":
    main()
