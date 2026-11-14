/*
  Botón de sonido y música (#rd): activa o silencia ambos y dibuja el icono de altavoz según el estado.
*/

import { guardar } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { beep, fijarSonido, sonidoActivo } from "./sonido.js";
let ICN;

export function rdIc() {
  const on = sonidoActivo || KXM.on,
    b = $("#rd");
  b.innerHTML = ICN[on ? 0 : 1];
  b.setAttribute("aria-pressed", on);
}

/* Botón de sonido de la escena: activa o desactiva música y efectos a la vez */
export function iniciar() {
  ICN = [
    [
      "...h......",
      "..hh..h...",
      "hhhh...h..",
      "hhhh.h.h..",
      "hhhh.h.h..",
      "hhhh...h..",
      "..hh..h...",
      "...h......",
    ],
    [
      "...h......",
      "..hh......",
      "hhhh.h..h.",
      "hhhh..hh..",
      "hhhh..hh..",
      "hhhh.h..h.",
      "..hh......",
      "...h......",
    ],
  ].map(
    (r) =>
      `<svg viewBox="0 0 10 8" width="24" height="19" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${r.map((l, y) => [...l].map((c, x) => (c === "h" ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "")).join("")).join("")}</svg>`
  );
  $("#rd").addEventListener("click", () => {
    const v = !(sonidoActivo || KXM.on);
    fijarSonido(v);
    guardar("kixki-snd", v);
    if (KXM.on !== v) KXM.toggle();
    rdIc();
    dispatchEvent(new Event("kixki-snd")); /* el menú de ajustes actualiza su etiqueta */
    if (v) beep(660, 0.1);
  });
  rdIc();
}
