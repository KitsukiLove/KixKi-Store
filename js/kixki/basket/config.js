/*
  Constantes del básquet secreto (cancha, aro, tiros), memoria en localStorage («kixki-bk»), textos y sonido.
*/

import { guardar, leerObjeto } from "../../core/store.js";
export let memoria;

export const ANCHO = 400;

export const ALTO = 260;

export const FLOOR = 236;

export const RADIO_PELOTA = 11;

export const RADIO_ARO = 2.5;

export const GRAVEDAD = 900;

export const SHOTS = 5;

export const WIN_PTS = 6;

export const SPAWN_MIN = 50;

export const SPAWN_MAX = 214;

export const FAR_X = 150;

export const NEED = 10;

/* lanzamientos necesarios para que aparezca la pestaña */

/* ---------- memoria ---------- */
const LSK = "kixki-bk",
  memoriaInicial = { u: 0, best: 0, hoops: 0, shots: 0 };

export const save = () => guardar(LSK, memoria);

/* ---------- textos  [español, English] ---------- */
const lang = () => (window.KXI && KXI.lang === "en" ? 1 : 0);

export const segunIdioma = (p) => p[lang()];

export const TEXTOS = {
  tab: ["Cancha secreta de básquet", "Secret basketball court"],
  title: ["basquet.exe", "hoops.exe"],
  close: ["Cerrar", "Close"],
  pts: ["Puntos", "Points"],
  best: ["Mejor", "Best"],
  hoops: ["Canastas", "Baskets"],
  hint: [
    "Arrastra a Kixki hacia atrás y suéltala para lanzarla. Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro.",
    "Drag Kixki backwards and let go to launch her. Far from the hoop is worth 3 points, close 2, and +1 if she doesn't touch the rim.",
  ],
  zone3: ["3 pts", "3 pts"],
  zone2: ["2 pts", "2 pts"],
  clean: ["¡Limpia!", "Clean!"],
  unlock: [
    [
      "¡Diez lanzamientos! Ya me duele hasta la lana. 😵 …Mira el borde de la pantalla: salió una pestañita.",
      "Ten throws! Even my wool hurts. 😵 …Look at the edge of the screen: a little tab popped up.",
    ],
  ],
  shots: ["Tiros", "Shots"],
  hintMatch: [
    " Cada partida son 5 tiros: con 6 puntos ganas.",
    " A game is 5 throws: score 6 points to win.",
  ],
};

const lastPick = {};

export function pick(list, key) {
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && lastPick[key] === i) i = (i + 1) % list.length;
  lastPick[key] = i;
  return list[i];
}

export const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (a, k) => (v[k] != null ? v[k] : a));

/* ---------- sonido (usa el de la tienda; respeta el interruptor de «Efectos») ---------- */
export const beep = (f, d) => {
  try {
    if (window.KXS) KXS.beep(f, d);
  } catch (e) {
    // El sonido es opcional: si el audio aún no está listo se omite.
  }
};

export const RIM = { x1: 330, x2: 386, y: 112 };

/* aro: borde delantero y trasero */
export const BOARD = { x: 386, w: 8, y1: 52, y2: 118 };

export function iniciar() {
  memoria = leerObjeto(LSK, memoriaInicial);
  /* ---------- cancha (coordenadas lógicas 400 × 260) ---------- */

  /* tablero (pegado al borde derecho) */

  /* una partida: 5 tiros; con 6 puntos o más se gana */
}
