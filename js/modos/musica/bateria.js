/*
  Batería y base común de las piezas.
*/

export const BATERIA = {
  px: {
    k: [0, 4],
    r: [
      [2, 0.5],
      [6, 0.5],
    ],
    h: [
      [1, 0.6],
      [3, 0.6],
      [5, 0.6],
      [7, 0.6],
    ],
  },
  pxs: {
    k: [0],
    r: [[6, 0.45]],
    h: [
      [2, 0.5],
      [6, 0.5],
    ],
  },
  chill: {
    k: [0, [5, 0.8]],
    r: [[4, 0.7]],
    sh: [
      [0, 0.5],
      [1, 0.8],
      [2, 0.5],
      [3, 0.8],
      [4, 0.5],
      [5, 0.8],
      [6, 0.5],
      [7, 0.8],
    ],
  },
  chills: {
    k: [0],
    r: [[4, 0.5]],
    sh: [
      [1, 0.7],
      [3, 0.7],
      [5, 0.7],
      [7, 0.7],
    ],
  },
  bossa: {
    k: [0, [3, 0.8], [6, 0.8]],
    r: [
      [2, 0.6],
      [5, 0.6],
      [7, 0.5],
    ],
    sh: [
      [0, 0.5],
      [1, 0.7],
      [2, 0.5],
      [3, 0.7],
      [4, 0.5],
      [5, 0.7],
      [6, 0.5],
      [7, 0.7],
    ],
  },
  bell: {
    k: [0],
    sl: [
      [0, 0.7],
      [2, 0.5],
      [4, 0.7],
      [6, 0.5],
    ],
  },
  bells: {
    sl: [
      [0, 0.5],
      [4, 0.5],
    ],
  },
  heart: { k: [0, [1, 0.55]] },
};

export const BASE = {
  sc: "maj",
  lead: "pulse",
  lv: 0.3,
  den: 1,
  sus: 1.3,
  pad: 0,
  bass: "tri",
  bv: 0.2,
  arp: 0,
  av: 0.12,
  ap: [0, 1, 2, 3, 2, 1, 2, 1],
  dr: null,
  dv: 1,
  sw: 0,
  dl: 0.2,
  rv: 0.25,
  seed: 1,
  key: 60,
  bpm: 100,
  lo: 64,
  hi: 84,
  ao: 12,
  sp: 0,
  lp: 6000,
};

export function iniciar() {
  /* percusión: pasos = corcheas del compás (0..7). k bombo · r toque seco · h charles · sh shaker · sl cascabeles */
}
