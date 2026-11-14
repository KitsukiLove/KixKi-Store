/*
  Utilidades compartidas por los extras: nombres de las ventanas especiales, lista de apps originales (sin copias),
  fecha de alta de cada app y vibración corta.
*/

import { $$ } from "../../core/util.js";
import { catalogoJson } from "../catalogo/datos.js";
/* LS.g solo devuelve el dato si tiene el mismo tipo que el valor por defecto (lista, número, objeto…); si está dañado o es de otra versión, usa el defecto */
export const VENTANAS_ESPECIALES = ["favs", "news", "packs"],
  ventanaPorId = (id) => document.getElementById(id);

export const appsOriginales = () => $$("#app .cat:not(#favs):not(#news):not(#packs) .app"),
  nombreDeApp = (a) => a.querySelector("h3").textContent;

export const vibrar = (n = 8) => {
  try {
    navigator.vibrate && navigator.vibrate(n);
  } catch (e) {
    // No todos los dispositivos vibran; es un extra.
  }
};

/* "added":"2026-10-12" en apps.json → muestra «Nueva» durante 12 días */
export const FECHA_ALTA = {};

export function iniciar() {
  catalogoJson.categories.forEach((c) =>
    c.apps.forEach((a) => {
      if (a.added) FECHA_ALTA[a.name] = a.added;
    })
  );
}
