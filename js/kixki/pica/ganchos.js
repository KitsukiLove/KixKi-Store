/*
  Ganchos para el combate contra vaca.exe (vacaboss.js): volar, rebotar y lanzar.
  Publica la API de la consola: window.KXK3 (bg, close, scene, state, flight, bump, launch).
*/

import { clamp } from "../../core/util.js";
import { EX, H, K, KK, mood, S, viva } from "./base.js";
import { fallOff, startFall, THROW_V } from "./caida.js";
import { pickType, SC, scene } from "./charla.js";
import { memoria, save } from "./memoria.js";
import { bgPrank, canAct, closePrank } from "./travesuras.js";

const flight = () => {
  const F = H.fall;
  return F && F.thrown && !H.held ? { vx: F.vx, vy: F.vy } : null;
};

const bump = (vx, vy) => {
  const F = H.fall;
  if (!F || H.held) return false;
  F.vx = vx;
  F.vy = vy;
  F.thrown = false;
  F.reason = "boss";
  F.bounced = true;
  return true;
};

const launch = (vx, vy) => {
  if (H.held || H.fall || !K.ready || K.off || !S.on || K.mode === "hop") return false;
  EX.stopMove();
  EX.setMode("idle");
  KK.interrupt();
  const n = (memoria.throws = (memoria.throws | 0) + 1);
  save();
  KK.emit("throw", { n });
  startFall({
    vx: clamp(vx, -1500, 1500),
    vy: clamp(vy, -1200, 900),
    thrown: true,
    fly: { said: true },
    reason: "boss",
  });
  if (window.KXS)
    try {
      KXS.baa();
    } catch (_) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
  return true;
};

export function iniciar() {
  /* (parte 6) ganchos para el combate contra vaca.exe (vacaboss.js):
     flight() = si va volando porque la LANZARON (velocidad actual) · bump() = rebote tras un golpe · launch() = lanzarla con una tecla / botón
     (misma física y misma cuenta de lanzamientos que con el dedo; si ya hay otra acción de Kixki en marcha, no hace nada) */

  window.KXK3 = {
    state: memoria,
    THROW_V,
    flight,
    bump,
    launch,
    get held() {
      return !!H.held;
    },
    get flying() {
      return !!H.fall;
    },
    bg: () => (canAct() ? bgPrank() : Promise.resolve(false)),
    close: () => (canAct() ? closePrank() : Promise.resolve(false)),
    scene: (t) => scene((SC[t] || SC[pickType()])()),
    fall: () => fallOff("drag"),
    mood,
    plan: (v) => {
      if (v != null) {
        memoria.plan = v | 0;
        save();
      }
      return memoria.plan;
    },
    thr: (bg, cl) => {
      if (bg != null) viva.thrBg = bg;
      if (cl != null) viva.thrCl = cl;
      viva.sess = Math.max(viva.sess, 180000);
      viva.gapUntil = 0;
    },
  };
}
