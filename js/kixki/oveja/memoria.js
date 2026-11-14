/*
  Memoria de Kixki en localStorage («kixki-k»): modo, visitas, carpetas abiertas y logros.
*/

import { guardar, leerObjeto } from "../../core/store.js";
export let S;

export const save = () => guardar(LSK, S);

/* ---------- memoria ---------- */
const LSK = "kixki-k",
  memoriaInicial = {
    v: 1,
    on: true,
    visits: 0,
    first: 0,
    last: 0,
    opened: [],
    fc: {},
    allDone: 0,
    mode: "normal",
  };

export function iniciar() {
  S = leerObjeto(LSK, memoriaInicial);
}
