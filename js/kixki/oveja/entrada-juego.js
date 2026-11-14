/*
  Coreografía de entrar en la ventana de un minijuego (subir al borde o caerse dentro) con sus efectos de sonido.
*/

import { $, $$, clamp, now, reducirMovimiento as RM } from "../../core/util.js";
import { brain, onFolder, visitFolder } from "./cerebro.js";
import { el } from "./elemento.js";
import { frame, K, place, setMode, V } from "./estado.js";
import { labels } from "./eventos.js";
import { emo, interrupt } from "./globo.js";
import { checkWins, micro } from "./interaccion.js";
import { S } from "./memoria.js";
import { idle0 } from "./modos.js";
import { dust, free, geo, hop, relocate, resync, stopMove, usable, walk } from "./movimiento.js";
import { puente } from "./puente.js";
import { kxs } from "./sueno.js";
import { emit, isPC } from "./utilidades.js";
let wasOff, prevPC;

const sfxAt = (E, list) => list.forEach(([f, d, at]) => E.t.push(setTimeout(() => kxs(f, d), at)));

const sfxTrip = (E) =>
  sfxAt(E, [
    [330, 0.05, 0],
    [270, 0.06, 110],
    [220, 0.07, 230],
  ]);

const sfxFall = (E) =>
  sfxAt(E, [
    [640, 0.06, 0],
    [560, 0.06, 60],
    [480, 0.06, 120],
    [400, 0.06, 180],
    [330, 0.06, 240],
    [270, 0.06, 300],
    [220, 0.06, 360],
  ]);

const sfxThud = (E) =>
  sfxAt(E, [
    [110, 0.12, 0],
    [85, 0.14, 70],
    [900, 0.04, 190],
    [1180, 0.05, 260],
  ]);

const prevSt = {};

function cleanEnter() {
  el.classList.remove("kk-air", "kk-dizzy", "kk-sq");
  el.style.removeProperty("--tilt");
  $$(".kk-sp", el).forEach((x) => x.remove());
}

export function cancelEnter() {
  const E = K.enter;
  if (!E) return false;
  K.enter = null;
  cancelAnimationFrame(E.raf);
  E.t.forEach(clearTimeout);
  E.w.splice(0).forEach((f) => {
    try {
      f();
    } catch (e) {
      // Adorno opcional: su fallo no debe romper lo demás.
    }
  });
  stopMove();
  cleanEnter();
  if (K.mode === "hop" || K.mode === "walk") setMode(K.snooze ? "sleep" : "idle");
  if (!K.snooze) frame("idle");
  emit("enterend", { id: E.id, how: "cancel" });
  return true;
}

export function skipEnter() {
  const E = K.enter;
  if (!E || E.skip) return false;
  E.skip = true;
  cancelAnimationFrame(E.raf);
  E.t.forEach(clearTimeout);
  E.t.length = 0;
  E.w.splice(0).forEach((f) => {
    try {
      f();
    } catch (e) {
      // Adorno opcional: su fallo no debe romper lo demás.
    }
  });
  stopMove();
  return true;
}

function sparks() {
  if (RM()) return;
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("i");
    s.className = "kk-sp";
    s.style.setProperty("--sx", Math.round((i - 2.5) * 15) + "px");
    s.style.setProperty("--sy", -(20 + (i % 2) * 14) + "px");
    el.append(s);
    setTimeout(() => s.remove(), 640);
  }
}

