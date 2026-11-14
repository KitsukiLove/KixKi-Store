/*
  Construye la colina viva, el menú de estilo y los eventos que la mantienen al día; publica window.KXXP.
*/

import { skyMarkup } from "./cielo.js";
import { charco, puddleLoop, pudT, ringLoop, ringT, viva, wetSet } from "./clima.js";
import { hillY } from "./colina.js";
import { cfg } from "./estaciones.js";
import { box, esIngles, isXP, SVG_NS, variant } from "./estado.js";
import { bird, birdLoop, birdT, star, starLoop, starT } from "./pajaros.js";
import { fxMarkup } from "./particulas.js";
import { grassMarkup, grassStyle } from "./pasto.js";
/* ---- construir ---- */
function build() {
  if (!isXP() || box.querySelector(".xp-grass")) return;
  const top = box.querySelector(".top");
  if (top) top.insertAdjacentHTML("beforeend", skyMarkup());
  const s = document.createElementNS(SVG_NS, "svg");
  s.setAttribute("class", "xp-grass bot");
  s.setAttribute("viewBox", "0 0 64 40");
  s.setAttribute("shape-rendering", "geometricPrecision");
  s.setAttribute("aria-hidden", "true");
  const gs = grassStyle();
  if (gs) s.setAttribute("style", gs);
  s.innerHTML = grassMarkup();
  box.appendChild(s);
  const fx = fxMarkup();
  if (fx) box.insertAdjacentHTML("beforeend", `<div class="xp-fx" aria-hidden="true">${fx}</div>`);
  if (cfg().mist)
    box.insertAdjacentHTML(
      "beforeend",
      `<div class="xp-mist" aria-hidden="true"><i></i><i></i></div>`
    );
  box.classList.toggle("xp-wet", viva.wet);
  if (viva.wet) {
    puddleLoop();
    ringLoop();
  }
  birdLoop(true);
  starLoop();
}

/* Menú: «Fondo: Pixel / Colina XP» (solo si ya ganaste la colina) y «Estación: …», que cambia las estaciones del fondo activo */
function menu() {
  const ref = document.getElementById("s-bg");
  if (!ref || document.getElementById("s-sea") || !window.KXB || !KXB.seasons) return;
  ref.insertAdjacentHTML("afterend", '<button type="button" class="sm" id="s-sea"></button>');
  document.getElementById("s-sea").addEventListener("click", (e) => {
    e.stopPropagation();
    KXB.nextSeason();
    label();
  });
  label();
}

function label() {
  const b = document.getElementById("s-sea"),
    g = document.getElementById("s-bg");
  if (!b || !window.KXB) return;
  const w = KXB.world();
  b.textContent = (esIngles() ? "Season: " : "Estación: ") + KXB.seasonLabel();
  b.hidden = w === "vacas";
  if (g) {
    g.textContent = (esIngles() ? "Background: " : "Fondo: ") + KXB.label();
    g.hidden = !KXB.has("xp");
  }
}

export function iniciar() {
  addEventListener("kixki-bg", () => {
    label();
    if (!isXP()) {
      clearTimeout(pudT);
      clearTimeout(ringT);
      clearTimeout(birdT);
      clearTimeout(starT);
    } else {
      build();
      if (viva.wet) {
        puddleLoop();
        ringLoop();
      }
    }
  });
  addEventListener("kixki-rain", (e) => {
    const t = e.detail && e.detail.t;
    if (t === "start") wetSet(1);
    else if (t === "stop") wetSet(0);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && viva.wet) {
      puddleLoop();
      ringLoop();
    }
  });
  window.KXPAS = {
    wet: wetSet,
    hillY,
    puddles: () => (charco() ? charco().childNodes.length : 0),
    variant,
    bird,
    star,
    fx: () => box.querySelectorAll(".xp-fx .px").length,
    rebuild() {
      const o = box.querySelector(".xp-grass");
      if (o) o.remove();
      [".xp-fx", ".xp-mist", ".xp-sky"].forEach((q) => {
        const e = box.querySelector(q);
        if (e) e.remove();
      });
      build();
    },
  };
  /* si ya estaba lloviendo cuando carga la página */
  if (window.KXRAIN && KXRAIN.raining) ((viva.wet = false), wetSet(1));
  build();
  window.KXR ? menu() : addEventListener("kixki-ready", menu, { once: true });
}
