/*
  Progreso de logros guardado en localStorage («kixki-a»): desbloqueados, contadores y nivel.
*/

import { guardar, leer, leerObjeto } from "../../core/store.js";
import { LOGROS } from "./lista.js";
import { NIVELES, LV_TH } from "./textos.js";
export let ST, C;

/* ---------- memoria de los logros ---------- */
const LSK = "kixki-a";

/* dato dañado o de otro tipo: se empieza limpio en vez de romper */
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

export const save = () => guardar(LSK, ST);

export const count = () => LOGROS.reduce((n, x) => n + (ST.u[x.id] ? 1 : 0), 0);

/* logros ocultos (hid): no salen en la lista, ni en el total, hasta que se desbloquean */
export const NV = () => LOGROS.reduce((n, x) => n + (!x.hid || ST.u[x.id] ? 1 : 0), 0);

export const lsNum = (k) => +leer(k, 0) || 0;

export const inc = (k, n = 1) => {
  C[k] = (C[k] | 0) + n;
};

export const mx = (k, v) => {
  if (v > (C[k] | 0)) C[k] = v;
};

export const level = (u) => {
  const f = u / NV();
  let i = 0;
  for (let j = 0; j < LV_TH.length - 1; j++) if (f >= LV_TH[j]) i = j;
  return u >= NV() ? NIVELES.length - 1 : i;
};

export function iniciar() {
  ST = leerObjeto(LSK, {});
  ST.u = isObj(ST.u) ? ST.u : {};
  ST.c = isObj(ST.c) ? ST.c : {};
  ST.seenAt = +ST.seenAt || 0;
  C = ST.c;
}
