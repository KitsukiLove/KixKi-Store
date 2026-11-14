/*
  Limpiar el cristal con el dedo o el ratón y detectar que sigues ahí.
*/

import { emit, now, TAM_PIXEL, viva } from "./estado.js";
import { wake } from "./fotograma.js";
import { gotasCristal } from "./gotas.js";
import { lienzoAtras, fit } from "./lienzos.js";

const act = () => {
  viva.lastAct = now();
};

/* ---- el visitante ---- */
export function wipe(x, y, r) {
  const cx = x / TAM_PIXEL,
    cy = y / TAM_PIXEL,
    rr = r / TAM_PIXEL;
  let n = 0;
  for (let i = gotasCristal.length - 1; i >= 0; i--) {
    const d = gotasCristal[i];
    const dx = d.x - cx,
      dy = d.y - cy;
    if (dx * dx + dy * dy <= (rr + d.r) * (rr + d.r)) {
      gotasCristal.splice(i, 1);
      n++;
    } else if (
      d.tr.length &&
      d.tr.some((q) => (q.x - cx) * (q.x - cx) + (q.y - cy) * (q.y - cy) <= rr * rr)
    )
      d.tr.length = 0;
  }
  if (n) {
    viva.wipedTotal += n;
    emit("wipe", { n: viva.wipedTotal, k: n });
  }
}

export function iniciar() {
  addEventListener(
    "pointermove",
    (e) => {
      act();
      if (gotasCristal.length) wipe(e.clientX, e.clientY, 30);
    },
    { passive: true }
  );
  addEventListener(
    "pointerdown",
    (e) => {
      act();
      if (gotasCristal.length) wipe(e.clientX, e.clientY, 48);
    },
    { passive: true, capture: true }
  );
  ["keydown", "wheel", "scroll", "touchstart"].forEach((ev) =>
    addEventListener(ev, act, { passive: true, capture: true })
  );
  addEventListener("resize", () => {
    if (lienzoAtras.isConnected) fit();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      viva.lastAct = now();
      if (viva.raining || gotasCristal.length) wake();
    }
  });
}
