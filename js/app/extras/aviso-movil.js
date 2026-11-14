/*
  Nota de ayuda que sale una sola vez en pantallas táctiles cuando se usa la vista móvil.
*/

import { guardar, leer } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { DSK } from "../escritorio/vista.js";
let notaMovil;

export function iniciar() {
  notaMovil = $("#mnote");
  if (matchMedia("(pointer:coarse)").matches && !DSK() && !leer("kixki-mn", false))
    notaMovil.hidden = false;
  $("#mnx").addEventListener("click", () => {
    notaMovil.hidden = true;
    guardar("kixki-mn", true);
  });
}
