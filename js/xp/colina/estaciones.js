/*
  Qué lleva cada estación: briznas, flores, hojas, nieve y su configuración.
*/

import { variant } from "./estado.js";

const ESTACIONES = {
  clasica: { n: 1, hm: 1, fl: 0, tone: [0.3, 0.38, 0.25, 0.07], cl: [8, 1], bird: "b" },
  primavera: {
    n: 1,
    hm: 1,
    fl: 170,
    fc: ["#ff8fc7", "#ffffff", "#ffe27a", "#c7a6ff"],
    tone: [0.26, 0.38, 0.28, 0.08],
    fx: { k: "petal", n: 20, c: ["#ffb7d5", "#ffd3e5", "#fff0f6", "#ff9fc7"], z: [7, 11] },
    cl: [8, 1],
    bird: "b",
  },
  verano: {
    n: 1,
    hm: 1.05,
    fl: 80,
    fc: ["#ffd23a", "#ffffff", "#ff9a3a", "#ffe27a"],
    tone: [0.28, 0.36, 0.28, 0.08],
    fx: { k: "fly", n: 16 },
    cl: [6, 0.9],
    bird: "b",
  },
  otono: {
    n: 0.92,
    hm: 0.95,
    fl: 0,
    tone: [0.3, 0.38, 0.25, 0.07],
    fx: {
      k: "leaf",
      n: 18,
      c: ["#e2802a", "#c9461a", "#f2b13a", "#a8541a", "#d9531e"],
      z: [9, 14],
    },
    cl: [7, 1],
    bird: "g",
  },
  invierno: {
    n: 0.6,
    hm: 0.7,
    fl: 0,
    tone: [0.32, 0.36, 0.24, 0.08],
    fx: { k: "snow", n: 70, c: ["#fff"], z: [3, 7] },
    cl: [9, 1.15],
    bird: "c",
  },
  halloween: {
    n: 0.9,
    hm: 0.95,
    fl: 0,
    tone: [0.34, 0.38, 0.2, 0.08],
    mist: 1,
    cl: [5, 1],
    bird: "bat",
    fx: { k: "fly", n: 10, orange: 1 },
  },
  navidad: {
    n: 0.6,
    hm: 0.7,
    fl: 0,
    tone: [0.3, 0.36, 0.24, 0.1],
    fx: { k: "snow", n: 60, c: ["#fff"], z: [3, 7] },
    cl: [6, 1],
    bird: null,
  },
};

export const cfg = () => ESTACIONES[variant()] || ESTACIONES.clasica;

export function iniciar() {
  /* ---- qué lleva cada estación ----
   n = cantidad de briznas (1 = todas) · hm = altura del pasto · fl = flores · fc = colores de flores
   fx = partículas · sky = nubes (cantidad, tamaño) · bird = qué cruza el cielo */
}
