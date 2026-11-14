/*
  Enganche con Kixki: evento «kixki-game» (start · retry) y apertura de la ventana.
*/

import { open } from "./juego.js";
let bound;

function bind(g) {
  if (bound) return;
  bound = true;
  g.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".x")) return;
    if (e.pointerType === "mouse" && e.button) return;
    g._j && g._j();
  });
  addEventListener("keydown", (e) => {
    if (g.hidden || e.key !== "ArrowDown") return;
    e.preventDefault();
    g._fastOn && g._fastOn(true);
  });
  addEventListener("keyup", (e) => {
    if (e.key === "ArrowDown") g._fastOn && g._fastOn(false);
  });
}

export function iniciar() {
  /* controles: ratón/táctil sobre la caja y ↓ para bajar rápido */
  bound = false;
  window.KXG = {
    open(g) {
      bind(g);
      open(g);
    },
  };
}
