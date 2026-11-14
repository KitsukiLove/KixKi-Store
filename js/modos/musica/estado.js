/*
  Estado del reproductor de música: contexto de audio, pieza actual, compás y temporizador.
*/

export let root, viva;

export const LSK = "kixki-mus";

export const frecuencia = (m) => 440 * Math.pow(2, (m - 69) / 12);

export const rng = (s) => () => {
  s |= 0;
  s = (s + 1831565813) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function iniciar() {
  root = document.documentElement;

  viva = {
    bar: 0,
    next: 0,
    cur: null,
    sw: undefined,
    on: false,
    timer: undefined,
    ac: undefined,
    fg: undefined,
    E: undefined,
    stT: undefined,
  };
}
