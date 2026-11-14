/*
  Modos de charla (charlatana / normal / calladita), cuándo está ocupada o bloqueada para hablar y detección de usuario escribiendo.
*/

import { leerTexto } from "../../core/store.js";
import { now } from "../../core/util.js";
import { K, V } from "./estado.js";
import { S } from "./memoria.js";
import { DLG } from "./movimiento.js";
import { puente } from "./puente.js";
import { isPC } from "./utilidades.js";

export const MODES = {
  chat: { budget: 9, gap: 8000, chat: 0.55, amb: true, words: true },
  normal: { budget: 5, gap: 15000, chat: 1, amb: true, words: true },
  quiet: { budget: 1, gap: 45000, chat: 2.5, amb: false, words: false },
};

export const modoActual = () => MODES[S.mode] || MODES.normal;

export const usuario = { typeAt: 0, win: false };

export const typing = () => now() - usuario.typeAt < 1500;

export const busy = () => typing() || usuario.win || K.game;

export const idle0 = () => {
  if (
    V.cur &&
    (V.cur.cat === "sp" || V.cur.cat === "amb" || V.cur.cat === "mic" || V.cur.opt) &&
    !V.cur.always
  )
    puente.done(V.cur, "busy");
};

const winUp = () => {
  usuario.win = false;
};

export const DBG = { on: false };

export const LOG = [];

export function applyMode() {
  const m = modoActual();
  DLG.budget = m.budget;
  DLG.gap.sp = m.gap;
  DLG.sp = [];
}

/* ¿esta frase debe callarse ahora? (los eventos físicos y las respuestas directas con p ≥ 3 nunca) */
export function blocked(m) {
  if (m.always) return false;
  const soft =
    m.cat === "sp" || m.cat === "amb" || m.cat === "mic" || m.opt || (m.cat === "ui" && m.p < 3);
  if (!soft) return false;
  if (busy()) return true;
  const md = modoActual();
  if (!md.amb && (m.cat === "amb" || m.opt)) return true;
  return false;
}

export function registrar(ev, m, x) {
  const r = { t: Math.round(performance.now()), ev };
  if (m) {
    r.id = m.id;
    r.cat = m.cat;
    r.p = m.p;
    if (m.key) r.key = m.key;
    r.txt = m.text.slice(0, 28);
  }
  if (x !== undefined) r.x = x;
  LOG.push(r);
  if (LOG.length > 400) LOG.shift();
  if (DBG.on)
    try {
      console.log(
        "[kixki] " +
          r.t +
          "ms " +
          ev +
          " #" +
          (r.id || "-") +
          " " +
          (r.cat || "") +
          " " +
          (r.key || "") +
          " " +
          (x !== undefined ? x : "") +
          " " +
          (r.txt || "")
      );
    } catch (e) {
      // Sin consola disponible no hay nada más que hacer.
    }
}

export function iniciar() {
  /* (parte 2) modo de charla: cambia el presupuesto de espontáneas, la pausa entre ellas y cada cuánto charla sola */

  applyMode();
  /* (parte 2) no hablar mientras escribes, arrastras una ventana o juegas */

  addEventListener(
    "keydown",
    (e) => {
      const t = e.target;
      if (
        !t ||
        !t.closest ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key === "Shift" ||
        e.key === "Escape"
      )
        return;
      if (t.closest("input,textarea,[contenteditable=true]")) {
        usuario.typeAt = now();
        idle0();
      }
    },
    true
  );
  addEventListener(
    "pointerdown",
    (e) => {
      if (!e.target || !e.target.closest) return;
      if (!e.target.closest("input,textarea"))
        usuario.typeAt = 0; /* un clic fuera del campo = ya no estás escribiendo */
      if (!isPC() || e.button) return;
      const tb = e.target.closest(".cat .tb");
      if (tb && !e.target.closest(".wb")) {
        usuario.win = true;
        idle0();
      }
    },
    true
  );

  addEventListener("pointerup", winUp, true);
  addEventListener("pointercancel", winUp, true);

  DBG.on = /[?&]kxdebug(=1)?(&|$)/.test(location.search) || leerTexto("kixki-dbg") === "1";
}
