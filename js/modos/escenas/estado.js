/*
  Estado de los fondos: lista de fondos (KEYS), memoria «kixki-bgx» y fondo elegido.
*/

import { guardar, leer, leerObjeto } from "../../core/store.js";
export let root, box, X, actual;

export const KEYS = [
  "",
  "valle",
  "primavera",
  "verano",
  "otono",
  "invierno",
  "halloween",
  "navidad",
  "xp",
  "auto",
  "vacas",
];

export const saveX = () => guardar("kixki-bgx", X);

export const okKey = (k) => (k === "vacas" ? !!X.cursed : k === "xp" ? !!X.xp : true);

export const persist = () => guardar("kixki-bg", KEYS[actual.i]);

export function iniciar() {
  root = document.documentElement;
  box = document.getElementById("bgx");

  /* (parte 6) dos fondos especiales que no salen en el ciclo hasta ganarlos: «xp» (premio por vencer a vaca.exe) y «vacas» (castigo si pierdes).
   Memoria propia «kixki-bgx»: xp = premio ganado · cursed = el castigo está puesto · prev = el fondo que tenías antes del castigo */
  X = leerObjeto("kixki-bgx", { xp: 0, cursed: 0, prev: "", pause: 0 });

  actual = { i: 0, lastN: null, XPS: leer("kixki-xps", "auto") || "auto" };
  actual.i = Math.max(0, KEYS.indexOf(leer("kixki-bg", "")));
  if (!okKey(KEYS[actual.i])) actual.i = 0;
}
