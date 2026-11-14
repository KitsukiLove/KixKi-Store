/*
  Crea el elemento #kixki (la oveja) en la página y guarda las referencias a sus partes.
*/

import { $ } from "../../core/util.js";
import { FOTOGRAMAS, svg } from "./sprites.js";
export let el, body, bub, gh, vi, sr, bx;

export function iniciar() {
  /* ---------- DOM ---------- */
  el = document.createElement("div");
  el.id = "kixki";
  el.dataset.f = "idle";
  el.dataset.m = "idle";
  el.classList.add("kk-off");
  el.innerHTML =
    `<div class="kk-sh"></div><button type="button" class="kk-body"><span class="kk-flip">${Object.keys(
      FOTOGRAMAS
    )
      .map((k) => svg(FOTOGRAMAS[k], k))
      .join(
        ""
      )}</span><span class="kk-zz" aria-hidden="true">z<i style="font-style:normal">Z</i></span><span class="kk-stars" aria-hidden="true"><i>★</i><i>✦</i><i>★</i></span></button>` +
    `<div class="kk-bub" hidden><span class="kk-nm">Kixki</span><button type="button" class="kk-x">✕</button><p class="kk-tx"><span class="g" aria-hidden="true"></span><span class="v" aria-hidden="true"></span></p>` +
    `<svg class="kk-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div>` +
    `<div class="kk-sr" role="status" aria-live="polite"></div>`;
  document.body.append(el);
  body = $(".kk-body", el);
  bub = $(".kk-bub", el);
  gh = $(".g", bub);
  vi = $(".v", bub);
  sr = $(".kk-sr", el);
  bx = $(".kk-x", el);
}
