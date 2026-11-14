/*
  Cielo: nubes a la deriva en capas y hebras de viento.
*/

import { cfg } from "./estaciones.js";
import { prng, aleatorioEntre, variant } from "./estado.js";
import { redondear2 } from "./pasto.js";

const cloudG = (x, y, k, gid, cls, st) => {
  const P = [
    [-5, 1.2, 3],
    [-2, -0.6, 4.2],
    [2.4, 0.1, 3.6],
    [5.8, 1.4, 2.8],
    [-3, 1.9, 3],
    [1.2, 2, 3.2],
  ];
  return (
    `<g class="c ${cls}" style="${st}"><g transform="translate(${redondear2(x)} ${redondear2(y)}) scale(${redondear2(k)})">` +
    P.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="url(#${gid})"/>`).join("") +
    `<ellipse cx="0" cy="2.4" rx="8" ry="1.6" fill="url(#${gid})"/></g></g>`
  );
};

export function skyMarkup() {
  const c = cfg(),
    r = prng(31337 + variant().length * 17),
    [cn, ck] = c.cl;
  let s = "";
  /* nubes: de arriba (lejos, pequeñas, lentas) a abajo (cerca, grandes, más rápidas) */
  for (let i = 0; i < cn; i++) {
    const f = (i + 0.5) / cn,
      y = 2 + f * 9.5 + aleatorioEntre(r, -0.8, 0.8),
      k = (0.4 + 0.55 * f) * ck * aleatorioEntre(r, 0.85, 1.15),
      dur = Math.round(aleatorioEntre(r, 300, 420) - f * 150);
    s += cloudG(
      aleatorioEntre(r, 10, 54),
      y,
      k,
      "xpcl",
      "",
      `--cd:${dur}s;--cl:-${redondear2(aleatorioEntre(r, 0, dur))}s`
    );
  }
  /* nubes de tormenta: solo se ven con lluvia (opacidad con --wg), pasan más rápido */
  for (let i = 0; i < 5; i++)
    s += cloudG(
      aleatorioEntre(r, 8, 56),
      1.8 + i * 2.1 + aleatorioEntre(r, -0.4, 0.4),
      aleatorioEntre(r, 0.95, 1.35),
      "xpcs",
      "cs",
      `--cd:${Math.round(aleatorioEntre(r, 95, 150))}s;--cl:-${redondear2(aleatorioEntre(r, 0, 90))}s`
    );
  /* hebras de viento */
  for (let i = 0; i < 7; i++) {
    const y = 1.5 + r() * 10;
    s += `<path class="xw1" d="M0 0C2 -.8 4 .8 6.4 0S10.6 -.7 12.4 .1" style="--wy:${redondear2(y)}px;--wd:${redondear2(aleatorioEntre(r, 8, 15))}s;--wl:-${redondear2(aleatorioEntre(r, 0, 14))}s"/>`;
  }
  return `<g class="xp-sky">${s}</g>`;
}

export function iniciar() {
  /* ---- cielo: nubes a la deriva, hebras de viento ---- */
}
