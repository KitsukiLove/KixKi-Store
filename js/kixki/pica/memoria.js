/*
  Memoria propia de la parte 3 en localStorage («kixki-k3»): lanzamientos, plan de toma de control y travesuras.
*/

import { guardar, leerObjeto } from "../../core/store.js";
export let memoria;

export const save = () => guardar(LSK, memoria);

/* ---------- memoria ---------- */
const LSK = "kixki-k3",
  memoriaInicial = { v: 1, pr: true, plan: 0, grabs: 0, drops: 0, closed: 0, bgs: 0, throws: 0 };

export function iniciar() {
  memoria = leerObjeto(LSK, memoriaInicial);
}
