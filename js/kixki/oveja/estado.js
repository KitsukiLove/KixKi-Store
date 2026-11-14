/*
  Estado de Kixki (K): qué hace, qué dice, cola de frases, memoria reciente y cambios de modo, cuadro y cara.
*/

import { guardar, leer } from "../../core/store.js";
import { $, now, rnd } from "../../core/util.js";
import { bub, el } from "./elemento.js";
import { puente } from "./puente.js";
export let V, recent;

let recT;

export const K = {
  x: 0,
  y: -80,
  dir: 1,
  mode: "idle",
  frame: "idle",
  stage: null,
  talking: false,
  off: true,
  ready: false,
  tour: null,
  hl: null,
  dis: 0,
  game: false,
  pend: null,
  snooze: false,
  poking: false,
  enter: null,
};

export const Q = [];

export const cd = {};

const RECK = "kixki-k-rec";

export const RECN = 30;

export const saveRec = () => {
  clearTimeout(recT);
  recT = setTimeout(() => guardar(RECK, recent), 400);
};

export const setMode = (m) => {
  K.mode = m;
  el.dataset.m = m;
};

export const frame = (f) => {
  if (K.frame !== f) {
    K.frame = f;
    el.dataset.f = f;
  }
};

export const face = (d) => {
  K.dir = d;
  el.style.setProperty("--kd", d);
};

export const place = () => {
  el.style.transform = `translate3d(${Math.round(K.x)}px,${Math.round(K.y)}px,0)`;
  if (!bub.hidden) puente.layoutBubble();
};

export const R = (sel) => {
  const e = typeof sel === "string" ? $(sel) : sel;
  if (!e || e.hidden) return null;
  const r = e.getBoundingClientRect();
  return r.width > 8 && r.height > 4 ? r : null;
};

export function iniciar() {
  /* ---------- estado ---------- */
  V = {
    raf: 0,
    mv: null,
    cur: null,
    nextChat: now() + rnd(16000, 26000),
    mid: 0,
    brainT: 0,
    sT: 0,
    lastAct: now(),
    scanQ: 0,
  };

  /* (parte 2) memoria de no repetir: las últimas 30 frases, guardadas en localStorage (antes 14 y se perdían al recargar) */

  recent = leer(RECK, [])
    .filter((x) => typeof x === "string")
    .slice(-RECN);
  recT = 0;

  /* ---------- plataformas: dónde puede estar Kixki ----------
     Cada plataforma devuelve {a,b,y(x)}: tramo horizontal y altura de los pies. Se recalcula siempre en vivo,
     así ella sigue a la barra o a la ventana aunque se desplace la página o arrastres una ventana. */
}
