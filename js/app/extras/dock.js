/*
  Barra inferior (dock) para móvil: Inicio, Buscar, Favoritas, Tema y Más; y el gesto de deslizar hacia abajo para
  cerrar una ventana maximizada.
*/

import { $, $$ } from "../../core/util.js";
import { cajaBusqueda } from "../catalogo/buscador.js";
import { openWin, menuAjustes } from "../escritorio/ventanas.js";
import { DSK } from "../escritorio/vista.js";
import { DOTS, HOME, STAR } from "../arte/sprites-extra.js";
import { spr, iconosUI } from "../arte/sprites.js";
import { closeMax } from "../catalogo/ventanas-cat.js";
import { vibrar } from "./base.js";
let BOTONES_DOCK, inicioToqueY;

/* --- barra inferior (móvil) --- */
export function iniciar() {
  BOTONES_DOCK = [
    ["home", HOME, "Inicio"],
    ["srch", iconosUI.search, "Buscar"],
    ["fav", STAR.map((r) => r.replace(/[hls]/g, "x")), "Favoritas"],
    ["theme", iconosUI.moon, "Tema"],
    ["more", DOTS, "Más"],
  ];
  document.body.insertAdjacentHTML(
    "beforeend",
    `<nav id="dock" aria-label="Menú">${BOTONES_DOCK.map(([k, r, l]) => `<button type="button" data-k="${k}">${spr(r, 3)}<span>${l}</span></button>`).join("")}</nav>`
  );
  $("#dock").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    e.stopPropagation();
    vibrar();
    const k = b.dataset.k;
    if (k === "theme") {
      $("#tg").click();
      return;
    }
    if (k === "more") {
      menuAjustes.hidden = !menuAjustes.hidden;
      return;
    }
    menuAjustes.hidden = true;
    closeMax();
    if (k === "fav") openWin("favs");
    else {
      scrollTo({ top: 0, behavior: "smooth" });
      if (k === "srch") setTimeout(() => cajaBusqueda.focus(), 250);
    }
  });
  inicioToqueY = null;
  document.addEventListener(
    "touchstart",
    (e) => {
      inicioToqueY = !DSK() && e.target.closest(".cat.max .tb") ? e.touches[0].clientY : null;
    },
    { passive: true }
  );
  document.addEventListener(
    "touchend",
    (e) => {
      if (inicioToqueY != null && e.changedTouches[0].clientY - inicioToqueY > 70) {
        closeMax();
        vibrar(6);
      }
      inicioToqueY = null;
    },
    { passive: true }
  );
  $$(".di").forEach((d) => d.addEventListener("click", () => vibrar(6)));
}
