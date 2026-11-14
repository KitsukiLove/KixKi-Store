/*
  Estado de la lluvia: modo, intensidad, cuánto llevamos sin tocar y contadores del cristal.
*/

import { leer } from "../../core/store.js";
export let root, viva;

export const TAM_PIXEL = 3;

export const rnd = (a, b) => a + Math.random() * (b - a);

export const now = () => Date.now();

export const emit = (t, d) =>
  dispatchEvent(new CustomEvent("kixki-rain", { detail: Object.assign({ t }, d) }));

export function iniciar() {
  /* tamaño del "pixel" de la lluvia, en píxeles reales */
  root = document.documentElement;

  viva = {
    loop: 0,
    inten: 0,
    spawnT: 0,
    glassFired: false,
    raining: false,
    strength: 1,
    rainEnd: 0,
    lastAct: 0,
    nextRain: 0,
    mode: leer("kixki-rain", "auto"),
    wipedTotal: 0,
    sndHinted: false,
    auClose: 0,
    au: null,
    rsOn: leer("kixki-rainsnd", true),
    idleMs: 12000,
  };
  if (!["auto", "on", "off"].includes(viva.mode)) viva.mode = "auto";
  viva.nextRain = now() + rnd(30000, 110000);
  viva.lastAct = now();
}
