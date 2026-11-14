/*
  Gotas que caen (lejanas y cercanas), salpicaduras y gotas pegadas en el cristal.
*/

import { rnd, root, TAM_PIXEL } from "./estado.js";
import { alto, ancho, xpOn } from "./lienzos.js";

export const far = [];

export const near = [];

export const MAXFAR = 380;

export const MAXNEAR = 56;

export const PXFAR = 230;

export const PXNEAR = 46;

const onHill = () => xpOn && root.getAttribute("data-bg") === "xp" && window.KXPAS && KXPAS.hillY;

export const splashes = [];

export const gotasCristal = [];

const MAXG = 70;

export const gotas = () => gotasCristal.length;

/* los máximos de abajo valen para el estilo pixel; el XP usa más gotas */
export function mkFar() {
  const d = {};
  resetFar(d, true);
  return d;
}

function landY(x) {
  if (onHill()) {
    const top = KXPAS.hillY(x * TAM_PIXEL) / TAM_PIXEL;
    return rnd(Math.min(alto - 4, top + 3), alto - 2);
  }
  return xpOn
    ? rnd(
        Math.max(alto * 0.4, (innerHeight - Math.max(innerWidth, 640) * 0.4375) / TAM_PIXEL),
        alto - 2
      )
    : rnd(alto * 0.5, alto - 2);
}

export function resetFar(d, any) {
  d.z = Math.random();
  d.x = rnd(-10, ancho + 10);
  d.y = any ? rnd(-10, alto) : rnd(-24, -2);
  d.vy = rnd(3.2, 5.4);
  d.vx = -d.vy * 0.16;
  d.l = Math.round(rnd(3, 6));
  d.ly = landY(d.x);
  d.a = rnd(0.35, 0.7);
  d.s = 0;
}

export function mkNear() {
  const d = {};
  resetNear(d, true);
  return d;
}

export function resetNear(d, any) {
  d.z = Math.random();
  d.x = rnd(-10, ancho + 10);
  d.y = any ? rnd(-20, alto) : rnd(-40, -4);
  d.vy = rnd(7, 10.5);
  d.vx = -d.vy * 0.16;
  d.l = Math.round(rnd(6, 10));
  d.a = rnd(0.45, 0.8);
}

export function addDrop(x, y, r) {
  const d = {
    x: Math.round(x),
    y: Math.round(y),
    r: r || (Math.random() < 0.5 ? 1 : Math.random() < 0.65 ? 2 : Math.random() < 0.8 ? 3 : 4),
    t: 0,
    vy: 0,
    sl: false,
    tr: [],
    a: 1,
    w: rnd(0.6, 1.2),
  };
  gotasCristal.push(d);
  if (gotasCristal.length > MAXG) gotasCristal.shift();
  return d;
}

export function dark() {
  return root.getAttribute("data-theme") === "dark";
}

export function iniciar() {
  /* ---- gotas que caen ---- */
  /* dónde aterriza una gota lejana: con la Colina XP, sobre la colina (KXPAS.hillY da el borde de la colina en píxeles); si no, en la mitad de abajo */
  /* ---- gotas pegadas en el cristal ---- */
}
