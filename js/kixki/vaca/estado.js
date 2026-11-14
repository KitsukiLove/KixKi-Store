/*
  Estado del combate: referencia a Kixki, partida en curso (F), carpetas manchadas y atajos de ayuda.
*/

import { $$ } from "../../core/util.js";

export const viva = {
  hud: null,
  live: null,
  cowEl: null,
  dw: 0,
  seen: false,
  goal: 0,
  pend: false,
  F: null,
  bar: null,
  barPause: null,
  barRestore: null,
  menuBtn: null,
  callBtn: null,
  KK: null,
  K: null,
  S: null,
};

export const kx = (msg, o) =>
  viva.KK.say(
    msg,
    Object.assign({ p: 3, cat: "ev", ctx: "boss", always: true, replace: true, ttl: 3600 }, o || {})
  );

export const pickPair = (list, key) => viva.KK.pick(list, "kv-" + key);

export const cowWin = () => document.querySelector(".vp.cow");

export const cowFriend = () => !!(window.KXQ && KXQ.state && KXQ.state.c && KXQ.state.c.cow);

export const icons = () => $$("#desk .di");

export const busy = () => !!viva.F || viva.pend;

export function iniciar() {
  /* ---------- ayudas ---------- */
  /* ---------- estado del combate ---------- */
  /* combate en marcha (null = no hay) */
  /* aviso previo en curso */
  /* tiempo con la ventana de la vaca abierta */
}
