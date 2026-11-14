/*
  Modo PC / móvil: aplica la vista elegida (mode) y permite cambiarla (setView).
*/

import { borrar, guardarTexto } from "../../core/store.js";
import { cajaBusqueda } from "../catalogo/buscador.js";
import { total } from "../catalogo/catalogo.js";
import { categorias } from "../catalogo/datos.js";
import { setState } from "../catalogo/ventanas-cat.js";
import { olvidarSuperior, ventanasCategoria, sync } from "./ventanas.js";
import { DSK, root } from "./vista.js";
function mode() {
  root.classList.toggle("dsk", DSK());
  const vw = document.getElementById("vw");
  if (vw) vw.textContent = DSK() ? "Modo móvil" : "Modo PC";
  dispatchEvent(new Event("kixki-mode"));
  document.getElementById("count").textContent = DSK()
    ? `${total} apps en ${categorias.filter((c) => c.a.length).length} carpetas. Abre una desde el escritorio.`
    : `${total} apps en ${categorias.filter((c) => c.a.length).length} carpetas. Toca una para abrirla.`;
}

export function setView(v) {
  v === "auto" ? borrar("kixki-view") : guardarTexto("kixki-view", v);
  document.querySelector("meta[name=viewport]").content =
    v === "pc"
      ? "width=1100, viewport-fit=cover"
      : "width=device-width, initial-scale=1, viewport-fit=cover";
  mode();
  ventanasCategoria.forEach((x) => setState(x, "min"));
  olvidarSuperior();
  sync();
}

export function iniciar() {
  document
    .querySelector("header.hero")
    .insertAdjacentElement("afterend", document.getElementById("desk"));
  cajaBusqueda.addEventListener("input", () => {
    const v = cajaBusqueda.value.trim();
    root.classList.toggle("srch", !!v);
    if (!v && !DSK()) ventanasCategoria.forEach((x) => setState(x, "min"));
  });
  mode();
  addEventListener("resize", mode);
}