export async function enter(id, o = {}) {
  cancelEnter();
  el.classList.remove("kk-in");
  K.game = true;
  el.classList.add("kk-top");
  const hideNow = () => {
    if (o.hide) el.classList.add("kk-in");
  };
  if (!K.ready || K.off || !S.on || !usable(id)) {
    hideNow();
    return true;
  } /* nada que animar: dormida, escondida o sin sitio */
  const E = { id, fall: !!o.fall, skip: false, raf: 0, t: [], w: [] };
  K.enter = E;
  K.tour = null;
  idle0();
  emit("enter", { id, fall: E.fall });
  const gone = () => K.enter !== E;
  const nap = (ms) =>
    new Promise((r) => {
      E.t.push(setTimeout(r, ms));
      E.w.push(r);
    });
  const tgt = () => {
    try {
      return o.target ? o.target() : null;
    } catch (e) {
      return null;
    }
  };
  const fin = (how) => {
    const tg = E.fall && tgt();
    if (tg) {
      K.x = tg.x;
      K.y = tg.y;
    }
    cleanEnter();
    if (!K.snooze) {
      setMode("idle");
      frame("idle");
    }
    hideNow();
    place();
    if (K.enter === E) K.enter = null;
    emit("enterend", { id, how: how || (E.skip ? "skip" : "done") });
    return true;
  };
  try {
    interrupt();
    if (RM()) {
      /* sin movimiento: fundido corto, sin caída */
      if (E.fall) {
        el.classList.add("kk-in");
        await nap(180);
      } else if (K.stage !== id) await hop(id);
      return gone() ? false : fin();
    }
    /* 1) sube al borde de la ventana (para la caída, empieza lejos del borde por el que se va a caer) */
    const edgeOf = (g) => {
      const t = tgt();
      return t && Math.abs(g.a - t.x) < Math.abs(g.b - t.x) ? g.a : g.b;
    };
    if (K.stage !== id) {
      const g = geo(id),
        ex = edgeOf(g),
        other = ex === g.b ? g.a : g.b;
      await hop(id, E.fall ? ex + (other - ex) * 0.38 : undefined);
    }
    if (gone()) return false;
    if (E.skip) return fin();
    if (!E.fall) return fin("up");
    /* 2) camina hasta el borde */
    const g1 = geo(id);
    if (!g1) return gone() ? false : fin();
    const ex1 = edgeOf(g1);
    await walk(ex1, 66);
    if (gone()) return false;
    if (E.skip) return fin();
    /* 3) se tropieza */
    setMode("idle");
    frame("jump");
    emo("stumble", { p: 2 });
    sfxTrip(E);
    for (const d of [-10, 7, -16]) {
      el.style.setProperty("--tilt", d + "deg");
      await nap(130);
      if (gone()) return false;
      if (E.skip) return fin();
    }
    /* 4) cae dentro de la ventana */
    const x0 = K.x,
      y0 = K.y,
      tg0 = tgt() || { x: x0, y: y0 + 160 },
      T = clamp(Math.sqrt((2 * Math.max(60, tg0.y - y0)) / 1900) * 1000 + 160, 380, 950);
    el.classList.add("kk-air");
    setMode("hop");
    sfxFall(E);
    await new Promise((res) => {
      E.w.push(res);
      const t0 = performance.now();
      const tick = (t) => {
        if (K.enter !== E || E.skip) {
          res();
          return;
        }
        const tg = tgt() || tg0,
          u = Math.min(1, (t - t0) / T);
        K.x = x0 + (tg.x - x0) * (1 - (1 - u) * (1 - u));
        K.y = y0 + (tg.y - y0) * u * u;
        el.style.setProperty("--tilt", Math.round(-330 * u) + "deg");
        place();
        if (u < 1) {
          E.raf = requestAnimationFrame(tick);
          return;
        }
        res();
      };
      E.raf = requestAnimationFrame(tick);
    });
    if (gone()) return false;
    if (E.skip) return fin();
    /* 5) golpe: se chafa, polvo, estrellitas y mareo */
    const tg = tgt() || tg0;
    K.x = tg.x;
    K.y = tg.y;
    el.style.removeProperty("--tilt");
    place();
    setMode("idle");
    frame("idle");
    el.classList.remove("kk-air");
    el.classList.add("kk-sq", "kk-dizzy");
    dust();
    sparks();
    sfxThud(E);
    if (o.onImpact)
      try {
        o.onImpact();
      } catch (e) {
        // Adorno opcional: su fallo no debe romper lo demás.
      }
    emo("fall", { p: 2 });
    await nap(950);
    if (gone()) return false;
    return fin();
  } catch (e) {
    cancelEnter();
    return false;
  }
}

export function scan() {
  V.scanQ = 0;
  $$("#app .cat").forEach((s) => {
    const st = s.classList.contains("min") ? "min" : s.classList.contains("max") ? "max" : "normal",
      p = prevSt[s.id];
    prevSt[s.id] = st;
    if (p === "min" && st !== "min" && K.ready) onFolder(s.id, st);
    /* el usuario cierra una ventana: micro (si Kixki no iba encima y no es una travesura suya) */ else if (
      p &&
      p !== "min" &&
      st === "min" &&
      K.ready &&
      S.on &&
      !K.off &&
      K.stage !== "w:" + s.id &&
      now() >= (K.noMic || 0)
    )
      micro("close", { key: "micro-close", cd: 900 });
  });
  checkWins();
  const gameOpen = !!($("#game") && !$("#game").hidden) || !!($("#bask") && !$("#bask").hidden);
  if (K.game && !gameOpen) {
    K.game = false;
    cancelEnter();
    el.classList.remove("kk-top", "kk-in");
    if (K.ready) {
      if (S.on) relocate();
      else resync();
    }
  } /* (4b) cierran la ventana, incluso a medias: todo limpio */
  const off =
    !!$(".cat.max") ||
    !!$("#boot:not([hidden])") ||
    !!$("#run:not([hidden])") ||
    !!$("#qr:not([hidden])");
  if (off !== wasOff) {
    wasOff = off;
    K.off = off;
    if (off) {
      cancelEnter();
      interrupt();
      stopMove();
      el.classList.add("kk-off");
    } else if (K.ready) {
      el.classList.remove("kk-off");
      const g = geo(K.stage);
      if (!g || (!usable(K.stage) && !free(K.stage))) relocate(true);
      else resync();
      if (K.pend) {
        const id = K.pend;
        K.pend = null;
        setTimeout(() => visitFolder(id, { p: 1, key: "fold:" + id, cd: 30000 }), 700);
      }
      brain(2500);
    }
  }
  if (isPC() !== prevPC) {
    prevPC = isPC();
    K.tour = null;
    if (K.ready) {
      interrupt();
      K.stage = null;
      relocate(true);
    }
  }
}

puente.enter = enter;

puente.cancelEnter = cancelEnter;

export function iniciar() {
  labels();
  /* ---------- vigilante: ventanas, carpetas, pantalla completa, juego ---------- */

  wasOff = true;
  prevPC = isPC();
}
