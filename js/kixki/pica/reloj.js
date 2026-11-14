/*
  Temporizador de travesuras: decide cada cuánto toca una y cuándo se aburre.
*/

import { now, rnd } from "../../core/util.js";
import { KK, elegir, say, viva } from "./base.js";
import { pickType, SC, scene } from "./charla.js";
import { memoria } from "./memoria.js";
import { TEXTOS } from "./textos.js";
import { bgLabel, bgPrank, canAct, closePrank, P } from "./travesuras.js";
let bgIdle, clIdle, nextP, lastAct, prevBg;

export function iniciar() {
  /* =======================================================  RELOJ  */
  bgIdle = 0;
  clIdle = 0;
  nextP = now() + rnd(50000, 90000);
  lastAct = now();
  prevBg = bgLabel();
  ["pointerdown", "keydown", "touchstart", "pointermove"].forEach((ev) =>
    addEventListener(
      ev,
      () => {
        lastAct = now();
      },
      { passive: true, capture: true }
    )
  );
  addEventListener("kixki-bg", () => {
    const l = bgLabel();
    if (l !== prevBg) {
      prevBg = l;
      bgIdle = 0;
      viva.thrBg = rnd(6, 10) * 60000;
    }
  });
  setInterval(() => {
    if (document.hidden) return;
    bgIdle += 4000;
    clIdle += 4000;
    viva.sess += 4000;
    if (!canAct() || KK.mode === "quiet")
      return; /* (4b) «calladita»: ni travesuras ni escenas espontáneas */
    const t = now(),
      idle = t - lastAct;
    if (memoria.pr && t > viva.gapUntil && viva.sess >= 180000) {
      if (bgIdle >= viva.thrBg && Math.random() < 0.5) {
        viva.gapUntil = t + 100000;
        bgIdle = 0;
        bgPrank().catch(() => {
          P.busy = false;
        });
        return;
      }
      if (clIdle >= viva.thrCl && KK.isPC() && idle < 120000 && Math.random() < 0.4) {
        viva.gapUntil = t + 100000;
        clIdle = 0;
        viva.thrCl = rnd(5, 9) * 60000;
        closePrank().catch(() => {
          P.busy = false;
        });
        return;
      }
    }
    if (t >= nextP) {
      nextP = t + rnd(70000, 140000);
      if (idle > 95000 && idle < 400000) {
        say(elegir(TEXTOS.idle, "k3idle"), { p: 1, key: "k3idle", cd: 90000 });
        return;
      }
      if (idle > 240000) return;
      scene(SC[pickType()]()).catch(() => {});
    }
  }, 4000);
}
