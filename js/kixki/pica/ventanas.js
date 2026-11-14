/*
  Qué le pasa si mueves, cierras o minimizas la ventana donde está subida.
*/

import { $, now } from "../../core/util.js";
import { H, K, KK } from "./base.js";
import { fallOff } from "./caida.js";
export let wd;

let app;

const endWd = () => {
  if (wd) {
    const id = "w:" + wd.s.id;
    wd = null;
    setTimeout(() => {
      if (H.skip === id) H.skipUntil = 0;
    }, 650);
  }
};

export const lastTouch = {};

export function iniciar() {
  /* ---- ventana movida por ti, con ella encima ---- */
  wd = null;
  addEventListener(
    "pointerdown",
    (e) => {
      if (!KK.isPC() || e.button || !e.target.closest) return;
      const tb = e.target.closest(".cat .tb");
      if (!tb || e.target.closest(".wb")) return;
      const s = tb.closest(".cat");
      if (s.classList.contains("max")) return;
      wd = { s, x: e.clientX, y: e.clientY, on: false };
    },
    true
  );
  addEventListener(
    "pointermove",
    (e) => {
      if (!wd || wd.on) return;
      if (Math.hypot(e.clientX - wd.x, e.clientY - wd.y) < 8) return;
      wd.on = true;
      if (K.stage === "w:" + wd.s.id) {
        H.skip = K.stage;
        H.skipUntil = Infinity;
        fallOff("drag");
      }
    },
    true
  );

  addEventListener("pointerup", endWd, true);
  addEventListener("pointercancel", endWd, true);
  /* ---- ventana cerrada o minimizada con ella encima ---- */

  addEventListener(
    "pointerdown",
    (e) => {
      const s = e.target.closest && e.target.closest(".cat");
      if (s) lastTouch[s.id] = now();
    },
    true
  );
  app = $("#app");
  if (app)
    new MutationObserver(() => {
      if (H.held || H.fall) return;
      const st = K.stage;
      if (!st || !st.startsWith("w:")) return;
      const s = document.getElementById(st.slice(2));
      if (s && s.classList.contains("min")) {
        H.skip = st;
        H.skipUntil = now() + 700;
        fallOff("close");
      }
    }).observe(app, { subtree: true, attributes: true, attributeFilter: ["class"] });
}
