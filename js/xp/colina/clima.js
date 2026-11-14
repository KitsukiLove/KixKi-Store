/*
  Clima: lluvia con charcos, ondas y suelo mojado.
*/

import { reducirMovimiento as RM } from "../../core/util.js";
import { at, MAIN } from "./colina.js";
import { box, SVG_NS, paused, variant } from "./estado.js";
import { redondear2 } from "./pasto.js";
import { puente } from "./puente.js";
export let pudT, ringT;

let dryT;

export const viva = { wet: false };

const maxPud = () => (innerWidth < 720 ? 4 : 7);

const noPud = () => /^(invierno|navidad)$/.test(variant());

export const charco = () => box.querySelector(".xp-pd");

const onda = () => box.querySelector(".xp-rg");

function crearElemento(tag, cls, at) {
  const e = document.createElementNS(SVG_NS, tag);
  if (cls) e.setAttribute("class", cls);
  for (const k in at) e.setAttribute(k, at[k]);
  return e;
}

function addPuddle() {
  const g = charco();
  if (!g || g.childNodes.length >= maxPud() || RM() || noPud()) return;
  const x = 5 + Math.random() * 54,
    yt = at(MAIN, x),
    dd = 0.52 + Math.random() * 0.4,
    y = yt + (40 - yt) * dd,
    rx = 0.5 + 2.8 * dd * (0.7 + Math.random() * 0.6);
  const e = crearElemento("ellipse", "xp-pud", {
    cx: redondear2(x),
    cy: redondear2(y),
    rx: redondear2(rx),
    ry: redondear2(rx * 0.18),
  });
  e.style.setProperty("--ps", "0");
  g.appendChild(e);
  requestAnimationFrame(() => requestAnimationFrame(() => e.style.setProperty("--ps", "1")));
}

export function puddleLoop() {
  clearTimeout(pudT);
  if (!viva.wet) return;
  if (!document.hidden && !paused()) addPuddle();
  pudT = setTimeout(puddleLoop, 4500 + Math.random() * 5500);
}

/* ondas dentro de los charcos */
export function ringLoop() {
  clearTimeout(ringT);
  if (!viva.wet) return;
  const g = onda(),
    p = charco();
  if (
    g &&
    p &&
    !document.hidden &&
    !paused() &&
    !RM() &&
    g.childNodes.length < 16 &&
    p.childNodes.length
  ) {
    const ps = p.childNodes,
      q = ps[Math.floor(Math.random() * ps.length)];
    if (+q.style.getPropertyValue("--ps") > 0.35) {
      const rx = +q.getAttribute("rx"),
        x = +q.getAttribute("cx") + (Math.random() - 0.5) * rx * 1.3,
        y = +q.getAttribute("cy") + (Math.random() - 0.5) * rx * 0.18;
      const e = crearElemento("ellipse", "xp-ring", {
        cx: redondear2(x),
        cy: redondear2(y),
        rx: redondear2(Math.max(0.25, rx * 0.35)),
        ry: redondear2(Math.max(0.25, rx * 0.35) * 0.2),
      });
      e.addEventListener("animationend", () => e.remove());
      g.appendChild(e);
    }
  }
  const k = window.KXRAIN && KXRAIN.intensity != null ? Math.max(0.3, KXRAIN.intensity) : 1;
  ringT = setTimeout(ringLoop, (260 + Math.random() * 420) / k);
}

export function wetSet(v) {
  v = !!v;
  if (v === viva.wet) return;
  viva.wet = v;
  box.classList.toggle("xp-wet", viva.wet);
  clearTimeout(dryT);
  if (viva.wet) {
    puddleLoop();
    ringLoop();
  } else {
    clearTimeout(pudT);
    clearTimeout(ringT);
    const p = charco();
    if (p) {
      [].forEach.call(p.childNodes, (e) => {
        e.style.setProperty("--ps", "0");
      });
      dryT = setTimeout(() => {
        if (!viva.wet) {
          const q = charco();
          if (q) q.textContent = "";
          const r = onda();
          if (r) r.textContent = "";
        }
      }, 36000);
    }
  }
}

export function iniciar() {
  /* ---- clima ---- */

  pudT = 0;
  ringT = 0;
  dryT = 0;

  puente.viva = viva;
}
