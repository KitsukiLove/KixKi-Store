/*
  El pasto: ~1000 briznas con semilla fija, agrupadas por profundidad, y su estilo de viento.
*/

import { at, hdp, COLINA, MAIN } from "./colina.js";
import { cfg } from "./estaciones.js";
import { prng } from "./estado.js";

export const redondear2 = (n) => +n.toFixed(2);

const blade = (x, y, h, l, w) =>
  `M${redondear2(x - w)} ${redondear2(y)}Q${redondear2(x - w * 0.15)} ${redondear2(y - h * 0.55)} ${redondear2(x + l)} ${redondear2(y - h)}Q${redondear2(x + w * 0.55)} ${redondear2(y - h * 0.45)} ${redondear2(x + w)} ${redondear2(y)}Z`;

const dot = (x, y, r) =>
  `M${redondear2(x - r)} ${redondear2(y)}a${redondear2(r)} ${redondear2(r)} 0 1 0 ${redondear2(r * 2)} 0a${redondear2(r)} ${redondear2(r)} 0 1 0 ${redondear2(-r * 2)} 0Z`;

const BANDS = 14;

const TONES = ["b3", "b2", "b1", "bp", "f1", "f2", "f3", "f4"];

export function grassMarkup() {
  const c = cfg(),
    small = innerWidth < 720 || (matchMedia("(pointer:coarse)").matches && innerWidth < 1000),
    CH = small ? 6 : 10;
  const N = Math.round((small ? 520 : 1000) * c.n),
    r = prng(20260);
  const G = Array.from({ length: BANDS }, () =>
    Array.from({ length: CH }, () => TONES.map(() => ""))
  );
  const add = (x, d, k, path) => {
    G[Math.min(BANDS - 1, Math.floor(d * BANDS))][Math.min(CH - 1, Math.floor((x / 64) * CH))][k] +=
      path;
  };
  const tw = c.tone,
    cum = [tw[0], tw[0] + tw[1], tw[0] + tw[1] + tw[2]];
  for (let n = 0; n < N; n++) {
    const x = r() * 64,
      tuft = r() < 0.07,
      d = tuft ? 0.93 + r() * 0.07 : Math.pow(r(), 1.5),
      yt = at(MAIN, x),
      y = yt + d * (40 - yt) + 0.05;
    const h = (0.16 + 1.75 * Math.pow(d, 1.25)) * (0.72 + 0.55 * r()) * (tuft ? 1.55 : 1) * c.hm,
      w = (0.045 + 0.1 * d) * (0.8 + 0.45 * r()) * (tuft ? 1.25 : 1),
      l = (r() - 0.42) * h * 0.5;
    /* las de delante son más claras; las del fondo, más oscuras y apagadas */
    const q = r(),
      k =
        d > 0.6
          ? q < 0.12
            ? 0
            : q < 0.38
              ? 1
              : q < 0.8
                ? 2
                : 3
          : q < cum[0]
            ? 0
            : q < cum[1]
              ? 1
              : q < cum[2]
                ? 2
                : 3;
    add(x, d, k, blade(x, y, h, l, w));
  }
  /* flores: un tallo fino con una cabeza redonda en la punta, repartidas por la colina (más hacia delante) */
  if (c.fl) {
    const rf = prng(777),
      NF = Math.round(c.fl * (small ? 0.55 : 1));
    for (let n = 0; n < NF; n++) {
      const x = rf() * 64,
        d = 0.32 + Math.pow(rf(), 0.8) * 0.66,
        yt = at(MAIN, x),
        y = yt + d * (40 - yt) + 0.05,
        h = (0.3 + 0.85 * d) * (0.8 + 0.4 * rf()),
        rd = 0.07 + 0.07 * d * (0.7 + 0.5 * rf()),
        k = 4 + Math.floor(rf() * 4);
      add(x, d, 0, blade(x, y, h, (rf() - 0.5) * 0.1, 0.025 + 0.015 * d));
      add(x, d, k, dot(x, y - h, rd));
    }
  }
  /* destello de luz: una franja suave que recorre la colina junto con la ráfaga */
  const clip = [0, 1, 2].map((i) => `<path d="${hdp(COLINA[i])}"/>`).join("");
  let s =
    `<defs><linearGradient id="xppd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef7ff" stop-opacity=".9"/><stop offset="1" stop-color="#7db5f0" stop-opacity=".7"/></linearGradient>` +
    `<linearGradient id="xpshn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<clipPath id="xpcp">${clip}</clipPath></defs>` +
    `<g clip-path="url(#xpcp)"><g class="xp-sheen"><rect x="-2" y="8" width="22" height="34" fill="url(#xpshn)" transform="skewX(-18)"/></g></g><g class="xp-pd"></g>`;
  for (let b = 0; b < BANDS; b++) {
    const rb = prng(900 + b),
      d = (b + 0.5) / BANDS;
    s += `<g class="gw" style="--sa:${redondear2(0.9 + 1.3 * d)}deg;--sd:${redondear2(2.6 + rb() * 1.8)}s;--sl:${redondear2(-rb() * 4)}s">`;
    for (let ch = 0; ch < CH; ch++) {
      const cx = ((ch + 0.5) * 64) / CH;
      s +=
        `<g class="gt" style="--dl:${redondear2(cx * 0.075 - 9 + (b % 3) * 0.12)}s;--gs:${redondear2(0.78 + rb() * 0.5)}">` +
        TONES.map((t, k) => (G[b][ch][k] ? `<path class="${t}" d="${G[b][ch][k]}"/>` : "")).join(
          ""
        ) +
        `</g>`;
    }
    s += `</g>`;
  }
  return s + `<g class="xp-rg"></g>`;
}

export function grassStyle() {
  const c = cfg().fc;
  return c ? `--f1:${c[0]};--f2:${c[1]};--f3:${c[2]};--f4:${c[3]}` : "";
}

export function iniciar() {
  /* ---- pasto ---- */
}
