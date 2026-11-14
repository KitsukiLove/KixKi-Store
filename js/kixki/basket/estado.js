/*
  Estado de la partida de básquet: ventana, tiro en curso y marcador (game).
*/

import { FLOOR, RADIO_PELOTA } from "./config.js";
export let game;

export const viva = {
  box: null,
  court: null,
  wrap: null,
  spr: null,
  say: null,
  sayTx: null,
  stats: {},
  sprJ: null,
  sprH: null,
  scale: 1,
  sayT: 0,
  raf: 0,
  st: null,
  lastT: 0,
  matchT: 0,
  skipOn: false,
  open: false,
  tabEl: null,
};

export const dots = [];

export function iniciar() {
  /* a la izquierda de FAR_X valen 3 puntos */

  game = {
    pts: 0,
    shot: 1,
    taken: 0,
    streak: 0,
    state: "ready",
    x0: 100,
    x: 100,
    y: FLOOR - RADIO_PELOTA - 2,
    vx: 0,
    vy: 0,
    ang: 0,
    spin: 0,
    scored: false,
    touched: false,
    restT: 0,
    fly: 0,
    pull: null,
    said: 0,
  };
}
