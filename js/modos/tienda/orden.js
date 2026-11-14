/*
  Orden de la lista: A–Z, más estrellas o más actualizadas.
*/

import { $$, normalizar as nrm } from "../../core/util.js";
import { nm } from "./comun.js";
import { stat } from "./datos.js";

export const ORD = ["orig", "az", "stars", "fresh"];

export function sortApps(mode) {
  if (!ORD.includes(mode)) mode = "orig";
  $$("#app .cat:not(#favs):not(#news):not(#packs)").forEach((s) => {
    const panel = s.querySelector(".panel"),
      list = [...panel.querySelectorAll(":scope > .app")];
    list.forEach((a, i) => {
      if (a.dataset.o == null) a.dataset.o = i;
    });
    const key = {
      orig: (a) => +a.dataset.o,
      az: (a) => nrm(nm(a)),
      stars: (a) => -(stat(a) ? stat(a).s : -1),
      fresh: (a) => {
        const t = stat(a);
        return -(t ? Date.parse(t.p) || 0 : 0);
      },
    }[mode];
    list.sort((a, b) => {
      const x = key(a),
        y = key(b);
      return x < y ? -1 : x > y ? 1 : +a.dataset.o - +b.dataset.o;
    });
    const tail = panel.querySelector(".kq-none");
    list.forEach((a) => (tail ? panel.insertBefore(a, tail) : panel.append(a)));
  });
}

export function iniciar() {
  /* ---------- orden ---------- */
}
