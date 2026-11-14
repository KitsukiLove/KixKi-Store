/*
  Enganche con Kixki (KXK) y la lista de carpetas del escritorio: lo que necesitan los demás módulos.
*/

import { $, $$ } from "../../core/util.js";
export let KK, K, ADV, desk;

let estadoKixki;

/** Toma KXK y el escritorio; devuelve false si Kixki aún no está o ya se inició (entonces no hay nada que hacer). */
export function preparar() {
  if (window.KXK4 || !window.KXK) return false;
  KK = KXK;
  K = KK.K;
  estadoKixki = KK.state;
  ADV = (KK.D && KK.D.ADV) || {};
  desk = $("#desk");
  return !!desk;
}

export const indiceIdioma = () => (window.KXI && KXI.lang === "en" ? 1 : 0);

export const HOLD = 500,
  MOVE_MOUSE = 6,
  MOVE_TOUCH = 10;

export const ready = () => !!estadoKixki.on && KK.ready && !K.off && !K.game;

export const foldIds = () => $$("#app .cat").map((e) => e.id);
