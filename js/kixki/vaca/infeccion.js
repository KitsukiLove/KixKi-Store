/*
  Carpetas manchadas: infectar, limpiar con un clic y limpiar todas.
*/

import { $$, reducirMovimiento as RM } from "../../core/util.js";
import { fmt, segunIdioma } from "./config.js";
import { kx, viva } from "./estado.js";
import { infView, sr } from "./hud.js";
import { pip } from "./sonido.js";
import { TEXTOS } from "./textos.js";
import { stars } from "./vaca.js";
/* ---------- carpetas manchadas ---------- */
export function infect(d, quiet) {
  if (!viva.F || viva.F.inf.has(d)) return;
  viva.F.inf.add(d);
  d.classList.add("kv-inf");
  if (!quiet) {
    pip(180);
    const r = d.getBoundingClientRect();
    if (r.width) stars(r.left + r.width / 2, r.top + r.height / 2, 3);
  }
  infView();
}

function cure(d, user) {
  if (!viva.F || !viva.F.inf.has(d)) return;
  viva.F.inf.delete(d);
  d.classList.remove("kv-inf");
  if (user) {
    pip(660);
    setTimeout(() => pip(880), 70);
    viva.F.cures++;
    const r = d.getBoundingClientRect();
    if (r.width) stars(r.left + r.width / 2, r.top + r.height / 2, 4);
    sr(fmt(segunIdioma(TEXTOS.srCure), { n: viva.F.inf.size }));
    if (viva.F.cures === 1 || viva.F.cures % 4 === 0)
      kx(TEXTOS.cure, { key: "cure", cd: 5000, replace: false });
  }
  infView();
}

export function cureAll(fancy) {
  if (!viva.F) return;
  [...viva.F.inf].forEach((d, i) => {
    viva.F.inf.delete(d);
    setTimeout(
      () => {
        d.classList.remove("kv-inf");
        if (fancy && !RM()) {
          const r = d.getBoundingClientRect();
          if (r.width) stars(r.left + r.width / 2, r.top + r.height / 2, 2);
        }
      },
      fancy && !RM() ? i * 60 : 0
    );
  });
  $$("#desk .di.kv-inf").forEach((d) => {
    if (!viva.F || !viva.F.inf.has(d)) d.classList.remove("kv-inf");
  });
}

export function iniciar() {
  document.addEventListener(
    "click",
    (e) => {
      if (!viva.F || viva.F.over) return;
      const d = e.target.closest && e.target.closest("#desk .di.kv-inf");
      if (!d) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      cure(d, true);
    },
    true
  );
}
