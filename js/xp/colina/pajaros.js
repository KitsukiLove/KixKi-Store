/*
  Pájaros (gansos en otoño, murciélagos en Halloween) y estrella fugaz de noche.
*/

import { reducirMovimiento as RM } from "../../core/util.js";
import { cfg } from "./estaciones.js";
import { box, dark, isXP, SVG_NS, paused } from "./estado.js";
import { redondear2 } from "./pasto.js";
import { puente } from "./puente.js";
export let birdT, starT;

const sky = () => box.querySelector(".xp-sky");

function wing(side, sx, sy, sc, kind, fd, fs) {
  /* alas con la base en (0,0) del pájaro; se mueven con CSS */
  const d =
    kind === "bat"
      ? side < 0
        ? "M0 0L-.45 -.4L-.85 -.08L-.6 .05L-.35 .18L0 .1Z"
        : "M0 0L.45 -.4L.85 -.08L.6 .05L.35 .18L0 .1Z"
      : side < 0
        ? "M0 0Q-.5 -.52 -1.05 -.1"
        : "M0 0Q.5 -.52 1.05 -.1";
  return `<g transform="translate(${redondear2(sx)} ${redondear2(sy)}) scale(${redondear2(sc)})"><path class="bw ${side < 0 ? "wl" : "wr"}" d="${d}" style="--f:${fs}s;--fd:-${fd}s"/></g>`;
}

function flock(kind) {
  const r = Math.random,
    right = r() < 0.5,
    y0 = 2.2 + r() * 8.5,
    dy = (r() - 0.5) * 4,
    t = kind === "g" ? 24 + r() * 10 : kind === "bat" ? 15 + r() * 6 : 14 + r() * 8;
  const x0 = right ? -6 : 70,
    x1 = right ? 70 : -6;
  const fs = kind === "g" ? 0.9 : kind === "bat" ? 0.22 : 0.42;
  let n,
    body = "";
  const sc = kind === "g" ? 1.05 : kind === "bat" ? 0.9 : 0.8 + r() * 0.4;
  if (kind === "g") {
    n = 5 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const k = Math.ceil(i / 2),
        sd = i % 2 ? 1 : -1,
        px = (right ? -1 : 1) * k * -1.15 * sc * 1.4,
        py = sd * k * 0.62;
      body += wing(-1, px, py, sc, "b", r() * 0.9, fs) + wing(1, px, py, sc, "b", r() * 0.9, fs);
    }
  } else {
    n = kind === "bat" ? 3 + Math.floor(r() * 4) : 1 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const px = (r() - 0.5) * 4.2,
        py = (r() - 0.5) * 2.6,
        s2 = sc * (0.75 + r() * 0.5),
        fd = r() * 0.5,
        f = fs * (0.85 + r() * 0.4);
      body += wing(-1, px, py, s2, kind, fd, f) + wing(1, px, py, s2, kind, fd, f);
    }
  }
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "xp-bd" + (kind === "bat" ? " bat" : ""));
  g.setAttribute(
    "style",
    `--x0:${x0}px;--y0:${redondear2(y0)}px;--x1:${x1}px;--y1:${redondear2(y0 + dy)}px;--y2:${redondear2(y0 + (r() - 0.5) * 5)}px;--y3:${redondear2(y0 + (r() - 0.5) * 5)}px;--t:${redondear2(t)}s`
  );
  /* los pájaros que vuelan hacia la izquierda se voltean (el grupo interior lleva el espejo) */
  g.innerHTML = `<g${right ? "" : ' transform="scale(-1 1)"'}>${body}</g>`;
  g.addEventListener("animationend", () => g.remove());
  return g;
}

export function bird(kind) {
  const sk = sky();
  if (!sk || RM()) return null;
  kind = kind || cfg().bird;
  if (!kind) return null;
  if (kind === "c") kind = "b";
  const g = flock(kind);
  sk.appendChild(g);
  return g;
}

export function star() {
  const sk = sky();
  if (!sk || RM()) return null;
  const x = 14 + Math.random() * 34,
    y = 1 + Math.random() * 5,
    e = document.createElementNS(SVG_NS, "path");
  e.setAttribute("class", "xp-ss");
  e.setAttribute("d", `M${redondear2(x)} ${redondear2(y)}l2.4 -.9`);
  e.setAttribute("style", "--sx:-13px;--sy:6px");
  e.addEventListener("animationend", () => e.remove());
  sk.appendChild(e);
  return e;
}

export function birdLoop(first) {
  clearTimeout(birdT);
  birdT = setTimeout(
    () => {
      if (isXP() && !document.hidden && !paused() && !puente.viva.wet) {
        const c = cfg(),
          n = dark();
        const sk = sky();
        if (sk && c.bird === "bat") {
          if (!sk.querySelector(".xp-bd")) bird("bat");
        } else if (sk && c.bird && !n && !sk.querySelector(".xp-bd")) bird(c.bird);
      }
      birdLoop();
    },
    first ? 7000 + Math.random() * 6000 : 24000 + Math.random() * 34000
  );
}

export function starLoop() {
  clearTimeout(starT);
  starT = setTimeout(
    () => {
      if (isXP() && dark() && !document.hidden && !paused() && !puente.viva.wet) star();
      starLoop();
    },
    18000 + Math.random() * 40000
  );
}

export function iniciar() {
  /* ---- pájaros (y gansos, murciélagos, estrella fugaz) ---- */

  birdT = 0;
  starT = 0;
}
