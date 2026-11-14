/*
  Teoría musical: notas, escalas y patrones de ritmo.
*/

export const Q = {
  t: [0, 4, 7],
  n: [0, 3, 7],
  M: [0, 4, 7, 11],
  m: [0, 3, 7, 10],
  d: [0, 4, 7, 10],
  M9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],
  s: [0, 5, 7, 10],
  M6: [0, 4, 7, 9],
};

export const ESCALAS = {
  maj: [0, 2, 4, 5, 7, 9, 11],
  pen: [0, 2, 4, 7, 9],
  lyd: [0, 2, 4, 6, 7, 9, 11],
  dor: [0, 2, 3, 5, 7, 9, 10],
  min: [0, 2, 3, 5, 7, 8, 10],
  pmi: [0, 3, 5, 7, 10],
  har: [0, 2, 3, 5, 7, 8, 11],
};

export const RITMOS = [
  [
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  ],
  [
    [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
  ],
  [
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
    [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0],
  ],
];

export function iniciar() {
  /* acordes (semitonos sobre la fundamental) y escalas */
  /* ritmos de la melodía: 16 posiciones (2 compases en corcheas); 3 densidades */
}
